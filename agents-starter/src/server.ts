import { routeAgentRequest, type Schedule } from "agents";

import { getSchedulePrompt } from "agents/schedule";

import { AIChatAgent } from "@cloudflare/ai-chat";
import {
  generateId,
  streamText,
  type StreamTextOnFinishCallback,
  stepCountIs,
  createUIMessageStream,
  convertToModelMessages,
  createUIMessageStreamResponse,
  type ToolSet
} from "ai";
import { createWorkersAI } from "workers-ai-provider";
import { processToolCalls, cleanupMessages } from "./utils";
import { tools, executions } from "./tools";

/**
 * Chat Agent implementation that handles real-time AI chat interactions
 */
export class Chat extends AIChatAgent<Env> {
  /**
   * Handles incoming chat messages and manages the response stream
   */
  async onChatMessage(
    onFinish: StreamTextOnFinishCallback<ToolSet>,
    _options?: { abortSignal?: AbortSignal }
  ) {
    // const mcpConnection = await this.mcp.connect(
    //   "https://path-to-mcp-server/sse"
    // );

    // Collect all tools, including MCP tools if available
    let mcpTools = {};
    try {
      mcpTools = this.mcp.getAITools();
    } catch (error) {
      // MCP not initialized or not available - continue without MCP tools
      console.debug("MCP tools not available:", error);
    }

    const allTools = {
      ...tools,
      ...mcpTools
    };

    const stream = createUIMessageStream({
      execute: async ({ writer }) => {
        // Clean up incomplete tool calls to prevent API errors
        const cleanedMessages = cleanupMessages(this.messages);

        // Process any pending tool calls from previous messages
        // This handles human-in-the-loop confirmations for tools
        const processedMessages = await processToolCalls({
          messages: cleanedMessages,
          dataStream: writer,
          tools: allTools,
          executions
        });

        // Use Cloudflare Workers AI with Llama 3.1 FP8 variant (better function calling support)
        const workersai = createWorkersAI({
          binding: this.env.AI
        });
        const model = workersai("@cf/meta/llama-3.1-8b-instruct-fp8");

        try {
          const result = streamText({
            system: `You are a helpful assistant. When users ask questions, use the available tools to get information, then provide a natural, conversational response based on the tool results.

${getSchedulePrompt({ date: new Date() })}

Remember: Always use tools when needed - don't just describe what you would do. The tools will execute automatically and return results that you should then explain to the user in a friendly way.
`,

            messages: await convertToModelMessages(processedMessages),
            model,
            tools: allTools,
            maxSteps: 5, // Allow multiple tool call rounds
            // Type boundary: streamText expects specific tool types, but base class uses ToolSet
            // This is safe because our tools satisfy ToolSet interface (verified by 'satisfies' in tools.ts)
            onFinish: onFinish as unknown as StreamTextOnFinishCallback<
              typeof allTools
            >,
            stopWhen: stepCountIs(10)
          });

          writer.merge(result.toUIMessageStream());
        } catch (error) {
          console.error("Error in streamText:", error);
          // Write error message to stream
          writer.writeData({
            type: "error",
            error: error instanceof Error ? error.message : String(error)
          });
          throw error;
        }
      }
    });

    return createUIMessageStreamResponse({ stream });
  }
  async executeTask(description: string, _task: Schedule<string>) {
    await this.saveMessages([
      ...this.messages,
      {
        id: generateId(),
        role: "user",
        parts: [
          {
            type: "text",
            text: `Running scheduled task: ${description}`
          }
        ],
        metadata: {
          createdAt: new Date()
        }
      }
    ]);
  }
}

/**
 * Worker entry point that routes incoming requests to the appropriate handler
 */
export default {
  async fetch(request: Request, env: Env, _ctx: ExecutionContext) {
    const url = new URL(request.url);

    // Workers AI is configured via the AI binding in wrangler.jsonc
    // No API key needed - it uses Cloudflare's Workers AI service
    return (
      // Route the request to our agent or return 404 if not found
      (await routeAgentRequest(request, env)) ||
      new Response("Not found", { status: 404 })
    );
  }
} satisfies ExportedHandler<Env>;

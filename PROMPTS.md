# AI Prompts Used

This document contains all the AI prompts used during the development of this project.

## Project Setup & Configuration

### Prompt 1: Connecting Repository to GitHub

```
how do i connect this folder with the github repository on kylevillepo2
```

**Context**: Initial setup to connect local folder to GitHub repository.

**AI Response**: Set up git remote, initialized repository, and configured connection to `https://github.com/kylevillepo2/cf_ai_kylevilleponteau.git`

---

### Prompt 2: Resolving Git Divergent Branches

```
@zsh (71-86)
```

**Context**: User encountered divergent branches error when trying to pull from GitHub.

**AI Response**:

- Identified unrelated histories between local and remote repositories
- Merged branches using `--allow-unrelated-histories` flag
- Resolved merge conflict in README.md (kept markdown heading format)
- Completed merge successfully

---

### Prompt 3: Switching from OpenAI to Cloudflare Workers AI

```
https://developers.cloudflare.com/agents/
```

**Context**: User shared Cloudflare Agents documentation link. Based on assignment requirements and error message about missing OpenAI API key, switched the project to use Cloudflare Workers AI instead.

**AI Response**:

- Replaced OpenAI SDK with `workers-ai-provider`
- Changed model from `gpt-4o-2024-11-20` to `@cf/meta/llama-3.3-70b-instruct`
- Removed OpenAI API key requirements
- Updated `server.ts` to use Workers AI binding
- Removed `HasOpenAIKey` component and related checks from frontend
- Updated environment type definitions to remove `OPENAI_API_KEY`

**Key Changes Made**:

1. **server.ts**:

   - Changed import from `@ai-sdk/openai` to `workers-ai-provider`
   - Updated model initialization to use `createCloudflareWorkersAI` with `this.env.AI` binding
   - Set model to `@cf/meta/llama-3.3-70b-instruct`

2. **app.tsx**:

   - Removed `HasOpenAIKey` component that displayed error message
   - Removed `/check-open-ai-key` endpoint usage

3. **env.d.ts**:
   - Removed `OPENAI_API_KEY` from environment interface

---

## Assignment Requirements Addressed

Based on the assignment requirements, this project includes:

1. **LLM (Large Language Model)**: ✅

   - Using Llama 3.3 on Workers AI (`@cf/meta/llama-3.3-70b-instruct`)

2. **Workflow / Coordination**: ✅

   - Using Durable Objects for stateful coordination
   - Agents SDK for workflow management

3. **User Input**: ✅

   - Chat interface via React frontend
   - Real-time WebSocket communication

4. **Memory or State**: ✅
   - Durable Objects provide persistent state
   - Chat history is maintained
   - Agent state persists across requests

---

## Notes

- All AI assistance was used to help configure and adapt the Cloudflare Agents starter template
- The core architecture and code structure follows the official Cloudflare Agents SDK patterns
- Model selection (Llama 3.3) aligns with assignment recommendations
- No external API keys are required - fully uses Cloudflare's platform services

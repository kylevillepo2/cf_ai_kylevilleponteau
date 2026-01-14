# cf_ai_kylevilleponteau

An AI-powered chat agent application built on Cloudflare's Agents platform, using Llama 3.3 via Workers AI. This project demonstrates a complete AI agent implementation with real-time chat, tool integration, and state management.

## 🚀 Features

- **AI Chat Interface**: Interactive chat powered by Llama 3.3 (70B Instruct) via Cloudflare Workers AI
- **Real-time Streaming**: Live response streaming for immediate user feedback
- **Tool System**: Extensible tool framework with human-in-the-loop confirmation
- **Task Scheduling**: Advanced scheduling capabilities (one-time, delayed, and recurring via cron)
- **State Management**: Persistent chat history and agent state using Durable Objects
- **Modern UI**: Responsive design with dark/light theme support
- **No API Keys Required**: Uses Cloudflare Workers AI - no external API keys needed

## 📋 Prerequisites

- Node.js 18+ and npm
- Cloudflare account (free tier works)
- Wrangler CLI (installed automatically with dependencies)

## 🛠️ Installation & Setup

### 1. Clone the Repository

```bash
git clone https://github.com/kylevillepo2/cf_ai_kylevilleponteau.git
cd cf_ai_kylevilleponteau/agents-starter
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Configure Cloudflare

Make sure you're logged in to Cloudflare:

```bash
npx wrangler login
```

The AI binding is already configured in `wrangler.jsonc` - no additional setup needed!

## 🏃 Running Locally

Start the development server:

```bash
npm run dev
```

The application will be available at `http://localhost:8787` (or the port shown in your terminal).

## 🌐 Deployment

Deploy to Cloudflare Workers:

```bash
npm run deploy
```

After deployment, you'll receive a URL where your agent is live. The agent will automatically use Cloudflare Workers AI with Llama 3.3.

## 📁 Project Structure

```
cf_ai_kylevilleponteau/
├── agents-starter/          # Main application directory
│   ├── src/
│   │   ├── app.tsx         # React chat UI
│   │   ├── server.ts       # Agent implementation (Chat class)
│   │   ├── tools.ts        # Tool definitions
│   │   ├── utils.ts        # Helper functions
│   │   └── styles.css      # UI styling
│   ├── wrangler.jsonc      # Cloudflare Workers configuration
│   ├── package.json        # Dependencies
│   └── README.md           # Detailed technical documentation
└── README.md               # This file
```

## 🎯 Key Components

### AI Model Configuration

The project uses **Cloudflare Workers AI** with **Llama 3.3 70B Instruct** model:

- **Model**: `@cf/meta/llama-3.3-70b-instruct`
- **Provider**: Cloudflare Workers AI (no API keys required)
- **Location**: Configured in `src/server.ts`

### Agent Architecture

- **Durable Objects**: Provides persistent state and WebSocket support
- **Workers AI**: Handles LLM inference
- **Agents SDK**: Manages agent lifecycle and coordination
- **React UI**: Frontend chat interface with real-time updates

### Available Tools

The agent includes several built-in tools:

- **Task Scheduling**: Schedule one-time, delayed, or recurring tasks
- **Human-in-the-Loop**: Tools that require user confirmation before execution
- **Extensible Framework**: Easy to add custom tools

## 🔧 Customization

### Adding New Tools

Edit `src/tools.ts` to add new capabilities:

```typescript
import { tool } from "ai";
import { z } from "zod";

export const myCustomTool = tool({
  description: "Description of what the tool does",
  parameters: z.object({
    param1: z.string(),
    param2: z.number().optional(),
  }),
  execute: async ({ param1, param2 }) => {
    // Tool implementation
    return { result: "success" };
  },
});
```

### Modifying the AI Model

To use a different Workers AI model, edit `src/server.ts`:

```typescript
const model = cloudflare("@cf/meta/llama-3.1-8b-instruct"); // Example: smaller model
```

Available models: https://developers.cloudflare.com/workers-ai/models/

## 📚 Documentation

- [Cloudflare Agents Documentation](https://developers.cloudflare.com/agents/)
- [Workers AI Models](https://developers.cloudflare.com/workers-ai/models/)
- [Agents SDK Reference](https://developers.cloudflare.com/agents/api-reference/)

## 🧪 Testing

Run tests:

```bash
npm test
```


## 🤝 Contributing

This is a submission project for Cloudflare. For questions or issues, please refer to the Cloudflare documentation or create an issue in the repository.

---

**Built with**: Cloudflare Workers, Durable Objects, Workers AI, React, and the Agents SDK

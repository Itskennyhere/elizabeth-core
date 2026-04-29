# Elizabeth

Your personal AI command center.

## Step 1 — base build

Elizabeth can talk. Integrations come in Step 2.

## Pages

| Route | Description |
|---|---|
| `/` | Home |
| `/chat` | Chat with Elizabeth |
| `/status` | System connection status |
| `/settings` | Integration settings |

## Local setup

```bash
npm install
cp .env.example .env.local
# edit .env.local and add your OPENAI_API_KEY
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Environment variables

| Variable | Required | Description |
|---|---|---|
| `OPENAI_API_KEY` | Yes | Your OpenAI API key |
| `OPENAI_MODEL` | No | Model to use (default: `gpt-4.1-mini`) |

## Deployment

Works on Vercel, Railway, or Fly.io. Add environment variables in the platform dashboard.

## What is not built yet

- Telegram integration
- Q Agent connection
- Q Trading connection
- Alpha Bot
- Anthropic / OpenClaw routing
- Settings save/load
- Live status checks
- Action execution

All coming in Step 2+.

# Andrew Radar Brain

Andrew Radar Brain is now a Telegram-first personal AI brain. The main interface is a Telegram bot that Andrew can message from his phone. The long-term knowledge layer is selected YouTube channels across:

- AI Brain
- Dating Brain
- Fitness/Food Brain

The goal is to ask the bot questions and eventually get answers from saved YouTube transcripts, summaries, and searchable knowledge.

## Current Version

- Telegram webhook can receive and reply to text messages when `TELEGRAM_BOT_TOKEN` is configured.
- Telegram webhook parses photo and voice metadata.
- Photo understanding is not active yet.
- Voice transcription is not active yet.
- Brain routing is local/mock and does not use a paid AI API.
- Supabase schema is ready for conversations, YouTube channels, videos, chunks, and queries.
- YouTube RSS scan foundation exists.
- Transcript extraction is not active yet.
- Search is simple text matching before embeddings/vector search.

## Run Locally

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

Quality checks:

```bash
npm run lint
npm run build
```

## Telegram Bot Setup

1. Create a Telegram bot with BotFather.
2. Copy the bot token.
3. Add the token to Vercel environment variables:

```bash
TELEGRAM_BOT_TOKEN=your-telegram-token
```

4. Set the webhook to your deployed Vercel URL:

```bash
https://api.telegram.org/botYOUR_TOKEN/setWebhook?url=https://YOUR_VERCEL_DOMAIN/api/telegram/webhook
```

5. Send the bot a Telegram message.

The webhook route is:

```text
src/app/api/telegram/webhook/route.ts
```

It sends a Telegram reply with `sendMessage`. If `TELEGRAM_BOT_TOKEN` is missing, the route returns a safe error and does not expose secrets.

## YouTube Brain

The YouTube Brain is the knowledge layer for selected channels. It will eventually contain channel metadata, videos, transcripts, summaries, chunks, and search results.

Simple setup flow:

1. Run `PERSONAL_BRAIN_SCHEMA.sql` in Supabase.
2. Add rows to `youtube_channels`.
3. Run `POST /api/youtube/scan`.
4. Add transcripts manually for now.
5. Run `POST /api/youtube/summarize`.
6. Ask from Telegram or search with `POST /api/brain/search`.

The simple page `/youtube-brain` explains this flow in the app.

## Supabase Plan

The Supabase browser client is in:

```text
src/lib/supabase.ts
```

Add public client env vars when ready:

```bash
NEXT_PUBLIC_SUPABASE_URL=your-project-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
```

Do not put a Supabase service role key in the frontend.

Schemas:

- `PERSONAL_BRAIN_SCHEMA.sql`: Telegram conversations and YouTube knowledge tables.
- `SUPABASE_SCHEMA.sql`: older dashboard-ready tables.
- `CAPTURES_SCHEMA.sql`: local/web capture table draft.

RLS is enabled in schema files. Add safe private-user policies before public use.

## Test Endpoints

Health:

```bash
curl https://YOUR_VERCEL_DOMAIN/api/health
```

Telegram webhook locally or with a test payload:

```bash
curl -X POST http://localhost:3000/api/telegram/webhook \
  -H "content-type: application/json" \
  -d '{"message":{"chat":{"id":"123"},"from":{"id":"456"},"text":"Claude Codex workflow for YouTube transcripts"}}'
```

YouTube RSS scan:

```bash
curl -X POST http://localhost:3000/api/youtube/scan
```

Brain search:

```bash
curl -X POST http://localhost:3000/api/brain/search \
  -H "content-type: application/json" \
  -d '{"query":"What should I learn about AI agents?","category":"AI Brain"}'
```

Mock summarization:

```bash
curl -X POST http://localhost:3000/api/youtube/summarize \
  -H "content-type: application/json" \
  -d '{"title":"Example video","notes":"Manual transcript notes","category":"AI Brain"}'
```

## Future Steps

1. Add Gemini Flash API for real responses and summaries.
2. Add real Supabase conversation writes with proper RLS policies.
3. Add YouTube transcript extraction.
4. Add embeddings/vector search.
5. Add daily cron ingestion.
6. Add Telegram daily digest.
7. Add image vision.
8. Add voice transcription.

## Existing App

The existing dashboard pages and `/brain-chat` still exist. They are no longer the main product focus; Telegram is now the primary interface.

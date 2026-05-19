# Andrew Radar Brain

Andrew Radar Brain is a private personal intelligence dashboard for organizing YouTube, message, idea, fitness, food, and workflow signals into three brains:

- AI Brain
- Dating Brain
- Fitness/Food Brain

The app is intentionally local-first right now. It has a polished Next.js dashboard, mock channel/video data, conversational Brain Chat, local browser memory, and Supabase/Telegram-ready structure without paid AI calls, auth, or a large backend.

## How to run locally

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

## How Brain Chat works now

Open `/brain-chat` and paste or type a signal: screenshot context, dating messages, WhatsApp or Bumble/Tinder messages, AI tool ideas, business problems, YouTube links, transcript notes, fitness notes, food notes, gut health notes, workout notes, or supplement notes.

Brain Chat is currently a mock conversational system:

- It detects the best brain with keyword rules.
- It generates a conversational local response.
- It saves the user message and assistant response in browser memory.
- It saves useful captures through `src/lib/captures.ts`.
- It does not call a paid AI API yet.

The shared chat logic lives in `src/lib/brainChat.ts`. The web page uses it directly, and the future API routes use it too.

## LocalStorage chat memory

Chat history is saved in browser `localStorage` under:

```text
andrew-radar-brain-chat
```

Recent captures are saved under:

```text
andrew-radar-brain-captures
```

The `Clear chat` button clears only chat history. It does not delete recent captures.

## Image uploads now

Brain Chat accepts image files from the upload button. It shows the selected filename and a small preview when the browser can read the image.

The uploaded filename is stored with the local chat message. Image understanding is mocked until an AI vision API is connected, so the app does not actually inspect the image contents yet.

## Future Telegram Bot Plan

Telegram is scaffolded but not active.

1. Create a Telegram bot with BotFather.
2. Add `TELEGRAM_BOT_TOKEN` to Vercel environment variables.
3. Use the Vercel deployed URL plus `/api/telegram/webhook` as the webhook endpoint.
4. Later the webhook will save incoming Telegram messages to Supabase captures.
5. Later the webhook will send AI responses back to Telegram.

Current route:

```text
src/app/api/telegram/webhook/route.ts
```

It accepts Telegram-like POST payloads, extracts message text, runs the same local mock brain response, and returns JSON. It does not call Telegram APIs or require a token yet.

## Future Supabase Plan

The Supabase browser client is in `src/lib/supabase.ts` and safely exports `null` when env vars are missing.

Later, add these public client env vars:

```bash
NEXT_PUBLIC_SUPABASE_URL=your-project-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
```

Do not put a Supabase service role key in the frontend.

Schema drafts:

- `SUPABASE_SCHEMA.sql` for channels, videos, insights, and reports.
- `CAPTURES_SCHEMA.sql` for captures.

Captures can later be inserted from web Brain Chat, Telegram webhook, future YouTube transcript ingestion, and future mobile capture tools. Row level security is enabled in the SQL drafts, but safe private-user policies must be added before public use.

## Future AI API Plan

The mock response function is `generateMockChatResponse()` in `src/lib/brainChat.ts`.

Later, replace the mock logic with a server-side AI call from an API route. Keep private AI keys server-side only. The page can keep the same response shape and UI while the backend switches from local rules to real model responses.

The dormant web API route is:

```text
src/app/api/brain-chat/route.ts
```

It already accepts text, selected brain, intent, and optional image filename, then returns a mock brain response as JSON.

## Deploy to Vercel

1. Push the repo to GitHub.
2. Import the repo in Vercel.
3. Use the default Next.js build settings.
4. Add Supabase or Telegram env vars only when those features are ready.
5. Deploy.

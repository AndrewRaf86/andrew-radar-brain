# Andrew Radar Brain

Andrew Radar Brain is a Telegram-first personal AI brain. Telegram is the main interface; the YouTube Brain is the knowledge layer that will store selected YouTube channel videos, transcripts, summaries, and searchable notes across:

- AI Brain
- Dating Brain
- Fitness/Food Brain

## Current Status

- Telegram webhook receives messages and sends replies when `TELEGRAM_BOT_TOKEN` is set.
- Telegram parses text, captions, photo metadata, and voice metadata.
- YouTube RSS ingestion now scans Supabase `youtube_channels` rows and saves new video metadata into `youtube_videos`.
- Search uses simple text matching against saved `youtube_videos`.
- Transcript extraction, AI summaries, embeddings, voice transcription, and image vision are not active yet.

## Correct Supabase Table Names

The app expects these table names exactly:

- `brain_conversations`
- `youtube_channels`
- `youtube_videos`

Do not use `youtubevideos` or `youtubeVideos`.

## Run Locally

```bash
npm install
npm run dev
```

Quality checks:

```bash
npm run lint
npm run build
```

## Telegram Setup

1. Create a Telegram bot with BotFather.
2. Add the bot token to Vercel:

```bash
TELEGRAM_BOT_TOKEN=your-telegram-token
```

3. Set the webhook:

```bash
https://api.telegram.org/botYOUR_TOKEN/setWebhook?url=https://andrew-radar-brain.vercel.app/api/telegram/webhook
```

If the token is missing, the app returns a safe error and never hardcodes secrets.

## Supabase Setup

Run:

```text
PERSONAL_BRAIN_SCHEMA.sql
```

Optional starter rows:

```text
YOUTUBE_CHANNELS_SEED.sql
```

Important: `YOUTUBE_CHANNELS_SEED.sql` uses `null` for `yt_channel_id`. Fill in real YouTube channel IDs manually before RSS ingestion can work.

Required environment variables:

```bash
NEXT_PUBLIC_SUPABASE_URL=your-project-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
```

Do not put a Supabase service role key in the frontend.

## YouTube RSS Ingestion

The app now supports:

```text
Supabase youtube_channels -> YouTube RSS -> Supabase youtube_videos
```

Each active `youtube_channels` row should have either:

- `yt_channel_id`, or
- `rss_url`

The RSS URL format is:

```text
https://www.youtube.com/feeds/videos.xml?channel_id=CHANNEL_ID
```

Scan endpoint:

```text
/api/youtube/scan
```

Test in browser:

```text
https://andrew-radar-brain.vercel.app/api/youtube/scan
```

Test in Terminal:

```bash
curl https://andrew-radar-brain.vercel.app/api/youtube/scan
```

The endpoint returns:

- `ok`
- `channelsScanned`
- `videosFound`
- `videosInserted`
- `skippedDuplicates`
- `errors`

Current limitation: RSS ingestion saves video metadata only. Transcript extraction and AI summaries come next.

## Brain Search Limitation

Telegram works now, but YouTube knowledge only works after:

1. Supabase tables exist.
2. `youtube_channels` has real channel IDs or RSS URLs.
3. `/api/youtube/scan` has saved videos into `youtube_videos`.

If no saved videos exist, Telegram still gives a general answer and says saved video knowledge is not connected yet.

## Useful Test Endpoints

Health:

```bash
curl https://andrew-radar-brain.vercel.app/api/health
```

Brain search:

```bash
curl -X POST https://andrew-radar-brain.vercel.app/api/brain/search \
  -H "content-type: application/json" \
  -d '{"query":"What should I learn about AI agents?","category":"AI Brain"}'
```

Mock summarize:

```bash
curl -X POST https://andrew-radar-brain.vercel.app/api/youtube/summarize \
  -H "content-type: application/json" \
  -d '{"title":"Example video","notes":"Manual notes","category":"AI Brain"}'
```

## Future Steps

1. Add Gemini Flash API for real responses and summaries.
2. Add stronger Supabase write policies.
3. Add YouTube transcript extraction.
4. Add embeddings/vector search.
5. Add daily cron ingestion.
6. Add Telegram daily digest.
7. Add image vision.
8. Add voice transcription.

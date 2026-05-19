# Andrew Radar Brain

Andrew Radar Brain is a private dashboard for organizing YouTube subscription intelligence into three focused brains:

- AI Brain
- Dating Brain
- Fitness/Food Brain

v1 is intentionally simple: a polished Next.js dashboard shell with typed mock data, a Supabase-ready client, and future ingestion/reporting screens. There is no YouTube API, no real transcript ingestion, no auth, and no large backend.

## Run locally

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

Useful checks:

```bash
npm run lint
npm run build
```

## Deploy to Vercel

1. Push the repo to GitHub.
2. Import the repo in Vercel.
3. Use the default Next.js build settings.
4. Deploy.

The app works without Supabase environment variables because it falls back to mock data.

## Mock Brain Chat

Open `/brain-chat` to use the local-first capture system. Paste a YouTube link, screenshot context, dating message, business idea, AI tool idea, fitness note, food note, gut health note, or workout note.

The page currently uses simple local rules instead of a paid AI API:

- AI terms like Claude, Codex, automation, agents, prompts, API, coding, app, dashboard, or business idea classify as AI Brain.
- Dating terms like girl, Bumble, WhatsApp, message, attraction, date, text, kiss, or relationship classify as Dating.
- Fitness and food terms like workout, protein, gut, boxing, recipe, supplement, meal, sleep, recovery, calories, muscle, or fat loss classify as Fitness/Food.
- Anything else is saved as a General Signal.

Each processed signal returns a mock response with detected category, likely meaning, recommended next action, saved note preview, and a priority score from 1 to 5.

## LocalStorage persistence

Brain Chat saves recent captures in browser `localStorage` under `andrew-radar-brain-captures`. This keeps the feature useful locally without Supabase or auth. Clearing browser storage removes the saved captures.

## Add Supabase later

Create a Supabase project and add these environment variables in `.env.local` and Vercel:

```bash
NEXT_PUBLIC_SUPABASE_URL=your-project-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
```

Do not put a Supabase service role key in the frontend. This app only uses the public anon key pattern in `src/lib/supabase.ts`, and exports `null` when the variables are missing.

The future table draft lives in `SUPABASE_SCHEMA.sql`. Row level security is enabled there, but real policies must be added before public use.

Captures have their own future migration in `CAPTURES_SCHEMA.sql`. To connect Brain Chat to Supabase later:

1. Run `CAPTURES_SCHEMA.sql` in Supabase.
2. Add safe private-user row level security policies.
3. Replace `saveCaptureLocal()` with an insert into `captures`.
4. Replace `getCapturesLocal()` with a query from `captures`.

## Connect an AI API later

The mock response logic lives in `src/lib/captures.ts` as `generateMockBrainResponse()`. Later, keep the same page UI and replace that function with a server-side API route that calls the chosen model. Keep private API keys server-side only and return the same response shape to the client.

## What is v1

- Dark responsive dashboard
- Three brain sections
- Tracked channel lists
- Mock radar videos and actions
- Visual ingestion inbox
- Interactive local Brain Chat
- Mock report cards
- Supabase-ready structure

## What comes later

- YouTube URL capture
- Transcript ingestion
- RSS or subscription feed imports
- Supabase persistence
- Real AI response generation
- Search and filtering
- Weekly reports
- Private auth

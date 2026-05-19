import { generateBrainReply, type BrainCategory } from "@/lib/brainRouter";

export type GenerateBrainAnswerInput = {
  message: string;
  category: BrainCategory;
  savedVideoContext?: string;
};

const systemPrompt = `You are Andrew Radar Brain, Andrew's personal AI advisor.
You are practical, direct, and useful.
You do not give generic motivational advice.
You help Andrew think clearly and decide the next action.

Categories:
AI Brain:
- Help with AI tools, agents, automation, coding, n8n, Supabase, Vercel, Codex, Claude, Gemini, OpenAI, YouTube brain, business workflows.
- Always answer with the simplest useful next step.

Dating Brain:
- Help interpret messages, dating situations, Bumble, WhatsApp, Spanish replies, confidence, attraction, boundaries.
- Give clear reply options.
- Avoid needy, overly romantic, or long explanations.

Health/Fitness/Food Brain:
- Help with health, fitness, workouts, gym, nutrition, protein, calories, supplements, gut health, recovery, mobility, cooking, diet, conditioning.
- Boxing belongs here only as training or conditioning.
- Do not diagnose medical issues.
- Tell Andrew to confirm medical issues with a doctor when needed.

General:
- Help organize the thought and decide whether it belongs in one of the brains.

When saved YouTube context exists:
- Use it.
- Mention "From saved video knowledge..." briefly.
- Do not invent sources.

When no saved YouTube context exists:
- Answer generally.
- Say briefly that saved video knowledge is not connected yet only if relevant.

Keep Telegram replies concise and easy to read.`;

export async function generateBrainAnswer({
  message,
  category,
  savedVideoContext,
}: GenerateBrainAnswerInput): Promise<string> {
  if (process.env.GEMINI_API_KEY) {
    try {
      return await generateWithGemini({ message, category, savedVideoContext });
    } catch (error) {
      console.error("Gemini generation failed", error);
    }
  }

  if (process.env.OPENAI_API_KEY) {
    try {
      return await generateWithOpenAI({ message, category, savedVideoContext });
    } catch (error) {
      console.error("OpenAI generation failed", error);
    }
  }

  return generateBrainReply(message, category);
}

async function generateWithGemini({
  message,
  category,
  savedVideoContext,
}: GenerateBrainAnswerInput) {
  const response = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${process.env.GEMINI_API_KEY}`,
    {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({
        contents: [
          {
            role: "user",
            parts: [{ text: buildPrompt({ message, category, savedVideoContext }) }],
          },
        ],
        generationConfig: {
          temperature: 0.4,
          maxOutputTokens: 700,
        },
      }),
    },
  );

  const body = await response.json();
  if (!response.ok) {
    throw new Error(`Gemini failed with ${response.status}: ${JSON.stringify(body)}`);
  }

  const text = body?.candidates?.[0]?.content?.parts?.[0]?.text;
  if (typeof text !== "string" || !text.trim()) {
    throw new Error("Gemini returned no text.");
  }

  return text.trim();
}

async function generateWithOpenAI({
  message,
  category,
  savedVideoContext,
}: GenerateBrainAnswerInput) {
  const response = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      "content-type": "application/json",
      authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
    },
    body: JSON.stringify({
      model: "gpt-4o-mini",
      temperature: 0.4,
      max_tokens: 700,
      messages: [
        { role: "system", content: systemPrompt },
        {
          role: "user",
          content: buildUserPrompt({ message, category, savedVideoContext }),
        },
      ],
    }),
  });

  const body = await response.json();
  if (!response.ok) {
    throw new Error(`OpenAI failed with ${response.status}: ${JSON.stringify(body)}`);
  }

  const text = body?.choices?.[0]?.message?.content;
  if (typeof text !== "string" || !text.trim()) {
    throw new Error("OpenAI returned no text.");
  }

  return text.trim();
}

function buildPrompt(input: GenerateBrainAnswerInput) {
  return `${systemPrompt}\n\n${buildUserPrompt(input)}`;
}

function buildUserPrompt({
  message,
  category,
  savedVideoContext,
}: GenerateBrainAnswerInput) {
  return [
    `Category: ${category}`,
    savedVideoContext
      ? `Saved YouTube context:\n${savedVideoContext}`
      : "Saved YouTube context: none connected for this question.",
    `Andrew's message:\n${message}`,
  ].join("\n\n");
}

"use client";

import { useEffect, useMemo, useState } from "react";
import {
  generateMockBrainResponse,
  getCapturesLocal,
  saveCaptureLocal,
} from "@/lib/captures";
import type {
  BrainResponse,
  Capture,
  CaptureInputCategory,
  CaptureIntent,
} from "@/lib/types";

const categoryOptions: CaptureInputCategory[] = [
  "Auto",
  "AI Brain",
  "Dating",
  "Fitness/Food",
];

const intentOptions: CaptureIntent[] = [
  "Ask the brain",
  "Save idea",
  "Analyze message",
  "Create action plan",
  "Summarize",
];

export default function BrainChatPage() {
  const [input, setInput] = useState("");
  const [category, setCategory] = useState<CaptureInputCategory>("Auto");
  const [intent, setIntent] = useState<CaptureIntent>("Ask the brain");
  const [response, setResponse] = useState<BrainResponse | null>(null);
  const [captures, setCaptures] = useState<Capture[]>([]);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      setCaptures(getCapturesLocal());
    }, 0);

    return () => window.clearTimeout(timer);
  }, []);

  const canSubmit = input.trim().length > 0;
  const placeholder = useMemo(
    () =>
      [
        "Paste a YouTube link, screenshot context, dating message, business idea, AI tool idea, fitness note, food note, gut health note, or workout note.",
        "",
        "Example: Claude workflow idea for turning YouTube transcripts into weekly AI Radar reports.",
      ].join("\n"),
    [],
  );

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const trimmed = input.trim();
    if (!trimmed) return;

    const brainResponse = generateMockBrainResponse({
      input: trimmed,
      intent,
      selectedCategory: category,
    });
    saveCaptureLocal({ input: trimmed, intent, selectedCategory: category });

    setResponse(brainResponse);
    setCaptures(getCapturesLocal());
    setInput("");
  }

  return (
    <div className="space-y-8">
      <section className="max-w-4xl">
        <p className="text-sm font-semibold uppercase tracking-[0.24em] text-emerald-400">
          Interactive capture
        </p>
        <h1 className="mt-3 text-4xl font-bold tracking-tight text-white">
          Brain Chat
        </h1>
        <p className="mt-4 text-lg leading-8 text-zinc-400">
          Paste messages, screenshots, ideas, notes, or links and turn them into categorized intelligence before the real AI layer exists.
        </p>
      </section>

      <section className="grid gap-5 lg:grid-cols-[minmax(0,1.35fr)_minmax(320px,0.65fr)]">
        <form
          onSubmit={handleSubmit}
          className="rounded-lg border border-white/10 bg-white/[0.04] p-4 sm:p-5"
        >
          <label
            htmlFor="brain-input"
            className="text-xs font-semibold uppercase tracking-[0.18em] text-emerald-300"
          >
            Signal input
          </label>
          <textarea
            id="brain-input"
            value={input}
            onChange={(event) => setInput(event.target.value)}
            className="mt-4 min-h-72 w-full resize-y rounded-lg border border-white/10 bg-black/30 p-4 text-sm leading-6 text-zinc-100 outline-none placeholder:text-zinc-600 focus:border-emerald-400/50"
            placeholder={placeholder}
          />

          <div className="mt-4 grid gap-4 md:grid-cols-2">
            <label className="block">
              <span className="text-xs font-semibold uppercase tracking-[0.16em] text-zinc-500">
                Category
              </span>
              <select
                value={category}
                onChange={(event) =>
                  setCategory(event.target.value as CaptureInputCategory)
                }
                className="mt-2 h-11 w-full rounded-md border border-white/10 bg-[#10141d] px-3 text-sm text-zinc-100 outline-none focus:border-emerald-400/50"
              >
                {categoryOptions.map((option) => (
                  <option key={option}>{option}</option>
                ))}
              </select>
            </label>

            <label className="block">
              <span className="text-xs font-semibold uppercase tracking-[0.16em] text-zinc-500">
                Intent
              </span>
              <select
                value={intent}
                onChange={(event) => setIntent(event.target.value as CaptureIntent)}
                className="mt-2 h-11 w-full rounded-md border border-white/10 bg-[#10141d] px-3 text-sm text-zinc-100 outline-none focus:border-emerald-400/50"
              >
                {intentOptions.map((option) => (
                  <option key={option}>{option}</option>
                ))}
              </select>
            </label>
          </div>

          <button
            type="submit"
            disabled={!canSubmit}
            className="mt-5 inline-flex rounded-md bg-white px-5 py-2.5 text-sm font-semibold text-zinc-950 transition hover:bg-emerald-200 disabled:cursor-not-allowed disabled:bg-zinc-700 disabled:text-zinc-400"
          >
            Process Signal
          </button>
        </form>

        <aside className="rounded-lg border border-emerald-400/20 bg-emerald-400/[0.045] p-4 sm:p-5">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-emerald-300">
            Brain response
          </p>
          {response ? (
            <div className="mt-4 space-y-4">
              <ResponseRow label="Detected category" value={response.detectedCategory} />
              <ResponseRow label="What this probably means" value={response.meaning} />
              <ResponseRow label="Recommended next action" value={response.recommendedAction} />
              <ResponseRow label="Saved note preview" value={response.savedNotePreview} />
              <div className="rounded-md bg-black/25 p-3">
                <p className="text-xs font-semibold uppercase tracking-[0.16em] text-zinc-500">
                  Priority score
                </p>
                <div className="mt-2 flex items-center gap-2">
                  {Array.from({ length: 5 }).map((_, index) => (
                    <span
                      key={index}
                      className={`h-2.5 flex-1 rounded-full ${
                        index < response.priority ? "bg-emerald-400" : "bg-white/10"
                      }`}
                    />
                  ))}
                  <span className="text-sm font-semibold text-white">
                    {response.priority}/5
                  </span>
                </div>
              </div>
            </div>
          ) : (
            <div className="mt-4 rounded-md bg-black/20 p-4 text-sm leading-6 text-zinc-400">
              Submit a signal to get a local mock readout. The rules are simple on purpose so this works without a paid AI API.
            </div>
          )}
        </aside>
      </section>

      <section>
        <div className="flex items-center justify-between gap-4">
          <h2 className="text-2xl font-bold text-white">Recent submitted signals</h2>
          <span className="text-sm text-zinc-500">{captures.length} saved locally</span>
        </div>
        <div className="mt-4 grid gap-4 lg:grid-cols-2">
          {captures.length ? (
            captures.map((capture) => (
              <article
                key={capture.id}
                className="rounded-lg border border-white/10 bg-[#10141d] p-4"
              >
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <h3 className="text-base font-semibold text-white">
                      {capture.title}
                    </h3>
                    <p className="mt-1 text-xs text-zinc-500">
                      {new Date(capture.createdAt).toLocaleString()}
                    </p>
                  </div>
                  <span className="rounded-md border border-sky-400/25 bg-sky-400/10 px-2.5 py-1 text-xs font-semibold text-sky-200">
                    {capture.category}
                  </span>
                </div>
                <p className="mt-3 text-sm leading-6 text-zinc-400">
                  {capture.summary}
                </p>
                <div className="mt-4 flex flex-wrap gap-2 text-xs">
                  <span className="rounded-md bg-white/[0.06] px-2 py-1 text-zinc-300">
                    {capture.intent}
                  </span>
                  <span className="rounded-md bg-white/[0.06] px-2 py-1 text-zinc-300">
                    Priority {capture.priority}/5
                  </span>
                  <span className="rounded-md bg-white/[0.06] px-2 py-1 text-zinc-300">
                    {capture.sourceType}
                  </span>
                </div>
              </article>
            ))
          ) : (
            <div className="rounded-lg border border-white/10 bg-white/[0.035] p-5 text-sm text-zinc-400">
              No local captures yet. Your first processed signal will appear here.
            </div>
          )}
        </div>
      </section>
    </div>
  );
}

function ResponseRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-md bg-black/25 p-3">
      <p className="text-xs font-semibold uppercase tracking-[0.16em] text-zinc-500">
        {label}
      </p>
      <p className="mt-2 text-sm leading-6 text-zinc-200">{value}</p>
    </div>
  );
}

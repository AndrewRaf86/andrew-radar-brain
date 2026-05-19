"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import type { ChangeEvent, KeyboardEvent } from "react";
import {
  clearChatLocal,
  generateMockChatResponse,
  getChatLocal,
  saveChatLocal,
} from "@/lib/brainChat";
import { getCapturesLocal, saveCaptureLocal } from "@/lib/captures";
import type { BrainMessage, BrainMode, ChatIntent } from "@/lib/brainChat";
import type { Capture, CaptureInputCategory, CaptureIntent } from "@/lib/types";

const brainOptions: BrainMode[] = [
  "Auto",
  "AI Brain",
  "Dating Brain",
  "Health/Fitness/Food Brain",
];

const intentOptions: ChatIntent[] = [
  "Ask",
  "Analyze",
  "Save",
  "Action Plan",
  "Rewrite Reply",
];

const examplePrompts = [
  "Analyze this Bumble message and give me a confident reply.",
  "Is this AI tool worth using for my Mac workflow?",
  "Turn this YouTube transcript idea into a business workflow.",
  "Help me choose what to eat before boxing.",
  "Summarize this screenshot context and tell me what to do next.",
];

type UploadedImage = {
  name: string;
  previewUrl: string;
};

export default function BrainChatPage() {
  const [messages, setMessages] = useState<BrainMessage[]>([]);
  const [captures, setCaptures] = useState<Capture[]>([]);
  const [input, setInput] = useState("");
  const [selectedBrain, setSelectedBrain] = useState<BrainMode>("Auto");
  const [intent, setIntent] = useState<ChatIntent>("Ask");
  const [uploadedImage, setUploadedImage] = useState<UploadedImage | null>(null);
  const [saveNotice, setSaveNotice] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);
  const threadEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      setMessages(getChatLocal());
      setCaptures(getCapturesLocal());
    }, 0);

    return () => window.clearTimeout(timer);
  }, []);

  useEffect(() => {
    threadEndRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
  }, [messages]);

  const latestAssistant = [...messages]
    .reverse()
    .find((message) => message.role === "assistant");
  const canSend = input.trim().length > 0 || Boolean(uploadedImage);

  const statusText = useMemo(() => {
    if (!latestAssistant) return "Ready for local mock responses.";
    return `${latestAssistant.brainMode} answered with priority ${
      latestAssistant.priority ?? 1
    }/5.`;
  }, [latestAssistant]);

  function handleSend() {
    const trimmed = input.trim();
    if (!trimmed && !uploadedImage) return;

    const content = trimmed || `Image context uploaded: ${uploadedImage?.name}`;
    const response = generateMockChatResponse({
      text: content,
      selectedBrain,
      intent,
      imageName: uploadedImage?.name,
    });
    const createdAt = new Date().toISOString();
    const userMessage: BrainMessage = {
      id: crypto.randomUUID(),
      role: "user",
      content,
      brainMode: selectedBrain,
      intent,
      createdAt,
      imageName: uploadedImage?.name,
      imagePreviewUrl: uploadedImage?.previewUrl,
    };
    const assistantMessage: BrainMessage = {
      id: crypto.randomUUID(),
      role: "assistant",
      content: response.response,
      brainMode: response.brainUsed,
      intent,
      createdAt: new Date().toISOString(),
      priority: response.priority,
    };
    const nextMessages = [...messages, userMessage, assistantMessage];

    setMessages(nextMessages);
    saveChatLocal(nextMessages);
    saveCaptureLocal({
      input: imageCaptureText(content, uploadedImage?.name),
      intent: toCaptureIntent(intent),
      selectedCategory: toCaptureCategory(response.brainUsed),
    });
    setCaptures(getCapturesLocal());
    setInput("");
    setUploadedImage(null);
    setSaveNotice("");
  }

  function handleKeyDown(event: KeyboardEvent<HTMLTextAreaElement>) {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      handleSend();
    }
  }

  function handleImageChange(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      setUploadedImage({
        name: file.name,
        previewUrl: typeof reader.result === "string" ? reader.result : "",
      });
    };
    reader.readAsDataURL(file);
  }

  function handleClearChat() {
    clearChatLocal();
    setMessages([]);
    setSaveNotice("Chat cleared. Recent captures were kept.");
  }

  function handleSaveInsight() {
    if (!latestAssistant) return;

    saveCaptureLocal({
      input: latestAssistant.content,
      intent: "Save idea",
      selectedCategory: toCaptureCategory(latestAssistant.brainMode),
    });
    setCaptures(getCapturesLocal());
    setSaveNotice("Latest response saved as a local insight.");
  }

  return (
    <div className="space-y-6">
      <section className="flex flex-col justify-between gap-4 lg:flex-row lg:items-end">
        <div className="max-w-4xl">
          <p className="text-sm font-semibold uppercase tracking-[0.24em] text-emerald-400">
            Conversational command center
          </p>
          <h1 className="mt-3 text-4xl font-bold tracking-tight text-white">
            Brain Chat
          </h1>
          <p className="mt-4 text-lg leading-8 text-zinc-400">
            Talk to AI Brain, Dating Brain, and Health/Fitness/Food Brain with local mock intelligence until the real AI layer is connected.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={handleClearChat}
            className="rounded-md border border-white/10 bg-white/[0.04] px-3 py-2 text-sm font-medium text-zinc-300 transition hover:bg-white/[0.08]"
          >
            Clear chat
          </button>
          <button
            type="button"
            onClick={handleSaveInsight}
            disabled={!latestAssistant}
            className="rounded-md bg-white px-3 py-2 text-sm font-semibold text-zinc-950 transition hover:bg-emerald-200 disabled:cursor-not-allowed disabled:bg-zinc-700 disabled:text-zinc-400"
          >
            Save this as insight
          </button>
        </div>
      </section>

      {saveNotice ? (
        <div className="rounded-md border border-emerald-400/25 bg-emerald-400/10 px-4 py-3 text-sm text-emerald-200">
          {saveNotice}
        </div>
      ) : null}

      <section className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_340px]">
        <div className="flex min-h-[680px] flex-col overflow-hidden rounded-lg border border-white/10 bg-white/[0.035]">
          <div className="flex-1 space-y-4 overflow-y-auto p-4 sm:p-5">
            {messages.length ? (
              messages.map((message) => (
                <ChatBubble key={message.id} message={message} />
              ))
            ) : (
              <EmptyState
                onSelectPrompt={(prompt) => {
                  setInput(prompt);
                  setSaveNotice("");
                }}
              />
            )}
            <div ref={threadEndRef} />
          </div>

          <div className="sticky bottom-0 border-t border-white/10 bg-[#090c12]/95 p-4 backdrop-blur">
            <div className="mb-3 flex flex-wrap items-center gap-3">
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="rounded-md border border-white/10 bg-white/[0.04] px-3 py-2 text-sm font-medium text-zinc-300 transition hover:bg-white/[0.08]"
              >
                Upload image
              </button>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="hidden"
              />
              <p className="text-xs text-zinc-500">
                Image understanding is mocked until an AI vision API is connected.
              </p>
            </div>

            {uploadedImage ? (
              <div className="mb-3 flex items-center gap-3 rounded-md border border-white/10 bg-black/25 p-3">
                {uploadedImage.previewUrl ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={uploadedImage.previewUrl}
                    alt=""
                    className="h-12 w-12 rounded-md object-cover"
                  />
                ) : null}
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm text-zinc-200">
                    {uploadedImage.name}
                  </p>
                  <p className="text-xs text-zinc-500">Filename will be saved with the message.</p>
                </div>
                <button
                  type="button"
                  onClick={() => setUploadedImage(null)}
                  className="rounded-md px-2 py-1 text-xs text-zinc-400 hover:bg-white/10 hover:text-white"
                >
                  Remove
                </button>
              </div>
            ) : null}

            <div className="flex flex-col gap-3 sm:flex-row">
              <textarea
                value={input}
                onChange={(event) => setInput(event.target.value)}
                onKeyDown={handleKeyDown}
                className="max-h-44 min-h-24 flex-1 resize-y rounded-lg border border-white/10 bg-black/35 p-4 text-sm leading-6 text-zinc-100 outline-none placeholder:text-zinc-600 focus:border-emerald-400/50"
                placeholder="Paste a message, screenshot context, AI tool idea, YouTube transcript note, food note, or workout question..."
              />
              <button
                type="button"
                onClick={handleSend}
                disabled={!canSend}
                className="rounded-md bg-white px-4 py-3 text-sm font-semibold text-zinc-950 transition hover:bg-emerald-200 disabled:cursor-not-allowed disabled:bg-zinc-700 disabled:text-zinc-400 sm:self-end"
              >
                Send to Brain
              </button>
            </div>
          </div>
        </div>

        <aside className="space-y-4">
          <ControlPanel
            selectedBrain={selectedBrain}
            intent={intent}
            onBrainChange={setSelectedBrain}
            onIntentChange={setIntent}
          />
          <StatusCard statusText={statusText} messageCount={messages.length} />
          <RecentSignals captures={captures} />
        </aside>
      </section>
    </div>
  );
}

function ChatBubble({ message }: { message: BrainMessage }) {
  const isUser = message.role === "user";

  return (
    <article className={`flex ${isUser ? "justify-end" : "justify-start"}`}>
      <div
        className={`max-w-[92%] rounded-lg border p-4 shadow-2xl shadow-black/10 sm:max-w-[78%] ${
          isUser
            ? "border-emerald-400/20 bg-emerald-400/10"
            : "border-white/10 bg-[#10141d]"
        }`}
      >
        <div className="flex flex-wrap items-center gap-2 text-xs text-zinc-500">
          <span className="font-semibold uppercase tracking-[0.16em] text-zinc-400">
            {isUser ? "Andrew" : message.brainMode}
          </span>
          <span>{message.intent}</span>
          <span>{new Date(message.createdAt).toLocaleTimeString()}</span>
          {message.priority ? <span>Priority {message.priority}/5</span> : null}
        </div>
        {message.imagePreviewUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={message.imagePreviewUrl}
            alt=""
            className="mt-3 max-h-56 rounded-md border border-white/10 object-contain"
          />
        ) : null}
        {message.imageName ? (
          <p className="mt-3 text-xs text-zinc-500">Attached: {message.imageName}</p>
        ) : null}
        <div className="mt-3 whitespace-pre-line text-sm leading-6 text-zinc-100">
          {message.content}
        </div>
      </div>
    </article>
  );
}

function EmptyState({
  onSelectPrompt,
}: {
  onSelectPrompt: (prompt: string) => void;
}) {
  return (
    <div className="flex min-h-[430px] flex-col justify-center rounded-lg border border-dashed border-white/10 bg-black/15 p-5">
      <p className="text-sm font-semibold uppercase tracking-[0.18em] text-emerald-300">
        Start with a signal
      </p>
      <h2 className="mt-3 text-2xl font-bold text-white">
        Paste anything you want the brains to read.
      </h2>
      <p className="mt-3 max-w-2xl text-sm leading-6 text-zinc-400">
        This is local mock intelligence for now, but it behaves like the future chat loop: classify the signal, answer conversationally, and save the useful part.
      </p>
      <div className="mt-6 grid gap-2">
        {examplePrompts.map((prompt) => (
          <button
            key={prompt}
            type="button"
            onClick={() => onSelectPrompt(prompt)}
            className="rounded-md border border-white/10 bg-white/[0.04] px-4 py-3 text-left text-sm text-zinc-300 transition hover:border-emerald-400/35 hover:bg-emerald-400/10 hover:text-white"
          >
            {prompt}
          </button>
        ))}
      </div>
    </div>
  );
}

function ControlPanel({
  selectedBrain,
  intent,
  onBrainChange,
  onIntentChange,
}: {
  selectedBrain: BrainMode;
  intent: ChatIntent;
  onBrainChange: (brain: BrainMode) => void;
  onIntentChange: (intent: ChatIntent) => void;
}) {
  return (
    <section className="rounded-lg border border-white/10 bg-white/[0.04] p-4">
      <h2 className="text-lg font-bold text-white">Controls</h2>
      <label className="mt-4 block">
        <span className="text-xs font-semibold uppercase tracking-[0.16em] text-zinc-500">
          Brain selector
        </span>
        <select
          value={selectedBrain}
          onChange={(event) => onBrainChange(event.target.value as BrainMode)}
          className="mt-2 h-11 w-full rounded-md border border-white/10 bg-[#10141d] px-3 text-sm text-zinc-100 outline-none focus:border-emerald-400/50"
        >
          {brainOptions.map((option) => (
            <option key={option}>{option}</option>
          ))}
        </select>
      </label>

      <label className="mt-4 block">
        <span className="text-xs font-semibold uppercase tracking-[0.16em] text-zinc-500">
          Intent selector
        </span>
        <select
          value={intent}
          onChange={(event) => onIntentChange(event.target.value as ChatIntent)}
          className="mt-2 h-11 w-full rounded-md border border-white/10 bg-[#10141d] px-3 text-sm text-zinc-100 outline-none focus:border-emerald-400/50"
        >
          {intentOptions.map((option) => (
            <option key={option}>{option}</option>
          ))}
        </select>
      </label>
    </section>
  );
}

function StatusCard({
  statusText,
  messageCount,
}: {
  statusText: string;
  messageCount: number;
}) {
  return (
    <section className="rounded-lg border border-emerald-400/20 bg-emerald-400/[0.045] p-4">
      <p className="text-xs font-semibold uppercase tracking-[0.18em] text-emerald-300">
        System status
      </p>
      <p className="mt-3 text-sm leading-6 text-zinc-300">{statusText}</p>
      <div className="mt-4 grid grid-cols-2 gap-3 text-sm">
        <div className="rounded-md bg-black/25 p-3">
          <p className="text-zinc-500">Mode</p>
          <p className="mt-1 font-semibold text-white">Local mock</p>
        </div>
        <div className="rounded-md bg-black/25 p-3">
          <p className="text-zinc-500">Messages</p>
          <p className="mt-1 font-semibold text-white">{messageCount}</p>
        </div>
      </div>
      <p className="mt-3 text-xs leading-5 text-zinc-500">
        Telegram, Supabase writes, and paid AI calls are scaffolded for later, not active.
      </p>
    </section>
  );
}

function RecentSignals({ captures }: { captures: Capture[] }) {
  return (
    <section className="rounded-lg border border-white/10 bg-white/[0.04] p-4">
      <div className="flex items-center justify-between gap-3">
        <h2 className="text-lg font-bold text-white">Recent saved signals</h2>
        <span className="text-xs text-zinc-500">{captures.length}</span>
      </div>
      <div className="mt-4 space-y-3">
        {captures.slice(0, 6).map((capture) => (
          <article key={capture.id} className="rounded-md bg-black/20 p-3">
            <div className="flex items-start justify-between gap-2">
              <p className="line-clamp-2 text-sm font-medium text-zinc-100">
                {capture.title}
              </p>
              <span className="shrink-0 rounded bg-white/[0.07] px-2 py-0.5 text-[11px] text-zinc-400">
                {capture.priority}/5
              </span>
            </div>
            <p className="mt-2 text-xs text-zinc-500">
              {capture.category} · {capture.intent}
            </p>
            <p className="mt-2 line-clamp-2 text-xs leading-5 text-zinc-400">
              {capture.summary}
            </p>
          </article>
        ))}
        {!captures.length ? (
          <p className="rounded-md bg-black/20 p-3 text-sm leading-6 text-zinc-500">
            Saved captures will appear here after your first message.
          </p>
        ) : null}
      </div>
    </section>
  );
}

function toCaptureIntent(intent: ChatIntent): CaptureIntent {
  if (intent === "Save") return "Save idea";
  if (intent === "Analyze" || intent === "Rewrite Reply") return "Analyze message";
  if (intent === "Action Plan") return "Create action plan";
  return "Ask the brain";
}

function toCaptureCategory(brainMode: BrainMode): CaptureInputCategory {
  if (brainMode === "AI Brain") return "AI Brain";
  if (brainMode === "Dating Brain") return "Dating Brain";
  if (brainMode === "Health/Fitness/Food Brain") return "Health/Fitness/Food Brain";
  return "Auto";
}

function imageCaptureText(content: string, imageName?: string) {
  if (!imageName) return content;
  return `${content}\n\nUploaded image filename: ${imageName}`;
}

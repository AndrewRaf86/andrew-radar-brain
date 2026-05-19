import { NextResponse } from "next/server";
import {
  detectBrainCategory,
  generateBrainReply,
  type BrainCategory,
} from "@/lib/brainRouter";
import { searchBrainKnowledge } from "@/lib/brainSearch";
import {
  saveConversationMock,
  saveConversationSupabaseReady,
} from "@/lib/brainStorage";
import { sendTelegramMessage, type TelegramMessage, type TelegramUpdate } from "@/lib/telegram";

type InputType = "text" | "photo" | "voice" | "unknown";

export async function POST(request: Request) {
  const update = await readTelegramUpdate(request);
  const message = update?.message ?? update?.edited_message;
  const chatId = message?.chat?.id;

  if (!message || !chatId) {
    return NextResponse.json({
      ok: false,
      sent: false,
      error: "No Telegram message or chat id found.",
    });
  }

  const inputType = detectInputType(message);
  const text = extractMessageText(message);
  const fileMeta = extractFileMeta(message, inputType);
  const routeInput = text || `${inputType} received`;
  const brainUsed = detectBrainCategory(routeInput);
  const reply = await buildTelegramReply({
    inputType,
    text,
    brainUsed,
  });

  const conversation = {
    telegram_user_id: message.from?.id ? String(message.from.id) : null,
    chat_id: String(chatId),
    input_type: inputType,
    category: brainUsed,
    message: text || null,
    response: reply,
    file_id: fileMeta.fileId,
    file_type: fileMeta.fileType,
  };

  saveConversationMock(conversation);
  await saveConversationSupabaseReady(conversation);

  try {
    await sendTelegramMessage(chatId, reply);
    return NextResponse.json({
      ok: true,
      sent: true,
      brainUsed,
      inputType,
    });
  } catch (error) {
    return NextResponse.json({
      ok: false,
      sent: false,
      brainUsed,
      inputType,
      error: error instanceof Error ? error.message : "Telegram send failed.",
    });
  }
}

async function buildTelegramReply({
  inputType,
  text,
  brainUsed,
}: {
  inputType: InputType;
  text: string;
  brainUsed: BrainCategory;
}) {
  if (inputType === "voice") {
    return [
      "Voice received.",
      "Voice transcription is not active yet, so I cannot read the audio content.",
      "Next step: voice transcription will be added later and saved into the brain.",
    ].join("\n");
  }

  if (inputType === "photo") {
    const base = [
      "Photo received.",
      "Image understanding is not active yet, so I cannot inspect the picture itself.",
    ];

    if (text) {
      const search = await safeSearchBrainKnowledge(text, brainUsed);
      return [
        ...base,
        "I can still use your caption:",
        search.answer,
      ].join("\n");
    }

    return [
      ...base,
      "Add a caption with what you want me to analyze, and I will route it to the right brain.",
    ].join("\n");
  }

  if (inputType === "text" && text) {
    const search = await safeSearchBrainKnowledge(text, brainUsed);
    return search.answer;
  }

  return generateBrainReply(text || "Unknown Telegram input", brainUsed);
}

async function safeSearchBrainKnowledge(query: string, category: BrainCategory) {
  try {
    const search = await searchBrainKnowledge({ query, category });
    if (search.searchFailed) {
      return {
        ...search,
        answer: [
          generateBrainReply(query, category),
          "I can answer generally right now, but I do not have saved video knowledge connected yet.",
        ].join("\n\n"),
      };
    }
    return search;
  } catch (error) {
    console.error("Telegram brain search failed", error);
    return {
      answer: [
        generateBrainReply(query, category),
        "I can answer generally right now, but I do not have saved video knowledge connected yet.",
      ].join("\n\n"),
      matchedVideos: [],
      category,
      hasSupabase: false,
      searchFailed: true,
    };
  }
}

async function readTelegramUpdate(request: Request): Promise<TelegramUpdate | null> {
  try {
    const body = await request.json();
    return isRecord(body) ? (body as TelegramUpdate) : null;
  } catch {
    return null;
  }
}

function detectInputType(message: TelegramMessage): InputType {
  if (message.text || message.caption) return message.photo ? "photo" : "text";
  if (message.photo?.length) return "photo";
  if (message.voice) return "voice";
  return "unknown";
}

function extractMessageText(message: TelegramMessage) {
  return (message.text ?? message.caption ?? "").trim();
}

function extractFileMeta(message: TelegramMessage, inputType: InputType) {
  if (inputType === "photo" && message.photo?.length) {
    const photo = [...message.photo].sort(
      (a, b) => (b.file_size ?? 0) - (a.file_size ?? 0),
    )[0];
    return { fileId: photo?.file_id ?? null, fileType: "photo" };
  }

  if (inputType === "voice" && message.voice) {
    return { fileId: message.voice.file_id, fileType: "voice" };
  }

  return { fileId: null, fileType: null };
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return Boolean(value) && typeof value === "object" && !Array.isArray(value);
}

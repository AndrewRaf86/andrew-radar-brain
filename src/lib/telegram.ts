export type TelegramPhotoSize = {
  file_id: string;
  file_unique_id?: string;
  width?: number;
  height?: number;
  file_size?: number;
};

export type TelegramVoice = {
  file_id: string;
  file_unique_id?: string;
  duration?: number;
  mime_type?: string;
  file_size?: number;
};

export type TelegramMessage = {
  message_id?: number;
  text?: string;
  caption?: string;
  chat?: {
    id?: string | number;
    type?: string;
    username?: string;
    first_name?: string;
  };
  from?: {
    id?: string | number;
    is_bot?: boolean;
    username?: string;
    first_name?: string;
  };
  photo?: TelegramPhotoSize[];
  voice?: TelegramVoice;
};

export type TelegramUpdate = {
  update_id?: number;
  message?: TelegramMessage;
  edited_message?: TelegramMessage;
};

function getTelegramToken() {
  const token = process.env.TELEGRAM_BOT_TOKEN;
  if (!token) {
    throw new Error("TELEGRAM_BOT_TOKEN is not configured.");
  }
  return token;
}

export async function sendTelegramMessage(
  chatId: string | number,
  text: string,
): Promise<unknown> {
  const token = getTelegramToken();
  const response = await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({
      chat_id: chatId,
      text: sanitizeTelegramMarkdown(text),
      parse_mode: "Markdown",
    }),
  });

  const body = await response.json().catch(() => null);
  if (!response.ok) {
    throw new Error(
      `Telegram sendMessage failed with ${response.status}: ${JSON.stringify(body)}`,
    );
  }

  return body;
}

export async function getTelegramFileInfo(fileId: string): Promise<unknown> {
  const token = getTelegramToken();
  const response = await fetch(`https://api.telegram.org/bot${token}/getFile`, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ file_id: fileId }),
  });

  const body = await response.json().catch(() => null);
  if (!response.ok) {
    throw new Error(
      `Telegram getFile failed with ${response.status}: ${JSON.stringify(body)}`,
    );
  }

  return body;
}

export function downloadTelegramFileUrl(filePath: string): string {
  const token = getTelegramToken();
  return `https://api.telegram.org/file/bot${token}/${filePath}`;
}

function sanitizeTelegramMarkdown(text: string) {
  return text.replace(/[_*`\[]/g, "");
}

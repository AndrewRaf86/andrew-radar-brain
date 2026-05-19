import { createClient, type SupabaseClient } from "@supabase/supabase-js";

let cachedClient: SupabaseClient | null = null;

export function getSupabaseServerClient(): SupabaseClient {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !serviceRoleKey) {
    throw new Error(
      "Server Supabase env vars are missing. Set NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY.",
    );
  }

  if (!cachedClient) {
    cachedClient = createClient(supabaseUrl, serviceRoleKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    });
  }

  return cachedClient;
}

export function getSupabaseServerDiagnostics() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;

  return {
    hasSupabaseUrl: Boolean(supabaseUrl),
    hasAnonKey: Boolean(process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY),
    hasServiceRoleKey: Boolean(process.env.SUPABASE_SERVICE_ROLE_KEY),
    supabaseHost: getSupabaseHost(supabaseUrl),
  };
}

export function sanitizeSupabaseError(error: unknown) {
  if (!error || typeof error !== "object") {
    return {
      errorMessage: error instanceof Error ? error.message : null,
      errorCode: null,
      errorDetails: null,
      errorHint: null,
    };
  }

  const record = error as Record<string, unknown>;
  return {
    errorMessage: stringifyOrNull(record.message),
    errorCode: stringifyOrNull(record.code),
    errorDetails: stringifyOrNull(record.details),
    errorHint: stringifyOrNull(record.hint),
  };
}

function getSupabaseHost(url: string | undefined) {
  if (!url) return null;

  try {
    return new URL(url).host;
  } catch {
    return "invalid-url";
  }
}

function stringifyOrNull(value: unknown) {
  if (typeof value === "string") return value;
  if (value === null || value === undefined) return null;
  return String(value);
}

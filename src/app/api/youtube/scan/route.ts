import { NextResponse } from "next/server";
import { scanAllActiveChannels } from "@/lib/youtubeRss";
import {
  getSupabaseServerClient,
  getSupabaseServerDiagnostics,
} from "@/lib/supabaseServer";

export async function GET() {
  return runScan();
}

export async function POST() {
  return runScan();
}

async function runScan() {
  const diagnostics = getSupabaseServerDiagnostics();

  if (!diagnostics.hasSupabaseUrl || !diagnostics.hasServiceRoleKey) {
    return NextResponse.json({
      ok: false,
      ...diagnostics,
      channelsQueryCount: 0,
      channelsScanned: 0,
      channelsResolved: 0,
      videosFound: 0,
      videosInserted: 0,
      skippedDuplicates: 0,
      skippedChannels: 0,
      errors: [
        "Missing server Supabase env vars. Set NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY.",
      ],
    });
  }

  const supabase = getSupabaseServerClient();
  const result = await scanAllActiveChannels({
    supabase,
    ...diagnostics,
  });
  return NextResponse.json(result);
}

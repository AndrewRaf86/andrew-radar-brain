import { NextResponse } from "next/server";
import {
  getSupabaseServerClient,
  getSupabaseServerDiagnostics,
  sanitizeSupabaseError,
} from "@/lib/supabaseServer";

export async function GET() {
  const diagnostics = getSupabaseServerDiagnostics();

  if (!diagnostics.hasSupabaseUrl || !diagnostics.hasServiceRoleKey) {
    return NextResponse.json({
      ok: false,
      ...diagnostics,
      tableCount: null,
      sampleRows: [],
      errorMessage:
        "Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY.",
      errorCode: null,
      errorDetails: null,
      errorHint: null,
    });
  }

  try {
    const supabase = getSupabaseServerClient();
    const countResult = await supabase
      .from("youtube_channels")
      .select("*", { count: "exact", head: true });

    if (countResult.error) {
      return NextResponse.json({
        ok: false,
        ...diagnostics,
        tableCount: null,
        sampleRows: [],
        ...sanitizeSupabaseError(countResult.error),
      });
    }

    const sampleResult = await supabase
      .from("youtube_channels")
      .select("id,name,url,category,is_active")
      .limit(3);

    if (sampleResult.error) {
      return NextResponse.json({
        ok: false,
        ...diagnostics,
        tableCount: countResult.count ?? null,
        sampleRows: [],
        ...sanitizeSupabaseError(sampleResult.error),
      });
    }

    return NextResponse.json({
      ok: true,
      ...diagnostics,
      tableCount: countResult.count ?? 0,
      sampleRows: sampleResult.data ?? [],
      errorMessage: null,
      errorCode: null,
      errorDetails: null,
      errorHint: null,
    });
  } catch (error) {
    console.error("Supabase debug route failed", error);
    return NextResponse.json({
      ok: false,
      ...diagnostics,
      tableCount: null,
      sampleRows: [],
      ...sanitizeSupabaseError(error),
    });
  }
}

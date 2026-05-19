import { NextResponse } from "next/server";
import { scanAllActiveChannels } from "@/lib/youtubeRss";

export async function GET() {
  return runScan();
}

export async function POST() {
  return runScan();
}

async function runScan() {
  const result = await scanAllActiveChannels();
  return NextResponse.json(result);
}

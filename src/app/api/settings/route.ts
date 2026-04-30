import { NextRequest, NextResponse } from "next/server";
import { getSettings, saveSettings, maskSettings, applyPartialUpdate } from "@/lib/settings";

export async function GET() {
  const settings = getSettings();
  // Always return masked — no real API keys ever leave the server
  return NextResponse.json(maskSettings(settings));
}

export async function POST(req: NextRequest) {
  let body: Record<string, unknown>;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON." }, { status: 400 });
  }

  const current = getSettings();
  const updated = applyPartialUpdate(current, body);
  const saved = saveSettings(updated);

  return NextResponse.json(maskSettings(saved));
}

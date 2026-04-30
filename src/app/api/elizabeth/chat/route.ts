import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";
import Anthropic from "@anthropic-ai/sdk";
import { getSettings } from "@/lib/settings";
import { ELIZABETH_SYSTEM_PROMPT } from "@/lib/elizabethPrompt";

type Message = { role: string; content: string };

export async function POST(req: NextRequest) {
  let body: { messages?: Message[] };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
  }

  const messages = body.messages ?? [];
  if (!messages.length) {
    return NextResponse.json({ error: "No messages provided." }, { status: 400 });
  }

  const settings = getSettings();

  // Resolve active provider: use the explicit selection, fall back to first
  // enabled provider that has a key configured.
  const provider = resolveProvider(settings);

  if (!provider) {
    return NextResponse.json({
      reply: "No AI provider is enabled. Go to Settings and enable OpenAI or Anthropic.",
    });
  }

  if (provider === "openclaw") {
    return NextResponse.json({
      reply: "OpenClaw integration is not implemented yet. Switch to OpenAI or Anthropic in Settings.",
    });
  }

  if (provider === "openai") {
    return runOpenAI(settings.openai.apiKey, settings.openai.model, messages);
  }

  if (provider === "anthropic") {
    return runAnthropic(settings.anthropic.apiKey, settings.anthropic.model, messages);
  }

  return NextResponse.json({ reply: "Unknown provider." });
}

// ─── Provider resolution ──────────────────────────────────────────────────────

function resolveProvider(settings: ReturnType<typeof getSettings>) {
  const { provider, openai, anthropic, openclaw } = settings;

  // Try the explicitly selected provider first
  if (provider === "openai" && openai.enabled && openai.apiKey) return "openai";
  if (provider === "anthropic" && anthropic.enabled && anthropic.apiKey) return "anthropic";
  if (provider === "openclaw" && openclaw.enabled) return "openclaw";

  // Fall back to first configured provider
  if (openai.enabled && openai.apiKey) return "openai";
  if (anthropic.enabled && anthropic.apiKey) return "anthropic";
  if (openclaw.enabled) return "openclaw";

  return null;
}

// ─── OpenAI ───────────────────────────────────────────────────────────────────

async function runOpenAI(apiKey: string, model: string, messages: Message[]) {
  if (!apiKey) {
    return NextResponse.json({
      reply: "OpenAI is enabled but no API key is saved. Add one in Settings.",
    });
  }

  const client = new OpenAI({ apiKey });
  const completion = await client.chat.completions.create({
    model: model || "gpt-4.1-mini",
    messages: [
      { role: "system", content: ELIZABETH_SYSTEM_PROMPT },
      ...(messages as OpenAI.ChatCompletionMessageParam[]),
    ],
    max_tokens: 1024,
  });

  const reply = completion.choices[0]?.message?.content ?? "No response.";
  return NextResponse.json({ reply, provider: "openai", model });
}

// ─── Anthropic ────────────────────────────────────────────────────────────────

async function runAnthropic(apiKey: string, model: string, messages: Message[]) {
  if (!apiKey) {
    return NextResponse.json({
      reply: "Anthropic is enabled but no API key is saved. Add one in Settings.",
    });
  }

  const client = new Anthropic({ apiKey });
  const response = await client.messages.create({
    model: model || "claude-sonnet-4-6",
    max_tokens: 1024,
    system: ELIZABETH_SYSTEM_PROMPT,
    messages: messages.map((m) => ({
      role: m.role as "user" | "assistant",
      content: m.content,
    })),
  });

  const block = response.content[0];
  const reply = block?.type === "text" ? block.text : "No response.";
  return NextResponse.json({ reply, provider: "anthropic", model });
}

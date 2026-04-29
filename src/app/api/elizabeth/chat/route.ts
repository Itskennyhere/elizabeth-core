import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";
import { ELIZABETH_SYSTEM_PROMPT } from "@/lib/elizabethPrompt";

export async function POST(req: NextRequest) {
  const apiKey = process.env.OPENAI_API_KEY;

  if (!apiKey) {
    return NextResponse.json(
      { reply: "OPENAI_API_KEY is missing. Add it to .env.local first." },
      { status: 200 }
    );
  }

  let body: { messages?: { role: string; content: string }[] };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
  }

  const userMessages = body.messages ?? [];
  if (!userMessages.length) {
    return NextResponse.json({ error: "No messages provided." }, { status: 400 });
  }

  const model = process.env.OPENAI_MODEL ?? "gpt-4.1-mini";

  const client = new OpenAI({ apiKey });

  const completion = await client.chat.completions.create({
    model,
    messages: [
      { role: "system", content: ELIZABETH_SYSTEM_PROMPT },
      ...userMessages as OpenAI.ChatCompletionMessageParam[],
    ],
    max_tokens: 1024,
  });

  const reply = completion.choices[0]?.message?.content ?? "No response.";
  return NextResponse.json({ reply });
}

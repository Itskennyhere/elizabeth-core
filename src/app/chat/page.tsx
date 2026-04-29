"use client";

import { useState, useRef, useEffect } from "react";
import Nav from "@/components/Nav";

type Message = {
  role: "user" | "assistant";
  content: string;
};

export default function ChatPage() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  async function send() {
    const text = input.trim();
    if (!text || loading) return;

    setInput("");
    setError(null);
    const next: Message[] = [...messages, { role: "user", content: text }];
    setMessages(next);
    setLoading(true);

    try {
      const res = await fetch("/api/elizabeth/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: next }),
      });

      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.error ?? `Server error ${res.status}`);
      }

      const data = await res.json();
      setMessages([...next, { role: "assistant", content: data.reply }]);
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Something went wrong.");
    } finally {
      setLoading(false);
    }
  }

  function handleKey(e: React.KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      send();
    }
  }

  function clearChat() {
    setMessages([]);
    setError(null);
  }

  return (
    <>
      <Nav />
      <div style={{ display: "flex", flexDirection: "column", height: "calc(100vh - 57px)" }}>
        {/* Header */}
        <div style={{
          padding: "16px 32px",
          borderBottom: "1px solid var(--border)",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}>
          <div>
            <span style={{ fontWeight: 600 }}>Elizabeth</span>
            <span style={{ color: "var(--muted)", fontSize: 13, marginLeft: 10 }}>
              {messages.length === 0 ? "Ready" : `${messages.length} messages`}
            </span>
          </div>
          {messages.length > 0 && (
            <button
              onClick={clearChat}
              style={{
                background: "none",
                border: "1px solid var(--border)",
                borderRadius: "var(--radius)",
                color: "var(--muted)",
                padding: "4px 12px",
                fontSize: 13,
              }}
            >
              Clear
            </button>
          )}
        </div>

        {/* Messages */}
        <div style={{ flex: 1, overflowY: "auto", padding: "24px 32px", display: "flex", flexDirection: "column", gap: 16 }}>
          {messages.length === 0 && !loading && (
            <div style={{ color: "var(--muted)", fontSize: 14, textAlign: "center", marginTop: 60 }}>
              Say something to Elizabeth.
            </div>
          )}

          {messages.map((m, i) => (
            <Bubble key={i} message={m} />
          ))}

          {loading && (
            <div style={{ alignSelf: "flex-start", color: "var(--muted)", fontSize: 14 }}>
              Elizabeth is thinking…
            </div>
          )}

          {error && (
            <div style={{
              background: "#1f0e0e",
              border: "1px solid var(--danger)",
              borderRadius: "var(--radius)",
              padding: "12px 16px",
              color: "var(--danger)",
              fontSize: 14,
            }}>
              {error}
            </div>
          )}

          <div ref={bottomRef} />
        </div>

        {/* Input */}
        <div style={{
          padding: "16px 32px",
          borderTop: "1px solid var(--border)",
          display: "flex",
          gap: 12,
          background: "var(--surface)",
        }}>
          <textarea
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={handleKey}
            placeholder="Message Elizabeth… (Enter to send, Shift+Enter for newline)"
            disabled={loading}
            rows={1}
            style={{
              flex: 1,
              background: "var(--bg)",
              border: "1px solid var(--border)",
              borderRadius: "var(--radius)",
              color: "var(--text)",
              padding: "10px 14px",
              resize: "none",
              fontSize: 14,
              lineHeight: 1.5,
              outline: "none",
              fontFamily: "inherit",
            }}
          />
          <button
            onClick={send}
            disabled={loading || !input.trim()}
            style={{
              background: loading || !input.trim() ? "var(--accent-dim)" : "var(--accent)",
              color: loading || !input.trim() ? "var(--muted)" : "#0d0d0d",
              border: "none",
              borderRadius: "var(--radius)",
              padding: "10px 20px",
              fontWeight: 600,
              fontSize: 14,
              transition: "background 0.15s",
            }}
          >
            Send
          </button>
        </div>
      </div>
    </>
  );
}

function Bubble({ message }: { message: Message }) {
  const isUser = message.role === "user";
  return (
    <div style={{
      alignSelf: isUser ? "flex-end" : "flex-start",
      maxWidth: "72%",
    }}>
      <div style={{
        background: isUser ? "var(--accent-dim)" : "var(--surface)",
        border: `1px solid ${isUser ? "var(--accent)" : "var(--border)"}`,
        borderRadius: "var(--radius)",
        padding: "12px 16px",
        fontSize: 14,
        lineHeight: 1.6,
        whiteSpace: "pre-wrap",
        wordBreak: "break-word",
      }}>
        {message.content}
      </div>
      <div style={{ fontSize: 11, color: "var(--muted)", marginTop: 4, textAlign: isUser ? "right" : "left" }}>
        {isUser ? "You" : "Elizabeth"}
      </div>
    </div>
  );
}

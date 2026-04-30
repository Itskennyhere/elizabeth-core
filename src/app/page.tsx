"use client";

import Link from "next/link";
import Nav from "@/components/Nav";

export default function Home() {
  return (
    <>
      <Nav />
      <main style={{ maxWidth: 640, margin: "0 auto", padding: "64px 24px" }}>
        <div style={{ marginBottom: 8, color: "var(--muted)", fontSize: 13, letterSpacing: "0.1em", textTransform: "uppercase" }}>
          Command Center
        </div>
        <h1 style={{ fontSize: 42, fontWeight: 700, letterSpacing: "-0.02em", color: "var(--accent)", marginBottom: 12 }}>
          Elizabeth
        </h1>
        <p style={{ fontSize: 18, color: "var(--muted)", marginBottom: 48 }}>
          Your personal AI command center
        </p>

        <div style={{ display: "grid", gap: 16 }}>
          <NavCard
            href="/chat"
            title="Chat"
            description="Talk to Elizabeth. Ask questions, plan next steps, review your projects."
          />
          <NavCard
            href="/status"
            title="Status"
            description="See what's connected and what's not."
          />
          <NavCard
            href="/settings"
            title="Settings"
            description="Configure integrations — OpenAI, Anthropic, Telegram, Q Agent, and more."
          />
        </div>

        <p style={{ marginTop: 64, fontSize: 13, color: "var(--border)" }}>
          Step 1 — base build. Integrations coming in Step 2.
        </p>
      </main>
    </>
  );
}

function NavCard({ href, title, description }: { href: string; title: string; description: string }) {
  return (
    <Link href={href} style={{ display: "block", textDecoration: "none" }}>
      <div style={{
        background: "var(--surface)",
        border: "1px solid var(--border)",
        borderRadius: "var(--radius)",
        padding: "20px 24px",
        transition: "border-color 0.15s",
      }}
        onMouseEnter={e => (e.currentTarget.style.borderColor = "var(--accent)")}
        onMouseLeave={e => (e.currentTarget.style.borderColor = "var(--border)")}
      >
        <div style={{ fontWeight: 600, marginBottom: 4 }}>{title}</div>
        <div style={{ fontSize: 14, color: "var(--muted)" }}>{description}</div>
      </div>
    </Link>
  );
}

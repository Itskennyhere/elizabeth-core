"use client";

import { useState } from "react";
import Nav from "@/components/Nav";

const placeholders = [
  { name: "OpenAI", description: "GPT-4.1 and other OpenAI models" },
  { name: "Anthropic", description: "Claude models" },
  { name: "OpenClaw", description: "Custom model routing" },
  { name: "Telegram", description: "Telegram bot integration" },
  { name: "Q Agent", description: "Connect to Q Agent API" },
  { name: "Q Trading", description: "Connect to Q Trading API" },
];

export default function SettingsPage() {
  return (
    <>
      <Nav />
      <main style={{ maxWidth: 640, margin: "0 auto", padding: "48px 24px" }}>
        <h1 style={{ fontSize: 24, fontWeight: 700, marginBottom: 8 }}>Settings</h1>
        <p style={{ color: "var(--muted)", fontSize: 14, marginBottom: 40 }}>
          Integrations and configuration. Set your keys in{" "}
          <code style={{ background: "var(--surface)", padding: "1px 6px", borderRadius: 4, fontSize: 13 }}>
            .env.local
          </code>{" "}
          for now.
        </p>

        {/* Notion — active placeholder with real inputs */}
        <NotionCard />

        <div style={{ marginTop: 12, display: "flex", flexDirection: "column", gap: 12 }}>
          {placeholders.map(({ name, description }) => (
            <div
              key={name}
              style={{
                background: "var(--surface)",
                border: "1px solid var(--border)",
                borderRadius: "var(--radius)",
                padding: "20px 24px",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <div>
                <div style={{ fontWeight: 600, marginBottom: 2 }}>{name}</div>
                <div style={{ fontSize: 13, color: "var(--muted)" }}>{description}</div>
              </div>
              <div style={{
                fontSize: 12,
                color: "var(--muted)",
                background: "var(--bg)",
                border: "1px solid var(--border)",
                borderRadius: "var(--radius)",
                padding: "4px 10px",
              }}>
                Coming in Step 2
              </div>
            </div>
          ))}
        </div>
      </main>
    </>
  );
}

function NotionCard() {
  const [apiKey, setApiKey] = useState("");
  const [databaseId, setDatabaseId] = useState("");
  const [enabled, setEnabled] = useState(false);
  const [saved, setSaved] = useState(false);

  function handleSave() {
    // Step 2: persist to backend / env — for now just show confirmation
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  }

  return (
    <div style={{
      background: "var(--surface)",
      border: "1px solid var(--border)",
      borderRadius: "var(--radius)",
      padding: "24px",
      marginBottom: 0,
    }}>
      {/* Header row */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 20 }}>
        <div>
          <div style={{ fontWeight: 600, marginBottom: 3 }}>Notion</div>
          <div style={{ fontSize: 13, color: "var(--muted)" }}>
            Elizabeth's memory layer — notes, decisions, trading ideas, preferences
          </div>
        </div>
        <Toggle enabled={enabled} onChange={setEnabled} />
      </div>

      {/* Fields */}
      <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
        <Field
          label="API Key"
          value={apiKey}
          onChange={setApiKey}
          placeholder="secret_..."
          type="password"
          disabled={!enabled}
        />
        <Field
          label="Database ID"
          value={databaseId}
          onChange={setDatabaseId}
          placeholder="xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"
          disabled={!enabled}
        />
      </div>

      {/* Footer */}
      <div style={{ marginTop: 20, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <div style={{ fontSize: 12, color: "var(--muted)" }}>
          Full integration coming in Step 2
        </div>
        <button
          onClick={handleSave}
          disabled={!enabled}
          style={{
            background: enabled ? "var(--accent)" : "var(--bg)",
            color: enabled ? "#0d0d0d" : "var(--muted)",
            border: `1px solid ${enabled ? "var(--accent)" : "var(--border)"}`,
            borderRadius: "var(--radius)",
            padding: "7px 18px",
            fontWeight: 600,
            fontSize: 13,
            cursor: enabled ? "pointer" : "not-allowed",
          }}
        >
          {saved ? "Saved" : "Save"}
        </button>
      </div>
    </div>
  );
}

function Toggle({ enabled, onChange }: { enabled: boolean; onChange: (v: boolean) => void }) {
  return (
    <button
      onClick={() => onChange(!enabled)}
      title={enabled ? "Disable" : "Enable"}
      style={{
        width: 44,
        height: 24,
        borderRadius: 12,
        border: "none",
        background: enabled ? "var(--accent)" : "var(--border)",
        position: "relative",
        cursor: "pointer",
        flexShrink: 0,
        transition: "background 0.15s",
      }}
    >
      <span style={{
        position: "absolute",
        top: 3,
        left: enabled ? 23 : 3,
        width: 18,
        height: 18,
        borderRadius: "50%",
        background: enabled ? "#0d0d0d" : "var(--muted)",
        transition: "left 0.15s",
        display: "block",
      }} />
    </button>
  );
}

function Field({
  label, value, onChange, placeholder, type = "text", disabled,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  type?: string;
  disabled: boolean;
}) {
  return (
    <div>
      <label style={{ fontSize: 12, color: "var(--muted)", display: "block", marginBottom: 6 }}>
        {label}
      </label>
      <input
        type={type}
        value={value}
        onChange={e => onChange(e.target.value)}
        placeholder={placeholder}
        disabled={disabled}
        style={{
          width: "100%",
          background: disabled ? "var(--bg)" : "var(--surface)",
          border: "1px solid var(--border)",
          borderRadius: "var(--radius)",
          color: disabled ? "var(--muted)" : "var(--text)",
          padding: "9px 12px",
          fontSize: 13,
          fontFamily: "monospace",
          outline: "none",
          opacity: disabled ? 0.5 : 1,
        }}
      />
    </div>
  );
}

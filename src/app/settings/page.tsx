"use client";

import { useEffect, useState, useCallback } from "react";
import Nav from "@/components/Nav";

// ─── Types (mirroring lib/settings MaskedSettings shape) ─────────────────────

type MaskedSettings = {
  provider: string;
  openai: { enabled: boolean; apiKey: string; model: string };
  anthropic: { enabled: boolean; apiKey: string; model: string };
  openclaw: { enabled: boolean; apiKey: string; baseUrl: string };
  notion: { enabled: boolean; apiKey: string; databaseId: string };
  telegram: { enabled: boolean; botToken: string; chatId: string };
  qagent: { enabled: boolean; baseUrl: string };
  qtrading: { enabled: boolean; baseUrl: string };
};

const SENTINEL = "__SET__";

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function SettingsPage() {
  const [settings, setSettings] = useState<MaskedSettings | null>(null);
  const [loadError, setLoadError] = useState<string | null>(null);

  const load = useCallback(async () => {
    try {
      const res = await fetch("/api/settings");
      if (!res.ok) throw new Error("Failed to load settings.");
      setSettings(await res.json());
    } catch (e) {
      setLoadError(e instanceof Error ? e.message : "Load failed.");
    }
  }, []);

  useEffect(() => { load(); }, [load]);

  async function save(section: Record<string, unknown>) {
    const res = await fetch("/api/settings", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(section),
    });
    if (!res.ok) throw new Error("Save failed.");
    const updated: MaskedSettings = await res.json();
    setSettings(updated);
    return updated;
  }

  if (loadError) {
    return (
      <>
        <Nav />
        <main style={{ maxWidth: 640, margin: "0 auto", padding: "48px 24px" }}>
          <p style={{ color: "var(--danger)" }}>{loadError}</p>
        </main>
      </>
    );
  }

  if (!settings) {
    return (
      <>
        <Nav />
        <main style={{ maxWidth: 640, margin: "0 auto", padding: "48px 24px" }}>
          <p style={{ color: "var(--muted)" }}>Loading settings…</p>
        </main>
      </>
    );
  }

  return (
    <>
      <Nav />
      <main style={{ maxWidth: 640, margin: "0 auto", padding: "48px 24px" }}>
        <h1 style={{ fontSize: 24, fontWeight: 700, marginBottom: 8 }}>Settings</h1>
        <p style={{ color: "var(--muted)", fontSize: 14, marginBottom: 32 }}>
          Changes persist to <code style={{ background: "var(--surface)", padding: "1px 6px", borderRadius: 4, fontSize: 13 }}>data/settings.json</code> on the server.
        </p>

        {/* Active provider selector */}
        <ProviderSelector
          current={settings.provider}
          onSave={(p) => save({ provider: p })}
        />

        <div style={{ display: "flex", flexDirection: "column", gap: 16, marginTop: 16 }}>

          <Section
            title="OpenAI"
            description="GPT-4.1 and other OpenAI models"
            enabled={settings.openai.enabled}
            onSave={(fields) => save({ openai: fields })}
            fields={[
              { key: "enabled", label: "Enabled", type: "toggle", value: settings.openai.enabled },
              { key: "apiKey",  label: "API Key",  type: "secret", value: settings.openai.apiKey,  placeholder: "sk-..." },
              { key: "model",   label: "Model",    type: "text",   value: settings.openai.model,   placeholder: "gpt-4.1-mini" },
            ]}
          />

          <Section
            title="Anthropic"
            description="Claude models (Opus, Sonnet, Haiku)"
            enabled={settings.anthropic.enabled}
            onSave={(fields) => save({ anthropic: fields })}
            fields={[
              { key: "enabled", label: "Enabled", type: "toggle", value: settings.anthropic.enabled },
              { key: "apiKey",  label: "API Key",  type: "secret", value: settings.anthropic.apiKey,  placeholder: "sk-ant-..." },
              { key: "model",   label: "Model",    type: "text",   value: settings.anthropic.model,   placeholder: "claude-sonnet-4-6" },
            ]}
          />

          <Section
            title="OpenClaw"
            description="Custom model routing (Step 3)"
            enabled={settings.openclaw.enabled}
            onSave={(fields) => save({ openclaw: fields })}
            fields={[
              { key: "enabled", label: "Enabled", type: "toggle",  value: settings.openclaw.enabled },
              { key: "apiKey",  label: "API Key",  type: "secret",  value: settings.openclaw.apiKey,  placeholder: "key..." },
              { key: "baseUrl", label: "Base URL", type: "text",    value: settings.openclaw.baseUrl, placeholder: "https://..." },
            ]}
          />

          <Section
            title="Notion"
            description="Memory layer — notes, decisions, trading ideas"
            enabled={settings.notion.enabled}
            onSave={(fields) => save({ notion: fields })}
            fields={[
              { key: "enabled",    label: "Enabled",     type: "toggle", value: settings.notion.enabled },
              { key: "apiKey",     label: "API Key",     type: "secret", value: settings.notion.apiKey,     placeholder: "secret_..." },
              { key: "databaseId", label: "Database ID", type: "secret", value: settings.notion.databaseId, placeholder: "32-char ID" },
            ]}
          />

          <Section
            title="Telegram"
            description="Bot integration for remote commands"
            enabled={settings.telegram.enabled}
            onSave={(fields) => save({ telegram: fields })}
            fields={[
              { key: "enabled",   label: "Enabled",  type: "toggle", value: settings.telegram.enabled },
              { key: "botToken",  label: "Bot Token", type: "secret", value: settings.telegram.botToken, placeholder: "1234567890:ABC..." },
              { key: "chatId",    label: "Chat ID",   type: "text",   value: settings.telegram.chatId,   placeholder: "your numeric chat ID" },
            ]}
          />

          <Section
            title="Q Agent"
            description="Connect to Q Agent API"
            enabled={settings.qagent.enabled}
            onSave={(fields) => save({ qagent: fields })}
            fields={[
              { key: "enabled", label: "Enabled",  type: "toggle", value: settings.qagent.enabled },
              { key: "baseUrl", label: "Base URL", type: "text",   value: settings.qagent.baseUrl,  placeholder: "http://localhost:8000" },
            ]}
          />

          <Section
            title="Q Trading"
            description="Connect to Q Trading API"
            enabled={settings.qtrading.enabled}
            onSave={(fields) => save({ qtrading: fields })}
            fields={[
              { key: "enabled", label: "Enabled",  type: "toggle", value: settings.qtrading.enabled },
              { key: "baseUrl", label: "Base URL", type: "text",   value: settings.qtrading.baseUrl,  placeholder: "http://localhost:8001" },
            ]}
          />

        </div>
      </main>
    </>
  );
}

// ─── Provider selector ────────────────────────────────────────────────────────

function ProviderSelector({
  current,
  onSave,
}: {
  current: string;
  onSave: (p: string) => Promise<unknown>;
}) {
  const [value, setValue] = useState(current);
  const [status, setStatus] = useState<"idle" | "saving" | "saved">("idle");

  useEffect(() => { setValue(current); }, [current]);

  async function handleSave() {
    setStatus("saving");
    try {
      await onSave(value);
      setStatus("saved");
      setTimeout(() => setStatus("idle"), 2000);
    } catch {
      setStatus("idle");
    }
  }

  return (
    <div style={{
      background: "var(--surface)",
      border: "1px solid var(--accent)",
      borderRadius: "var(--radius)",
      padding: "18px 24px",
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      gap: 16,
      marginBottom: 4,
    }}>
      <div>
        <div style={{ fontWeight: 600, marginBottom: 2 }}>Active Provider</div>
        <div style={{ fontSize: 13, color: "var(--muted)" }}>Which AI Elizabeth talks through</div>
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
        <select
          value={value}
          onChange={e => setValue(e.target.value)}
          style={{
            background: "var(--bg)",
            border: "1px solid var(--border)",
            borderRadius: "var(--radius)",
            color: "var(--text)",
            padding: "7px 12px",
            fontSize: 13,
          }}
        >
          <option value="openai">OpenAI</option>
          <option value="anthropic">Anthropic</option>
          <option value="openclaw">OpenClaw</option>
        </select>
        <SaveButton status={status} onClick={handleSave} />
      </div>
    </div>
  );
}

// ─── Section ──────────────────────────────────────────────────────────────────

type FieldDef = {
  key: string;
  label: string;
  type: "toggle" | "text" | "secret";
  value: string | boolean;
  placeholder?: string;
};

function Section({
  title,
  description,
  enabled,
  fields,
  onSave,
}: {
  title: string;
  description: string;
  enabled: boolean;
  fields: FieldDef[];
  onSave: (values: Record<string, unknown>) => Promise<unknown>;
}) {
  const initialValues = Object.fromEntries(fields.map((f) => [f.key, f.value]));
  const [values, setValues] = useState<Record<string, unknown>>(initialValues);
  const [status, setStatus] = useState<"idle" | "saving" | "saved" | "error">("idle");

  // Sync when parent settings reload
  useEffect(() => {
    setValues(Object.fromEntries(fields.map((f) => [f.key, f.value])));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fields.map((f) => String(f.value)).join(",")]);

  function set(key: string, val: unknown) {
    setValues((prev) => ({ ...prev, [key]: val }));
  }

  async function handleSave() {
    setStatus("saving");
    try {
      await onSave(values);
      setStatus("saved");
      setTimeout(() => setStatus("idle"), 2000);
    } catch {
      setStatus("error");
      setTimeout(() => setStatus("idle"), 3000);
    }
  }

  const isEnabled = Boolean(values.enabled);

  return (
    <div style={{
      background: "var(--surface)",
      border: `1px solid ${isEnabled ? "var(--border)" : "var(--border)"}`,
      borderRadius: "var(--radius)",
      padding: "22px 24px",
      opacity: 1,
    }}>
      {/* Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 18 }}>
        <div>
          <div style={{ fontWeight: 600, marginBottom: 3 }}>{title}</div>
          <div style={{ fontSize: 13, color: "var(--muted)" }}>{description}</div>
        </div>
        <Toggle
          enabled={isEnabled}
          onChange={(v) => set("enabled", v)}
        />
      </div>

      {/* Fields (non-toggle) */}
      <div style={{ display: "flex", flexDirection: "column", gap: 13 }}>
        {fields
          .filter((f) => f.type !== "toggle")
          .map((f) => (
            f.type === "secret" ? (
              <SecretField
                key={f.key}
                label={f.label}
                value={values[f.key] as string}
                placeholder={f.placeholder}
                disabled={!isEnabled}
                onChange={(v) => set(f.key, v)}
              />
            ) : (
              <TextField
                key={f.key}
                label={f.label}
                value={values[f.key] as string}
                placeholder={f.placeholder}
                disabled={!isEnabled}
                onChange={(v) => set(f.key, v)}
              />
            )
          ))}
      </div>

      {/* Footer */}
      <div style={{ marginTop: 18, display: "flex", justifyContent: "flex-end" }}>
        <SaveButton status={status} onClick={handleSave} />
      </div>
    </div>
  );
}

// ─── Field components ─────────────────────────────────────────────────────────

function SecretField({
  label, value, placeholder, disabled, onChange,
}: {
  label: string; value: string; placeholder?: string; disabled: boolean;
  onChange: (v: string) => void;
}) {
  const isSet = value === SENTINEL;
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState("");

  function startEdit() {
    setDraft("");
    setEditing(true);
  }

  function cancelEdit() {
    setEditing(false);
    onChange(SENTINEL); // revert to sentinel — no change
  }

  function commitEdit() {
    onChange(draft || SENTINEL);
    setEditing(false);
  }

  if (!editing && isSet) {
    return (
      <div>
        <label style={{ fontSize: 12, color: "var(--muted)", display: "block", marginBottom: 6 }}>{label}</label>
        <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
          <div style={{
            flex: 1,
            background: "var(--bg)",
            border: "1px solid var(--border)",
            borderRadius: "var(--radius)",
            padding: "9px 12px",
            fontSize: 13,
            color: "var(--muted)",
            fontFamily: "monospace",
            opacity: disabled ? 0.5 : 1,
          }}>
            •••••••••••••• (saved)
          </div>
          {!disabled && (
            <button onClick={startEdit} style={smallBtn}>Change</button>
          )}
        </div>
      </div>
    );
  }

  if (editing) {
    return (
      <div>
        <label style={{ fontSize: 12, color: "var(--muted)", display: "block", marginBottom: 6 }}>{label}</label>
        <div style={{ display: "flex", gap: 8 }}>
          <input
            type="password"
            autoFocus
            value={draft}
            onChange={e => setDraft(e.target.value)}
            placeholder={placeholder}
            style={{ ...inputStyle, flex: 1 }}
          />
          <button onClick={commitEdit} style={{ ...smallBtn, color: "var(--accent)", borderColor: "var(--accent)" }}>Set</button>
          <button onClick={cancelEdit} style={smallBtn}>Cancel</button>
        </div>
      </div>
    );
  }

  // Not set yet — plain input
  return (
    <div>
      <label style={{ fontSize: 12, color: "var(--muted)", display: "block", marginBottom: 6 }}>{label}</label>
      <input
        type="password"
        value={value}
        onChange={e => onChange(e.target.value)}
        placeholder={placeholder}
        disabled={disabled}
        style={{ ...inputStyle, width: "100%", opacity: disabled ? 0.5 : 1 }}
      />
    </div>
  );
}

function TextField({
  label, value, placeholder, disabled, onChange,
}: {
  label: string; value: string; placeholder?: string; disabled: boolean;
  onChange: (v: string) => void;
}) {
  return (
    <div>
      <label style={{ fontSize: 12, color: "var(--muted)", display: "block", marginBottom: 6 }}>{label}</label>
      <input
        type="text"
        value={value}
        onChange={e => onChange(e.target.value)}
        placeholder={placeholder}
        disabled={disabled}
        style={{ ...inputStyle, width: "100%", opacity: disabled ? 0.5 : 1 }}
      />
    </div>
  );
}

function Toggle({ enabled, onChange }: { enabled: boolean; onChange: (v: boolean) => void }) {
  return (
    <button
      onClick={() => onChange(!enabled)}
      title={enabled ? "Disable" : "Enable"}
      style={{
        width: 44, height: 24, borderRadius: 12, border: "none",
        background: enabled ? "var(--accent)" : "var(--border)",
        position: "relative", cursor: "pointer", flexShrink: 0,
        transition: "background 0.15s",
      }}
    >
      <span style={{
        position: "absolute", top: 3,
        left: enabled ? 23 : 3,
        width: 18, height: 18, borderRadius: "50%",
        background: enabled ? "#0d0d0d" : "var(--muted)",
        transition: "left 0.15s", display: "block",
      }} />
    </button>
  );
}

function SaveButton({
  status,
  onClick,
}: {
  status: "idle" | "saving" | "saved" | "error";
  onClick: () => void;
}) {
  const label = status === "saving" ? "Saving…" : status === "saved" ? "Saved ✓" : status === "error" ? "Error" : "Save";
  const bg = status === "saved" ? "var(--accent-dim)" : status === "error" ? "#1f0e0e" : "var(--accent)";
  const color = status === "saved" ? "var(--accent)" : status === "error" ? "var(--danger)" : "#0d0d0d";

  return (
    <button
      onClick={onClick}
      disabled={status === "saving"}
      style={{
        background: bg, color, border: "none",
        borderRadius: "var(--radius)", padding: "7px 18px",
        fontWeight: 600, fontSize: 13, cursor: status === "saving" ? "not-allowed" : "pointer",
        transition: "background 0.15s",
      }}
    >
      {label}
    </button>
  );
}

// ─── Style constants ──────────────────────────────────────────────────────────

const inputStyle: React.CSSProperties = {
  background: "var(--bg)",
  border: "1px solid var(--border)",
  borderRadius: "var(--radius)",
  color: "var(--text)",
  padding: "9px 12px",
  fontSize: 13,
  fontFamily: "monospace",
  outline: "none",
};

const smallBtn: React.CSSProperties = {
  background: "none",
  border: "1px solid var(--border)",
  borderRadius: "var(--radius)",
  color: "var(--muted)",
  padding: "7px 12px",
  fontSize: 12,
  cursor: "pointer",
  whiteSpace: "nowrap",
};

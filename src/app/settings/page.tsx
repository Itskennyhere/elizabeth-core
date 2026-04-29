import Nav from "@/components/Nav";

const integrations = [
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
          Integrations and configuration. Set your keys in <code style={{ background: "var(--surface)", padding: "1px 6px", borderRadius: 4, fontSize: 13 }}>.env.local</code> for now.
        </p>

        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          {integrations.map(({ name, description }) => (
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

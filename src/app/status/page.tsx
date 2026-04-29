import Nav from "@/components/Nav";

type StatusCard = {
  name: string;
  status: "connected" | "not connected";
  note?: string;
};

const services: StatusCard[] = [
  { name: "Elizabeth Core", status: "connected", note: "Base app running" },
  { name: "Telegram", status: "not connected", note: "Step 2" },
  { name: "Q Agent", status: "not connected", note: "Step 2" },
  { name: "Q Trading", status: "not connected", note: "Step 2" },
];

export default function StatusPage() {
  return (
    <>
      <Nav />
      <main style={{ maxWidth: 640, margin: "0 auto", padding: "48px 24px" }}>
        <h1 style={{ fontSize: 24, fontWeight: 700, marginBottom: 8 }}>Status</h1>
        <p style={{ color: "var(--muted)", fontSize: 14, marginBottom: 40 }}>
          Live checks are not wired yet. This shows known connection state.
        </p>

        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          {services.map(({ name, status, note }) => (
            <div
              key={name}
              style={{
                background: "var(--surface)",
                border: "1px solid var(--border)",
                borderRadius: "var(--radius)",
                padding: "18px 24px",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <div>
                <div style={{ fontWeight: 600, marginBottom: 2 }}>{name}</div>
                {note && <div style={{ fontSize: 13, color: "var(--muted)" }}>{note}</div>}
              </div>
              <StatusBadge status={status} />
            </div>
          ))}
        </div>
      </main>
    </>
  );
}

function StatusBadge({ status }: { status: "connected" | "not connected" }) {
  const connected = status === "connected";
  return (
    <div style={{
      display: "flex",
      alignItems: "center",
      gap: 6,
      fontSize: 13,
      color: connected ? "var(--accent)" : "var(--muted)",
      background: connected ? "var(--accent-dim)" : "var(--bg)",
      border: `1px solid ${connected ? "var(--accent)" : "var(--border)"}`,
      borderRadius: "var(--radius)",
      padding: "4px 10px",
    }}>
      <span style={{ width: 7, height: 7, borderRadius: "50%", background: connected ? "var(--accent)" : "var(--border)", display: "inline-block" }} />
      {status}
    </div>
  );
}

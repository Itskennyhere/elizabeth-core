"use client";

import { useCallback, useEffect, useState } from "react";
import Nav from "@/components/Nav";
import type { ServiceStatus } from "@/app/api/status/route";

type StatusResponse = {
  services: ServiceStatus[];
  checkedAt: string;
};

export default function StatusPage() {
  const [data, setData] = useState<StatusResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const check = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/status", { cache: "no-store" });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      setData(await res.json());
    } catch (e) {
      setError(e instanceof Error ? e.message : "Check failed.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { check(); }, [check]);

  return (
    <>
      <Nav />
      <main style={{ maxWidth: 640, margin: "0 auto", padding: "48px 24px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: 32 }}>
          <div>
            <h1 style={{ fontSize: 24, fontWeight: 700, marginBottom: 4 }}>Status</h1>
            <p style={{ color: "var(--muted)", fontSize: 13 }}>
              {data
                ? `Last checked ${new Date(data.checkedAt).toLocaleTimeString()}`
                : "Running checks…"}
            </p>
          </div>
          <button
            onClick={check}
            disabled={loading}
            style={{
              background: "none",
              border: "1px solid var(--border)",
              borderRadius: "var(--radius)",
              color: loading ? "var(--muted)" : "var(--text)",
              padding: "7px 16px",
              fontSize: 13,
              cursor: loading ? "not-allowed" : "pointer",
            }}
          >
            {loading ? "Checking…" : "Refresh"}
          </button>
        </div>

        {error && (
          <div style={{
            background: "#1f0e0e",
            border: "1px solid var(--danger)",
            borderRadius: "var(--radius)",
            padding: "12px 16px",
            color: "var(--danger)",
            fontSize: 14,
            marginBottom: 16,
          }}>
            {error}
          </div>
        )}

        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          {data?.services.map((s) => (
            <ServiceRow key={s.name} service={s} />
          ))}

          {!data && !error && (
            <div style={{ color: "var(--muted)", fontSize: 14, padding: "12px 0" }}>Loading…</div>
          )}
        </div>
      </main>
    </>
  );
}

function ServiceRow({ service }: { service: ServiceStatus }) {
  return (
    <div style={{
      background: "var(--surface)",
      border: "1px solid var(--border)",
      borderRadius: "var(--radius)",
      padding: "16px 20px",
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      gap: 16,
    }}>
      <div style={{ minWidth: 0 }}>
        <div style={{ fontWeight: 600, marginBottom: service.detail ? 3 : 0 }}>{service.name}</div>
        {service.detail && (
          <div style={{ fontSize: 12, color: "var(--muted)", wordBreak: "break-all" }}>{service.detail}</div>
        )}
      </div>
      <StatusBadge status={service.status} />
    </div>
  );
}

function StatusBadge({ status }: { status: ServiceStatus["status"] }) {
  const map: Record<ServiceStatus["status"], { color: string; bg: string; border: string }> = {
    connected:     { color: "var(--accent)",  bg: "var(--accent-dim)", border: "var(--accent)" },
    configured:    { color: "#fbbf24",         bg: "#1c1505",           border: "#78530a" },
    error:         { color: "var(--danger)",   bg: "#1f0e0e",           border: "#7f1d1d" },
    "not connected": { color: "var(--muted)", bg: "var(--bg)",          border: "var(--border)" },
  };
  const s = map[status];
  return (
    <div style={{
      display: "flex", alignItems: "center", gap: 6,
      fontSize: 12, fontWeight: 500,
      color: s.color, background: s.bg,
      border: `1px solid ${s.border}`,
      borderRadius: "var(--radius)", padding: "4px 10px",
      whiteSpace: "nowrap", flexShrink: 0,
    }}>
      <span style={{ width: 6, height: 6, borderRadius: "50%", background: s.color, display: "inline-block" }} />
      {status}
    </div>
  );
}

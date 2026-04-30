import { NextResponse } from "next/server";
import { getSettings } from "@/lib/settings";

export type ServiceStatus = {
  name: string;
  status: "connected" | "configured" | "error" | "not connected";
  detail?: string;
};

export async function GET() {
  const s = getSettings();
  const results: ServiceStatus[] = [];

  // Elizabeth Core — always up if this endpoint responds
  results.push({ name: "Elizabeth Core", status: "connected", detail: "API reachable" });

  // Telegram — check if token is configured; no live API call needed for Step 2
  if (s.telegram.enabled && s.telegram.botToken) {
    results.push({ name: "Telegram", status: "configured", detail: "Token saved" });
  } else {
    results.push({
      name: "Telegram",
      status: "not connected",
      detail: s.telegram.enabled ? "Token missing" : "Disabled",
    });
  }

  // Q Agent — try /health endpoint
  results.push(await checkService("Q Agent", s.qagent.enabled, s.qagent.baseUrl));

  // Q Trading — try /health endpoint
  results.push(await checkService("Q Trading", s.qtrading.enabled, s.qtrading.baseUrl));

  return NextResponse.json({ services: results, checkedAt: new Date().toISOString() });
}

async function checkService(
  name: string,
  enabled: boolean,
  baseUrl: string
): Promise<ServiceStatus> {
  if (!enabled || !baseUrl) {
    return {
      name,
      status: "not connected",
      detail: !enabled ? "Disabled" : "No URL configured",
    };
  }

  const url = `${baseUrl.replace(/\/$/, "")}/health`;
  try {
    const res = await fetch(url, {
      signal: AbortSignal.timeout(4000),
      cache: "no-store",
    });
    if (res.ok) {
      return { name, status: "connected", detail: `${url} → ${res.status}` };
    }
    return { name, status: "error", detail: `${url} → HTTP ${res.status}` };
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : "Unreachable";
    return { name, status: "error", detail: msg };
  }
}

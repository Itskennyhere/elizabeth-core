import fs from "fs";
import path from "path";

// ─── Types ────────────────────────────────────────────────────────────────────

export type Provider = "openai" | "anthropic" | "openclaw";

export type Settings = {
  provider: Provider;
  openai: {
    enabled: boolean;
    apiKey: string;
    model: string;
  };
  anthropic: {
    enabled: boolean;
    apiKey: string;
    model: string;
  };
  openclaw: {
    enabled: boolean;
    apiKey: string;
    baseUrl: string;
  };
  notion: {
    enabled: boolean;
    apiKey: string;
    databaseId: string;
  };
  telegram: {
    enabled: boolean;
    botToken: string;
    chatId: string;
  };
  qagent: {
    enabled: boolean;
    baseUrl: string;
  };
  qtrading: {
    enabled: boolean;
    baseUrl: string;
  };
};

// Returned to the frontend — secrets replaced with the sentinel "__SET__"
export type MaskedSettings = ReturnType<typeof maskSettings>;

// ─── Constants ────────────────────────────────────────────────────────────────

const SETTINGS_PATH = path.join(process.cwd(), "data", "settings.json");

// Sentinel sent to frontend when a secret field exists but must not be exposed.
// POST handler: if field === SENTINEL, keep the existing stored value.
export const SENTINEL = "__SET__";

export const DEFAULT_SETTINGS: Settings = {
  provider: "openai",
  openai: { enabled: false, apiKey: "", model: "gpt-4.1-mini" },
  anthropic: { enabled: false, apiKey: "", model: "claude-sonnet-4-6" },
  openclaw: { enabled: false, apiKey: "", baseUrl: "" },
  notion: { enabled: false, apiKey: "", databaseId: "" },
  telegram: { enabled: false, botToken: "", chatId: "" },
  qagent: { enabled: false, baseUrl: "" },
  qtrading: { enabled: false, baseUrl: "" },
};

// ─── Storage helpers ──────────────────────────────────────────────────────────

export function getSettings(): Settings {
  try {
    ensureDataDir();
    if (!fs.existsSync(SETTINGS_PATH)) return structuredClone(DEFAULT_SETTINGS);
    const raw = fs.readFileSync(SETTINGS_PATH, "utf-8");
    // Deep-merge so new default keys appear even in old saved files
    return deepMerge(structuredClone(DEFAULT_SETTINGS), JSON.parse(raw)) as Settings;
  } catch {
    return structuredClone(DEFAULT_SETTINGS);
  }
}

export function saveSettings(updates: DeepPartial<Settings>): Settings {
  const current = getSettings();
  const next = deepMerge(current, updates) as Settings;
  ensureDataDir();
  fs.writeFileSync(SETTINGS_PATH, JSON.stringify(next, null, 2), "utf-8");
  return next;
}

// ─── Masking — safe for frontend ─────────────────────────────────────────────

export function maskSettings(s: Settings) {
  return {
    provider: s.provider,
    openai: {
      enabled: s.openai.enabled,
      apiKey: s.openai.apiKey ? SENTINEL : "",
      model: s.openai.model,
    },
    anthropic: {
      enabled: s.anthropic.enabled,
      apiKey: s.anthropic.apiKey ? SENTINEL : "",
      model: s.anthropic.model,
    },
    openclaw: {
      enabled: s.openclaw.enabled,
      apiKey: s.openclaw.apiKey ? SENTINEL : "",
      baseUrl: s.openclaw.baseUrl,
    },
    notion: {
      enabled: s.notion.enabled,
      apiKey: s.notion.apiKey ? SENTINEL : "",
      databaseId: s.notion.databaseId ? SENTINEL : "",
    },
    telegram: {
      enabled: s.telegram.enabled,
      botToken: s.telegram.botToken ? SENTINEL : "",
      chatId: s.telegram.chatId,
    },
    qagent: {
      enabled: s.qagent.enabled,
      baseUrl: s.qagent.baseUrl,
    },
    qtrading: {
      enabled: s.qtrading.enabled,
      baseUrl: s.qtrading.baseUrl,
    },
  };
}

// ─── Merge helper — apply incoming updates while preserving untouched secrets ─

export function applyPartialUpdate(
  current: Settings,
  incoming: Record<string, unknown>
): Settings {
  const next = structuredClone(current);

  if (typeof incoming.provider === "string") {
    next.provider = incoming.provider as Provider;
  }

  patchSection(next.openai, incoming.openai as Record<string, unknown>, ["apiKey"]);
  patchSection(next.anthropic, incoming.anthropic as Record<string, unknown>, ["apiKey"]);
  patchSection(next.openclaw, incoming.openclaw as Record<string, unknown>, ["apiKey"]);
  patchSection(next.notion, incoming.notion as Record<string, unknown>, ["apiKey", "databaseId"]);
  patchSection(next.telegram, incoming.telegram as Record<string, unknown>, ["botToken"]);
  patchSection(next.qagent, incoming.qagent as Record<string, unknown>, []);
  patchSection(next.qtrading, incoming.qtrading as Record<string, unknown>, []);

  return next;
}

// ─── Internal utils ───────────────────────────────────────────────────────────

function patchSection(
  target: Record<string, unknown>,
  incoming: Record<string, unknown> | undefined,
  secretFields: string[]
) {
  if (!incoming || typeof incoming !== "object") return;
  for (const [k, v] of Object.entries(incoming)) {
    if (secretFields.includes(k)) {
      // Keep existing value if frontend sent the sentinel or an empty string
      if (v && v !== SENTINEL) target[k] = v;
    } else {
      if (v !== undefined) target[k] = v;
    }
  }
}

function ensureDataDir() {
  const dir = path.dirname(SETTINGS_PATH);
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function deepMerge(target: any, source: any): any {
  if (typeof source !== "object" || source === null) return source ?? target;
  const result = { ...target };
  for (const key of Object.keys(source)) {
    if (typeof source[key] === "object" && source[key] !== null && !Array.isArray(source[key])) {
      result[key] = deepMerge(target[key] ?? {}, source[key]);
    } else if (source[key] !== undefined) {
      result[key] = source[key];
    }
  }
  return result;
}

type DeepPartial<T> = T extends object ? { [K in keyof T]?: DeepPartial<T[K]> } : T;

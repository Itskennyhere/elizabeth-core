/**
 * Notion integration — wired to settings storage, API call stubbed for Step 3.
 *
 * Elizabeth will use Notion as a long-term memory layer so she can:
 *   - recall past decisions Kenny has made
 *   - understand preferences and habits over time
 *   - reference trading ideas and system logs
 *   - improve context and personalisation without being retrained
 *
 * In Step 3 this file will use the official @notionhq/client SDK.
 * Keys are now sourced from settings.json (saved via /api/settings), not .env.
 */

import { getSettings } from "@/lib/settings";

export type NotionMemoryEntry = {
  id: string;
  title: string;
  content: string;
  category: "note" | "decision" | "trading_idea" | "system_log" | "preference";
  createdAt: string;
};

/** True only if Notion is enabled AND both key + databaseId are saved. */
export function isNotionConfigured(): boolean {
  const { notion } = getSettings();
  return notion.enabled && Boolean(notion.apiKey) && Boolean(notion.databaseId);
}

/**
 * Fetch recent memory entries from Notion.
 * Step 3: replace stub with a real @notionhq/client query.
 */
export async function fetchMemoryEntries(_limit = 20): Promise<NotionMemoryEntry[]> {
  if (!isNotionConfigured()) return [];

  // TODO Step 3:
  // const { notion } = getSettings();
  // const client = new Client({ auth: notion.apiKey });
  // const res = await client.databases.query({ database_id: notion.databaseId, page_size: _limit });
  // return res.results.map(mapPageToEntry);
  return [];
}

/**
 * Build a context string for Elizabeth's system prompt.
 * Returns "" if Notion is not configured — callers must handle gracefully.
 * Step 3: call fetchMemoryEntries here and format the results.
 */
export async function buildMemoryContext(): Promise<string> {
  if (!isNotionConfigured()) return "";
  // TODO Step 3: fetch and summarise
  return "";
}

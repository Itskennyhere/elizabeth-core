/**
 * Notion integration — placeholder for Step 2.
 *
 * Elizabeth will use Notion as a long-term memory layer so she can:
 *   - recall past decisions Kenny has made
 *   - understand preferences and habits over time
 *   - reference trading ideas and system logs
 *   - improve context and personalisation without being retrained
 *
 * In Step 2 this file will use the official @notionhq/client SDK.
 * For now it defines the shape of the API so callers don't need to change
 * when the real implementation lands.
 */

export type NotionConfig = {
  apiKey: string;
  databaseId: string;
};

export type NotionMemoryEntry = {
  id: string;
  title: string;
  content: string;
  category: "note" | "decision" | "trading_idea" | "system_log" | "preference";
  createdAt: string;
};

/**
 * Returns true if the minimum required env vars are present.
 * The app never blocks on this — Notion is always optional.
 */
export function isNotionConfigured(): boolean {
  return Boolean(process.env.NOTION_API_KEY && process.env.NOTION_DATABASE_ID);
}

/**
 * Fetch recent memory entries from Notion.
 * Step 2: replace this stub with a real @notionhq/client query.
 */
export async function fetchMemoryEntries(
  _config: NotionConfig,
  _limit = 20
): Promise<NotionMemoryEntry[]> {
  // TODO Step 2: implement with @notionhq/client
  // const notion = new Client({ auth: _config.apiKey });
  // const response = await notion.databases.query({ database_id: _config.databaseId, page_size: _limit });
  // return response.results.map(mapPageToMemoryEntry);
  return [];
}

/**
 * Build a short memory context string to inject into Elizabeth's system prompt.
 * Returns an empty string if Notion is not connected — caller must handle gracefully.
 *
 * Step 2: call fetchMemoryEntries here and format the results.
 */
export async function buildMemoryContext(): Promise<string> {
  if (!isNotionConfigured()) return "";

  // TODO Step 2: fetch entries and summarise them for the system prompt
  // const entries = await fetchMemoryEntries({ apiKey: ..., databaseId: ... });
  // return formatEntriesAsContext(entries);
  return "";
}

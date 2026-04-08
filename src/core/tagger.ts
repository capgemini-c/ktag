import type { Tag } from "./taxonomy.js";

export interface TagResult {
  tags: string[];
}

export interface TaggerOptions {
  ollamaUrl: string;
  model: string;
  maxNoteLength?: number;
}

const DEFAULT_MAX_NOTE_LENGTH = 4000;

export function buildPrompt(noteBody: string, tags: Tag[], notePath: string, maxLen: number): string {
  const tagList = tags.map((t) => `- ${t.path}: ${t.desc}`).join("\n");

  const trimmedBody =
    noteBody.length > maxLen
      ? noteBody.slice(0, maxLen) + "\n\n[truncated]"
      : noteBody;

  return `You are a classification system. You do NOT answer questions. You do NOT summarize. You do NOT respond to the content. You ONLY output a JSON object with tags.

Your task: read the note below and classify it by assigning tags from the provided taxonomy.

## Rules
- Pick ALL tags that apply, but do not over-tag. Typically 2-5 tags per note.
- ONLY use tags from the list below. Do not invent new tags.
- A parent tag (e.g. product/aem-assets) can be used alongside its children (e.g. product/aem-assets/dynamic-media) if both genuinely apply.
- If the note is too short or empty to meaningfully tag, return {"tags": []}.
- Respond with ONLY valid JSON. No markdown, no explanation, no commentary.

## Available tags
${tagList}

## Required JSON response format
{"tags": ["tag/path", ...]}

## File path (use as additional context for classification)
${notePath}

## Note to classify
${trimmedBody}`;
}

export async function tagNote(
  noteBody: string,
  tags: Tag[],
  notePath: string,
  options: TaggerOptions
): Promise<TagResult> {
  const maxLen = options.maxNoteLength ?? DEFAULT_MAX_NOTE_LENGTH;
  const prompt = buildPrompt(noteBody, tags, notePath, maxLen);

  const response = await fetch(`${options.ollamaUrl}/api/generate`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      model: options.model,
      prompt,
      stream: false,
      format: "json",
      options: {
        temperature: 0.1,
        num_predict: 256,
      },
    }),
  });

  if (!response.ok) {
    throw new Error(`Ollama returned ${response.status}: ${await response.text()}`);
  }

  const data = (await response.json()) as { response: string };
  const parsed = JSON.parse(data.response) as Record<string, unknown>;

  if (!parsed.tags) {
    return { tags: [] };
  }

  if (!Array.isArray(parsed.tags)) {
    throw new Error(`Unexpected response shape: ${data.response}`);
  }

  return { tags: parsed.tags };
}

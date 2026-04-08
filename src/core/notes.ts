import { readFileSync, writeFileSync, statSync } from "fs";
import { readdir } from "fs/promises";
import { join, extname } from "path";
import matter from "gray-matter";

export interface Note {
  filePath: string;
  body: string;
  frontmatter: Record<string, unknown>;
  hasTags: boolean;
  created: Date;
}

export async function discoverNotes(dir: string): Promise<string[]> {
  const results: string[] = [];
  const entries = await readdir(dir, { withFileTypes: true });

  for (const entry of entries) {
    const fullPath = join(dir, entry.name);
    if (entry.isDirectory()) {
      results.push(...(await discoverNotes(fullPath)));
    } else if (extname(entry.name) === ".md") {
      results.push(fullPath);
    }
  }

  return results;
}

export function parseNote(filePath: string): Note {
  const raw = readFileSync(filePath, "utf-8");
  const file = matter(raw);
  const stats = statSync(filePath);

  return {
    filePath,
    body: file.content,
    frontmatter: file.data,
    hasTags: Array.isArray(file.data.tags) && file.data.tags.length > 0,
    created: stats.birthtime,
  };
}

export function writeTagsToNote(
  filePath: string,
  tags: string[],
  created: Date
): void {
  const raw = readFileSync(filePath, "utf-8");
  const file = matter(raw);

  file.data.tags = tags;
  delete file.data.summary;

  if (!file.data.created) {
    file.data.created = created.toISOString().split("T")[0];
  }

  const output = matter.stringify(file.content, file.data);
  writeFileSync(filePath, output);
}

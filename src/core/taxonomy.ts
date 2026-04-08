import { readFileSync } from "fs";
import yaml from "js-yaml";

export interface Tag {
  path: string;
  desc: string;
}

export function loadTaxonomy(filePath: string): Tag[] {
  const raw = yaml.load(readFileSync(filePath, "utf-8")) as Record<string, unknown>;
  const tags: Tag[] = [];
  flatten(raw, [], tags);
  return tags;
}

function flatten(node: unknown, prefix: string[], tags: Tag[]): void {
  if (typeof node === "string") {
    tags.push({ path: [...prefix].join("/"), desc: node });
    return;
  }

  if (typeof node === "object" && node !== null) {
    const obj = node as Record<string, unknown>;

    // If this node has a _desc, it's a category that is also a selectable tag
    if (typeof obj._desc === "string") {
      tags.push({ path: prefix.join("/"), desc: obj._desc });
    }

    for (const [key, value] of Object.entries(obj)) {
      if (key === "_desc") continue;
      flatten(value, [...prefix, key], tags);
    }
  }
}

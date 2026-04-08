import { resolve } from "path";
import cliProgress from "cli-progress";
import { loadTaxonomy } from "../core/taxonomy.js";
import { discoverNotes, parseNote, writeTagsToNote } from "../core/notes.js";
import { tagNote } from "../core/tagger.js";

export interface TagCommandOptions {
  dir: string;
  tags: string;
  model: string;
  ollamaUrl: string;
  dryRun: boolean;
  force: boolean;
  verbose: boolean;
}

export async function tag(opts: TagCommandOptions) {
  const resolvedDir = resolve(opts.dir);
  const taxonomy = loadTaxonomy(resolve(opts.tags));
  const files = await discoverNotes(resolvedDir);

  console.log(`${files.length} notes, ${taxonomy.length} tags, model: ${opts.model}${opts.dryRun ? " (dry run)" : ""}\n`);

  let tagged = 0;
  let skipped = 0;
  let failed = 0;
  const failures: string[] = [];

  const bar = new cliProgress.SingleBar({
    format: " {bar} {percentage}% | {value}/{total} | {note}",
    barCompleteChar: "\u2588",
    barIncompleteChar: "\u2591",
    hideCursor: true,
    clearOnComplete: true,
  });

  bar.start(files.length, 0, { note: "" });

  for (let i = 0; i < files.length; i++) {
    const filePath = files[i];
    const name = filePath.replace(resolvedDir + "/", "");
    bar.update(i, { note: name });

    const note = parseNote(filePath);

    if (note.hasTags && !opts.force) {
      skipped++;
      bar.update(i + 1, { note: name });
      continue;
    }

    try {
      const result = await tagNote(note.body, taxonomy, name, {
        ollamaUrl: opts.ollamaUrl,
        model: opts.model,
      });

      if (opts.dryRun) {
        if (opts.verbose) {
          bar.stop();
          console.log(`${name}`);
          console.log(`  Tags: ${result.tags.join(", ")}\n`);
          bar.start(files.length, i + 1, { note: "" });
        }
      } else {
        writeTagsToNote(filePath, result.tags, note.created);
      }

      tagged++;
    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err);
      failures.push(`${name} — ${msg}`);
      failed++;
    }

    bar.update(i + 1, { note: name });
  }

  bar.stop();

  console.log(`\nDone. Tagged: ${tagged}, Skipped: ${skipped}, Failed: ${failed}`);

  if (failures.length > 0) {
    console.log("\nFailures:");
    failures.forEach((f) => console.log(`  - ${f}`));
  }
}

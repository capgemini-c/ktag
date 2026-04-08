import { Notice, Plugin, TFile, EventRef, debounce } from "obsidian";
import yaml from "js-yaml";
import { type Tag } from "../core/taxonomy.js";
import { buildPrompt } from "../core/tagger.js";
import {
  KTagSettingTab,
  type KTagSettings,
  DEFAULT_SETTINGS,
} from "./settings.js";

export default class KTagPlugin extends Plugin {
  settings: KTagSettings = DEFAULT_SETTINGS;
  private modifyRef: EventRef | null = null;
  private lastTaggedLength: Map<string, number> = new Map();
  private debouncedTaggers: Map<string, ReturnType<typeof debounce>> = new Map();
  private batchCancelled = false;

  async onload() {
    await this.loadSettings();
    this.addSettingTab(new KTagSettingTab(this.app, this));

    this.addCommand({
      id: "tag-current-note",
      name: "Tag current note",
      callback: () => this.tagCurrentNote(),
    });

    this.addCommand({
      id: "tag-all-notes",
      name: "Tag all untagged notes in vault",
      callback: () => this.tagAllNotes(false),
    });

    this.addCommand({
      id: "retag-all-notes",
      name: "Re-tag all notes in vault (overwrite existing)",
      callback: () => this.tagAllNotes(true),
    });

    this.setupAutoTag();
  }

  onunload() {
    this.teardownAutoTag();
  }

  async loadSettings() {
    this.settings = Object.assign({}, DEFAULT_SETTINGS, await this.loadData());
  }

  async saveSettings() {
    await this.saveData(this.settings);
  }

  setupAutoTag() {
    this.teardownAutoTag();

    if (!this.settings.autoTag) return;

    this.modifyRef = this.app.vault.on("modify", (file) => {
      if (!(file instanceof TFile) || file.extension !== "md") return;
      this.scheduleAutoTag(file);
    });

    this.registerEvent(this.modifyRef);
  }

  private teardownAutoTag() {
    if (this.modifyRef) {
      this.app.vault.offref(this.modifyRef);
      this.modifyRef = null;
    }
    this.debouncedTaggers.clear();
  }

  private scheduleAutoTag(file: TFile) {
    let debouncedFn = this.debouncedTaggers.get(file.path);

    if (!debouncedFn) {
      debouncedFn = debounce(
        async (f: TFile) => {
          await this.autoTagFile(f);
          this.debouncedTaggers.delete(f.path);
        },
        this.settings.debounceSeconds * 1000,
        true
      );
      this.debouncedTaggers.set(file.path, debouncedFn);
    }

    debouncedFn(file);
  }

  private async autoTagFile(file: TFile) {
    const content = await this.app.vault.read(file);
    const lastLength = this.lastTaggedLength.get(file.path);

    // Skip if change is below threshold
    if (lastLength !== undefined) {
      const diff = Math.abs(content.length - lastLength);
      if (diff < this.settings.changeThreshold) return;
    }

    let tags: Tag[];
    try {
      tags = this.loadTags();
    } catch {
      return;
    }

    try {
      const resultTags = await this.callOllama(content, file.path, tags);

      await this.app.fileManager.processFrontMatter(file, (fm) => {
        fm.tags = resultTags;
        if (!fm.created) {
          fm.created = new Date(file.stat.ctime).toISOString().split("T")[0];
        }
      });

      this.lastTaggedLength.set(file.path, content.length);
    } catch {
      // Silent fail for auto-tag — don't spam notices
    }
  }

  private loadTags(): Tag[] {
    const raw = yaml.load(this.settings.taxonomyYaml) as Record<string, unknown>;
    const tags: Tag[] = [];
    this.flatten(raw, [], tags);
    return tags;
  }

  private flatten(node: unknown, prefix: string[], tags: Tag[]): void {
    if (typeof node === "string") {
      tags.push({ path: [...prefix].join("/"), desc: node });
      return;
    }
    if (typeof node === "object" && node !== null) {
      const obj = node as Record<string, unknown>;
      if (typeof obj._desc === "string") {
        tags.push({ path: prefix.join("/"), desc: obj._desc });
      }
      for (const [key, value] of Object.entries(obj)) {
        if (key === "_desc") continue;
        this.flatten(value, [...prefix, key], tags);
      }
    }
  }

  private async callOllama(noteBody: string, notePath: string, tags: Tag[]): Promise<string[]> {
    const prompt = buildPrompt(noteBody, tags, notePath, 4000);

    const response = await fetch(`${this.settings.ollamaUrl}/api/generate`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        model: this.settings.model,
        prompt,
        stream: false,
        format: "json",
        options: { temperature: 0.1, num_predict: 256 },
      }),
    });

    if (!response.ok) {
      throw new Error(`Ollama returned ${response.status}`);
    }

    const data = (await response.json()) as { response: string };
    const parsed = JSON.parse(data.response) as Record<string, unknown>;

    if (!parsed.tags || !Array.isArray(parsed.tags)) {
      return [];
    }

    return parsed.tags as string[];
  }

  private async tagFile(file: TFile, tags: Tag[]): Promise<string[]> {
    const content = await this.app.vault.read(file);
    const resultTags = await this.callOllama(content, file.path, tags);

    await this.app.fileManager.processFrontMatter(file, (fm) => {
      fm.tags = resultTags;
      if (!fm.created) {
        fm.created = new Date(file.stat.ctime).toISOString().split("T")[0];
      }
    });

    this.lastTaggedLength.set(file.path, content.length);

    return resultTags;
  }

  private async tagCurrentNote() {
    const file = this.app.workspace.getActiveFile();
    if (!file) {
      new Notice("No active note");
      return;
    }

    let tags: Tag[];
    try {
      tags = this.loadTags();
    } catch {
      new Notice("Invalid taxonomy YAML — check kTag settings");
      return;
    }

    new Notice(`kTag: tagging ${file.basename}...`);

    try {
      const resultTags = await this.tagFile(file, tags);
      new Notice(`kTag: ${file.basename} → ${resultTags.join(", ") || "no tags"}`);
    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err);
      new Notice(`kTag failed: ${msg}`);
    }
  }

  cancelBatch() {
    this.batchCancelled = true;
  }

  async tagAllNotesWithProgress(
    force: boolean,
    onProgress: (
      current: number,
      total: number,
      name: string,
      stats: { tagged: number; skipped: number; failed: number }
    ) => void
  ) {
    let tags: Tag[];
    try {
      tags = this.loadTags();
    } catch {
      new Notice("Invalid taxonomy YAML — check kTag settings");
      return;
    }

    const files = this.app.vault.getMarkdownFiles();
    let tagged = 0;
    let skipped = 0;
    let failed = 0;
    this.batchCancelled = false;

    for (let i = 0; i < files.length; i++) {
      if (this.batchCancelled) {
        new Notice(`kTag stopped. Tagged: ${tagged}, Skipped: ${skipped}, Failed: ${failed}`);
        onProgress(i, files.length, "Cancelled", { tagged, skipped, failed });
        return;
      }

      const file = files[i];
      onProgress(i, files.length, file.basename, { tagged, skipped, failed });

      const fm = this.app.metadataCache.getFileCache(file)?.frontmatter;
      if (!force && fm?.tags && Array.isArray(fm.tags) && fm.tags.length > 0) {
        skipped++;
        continue;
      }

      try {
        await this.tagFile(file, tags);
        tagged++;
      } catch {
        failed++;
      }
    }

    onProgress(files.length, files.length, "", { tagged, skipped, failed });
    new Notice(`kTag done. Tagged: ${tagged}, Skipped: ${skipped}, Failed: ${failed}`);
  }

  private async tagAllNotes(force: boolean) {
    await this.tagAllNotesWithProgress(force, () => {});
  }
}

import { App, PluginSettingTab, Setting } from "obsidian";
import type KTagPlugin from "./main.js";

export interface KTagSettings {
  ollamaUrl: string;
  model: string;
  taxonomyYaml: string;
  autoTag: boolean;
  debounceSeconds: number;
  changeThreshold: number;
}

export const DEFAULT_SETTINGS: KTagSettings = {
  ollamaUrl: "http://localhost:11434",
  model: "qwen2.5-coder:7b",
  taxonomyYaml: `domain:
  work: "Anything related to work or employment"
  personal: "Personal life, hobbies, non-work"

type:
  meeting-notes: "Meeting notes, call summaries"
  learning: "Technical reference, study notes, training"
  planning: "Roadmaps, strategy, architecture decisions"
  reflection: "Self-assessment, reviews, feedback"
  brainstorm: "Ideas, concepts, early-stage thinking"
  task-list: "TODO or action item notes"
  reference: "Link collections, templates, lookup material"`,
  autoTag: true,
  debounceSeconds: 30,
  changeThreshold: 100,
};

export class KTagSettingTab extends PluginSettingTab {
  plugin: KTagPlugin;
  private progressContainer: HTMLElement | null = null;
  private progressBar: HTMLElement | null = null;
  private progressLabel: HTMLElement | null = null;
  private stopButton: HTMLButtonElement | null = null;

  constructor(app: App, plugin: KTagPlugin) {
    super(app, plugin);
    this.plugin = plugin;
  }

  display(): void {
    const { containerEl } = this;
    containerEl.empty();

    containerEl.createEl("h3", { text: "Connection" });

    new Setting(containerEl)
      .setName("Ollama URL")
      .setDesc("URL of your local Ollama server")
      .addText((text) =>
        text
          .setPlaceholder("http://localhost:11434")
          .setValue(this.plugin.settings.ollamaUrl)
          .onChange(async (value) => {
            this.plugin.settings.ollamaUrl = value;
            await this.plugin.saveSettings();
          })
      );

    new Setting(containerEl)
      .setName("Model")
      .setDesc("Ollama model to use for tagging")
      .addText((text) =>
        text
          .setPlaceholder("qwen2.5-coder:7b")
          .setValue(this.plugin.settings.model)
          .onChange(async (value) => {
            this.plugin.settings.model = value;
            await this.plugin.saveSettings();
          })
      );

    containerEl.createEl("h3", { text: "Auto-tagging" });

    new Setting(containerEl)
      .setName("Auto-tag on edit")
      .setDesc("Automatically re-tag notes when content changes significantly")
      .addToggle((toggle) =>
        toggle
          .setValue(this.plugin.settings.autoTag)
          .onChange(async (value) => {
            this.plugin.settings.autoTag = value;
            await this.plugin.saveSettings();
            this.plugin.setupAutoTag();
          })
      );

    new Setting(containerEl)
      .setName("Debounce (seconds)")
      .setDesc("Wait this long after the last edit before auto-tagging")
      .addText((text) =>
        text
          .setPlaceholder("30")
          .setValue(String(this.plugin.settings.debounceSeconds))
          .onChange(async (value) => {
            const num = parseInt(value, 10);
            if (!isNaN(num) && num > 0) {
              this.plugin.settings.debounceSeconds = num;
              await this.plugin.saveSettings();
            }
          })
      );

    new Setting(containerEl)
      .setName("Change threshold (characters)")
      .setDesc("Minimum character difference from last tagging before auto-tag triggers")
      .addText((text) =>
        text
          .setPlaceholder("100")
          .setValue(String(this.plugin.settings.changeThreshold))
          .onChange(async (value) => {
            const num = parseInt(value, 10);
            if (!isNaN(num) && num >= 0) {
              this.plugin.settings.changeThreshold = num;
              await this.plugin.saveSettings();
            }
          })
      );

    containerEl.createEl("h3", { text: "Batch tagging" });

    // Tag all / Re-tag all buttons + progress bar
    const batchSetting = new Setting(containerEl)
      .setName("Tag all notes")
      .setDesc("Run the tagger across your entire vault");

    batchSetting.addButton((btn) =>
      btn
        .setButtonText("Tag untagged")
        .setCta()
        .onClick(() => this.runBatch(false))
    );

    batchSetting.addButton((btn) =>
      btn
        .setButtonText("Re-tag all")
        .setWarning()
        .onClick(() => this.runBatch(true))
    );

    // Progress container (hidden by default)
    this.progressContainer = containerEl.createDiv({ cls: "ktag-progress-container" });
    this.progressContainer.style.display = "none";
    this.progressContainer.style.marginTop = "12px";

    this.progressLabel = this.progressContainer.createDiv({ cls: "ktag-progress-label" });
    this.progressLabel.style.fontSize = "12px";
    this.progressLabel.style.marginBottom = "4px";
    this.progressLabel.style.color = "var(--text-muted)";

    const barOuter = this.progressContainer.createDiv({ cls: "ktag-progress-bar-outer" });
    barOuter.style.width = "100%";
    barOuter.style.height = "8px";
    barOuter.style.borderRadius = "4px";
    barOuter.style.backgroundColor = "var(--background-modifier-border)";
    barOuter.style.overflow = "hidden";

    this.progressBar = barOuter.createDiv({ cls: "ktag-progress-bar-inner" });
    this.progressBar.style.height = "100%";
    this.progressBar.style.width = "0%";
    this.progressBar.style.borderRadius = "4px";
    this.progressBar.style.backgroundColor = "var(--interactive-accent)";
    this.progressBar.style.transition = "width 0.2s ease";

    const stopContainer = this.progressContainer.createDiv();
    stopContainer.style.marginTop = "8px";
    this.stopButton = stopContainer.createEl("button", { text: "Stop" });
    this.stopButton.style.fontSize = "12px";
    this.stopButton.addEventListener("click", () => {
      this.plugin.cancelBatch();
    });

    containerEl.createEl("h3", { text: "Taxonomy" });

    new Setting(containerEl)
      .setName("Tag taxonomy")
      .setDesc("YAML definition of your tag hierarchy")
      .addTextArea((text) =>
        text
          .setPlaceholder("Enter your taxonomy YAML...")
          .setValue(this.plugin.settings.taxonomyYaml)
          .onChange(async (value) => {
            this.plugin.settings.taxonomyYaml = value;
            await this.plugin.saveSettings();
          })
      );

    const taxonomyTextarea = containerEl.querySelector(
      "textarea"
    ) as HTMLTextAreaElement;
    if (taxonomyTextarea) {
      taxonomyTextarea.style.width = "100%";
      taxonomyTextarea.style.height = "300px";
      taxonomyTextarea.style.fontFamily = "monospace";
      taxonomyTextarea.style.fontSize = "12px";
    }
  }

  private async runBatch(force: boolean) {
    if (this.progressContainer) {
      this.progressContainer.style.display = "block";
    }
    this.updateProgress(0, 0, "Starting...");

    await this.plugin.tagAllNotesWithProgress(force, (current, total, name, stats) => {
      this.updateProgress(current, total, name, stats);
    });
  }

  updateProgress(
    current: number,
    total: number,
    noteName: string,
    stats?: { tagged: number; skipped: number; failed: number }
  ) {
    if (!this.progressBar || !this.progressLabel) return;

    const pct = total > 0 ? Math.round((current / total) * 100) : 0;
    this.progressBar.style.width = `${pct}%`;

    if (stats && current === total) {
      this.progressLabel.textContent =
        `Done. Tagged: ${stats.tagged}, Skipped: ${stats.skipped}, Failed: ${stats.failed}`;
      if (this.stopButton) this.stopButton.style.display = "none";
    } else {
      this.progressLabel.textContent = `${current}/${total} — ${noteName}`;
    }
  }
}

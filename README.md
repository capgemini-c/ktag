# kTag

Classifies your Obsidian notes against a YAML tag taxonomy using a local LLM ([Ollama](https://ollama.com)). Tags are written into frontmatter. Nothing leaves your machine.

## Setup

1. Install [Ollama](https://ollama.com) and pull a model: `ollama pull qwen2.5-coder:7b`
2. Install kTag from Community Plugins
3. Configure your taxonomy in Settings → kTag

## Taxonomy

Define tags in YAML. The description helps the model decide when to apply each tag:

```yaml
domain:
  work: "Anything related to employment"
  personal: "Hobbies, home, non-work"

type:
  meeting-notes: "Meeting notes, call summaries"
  learning: "Study notes, technical reference"
```

Nesting supported via `_desc`:

```yaml
tech:
  frontend:
    _desc: "Frontend development"
    react: "React components, hooks"
    css: "CSS, styling, layout"
```

Tip: include abbreviations in descriptions. `"Universal Editor (UE), SPA editing"` catches more than `"Universal Editor"`.

## Commands

- **Tag current note** — tags the active note
- **Tag all untagged notes** — batch, skips already tagged
- **Re-tag all notes** — overwrites existing tags

Batch tagging with progress bar also available in the settings panel.

## Auto-tag

Enabled by default. Re-tags a note when you stop editing for 30s and content changed by 100+ characters. Both thresholds are configurable.

## CLI

```bash
ktag init                    # create starter tags.yaml
ktag tag --dir ./notes --tags tags.yaml          # tag untagged
ktag tag --dir ./notes --tags tags.yaml --force  # re-tag all
ktag tag --dir ./notes --tags tags.yaml --dry-run --verbose  # preview
```

## License

MIT

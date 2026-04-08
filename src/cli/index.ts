#!/usr/bin/env node

import { Command } from "commander";
import { init } from "./init.js";
import { tag } from "./tag.js";

const program = new Command();

program
  .name("ktag")
  .description("AI-powered tag classification for Obsidian notes using local LLMs")
  .version("1.0.0");

program
  .command("init")
  .description("Create a starter tags.yaml in the current directory")
  .argument("[output]", "output file path", "tags.yaml")
  .action(init);

program
  .command("tag")
  .description("Tag notes in a directory using the configured taxonomy")
  .requiredOption("--dir <path>", "path to notes directory")
  .requiredOption("--tags <path>", "path to tags.yaml taxonomy file")
  .option("--model <name>", "Ollama model to use", "qwen2.5-coder:7b")
  .option("--ollama-url <url>", "Ollama server URL", "http://localhost:11434")
  .option("--dry-run", "preview tags without writing to files", false)
  .option("--force", "re-tag notes that already have tags", false)
  .option("--verbose", "print tags for each note during dry run", false)
  .action(tag);

program.parse();

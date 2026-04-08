import { copyFileSync, existsSync } from "fs";
import { resolve, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const EXAMPLE_PATH = resolve(__dirname, "../../tags.example.yaml");

export function init(output: string) {
  const target = resolve(output);

  if (existsSync(target)) {
    console.error(`Already exists: ${target}`);
    console.error("Remove it first or use a different path.");
    process.exit(1);
  }

  copyFileSync(EXAMPLE_PATH, target);
  console.log(`Created ${target}`);
  console.log("Edit this file with your own tags, then run:\n");
  console.log(`  ktag tag --dir <notes-directory> --tags ${output}`);
}

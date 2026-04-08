import esbuild from "esbuild";

esbuild.build({
  entryPoints: ["src/plugin/main.ts"],
  bundle: true,
  external: ["obsidian"],
  format: "cjs",
  target: "es2022",
  outfile: "main.js",
  platform: "node",
  sourcemap: "inline",
  logLevel: "info",
});

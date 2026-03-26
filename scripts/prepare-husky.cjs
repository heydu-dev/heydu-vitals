#!/usr/bin/env node
/**
 * Run husky for local dev installs only. Skip during `npm publish` / `npm pack` so
 * `prepare` does not run husky while packing (avoids process being killed / OOM).
 */
const { execSync } = require("node:child_process");

const cmd = process.env.npm_command;
if (cmd === "publish" || cmd === "pack") {
  process.exit(0);
}

try {
  execSync("husky", { stdio: "inherit", cwd: __dirname + "/.." });
} catch {
  process.exit(0);
}

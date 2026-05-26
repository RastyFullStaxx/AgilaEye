import { mkdirSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { spawn } from "node:child_process";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const tempDir = resolve(root, ".tmp", "vitest");
const bin = process.platform === "win32" ? "vitest.cmd" : "vitest";

mkdirSync(tempDir, { recursive: true });

const child = spawn(bin, process.argv.slice(2), {
  cwd: root,
  stdio: "inherit",
  shell: process.platform === "win32",
  env: {
    ...process.env,
    TMPDIR: tempDir,
    TEMP: tempDir,
    TMP: tempDir
  }
});

child.on("exit", (code, signal) => {
  if (signal) {
    process.kill(process.pid, signal);
    return;
  }

  process.exit(code ?? 1);
});

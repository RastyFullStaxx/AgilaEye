import { rmSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const viteCache = resolve(root, "node_modules", ".vite");

rmSync(viteCache, { recursive: true, force: true });
console.log("Cleared Vite optimized dependency cache.");

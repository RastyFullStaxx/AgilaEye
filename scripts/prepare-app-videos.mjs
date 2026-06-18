import { cpSync, existsSync, mkdirSync, readdirSync, statSync } from "node:fs";
import { dirname, relative } from "node:path";
import { fileURLToPath } from "node:url";

const repoRoot = dirname(dirname(fileURLToPath(import.meta.url)));
const sourceDir = `${repoRoot}/data/raw/pilot-100`;
const targetDir = `${repoRoot}/public/videos/pilot-100`;

function countMp4Files(path) {
  if (!existsSync(path)) {
    return 0;
  }

  return readdirSync(path, { withFileTypes: true }).reduce((count, entry) => {
    const child = `${path}/${entry.name}`;
    if (entry.isDirectory()) {
      return count + countMp4Files(child);
    }

    return entry.name.endsWith(".mp4") ? count + 1 : count;
  }, 0);
}

if (!existsSync(sourceDir)) {
  throw new Error(`Missing pilot video source directory: ${relative(repoRoot, sourceDir)}`);
}

const sourceCount = countMp4Files(sourceDir);
const targetCount = countMp4Files(targetDir);
if (sourceCount === targetCount && sourceCount === 100 && existsSync(targetDir) && statSync(targetDir).isDirectory()) {
  console.log(`App video assets already prepared at ${relative(repoRoot, targetDir)}.`);
  process.exit(0);
}

mkdirSync(dirname(targetDir), { recursive: true });
cpSync(sourceDir, targetDir, { recursive: true, force: true });

console.log(`Copied ${sourceCount} pilot videos to ${relative(repoRoot, targetDir)}.`);

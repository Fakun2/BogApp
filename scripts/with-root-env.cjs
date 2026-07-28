const { spawnSync } = require("node:child_process");
const { resolve } = require("node:path");
const dotenv = require("dotenv");

const repoRoot = resolve(__dirname, "..");
const command = process.argv[2];
const args = process.argv.slice(3);

if (!command) {
  console.error("Usage: node scripts/with-root-env.cjs <command> [...args]");
  process.exit(1);
}

dotenv.config({ path: resolve(repoRoot, ".env") });
dotenv.config({ path: resolve(repoRoot, ".env.local"), override: true });

const result = spawnSync(command, args, {
  cwd: repoRoot,
  env: process.env,
  shell: process.platform === "win32",
  stdio: "inherit"
});

if (result.error) {
  throw result.error;
}

process.exit(result.status ?? 0);

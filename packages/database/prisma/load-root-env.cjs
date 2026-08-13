const { existsSync } = require("node:fs");
const { dirname, join } = require("node:path");
const dotenv = require("dotenv");

function loadRootEnv() {
  const envPaths = findEnvFiles(__dirname);

  for (const envPath of envPaths) {
    dotenv.config({ path: envPath, override: true });
  }
}

function findEnvFiles(startDir) {
  let currentDir = startDir;

  for (let depth = 0; depth < 8; depth += 1) {
    const envFile = join(currentDir, ".env");
    const localEnvFile = join(currentDir, ".env.local");

    if (existsSync(envFile) || existsSync(localEnvFile)) {
      return [envFile, localEnvFile].filter((path) => existsSync(path));
    }

    const parentDir = dirname(currentDir);
    if (parentDir === currentDir) {
      return [];
    }

    currentDir = parentDir;
  }

  return [];
}

module.exports = { loadRootEnv };

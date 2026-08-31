import process from "node:process";
import { existsSync, readFileSync } from "node:fs";
import { resolve } from "node:path";

// Server-only config. The .server.ts suffix prevents Vite from bundling
// this file into the client — values here never reach the browser.
//
// On Cloudflare Workers, env binds at REQUEST time. Module-scope reads
// (e.g. `const x = process.env.X`) resolve to undefined — always read
// process.env INSIDE a function or handler.
//
// When to use which env-access pattern:
//   - .server.ts module (this file): server-only helpers reused across
//     handlers. Wrap reads in a function so they run per-request.
//   - inline process.env inside a createServerFn handler: one-off reads
//     not reused elsewhere.
//   - import.meta.env.VITE_FOO: PUBLIC config readable from both client
//     and server (analytics IDs, public URLs). Define in .env with the
//     VITE_ prefix. Never put secrets here — they ship to the browser.

const loadLocalEnv = () => {
  const envPath = resolve(process.cwd(), ".env");
  if (!existsSync(envPath)) return;

  for (const line of readFileSync(envPath, "utf8").split(/\r?\n/)) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;

    const equalsIndex = trimmed.indexOf("=");
    if (equalsIndex <= 0) continue;

    const key = trimmed.slice(0, equalsIndex).trim();
    const rawValue = trimmed.slice(equalsIndex + 1).trim();
    const value = rawValue.replace(/^(['"])(.*)\1$/, "$2");

    if (!process.env[key]) {
      process.env[key] = value;
    }
  }
};

loadLocalEnv();

export function getServerConfig() {
  const databaseUrl =
    process.env.DATABASE_URL ??
    process.env.MYSQL_URL ??
    (process.env.MYSQL_HOST && process.env.MYSQL_USER && process.env.MYSQL_DATABASE
      ? [
          "mysql://",
          encodeURIComponent(process.env.MYSQL_USER),
          ":",
          encodeURIComponent(process.env.MYSQL_PASSWORD ?? ""),
          "@",
          process.env.MYSQL_HOST,
          process.env.MYSQL_PORT ? `:${process.env.MYSQL_PORT}` : "",
          "/",
          process.env.MYSQL_DATABASE,
        ].join("")
      : undefined);

  return {
    nodeEnv: process.env.NODE_ENV,
    databaseUrl,
  };
}

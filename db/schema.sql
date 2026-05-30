-- Email capture for arcanalang.org — Cloudflare D1 (SQLite) schema.
-- Apply once to your D1 database, e.g.:
--   wrangler d1 execute arcanalang --file=db/schema.sql --remote
-- (drop --remote to apply to the local dev D1.)

CREATE TABLE IF NOT EXISTS subscribers (
  id         INTEGER PRIMARY KEY AUTOINCREMENT,
  email      TEXT NOT NULL UNIQUE,
  source     TEXT,
  created_at TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE INDEX IF NOT EXISTS idx_subscribers_created_at ON subscribers (created_at);

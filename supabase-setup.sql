-- ============================================
-- Supabase Realtime Viewer Counter — Setup
-- ============================================
-- Run this in your Supabase SQL Editor
-- (Dashboard → SQL Editor → New query → Paste → Run)

-- 1. Create the viewers table
CREATE TABLE IF NOT EXISTS viewers (
  id TEXT PRIMARY KEY,
  last_seen TIMESTAMPTZ NOT NULL DEFAULT now(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 2. Enable Row Level Security
ALTER TABLE viewers ENABLE ROW LEVEL SECURITY;

-- 3. Allow anyone to read (public counter)
CREATE POLICY "Anyone can read viewers"
  ON viewers FOR SELECT
  USING (true);

-- 4. Allow anyone to insert/update (anonymous heartbeats)
CREATE POLICY "Anyone can upsert viewers"
  ON viewers FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Anyone can update viewers"
  ON viewers FOR UPDATE
  USING (true)
  WITH CHECK (true);

-- 5. Allow anyone to delete (cleanup stale + session leave)
CREATE POLICY "Anyone can delete viewers"
  ON viewers FOR DELETE
  USING (true);

-- 6. Enable Realtime for live updates
ALTER PUBLICATION supabase_realtime ADD TABLE viewers;

-- 7. Create index for fast cleanup queries
CREATE INDEX IF NOT EXISTS idx_viewers_last_seen ON viewers (last_seen);

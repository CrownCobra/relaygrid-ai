CREATE TABLE IF NOT EXISTS leads (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  company TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT NOT NULL DEFAULT '',
  monthly_volume TEXT NOT NULL DEFAULT '',
  preferred TEXT NOT NULL DEFAULT 'email',
  problem TEXT NOT NULL,
  consent_contact INTEGER NOT NULL DEFAULT 0 CHECK (consent_contact IN (0, 1)),
  source TEXT NOT NULL DEFAULT 'website',
  created_at TEXT NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_leads_created_at ON leads(created_at);
CREATE INDEX IF NOT EXISTS idx_leads_email ON leads(email);

CREATE TABLE IF NOT EXISTS rate_limits (
  rate_key TEXT NOT NULL,
  action TEXT NOT NULL,
  hits INTEGER NOT NULL DEFAULT 0,
  window_start INTEGER NOT NULL,
  updated_at INTEGER NOT NULL,
  PRIMARY KEY (rate_key, action)
);

CREATE INDEX IF NOT EXISTS idx_rate_limits_updated_at ON rate_limits(updated_at);

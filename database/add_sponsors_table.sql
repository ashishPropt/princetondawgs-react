-- Add sponsors table for admin management
-- Run: psql -U postgres -d princetondawgs -f add_sponsors_table.sql

CREATE TABLE IF NOT EXISTS sponsors (
  id            SERIAL PRIMARY KEY,
  name          VARCHAR(150) NOT NULL,
  website_url   VARCHAR(500) DEFAULT NULL,
  logo_url      VARCHAR(500) DEFAULT NULL,
  bg_color      VARCHAR(20)  NOT NULL DEFAULT '#ffffff',
  tier          VARCHAR(20)  NOT NULL DEFAULT 'Paw Print' CHECK (tier IN ('Top Dawg','Dawg Pack','Paw Print')),
  scope         VARCHAR(10)  NOT NULL DEFAULT 'site' CHECK (scope IN ('site','event')),
  event_id      INT          REFERENCES events(id) ON DELETE SET NULL,
  display_order INT          NOT NULL DEFAULT 0,
  active        BOOLEAN      NOT NULL DEFAULT true,
  created_at    TIMESTAMPTZ  DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_sponsors_scope  ON sponsors(scope, active);
CREATE INDEX IF NOT EXISTS idx_sponsors_event  ON sponsors(event_id, active);

-- Seed with the 3 existing sponsors (Gold = Top Dawg)
INSERT INTO sponsors (name, website_url, bg_color, tier, scope, event_id, display_order, active) VALUES
('Alpha1 Partners',    'https://alpha1partners.com/',   '#ffffff', 'Top Dawg', 'event', 1, 1, true),
('Cedar Grove Catering','https://cedargrovecatering.com/', '#ffffff', 'Top Dawg', 'event', 1, 2, true),
('ProptXchange',       'https://proptxchange.com/',      '#0a0a0a', 'Top Dawg', 'event', 1, 3, true)
ON CONFLICT DO NOTHING;

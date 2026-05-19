-- Princeton Dawgs — PostgreSQL Schema
-- Run once: psql -U postgres -d princetondawgs -f schema.sql

CREATE EXTENSION IF NOT EXISTS "pgcrypto";

CREATE TABLE IF NOT EXISTS players (
  id            SERIAL PRIMARY KEY,
  name          VARCHAR(100) NOT NULL,
  email         VARCHAR(150) NOT NULL UNIQUE,
  password_hash VARCHAR(255) NOT NULL,
  ntrp          NUMERIC(2,1) NULL,
  phone         VARCHAR(30)  NULL,
  is_admin      BOOLEAN      NOT NULL DEFAULT false,
  created_at    TIMESTAMPTZ  DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS password_reset_tokens (
  player_id  INT UNIQUE REFERENCES players(id) ON DELETE CASCADE,
  token      VARCHAR(64) NOT NULL,
  expires_at TIMESTAMPTZ NOT NULL
);

CREATE TABLE IF NOT EXISTS events (
  id          SERIAL PRIMARY KEY,
  name        VARCHAR(150) NOT NULL,
  type        VARCHAR(20)  NOT NULL DEFAULT 'tournament' CHECK (type IN ('tournament','usta_league')),
  ntrp_level  NUMERIC(2,1) NULL,
  starts_on   DATE         NULL,
  description TEXT         NULL,
  status      VARCHAR(20)  NOT NULL DEFAULT 'active' CHECK (status IN ('active','completed','draft')),
  created_at  TIMESTAMPTZ  DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS event_registrations (
  id        SERIAL PRIMARY KEY,
  event_id  INT NOT NULL REFERENCES events(id) ON DELETE CASCADE,
  player_id INT NOT NULL REFERENCES players(id) ON DELETE CASCADE,
  joined_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE (event_id, player_id)
);

CREATE TABLE IF NOT EXISTS teams (
  id       SERIAL PRIMARY KEY,
  event_id INT NOT NULL REFERENCES events(id) ON DELETE CASCADE,
  name     VARCHAR(80) NOT NULL
);

CREATE TABLE IF NOT EXISTS player_teams (
  player_id INT NOT NULL REFERENCES players(id) ON DELETE CASCADE,
  team_id   INT NOT NULL REFERENCES teams(id)   ON DELETE CASCADE,
  PRIMARY KEY (player_id, team_id)
);

CREATE TABLE IF NOT EXISTS ties (
  id           SERIAL PRIMARY KEY,
  event_id     INT NOT NULL REFERENCES events(id) ON DELETE CASCADE,
  team_a_id    INT NOT NULL REFERENCES teams(id)  ON DELETE CASCADE,
  team_b_id    INT NOT NULL REFERENCES teams(id)  ON DELETE CASCADE,
  is_final     BOOLEAN  DEFAULT false,
  locked       BOOLEAN  DEFAULT false,
  scheduled_at TIMESTAMPTZ NULL
);

CREATE TABLE IF NOT EXISTS matches (
  id             SERIAL PRIMARY KEY,
  tie_id         INT NOT NULL REFERENCES ties(id) ON DELETE CASCADE,
  match_type     VARCHAR(2) NOT NULL CHECK (match_type IN ('S1','S2','D')),
  points_value   INT NOT NULL,
  team_a_player1 INT NULL,
  team_a_player2 INT NULL,
  team_b_player1 INT NULL,
  team_b_player2 INT NULL,
  score          VARCHAR(80) NULL,
  games_a        INT  DEFAULT 0,
  games_b        INT  DEFAULT 0,
  winner_team    CHAR(1) NULL,
  entered_by     INT NULL,
  entered_at     TIMESTAMPTZ NULL
);

CREATE TABLE IF NOT EXISTS opposition_teams (
  id           SERIAL PRIMARY KEY,
  event_id     INT NOT NULL REFERENCES events(id) ON DELETE CASCADE,
  name         VARCHAR(150) NOT NULL,
  contact_info VARCHAR(255) NULL
);

CREATE TABLE IF NOT EXISTS league_match_days (
  id                 SERIAL PRIMARY KEY,
  event_id           INT  NOT NULL REFERENCES events(id) ON DELETE CASCADE,
  opposition_team_id INT  NOT NULL REFERENCES opposition_teams(id) ON DELETE CASCADE,
  match_date         DATE NOT NULL,
  match_time         TIME NULL,
  location           VARCHAR(255) NULL,
  notes              TEXT NULL,
  status             VARCHAR(20) NOT NULL DEFAULT 'scheduled' CHECK (status IN ('scheduled','completed','cancelled'))
);

CREATE TABLE IF NOT EXISTS league_scores (
  id                  SERIAL PRIMARY KEY,
  league_match_day_id INT NOT NULL REFERENCES league_match_days(id) ON DELETE CASCADE,
  player_id           INT NOT NULL REFERENCES players(id) ON DELETE CASCADE,
  match_type          VARCHAR(10) NOT NULL DEFAULT 'singles' CHECK (match_type IN ('singles','doubles')),
  partner_name        VARCHAR(150) NULL,
  opponent1_name      VARCHAR(150) NOT NULL,
  opponent2_name      VARCHAR(150) NULL,
  score               VARCHAR(100) NOT NULL,
  result              VARCHAR(4) NOT NULL CHECK (result IN ('win','loss')),
  notes               TEXT NULL,
  entered_at          TIMESTAMPTZ DEFAULT NOW(),
  updated_at          TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS interest_submissions (
  id         SERIAL PRIMARY KEY,
  name       VARCHAR(150) NOT NULL,
  email      VARCHAR(150) NOT NULL,
  phone      VARCHAR(30)  NULL,
  ntrp       VARCHAR(10)  NULL,
  message    TEXT         NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS sponsor_inquiries (
  id         SERIAL PRIMARY KEY,
  name       VARCHAR(150) NOT NULL,
  company    VARCHAR(150) NULL,
  email      VARCHAR(150) NOT NULL,
  phone      VARCHAR(30)  NULL,
  tier       VARCHAR(50)  NULL,
  message    TEXT         NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_players_email ON players(email);
CREATE INDEX IF NOT EXISTS idx_er_event ON event_registrations(event_id);
CREATE INDEX IF NOT EXISTS idx_er_player ON event_registrations(player_id);
CREATE INDEX IF NOT EXISTS idx_ls_matchday ON league_scores(league_match_day_id);
CREATE INDEX IF NOT EXISTS idx_ls_player ON league_scores(player_id);

-- Seed data
INSERT INTO events (id, name, type, starts_on, description, status)
VALUES (1, 'Dawg Days of Summer 2026', 'tournament', '2026-07-15', 'Annual Princeton Dawgs club tournament — round-robin team format.', 'active')
ON CONFLICT DO NOTHING;

INSERT INTO events (id, name, type, ntrp_level, starts_on, description, status)
VALUES
  (2, 'USTA 3.0 Spring League 2026', 'usta_league', 3.0, '2026-03-01', 'USTA Adult 18+ 3.0 Spring 2026.', 'active'),
  (3, 'USTA 3.5 Spring League 2026', 'usta_league', 3.5, '2026-03-01', 'USTA Adult 18+ 3.5 Spring 2026.', 'active')
ON CONFLICT DO NOTHING;

SELECT setval('events_id_seq', (SELECT MAX(id) FROM events));

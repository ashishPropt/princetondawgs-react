-- Princeton Dawgs — Data Import (converted from MySQL)
-- Run: psql -U postgres -d princetondawgs -f import_data.sql

BEGIN;

-- Truncate all tables in dependency order (children first)
TRUNCATE TABLE matches, league_scores, league_match_days, player_teams,
               ties, event_registrations, opposition_teams,
               teams, interest_submissions, sponsor_inquiries,
               password_reset_tokens, players, events
RESTART IDENTITY CASCADE;

-- ── EVENTS ────────────────────────────────────────────────────────────────────
INSERT INTO events (id, name, type, ntrp_level, starts_on, description, status, created_at) VALUES
(1, 'Dawg Days of Summer 2026', 'tournament', NULL, '2026-07-15', 'Annual Princeton Dawgs club tournament — round-robin team format.', 'active', '2026-04-24 03:08:25+00'),
(2, 'USTA 3.0 Spring League 2025', 'usta_league', 3.0, '2025-03-01', 'USTA Adult 18+ 3.0 Spring 2025 — we play other club teams.', 'active', '2026-04-24 03:08:25+00'),
(3, 'USTA 3.5 Spring League 2025', 'usta_league', 3.5, '2025-03-01', 'USTA Adult 18+ 3.5 Spring 2025 — we play other club teams.', 'active', '2026-04-24 03:08:25+00');

SELECT setval('events_id_seq', (SELECT MAX(id) FROM events));

-- ── PLAYERS ───────────────────────────────────────────────────────────────────
-- Note: $2y$ (PHP) -> $2b$ (Node) prefix swap — passwords still work
INSERT INTO players (id, name, email, password_hash, ntrp, phone, is_admin, created_at) VALUES
(1,  'Ashish Mathur',       'ashish@proptxchange.com',   '$2b$10$w4q3mNbcLnKVIKyLKeqPGe6cd/h76dbn9dHgClvAU9B00CCq2/9aK', 3.0, '2013902835',   false, '2026-04-09 18:21:39+00'),
(3,  'Tito Martinez',       'kelphy_123@hotmail.com',    '$2b$10$NeNyX6ckxCFqzQsBGtrMXO8NXdU7BYVUO1yIC265M0P3bveoI/aYC', 3.0, '7324215539',   false, '2026-04-09 18:44:50+00'),
(4,  'Sachin Nade',         'sachinnade@gmail.com',      '$2b$10$ZrilkiMrMW7Eo6ejV.h05.HK6.h5Vc5Q3ggZkBjf7q3l4ndtFAkKC', 4.0, '404-518-2434', false, '2026-04-09 18:45:55+00'),
(5,  'UTSAV SEN',           'utsavsen@gmail.com',        '$2b$10$laGoth/2lWHfeEpfDUKnxOSY1DlI37g4pFos.Pxz7EFL428tRdeT6', 3.0, '2018038262',   false, '2026-04-09 18:47:29+00'),
(6,  'Jay Mehta',           'Jaymehta1@gmail.com',       '$2b$10$YiTz6cM1eSof0rMVbzw3UO3xwiu94BlPSl2J2G2gWCqXv5O7yyCLy', 3.5, '732.299.0206', false, '2026-04-09 18:47:59+00'),
(7,  'Srini',               'mandapakas@yahoo.com',      '$2b$10$2679FDJBunfinXWtJYkCqelhFe6VM3.iuSlS9KsBQD8GLxC66uJYq', 3.5, NULL,           false, '2026-04-09 19:00:08+00'),
(8,  'Binit K Agarwal',     'Agarwal_binit@yahoo.com',   '$2b$10$SjeMntgl3oWw/6FyRoG59eR2TQ/.dnBFh8X0o1KhOikQa60DkCLYG', 2.5, '6469121575',   false, '2026-04-09 19:33:38+00'),
(9,  'Kk',                  'kkvaradachari@gmail.com',   '$2b$10$oZSykTEz8aeH69WSe7T6oe/d9tLegbfYVoBRGKNdTA0Pmxx4ob2pa', 3.0, '7324767487',   false, '2026-04-09 19:37:08+00'),
(10, 'Amit Singh',          'tinku13@gmail.com',         '$2b$10$zpxUU67ngAu.lsqtDUOXs.qT05OrGQjTXesR.HeFx6JKVRNi8H4D.', 3.5, '3479526333',   false, '2026-04-09 19:44:23+00'),
(11, 'Manish Chandwani',    'manishchandwani@yahoo.com', '$2b$10$9hbnGSdFSYl6Qd3g0QNJFOVP.VDaJbGphCKGxnPOy37bub2jjhcfC', 3.5, '7326901080',   false, '2026-04-09 20:05:54+00'),
(12, 'Edmond Fernandes',    'reacheaf@yahoo.com',        '$2b$10$q8ewQs2CdEfUlxWw3vE4sufXJiDq7FKnuGckRUgOYK47XtYfTVw8.', 3.5, '732 742 8568', false, '2026-04-09 20:38:45+00'),
(13, 'Gaurav Kapoor',       'kapoorg@outlook.com',       '$2b$10$TX93YdYNBiItrOU08y322.1Gbw81CTG4g2k2g4gKZfc2vzzuLm89m', 3.5, '2012407080',   false, '2026-04-09 20:52:00+00'),
(14, 'Viral Shah',          'vbshah6@gmail.com',         '$2b$10$aADdEdw9lqWEzKZW2c4Li.Jm0Mm1sl3DsE.zHuJb0uDyEyfNWRihO', 3.0, NULL,           false, '2026-04-10 00:47:59+00'),
(15, 'Shaan Venkat',        'venkat.shaan@gmail.com',    '$2b$10$Cmj6mBTR6ARnLzUfBdc9wOt8Dz8IVZFIP0fY/NUbyQ8x2kVAWgw2a', 3.5, NULL,           false, '2026-04-10 02:27:42+00'),
(16, 'Greg Khoury',         'gregkhoury@gmail.com',      '$2b$10$Dj4sF6cD9/PnAcNEMc0b8uyRkN2kroS.L6ZdIgNe/HhN7DeQKFKcG', 3.0, '2017880211',   false, '2026-04-10 02:43:12+00'),
(17, 'Gulshan Khera',       'gulshankhera@yahoo.com',    '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6ToCFT8GYdFPJGE0v0zVTpBxOgK2', 3.0, NULL,           false, '2026-04-10 04:28:49+00'),
(18, 'Manish',              'manishbs@gmail.com',        '$2b$10$6V3nmxG1lS7q/0AmxalUROzWrtK0IiKcLqy6PzgINRhl2.JwiBopy', 3.5, NULL,           false, '2026-04-10 05:36:25+00'),
(19, 'Amitabh Patil',       'amitabhpatil@gmail.com',    '$2b$10$rYDpEufFh366eCTrqt/ODeYgIIjTtTbuzZsUlehVrrTHsIedtClx6', 3.5, '9083826755',   false, '2026-04-10 08:31:37+00'),
(20, 'Patryk Hirsz',        'PathHirsz@icloud.com',      '$2b$10$nPEV74V83QlYgfxX.z/JzeHIrBPVayQYlNNgrfa8y93.L5wEGV5Fu', 4.0, '6099167015',   false, '2026-04-10 23:30:13+00'),
(21, 'Robert Seraji',       'robertseraji@gmail.com',    '$2b$10$GolUnvMgsXcD9AT3hGcChO45aILZqwMttYaN.prnBJwsCRiLltkci', 4.0, '7328014870',   false, '2026-04-11 00:07:41+00'),
(22, 'Parag Katkar',        'paragkatkar@yahoo.com',     '$2b$10$///HURKJnRuJ.WpIeklwo.jtp.z2Nw.dKPvBed.pySbP6OUcnqYPO', 3.0, '8575443029',   false, '2026-04-11 10:18:39+00'),
(23, 'Thierry Sarr',        'thierrysarr@yahoo.com',     '$2b$10$n21RSzSrYG5zW7Ty/U0j4OxN4l8vwMK/S7wg1ZDlrAPHDH6LMB/IO', 3.0, '6463356012',   false, '2026-04-11 19:23:19+00'),
(24, 'Sanjeev Hegde',       'sanjeevh@yahoo.com',        '$2b$10$oK.fiskrTBVU7.oV0oumhu4tEu2C7MhC7Ad.sPJE3/rguCQHrSL/C', 3.5, '7328296967',   false, '2026-04-11 20:37:44+00'),
(26, 'Anand',               'anandbiyani@gmail.com',     '$2b$10$qV/Sh.RocwmJ/N8vAJ5v2.cTv37a0WVm8ig7A4wUHnj2lyYC6iXh6', 2.5, '6097915760',   false, '2026-04-11 21:10:52+00'),
(28, 'Ashish Mathur',       'amathur347@gmail.com',      '$2b$10$oDX.IzFRnJns6ATOlu/ck.4IEJyX3lHnfuM0Z0T/q7JrwG/pdcdxW', 3.0, '2013902835',   true,  '2026-04-24 03:52:15+00'),
(30, 'Ajay Malkowthekar',   'ajay@skildsolutions.com',   '$2b$10$0ZmHRAZy7355mWOr2eBZ9eOyxMojIikQ4Ts..04th626x8j3Y6diG', 3.5, '9737235359',   false, '2026-05-02 23:17:04+00');

SELECT setval('players_id_seq', (SELECT MAX(id) FROM players));

-- ── TEAMS ─────────────────────────────────────────────────────────────────────
INSERT INTO teams (id, event_id, name) VALUES
(94, 1, 'quetzals'),
(95, 1, 'Trogones'),
(96, 1, 'hummingbirds'),
(97, 1, 'ostriches'),
(98, 1, 'cassowarys'),
(99, 1, 'sparrows');

SELECT setval('teams_id_seq', (SELECT MAX(id) FROM teams));

-- ── PLAYER_TEAMS ──────────────────────────────────────────────────────────────
INSERT INTO player_teams (player_id, team_id) VALUES
(1, 96),(3, 95),(4, 96),(5, 98),(6, 95),(7, 99),
(8, 94),(9, 96),(10, 94),(11, 96),(12, 94),(13, 98),
(14, 99),(15, 97),(16, 97),(17, 99),(18, 97),(19, 99),
(20, 94),(21, 95),(22, 98),(23, 97),(24, 98),(26, 95);

-- ── TIES ──────────────────────────────────────────────────────────────────────
INSERT INTO ties (id, event_id, team_a_id, team_b_id, is_final, locked, scheduled_at) VALUES
(2,  1, 94, 95, false, false, NULL),
(3,  1, 94, 96, false, false, NULL),
(4,  1, 94, 97, false, false, NULL),
(5,  1, 94, 98, false, false, NULL),
(6,  1, 94, 99, false, false, NULL),
(7,  1, 95, 96, false, false, NULL),
(8,  1, 95, 97, false, false, NULL),
(9,  1, 95, 98, false, false, NULL),
(10, 1, 95, 99, false, false, NULL),
(11, 1, 96, 97, false, false, NULL),
(12, 1, 96, 98, false, false, NULL),
(13, 1, 96, 99, false, false, NULL),
(14, 1, 97, 98, false, false, NULL),
(15, 1, 97, 99, false, false, NULL),
(16, 1, 98, 99, false, false, NULL);

SELECT setval('ties_id_seq', (SELECT MAX(id) FROM ties));

-- ── MATCHES ───────────────────────────────────────────────────────────────────
INSERT INTO matches (id, tie_id, match_type, points_value, team_a_player1, team_a_player2, team_b_player1, team_b_player2, score, games_a, games_b, winner_team, entered_by, entered_at) VALUES
(4,  2,  'S1', 6, NULL,NULL,NULL,NULL,NULL,0,0,NULL,NULL,NULL),
(5,  2,  'S2', 4, NULL,NULL,NULL,NULL,NULL,0,0,NULL,NULL,NULL),
(6,  2,  'D',  3, NULL,NULL,NULL,NULL,NULL,0,0,NULL,NULL,NULL),
(7,  3,  'S1', 6, NULL,NULL,NULL,NULL,NULL,0,0,NULL,NULL,NULL),
(8,  3,  'S2', 4, NULL,NULL,NULL,NULL,NULL,0,0,NULL,NULL,NULL),
(9,  3,  'D',  3, NULL,NULL,NULL,NULL,NULL,0,0,NULL,NULL,NULL),
(10, 4,  'S1', 6, NULL,NULL,NULL,NULL,NULL,0,0,NULL,NULL,NULL),
(11, 4,  'S2', 4, NULL,NULL,NULL,NULL,NULL,0,0,NULL,NULL,NULL),
(12, 4,  'D',  3, NULL,NULL,NULL,NULL,NULL,0,0,NULL,NULL,NULL),
(13, 5,  'S1', 6, NULL,NULL,NULL,NULL,NULL,0,0,NULL,NULL,NULL),
(14, 5,  'S2', 4, NULL,NULL,NULL,NULL,NULL,0,0,NULL,NULL,NULL),
(15, 5,  'D',  3, NULL,NULL,NULL,NULL,NULL,0,0,NULL,NULL,NULL),
(16, 6,  'S1', 6, NULL,NULL,NULL,NULL,NULL,0,0,NULL,NULL,NULL),
(17, 6,  'S2', 4, NULL,NULL,NULL,NULL,NULL,0,0,NULL,NULL,NULL),
(18, 6,  'D',  3, NULL,NULL,NULL,NULL,NULL,0,0,NULL,NULL,NULL),
(19, 7,  'S1', 6, NULL,NULL,NULL,NULL,NULL,0,0,NULL,NULL,NULL),
(20, 7,  'S2', 4, NULL,NULL,NULL,NULL,NULL,0,0,NULL,NULL,NULL),
(21, 7,  'D',  3, NULL,NULL,NULL,NULL,NULL,0,0,NULL,NULL,NULL),
(22, 8,  'S1', 6, NULL,NULL,NULL,NULL,NULL,0,0,NULL,NULL,NULL),
(23, 8,  'S2', 4, NULL,NULL,NULL,NULL,NULL,0,0,NULL,NULL,NULL),
(24, 8,  'D',  3, NULL,NULL,NULL,NULL,NULL,0,0,NULL,NULL,NULL),
(25, 9,  'S1', 6, NULL,NULL,NULL,NULL,NULL,0,0,NULL,NULL,NULL),
(26, 9,  'S2', 4, NULL,NULL,NULL,NULL,NULL,0,0,NULL,NULL,NULL),
(27, 9,  'D',  3, NULL,NULL,NULL,NULL,NULL,0,0,NULL,NULL,NULL),
(28, 10, 'S1', 6, NULL,NULL,NULL,NULL,NULL,0,0,NULL,NULL,NULL),
(29, 10, 'S2', 4, NULL,NULL,NULL,NULL,NULL,0,0,NULL,NULL,NULL),
(30, 10, 'D',  3, NULL,NULL,NULL,NULL,NULL,0,0,NULL,NULL,NULL),
(31, 11, 'S1', 6, NULL,NULL,NULL,NULL,NULL,0,0,NULL,NULL,NULL),
(32, 11, 'S2', 4, NULL,NULL,NULL,NULL,NULL,0,0,NULL,NULL,NULL),
(33, 11, 'D',  3, NULL,NULL,NULL,NULL,NULL,0,0,NULL,NULL,NULL),
(34, 12, 'S1', 6, NULL,NULL,NULL,NULL,NULL,0,0,NULL,NULL,NULL),
(35, 12, 'S2', 4, NULL,NULL,NULL,NULL,NULL,0,0,NULL,NULL,NULL),
(36, 12, 'D',  3, NULL,NULL,NULL,NULL,NULL,0,0,NULL,NULL,NULL),
(37, 13, 'S1', 6, NULL,NULL,NULL,NULL,NULL,0,0,NULL,NULL,NULL),
(38, 13, 'S2', 4, NULL,NULL,NULL,NULL,NULL,0,0,NULL,NULL,NULL),
(39, 13, 'D',  3, NULL,NULL,NULL,NULL,NULL,0,0,NULL,NULL,NULL),
(40, 14, 'S1', 6, NULL,NULL,NULL,NULL,NULL,0,0,NULL,NULL,NULL),
(41, 14, 'S2', 4, NULL,NULL,NULL,NULL,NULL,0,0,NULL,NULL,NULL),
(42, 14, 'D',  3, NULL,NULL,NULL,NULL,NULL,0,0,NULL,NULL,NULL),
(43, 15, 'S1', 6, NULL,NULL,NULL,NULL,NULL,0,0,NULL,NULL,NULL),
(44, 15, 'S2', 4, NULL,NULL,NULL,NULL,NULL,0,0,NULL,NULL,NULL),
(45, 15, 'D',  3, NULL,NULL,NULL,NULL,NULL,0,0,NULL,NULL,NULL),
(46, 16, 'S1', 6, NULL,NULL,NULL,NULL,NULL,0,0,NULL,NULL,NULL),
(47, 16, 'S2', 4, NULL,NULL,NULL,NULL,NULL,0,0,NULL,NULL,NULL),
(48, 16, 'D',  3, NULL,NULL,NULL,NULL,NULL,0,0,NULL,NULL,NULL);

SELECT setval('matches_id_seq', (SELECT MAX(id) FROM matches));

-- ── EVENT REGISTRATIONS ───────────────────────────────────────────────────────
INSERT INTO event_registrations (id, event_id, player_id, joined_at) VALUES
(1,  1, 1,  '2026-04-24 15:52:29+00'),
(3,  1, 3,  '2026-04-24 15:52:29+00'),
(4,  1, 4,  '2026-04-24 15:52:29+00'),
(5,  1, 5,  '2026-04-24 15:52:29+00'),
(6,  1, 6,  '2026-04-24 15:52:29+00'),
(7,  1, 7,  '2026-04-24 15:52:29+00'),
(8,  1, 8,  '2026-04-24 15:52:29+00'),
(9,  1, 9,  '2026-04-24 15:52:29+00'),
(10, 1, 10, '2026-04-24 15:52:29+00'),
(11, 1, 11, '2026-04-24 15:52:29+00'),
(12, 1, 12, '2026-04-24 15:52:29+00'),
(13, 1, 13, '2026-04-24 15:52:29+00'),
(14, 1, 14, '2026-04-24 15:52:29+00'),
(15, 1, 15, '2026-04-24 15:52:29+00'),
(16, 1, 16, '2026-04-24 15:52:29+00'),
(17, 1, 17, '2026-04-24 15:52:29+00'),
(18, 1, 18, '2026-04-24 15:52:29+00'),
(19, 1, 19, '2026-04-24 15:52:29+00'),
(20, 1, 20, '2026-04-24 15:52:29+00'),
(21, 1, 21, '2026-04-24 15:52:29+00'),
(22, 1, 22, '2026-04-24 15:52:29+00'),
(23, 1, 23, '2026-04-24 15:52:29+00'),
(24, 1, 24, '2026-04-24 15:52:29+00'),
(25, 1, 26, '2026-04-24 15:52:29+00'),
(26, 2, 1,  '2026-05-02 20:13:40+00'),
(27, 3, 1,  '2026-05-02 20:13:44+00'),
(30, 3, 30, '2026-05-02 23:17:27+00'),
(31, 1, 30, '2026-05-02 23:17:28+00'),
(32, 3, 5,  '2026-05-03 15:21:18+00'),
(33, 2, 16, '2026-05-03 16:10:19+00'),
(34, 3, 16, '2026-05-03 16:10:34+00');

SELECT setval('event_registrations_id_seq', (SELECT MAX(id) FROM event_registrations));

COMMIT;

-- Verify
SELECT 'players' as tbl, COUNT(*) FROM players
UNION ALL SELECT 'events', COUNT(*) FROM events
UNION ALL SELECT 'teams', COUNT(*) FROM teams
UNION ALL SELECT 'ties', COUNT(*) FROM ties
UNION ALL SELECT 'matches', COUNT(*) FROM matches
UNION ALL SELECT 'player_teams', COUNT(*) FROM player_teams
UNION ALL SELECT 'event_registrations', COUNT(*) FROM event_registrations;

const router = require('express').Router()
const pool = require('../db/pool')

router.get('/:eventId/scores', async (req, res) => {
  const { eventId } = req.params
  try {
    const { rows } = await pool.query(`
      SELECT ls.*, p.name as player_name, lmd.match_date, ot.name as opponent_team
      FROM league_scores ls
      JOIN players p ON p.id = ls.player_id
      JOIN league_match_days lmd ON lmd.id = ls.league_match_day_id
      JOIN events e ON e.id = lmd.event_id
      JOIN opposition_teams ot ON ot.id = lmd.opposition_team_id
      WHERE lmd.event_id = $1
      ORDER BY lmd.match_date DESC
    `, [eventId])
    res.json(rows)
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Failed' })
  }
})

module.exports = router

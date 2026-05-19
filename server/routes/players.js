const router = require('express').Router()
const pool = require('../db/pool')
const { auth } = require('../middleware/auth')

router.get('/me/registrations', auth, async (req, res) => {
  try {
    const { rows } = await pool.query(`
      SELECT er.*, e.name as event_name, e.type, e.starts_on
      FROM event_registrations er
      JOIN events e ON e.id = er.event_id
      WHERE er.player_id = $1 AND e.type = 'tournament'
      ORDER BY er.joined_at DESC
    `, [req.user.id])
    res.json(rows)
  } catch (err) {
    res.status(500).json({ error: 'Failed' })
  }
})

router.get('/me/league-registrations', auth, async (req, res) => {
  try {
    const { rows } = await pool.query(`
      SELECT er.*, e.name as event_name, e.ntrp_level
      FROM event_registrations er
      JOIN events e ON e.id = er.event_id
      WHERE er.player_id = $1 AND e.type = 'usta_league'
      ORDER BY er.joined_at DESC
    `, [req.user.id])
    res.json(rows)
  } catch (err) {
    res.status(500).json({ error: 'Failed' })
  }
})

module.exports = router

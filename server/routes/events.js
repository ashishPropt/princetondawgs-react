const router = require('express').Router()
const pool = require('../db/pool')
const { auth } = require('../middleware/auth')

router.get('/', async (req, res) => {
  const { type } = req.query
  try {
    const query = type ? 'SELECT * FROM events WHERE type=$1 ORDER BY starts_on DESC' : 'SELECT * FROM events ORDER BY starts_on DESC'
    const { rows } = await pool.query(query, type ? [type] : [])
    res.json(rows)
  } catch (err) {
    res.status(500).json({ error: 'Failed' })
  }
})

router.get('/:id', async (req, res) => {
  const { id } = req.params
  try {
    const { rows: [event] } = await pool.query('SELECT * FROM events WHERE id=$1', [id])
    if (!event) return res.status(404).json({ error: 'Not found' })

    const { rows: teams } = await pool.query(`
      SELECT t.*, json_agg(p.name ORDER BY p.name) FILTER (WHERE p.name IS NOT NULL) as players
      FROM teams t
      LEFT JOIN player_teams pt ON pt.team_id = t.id
      LEFT JOIN players p ON p.id = pt.player_id
      WHERE t.event_id = $1
      GROUP BY t.id
    `, [id])

    const { rows: ties } = await pool.query(`
      SELECT ti.*, ta.name as team_a_name, tb.name as team_b_name
      FROM ties ti
      JOIN teams ta ON ta.id = ti.team_a_id
      JOIN teams tb ON tb.id = ti.team_b_id
      WHERE ti.event_id = $1
      ORDER BY ti.scheduled_at ASC NULLS LAST
    `, [id])

    res.json({ ...event, teams, ties })
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Failed' })
  }
})

router.post('/registrations', auth, async (req, res) => {
  const { event_id } = req.body
  if (!event_id) return res.status(400).json({ error: 'event_id required' })
  try {
    await pool.query('INSERT INTO event_registrations (event_id, player_id) VALUES ($1,$2)', [event_id, req.user.id])
    res.status(201).json({ message: 'Registered!' })
  } catch (err) {
    if (err.code === '23505') return res.status(409).json({ error: 'Already registered' })
    console.error(err)
    res.status(500).json({ error: 'Registration failed' })
  }
})

module.exports = router

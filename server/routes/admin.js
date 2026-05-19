const router = require('express').Router()
const pool = require('../db/pool')
const { adminAuth } = require('../middleware/auth')

router.use(adminAuth)

router.get('/players', async (req, res) => {
  const { rows } = await pool.query('SELECT id,name,email,ntrp,phone,is_admin,created_at FROM players ORDER BY created_at DESC')
  res.json(rows)
})

router.get('/events', async (req, res) => {
  const { rows } = await pool.query('SELECT * FROM events ORDER BY created_at DESC')
  res.json(rows)
})

router.post('/events', async (req, res) => {
  const { name, type, ntrp_level, starts_on, description } = req.body
  if (!name || !type) return res.status(400).json({ error: 'name and type required' })
  const { rows } = await pool.query(
    'INSERT INTO events (name, type, ntrp_level, starts_on, description) VALUES ($1,$2,$3,$4,$5) RETURNING *',
    [name, type, ntrp_level || null, starts_on || null, description || null]
  )
  res.status(201).json(rows[0])
})

router.patch('/events/:id', async (req, res) => {
  const { status } = req.body
  const { rows } = await pool.query('UPDATE events SET status=$1 WHERE id=$2 RETURNING *', [status, req.params.id])
  res.json(rows[0])
})

router.get('/interest', async (req, res) => {
  const { rows } = await pool.query('SELECT * FROM interest_submissions ORDER BY created_at DESC')
  res.json(rows)
})

router.get('/sponsors', async (req, res) => {
  const { rows } = await pool.query('SELECT * FROM sponsor_inquiries ORDER BY created_at DESC')
  res.json(rows)
})

router.get('/events/:id/registrations', async (req, res) => {
  const { rows } = await pool.query(`
    SELECT er.*, p.name, p.email, p.ntrp
    FROM event_registrations er
    JOIN players p ON p.id = er.player_id
    WHERE er.event_id = $1
    ORDER BY er.joined_at ASC
  `, [req.params.id])
  res.json(rows)
})

router.patch('/players/:id/admin', async (req, res) => {
  const { is_admin } = req.body
  const { rows } = await pool.query('UPDATE players SET is_admin=$1 WHERE id=$2 RETURNING id,name,is_admin', [is_admin, req.params.id])
  res.json(rows[0])
})

module.exports = router

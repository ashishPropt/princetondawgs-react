const router = require('express').Router()
const pool = require('../db/pool')

router.get('/stats', async (req, res) => {
  try {
    const [playerCount, ntrpRows, recentRegs] = await Promise.all([
      pool.query('SELECT COUNT(*) FROM players'),
      pool.query('SELECT ntrp, COUNT(*) as cnt FROM players WHERE ntrp IS NOT NULL GROUP BY ntrp ORDER BY ntrp DESC'),
      pool.query(`SELECT p.name, er.joined_at as created_at FROM event_registrations er JOIN players p ON p.id = er.player_id JOIN events e ON e.id = er.event_id WHERE e.type = 'tournament' ORDER BY er.joined_at DESC LIMIT 5`)
    ])
    res.json({
      playerCount: parseInt(playerCount.rows[0].count),
      ntrpRows: ntrpRows.rows.map(r => ({ ntrp: r.ntrp, cnt: parseInt(r.cnt) })),
      recentRegs: recentRegs.rows
    })
  } catch (err) {
    console.error(err)
    res.json({ playerCount: 30, ntrpRows: [], recentRegs: [] })
  }
})

router.get('/players', async (req, res) => {
  try {
    const { rows } = await pool.query('SELECT id, name, ntrp, is_admin FROM players ORDER BY ntrp DESC NULLS LAST, name ASC')
    res.json(rows)
  } catch (err) {
    res.status(500).json({ error: 'Failed' })
  }
})

router.post('/interest', async (req, res) => {
  const { first_name, last_name, email, ntrp, interests } = req.body
  if (!first_name || !email) return res.status(400).json({ error: 'Name and email required' })
  const name = `${first_name.trim()} ${last_name?.trim() || ''}`.trim()
  const message = Array.isArray(interests) ? interests.join(', ') : ''
  try {
    await pool.query('INSERT INTO interest_submissions (name, email, ntrp, message) VALUES ($1,$2,$3,$4)',
      [name, email.toLowerCase().trim(), ntrp || null, message])
    res.json({ message: 'Received!' })
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Failed to save' })
  }
})

router.post('/sponsor-inquiry', async (req, res) => {
  const { name, company, email, phone, tier, message } = req.body
  if (!name || !email) return res.status(400).json({ error: 'Name and email required' })
  try {
    await pool.query('INSERT INTO sponsor_inquiries (name, company, email, phone, tier, message) VALUES ($1,$2,$3,$4,$5,$6)',
      [name, company || null, email.toLowerCase().trim(), phone || null, tier || null, message || null])
    res.json({ message: 'Inquiry received!' })
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Failed to save' })
  }
})

module.exports = router

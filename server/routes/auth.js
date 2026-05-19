const router = require('express').Router()
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const crypto = require('crypto')
const pool = require('../db/pool')
const { auth } = require('../middleware/auth')

const sign = (user) => jwt.sign(
  { id: user.id, email: user.email, name: user.name, is_admin: user.is_admin, ntrp: user.ntrp },
  process.env.JWT_SECRET,
  { expiresIn: '7d' }
)

router.post('/register', async (req, res) => {
  const { name, email, phone, ntrp, password } = req.body
  if (!name || !email || !password) return res.status(400).json({ error: 'name, email, password required' })
  if (password.length < 8) return res.status(400).json({ error: 'Password must be at least 8 characters' })
  try {
    const hash = await bcrypt.hash(password, 12)
    const result = await pool.query(
      'INSERT INTO players (name, email, phone, ntrp, password_hash) VALUES ($1,$2,$3,$4,$5) RETURNING *',
      [name.trim(), email.toLowerCase().trim(), phone || null, ntrp || null, hash]
    )
    res.status(201).json({ user: result.rows[0] })
  } catch (err) {
    if (err.code === '23505') return res.status(409).json({ error: 'Email already registered' })
    console.error(err)
    res.status(500).json({ error: 'Registration failed' })
  }
})

router.post('/login', async (req, res) => {
  const { email, password } = req.body
  if (!email || !password) return res.status(400).json({ error: 'Email and password required' })
  try {
    const { rows } = await pool.query('SELECT * FROM players WHERE email = $1', [email.toLowerCase().trim()])
    const user = rows[0]
    if (!user) return res.status(401).json({ error: 'Invalid credentials' })
    const ok = await bcrypt.compare(password, user.password_hash)
    if (!ok) return res.status(401).json({ error: 'Invalid credentials' })
    res.json({ token: sign(user), user: { id: user.id, name: user.name, email: user.email, ntrp: user.ntrp, is_admin: user.is_admin } })
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Login failed' })
  }
})

router.get('/me', auth, async (req, res) => {
  try {
    const { rows } = await pool.query('SELECT id,name,email,ntrp,phone,is_admin,created_at FROM players WHERE id = $1', [req.user.id])
    if (!rows[0]) return res.status(404).json({ error: 'User not found' })
    res.json({ user: rows[0] })
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch user' })
  }
})

router.post('/forgot-password', async (req, res) => {
  const { email } = req.body
  try {
    const { rows } = await pool.query('SELECT * FROM players WHERE email=$1', [email?.toLowerCase().trim()])
    if (rows[0]) {
      const token = crypto.randomBytes(32).toString('hex')
      const expires = new Date(Date.now() + 3600000)
      await pool.query(
        'INSERT INTO password_reset_tokens (player_id, token, expires_at) VALUES ($1,$2,$3) ON CONFLICT (player_id) DO UPDATE SET token=$2, expires_at=$3',
        [rows[0].id, token, expires]
      )
      console.log(`Password reset token for ${email}: ${token}`)
    }
    res.json({ message: 'If that email exists, a reset link was sent.' })
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Failed' })
  }
})

router.post('/reset-password', async (req, res) => {
  const { token, password } = req.body
  if (!token || !password || password.length < 8) return res.status(400).json({ error: 'Invalid request' })
  try {
    const { rows } = await pool.query('SELECT * FROM password_reset_tokens WHERE token=$1 AND expires_at > NOW()', [token])
    if (!rows[0]) return res.status(400).json({ error: 'Invalid or expired token' })
    const hash = await bcrypt.hash(password, 12)
    await pool.query('UPDATE players SET password_hash=$1 WHERE id=$2', [hash, rows[0].player_id])
    await pool.query('DELETE FROM password_reset_tokens WHERE player_id=$1', [rows[0].player_id])
    res.json({ message: 'Password updated' })
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Reset failed' })
  }
})

module.exports = router

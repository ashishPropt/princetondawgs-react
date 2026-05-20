const router = require('express').Router()
const pool = require('../db/pool')
const { adminAuth } = require('../middleware/auth')
const multer = require('multer')
const path = require('path')
const fs = require('fs')

router.use(adminAuth)

// ── File upload setup ─────────────────────────────────────────────────────────
const uploadDir = path.join(__dirname, '../../client/dist/uploads/sponsors')
// ensure upload dir exists (created at runtime)
const ensureUploadDir = () => {
  if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true })
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    ensureUploadDir()
    cb(null, uploadDir)
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase()
    const safeName = file.originalname.replace(/[^a-zA-Z0-9._-]/g, '_').replace(/\s+/g,'_')
    cb(null, `${Date.now()}_${safeName}`)
  }
})

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
  fileFilter: (req, file, cb) => {
    const allowed = ['.png','.jpg','.jpeg','.gif','.svg','.webp']
    const ext = path.extname(file.originalname).toLowerCase()
    if (allowed.includes(ext)) cb(null, true)
    else cb(new Error('Only image files allowed (png, jpg, gif, svg, webp)'))
  }
})

// ── Upload sponsor logo ───────────────────────────────────────────────────────
router.post('/sponsors/upload', upload.single('logo'), (req, res) => {
  if (!req.file) return res.status(400).json({ error: 'No file uploaded' })
  const url = `/uploads/sponsors/${req.file.filename}`
  res.json({ url, filename: req.file.filename })
})

// ── Players ───────────────────────────────────────────────────────────────────
router.get('/players', async (req, res) => {
  const { rows } = await pool.query('SELECT id,name,email,ntrp,phone,is_admin,created_at FROM players ORDER BY created_at DESC')
  res.json(rows)
})

router.patch('/players/:id/admin', async (req, res) => {
  const { is_admin } = req.body
  const { rows } = await pool.query('UPDATE players SET is_admin=$1 WHERE id=$2 RETURNING id,name,is_admin', [is_admin, req.params.id])
  res.json(rows[0])
})

// ── Events ────────────────────────────────────────────────────────────────────
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

// ── Sponsors ──────────────────────────────────────────────────────────────────
router.get('/sponsors', async (req, res) => {
  const { rows } = await pool.query(`
    SELECT s.*, e.name as event_name
    FROM sponsors s
    LEFT JOIN events e ON e.id = s.event_id
    ORDER BY s.display_order ASC, s.created_at DESC
  `)
  res.json(rows)
})

router.post('/sponsors', async (req, res) => {
  const { name, website_url, logo_url, bg_color, tier, scope, event_id, display_order } = req.body
  if (!name) return res.status(400).json({ error: 'name required' })
  try {
    const { rows } = await pool.query(
      'INSERT INTO sponsors (name, website_url, logo_url, bg_color, tier, scope, event_id, display_order) VALUES ($1,$2,$3,$4,$5,$6,$7,$8) RETURNING *',
      [name, website_url || null, logo_url || null, bg_color || '#ffffff', tier || 'Paw Print', scope || 'site', event_id || null, display_order || 0]
    )
    res.status(201).json(rows[0])
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Failed to create sponsor' })
  }
})

router.patch('/sponsors/:id', async (req, res) => {
  const { name, website_url, logo_url, bg_color, tier, scope, event_id, display_order, active } = req.body
  try {
    const { rows } = await pool.query(
      `UPDATE sponsors SET
        name=$1, website_url=$2, logo_url=$3, bg_color=$4,
        tier=$5, scope=$6, event_id=$7, display_order=$8, active=$9
       WHERE id=$10 RETURNING *`,
      [name, website_url || null, logo_url || null, bg_color || '#ffffff',
       tier, scope, event_id || null, display_order ?? 0, active ?? true, req.params.id]
    )
    if (!rows[0]) return res.status(404).json({ error: 'Not found' })
    res.json(rows[0])
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Failed to update sponsor' })
  }
})

router.delete('/sponsors/:id', async (req, res) => {
  // Also delete the uploaded file if it's a local upload
  try {
    const { rows } = await pool.query('SELECT logo_url FROM sponsors WHERE id=$1', [req.params.id])
    if (rows[0]?.logo_url?.startsWith('/uploads/sponsors/')) {
      const filePath = path.join(__dirname, '../../client/dist', rows[0].logo_url)
      if (fs.existsSync(filePath)) fs.unlinkSync(filePath)
    }
  } catch {}
  await pool.query('DELETE FROM sponsors WHERE id=$1', [req.params.id])
  res.json({ message: 'Deleted' })
})

// ── Interest ──────────────────────────────────────────────────────────────────
router.get('/interest', async (req, res) => {
  const { rows } = await pool.query('SELECT * FROM interest_submissions ORDER BY created_at DESC')
  res.json(rows)
})

module.exports = router

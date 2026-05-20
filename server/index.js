require('dotenv').config()
const express = require('express')
const cors = require('cors')
const helmet = require('helmet')
const rateLimit = require('express-rate-limit')
const path = require('path')
const fs = require('fs')

const app = express()
const PORT = process.env.PORT || 3001

// Persistent uploads dir — lives OUTSIDE client/dist so deploys don't wipe it
const UPLOADS_DIR = path.join(__dirname, '../uploads')
if (!fs.existsSync(UPLOADS_DIR)) fs.mkdirSync(UPLOADS_DIR, { recursive: true })
if (!fs.existsSync(path.join(UPLOADS_DIR, 'sponsors'))) fs.mkdirSync(path.join(UPLOADS_DIR, 'sponsors'), { recursive: true })

app.use(helmet({ contentSecurityPolicy: false }))
app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:5173',
  credentials: true
}))
app.use(express.json({ limit: '10mb' }))

// Serve uploaded files at /uploads/*
app.use('/uploads', express.static(UPLOADS_DIR))

// Rate limiting
app.use('/api/auth', rateLimit({ windowMs: 15 * 60 * 1000, max: 20, message: { error: 'Too many requests' } }))
app.use('/api', rateLimit({ windowMs: 1 * 60 * 1000, max: 300 }))

// API routes
app.use('/api/auth',    require('./routes/auth'))
app.use('/api/public',  require('./routes/public'))
app.use('/api/events',  require('./routes/events'))
app.use('/api/event-registrations', require('./routes/events'))
app.use('/api/players', require('./routes/players'))
app.use('/api/leagues', require('./routes/leagues'))
app.use('/api/admin',   require('./routes/admin'))

// Health check
app.get('/api/health', (req, res) => res.json({ status: 'ok', time: new Date().toISOString() }))

// Serve React build in production
if (process.env.NODE_ENV === 'production') {
  const clientBuild = path.join(__dirname, '../client/dist')
  app.use(express.static(clientBuild))
  app.get('*', (req, res) => {
    res.sendFile(path.join(clientBuild, 'index.html'))
  })
}

app.listen(PORT, () => console.log(`Princeton Dawgs server running on :${PORT}`))

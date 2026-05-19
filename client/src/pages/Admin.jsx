import { useState, useEffect } from 'react'
import { NavLink, Routes, Route, Navigate } from 'react-router-dom'
import api from '../api/axios'
import toast from 'react-hot-toast'

function AdminPlayers() {
  const [players, setPlayers] = useState([])
  useEffect(() => { api.get('/admin/players').then(r => setPlayers(r.data)).catch(() => {}) }, [])
  return (
    <div>
      <h2 style={{ marginTop: 0 }}>Players ({players.length})</h2>
      <div style={{ background: '#fff', borderRadius: 12, overflow: 'hidden', boxShadow: '0 1px 4px rgba(0,0,0,0.06)' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.9rem' }}>
          <thead><tr style={{ background: 'var(--pd-dark)', color: '#fff' }}>
            <th style={{ padding: '0.75rem 1rem', textAlign: 'left' }}>Name</th>
            <th style={{ padding: '0.75rem 1rem', textAlign: 'left' }}>Email</th>
            <th style={{ padding: '0.75rem 1rem', textAlign: 'center' }}>NTRP</th>
            <th style={{ padding: '0.75rem 1rem', textAlign: 'center' }}>Admin</th>
            <th style={{ padding: '0.75rem 1rem', textAlign: 'left' }}>Joined</th>
          </tr></thead>
          <tbody>
            {players.map((p, i) => (
              <tr key={p.id} style={{ borderBottom: '1px solid #f0f0f0', background: i % 2 === 0 ? '#fff' : '#fafafa' }}>
                <td style={{ padding: '0.75rem 1rem', fontWeight: 600 }}>{p.name}</td>
                <td style={{ padding: '0.75rem 1rem', color: '#666' }}>{p.email}</td>
                <td style={{ padding: '0.75rem 1rem', textAlign: 'center' }}>{p.ntrp || '—'}</td>
                <td style={{ padding: '0.75rem 1rem', textAlign: 'center' }}>{p.is_admin ? '✓' : ''}</td>
                <td style={{ padding: '0.75rem 1rem', color: '#888', fontSize: '0.82rem' }}>{new Date(p.created_at).toLocaleDateString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

function AdminEvents() {
  const [events, setEvents] = useState([])
  const [form, setForm] = useState({ name: '', type: 'tournament', ntrp_level: '', starts_on: '', description: '' })
  const set = (f) => (e) => setForm(p => ({ ...p, [f]: e.target.value }))

  const load = () => api.get('/admin/events').then(r => setEvents(r.data)).catch(() => {})
  useEffect(() => { load() }, [])

  const handleCreate = async (e) => {
    e.preventDefault()
    try {
      await api.post('/admin/events', form)
      toast.success('Event created!')
      load()
      setForm({ name: '', type: 'tournament', ntrp_level: '', starts_on: '', description: '' })
    } catch { toast.error('Failed to create event') }
  }

  return (
    <div>
      <h2 style={{ marginTop: 0 }}>Events</h2>
      <div style={{ background: '#fff', borderRadius: 16, padding: '1.5rem', marginBottom: '2rem', boxShadow: '0 1px 4px rgba(0,0,0,0.06)' }}>
        <h3 style={{ marginTop: 0 }}>Create Event</h3>
        <form onSubmit={handleCreate} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
          <div className="pd-form-group" style={{ gridColumn: '1/-1' }}><label>Event Name *</label><input required value={form.name} onChange={set('name')} /></div>
          <div className="pd-form-group"><label>Type</label><select value={form.type} onChange={set('type')}><option value="tournament">Tournament</option><option value="usta_league">USTA League</option></select></div>
          <div className="pd-form-group"><label>Starts On</label><input type="date" value={form.starts_on} onChange={set('starts_on')} /></div>
          {form.type === 'usta_league' && <div className="pd-form-group"><label>NTRP Level</label><select value={form.ntrp_level} onChange={set('ntrp_level')}><option value="">Select…</option>{['2.5','3.0','3.5','4.0'].map(v => <option key={v} value={v}>{v}</option>)}</select></div>}
          <div className="pd-form-group" style={{ gridColumn: '1/-1' }}><label>Description</label><textarea rows={3} value={form.description} onChange={set('description')} style={{ width:'100%', padding:'0.65rem', border:'1.5px solid #e0e0e0', borderRadius:8, fontFamily:'inherit', fontSize:'0.9rem', resize:'vertical' }} /></div>
          <button type="submit" className="pd-btn pd-btn-primary">Create Event</button>
        </form>
      </div>
      <div style={{ display: 'grid', gap: '1rem' }}>
        {events.map(e => (
          <div key={e.id} style={{ background: '#fff', borderRadius: 12, padding: '1.25rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', boxShadow: '0 1px 4px rgba(0,0,0,0.06)' }}>
            <div>
              <div style={{ fontWeight: 600 }}>{e.name}</div>
              <div style={{ fontSize: '0.8rem', color: '#888' }}>{e.type} · {e.status} {e.starts_on ? `· ${new Date(e.starts_on).toLocaleDateString()}` : ''}</div>
            </div>
            <span style={{ background: e.status === 'active' ? 'var(--pd-green)' : '#e0e0e0', color: e.status === 'active' ? '#fff' : '#666', padding: '0.25rem 0.75rem', borderRadius: 100, fontSize: '0.78rem', fontWeight: 700 }}>{e.status}</span>
          </div>
        ))}
      </div>
    </div>
  )
}

function AdminInterest() {
  const [items, setItems] = useState([])
  useEffect(() => { api.get('/admin/interest').then(r => setItems(r.data)).catch(() => {}) }, [])
  return (
    <div>
      <h2 style={{ marginTop: 0 }}>Interest Submissions ({items.length})</h2>
      <div style={{ display: 'grid', gap: '1rem' }}>
        {items.map(s => (
          <div key={s.id} style={{ background: '#fff', borderRadius: 12, padding: '1.25rem', boxShadow: '0 1px 4px rgba(0,0,0,0.06)' }}>
            <div style={{ fontWeight: 600 }}>{s.name} — <span style={{ color: '#666', fontWeight: 400 }}>{s.email}</span></div>
            <div style={{ fontSize: '0.82rem', color: '#888', marginTop: '0.25rem' }}>NTRP: {s.ntrp || '—'} · {new Date(s.created_at).toLocaleDateString()}</div>
            {s.message && <div style={{ marginTop: '0.5rem', fontSize: '0.88rem', color: '#555' }}>{s.message}</div>}
          </div>
        ))}
      </div>
    </div>
  )
}

export default function Admin() {
  const links = [
    { to: '/admin/players', label: '👥 Players' },
    { to: '/admin/events', label: '🗓 Events' },
    { to: '/admin/interest', label: '📬 Interest Forms' },
  ]
  return (
    <div className="pd-admin">
      <div className="pd-admin-sidebar">
        <div style={{ color: 'var(--pd-orange)', fontWeight: 700, marginBottom: '1.5rem', fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '0.08em' }}>Admin Panel</div>
        {links.map(l => <NavLink key={l.to} to={l.to} className={({ isActive }) => isActive ? 'active' : ''}>{l.label}</NavLink>)}
      </div>
      <div className="pd-admin-content">
        <Routes>
          <Route index element={<Navigate to="players" replace />} />
          <Route path="players" element={<AdminPlayers />} />
          <Route path="events" element={<AdminEvents />} />
          <Route path="interest" element={<AdminInterest />} />
        </Routes>
      </div>
    </div>
  )
}

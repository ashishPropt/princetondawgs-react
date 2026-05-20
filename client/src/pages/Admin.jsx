import { useState, useEffect } from 'react'
import { NavLink, Routes, Route, Navigate } from 'react-router-dom'
import api from '../api/axios'
import toast from 'react-hot-toast'

// ── Admin Players ─────────────────────────────────────────────────────────────
function AdminPlayers() {
  const [players, setPlayers] = useState([])
  useEffect(() => { api.get('/admin/players').then(r => setPlayers(r.data)).catch(() => {}) }, [])

  const toggleAdmin = async (p) => {
    try {
      await api.patch(`/admin/players/${p.id}/admin`, { is_admin: !p.is_admin })
      setPlayers(ps => ps.map(x => x.id === p.id ? { ...x, is_admin: !p.is_admin } : x))
      toast.success(`${p.name} admin status updated`)
    } catch { toast.error('Failed') }
  }

  return (
    <div>
      <h2 style={{ marginTop: 0 }}>Players ({players.length})</h2>
      <div style={{ background: '#fff', borderRadius: 12, overflow: 'hidden', boxShadow: '0 1px 4px rgba(0,0,0,0.06)' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.88rem' }}>
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
                <td style={{ padding: '0.75rem 1rem', textAlign: 'center' }}>
                  <button onClick={() => toggleAdmin(p)} style={{ background: p.is_admin ? 'var(--pd-orange)' : '#e0e0e0', color: p.is_admin ? '#fff' : '#666', border: 'none', borderRadius: 100, padding: '0.2rem 0.7rem', fontSize: '0.75rem', cursor: 'pointer', fontWeight: 700 }}>
                    {p.is_admin ? 'Admin' : 'Player'}
                  </button>
                </td>
                <td style={{ padding: '0.75rem 1rem', color: '#888', fontSize: '0.82rem' }}>{new Date(p.created_at).toLocaleDateString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

// ── Admin Events ──────────────────────────────────────────────────────────────
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

  const toggleStatus = async (ev) => {
    const next = ev.status === 'active' ? 'completed' : 'active'
    await api.patch(`/admin/events/${ev.id}`, { status: next })
    load()
  }

  return (
    <div>
      <h2 style={{ marginTop: 0 }}>Events</h2>
      <div style={{ background: '#fff', borderRadius: 16, padding: '1.5rem', marginBottom: '2rem', boxShadow: '0 1px 4px rgba(0,0,0,0.06)' }}>
        <h3 style={{ marginTop: 0, fontSize: '1rem' }}>Create Event</h3>
        <form onSubmit={handleCreate} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
          <div className="pd-form-group" style={{ gridColumn: '1/-1' }}><label>Event Name *</label><input required value={form.name} onChange={set('name')} /></div>
          <div className="pd-form-group"><label>Type</label><select value={form.type} onChange={set('type')}><option value="tournament">Tournament</option><option value="usta_league">USTA League</option></select></div>
          <div className="pd-form-group"><label>Starts On</label><input type="date" value={form.starts_on} onChange={set('starts_on')} /></div>
          {form.type === 'usta_league' && <div className="pd-form-group"><label>NTRP Level</label><select value={form.ntrp_level} onChange={set('ntrp_level')}><option value="">Select…</option>{['2.5','3.0','3.5','4.0'].map(v => <option key={v} value={v}>{v}</option>)}</select></div>}
          <div className="pd-form-group" style={{ gridColumn: '1/-1' }}><label>Description</label><textarea rows={2} value={form.description} onChange={set('description')} style={{ width:'100%', padding:'0.65rem', border:'1.5px solid #e0e0e0', borderRadius:8, fontFamily:'inherit', fontSize:'0.9rem', resize:'vertical' }} /></div>
          <button type="submit" className="pd-btn pd-btn-primary" style={{ width: 'fit-content' }}>Create Event</button>
        </form>
      </div>
      <div style={{ display: 'grid', gap: '0.75rem' }}>
        {events.map(e => (
          <div key={e.id} style={{ background: '#fff', borderRadius: 12, padding: '1rem 1.25rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', boxShadow: '0 1px 4px rgba(0,0,0,0.06)' }}>
            <div>
              <div style={{ fontWeight: 600 }}>{e.name}</div>
              <div style={{ fontSize: '0.8rem', color: '#888' }}>{e.type} {e.ntrp_level ? `· NTRP ${e.ntrp_level}` : ''} {e.starts_on ? `· ${new Date(e.starts_on).toLocaleDateString()}` : ''}</div>
            </div>
            <button onClick={() => toggleStatus(e)} style={{ background: e.status === 'active' ? 'var(--pd-green)' : '#e0e0e0', color: e.status === 'active' ? '#fff' : '#666', border: 'none', borderRadius: 100, padding: '0.25rem 0.9rem', fontSize: '0.78rem', fontWeight: 700, cursor: 'pointer' }}>{e.status}</button>
          </div>
        ))}
      </div>
    </div>
  )
}

// ── Admin Sponsors ─────────────────────────────────────────────────────────────
const BLANK = { name: '', website_url: '', logo_url: '', bg_color: '#ffffff', tier: 'Top Dawg', scope: 'event', event_id: '', display_order: 0, active: true }
const TIER_COLORS = { 'Top Dawg': '#92400e', 'Dawg Pack': '#475569', 'Paw Print': '#166534' }
const TIER_BG = { 'Top Dawg': '#fef9c3', 'Dawg Pack': '#f1f5f9', 'Paw Print': '#f0fdf4' }

function AdminSponsors() {
  const [sponsors, setSponsors] = useState([])
  const [events, setEvents] = useState([])
  const [form, setForm] = useState(BLANK)
  const [editing, setEditing] = useState(null) // null = create mode, id = edit mode
  const [showForm, setShowForm] = useState(false)

  const load = () => api.get('/admin/sponsors').then(r => setSponsors(r.data)).catch(() => {})
  useEffect(() => {
    load()
    api.get('/events').then(r => setEvents(r.data)).catch(() => {})
  }, [])

  const set = (f) => (e) => {
    const val = e.target.type === 'checkbox' ? e.target.checked : e.target.value
    setForm(p => ({ ...p, [f]: val }))
  }

  const openCreate = () => { setForm(BLANK); setEditing(null); setShowForm(true) }
  const openEdit = (s) => {
    setForm({ name: s.name, website_url: s.website_url || '', logo_url: s.logo_url || '', bg_color: s.bg_color || '#ffffff', tier: s.tier, scope: s.scope, event_id: s.event_id || '', display_order: s.display_order || 0, active: s.active })
    setEditing(s.id)
    setShowForm(true)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      if (editing) {
        await api.patch(`/admin/sponsors/${editing}`, form)
        toast.success('Sponsor updated!')
      } else {
        await api.post('/admin/sponsors', form)
        toast.success('Sponsor added!')
      }
      setShowForm(false)
      setEditing(null)
      load()
    } catch { toast.error('Failed to save sponsor') }
  }

  const toggleActive = async (s) => {
    await api.patch(`/admin/sponsors/${s.id}`, { ...s, active: !s.active })
    load()
    toast.success(`${s.name} ${!s.active ? 'activated' : 'deactivated'}`)
  }

  const handleDelete = async (s) => {
    if (!window.confirm(`Delete ${s.name}? This cannot be undone.`)) return
    await api.delete(`/admin/sponsors/${s.id}`)
    toast.success('Sponsor deleted')
    load()
  }

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
        <h2 style={{ margin: 0 }}>Sponsors ({sponsors.length})</h2>
        <button onClick={openCreate} className="pd-btn pd-btn-primary" style={{ padding: '0.5rem 1.25rem', fontSize: '0.9rem' }}>+ Add Sponsor</button>
      </div>

      {/* Sponsor Form */}
      {showForm && (
        <div style={{ background: '#fff', borderRadius: 16, padding: '1.75rem', marginBottom: '2rem', boxShadow: '0 2px 12px rgba(0,0,0,0.1)', border: '2px solid var(--pd-orange)' }}>
          <h3 style={{ marginTop: 0, fontSize: '1rem' }}>{editing ? 'Edit Sponsor' : 'Add New Sponsor'}</h3>
          <form onSubmit={handleSubmit}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <div className="pd-form-group" style={{ gridColumn: '1/-1' }}><label>Sponsor Name *</label><input required value={form.name} onChange={set('name')} placeholder="Acme Corp" /></div>
              <div className="pd-form-group"><label>Website URL</label><input value={form.website_url} onChange={set('website_url')} placeholder="https://example.com" /></div>
              <div className="pd-form-group"><label>Logo URL</label><input value={form.logo_url} onChange={set('logo_url')} placeholder="https://... or /uploads/..." /></div>
              <div className="pd-form-group">
                <label>Tier</label>
                <select value={form.tier} onChange={set('tier')}>
                  <option value="Top Dawg">🏆 Top Dawg ($1,000)</option>
                  <option value="Dawg Pack">🐾 Dawg Pack ($500)</option>
                  <option value="Paw Print">🐾 Paw Print ($250)</option>
                </select>
              </div>
              <div className="pd-form-group">
                <label>Scope</label>
                <select value={form.scope} onChange={set('scope')}>
                  <option value="event">Event-specific</option>
                  <option value="site">Site-wide</option>
                </select>
              </div>
              {form.scope === 'event' && (
                <div className="pd-form-group">
                  <label>Associated Event</label>
                  <select value={form.event_id} onChange={set('event_id')}>
                    <option value="">— Select event —</option>
                    {events.map(e => <option key={e.id} value={e.id}>{e.name}</option>)}
                  </select>
                </div>
              )}
              <div className="pd-form-group">
                <label>Background Color</label>
                <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                  <input type="color" value={form.bg_color} onChange={set('bg_color')} style={{ width: 48, height: 36, padding: 2, border: '1px solid #ddd', borderRadius: 6, cursor: 'pointer' }} />
                  <input value={form.bg_color} onChange={set('bg_color')} placeholder="#ffffff" style={{ flex: 1 }} />
                </div>
              </div>
              <div className="pd-form-group">
                <label>Display Order</label>
                <input type="number" value={form.display_order} onChange={set('display_order')} min={0} />
              </div>
              <div className="pd-form-group" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginTop: '1.5rem' }}>
                <input type="checkbox" id="active" checked={form.active} onChange={set('active')} style={{ width: 'auto' }} />
                <label htmlFor="active" style={{ marginBottom: 0 }}>Active (visible on site)</label>
              </div>
            </div>
            {/* Preview */}
            {form.name && (
              <div style={{ margin: '1rem 0', padding: '1rem', background: '#f8f8f8', borderRadius: 10 }}>
                <div style={{ fontSize: '0.75rem', color: '#888', marginBottom: '0.5rem', textTransform: 'uppercase', letterSpacing: '0.06em' }}>Preview</div>
                <div style={{ display: 'inline-flex', alignItems: 'center', gap: '1rem', background: form.bg_color, border: '1px solid #e0e0e0', borderRadius: 12, padding: '1rem 1.5rem' }}>
                  {form.logo_url
                    ? <img src={form.logo_url} alt={form.name} style={{ height: 48, objectFit: 'contain' }} />
                    : <span style={{ fontWeight: 700, fontSize: '1.1rem', color: form.bg_color === '#0a0a0a' || form.bg_color === '#000000' ? '#fff' : '#222' }}>{form.name}</span>
                  }
                  <span style={{ background: TIER_BG[form.tier], color: TIER_COLORS[form.tier], borderRadius: 100, padding: '0.2rem 0.6rem', fontSize: '0.72rem', fontWeight: 700 }}>{form.tier}</span>
                </div>
              </div>
            )}
            <div style={{ display: 'flex', gap: '0.75rem', marginTop: '0.5rem' }}>
              <button type="submit" className="pd-btn pd-btn-primary">{editing ? 'Update Sponsor' : 'Add Sponsor'}</button>
              <button type="button" onClick={() => setShowForm(false)} className="pd-btn pd-btn-outline">Cancel</button>
            </div>
          </form>
        </div>
      )}

      {/* Sponsors list */}
      <div style={{ display: 'grid', gap: '0.75rem' }}>
        {sponsors.length === 0 && <p style={{ color: '#888' }}>No sponsors yet. Click "Add Sponsor" to get started.</p>}
        {sponsors.map(s => (
          <div key={s.id} style={{ background: '#fff', borderRadius: 12, padding: '1rem 1.25rem', display: 'flex', alignItems: 'center', gap: '1rem', boxShadow: '0 1px 4px rgba(0,0,0,0.06)', opacity: s.active ? 1 : 0.55 }}>
            {/* Logo/name preview */}
            <div style={{ width: 72, height: 48, background: s.bg_color, borderRadius: 8, border: '1px solid #e0e0e0', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, overflow: 'hidden' }}>
              {s.logo_url
                ? <img src={s.logo_url} alt={s.name} style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain' }} />
                : <span style={{ fontSize: '0.65rem', fontWeight: 700, textAlign: 'center', color: s.bg_color === '#0a0a0a' || s.bg_color === '#000000' ? '#fff' : '#333', padding: '0 4px' }}>{s.name}</span>
              }
            </div>
            {/* Info */}
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                {s.name}
                {!s.active && <span style={{ fontSize: '0.7rem', color: '#999', fontWeight: 400 }}>(inactive)</span>}
              </div>
              <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', marginTop: '0.25rem' }}>
                <span style={{ background: TIER_BG[s.tier], color: TIER_COLORS[s.tier], borderRadius: 100, padding: '0.15rem 0.6rem', fontSize: '0.72rem', fontWeight: 700 }}>{s.tier}</span>
                <span style={{ background: '#f0f0f0', color: '#666', borderRadius: 100, padding: '0.15rem 0.6rem', fontSize: '0.72rem' }}>{s.scope}</span>
                {s.event_name && <span style={{ background: '#f0f0f0', color: '#666', borderRadius: 100, padding: '0.15rem 0.6rem', fontSize: '0.72rem' }}>{s.event_name}</span>}
                {s.website_url && <a href={s.website_url} target="_blank" rel="noopener noreferrer" style={{ color: 'var(--pd-orange)', fontSize: '0.72rem' }}>↗ website</a>}
              </div>
            </div>
            {/* Order badge */}
            <div style={{ fontSize: '0.75rem', color: '#999', textAlign: 'center', flexShrink: 0 }}>
              <div style={{ fontWeight: 700, color: '#555' }}>#{s.display_order}</div>
              <div>order</div>
            </div>
            {/* Actions */}
            <div style={{ display: 'flex', gap: '0.5rem', flexShrink: 0 }}>
              <button onClick={() => openEdit(s)} style={{ background: '#f0f0f0', border: 'none', borderRadius: 8, padding: '0.4rem 0.75rem', fontSize: '0.82rem', cursor: 'pointer', fontWeight: 600 }}>Edit</button>
              <button onClick={() => toggleActive(s)} style={{ background: s.active ? '#fef2f2' : '#f0fdf4', color: s.active ? '#dc2626' : '#16a34a', border: 'none', borderRadius: 8, padding: '0.4rem 0.75rem', fontSize: '0.82rem', cursor: 'pointer', fontWeight: 600 }}>
                {s.active ? 'Deactivate' : 'Activate'}
              </button>
              <button onClick={() => handleDelete(s)} style={{ background: '#fef2f2', color: '#dc2626', border: 'none', borderRadius: 8, padding: '0.4rem 0.75rem', fontSize: '0.82rem', cursor: 'pointer', fontWeight: 600 }}>Delete</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

// ── Admin Interest Submissions ────────────────────────────────────────────────
function AdminInterest() {
  const [items, setItems] = useState([])
  useEffect(() => { api.get('/admin/interest').then(r => setItems(r.data)).catch(() => {}) }, [])
  return (
    <div>
      <h2 style={{ marginTop: 0 }}>Interest Submissions ({items.length})</h2>
      {items.length === 0 && <p style={{ color: '#888' }}>No submissions yet.</p>}
      <div style={{ display: 'grid', gap: '0.75rem' }}>
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

// ── Admin Shell ───────────────────────────────────────────────────────────────
export default function Admin() {
  const links = [
    { to: '/admin/players',  label: '👥 Players' },
    { to: '/admin/events',   label: '🗓 Events' },
    { to: '/admin/sponsors', label: '🏆 Sponsors' },
    { to: '/admin/interest', label: '📬 Interest Forms' },
  ]
  return (
    <div className="pd-admin">
      <div className="pd-admin-sidebar">
        <div style={{ color: 'var(--pd-orange)', fontWeight: 700, marginBottom: '1.5rem', fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '0.08em' }}>Admin Panel</div>
        {links.map(l => (
          <NavLink key={l.to} to={l.to} className={({ isActive }) => isActive ? 'active' : ''}>
            {l.label}
          </NavLink>
        ))}
      </div>
      <div className="pd-admin-content">
        <Routes>
          <Route index element={<Navigate to="players" replace />} />
          <Route path="players"  element={<AdminPlayers />} />
          <Route path="events"   element={<AdminEvents />} />
          <Route path="sponsors" element={<AdminSponsors />} />
          <Route path="interest" element={<AdminInterest />} />
        </Routes>
      </div>
    </div>
  )
}

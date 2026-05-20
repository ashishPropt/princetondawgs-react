import { useState, useEffect, useRef } from 'react'
import { NavLink, Routes, Route, Navigate } from 'react-router-dom'
import api from '../api/axios'
import toast from 'react-hot-toast'

// ── Logo Upload Widget ────────────────────────────────────────────────────────
function LogoUpload({ value, onChange }) {
  const [uploading, setUploading] = useState(false)
  const [dragOver, setDragOver] = useState(false)
  const [tab, setTab] = useState(value?.startsWith('/uploads/') ? 'upload' : 'url')
  const inputRef = useRef()

  const doUpload = async (file) => {
    if (!file) return
    if (file.size > 5 * 1024 * 1024) { toast.error('File must be under 5MB'); return }
    setUploading(true)
    try {
      const fd = new FormData()
      fd.append('logo', file)
      const r = await api.post('/admin/sponsors/upload', fd, { headers: { 'Content-Type': 'multipart/form-data' } })
      onChange(r.data.url)
      toast.success('Logo uploaded!')
    } catch {
      toast.error('Upload failed')
    } finally {
      setUploading(false)
    }
  }

  const onDrop = (e) => {
    e.preventDefault(); setDragOver(false)
    const file = e.dataTransfer.files[0]
    if (file) doUpload(file)
  }

  return (
    <div>
      {/* Tab switcher */}
      <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.75rem' }}>
        {[['upload','📁 Upload Image'],['url','🔗 Image URL']].map(([t, label]) => (
          <button key={t} type="button" onClick={() => setTab(t)}
            style={{ padding: '0.3rem 0.9rem', borderRadius: 100, border: `1.5px solid ${tab===t ? 'var(--pd-orange)':'#ddd'}`, background: tab===t ? 'rgba(245,90,0,0.08)':'#fff', color: tab===t ? 'var(--pd-orange)':'#666', fontWeight: tab===t ? 700:400, fontSize: '0.82rem', cursor: 'pointer' }}>
            {label}
          </button>
        ))}
      </div>

      {tab === 'upload' ? (
        <div>
          {/* Drop zone */}
          <div
            onClick={() => inputRef.current?.click()}
            onDragOver={e => { e.preventDefault(); setDragOver(true) }}
            onDragLeave={() => setDragOver(false)}
            onDrop={onDrop}
            style={{ border: `2px dashed ${dragOver ? 'var(--pd-orange)':'#ddd'}`, borderRadius: 10, padding: '1.5rem', textAlign: 'center', cursor: 'pointer', background: dragOver ? 'rgba(245,90,0,0.04)':'#fafafa', transition: 'all 0.15s' }}
          >
            {uploading
              ? <div style={{ color: 'var(--pd-orange)' }}>⏳ Uploading…</div>
              : <div>
                  <div style={{ fontSize: '1.75rem', marginBottom: '0.25rem' }}>🖼️</div>
                  <div style={{ fontSize: '0.85rem', color: '#666' }}>Drop image here or <span style={{ color: 'var(--pd-orange)', fontWeight: 600 }}>click to browse</span></div>
                  <div style={{ fontSize: '0.75rem', color: '#aaa', marginTop: '0.25rem' }}>PNG, JPG, SVG, WebP — max 5MB</div>
                </div>
            }
          </div>
          <input ref={inputRef} type="file" accept="image/*" style={{ display:'none' }} onChange={e => doUpload(e.target.files[0])} />

          {/* Current upload preview */}
          {value?.startsWith('/uploads/') && (
            <div style={{ marginTop: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.75rem', background: '#f8f8f8', padding: '0.6rem 0.85rem', borderRadius: 8 }}>
              <img src={value} alt="logo" style={{ height: 36, objectFit: 'contain', maxWidth: 100 }} onError={e => e.target.style.display='none'} />
              <span style={{ fontSize: '0.8rem', color: '#555', flex: 1 }}>{value}</span>
              <button type="button" onClick={() => onChange('')} style={{ color: '#dc2626', background: 'none', border: 'none', cursor: 'pointer', fontSize: '1rem' }}>✕</button>
            </div>
          )}
        </div>
      ) : (
        <div>
          <input
            type="url"
            value={value?.startsWith('/uploads/') ? '' : (value || '')}
            onChange={e => onChange(e.target.value)}
            placeholder="https://example.com/logo.png"
            style={{ width: '100%', padding: '0.65rem 0.85rem', border: '1.5px solid #e0e0e0', borderRadius: 8, fontSize: '0.95rem', fontFamily: 'inherit', outline: 'none' }}
          />
          {value && !value.startsWith('/uploads/') && (
            <div style={{ marginTop: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <img src={value} alt="preview" style={{ height: 32, objectFit: 'contain', maxWidth: 80 }} onError={e => e.target.style.display='none'} />
              <span style={{ fontSize: '0.78rem', color: '#888' }}>Preview</span>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

// ── Admin Players ─────────────────────────────────────────────────────────────
function AdminPlayers() {
  const [players, setPlayers] = useState([])
  useEffect(() => { api.get('/admin/players').then(r => setPlayers(r.data)).catch(() => {}) }, [])

  const toggleAdmin = async (p) => {
    try {
      await api.patch(`/admin/players/${p.id}/admin`, { is_admin: !p.is_admin })
      setPlayers(ps => ps.map(x => x.id === p.id ? { ...x, is_admin: !p.is_admin } : x))
      toast.success(`${p.name} updated`)
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
            <th style={{ padding: '0.75rem 1rem', textAlign: 'center' }}>Role</th>
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
    } catch { toast.error('Failed') }
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
            <span style={{ background: e.status === 'active' ? 'var(--pd-green)' : '#e0e0e0', color: e.status === 'active' ? '#fff' : '#666', borderRadius: 100, padding: '0.25rem 0.9rem', fontSize: '0.78rem', fontWeight: 700 }}>{e.status}</span>
          </div>
        ))}
      </div>
    </div>
  )
}

// ── Admin Sponsors ─────────────────────────────────────────────────────────────
const BLANK = { name: '', website_url: '', logo_url: '', bg_color: '#ffffff', tier: 'Top Dawg', scope: 'event', event_id: '', display_order: 0, active: true }
const TIER_COLORS = { 'Top Dawg': '#854d0e', 'Dawg Pack': '#475569', 'Paw Print': '#166534' }
const TIER_BG    = { 'Top Dawg': '#fef9c3', 'Dawg Pack': '#f1f5f9', 'Paw Print': '#f0fdf4' }

const isDark = (hex) => {
  const c = (hex || '#fff').replace('#','').padEnd(6,'0')
  const r = parseInt(c.substr(0,2),16), g = parseInt(c.substr(2,2),16), b = parseInt(c.substr(4,2),16)
  return (r*299 + g*587 + b*114) / 1000 < 128
}

function AdminSponsors() {
  const [sponsors, setSponsors] = useState([])
  const [events, setEvents]     = useState([])
  const [form, setForm]         = useState(BLANK)
  const [editing, setEditing]   = useState(null)
  const [showForm, setShowForm] = useState(false)

  const load = () => api.get('/admin/sponsors').then(r => setSponsors(r.data)).catch(() => {})
  useEffect(() => { load(); api.get('/events').then(r => setEvents(r.data)).catch(() => {}) }, [])

  const set = (f) => (e) => {
    const val = e.target.type === 'checkbox' ? e.target.checked : e.target.value
    setForm(p => ({ ...p, [f]: val }))
  }

  const openCreate = () => { setForm(BLANK); setEditing(null); setShowForm(true); setTimeout(() => document.getElementById('sponsor-form')?.scrollIntoView({ behavior:'smooth' }), 50) }
  const openEdit   = (s) => { setForm({ name: s.name, website_url: s.website_url||'', logo_url: s.logo_url||'', bg_color: s.bg_color||'#ffffff', tier: s.tier, scope: s.scope, event_id: s.event_id||'', display_order: s.display_order||0, active: s.active }); setEditing(s.id); setShowForm(true); setTimeout(() => document.getElementById('sponsor-form')?.scrollIntoView({ behavior:'smooth' }), 50) }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      if (editing) { await api.patch(`/admin/sponsors/${editing}`, form); toast.success('Sponsor updated!') }
      else { await api.post('/admin/sponsors', form); toast.success('Sponsor added!') }
      setShowForm(false); setEditing(null); load()
    } catch { toast.error('Failed to save sponsor') }
  }

  const toggleActive = async (s) => {
    await api.patch(`/admin/sponsors/${s.id}`, { ...s, active: !s.active })
    load()
    toast.success(`${s.name} ${!s.active ? 'activated' : 'deactivated'}`)
  }

  const handleDelete = async (s) => {
    if (!window.confirm(`Delete ${s.name}?`)) return
    await api.delete(`/admin/sponsors/${s.id}`)
    toast.success('Deleted'); load()
  }

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
        <h2 style={{ margin: 0 }}>Sponsors ({sponsors.length})</h2>
        <button onClick={openCreate} className="pd-btn pd-btn-primary" style={{ padding: '0.5rem 1.25rem', fontSize: '0.9rem' }}>+ Add Sponsor</button>
      </div>

      {/* Form */}
      {showForm && (
        <div id="sponsor-form" style={{ background: '#fff', borderRadius: 16, padding: '1.75rem', marginBottom: '2rem', boxShadow: '0 4px 20px rgba(0,0,0,0.12)', border: '2px solid var(--pd-orange)' }}>
          <h3 style={{ marginTop: 0, fontSize: '1.1rem' }}>{editing ? '✏️ Edit Sponsor' : '➕ Add New Sponsor'}</h3>
          <form onSubmit={handleSubmit}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>

              <div className="pd-form-group" style={{ gridColumn: '1/-1' }}>
                <label>Sponsor Name *</label>
                <input required value={form.name} onChange={set('name')} placeholder="Acme Corp" />
              </div>

              <div className="pd-form-group">
                <label>Website URL</label>
                <input type="url" value={form.website_url} onChange={set('website_url')} placeholder="https://example.com" />
              </div>

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
                <label>Background Color <span style={{ fontSize:'0.75rem', color:'#888' }}>(for dark logos)</span></label>
                <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                  <input type="color" value={form.bg_color} onChange={set('bg_color')} style={{ width: 46, height: 36, padding: 2, border: '1px solid #ddd', borderRadius: 6, cursor: 'pointer' }} />
                  <input value={form.bg_color} onChange={set('bg_color')} placeholder="#ffffff" style={{ flex:1 }} />
                </div>
              </div>

              <div className="pd-form-group">
                <label>Display Order <span style={{ fontSize:'0.75rem', color:'#888' }}>(lower = first)</span></label>
                <input type="number" min={0} value={form.display_order} onChange={set('display_order')} />
              </div>

              {/* Logo upload — full width */}
              <div className="pd-form-group" style={{ gridColumn: '1/-1' }}>
                <label>Sponsor Logo</label>
                <LogoUpload value={form.logo_url} onChange={(url) => setForm(f => ({ ...f, logo_url: url }))} />
              </div>

              <div className="pd-form-group" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <input type="checkbox" id="active-chk" checked={form.active} onChange={set('active')} style={{ width:'auto' }} />
                <label htmlFor="active-chk" style={{ marginBottom:0 }}>Active (visible on site)</label>
              </div>
            </div>

            {/* Live preview */}
            {form.name && (
              <div style={{ margin: '1.25rem 0 0.5rem', padding: '1rem 1.25rem', background: '#f8f8f8', borderRadius: 10 }}>
                <div style={{ fontSize: '0.72rem', color: '#aaa', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '0.6rem' }}>Live Preview</div>
                <div style={{ display: 'inline-flex', alignItems: 'center', gap: '1rem', background: form.bg_color, border: '1px solid #e0e0e0', borderRadius: 12, padding: '1rem 1.5rem' }}>
                  {form.logo_url
                    ? <img src={form.logo_url} alt={form.name} style={{ height: 48, maxWidth: 120, objectFit: 'contain' }} />
                    : <span style={{ fontWeight: 800, fontSize: '1.1rem', color: isDark(form.bg_color) ? '#fff' : '#222' }}>{form.name}</span>
                  }
                  <div>
                    {form.logo_url && <div style={{ fontWeight: 700, fontSize: '0.9rem', color: isDark(form.bg_color) ? '#fff' : '#222', marginBottom: '0.2rem' }}>{form.name}</div>}
                    <span style={{ background: TIER_BG[form.tier], color: TIER_COLORS[form.tier], borderRadius: 100, padding: '0.2rem 0.6rem', fontSize: '0.72rem', fontWeight: 700 }}>{form.tier}</span>
                  </div>
                </div>
              </div>
            )}

            <div style={{ display: 'flex', gap: '0.75rem', marginTop: '1rem' }}>
              <button type="submit" className="pd-btn pd-btn-primary">{editing ? 'Update Sponsor' : 'Add Sponsor'}</button>
              <button type="button" onClick={() => { setShowForm(false); setEditing(null) }} className="pd-btn pd-btn-outline">Cancel</button>
            </div>
          </form>
        </div>
      )}

      {/* Sponsors list */}
      <div style={{ display: 'grid', gap: '0.75rem' }}>
        {sponsors.length === 0 && <p style={{ color: '#888' }}>No sponsors yet. Click "+ Add Sponsor" to get started.</p>}
        {sponsors.map(s => (
          <div key={s.id} style={{ background: '#fff', borderRadius: 12, padding: '1rem 1.25rem', display: 'flex', alignItems: 'center', gap: '1rem', boxShadow: '0 1px 4px rgba(0,0,0,0.06)', opacity: s.active ? 1 : 0.55 }}>
            {/* Logo thumbnail */}
            <div style={{ width: 80, height: 52, background: s.bg_color || '#fff', borderRadius: 8, border: '1px solid #e0e0e0', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, overflow: 'hidden', padding: 4 }}>
              {s.logo_url
                ? <img src={s.logo_url} alt={s.name} style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain' }} />
                : <span style={{ fontSize: '0.62rem', fontWeight: 700, textAlign: 'center', color: isDark(s.bg_color||'#fff') ? '#fff':'#333', padding:'0 2px', lineHeight:1.3 }}>{s.name}</span>
              }
            </div>
            {/* Info */}
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontWeight: 700, fontSize: '0.95rem' }}>{s.name} {!s.active && <span style={{ fontSize:'0.72rem', color:'#bbb', fontWeight:400 }}>(inactive)</span>}</div>
              <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap', marginTop: '0.3rem' }}>
                <span style={{ background: TIER_BG[s.tier], color: TIER_COLORS[s.tier], borderRadius: 100, padding: '0.15rem 0.6rem', fontSize: '0.72rem', fontWeight: 700 }}>{s.tier}</span>
                <span style={{ background: '#f0f0f0', color: '#666', borderRadius: 100, padding: '0.15rem 0.6rem', fontSize: '0.72rem' }}>{s.scope}</span>
                {s.event_name && <span style={{ background: '#f0f0f0', color: '#666', borderRadius: 100, padding: '0.15rem 0.6rem', fontSize: '0.72rem' }}>{s.event_name}</span>}
                {s.website_url && <a href={s.website_url} target="_blank" rel="noopener noreferrer" style={{ color: 'var(--pd-orange)', fontSize: '0.72rem' }}>↗</a>}
              </div>
            </div>
            {/* Order */}
            <div style={{ fontSize: '0.72rem', color: '#bbb', textAlign: 'center', flexShrink: 0 }}>
              <span style={{ fontWeight: 700, color: '#888', fontSize: '0.85rem' }}>#{s.display_order}</span>
            </div>
            {/* Actions */}
            <div style={{ display: 'flex', gap: '0.4rem', flexShrink: 0 }}>
              <button onClick={() => openEdit(s)} style={{ background: '#f0f0f0', border: 'none', borderRadius: 8, padding: '0.4rem 0.75rem', fontSize: '0.82rem', cursor: 'pointer', fontWeight: 600 }}>Edit</button>
              <button onClick={() => toggleActive(s)} style={{ background: s.active ? '#fef2f2' : '#f0fdf4', color: s.active ? '#dc2626' : '#16a34a', border: 'none', borderRadius: 8, padding: '0.4rem 0.75rem', fontSize: '0.82rem', cursor: 'pointer', fontWeight: 600 }}>
                {s.active ? 'Hide' : 'Show'}
              </button>
              <button onClick={() => handleDelete(s)} style={{ background: '#fef2f2', color: '#dc2626', border: 'none', borderRadius: 8, padding: '0.4rem 0.75rem', fontSize: '0.82rem', cursor: 'pointer', fontWeight: 600 }}>✕</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

// ── Admin Interest ────────────────────────────────────────────────────────────
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
    { to: '/admin/players',  label: '👥 Players'  },
    { to: '/admin/events',   label: '🗓 Events'   },
    { to: '/admin/sponsors', label: '🏆 Sponsors' },
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
          <Route path="players"  element={<AdminPlayers />} />
          <Route path="events"   element={<AdminEvents />} />
          <Route path="sponsors" element={<AdminSponsors />} />
          <Route path="interest" element={<AdminInterest />} />
        </Routes>
      </div>
    </div>
  )
}

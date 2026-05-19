import { useState, useEffect } from 'react'
import api from '../api/axios'

export default function Team() {
  const [players, setPlayers] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    api.get('/public/players').then(r => setPlayers(r.data)).catch(() => {}).finally(() => setLoading(false))
  }, [])

  const byNtrp = players.reduce((acc, p) => {
    const key = p.ntrp || 'Unrated'
    if (!acc[key]) acc[key] = []
    acc[key].push(p)
    return acc
  }, {})

  return (
    <div style={{ paddingTop: 80, minHeight: '100vh', background: 'var(--pd-cream)' }}>
      <div style={{ background: 'var(--pd-dark)', padding: '3rem 1.5rem', textAlign: 'center' }}>
        <div className="pd-container">
          <span className="pd-tag pd-tag-light">The Pack</span>
          <h1 className="pd-section-title pd-white">Meet the Dawgs</h1>
          <p style={{ color: 'rgba(255,255,255,0.7)' }}>{players.length} active members · Princeton, NJ</p>
        </div>
      </div>
      <div className="pd-container" style={{ paddingTop: '3rem', paddingBottom: '3rem' }}>
        {loading
          ? <p style={{ color: '#888' }}>Loading…</p>
          : Object.entries(byNtrp).sort((a, b) => parseFloat(b[0]) - parseFloat(a[0])).map(([ntrp, group]) => (
            <div key={ntrp} style={{ marginBottom: '2.5rem' }}>
              <h3 style={{ fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--pd-orange)', marginBottom: '1rem' }}>
                NTRP {ntrp} &mdash; {group.length} player{group.length !== 1 ? 's' : ''}
              </h3>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px,1fr))', gap: '1rem' }}>
                {group.map(p => (
                  <div key={p.id} style={{ background: '#fff', borderRadius: 12, padding: '1.25rem', boxShadow: '0 1px 4px rgba(0,0,0,0.06)', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    <div style={{ width: 44, height: 44, borderRadius: '50%', background: 'var(--pd-orange)', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, flexShrink: 0 }}>
                      {p.name.slice(0,2).toUpperCase()}
                    </div>
                    <div>
                      <div style={{ fontWeight: 600, fontSize: '0.9rem' }}>{p.name}</div>
                      {p.is_admin && <div style={{ fontSize: '0.7rem', color: 'var(--pd-orange)', fontWeight: 700 }}>Captain</div>}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))
        }
      </div>
    </div>
  )
}

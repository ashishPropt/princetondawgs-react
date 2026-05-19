import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import api from '../api/axios'

export default function Tournament() {
  const { user } = useAuth()
  const [events, setEvents] = useState([])
  const [selected, setSelected] = useState(null)
  const [detail, setDetail] = useState(null)

  useEffect(() => {
    api.get('/events?type=tournament').then(r => {
      setEvents(r.data)
      if (r.data.length) setSelected(r.data[0].id)
    }).catch(() => {})
  }, [])

  useEffect(() => {
    if (!selected) return
    api.get(`/events/${selected}`).then(r => setDetail(r.data)).catch(() => {})
  }, [selected])

  return (
    <div style={{ paddingTop: 80, minHeight: '100vh', background: 'var(--pd-cream)' }}>
      <div style={{ background: 'var(--pd-dark)', padding: '3rem 1.5rem', textAlign: 'center' }}>
        <div className="pd-container">
          <span className="pd-tag pd-tag-light">Flagship Event</span>
          <h1 className="pd-section-title pd-white">Dawg Days of Summer</h1>
          <p style={{ color: 'rgba(255,255,255,0.7)', maxWidth: 520, margin: '0 auto 2rem' }}>Annual team round-robin tournament open to all Princeton Dawgs members.</p>
          <Link to="/register" className="pd-btn pd-btn-primary">Register Now →</Link>
        </div>
      </div>

      <div className="pd-container" style={{ paddingTop: '3rem', paddingBottom: '3rem' }}>
        {events.length > 1 && (
          <div style={{ display: 'flex', gap: '0.75rem', marginBottom: '2rem', flexWrap: 'wrap' }}>
            {events.map(e => (
              <button key={e.id} onClick={() => setSelected(e.id)}
                className="pd-btn" style={{ background: selected === e.id ? 'var(--pd-orange)' : '#fff', color: selected === e.id ? '#fff' : 'var(--pd-dark)', border: '1px solid #ddd', fontSize: '0.9rem', padding: '0.5rem 1.25rem' }}>
                {e.name}
              </button>
            ))}
          </div>
        )}

        {detail && (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px,1fr))', gap: '1.5rem' }}>
            <div className="pd-dash-card">
              <h3>Event Info</h3>
              <div style={{ display: 'grid', gap: '0.75rem' }}>
                {[
                  ['Name', detail.name],
                  ['Date', detail.starts_on ? new Date(detail.starts_on).toLocaleDateString('en-US', { weekday:'long', year:'numeric', month:'long', day:'numeric' }) : 'TBD'],
                  ['Format', 'Teams of 4 · Round-Robin'],
                  ['Entry', 'Free for members'],
                  ['Status', detail.status]
                ].map(([l,v]) => (
                  <div key={l}><span style={{ fontSize:'0.75rem', color:'#888', display:'block', textTransform:'uppercase', letterSpacing:'0.06em' }}>{l}</span><span style={{ fontWeight:600 }}>{v}</span></div>
                ))}
              </div>
            </div>
            <div className="pd-dash-card">
              <h3>Teams ({detail.teams?.length || 0})</h3>
              {!detail.teams?.length
                ? <p style={{ color: '#999', fontSize: '0.9rem' }}>Teams will be announced closer to the event date.</p>
                : detail.teams.map(t => (
                  <div key={t.id} style={{ padding: '0.75rem 0', borderBottom: '1px solid #f0f0f0' }}>
                    <div style={{ fontWeight: 600 }}>{t.name}</div>
                    <div style={{ fontSize: '0.8rem', color: '#888' }}>{t.players?.join(', ')}</div>
                  </div>
                ))
              }
            </div>
            <div className="pd-dash-card">
              <h3>Schedule</h3>
              {!detail.ties?.length
                ? <p style={{ color: '#999', fontSize: '0.9rem' }}>Schedule not yet available.</p>
                : detail.ties.map(t => (
                  <div key={t.id} style={{ padding: '0.75rem 0', borderBottom: '1px solid #f0f0f0', fontSize: '0.9rem' }}>
                    <div style={{ fontWeight: 600 }}>{t.team_a_name} vs {t.team_b_name}</div>
                    {t.scheduled_at && <div style={{ fontSize: '0.8rem', color: '#888' }}>{new Date(t.scheduled_at).toLocaleString()}</div>}
                    {t.is_final ? <span style={{ color: 'var(--pd-orange)', fontSize: '0.75rem', fontWeight: 700 }}>FINAL</span> : null}
                  </div>
                ))
              }
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

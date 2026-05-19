import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import api from '../api/axios'

export default function Dashboard() {
  const { user } = useAuth()
  const [data, setData] = useState({ events: [], registrations: [], leagueRegs: [] })

  useEffect(() => {
    Promise.all([
      api.get('/events'),
      api.get('/players/me/registrations'),
      api.get('/players/me/league-registrations')
    ]).then(([ev, regs, lregs]) => {
      setData({ events: ev.data, registrations: regs.data, leagueRegs: lregs.data })
    }).catch(() => {})
  }, [])

  return (
    <div className="pd-dashboard">
      <div className="pd-dashboard-header">
        <div className="pd-container">
          <h2 style={{ margin:0 }}>Welcome back, {user?.name?.split(' ')[0]} 🐾</h2>
          <p style={{ opacity:0.7, margin:'0.5rem 0 0' }}>NTRP {user?.ntrp || 'Unrated'} · {user?.email}</p>
        </div>
      </div>
      <div className="pd-dashboard-grid">
        <div className="pd-dash-card">
          <h3>My Tournaments</h3>
          {data.registrations.length === 0
            ? <p style={{ color:'#999', fontSize:'0.9rem' }}>Not registered for any tournaments yet.</p>
            : data.registrations.map(r => (
              <div key={r.id} style={{ padding:'0.75rem 0', borderBottom:'1px solid #f0f0f0' }}>
                <div style={{ fontWeight:600 }}>{r.event_name}</div>
                <div style={{ fontSize:'0.8rem', color:'#888' }}>Registered {new Date(r.joined_at).toLocaleDateString()}</div>
              </div>
            ))
          }
          <Link to="/tournament" className="pd-btn pd-btn-primary" style={{ marginTop:'1rem', fontSize:'0.85rem', padding:'0.6rem 1.25rem' }}>
            View Tournaments
          </Link>
        </div>

        <div className="pd-dash-card">
          <h3>USTA Leagues</h3>
          {data.leagueRegs.length === 0
            ? <p style={{ color:'#999', fontSize:'0.9rem' }}>Not registered for any USTA leagues yet.</p>
            : data.leagueRegs.map(r => (
              <div key={r.id} style={{ padding:'0.75rem 0', borderBottom:'1px solid #f0f0f0' }}>
                <div style={{ fontWeight:600 }}>{r.event_name}</div>
                <div style={{ fontSize:'0.8rem', color:'#888' }}>NTRP {r.ntrp_level}</div>
              </div>
            ))
          }
          <Link to="/leagues" className="pd-btn pd-btn-outline" style={{ marginTop:'1rem', fontSize:'0.85rem', padding:'0.6rem 1.25rem' }}>
            View Leagues
          </Link>
        </div>

        <div className="pd-dash-card">
          <h3>Active Events</h3>
          {data.events.filter(e => e.status === 'active').slice(0,3).map(e => (
            <div key={e.id} style={{ padding:'0.75rem 0', borderBottom:'1px solid #f0f0f0' }}>
              <div style={{ fontWeight:600 }}>{e.name}</div>
              <div style={{ fontSize:'0.8rem', color:'#888' }}>{e.type === 'usta_league' ? `USTA League · NTRP ${e.ntrp_level}` : 'Tournament'} · {e.starts_on ? new Date(e.starts_on).toLocaleDateString() : 'TBD'}</div>
            </div>
          ))}
        </div>

        <div className="pd-dash-card">
          <h3>Quick Links</h3>
          <div style={{ display:'flex', flexDirection:'column', gap:'0.75rem' }}>
            {[
              ['/register', '🏆 Register for Dawg Days'],
              ['/usta-register', '🎾 Register for USTA League'],
              ['/leagues', '📊 League Standings'],
              ['/team', '🐾 View the Pack'],
            ].map(([to,label]) => (
              <Link key={to} to={to} style={{ color:'var(--pd-orange)', textDecoration:'none', fontWeight:500, fontSize:'0.9rem' }}>
                {label}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

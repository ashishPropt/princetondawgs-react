import { useState, useEffect } from 'react'
import api from '../api/axios'

export default function Leagues() {
  const [events, setEvents] = useState([])
  const [selected, setSelected] = useState(null)
  const [scores, setScores] = useState([])

  useEffect(() => {
    api.get('/events?type=usta_league').then(r => {
      setEvents(r.data)
      if (r.data.length) setSelected(r.data[0].id)
    }).catch(() => {})
  }, [])

  useEffect(() => {
    if (!selected) return
    api.get(`/leagues/${selected}/scores`).then(r => setScores(r.data)).catch(() => setScores([]))
  }, [selected])

  const standings = Object.values(scores.reduce((acc, s) => {
    if (!acc[s.player_id]) acc[s.player_id] = { player_id: s.player_id, player_name: s.player_name, wins: 0, losses: 0, total: 0 }
    if (s.result === 'win') acc[s.player_id].wins++
    else acc[s.player_id].losses++
    acc[s.player_id].total++
    return acc
  }, {})).sort((a, b) => b.wins - a.wins || a.losses - b.losses)

  return (
    <div style={{ paddingTop: 80, minHeight: '100vh', background: 'var(--pd-cream)' }}>
      <div className="pd-container" style={{ paddingTop: '3rem', paddingBottom: '3rem' }}>
        <span className="pd-tag">USTA</span>
        <h1 className="pd-section-title">League Standings</h1>

        <div style={{ display:'flex', gap:'0.75rem', marginBottom:'2rem', flexWrap:'wrap' }}>
          {events.map(e => (
            <button key={e.id} onClick={() => setSelected(e.id)}
              className="pd-btn" style={{ background: selected === e.id ? 'var(--pd-orange)' : '#fff', color: selected === e.id ? '#fff' : 'var(--pd-dark)', border:'1px solid #ddd', fontSize:'0.9rem', padding:'0.5rem 1.25rem' }}>
              {e.name}
            </button>
          ))}
        </div>

        {standings.length === 0
          ? <p style={{ color:'#888' }}>No scores recorded yet for this league. Check back after match days.</p>
          : (
            <div style={{ background:'#fff', borderRadius:16, overflow:'hidden', boxShadow:'0 2px 8px rgba(0,0,0,0.06)' }}>
              <table style={{ width:'100%', borderCollapse:'collapse' }}>
                <thead>
                  <tr style={{ background:'var(--pd-dark)', color:'#fff' }}>
                    <th style={{ padding:'1rem', textAlign:'left' }}>#</th>
                    <th style={{ padding:'1rem', textAlign:'left' }}>Player</th>
                    <th style={{ padding:'1rem', textAlign:'center' }}>W</th>
                    <th style={{ padding:'1rem', textAlign:'center' }}>L</th>
                    <th style={{ padding:'1rem', textAlign:'center' }}>Played</th>
                    <th style={{ padding:'1rem', textAlign:'center' }}>Win %</th>
                  </tr>
                </thead>
                <tbody>
                  {standings.map((s, i) => (
                    <tr key={s.player_id} style={{ borderBottom:'1px solid #f0f0f0', background: i % 2 === 0 ? '#fff' : '#fafafa' }}>
                      <td style={{ padding:'0.85rem 1rem', fontWeight:700, color: i < 3 ? 'var(--pd-orange)' : '#888' }}>{i+1}</td>
                      <td style={{ padding:'0.85rem 1rem', fontWeight:600 }}>{s.player_name}</td>
                      <td style={{ padding:'0.85rem 1rem', textAlign:'center', color:'#16a34a', fontWeight:700 }}>{s.wins}</td>
                      <td style={{ padding:'0.85rem 1rem', textAlign:'center', color:'#dc2626' }}>{s.losses}</td>
                      <td style={{ padding:'0.85rem 1rem', textAlign:'center' }}>{s.total}</td>
                      <td style={{ padding:'0.85rem 1rem', textAlign:'center' }}>{s.total ? Math.round((s.wins / s.total) * 100) : 0}%</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )
        }
      </div>
    </div>
  )
}

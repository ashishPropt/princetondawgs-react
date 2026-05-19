import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import api from '../api/axios'
import toast from 'react-hot-toast'

const LEAGUES = [
  { id: 1, name: 'USTA 3.0 Spring League', level: '3.0', season: 'Spring 2026', format: 'Mixed Doubles / Singles', min: 2.5, max: 3.0, day: 'Sundays', location: 'Princeton, NJ', desc: 'Open to all players rated 3.0 and below. Perfect for 2.5 and 3.0 NTRP players.' },
  { id: 2, name: 'USTA 3.5 Spring League', level: '3.5', season: 'Spring 2026', format: 'Mixed Doubles / Singles', min: 3.0, max: 3.5, day: 'Sundays', location: 'Princeton, NJ', desc: 'For players rated 3.0–3.5. Both 3.0 and 3.5 players are eligible.' }
]

export default function Home() {
  const [stats, setStats] = useState({ playerCount: 30, ntrpRows: [], recentRegs: [] })
  const [form, setForm] = useState({ first_name: '', last_name: '', email: '', ntrp: '', interests: [] })
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    api.get('/public/stats').then(r => setStats(r.data)).catch(() => {})
  }, [])

  const handleInterest = (val) => {
    setForm(f => ({ ...f, interests: f.interests.includes(val) ? f.interests.filter(i => i !== val) : [...f.interests, val] }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSubmitting(true)
    try {
      await api.post('/public/interest', form)
      toast.success('Thanks! A captain will reach out soon. 🐾')
      setForm({ first_name: '', last_name: '', email: '', ntrp: '', interests: [] })
    } catch {
      toast.error('Something went wrong. Please try again.')
    } finally {
      setSubmitting(false)
    }
  }

  const maxNtrp = stats.ntrpRows.length ? Math.max(...stats.ntrpRows.map(r => r.cnt)) : 1

  return (
    <>
      {/* HERO */}
      <section className="pd-hero" style={{ paddingTop: '6rem' }}>
        <div className="pd-hero-bg"></div>
        <div className="pd-hero-content pd-container" style={{ width:'100%' }}>
          <p className="pd-eyebrow">Princeton, NJ · USTA Mid-Atlantic · Est. 2018</p>
          <h1 className="pd-headline">
            <span className="pd-h1-line1">Dawg Days</span>
            <em className="pd-h1-line2">of Summer</em>
          </h1>
          <p className="pd-hero-sub">Princeton's most competitive recreational tennis community. USTA leagues, internal tournaments, and year-round weekly play. All skill levels welcome.</p>
          <div className="pd-hero-ctas">
            <Link to="/register" className="pd-btn pd-btn-primary">Register for Tournament</Link>
            <a href="#leagues" className="pd-btn pd-btn-ghost">Join a USTA League</a>
          </div>
          <div className="pd-hero-stats">
            <div className="pd-stat"><span className="pd-stat-num">{stats.playerCount}</span><span className="pd-stat-label">Members</span></div>
            <div className="pd-stat-div"></div>
            <div className="pd-stat"><span className="pd-stat-num">2</span><span className="pd-stat-label">USTA Leagues</span></div>
            <div className="pd-stat-div"></div>
            <div className="pd-stat"><span className="pd-stat-num">Free</span><span className="pd-stat-label">Membership</span></div>
          </div>
        </div>
      </section>

      {/* ABOUT */}
      <section className="pd-section" id="about" style={{ background:'#fff' }}>
        <div className="pd-container">
          <div className="pd-about-grid">
            <div>
              <span className="pd-tag">Who We Are</span>
              <h2 className="pd-section-title">More than a tennis team.<br />We're a pack.</h2>
              <p>The Princeton Dawgs started as a group of friends who wanted more than casual hitting. Today we're one of Princeton's most active USTA-registered tennis groups — running year-round leagues, internal tournaments, and a community that shows up for each other on and off the court.</p>
              <p>Membership is always <strong>free</strong>. If you've got the heart of a Dawg, you've got a place here.</p>
              <a href="#join" className="pd-btn pd-btn-outline" style={{ marginTop:'1rem', display:'inline-flex' }}>Join the Pack →</a>
            </div>
            <div className="pd-about-cards">
              <div className="pd-acard pd-acard-orange"><span className="pd-acard-icon">🎾</span><h3>Compete</h3><p>USTA 3.0 and 3.5 Spring leagues, plus internal round-robins.</p></div>
              <div className="pd-acard pd-acard-dark"><span className="pd-acard-icon">🏆</span><h3>Tournament</h3><p>Dawg Days of Summer — our flagship annual event, open to all members.</p></div>
              <div className="pd-acard pd-acard-green"><span className="pd-acard-icon">🐾</span><h3>Connect</h3><p>A tight-knit community of {stats.playerCount} players in Princeton, NJ.</p></div>
            </div>
          </div>
        </div>
      </section>

      {/* USTA LEAGUES */}
      <section className="pd-section" id="leagues" style={{ background:'var(--pd-cream)' }}>
        <div className="pd-container">
          <span className="pd-tag">Active Leagues</span>
          <h2 className="pd-section-title">USTA Leagues We Play In</h2>
          <p className="pd-section-sub">We currently compete in two USTA Mid-Atlantic Spring leagues. Each member can register based on their NTRP rating.</p>
          <div className="pd-leagues-grid">
            {LEAGUES.map(l => (
              <div key={l.id} className="pd-league-card">
                <div className="pd-league-header">
                  <div>
                    <div className="pd-league-level">NTRP {l.level}</div>
                    <h3 className="pd-league-name">{l.name}</h3>
                    <p className="pd-league-season">{l.season} · {l.day} · {l.location}</p>
                  </div>
                  <span className="pd-league-badge">Registration Open</span>
                </div>
                <div className="pd-league-body">
                  <p>{l.desc}</p>
                  <div className="pd-league-meta">
                    <div className="pd-lm-item"><label>Format</label><span>{l.format}</span></div>
                    <div className="pd-lm-item"><label>Eligibility</label><span>NTRP {l.min}–{l.max}</span></div>
                    <div className="pd-lm-item"><label>Fee</label><span style={{ color:'var(--pd-green)', fontWeight:600 }}>🎉 Free for members</span></div>
                  </div>
                  <div className="pd-league-actions">
                    <Link to={`/usta-register?league=${l.id}`} className="pd-btn pd-btn-primary">Register for This League</Link>
                    <Link to="/leagues" className="pd-btn pd-btn-outline">View Standings</Link>
                  </div>
                  <div className="pd-eligibility-note">
                    <span>ℹ️</span>
                    <span>{l.level === '3.0' ? <><strong>2.5 and 3.0 players</strong> are eligible.</> : <><strong>3.0 and 3.5 players</strong> are eligible. 3.0 players can register for both leagues.</>}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className="pd-elig-matrix">
            <h3>Who can register for which leagues?</h3>
            <table className="pd-elig-table">
              <thead><tr><th>Your NTRP</th><th>USTA 3.0 Spring</th><th>USTA 3.5 Spring</th><th>Dawg Days Tournament</th></tr></thead>
              <tbody>
                <tr><td><strong>2.5</strong></td><td className="pd-yes">✓ Eligible</td><td className="pd-no">– Not eligible</td><td className="pd-yes">✓ Eligible</td></tr>
                <tr><td><strong>3.0</strong></td><td className="pd-yes">✓ Eligible</td><td className="pd-yes">✓ Eligible</td><td className="pd-yes">✓ Eligible</td></tr>
                <tr><td><strong>3.5</strong></td><td className="pd-no">– Not eligible</td><td className="pd-yes">✓ Eligible</td><td className="pd-yes">✓ Eligible</td></tr>
                <tr><td><strong>4.0+</strong></td><td className="pd-no">– Not eligible</td><td className="pd-no">– Not eligible</td><td className="pd-yes">✓ Eligible</td></tr>
              </tbody>
            </table>
            <p className="pd-elig-note">All Dawgs members can play in the Dawg Days of Summer tournament regardless of NTRP rating.</p>
          </div>
        </div>
      </section>

      {/* TOURNAMENT */}
      <section className="pd-section pd-tournament-section" id="tournament">
        <div className="pd-container">
          <div className="pd-tourn-grid">
            <div className="pd-tourn-text">
              <span className="pd-tag pd-tag-light">Flagship Event</span>
              <h2 className="pd-section-title pd-white">Dawg Days of Summer</h2>
              <div className="pd-tourn-meta">
                <div className="pd-tm-item"><label>Date</label><span>July 15, 2026</span></div>
                <div className="pd-tm-item"><label>Format</label><span>Teams of 4, Round-Robin</span></div>
                <div className="pd-tm-item"><label>Entry</label><span style={{ color:'var(--pd-orange)', fontWeight:700 }}>🎉 Free for members</span></div>
              </div>
              <p className="pd-tourn-desc">Our flagship annual tournament — open to all Dawgs members regardless of NTRP. Teams of 4 compete in a round-robin format, with 2 singles and 1 doubles match per tie.</p>
              <div className="pd-tourn-ctas">
                <Link to="/register" className="pd-btn pd-btn-primary">Register Now →</Link>
                <Link to="/tournament" className="pd-btn pd-btn-ghost">Learn More</Link>
              </div>
            </div>
            <div className="pd-tourn-visual">
              <div className="pd-trophy-rings">
                <div className="pd-ring pd-r1"></div>
                <div className="pd-ring pd-r2"></div>
                <div className="pd-ring pd-r3"></div>
                <div className="pd-trophy-center"><span>🏆</span><p>Dawg Cup</p></div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* TEAM / NTRP */}
      <section className="pd-section" id="team" style={{ background:'var(--pd-cream)' }}>
        <div className="pd-container">
          <span className="pd-tag">The Pack</span>
          <h2 className="pd-section-title">Current Members</h2>
          <p className="pd-section-sub">{stats.playerCount} active Dawgs. All levels. One mission.</p>
          {stats.ntrpRows.length > 0 && (
            <div className="pd-ntrp-breakdown">
              {stats.ntrpRows.map(row => {
                const labels = { '2.5':'Beginner+', '3.0':'Intermediate', '3.5':'Intermediate+', '4.0':'Advanced', '4.5':'Advanced+' }
                const pct = Math.round((row.cnt / maxNtrp) * 100)
                return (
                  <div key={row.ntrp} className="pd-ntrp-bar-card">
                    <div className="pd-ntrp-num">{row.ntrp}</div>
                    <div className="pd-ntrp-desc">{labels[row.ntrp] || 'Player'}</div>
                    <div className="pd-ntrp-track"><div className="pd-ntrp-fill" style={{ width:`${pct}%` }}></div></div>
                    <div className="pd-ntrp-count">{row.cnt} player{row.cnt !== 1 ? 's' : ''}</div>
                  </div>
                )
              })}
            </div>
          )}
        </div>
      </section>

      {/* JOIN FORM */}
      <section className="pd-section pd-join-section" id="join">
        <div className="pd-container">
          <div className="pd-join-inner">
            <div className="pd-join-text">
              <span className="pd-tag pd-tag-light">Get Involved</span>
              <h2 className="pd-section-title pd-white">Don't just watch.<br />Play with us.</h2>
              <p style={{ color:'var(--pd-sand)' }}>Drop your info and a captain will reach out about leagues, weekly play, and events.</p>
              <div className="pd-join-perks">
                <div className="pd-perk">🎾 USTA league placement</div>
                <div className="pd-perk">🏆 Free tournament entry</div>
                <div className="pd-perk">📅 Weekly scheduled play</div>
                <div className="pd-perk">🎉 Social events year-round</div>
              </div>
            </div>
            <div className="pd-join-form-wrap">
              <form onSubmit={handleSubmit}>
                <div className="pd-form-row">
                  <div className="pd-form-group"><label>First Name *</label><input type="text" placeholder="John" required value={form.first_name} onChange={e => setForm(f => ({ ...f, first_name: e.target.value }))} /></div>
                  <div className="pd-form-group"><label>Last Name *</label><input type="text" placeholder="Dawg" required value={form.last_name} onChange={e => setForm(f => ({ ...f, last_name: e.target.value }))} /></div>
                </div>
                <div className="pd-form-group"><label>Email *</label><input type="email" placeholder="you@example.com" required value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))} /></div>
                <div className="pd-form-group">
                  <label>Your NTRP Rating</label>
                  <select value={form.ntrp} onChange={e => setForm(f => ({ ...f, ntrp: e.target.value }))}>
                    <option value="">Select your level...</option>
                    {[['2.5','Beginner+'],['3.0','Intermediate'],['3.5','Intermediate+'],['4.0','Advanced'],['4.5','Advanced+'],['5.0','5.0+'],['unsure','Not sure']].map(([v,l]) => <option key={v} value={v}>{v} – {l}</option>)}
                  </select>
                </div>
                <div className="pd-form-group">
                  <label>Interested in (check all that apply)</label>
                  <div className="pd-checkboxes">
                    {[['usta_30','USTA 3.0 Spring League'],['usta_35','USTA 3.5 Spring League'],['tournament','Dawg Days Tournament'],['general','General membership / weekly play']].map(([v,l]) => (
                      <label key={v} className="pd-check"><input type="checkbox" checked={form.interests.includes(v)} onChange={() => handleInterest(v)} />{l}</label>
                    ))}
                  </div>
                </div>
                <button type="submit" className="pd-form-submit" disabled={submitting}>
                  {submitting ? 'Sending…' : 'Express Interest — Free 🐾'}
                </button>
              </form>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}

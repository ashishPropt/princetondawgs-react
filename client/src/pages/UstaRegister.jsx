import { useState, useEffect } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import api from '../api/axios'
import toast from 'react-hot-toast'

const NTRP_ELIGIBILITY = {
  1: [2.5, 3.0],
  2: [3.0, 3.5],
}

export default function UstaRegister() {
  const { user } = useAuth()
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const [leagues, setLeagues] = useState([])
  const [selectedLeague, setSelectedLeague] = useState(searchParams.get('league') || '')
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    api.get('/events?type=usta_league').then(r => setLeagues(r.data)).catch(() => {})
  }, [])

  if (!user) {
    return (
      <div className="pd-auth-page">
        <div className="pd-auth-box" style={{ textAlign: 'center' }}>
          <h2>Sign In Required</h2>
          <p>You need an account to register for a USTA league.</p>
          <Link to="/login" className="pd-btn pd-btn-primary" style={{ marginRight: '1rem' }}>Sign In</Link>
          <Link to="/register" className="pd-btn pd-btn-outline">Create Account</Link>
        </div>
      </div>
    )
  }

  const selectedLeagueData = leagues.find(l => String(l.id) === String(selectedLeague))
  const eligible = selectedLeagueData
    ? NTRP_ELIGIBILITY[selectedLeagueData.id]?.includes(parseFloat(user.ntrp))
    : true

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!selectedLeague) { toast.error('Please select a league'); return }
    if (!eligible) { toast.error('You are not eligible for this league based on your NTRP rating'); return }
    setLoading(true)
    try {
      await api.post('/event-registrations', { event_id: selectedLeague })
      toast.success('Registered! 🐾 See you on the court.')
      navigate('/dashboard')
    } catch (err) {
      toast.error(err.response?.data?.error || 'Registration failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{ paddingTop: 80, minHeight: '100vh', background: 'var(--pd-cream)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '5rem 1.5rem' }}>
      <div style={{ background: '#fff', borderRadius: 20, padding: '2.5rem', width: '100%', maxWidth: 520, boxShadow: '0 8px 32px rgba(0,0,0,0.1)' }}>
        <h2 style={{ margin: '0 0 0.5rem' }}>USTA League Registration</h2>
        <p style={{ color: '#888', marginBottom: '2rem' }}>Hi {user.name.split(' ')[0]}! Your NTRP: <strong>{user.ntrp || 'Not set'}</strong></p>
        <form onSubmit={handleSubmit}>
          <div className="pd-form-group">
            <label>Select League *</label>
            <select required value={selectedLeague} onChange={e => setSelectedLeague(e.target.value)}>
              <option value="">Choose a league…</option>
              {leagues.map(l => <option key={l.id} value={l.id}>{l.name} (NTRP {l.ntrp_level})</option>)}
            </select>
          </div>
          {selectedLeagueData && !eligible && (
            <div style={{ background: '#fef2f2', border: '1px solid #fecaca', borderRadius: 8, padding: '0.85rem', marginBottom: '1rem', fontSize: '0.875rem', color: '#dc2626' }}>
              ⚠️ Your NTRP ({user.ntrp}) does not meet eligibility for {selectedLeagueData.name}. Contact a captain if you think this is wrong.
            </div>
          )}
          {selectedLeagueData && eligible && (
            <div style={{ background: '#f0fdf4', border: '1px solid #bbf7d0', borderRadius: 8, padding: '0.85rem', marginBottom: '1rem', fontSize: '0.875rem', color: '#16a34a' }}>
              ✓ You are eligible for this league!
            </div>
          )}
          <button type="submit" className="pd-form-submit" disabled={loading || (!eligible && !!selectedLeague)}>
            {loading ? 'Registering…' : 'Register for League — Free 🎾'}
          </button>
        </form>
      </div>
    </div>
  )
}

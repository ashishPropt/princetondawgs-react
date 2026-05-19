import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import api from '../api/axios'
import toast from 'react-hot-toast'

export default function Register() {
  const [form, setForm] = useState({ name: '', email: '', phone: '', ntrp: '', password: '', confirm: '' })
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (form.password !== form.confirm) { toast.error('Passwords do not match'); return }
    setLoading(true)
    try {
      await api.post('/auth/register', { name: form.name, email: form.email, phone: form.phone, ntrp: form.ntrp, password: form.password })
      toast.success('Welcome to the pack! Please sign in.')
      navigate('/login')
    } catch (err) {
      toast.error(err.response?.data?.error || 'Registration failed')
    } finally {
      setLoading(false)
    }
  }

  const set = (field) => (e) => setForm(f => ({ ...f, [field]: e.target.value }))

  return (
    <div className="pd-auth-page">
      <div className="pd-auth-box" style={{ maxWidth:480 }}>
        <div style={{ textAlign:'center', marginBottom:'1.5rem' }}>
          <span style={{ fontSize:'2.5rem' }}>🐾</span>
          <h2>Join the Pack</h2>
          <p>Free membership. Always.</p>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="pd-form-group">
            <label>Full Name *</label>
            <input type="text" required placeholder="Jane Doe" value={form.name} onChange={set('name')} />
          </div>
          <div className="pd-form-group">
            <label>Email *</label>
            <input type="email" required placeholder="you@example.com" value={form.email} onChange={set('email')} />
          </div>
          <div className="pd-form-row">
            <div className="pd-form-group">
              <label>Phone</label>
              <input type="tel" placeholder="609-555-0100" value={form.phone} onChange={set('phone')} />
            </div>
            <div className="pd-form-group">
              <label>NTRP Rating</label>
              <select value={form.ntrp} onChange={set('ntrp')}>
                <option value="">Select…</option>
                {['2.5','3.0','3.5','4.0','4.5','5.0'].map(v => <option key={v} value={v}>{v}</option>)}
              </select>
            </div>
          </div>
          <div className="pd-form-group">
            <label>Password *</label>
            <input type="password" required placeholder="Min. 8 characters" minLength={8} value={form.password} onChange={set('password')} />
          </div>
          <div className="pd-form-group">
            <label>Confirm Password *</label>
            <input type="password" required placeholder="Repeat password" value={form.confirm} onChange={set('confirm')} />
          </div>
          <button type="submit" className="pd-form-submit" disabled={loading}>
            {loading ? 'Creating account…' : 'Create Account — Free 🐾'}
          </button>
        </form>
        <div className="pd-auth-footer">
          Already a Dawg? <Link to="/login">Sign in</Link>
        </div>
      </div>
    </div>
  )
}

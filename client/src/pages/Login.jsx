import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import toast from 'react-hot-toast'

export default function Login() {
  const [form, setForm] = useState({ email: '', password: '' })
  const [loading, setLoading] = useState(false)
  const { login } = useAuth()
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      const user = await login(form.email, form.password)
      toast.success(`Welcome back, ${user.name.split(' ')[0]}! 🐾`)
      navigate(user.is_admin ? '/admin' : '/dashboard')
    } catch (err) {
      toast.error(err.response?.data?.error || 'Invalid credentials')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="pd-auth-page">
      <div className="pd-auth-box">
        <div style={{ textAlign:'center', marginBottom:'1.5rem' }}>
          <span style={{ fontSize:'2.5rem' }}>🐾</span>
          <h2>Player Login</h2>
          <p>Welcome back to the pack.</p>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="pd-form-group">
            <label>Email</label>
            <input type="email" required placeholder="you@example.com" value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))} />
          </div>
          <div className="pd-form-group">
            <label>Password</label>
            <input type="password" required placeholder="••••••••" value={form.password} onChange={e => setForm(f => ({ ...f, password: e.target.value }))} />
          </div>
          <button type="submit" className="pd-form-submit" disabled={loading} style={{ marginTop:'0.5rem' }}>
            {loading ? 'Signing in…' : 'Sign In'}
          </button>
        </form>
        <div className="pd-auth-footer">
          <Link to="/forgot-password">Forgot your password?</Link>
          <br /><br />
          Not a Dawg yet? <Link to="/register">Join the pack</Link>
        </div>
      </div>
    </div>
  )
}

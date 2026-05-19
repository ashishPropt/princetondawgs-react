import { useState } from 'react'
import { Link } from 'react-router-dom'
import api from '../api/axios'
import toast from 'react-hot-toast'

export function ForgotPassword() {
  const [email, setEmail] = useState('')
  const [sent, setSent] = useState(false)
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      await api.post('/auth/forgot-password', { email })
      setSent(true)
    } catch {
      toast.error('Error sending reset email')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="pd-auth-page">
      <div className="pd-auth-box">
        <h2>Forgot Password</h2>
        {sent
          ? <p style={{ color: '#16a34a' }}>Check your email for a reset link. It expires in 1 hour.</p>
          : (
            <>
              <p>Enter your email and we'll send you a reset link.</p>
              <form onSubmit={handleSubmit}>
                <div className="pd-form-group">
                  <label>Email</label>
                  <input type="email" required value={email} onChange={e => setEmail(e.target.value)} placeholder="you@example.com" />
                </div>
                <button type="submit" className="pd-form-submit" disabled={loading}>{loading ? 'Sending…' : 'Send Reset Link'}</button>
              </form>
            </>
          )
        }
        <div className="pd-auth-footer"><Link to="/login">Back to login</Link></div>
      </div>
    </div>
  )
}

export function ResetPassword() {
  const [form, setForm] = useState({ password: '', confirm: '' })
  const [loading, setLoading] = useState(false)
  const token = new URLSearchParams(window.location.search).get('token')

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (form.password !== form.confirm) { toast.error('Passwords do not match'); return }
    setLoading(true)
    try {
      await api.post('/auth/reset-password', { token, password: form.password })
      toast.success('Password updated! Please log in.')
      window.location.href = '/login'
    } catch {
      toast.error('Invalid or expired reset link')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="pd-auth-page">
      <div className="pd-auth-box">
        <h2>Set New Password</h2>
        <form onSubmit={handleSubmit}>
          <div className="pd-form-group"><label>New Password</label><input type="password" required minLength={8} value={form.password} onChange={e => setForm(f => ({ ...f, password: e.target.value }))} /></div>
          <div className="pd-form-group"><label>Confirm Password</label><input type="password" required value={form.confirm} onChange={e => setForm(f => ({ ...f, confirm: e.target.value }))} /></div>
          <button type="submit" className="pd-form-submit" disabled={loading}>{loading ? 'Updating…' : 'Update Password'}</button>
        </form>
      </div>
    </div>
  )
}

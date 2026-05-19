import { useState } from 'react'
import { Link, NavLink, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function Navbar() {
  const { user, logout } = useAuth()
  const [open, setOpen] = useState(false)
  const navigate = useNavigate()

  const handleLogout = () => { logout(); navigate('/') }

  return (
    <nav className="pd-nav">
      <div className="pd-nav-inner">
        <Link to="/" className="pd-logo">
          <span>🐾</span>
          <span>Princeton<strong>Dawgs</strong></span>
        </Link>

        <ul className={`pd-nav-links${open ? ' pd-open' : ''}`}>
          <li><NavLink to="/" end onClick={() => setOpen(false)}>Home</NavLink></li>
          <li><NavLink to="/team" onClick={() => setOpen(false)}>The Pack</NavLink></li>
          <li><NavLink to="/leagues" onClick={() => setOpen(false)}>USTA Leagues</NavLink></li>
          <li><NavLink to="/tournament" onClick={() => setOpen(false)}>Tournament</NavLink></li>
          <li><NavLink to="/sponsors" onClick={() => setOpen(false)}>Sponsors</NavLink></li>
          {user ? (
            <>
              <li><NavLink to="/dashboard" onClick={() => setOpen(false)}>Dashboard</NavLink></li>
              {user.is_admin && <li><NavLink to="/admin" onClick={() => setOpen(false)}>Admin</NavLink></li>}
              <li>
                <button onClick={handleLogout} style={{ background:'none', border:'none', cursor:'pointer', color:'rgba(255,255,255,0.8)', padding:'0.4rem 0.75rem', fontSize:'0.9rem' }}>
                  Logout ({user.name.split(' ')[0]})
                </button>
              </li>
            </>
          ) : (
            <>
              <li><NavLink to="/login" onClick={() => setOpen(false)}>Login</NavLink></li>
              <li><NavLink to="/register" className="pd-nav-cta" onClick={() => setOpen(false)}>Join the Pack</NavLink></li>
            </>
          )}
        </ul>

        <button
          className="pd-hamburger"
          onClick={() => setOpen(!open)}
          aria-label="Menu"
        >
          {open ? '✕' : '☰'}
        </button>
      </div>
    </nav>
  )
}

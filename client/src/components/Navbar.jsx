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
          <li><NavLink to="/" end>Home</NavLink></li>
          <li><NavLink to="/team">The Pack</NavLink></li>
          <li><NavLink to="/leagues">USTA Leagues</NavLink></li>
          <li><NavLink to="/tournament">Tournament</NavLink></li>
          <li><NavLink to="/sponsors">Sponsors</NavLink></li>
          {user ? (
            <>
              <li><NavLink to="/dashboard">Dashboard</NavLink></li>
              {user.is_admin && <li><NavLink to="/admin">Admin</NavLink></li>}
              <li>
                <button onClick={handleLogout} style={{ background:'none', border:'none', cursor:'pointer', color:'rgba(255,255,255,0.8)', padding:'0.4rem 0.75rem', fontSize:'0.9rem' }}>
                  Logout ({user.name.split(' ')[0]})
                </button>
              </li>
            </>
          ) : (
            <li><NavLink to="/register" className="pd-nav-cta">Join the Pack</NavLink></li>
          )}
        </ul>
        <button
          style={{ background:'none', border:'none', color:'#fff', fontSize:'1.4rem', cursor:'pointer' }}
          onClick={() => setOpen(!open)}
          aria-label="Menu"
          className="pd-hamburger"
        >
          ☰
        </button>
      </div>
    </nav>
  )
}

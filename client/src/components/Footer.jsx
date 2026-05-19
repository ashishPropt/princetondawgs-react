import { Link } from 'react-router-dom'

export default function Footer() {
  return (
    <footer className="pd-footer">
      <div className="pd-footer-inner">
        <div>
          <span className="pd-footer-logo">Princeton<strong>Dawgs</strong></span>
          <p>Princeton, NJ · USTA Mid-Atlantic Section</p>
          <p>Free membership. Competitive play.</p>
        </div>
        <div className="pd-footer-links">
          <h4>Quick Links</h4>
          <Link to="/">Home</Link>
          <Link to="/leagues">USTA Leagues</Link>
          <Link to="/tournament">Tournament</Link>
          <Link to="/team">The Pack</Link>
          <Link to="/sponsors">Sponsors</Link>
        </div>
        <div className="pd-footer-links">
          <h4>The App</h4>
          <Link to="/login">Player Login</Link>
          <Link to="/register">Register</Link>
          <Link to="/dashboard">Dashboard</Link>
          <Link to="/usta-register">USTA Register</Link>
        </div>
        <div className="pd-footer-usta">
          <span>🎾 USTA Registered</span>
          <p>Mid-Atlantic Section</p>
          <p style={{ marginTop: '1rem' }}>Questions?</p>
          <a href="mailto:info@princetondawgs.com" style={{ color: 'var(--pd-orange)' }}>Contact us</a>
        </div>
      </div>
      <div className="pd-footer-bottom" style={{ maxWidth:'1200px', margin:'0 auto', paddingTop:'1.5rem', borderTop:'1px solid rgba(255,255,255,0.1)', display:'flex', justifyContent:'space-between', fontSize:'0.82rem' }}>
        <p>© {new Date().getFullYear()} Princeton Dawgs Tennis. All rights reserved.</p>
        <div>
          <Link to="/privacy">Privacy</Link>
          <Link to="/terms">Terms</Link>
        </div>
      </div>
    </footer>
  )
}

import { useState } from 'react'
import api from '../api/axios'
import toast from 'react-hot-toast'

const TIERS = [
  { name: 'Paw Print', price: '$250', perks: ['Name on website', 'Social shoutout', 'Thank-you at events'] },
  { name: 'Dawg Pack', price: '$500', perks: ['Logo on website', 'Banner at events', '2 free event tickets', 'Social campaign'] },
  { name: 'Top Dawg', price: '$1,000', perks: ['Premium logo placement', 'Named tournament sponsor', '5 free event tickets', 'Year-round social features', 'Email to all members'] }
]

export default function Sponsors() {
  const [form, setForm] = useState({ name: '', company: '', email: '', phone: '', tier: '', message: '' })
  const [loading, setLoading] = useState(false)

  const set = (f) => (e) => setForm(p => ({ ...p, [f]: e.target.value }))

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      await api.post('/public/sponsor-inquiry', form)
      toast.success("Thanks! We'll be in touch soon.")
      setForm({ name: '', company: '', email: '', phone: '', tier: '', message: '' })
    } catch {
      toast.error('Something went wrong. Please email us directly.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{ paddingTop: 80, minHeight: '100vh' }}>
      <div style={{ background: 'var(--pd-dark)', padding: '3rem 1.5rem', textAlign: 'center' }}>
        <div className="pd-container">
          <span className="pd-tag pd-tag-light">Partner With Us</span>
          <h1 className="pd-section-title pd-white">Sponsor the Dawgs</h1>
          <p style={{ color: 'rgba(255,255,255,0.7)', maxWidth: 520, margin: '0 auto' }}>Support Princeton's most active recreational tennis community and get your brand in front of a passionate, local audience.</p>
        </div>
      </div>

      <div className="pd-container" style={{ paddingTop: '3rem', paddingBottom: '3rem' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px,1fr))', gap: '1.5rem', marginBottom: '4rem' }}>
          {TIERS.map((t, i) => (
            <div key={t.name} style={{ background: i === 2 ? 'var(--pd-dark)' : '#fff', color: i === 2 ? '#fff' : 'inherit', border: i === 1 ? '2px solid var(--pd-orange)' : '1px solid #e8e8e8', borderRadius: 16, padding: '2rem', boxShadow: '0 4px 16px rgba(0,0,0,0.08)' }}>
              {i === 1 && <div style={{ background: 'var(--pd-orange)', color: '#fff', fontSize: '0.72rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', padding: '0.25rem 0.75rem', borderRadius: 100, display: 'inline-block', marginBottom: '0.75rem' }}>Most Popular</div>}
              <div style={{ fontSize: '0.78rem', textTransform: 'uppercase', letterSpacing: '0.08em', color: i === 2 ? 'var(--pd-orange)' : '#888', marginBottom: '0.5rem' }}>Tier</div>
              <h3 style={{ margin: '0 0 0.5rem', fontSize: '1.4rem' }}>{t.name}</h3>
              <div style={{ fontSize: '2rem', fontWeight: 700, color: i === 2 ? 'var(--pd-orange)' : 'var(--pd-dark)', marginBottom: '1.5rem' }}>{t.price}<span style={{ fontSize: '0.85rem', fontWeight: 400, color: '#888' }}>/season</span></div>
              <ul style={{ listStyle: 'none', padding: 0, margin: '0 0 1.5rem' }}>
                {t.perks.map(p => <li key={p} style={{ padding: '0.4rem 0', fontSize: '0.9rem', display: 'flex', alignItems: 'center', gap: '0.5rem', borderBottom: `1px solid ${i === 2 ? 'rgba(255,255,255,0.1)' : '#f0f0f0'}` }}><span style={{ color: 'var(--pd-green)' }}>✓</span>{p}</li>)}
              </ul>
              <button onClick={() => setForm(f => ({ ...f, tier: t.name }))} className="pd-btn pd-btn-primary" style={{ width: '100%' }}>Get Started</button>
            </div>
          ))}
        </div>

        <div style={{ maxWidth: 620, margin: '0 auto', background: '#fff', borderRadius: 20, padding: '2.5rem', boxShadow: '0 4px 16px rgba(0,0,0,0.08)' }}>
          <h2 style={{ margin: '0 0 0.5rem' }}>Sponsor Inquiry</h2>
          <p style={{ color: '#888', marginBottom: '2rem', fontSize: '0.9rem' }}>Fill out the form and we'll follow up within 48 hours.</p>
          <form onSubmit={handleSubmit}>
            <div className="pd-form-row">
              <div className="pd-form-group"><label>Your Name *</label><input required value={form.name} onChange={set('name')} placeholder="Jane Smith" /></div>
              <div className="pd-form-group"><label>Company *</label><input required value={form.company} onChange={set('company')} placeholder="Acme LLC" /></div>
            </div>
            <div className="pd-form-row">
              <div className="pd-form-group"><label>Email *</label><input type="email" required value={form.email} onChange={set('email')} placeholder="jane@acme.com" /></div>
              <div className="pd-form-group"><label>Phone</label><input value={form.phone} onChange={set('phone')} placeholder="609-555-0100" /></div>
            </div>
            <div className="pd-form-group">
              <label>Interested Tier</label>
              <select value={form.tier} onChange={set('tier')}>
                <option value="">Select a tier…</option>
                {TIERS.map(t => <option key={t.name} value={t.name}>{t.name} ({t.price})</option>)}
              </select>
            </div>
            <div className="pd-form-group">
              <label>Message</label>
              <textarea rows={4} value={form.message} onChange={set('message')} placeholder="Tell us about your business and goals…" style={{ width:'100%', padding:'0.65rem 0.85rem', border:'1.5px solid #e0e0e0', borderRadius:8, fontFamily:'inherit', fontSize:'0.95rem', outline:'none', resize:'vertical' }} />
            </div>
            <button type="submit" className="pd-form-submit" disabled={loading}>{loading ? 'Sending…' : 'Submit Inquiry'}</button>
          </form>
        </div>
      </div>
    </div>
  )
}

import { useState, useEffect } from 'react'
import api from '../api/axios'
import toast from 'react-hot-toast'

const TIERS = [
  { name: 'Top Dawg', price: '$1,000', color: '#854d0e', bg: '#fef9c3', border: '#fde68a', featured: true,
    perks: ['Logo on event t-shirts (back, large)', 'Prominent logo on website sponsors page + homepage', 'Courtside banner at the Dawg Days tournament', 'Featured in member newsletters (6 issues)', 'Social media shoutout (2× per season)', '1 complimentary tournament entry', 'Logo on club email footers'] },
  { name: 'Dawg Pack', price: '$500', color: '#475569', bg: '#f1f5f9', border: '#cbd5e1', featured: false,
    perks: ['Logo on event t-shirts (back, medium)', 'Logo on website sponsors page', 'Mentioned in 3 member newsletters', 'Social media shoutout (1× per season)', 'Courtside signage at home matches'] },
  { name: 'Paw Print', price: '$250', color: '#166534', bg: '#f0fdf4', border: '#bbf7d0', featured: false,
    perks: ['Name + link on website sponsors page', 'Mentioned in 1 member newsletter', 'Social media thank-you post', 'Satisfaction of supporting local tennis 🎾'] },
]

const PERKS = [
  { icon: '👕', title: 'Event T-Shirts', desc: 'Your logo printed on shirts worn by every player at every tournament and league match day — living billboards around Princeton courts and beyond.' },
  { icon: '🌐', title: 'Website Presence', desc: 'Logo and link featured on princetondawgs.com — seen by players, parents, opponents, and prospective members year-round.' },
  { icon: '🏟️', title: 'Courtside Signage', desc: 'Branded banner displayed at the Dawg Days of Summer tournament and league home matches — visible to players, spectators, and opponents.' },
  { icon: '📣', title: 'Social Shoutouts', desc: 'Featured in club social media posts for major events, match results, and tournament announcements throughout the season.' },
  { icon: '📧', title: 'Newsletter Feature', desc: "Logo and a short blurb in our member email newsletter — direct reach into players' inboxes each month." },
  { icon: '🤝', title: 'Community Goodwill', desc: 'Align your brand with a positive, inclusive community sport. Support local tennis and show Princeton you invest in the people who live here.' },
]

const FAQS = [
  { q: 'Can I sponsor a single event instead of the whole season?', a: 'Absolutely. Reach out via the form below and we can put together a custom per-event package. Single-event logo placement on shirts and banners is available starting at $100.' },
  { q: 'What file format do you need for my logo?', a: "We prefer a vector file (SVG, AI, or EPS) or a high-resolution PNG (at least 300 dpi) for print quality on t-shirts and banners. We'll reach out after you sign up to collect the file." },
  { q: 'When is the deadline to get my logo on the t-shirts?', a: "We typically finalize the shirt design 3–4 weeks before each event. If you sign up after that deadline, your logo will appear on the next print run." },
  { q: 'How do I pay?', a: "After we confirm your package, we'll send an invoice you can pay via check, Zelle, or Venmo. We'll issue a receipt for your records." },
  { q: 'Is my sponsorship tax-deductible?', a: "Princeton Dawgs is a community club and sponsorships are typically treated as advertising expenses by most businesses — consult your accountant. We are not a registered 501(c)(3) nonprofit." },
]

const isDark = (hex) => {
  const c = hex.replace('#','')
  const r = parseInt(c.substr(0,2),16), g = parseInt(c.substr(2,2),16), b = parseInt(c.substr(4,2),16)
  return (r*299 + g*587 + b*114) / 1000 < 128
}

export default function Sponsors() {
  const [sponsors, setSponsors] = useState([])
  const [form, setForm] = useState({ name: '', company: '', email: '', phone: '', tier: '', message: '' })
  const [loading, setLoading] = useState(false)
  const [openFaq, setOpenFaq] = useState(null)

  useEffect(() => {
    api.get('/public/sponsors').then(r => setSponsors(r.data)).catch(() => {})
  }, [])

  const set = (f) => (e) => setForm(p => ({ ...p, [f]: e.target.value }))

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      await api.post('/public/sponsor-inquiry', form)
      toast.success("Thanks! A captain will be in touch within 48 hours.")
      setForm({ name: '', company: '', email: '', phone: '', tier: '', message: '' })
    } catch {
      toast.error('Something went wrong. Please email captains@princetondawgs.com directly.')
    } finally {
      setLoading(false)
    }
  }

  // Group sponsors by tier for display
  const byTier = sponsors.reduce((acc, s) => {
    if (!acc[s.tier]) acc[s.tier] = []
    acc[s.tier].push(s)
    return acc
  }, {})

  return (
    <div style={{ paddingTop: 64, minHeight: '100vh', background: '#f8f9fa' }}>

      {/* HERO */}
      <div style={{ background: 'linear-gradient(135deg, #1A1A2E 0%, #2a4a7a 60%, #1a3a6a 100%)', color: '#fff', padding: '4rem 1.5rem 3.5rem', textAlign: 'center', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', right: '-2rem', top: '-1rem', fontSize: '12rem', opacity: 0.06, pointerEvents: 'none' }}>🎾</div>
        <div className="pd-container" style={{ position: 'relative' }}>
          <div style={{ display: 'inline-block', background: 'var(--pd-orange)', color: '#fff', fontSize: '0.78rem', fontWeight: 700, padding: '0.28rem 0.8rem', borderRadius: 20, marginBottom: '1.2rem', letterSpacing: '0.05em', textTransform: 'uppercase' }}>2025 — 2026 Season</div>
          <h1 style={{ fontSize: 'clamp(2rem,5vw,2.8rem)', fontWeight: 800, marginBottom: '0.6rem', lineHeight: 1.15 }}>Partner With Princeton Dawgs</h1>
          <p style={{ fontSize: '1.1rem', opacity: 0.88, maxWidth: 640, margin: '0 auto 1.8rem' }}>Connect your brand with an active, community-minded group of tennis players, their families, and supporters right here in Princeton, NJ.</p>
          <a href="#packages" className="pd-btn pd-btn-primary" style={{ marginRight: '0.75rem' }}>View Packages</a>
          <a href="#contact" className="pd-btn pd-btn-ghost">Get In Touch</a>
        </div>
      </div>

      <div className="pd-container" style={{ padding: '2rem 1.5rem 4rem' }}>

        {/* REACH STATS */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem', justifyContent: 'center', background: '#fff', border: '1px solid #e8e8e8', borderRadius: 16, padding: '1.75rem 2rem', marginBottom: '3rem', boxShadow: '0 2px 8px rgba(0,0,0,0.06)' }}>
          {[['60+','Active Players'],['3','USTA Leagues / yr'],['2','Tournaments / yr'],['300+','T-shirts Printed'],['Princeton','NJ Community']].map(([num, lbl]) => (
            <div key={lbl} style={{ textAlign: 'center', minWidth: 130 }}>
              <span style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--pd-orange)', display: 'block' }}>{num}</span>
              <span style={{ fontSize: '0.8rem', color: '#888', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{lbl}</span>
            </div>
          ))}
        </div>

        {/* CURRENT SPONSORS — loaded live from DB */}
        {sponsors.length > 0 && (
          <section style={{ marginBottom: '3rem' }}>
            <h2 style={{ fontSize: '1.6rem', marginBottom: '0.4rem' }}>Our Current Sponsors</h2>
            <p style={{ color: '#666', marginBottom: '1.5rem' }}>Thank you to our sponsors for supporting the 2025–2026 season.</p>
            {['Top Dawg','Dawg Pack','Paw Print'].map(tier => byTier[tier]?.length > 0 && (
              <div key={tier} style={{ marginBottom: '2rem' }}>
                <div style={{ fontSize: '0.78rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', color: '#888', marginBottom: '0.75rem' }}>{tier}</div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px,1fr))', gap: '1rem' }}>
                  {byTier[tier].map(s => (
                    <a key={s.id} href={s.website_url || '#'} target="_blank" rel="noopener noreferrer" style={{ textDecoration: 'none' }}>
                      <div style={{ background: s.bg_color || '#fff', border: '2px solid var(--pd-orange)', borderRadius: 14, padding: '1.5rem', textAlign: 'center', boxShadow: '0 4px 12px rgba(0,0,0,0.08)', transition: 'transform 0.2s, box-shadow 0.2s', cursor: 'pointer' }}
                        onMouseEnter={e => { e.currentTarget.style.transform='translateY(-4px)'; e.currentTarget.style.boxShadow='0 8px 24px rgba(0,0,0,0.14)' }}
                        onMouseLeave={e => { e.currentTarget.style.transform='translateY(0)'; e.currentTarget.style.boxShadow='0 4px 12px rgba(0,0,0,0.08)' }}
                      >
                        {s.logo_url
                          ? <img src={s.logo_url} alt={s.name} style={{ maxHeight: 56, maxWidth: '100%', objectFit: 'contain', marginBottom: '0.5rem' }} />
                          : <div style={{ fontWeight: 800, fontSize: '1.1rem', color: isDark(s.bg_color || '#fff') ? '#fff' : 'var(--pd-dark)', marginBottom: '0.5rem' }}>{s.name}</div>
                        }
                        {s.logo_url && <div style={{ fontSize: '0.85rem', fontWeight: 600, color: isDark(s.bg_color || '#fff') ? '#fff' : 'var(--pd-dark)' }}>{s.name}</div>}
                      </div>
                    </a>
                  ))}
                </div>
              </div>
            ))}
          </section>
        )}

        {/* WHAT SPONSORS GET */}
        <section style={{ marginBottom: '3rem' }}>
          <h2 style={{ fontSize: '1.6rem', marginBottom: '1.25rem' }} id="packages">What Your Sponsorship Does</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(230px, 1fr))', gap: '1.25rem' }}>
            {PERKS.map(p => (
              <div key={p.title} style={{ background: '#fff', border: '1px solid #e8e8e8', borderRadius: 14, padding: '1.4rem 1.25rem', boxShadow: '0 2px 8px rgba(0,0,0,0.04)' }}>
                <span style={{ fontSize: '2rem', marginBottom: '0.6rem', display: 'block' }}>{p.icon}</span>
                <h4 style={{ fontSize: '0.97rem', color: 'var(--pd-dark)', margin: '0 0 0.4rem' }}>{p.title}</h4>
                <p style={{ fontSize: '0.84rem', color: '#666', lineHeight: 1.5, margin: 0 }}>{p.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* TIER CARDS */}
        <h2 style={{ fontSize: '1.6rem', marginBottom: '1.25rem' }}>Sponsorship Packages</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '1.5rem', marginBottom: '3rem' }}>
          {TIERS.map(t => (
            <div key={t.name} style={{ background: '#fff', border: `2px solid ${t.featured ? 'var(--pd-orange)' : '#e8e8e8'}`, borderRadius: 16, padding: '2rem 1.5rem', boxShadow: t.featured ? '0 0 0 3px rgba(245,90,0,0.15), 0 4px 16px rgba(0,0,0,0.08)' : '0 4px 16px rgba(0,0,0,0.06)', display: 'flex', flexDirection: 'column', position: 'relative', overflow: 'hidden' }}>
              {t.featured && <div style={{ position: 'absolute', top: 14, right: -28, background: 'var(--pd-orange)', color: '#fff', fontSize: '0.65rem', fontWeight: 800, padding: '0.22rem 2.2rem', transform: 'rotate(35deg)', letterSpacing: '0.08em', textTransform: 'uppercase' }}>Most Impact</div>}
              <div style={{ display: 'inline-block', background: t.bg, color: t.color, border: `1px solid ${t.border}`, borderRadius: 100, padding: '0.3rem 0.8rem', fontSize: '0.78rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.07em', marginBottom: '1rem', alignSelf: 'flex-start' }}>{t.name}</div>
              <div style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--pd-dark)', marginBottom: '0.2rem', lineHeight: 1 }}>{t.price} <span style={{ fontSize: '0.95rem', fontWeight: 400, color: '#888' }}>/ season</span></div>
              <ul style={{ listStyle: 'none', margin: '1rem 0 1.5rem', padding: 0, flex: 1 }}>
                {t.perks.map(p => (
                  <li key={p} style={{ fontSize: '0.88rem', padding: '0.38rem 0', borderBottom: '1px solid #f0f0f0', display: 'flex', gap: '0.55rem', alignItems: 'flex-start' }}>
                    <span style={{ color: 'var(--pd-orange)', fontWeight: 800, flexShrink: 0 }}>✓</span>{p}
                  </li>
                ))}
              </ul>
              <a href="#contact" className="pd-btn pd-btn-primary" style={{ textAlign: 'center', display: 'block' }} onClick={() => setForm(f => ({ ...f, tier: t.name }))}>
                Become a {t.name} Sponsor
              </a>
            </div>
          ))}
        </div>

        {/* INQUIRY FORM */}
        <section id="contact" style={{ marginBottom: '3rem' }}>
          <h2 style={{ fontSize: '1.6rem', marginBottom: '0.25rem' }}>Get In Touch</h2>
          <p style={{ color: '#666', marginBottom: '2rem' }}>Fill out the form and a Princeton Dawgs captain will follow up within 48 hours.</p>
          <div style={{ background: '#fff', border: '1px solid #e8e8e8', borderRadius: 20, padding: '2.5rem', maxWidth: 680, boxShadow: '0 4px 16px rgba(0,0,0,0.06)' }}>
            <form onSubmit={handleSubmit}>
              <div className="pd-form-row">
                <div className="pd-form-group"><label>Your Name *</label><input required value={form.name} onChange={set('name')} placeholder="Jane Smith" /></div>
                <div className="pd-form-group"><label>Business / Organization</label><input value={form.company} onChange={set('company')} placeholder="Acme LLC" /></div>
              </div>
              <div className="pd-form-row">
                <div className="pd-form-group"><label>Email *</label><input type="email" required value={form.email} onChange={set('email')} placeholder="jane@acme.com" /></div>
                <div className="pd-form-group"><label>Phone</label><input value={form.phone} onChange={set('phone')} placeholder="609-555-0100" /></div>
              </div>
              <div className="pd-form-group">
                <label>Package Interest</label>
                <select value={form.tier} onChange={set('tier')}>
                  <option value="">— Select a package —</option>
                  <option value="Top Dawg">🏆 Top Dawg — $1,000</option>
                  <option value="Dawg Pack">🐾 Dawg Pack — $500</option>
                  <option value="Paw Print">🐾 Paw Print — $250</option>
                  <option value="Custom">💬 Let's discuss something custom</option>
                </select>
              </div>
              <div className="pd-form-group">
                <label>Message / Questions</label>
                <textarea rows={4} value={form.message} onChange={set('message')} placeholder="Tell us about your business, any questions, or ideas for a custom arrangement..." style={{ width: '100%', padding: '0.65rem 0.85rem', border: '1.5px solid #e0e0e0', borderRadius: 8, fontFamily: 'inherit', fontSize: '0.95rem', outline: 'none', resize: 'vertical' }} />
              </div>
              <button type="submit" className="pd-form-submit" disabled={loading}>{loading ? 'Sending…' : 'Send Inquiry →'}</button>
            </form>
          </div>
        </section>

        {/* FAQ */}
        <section style={{ marginBottom: '2rem' }}>
          <h2 style={{ fontSize: '1.6rem', marginBottom: '1.25rem' }}>Frequently Asked Questions</h2>
          <div style={{ maxWidth: 720 }}>
            {FAQS.map((faq, i) => (
              <div key={i} style={{ background: '#fff', border: '1px solid #e8e8e8', borderRadius: 12, marginBottom: '0.7rem', overflow: 'hidden' }}>
                <button onClick={() => setOpenFaq(openFaq === i ? null : i)} style={{ width: '100%', textAlign: 'left', background: 'none', border: 'none', padding: '1rem 1.25rem', fontSize: '0.95rem', fontWeight: 600, color: 'var(--pd-dark)', cursor: 'pointer', display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontFamily: 'inherit' }}>
                  {faq.q}
                  <span style={{ transition: 'transform 0.2s', transform: openFaq === i ? 'rotate(180deg)' : 'rotate(0)', fontSize: '0.75rem', flexShrink: 0, marginLeft: '1rem' }}>▼</span>
                </button>
                {openFaq === i && (
                  <div style={{ padding: '0 1.25rem 1rem', fontSize: '0.88rem', color: '#666', lineHeight: 1.6 }}>{faq.a}</div>
                )}
              </div>
            ))}
          </div>
        </section>

      </div>
    </div>
  )
}

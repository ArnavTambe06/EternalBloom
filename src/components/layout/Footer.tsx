import { Link } from 'react-router-dom'
import { Mail } from 'lucide-react'
import { BRAND, CATEGORIES } from '@/lib/constants'

const linkStyle: React.CSSProperties = {
  fontFamily: 'var(--sans)', fontSize: 13,
  color: 'rgba(28,15,10,0.6)', transition: 'color 0.2s',
  display: 'block', marginBottom: 10,
}

const hoverIn = (e: React.MouseEvent<HTMLAnchorElement>) =>
  (e.currentTarget.style.color = 'var(--ink)')
const hoverOut = (e: React.MouseEvent<HTMLAnchorElement>) =>
  (e.currentTarget.style.color = 'rgba(28,15,10,0.6)')

export function Footer() {
  return (
    <footer style={{
      background: 'linear-gradient(160deg, rgba(255,133,208,0.15) 0%, rgba(255,200,162,0.12) 50%, rgba(255,230,128,0.10) 100%)',
      borderTop: '1px solid var(--line-2)',
      position: 'relative',
    }}>
      {/* CTA strip */}
      <div className="wrap footer-grid" style={{
        padding: '64px 0 48px',
        display: 'grid',
        gridTemplateColumns: '1.8fr 1fr 1fr 1fr',
        gap: 48,
      }} >

        {/* Brand */}
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16 }}>
            <div style={{
              width: 34, height: 34, borderRadius: '50%',
              background: 'var(--grad)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontFamily: 'var(--serif)', fontWeight: 700, fontSize: 13,
              color: 'var(--ink)',
              boxShadow: '0 4px 12px rgba(255,133,208,0.3)',
            }}>EB</div>
            <span style={{
              fontFamily: 'var(--serif)', fontSize: 16,
              fontWeight: 700, color: 'var(--ink)',
            }}>{BRAND.name}</span>
          </div>
          <p style={{
            fontFamily: 'var(--sans)', fontSize: 13,
            color: 'var(--ink-2)', lineHeight: 1.6,
            maxWidth: 220, marginBottom: 24,
          }}>
            Handcrafted crochet pieces — designed with patience, packed with emotions.
          </p>
          <div style={{ display: 'flex', gap: 10 }}>
            {[
              {
                href: BRAND.instagram, label: 'Instagram',
                icon: <svg width="14" height="14" viewBox="0 0 24 24" fill="none"
                  stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="2" y="2" width="20" height="20" rx="5" />
                  <circle cx="12" cy="12" r="4" />
                  <circle cx="17.5" cy="6.5" r="0.5" fill="currentColor" />
                </svg>
              },
              {
                href: `mailto:${BRAND.email}`, label: 'Email',
                icon: <Mail size={14} strokeWidth={1.6} />,
              },
              {
                
  href: `tel:${BRAND.phone}`, label: 'Phone',
  icon: (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none"
      stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
      <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07A19.5 19.5 0 013.07 8.8a19.79 19.79 0 01-3.07-8.7A2 2 0 012.18 2h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L6.91 9.91a16 16 0 006.16 6.16l1.27-.53a2 2 0 012.11.45c.907.339 1.85.573 2.81.7A2 2 0 0122 16.92z"/>
    </svg>
  ),
              },
            ].map(s => (
              <a key={s.label} href={s.href}
                target={s.href.startsWith('http') ? '_blank' : undefined}
                rel="noopener noreferrer"
                style={{
                  width: 36, height: 36, borderRadius: '50%',
                  border: '1px solid var(--line-2)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  color: 'var(--ink-2)', transition: 'all 0.2s',
                }}
                onMouseEnter={e => {
                  e.currentTarget.style.backgroundColor = 'rgba(255,133,208,0.15)'
                  e.currentTarget.style.borderColor = 'var(--accent)'
                  e.currentTarget.style.color = 'var(--accent)'
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.backgroundColor = 'transparent'
                  e.currentTarget.style.borderColor = 'var(--line-2)'
                  e.currentTarget.style.color = 'var(--ink-2)'
                }}
              >
                {s.icon}
              </a>
            ))}
          </div>
        </div>

        {/* Shop */}
        <div>
          <p className="label" style={{ marginBottom: 16 }}>Shop</p>
          {CATEGORIES.slice(0, 5).map(cat => (
            <Link key={cat.slug} to={`/categories/${cat.slug}`}
              style={linkStyle} onMouseEnter={hoverIn} onMouseLeave={hoverOut}>
              {cat.name}
            </Link>
          ))}
        </div>

        <div>
          <p className="label" style={{ marginBottom: 16 }}>More</p>
          {CATEGORIES.slice(5).map(cat => (
            <Link key={cat.slug} to={`/categories/${cat.slug}`}
              style={linkStyle} onMouseEnter={hoverIn} onMouseLeave={hoverOut}>
              {cat.name}
            </Link>
          ))}
        </div>

        <div>
          <p className="label" style={{ marginBottom: 16 }}>Help</p>
          {[
            { label: 'Custom Order', href: '/custom-order' },
            { label: 'My Orders', href: '/my-orders' },
            { label: 'About Us', href: '/about' },
            { label: 'Contact', href: '/contact' },
            { label: 'Login', href: '/login' },
          ].map(l => (
            <Link key={l.href} to={l.href}
              style={linkStyle} onMouseEnter={hoverIn} onMouseLeave={hoverOut}>
              {l.label}
            </Link>
          ))}
        </div>
      </div>

      {/* Bottom bar */}
      <div style={{ borderTop: '1px solid var(--line)' }}>
        <div className="wrap" style={{
          padding: '16px 0',
          display: 'flex', justifyContent: 'space-between',
          alignItems: 'center', flexWrap: 'wrap', gap: 8,
        }}>
          <p style={{ fontFamily: 'var(--sans)', fontSize: 12, color: 'var(--ink-3)' }}>
            © {new Date().getFullYear()} {BRAND.name}. All rights reserved.
          </p>
          <p style={{ fontFamily: 'var(--sans)', fontSize: 12, color: 'var(--ink-3)' }}>
            Cash on Delivery · Handmade in India
          </p>
        </div>
      </div>
    </footer>
  )
}
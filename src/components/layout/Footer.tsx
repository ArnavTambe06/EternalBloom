import { Link } from 'react-router-dom'
import { Mail } from 'lucide-react'
import { BRAND, CATEGORIES } from '@/lib/constants'
import type { CSSProperties, MouseEvent } from 'react'

const hoverIn = (e: MouseEvent<HTMLElement>) => {
  e.currentTarget.style.color = 'var(--primary-dim)'
  e.currentTarget.style.borderColor = 'var(--primary-dim)'
}
const hoverOut = (e: MouseEvent<HTMLElement>) => {
  e.currentTarget.style.color = 'var(--primary-muted)'
  e.currentTarget.style.borderColor = 'rgba(183,200,222,0.2)'
}
const linkIn = (e: MouseEvent<HTMLAnchorElement>) => {
  e.currentTarget.style.color = 'var(--primary-dim)'
}
const linkOut = (e: MouseEvent<HTMLAnchorElement>) => {
  e.currentTarget.style.color = 'var(--primary-muted)'
}

const footerLinkStyle: CSSProperties = {
  fontFamily: 'var(--font-body)',
  fontSize: 13,
  color: 'var(--primary-muted)',
  transition: 'color 0.2s',
  display: 'block',
}

const iconBtnStyle: React.CSSProperties = {
  width: 36, height: 36,
  border: '1px solid rgba(183,200,222,0.2)',
  display: 'flex', alignItems: 'center', justifyContent: 'center',
  color: 'var(--primary-muted)',
  transition: 'all 0.2s',
  textDecoration: 'none',
}

export function Footer() {
  return (
  <footer style={{ backgroundColor: 'var(--primary)', color: 'var(--primary-dim)' }}>

      {/* CTA strip */}
      <div style={{
        borderBottom: '1px solid rgba(183,200,222,0.1)',
        padding: '48px var(--margin-desktop)',
        display: 'flex', alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap', gap: 24,
        maxWidth: 'var(--container)', margin: '0 auto',
      }}>
        <div>
          <p className="label-caps" style={{ color: 'var(--secondary-dim)', marginBottom: 8 }}>
            Custom Creations
          </p>
          <h3 style={{
            fontFamily: 'var(--font-display)',
            fontSize: 28, fontWeight: 600,
            color: 'white', letterSpacing: '-0.02em',
          }}>
            Something in mind?
          </h3>
        </div>
        <Link to="/custom-order">
          <button style={{
            padding: '13px 32px',
            backgroundColor: 'transparent',
            border: '1px solid rgba(183,200,222,0.3)',
            color: 'var(--on-surface)',
            fontFamily: 'var(--font-body)',
            fontSize: 11, fontWeight: 600,
            letterSpacing: '0.1em', textTransform: 'uppercase',
            cursor: 'pointer', transition: 'all 0.2s',
          }}>
            Request Custom Order
          </button>
        </Link>
      </div>

      {/* Main grid */}
      <div style={{
        maxWidth: 'var(--container)', margin: '0 auto',
        padding: '56px var(--margin-desktop) 40px',
        display: 'grid',
        gridTemplateColumns: '1.5fr 1fr 1fr 1fr',
        gap: 48,
      }}>

        {/* Brand col */}
        <div>
          <p style={{
            fontFamily: 'var(--font-display)',
            fontSize: 20, fontWeight: 700,
            color: 'white', letterSpacing: '-0.02em', marginBottom: 16,
          }}>
            {BRAND.name.toUpperCase()}
          </p>
          <p style={{
            fontFamily: 'var(--font-body)',
            fontSize: 14, color: 'var(--primary-muted)',
            lineHeight: 1.6, marginBottom: 24, maxWidth: 240,
          }}>
            Handcrafted crochet flowers and decor pieces — designed with
            patience, packed with emotions.
          </p>

          <div style={{ display: 'flex', gap: 10 }}>
            <a
              href={BRAND.instagram}
              target="_blank"
              rel="noopener noreferrer"
              style={iconBtnStyle}
              onMouseEnter={hoverIn}
              onMouseLeave={hoverOut}
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none"
                stroke="currentColor" strokeWidth="2"
                strokeLinecap="round" strokeLinejoin="round">
                <rect x="2" y="2" width="20" height="20" rx="5" />
                <circle cx="12" cy="12" r="4" />
                <circle cx="17.5" cy="6.5" r="0.5" fill="currentColor" />
              </svg>
            </a>
            <a
              href={`mailto:${BRAND.email}`}
              style={iconBtnStyle}
              onMouseEnter={hoverIn}
              onMouseLeave={hoverOut}
            >
              <Mail size={14} />
            </a>
          </div>
        </div>

        {/* Shop col */}
        <div>
          <p className="label-caps" style={{ color: 'var(--secondary-dim)', marginBottom: 20 }}>
            Shop
          </p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {CATEGORIES.slice(0, 5).map(cat => (
              <Link
                key={cat.slug}
                to={`/categories/${cat.slug}`}
                style={footerLinkStyle}
                onMouseEnter={linkIn}
                onMouseLeave={linkOut}
              >
                {cat.name}
              </Link>
            ))}
          </div>
        </div>

        {/* More col */}
        <div>
          <p className="label-caps" style={{ color: 'var(--secondary-dim)', marginBottom: 20 }}>
            More
          </p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {CATEGORIES.slice(5).map(cat => (
              <Link
                key={cat.slug}
                to={`/categories/${cat.slug}`}
                style={footerLinkStyle}
                onMouseEnter={linkIn}
                onMouseLeave={linkOut}
              >
                {cat.name}
              </Link>
            ))}
          </div>
        </div>

        {/* Help col */}
        <div>
          <p className="label-caps" style={{ color: 'var(--secondary-dim)', marginBottom: 20 }}>
            Help
          </p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {[
              { label: 'Custom Order', href: '/custom-order' },
              { label: 'My Orders', href: '/my-orders' },
              { label: 'About Us', href: '/about' },
              { label: 'Contact', href: '/contact' },
              { label: 'Login', href: '/login' },
            ].map(link => (
              <Link
                key={link.href}
                to={link.href}
                style={footerLinkStyle}
                onMouseEnter={linkIn}
                onMouseLeave={linkOut}
              >
                {link.label}
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div style={{
        maxWidth: 'var(--container)', margin: '0 auto',
        padding: '20px var(--margin-desktop)',
        borderTop: '1px solid rgba(183,200,222,0.08)',
        display: 'flex', justifyContent: 'space-between',
        alignItems: 'center', flexWrap: 'wrap', gap: 12,
      }}>
        <p style={{
          fontFamily: 'var(--font-body)', fontSize: 11,
          color: 'var(--primary-muted)', letterSpacing: '0.04em',
        }}>
          © {new Date().getFullYear()} {BRAND.name}. All rights reserved.
        </p>
        <p style={{
          fontFamily: 'var(--font-body)', fontSize: 11,
          color: 'var(--primary-muted)', letterSpacing: '0.04em',
        }}>
          Made with love in India
        </p>
      </div>
    </footer>
  )
}
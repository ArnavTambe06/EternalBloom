import { useState, useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { Search, ShoppingBag, User, Menu, X } from 'lucide-react'
import { useCartStore } from '@/store/cartStore'
import { BRAND } from '@/lib/constants'

const navLinks = [
  { label: 'Collections', href: '/#categories' },
  { label: 'Shop', href: '/#products' },
  { label: 'Custom Order', href: '/custom-order' },
  { label: 'About', href: '/about' },
  { label: 'Contact', href: '/contact' },
]

export function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const [barVisible, setBarVisible] = useState(true)
  const { itemCount, toggleCart } = useCartStore()
  const count = itemCount()
  const location = useLocation()

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 8)
    window.addEventListener('scroll', fn)
    return () => window.removeEventListener('scroll', fn)
  }, [])

  useEffect(() => { setMenuOpen(false) }, [location])

  const activeLink = location.pathname

  return (
    <div style={{ position: 'sticky', top: 0, zIndex: 100 }}>

      {/* Announcement */}
      <AnimatePresence>
        {barVisible && (
          <motion.div
            initial={{ height: 40 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            style={{
              height: 40, overflow: 'hidden',
              backgroundColor: 'var(--primary)',
              display: 'flex', alignItems: 'center',
              justifyContent: 'center',
              position: 'relative',
            }}
          >
            <p style={{
              fontFamily: 'var(--font-body)',
              fontSize: 12, fontWeight: 500,
              letterSpacing: '0.08em',
              color: 'var(--primary-dim)',
            }}>
              Complimentary shipping on orders above ₹999
            </p>
            <button
              onClick={() => setBarVisible(false)}
              style={{
                position: 'absolute', right: 20,
                color: 'var(--primary-muted)',
                display: 'flex', alignItems: 'center',
              }}
            >
              <X size={14} />
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Nav */}
      <nav style={{
        backgroundColor: scrolled
          ? 'rgba(252, 249, 248, 0.96)'
          : 'var(--surface)',
        backdropFilter: scrolled ? 'blur(16px)' : 'none',
        borderBottom: '1px solid rgba(4,22,39,0.08)',
        transition: 'all 0.3s ease',
      }}>
        <div style={{
          maxWidth: 'var(--container)',
          margin: '0 auto',
          padding: '0 var(--margin-desktop)',
          height: 72,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}>

          {/* Brand */}
          <Link to="/" style={{
            fontFamily: 'var(--font-display)',
            fontSize: 20, fontWeight: 700,
            color: 'var(--primary)',
            letterSpacing: '-0.02em',
            flexShrink: 0,
          }}>
            {BRAND.name.toUpperCase()}
          </Link>

          {/* Desktop nav */}
          <div style={{
            display: 'flex', alignItems: 'center', gap: 40,
            position: 'absolute', left: '50%',
            transform: 'translateX(-50%)',
          }} className="hidden md:flex">
            {navLinks.map((link) => {
              const isActive = link.href === activeLink
              return (
                <Link
                  key={link.href}
                  to={link.href}
                  style={{
                    fontFamily: 'var(--font-body)',
                    fontSize: 13, fontWeight: 500,
                    letterSpacing: '0.06em',
                    color: isActive ? 'var(--primary)' : 'var(--on-surface-variant)',
                    paddingBottom: 4,
                    borderBottom: isActive ? '2px solid var(--primary)' : '2px solid transparent',
                    transition: 'all 0.2s',
                    whiteSpace: 'nowrap',
                    textTransform: 'uppercase',
                    fontSize: 11,
                  }}
                  onMouseEnter={e => {
                    if (!isActive) (e.target as HTMLElement).style.color = 'var(--primary)'
                  }}
                  onMouseLeave={e => {
                    if (!isActive) (e.target as HTMLElement).style.color = 'var(--on-surface-variant)'
                  }}
                >
                  {link.label}
                </Link>
              )
            })}
          </div>

          {/* Actions */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 4, flexShrink: 0 }}>
            {[
              { icon: <Search size={18} />, label: 'Search', action: undefined },
            ].map(a => (
              <button
                key={a.label}
                style={{
                  padding: 10, color: 'var(--primary)',
                  display: 'flex', alignItems: 'center',
                  borderRadius: 4,
                  transition: 'opacity 0.2s',
                }}
                onMouseEnter={e => (e.currentTarget.style.opacity = '0.6')}
                onMouseLeave={e => (e.currentTarget.style.opacity = '1')}
              >
                {a.icon}
              </button>
            ))}

            <Link to="/profile" style={{ display: 'flex' }}>
              <button style={{
                padding: 10, color: 'var(--primary)',
                display: 'flex', alignItems: 'center', borderRadius: 4,
                transition: 'opacity 0.2s',
              }}
                onMouseEnter={e => (e.currentTarget.style.opacity = '0.6')}
                onMouseLeave={e => (e.currentTarget.style.opacity = '1')}
              >
                <User size={18} />
              </button>
            </Link>

            <button
              onClick={toggleCart}
              style={{
                padding: 10, color: 'var(--primary)',
                display: 'flex', alignItems: 'center',
                position: 'relative', borderRadius: 4,
                transition: 'opacity 0.2s',
              }}
              onMouseEnter={e => (e.currentTarget.style.opacity = '0.6')}
              onMouseLeave={e => (e.currentTarget.style.opacity = '1')}
            >
              <ShoppingBag size={18} />
              <AnimatePresence>
                {count > 0 && (
                  <motion.span
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    exit={{ scale: 0 }}
                    style={{
                      position: 'absolute', top: 6, right: 6,
                      width: 14, height: 14,
                      backgroundColor: 'var(--secondary)',
                      color: 'white', borderRadius: '50%',
                      fontSize: 8, fontWeight: 700,
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                    }}
                  >
                    {count > 9 ? '9+' : count}
                  </motion.span>
                )}
              </AnimatePresence>
            </button>

            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="md:hidden"
              style={{
                padding: 10, color: 'var(--primary)',
                display: 'flex', alignItems: 'center', borderRadius: 4,
              }}
            >
              {menuOpen ? <X size={18} /> : <Menu size={18} />}
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile menu */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            style={{
              backgroundColor: 'var(--surface)',
              borderBottom: '1px solid rgba(4,22,39,0.08)',
            }}
            className="md:hidden"
          >
            <div style={{ padding: '16px 20px 20px' }}>
              {navLinks.map(link => (
                <Link
                  key={link.href}
                  to={link.href}
                  style={{
                    display: 'block',
                    padding: '12px 0',
                    fontFamily: 'var(--font-body)',
                    fontSize: 13, fontWeight: 500,
                    letterSpacing: '0.08em',
                    textTransform: 'uppercase',
                    color: 'var(--on-surface-variant)',
                    borderBottom: '1px solid rgba(4,22,39,0.05)',
                  }}
                >
                  {link.label}
                </Link>
              ))}
              <div style={{ display: 'flex', gap: 10, marginTop: 16 }}>
                <Link to="/login" style={{
                  flex: 1, textAlign: 'center',
                  padding: '11px',
                  border: '1px solid var(--primary)',
                  color: 'var(--primary)',
                  fontFamily: 'var(--font-body)',
                  fontSize: 12, fontWeight: 600,
                  letterSpacing: '0.08em',
                  textTransform: 'uppercase',
                }}>Login</Link>
                <Link to="/register" style={{
                  flex: 1, textAlign: 'center',
                  padding: '11px',
                  backgroundColor: 'var(--primary)',
                  color: 'white',
                  fontFamily: 'var(--font-body)',
                  fontSize: 12, fontWeight: 600,
                  letterSpacing: '0.08em',
                  textTransform: 'uppercase',
                }}>Sign Up</Link>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
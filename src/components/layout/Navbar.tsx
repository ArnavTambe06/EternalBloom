import { useState, useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { Search, ShoppingBag, User, Menu, X } from 'lucide-react'
import { useCartStore } from '@/store/cartStore'
import { BRAND } from '@/lib/constants'
import { useAuth } from '@/hooks/useAuth'

const navLinks = [
  { label: 'Shop All', href: '/#products' },
  { label: 'Collections', href: '/#categories' },
  { label: 'Custom Order', href: '/custom-order' },
  { label: 'About', href: '/about' },
  { label: 'Contact', href: '/contact' },
]

const announcements = [
  '🌸 Free shipping on orders above ₹999',
  '✨ Handmade to order — each piece is unique',
  '💝 Custom orders welcome — DM us on Instagram',
]

const hoverIn = (e: React.MouseEvent<HTMLElement>) => {
  e.currentTarget.style.backgroundColor = 'var(--primary-pale)'
  e.currentTarget.style.color = 'var(--primary)'
}

const hoverOut = (e: React.MouseEvent<HTMLElement>) => {
  e.currentTarget.style.backgroundColor = 'transparent'
  e.currentTarget.style.color = 'var(--on-surface-muted)'
}

export function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const [annIdx, setAnnIdx] = useState(0)

  const { itemCount, toggleCart } = useCartStore()
  const { isLoggedIn, user, profile } = useAuth()

  const count = itemCount()
  const location = useLocation()

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 10)

    window.addEventListener('scroll', fn)

    return () => window.removeEventListener('scroll', fn)
  }, [])

  useEffect(() => {
    const t = setInterval(
      () => setAnnIdx(i => (i + 1) % announcements.length),
      3200
    )

    return () => clearInterval(t)
  }, [])

  useEffect(() => {
    setMenuOpen(false)
  }, [location])

  return (
    <div style={{ position: 'sticky', top: 0, zIndex: 100 }}>

      {/* Announcement bar */}
      <div
        style={{
          background: 'var(--primary-gradient)',
          height: 38,
          overflow: 'hidden',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <AnimatePresence mode="wait">
          <motion.p
            key={annIdx}
            initial={{ y: 14, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -14, opacity: 0 }}
            transition={{ duration: 0.3 }}
            style={{
              fontFamily: 'var(--font-body)',
              fontSize: 12,
              fontWeight: 600,
              color: 'var(--on-surface)',
              letterSpacing: '0.03em',
            }}
          >
            {announcements[annIdx]}
          </motion.p>
        </AnimatePresence>
      </div>

      {/* Navbar */}
      <nav
        style={{
          backgroundColor: scrolled
            ? 'rgba(255,250,248,0.97)'
            : 'var(--surface)',
          backdropFilter: scrolled ? 'blur(16px)' : 'none',
          borderBottom: '1px solid var(--border)',
          boxShadow: scrolled
            ? '0 2px 20px rgba(212,72,154,0.08)'
            : 'none',
          transition: 'all 0.3s',
        }}
      >
        <div
          style={{
            maxWidth: 'var(--container)',
            margin: '0 auto',
            padding: '0 var(--margin-desktop)',
            height: 70,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >

          {/* Logo */}
          <Link
            to="/"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 10,
              flexShrink: 0,
            }}
          >
            <div
              style={{
                width: 40,
                height: 40,
                borderRadius: '50%',
                background: 'var(--primary-gradient)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'white',
                fontFamily: 'var(--font-display)',
                fontWeight: 700,
                fontSize: 15,
                boxShadow: '0 4px 16px rgba(255,133,208,0.4)',
                flexShrink: 0,
              }}
            >
              EB
            </div>

            <div>
              <p
                style={{
                  fontFamily: 'var(--font-display)',
                  fontSize: 18,
                  fontWeight: 700,
                  color: 'var(--on-surface)',
                  letterSpacing: '-0.01em',
                  lineHeight: 1.1,
                }}
              >
                {BRAND.name}
              </p>

              <p
                style={{
                  fontFamily: 'var(--font-body)',
                  fontSize: 10,
                  color: 'var(--on-surface-muted)',
                  letterSpacing: '0.05em',
                }}
              >
                {BRAND.tagline}
              </p>
            </div>
          </Link>

          {/* Desktop links */}
          <div
            style={{
              position: 'absolute',
              left: '50%',
              transform: 'translateX(-50%)',
              display: 'flex',
              alignItems: 'center',
              gap: 4,
            }}
            className="hidden md:flex"
          >
            {navLinks.map(link => (
              <Link
                key={link.href}
                to={link.href}
                style={{
                  padding: '8px 16px',
                  fontFamily: 'var(--font-body)',
                  fontSize: 14,
                  fontWeight: 500,
                  color: 'var(--on-surface-muted)',
                  borderRadius: 999,
                  transition: 'all 0.2s',
                  whiteSpace: 'nowrap',
                }}
                onMouseEnter={hoverIn}
                onMouseLeave={hoverOut}
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* Actions */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 2,
              flexShrink: 0,
            }}
          >

            {/* Search */}
            <button
              style={{
                padding: 10,
                color: 'var(--on-surface-muted)',
                display: 'flex',
                alignItems: 'center',
                borderRadius: 999,
                transition: 'all 0.2s',
              }}
              onMouseEnter={hoverIn}
              onMouseLeave={hoverOut}
            >
              <Search size={19} />
            </button>

            {/* Profile / Auth */}
            {isLoggedIn() ? (
              <div style={{ position: 'relative' }}>
                <Link to="/profile" style={{ display: 'flex' }}>
                  <button
                    style={{
                      padding: 10,
                      borderRadius: 999,
                      display: 'flex',
                      alignItems: 'center',
                      transition: 'all 0.2s',
                      background: 'var(--primary-gradient)',
                      border: 'none',
                      cursor: 'pointer',
                    }}
                  >
                    <span
                      style={{
                        width: 24,
                        height: 24,
                        borderRadius: '50%',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontFamily: 'var(--font-body)',
                        fontSize: 11,
                        fontWeight: 700,
                        color: 'var(--on-surface)',
                      }}
                    >
                      {(profile?.full_name || user?.email || 'U')[0].toUpperCase()}
                    </span>
                  </button>
                </Link>
              </div>
            ) : (
              <Link to="/profile" style={{ display: 'flex' }}>
                <button
                  style={{
                    padding: 10,
                    color: 'var(--on-surface-muted)',
                    display: 'flex',
                    alignItems: 'center',
                    borderRadius: 999,
                    transition: 'all 0.2s',
                  }}
                  onMouseEnter={hoverIn}
                  onMouseLeave={hoverOut}
                >
                  <User size={19} />
                </button>
              </Link>
            )}

            {/* Cart */}
            <button
              onClick={toggleCart}
              style={{
                padding: 10,
                color: 'var(--on-surface-muted)',
                display: 'flex',
                alignItems: 'center',
                position: 'relative',
                borderRadius: 999,
                transition: 'all 0.2s',
              }}
              onMouseEnter={hoverIn}
              onMouseLeave={hoverOut}
            >
              <ShoppingBag size={19} />

              <AnimatePresence>
                {count > 0 && (
                  <motion.span
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    exit={{ scale: 0 }}
                    style={{
                      position: 'absolute',
                      top: 5,
                      right: 5,
                      width: 16,
                      height: 16,
                      background: 'var(--primary-gradient)',
                      color: 'white',
                      borderRadius: '50%',
                      fontSize: 9,
                      fontWeight: 700,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    {count > 9 ? '9+' : count}
                  </motion.span>
                )}
              </AnimatePresence>
            </button>

            {/* Mobile menu button */}
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="md:hidden"
              style={{
                padding: 10,
                color: 'var(--on-surface-muted)',
                display: 'flex',
                alignItems: 'center',
                borderRadius: 999,
              }}
            >
              {menuOpen ? <X size={19} /> : <Menu size={19} />}
            </button>

          </div>
        </div>
      </nav>

      {/* Mobile menu */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            style={{
              backgroundColor: 'var(--surface)',
              borderBottom: '1px solid var(--border)',
              boxShadow: '0 8px 32px rgba(212,72,154,0.1)',
            }}
            className="md:hidden"
          >
            <div style={{ padding: '12px 20px 20px' }}>

              {navLinks.map(link => (
                <Link
                  key={link.href}
                  to={link.href}
                  style={{
                    display: 'block',
                    padding: '13px 0',
                    fontFamily: 'var(--font-body)',
                    fontSize: 15,
                    fontWeight: 500,
                    color: 'var(--on-surface)',
                    borderBottom: '1px solid var(--border)',
                  }}
                >
                  {link.label}
                </Link>
              ))}

              {/* Mobile auth */}
              <div
                style={{
                  display: 'flex',
                  gap: 10,
                  marginTop: 16,
                }}
              >
                {isLoggedIn() ? (
                  <Link
                    to="/profile"
                    style={{
                      flex: 1,
                      textAlign: 'center',
                      padding: '12px',
                      background: 'var(--primary-gradient)',
                      color: 'var(--on-surface)',
                      fontFamily: 'var(--font-body)',
                      fontSize: 13,
                      fontWeight: 600,
                      borderRadius: 999,
                    }}
                  >
                    My Profile
                  </Link>
                ) : (
                  <>
                    <Link
                      to="/login"
                      style={{
                        flex: 1,
                        textAlign: 'center',
                        padding: '12px',
                        border: '1.5px solid var(--primary)',
                        color: 'var(--primary)',
                        fontFamily: 'var(--font-body)',
                        fontSize: 13,
                        fontWeight: 600,
                        borderRadius: 999,
                      }}
                    >
                      Login
                    </Link>

                    <Link
                      to="/register"
                      style={{
                        flex: 1,
                        textAlign: 'center',
                        padding: '12px',
                        background: 'var(--primary-gradient)',
                        color: 'var(--on-surface)',
                        fontFamily: 'var(--font-body)',
                        fontSize: 13,
                        fontWeight: 600,
                        borderRadius: 999,
                      }}
                    >
                      Sign Up
                    </Link>
                  </>
                )}
              </div>

            </div>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  )
}

import { useState, useEffect, useRef } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { Search, ShoppingBag, User, Menu, X } from 'lucide-react'
import { useCartStore } from '@/store/cartStore'
import { useAuth } from '@/hooks/useAuth'
import { BRAND } from '@/lib/constants'
import { getProducts } from '@/services/products'
import type { Product } from '@/types'

const navLinks = [
  { label: 'Shop All', href: '/#products' },
  { label: 'Collections', href: '/categories' },
  { label: 'Custom Order', href: '/custom-order' },
  { label: 'About', href: '/about' },
  { label: 'Contact', href: '/contact' },
]

const announcements = [
  'Free shipping on orders above ₹999',
  'Handmade to order — every piece is unique',
  'Cash on delivery available across India',
]

export function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const [searchOpen, setSearchOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [results, setResults] = useState<Product[]>([])
  const [searching, setSearching] = useState(false)
  const [annIdx, setAnnIdx] = useState(0)
  const searchRef = useRef<HTMLInputElement>(null)
  const { itemCount, toggleCart } = useCartStore()
  const { isLoggedIn } = useAuth()
  const count = itemCount()
  const location = useLocation()

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 10)
    window.addEventListener('scroll', fn)
    return () => window.removeEventListener('scroll', fn)
  }, [])

  useEffect(() => {
    const t = setInterval(() => setAnnIdx(i => (i + 1) % announcements.length), 3500)
    return () => clearInterval(t)
  }, [])

  useEffect(() => { setMenuOpen(false); setSearchOpen(false) }, [location])
  useEffect(() => { if (searchOpen) setTimeout(() => searchRef.current?.focus(), 100) }, [searchOpen])

  useEffect(() => {
    if (!searchQuery.trim()) { setResults([]); return }
    const t = setTimeout(async () => {
      setSearching(true)
      try {
        const r = await getProducts({ search: searchQuery })
        setResults(r.slice(0, 6))
      } catch { setResults([]) }
      setSearching(false)
    }, 300)
    return () => clearTimeout(t)
  }, [searchQuery])

  const iconBtn = (onClick: () => void, children: React.ReactNode, label: string) => (
    <motion.button
      whileHover={{ scale: 1.08 }}
      whileTap={{ scale: 0.93 }}
      onClick={onClick}
      aria-label={label}
      style={{
        padding: 9, color: 'var(--ink-2)',
        display: 'flex', alignItems: 'center',
        borderRadius: '50%', transition: 'background 0.2s',
        backgroundColor: 'transparent',
      }}
      onMouseEnter={e => e.currentTarget.style.backgroundColor = 'rgba(255,133,208,0.12)'}
      onMouseLeave={e => e.currentTarget.style.backgroundColor = 'transparent'}
    >
      {children}
    </motion.button>
  )

  return (
    <>
      {/* Announcement bar */}
      <div style={{
        height: 36, overflow: 'hidden',
        background: 'linear-gradient(90deg, rgba(255,133,208,0.25) 0%, rgba(255,200,162,0.25) 50%, rgba(255,230,128,0.25) 100%)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        borderBottom: '1px solid var(--line)',
        backdropFilter: 'blur(8px)',
      }}>
        <AnimatePresence mode="wait">
          <motion.p
            key={annIdx}
            initial={{ y: 12, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -12, opacity: 0 }}
            transition={{ duration: 0.3 }}
            style={{
              fontFamily: 'var(--sans)',
              fontSize: 12, fontWeight: 500,
              color: 'var(--ink-2)',
              letterSpacing: '0.04em',
            }}
          >{announcements[annIdx]}</motion.p>
        </AnimatePresence>
      </div>

      {/* Main nav */}
      <nav className="site-nav" style={{
        position: 'sticky', top: 0, zIndex: 100,
        background: scrolled
          ? 'rgba(255,252,250,0.88)'
          : 'rgba(255,252,250,0.72)',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
        borderBottom: `1px solid ${scrolled ? 'var(--line-2)' : 'var(--line)'}`,
        transition: 'all 0.3s ease',
        boxShadow: scrolled ? '0 2px 24px rgba(255,133,208,0.1)' : 'none',
      }}>
        <div className="wrap navbar-inner" style={{
          height: 68,
          display: 'flex', alignItems: 'center',
          justifyContent: 'space-between',
        }}>

          {/* Logo */}
          <Link to="/" className="navbar-brand" style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{
              width: 36, height: 36, borderRadius: '50%',
              background: 'var(--grad)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontFamily: 'var(--serif)', fontWeight: 700, fontSize: 14,
              color: 'var(--ink)',
              boxShadow: '0 4px 14px rgba(255,133,208,0.4)',
            }}>EB</div>
            <div className="navbar-brand-copy">
               <p style={{
                fontFamily: 'var(--serif)', fontSize: 17,
                fontWeight: 700, color: 'var(--ink)',
                letterSpacing: '-0.01em', lineHeight: 1.1,
              }}>{BRAND.name}</p>
               <p className="navbar-brand-tagline" style={{
                fontFamily: 'var(--sans)', fontSize: 9,
                color: 'var(--ink-3)', letterSpacing: '0.1em',
                textTransform: 'uppercase',
              }}>{BRAND.tagline}</p>
            </div>
          </Link>

         {/* Desktop links */}
 <div className="desktop-nav-links" style={{
   position: 'absolute', left: '50%',
   transform: 'translateX(-50%)',
   gap: 4,
 }}>
  {navLinks.map(link => (
    link.label === 'Custom Order' ? (
      <Link key={link.href} to={link.href}>
        <motion.div
          style={{
            padding: '7px 16px',
            borderRadius: 999,
            background: 'linear-gradient(135deg,#FF85D0,#FFC8A2,#FFE680)',
            backgroundSize: '200% 100%',
            fontFamily: 'var(--sans)',
            fontSize: 13,
            fontWeight: 700,
            color: '#1C0F0A',
            cursor: 'pointer',
            whiteSpace: 'nowrap',
            boxShadow: '0 3px 12px rgba(255,133,208,0.3)',
          }}
          animate={{
            boxShadow: [
              '0 3px 12px rgba(255,133,208,0.3)',
              '0 6px 20px rgba(255,133,208,0.5)',
              '0 3px 12px rgba(255,133,208,0.3)',
            ],
          }}
          transition={{
            repeat: Infinity,
            duration: 2.5,
            ease: 'easeInOut',
          }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          ✦ Custom Order
        </motion.div>
      </Link>
    ) : (
      <Link key={link.href} to={link.href}>
        <motion.div
          whileHover={{
            backgroundColor: 'rgba(255,133,208,0.1)',
          }}
          style={{
            padding: '7px 16px',
            borderRadius: 999,
            fontFamily: 'var(--sans)',
            fontSize: 13,
            fontWeight: 500,
            color: 'var(--ink-2)',
            transition: 'color 0.2s',
            whiteSpace: 'nowrap',
            cursor: 'pointer',
          }}
          onMouseEnter={e =>
            (e.currentTarget.style.color = 'var(--ink)')
          }
          onMouseLeave={e =>
            (e.currentTarget.style.color = 'var(--ink-2)')
          }
        >
          {link.label}
        </motion.div>
      </Link>
    )
  ))}
</div>

          {/* Actions */}
          <div className="navbar-actions" style={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            {iconBtn(() => setSearchOpen(true), <Search size={18} strokeWidth={1.8} />, 'Search')}

            <Link to={isLoggedIn() ? '/profile' : '/login'}>
              {iconBtn(() => {}, <User size={18} strokeWidth={1.8} />, 'Account')}
            </Link>

            <div style={{ position: 'relative' }}>
              {iconBtn(toggleCart, <ShoppingBag size={18} strokeWidth={1.8} />, 'Cart')}
              <AnimatePresence>
                {count > 0 && (
                  <motion.span
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    exit={{ scale: 0 }}
                    style={{
                      position: 'absolute', top: 4, right: 4,
                      width: 16, height: 16,
                      background: 'var(--grad)',
                      color: 'var(--ink)', borderRadius: '50%',
                      fontSize: 8, fontWeight: 800,
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      pointerEvents: 'none',
                    }}
                  >{count > 9 ? '9+' : count}</motion.span>
                )}
              </AnimatePresence>
            </div>

            <div className="mobile-menu-toggle">
              {iconBtn(() => setMenuOpen(!menuOpen), menuOpen ? <X size={18} strokeWidth={1.8} /> : <Menu size={18} strokeWidth={1.8} />, 'Menu')}
            </div>
          </div>
        </div>
      </nav>

      {/* Search overlay */}
      <AnimatePresence>
        {searchOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => { setSearchOpen(false); setSearchQuery('') }}
              style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(28,15,10,0.3)', zIndex: 200 }}
            />
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              style={{
                position: 'fixed', top: 0, left: 0, right: 0, zIndex: 201,
                background: 'rgba(255,252,250,0.95)',
                backdropFilter: 'blur(24px)',
                borderBottom: '1px solid var(--line-2)',
                padding: '24px 0',
                boxShadow: '0 8px 40px rgba(255,133,208,0.15)',
              }}
            >
              <div className="wrap">
                <div style={{
                  display: 'flex', alignItems: 'center', gap: 12,
                  borderBottom: '2px solid var(--ink)', paddingBottom: 12,
                }}>
                  <Search size={20} color="var(--ink-3)" strokeWidth={1.5} />
                  <input
                    ref={searchRef}
                    value={searchQuery}
                    onChange={e => setSearchQuery(e.target.value)}
                    onKeyDown={e => {
                      if (e.key === 'Escape') { setSearchOpen(false); setSearchQuery('') }
                    }}
                    placeholder="Search products..."
                    style={{
                      flex: 1, border: 'none', outline: 'none',
                      fontFamily: 'var(--serif)', fontSize: 22,
                      color: 'var(--ink)', background: 'transparent',
                    }}
                  />
                  <button onClick={() => { setSearchOpen(false); setSearchQuery('') }}
                    style={{ color: 'var(--ink-3)', display: 'flex', padding: 4 }}>
                    <X size={18} strokeWidth={1.5} />
                  </button>
                </div>

                {searchQuery && (
                  <div style={{ marginTop: 16 }}>
                    {searching ? (
                      <p className="label" style={{ padding: '8px 0' }}>Searching...</p>
                    ) : results.length === 0 ? (
                      <p style={{ fontFamily: 'var(--sans)', fontSize: 14, color: 'var(--ink-3)', padding: '8px 0' }}>
                        No results for "{searchQuery}"
                      </p>
                    ) : results.map(p => (
                      <motion.button
                        key={p.id}
                        whileHover={{ backgroundColor: 'var(--accent-bg)' }}
                        onClick={() => { setSearchOpen(false); setSearchQuery('') }}
                        style={{
                          display: 'flex', alignItems: 'center', gap: 14,
                          width: '100%', padding: '12px 8px',
                          borderBottom: '1px solid var(--line)',
                          background: 'none', border: 'none',
                          borderBottomWidth: 1, borderBottomStyle: 'solid',
                          borderBottomColor: 'var(--line)',
                          cursor: 'pointer', textAlign: 'left',
                          borderRadius: 8, transition: 'background 0.2s',
                        }}
                      >
                        <div style={{
                          width: 52, height: 52, borderRadius: 8,
                          overflow: 'hidden', flexShrink: 0,
                          background: 'var(--accent-bg)',
                        }}>
                          {p.images?.[0] && <img src={p.images[0]} alt={p.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />}
                        </div>
                        <div>
                          <p style={{ fontFamily: 'var(--serif)', fontSize: 15, fontWeight: 500, color: 'var(--ink)' }}>{p.name}</p>
                          <p style={{ fontFamily: 'var(--sans)', fontSize: 13, color: 'var(--ink-3)' }}>₹{p.price}</p>
                        </div>
                      </motion.button>
                    ))}
                  </div>
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Mobile menu */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            className="mobile-menu"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            style={{
              position: 'sticky', top: 68, zIndex: 99, overflow: 'hidden',
              background: 'rgba(255,252,250,0.95)',
              backdropFilter: 'blur(20px)',
              borderBottom: '1px solid var(--line-2)',
            }}
          >
            <div style={{ padding: '12px var(--px-mob) 20px' }}>
              {navLinks.map(link => (
                <Link key={link.href} to={link.href} style={{
                  display: 'block', padding: '13px 0',
                  fontFamily: 'var(--sans)', fontSize: 15,
                  fontWeight: 500, color: 'var(--ink)',
                  borderBottom: '1px solid var(--line)',
                }}>{link.label}</Link>
              ))}
              <div style={{ display: 'flex', gap: 10, marginTop: 16 }}>
                <Link to="/login" style={{
                  flex: 1, textAlign: 'center', padding: '11px',
                  border: '1.5px solid var(--ink-2)',
                  fontFamily: 'var(--sans)', fontSize: 13,
                  fontWeight: 500, color: 'var(--ink)', borderRadius: 999,
                }}>Login</Link>
                <Link to="/register" style={{
                  flex: 1, textAlign: 'center', padding: '11px',
                  background: 'var(--grad)', borderRadius: 999,
                  fontFamily: 'var(--sans)', fontSize: 13,
                  fontWeight: 600, color: 'var(--ink)',
                }}>Sign Up</Link>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}

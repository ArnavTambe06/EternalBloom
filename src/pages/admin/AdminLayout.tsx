import { useState } from 'react'
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import {
  LayoutDashboard, Package, Tag,
  ShoppingBag, Sparkles, ChevronLeft,
  ChevronRight, LogOut, Settings2,
} from 'lucide-react'
import { useAuth } from '@/hooks/useAuth'
import { signOut } from '@/services/auth'

const navItems = [
  { label: 'Dashboard',     href: '/admin',               icon: LayoutDashboard },
  { label: 'Products',      href: '/admin/products',      icon: Package },
  { label: 'Categories',    href: '/admin/categories',    icon: Tag },
  { label: 'Orders',        href: '/admin/orders',        icon: ShoppingBag },
  { label: 'Custom Orders', href: '/admin/custom-orders', icon: Sparkles },
  { label: 'Settings',      href: '/admin/settings',      icon: Settings2 },
]

export function AdminLayout() {
  const [collapsed, setCollapsed] = useState(false)
  const location = useLocation()
  const navigate = useNavigate()
  const { profile, user } = useAuth()

  const displayName =
    profile?.full_name ||
    user?.user_metadata?.full_name ||
    user?.email?.split('@')[0] ||
    'Admin'

  const initial = displayName[0]?.toUpperCase() || 'A'

  const handleSignOut = async () => {
    await signOut()
    navigate('/')
  }

  return (
    <div style={{ display: 'flex', minHeight: '100vh', backgroundColor: '#FBF7F5' }}>

      {/* ── Sidebar ── */}
      <motion.aside
        animate={{ width: collapsed ? 64 : 230 }}
        transition={{ duration: 0.22, ease: 'easeInOut' }}
        style={{
          backgroundColor: '#1C0F0A',
          display: 'flex',
          flexDirection: 'column',
          position: 'fixed',
          top: 0, left: 0, bottom: 0,
          zIndex: 50,
          overflow: 'hidden',
          flexShrink: 0,
        }}
      >
        {/* Logo row */}
        <div style={{
          height: 64,
          display: 'flex',
          alignItems: 'center',
          gap: 10,
          padding: collapsed ? '0 14px' : '0 18px',
          borderBottom: '1px solid rgba(255,133,208,0.12)',
          flexShrink: 0,
        }}>
          <div style={{
            width: 34, height: 34, borderRadius: '50%',
            background: 'linear-gradient(135deg,#FF85D0,#FFA6E0,#FFC8A2,#FFE680)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontFamily: 'Playfair Display, serif',
            fontWeight: 700, fontSize: 13, color: '#1C0F0A',
            flexShrink: 0,
            boxShadow: '0 0 0 2px rgba(255,133,208,0.25)',
          }}>EB</div>

          <AnimatePresence>
            {!collapsed && (
              <motion.div
                initial={{ opacity: 0, width: 0 }}
                animate={{ opacity: 1, width: 'auto' }}
                exit={{ opacity: 0, width: 0 }}
                transition={{ duration: 0.18 }}
                style={{ overflow: 'hidden', whiteSpace: 'nowrap' }}
              >
                <p style={{
                  fontFamily: 'Playfair Display, serif',
                  fontSize: 14, fontWeight: 700,
                  color: 'rgba(255,240,230,0.95)',
                }}>Eternal Bloom</p>
                <p style={{
                  fontFamily: 'DM Sans, sans-serif',
                  fontSize: 10, color: 'rgba(255,180,150,0.45)',
                  letterSpacing: '0.08em', textTransform: 'uppercase',
                }}>Admin Panel</p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Nav items */}
        <nav style={{
          flex: 1, padding: '12px 8px',
          overflowY: 'auto', overflowX: 'hidden',
        }}>
          {navItems.map(({ label, href, icon: Icon }) => {
            const active =
              href === '/admin'
                ? location.pathname === '/admin'
                : location.pathname.startsWith(href)

            return (
              <Link key={href} to={href} style={{ display: 'block', marginBottom: 2 }}>
                <motion.div
                  whileHover={{ backgroundColor: 'rgba(255,133,208,0.1)' }}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 10,
                    padding: collapsed ? '10px 15px' : '10px 12px',
                    borderRadius: 10,
                    backgroundColor: active
                      ? 'rgba(255,133,208,0.15)'
                      : 'transparent',
                    transition: 'background 0.2s',
                    cursor: 'pointer',
                    justifyContent: collapsed ? 'center' : 'flex-start',
                  }}
                >
                  <Icon
                    size={18}
                    strokeWidth={active ? 2 : 1.6}
                    color={active ? '#FF85D0' : 'rgba(255,190,160,0.45)'}
                    style={{ flexShrink: 0 }}
                  />
                  <AnimatePresence>
                    {!collapsed && (
                      <motion.span
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.15 }}
                        style={{
                          fontFamily: 'DM Sans, sans-serif',
                          fontSize: 14,
                          fontWeight: active ? 600 : 400,
                          color: active
                            ? 'rgba(255,240,230,0.95)'
                            : 'rgba(255,190,160,0.45)',
                          whiteSpace: 'nowrap',
                        }}
                      >
                        {label}
                      </motion.span>
                    )}
                  </AnimatePresence>
                </motion.div>
              </Link>
            )
          })}
        </nav>

        {/* Bottom — user + collapse */}
        <div style={{
          borderTop: '1px solid rgba(255,133,208,0.1)',
          padding: '10px 8px',
          flexShrink: 0,
        }}>
          {/* User row */}
          {!collapsed && (
            <div style={{
              display: 'flex', alignItems: 'center', gap: 10,
              padding: '10px 12px', marginBottom: 2,
            }}>
              <div style={{
                width: 30, height: 30, borderRadius: '50%',
                background: 'linear-gradient(135deg,#FF85D0,#FFC8A2)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontFamily: 'DM Sans, sans-serif',
                fontSize: 12, fontWeight: 700, color: '#1C0F0A',
                flexShrink: 0,
              }}>{initial}</div>
              <div style={{ minWidth: 0 }}>
                <p style={{
                  fontFamily: 'DM Sans, sans-serif',
                  fontSize: 12, fontWeight: 600,
                  color: 'rgba(255,240,230,0.9)',
                  overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
                }}>{displayName}</p>
                <p style={{
                  fontFamily: 'DM Sans, sans-serif',
                  fontSize: 10, color: 'rgba(255,180,150,0.4)',
                }}>Administrator</p>
              </div>
            </div>
          )}

          {/* Sign out */}
          <button
            onClick={handleSignOut}
            style={{
              width: '100%', padding: collapsed ? '10px 15px' : '9px 12px',
              display: 'flex', alignItems: 'center',
              justifyContent: collapsed ? 'center' : 'flex-start',
              gap: 8,
              background: 'none', border: 'none',
              borderRadius: 10, cursor: 'pointer',
              color: 'rgba(255,100,100,0.6)',
              transition: 'all 0.2s',
            }}
            onMouseEnter={e => {
              e.currentTarget.style.backgroundColor = 'rgba(255,80,80,0.08)'
              e.currentTarget.style.color = 'rgba(255,120,120,0.9)'
            }}
            onMouseLeave={e => {
              e.currentTarget.style.backgroundColor = 'transparent'
              e.currentTarget.style.color = 'rgba(255,100,100,0.6)'
            }}
          >
            <LogOut size={16} strokeWidth={1.6} style={{ flexShrink: 0 }} />
            <AnimatePresence>
              {!collapsed && (
                <motion.span
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  style={{
                    fontFamily: 'DM Sans, sans-serif',
                    fontSize: 13, whiteSpace: 'nowrap',
                  }}
                >Sign Out</motion.span>
              )}
            </AnimatePresence>
          </button>

          {/* Collapse toggle */}
          <button
            onClick={() => setCollapsed(!collapsed)}
            style={{
              width: '100%', padding: collapsed ? '10px 15px' : '9px 12px',
              display: 'flex', alignItems: 'center',
              justifyContent: collapsed ? 'center' : 'flex-start',
              gap: 8,
              background: 'none', border: 'none',
              borderRadius: 10, cursor: 'pointer',
              color: 'rgba(255,180,150,0.3)',
              transition: 'color 0.2s',
            }}
            onMouseEnter={e => e.currentTarget.style.color = 'rgba(255,180,150,0.6)'}
            onMouseLeave={e => e.currentTarget.style.color = 'rgba(255,180,150,0.3)'}
          >
            {collapsed
              ? <ChevronRight size={16} strokeWidth={1.6} />
              : <><ChevronLeft size={16} strokeWidth={1.6} />
                <span style={{
                  fontFamily: 'DM Sans, sans-serif',
                  fontSize: 13, whiteSpace: 'nowrap',
                }}>Collapse</span>
              </>
            }
          </button>
        </div>
      </motion.aside>

      {/* ── Main content ── */}
      <motion.div
        animate={{ marginLeft: collapsed ? 64 : 230 }}
        transition={{ duration: 0.22, ease: 'easeInOut' }}
        style={{ flex: 1, minHeight: '100vh', minWidth: 0 }}
      >
        {/* Top bar */}
        <div style={{
          height: 64, backgroundColor: '#FFFFFF',
          borderBottom: '1px solid rgba(255,133,208,0.15)',
          display: 'flex', alignItems: 'center',
          padding: '0 32px',
          justifyContent: 'space-between',
          position: 'sticky', top: 0, zIndex: 40,
          boxShadow: '0 1px 12px rgba(255,133,208,0.08)',
        }}>
          <div>
            <p style={{
              fontFamily: 'Playfair Display, serif',
              fontSize: 18, fontWeight: 700, color: '#1C0F0A',
            }}>
              {navItems.find(n =>
                n.href === '/admin'
                  ? location.pathname === '/admin'
                  : location.pathname.startsWith(n.href)
              )?.label || 'Dashboard'}
            </p>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <Link to="/" target="_blank" style={{
              fontFamily: 'DM Sans, sans-serif',
              fontSize: 12, fontWeight: 500,
              color: 'rgba(28,15,10,0.4)',
              border: '1px solid rgba(255,133,208,0.25)',
              padding: '6px 14px', borderRadius: 999,
              transition: 'all 0.2s',
            }}
              onMouseEnter={e => {
                e.currentTarget.style.borderColor = 'rgba(255,133,208,0.6)'
                e.currentTarget.style.color = '#E8609A'
              }}
              onMouseLeave={e => {
                e.currentTarget.style.borderColor = 'rgba(255,133,208,0.25)'
                e.currentTarget.style.color = 'rgba(28,15,10,0.4)'
              }}
            >
              View Store
            </Link>

            <div style={{
              width: 34, height: 34, borderRadius: '50%',
              background: 'linear-gradient(135deg,#FF85D0,#FFC8A2)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontFamily: 'DM Sans, sans-serif',
              fontSize: 12, fontWeight: 700, color: '#1C0F0A',
            }}>{initial}</div>
          </div>
        </div>

        {/* Page content */}
        <div style={{ padding: '32px' }}>
          <Outlet />
        </div>
      </motion.div>
    </div>
  )
}

import { useState } from 'react'
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import {
  LayoutDashboard, Package, Tag, ShoppingBag,
  Sparkles, Menu, X, LogOut, ChevronRight,
} from 'lucide-react'
import { useAuth } from '@/hooks/useAuth'
import { signOut } from '@/services/auth'

const navItems = [
  { label: 'Dashboard', href: '/admin', icon: <LayoutDashboard size={18} /> },
  { label: 'Products', href: '/admin/products', icon: <Package size={18} /> },
  { label: 'Categories', href: '/admin/categories', icon: <Tag size={18} /> },
  { label: 'Orders', href: '/admin/orders', icon: <ShoppingBag size={18} /> },
  { label: 'Custom Orders', href: '/admin/custom-orders', icon: <Sparkles size={18} /> },
]

export function AdminLayout() {
  const [collapsed, setCollapsed] = useState(false)
  const location = useLocation()
  const navigate = useNavigate()
  const { profile, user } = useAuth()

  const handleSignOut = async () => {
    await signOut()
    navigate('/')
  }

  const displayName = profile?.full_name || user?.email?.split('@')[0] || 'Admin'

  return (
    <div style={{ display: 'flex', minHeight: '100vh', backgroundColor: '#F8F4FF' }}>

      {/* Sidebar */}
      <motion.div
        animate={{ width: collapsed ? 72 : 240 }}
        transition={{ duration: 0.25 }}
        style={{
          backgroundColor: 'var(--on-surface)',
          display: 'flex', flexDirection: 'column',
          position: 'fixed', top: 0, left: 0, bottom: 0,
          zIndex: 50, overflow: 'hidden',
        }}
      >
        {/* Logo */}
        <div style={{
          padding: '20px 16px',
          borderBottom: '1px solid rgba(255,255,255,0.08)',
          display: 'flex', alignItems: 'center', gap: 12,
          minHeight: 68,
        }}>
          <div style={{
            width: 36, height: 36, borderRadius: '50%',
            background: 'var(--primary-gradient)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontFamily: 'var(--font-display)',
            color: 'var(--on-surface)', fontWeight: 700, fontSize: 13,
            flexShrink: 0,
          }}>EB</div>
          <AnimatePresence>
            {!collapsed && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                <p style={{
                  fontFamily: 'var(--font-display)',
                  fontSize: 14, fontWeight: 700,
                  color: 'white', whiteSpace: 'nowrap',
                }}>Eternal Bloom</p>
                <p style={{
                  fontFamily: 'var(--font-body)',
                  fontSize: 10, color: 'rgba(255,255,255,0.4)',
                  whiteSpace: 'nowrap',
                }}>Admin Panel</p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Nav */}
        <div style={{ flex: 1, padding: '12px 8px', overflowY: 'auto' }}>
          {navItems.map(item => {
            const active = location.pathname === item.href ||
              (item.href !== '/admin' && location.pathname.startsWith(item.href))
            return (
              <Link key={item.href} to={item.href}>
                <motion.div
                  whileHover={{ backgroundColor: 'rgba(255,255,255,0.08)' }}
                  style={{
                    display: 'flex', alignItems: 'center',
                    gap: 12, padding: '10px 12px',
                    borderRadius: 10, marginBottom: 2,
                    backgroundColor: active ? 'rgba(255,133,208,0.15)' : 'transparent',
                    cursor: 'pointer', transition: 'background 0.2s',
                  }}
                >
                  <span style={{
                    color: active ? 'var(--pink)' : 'rgba(255,255,255,0.5)',
                    flexShrink: 0,
                  }}>{item.icon}</span>
                  <AnimatePresence>
                    {!collapsed && (
                      <motion.span
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        style={{
                          fontFamily: 'var(--font-body)',
                          fontSize: 14, fontWeight: active ? 600 : 400,
                          color: active ? 'white' : 'rgba(255,255,255,0.5)',
                          whiteSpace: 'nowrap',
                        }}
                      >{item.label}</motion.span>
                    )}
                  </AnimatePresence>
                </motion.div>
              </Link>
            )
          })}
        </div>

        {/* User + collapse */}
        <div style={{
          padding: '12px 8px',
          borderTop: '1px solid rgba(255,255,255,0.08)',
        }}>
          <div style={{
            display: 'flex', alignItems: 'center', gap: 10,
            padding: '10px 12px', marginBottom: 4,
          }}>
            <div style={{
              width: 32, height: 32, borderRadius: '50%',
              background: 'var(--primary-gradient)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontFamily: 'var(--font-body)', fontSize: 12,
              fontWeight: 700, color: 'var(--on-surface)',
              flexShrink: 0,
            }}>
              {displayName[0]?.toUpperCase()}
            </div>
            <AnimatePresence>
              {!collapsed && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  style={{ minWidth: 0 }}
                >
                  <p style={{
                    fontFamily: 'var(--font-body)',
                    fontSize: 13, fontWeight: 600,
                    color: 'white', whiteSpace: 'nowrap',
                    overflow: 'hidden', textOverflow: 'ellipsis',
                  }}>{displayName}</p>
                  <p style={{
                    fontFamily: 'var(--font-body)',
                    fontSize: 10, color: 'rgba(255,255,255,0.4)',
                  }}>Administrator</p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <button
            onClick={handleSignOut}
            style={{
              width: '100%', padding: '10px 12px',
              display: 'flex', alignItems: 'center', gap: 12,
              background: 'none', border: 'none',
              borderRadius: 10, cursor: 'pointer',
              color: 'rgba(255,100,100,0.7)',
              transition: 'all 0.2s',
            }}
            onMouseEnter={e => e.currentTarget.style.backgroundColor = 'rgba(255,50,50,0.1)'}
            onMouseLeave={e => e.currentTarget.style.backgroundColor = 'transparent'}
          >
            <LogOut size={16} style={{ flexShrink: 0 }} />
            <AnimatePresence>
              {!collapsed && (
                <motion.span
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  style={{
                    fontFamily: 'var(--font-body)',
                    fontSize: 13, whiteSpace: 'nowrap',
                  }}
                >Sign Out</motion.span>
              )}
            </AnimatePresence>
          </button>

          <button
            onClick={() => setCollapsed(!collapsed)}
            style={{
              width: '100%', padding: '10px 12px',
              display: 'flex', alignItems: 'center', justifyContent: collapsed ? 'center' : 'flex-start',
              gap: 12, background: 'none', border: 'none',
              borderRadius: 10, cursor: 'pointer',
              color: 'rgba(255,255,255,0.3)',
            }}
          >
            {collapsed ? <ChevronRight size={16} /> : <Menu size={16} />}
            <AnimatePresence>
              {!collapsed && (
                <motion.span
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  style={{ fontFamily: 'var(--font-body)', fontSize: 13, whiteSpace: 'nowrap' }}
                >Collapse</motion.span>
              )}
            </AnimatePresence>
          </button>
        </div>
      </motion.div>

      {/* Main content */}
      <div style={{
        flex: 1,
        marginLeft: collapsed ? 72 : 240,
        transition: 'margin-left 0.25s',
        minHeight: '100vh',
      }}>
        <Outlet />
      </div>
    </div>
  )
}
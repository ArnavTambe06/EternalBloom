import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  User, Package, MapPin, LogOut, ChevronRight,
  Edit2, Save, Plus, Trash2, ShoppingBag,
} from 'lucide-react'
import { Link, useNavigate } from 'react-router-dom'
import { Sparkles } from 'lucide-react'
import { useAuth } from '@/hooks/useAuth'
import { signOut } from '@/services/auth'
import { supabase } from '@/services/supabase'
import { getUserOrders } from '@/services/orders'


const statusColor: Record<string, string> = {
  pending:    '#FFB800',
  confirmed:  '#4A6FA5',
  processing: '#9B59B6',
  shipped:    '#2196F3',
  delivered:  '#5A8C6E',
  cancelled:  '#C33',
}

const inputStyle: React.CSSProperties = {
  width: '100%', padding: '10px 14px',
  border: '1.5px solid var(--border)',
  borderRadius: 10, backgroundColor: 'var(--surface)',
  fontFamily: 'var(--font-body)', fontSize: 14,
  color: 'var(--on-surface)', outline: 'none',
  boxSizing: 'border-box', transition: 'border-color 0.2s',
}

const labelStyle: React.CSSProperties = {
  display: 'block', fontFamily: 'var(--font-body)',
  fontSize: 11, fontWeight: 700,
  letterSpacing: '0.08em', textTransform: 'uppercase',
  color: 'var(--on-surface-muted)', marginBottom: 6,
}

export function ProfilePage() {
  const [activeTab, setActiveTab] = useState('Profile')
  const [editing, setEditing] = useState(false)
  const [saving, setSaving] = useState(false)
  const [editForm, setEditForm] = useState({ full_name: '', phone: '' })
  const [orders, setOrders] = useState<any[]>([])
  const [ordersLoading, setOrdersLoading] = useState(false)

  const { user, profile, setProfile } = useAuth()
  const navigate = useNavigate()

  // Populate edit form from real profile
  useEffect(() => {
    if (profile) {
      setEditForm({
        full_name: profile.full_name || '',
        phone: profile.phone || '',
      })
    }
  }, [profile])

  // Load real orders when Orders tab is opened
  useEffect(() => {
    if (activeTab !== 'Orders' || !user) return
    setOrdersLoading(true)
    getUserOrders(user.id).then(data => {
      setOrders(data)
      setOrdersLoading(false)
    })
  }, [activeTab, user])

  const handleSignOut = async () => {
    await signOut()
    navigate('/')
  }

  const handleSaveProfile = async () => {
    if (!user) return
    setSaving(true)
    const { data, error } = await supabase
      .from('user_profiles')
      .update({
        full_name: editForm.full_name,
        phone: editForm.phone,
      })
      .eq('id', user.id)
      .select()
      .single()

    if (!error && data) setProfile(data)
    setSaving(false)
    setEditing(false)
  }

  // Derived display values — all from real auth/profile
  const displayName =
    profile?.full_name ||
    user?.user_metadata?.full_name ||
    user?.email?.split('@')[0] ||
    'User'
  const displayEmail = user?.email || ''
  const memberSince = user?.created_at
    ? new Date(user.created_at).toLocaleDateString('en-IN', {
        month: 'long', year: 'numeric',
      })
    : ''
  const initial = displayName[0]?.toUpperCase() || 'U'
  const avatarUrl =
    profile?.avatar_url || user?.user_metadata?.avatar_url

  const navItems = [
    { label: 'Profile', icon: <User size={16} /> },
    { label: 'Orders', icon: <Package size={16} /> },
    { label: 'Addresses', icon: <MapPin size={16} /> },
    { label: 'Custom Orders', icon: <Sparkles size={16} /> },
  ]

  return (
    <div className="profile-page" style={{
      backgroundColor: 'var(--surface)',
      minHeight: '100vh', padding: '48px var(--px)',
    }}>
      <div className="profile-shell" style={{ maxWidth: 920, margin: '0 auto' }}>
        <div style={{
          display: 'grid',
          gridTemplateColumns: '260px 1fr',
          gap: 24, alignItems: 'start',
        }} className="profile-layout">

          {/* ── Sidebar ── */}
          <div className="profile-sidebar" style={{
            backgroundColor: 'var(--surface-white)',
            borderRadius: 20, padding: '28px 20px',
            border: '1px solid var(--border)',
            position: 'sticky', top: 24,
            boxShadow: '0 2px 16px rgba(212,72,154,0.06)',
          }}>
            {/* Avatar + name */}
            <div style={{
              textAlign: 'center', marginBottom: 24,
              paddingBottom: 20, borderBottom: '1px solid var(--border)',
            }}>
              {avatarUrl ? (
                <img
                  src={avatarUrl} alt={displayName}
                  style={{
                    width: 68, height: 68, borderRadius: '50%',
                    objectFit: 'cover', margin: '0 auto 12px',
                    border: '3px solid var(--border)',
                  }}
                />
              ) : (
                <div style={{
                  width: 68, height: 68, borderRadius: '50%',
                  background: 'var(--primary-gradient)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  margin: '0 auto 12px',
                  fontFamily: 'var(--font-display)',
                  color: 'var(--on-surface)', fontWeight: 700, fontSize: 26,
                  boxShadow: '0 4px 16px rgba(255,133,208,0.35)',
                }}>{initial}</div>
              )}
              <p style={{
                fontFamily: 'var(--font-display)',
                fontSize: 16, fontWeight: 700, color: 'var(--on-surface)',
              }}>{displayName}</p>
              <p style={{
                fontFamily: 'var(--font-body)',
                fontSize: 12, color: 'var(--on-surface-muted)', marginTop: 3,
              }}>{displayEmail}</p>
            </div>

            {/* Nav */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
              {navItems.map(item => (
                <motion.button
                  key={item.label}
                  whileHover={{ x: 2 }}
                  onClick={() => setActiveTab(item.label)}
                  style={{
                    width: '100%', padding: '11px 14px',
                    display: 'flex', alignItems: 'center', gap: 10,
                    backgroundColor: activeTab === item.label
                      ? 'var(--primary-pale)' : 'transparent',
                    border: 'none', borderRadius: 10,
                    color: activeTab === item.label
                      ? 'var(--primary)' : 'var(--on-surface-muted)',
                    fontFamily: 'var(--font-body)',
                    fontSize: 14, fontWeight: 500,
                    cursor: 'pointer', textAlign: 'left',
                    transition: 'all 0.2s',
                  }}
                >
                  {item.icon}
                  <span style={{ flex: 1 }}>{item.label}</span>
                  <ChevronRight size={14} />
                </motion.button>
              ))}
            </div>

            {/* Sign out */}
            <button
              onClick={handleSignOut}
              style={{
                width: '100%', padding: '11px 14px',
                marginTop: 16,
                display: 'flex', alignItems: 'center', gap: 10,
                backgroundColor: 'transparent', border: 'none',
                borderRadius: 10, color: '#C33',
                fontFamily: 'var(--font-body)',
                fontSize: 14, fontWeight: 500, cursor: 'pointer',
                transition: 'background 0.2s',
              }}
              onMouseEnter={e => e.currentTarget.style.backgroundColor = '#FFF0F0'}
              onMouseLeave={e => e.currentTarget.style.backgroundColor = 'transparent'}
            >
              <LogOut size={16} /> Sign Out
            </button>
          </div>

          {/* ── Content ── */}
          <AnimatePresence mode="wait">
            <motion.div
              className="profile-content"
              key={activeTab}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.2 }}
              style={{
                backgroundColor: 'var(--surface-white)',
                borderRadius: 20, padding: '32px 28px',
                border: '1px solid var(--border)',
                boxShadow: '0 2px 16px rgba(212,72,154,0.06)',
                minHeight: 400,
              }}
            >

              {/* ════ PROFILE TAB ════ */}
              {activeTab === 'Profile' && (
                <>
                  <div className="profile-content-header" style={{
                    display: 'flex', alignItems: 'center',
                    justifyContent: 'space-between', marginBottom: 32,
                  }}>
                    <h2 style={{
                      fontFamily: 'var(--font-display)',
                      fontSize: 22, fontWeight: 700, color: 'var(--on-surface)',
                    }}>Personal Info</h2>

                    {!editing ? (
                      <motion.button
                        whileHover={{ scale: 1.03 }}
                        whileTap={{ scale: 0.97 }}
                        onClick={() => setEditing(true)}
                        style={{
                          display: 'flex', alignItems: 'center', gap: 6,
                          padding: '8px 18px',
                          background: 'var(--primary-gradient)',
                          border: 'none', borderRadius: 999,
                          fontFamily: 'var(--font-body)',
                          fontSize: 13, fontWeight: 600,
                          color: 'var(--on-surface)', cursor: 'pointer',
                          boxShadow: '0 3px 12px rgba(255,133,208,0.3)',
                        }}
                      >
                        <Edit2 size={13} /> Edit Profile
                      </motion.button>
                    ) : (
                      <div className="profile-edit-actions" style={{ display: 'flex', gap: 8 }}>
                        <button
                          onClick={() => setEditing(false)}
                          style={{
                            padding: '8px 16px',
                            border: '1.5px solid var(--border)',
                            borderRadius: 999, background: 'transparent',
                            fontFamily: 'var(--font-body)',
                            fontSize: 13, color: 'var(--on-surface-muted)',
                            cursor: 'pointer',
                          }}
                        >Cancel</button>
                        <motion.button
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.97 }}
                          onClick={handleSaveProfile}
                          disabled={saving}
                          style={{
                            display: 'flex', alignItems: 'center', gap: 6,
                            padding: '8px 18px',
                            background: 'var(--primary-gradient)',
                            border: 'none', borderRadius: 999,
                            fontFamily: 'var(--font-body)',
                            fontSize: 13, fontWeight: 600,
                            color: 'var(--on-surface)',
                            cursor: saving ? 'not-allowed' : 'pointer',
                            opacity: saving ? 0.7 : 1,
                          }}
                        >
                          <Save size={13} />
                          {saving ? 'Saving...' : 'Save Changes'}
                        </motion.button>
                      </div>
                    )}
                  </div>

                  {editing ? (
                    <div className="profile-form-grid" style={{
                      display: 'grid',
                      gridTemplateColumns: '1fr 1fr', gap: 20,
                    }}>
                      {[
                        { label: 'Full Name', key: 'full_name', placeholder: 'Your name' },
                        { label: 'Phone', key: 'phone', placeholder: '+91 98765 43210' },
                      ].map(f => (
                        <div key={f.key}>
                          <label style={labelStyle}>{f.label}</label>
                          <input
                            placeholder={f.placeholder}
                            style={inputStyle}
                            value={(editForm as any)[f.key]}
                            onChange={e => setEditForm(frm => ({ ...frm, [f.key]: e.target.value }))}
                            onFocus={e => e.target.style.borderColor = 'var(--primary)'}
                            onBlur={e => e.target.style.borderColor = 'var(--border)'}
                          />
                        </div>
                      ))}
                      <div>
                        <label style={labelStyle}>Email</label>
                        <input
                          style={{ ...inputStyle, opacity: 0.55, cursor: 'not-allowed' }}
                          value={displayEmail}
                          disabled
                        />
                        <p style={{
                          fontFamily: 'var(--font-body)',
                          fontSize: 11, color: 'var(--on-surface-faint)', marginTop: 5,
                        }}>
                          Email cannot be changed here
                        </p>
                      </div>
                    </div>
                  ) : (
                    <>
                      {/* Info grid */}
                      <div className="profile-info-grid" style={{
                        display: 'grid',
                        gridTemplateColumns: '1fr 1fr', gap: 28,
                        marginBottom: 32,
                      }}>
                        {[
                          { label: 'Full Name', value: displayName },
                          { label: 'Email', value: displayEmail },
                          { label: 'Phone', value: profile?.phone || '—' },
                          { label: 'Member Since', value: memberSince },
                        ].map(f => (
                          <div key={f.label}>
                            <label style={labelStyle}>{f.label}</label>
                            <p style={{
                              fontFamily: 'var(--font-body)',
                              fontSize: 15, color: 'var(--on-surface)',
                              wordBreak: 'break-word',
                            }}>{f.value}</p>
                          </div>
                        ))}
                      </div>

                      {/* Account type badge */}
                      <div style={{
                        display: 'inline-flex', alignItems: 'center', gap: 8,
                        padding: '8px 16px',
                        background: 'var(--primary-pale)',
                        border: '1px solid var(--border)',
                        borderRadius: 999,
                      }}>
                        <div style={{
                          width: 8, height: 8, borderRadius: '50%',
                          background: 'var(--primary-gradient)',
                        }} />
                        <span style={{
                          fontFamily: 'var(--font-body)',
                          fontSize: 12, fontWeight: 600,
                          color: 'var(--primary)',
                        }}>
                          {profile?.role === 'admin' ? '⚡ Admin Account' : '🌸 Customer Account'}
                        </span>
                      </div>
                    </>
                  )}
                </>
              )}

              {/* ════ ORDERS TAB ════ */}
              {activeTab === 'Orders' && (
                <>
                  <h2 style={{
                    fontFamily: 'var(--font-display)',
                    fontSize: 22, fontWeight: 700,
                    color: 'var(--on-surface)', marginBottom: 24,
                  }}>My Orders</h2>

                  {ordersLoading ? (
                    <div style={{
                      display: 'flex', flexDirection: 'column', gap: 12,
                    }}>
                      {[1, 2, 3].map(i => (
                        <div key={i} style={{
                          height: 100, borderRadius: 14,
                          backgroundColor: 'var(--surface-section)',
                          animation: 'pulse 1.5s ease-in-out infinite',
                        }} />
                      ))}
                      <style>{`
                        @keyframes pulse {
                          0%, 100% { opacity: 1; }
                          50% { opacity: 0.5; }
                        }
                      `}</style>
                    </div>
                  ) : orders.length === 0 ? (
                    <div style={{ textAlign: 'center', padding: '56px 0' }}>
                      <div style={{
                        width: 72, height: 72, borderRadius: '50%',
                        backgroundColor: 'var(--surface-section)',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        margin: '0 auto 16px',
                      }}>
                        <ShoppingBag size={28} color="var(--on-surface-faint)" />
                      </div>
                      <p style={{
                        fontFamily: 'var(--font-display)',
                        fontSize: 18, fontWeight: 600,
                        color: 'var(--on-surface)', marginBottom: 8,
                      }}>No orders yet</p>
                      <p style={{
                        fontFamily: 'var(--font-body)',
                        fontSize: 14, color: 'var(--on-surface-muted)',
                        marginBottom: 24,
                      }}>
                        Looks like you haven't placed any orders yet.
                      </p>
                      <Link to="/#products" style={{ textDecoration: 'none' }}>
                        <motion.button
                          whileHover={{ scale: 1.03 }}
                          whileTap={{ scale: 0.97 }}
                          style={{
                            padding: '12px 28px',
                            background: 'var(--primary-gradient)',
                            border: 'none', borderRadius: 999,
                            fontFamily: 'var(--font-body)',
                            fontSize: 14, fontWeight: 600,
                            color: 'var(--on-surface)', cursor: 'pointer',
                            boxShadow: '0 4px 16px rgba(255,133,208,0.3)',
                          }}
                        >
                          Start Shopping
                        </motion.button>
                      </Link>
                    </div>
                  ) : (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                      {orders.map((order, i) => (
                        <motion.div
                          key={order.id}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: i * 0.06 }}
                          style={{
                            border: '1px solid var(--border)',
                            borderRadius: 16, padding: '18px 20px',
                            transition: 'border-color 0.2s, box-shadow 0.2s',
                          }}
                          onMouseEnter={e => {
                            e.currentTarget.style.borderColor = 'var(--border-strong)'
                            e.currentTarget.style.boxShadow = '0 4px 20px rgba(212,72,154,0.08)'
                          }}
                          onMouseLeave={e => {
                            e.currentTarget.style.borderColor = 'var(--border)'
                            e.currentTarget.style.boxShadow = 'none'
                          }}
                        >
                          {/* Order header */}
                          <div className="profile-order-header" style={{
                            display: 'flex', justifyContent: 'space-between',
                            alignItems: 'center', marginBottom: 14,
                          }}>
                            <div>
                              <p style={{
                                fontFamily: 'var(--font-body)',
                                fontSize: 14, fontWeight: 700,
                                color: 'var(--on-surface)',
                              }}>
                                #{order.id.slice(0, 8).toUpperCase()}
                              </p>
                              <p style={{
                                fontFamily: 'var(--font-body)',
                                fontSize: 12, color: 'var(--on-surface-muted)',
                                marginTop: 2,
                              }}>
                                {new Date(order.created_at).toLocaleDateString('en-IN', {
                                  day: 'numeric', month: 'long', year: 'numeric',
                                })}
                              </p>
                            </div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                              <span style={{
                                backgroundColor: `${statusColor[order.status] || '#999'}18`,
                                color: statusColor[order.status] || '#999',
                                padding: '4px 12px', borderRadius: 999,
                                fontFamily: 'var(--font-body)',
                                fontSize: 11, fontWeight: 700,
                                textTransform: 'capitalize',
                                letterSpacing: '0.03em',
                              }}>{order.status}</span>
                            </div>
                          </div>

                          {/* Order items */}
                          {order.order_items?.length > 0 && (
                            <div style={{
                              display: 'flex', gap: 10,
                              marginBottom: 14, flexWrap: 'wrap',
                            }}>
                              {order.order_items.slice(0, 3).map((item: any) => (
                                <div key={item.id} style={{
                                  display: 'flex', alignItems: 'center', gap: 8,
                                }}>
                                  <div style={{
                                    width: 46, height: 46, borderRadius: 8,
                                    overflow: 'hidden',
                                    backgroundColor: 'var(--surface-section)',
                                    flexShrink: 0,
                                  }}>
                                    {item.product_image ? (
                                      <img
                                        src={item.product_image}
                                        alt={item.product_name}
                                        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                                      />
                                    ) : (
                                      <div style={{
                                        width: '100%', height: '100%',
                                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                                        fontSize: 20,
                                      }}>🌸</div>
                                    )}
                                  </div>
                                  <div>
                                    <p style={{
                                      fontFamily: 'var(--font-body)',
                                      fontSize: 13, fontWeight: 500,
                                      color: 'var(--on-surface)',
                                      maxWidth: 140, overflow: 'hidden',
                                      textOverflow: 'ellipsis', whiteSpace: 'nowrap',
                                    }}>
                                      {item.product_name}
                                    </p>
                                    <p style={{
                                      fontFamily: 'var(--font-body)',
                                      fontSize: 11, color: 'var(--on-surface-muted)',
                                    }}>
                                      Qty: {item.quantity}
                                      {item.selected_color
                                        ? ` · ${item.selected_color.name}`
                                        : ''}
                                    </p>
                                  </div>
                                </div>
                              ))}
                              {order.order_items.length > 3 && (
                                <span style={{
                                  alignSelf: 'center',
                                  fontFamily: 'var(--font-body)',
                                  fontSize: 12, color: 'var(--on-surface-muted)',
                                  backgroundColor: 'var(--surface-section)',
                                  padding: '4px 10px', borderRadius: 999,
                                }}>
                                  +{order.order_items.length - 3} more
                                </span>
                              )}
                            </div>
                          )}

                          {/* Divider */}
                          <div style={{
                            height: 1, backgroundColor: 'var(--border)',
                            marginBottom: 12,
                          }} />

                          {/* Footer */}
                          <div className="profile-order-footer" style={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                          }}>
                            <div style={{ display: 'flex', gap: 12 }}>
                              <span style={{
                                fontFamily: 'var(--font-body)',
                                fontSize: 12, color: 'var(--on-surface-muted)',
                              }}>
                                {order.order_items?.length || 0} item(s)
                              </span>
                              <span style={{
                                fontFamily: 'var(--font-body)',
                                fontSize: 12,
                                color: order.payment_status === 'paid'
                                  ? '#5A8C6E' : 'var(--on-surface-muted)',
                                backgroundColor: order.payment_status === 'paid'
                                  ? '#EEF7F2' : 'var(--surface-section)',
                                padding: '2px 8px', borderRadius: 999,
                                fontWeight: 500, textTransform: 'capitalize',
                              }}>
                                {order.payment_status === 'pending'
                                  ? 'COD' : order.payment_status}
                              </span>
                            </div>
                            <span style={{
                              fontFamily: 'var(--font-body)',
                              fontSize: 16, fontWeight: 700,
                              color: 'var(--primary)',
                            }}>
                              ₹{Number(order.total).toLocaleString('en-IN')}
                            </span>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  )}
                </>
              )}

              {activeTab === 'Custom Orders' && (
  <CustomOrdersTab userId={user?.id} />
)}

              {/* ════ ADDRESSES TAB ════ */}
              {activeTab === 'Addresses' && (
                <AddressesTab userId={user?.id} />
              )}

            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </div>
  )
}
 // -- Custom orders sub-component --
function CustomOrdersTab({ userId }: { userId?: string }) {
  const [orders, setOrders] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  const statusColor: Record<string, string> = {
    pending: '#B88B00', reviewing: '#4A6FA5',
    quoted: '#9B59B6', accepted: '#5A8C6E', rejected: '#C33',
  }

  useEffect(() => {
    if (!userId) return
    supabase
      .from('custom_orders')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .then(({ data }) => { setOrders(data || []); setLoading(false) })
  }, [userId])

  return (
    <>
      <h2 style={{ fontFamily: 'Playfair Display, serif', fontSize: 22, fontWeight: 700, color: '#1C0F0A', marginBottom: 24 }}>
        My Custom Requests
      </h2>

      {loading ? (
        <p style={{ fontFamily: 'DM Sans, sans-serif', color: '#9C7B6E' }}>Loading...</p>
      ) : orders.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '48px 0' }}>
          <p style={{ fontFamily: 'Playfair Display, serif', fontSize: 18, color: '#1C0F0A', marginBottom: 8 }}>
            No custom requests yet
          </p>
          <p style={{ fontFamily: 'DM Sans, sans-serif', fontSize: 14, color: '#9C7B6E', marginBottom: 20 }}>
            Have something in mind? Let us create it for you.
          </p>
          <Link to="/custom-order" style={{
            display: 'inline-block', padding: '11px 24px', borderRadius: 999,
            background: 'linear-gradient(135deg,#FF85D0,#FFC8A2,#FFE680)',
            fontFamily: 'DM Sans, sans-serif', fontSize: 13, fontWeight: 700,
            color: '#1C0F0A',
          }}>Place Custom Order</Link>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {orders.map((order, i) => (
            <motion.div
              key={order.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.06 }}
              style={{
                border: '1px solid rgba(255,133,208,0.2)',
                borderRadius: 14, padding: '18px 20px',
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 10 }}>
                <div>
                  <p style={{ fontFamily: 'DM Sans, sans-serif', fontSize: 13, color: '#9C7B6E', marginBottom: 4 }}>
                    {new Date(order.created_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}
                  </p>
                  <p style={{ fontFamily: 'DM Sans, sans-serif', fontSize: 13, color: '#5C4033', fontWeight: 500 }}>
                    {order.category ? `Category: ${order.category}` : 'General request'}
                    {order.budget ? ` · Budget: ${order.budget}` : ''}
                  </p>
                </div>
                <span style={{
                  backgroundColor: `${statusColor[order.status] || '#999'}18`,
                  color: statusColor[order.status] || '#999',
                  padding: '4px 12px', borderRadius: 999,
                  fontFamily: 'DM Sans, sans-serif', fontSize: 11, fontWeight: 700,
                  textTransform: 'capitalize', flexShrink: 0,
                }}>{order.status}</span>
              </div>
              <p style={{
                fontFamily: 'DM Sans, sans-serif', fontSize: 14,
                color: '#1C0F0A', lineHeight: 1.55,
              }}>{order.description}</p>
              {order.admin_notes && (
                <div style={{
                  marginTop: 12, padding: '10px 14px',
                  backgroundColor: 'rgba(255,133,208,0.06)',
                  border: '1px solid rgba(255,133,208,0.15)',
                  borderRadius: 10,
                }}>
                  <p style={{ fontFamily: 'DM Sans, sans-serif', fontSize: 11, fontWeight: 700, color: '#9C7B6E', marginBottom: 4, letterSpacing: '0.08em', textTransform: 'uppercase' }}>
                    Note from Eternal Bloom
                  </p>
                  <p style={{ fontFamily: 'DM Sans, sans-serif', fontSize: 13, color: '#5C4033' }}>
                    {order.admin_notes}
                  </p>
                </div>
              )}
            </motion.div>
          ))}
        </div>
      )}
    </>
  )
}
// ── Addresses sub-component ────────────────────────────────────────────
function AddressesTab({ userId }: { userId?: string }) {
  const [addresses, setAddresses] = useState<any[]>([])
  const [adding, setAdding] = useState(false)
  const [loading, setLoading] = useState(true)
  const [savingAddress, setSavingAddress] = useState(false)
  const [form, setForm] = useState({
    full_name: '', phone: '', line1: '',
    line2: '', city: '', state: '', pincode: '',
  })

  useEffect(() => {
    if (!userId) return
    supabase
      .from('addresses')
      .select('*')
      .eq('user_id', userId)
      .order('is_default', { ascending: false })
      .order('created_at', { ascending: false })
      .then(({ data }) => {
        setAddresses(data || [])
        setLoading(false)
      })
  }, [userId])

  const handleAdd = async () => {
    if (!userId) return
    if (!form.full_name || !form.phone || !form.line1 || !form.city || !form.state || !form.pincode) {
      alert('Please fill in all required fields.')
      return
    }
    setSavingAddress(true)
    const isFirst = addresses.length === 0
    const { data, error } = await supabase
      .from('addresses')
      .insert({ ...form, user_id: userId, is_default: isFirst })
      .select()
      .single()

    if (!error && data) {
      setAddresses(prev => isFirst ? [data] : [data, ...prev])
      setAdding(false)
      setForm({
        full_name: '', phone: '', line1: '',
        line2: '', city: '', state: '', pincode: '',
      })
    }
    setSavingAddress(false)
  }

  const handleDelete = async (id: string) => {
    await supabase.from('addresses').delete().eq('id', id)
    setAddresses(prev => prev.filter(a => a.id !== id))
  }

  const handleSetDefault = async (id: string) => {
    if (!userId) return
    await supabase
      .from('addresses')
      .update({ is_default: false })
      .eq('user_id', userId)
    await supabase
      .from('addresses')
      .update({ is_default: true })
      .eq('id', id)
    setAddresses(prev =>
      prev.map(a => ({ ...a, is_default: a.id === id }))
    )
  }

  const addressFields = [
    { label: 'Full Name *', key: 'full_name', col: 2 },
    { label: 'Phone *', key: 'phone', col: 1 },
    { label: 'Pincode *', key: 'pincode', col: 1 },
    { label: 'Address Line 1 *', key: 'line1', col: 2 },
    { label: 'Address Line 2 (optional)', key: 'line2', col: 2 },
    { label: 'City *', key: 'city', col: 1 },
    { label: 'State *', key: 'state', col: 1 },
  ]

  return (
    <>
      <div className="profile-section-header" style={{
        display: 'flex', alignItems: 'center',
        justifyContent: 'space-between', marginBottom: 24,
      }}>
        <h2 style={{
          fontFamily: 'var(--font-display)',
          fontSize: 22, fontWeight: 700, color: 'var(--on-surface)',
        }}>Saved Addresses</h2>
        <motion.button
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
          onClick={() => setAdding(!adding)}
          style={{
            display: 'flex', alignItems: 'center', gap: 6,
            padding: '8px 18px',
            background: 'var(--primary-gradient)',
            border: 'none', borderRadius: 999,
            fontFamily: 'var(--font-body)',
            fontSize: 13, fontWeight: 600,
            color: 'var(--on-surface)', cursor: 'pointer',
            boxShadow: '0 3px 12px rgba(255,133,208,0.3)',
          }}
        >
          <Plus size={14} />
          {adding ? 'Cancel' : 'Add Address'}
        </motion.button>
      </div>

      {/* Add form */}
      <AnimatePresence>
        {adding && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.25 }}
            style={{ overflow: 'hidden', marginBottom: 20 }}
          >
            <div style={{
              border: '1.5px solid var(--border)',
              borderRadius: 16, padding: '20px 20px',
              backgroundColor: 'var(--surface)',
            }}>
              <div className="profile-address-form" style={{
                display: 'grid',
                gridTemplateColumns: '1fr 1fr', gap: 14,
              }}>
                {addressFields.map(f => (
                  <div key={f.key} style={{ gridColumn: `span ${f.col}` }}>
                    <label style={labelStyle}>{f.label}</label>
                    <input
                      style={inputStyle}
                      value={(form as any)[f.key]}
                      onChange={e => setForm(frm => ({ ...frm, [f.key]: e.target.value }))}
                      onFocus={e => e.target.style.borderColor = 'var(--primary)'}
                      onBlur={e => e.target.style.borderColor = 'var(--border)'}
                    />
                  </div>
                ))}
              </div>

              <div style={{ display: 'flex', gap: 10, marginTop: 18 }}>
                <button
                  onClick={() => setAdding(false)}
                  style={{
                    padding: '10px 20px',
                    border: '1.5px solid var(--border)',
                    borderRadius: 999, background: 'transparent',
                    fontFamily: 'var(--font-body)', fontSize: 13,
                    color: 'var(--on-surface-muted)', cursor: 'pointer',
                  }}
                >Cancel</button>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={handleAdd}
                  disabled={savingAddress}
                  style={{
                    padding: '10px 24px',
                    background: 'var(--primary-gradient)',
                    border: 'none', borderRadius: 999,
                    fontFamily: 'var(--font-body)', fontSize: 13,
                    fontWeight: 600, color: 'var(--on-surface)',
                    cursor: savingAddress ? 'not-allowed' : 'pointer',
                    opacity: savingAddress ? 0.7 : 1,
                    boxShadow: '0 3px 12px rgba(255,133,208,0.3)',
                  }}
                >
                  {savingAddress ? 'Saving...' : 'Save Address'}
                </motion.button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* List */}
      {loading ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {[1, 2].map(i => (
            <div key={i} style={{
              height: 90, borderRadius: 14,
              backgroundColor: 'var(--surface-section)',
              animation: 'pulse 1.5s ease-in-out infinite',
            }} />
          ))}
          <style>{`
            @keyframes pulse {
              0%, 100% { opacity: 1; }
              50% { opacity: 0.5; }
            }
          `}</style>
        </div>
      ) : addresses.length === 0 ? (
        <div style={{
          border: '2px dashed var(--border)',
          borderRadius: 16, padding: '40px',
          textAlign: 'center',
        }}>
          <MapPin
            size={32}
            color="var(--on-surface-faint)"
            style={{ margin: '0 auto 12px' }}
          />
          <p style={{
            fontFamily: 'var(--font-body)',
            fontSize: 15, fontWeight: 500,
            color: 'var(--on-surface)', marginBottom: 4,
          }}>No saved addresses</p>
          <p style={{
            fontFamily: 'var(--font-body)',
            fontSize: 13, color: 'var(--on-surface-muted)',
          }}>
            Add one to speed up checkout
          </p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {addresses.map((addr, i) => (
            <motion.div
              className="profile-address-card"
              key={addr.id}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.06 }}
              style={{
                border: `1.5px solid ${addr.is_default
                  ? 'var(--primary)' : 'var(--border)'}`,
                borderRadius: 14, padding: '16px 20px',
                backgroundColor: addr.is_default
                  ? 'var(--primary-pale)' : 'var(--surface-white)',
                transition: 'all 0.2s',
              }}
            >
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'flex-start',
              }}>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{
                    display: 'flex', alignItems: 'center',
                    gap: 8, marginBottom: 6,
                  }}>
                    <p style={{
                      fontFamily: 'var(--font-body)',
                      fontSize: 14, fontWeight: 700,
                      color: 'var(--on-surface)',
                    }}>{addr.full_name}</p>
                    {addr.is_default && (
                      <span style={{
                        background: 'var(--primary-gradient)',
                        color: 'var(--on-surface)',
                        padding: '2px 10px', borderRadius: 999,
                        fontFamily: 'var(--font-body)',
                        fontSize: 10, fontWeight: 700,
                      }}>Default</span>
                    )}
                  </div>
                  <p style={{
                    fontFamily: 'var(--font-body)',
                    fontSize: 13, color: 'var(--on-surface-muted)',
                    lineHeight: 1.6,
                  }}>
                    {addr.line1}
                    {addr.line2 ? `, ${addr.line2}` : ''}<br />
                    {addr.city}, {addr.state} — {addr.pincode}<br />
                    📞 {addr.phone}
                  </p>
                </div>

                <div className="profile-address-actions" style={{ display: 'flex', gap: 8, flexShrink: 0, marginLeft: 12 }}>
                  {!addr.is_default && (
                    <button
                      onClick={() => handleSetDefault(addr.id)}
                      style={{
                        padding: '6px 12px',
                        border: '1.5px solid var(--border)',
                        borderRadius: 999, background: 'transparent',
                        fontFamily: 'var(--font-body)', fontSize: 11,
                        color: 'var(--on-surface-muted)', cursor: 'pointer',
                        whiteSpace: 'nowrap',
                        transition: 'all 0.2s',
                      }}
                      onMouseEnter={e => {
                        e.currentTarget.style.borderColor = 'var(--primary)'
                        e.currentTarget.style.color = 'var(--primary)'
                      }}
                      onMouseLeave={e => {
                        e.currentTarget.style.borderColor = 'var(--border)'
                        e.currentTarget.style.color = 'var(--on-surface-muted)'
                      }}
                    >Set Default</button>
                  )}
                  <button
                    onClick={() => handleDelete(addr.id)}
                    style={{
                      padding: '6px 10px',
                      border: '1.5px solid #FFD0D0',
                      borderRadius: 999, background: 'transparent',
                      color: '#C33', cursor: 'pointer',
                      display: 'flex', alignItems: 'center',
                      transition: 'all 0.2s',
                    }}
                    onMouseEnter={e => e.currentTarget.style.backgroundColor = '#FFF0F0'}
                    onMouseLeave={e => e.currentTarget.style.backgroundColor = 'transparent'}
                  >
                    <Trash2 size={13} />
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </>
  )
}

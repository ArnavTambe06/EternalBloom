import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { User, Package, MapPin, LogOut, ChevronRight, Edit2, Save, X, Plus, Trash2 } from 'lucide-react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '@/hooks/useAuth'
import { signOut } from '@/services/auth'
import { supabase } from '@/services/supabase'

const tabs = ['Profile', 'Orders', 'Addresses']

const mockOrders = [
  {
    id: 'ORD001', date: 'Aug 5, 2026', status: 'Delivered',
    total: 528,
    items: [{ name: 'Bow Keychain', qty: 2, image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=80&q=80' }],
  },
  {
    id: 'ORD002', date: 'Aug 7, 2026', status: 'Processing',
    total: 349,
    items: [{ name: 'Daisy Desk Buddy', qty: 1, image: 'https://images.unsplash.com/photo-1487530811015-780680fb1f4e?w=80&q=80' }],
  },
]

const statusColor: Record<string, string> = {
  Delivered: '#5A8C6E', Processing: '#D4489A',
  Shipped: '#4A6FA5', Pending: '#8A5570', Cancelled: '#C33',
}

const inputStyle: React.CSSProperties = {
  width: '100%', padding: '10px 14px',
  border: '1.5px solid var(--border)',
  borderRadius: 10, backgroundColor: 'var(--surface)',
  fontFamily: 'var(--font-body)', fontSize: 14,
  color: 'var(--on-surface)', outline: 'none',
  boxSizing: 'border-box', transition: 'border-color 0.2s',
}

export function ProfilePage() {
  const [activeTab, setActiveTab] = useState('Profile')
  const [editing, setEditing] = useState(false)
  const [saving, setSaving] = useState(false)
  const [editForm, setEditForm] = useState({ full_name: '', phone: '' })
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

    if (!error && data) {
      setProfile(data)
    }
    setSaving(false)
    setEditing(false)
  }

  const displayName = profile?.full_name || user?.user_metadata?.full_name || user?.email?.split('@')[0] || 'User'
  const displayEmail = user?.email || ''
  const memberSince = user?.created_at
    ? new Date(user.created_at).toLocaleDateString('en-IN', { month: 'long', year: 'numeric' })
    : ''
  const initial = displayName[0]?.toUpperCase() || 'U'
  const avatarUrl = profile?.avatar_url || user?.user_metadata?.avatar_url

  return (
    <div style={{ backgroundColor: 'var(--surface)', minHeight: '100vh', padding: '48px 24px' }}>
      <div style={{ maxWidth: 900, margin: '0 auto' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '260px 1fr', gap: 24 }}>

          {/* Sidebar */}
          <div style={{
            backgroundColor: 'var(--surface-white)',
            borderRadius: 20, padding: '28px 20px',
            border: '1px solid var(--border)',
            height: 'fit-content',
            boxShadow: '0 2px 16px rgba(212,72,154,0.06)',
          }}>
            {/* Avatar */}
            <div style={{ textAlign: 'center', marginBottom: 24, paddingBottom: 20, borderBottom: '1px solid var(--border)' }}>
              {avatarUrl ? (
                <img
                  src={avatarUrl} alt={displayName}
                  style={{
                    width: 64, height: 64, borderRadius: '50%',
                    objectFit: 'cover', margin: '0 auto 12px',
                    border: '3px solid var(--border)',
                  }}
                />
              ) : (
                <div style={{
                  width: 64, height: 64, borderRadius: '50%',
                  background: 'var(--primary-gradient)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  margin: '0 auto 12px',
                  fontFamily: 'var(--font-display)',
                  color: 'var(--on-surface)', fontWeight: 700, fontSize: 24,
                  boxShadow: '0 4px 16px rgba(255,133,208,0.3)',
                }}>{initial}</div>
              )}
              <p style={{
                fontFamily: 'var(--font-display)',
                fontSize: 16, fontWeight: 700,
                color: 'var(--on-surface)',
              }}>{displayName}</p>
              <p style={{
                fontFamily: 'var(--font-body)',
                fontSize: 12, color: 'var(--on-surface-muted)',
                marginTop: 2,
              }}>{displayEmail}</p>
            </div>

            {/* Nav */}
            {[
              { label: 'Profile', icon: <User size={16} /> },
              { label: 'Orders', icon: <Package size={16} /> },
              { label: 'Addresses', icon: <MapPin size={16} /> },
            ].map(item => (
              <button
                key={item.label}
                onClick={() => setActiveTab(item.label)}
                style={{
                  width: '100%', padding: '11px 14px',
                  display: 'flex', alignItems: 'center', gap: 10,
                  backgroundColor: activeTab === item.label ? 'var(--primary-pale)' : 'transparent',
                  border: 'none', borderRadius: 10,
                  color: activeTab === item.label ? 'var(--primary)' : 'var(--on-surface-muted)',
                  fontFamily: 'var(--font-body)', fontSize: 14, fontWeight: 500,
                  cursor: 'pointer', textAlign: 'left',
                  marginBottom: 4, transition: 'all 0.2s',
                }}
              >
                {item.icon}
                <span style={{ flex: 1 }}>{item.label}</span>
                <ChevronRight size={14} />
              </button>
            ))}

            <button
              onClick={handleSignOut}
              style={{
                width: '100%', padding: '11px 14px', marginTop: 16,
                display: 'flex', alignItems: 'center', gap: 10,
                backgroundColor: 'transparent', border: 'none', borderRadius: 10,
                color: '#C33', fontFamily: 'var(--font-body)',
                fontSize: 14, fontWeight: 500, cursor: 'pointer',
              }}
            >
              <LogOut size={16} /> Sign Out
            </button>
          </div>

          {/* Content */}
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, x: 12 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -12 }}
              transition={{ duration: 0.2 }}
              style={{
                backgroundColor: 'var(--surface-white)',
                borderRadius: 20, padding: '32px 28px',
                border: '1px solid var(--border)',
                boxShadow: '0 2px 16px rgba(212,72,154,0.06)',
              }}
            >

              {/* ── Profile Tab ── */}
              {activeTab === 'Profile' && (
                <>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 28 }}>
                    <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 22, fontWeight: 700, color: 'var(--on-surface)' }}>
                      Personal Info
                    </h2>
                    {!editing ? (
                      <button
                        onClick={() => setEditing(true)}
                        style={{
                          display: 'flex', alignItems: 'center', gap: 6,
                          padding: '8px 16px',
                          background: 'var(--primary-gradient)',
                          border: 'none', borderRadius: 999,
                          fontFamily: 'var(--font-body)',
                          fontSize: 13, fontWeight: 600,
                          color: 'var(--on-surface)', cursor: 'pointer',
                        }}
                      >
                        <Edit2 size={13} /> Edit
                      </button>
                    ) : (
                      <div style={{ display: 'flex', gap: 8 }}>
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
                        <button
                          onClick={handleSaveProfile}
                          disabled={saving}
                          style={{
                            display: 'flex', alignItems: 'center', gap: 6,
                            padding: '8px 16px',
                            background: 'var(--primary-gradient)',
                            border: 'none', borderRadius: 999,
                            fontFamily: 'var(--font-body)',
                            fontSize: 13, fontWeight: 600,
                            color: 'var(--on-surface)', cursor: 'pointer',
                          }}
                        >
                          <Save size={13} /> {saving ? 'Saving...' : 'Save'}
                        </button>
                      </div>
                    )}
                  </div>

                  {editing ? (
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
                      {[
                        { label: 'Full Name', key: 'full_name' },
                        { label: 'Phone', key: 'phone' },
                      ].map(f => (
                        <div key={f.key}>
                          <label style={{
                            display: 'block', fontFamily: 'var(--font-body)',
                            fontSize: 11, fontWeight: 700,
                            letterSpacing: '0.08em', textTransform: 'uppercase',
                            color: 'var(--on-surface-muted)', marginBottom: 8,
                          }}>{f.label}</label>
                          <input
                            style={inputStyle}
                            value={(editForm as any)[f.key]}
                            onChange={e => setEditForm(frm => ({ ...frm, [f.key]: e.target.value }))}
                            onFocus={e => e.target.style.borderColor = 'var(--primary)'}
                            onBlur={e => e.target.style.borderColor = 'var(--border)'}
                          />
                        </div>
                      ))}
                      <div>
                        <label style={{
                          display: 'block', fontFamily: 'var(--font-body)',
                          fontSize: 11, fontWeight: 700,
                          letterSpacing: '0.08em', textTransform: 'uppercase',
                          color: 'var(--on-surface-muted)', marginBottom: 8,
                        }}>Email</label>
                        <input
                          style={{ ...inputStyle, opacity: 0.6, cursor: 'not-allowed' }}
                          value={displayEmail}
                          disabled
                        />
                        <p style={{ fontFamily: 'var(--font-body)', fontSize: 11, color: 'var(--on-surface-faint)', marginTop: 4 }}>
                          Email cannot be changed
                        </p>
                      </div>
                    </div>
                  ) : (
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24 }}>
                      {[
                        { label: 'Full Name', value: displayName },
                        { label: 'Email', value: displayEmail },
                        { label: 'Phone', value: profile?.phone || '—' },
                        { label: 'Member Since', value: memberSince },
                      ].map(f => (
                        <div key={f.label}>
                          <label style={{
                            display: 'block', fontFamily: 'var(--font-body)',
                            fontSize: 11, fontWeight: 700,
                            letterSpacing: '0.08em', textTransform: 'uppercase',
                            color: 'var(--on-surface-muted)', marginBottom: 6,
                          }}>{f.label}</label>
                          <p style={{
                            fontFamily: 'var(--font-body)',
                            fontSize: 15, color: 'var(--on-surface)',
                          }}>{f.value}</p>
                        </div>
                      ))}
                    </div>
                  )}
                </>
              )}

              {/* ── Orders Tab ── */}
              {activeTab === 'Orders' && (
                <>
                  <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 22, fontWeight: 700, color: 'var(--on-surface)', marginBottom: 24 }}>
                    My Orders
                  </h2>
                  {mockOrders.length === 0 ? (
                    <div style={{ textAlign: 'center', padding: '48px 0' }}>
                      <Package size={40} color="var(--border)" style={{ margin: '0 auto 12px' }} />
                      <p style={{ fontFamily: 'var(--font-display)', fontSize: 18, color: 'var(--on-surface)' }}>No orders yet</p>
                      <Link to="/#products" style={{
                        display: 'inline-block', marginTop: 16,
                        padding: '10px 24px',
                        background: 'var(--primary-gradient)',
                        borderRadius: 999,
                        fontFamily: 'var(--font-body)', fontSize: 13, fontWeight: 600,
                        color: 'var(--on-surface)',
                      }}>Start Shopping</Link>
                    </div>
                  ) : (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                      {mockOrders.map((order, i) => (
                        <motion.div
                          key={order.id}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: i * 0.07 }}
                          style={{
                            border: '1px solid var(--border)',
                            borderRadius: 14, padding: '16px 20px',
                          }}
                        >
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
                            <div>
                              <p style={{ fontFamily: 'var(--font-body)', fontSize: 14, fontWeight: 700, color: 'var(--on-surface)' }}>
                                #{order.id}
                              </p>
                              <p style={{ fontFamily: 'var(--font-body)', fontSize: 12, color: 'var(--on-surface-muted)', marginTop: 2 }}>
                                {order.date}
                              </p>
                            </div>
                            <span style={{
                              backgroundColor: `${statusColor[order.status]}18`,
                              color: statusColor[order.status],
                              padding: '4px 12px', borderRadius: 999,
                              fontFamily: 'var(--font-body)', fontSize: 12, fontWeight: 600,
                            }}>{order.status}</span>
                          </div>
                          <div style={{ display: 'flex', gap: 10, marginBottom: 12 }}>
                            {order.items.map(item => (
                              <div key={item.name} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                                <div style={{
                                  width: 44, height: 44, borderRadius: 8,
                                  overflow: 'hidden', backgroundColor: 'var(--surface-section)',
                                }}>
                                  <img src={item.image} alt={item.name}
                                    style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                </div>
                                <div>
                                  <p style={{ fontFamily: 'var(--font-body)', fontSize: 13, color: 'var(--on-surface)', fontWeight: 500 }}>
                                    {item.name}
                                  </p>
                                  <p style={{ fontFamily: 'var(--font-body)', fontSize: 11, color: 'var(--on-surface-muted)' }}>
                                    Qty: {item.qty}
                                  </p>
                                </div>
                              </div>
                            ))}
                          </div>
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <span style={{ fontFamily: 'var(--font-body)', fontSize: 13, color: 'var(--on-surface-muted)' }}>
                              {order.items.length} item(s)
                            </span>
                            <span style={{ fontFamily: 'var(--font-body)', fontSize: 15, fontWeight: 700, color: 'var(--primary)' }}>
                              ₹{order.total}
                            </span>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  )}
                </>
              )}

              {/* ── Addresses Tab ── */}
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

function AddressesTab({ userId }: { userId?: string }) {
  const [addresses, setAddresses] = useState<any[]>([])
  const [adding, setAdding] = useState(false)
  const [loading, setLoading] = useState(true)
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
      .order('created_at', { ascending: false })
      .then(({ data }) => {
        setAddresses(data || [])
        setLoading(false)
      })
  }, [userId])

  const handleAdd = async () => {
    if (!userId) return
    const { data, error } = await supabase
      .from('addresses')
      .insert({ ...form, user_id: userId })
      .select()
      .single()
    if (!error && data) {
      setAddresses(prev => [data, ...prev])
      setAdding(false)
      setForm({ full_name: '', phone: '', line1: '', line2: '', city: '', state: '', pincode: '' })
    }
  }

  const handleDelete = async (id: string) => {
    await supabase.from('addresses').delete().eq('id', id)
    setAddresses(prev => prev.filter(a => a.id !== id))
  }

  const handleSetDefault = async (id: string) => {
    if (!userId) return
    await supabase.from('addresses').update({ is_default: false }).eq('user_id', userId)
    await supabase.from('addresses').update({ is_default: true }).eq('id', id)
    setAddresses(prev => prev.map(a => ({ ...a, is_default: a.id === id })))
  }

  return (
    <>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24 }}>
        <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 22, fontWeight: 700, color: 'var(--on-surface)' }}>
          Saved Addresses
        </h2>
        <button
          onClick={() => setAdding(!adding)}
          style={{
            display: 'flex', alignItems: 'center', gap: 6,
            padding: '8px 16px',
            background: 'var(--primary-gradient)',
            border: 'none', borderRadius: 999,
            fontFamily: 'var(--font-body)',
            fontSize: 13, fontWeight: 600,
            color: 'var(--on-surface)', cursor: 'pointer',
          }}
        >
          <Plus size={14} /> Add Address
        </button>
      </div>

      {/* Add form */}
      <AnimatePresence>
        {adding && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            style={{ overflow: 'hidden', marginBottom: 20 }}
          >
            <div style={{
              border: '1.5px solid var(--border)',
              borderRadius: 14, padding: '20px',
              backgroundColor: 'var(--surface)',
            }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
                {[
                  { label: 'Full Name', key: 'full_name', col: 2 },
                  { label: 'Phone', key: 'phone', col: 1 },
                  { label: 'Pincode', key: 'pincode', col: 1 },
                  { label: 'Address Line 1', key: 'line1', col: 2 },
                  { label: 'Address Line 2 (optional)', key: 'line2', col: 2 },
                  { label: 'City', key: 'city', col: 1 },
                  { label: 'State', key: 'state', col: 1 },
                ].map(f => (
                  <div key={f.key} style={{ gridColumn: `span ${f.col}` }}>
                    <label style={{
                      display: 'block', fontFamily: 'var(--font-body)',
                      fontSize: 11, fontWeight: 700,
                      letterSpacing: '0.08em', textTransform: 'uppercase',
                      color: 'var(--on-surface-muted)', marginBottom: 6,
                    }}>{f.label}</label>
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
              <div style={{ display: 'flex', gap: 10, marginTop: 16 }}>
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
                <button
                  onClick={handleAdd}
                  style={{
                    padding: '10px 20px',
                    background: 'var(--primary-gradient)',
                    border: 'none', borderRadius: 999,
                    fontFamily: 'var(--font-body)', fontSize: 13,
                    fontWeight: 600, color: 'var(--on-surface)', cursor: 'pointer',
                  }}
                >Save Address</button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {loading ? (
        <p style={{ fontFamily: 'var(--font-body)', fontSize: 14, color: 'var(--on-surface-muted)' }}>
          Loading addresses...
        </p>
      ) : addresses.length === 0 ? (
        <div style={{
          border: '2px dashed var(--border)', borderRadius: 14,
          padding: '36px', textAlign: 'center',
        }}>
          <MapPin size={32} color="var(--border)" style={{ margin: '0 auto 10px' }} />
          <p style={{ fontFamily: 'var(--font-body)', fontSize: 14, color: 'var(--on-surface-muted)' }}>
            No saved addresses yet
          </p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {addresses.map(addr => (
            <div key={addr.id} style={{
              border: `1.5px solid ${addr.is_default ? 'var(--primary)' : 'var(--border)'}`,
              borderRadius: 14, padding: '16px 20px',
              backgroundColor: addr.is_default ? 'var(--primary-pale)' : 'var(--surface-white)',
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                    <p style={{ fontFamily: 'var(--font-body)', fontSize: 14, fontWeight: 700, color: 'var(--on-surface)' }}>
                      {addr.full_name}
                    </p>
                    {addr.is_default && (
                      <span style={{
                        background: 'var(--primary-gradient)',
                        color: 'var(--on-surface)',
                        padding: '2px 10px', borderRadius: 999,
                        fontFamily: 'var(--font-body)', fontSize: 10, fontWeight: 700,
                      }}>Default</span>
                    )}
                  </div>
                  <p style={{ fontFamily: 'var(--font-body)', fontSize: 13, color: 'var(--on-surface-muted)', lineHeight: 1.5 }}>
                    {addr.line1}{addr.line2 ? `, ${addr.line2}` : ''}<br />
                    {addr.city}, {addr.state} — {addr.pincode}<br />
                    {addr.phone}
                  </p>
                </div>
                <div style={{ display: 'flex', gap: 8 }}>
                  {!addr.is_default && (
                    <button
                      onClick={() => handleSetDefault(addr.id)}
                      style={{
                        padding: '6px 12px',
                        border: '1.5px solid var(--border)',
                        borderRadius: 999, background: 'transparent',
                        fontFamily: 'var(--font-body)', fontSize: 11,
                        color: 'var(--on-surface-muted)', cursor: 'pointer',
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
                    }}
                  >
                    <Trash2 size={13} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </>
  )
}
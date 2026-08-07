import { useState } from 'react'
import { motion } from 'framer-motion'
import { User, Package, MapPin, LogOut, ChevronRight } from 'lucide-react'
import { Link } from 'react-router-dom'

const tabs = ['Profile', 'Orders', 'Addresses']

export function ProfilePage() {
  const [activeTab, setActiveTab] = useState('Profile')

  return (
    <div style={{ backgroundColor: '#FFF9F2', minHeight: '100vh', padding: '40px 24px' }}>
      <div style={{ maxWidth: 860, margin: '0 auto' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '240px 1fr', gap: 24 }}>

          {/* Sidebar */}
          <div style={{
            backgroundColor: 'white', borderRadius: 20,
            padding: '24px', border: '1px solid #E7DDD5',
            height: 'fit-content',
            boxShadow: '0 2px 12px rgba(70,53,42,0.06)',
          }}>
            {/* Avatar */}
            <div style={{ textAlign: 'center', marginBottom: 24, paddingBottom: 24, borderBottom: '1px solid #E7DDD5' }}>
              <div style={{
                width: 64, height: 64, borderRadius: '50%',
                backgroundColor: '#B56A45',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                margin: '0 auto 10px',
                fontFamily: 'Playfair Display, serif',
                color: 'white', fontWeight: 700, fontSize: 22,
              }}>P</div>
              <p style={{ fontFamily: 'Playfair Display, serif', fontSize: 16, fontWeight: 700, color: '#46352A' }}>
                Priya Sharma
              </p>
              <p style={{ fontFamily: 'Inter, sans-serif', fontSize: 12, color: '#786A61', marginTop: 2 }}>
                priya@email.com
              </p>
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
                  width: '100%', padding: '10px 14px',
                  display: 'flex', alignItems: 'center', gap: 10,
                  backgroundColor: activeTab === item.label ? '#F6EFE7' : 'transparent',
                  border: 'none', borderRadius: 10,
                  color: activeTab === item.label ? '#B56A45' : '#786A61',
                  fontFamily: 'Poppins, sans-serif', fontSize: 13, fontWeight: 500,
                  cursor: 'pointer', textAlign: 'left', marginBottom: 4,
                  transition: 'all 0.2s',
                }}
              >
                {item.icon} {item.label}
                <ChevronRight size={14} style={{ marginLeft: 'auto' }} />
              </button>
            ))}

            <button style={{
              width: '100%', padding: '10px 14px', marginTop: 16,
              display: 'flex', alignItems: 'center', gap: 10,
              backgroundColor: 'transparent', border: 'none', borderRadius: 10,
              color: '#E53E3E', fontFamily: 'Poppins, sans-serif',
              fontSize: 13, fontWeight: 500, cursor: 'pointer',
            }}>
              <LogOut size={16} /> Sign Out
            </button>
          </div>

          {/* Content */}
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, x: 12 }}
            animate={{ opacity: 1, x: 0 }}
            style={{
              backgroundColor: 'white', borderRadius: 20,
              padding: '28px 24px', border: '1px solid #E7DDD5',
              boxShadow: '0 2px 12px rgba(70,53,42,0.06)',
            }}
          >
            {activeTab === 'Profile' && (
              <>
                <h2 style={{ fontFamily: 'Playfair Display, serif', fontSize: 22, fontWeight: 700, color: '#46352A', marginBottom: 24 }}>
                  Personal Info
                </h2>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
                  {[
                    { label: 'Full Name', value: 'Priya Sharma' },
                    { label: 'Email', value: 'priya@email.com' },
                    { label: 'Phone', value: '+91 98765 43210' },
                    { label: 'Member Since', value: 'August 2026' },
                  ].map(f => (
                    <div key={f.label}>
                      <label style={{
                        display: 'block', fontFamily: 'Poppins, sans-serif',
                        fontSize: 11, fontWeight: 600, color: '#786A61',
                        textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 6,
                      }}>{f.label}</label>
                      <p style={{ fontFamily: 'Inter, sans-serif', fontSize: 14, color: '#46352A' }}>
                        {f.value}
                      </p>
                    </div>
                  ))}
                </div>
                <button style={{
                  marginTop: 28, padding: '12px 24px',
                  backgroundColor: '#B56A45', color: 'white',
                  border: 'none', borderRadius: 12,
                  fontFamily: 'Poppins, sans-serif', fontSize: 13, fontWeight: 600,
                  cursor: 'pointer',
                }}>Edit Profile</button>
              </>
            )}

            {activeTab === 'Orders' && (
              <>
                <h2 style={{ fontFamily: 'Playfair Display, serif', fontSize: 22, fontWeight: 700, color: '#46352A', marginBottom: 16 }}>
                  Recent Orders
                </h2>
                <Link to="/my-orders" style={{
                  display: 'inline-flex', alignItems: 'center', gap: 6,
                  color: '#B56A45', fontFamily: 'Poppins, sans-serif',
                  fontSize: 13, fontWeight: 600, textDecoration: 'none',
                }}>
                  View all orders <ChevronRight size={14} />
                </Link>
              </>
            )}

            {activeTab === 'Addresses' && (
              <>
                <h2 style={{ fontFamily: 'Playfair Display, serif', fontSize: 22, fontWeight: 700, color: '#46352A', marginBottom: 16 }}>
                  Saved Addresses
                </h2>
                <div style={{
                  border: '2px dashed #E7DDD5', borderRadius: 14,
                  padding: '24px', textAlign: 'center', cursor: 'pointer',
                }}>
                  <p style={{ fontFamily: 'Poppins, sans-serif', fontSize: 13, color: '#786A61' }}>
                    + Add New Address
                  </p>
                </div>
              </>
            )}
          </motion.div>
        </div>
      </div>
    </div>
  )
}
import { useState } from 'react'
import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { ChevronRight, MapPin, CreditCard, ShieldCheck } from 'lucide-react'
import { useCartStore } from '@/store/cartStore'

const steps = ['Address', 'Payment', 'Review']

export function CheckoutPage() {
  const [step, setStep] = useState(0)
  const [address, setAddress] = useState({
    full_name: '', phone: '', line1: '',
    line2: '', city: '', state: '', pincode: '',
  })
  const { items, subtotal, shipping, total } = useCartStore()
  const sub = subtotal()
  const ship = shipping()
  const tot = total()

  const setA = (k: string, v: string) => setAddress(a => ({ ...a, [k]: v }))

  const inputStyle = {
    width: '100%', padding: '11px 14px',
    border: '1.5px solid #E7DDD5', borderRadius: 10,
    fontFamily: 'Inter, sans-serif', fontSize: 14,
    color: '#46352A', backgroundColor: '#FFF9F2',
    outline: 'none', boxSizing: 'border-box' as const,
  }

  const labelStyle = {
    display: 'block', fontFamily: 'Poppins, sans-serif',
    fontSize: 12, fontWeight: 600 as const, color: '#46352A', marginBottom: 6,
  }

  return (
    <div style={{ backgroundColor: '#FFF9F2', minHeight: '100vh', padding: '32px 24px' }}>
      <div style={{ maxWidth: 1000, margin: '0 auto' }}>

        {/* Steps */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 0, marginBottom: 40 }}>
          {steps.map((s, i) => (
            <div key={s} style={{ display: 'flex', alignItems: 'center' }}>
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
                <div style={{
                  width: 32, height: 32, borderRadius: '50%',
                  backgroundColor: i <= step ? '#B56A45' : '#E7DDD5',
                  color: i <= step ? 'white' : '#786A61',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontFamily: 'Poppins, sans-serif', fontSize: 13, fontWeight: 700,
                  transition: 'all 0.3s',
                }}>
                  {i < step ? '✓' : i + 1}
                </div>
                <span style={{
                  fontFamily: 'Poppins, sans-serif', fontSize: 11,
                  color: i <= step ? '#B56A45' : '#786A61', fontWeight: 500,
                }}>{s}</span>
              </div>
              {i < steps.length - 1 && (
                <div style={{
                  width: 80, height: 2, margin: '0 8px',
                  backgroundColor: i < step ? '#B56A45' : '#E7DDD5',
                  marginBottom: 20, transition: 'all 0.3s',
                }} />
              )}
            </div>
          ))}
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 340px', gap: 24, alignItems: 'start' }} className="checkout-grid">

          {/* Left */}
          <div style={{
            backgroundColor: 'white', borderRadius: 20,
            padding: '28px 24px',
            border: '1px solid #E7DDD5',
            boxShadow: '0 2px 12px rgba(70,53,42,0.06)',
          }}>

            {/* Step 0 — Address */}
            {step === 0 && (
              <motion.div initial={{ opacity: 0, x: -16 }} animate={{ opacity: 1, x: 0 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 24 }}>
                  <MapPin size={18} color="#B56A45" />
                  <h2 style={{ fontFamily: 'Playfair Display, serif', fontSize: 20, color: '#46352A', fontWeight: 700 }}>
                    Delivery Address
                  </h2>
                </div>

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
                      <label style={labelStyle}>{f.label}</label>
                      <input
                        value={(address as any)[f.key]}
                        onChange={e => setA(f.key, e.target.value)}
                        style={inputStyle}
                      />
                    </div>
                  ))}
                </div>

                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={() => setStep(1)}
                  style={{
                    marginTop: 24, width: '100%', padding: '13px',
                    backgroundColor: '#B56A45', color: 'white',
                    border: 'none', borderRadius: 12,
                    fontFamily: 'Poppins, sans-serif',
                    fontSize: 15, fontWeight: 600, cursor: 'pointer',
                    display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
                    boxShadow: '0 4px 16px rgba(181,106,69,0.3)',
                  }}
                >
                  Continue to Payment <ChevronRight size={16} />
                </motion.button>
              </motion.div>
            )}

            {/* Step 1 — Payment */}
            {step === 1 && (
              <motion.div initial={{ opacity: 0, x: -16 }} animate={{ opacity: 1, x: 0 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 24 }}>
                  <CreditCard size={18} color="#B56A45" />
                  <h2 style={{ fontFamily: 'Playfair Display, serif', fontSize: 20, color: '#46352A', fontWeight: 700 }}>
                    Payment
                  </h2>
                </div>

                <div style={{
                  backgroundColor: '#F6EFE7', borderRadius: 14,
                  padding: '20px', border: '1px solid #E7DDD5',
                  display: 'flex', alignItems: 'center', gap: 14, marginBottom: 24,
                }}>
                  <ShieldCheck size={24} color="#91A57A" />
                  <div>
                    <p style={{ fontFamily: 'Poppins, sans-serif', fontSize: 13, fontWeight: 600, color: '#46352A' }}>
                      Secured by Razorpay
                    </p>
                    <p style={{ fontFamily: 'Inter, sans-serif', fontSize: 12, color: '#786A61' }}>
                      UPI · Cards · Net Banking · Wallets
                    </p>
                  </div>
                </div>

                <div style={{ display: 'flex', gap: 10 }}>
                  <button
                    onClick={() => setStep(0)}
                    style={{
                      flex: 1, padding: '13px',
                      border: '1.5px solid #E7DDD5', borderRadius: 12,
                      backgroundColor: 'white', color: '#46352A',
                      fontFamily: 'Poppins, sans-serif', fontSize: 14, fontWeight: 500,
                      cursor: 'pointer',
                    }}
                  >
                    Back
                  </button>
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.97 }}
                    onClick={() => setStep(2)}
                    style={{
                      flex: 2, padding: '13px',
                      backgroundColor: '#B56A45', color: 'white',
                      border: 'none', borderRadius: 12,
                      fontFamily: 'Poppins, sans-serif',
                      fontSize: 15, fontWeight: 600, cursor: 'pointer',
                      boxShadow: '0 4px 16px rgba(181,106,69,0.3)',
                    }}
                  >
                    Review Order
                  </motion.button>
                </div>
              </motion.div>
            )}

            {/* Step 2 — Review */}
            {step === 2 && (
              <motion.div initial={{ opacity: 0, x: -16 }} animate={{ opacity: 1, x: 0 }}>
                <h2 style={{ fontFamily: 'Playfair Display, serif', fontSize: 20, color: '#46352A', fontWeight: 700, marginBottom: 20 }}>
                  Review & Place Order
                </h2>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 24 }}>
                  {items.map(item => (
                    <div key={item.product.id} style={{
                      display: 'flex', gap: 12, alignItems: 'center',
                      padding: '12px', backgroundColor: '#F6EFE7',
                      borderRadius: 12,
                    }}>
                      <div style={{
                        width: 48, height: 48, borderRadius: 8,
                        backgroundColor: '#E7DDD5', overflow: 'hidden', flexShrink: 0,
                      }}>
                        {item.product.images[0] && (
                          <img src={item.product.images[0]} alt={item.product.name}
                            style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                        )}
                      </div>
                      <div style={{ flex: 1 }}>
                        <p style={{ fontFamily: 'Poppins, sans-serif', fontSize: 13, fontWeight: 600, color: '#46352A' }}>
                          {item.product.name}
                        </p>
                        <p style={{ fontFamily: 'Inter, sans-serif', fontSize: 12, color: '#786A61' }}>
                          Qty: {item.quantity}
                        </p>
                      </div>
                      <p style={{ fontFamily: 'Poppins, sans-serif', fontSize: 14, fontWeight: 700, color: '#B56A45' }}>
                        ₹{item.product.price * item.quantity}
                      </p>
                    </div>
                  ))}
                </div>

                <div style={{ display: 'flex', gap: 10 }}>
                  <button
                    onClick={() => setStep(1)}
                    style={{
                      flex: 1, padding: '13px',
                      border: '1.5px solid #E7DDD5', borderRadius: 12,
                      backgroundColor: 'white', color: '#46352A',
                      fontFamily: 'Poppins, sans-serif', fontSize: 14, cursor: 'pointer',
                    }}
                  >Back</button>
                  <Link to="/order-success/demo123" style={{ flex: 2, textDecoration: 'none' }}>
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.97 }}
                      style={{
                        width: '100%', padding: '13px',
                        backgroundColor: '#B56A45', color: 'white',
                        border: 'none', borderRadius: 12,
                        fontFamily: 'Poppins, sans-serif',
                        fontSize: 15, fontWeight: 600, cursor: 'pointer',
                        boxShadow: '0 4px 16px rgba(181,106,69,0.3)',
                      }}
                    >
                      Pay ₹{tot}
                    </motion.button>
                  </Link>
                </div>
              </motion.div>
            )}
          </div>

          {/* Right — Order summary */}
          <div style={{
            backgroundColor: 'white', borderRadius: 20,
            padding: '24px', border: '1px solid #E7DDD5',
            boxShadow: '0 2px 12px rgba(70,53,42,0.06)',
            position: 'sticky', top: 100,
          }}>
            <h3 style={{
              fontFamily: 'Playfair Display, serif',
              fontSize: 18, color: '#46352A', fontWeight: 700, marginBottom: 16,
            }}>Order Summary</h3>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 16 }}>
              {items.map(item => (
                <div key={item.product.id} style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ fontFamily: 'Inter, sans-serif', fontSize: 13, color: '#786A61' }}>
                    {item.product.name} × {item.quantity}
                  </span>
                  <span style={{ fontFamily: 'Poppins, sans-serif', fontSize: 13, fontWeight: 600, color: '#46352A' }}>
                    ₹{item.product.price * item.quantity}
                  </span>
                </div>
              ))}
            </div>

            <div style={{ height: 1, backgroundColor: '#E7DDD5', marginBottom: 12 }} />

            {[
              { label: 'Subtotal', value: `₹${sub}` },
              { label: 'Shipping', value: ship === 0 ? 'FREE' : `₹${ship}` },
            ].map(r => (
              <div key={r.label} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                <span style={{ fontFamily: 'Inter, sans-serif', fontSize: 13, color: '#786A61' }}>{r.label}</span>
                <span style={{ fontFamily: 'Poppins, sans-serif', fontSize: 13, fontWeight: 600, color: '#46352A' }}>{r.value}</span>
              </div>
            ))}

            <div style={{ height: 1, backgroundColor: '#E7DDD5', margin: '12px 0' }} />
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ fontFamily: 'Poppins, sans-serif', fontSize: 15, fontWeight: 700, color: '#46352A' }}>Total</span>
              <span style={{ fontFamily: 'Poppins, sans-serif', fontSize: 15, fontWeight: 700, color: '#B56A45' }}>₹{tot}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
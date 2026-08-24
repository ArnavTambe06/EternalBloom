import { useState } from 'react'
import { motion } from 'framer-motion'
import { Link, useNavigate } from 'react-router-dom'
import { ChevronRight, MapPin, CreditCard, ShieldCheck } from 'lucide-react'
import { useCartStore } from '@/store/cartStore'
import { useAuth } from '@/hooks/useAuth'
import { createOrder } from '@/services/orders'
import type { Address } from '@/types'

const steps = ['Address', 'Payment', 'Review']

const inputStyle: React.CSSProperties = {
  width: '100%', padding: '11px 14px',
  border: '1.5px solid var(--border)', borderRadius: 10,
  fontFamily: 'var(--font-body)', fontSize: 14,
  color: 'var(--on-surface)', backgroundColor: 'var(--surface)',
  outline: 'none', boxSizing: 'border-box', transition: 'border-color 0.2s',
}

const labelStyle: React.CSSProperties = {
  display: 'block', fontFamily: 'var(--font-body)',
  fontSize: 11, fontWeight: 700,
  letterSpacing: '0.08em', textTransform: 'uppercase',
  color: 'var(--on-surface-muted)', marginBottom: 6,
}

export function CheckoutPage() {
  const [step, setStep] = useState(0)
  const [placing, setPlacing] = useState(false)
  const [address, setAddress] = useState({
    full_name: '', phone: '', line1: '',
    line2: '', city: '', state: '', pincode: '',
  })
  const { items, subtotal, shipping, total, clearCart } = useCartStore()
  const { user } = useAuth()
  const navigate = useNavigate()

  const sub = subtotal()
  const ship = shipping()
  const tot = total()

  const setA = (k: string, v: string) => setAddress(a => ({ ...a, [k]: v }))

  const focusStyle = (e: React.FocusEvent<HTMLInputElement>) =>
    e.target.style.borderColor = 'var(--primary)'
  const blurStyle = (e: React.FocusEvent<HTMLInputElement>) =>
    e.target.style.borderColor = 'var(--border)'

  const handlePlaceOrder = async () => {
    if (items.length === 0) return
    setPlacing(true)
    try {
      const order = await createOrder({
        userId: user?.id,
        items,
        address: address as unknown as Address,
        subtotal: sub,
        shipping: ship,
        total: tot,
      })
      clearCart()
      navigate(`/order-success/${order.id}`)
    } catch (err) {
      console.error('Order creation failed:', err)
      alert('Something went wrong. Please try again.')
    } finally {
      setPlacing(false)
    }
  }

  return (
    <div style={{ backgroundColor: 'var(--surface)', minHeight: '100vh', padding: '40px 24px' }}>
      <div style={{ maxWidth: 1000, margin: '0 auto' }}>

        {/* Stepper */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 0, marginBottom: 48 }}>
          {steps.map((s, i) => (
            <div key={s} style={{ display: 'flex', alignItems: 'center' }}>
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6 }}>
                <div style={{
                  width: 34, height: 34, borderRadius: '50%',
                  background: i <= step ? 'var(--primary-gradient)' : 'var(--surface-container)',
                  color: i <= step ? 'var(--on-surface)' : 'var(--on-surface-faint)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontFamily: 'var(--font-body)', fontSize: 13, fontWeight: 700,
                  transition: 'all 0.3s',
                  boxShadow: i <= step ? '0 4px 12px rgba(255,133,208,0.3)' : 'none',
                }}>
                  {i < step ? '✓' : i + 1}
                </div>
                <span style={{
                  fontFamily: 'var(--font-body)', fontSize: 11,
                  color: i <= step ? 'var(--primary)' : 'var(--on-surface-faint)',
                  fontWeight: 500,
                }}>{s}</span>
              </div>
              {i < steps.length - 1 && (
                <div style={{
                  width: 80, height: 2, margin: '0 8px', marginBottom: 20,
                  background: i < step ? 'var(--primary-gradient)' : 'var(--border)',
                  transition: 'all 0.3s',
                }} />
              )}
            </div>
          ))}
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 320px', gap: 24, alignItems: 'start' }}
          className="checkout-grid">

          {/* Left — steps */}
          <div style={{
            backgroundColor: 'var(--surface-white)',
            borderRadius: 20, padding: '28px 24px',
            border: '1px solid var(--border)',
            boxShadow: '0 2px 12px rgba(212,72,154,0.06)',
          }}>

            {/* Step 0 — Address */}
            {step === 0 && (
              <motion.div initial={{ opacity: 0, x: -16 }} animate={{ opacity: 1, x: 0 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 24 }}>
                  <MapPin size={18} color="var(--primary)" />
                  <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 20, fontWeight: 700, color: 'var(--on-surface)' }}>
                    Delivery Address
                  </h2>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
                  {[
                    { label: 'Full Name *', key: 'full_name', col: 2 },
                    { label: 'Phone *', key: 'phone', col: 1 },
                    { label: 'Pincode *', key: 'pincode', col: 1 },
                    { label: 'Address Line 1 *', key: 'line1', col: 2 },
                    { label: 'Address Line 2 (optional)', key: 'line2', col: 2 },
                    { label: 'City *', key: 'city', col: 1 },
                    { label: 'State *', key: 'state', col: 1 },
                  ].map(f => (
                    <div key={f.key} style={{ gridColumn: `span ${f.col}` }}>
                      <label style={labelStyle}>{f.label}</label>
                      <input
                        style={inputStyle}
                        value={(address as any)[f.key]}
                        onChange={e => setA(f.key, e.target.value)}
                        onFocus={focusStyle}
                        onBlur={blurStyle}
                      />
                    </div>
                  ))}
                </div>
                <motion.button
                  whileHover={{ scale: 1.01 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={() => {
                    if (!address.full_name || !address.phone || !address.line1 || !address.city || !address.state || !address.pincode) {
                      alert('Please fill in all required fields.')
                      return
                    }
                    setStep(1)
                  }}
                  style={{
                    marginTop: 24, width: '100%', padding: '13px',
                    background: 'var(--primary-gradient)',
                    border: 'none', borderRadius: 12,
                    fontFamily: 'var(--font-body)', fontSize: 15, fontWeight: 600,
                    color: 'var(--on-surface)', cursor: 'pointer',
                    display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
                    boxShadow: '0 4px 16px rgba(255,133,208,0.3)',
                  }}
                >
                  Continue to Payment <ChevronRight size={16} />
                </motion.button>
              </motion.div>
            )}

            {/* Step 1 — Payment */}
            {step === 1 && (
  <motion.div initial={{ opacity: 0, x: -16 }} animate={{ opacity: 1, x: 0 }}>
    <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 24 }}>
      <CreditCard size={18} color="var(--primary)" />
      <h2 style={{
        fontFamily: 'var(--font-display)',
        fontSize: 20, fontWeight: 700, color: 'var(--on-surface)',
      }}>
        Payment Method
      </h2>
    </div>

    {/* COD card — selected by default */}
    <div style={{
      border: '2px solid var(--primary)',
      borderRadius: 14, padding: '20px',
      backgroundColor: 'var(--primary-pale)',
      display: 'flex', alignItems: 'center', gap: 16,
      marginBottom: 16,
    }}>
      <div style={{
        width: 44, height: 44, borderRadius: '50%',
        background: 'var(--primary-gradient)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        flexShrink: 0,
        boxShadow: '0 4px 12px rgba(255,133,208,0.3)',
      }}>
        <span style={{ fontSize: 20 }}>💵</span>
      </div>
      <div style={{ flex: 1 }}>
        <p style={{
          fontFamily: 'var(--font-body)',
          fontSize: 15, fontWeight: 700, color: 'var(--on-surface)',
          marginBottom: 3,
        }}>Cash on Delivery</p>
        <p style={{
          fontFamily: 'var(--font-body)',
          fontSize: 13, color: 'var(--on-surface-muted)',
        }}>
          Pay in cash when your order arrives at your door.
        </p>
      </div>
      <div style={{
        width: 20, height: 20, borderRadius: '50%',
        background: 'var(--primary-gradient)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        flexShrink: 0,
      }}>
        <div style={{ width: 8, height: 8, borderRadius: '50%', backgroundColor: 'white' }} />
      </div>
    </div>

    {/* Info note */}
    <div style={{
      backgroundColor: 'var(--surface)',
      borderRadius: 12, padding: '14px 16px',
      border: '1px solid var(--border)',
      marginBottom: 28,
    }}>
      <p style={{
        fontFamily: 'var(--font-body)',
        fontSize: 13, color: 'var(--on-surface-muted)', lineHeight: 1.6,
      }}>
        🌸 Since every piece is <strong>handmade to order</strong>, your order will be
        crafted and dispatched within <strong>3–5 business days</strong>.
        You'll receive a confirmation call before delivery.
      </p>
    </div>

    <div style={{ display: 'flex', gap: 10 }}>
      <button
        onClick={() => setStep(0)}
        style={{
          flex: 1, padding: '13px',
          border: '1.5px solid var(--border)', borderRadius: 12,
          backgroundColor: 'white', color: 'var(--on-surface)',
          fontFamily: 'var(--font-body)', fontSize: 14, cursor: 'pointer',
        }}
      >Back</button>
      <motion.button
        whileHover={{ scale: 1.01 }}
        whileTap={{ scale: 0.97 }}
        onClick={() => setStep(2)}
        style={{
          flex: 2, padding: '13px',
          background: 'var(--primary-gradient)',
          border: 'none', borderRadius: 12,
          fontFamily: 'var(--font-body)', fontSize: 15, fontWeight: 600,
          color: 'var(--on-surface)', cursor: 'pointer',
          boxShadow: '0 4px 16px rgba(255,133,208,0.3)',
        }}
      >Review Order</motion.button>
    </div>
  </motion.div>
)}

            {/* Step 2 — Review */}
            {step === 2 && (
              <motion.div initial={{ opacity: 0, x: -16 }} animate={{ opacity: 1, x: 0 }}>
                <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 20, fontWeight: 700, color: 'var(--on-surface)', marginBottom: 20 }}>
                  Review & Confirm
                </h2>

                {/* Address summary */}
                <div style={{ marginBottom: 20, padding: '14px 16px', backgroundColor: 'var(--surface)', borderRadius: 12, border: '1px solid var(--border)' }}>
                  <p className="label-caps" style={{ marginBottom: 6 }}>Delivering to</p>
                  <p style={{ fontFamily: 'var(--font-body)', fontSize: 13, color: 'var(--on-surface)', lineHeight: 1.6 }}>
                    {address.full_name} · {address.phone}<br />
                    {address.line1}{address.line2 ? `, ${address.line2}` : ''}<br />
                    {address.city}, {address.state} — {address.pincode}
                  </p>
                </div>

                {/* Items */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 20 }}>
                  {items.map(item => (
                    <div key={item.product.id} style={{
                      display: 'flex', gap: 12, alignItems: 'center',
                      padding: '12px', backgroundColor: 'var(--surface)', borderRadius: 12,
                    }}>
                      <div style={{ width: 48, height: 48, borderRadius: 8, backgroundColor: 'var(--surface-section)', overflow: 'hidden', flexShrink: 0 }}>
                        {item.product.images?.[0] && (
                          <img src={item.product.images[0]} alt={item.product.name}
                            style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                        )}
                      </div>
                      <div style={{ flex: 1 }}>
                        <p style={{ fontFamily: 'var(--font-body)', fontSize: 13, fontWeight: 600, color: 'var(--on-surface)' }}>
                          {item.product.name}
                        </p>
                        <p style={{ fontFamily: 'var(--font-body)', fontSize: 12, color: 'var(--on-surface-muted)' }}>
                          Qty: {item.quantity}
                          {item.selected_color ? ` · ${item.selected_color.name}` : ''}
                        </p>
                      </div>
                      <p style={{ fontFamily: 'var(--font-body)', fontSize: 14, fontWeight: 700, color: 'var(--primary)' }}>
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
                      border: '1.5px solid var(--border)', borderRadius: 12,
                      backgroundColor: 'white', color: 'var(--on-surface)',
                      fontFamily: 'var(--font-body)', fontSize: 14, cursor: 'pointer',
                    }}
                  >Back</button>
                  <motion.button
                    whileHover={{ scale: 1.01 }}
                    whileTap={{ scale: 0.97 }}
                    onClick={handlePlaceOrder}
                    disabled={placing}
                    style={{
                      flex: 2, padding: '13px',
                      background: 'var(--primary-gradient)',
                      border: 'none', borderRadius: 12,
                      fontFamily: 'var(--font-body)', fontSize: 15, fontWeight: 600,
                      color: 'var(--on-surface)', cursor: placing ? 'not-allowed' : 'pointer',
                      opacity: placing ? 0.7 : 1,
                      boxShadow: '0 4px 16px rgba(255,133,208,0.3)',
                      display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
                    }}
                  >
                    {placing && (
                      <div style={{
                        width: 16, height: 16, borderRadius: '50%',
                        border: '2px solid rgba(61,26,46,0.3)',
                        borderTopColor: 'var(--on-surface)',
                        animation: 'spin 0.7s linear infinite',
                      }} />
                    )}
                    {placing ? 'Placing Order...' : `Place Order · ₹${tot}`}
                  </motion.button>
                </div>
              </motion.div>
            )}
          </div>

          {/* Right — order summary */}
          <div style={{
            backgroundColor: 'var(--surface-white)',
            borderRadius: 20, padding: '24px',
            border: '1px solid var(--border)',
            boxShadow: '0 2px 12px rgba(212,72,154,0.06)',
            position: 'sticky', top: 24,
          }}>
            <h3 style={{ fontFamily: 'var(--font-display)', fontSize: 18, fontWeight: 700, color: 'var(--on-surface)', marginBottom: 16 }}>
              Order Summary
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 16 }}>
              {items.map(item => (
                <div key={item.product.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontFamily: 'var(--font-body)', fontSize: 13, color: 'var(--on-surface-muted)', maxWidth: 160, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {item.product.name} × {item.quantity}
                  </span>
                  <span style={{ fontFamily: 'var(--font-body)', fontSize: 13, fontWeight: 600, color: 'var(--on-surface)' }}>
                    ₹{item.product.price * item.quantity}
                  </span>
                </div>
              ))}
            </div>
            <div style={{ height: 1, backgroundColor: 'var(--border)', marginBottom: 12 }} />
            {[
              { label: 'Subtotal', value: `₹${sub}` },
              { label: 'Shipping', value: ship === 0 ? '🎉 Free' : `₹${ship}` },
            ].map(r => (
              <div key={r.label} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                <span style={{ fontFamily: 'var(--font-body)', fontSize: 13, color: 'var(--on-surface-muted)' }}>{r.label}</span>
                <span style={{ fontFamily: 'var(--font-body)', fontSize: 13, fontWeight: 600, color: 'var(--on-surface)' }}>{r.value}</span>
              </div>
            ))}
            <div style={{ height: 1, backgroundColor: 'var(--border)', margin: '12px 0' }} />
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontFamily: 'var(--font-display)', fontSize: 16, fontWeight: 700, color: 'var(--on-surface)' }}>Total</span>
              <span style={{ fontFamily: 'var(--font-display)', fontSize: 20, fontWeight: 700, color: 'var(--primary)' }}>₹{tot}</span>
            </div>
          </div>
        </div>
      </div>
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  )
}
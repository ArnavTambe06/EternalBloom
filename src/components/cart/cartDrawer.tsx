import { motion, AnimatePresence } from 'framer-motion'
import { X, ShoppingBag, Plus, Minus, Trash2, ArrowRight } from 'lucide-react'
import { Link } from 'react-router-dom'
import { useCartStore } from '@/store/cartStore'
import { SHIPPING } from '@/lib/constants'

export function CartDrawer() {
  const { items, isOpen, closeCart, removeItem, updateQuantity, subtotal, shipping, total } = useCartStore()
  const sub = subtotal()
  const ship = shipping()
  const tot = total()

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeCart}
            style={{
              position: 'fixed', inset: 0,
              backgroundColor: 'rgba(0,0,0,0.3)',
              zIndex: 400,
            }}
          />

          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', stiffness: 320, damping: 34 }}
            style={{
              position: 'fixed', top: 0, right: 0, bottom: 0,
              width: '100%', maxWidth: 400,
              backgroundColor: 'var(--bg)',
              zIndex: 401,
              display: 'flex', flexDirection: 'column',
              boxShadow: '-4px 0 32px rgba(0,0,0,0.08)',
            }}
          >
            {/* Header */}
            <div style={{
              padding: '20px 24px',
              borderBottom: '1px solid var(--line)',
              display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <ShoppingBag size={16} strokeWidth={1.5} color="var(--ink)" />
                <h2 style={{
                  fontFamily: 'var(--serif)',
                  fontSize: 17, fontWeight: 600, color: 'var(--ink)',
                }}>Your Bag</h2>
                {items.length > 0 && (
                  <span style={{
                    background: 'var(--grad)',
                    padding: '2px 8px',
                    fontFamily: 'var(--sans)',
                    fontSize: 11, fontWeight: 700, color: 'var(--ink)',
                  }}>{items.length}</span>
                )}
              </div>
              <button
                onClick={closeCart}
                style={{
                  width: 30, height: 30, border: '1px solid var(--line)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  color: 'var(--ink-2)', cursor: 'pointer',
                  backgroundColor: 'transparent',
                }}
              >
                <X size={14} strokeWidth={1.5} />
              </button>
            </div>

            {/* Items */}
            <div style={{ flex: 1, overflowY: 'auto', padding: '20px 24px' }}>
              {items.length === 0 ? (
                <div style={{
                  display: 'flex', flexDirection: 'column',
                  alignItems: 'center', justifyContent: 'center',
                  height: '100%', gap: 16, textAlign: 'center',
                }}>
                  <ShoppingBag size={36} strokeWidth={1} color="var(--ink-3)" />
                  <div>
                    <p style={{
                      fontFamily: 'var(--serif)',
                      fontSize: 17, color: 'var(--ink)', marginBottom: 6,
                    }}>Your bag is empty</p>
                    <p style={{
                      fontFamily: 'var(--sans)',
                      fontSize: 13, color: 'var(--ink-3)',
                    }}>Discover something beautiful.</p>
                  </div>
                  <button
                    onClick={closeCart}
                    style={{
                      marginTop: 8, padding: '11px 24px',
                      background: 'var(--grad)',
                      border: 'none', cursor: 'pointer',
                      fontFamily: 'var(--sans)',
                      fontSize: 12, fontWeight: 600,
                      color: 'var(--ink)', letterSpacing: '0.05em',
                    }}
                  >Browse Collection</button>
                </div>
              ) : (
                <div>
                  {items.map((item, i) => (
                    <motion.div
                      key={item.product.id}
                      layout
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      style={{
                        display: 'flex', gap: 14,
                        paddingBottom: 20, marginBottom: 20,
                        borderBottom: i < items.length - 1 ? '1px solid var(--line)' : 'none',
                      }}
                    >
                      {/* Image */}
                      <div style={{
                        width: 80, height: 100, flexShrink: 0,
                        backgroundColor: 'var(--bg-soft)',
                        overflow: 'hidden',
                        border: '1px solid var(--line)',
                      }}>
                        {item.product.images?.[0] && (
                          <img
                            src={item.product.images[0]}
                            alt={item.product.name}
                            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                          />
                        )}
                      </div>

                      {/* Info */}
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <p style={{
                          fontFamily: 'var(--sans)',
                          fontSize: 10, color: 'var(--ink-3)',
                          letterSpacing: '0.1em', textTransform: 'uppercase',
                          marginBottom: 4, fontWeight: 500,
                        }}>{item.product.category?.name}</p>

                        <p style={{
                          fontFamily: 'var(--serif)',
                          fontSize: 14, color: 'var(--ink)',
                          fontWeight: 500, marginBottom: 6,
                          overflow: 'hidden', textOverflow: 'ellipsis',
                          whiteSpace: 'nowrap',
                        }}>{item.product.name}</p>

                        {item.selected_color && (
                          <p style={{
                            fontFamily: 'var(--sans)',
                            fontSize: 11, color: 'var(--ink-3)', marginBottom: 10,
                          }}>
                            Colour: {item.selected_color.name}
                          </p>
                        )}

                        <div style={{
                          display: 'flex', alignItems: 'center',
                          justifyContent: 'space-between',
                        }}>
                          {/* Qty */}
                          <div style={{ display: 'inline-flex', alignItems: 'center' }}>
                            {[
                              { Icon: Minus, action: () => updateQuantity(item.product.id, item.quantity - 1) },
                              null,
                              { Icon: Plus, action: () => updateQuantity(item.product.id, item.quantity + 1) },
                            ].map((btn, j) =>
                              btn === null ? (
                                <span key="v" style={{
                                  width: 32, height: 26, border: '1px solid var(--line)',
                                  borderLeft: 'none', borderRight: 'none',
                                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                                  fontFamily: 'var(--sans)', fontSize: 12,
                                  fontWeight: 600, color: 'var(--ink)',
                                }}>{item.quantity}</span>
                              ) : (
                                <button
                                  key={j}
                                  onClick={btn.action}
                                  style={{
                                    width: 26, height: 26,
                                    border: '1px solid var(--line)',
                                    backgroundColor: 'var(--bg-soft)',
                                    cursor: 'pointer', display: 'flex',
                                    alignItems: 'center', justifyContent: 'center',
                                  }}
                                >
                                  <btn.Icon size={11} strokeWidth={1.5} color="var(--ink)" />
                                </button>
                              )
                            )}
                          </div>

                          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                            <span style={{
                              fontFamily: 'var(--sans)',
                              fontSize: 14, fontWeight: 600, color: 'var(--ink)',
                            }}>₹{item.product.price * item.quantity}</span>
                            <button
                              onClick={() => removeItem(item.product.id)}
                              style={{
                                background: 'none', border: 'none',
                                cursor: 'pointer', color: 'var(--ink-3)',
                                display: 'flex', padding: 2,
                                transition: 'color 0.2s',
                              }}
                              onMouseEnter={e => e.currentTarget.style.color = '#C00'}
                              onMouseLeave={e => e.currentTarget.style.color = 'var(--ink-3)'}
                            >
                              <Trash2 size={13} strokeWidth={1.5} />
                            </button>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </div>

            {/* Footer */}
            {items.length > 0 && (
              <div style={{
                padding: '20px 24px',
                borderTop: '1px solid var(--line)',
              }}>
                {/* Free shipping progress */}
                {sub < SHIPPING.freeAbove && (
                  <div style={{ marginBottom: 16 }}>
                    <div style={{
                      display: 'flex', justifyContent: 'space-between', marginBottom: 6,
                    }}>
                      <span style={{ fontFamily: 'var(--sans)', fontSize: 11, color: 'var(--ink-3)' }}>
                        ₹{SHIPPING.freeAbove - sub} away from free shipping
                      </span>
                    </div>
                    <div style={{ height: 2, backgroundColor: 'var(--line)' }}>
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${Math.min(100, (sub / SHIPPING.freeAbove) * 100)}%` }}
                        style={{ height: '100%', background: 'var(--grad)' }}
                      />
                    </div>
                  </div>
                )}

                {/* Totals */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 16 }}>
                  {[
                    { label: 'Subtotal', value: `₹${sub}` },
                    { label: 'Shipping', value: ship === 0 ? 'Free' : `₹${ship}` },
                  ].map(r => (
                    <div key={r.label} style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <span style={{ fontFamily: 'var(--sans)', fontSize: 13, color: 'var(--ink-3)' }}>
                        {r.label}
                      </span>
                      <span style={{ fontFamily: 'var(--sans)', fontSize: 13, fontWeight: 500, color: 'var(--ink)' }}>
                        {r.value}
                      </span>
                    </div>
                  ))}
                  <div style={{ height: 1, backgroundColor: 'var(--line)' }} />
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                    <span style={{ fontFamily: 'var(--serif)', fontSize: 15, fontWeight: 600, color: 'var(--ink)' }}>
                      Total
                    </span>
                    <span style={{ fontFamily: 'var(--serif)', fontSize: 18, fontWeight: 700, color: 'var(--ink)' }}>
                      ₹{tot}
                    </span>
                  </div>
                </div>

                <Link to="/checkout" onClick={closeCart} style={{ textDecoration: 'none' }}>
                  <motion.button
                    whileHover={{ opacity: 0.88 }}
                    whileTap={{ scale: 0.98 }}
                    style={{
                      width: '100%', padding: '14px',
                      background: 'var(--grad)',
                      border: 'none', cursor: 'pointer',
                      fontFamily: 'var(--sans)',
                      fontSize: 13, fontWeight: 600,
                      color: 'var(--ink)',
                      letterSpacing: '0.05em',
                      display: 'flex', alignItems: 'center',
                      justifyContent: 'center', gap: 8,
                    }}
                  >
                    Checkout · ₹{tot} <ArrowRight size={14} strokeWidth={2} />
                  </motion.button>
                </Link>

                <p style={{
                  textAlign: 'center', marginTop: 10,
                  fontFamily: 'var(--sans)', fontSize: 11,
                  color: 'var(--ink-3)',
                }}>
                  Cash on Delivery · Free shipping above ₹999
                </p>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
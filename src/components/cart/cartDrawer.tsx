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
              backgroundColor: 'rgba(4,22,39,0.45)',
              backdropFilter: 'blur(4px)',
              zIndex: 300,
            }}
          />

          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', stiffness: 300, damping: 32 }}
            style={{
              position: 'fixed', top: 0, right: 0, bottom: 0,
              width: '100%', maxWidth: 420,
              backgroundColor: 'var(--surface)',
              zIndex: 301,
              display: 'flex', flexDirection: 'column',
              boxShadow: '-4px 0 40px rgba(4,22,39,0.12)',
            }}
          >
            {/* Header */}
            <div style={{
              padding: '24px 28px',
              borderBottom: '1px solid rgba(4,22,39,0.08)',
              display: 'flex', alignItems: 'center', justifyContent: 'space-between',
              backgroundColor: 'var(--surface-white)',
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <ShoppingBag size={18} color="var(--primary)" />
                <h2 style={{
                  fontFamily: 'var(--font-display)',
                  fontSize: 18, fontWeight: 600, color: 'var(--primary)',
                }}>Your Cart</h2>
                {items.length > 0 && (
                  <span style={{
                    backgroundColor: 'var(--secondary)',
                    color: 'white',
                    padding: '2px 8px',
                    fontFamily: 'var(--font-body)',
                    fontSize: 11, fontWeight: 600,
                  }}>{items.length}</span>
                )}
              </div>
              <button
                onClick={closeCart}
                style={{
                  width: 32, height: 32,
                  backgroundColor: 'var(--surface-container)',
                  border: 'none', cursor: 'pointer',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}
              >
                <X size={15} color="var(--primary)" />
              </button>
            </div>

            {/* Items */}
            <div style={{ flex: 1, overflowY: 'auto', padding: '20px 28px' }}>
              {items.length === 0 ? (
                <div style={{
                  display: 'flex', flexDirection: 'column',
                  alignItems: 'center', justifyContent: 'center',
                  height: '100%', gap: 16, textAlign: 'center',
                }}>
                  <ShoppingBag size={40} color="var(--outline-variant)" />
                  <div>
                    <p style={{
                      fontFamily: 'var(--font-display)',
                      fontSize: 18, color: 'var(--primary)', marginBottom: 6,
                    }}>Your cart is empty</p>
                    <p style={{
                      fontFamily: 'var(--font-body)',
                      fontSize: 13, color: 'var(--on-surface-variant)',
                    }}>Discover something beautiful.</p>
                  </div>
                  <button
                    onClick={closeCart}
                    style={{
                      marginTop: 8, padding: '12px 28px',
                      background: 'var(--primary-gradient)', color: 'var(--on-surface)',
                      border: 'none', cursor: 'pointer',
                      fontFamily: 'var(--font-body)',
                      fontSize: 11, fontWeight: 600,
                      letterSpacing: '0.1em', textTransform: 'uppercase',
                    }}
                  >Browse Collection</button>
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
                  {items.map((item, i) => (
                    <motion.div
                      key={item.product.id}
                      layout
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      style={{
                        display: 'flex', gap: 14,
                        paddingTop: i === 0 ? 0 : 20,
                        paddingBottom: 20,
                        borderBottom: '1px solid rgba(4,22,39,0.07)',
                      }}
                    >
                      <div style={{
                        width: 76, height: 96, flexShrink: 0,
                        backgroundColor: 'var(--surface-container)',
                        overflow: 'hidden',
                      }} className="luxury-border">
                        {item.product.images[0] && (
                          <img
                            src={item.product.images[0]}
                            alt={item.product.name}
                            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                          />
                        )}
                      </div>

                      <div style={{ flex: 1, minWidth: 0 }}>
                        <p className="label-caps" style={{ color: 'var(--secondary)', marginBottom: 4 }}>
                          {item.product.category?.name}
                        </p>
                        <p style={{
                          fontFamily: 'var(--font-display)',
                          fontSize: 14, fontWeight: 600,
                          color: 'var(--primary)', marginBottom: 8,
                          overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
                        }}>{item.product.name}</p>

                        {item.selected_color && (
                          <p style={{
                            fontFamily: 'var(--font-body)',
                            fontSize: 11, color: 'var(--on-surface-variant)', marginBottom: 10,
                          }}>
                            {item.selected_color.name}
                          </p>
                        )}

                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                          <div style={{ display: 'inline-flex', alignItems: 'center' }}>
                            {[
                              { Icon: Minus, action: () => updateQuantity(item.product.id, item.quantity - 1) },
                              null,
                              { Icon: Plus, action: () => updateQuantity(item.product.id, item.quantity + 1) },
                            ].map((btn, j) =>
                              btn === null ? (
                                <span key="v" style={{
                                  width: 36, height: 28,
                                  border: '1px solid rgba(4,22,39,0.15)',
                                  borderLeft: 'none', borderRight: 'none',
                                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                                  fontFamily: 'var(--font-body)',
                                  fontSize: 13, fontWeight: 600, color: 'var(--primary)',
                                }}>{item.quantity}</span>
                              ) : (
                                <button
                                  key={j}
                                  onClick={btn.action}
                                  style={{
                                    width: 28, height: 28,
                                    border: '1px solid rgba(4,22,39,0.15)',
                                    backgroundColor: 'var(--surface-low)',
                                    cursor: 'pointer',
                                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                                  }}
                                >
                                  <btn.Icon size={11} color="var(--primary)" />
                                </button>
                              )
                            )}
                          </div>

                          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                            <span style={{
                              fontFamily: 'var(--font-body)',
                              fontSize: 14, fontWeight: 600, color: 'var(--primary)',
                            }}>₹{item.product.price * item.quantity}</span>
                            <button
                              onClick={() => removeItem(item.product.id)}
                              style={{
                                background: 'none', border: 'none',
                                cursor: 'pointer', color: 'var(--outline)',
                                display: 'flex', alignItems: 'center',
                                transition: 'color 0.2s',
                              }}
                              onMouseEnter={e => (e.currentTarget.style.color = '#ba1a1a')}
                              onMouseLeave={e => (e.currentTarget.style.color = 'var(--outline)')}
                            >
                              <Trash2 size={14} />
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
                padding: '20px 28px',
                borderTop: '1px solid rgba(4,22,39,0.08)',
                backgroundColor: 'var(--surface-white)',
              }}>
                {sub < SHIPPING.freeAbove && (
                  <div style={{ marginBottom: 16 }}>
                    <div style={{
                      display: 'flex', justifyContent: 'space-between', marginBottom: 6,
                    }}>
                      <span style={{
                        fontFamily: 'var(--font-body)',
                        fontSize: 11, color: 'var(--on-surface-variant)',
                      }}>₹{SHIPPING.freeAbove - sub} away from free shipping</span>
                      <span style={{
                        fontFamily: 'var(--font-body)',
                        fontSize: 11, fontWeight: 600, color: 'var(--secondary)',
                      }}>{Math.round((sub / SHIPPING.freeAbove) * 100)}%</span>
                    </div>
                    <div style={{
                      height: 2, backgroundColor: 'var(--surface-container)',
                    }}>
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${Math.min(100, (sub / SHIPPING.freeAbove) * 100)}%` }}
                        style={{ height: '100%', backgroundColor: 'var(--secondary)' }}
                      />
                    </div>
                  </div>
                )}

                <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 16 }}>
                  {[
                    { label: 'Subtotal', value: `₹${sub}` },
                    { label: 'Shipping', value: ship === 0 ? 'Free' : `₹${ship}` },
                  ].map(r => (
                    <div key={r.label} style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <span style={{ fontFamily: 'var(--font-body)', fontSize: 13, color: 'var(--on-surface-variant)' }}>
                        {r.label}
                      </span>
                      <span style={{ fontFamily: 'var(--font-body)', fontSize: 13, fontWeight: 600, color: 'var(--primary)' }}>
                        {r.value}
                      </span>
                    </div>
                  ))}
                  <div style={{ height: 1, backgroundColor: 'rgba(4,22,39,0.08)' }} />
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                    <span style={{
                      fontFamily: 'var(--font-display)',
                      fontSize: 16, fontWeight: 600, color: 'var(--primary)',
                    }}>Total</span>
                    <span style={{
                      fontFamily: 'var(--font-display)',
                      fontSize: 18, fontWeight: 700, color: 'var(--primary)',
                    }}>₹{tot}</span>
                  </div>
                </div>

                <Link to="/checkout" onClick={closeCart} style={{ textDecoration: 'none' }}>
                  <motion.button
                    whileHover={{ opacity: 0.88 }}
                    whileTap={{ scale: 0.98 }}
                    style={{
                      width: '100%', padding: '15px',
                      background: 'var(--primary-gradient)', color: 'var(--on-surface)',
                      border: 'none', cursor: 'pointer',
                      fontFamily: 'var(--font-body)',
                      fontSize: 12, fontWeight: 600,
                      letterSpacing: '0.1em', textTransform: 'uppercase',
                      display: 'flex', alignItems: 'center',
                      justifyContent: 'center', gap: 10,
                    }}
                  >
                    Proceed to Checkout <ArrowRight size={14} />
                  </motion.button>
                </Link>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
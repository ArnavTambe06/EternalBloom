import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, ShoppingBag, Plus, Minus, ChevronLeft, ChevronRight } from 'lucide-react'
import type { Product } from '@/types'
import { useCartStore } from '@/store/cartStore'

interface Props { product: Product | null; onClose: () => void }

export function ProductModal({ product, onClose }: Props) {
  const [imgIndex, setImgIndex] = useState(0)
  const [qty, setQty] = useState(1)
  const [selectedColor, setSelectedColor] = useState(0)
  const { addItem } = useCartStore()

  const handleAdd = () => {
    if (!product) return
    addItem(product, qty, product.color_variants?.[selectedColor])
    onClose()
  }

  return (
    <AnimatePresence>
      {product && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            style={{
              position: 'fixed', inset: 0,
              backgroundColor: 'rgba(4,22,39,0.6)',
              backdropFilter: 'blur(6px)',
              zIndex: 200,
            }}
          />

          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 24 }}
            transition={{ type: 'spring', stiffness: 240, damping: 26 }}
            style={{
              position: 'fixed',
              top: '50%', left: '50%',
              transform: 'translate(-50%, -50%)',
              zIndex: 201,
              backgroundColor: 'var(--surface-white)',
              width: '90vw', maxWidth: 900,
              maxHeight: '90vh',
              overflow: 'hidden',
              display: 'flex',
              boxShadow: '0 32px 80px rgba(4,22,39,0.2)',
            }}
          >
            {/* Left — Image */}
            <div style={{
              width: '48%', flexShrink: 0,
              backgroundColor: 'var(--surface-container)',
              position: 'relative', overflow: 'hidden',
            }}>
              <motion.img
                key={imgIndex}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3 }}
                src={product.images?.[imgIndex]}
                alt={product.name}
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              />

              {product.images.length > 1 && (
                <>
                  {[
                    { side: 'left', action: () => setImgIndex(i => Math.max(0, i - 1)), Icon: ChevronLeft },
                    { side: 'right', action: () => setImgIndex(i => Math.min(product.images.length - 1, i + 1)), Icon: ChevronRight },
                  ].map(({ side, action, Icon }) => (
                    <button
                      key={side}
                      onClick={action}
                      style={{
                        position: 'absolute',
                        [side]: 12,
                        top: '50%', transform: 'translateY(-50%)',
                        width: 36, height: 36,
                        backgroundColor: 'rgba(252,249,248,0.9)',
                        border: 'none', cursor: 'pointer',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                      }}
                    >
                      <Icon size={18} color="var(--primary)" />
                    </button>
                  ))}
                  <div style={{
                    position: 'absolute', bottom: 16, left: '50%',
                    transform: 'translateX(-50%)',
                    display: 'flex', gap: 6,
                  }}>
                    {product.images.map((_, i) => (
                      <button
                        key={i}
                        onClick={() => setImgIndex(i)}
                        style={{
                          width: imgIndex === i ? 24 : 6,
                          height: 6,
                          backgroundColor: imgIndex === i ? 'var(--primary)' : 'rgba(255,255,255,0.5)',
                          border: 'none', cursor: 'pointer', padding: 0,
                          transition: 'all 0.3s',
                        }}
                      />
                    ))}
                  </div>
                </>
              )}

              {product.compare_price && (
                <div style={{
                  position: 'absolute', top: 16, left: 16,
                  backgroundColor: 'var(--primary-container)',
                  color: 'var(--primary-dim)',
                  padding: '4px 12px',
                  fontFamily: 'var(--font-body)',
                  fontSize: 10, fontWeight: 600, letterSpacing: '0.08em',
                }}>
                  −{Math.round(((product.compare_price - product.price) / product.compare_price) * 100)}% OFF
                </div>
              )}
            </div>

            {/* Right — Details */}
            <div style={{
              flex: 1, padding: '40px 36px',
              overflowY: 'auto', position: 'relative',
            }}>
              <button
                onClick={onClose}
                style={{
                  position: 'absolute', top: 20, right: 20,
                  width: 32, height: 32,
                  backgroundColor: 'var(--surface-container)',
                  border: 'none', cursor: 'pointer',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}
              >
                <X size={15} color="var(--primary)" />
              </button>

              <p className="label-caps" style={{ color: 'var(--secondary)', marginBottom: 12 }}>
                {product.category?.name}
              </p>

              <h2 style={{
                fontFamily: 'var(--font-display)',
                fontSize: 26, fontWeight: 700,
                color: 'var(--primary)',
                letterSpacing: '-0.02em',
                marginBottom: 16, lineHeight: 1.2,
              }}>{product.name}</h2>

              <div style={{ display: 'flex', alignItems: 'baseline', gap: 12, marginBottom: 20 }}>
                <span style={{
                  fontFamily: 'var(--font-body)',
                  fontSize: 22, fontWeight: 600,
                  color: 'var(--primary)',
                }}>₹{product.price}</span>
                {product.compare_price && (
                  <span style={{
                    fontFamily: 'var(--font-body)',
                    fontSize: 15, color: 'var(--outline)',
                    textDecoration: 'line-through',
                  }}>₹{product.compare_price}</span>
                )}
              </div>

              <p style={{
                fontFamily: 'var(--font-body)',
                fontSize: 14, color: 'var(--on-surface-variant)',
                lineHeight: 1.7, marginBottom: 24,
              }}>{product.description}</p>

              <div style={{ height: 1, backgroundColor: 'rgba(4,22,39,0.08)', marginBottom: 24 }} />

              {/* Colors */}
              {product.color_variants && product.color_variants.length > 0 && (
                <div style={{ marginBottom: 24 }}>
                  <p style={{
                    fontFamily: 'var(--font-body)',
                    fontSize: 11, fontWeight: 600,
                    letterSpacing: '0.1em', textTransform: 'uppercase',
                    color: 'var(--on-surface-variant)', marginBottom: 12,
                  }}>
                    Colour — <span style={{ color: 'var(--primary)', textTransform: 'none', letterSpacing: 0 }}>
                      {product.color_variants[selectedColor].name}
                    </span>
                  </p>
                  <div style={{ display: 'flex', gap: 8 }}>
                    {product.color_variants.map((c, i) => (
                      <button
                        key={i}
                        onClick={() => setSelectedColor(i)}
                        title={c.name}
                        style={{
                          width: 26, height: 26,
                          backgroundColor: c.hex,
                          border: selectedColor === i
                            ? '2px solid var(--primary)'
                            : '1px solid rgba(4,22,39,0.15)',
                          cursor: 'pointer',
                          outline: selectedColor === i
                            ? '2px solid var(--surface-white)'
                            : 'none',
                          outlineOffset: -4,
                          transition: 'all 0.15s',
                        }}
                      />
                    ))}
                  </div>
                </div>
              )}

              {/* Quantity */}
              <div style={{ marginBottom: 28 }}>
                <p style={{
                  fontFamily: 'var(--font-body)',
                  fontSize: 11, fontWeight: 600,
                  letterSpacing: '0.1em', textTransform: 'uppercase',
                  color: 'var(--on-surface-variant)', marginBottom: 12,
                }}>Quantity</p>
                <div style={{ display: 'inline-flex', alignItems: 'center' }}>
                  {[
                    { Icon: Minus, action: () => setQty(q => Math.max(1, q - 1)) },
                    null,
                    { Icon: Plus, action: () => setQty(q => Math.min(product.stock_count, q + 1)) },
                  ].map((item, i) =>
                    item === null ? (
                      <div key="val" style={{
                        width: 48, height: 38,
                        border: '1px solid rgba(4,22,39,0.15)',
                        borderLeft: 'none', borderRight: 'none',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        fontFamily: 'var(--font-body)',
                        fontSize: 14, fontWeight: 600, color: 'var(--primary)',
                      }}>{qty}</div>
                    ) : (
                      <button
                        key={i}
                        onClick={item.action}
                        style={{
                          width: 38, height: 38,
                          border: '1px solid rgba(4,22,39,0.15)',
                          backgroundColor: 'var(--surface-low)',
                          cursor: 'pointer',
                          display: 'flex', alignItems: 'center', justifyContent: 'center',
                        }}
                      >
                        <item.Icon size={13} color="var(--primary)" />
                      </button>
                    )
                  )}
                </div>
              </div>

              {/* CTA */}
              <motion.button
                whileHover={{ opacity: 0.88 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleAdd}
                disabled={!product.is_available}
                style={{
                  width: '100%', padding: '15px',
                  backgroundColor: product.is_available ? 'var(--primary)' : 'var(--surface-high)',
                  color: product.is_available ? 'white' : 'var(--outline)',
                  border: 'none', cursor: product.is_available ? 'pointer' : 'not-allowed',
                  fontFamily: 'var(--font-body)',
                  fontSize: 12, fontWeight: 600,
                  letterSpacing: '0.1em', textTransform: 'uppercase',
                  display: 'flex', alignItems: 'center',
                  justifyContent: 'center', gap: 10,
                  marginBottom: 16,
                }}
              >
                <ShoppingBag size={15} />
                {product.is_available ? 'Add to Cart' : 'Out of Stock'}
              </motion.button>

              {/* Product details */}
              <div style={{ marginTop: 24 }}>
                {[
                  { label: 'Materials', value: product.materials },
                  { label: 'Dimensions', value: product.dimensions },
                  { label: 'Care', value: product.care_instructions },
                ].filter(d => d.value).map(d => (
                  <div key={d.label} style={{
                    display: 'flex', gap: 16,
                    padding: '10px 0',
                    borderBottom: '1px solid rgba(4,22,39,0.06)',
                  }}>
                    <span className="label-caps" style={{ minWidth: 80 }}>{d.label}</span>
                    <span style={{
                      fontFamily: 'var(--font-body)',
                      fontSize: 13, color: 'var(--on-surface-variant)',
                      lineHeight: 1.5,
                    }}>{d.value}</span>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
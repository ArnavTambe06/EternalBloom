import { useState } from 'react'
import { motion } from 'framer-motion'
import { ShoppingBag, Eye } from 'lucide-react'
import type { Product } from '@/types'
import { useCartStore } from '@/store/cartStore'

interface Props { product: Product; onViewDetails: (p: Product) => void }

export function ProductCard({ product, onViewDetails }: Props) {
  const { addItem } = useCartStore()
  const [hovered, setHovered] = useState(false)
  const [added, setAdded] = useState(false)

  const discount = product.compare_price
    ? Math.round(((product.compare_price - product.price) / product.compare_price) * 100)
    : null

  const handleAdd = (e: React.MouseEvent) => {
    e.stopPropagation()
    if (!product.is_available) return
    addItem(product)
    setAdded(true)
    setTimeout(() => setAdded(false), 1800)
  }

  return (
<article
  onMouseEnter={() => setHovered(true)}
  onMouseLeave={() => setHovered(false)}
  style={{
    cursor: 'pointer',
    borderRadius: 20,
    overflow: 'hidden',
    border: '1px solid rgba(255,133,208,0.2)',
    backgroundColor: 'rgba(255,255,255,0.88)',
    backdropFilter: 'blur(16px)',
    WebkitBackdropFilter: 'blur(16px)',
    // CSS transition instead of Framer Motion
    transform: hovered ? 'translateY(-6px)' : 'translateY(0)',
    boxShadow: hovered
      ? '0 20px 48px rgba(255,133,208,0.22)'
      : '0 4px 20px rgba(255,133,208,0.08)',
    transition: 'transform 0.3s cubic-bezier(0.34,1.56,0.64,1), box-shadow 0.3s ease',
    // Remove initial/whileInView from motion — use CSS instead:
    opacity: 1,
  }}
>
      {/* Image */}
      <div
        onClick={() => onViewDetails(product)}
        style={{
          aspectRatio: '3/4', overflow: 'hidden',
          position: 'relative',
          backgroundColor: 'rgba(255,200,162,0.08)',
        }}
      >
        <motion.img
          src={product.images?.[0] || ''}
          alt={product.name}
          loading="lazy"
          style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover' }}
          animate={{
            scale: hovered && product.images?.length > 1 ? 0 : hovered ? 1.06 : 1,
            opacity: hovered && product.images?.length > 1 ? 0 : 1,
          }}
          transition={{ duration: 0.5 }}
        />
        {product.images?.length > 1 && (
          <motion.img
            src={product.images[1]}
            alt={product.name}
            loading="lazy"
            style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover' }}
            animate={{ opacity: hovered ? 1 : 0, scale: hovered ? 1.04 : 1.08 }}
            transition={{ duration: 0.5 }}
          />
        )}

        {/* Gradient overlay on hover */}
        <motion.div
          animate={{ opacity: hovered ? 1 : 0 }}
          style={{
            position: 'absolute', inset: 0,
            background: 'linear-gradient(to top, rgba(28,15,10,0.5) 0%, transparent 60%)',
          }}
        />

        {/* Badges */}
        {discount && (
          <div style={{
            position: 'absolute', top: 12, left: 12,
            background: 'var(--grad)', borderRadius: 999,
            padding: '3px 10px', fontFamily: 'var(--sans)',
            fontSize: 10, fontWeight: 800, color: 'var(--ink)',
          }}>{discount}% OFF</div>
        )}
        {!product.is_available && (
          <div style={{
            position: 'absolute', inset: 0,
            backgroundColor: 'rgba(255,252,250,0.7)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <span className="glass" style={{
              padding: '6px 16px', borderRadius: 999,
              fontFamily: 'var(--sans)', fontSize: 11,
              fontWeight: 700, color: 'var(--ink-2)',
              letterSpacing: '0.1em',
            }}>Sold Out</span>
          </div>
        )}

        {/* Bottom actions */}
        <motion.div
          animate={{ opacity: hovered ? 1 : 0, y: hovered ? 0 : 10 }}
          transition={{ duration: 0.22 }}
          style={{
            position: 'absolute', bottom: 10, left: 10, right: 10,
            display: 'flex', gap: 8,
          }}
        >
          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={e => { e.stopPropagation(); onViewDetails(product) }}
            style={{
              flex: 1, padding: '9px',
              background: 'rgba(255,252,250,0.9)',
              backdropFilter: 'blur(10px)',
              border: 'none', borderRadius: 12,
              fontFamily: 'var(--sans)', fontSize: 12, fontWeight: 600,
              color: 'var(--ink)', cursor: 'pointer',
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 5,
            }}
          ><Eye size={13} strokeWidth={2} /> View</motion.button>
          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={handleAdd}
            disabled={!product.is_available}
            style={{
              flex: 1, padding: '9px',
              background: added ? 'rgba(90,140,110,0.9)' : 'var(--grad)',
              backdropFilter: 'blur(10px)',
              border: 'none', borderRadius: 12,
              fontFamily: 'var(--sans)', fontSize: 12, fontWeight: 600,
              color: 'var(--ink)', cursor: 'pointer',
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 5,
              transition: 'background 0.3s',
            }}
          >
            {added ? <>✓ Added</> : <><ShoppingBag size={13} strokeWidth={2} /> Add</>}
          </motion.button>
        </motion.div>
      </div>

      {/* Info */}
      <div onClick={() => onViewDetails(product)} style={{ padding: '14px 16px 16px' }}>
        <p className="label" style={{ marginBottom: 5, color: 'var(--accent)' }}>
          {product.category?.name}
        </p>
        <p style={{
          fontFamily: 'var(--serif)', fontSize: 15,
          fontWeight: 500, color: 'var(--ink)',
          lineHeight: 1.35, marginBottom: 8, letterSpacing: '-0.01em',
        }}>{product.name}</p>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <span style={{ fontFamily: 'var(--sans)', fontSize: 15, fontWeight: 700, color: 'var(--ink)' }}>
            ₹{product.price}
          </span>
          {product.compare_price && (
            <span style={{ fontFamily: 'var(--sans)', fontSize: 13, color: 'var(--ink-3)', textDecoration: 'line-through' }}>
              ₹{product.compare_price}
            </span>
          )}
        </div>
      </div>
    </article>
  )
}
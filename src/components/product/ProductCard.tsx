import { motion } from 'framer-motion'
import { ShoppingBag } from 'lucide-react'
import type { Product } from '@/types'
import { useCartStore } from '@/store/cartStore'

interface Props {
  product: Product
  onViewDetails: (p: Product) => void
}

export function ProductCard({ product, onViewDetails }: Props) {
  const { addItem } = useCartStore()
  const discount = product.compare_price
    ? Math.round(((product.compare_price - product.price) / product.compare_price) * 100)
    : null

  return (
    <motion.article
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-32px' }}
      style={{ cursor: 'pointer' }}
      className="ambient-hover"
    >
      {/* Image */}
      <div
        onClick={() => onViewDetails(product)}
        style={{
          aspectRatio: '3/4',
          backgroundColor: 'var(--surface-container)',
          overflow: 'hidden',
          position: 'relative',
          marginBottom: 16,
        }}
        className="luxury-border"
      >
        <motion.img
          whileHover={{ scale: 1.06 }}
          transition={{ duration: 0.55 }}
          src={product.images?.[0]}
          alt={product.name}
          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
          loading="lazy"
          onError={e => {
            const el = e.target as HTMLImageElement
            el.parentElement!.style.display = 'flex'
            el.parentElement!.style.alignItems = 'center'
            el.parentElement!.style.justifyContent = 'center'
            el.style.display = 'none'
          }}
        />

        {/* Badges */}
        <div style={{
          position: 'absolute', top: 12, left: 12,
          display: 'flex', flexDirection: 'column', gap: 4,
        }}>
          {discount && (
            <span style={{
              backgroundColor: 'var(--primary-container)',
              color: 'var(--primary-dim)',
              padding: '3px 10px',
              fontFamily: 'var(--font-body)',
              fontSize: 10, fontWeight: 600,
              letterSpacing: '0.08em',
            }}>
              −{discount}%
            </span>
          )}
          {!product.is_available && (
            <span style={{
              backgroundColor: 'var(--surface-high)',
              color: 'var(--outline)',
              padding: '3px 10px',
              fontFamily: 'var(--font-body)',
              fontSize: 10, fontWeight: 600,
              letterSpacing: '0.08em',
            }}>
              SOLD OUT
            </span>
          )}
        </div>

        {/* Quick add — appears on hover */}
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          whileHover={{ opacity: 1, y: 0 }}
          style={{
            position: 'absolute', bottom: 0, left: 0, right: 0,
            backgroundColor: 'rgba(4,22,39,0.88)',
            padding: '12px 16px',
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            opacity: 0,
          }}
          className="quick-add"
        >
          <span style={{
            fontFamily: 'var(--font-body)',
            fontSize: 11, fontWeight: 600,
            letterSpacing: '0.08em',
            textTransform: 'uppercase',
            color: 'white',
          }}>Quick View</span>
          <button
            onClick={e => {
              e.stopPropagation()
              addItem(product)
            }}
            disabled={!product.is_available}
            style={{
              display: 'flex', alignItems: 'center', gap: 6,
              backgroundColor: 'white',
              color: 'var(--primary)',
              padding: '6px 14px',
              fontFamily: 'var(--font-body)',
              fontSize: 11, fontWeight: 600,
              letterSpacing: '0.06em',
              cursor: 'pointer',
              border: 'none',
            }}
          >
            <ShoppingBag size={12} /> Add
          </button>
        </motion.div>
      </div>

      {/* Info */}
      <div onClick={() => onViewDetails(product)}>
        <p className="label-caps" style={{ marginBottom: 6, color: 'var(--secondary)' }}>
          {product.category?.name}
        </p>
        <h3 style={{
          fontFamily: 'var(--font-display)',
          fontSize: 16, fontWeight: 600,
          color: 'var(--primary)',
          marginBottom: 8,
          lineHeight: 1.3,
          letterSpacing: '-0.01em',
        }}>
          {product.name}
        </h3>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <span style={{
            fontFamily: 'var(--font-body)',
            fontSize: 15, fontWeight: 600,
            color: 'var(--primary)',
          }}>₹{product.price}</span>
          {product.compare_price && (
            <span style={{
              fontFamily: 'var(--font-body)',
              fontSize: 13, color: 'var(--outline)',
              textDecoration: 'line-through',
            }}>₹{product.compare_price}</span>
          )}
        </div>
      </div>
    </motion.article>
  )
}
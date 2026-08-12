import { useState } from 'react'
import { motion } from 'framer-motion'
import { ShoppingBag, Eye } from 'lucide-react'
import type { Product } from '@/types'
import { useCartStore } from '@/store/cartStore'

interface Props {
  product: Product
  onViewDetails: (p: Product) => void
}

export function ProductCard({ product, onViewDetails }: Props) {
  const { addItem } = useCartStore()
  const [hovered, setHovered] = useState(false)
  const discount = product.compare_price
    ? Math.round(((product.compare_price - product.price) / product.compare_price) * 100)
    : null

  return (
    <motion.article
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-32px' }}
      onHoverStart={() => setHovered(true)}
      onHoverEnd={() => setHovered(false)}
      whileHover={{ y: -4 }}
      style={{
        backgroundColor: 'var(--surface-white)',
        borderRadius: 18,
        overflow: 'hidden',
        border: '1px solid var(--border)',
        cursor: 'pointer',
        boxShadow: '0 2px 12px rgba(196,82,106,0.06)',
        transition: 'box-shadow 0.3s',
      }}
    >
      {/* Image */}
      <div
        onClick={() => onViewDetails(product)}
        style={{
          aspectRatio: '4/5',
          backgroundColor: 'var(--surface-section)',
          overflow: 'hidden',
          position: 'relative',
        }}
      >
        {/* Primary image */}
        <motion.img
          src={product.images?.[0] || ''}
          alt={product.name}
          style={{
            width: '100%', height: '100%', objectFit: 'cover',
            position: 'absolute', inset: 0,
          }}
          animate={{ opacity: hovered && product.images?.length > 1 ? 0 : 1 }}
          transition={{ duration: 0.3 }}
          loading="lazy"
        />
        {/* Hover image (second image) */}
        {product.images?.length > 1 && (
          <motion.img
            src={product.images[1]}
            alt={product.name}
            style={{
              width: '100%', height: '100%', objectFit: 'cover',
              position: 'absolute', inset: 0,
            }}
            animate={{ opacity: hovered ? 1 : 0 }}
            transition={{ duration: 0.3 }}
            loading="lazy"
          />
        )}

        {/* Badges */}
        <div style={{
          position: 'absolute', top: 10, left: 10,
          display: 'flex', flexDirection: 'column', gap: 4,
        }}>
          {discount && (
            <span style={{
              background: 'var(--primary-gradient)',
              color: 'var(--on-surface)',
              padding: '3px 10px',
              borderRadius: 999,
              fontFamily: 'var(--font-body)',
              fontSize: 10, fontWeight: 700,
            }}>
              {discount}% OFF
            </span>
          )}
          {!product.is_available && (
            <span style={{
              backgroundColor: 'rgba(44,26,32,0.7)',
              color: 'white',
              padding: '3px 10px',
              borderRadius: 999,
              fontFamily: 'var(--font-body)',
              fontSize: 10, fontWeight: 600,
            }}>
              Sold Out
            </span>
          )}
        </div>

        {/* Quick actions overlay */}
        <motion.div
          animate={{ opacity: hovered ? 1 : 0, y: hovered ? 0 : 8 }}
          transition={{ duration: 0.25 }}
          style={{
            position: 'absolute', bottom: 10,
            left: 10, right: 10,
            display: 'flex', gap: 8,
          }}
        >
          <motion.button
            whileTap={{ scale: 0.96 }}
            onClick={e => { e.stopPropagation(); onViewDetails(product) }}
            style={{
              flex: 1, padding: '9px',
              backgroundColor: 'rgba(255,255,255,0.95)',
              border: 'none', borderRadius: 10,
              fontFamily: 'var(--font-body)',
              fontSize: 12, fontWeight: 600,
              color: 'var(--on-surface)',
              cursor: 'pointer',
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 5,
              backdropFilter: 'blur(8px)',
            }}
          >
            <Eye size={13} /> View
          </motion.button>
          <motion.button
            whileTap={{ scale: 0.96 }}
            onClick={e => { e.stopPropagation(); addItem(product) }}
            disabled={!product.is_available}
            style={{
              flex: 1, padding: '9px',
              background: 'linear-gradient(135deg, var(--primary), var(--primary-dark))',
              border: 'none', borderRadius: 10,
              color: 'white',
              fontFamily: 'var(--font-body)',
              fontSize: 12, fontWeight: 600,
              cursor: product.is_available ? 'pointer' : 'not-allowed',
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 5,
              opacity: product.is_available ? 1 : 0.5,
            }}
          >
            <ShoppingBag size={13} /> Add
          </motion.button>
        </motion.div>
      </div>

      {/* Info */}
      <div
        onClick={() => onViewDetails(product)}
        style={{ padding: '14px 16px 16px' }}
      >
        <p style={{
          fontFamily: 'var(--font-body)',
          fontSize: 11, fontWeight: 600,
          color: 'var(--primary)',
          letterSpacing: '0.06em',
          textTransform: 'uppercase',
          marginBottom: 5,
        }}>
          {product.category?.name}
        </p>
        <h3 style={{
          fontFamily: 'var(--font-display)',
          fontSize: 15, fontWeight: 600,
          color: 'var(--on-surface)',
          marginBottom: 8, lineHeight: 1.35,
        }}>
          {product.name}
        </h3>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <span style={{
            fontFamily: 'var(--font-body)',
            fontSize: 16, fontWeight: 700,
            color: 'var(--primary)',
          }}>₹{product.price}</span>
          {product.compare_price && (
            <span style={{
              fontFamily: 'var(--font-body)',
              fontSize: 13, color: 'var(--on-surface-faint)',
              textDecoration: 'line-through',
            }}>₹{product.compare_price}</span>
          )}
        </div>
      </div>
    </motion.article>
  )
}
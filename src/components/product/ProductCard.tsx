import { useState } from 'react'
import { motion } from 'framer-motion'
import { ShoppingBag } from 'lucide-react'
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
  const hasVariants = Boolean(product.variants?.length || product.color_variants?.length)

  const handleAdd = (e: React.MouseEvent) => {
    e.stopPropagation()
    if (!product.is_available) return
    if (hasVariants) {
      onViewDetails(product)
      return
    }
    addItem(product)
    setAdded(true)
    setTimeout(() => setAdded(false), 1800)
  }

  return (
    <div
      onClick={() => onViewDetails(product)}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        cursor: 'pointer',
        backgroundColor: 'white',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Image — square crop like pipecleanerflorals */}
      <div style={{
        position: 'relative',
        aspectRatio: '1/1',
        overflow: 'hidden',
        backgroundColor: '#FBF5F0',
      }}>
        {/* Primary image */}
        <img
          src={product.images?.[0] || ''}
          alt={product.name}
          loading="lazy"
          style={{
            position: 'absolute', inset: 0,
            width: '100%', height: '100%',
            objectFit: 'cover',
            transform: hovered && product.images?.length > 1
              ? 'scale(0)' : hovered ? 'scale(1.05)' : 'scale(1)',
            opacity: hovered && product.images?.length > 1 ? 0 : 1,
            transition: 'all 0.45s ease',
          }}
        />
        {/* Second image */}
        {product.images?.length > 1 && (
          <img
            src={product.images[1]}
            alt={product.name}
            loading="lazy"
            style={{
              position: 'absolute', inset: 0,
              width: '100%', height: '100%',
              objectFit: 'cover',
              opacity: hovered ? 1 : 0,
              transform: hovered ? 'scale(1.03)' : 'scale(1.06)',
              transition: 'all 0.45s ease',
            }}
          />
        )}

        {/* Sold out overlay */}
        {!product.is_available && (
          <div style={{
            position: 'absolute', inset: 0,
            backgroundColor: 'rgba(255,255,255,0.5)',
            display: 'flex', alignItems: 'flex-end',
            padding: '12px',
          }}>
            <span style={{
              backgroundColor: '#2D7A4F', color: 'white',
              fontFamily: 'DM Sans, sans-serif',
              fontSize: 11, fontWeight: 700,
              padding: '4px 12px', borderRadius: 4,
              letterSpacing: '0.05em',
            }}>Sold out</span>
          </div>
        )}

        {/* Discount badge */}
        {discount && product.is_available && (
          <div style={{
            position: 'absolute', top: 10, left: 10,
            background: 'linear-gradient(135deg,#FF85D0,#FFC8A2)',
            padding: '3px 10px', borderRadius: 4,
            fontFamily: 'DM Sans, sans-serif',
            fontSize: 10, fontWeight: 800, color: '#1C0F0A',
          }}>{discount}% OFF</div>
        )}

        {/* Quick add — appears on hover */}
        <motion.button
          animate={{ opacity: hovered && product.is_available ? 1 : 0, y: hovered ? 0 : 6 }}
          transition={{ duration: 0.2 }}
          onClick={handleAdd}
          style={{
            position: 'absolute', bottom: 10, left: 10, right: 10,
            padding: '10px',
            background: added
              ? 'rgba(45,122,79,0.92)'
              : 'rgba(255,255,255,0.92)',
            backdropFilter: 'blur(10px)',
            border: 'none', borderRadius: 8,
            fontFamily: 'DM Sans, sans-serif',
            fontSize: 12, fontWeight: 700,
            color: added ? 'white' : '#1C0F0A',
            cursor: 'pointer',
            display: 'flex', alignItems: 'center',
            justifyContent: 'center', gap: 6,
            transition: 'background 0.3s',
          }}
        >
          <ShoppingBag size={13} strokeWidth={2} />
          {added ? 'Added to bag!' : hasVariants ? 'Choose options' : 'Add to bag'}
        </motion.button>
      </div>

      {/* Info — clean like pipecleanerflorals */}
      <div style={{ padding: '14px 16px 18px' }}>
        <p style={{
          fontFamily: 'DM Sans, sans-serif',
          fontSize: 14, fontWeight: 400,
          color: '#1C0F0A', marginBottom: 5,
          lineHeight: 1.3,
        }}>{product.name}</p>

        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <span style={{
            fontFamily: 'DM Sans, sans-serif',
            fontSize: 14, fontWeight: 600,
            color: '#1C0F0A',
          }}>
            {product.compare_price ? 'From ' : ''}₹{product.price}
          </span>
          {product.compare_price && (
            <span style={{
              fontFamily: 'DM Sans, sans-serif',
              fontSize: 13, color: '#9C7B6E',
              textDecoration: 'line-through',
            }}>₹{product.compare_price}</span>
          )}
        </div>
      </div>
    </div>
  )
}

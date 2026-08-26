import { useRef } from 'react'
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion'
import { ArrowUpRight, Sparkles } from 'lucide-react'
import type { CSSProperties, MouseEvent } from 'react'
import type { Product } from '@/types'

interface ProductRibbonProps {
  products: Product[]
  loading?: boolean
  onSelect: (product: Product) => void
}

export function ProductRibbon({ products, loading = false, onSelect }: ProductRibbonProps) {
  const stageRef = useRef<HTMLDivElement>(null)
  const pointerX = useMotionValue(0)
  const pointerY = useMotionValue(0)
  const rotateX = useSpring(useTransform(pointerY, [-0.5, 0.5], [5, -5]), { stiffness: 120, damping: 20 })
  const rotateY = useSpring(useTransform(pointerX, [-0.5, 0.5], [-6, 6]), { stiffness: 120, damping: 20 })

  const handleMouseMove = (event: MouseEvent<HTMLDivElement>) => {
    const bounds = stageRef.current?.getBoundingClientRect()
    if (!bounds) return
    pointerX.set((event.clientX - bounds.left) / bounds.width - 0.5)
    pointerY.set((event.clientY - bounds.top) / bounds.height - 0.5)
  }

  const resetPointer = () => {
    pointerX.set(0)
    pointerY.set(0)
  }

  if (loading) {
    return (
      <div className="product-ribbon product-ribbon--loading" aria-label="Loading products">
        <div className="product-ribbon__loading-panel" />
        <div className="product-ribbon__loading-panel product-ribbon__loading-panel--two" />
        <div className="product-ribbon__loading-panel product-ribbon__loading-panel--three" />
      </div>
    )
  }

  if (products.length === 0) {
    return (
      <div className="product-ribbon product-ribbon--empty">
        <Sparkles size={18} />
        <span>New pieces are being stitched now.</span>
      </div>
    )
  }

  const panelCount = Math.min(Math.max(products.length, 6), 12)
  const panels = Array.from({ length: panelCount }, (_, index) => products[index % products.length])

  return (
    <div className="product-ribbon">
      <div
        ref={stageRef}
        className="product-ribbon__stage"
        onMouseMove={handleMouseMove}
        onMouseLeave={resetPointer}
        aria-label="Rotating product gallery"
      >
        <div className="product-ribbon__paper-grid" />
        <div className="product-ribbon__rail" aria-hidden="true" />
        <motion.div className="product-ribbon__tilt" style={{ rotateX, rotateY }}>
          <div className="product-ribbon__orbit">
            {panels.map((product, index) => {
              const style = {
                '--panel-angle': `${(360 / panelCount) * index}deg`,
                '--panel-lift': `${(index - (panelCount - 1) / 2) * 29}px`,
                '--panel-lean': `${index % 2 === 0 ? -2 : 2}deg`,
              } as CSSProperties

              return (
                <button
                  key={`${product.id}-${index}`}
                  type="button"
                  className="product-ribbon__panel"
                  style={style}
                  onClick={() => onSelect(product)}
                  aria-label={`View ${product.name}`}
                >
                  <span className="product-ribbon__panel-index">{String(index + 1).padStart(2, '0')}</span>
                  <div className="product-ribbon__panel-media">
                    {product.images?.[0] ? (
                      <img src={product.images[0]} alt="" loading={index < 3 ? 'eager' : 'lazy'} />
                    ) : (
                      <span>{product.name}</span>
                    )}
                  </div>
                  <span className="product-ribbon__panel-shade" />
                  <span className="product-ribbon__panel-label">
                    <span>{product.category?.name || 'Handmade'}</span>
                    <strong>{product.name}</strong>
                  </span>
                  <span className="product-ribbon__panel-arrow"><ArrowUpRight size={14} /></span>
                </button>
              )
            })}
          </div>
        </motion.div>

        <div className="product-ribbon__stamp" aria-hidden="true">
          <span>ETERNAL BLOOM</span>
          <span>HANDMADE SERIES / 2026</span>
        </div>
        <div className="product-ribbon__hint" aria-hidden="true">Hover to pause · click to discover</div>
      </div>
    </div>
  )
}

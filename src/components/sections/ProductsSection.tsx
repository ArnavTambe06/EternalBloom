import { useState, useEffect } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { getProducts, getCategories } from '@/services/products'
import { ProductCard } from '@/components/product/ProductCard'
import { ProductModal } from '@/components/product/ProductModal'
import type { Product, Category } from '@/types'

export function ProductsSection() {
  const [products, setProducts] = useState<Product[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [selected, setSelected] = useState<Product | null>(null)
  const [activeCategory, setActiveCategory] = useState('all')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    Promise.all([getProducts(), getCategories()]).then(([prods, cats]) => {
      setProducts(prods)
      setCategories(cats)
      setLoading(false)
    })
  }, [])

  const filtered = activeCategory === 'all'
    ? products.filter(product => product.is_featured)
    : products.filter(p => p.category?.slug === activeCategory)

  const emptyTitle = products.length === 0
    ? 'Products coming soon'
    : activeCategory === 'all'
      ? 'No featured products yet'
      : 'No products in this category'

  return (
    <section id="products" style={{
      backgroundColor: '#FAFAFA',
      position: 'relative', zIndex: 1,
    }}>
      {/* Section header + filter */}
      <div style={{
        padding: '40px var(--px) 24px',
        maxWidth: 1200, margin: '0 auto',
      }}>
        <div style={{
          display: 'flex', alignItems: 'center',
          justifyContent: 'space-between', marginBottom: 20,
          flexWrap: 'wrap', gap: 16,
        }}>
          <div>
            <p style={{
              fontFamily: 'DM Sans, sans-serif', fontSize: 11,
              fontWeight: 700, letterSpacing: '0.15em',
              textTransform: 'uppercase', color: '#9C7B6E', marginBottom: 6,
            }}>Shop All</p>
            <h2 style={{
              fontFamily: 'Playfair Display, serif',
              fontSize: 'clamp(24px,3vw,34px)',
              fontWeight: 700, color: '#1C0F0A',
              letterSpacing: '-0.02em',
            }}>Handpicked for you</h2>
          </div>
          <p style={{
            fontFamily: 'DM Sans, sans-serif',
            fontSize: 13, color: '#9C7B6E',
          }}>
            {loading ? '' : `${filtered.length} products`}
          </p>
        </div>

        {/* Category filter — horizontal scroll strip */}
        {!loading && categories.length > 0 && (
          <div className="cat-strip">
            {[{ name: 'All', slug: 'all' }, ...categories].map(cat => (
              <motion.button
                key={cat.slug}
                whileTap={{ scale: 0.95 }}
                onClick={() => setActiveCategory(cat.slug)}
                style={{
                  padding: '7px 18px', borderRadius: 999, flexShrink: 0,
                  background: activeCategory === cat.slug
                    ? 'linear-gradient(135deg,#FF85D0,#FFC8A2)'
                    : 'white',
                  border: `1.5px solid ${activeCategory === cat.slug
                    ? 'transparent' : 'rgba(255,133,208,0.25)'}`,
                  fontFamily: 'DM Sans, sans-serif', fontSize: 13,
                  fontWeight: activeCategory === cat.slug ? 700 : 400,
                  color: '#1C0F0A', cursor: 'pointer',
                  transition: 'all 0.2s',
                  whiteSpace: 'nowrap',
                  boxShadow: activeCategory === cat.slug
                    ? '0 4px 12px rgba(255,133,208,0.25)' : 'none',
                }}
              >{cat.name}</motion.button>
            ))}
          </div>
        )}
      </div>

      {/* Product grid — pipecleanerflorals style */}
      {loading ? (
        <div style={{
          display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 18,
          maxWidth: 1200, margin: '0 auto', padding: '0 var(--px) 48px',
        }} className="product-grid-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} style={{
              aspectRatio: '4/5', backgroundColor: '#F0E8E8',
              animation: 'pulse 1.5s ease infinite',
            }} />
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <div style={{
          textAlign: 'center', padding: '80px 48px',
          maxWidth: 1200, margin: '0 auto',
        }}>
          <p style={{
            fontFamily: 'Playfair Display, serif',
            fontSize: 20, color: '#1C0F0A', marginBottom: 8,
          }}>
            {emptyTitle}
          </p>
          <p style={{ fontFamily: 'DM Sans, sans-serif', fontSize: 14, color: '#9C7B6E' }}>
            {products.length === 0
              ? 'New pieces are being crafted — check back shortly.'
              : activeCategory === 'all'
                ? 'Featured products will appear here once they are selected by the admin.'
                : 'Try selecting a different category.'}
          </p>
        </div>
      ) : (
        <motion.div
          layout
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(3, 1fr)',
            gap: 18,
            maxWidth: 1200, margin: '0 auto', padding: '0 var(--px) 48px',
          }}
          className="product-grid-3"
        >
          <AnimatePresence>
            {filtered.map((product) => (
              <motion.div
                key={product.id}
                layout
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                <ProductCard product={product} onViewDetails={setSelected} />
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
      )}

      <ProductModal product={selected} onClose={() => setSelected(null)} />
      <style>{`@keyframes pulse { 0%,100%{opacity:1} 50%{opacity:0.45} }`}</style>
    </section>
  )
}

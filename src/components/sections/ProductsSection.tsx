import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { mockProducts } from '@/lib/mockData'
import { ProductCard } from '@/components/product/ProductCard'
import { ProductModal } from '@/components/product/ProductModal'
import { CATEGORIES } from '@/lib/constants'
import type { Product } from '@/types'

export function ProductsSection() {
  const [selected, setSelected] = useState<Product | null>(null)
  const [activeCategory, setActiveCategory] = useState('all')

  const filtered = activeCategory === 'all'
    ? mockProducts
    : mockProducts.filter(p => p.category?.slug === activeCategory)

  const filters = [
    { label: 'All', value: 'all' },
    ...CATEGORIES.map(c => ({ label: c.name, value: c.slug })),
  ]

  return (
    <section id="products" style={{
      backgroundColor: 'var(--surface)',
      padding: 'var(--section-gap) 0',
    }}>
      <div className="container">

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          style={{ textAlign: 'center', marginBottom: 40 }}
        >
          <p className="label-caps" style={{ marginBottom: 12 }}>The Collection</p>
          <h2 style={{
            fontFamily: 'var(--font-display)',
            fontSize: 'clamp(28px, 4vw, 42px)',
            fontWeight: 700, color: 'var(--on-surface)',
            marginBottom: 12,
          }}>Handpicked for You</h2>
          <p style={{
            fontFamily: 'var(--font-body)',
            fontSize: 16, color: 'var(--on-surface-muted)',
            maxWidth: 420, margin: '0 auto',
          }}>
            Every item is made to order — no two pieces are exactly alike.
          </p>
        </motion.div>

        {/* Filter tabs */}
        <div style={{
          display: 'flex', gap: 8, flexWrap: 'wrap',
          justifyContent: 'center', marginBottom: 48,
        }}>
          {filters.map(f => (
            <motion.button
              key={f.value}
              whileTap={{ scale: 0.96 }}
              onClick={() => setActiveCategory(f.value)}
              style={{
                padding: '9px 20px',
                borderRadius: 999,
                border: `1.5px solid ${activeCategory === f.value
                  ? 'var(--primary)' : 'var(--border)'}`,
                backgroundColor: activeCategory === f.value
                  ? 'var(--primary)' : 'var(--surface-white)',
                color: activeCategory === f.value
                  ? 'white' : 'var(--on-surface-muted)',
                fontFamily: 'var(--font-body)',
                fontSize: 13, fontWeight: 500,
                cursor: 'pointer', transition: 'all 0.2s',
                whiteSpace: 'nowrap',
              }}
            >
              {f.label}
            </motion.button>
          ))}
        </div>

        {/* Grid */}
        <motion.div
          layout
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(4, 1fr)',
            gap: 20,
          }}
          className="products-grid"
        >
          <AnimatePresence>
            {filtered.map((product, i) => (
              <motion.div
                key={product.id}
                layout
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ delay: i * 0.04 }}
              >
                <ProductCard product={product} onViewDetails={setSelected} />
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>

        {filtered.length === 0 && (
          <div style={{
            textAlign: 'center', padding: '80px 0',
            color: 'var(--on-surface-muted)',
            fontFamily: 'var(--font-body)', fontSize: 15,
          }}>
            No products in this category yet — check back soon! 🌸
          </div>
        )}
      </div>

      <ProductModal product={selected} onClose={() => setSelected(null)} />
    </section>
  )
}
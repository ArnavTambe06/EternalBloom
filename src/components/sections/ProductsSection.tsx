import { useState } from 'react'
import { motion } from 'framer-motion'
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
      backgroundColor: 'var(--surface-low)',
      paddingTop: 'var(--space-2xl)',
      paddingBottom: 'var(--space-2xl)',
    }}>
      <div className="container">

        {/* Header */}
        <div style={{
          display: 'flex', alignItems: 'flex-end',
          justifyContent: 'space-between',
          marginBottom: 48,
          paddingBottom: 24,
          borderBottom: '1px solid rgba(4,22,39,0.08)',
        }}>
          <div>
            <motion.p
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              className="label-caps"
              style={{ marginBottom: 10 }}
            >The Collection</motion.p>
            <motion.h2
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              style={{
                fontFamily: 'var(--font-display)',
                fontSize: 'clamp(26px, 3vw, 38px)',
                fontWeight: 600,
                color: 'var(--primary)',
                letterSpacing: '-0.02em',
              }}
            >Handpicked for You</motion.h2>
          </div>
          <p style={{
            fontFamily: 'var(--font-body)',
            fontSize: 14, color: 'var(--on-surface-variant)',
            maxWidth: 280, textAlign: 'right', lineHeight: 1.5,
          }} className="hidden md:block">
            Every piece is made to order — no two are exactly alike.
          </p>
        </div>

        {/* Filter pills */}
        <div style={{
          display: 'flex', gap: 8, flexWrap: 'wrap',
          marginBottom: 48, overflowX: 'auto',
        }}>
          {filters.map(f => (
            <motion.button
              key={f.value}
              whileTap={{ scale: 0.97 }}
              onClick={() => setActiveCategory(f.value)}
              style={{
                padding: '8px 18px',
                backgroundColor: activeCategory === f.value
                  ? 'var(--primary)' : 'transparent',
                color: activeCategory === f.value
                  ? 'white' : 'var(--on-surface-variant)',
                border: `1px solid ${activeCategory === f.value
                  ? 'var(--primary)' : 'rgba(4,22,39,0.15)'}`,
                fontFamily: 'var(--font-body)',
                fontSize: 11, fontWeight: 600,
                letterSpacing: '0.08em',
                textTransform: 'uppercase',
                cursor: 'pointer',
                transition: 'all 0.2s',
                whiteSpace: 'nowrap',
              }}
            >
              {f.label}
            </motion.button>
          ))}
        </div>

        {/* Product grid */}
        <motion.div
          layout
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(4, 1fr)',
            gap: 24,
            rowGap: 48,
          }}
          className="products-grid"
        >
          {filtered.map((product, i) => (
            <motion.div
              key={product.id}
              layout
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: i * 0.04 }}
            >
              <ProductCard product={product} onViewDetails={setSelected} />
            </motion.div>
          ))}
        </motion.div>

        {filtered.length === 0 && (
          <div style={{
            textAlign: 'center', padding: '80px 0',
            color: 'var(--on-surface-variant)',
            fontFamily: 'var(--font-body)', fontSize: 15,
          }}>
            No products in this category yet.
          </div>
        )}
      </div>

      <ProductModal product={selected} onClose={() => setSelected(null)} />
    </section>
  )
}
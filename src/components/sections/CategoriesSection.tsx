import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { ArrowRight } from 'lucide-react'
import { CATEGORIES } from '@/lib/constants'

const categoryImages: Record<string, string> = {
  'keychains':           'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&q=80',
  'desk-buddies':        'https://images.unsplash.com/photo-1487530811015-780680fb1f4e?w=400&q=80',
  'flower-cards':        'https://images.unsplash.com/photo-1518709766631-a6a7f45921c3?w=400&q=80',
  'hair-accessories':    'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=400&q=80',
  'bouquets':            'https://images.unsplash.com/photo-1490750967868-88df5691cc2c?w=400&q=80',
  'magnets':             'https://images.unsplash.com/photo-1606760227091-3dd870d97f1d?w=400&q=80',
  'charms':              'https://images.unsplash.com/photo-1611604548018-d56bbd85d681?w=400&q=80',
  'lamps':               'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&q=80',
  'everlasting-flowers': 'https://images.unsplash.com/photo-1487530811015-780680fb1f4e?w=400&q=80',
  'garlands':            'https://images.unsplash.com/photo-1490750967868-88df5691cc2c?w=400&q=80',
}

export function CategoriesSection() {
  return (
    <section id="categories" style={{
      background: 'linear-gradient(180deg, rgba(255,133,208,0.05) 0%, rgba(255,230,128,0.05) 100%)',
      backgroundColor: 'var(--surface)',
      padding: 'var(--section-gap) 0',
    }}>
      <div className="container">

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          style={{ textAlign: 'center', marginBottom: 48 }}
        >
          <p className="label-caps" style={{ marginBottom: 12 }}>Collections</p>
          <h2 style={{
            fontFamily: 'var(--font-display)',
            fontSize: 'clamp(28px, 4vw, 42px)',
            fontWeight: 700, color: 'var(--on-surface)',
          }}>Shop by Category</h2>
        </motion.div>

        {/* Grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(5, 1fr)',
          gap: 16,
        }} className="category-grid">
          {CATEGORIES.map((cat, i) => (
            <motion.div
              key={cat.slug}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.06 }}
            >
              <Link to={`/categories/${cat.slug}`}>
                <motion.div
                  whileHover={{ y: -6 }}
                  transition={{ type: 'spring', stiffness: 300, damping: 22 }}
                  style={{
                    backgroundColor: 'var(--surface-white)',
                    borderRadius: 20,
                    overflow: 'hidden',
                    border: '1px solid var(--border)',
                    cursor: 'pointer',
                    boxShadow: '0 2px 12px rgba(196,82,106,0.06)',
                    transition: 'box-shadow 0.3s',
                  }}
                  onHoverStart={e => {
                    const el = (e.target as HTMLElement).closest('[data-card]') as HTMLElement
                  }}
                >
                  {/* Image */}
                  <div style={{
                    aspectRatio: '1/1',
                    overflow: 'hidden',
                    background: 'linear-gradient(180deg, rgba(255,133,208,0.05) 0%, rgba(255,230,128,0.05) 100%)',
                    backgroundColor: 'var(--surface)',
                  }}>
                    <motion.img
                      whileHover={{ scale: 1.08 }}
                      transition={{ duration: 0.5 }}
                      src={categoryImages[cat.slug]}
                      alt={cat.name}
                      style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                    />
                  </div>

                  {/* Label */}
                  <div style={{ padding: '14px 12px 16px' }}>
                    <p style={{
                      fontFamily: 'var(--font-body)',
                      fontSize: 13, fontWeight: 700,
                      color: 'var(--on-surface)',
                      marginBottom: 4,
                      textAlign: 'center',
                    }}>{cat.name}</p>
                    <p style={{
                      fontFamily: 'var(--font-body)',
                      fontSize: 11, color: 'var(--on-surface-muted)',
                      textAlign: 'center', lineHeight: 1.4,
                    }}>{cat.tagline}</p>
                  </div>
                </motion.div>
              </Link>
            </motion.div>
          ))}
        </div>

        {/* View all */}
        <div style={{ textAlign: 'center', marginTop: 36 }}>
          <Link to="/#products" style={{
            display: 'inline-flex', alignItems: 'center', gap: 6,
            fontFamily: 'var(--font-body)',
            fontSize: 14, fontWeight: 600,
            color: 'var(--primary)',
          }}>
            View all products <ArrowRight size={14} />
          </Link>
        </div>
      </div>
    </section>
  )
}
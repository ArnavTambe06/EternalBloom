import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { ArrowRight } from 'lucide-react'
import { CATEGORIES } from '@/lib/constants'

const categoryImages: Record<string, string> = {
  'keychains': 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&q=80',
  'desk-buddies': 'https://images.unsplash.com/photo-1487530811015-780680fb1f4e?w=400&q=80',
  'flower-cards': 'https://images.unsplash.com/photo-1518709766631-a6a7f45921c3?w=400&q=80',
  'hair-accessories': 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=400&q=80',
  'bouquets': 'https://images.unsplash.com/photo-1490750967868-88df5691cc2c?w=400&q=80',
  'magnets': 'https://images.unsplash.com/photo-1606760227091-3dd870d97f1d?w=400&q=80',
  'charms': 'https://images.unsplash.com/photo-1611604548018-d56bbd85d681?w=400&q=80',
  'lamps': 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&q=80',
  'everlasting-flowers': 'https://images.unsplash.com/photo-1487530811015-780680fb1f4e?w=400&q=80',
  'garlands': 'https://images.unsplash.com/photo-1490750967868-88df5691cc2c?w=400&q=80',
}

export function CategoriesSection() {
  return (
    <section id="categories" style={{
      backgroundColor: 'var(--surface)',
      paddingTop: 'var(--space-2xl)',
      paddingBottom: 'var(--space-2xl)',
    }}>
      <div className="container">

        {/* Section header */}
        <div style={{
          display: 'flex', alignItems: 'flex-end',
          justifyContent: 'space-between',
          marginBottom: 56,
          paddingBottom: 24,
          borderBottom: '1px solid rgba(4,22,39,0.08)',
        }}>
          <div>
            <motion.p
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              className="label-caps"
              style={{ marginBottom: 12 }}
            >Collections</motion.p>
            <motion.h2
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              style={{
                fontFamily: 'var(--font-display)',
                fontSize: 'clamp(28px, 3vw, 40px)',
                fontWeight: 600, color: 'var(--primary)',
                letterSpacing: '-0.02em',
              }}
            >
              Shop by Category
            </motion.h2>
          </div>
          <Link
            to="/#products"
            style={{
              display: 'inline-flex', alignItems: 'center', gap: 8,
              fontFamily: 'var(--font-body)',
              fontSize: 12, fontWeight: 600,
              letterSpacing: '0.08em',
              textTransform: 'uppercase',
              color: 'var(--secondary)',
              paddingBottom: 2,
              borderBottom: '1.5px solid var(--secondary)',
              whiteSpace: 'nowrap',
            }}
            className="hidden md:flex"
          >
            All Products <ArrowRight size={13} />
          </Link>
        </div>

        {/* Categories grid — editorial style */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(5, 1fr)',
          gap: 12,
        }} className="category-grid">
          {CATEGORIES.map((cat, i) => (
            <motion.div
              key={cat.slug}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.05, duration: 0.4 }}
            >
              <Link to={`/categories/${cat.slug}`} style={{ display: 'block' }}>
                <motion.div
                  whileHover={{ y: -3 }}
                  transition={{ duration: 0.25 }}
                  className="ambient-hover"
                  style={{ cursor: 'pointer' }}
                >
                  {/* Image */}
                  <div style={{
                    aspectRatio: '3/4',
                    backgroundColor: 'var(--surface-container)',
                    overflow: 'hidden',
                    marginBottom: 12,
                  }} className="luxury-border">
                    <motion.img
                      whileHover={{ scale: 1.05 }}
                      transition={{ duration: 0.5 }}
                      src={categoryImages[cat.slug] || ''}
                      alt={cat.name}
                      style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                      onError={e => {
                        (e.target as HTMLImageElement).style.display = 'none'
                      }}
                    />
                  </div>

                  {/* Label */}
                  <p style={{
                    fontFamily: 'var(--font-display)',
                    fontSize: 14, fontWeight: 600,
                    color: 'var(--primary)',
                    marginBottom: 4,
                    letterSpacing: '-0.01em',
                  }}>{cat.name}</p>
                  <p style={{
                    fontFamily: 'var(--font-body)',
                    fontSize: 12,
                    color: 'var(--on-surface-variant)',
                    lineHeight: 1.4,
                  }}>{cat.tagline}</p>
                </motion.div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
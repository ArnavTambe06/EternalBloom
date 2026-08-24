import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { getCategories } from '@/services/products'
import type { Category } from '@/types'

export function CategoriesSection() {
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    getCategories().then(cats => { setCategories(cats); setLoading(false) })
  }, [])

  if (loading || categories.length === 0) return null

  return (
    <section id="categories" style={{
      backgroundColor: 'var(--bg-soft)',
      padding: '80px 0',
      borderTop: '1px solid var(--line)',
      borderBottom: '1px solid var(--line)',
    }}>
      <div className="wrap">

        <div style={{ marginBottom: 40 }}>
          <p style={{
            fontFamily: 'var(--sans)', fontSize: 11,
            fontWeight: 600, letterSpacing: '0.15em',
            textTransform: 'uppercase', color: 'var(--ink-3)',
            marginBottom: 8,
          }}>Browse</p>
          <h2 style={{
            fontFamily: 'var(--serif)',
            fontSize: 'clamp(26px, 3vw, 36px)',
            fontWeight: 600, color: 'var(--ink)',
            letterSpacing: '-0.02em',
          }}>Shop by Collection</h2>
        </div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(5, 1fr)',
          gap: 16,
        }} className="cat-grid">
          {categories.map((cat, i) => (
            <motion.div
              key={cat.id}
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.05 }}
            >
              <Link to={`/categories/${cat.slug}`} style={{ display: 'block' }}>
                <motion.div whileHover={{ y: -3 }} transition={{ duration: 0.2 }}>
                  {/* Image */}
                  <div style={{
                    aspectRatio: '3/4',
                    backgroundColor: 'var(--bg)',
                    overflow: 'hidden',
                    marginBottom: 12,
                    border: '1px solid var(--line)',
                  }}>
                    {cat.image_url ? (
                      <motion.img
                        whileHover={{ scale: 1.05 }}
                        transition={{ duration: 0.45 }}
                        src={cat.image_url}
                        alt={cat.name}
                        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                      />
                    ) : (
                      <div style={{
                        width: '100%', height: '100%',
                        background: 'var(--grad)',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        fontFamily: 'var(--serif)',
                        fontSize: 13, color: 'var(--ink)',
                        textAlign: 'center', padding: 12,
                      }}>{cat.name}</div>
                    )}
                  </div>
                  <p style={{
                    fontFamily: 'var(--sans)',
                    fontSize: 12, fontWeight: 600,
                    color: 'var(--ink)',
                    textAlign: 'center',
                    letterSpacing: '0.02em',
                  }}>{cat.name}</p>
                </motion.div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
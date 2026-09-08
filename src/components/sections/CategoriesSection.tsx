import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { ArrowRight } from 'lucide-react'
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
      padding: '56px 0',
      borderTop: '1px solid rgba(255,133,208,0.12)',
      position: 'relative', zIndex: 1,
      backgroundColor: 'white',
    }}>
      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 var(--px)' }}>

        <div style={{
          display: 'flex', alignItems: 'center',
          justifyContent: 'space-between', marginBottom: 28,
        }}>
          <div>
            <p style={{
              fontFamily: 'DM Sans, sans-serif', fontSize: 11,
              fontWeight: 700, letterSpacing: '0.15em',
              textTransform: 'uppercase', color: '#9C7B6E', marginBottom: 6,
            }}>Browse</p>
            <h2 style={{
              fontFamily: 'Playfair Display, serif',
              fontSize: 'clamp(22px,2.5vw,30px)',
              fontWeight: 700, color: '#1C0F0A',
              letterSpacing: '-0.02em',
            }}>Shop by Collection</h2>
          </div>
          <Link to="/categories" style={{
            display: 'flex', alignItems: 'center', gap: 6,
            fontFamily: 'DM Sans, sans-serif', fontSize: 13,
            fontWeight: 600, color: '#E8609A',
          }}>
            View all <ArrowRight size={14} />
          </Link>
        </div>

        {/* Wide cards — landscape ratio for the Chenille collection */}
        <div className="category-grid" style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(3, 1fr)',
          gap: 16,
        }}>
          {categories.slice(0, 6).map((cat, i) => (
            <motion.div
              key={cat.id}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.07 }}
            >
              <Link to={`/categories/${cat.slug}`} style={{ display: 'block' }}>
                <div
                  style={{
                    borderRadius: 4,
                    overflow: 'hidden',
                    border: '1px solid rgba(28,15,10,0.08)',
                    cursor: 'pointer',
                    transition: 'box-shadow 0.3s ease, transform 0.3s ease',
                  }}
                  onMouseEnter={e => {
                    e.currentTarget.style.boxShadow = '0 8px 32px rgba(255,133,208,0.2)'
                    e.currentTarget.style.transform = 'translateY(-3px)'
                  }}
                  onMouseLeave={e => {
                    e.currentTarget.style.boxShadow = 'none'
                    e.currentTarget.style.transform = 'translateY(0)'
                  }}
                >
                  {/* Image — square collection cover */}
                  <div style={{
                    aspectRatio: '1/1',
                    overflow: 'hidden',
                    backgroundColor: '#FBF5F0',
                  }}>
                    {cat.image_url ? (
                      <img
                        src={cat.image_url}
                        alt={cat.name}
                        style={{
                          width: '100%', height: '100%',
                          objectFit: 'cover',
                          transition: 'transform 0.5s ease',
                        }}
                        onMouseEnter={e => e.currentTarget.style.transform = 'scale(1.05)'}
                        onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'}
                      />
                    ) : (
                      <div style={{
                        width: '100%', height: '100%',
                        background: 'linear-gradient(135deg,rgba(255,133,208,0.1),rgba(255,200,162,0.1))',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                      }}>
                        <p style={{
                          fontFamily: 'Playfair Display, serif',
                          fontSize: 16, color: '#9C7B6E', fontStyle: 'italic',
                        }}>{cat.name}</p>
                      </div>
                    )}
                  </div>

                  {/* Label */}
                  <div style={{
                    padding: '14px 16px',
                    backgroundColor: 'white',
                  }}>
                    <p style={{
                      fontFamily: 'DM Sans, sans-serif',
                      fontSize: 14, fontWeight: 400,
                      color: '#1C0F0A', marginBottom: 4,
                    }}>{cat.name}</p>
                    {cat.description && (
                      <p style={{
                        fontFamily: 'DM Sans, sans-serif',
                        fontSize: 12, color: '#9C7B6E',
                      }}>{cat.description}</p>
                    )}
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

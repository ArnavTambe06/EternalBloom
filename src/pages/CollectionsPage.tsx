import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { ArrowRight } from 'lucide-react'
import { getCategories } from '@/services/products'
import type { Category } from '@/types'

export function CollectionsPage() {
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    getCategories().then(cats => {
      setCategories(cats)
      setLoading(false)
    })
  }, [])

  return (
    <div style={{ position: 'relative', zIndex: 1 }}>
      {/* Header */}
      <div style={{ padding: '80px 0 56px', textAlign: 'center' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 48px' }}>
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            style={{
              fontFamily: 'DM Sans, sans-serif', fontSize: 11,
              fontWeight: 700, letterSpacing: '0.18em',
              textTransform: 'uppercase', color: '#9C7B6E', marginBottom: 14,
            }}
          >Browse</motion.p>
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.06 }}
            style={{
              fontFamily: 'Playfair Display, serif',
              fontSize: 'clamp(36px,5vw,64px)',
              fontWeight: 700, color: '#1C0F0A',
              letterSpacing: '-0.03em', marginBottom: 16,
            }}
          >Our{' '}
            <em style={{
              fontStyle: 'italic',
              background: 'linear-gradient(135deg,#FF85D0,#FFC8A2,#FFE680)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
            }}>Collections</em>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.12 }}
            style={{
              fontFamily: 'DM Sans, sans-serif',
              fontSize: 16, color: '#5C4033', lineHeight: 1.65,
              maxWidth: 440, margin: '0 auto',
            }}
          >
            Every piece is handcrafted to order — no two are exactly alike.
          </motion.p>
        </div>
      </div>

      {/* Categories grid */}
      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 48px 96px' }}>
        {loading ? (
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(3, 1fr)',
            gap: 24,
          }}>
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} style={{
                aspectRatio: '4/3',
                borderRadius: 20,
                backgroundColor: 'rgba(255,133,208,0.08)',
                animation: 'pulse 1.5s ease infinite',
              }} />
            ))}
          </div>
        ) : categories.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '80px 0' }}>
            <p style={{
              fontFamily: 'Playfair Display, serif',
              fontSize: 22, color: '#1C0F0A', marginBottom: 8,
            }}>Collections coming soon</p>
            <p style={{
              fontFamily: 'DM Sans, sans-serif',
              fontSize: 14, color: '#9C7B6E',
            }}>New pieces are being crafted — check back shortly.</p>
          </div>
        ) : (
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(3, 1fr)',
            gap: 24,
          }} className="cat-grid">
            {categories.map((cat, i) => (
              <motion.div
                key={cat.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.07 }}
              >
                <Link to={`/categories/${cat.slug}`} style={{ display: 'block' }}>
                  <div
                    style={{
                      borderRadius: 20, overflow: 'hidden',
                      background: 'rgba(255,255,255,0.85)',
                      border: '1px solid rgba(255,133,208,0.2)',
                      boxShadow: '0 4px 20px rgba(255,133,208,0.08)',
                      transform: 'translateY(0)',
                      transition: 'transform 0.3s cubic-bezier(0.34,1.56,0.64,1), box-shadow 0.3s ease',
                      cursor: 'pointer',
                    }}
                    onMouseEnter={e => {
                      e.currentTarget.style.transform = 'translateY(-6px)'
                      e.currentTarget.style.boxShadow = '0 20px 48px rgba(255,133,208,0.18)'
                    }}
                    onMouseLeave={e => {
                      e.currentTarget.style.transform = 'translateY(0)'
                      e.currentTarget.style.boxShadow = '0 4px 20px rgba(255,133,208,0.08)'
                    }}
                  >
                    {/* Image */}
                    <div style={{
                      aspectRatio: '16/9',
                      overflow: 'hidden',
                      backgroundColor: 'rgba(255,200,162,0.1)',
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
                          background: 'linear-gradient(135deg,rgba(255,133,208,0.15),rgba(255,200,162,0.15),rgba(255,230,128,0.15))',
                          display: 'flex', alignItems: 'center', justifyContent: 'center',
                        }}>
                          <p style={{
                            fontFamily: 'Playfair Display, serif',
                            fontSize: 18, color: '#9C7B6E', fontStyle: 'italic',
                          }}>{cat.name}</p>
                        </div>
                      )}
                    </div>

                    {/* Info */}
                    <div style={{ padding: '20px 24px' }}>
                      <div style={{
                        display: 'flex', alignItems: 'center',
                        justifyContent: 'space-between',
                      }}>
                        <div>
                          <p style={{
                            fontFamily: 'Playfair Display, serif',
                            fontSize: 18, fontWeight: 600, color: '#1C0F0A',
                            marginBottom: 4, letterSpacing: '-0.01em',
                          }}>{cat.name}</p>
                          {cat.description && (
                            <p style={{
                              fontFamily: 'DM Sans, sans-serif',
                              fontSize: 13, color: '#9C7B6E', lineHeight: 1.4,
                            }}>{cat.description}</p>
                          )}
                        </div>
                        <div style={{
                          width: 36, height: 36, borderRadius: '50%',
                          background: 'linear-gradient(135deg,#FF85D0,#FFC8A2)',
                          display: 'flex', alignItems: 'center', justifyContent: 'center',
                          flexShrink: 0, marginLeft: 12,
                          boxShadow: '0 4px 12px rgba(255,133,208,0.3)',
                        }}>
                          <ArrowRight size={15} color="#1C0F0A" strokeWidth={2.5} />
                        </div>
                      </div>
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        )}
      </div>
      <style>{`@keyframes pulse { 0%,100%{opacity:1} 50%{opacity:0.4} }`}</style>
    </div>
  )
}
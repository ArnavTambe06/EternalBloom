import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { ArrowRight } from 'lucide-react'
import { CATEGORIES } from '@/lib/constants'

const featuredCategories = [
  { name: 'Keychains', image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&q=80' },
  { name: 'Desk Buddies', image: 'https://images.unsplash.com/photo-1487530811015-780680fb1f4e?w=400&q=80' },
  { name: 'Flower Cards', image: 'https://images.unsplash.com/photo-1518709766631-a6a7f45921c3?w=400&q=80' },
]

export function Hero() {
  return (
    <section style={{
      backgroundColor: 'var(--surface)',
      paddingTop: 'var(--space-xl)',
      paddingBottom: 'var(--space-xl)',
      borderBottom: '1px solid rgba(4,22,39,0.06)',
    }}>
      <div className="container">

        {/* Overline */}
        <motion.p
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="label-caps"
          style={{ marginBottom: 24 }}
        >
          Eternal Bloom — Handmade in India
        </motion.p>

        {/* Hero grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: 64,
          alignItems: 'end',
        }} className="hero-grid">

          {/* Left */}
          <div>
            <motion.h1
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.06 }}
              style={{
                fontFamily: 'var(--font-display)',
                fontSize: 'clamp(48px, 6vw, 80px)',
                fontWeight: 700,
                color: 'var(--primary)',
                lineHeight: 1.05,
                letterSpacing: '-0.02em',
                marginBottom: 32,
              }}
            >
              Never-Dying
              <br />
              <em style={{
                fontStyle: 'italic',
                color: 'var(--secondary)',
              }}>Creations</em>
              <br />
              for Life.
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.14 }}
              style={{
                fontFamily: 'var(--font-body)',
                fontSize: 17,
                color: 'var(--on-surface-variant)',
                lineHeight: 1.65,
                maxWidth: 400,
                marginBottom: 48,
              }}
            >
              Handcrafted crochet flowers, keychains, and decor pieces —
              each made to order, each carrying a piece of our heart.
            </motion.p>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.22 }}
              style={{ display: 'flex', gap: 16, flexWrap: 'wrap', alignItems: 'center' }}
            >
              <Link to="/#products">
                <motion.button
                  whileHover={{ opacity: 0.88 }}
                  whileTap={{ scale: 0.98 }}
                  style={{
                    display: 'inline-flex', alignItems: 'center', gap: 12,
                    padding: '14px 32px',
                    backgroundColor: 'var(--primary)',
                    color: 'white',
                    fontFamily: 'var(--font-body)',
                    fontSize: 12, fontWeight: 600,
                    letterSpacing: '0.1em',
                    textTransform: 'uppercase',
                    cursor: 'pointer',
                    transition: 'opacity 0.2s',
                  }}
                >
                  Shop Collection <ArrowRight size={14} />
                </motion.button>
              </Link>

              <Link to="/custom-order" style={{
                display: 'inline-flex', alignItems: 'center', gap: 8,
                fontFamily: 'var(--font-body)',
                fontSize: 12, fontWeight: 600,
                letterSpacing: '0.1em',
                textTransform: 'uppercase',
                color: 'var(--secondary)',
                paddingBottom: 2,
                borderBottom: '1.5px solid var(--secondary)',
              }}>
                Custom Order
              </Link>
            </motion.div>

            {/* Stats */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.35 }}
              style={{
                display: 'flex', gap: 48, marginTop: 64,
                paddingTop: 32,
                borderTop: '1px solid rgba(4,22,39,0.08)',
              }}
            >
              {[
                { value: '500+', label: 'Orders Made' },
                { value: '10', label: 'Collections' },
                { value: '100%', label: 'Handcrafted' },
              ].map(s => (
                <div key={s.label}>
                  <p style={{
                    fontFamily: 'var(--font-display)',
                    fontSize: 28, fontWeight: 700,
                    color: 'var(--primary)',
                    letterSpacing: '-0.02em',
                  }}>{s.value}</p>
                  <p className="label-caps" style={{ marginTop: 4 }}>{s.label}</p>
                </div>
              ))}
            </motion.div>
          </div>

          {/* Right — editorial image grid */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7, delay: 0.1 }}
            style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}
            className="hidden md:grid"
          >
            {/* Tall left image */}
            <div style={{
              gridRow: 'span 2',
              backgroundColor: 'var(--surface-container)',
              overflow: 'hidden',
              aspectRatio: '3/4',
            }} className="luxury-border">
              <motion.img
                whileHover={{ scale: 1.04 }}
                transition={{ duration: 0.5 }}
                src="https://images.unsplash.com/photo-1487530811015-780680fb1f4e?w=500&q=80"
                alt="Desk Buddy"
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              />
            </div>

            {/* Two small right images */}
            {[
              'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=300&q=80',
              'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=300&q=80',
            ].map((src, i) => (
              <div key={i} style={{
                backgroundColor: 'var(--surface-container)',
                overflow: 'hidden',
                aspectRatio: '1/1',
              }} className="luxury-border">
                <motion.img
                  whileHover={{ scale: 1.04 }}
                  transition={{ duration: 0.5 }}
                  src={src}
                  alt=""
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />
              </div>
            ))}

            {/* Label below */}
            <div style={{
              gridColumn: 'span 2',
              display: 'flex', alignItems: 'center', gap: 8,
              paddingTop: 8,
            }}>
              <span className="label-caps">Made to order</span>
              <div style={{ flex: 1, height: 1, backgroundColor: 'rgba(4,22,39,0.1)' }} />
              <span className="label-caps">Ships in 5–7 days</span>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
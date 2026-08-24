import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { ArrowRight, Sparkles } from 'lucide-react'

const stagger = {
  container: { hidden: {}, show: { transition: { staggerChildren: 0.1 } } },
  item: {
    hidden: { opacity: 0, y: 24 },
    show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] } },
  },
}

export function Hero() {
  return (
    <section style={{ padding: '100px 0 80px', position: 'relative' }}>
      <div className="wrap">
        <motion.div
          variants={stagger.container}
          initial="hidden"
          animate="show"
          style={{ maxWidth: 680, margin: '0 auto', textAlign: 'center' }}
        >
          {/* Badge */}
          <motion.div variants={stagger.item} style={{ marginBottom: 24 }}>
            <span className="glass" style={{
              display: 'inline-flex', alignItems: 'center', gap: 7,
              padding: '6px 16px', borderRadius: 999,
              fontFamily: 'var(--sans)', fontSize: 12,
              fontWeight: 600, color: 'var(--accent)',
              letterSpacing: '0.05em',
            }}>
              <Sparkles size={13} />
              Handmade with love in India
            </span>
          </motion.div>

          {/* Headline */}
          <motion.h1 variants={stagger.item} style={{
            fontFamily: 'var(--serif)',
            fontSize: 'clamp(44px, 7vw, 88px)',
            fontWeight: 700, lineHeight: 1.05,
            letterSpacing: '-0.03em',
            marginBottom: 24,
            color: 'var(--ink)',
          }}>
            Flowers that{' '}
            <em className="grad-text" style={{ fontStyle: 'italic' }}>
              never fade.
            </em>
          </motion.h1>

          {/* Sub */}
          <motion.p variants={stagger.item} style={{
            fontFamily: 'var(--sans)', fontSize: 17,
            color: 'var(--ink-2)', lineHeight: 1.65,
            marginBottom: 40, fontWeight: 400,
          }}>
            Handcrafted crochet keychains, desk buddies, bouquets & more
            — designed with patience, made to last a lifetime.
          </motion.p>

          {/* CTAs */}
          <motion.div variants={stagger.item} style={{
            display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap',
            marginBottom: 64,
          }}>
            <Link to="/#products">
              <motion.button
  whileHover={{ scale: 1.03, boxShadow: '0 8px 28px rgba(255,133,208,0.4)' }}
  whileTap={{ scale: 0.96 }}
  onClick={() => {
    document.getElementById('products')?.scrollIntoView({ behavior: 'smooth' })
  }}
  style={{
    display: 'inline-flex', alignItems: 'center', gap: 9,
    padding: '14px 30px', borderRadius: 999,
    background: 'var(--grad)',
    border: 'none', cursor: 'pointer',
    fontFamily: 'var(--sans)',
    fontSize: 14, fontWeight: 600,
    color: 'var(--ink)',
    letterSpacing: '0.03em',
    boxShadow: '0 4px 18px rgba(255,133,208,0.3)',
  }}
>
  
                Shop Collection <ArrowRight size={15} />
              </motion.button>
            </Link>
            <Link to="/custom-order">
              <motion.button
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.96 }}
                className="glass"
                style={{
                  display: 'inline-flex', alignItems: 'center', gap: 9,
                  padding: '14px 30px', borderRadius: 999,
                  fontFamily: 'var(--sans)', fontSize: 14,
                  fontWeight: 600, color: 'var(--ink)',
                  cursor: 'pointer',
                }}
              >
                Custom Order
              </motion.button>
            </Link>
          </motion.div>

          {/* Stats */}
          <motion.div variants={stagger.item}>
            <div className="glass" style={{
              display: 'inline-flex', gap: 0,
              borderRadius: 20, overflow: 'hidden',
            }}>
              {[
                { value: '500+', label: 'Happy Customers' },
                { value: '10', label: 'Collections' },
                { value: '100%', label: 'Handmade' },
                { value: 'COD', label: 'On Delivery' },
              ].map((s, i) => (
                <div key={s.label} style={{
                  padding: '18px 28px', textAlign: 'center',
                  borderRight: i < 3 ? '1px solid var(--line)' : 'none',
                }}>
                  <p style={{
                    fontFamily: 'var(--serif)',
                    fontSize: 22, fontWeight: 700,
                    color: 'var(--ink)', letterSpacing: '-0.02em',
                  }}>{s.value}</p>
                  <p className="label" style={{ marginTop: 3 }}>{s.label}</p>
                </div>
              ))}
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  )
}
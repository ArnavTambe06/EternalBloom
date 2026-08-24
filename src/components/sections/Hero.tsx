import { motion } from 'framer-motion'
import { ArrowDown } from 'lucide-react'

export function Hero() {
  const scrollToProducts = () => {
    document.getElementById('products')?.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <section style={{
      padding: '56px 0 40px',
      textAlign: 'center',
      position: 'relative', zIndex: 1,
      borderBottom: '1px solid rgba(255,133,208,0.12)',
    }}>
      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 48px' }}>
        <motion.p
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          style={{
            fontFamily: 'DM Sans, sans-serif', fontSize: 11,
            fontWeight: 700, letterSpacing: '0.2em',
            textTransform: 'uppercase', color: '#9C7B6E', marginBottom: 14,
          }}
        >Handmade in India · Never-Dying Creations</motion.p>

        <motion.h1
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.06 }}
          style={{
            fontFamily: 'Playfair Display, serif',
            fontSize: 'clamp(38px,5.5vw,70px)',
            fontWeight: 700, color: '#1C0F0A',
            letterSpacing: '-0.03em', lineHeight: 1.08,
            marginBottom: 16,
          }}
        >
          Flowers that{' '}
          <em style={{
            fontStyle: 'italic',
            background: 'linear-gradient(135deg,#FF85D0,#FFA6E0,#FFC8A2)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
          }}>never fade.</em>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.12 }}
          style={{
            fontFamily: 'DM Sans, sans-serif',
            fontSize: 16, color: '#5C4033', lineHeight: 1.6,
            maxWidth: 400, margin: '0 auto 28px',
          }}
        >
          Handcrafted crochet keychains, desk buddies, bouquets & more — made with patience.
        </motion.p>

        {/* Animated scroll cue */}
        <motion.button
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          onClick={scrollToProducts}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          style={{
            display: 'inline-flex', alignItems: 'center', gap: 8,
            padding: '10px 22px', borderRadius: 999,
            background: 'rgba(255,255,255,0.7)',
            backdropFilter: 'blur(12px)',
            border: '1px solid rgba(255,133,208,0.3)',
            fontFamily: 'DM Sans, sans-serif',
            fontSize: 13, fontWeight: 600, color: '#1C0F0A',
            cursor: 'pointer',
          }}
        >
          <motion.div
            animate={{ y: [0, 4, 0] }}
            transition={{ repeat: Infinity, duration: 1.4, ease: 'easeInOut' }}
          >
            <ArrowDown size={15} color="#E8609A" />
          </motion.div>
          Shop the collection
        </motion.button>
      </div>
    </section>
  )
}
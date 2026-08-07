import { motion } from 'framer-motion'
import { Heart, Sparkles, Package } from 'lucide-react'

export function AboutPage() {
  return (
    <div style={{ backgroundColor: '#FFF9F2', minHeight: '100vh' }}>

      {/* Hero */}
      <div style={{
        background: 'linear-gradient(135deg, #F6EFE7 0%, #FFF9F2 100%)',
        padding: '80px 24px 64px',
        textAlign: 'center',
        borderBottom: '1px solid #E7DDD5',
      }}>
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <div style={{ fontSize: 48, marginBottom: 16 }}>🌸</div>
          <h1 style={{
            fontFamily: 'Playfair Display, serif',
            fontSize: 'clamp(36px, 5vw, 56px)',
            fontWeight: 700, color: '#46352A', marginBottom: 16,
          }}>Our Story</h1>
          <p style={{
            fontFamily: 'Inter, sans-serif', fontSize: 17,
            color: '#786A61', maxWidth: 540, margin: '0 auto', lineHeight: 1.7,
          }}>
            Eternal Bloom started with a simple belief — that handmade things
            carry a piece of the maker's heart, and that flowers should never fade.
          </p>
        </motion.div>
      </div>

      {/* Values */}
      <div style={{ maxWidth: 960, margin: '0 auto', padding: '64px 24px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 24 }} className="about-grid">
          {[
            { icon: <Heart size={28} color="#B56A45" />, title: 'Made with Love', desc: 'Every single piece is handcrafted by us — no factories, no machines. Just yarn, patience, and a whole lot of heart.' },
            { icon: <Sparkles size={28} color="#B56A45" />, title: 'Never-Dying', desc: 'Unlike real flowers, our creations last forever. They\'re memories you can hold, gifts that never wither.' },
            { icon: <Package size={28} color="#B56A45" />, title: 'Made to Order', desc: 'Nothing sits in a warehouse. Every order is freshly made — which means each piece is thoughtfully crafted just for you.' },
          ].map((v, i) => (
            <motion.div
              key={v.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              style={{
                backgroundColor: 'white', borderRadius: 20,
                padding: '32px 24px', textAlign: 'center',
                border: '1px solid #E7DDD5',
                boxShadow: '0 2px 12px rgba(70,53,42,0.06)',
              }}
            >
              <div style={{ marginBottom: 16 }}>{v.icon}</div>
              <h3 style={{ fontFamily: 'Playfair Display, serif', fontSize: 20, fontWeight: 700, color: '#46352A', marginBottom: 10 }}>
                {v.title}
              </h3>
              <p style={{ fontFamily: 'Inter, sans-serif', fontSize: 14, color: '#786A61', lineHeight: 1.6 }}>
                {v.desc}
              </p>
            </motion.div>
          ))}
        </div>

        {/* Quote */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          style={{ textAlign: 'center', padding: '60px 0' }}
        >
          <blockquote style={{
            fontFamily: 'Playfair Display, serif',
            fontSize: 'clamp(22px, 3vw, 32px)',
            fontStyle: 'italic', color: '#B56A45',
            maxWidth: 600, margin: '0 auto', lineHeight: 1.4,
          }}>
            "Designed with patience. Packed with emotions."
          </blockquote>
        </motion.div>
      </div>
    </div>
  )
}
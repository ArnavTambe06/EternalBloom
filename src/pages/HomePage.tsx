import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Link } from 'react-router-dom'
import { ChevronDown, ChevronUp, Star, Truck, RefreshCw, Heart } from 'lucide-react'
import { Hero } from '@/components/sections/Hero'
import { CategoriesSection } from '@/components/sections/CategoriesSection'
import { ProductsSection } from '@/components/sections/ProductsSection'

const faqs = [
  { q: 'How long does delivery take?', a: 'Since every piece is made to order, we ship within 3–5 business days. Delivery takes 2–5 additional days depending on your location.' },
  { q: 'Can I customise a product?', a: 'Absolutely! Use our Custom Order page to describe your vision — colours, flowers, occasion — and we\'ll craft something just for you.' },
  { q: 'Do your flowers last forever?', a: 'Yes! Unlike real flowers, our crochet pieces never wilt, fade, or die. They\'re keepsakes made to last a lifetime.' },
  { q: 'What materials do you use?', a: 'High-quality cotton and acrylic yarns, floral wire, and premium accessories — chosen for durability and beauty.' },
  { q: 'Do you accept returns?', a: 'Since all pieces are handmade to order we don\'t accept returns. If your order arrives damaged, reach out within 24 hours with an unboxing video and we\'ll make it right.' },
]

const testimonials = [
  { name: 'Priya S.', location: 'Mumbai', text: 'The desk buddy I ordered is absolutely stunning! My colleagues keep asking where I got it from. Worth every rupee.', rating: 5 },
  { name: 'Ananya R.', location: 'Delhi', text: 'Got a custom bouquet for my best friend\'s birthday. She cried happy tears. Thank you Eternal Bloom! 🌸', rating: 5 },
  { name: 'Meera K.', location: 'Bangalore', text: 'The flower cards are so unique and beautiful. Ordered 5 for gifting. Everyone loved them!', rating: 5 },
]

function Testimonials() {
  return (
    <section style={{
      backgroundColor: 'var(--surface-section)',
      padding: 'var(--section-gap) 0',
    }}>
      <div className="container">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          style={{ textAlign: 'center', marginBottom: 48 }}
        >
          <p className="label-caps" style={{ marginBottom: 12 }}>What They Say</p>
          <h2 style={{
            fontFamily: 'var(--font-display)',
            fontSize: 'clamp(26px, 3.5vw, 38px)',
            fontWeight: 700, color: 'var(--on-surface)',
          }}>Made with Love, Received with Joy</h2>
        </motion.div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(3, 1fr)',
          gap: 20,
        }} className="about-grid">
          {testimonials.map((t, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              style={{
                backgroundColor: 'var(--surface-white)',
                borderRadius: 20,
                padding: '28px 24px',
                border: '1px solid var(--border)',
                boxShadow: '0 2px 16px rgba(196,82,106,0.06)',
              }}
            >
              <div style={{ display: 'flex', gap: 4, marginBottom: 16 }}>
                {Array.from({ length: t.rating }).map((_, j) => (
                  <Star key={j} size={14} color="var(--primary)" fill="var(--primary)" />
                ))}
              </div>
              <p style={{
                fontFamily: 'var(--font-body)',
                fontSize: 15, color: 'var(--on-surface)',
                lineHeight: 1.65, marginBottom: 20,
                fontStyle: 'italic',
              }}>"{t.text}"</p>
              <div>
                <p style={{ fontFamily: 'var(--font-body)', fontSize: 14, fontWeight: 700, color: 'var(--on-surface)' }}>
                  {t.name}
                </p>
                <p style={{ fontFamily: 'var(--font-body)', fontSize: 12, color: 'var(--on-surface-muted)' }}>
                  {t.location}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

function FAQ() {
  const [open, setOpen] = useState<number | null>(null)
  return (
    <section style={{
      backgroundColor: 'var(--surface-cream)',
      padding: 'var(--section-gap) 0',
    }}>
      <div className="container">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          style={{ textAlign: 'center', marginBottom: 48 }}
        >
          <p className="label-caps" style={{ marginBottom: 12 }}>Got Questions?</p>
          <h2 style={{
            fontFamily: 'var(--font-display)',
            fontSize: 'clamp(26px, 3.5vw, 38px)',
            fontWeight: 700, color: 'var(--on-surface)',
          }}>Frequently Asked</h2>
        </motion.div>

        <div style={{ maxWidth: 720, margin: '0 auto', display: 'flex', flexDirection: 'column', gap: 8 }}>
          {faqs.map((faq, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.06 }}
              style={{
                backgroundColor: 'var(--surface-white)',
                borderRadius: 14,
                border: '1px solid var(--border)',
                overflow: 'hidden',
              }}
            >
              <button
                onClick={() => setOpen(open === i ? null : i)}
                style={{
                  width: '100%', padding: '18px 24px',
                  display: 'flex', alignItems: 'center',
                  justifyContent: 'space-between', gap: 16,
                  background: 'none', border: 'none',
                  cursor: 'pointer', textAlign: 'left',
                }}
              >
                <span style={{
                  fontFamily: 'var(--font-body)',
                  fontSize: 15, fontWeight: 600, color: 'var(--on-surface)',
                }}>{faq.q}</span>
                {open === i
                  ? <ChevronUp size={18} color="var(--primary)" />
                  : <ChevronDown size={18} color="var(--on-surface-muted)" />
                }
              </button>
              <AnimatePresence>
                {open === i && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.25 }}
                    style={{ overflow: 'hidden' }}
                  >
                    <p style={{
                      padding: '0 24px 20px',
                      fontFamily: 'var(--font-body)',
                      fontSize: 14, color: 'var(--on-surface-muted)', lineHeight: 1.65,
                    }}>{faq.a}</p>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

function Newsletter() {
  const [email, setEmail] = useState('')
  const [done, setDone] = useState(false)
  return (
    <section style={{ backgroundColor: 'var(--primary)', padding: '64px 0' }}>
      <div className="container" style={{ textAlign: 'center' }}>
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <p style={{
            fontFamily: 'var(--font-body)', fontSize: 12,
            fontWeight: 600, letterSpacing: '0.12em',
            textTransform: 'uppercase', color: 'var(--primary-light)',
            marginBottom: 14,
          }}>Stay in the loop</p>
          <h2 style={{
            fontFamily: 'var(--font-display)',
            fontSize: 'clamp(26px, 3.5vw, 38px)',
            fontWeight: 700, color: 'white', marginBottom: 12,
          }}>Get Exclusive Offers</h2>
          <p style={{
            fontFamily: 'var(--font-body)',
            fontSize: 15, color: 'rgba(255,255,255,0.7)', marginBottom: 32,
          }}>
            Be the first to know about new collections and special discounts.
          </p>
          {done ? (
            <motion.p
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              style={{ fontFamily: 'var(--font-body)', fontSize: 16, color: 'white', fontWeight: 600 }}
            >
              🌸 You're on the list! Thank you.
            </motion.p>
          ) : (
            <div style={{
              display: 'flex', maxWidth: 440, margin: '0 auto',
              borderRadius: 999, overflow: 'hidden',
              border: '2px solid rgba(255,255,255,0.2)',
            }}>
              <input
                type="email"
                placeholder="your@email.com"
                value={email}
                onChange={e => setEmail(e.target.value)}
                style={{
                  flex: 1, padding: '14px 20px',
                  backgroundColor: 'rgba(255,255,255,0.12)',
                  border: 'none', outline: 'none',
                  fontFamily: 'var(--font-body)',
                  fontSize: 14, color: 'white',
                }}
              />
              <button
                onClick={() => email && setDone(true)}
                style={{
                  padding: '14px 24px',
                  backgroundColor: 'white', color: 'var(--primary)',
                  border: 'none', cursor: 'pointer',
                  fontFamily: 'var(--font-body)',
                  fontSize: 13, fontWeight: 700, whiteSpace: 'nowrap',
                }}
              >Subscribe</button>
            </div>
          )}
        </motion.div>
      </div>
    </section>
  )
}

export function HomePage() {
  return (
    <>
      <Hero />
      <CategoriesSection />
      <ProductsSection />
      <Testimonials />
      <FAQ />
      <Newsletter />
    </>
  )
}
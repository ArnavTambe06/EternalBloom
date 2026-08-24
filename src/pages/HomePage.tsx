import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronDown, ChevronUp, Star, ArrowRight } from 'lucide-react'
import { Link } from 'react-router-dom'
import { Hero } from '@/components/sections/Hero'
import { CategoriesSection } from '@/components/sections/CategoriesSection'
import { ProductsSection } from '@/components/sections/ProductsSection'

const faqs = [
  { q: 'How long does delivery take?', a: 'Every piece is made to order. We dispatch within 3–5 business days, with 2–5 additional days for delivery.' },
  { q: 'Can I customise a product?', a: 'Yes — use our Custom Order page to describe your vision. We\'ll handcraft something entirely for you.' },
  { q: 'Do your flowers last forever?', a: 'Yes. Our crochet pieces never wilt or fade — they\'re keepsakes made to last a lifetime.' },
  { q: 'Do you offer Cash on Delivery?', a: 'Yes, all orders are Cash on Delivery. No online payment required.' },
  { q: 'What if my order arrives damaged?', a: 'Reach out within 24 hours with an unboxing video and we\'ll make it right immediately.' },
]

const testimonials = [
  { name: 'Priya S.', city: 'Mumbai', text: 'The desk buddy is absolutely stunning. My colleagues keep asking where I got it from.', rating: 5 },
  { name: 'Ananya R.', city: 'Delhi', text: 'Got a custom bouquet for my best friend\'s birthday. She cried happy tears. Thank you!', rating: 5 },
  { name: 'Meera K.', city: 'Bangalore', text: 'The flower cards are so unique. Ordered 5 for gifting — everyone absolutely loved them.', rating: 5 },
]

function SectionLabel({ children }: { children: string }) {
  return (
    <p className="label" style={{ marginBottom: 10, color: 'var(--ink-3)' }}>{children}</p>
  )
}

function Testimonials() {
  return (
    <section style={{ padding: '96px 0', position: 'relative' }}>
      <div className="wrap">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          style={{ marginBottom: 48 }}
        >
          <SectionLabel>Happy Customers</SectionLabel>
          <h2 style={{
            fontFamily: 'var(--serif)',
            fontSize: 'clamp(28px, 3.5vw, 40px)',
            fontWeight: 700, color: 'var(--ink)',
            letterSpacing: '-0.02em',
          }}>Made with love, received with joy</h2>
        </motion.div>

        <div style={{
          display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 20,
        }} className="cat-grid">
          {testimonials.map((t, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="glass"
              style={{ borderRadius: 20, padding: '28px 24px' }}
            >
              <div style={{ display: 'flex', gap: 3, marginBottom: 16 }}>
                {Array.from({ length: t.rating }).map((_, j) => (
                  <Star key={j} size={13} color="var(--accent)" fill="var(--accent)" />
                ))}
              </div>
              <p style={{
                fontFamily: 'var(--serif)', fontSize: 15,
                color: 'var(--ink)', lineHeight: 1.65,
                marginBottom: 20, fontStyle: 'italic',
              }}>"{t.text}"</p>
              <div>
                <p style={{ fontFamily: 'var(--sans)', fontSize: 13, fontWeight: 600, color: 'var(--ink)' }}>
                  {t.name}
                </p>
                <p style={{ fontFamily: 'var(--sans)', fontSize: 12, color: 'var(--ink-3)' }}>{t.city}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

function CustomOrderBanner() {
  return (
    <section style={{ padding: '0 0 96px', position: 'relative', zIndex: 1 }}>
      <div style={{ maxWidth: 'var(--max, 1200px)', margin: '0 auto', padding: '0 var(--px, 48px)' }}>
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          style={{
            position: 'relative',
            borderRadius: 32,
            overflow: 'hidden',
            padding: '72px 64px',
          }}
        >
          {/* Gradient background for this section */}
          <div style={{
            position: 'absolute', inset: 0,
            background: 'linear-gradient(135deg, #FF85D0 0%, #FFA6E0 30%, #FFC8A2 65%, #FFE680 100%)',
            opacity: 0.18,
            borderRadius: 32,
          }} />
          <div style={{
            position: 'absolute', inset: 0,
            backgroundColor: 'rgba(255,255,255,0.75)',
            backdropFilter: 'blur(12px)',
            borderRadius: 32,
            border: '1px solid rgba(255,133,208,0.25)',
          }} />

          <div style={{
            position: 'relative', zIndex: 1,
            display: 'flex', alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap', gap: 32,
          }}>
            <div style={{ maxWidth: 520 }}>
              <p style={{
                fontFamily: 'DM Sans, sans-serif',
                fontSize: 11, fontWeight: 700,
                letterSpacing: '0.2em', textTransform: 'uppercase',
                color: '#9C7B6E', marginBottom: 14,
              }}>Custom Creations</p>

              <h2 style={{
                fontFamily: 'Playfair Display, serif',
                fontSize: 'clamp(28px, 3.5vw, 44px)',
                fontWeight: 700, color: '#1C0F0A',
                letterSpacing: '-0.02em', lineHeight: 1.1,
                marginBottom: 16,
              }}>
                Have something{' '}
                <em style={{
                  fontStyle: 'italic',
                  background: 'linear-gradient(135deg,#FF85D0,#FFC8A2)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text',
                }}>in mind?</em>
              </h2>

              <p style={{
                fontFamily: 'DM Sans, sans-serif',
                fontSize: 16, color: '#5C4033', lineHeight: 1.65,
              }}>
                Tell us your vision — colours, flowers, a feeling — and we'll
                handcraft something that's entirely, permanently yours.
                No two pieces are ever the same.
              </p>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 12, alignItems: 'flex-start' }}>
              <Link to="/custom-order">
                <motion.button
                  whileHover={{ scale: 1.04 }}
                  whileTap={{ scale: 0.96 }}
                  style={{
                    display: 'inline-flex', alignItems: 'center', gap: 10,
                    padding: '16px 36px', borderRadius: 999,
                    background: 'linear-gradient(135deg,#FF85D0,#FFA6E0,#FFC8A2,#FFE680)',
                    border: 'none', cursor: 'pointer',
                    fontFamily: 'DM Sans, sans-serif',
                    fontSize: 15, fontWeight: 700, color: '#1C0F0A',
                    boxShadow: '0 8px 32px rgba(255,133,208,0.35)',
                    letterSpacing: '0.02em',
                  }}
                >
                  Place Custom Order <ArrowRight size={17} />
                </motion.button>
              </Link>
              <p style={{
                fontFamily: 'DM Sans, sans-serif',
                fontSize: 12, color: '#9C7B6E',
                paddingLeft: 8,
              }}>
                Cash on delivery · Reply within 24 hours
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}

function FAQ() {
  const [open, setOpen] = useState<number | null>(null)
  return (
    <section style={{ padding: '0 0 96px', position: 'relative' }}>
      <div className="wrap">
        <div style={{ maxWidth: 680, margin: '0 auto' }}>
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            style={{ marginBottom: 40 }}
          >
            <SectionLabel>FAQ</SectionLabel>
            <h2 style={{
              fontFamily: 'var(--serif)', fontSize: 'clamp(28px, 3.5vw, 40px)',
              fontWeight: 700, color: 'var(--ink)', letterSpacing: '-0.02em',
            }}>Common Questions</h2>
          </motion.div>

          {faqs.map((faq, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.07 }}
              className="glass"
              style={{
                borderRadius: 14, marginBottom: 10,
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
                  fontFamily: 'var(--sans)', fontSize: 15,
                  fontWeight: 500, color: 'var(--ink)',
                }}>{faq.q}</span>
                <motion.div
                  animate={{ rotate: open === i ? 180 : 0 }}
                  transition={{ duration: 0.2 }}
                  style={{ flexShrink: 0 }}
                >
                  <ChevronDown size={16} strokeWidth={1.5} color="var(--ink-3)" />
                </motion.div>
              </button>
              <AnimatePresence>
                {open === i && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.22 }}
                    style={{ overflow: 'hidden' }}
                  >
                    <p style={{
                      fontFamily: 'var(--sans)', fontSize: 14,
                      color: 'var(--ink-2)', lineHeight: 1.65,
                      padding: '0 24px 20px',
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

export function HomePage() {
  return (
    <>
      <Hero />
      <ProductsSection />
      <CategoriesSection />
      <CustomOrderBanner />
      <Testimonials />
      <FAQ />
    </>
  )
}
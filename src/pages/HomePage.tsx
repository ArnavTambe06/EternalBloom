import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronDown, Star } from 'lucide-react'
import { Hero } from '@/components/sections/Hero'
import { ProductsSection } from '@/components/sections/ProductsSection'
import { CategoriesSection } from '@/components/sections/CategoriesSection'

const faqs = [
  { q: 'How long does delivery take?', a: 'Every piece is made to order. We dispatch within 3–5 business days, with 2–5 additional days for delivery.' },
  { q: 'Can I customise a product?', a: 'Yes — use our Custom Order page to describe your vision. We\'ll create something tailored entirely to you.' },
  { q: 'Do your flowers last forever?', a: 'Yes. Our crochet pieces never wilt or fade — they\'re keepsakes made to last a lifetime.' },
  { q: 'Do you offer Cash on Delivery?', a: 'Yes, all orders are Cash on Delivery. No online payment required.' },
  { q: 'What if my order arrives damaged?', a: 'Reach out within 24 hours with an unboxing video and we\'ll make it right.' },
]

const testimonials = [
  { name: 'Priya S.', city: 'Mumbai', text: 'The desk buddy is absolutely stunning. My colleagues keep asking where I got it.', rating: 5 },
  { name: 'Ananya R.', city: 'Delhi', text: 'Got a custom bouquet for my best friend\'s birthday. She cried happy tears.', rating: 5 },
  { name: 'Meera K.', city: 'Bangalore', text: 'The flower cards are so unique. Ordered 5 for gifting — everyone loved them.', rating: 5 },
]

function Testimonials() {
  return (
    <section style={{
      padding: '72px 0',
      borderTop: '1px solid rgba(255,133,208,0.12)',
      position: 'relative', zIndex: 1, backgroundColor: '#FAFAFA',
    }}>
      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 var(--px)' }}>
        <div style={{ marginBottom: 40 }}>
          <p style={{
            fontFamily: 'DM Sans, sans-serif', fontSize: 11,
            fontWeight: 700, letterSpacing: '0.15em',
            textTransform: 'uppercase', color: '#9C7B6E', marginBottom: 6,
          }}>Reviews</p>
          <h2 style={{
            fontFamily: 'Playfair Display, serif',
            fontSize: 'clamp(24px,3vw,34px)',
            fontWeight: 700, color: '#1C0F0A', letterSpacing: '-0.02em',
          }}>What customers say</h2>
        </div>
        <div className="testimonials-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 16 }}>
          {testimonials.map((t, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08 }}
              style={{
                backgroundColor: 'white',
                border: '1px solid rgba(28,15,10,0.06)',
                borderRadius: 4, padding: '24px 22px',
              }}
            >
              <div style={{ display: 'flex', gap: 3, marginBottom: 14 }}>
                {Array.from({ length: t.rating }).map((_, j) => (
                  <Star key={j} size={13} color="#E8609A" fill="#E8609A" />
                ))}
              </div>
              <p style={{
                fontFamily: 'Playfair Display, serif',
                fontSize: 15, color: '#1C0F0A',
                lineHeight: 1.6, marginBottom: 18, fontStyle: 'italic',
              }}>"{t.text}"</p>
              <div>
                <p style={{ fontFamily: 'DM Sans, sans-serif', fontSize: 13, fontWeight: 600, color: '#1C0F0A' }}>
                  {t.name}
                </p>
                <p style={{ fontFamily: 'DM Sans, sans-serif', fontSize: 12, color: '#9C7B6E' }}>{t.city}</p>
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
      padding: '72px 0',
      borderTop: '1px solid rgba(28,15,10,0.06)',
      position: 'relative', zIndex: 1, backgroundColor: 'white',
    }}>
      <div style={{ maxWidth: 720, margin: '0 auto', padding: '0 var(--px)' }}>
        <div style={{ marginBottom: 36 }}>
          <p style={{
            fontFamily: 'DM Sans, sans-serif', fontSize: 11,
            fontWeight: 700, letterSpacing: '0.15em',
            textTransform: 'uppercase', color: '#9C7B6E', marginBottom: 6,
          }}>FAQ</p>
          <h2 style={{
            fontFamily: 'Playfair Display, serif',
            fontSize: 'clamp(24px,3vw,34px)',
            fontWeight: 700, color: '#1C0F0A', letterSpacing: '-0.02em',
          }}>Common Questions</h2>
        </div>

        {faqs.map((faq, i) => (
          <div key={i} style={{ borderBottom: '1px solid rgba(28,15,10,0.08)' }}>
            <button
              onClick={() => setOpen(open === i ? null : i)}
              style={{
                width: '100%', padding: '18px 0',
                display: 'flex', alignItems: 'center',
                justifyContent: 'space-between', gap: 16,
                background: 'none', border: 'none',
                cursor: 'pointer', textAlign: 'left',
              }}
            >
              <span style={{
                fontFamily: 'DM Sans, sans-serif',
                fontSize: 15, fontWeight: 500, color: '#1C0F0A',
              }}>{faq.q}</span>
              <motion.div
                animate={{ rotate: open === i ? 180 : 0 }}
                transition={{ duration: 0.2 }}
                style={{ flexShrink: 0 }}
              >
                <ChevronDown size={16} strokeWidth={1.5} color="#9C7B6E" />
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
                    fontFamily: 'DM Sans, sans-serif', fontSize: 14,
                    color: '#5C4033', lineHeight: 1.65, paddingBottom: 18,
                  }}>{faq.a}</p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        ))}
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
      <Testimonials />
      <FAQ />
    </>
  )
}

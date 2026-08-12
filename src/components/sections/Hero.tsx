import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Link } from 'react-router-dom'
import { ArrowLeft, ArrowRight } from 'lucide-react'
import potsimage from '@/assets/pots.jpeg'

const panels = [
  {
    tag: 'New Collection',
    headline: 'Flowers That\nNever Fade',
    sub: 'Handcrafted keychains, desk buddies, bouquets & more — made with patience, packed with love.',
    cta: 'Shop Collection',
    href: '/#products',
    image: potsimage,
  },
  {
    tag: 'Made Just for You',
    headline: 'Your Vision,\nOur Craft',
    sub: "Describe your dream piece — colours, flowers, a feeling. We'll handcraft something entirely yours.",
    cta: 'Custom Order',
    href: '/custom-order',
    image:
      'https://images.unsplash.com/photo-1518709766631-a6a7f45921c3?w=1600&q=85',
  },
]

export function Hero() {
  const [active, setActive] = useState(0)

  const panel = panels[active]

  const nextPanel = () => {
    setActive((prev) => (prev + 1) % panels.length)
  }

  const previousPanel = () => {
    setActive((prev) => (prev - 1 + panels.length) % panels.length)
  }

  return (
    <section style={{ backgroundColor: 'var(--surface)' }}>
      {/* Hero */}
      <div
        style={{
          position: 'relative',
          width: '100%',
          height: 'clamp(480px, 55vw, 600px)',
          minHeight: 500,
          overflow: 'hidden',
        }}
      >
        <AnimatePresence mode="wait">
          <motion.div
            key={active}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
            style={{
              position: 'absolute',
              inset: 0,
            }}
          >
            {/* Background Image */}
            <motion.div
              initial={{ scale: 1.03 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.8 }}
              style={{
                position: 'absolute',
                inset: 0,
                backgroundImage: `url(${panel.image})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
              }}
            />

            {/* Dark gradient */}
            <div
              style={{
                position: 'absolute',
                inset: 0,
                background:
                  'linear-gradient(to top, rgba(61,26,46,0.9) 0%, rgba(61,26,46,0.25) 50%, rgba(61,26,46,0.05) 100%)',
              }}
            />

            {/* Top tint */}
            <div
              style={{
                position: 'absolute',
                inset: 0,
                background:
                  active === 0
                    ? 'linear-gradient(to bottom, rgba(255,133,208,0.15), transparent 40%)'
                    : 'linear-gradient(to bottom, rgba(255,198,162,0.15), transparent 40%)',
              }}
            />

            {/* Tag */}
            <div
              style={{
                position: 'absolute',
                top: 28,
                left: 36,
              }}
            >
              <span
                style={{
                  background: 'rgba(255,255,255,0.18)',
                  backdropFilter: 'blur(10px)',
                  border: '1px solid rgba(255,255,255,0.3)',
                  color: 'white',
                  padding: '6px 17px',
                  borderRadius: 999,
                  fontFamily: 'var(--font-body)',
                  fontSize: 11,
                  fontWeight: 700,
                  letterSpacing: '0.1em',
                  textTransform: 'uppercase',
                }}
              >
                {panel.tag}
              </span>
            </div>

            {/* Content */}
            <motion.div
              initial={{ opacity: 0, y: 25 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15, duration: 0.6 }}
              style={{
                position: 'absolute',
                left: '6vw',
                bottom: 70,
                maxWidth: 600,
              }}
            >
              <h2
                style={{
                  fontFamily: 'var(--font-display)',
                  fontSize: 'clamp(40px, 5vw, 68px)',
                  fontWeight: 700,
                  color: 'white',
                  lineHeight: 1.05,
                  letterSpacing: '-0.02em',
                  marginBottom: 16,
                  whiteSpace: 'pre-line',
                }}
              >
                {panel.headline}
              </h2>

              <p
                style={{
                  fontFamily: 'var(--font-body)',
                  fontSize: 15,
                  color: 'rgba(255,255,255,0.85)',
                  lineHeight: 1.6,
                  marginBottom: 25,
                  maxWidth: 420,
                }}
              >
                {panel.sub}
              </p>

              <Link
                to={panel.href}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 10,
                  padding: '12px 26px',
                  background: 'var(--primary-gradient)',
                  borderRadius: 999,
                  fontFamily: 'var(--font-body)',
                  fontSize: 13,
                  fontWeight: 700,
                  color: 'var(--on-surface)',
                  textDecoration: 'none',
                  boxShadow: '0 4px 20px rgba(255,133,208,0.4)',
                }}
              >
                {panel.cta}
                <ArrowRight size={15} />
              </Link>
            </motion.div>

            {/* Bottom labels */}
            <div
              style={{
                position: 'absolute',
                bottom: 24,
                left: 36,
                right: 36,
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                color: 'rgba(255,255,255,0.85)',
                fontFamily: 'var(--font-body)',
                fontSize: 13,
              }}
            >
              <span>
                {active === 0
                  ? 'Handcrafted With Love'
                  : 'Made Just for You'}
              </span>

              <span>
                {active === 0
                  ? 'Explore Collection'
                  : 'Custom Orders Welcome'}
              </span>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Carousel Controls */}
      <div
        style={{
          height: 54,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 22,
          borderBottom: '1px solid var(--border)',
          background: 'var(--surface)',
        }}
      >
        {/* Previous */}
        <button
          onClick={previousPanel}
          aria-label="Previous slide"
          style={{
            border: 'none',
            background: 'transparent',
            cursor: 'pointer',
            color: 'var(--on-surface-muted)',
            display: 'flex',
            alignItems: 'center',
          }}
        >
          <ArrowLeft size={17} />
        </button>

        {/* Counter */}
        <span
          style={{
            fontFamily: 'var(--font-body)',
            fontSize: 12,
            color: 'var(--on-surface-muted)',
            minWidth: 32,
            textAlign: 'center',
          }}
        >
          {active + 1}/2
        </span>

        {/* Next */}
        <button
          onClick={nextPanel}
          aria-label="Next slide"
          style={{
            border: 'none',
            background: 'transparent',
            cursor: 'pointer',
            color: 'var(--on-surface-muted)',
            display: 'flex',
            alignItems: 'center',
          }}
        >
          <ArrowRight size={17} />
        </button>
      </div>

      {/* Trust Strip */}
      <div
        style={{
          background:
            'linear-gradient(135deg, rgba(255,133,208,0.08) 0%, rgba(255,200,162,0.08) 50%, rgba(255,230,128,0.08) 100%)',
          borderBottom: '1px solid var(--border)',
          padding: '18px 0',
        }}
      >
        <div className="container">
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 48,
              flexWrap: 'wrap',
            }}
          >
            {[
              { emoji: '🌸', text: 'Handmade to Order' },
              { emoji: '🚚', text: 'Free Shipping ₹999+' },
              { emoji: '✨', text: '100% Handcrafted' },
              { emoji: '💝', text: 'Custom Orders Welcome' },
            ].map((item) => (
              <div
                key={item.text}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 8,
                }}
              >
                <span style={{ fontSize: 16 }}>{item.emoji}</span>

                <span
                  style={{
                    fontFamily: 'var(--font-body)',
                    fontSize: 13,
                    fontWeight: 500,
                    color: 'var(--on-surface-muted)',
                  }}
                >
                  {item.text}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
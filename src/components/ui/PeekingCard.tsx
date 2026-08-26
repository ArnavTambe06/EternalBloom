import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { Sparkles, X, ArrowRight } from 'lucide-react'

export function PeekingCard() {
  const [open, setOpen] = useState(false)
  const [dismissed, setDismissed] = useState(false)
  const [isMobile, setIsMobile] = useState(() => (
    typeof window !== 'undefined' && window.matchMedia('(max-width: 768px)').matches
  ))
  const navigate = useNavigate()

  useEffect(() => {
    const media = window.matchMedia('(max-width: 768px)')
    const update = () => setIsMobile(media.matches)
    update()
    media.addEventListener('change', update)
    return () => media.removeEventListener('change', update)
  }, [])

  if (dismissed) return null

  return (
    <motion.div
      className={`peek-card${open ? ' peek-card--open' : ''}`}
      initial={{ x: isMobile ? -54 : -292 }}
      animate={{ x: isMobile ? 0 : open ? 0 : -258 }}
      transition={{ type: 'spring', stiffness: 200, damping: 24 }}
      style={{
        position: 'fixed',
        left: isMobile ? 16 : 0,
        top: isMobile ? 'auto' : '43%',
        bottom: isMobile ? 16 : 'auto',
        // Keep the vertical offset in Framer Motion's transform pipeline.
        y: isMobile ? 0 : '-50%',
        zIndex: 80,
        display: 'flex',
        alignItems: 'stretch',
      }}
    >
      {/* The card itself */}
      <div className="peek-card__panel" style={{
        width: 258,
        background: 'linear-gradient(145deg, #2A1723 0%, #4B203D 58%, #66354B 100%)',
        border: '1px solid rgba(255,255,255,0.16)',
        borderLeft: 'none',
        borderRadius: '0 24px 24px 0',
        padding: '24px 20px 20px',
        boxShadow: '8px 12px 42px rgba(42,23,35,0.34)',
        position: 'relative',
        overflow: 'hidden',
      }}>
        <div style={{
          position: 'absolute', top: 0, left: 0, right: 0, height: 4,
          background: 'var(--grad)',
        }} />
        {/* Dismiss */}
        <button
          onClick={e => { e.stopPropagation(); setDismissed(true) }}
          style={{
            position: 'absolute', top: 10, right: 10,
            width: 22, height: 22, borderRadius: '50%',
            backgroundColor: 'rgba(255,255,255,0.12)',
            border: '1px solid rgba(255,255,255,0.2)', cursor: 'pointer',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}
        >
          <X size={11} color="#FFF8F5" />
        </button>

        <div className="peek-card__intro" style={{ marginBottom: 16 }}>
          <div className="peek-card__badge" style={{
            display: 'inline-flex', alignItems: 'center', gap: 7,
            padding: '5px 10px 5px 6px', borderRadius: 999,
            backgroundColor: 'rgba(255,255,255,0.12)',
            border: '1px solid rgba(255,255,255,0.16)',
            marginBottom: 14,
            color: '#FFE680',
            fontFamily: 'DM Sans, sans-serif', fontSize: 9,
            fontWeight: 700, letterSpacing: '0.14em',
            textTransform: 'uppercase',
          }}>
            <span style={{
              width: 24, height: 24, borderRadius: '50%',
              background: 'var(--grad)', color: '#2A1723',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              <Sparkles size={13} />
            </span>
            Custom Studio
          </div>
          <p className="peek-card__title" style={{
            fontFamily: 'Playfair Display, serif',
            fontSize: 21, fontWeight: 700, color: '#FFF8F5',
            lineHeight: 1.12, marginBottom: 9,
            maxWidth: 190,
          }}>Your idea, made to last.</p>
          <p className="peek-card__description" style={{
            fontFamily: 'DM Sans, sans-serif',
            fontSize: 12, color: 'rgba(255,248,245,0.72)',
            lineHeight: 1.55,
          }}>
            Tell us your vision — colours, flowers, a feeling. We'll craft it just for you.
          </p>
        </div>

        <div className="peek-card__steps" style={{
          display: 'flex', flexWrap: 'wrap', gap: 6,
          marginBottom: 17,
        }}>
          {['Tell us', 'Choose colours', 'We craft'].map((step, i) => (
            <span className="peek-card__step" key={step} style={{
              padding: '5px 8px',
              borderRadius: 999,
              backgroundColor: 'rgba(255,255,255,0.1)',
              border: '1px solid rgba(255,255,255,0.14)',
              color: i === 2 ? '#FFE680' : 'rgba(255,248,245,0.78)',
              fontFamily: 'DM Sans, sans-serif', fontSize: 9,
              fontWeight: 600, letterSpacing: '0.02em',
            }}>{step}</span>
          ))}
        </div>

        <motion.button
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
          onClick={() => navigate('/custom-order')}
          className="peek-card__cta"
          style={{
            width: '100%', padding: '12px 14px',
            background: 'var(--grad)',
            color: '#2A1723', border: 'none', borderRadius: 12,
            fontFamily: 'DM Sans, sans-serif',
            fontSize: 12, fontWeight: 800,
            cursor: 'pointer',
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
            boxShadow: '0 8px 20px rgba(255,133,208,0.2)',
          }}
        >
          Start a custom piece <ArrowRight size={14} />
        </motion.button>
      </div>

      {/* The peeking tab */}
      <motion.div
        className="peek-card__tab"
        onClick={() => setOpen(!open)}
        onKeyDown={event => {
          if (event.key === 'Enter' || event.key === ' ') {
            event.preventDefault()
            setOpen(!open)
          }
        }}
        whileHover={{ scale: 1.05 }}
        style={{
          width: 38,
          background: 'linear-gradient(180deg, #FF85D0 0%, #FFC8A2 52%, #FFE680 100%)',
          borderRadius: '0 14px 14px 0',
          display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
          gap: 9,
          cursor: 'pointer',
          boxShadow: '5px 0 20px rgba(232,96,154,0.32)',
          flexShrink: 0,
        }}
        role="button"
        tabIndex={0}
        aria-expanded={open}
        aria-label={open ? 'Close custom studio' : 'Open custom studio'}
      >
        <Sparkles size={13} color="#2A1723" />
        <p style={{
          fontFamily: 'DM Sans, sans-serif',
          fontSize: 9, fontWeight: 800,
          color: '#2A1723',
          letterSpacing: '0.12em',
          textTransform: 'uppercase',
          writingMode: 'vertical-rl',
          textOrientation: 'mixed',
          transform: 'rotate(180deg)',
          userSelect: 'none',
        }}>Make it yours</p>
      </motion.div>
    </motion.div>
  )
}

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { Sparkles, X, ArrowRight } from 'lucide-react'

export function PeekingCard() {
  const [open, setOpen] = useState(false)
  const [dismissed, setDismissed] = useState(false)
  const navigate = useNavigate()

  if (dismissed) return null

  return (
    <motion.div
      initial={{ x: -260 }}
      animate={{ x: open ? 0 : -228 }}
      transition={{ type: 'spring', stiffness: 200, damping: 24 }}
      style={{
        position: 'fixed',
        left: 0,
        top: '50%',
        transform: 'translateY(-50%)',
        zIndex: 80,
        display: 'flex',
        alignItems: 'stretch',
      }}
    >
      {/* The card itself */}
      <div style={{
        width: 240,
        background: 'linear-gradient(160deg, #FF85D0 0%, #FFA6E0 35%, #FFC8A2 70%, #FFE680 100%)',
        borderRadius: '0 20px 20px 0',
        padding: '24px 20px',
        boxShadow: '4px 0 32px rgba(255,133,208,0.25)',
        position: 'relative',
      }}>
        {/* Dismiss */}
        <button
          onClick={e => { e.stopPropagation(); setDismissed(true) }}
          style={{
            position: 'absolute', top: 10, right: 10,
            width: 22, height: 22, borderRadius: '50%',
            backgroundColor: 'rgba(28,15,10,0.15)',
            border: 'none', cursor: 'pointer',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}
        >
          <X size={11} color="#1C0F0A" />
        </button>

        <div style={{ marginBottom: 14 }}>
          <div style={{
            width: 36, height: 36, borderRadius: '50%',
            backgroundColor: 'rgba(255,255,255,0.35)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            marginBottom: 12,
          }}>
            <Sparkles size={18} color="#1C0F0A" />
          </div>
          <p style={{
            fontFamily: 'Playfair Display, serif',
            fontSize: 16, fontWeight: 700, color: '#1C0F0A',
            lineHeight: 1.2, marginBottom: 8,
          }}>Want something custom?</p>
          <p style={{
            fontFamily: 'DM Sans, sans-serif',
            fontSize: 12, color: 'rgba(28,15,10,0.65)',
            lineHeight: 1.5,
          }}>
            Tell us your vision — colours, flowers, a feeling. We'll craft it just for you.
          </p>
        </div>

        <motion.button
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
          onClick={() => navigate('/custom-order')}
          style={{
            width: '100%', padding: '11px 16px',
            backgroundColor: 'rgba(28,15,10,0.85)',
            color: 'white', border: 'none', borderRadius: 12,
            fontFamily: 'DM Sans, sans-serif',
            fontSize: 13, fontWeight: 700,
            cursor: 'pointer',
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
          }}
        >
          Place Custom Order <ArrowRight size={13} />
        </motion.button>
      </div>

      {/* The peeking tab */}
      <motion.div
        onClick={() => setOpen(!open)}
        whileHover={{ scale: 1.05 }}
        style={{
          width: 28,
          background: 'linear-gradient(180deg, #FF85D0 0%, #FFC8A2 100%)',
          borderRadius: '0 12px 12px 0',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          cursor: 'pointer',
          boxShadow: '4px 0 16px rgba(255,133,208,0.3)',
          flexShrink: 0,
        }}
      >
        <p style={{
          fontFamily: 'DM Sans, sans-serif',
          fontSize: 10, fontWeight: 800,
          color: '#1C0F0A',
          letterSpacing: '0.12em',
          textTransform: 'uppercase',
          writingMode: 'vertical-rl',
          textOrientation: 'mixed',
          transform: 'rotate(180deg)',
          userSelect: 'none',
        }}>Custom Order</p>
      </motion.div>
    </motion.div>
  )
}
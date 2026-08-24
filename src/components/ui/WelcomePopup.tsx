import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X } from 'lucide-react'
import { Link } from 'react-router-dom'
import { useAuth } from '@/hooks/useAuth'
import { signInWithGoogle } from '@/services/auth'

export function WelcomePopup() {
  const [visible, setVisible] = useState(false)
  const { isLoggedIn, initialized } = useAuth()

  useEffect(() => {
    if (!initialized) return
    if (isLoggedIn()) return

    // Show after 4 seconds, only if not dismissed before
    const dismissed = localStorage.getItem('eb_popup_dismissed')
    if (dismissed) return

    const t = setTimeout(() => setVisible(true), 4000)
    return () => clearTimeout(t)
  }, [initialized])

  const dismiss = () => {
    setVisible(false)
    localStorage.setItem('eb_popup_dismissed', '1')
  }

  const handleGoogle = async () => {
    dismiss()
    await signInWithGoogle()
  }

  return (
    <AnimatePresence>
      {visible && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={dismiss}
            style={{
              position: 'fixed', inset: 0,
              backgroundColor: 'rgba(61,26,46,0.45)',
              backdropFilter: 'blur(6px)',
              zIndex: 500,
            }}
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.88, y: 32 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.92, y: 20 }}
            transition={{ type: 'spring', stiffness: 220, damping: 24 }}
            style={{
              position: 'fixed',
              top: '50%', left: '50%',
              transform: 'translate(-50%, -50%)',
              zIndex: 501,
              width: '90vw', maxWidth: 480,
              backgroundColor: 'var(--surface-white)',
              borderRadius: 28,
              overflow: 'hidden',
              boxShadow: '0 32px 80px rgba(212,72,154,0.2)',
            }}
          >
            {/* Top gradient banner */}
            <div style={{
              background: 'var(--primary-gradient)',
              padding: '40px 32px 28px',
              textAlign: 'center',
              position: 'relative',
            }}>
              <button
                onClick={dismiss}
                style={{
                  position: 'absolute', top: 16, right: 16,
                  width: 30, height: 30, borderRadius: '50%',
                  backgroundColor: 'rgba(255,255,255,0.25)',
                  border: 'none', cursor: 'pointer',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  backdropFilter: 'blur(8px)',
                }}
              >
                <X size={14} color="var(--on-surface)" />
              </button>

              <motion.div
                animate={{ rotate: [0, 10, -10, 0] }}
                transition={{ repeat: Infinity, duration: 4, ease: 'easeInOut' }}
                style={{ fontSize: 52, marginBottom: 12 }}
              >
                🌸
              </motion.div>

              <h2 style={{
                fontFamily: 'var(--font-display)',
                fontSize: 26, fontWeight: 700,
                color: 'var(--on-surface)',
                marginBottom: 6, letterSpacing: '-0.02em',
              }}>
                Welcome to Eternal Bloom
              </h2>
              <p style={{
                fontFamily: 'var(--font-body)',
                fontSize: 14, color: 'rgba(61,26,46,0.7)',
                lineHeight: 1.5,
              }}>
                Never-dying creations for life — join us for exclusive offers!
              </p>
            </div>

            {/* Body */}
            <div style={{ padding: '28px 32px 32px' }}>
              {/* Perks */}
              <div style={{
                display: 'flex', flexDirection: 'column', gap: 10,
                marginBottom: 28,
              }}>
                {[
                  { emoji: '🎁', text: 'Get notified about new collections first' },
                  { emoji: '✨', text: 'Track your orders easily' },
                  { emoji: '💝', text: 'Save addresses for faster checkout' },
                ].map(perk => (
                  <div key={perk.text} style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                    <span style={{ fontSize: 18, flexShrink: 0 }}>{perk.emoji}</span>
                    <p style={{
                      fontFamily: 'var(--font-body)',
                      fontSize: 14, color: 'var(--on-surface)',
                    }}>{perk.text}</p>
                  </div>
                ))}
              </div>

              {/* Google button */}
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.97 }}
                onClick={handleGoogle}
                style={{
                  width: '100%', padding: '13px',
                  border: '1.5px solid var(--border)',
                  borderRadius: 12, backgroundColor: 'white',
                  cursor: 'pointer',
                  display: 'flex', alignItems: 'center',
                  justifyContent: 'center', gap: 10,
                  fontFamily: 'var(--font-body)',
                  fontSize: 14, fontWeight: 600,
                  color: 'var(--on-surface)', marginBottom: 12,
                  boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
                }}
              >
                <svg width="18" height="18" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                </svg>
                Continue with Google
              </motion.button>

              {/* Email option */}
              <Link to="/register" onClick={dismiss}>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.97 }}
                  style={{
                    width: '100%', padding: '13px',
                    background: 'var(--primary-gradient)',
                    border: 'none', borderRadius: 12,
                    fontFamily: 'var(--font-body)',
                    fontSize: 14, fontWeight: 700,
                    color: 'var(--on-surface)', cursor: 'pointer',
                    marginBottom: 16,
                    boxShadow: '0 4px 16px rgba(255,133,208,0.3)',
                  }}
                >
                  Create Free Account
                </motion.button>
              </Link>

              {/* Skip */}
              <p style={{ textAlign: 'center' }}>
                <button
                  onClick={dismiss}
                  style={{
                    background: 'none', border: 'none', cursor: 'pointer',
                    fontFamily: 'var(--font-body)',
                    fontSize: 13, color: 'var(--on-surface-faint)',
                    textDecoration: 'underline',
                    textDecorationStyle: 'dotted',
                  }}
                >
                  No thanks, I'll browse as guest
                </button>
              </p>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
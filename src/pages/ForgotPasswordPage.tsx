import { useState } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ArrowLeft, CheckCircle } from 'lucide-react'
import { resetPassword } from '@/services/auth'

export function ForgotPasswordPage() {
  const [email, setEmail] = useState('')
  const [sent, setSent] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async () => {
    if (!email) { setError('Please enter your email.'); return }
    setLoading(true)
    try {
      await resetPassword(email)
      setSent(true)
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{
      minHeight: '100vh',
      background: 'radial-gradient(ellipse at 50% 30%, rgba(255,133,208,0.12) 0%, transparent 60%), var(--surface)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      padding: 24,
    }}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        style={{
          backgroundColor: 'var(--surface-white)',
          borderRadius: 24, padding: '44px 40px',
          width: '100%', maxWidth: 420,
          boxShadow: '0 8px 48px rgba(212,72,154,0.1)',
          border: '1px solid var(--border)',
        }}
      >
        <Link to="/login" style={{
          display: 'inline-flex', alignItems: 'center', gap: 6,
          fontFamily: 'var(--font-body)', fontSize: 13,
          color: 'var(--on-surface-muted)', marginBottom: 28,
        }}>
          <ArrowLeft size={14} /> Back to login
        </Link>

        {sent ? (
          <div style={{ textAlign: 'center' }}>
            <div style={{
              width: 56, height: 56, borderRadius: '50%',
              background: 'var(--primary-gradient)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              margin: '0 auto 16px',
            }}>
              <CheckCircle size={24} color="var(--on-surface)" />
            </div>
            <h2 style={{
              fontFamily: 'var(--font-display)',
              fontSize: 22, fontWeight: 700,
              color: 'var(--on-surface)', marginBottom: 10,
            }}>Check your inbox</h2>
            <p style={{
              fontFamily: 'var(--font-body)',
              fontSize: 14, color: 'var(--on-surface-muted)',
              lineHeight: 1.6,
            }}>
              We've sent a reset link to <strong style={{ color: 'var(--primary)' }}>{email}</strong>
            </p>
          </div>
        ) : (
          <>
            <h1 style={{
              fontFamily: 'var(--font-display)',
              fontSize: 24, fontWeight: 700,
              color: 'var(--on-surface)', marginBottom: 8,
            }}>Reset password</h1>
            <p style={{
              fontFamily: 'var(--font-body)',
              fontSize: 14, color: 'var(--on-surface-muted)',
              marginBottom: 32, lineHeight: 1.5,
            }}>
              Enter your email and we'll send you a reset link.
            </p>

            {error && (
              <p style={{
                fontFamily: 'var(--font-body)',
                fontSize: 13, color: '#C33',
                marginBottom: 16,
              }}>{error}</p>
            )}

            <label style={{
              display: 'block', fontFamily: 'var(--font-body)',
              fontSize: 11, fontWeight: 700,
              letterSpacing: '0.1em', textTransform: 'uppercase',
              color: 'var(--on-surface-muted)', marginBottom: 8,
            }}>Email</label>
            <input
              type="email"
              placeholder="you@email.com"
              value={email}
              onChange={e => setEmail(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleSubmit()}
              style={{
                width: '100%', padding: '12px 0',
                border: 'none',
                borderBottom: '1.5px solid var(--border)',
                backgroundColor: 'transparent',
                fontFamily: 'var(--font-body)',
                fontSize: 15, color: 'var(--on-surface)',
                outline: 'none', boxSizing: 'border-box',
                marginBottom: 32,
              }}
              onFocus={e => e.target.style.borderBottomColor = 'var(--primary)'}
              onBlur={e => e.target.style.borderBottomColor = 'var(--border)'}
            />

            <motion.button
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleSubmit}
              disabled={loading}
              style={{
                width: '100%', padding: '14px',
                background: 'var(--primary-gradient)',
                border: 'none', borderRadius: 12,
                fontFamily: 'var(--font-body)',
                fontSize: 15, fontWeight: 700,
                color: 'var(--on-surface)', cursor: 'pointer',
                boxShadow: '0 4px 20px rgba(255,133,208,0.35)',
              }}
            >
              {loading ? 'Sending...' : 'Send Reset Link'}
            </motion.button>
          </>
        )}
      </motion.div>
    </div>
  )
}
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Eye, EyeOff, CheckCircle } from 'lucide-react'
import { supabase } from '@/services/supabase'

export function ResetPasswordPage() {
  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [show, setShow] = useState(false)
  const [loading, setLoading] = useState(false)
  const [done, setDone] = useState(false)
  const [error, setError] = useState('')
  const navigate = useNavigate()

  const handleReset = async () => {
    if (password.length < 8) { setError('Password must be at least 8 characters.'); return }
    if (password !== confirm) { setError('Passwords do not match.'); return }
    setLoading(true)
    setError('')
    const { error: err } = await supabase.auth.updateUser({ password })
    if (err) { setError(err.message); setLoading(false); return }
    setDone(true)
    setTimeout(() => navigate('/login'), 3000)
  }

  return (
    <div style={{
      minHeight: '100vh',
      background: 'radial-gradient(ellipse at 50% 20%, rgba(255,133,208,0.12) 0%, transparent 60%), var(--surface)',
      display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24,
    }}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        style={{
          backgroundColor: 'var(--surface-white)', borderRadius: 24,
          padding: '44px 40px', width: '100%', maxWidth: 420,
          boxShadow: '0 8px 48px rgba(212,72,154,0.1)',
          border: '1px solid var(--border)',
        }}
      >
        {done ? (
          <div style={{ textAlign: 'center' }}>
            <div style={{
              width: 56, height: 56, borderRadius: '50%',
              background: 'var(--primary-gradient)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              margin: '0 auto 16px',
            }}>
              <CheckCircle size={26} color="var(--on-surface)" />
            </div>
            <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 22, fontWeight: 700, color: 'var(--on-surface)', marginBottom: 8 }}>
              Password Updated!
            </h2>
            <p style={{ fontFamily: 'var(--font-body)', fontSize: 14, color: 'var(--on-surface-muted)' }}>
              Redirecting you to login...
            </p>
          </div>
        ) : (
          <>
            <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 24, fontWeight: 700, color: 'var(--on-surface)', marginBottom: 8 }}>
              Set new password
            </h1>
            <p style={{ fontFamily: 'var(--font-body)', fontSize: 14, color: 'var(--on-surface-muted)', marginBottom: 32 }}>
              Choose a strong password for your account.
            </p>

            {error && (
              <div style={{
                padding: '12px 16px', marginBottom: 20,
                backgroundColor: '#FFF0F0', border: '1px solid #FFD0D0',
                borderRadius: 10, fontFamily: 'var(--font-body)', fontSize: 13, color: '#C33',
              }}>{error}</div>
            )}

            <div style={{ display: 'flex', flexDirection: 'column', gap: 24, marginBottom: 28 }}>
              {[
                { label: 'New Password', val: password, set: setPassword },
                { label: 'Confirm Password', val: confirm, set: setConfirm },
              ].map((f, i) => (
                <div key={i}>
                  <label style={{
                    display: 'block', fontFamily: 'var(--font-body)',
                    fontSize: 11, fontWeight: 700, letterSpacing: '0.1em',
                    textTransform: 'uppercase', color: 'var(--on-surface-muted)', marginBottom: 8,
                  }}>{f.label}</label>
                  <div style={{ position: 'relative' }}>
                    <input
                      type={show ? 'text' : 'password'}
                      value={f.val}
                      onChange={e => f.set(e.target.value)}
                      style={{
                        width: '100%', padding: '12px 0', paddingRight: 36,
                        border: 'none', borderBottom: '1.5px solid var(--border)',
                        backgroundColor: 'transparent',
                        fontFamily: 'var(--font-body)', fontSize: 15,
                        color: 'var(--on-surface)', outline: 'none', boxSizing: 'border-box',
                      }}
                      onFocus={e => e.target.style.borderBottomColor = 'var(--primary)'}
                      onBlur={e => e.target.style.borderBottomColor = 'var(--border)'}
                    />
                    {i === 0 && (
                      <button onClick={() => setShow(!show)} style={{
                        position: 'absolute', right: 0, top: '50%',
                        transform: 'translateY(-50%)',
                        background: 'none', border: 'none', cursor: 'pointer',
                        color: 'var(--on-surface-faint)', display: 'flex',
                      }}>
                        {show ? <EyeOff size={16} /> : <Eye size={16} />}
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>

            <motion.button
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleReset}
              disabled={loading}
              style={{
                width: '100%', padding: '14px',
                background: 'var(--primary-gradient)',
                border: 'none', borderRadius: 12,
                fontFamily: 'var(--font-body)', fontSize: 15, fontWeight: 700,
                color: 'var(--on-surface)', cursor: loading ? 'not-allowed' : 'pointer',
                opacity: loading ? 0.7 : 1,
                boxShadow: '0 4px 20px rgba(255,133,208,0.35)',
              }}
            >
              {loading ? 'Updating...' : 'Update Password'}
            </motion.button>
          </>
        )}
      </motion.div>
    </div>
  )
}
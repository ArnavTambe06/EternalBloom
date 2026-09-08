import { useState } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Eye, EyeOff, AlertCircle, ArrowRight } from 'lucide-react'
import { signInWithEmail, signInWithGoogle } from '@/services/auth'
import { BrandLogo } from '@/components/ui/BrandLogo'

export function LoginPage() {
  const [show, setShow] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [form, setForm] = useState({ email: '', password: '' })
  const navigate = useNavigate()
  const location = useLocation()
  const from = (location.state as any)?.from?.pathname || '/'

  const handleSubmit = async () => {
    if (!form.email || !form.password) { setError('Please fill in all fields.'); return }
    setLoading(true); setError('')
    try {
      await signInWithEmail(form.email, form.password)
      navigate(from, { replace: true })
    } catch (err: any) {
      setError(err.message || 'Invalid email or password.')
    } finally { setLoading(false) }
  }

  return (
    <div style={{
      minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center',
      padding: '24px var(--px-mob)',
    }}>
      <div style={{
        display: 'grid', gridTemplateColumns: '1fr 1fr',
        maxWidth: 900, width: '100%', gap: 0,
        borderRadius: 28, overflow: 'hidden',
        boxShadow: '0 24px 80px rgba(232,163,185,0.2)',
      }} className="hero-grid">

        {/* Left — brand panel */}
        <div style={{
          background: 'var(--grad)',
          padding: '60px 48px',
          display: 'flex', flexDirection: 'column',
          justifyContent: 'space-between',
        }} className="auth-side-panel">
          <div>
            <BrandLogo size={58} style={{ marginBottom: 40 }} />
            <h2 style={{
              fontFamily: 'var(--serif)', fontSize: 36,
              fontWeight: 700, color: 'var(--ink)',
              lineHeight: 1.2, marginBottom: 16,
              letterSpacing: '-0.02em',
            }}>
              Never-Dying<br />Creations
            </h2>
            <p style={{
              fontFamily: 'var(--sans)', fontSize: 15,
              color: 'rgba(28,15,10,0.7)', lineHeight: 1.6,
            }}>
              Sign in to track orders, manage addresses, and place custom orders.
            </p>
          </div>

          {/* Floating product preview cards */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {[
              { name: 'Bow Keychain', price: '₹149', cat: 'Keychains' },
              { name: 'Daisy Desk Buddy', price: '₹349', cat: 'Desk Buddies' },
            ].map(item => (
              <motion.div
                key={item.name}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                style={{
                  background: 'rgba(255,255,255,0.35)',
                  backdropFilter: 'blur(12px)',
                  borderRadius: 12, padding: '10px 16px',
                  display: 'flex', justifyContent: 'space-between',
                  alignItems: 'center',
                }}
              >
                <div>
                  <p style={{ fontFamily: 'var(--serif)', fontSize: 13, fontWeight: 600, color: 'var(--ink)' }}>{item.name}</p>
                  <p style={{ fontFamily: 'var(--sans)', fontSize: 11, color: 'rgba(28,15,10,0.6)' }}>{item.cat}</p>
                </div>
                <p style={{ fontFamily: 'var(--sans)', fontSize: 14, fontWeight: 700, color: 'var(--ink)' }}>{item.price}</p>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Right — form */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.4 }}
          className="glass-strong"
          style={{ padding: '52px 44px' }}
        >
          <h1 style={{
            fontFamily: 'var(--serif)', fontSize: 26,
            fontWeight: 700, color: 'var(--ink)', marginBottom: 6,
          }}>Welcome back</h1>
          <p style={{
            fontFamily: 'var(--sans)', fontSize: 14,
            color: 'var(--ink-3)', marginBottom: 32,
          }}>Sign in to your Eternal Bloom account</p>

          {error && (
            <motion.div
              initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }}
              style={{
                display: 'flex', alignItems: 'center', gap: 8,
                padding: '12px 14px', marginBottom: 20,
                backgroundColor: '#FFF0F0', border: '1px solid #FFD0D0',
                borderRadius: 10,
              }}
            >
              <AlertCircle size={14} color="#C33" />
              <p style={{ fontFamily: 'var(--sans)', fontSize: 13, color: '#C33' }}>{error}</p>
            </motion.div>
          )}

          {/* Google */}
          <motion.button
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.98 }}
            onClick={async () => { try { await signInWithGoogle() } catch (e: any) { setError(e.message) } }}
            style={{
              width: '100%', padding: '13px',
              border: '1.5px solid var(--line-2)', borderRadius: 12,
              background: 'white', cursor: 'pointer',
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10,
              fontFamily: 'var(--sans)', fontSize: 14, fontWeight: 500,
              color: 'var(--ink)', marginBottom: 20,
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

          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 24 }}>
            <div style={{ flex: 1, height: 1, backgroundColor: 'var(--line-2)' }} />
            <span style={{ fontFamily: 'var(--sans)', fontSize: 12, color: 'var(--ink-3)' }}>or email</span>
            <div style={{ flex: 1, height: 1, backgroundColor: 'var(--line-2)' }} />
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 20, marginBottom: 24 }}>
            {[
              { label: 'Email', key: 'email', type: 'email', placeholder: 'you@email.com' },
            ].map(f => (
              <div key={f.key}>
                <label style={{
                  display: 'block', fontFamily: 'var(--sans)',
                  fontSize: 11, fontWeight: 700, letterSpacing: '0.1em',
                  textTransform: 'uppercase', color: 'var(--ink-3)', marginBottom: 8,
                }}>{f.label}</label>
                <input
                  type={f.type} placeholder={f.placeholder}
                  value={(form as any)[f.key]}
                  onChange={e => setForm(fm => ({ ...fm, [f.key]: e.target.value }))}
                  onKeyDown={e => e.key === 'Enter' && handleSubmit()}
                  style={{
                    width: '100%', padding: '11px 14px',
                    border: '1.5px solid var(--line-2)', borderRadius: 10,
                    fontFamily: 'var(--sans)', fontSize: 14,
                    color: 'var(--ink)', background: 'rgba(255,255,255,0.8)',
                    outline: 'none', boxSizing: 'border-box', transition: 'border-color 0.2s',
                  }}
                  onFocus={e => e.target.style.borderColor = 'var(--accent)'}
                  onBlur={e => e.target.style.borderColor = 'var(--line-2)'}
                />
              </div>
            ))}

            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                <label style={{
                  fontFamily: 'var(--sans)', fontSize: 11, fontWeight: 700,
                  letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--ink-3)',
                }}>Password</label>
                <Link to="/forgot-password" style={{
                  fontFamily: 'var(--sans)', fontSize: 12, color: 'var(--accent)', fontWeight: 500,
                }}>Forgot?</Link>
              </div>
              <div style={{ position: 'relative' }}>
                <input
                  type={show ? 'text' : 'password'}
                  placeholder="••••••••"
                  value={form.password}
                  onChange={e => setForm(fm => ({ ...fm, password: e.target.value }))}
                  onKeyDown={e => e.key === 'Enter' && handleSubmit()}
                  style={{
                    width: '100%', padding: '11px 42px 11px 14px',
                    border: '1.5px solid var(--line-2)', borderRadius: 10,
                    fontFamily: 'var(--sans)', fontSize: 14,
                    color: 'var(--ink)', background: 'rgba(255,255,255,0.8)',
                    outline: 'none', boxSizing: 'border-box', transition: 'border-color 0.2s',
                  }}
                  onFocus={e => e.target.style.borderColor = 'var(--accent)'}
                  onBlur={e => e.target.style.borderColor = 'var(--line-2)'}
                />
                <button onClick={() => setShow(!show)} style={{
                  position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)',
                  background: 'none', border: 'none', cursor: 'pointer', color: 'var(--ink-3)',
                  display: 'flex',
                }}>
                  {show ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>
          </div>

          <motion.button
            whileHover={{ scale: 1.01, boxShadow: '0 8px 24px rgba(232,163,185,0.35)' }}
            whileTap={{ scale: 0.97 }}
            onClick={handleSubmit}
            disabled={loading}
            className="grad-btn"
            style={{
              width: '100%', padding: '14px', borderRadius: 12,
              fontSize: 15, letterSpacing: '0.02em',
              opacity: loading ? 0.7 : 1,
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
              marginBottom: 18,
            }}
          >
            {loading && <div style={{ width: 15, height: 15, borderRadius: '50%', border: '2px solid rgba(28,15,10,0.3)', borderTopColor: 'var(--ink)' }} className="spin" />}
            {loading ? 'Signing in...' : <>Sign In <ArrowRight size={15} /></>}
          </motion.button>

          <p style={{ textAlign: 'center', fontFamily: 'var(--sans)', fontSize: 14, color: 'var(--ink-3)' }}>
            New here?{' '}
            <Link to="/register" style={{ color: 'var(--accent)', fontWeight: 700 }}>Create account</Link>
          </p>
        </motion.div>
      </div>
    </div>
  )
}

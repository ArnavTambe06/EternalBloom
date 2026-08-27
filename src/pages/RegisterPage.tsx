import { useState } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Eye, EyeOff, CheckCircle, ArrowRight } from 'lucide-react'
import { signUpWithEmail, signInWithGoogle } from '@/services/auth'

export function RegisterPage() {
  const [show, setShow] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)
  const [form, setForm] = useState({ name: '', email: '', password: '' })
  const set = (k: string, v: string) => setForm(f => ({ ...f, [k]: v }))


  const strength = form.password.length === 0 ? 0 : form.password.length < 6 ? 1 : form.password.length < 8 ? 2 : 3
  const strengthLabel = ['', 'Too short', 'Almost there', 'Strong'][strength]
  const strengthColor = ['', '#E53E3E', '#F6AD55', '#5A8C6E'][strength]

  const handleSubmit = async () => {
    if (!form.name || !form.email || form.password.length < 8) {
      setError('Please fill all fields. Password must be 8+ chars.'); return
    }
    setLoading(true); setError('')
    try {
      await signUpWithEmail(form.email, form.password, form.name)
      setSuccess(true)
    } catch (err: any) {
      setError(err.message || 'Something went wrong.')
    } finally { setLoading(false) }
  }

  if (success) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24 }}>
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}
          className="glass-strong"
          style={{ borderRadius: 24, padding: '56px 48px', maxWidth: 440, width: '100%', textAlign: 'center' }}
        >
          <motion.div
            initial={{ scale: 0 }} animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
            style={{
              width: 72, height: 72, borderRadius: '50%',
              background: 'var(--grad)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              margin: '0 auto 20px',
              boxShadow: '0 8px 24px rgba(255,133,208,0.4)',
            }}
          >
            <CheckCircle size={32} color="var(--ink)" />
          </motion.div>
          <h2 style={{ fontFamily: 'var(--serif)', fontSize: 26, fontWeight: 700, color: 'var(--ink)', marginBottom: 12 }}>
            Check your email!
          </h2>
          <p style={{ fontFamily: 'var(--sans)', fontSize: 14, color: 'var(--ink-2)', lineHeight: 1.65, marginBottom: 28 }}>
            We've sent a confirmation link to <strong style={{ color: 'var(--accent)' }}>{form.email}</strong>.
            Click it to activate your account.
          </p>
          <Link to="/login">
            <button className="grad-btn" style={{ padding: '13px 32px', borderRadius: 12, fontSize: 14 }}>
              Go to Login
            </button>
          </Link>
        </motion.div>
      </div>
    )
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
        boxShadow: '0 24px 80px rgba(255,133,208,0.2)',
      }} className="hero-grid">

        {/* Left — brand */}
        <div style={{
          background: 'linear-gradient(160deg, #FFC8A2 0%, #FFE680 40%, #FFA6E0 100%)',
          padding: '60px 48px',
          display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: 32,
        }} className="auth-side-panel">
          <div>
            <p className="label" style={{ marginBottom: 12, color: 'rgba(28,15,10,0.6)' }}>Join us</p>
            <h2 style={{
              fontFamily: 'var(--serif)', fontSize: 36, fontWeight: 700,
              color: 'var(--ink)', lineHeight: 1.2, letterSpacing: '-0.02em',
            }}>
              Your blooms<br />await.
            </h2>
          </div>

          {[
            { icon: '🌸', text: 'Track orders from your dashboard' },
            { icon: '💝', text: 'Save addresses for faster checkout' },
            { icon: '✨', text: 'Submit custom order requests' },
          ].map(perk => (
            <div key={perk.text} style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <div style={{
                width: 36, height: 36, borderRadius: '50%',
                backgroundColor: 'rgba(255,255,255,0.5)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: 16, flexShrink: 0,
              }}>{perk.icon}</div>
              <p style={{ fontFamily: 'var(--sans)', fontSize: 14, color: 'rgba(28,15,10,0.75)', fontWeight: 500 }}>
                {perk.text}
              </p>
            </div>
          ))}
        </div>

        {/* Right — form */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="glass-strong"
          style={{ padding: '52px 44px' }}
        >
          <h1 style={{
            fontFamily: 'var(--serif)', fontSize: 26,
            fontWeight: 700, color: 'var(--ink)', marginBottom: 6,
          }}>Create account</h1>
          <p style={{ fontFamily: 'var(--sans)', fontSize: 14, color: 'var(--ink-3)', marginBottom: 28 }}>
            Join Eternal Bloom today — it's free.
          </p>

          {error && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{
              padding: '12px 14px', marginBottom: 20,
              backgroundColor: '#FFF0F0', border: '1px solid #FFD0D0',
              borderRadius: 10, fontFamily: 'var(--sans)', fontSize: 13, color: '#C33',
            }}>{error}</motion.div>
          )}

          <motion.button
            whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.98 }}
            onClick={async () => { try { await signInWithGoogle() } catch (e: any) { setError(e.message) } }}
            style={{
              width: '100%', padding: '12px',
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

          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 20 }}>
            <div style={{ flex: 1, height: 1, backgroundColor: 'var(--line-2)' }} />
            <span style={{ fontFamily: 'var(--sans)', fontSize: 12, color: 'var(--ink-3)' }}>or email</span>
            <div style={{ flex: 1, height: 1, backgroundColor: 'var(--line-2)' }} />
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 18, marginBottom: 24 }}>
            {[
              { label: 'Full Name', key: 'name', type: 'text', placeholder: 'Priya Sharma' },
              { label: 'Email', key: 'email', type: 'email', placeholder: 'you@email.com' },
            ].map(f => (
              <div key={f.key}>
                <label style={{
                  display: 'block', fontFamily: 'var(--sans)', fontSize: 11, fontWeight: 700,
                  letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--ink-3)', marginBottom: 7,
                }}>{f.label}</label>
                <input
                  type={f.type} placeholder={f.placeholder}
                  value={(form as any)[f.key]}
                  onChange={e => set(f.key, e.target.value)}
                  style={{
                    width: '100%', padding: '11px 14px',
                    border: '1.5px solid var(--line-2)', borderRadius: 10,
                    fontFamily: 'var(--sans)', fontSize: 14,
                    color: 'var(--ink)', background: 'rgba(255,255,255,0.8)',
                    outline: 'none', boxSizing: 'border-box',
                  }}
                  onFocus={e => e.target.style.borderColor = 'var(--accent)'}
                  onBlur={e => e.target.style.borderColor = 'var(--line-2)'}
                />
              </div>
            ))}

            <div>
              <label style={{
                display: 'block', fontFamily: 'var(--sans)', fontSize: 11, fontWeight: 700,
                letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--ink-3)', marginBottom: 7,
              }}>Password</label>
              <div style={{ position: 'relative' }}>
                <input
                  type={show ? 'text' : 'password'}
                  placeholder="Min. 8 characters"
                  value={form.password}
                  onChange={e => set('password', e.target.value)}
                  style={{
                    width: '100%', padding: '11px 40px 11px 14px',
                    border: '1.5px solid var(--line-2)', borderRadius: 10,
                    fontFamily: 'var(--sans)', fontSize: 14,
                    color: 'var(--ink)', background: 'rgba(255,255,255,0.8)',
                    outline: 'none', boxSizing: 'border-box',
                  }}
                  onFocus={e => e.target.style.borderColor = 'var(--accent)'}
                  onBlur={e => e.target.style.borderColor = 'var(--line-2)'}
                />
                <button onClick={() => setShow(!show)} style={{
                  position: 'absolute', right: 10, top: '50%', transform: 'translateY(-50%)',
                  background: 'none', border: 'none', cursor: 'pointer', color: 'var(--ink-3)', display: 'flex',
                }}>
                  {show ? <EyeOff size={15} /> : <Eye size={15} />}
                </button>
              </div>
              {form.password.length > 0 && (
                <div style={{ marginTop: 8 }}>
                  <div style={{ height: 3, borderRadius: 99, backgroundColor: 'var(--line)', overflow: 'hidden' }}>
                    <motion.div
                      animate={{ width: `${(strength / 3) * 100}%` }}
                      style={{ height: '100%', backgroundColor: strengthColor, borderRadius: 99, transition: 'all 0.3s' }}
                    />
                  </div>
                  <p style={{ fontFamily: 'var(--sans)', fontSize: 11, color: strengthColor, marginTop: 4 }}>
                    {strengthLabel}
                  </p>
                </div>
              )}
            </div>
          </div>

          <motion.button
            whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.97 }}
            onClick={handleSubmit}
            disabled={loading}
            className="grad-btn"
            style={{
              width: '100%', padding: '14px', borderRadius: 12,
              fontSize: 15, opacity: loading ? 0.7 : 1,
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
              marginBottom: 16,
            }}
          >
            {loading ? 'Creating...' : <>Create Account <ArrowRight size={15} /></>}
          </motion.button>

          <p style={{ textAlign: 'center', fontFamily: 'var(--sans)', fontSize: 14, color: 'var(--ink-3)' }}>
            Already have an account?{' '}
            <Link to="/login" style={{ color: 'var(--accent)', fontWeight: 700 }}>Sign in</Link>
          </p>
        </motion.div>
      </div>
    </div>
  )
}

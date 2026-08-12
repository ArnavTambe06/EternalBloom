import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Eye, EyeOff, AlertCircle, CheckCircle } from 'lucide-react'
import { signUpWithEmail, signInWithGoogle } from '@/services/auth'

const inputStyle: React.CSSProperties = {
  width: '100%', padding: '12px 0',
  border: 'none',
  borderBottom: '1.5px solid var(--border)',
  backgroundColor: 'transparent',
  fontFamily: 'var(--font-body)',
  fontSize: 15, color: 'var(--on-surface)',
  outline: 'none', boxSizing: 'border-box',
  transition: 'border-color 0.2s',
}

const labelStyle: React.CSSProperties = {
  display: 'block',
  fontFamily: 'var(--font-body)',
  fontSize: 11, fontWeight: 700,
  letterSpacing: '0.1em', textTransform: 'uppercase',
  color: 'var(--on-surface-muted)', marginBottom: 8,
}

export function RegisterPage() {
  const [show, setShow] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)
  const [form, setForm] = useState({ name: '', email: '', password: '' })
  const navigate = useNavigate()
  const set = (k: string, v: string) => setForm(f => ({ ...f, [k]: v }))

  const validate = () => {
    if (!form.name.trim()) return 'Please enter your name.'
    if (!form.email.trim()) return 'Please enter your email.'
    if (form.password.length < 8) return 'Password must be at least 8 characters.'
    return ''
  }

  const handleSubmit = async () => {
    const err = validate()
    if (err) { setError(err); return }
    setLoading(true)
    setError('')
    try {
      await signUpWithEmail(form.email, form.password, form.name)
      setSuccess(true)
    } catch (err: any) {
      setError(err.message || 'Something went wrong. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const handleGoogle = async () => {
    try { await signInWithGoogle() }
    catch (err: any) { setError(err.message) }
  }

  if (success) {
    return (
      <div style={{
        minHeight: '100vh',
        background: 'radial-gradient(ellipse at 70% 30%, rgba(255,200,162,0.2) 0%, transparent 60%), var(--surface)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        padding: 24,
      }}>
        <motion.div
          initial={{ opacity: 0, scale: 0.92 }}
          animate={{ opacity: 1, scale: 1 }}
          style={{
            backgroundColor: 'var(--surface-white)',
            borderRadius: 24, padding: '48px 40px',
            maxWidth: 420, width: '100%',
            textAlign: 'center',
            boxShadow: '0 8px 48px rgba(212,72,154,0.1)',
            border: '1px solid var(--border)',
          }}
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
            style={{
              width: 64, height: 64, borderRadius: '50%',
              background: 'var(--primary-gradient)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              margin: '0 auto 20px',
              boxShadow: '0 4px 20px rgba(255,133,208,0.4)',
            }}
          >
            <CheckCircle size={28} color="var(--on-surface)" />
          </motion.div>

          <h2 style={{
            fontFamily: 'var(--font-display)',
            fontSize: 26, fontWeight: 700,
            color: 'var(--on-surface)', marginBottom: 12,
          }}>Check your email!</h2>
          <p style={{
            fontFamily: 'var(--font-body)',
            fontSize: 14, color: 'var(--on-surface-muted)',
            lineHeight: 1.65, marginBottom: 28,
          }}>
            We've sent a confirmation link to{' '}
            <strong style={{ color: 'var(--primary)' }}>{form.email}</strong>.
            Click it to activate your account.
          </p>
          <Link to="/login">
            <button style={{
              padding: '13px 32px',
              background: 'var(--primary-gradient)',
              border: 'none', borderRadius: 12,
              fontFamily: 'var(--font-body)',
              fontSize: 14, fontWeight: 700,
              color: 'var(--on-surface)', cursor: 'pointer',
            }}>
              Go to Login
            </button>
          </Link>
        </motion.div>
      </div>
    )
  }

  return (
    <div style={{
      minHeight: '100vh',
      background: 'radial-gradient(ellipse at 70% 30%, rgba(255,200,162,0.2) 0%, transparent 60%), var(--surface)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      padding: 24,
    }}>
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        style={{
          backgroundColor: 'var(--surface-white)',
          borderRadius: 24, padding: '44px 40px',
          width: '100%', maxWidth: 420,
          boxShadow: '0 8px 48px rgba(212,72,154,0.1)',
          border: '1px solid var(--border)',
        }}
      >
        <div style={{ textAlign: 'center', marginBottom: 32 }}>
          <div style={{
            width: 52, height: 52, borderRadius: '50%',
            background: 'var(--primary-gradient)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            margin: '0 auto 14px',
            fontFamily: 'var(--font-display)',
            color: 'var(--on-surface)', fontWeight: 700, fontSize: 17,
            boxShadow: '0 4px 16px rgba(255,133,208,0.4)',
          }}>EB</div>
          <h1 style={{
            fontFamily: 'var(--font-display)',
            fontSize: 24, fontWeight: 700,
            color: 'var(--on-surface)', marginBottom: 4,
          }}>Create account</h1>
          <p style={{
            fontFamily: 'var(--font-body)',
            fontSize: 14, color: 'var(--on-surface-muted)',
          }}>Join Eternal Bloom today</p>
        </div>

        {error && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            style={{
              display: 'flex', alignItems: 'center', gap: 8,
              padding: '12px 16px', marginBottom: 20,
              backgroundColor: '#FFF0F0',
              border: '1px solid #FFD0D0',
              borderRadius: 10,
            }}
          >
            <AlertCircle size={15} color="#D44" />
            <p style={{ fontFamily: 'var(--font-body)', fontSize: 13, color: '#C33' }}>
              {error}
            </p>
          </motion.div>
        )}

        <motion.button
          whileHover={{ scale: 1.01 }}
          whileTap={{ scale: 0.98 }}
          onClick={handleGoogle}
          style={{
            width: '100%', padding: '13px',
            border: '1.5px solid var(--border)',
            borderRadius: 12, backgroundColor: 'white',
            cursor: 'pointer',
            display: 'flex', alignItems: 'center',
            justifyContent: 'center', gap: 10,
            fontFamily: 'var(--font-body)',
            fontSize: 14, fontWeight: 500,
            color: 'var(--on-surface)', marginBottom: 24,
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
          <div style={{ flex: 1, height: 1, backgroundColor: 'var(--border)' }} />
          <span style={{ fontFamily: 'var(--font-body)', fontSize: 12, color: 'var(--on-surface-faint)' }}>
            or register with email
          </span>
          <div style={{ flex: 1, height: 1, backgroundColor: 'var(--border)' }} />
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 24, marginBottom: 28 }}>
          {[
            { label: 'Full Name', key: 'name', type: 'text', placeholder: 'Priya Sharma' },
            { label: 'Email', key: 'email', type: 'email', placeholder: 'you@email.com' },
          ].map(f => (
            <div key={f.key}>
              <label style={labelStyle}>{f.label}</label>
              <input
                type={f.type}
                placeholder={f.placeholder}
                value={(form as any)[f.key]}
                onChange={e => set(f.key, e.target.value)}
                style={inputStyle}
                onFocus={e => e.target.style.borderBottomColor = 'var(--primary)'}
                onBlur={e => e.target.style.borderBottomColor = 'var(--border)'}
              />
            </div>
          ))}

          <div>
            <label style={labelStyle}>Password</label>
            <div style={{ position: 'relative' }}>
              <input
                type={show ? 'text' : 'password'}
                placeholder="Min. 8 characters"
                value={form.password}
                onChange={e => set('password', e.target.value)}
                style={{ ...inputStyle, paddingRight: 36 }}
                onFocus={e => e.target.style.borderBottomColor = 'var(--primary)'}
                onBlur={e => e.target.style.borderBottomColor = 'var(--border)'}
              />
              <button
                onClick={() => setShow(!show)}
                style={{
                  position: 'absolute', right: 0, top: '50%',
                  transform: 'translateY(-50%)',
                  background: 'none', border: 'none',
                  cursor: 'pointer', color: 'var(--on-surface-faint)',
                  display: 'flex', alignItems: 'center',
                }}
              >
                {show ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
            {/* Password strength */}
            {form.password.length > 0 && (
              <div style={{ marginTop: 8 }}>
                <div style={{
                  height: 3, borderRadius: 99,
                  backgroundColor: 'var(--border)',
                  overflow: 'hidden',
                }}>
                  <div style={{
                    height: '100%',
                    width: form.password.length < 6 ? '30%'
                      : form.password.length < 8 ? '60%' : '100%',
                    background: form.password.length < 6 ? '#FFB3B3'
                      : form.password.length < 8 ? 'var(--peach)' : 'var(--primary-gradient)',
                    borderRadius: 99,
                    transition: 'all 0.3s',
                  }} />
                </div>
                <p style={{
                  fontFamily: 'var(--font-body)',
                  fontSize: 11, color: 'var(--on-surface-muted)',
                  marginTop: 4,
                }}>
                  {form.password.length < 6 ? 'Too short'
                    : form.password.length < 8 ? 'Almost there'
                    : '✓ Strong password'}
                </p>
              </div>
            )}
          </div>
        </div>

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
            color: 'var(--on-surface)',
            cursor: loading ? 'not-allowed' : 'pointer',
            opacity: loading ? 0.7 : 1,
            marginBottom: 20,
            boxShadow: '0 4px 20px rgba(255,133,208,0.35)',
            display: 'flex', alignItems: 'center',
            justifyContent: 'center', gap: 8,
          }}
        >
          {loading && (
            <div style={{
              width: 16, height: 16, borderRadius: '50%',
              border: '2px solid rgba(61,26,46,0.3)',
              borderTopColor: 'var(--on-surface)',
              animation: 'spin 0.7s linear infinite',
            }} />
          )}
          {loading ? 'Creating account...' : 'Create Account'}
        </motion.button>

        <p style={{
          textAlign: 'center',
          fontFamily: 'var(--font-body)',
          fontSize: 14, color: 'var(--on-surface-muted)',
        }}>
          Already have an account?{' '}
          <Link to="/login" style={{ color: 'var(--primary)', fontWeight: 700 }}>
            Sign in
          </Link>
        </p>

        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </motion.div>
    </div>
  )
}
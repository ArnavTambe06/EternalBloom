import { useState } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Eye, EyeOff, AlertCircle } from 'lucide-react'
import { signInWithEmail, signInWithGoogle } from '@/services/auth'

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

export function LoginPage() {
  const [show, setShow] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [form, setForm] = useState({ email: '', password: '' })
  const navigate = useNavigate()
  const location = useLocation()
  const from = (location.state as any)?.from?.pathname || '/'

  const handleSubmit = async () => {
    if (!form.email || !form.password) {
      setError('Please fill in all fields.')
      return
    }
    setLoading(true)
    setError('')
    try {
      await signInWithEmail(form.email, form.password)
      navigate(from, { replace: true })
    } catch (err: any) {
      setError(err.message || 'Invalid email or password.')
    } finally {
      setLoading(false)
    }
  }

  const handleGoogle = async () => {
    try {
      await signInWithGoogle()
    } catch (err: any) {
      setError(err.message)
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') handleSubmit()
  }

  return (
    <div style={{
      minHeight: '100vh',
      background: 'radial-gradient(ellipse at 30% 20%, rgba(255,133,208,0.15) 0%, transparent 60%), var(--surface)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      padding: 24,
    }}>
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        style={{
          backgroundColor: 'var(--surface-white)',
          borderRadius: 24,
          padding: '44px 40px',
          width: '100%', maxWidth: 420,
          boxShadow: '0 8px 48px rgba(212,72,154,0.1)',
          border: '1px solid var(--border)',
        }}
      >
        {/* Logo */}
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
          }}>Welcome back</h1>
          <p style={{
            fontFamily: 'var(--font-body)',
            fontSize: 14, color: 'var(--on-surface-muted)',
          }}>Sign in to your Eternal Bloom account</p>
        </div>

        {/* Error */}
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
            <p style={{
              fontFamily: 'var(--font-body)',
              fontSize: 13, color: '#C33',
            }}>{error}</p>
          </motion.div>
        )}

        {/* Google */}
        <motion.button
          whileHover={{ scale: 1.01 }}
          whileTap={{ scale: 0.98 }}
          onClick={handleGoogle}
          style={{
            width: '100%', padding: '13px',
            border: '1.5px solid var(--border)',
            borderRadius: 12,
            backgroundColor: 'white', cursor: 'pointer',
            display: 'flex', alignItems: 'center',
            justifyContent: 'center', gap: 10,
            fontFamily: 'var(--font-body)',
            fontSize: 14, fontWeight: 500,
            color: 'var(--on-surface)', marginBottom: 24,
            transition: 'border-color 0.2s',
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

        {/* Divider */}
        <div style={{
          display: 'flex', alignItems: 'center', gap: 12, marginBottom: 24,
        }}>
          <div style={{ flex: 1, height: 1, backgroundColor: 'var(--border)' }} />
          <span style={{
            fontFamily: 'var(--font-body)',
            fontSize: 12, color: 'var(--on-surface-faint)',
          }}>or continue with email</span>
          <div style={{ flex: 1, height: 1, backgroundColor: 'var(--border)' }} />
        </div>

        {/* Fields */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 24, marginBottom: 28 }}>
          <div>
            <label style={labelStyle}>Email</label>
            <input
              type="email"
              placeholder="you@email.com"
              value={form.email}
              onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
              onKeyDown={handleKeyDown}
              style={inputStyle}
              onFocus={e => e.target.style.borderBottomColor = 'var(--primary)'}
              onBlur={e => e.target.style.borderBottomColor = 'var(--border)'}
            />
          </div>

          <div>
            <label style={labelStyle}>Password</label>
            <div style={{ position: 'relative' }}>
              <input
                type={show ? 'text' : 'password'}
                placeholder="••••••••"
                value={form.password}
                onChange={e => setForm(f => ({ ...f, password: e.target.value }))}
                onKeyDown={handleKeyDown}
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
            <div style={{ textAlign: 'right', marginTop: 8 }}>
              <Link to="/forgot-password" style={{
                fontFamily: 'var(--font-body)',
                fontSize: 12, color: 'var(--primary)',
                fontWeight: 500,
              }}>Forgot password?</Link>
            </div>
          </div>
        </div>

        {/* Submit */}
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
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
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
          {loading ? 'Signing in...' : 'Sign In'}
        </motion.button>

        <p style={{
          textAlign: 'center',
          fontFamily: 'var(--font-body)',
          fontSize: 14, color: 'var(--on-surface-muted)',
        }}>
          Don't have an account?{' '}
          <Link to="/register" style={{
            color: 'var(--primary)', fontWeight: 700,
          }}>Sign up</Link>
        </p>

        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </motion.div>
    </div>
  )
}
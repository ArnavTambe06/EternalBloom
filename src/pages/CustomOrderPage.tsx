import { useState, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Send, CheckCircle, X, ArrowRight,
  Sparkles, ExternalLink, Upload,
  Link as LinkIcon, Plus,
} from 'lucide-react'
import { CATEGORIES } from '@/lib/constants'
import { submitCustomOrder } from '@/services/customOrders'
import { uploadMultipleImages } from '@/services/cloudinary'
import { useAuth } from '@/hooks/useAuth'

const PINTEREST_URL = 'https://www.pinterest.com/eternalbloom_in/'

const budgetOptions = [
  { label: 'Under ₹500',       sub: 'Keychains, cards' },
  { label: '₹500 – ₹1,000',   sub: 'Desk buddies, accessories' },
  { label: '₹1,000 – ₹2,000', sub: 'Bouquets, lamps, sets' },
  { label: '₹2,000+',          sub: 'Fully custom, large pieces' },
  { label: 'Surprise me',      sub: 'We\'ll suggest the best fit' },
]

const occasions = [
  'Birthday', 'Anniversary', 'Wedding', 'Baby Shower',
  'Just Because', 'Home Decor', 'Friendship', 'Self-love',
]

const steps = ['Your details', 'Style & images', 'Review & send']

/* ── Shared input style ── */
const field: React.CSSProperties = {
  width: '100%',
  padding: '13px 16px',
  border: '1.5px solid rgba(232,163,185,0.22)',
  borderRadius: 12,
  fontFamily: 'DM Sans, sans-serif',
  fontSize: 15, color: '#241B20',
  backgroundColor: 'rgba(255,255,255,0.9)',
  outline: 'none',
  boxSizing: 'border-box',
  transition: 'border-color 0.2s, box-shadow 0.2s',
}

const focusField = (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
  e.target.style.borderColor = '#E8A3B9'
  e.target.style.boxShadow = '0 0 0 3px rgba(232,163,185,0.12)'
}
const blurField = (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
  e.target.style.borderColor = 'rgba(232,163,185,0.22)'
  e.target.style.boxShadow = 'none'
}

const lbl: React.CSSProperties = {
  display: 'block',
  fontFamily: 'DM Sans, sans-serif',
  fontSize: 11, fontWeight: 700,
  letterSpacing: '0.12em', textTransform: 'uppercase',
  color: '#8C665D', marginBottom: 8,
}

export function CustomOrderPage() {
  const { user } = useAuth()
  const [step, setStep] = useState(0)
  const [submitted, setSubmitted] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState('')

  const [localFiles, setLocalFiles] = useState<File[]>([])
  const [cloudUrls, setCloudUrls] = useState<string[]>([])
  const [uploading, setUploading] = useState(false)
  const [pastedUrl, setPastedUrl] = useState('')
  const [pastedUrls, setPastedUrls] = useState<string[]>([])
  const [urlError, setUrlError] = useState('')
  const fileRef = useRef<HTMLInputElement>(null)

  const [form, setForm] = useState({
    name: user?.user_metadata?.full_name || '',
    email: user?.email || '',
    phone: '',
    category: '',
    description: '',
    budget: '',
    occasion: '',
  })
  const set = (k: string, v: string) => setForm(f => ({ ...f, [k]: v }))

  const handleFiles = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files?.length) return
    const files = Array.from(e.target.files)
    setLocalFiles(p => [...p, ...files])
    setUploading(true)
    try {
      const urls = await uploadMultipleImages(files, 'eternal-bloom/custom-orders')
      setCloudUrls(p => [...p, ...urls])
    } catch { /* local preview still shown */ }
    setUploading(false)
    if (fileRef.current) fileRef.current.value = ''
  }

  const addPastedUrl = () => {
    const url = pastedUrl.trim()
    if (!url) return
    if (!url.startsWith('http')) { setUrlError('Enter a valid URL starting with https://'); return }
    setPastedUrls(p => [...p, url])
    setCloudUrls(p => [...p, url])
    setPastedUrl('')
    setUrlError('')
  }

  const removeFile = (i: number) => {
    setLocalFiles(f => f.filter((_, idx) => idx !== i))
    setCloudUrls(u => u.filter((_, idx) => idx !== i))
  }

  const removePastedUrl = (i: number) => {
    setPastedUrls(p => p.filter((_, idx) => idx !== i))
    const offset = localFiles.length
    setCloudUrls(u => u.filter((_, idx) => idx !== offset + i))
  }

  const allImages = [...localFiles.map((f, i) => ({ type: 'file' as const, file: f, idx: i })),
    ...pastedUrls.map((url, i) => ({ type: 'url' as const, url, idx: i }))]

  const handleSubmit = async () => {
    setSubmitting(true); setSubmitError('')
    try {
      await submitCustomOrder({
        userId: user?.id,
        name: form.name, email: form.email,
        phone: form.phone || undefined,
        category: form.category || undefined,
        description: form.description,
        budget: form.budget || undefined,
        occasion: form.occasion || undefined,
        referenceImages: cloudUrls,
      })
      setSubmitted(true)
    } catch (err: any) {
      setSubmitError(err?.message || 'Something went wrong. Please try again.')
    } finally { setSubmitting(false) }
  }

  const reset = () => {
    setSubmitted(false); setStep(0)
    setForm({ name: '', email: '', phone: '', category: '', description: '', budget: '', occasion: '' })
    setLocalFiles([]); setCloudUrls([]); setPastedUrls([]); setPastedUrl(''); setSubmitError('')
  }

  /* ── Success ── */
  if (submitted) {
    return (
      <div style={{
        minHeight: '80vh', display: 'flex',
        alignItems: 'center', justifyContent: 'center',
        padding: 24, position: 'relative', zIndex: 1,
      }}>
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ type: 'spring', stiffness: 200, damping: 22 }}
          style={{
            maxWidth: 480, width: '100%', textAlign: 'center',
            background: 'rgba(255,255,255,0.85)',
            backdropFilter: 'blur(20px)',
            border: '1px solid rgba(232,163,185,0.2)',
            borderRadius: 32, padding: '64px 52px',
            boxShadow: '0 24px 64px rgba(232,163,185,0.15)',
          }}
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.15, type: 'spring', stiffness: 240 }}
            style={{
              width: 80, height: 80,
              background: 'linear-gradient(135deg,#E8A3B9,#F4C6A8,#F4DF9A)',
              borderRadius: '50%', margin: '0 auto 24px',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              boxShadow: '0 12px 32px rgba(232,163,185,0.4)',
            }}
          >
            <CheckCircle size={36} color="#241B20" strokeWidth={2} />
          </motion.div>

          <p style={{
            fontFamily: 'DM Sans, sans-serif', fontSize: 11,
            fontWeight: 700, letterSpacing: '0.18em', textTransform: 'uppercase',
            color: '#8C665D', marginBottom: 12,
          }}>Request Received</p>

          <h2 style={{
            fontFamily: 'Playfair Display, serif',
            fontSize: 32, fontWeight: 700, color: '#241B20',
            letterSpacing: '-0.02em', marginBottom: 16,
          }}>We'll be in touch!</h2>

         // In the success screen, replace the description paragraph:
<p style={{
  fontFamily: 'DM Sans, sans-serif',
  fontSize: 15, color: '#5C4033', lineHeight: 1.7, marginBottom: 32,
}}>
  Thank you, <strong style={{ color: '#241B20' }}>{form.name}</strong>!
  We've received your request and will{' '}
  <strong style={{ color: '#25D366' }}>contact you on WhatsApp</strong>{' '}
  on <strong style={{ color: '#241B20' }}>{form.phone || 'the number you provided'}</strong>{' '}
  within 24 hours with a personalised quote.
</p>

{/* WhatsApp contact card */}
<div style={{
  display: 'flex', alignItems: 'center', gap: 12,
  padding: '14px 18px',
  backgroundColor: 'rgba(37,211,102,0.08)',
  border: '1px solid rgba(37,211,102,0.25)',
  borderRadius: 12, marginBottom: 28,
}}>
  {/* WhatsApp icon */}
  <div style={{
    width: 36, height: 36, borderRadius: '50%',
    backgroundColor: '#25D366',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    flexShrink: 0,
  }}>
    <svg width="18" height="18" viewBox="0 0 24 24" fill="white">
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
    </svg>
  </div>
  <div>
    <p style={{ fontFamily: 'DM Sans, sans-serif', fontSize: 13, fontWeight: 600, color: '#241B20', marginBottom: 2 }}>
      We'll WhatsApp you
    </p>
    <p style={{ fontFamily: 'DM Sans, sans-serif', fontSize: 12, color: '#5C4033' }}>
      {form.phone ? `on ${form.phone}` : 'on the number you shared'} within 24 hours
    </p>
  </div>
</div>

          <button onClick={reset} style={{
            padding: '13px 32px', borderRadius: 999,
            background: 'linear-gradient(135deg,#E8A3B9,#F4C6A8,#F4DF9A)',
            border: 'none', cursor: 'pointer',
            fontFamily: 'DM Sans, sans-serif',
            fontSize: 14, fontWeight: 700, color: '#241B20',
            boxShadow: '0 4px 16px rgba(232,163,185,0.3)',
          }}>Submit Another</button>
        </motion.div>
      </div>
    )
  }

  /* ── Main ── */
  return (
    <div className="custom-order-page" style={{ position: 'relative', zIndex: 1 }}>

      {/* ── Hero ── */}
      <div className="custom-order-hero" style={{ padding: '80px 0 56px', textAlign: 'center' }}>
        <div className="custom-order-hero__inner" style={{ maxWidth: 1200, margin: '0 auto', padding: '0 48px' }}>
          <motion.span
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            style={{
              display: 'inline-flex', alignItems: 'center', gap: 8,
              padding: '6px 18px', borderRadius: 999,
              background: 'rgba(255,255,255,0.75)',
              backdropFilter: 'blur(12px)',
              border: '1px solid rgba(232,163,185,0.25)',
              fontFamily: 'DM Sans, sans-serif', fontSize: 12,
              fontWeight: 600, color: '#9E5E73',
              marginBottom: 20, letterSpacing: '0.04em',
            }}
          >
            <Sparkles size={13} /> Made just for you
          </motion.span>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.08 }}
            style={{
              fontFamily: 'Playfair Display, serif',
              fontSize: 'clamp(42px,6vw,80px)',
              fontWeight: 700, color: '#241B20',
              letterSpacing: '-0.03em', lineHeight: 1.05, marginBottom: 18,
            }}
          >
            Your Vision,{' '}
            <em style={{
              fontStyle: 'italic',
              background: 'linear-gradient(135deg,#E8A3B9,#F4C6A8,#F4DF9A)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
            }}>Our Craft.</em>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.14 }}
            style={{
              fontFamily: 'DM Sans, sans-serif',
              fontSize: 17, color: '#5C4033', lineHeight: 1.65,
              maxWidth: 460, margin: '0 auto',
            }}
          >
            Describe what you have in mind and we'll handcraft something
            that's entirely, permanently yours.
          </motion.p>
        </div>
      </div>

      {/* ── Step indicator ── */}
      <div className="custom-order-steps" style={{ maxWidth: 740, margin: '0 auto', padding: '0 24px 40px' }}>
        <div className="custom-order-steps__track" style={{ display: 'flex', alignItems: 'center' }}>
          {steps.map((s, i) => (
            <div key={s} className="custom-order-step" style={{
              display: 'flex', alignItems: 'center',
              flex: i < steps.length - 1 ? 1 : 'none',
            }}>
              <div className="custom-order-step__content" style={{ display: 'flex', alignItems: 'center', gap: 10, flexShrink: 0 }}>
                <div style={{
                  width: 32, height: 32,
                  background: i <= step
                    ? 'linear-gradient(135deg,#E8A3B9,#F4C6A8)'
                    : 'rgba(255,255,255,0.7)',
                  border: i <= step ? 'none' : '1.5px solid rgba(232,163,185,0.3)',
                  borderRadius: '50%',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontFamily: 'DM Sans, sans-serif',
                  fontSize: 13, fontWeight: 700,
                  color: i <= step ? '#241B20' : '#8C665D',
                  transition: 'all 0.3s',
                  boxShadow: i <= step ? '0 4px 14px rgba(232,163,185,0.35)' : 'none',
                }}>
                  {i < step ? '✓' : i + 1}
                </div>
                <span className="custom-order-step__label" style={{
                  fontFamily: 'DM Sans, sans-serif',
                  fontSize: 11, fontWeight: 700,
                  letterSpacing: '0.1em', textTransform: 'uppercase',
                  color: i <= step ? '#241B20' : '#8C665D',
                  whiteSpace: 'nowrap', transition: 'color 0.3s',
                }}>{s}</span>
              </div>
              {i < steps.length - 1 && (
                <div className="custom-order-step__connector" style={{
                  flex: 1, height: 1.5, margin: '0 16px',
                  background: i < step
                    ? 'linear-gradient(90deg,#E8A3B9,#F4C6A8)'
                    : 'rgba(232,163,185,0.2)',
                  transition: 'all 0.3s',
                }} />
              )}
            </div>
          ))}
        </div>
      </div>

      {/* ── Form ── */}
      <div className="custom-order-form" style={{ maxWidth: 740, margin: '0 auto', padding: '0 24px 96px' }}>
        <AnimatePresence mode="wait">

          {/* STEP 0 — Details */}
          {step === 0 && (
            <motion.div
              key="s0"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.22 }}
              className="custom-order-card"
              style={{
                background: 'rgba(255,255,255,0.82)',
                border: '1px solid rgba(232,163,185,0.18)',
                borderRadius: 24,
                overflow: 'hidden',
                boxShadow: '0 8px 40px rgba(232,163,185,0.1)',
              }}
            >
              {/* Card header stripe */}
              <div style={{
                height: 4,
                background: 'linear-gradient(90deg,#E8A3B9,#F4C6A8,#F4DF9A)',
              }} />

              <div className="custom-order-card__body" style={{ padding: '36px 40px' }}>
                <h2 style={{
                  fontFamily: 'Playfair Display, serif',
                  fontSize: 24, fontWeight: 600, color: '#241B20',
                  letterSpacing: '-0.02em', marginBottom: 6,
                }}>Tell us about yourself</h2>
                <p style={{
                  fontFamily: 'DM Sans, sans-serif',
                  fontSize: 14, color: '#8C665D', marginBottom: 32,
                }}>We'll reach out to you with a personalised quote.</p>

                <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
                  <div className="custom-order-field-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                    {[
                      { label: 'Full Name *', key: 'name', type: 'text', ph: 'Priya Sharma' },
                      { label: 'Email *', key: 'email', type: 'email', ph: 'priya@email.com' },
                    ].map(f => (
                      <div key={f.key}>
                        <label style={lbl}>{f.label}</label>
                        <input
                          type={f.type} placeholder={f.ph}
                          value={(form as any)[f.key]}
                          onChange={e => set(f.key, e.target.value)}
                          style={field}
                          onFocus={focusField} onBlur={blurField}
                        />
                      </div>
                    ))}
                  </div>

                  <div className="custom-order-field-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                    <div>
                      <label style={lbl}>Phone</label>
                      <input
                        type="tel" placeholder="+91 98765 43210"
                        value={form.phone}
                        onChange={e => set('phone', e.target.value)}
                        style={field} onFocus={focusField} onBlur={blurField}
                      />
                    </div>
                    <div>
                      <label style={lbl}>Category</label>
                      <select
                        value={form.category}
                        onChange={e => set('category', e.target.value)}
                        style={{ ...field, cursor: 'pointer', color: form.category ? '#241B20' : '#8C665D' }}
                        onFocus={focusField} onBlur={blurField}
                      >
                        <option value="">Select a category</option>
                        {CATEGORIES.map(c => (
                          <option key={c.slug} value={c.slug}>{c.name}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div>
                    <label style={lbl}>Describe your vision *</label>
                    <textarea
                      rows={5}
                      placeholder="Tell us what you have in mind — colours, flowers, who it's for, any special meaning behind it..."
                      value={form.description}
                      onChange={e => set('description', e.target.value)}
                      style={{ ...field, resize: 'none', lineHeight: 1.65 }}
                      onFocus={focusField} onBlur={blurField}
                    />
                  </div>
                </div>

                <div style={{ marginTop: 32 }}>
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.97 }}
                    onClick={() => {
                      if (!form.name.trim() || !form.email.trim() || !form.description.trim()) {
                        alert('Please fill Name, Email and Vision.')
                        return
                      }
                      setStep(1)
                    }}
                    style={{
                      display: 'inline-flex', alignItems: 'center', gap: 10,
                      padding: '14px 32px', borderRadius: 999,
                      background: 'linear-gradient(135deg,#E8A3B9,#F4C6A8,#F4DF9A)',
                      border: 'none', cursor: 'pointer',
                      fontFamily: 'DM Sans, sans-serif',
                      fontSize: 13, fontWeight: 700, color: '#241B20',
                      letterSpacing: '0.06em', textTransform: 'uppercase',
                      boxShadow: '0 4px 18px rgba(232,163,185,0.3)',
                    }}
                  >Continue <ArrowRight size={15} /></motion.button>
                </div>
              </div>
            </motion.div>
          )}

          {/* STEP 1 — Style & images */}
          {step === 1 && (
            <motion.div
              key="s1"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.22 }}
              className="custom-order-form-stack"
              style={{ display: 'flex', flexDirection: 'column', gap: 16 }}
            >
              {/* Budget card */}
              <div className="custom-order-card" style={{
                background: 'rgba(255,255,255,0.82)',
                border: '1px solid rgba(232,163,185,0.18)',
                borderRadius: 24, overflow: 'hidden',
                boxShadow: '0 8px 40px rgba(232,163,185,0.08)',
              }}>
                <div style={{ height: 4, background: 'linear-gradient(90deg,#E8A3B9,#F4C6A8,#F4DF9A)' }} />
                <div className="custom-order-card__body" style={{ padding: '32px 40px' }}>
                  <h3 style={{
                    fontFamily: 'Playfair Display, serif',
                    fontSize: 20, fontWeight: 600, color: '#241B20',
                    marginBottom: 20,
                  }}>Budget Range</h3>
                  <div className="custom-order-budget-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
                    {budgetOptions.map(b => (
                      <motion.button
                        key={b.label}
                        whileHover={{ y: -2 }}
                        onClick={() => set('budget', b.label)}
                        style={{
                          padding: '14px 18px',
                          background: form.budget === b.label
                            ? 'linear-gradient(135deg,rgba(232,163,185,0.15),rgba(244,198,168,0.15))'
                            : 'rgba(255,255,255,0.6)',
                          border: `1.5px solid ${form.budget === b.label
                            ? '#E8A3B9' : 'rgba(232,163,185,0.18)'}`,
                          borderRadius: 14,
                          cursor: 'pointer', textAlign: 'left',
                          transition: 'all 0.2s',
                          boxShadow: form.budget === b.label
                            ? '0 4px 16px rgba(232,163,185,0.2)' : 'none',
                        }}
                      >
                        <p style={{
                          fontFamily: 'DM Sans, sans-serif',
                          fontSize: 14, fontWeight: 700,
                          color: form.budget === b.label ? '#9E5E73' : '#241B20',
                          marginBottom: 3,
                        }}>{b.label}</p>
                        <p style={{
                          fontFamily: 'DM Sans, sans-serif',
                          fontSize: 12, color: '#8C665D',
                        }}>{b.sub}</p>
                      </motion.button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Occasion card */}
              <div className="custom-order-card" style={{
                background: 'rgba(255,255,255,0.82)',
                border: '1px solid rgba(232,163,185,0.18)',
                borderRadius: 24, overflow: 'hidden',
                boxShadow: '0 4px 20px rgba(232,163,185,0.06)',
              }}>
                <div className="custom-order-card__body" style={{ padding: '28px 40px' }}>
                  <h3 style={{
                    fontFamily: 'Playfair Display, serif',
                    fontSize: 18, fontWeight: 600, color: '#241B20', marginBottom: 16,
                  }}>Occasion <span style={{ fontSize: 13, fontWeight: 400, color: '#8C665D' }}>optional</span></h3>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                    {occasions.map(o => (
                      <button
                        key={o}
                        onClick={() => set('occasion', form.occasion === o ? '' : o)}
                        style={{
                          padding: '8px 18px', borderRadius: 999,
                          background: form.occasion === o
                            ? 'linear-gradient(135deg,#E8A3B9,#F4C6A8)'
                            : 'transparent',
                          border: `1.5px solid ${form.occasion === o
                            ? 'transparent' : 'rgba(232,163,185,0.25)'}`,
                          fontFamily: 'DM Sans, sans-serif',
                          fontSize: 13, fontWeight: form.occasion === o ? 700 : 400,
                          color: form.occasion === o ? '#241B20' : '#5C4033',
                          cursor: 'pointer', transition: 'all 0.2s',
                        }}
                      >{o}</button>
                    ))}
                  </div>
                </div>
              </div>

              {/* ── Pinterest + images card — LUXURY ── */}
              <div className="custom-order-card" style={{
                background: 'rgba(255,255,255,0.82)',
                border: '1px solid rgba(232,163,185,0.18)',
                borderRadius: 24, overflow: 'hidden',
                boxShadow: '0 4px 20px rgba(232,163,185,0.06)',
              }}>
                <div className="custom-order-card__body" style={{ padding: '32px 40px' }}>
                  <h3 style={{
                    fontFamily: 'Playfair Display, serif',
                    fontSize: 20, fontWeight: 600, color: '#241B20',
                    marginBottom: 6,
                  }}>Reference Images</h3>
                  <p style={{
                    fontFamily: 'DM Sans, sans-serif',
                    fontSize: 14, color: '#8C665D', marginBottom: 28,
                  }}>Optional but helpful — share anything that inspires your vision.</p>

                  {/* ── Pinterest section ── */}
                  <div style={{
                    borderRadius: 18,
                    overflow: 'hidden',
                    border: '1px solid rgba(230,0,35,0.15)',
                    marginBottom: 20,
                  }}>
                    {/* Pinterest header */}
                    <div style={{
                      background: 'linear-gradient(135deg,rgba(230,0,35,0.06),rgba(230,0,35,0.02))',
                      padding: '20px 24px',
                      display: 'flex', alignItems: 'center',
                      justifyContent: 'space-between', flexWrap: 'wrap', gap: 16,
                      borderBottom: '1px solid rgba(230,0,35,0.1)',
                    }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                        <div style={{
                          width: 40, height: 40, borderRadius: '50%',
                          backgroundColor: '#E60023',
                          display: 'flex', alignItems: 'center', justifyContent: 'center',
                          flexShrink: 0,
                          boxShadow: '0 4px 12px rgba(230,0,35,0.3)',
                        }}>
                          <svg width="20" height="20" viewBox="0 0 24 24" fill="white">
                            <path d="M12 0C5.373 0 0 5.373 0 12c0 5.084 3.163 9.426 7.627 11.174-.105-.949-.2-2.405.042-3.441.218-.937 1.407-5.965 1.407-5.965s-.359-.719-.359-1.782c0-1.668.967-2.914 2.171-2.914 1.023 0 1.518.769 1.518 1.69 0 1.029-.655 2.568-.994 3.995-.283 1.194.599 2.169 1.777 2.169 2.133 0 3.772-2.249 3.772-5.495 0-2.873-2.064-4.882-5.012-4.882-3.414 0-5.418 2.561-5.418 5.207 0 1.031.397 2.138.893 2.738a.36.36 0 0 1 .083.345l-.333 1.36c-.053.22-.174.267-.402.161-1.499-.698-2.436-2.889-2.436-4.649 0-3.785 2.75-7.262 7.929-7.262 4.163 0 7.398 2.967 7.398 6.931 0 4.136-2.607 7.464-6.227 7.464-1.216 0-2.359-.632-2.75-1.378l-.748 2.853c-.271 1.043-1.002 2.35-1.492 3.146C9.57 23.812 10.763 24 12 24c6.627 0 12-5.373 12-12S18.627 0 12 0z" />
                          </svg>
                        </div>
                        <div>
                          <p style={{
                            fontFamily: 'DM Sans, sans-serif',
                            fontSize: 14, fontWeight: 700, color: '#241B20',
                          }}>Browse our Pinterest board for inspiration</p>
                          <p style={{
                            fontFamily: 'DM Sans, sans-serif',
                            fontSize: 12, color: '#8C665D',
                          }}>Right-click any image → Copy image address → paste below</p>
                        </div>
                      </div>
                      <motion.a
                        href={PINTEREST_URL}
                        target="_blank"
                        rel="noopener noreferrer"
                        whileHover={{ scale: 1.04 }}
                        whileTap={{ scale: 0.96 }}
                        style={{
                          display: 'inline-flex', alignItems: 'center', gap: 8,
                          padding: '10px 22px', borderRadius: 999,
                          backgroundColor: '#E60023', color: 'white',
                          fontFamily: 'DM Sans, sans-serif',
                          fontSize: 13, fontWeight: 600,
                          textDecoration: 'none',
                          boxShadow: '0 4px 14px rgba(230,0,35,0.3)',
                          flexShrink: 0,
                        }}
                      >
                        Open Board <ExternalLink size={12} />
                      </motion.a>
                    </div>

                    {/* URL paste input */}
                    <div style={{ padding: '18px 24px' }}>
                      <p style={{
                        fontFamily: 'DM Sans, sans-serif',
                        fontSize: 11, fontWeight: 700,
                        letterSpacing: '0.1em', textTransform: 'uppercase',
                        color: '#8C665D', marginBottom: 10,
                        display: 'flex', alignItems: 'center', gap: 6,
                      }}>
                        <LinkIcon size={12} /> Paste image URL from Pinterest
                      </p>
                      <div style={{ display: 'flex', gap: 8 }}>
                        <input
                          type="url"
                          placeholder="Right-click any image on our board → Copy image address → paste here"
                          value={pastedUrl}
                          onChange={e => { setPastedUrl(e.target.value); setUrlError('') }}
                          onKeyDown={e => e.key === 'Enter' && addPastedUrl()}
                          style={{
                            ...field, flex: 1, fontSize: 13,
                            padding: '11px 14px',
                          }}
                          onFocus={focusField} onBlur={blurField}
                        />
                        <motion.button
                          whileHover={{ scale: 1.04 }}
                          whileTap={{ scale: 0.96 }}
                          onClick={addPastedUrl}
                          style={{
                            padding: '11px 20px', borderRadius: 10,
                            background: 'linear-gradient(135deg,#E8A3B9,#F4C6A8)',
                            border: 'none', cursor: 'pointer',
                            fontFamily: 'DM Sans, sans-serif',
                            fontSize: 13, fontWeight: 700, color: '#241B20',
                            whiteSpace: 'nowrap', flexShrink: 0,
                            boxShadow: '0 3px 10px rgba(232,163,185,0.3)',
                            display: 'flex', alignItems: 'center', gap: 5,
                          }}
                        >
                          <Plus size={14} /> Add
                        </motion.button>
                      </div>
                      {urlError && (
                        <p style={{
                          fontFamily: 'DM Sans, sans-serif',
                          fontSize: 12, color: '#C33', marginTop: 6,
                        }}>{urlError}</p>
                      )}

                      {/* URL previews */}
                      {pastedUrls.length > 0 && (
                        <div style={{
                          display: 'flex', gap: 10,
                          flexWrap: 'wrap', marginTop: 14,
                        }}>
                          {pastedUrls.map((url, i) => (
                            <motion.div
                              key={i}
                              initial={{ opacity: 0, scale: 0.8 }}
                              animate={{ opacity: 1, scale: 1 }}
                              style={{ position: 'relative', width: 76, height: 76 }}
                            >
                              <img
                                src={url} alt=""
                                style={{
                                  width: '100%', height: '100%',
                                  objectFit: 'cover', borderRadius: 12,
                                  border: '2px solid rgba(232,163,185,0.4)',
                                }}
                                onError={e => {
                                  const el = e.target as HTMLImageElement
                                  el.style.display = 'none'
                                  if (el.parentElement) {
                                    el.parentElement.style.background = '#FEF0F3'
                                    el.parentElement.style.display = 'flex'
                                    el.parentElement.style.alignItems = 'center'
                                    el.parentElement.style.justifyContent = 'center'
                                    el.parentElement.innerHTML += '<span style="font-size:11px;color:#8C665D;padding:4px">No preview</span>'
                                  }
                                }}
                              />
                              <button
                                onClick={() => removePastedUrl(i)}
                                style={{
                                  position: 'absolute', top: -6, right: -6,
                                  width: 20, height: 20, borderRadius: '50%',
                                  backgroundColor: '#241B20', color: 'white',
                                  border: 'none', cursor: 'pointer',
                                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                                }}
                              ><X size={10} /></button>
                            </motion.div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* OR divider */}
                  <div style={{
                    display: 'flex', alignItems: 'center', gap: 16, marginBottom: 16,
                  }}>
                    <div style={{ flex: 1, height: 1, backgroundColor: 'rgba(232,163,185,0.2)' }} />
                    <span style={{
                      fontFamily: 'DM Sans, sans-serif',
                      fontSize: 12, color: '#8C665D', fontWeight: 500,
                    }}>or upload from your device</span>
                    <div style={{ flex: 1, height: 1, backgroundColor: 'rgba(232,163,185,0.2)' }} />
                  </div>

                  {/* File upload */}
                  <input
                    ref={fileRef} type="file" multiple accept="image/*"
                    onChange={handleFiles} style={{ display: 'none' }}
                  />
                  <div
                    onClick={() => fileRef.current?.click()}
                    style={{
                      border: '2px dashed rgba(232,163,185,0.3)',
                      borderRadius: 16, padding: '28px 24px',
                      textAlign: 'center', cursor: 'pointer',
                      background: 'rgba(255,255,255,0.5)',
                      transition: 'all 0.2s',
                    }}
                    onMouseEnter={e => {
                      e.currentTarget.style.borderColor = '#E8A3B9'
                      e.currentTarget.style.background = 'rgba(232,163,185,0.05)'
                    }}
                    onMouseLeave={e => {
                      e.currentTarget.style.borderColor = 'rgba(232,163,185,0.3)'
                      e.currentTarget.style.background = 'rgba(255,255,255,0.5)'
                    }}
                  >
                    <Upload size={22} color="#8C665D" style={{ margin: '0 auto 8px' }} />
                    <p style={{ fontFamily: 'DM Sans, sans-serif', fontSize: 14, color: '#5C4033' }}>
                      {uploading ? 'Uploading...' : (
                        <>Drop files or <span style={{ color: '#9E5E73', fontWeight: 600 }}>click to browse</span></>
                      )}
                    </p>
                    <p style={{ fontFamily: 'DM Sans, sans-serif', fontSize: 11, color: '#8C665D', marginTop: 4 }}>
                      PNG, JPG up to 5MB
                    </p>
                  </div>

                  {/* File previews */}
                  {localFiles.length > 0 && (
                    <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', marginTop: 16 }}>
                      {localFiles.map((file, i) => (
                        <motion.div
                          key={`${file.name}-${i}`}
                          initial={{ opacity: 0, scale: 0.8 }}
                          animate={{ opacity: 1, scale: 1 }}
                          style={{ position: 'relative', width: 76, height: 76 }}
                        >
                          <img
                            src={URL.createObjectURL(file)} alt=""
                            style={{
                              width: '100%', height: '100%',
                              objectFit: 'cover', borderRadius: 12,
                              border: '2px solid rgba(232,163,185,0.35)',
                            }}
                          />
                          {!cloudUrls[i] && (
                            <div style={{
                              position: 'absolute', inset: 0, borderRadius: 12,
                              backgroundColor: 'rgba(255,255,255,0.55)',
                              display: 'flex', alignItems: 'center', justifyContent: 'center',
                            }}>
                              <div style={{
                                width: 18, height: 18, borderRadius: '50%',
                                border: '2px solid rgba(232,163,185,0.3)',
                                borderTopColor: '#E8A3B9',
                                animation: 'spin 0.7s linear infinite',
                              }} />
                            </div>
                          )}
                          {cloudUrls[i] && (
                            <div style={{
                              position: 'absolute', bottom: 4, right: 4,
                              width: 18, height: 18, borderRadius: '50%',
                              background: 'linear-gradient(135deg,#E8A3B9,#F4C6A8)',
                              display: 'flex', alignItems: 'center', justifyContent: 'center',
                            }}>
                              <span style={{ fontSize: 10, color: '#241B20' }}>✓</span>
                            </div>
                          )}
                          <button
                            onClick={() => removeFile(i)}
                            style={{
                              position: 'absolute', top: -6, right: -6,
                              width: 20, height: 20, borderRadius: '50%',
                              backgroundColor: '#241B20', color: 'white',
                              border: 'none', cursor: 'pointer',
                              display: 'flex', alignItems: 'center', justifyContent: 'center',
                            }}
                          ><X size={10} /></button>
                        </motion.div>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              <div className="custom-order-actions" style={{ display: 'flex', gap: 10, marginTop: 4 }}>
                <button
                  onClick={() => setStep(0)}
                  style={{
                    padding: '13px 24px', borderRadius: 999,
                    border: '1.5px solid rgba(232,163,185,0.25)',
                    background: 'transparent',
                    fontFamily: 'DM Sans, sans-serif',
                    fontSize: 13, fontWeight: 500, color: '#5C4033', cursor: 'pointer',
                  }}
                >Back</button>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={() => setStep(2)}
                  disabled={uploading}
                  style={{
                    display: 'inline-flex', alignItems: 'center', gap: 10,
                    padding: '13px 28px', borderRadius: 999,
                    background: 'linear-gradient(135deg,#E8A3B9,#F4C6A8,#F4DF9A)',
                    border: 'none', cursor: uploading ? 'not-allowed' : 'pointer',
                    fontFamily: 'DM Sans, sans-serif',
                    fontSize: 13, fontWeight: 700, color: '#241B20',
                    letterSpacing: '0.06em', textTransform: 'uppercase',
                    opacity: uploading ? 0.6 : 1,
                    boxShadow: '0 4px 18px rgba(232,163,185,0.3)',
                  }}
                >
                  {uploading ? 'Uploading...' : <>Review <ArrowRight size={14} /></>}
                </motion.button>
              </div>
            </motion.div>
          )}

          {/* STEP 2 — Review */}
          {step === 2 && (
            <motion.div
              key="s2"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.22 }}
              className="custom-order-card"
              style={{
                background: 'rgba(255,255,255,0.82)',
                border: '1px solid rgba(232,163,185,0.18)',
                borderRadius: 24, overflow: 'hidden',
                boxShadow: '0 8px 40px rgba(232,163,185,0.1)',
              }}
            >
              <div style={{ height: 4, background: 'linear-gradient(90deg,#E8A3B9,#F4C6A8,#F4DF9A)' }} />
              <div className="custom-order-card__body" style={{ padding: '36px 40px' }}>
                <h2 style={{
                  fontFamily: 'Playfair Display, serif',
                  fontSize: 24, fontWeight: 600, color: '#241B20',
                  letterSpacing: '-0.02em', marginBottom: 6,
                }}>Review & send</h2>
                <p style={{
                  fontFamily: 'DM Sans, sans-serif',
                  fontSize: 14, color: '#8C665D', marginBottom: 28,
                }}>Everything look right? We'll reply within 24 hours.</p>

                {/* Summary */}
                <div style={{
                  border: '1px solid rgba(232,163,185,0.15)',
                  borderRadius: 16, overflow: 'hidden', marginBottom: 24,
                }}>
                  {[
                    { label: 'Name', value: form.name },
                    { label: 'Email', value: form.email },
                    { label: 'Phone', value: form.phone || '—' },
                    { label: 'Category', value: CATEGORIES.find(c => c.slug === form.category)?.name || '—' },
                    { label: 'Budget', value: form.budget || '—' },
                    { label: 'Occasion', value: form.occasion || '—' },
                    {
                      label: 'Images',
                      value: (localFiles.length + pastedUrls.length) > 0
                        ? `${localFiles.length + pastedUrls.length} reference image(s) attached`
                        : 'None',
                    },
                  ].map((row, i) => (
                    <div key={row.label} style={{
                      display: 'flex', gap: 20, padding: '12px 20px',
                      backgroundColor: i % 2 === 0 ? 'rgba(255,255,255,0.7)' : 'rgba(232,163,185,0.03)',
                      borderBottom: '1px solid rgba(232,163,185,0.08)',
                    }}>
                      <span style={{
                        fontFamily: 'DM Sans, sans-serif',
                        fontSize: 11, fontWeight: 700,
                        letterSpacing: '0.1em', textTransform: 'uppercase',
                        color: '#8C665D', minWidth: 80, paddingTop: 2, flexShrink: 0,
                      }}>{row.label}</span>
                      <span style={{
                        fontFamily: 'DM Sans, sans-serif',
                        fontSize: 14, color: '#241B20',
                      }}>{row.value}</span>
                    </div>
                  ))}

                  <div style={{ padding: '16px 20px', backgroundColor: 'rgba(255,255,255,0.7)' }}>
                    <span style={{
                      display: 'block', fontFamily: 'DM Sans, sans-serif',
                      fontSize: 11, fontWeight: 700,
                      letterSpacing: '0.1em', textTransform: 'uppercase',
                      color: '#8C665D', marginBottom: 8,
                    }}>Vision</span>
                    <p style={{
                      fontFamily: 'DM Sans, sans-serif',
                      fontSize: 14, color: '#5C4033', lineHeight: 1.65,
                    }}>{form.description}</p>
                  </div>

                  {allImages.length > 0 && (
                    <div style={{ padding: '16px 20px', backgroundColor: 'rgba(232,163,185,0.03)' }}>
                      <span style={{
                        display: 'block', fontFamily: 'DM Sans, sans-serif',
                        fontSize: 11, fontWeight: 700,
                        letterSpacing: '0.1em', textTransform: 'uppercase',
                        color: '#8C665D', marginBottom: 10,
                      }}>Reference Images</span>
                      <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                        {allImages.map((img, i) => (
                          <img
                            key={i}
                            src={img.type === 'file'
                              ? URL.createObjectURL(img.file)
                              : img.url
                            }
                            alt=""
                            style={{
                              width: 56, height: 56,
                              objectFit: 'cover', borderRadius: 10,
                              border: '1px solid rgba(232,163,185,0.3)',
                            }}
                            onError={e => (e.target as HTMLImageElement).style.display = 'none'}
                          />
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* Trust note */}
                <div style={{
                  display: 'flex', alignItems: 'flex-start', gap: 12,
                  padding: '14px 18px',
                  background: 'linear-gradient(135deg,rgba(232,163,185,0.07),rgba(244,198,168,0.07))',
                  border: '1px solid rgba(232,163,185,0.18)',
                  borderRadius: 12, marginBottom: 24,
                }}>
                  <Sparkles size={15} color="#9E5E73" style={{ flexShrink: 0, marginTop: 2 }} />
                  <p style={{
                    fontFamily: 'DM Sans, sans-serif',
                    fontSize: 13, color: '#5C4033', lineHeight: 1.6,
                  }}>
                    <strong style={{ color: '#9E5E73' }}>No payment required now.</strong>{' '}
                    We'll send a personalised quote — you approve before anything is made.
                    Cash on delivery only.
                  </p>
                </div>

                {submitError && (
                  <div style={{
                    padding: '12px 16px', marginBottom: 20,
                    backgroundColor: '#FFF0F0', border: '1px solid #FFD0D0',
                    borderRadius: 10,
                    fontFamily: 'DM Sans, sans-serif', fontSize: 13, color: '#C33',
                  }}>{submitError}</div>
                )}

                <div className="custom-order-actions" style={{ display: 'flex', gap: 10 }}>
                  <button
                    onClick={() => setStep(1)}
                    style={{
                      padding: '13px 24px', borderRadius: 999,
                      border: '1.5px solid rgba(232,163,185,0.25)',
                      background: 'transparent',
                      fontFamily: 'DM Sans, sans-serif',
                      fontSize: 13, fontWeight: 500, color: '#5C4033', cursor: 'pointer',
                    }}
                  >Back</button>
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.97 }}
                    onClick={handleSubmit}
                    disabled={submitting}
                    style={{
                      display: 'inline-flex', alignItems: 'center', gap: 10,
                      padding: '13px 28px', borderRadius: 999,
                      background: 'linear-gradient(135deg,#E8A3B9,#F4C6A8,#F4DF9A)',
                      border: 'none', cursor: submitting ? 'not-allowed' : 'pointer',
                      fontFamily: 'DM Sans, sans-serif',
                      fontSize: 13, fontWeight: 700, color: '#241B20',
                      letterSpacing: '0.06em', textTransform: 'uppercase',
                      opacity: submitting ? 0.7 : 1,
                      boxShadow: '0 4px 18px rgba(232,163,185,0.35)',
                    }}
                  >
                    {submitting ? (
                      <>
                        <div style={{
                          width: 14, height: 14, borderRadius: '50%',
                          border: '2px solid rgba(28,15,10,0.3)',
                          borderTopColor: '#241B20',
                          animation: 'spin 0.7s linear infinite',
                        }} />
                        Sending...
                      </>
                    ) : <><Send size={14} /> Send My Request</>}
                  </motion.button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  )
}

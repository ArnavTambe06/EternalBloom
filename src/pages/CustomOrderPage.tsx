import { useState, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Upload, Send, CheckCircle, X, ImagePlus, ArrowRight, Sparkles } from 'lucide-react'
import { CATEGORIES } from '@/lib/constants'

const steps = ['Tell us your vision', 'Choose a style', 'Submit']

const budgetOptions = [
  { label: 'Under ₹500', sub: 'Great for keychains & cards' },
  { label: '₹500 – ₹1,000', sub: 'Desk buddies, hair accessories' },
  { label: '₹1,000 – ₹2,000', sub: 'Bouquets, lamps, sets' },
  { label: '₹2,000+', sub: 'Fully custom, large pieces' },
  { label: 'Surprise me', sub: 'We\'ll suggest the best fit' },
]

const occasionOptions = [
  'Birthday Gift', 'Anniversary', 'Wedding', 'Baby Shower',
  'Just Because', 'Home Decor', 'Friendship Gift', 'Self-love',
]

const inspirationImages = [
  {
    src: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600&q=80',
    label: 'Keychains',
  },
  {
    src: 'https://images.unsplash.com/photo-1487530811015-780680fb1f4e?w=600&q=80',
    label: 'Desk Buddies',
  },
  {
    src: 'https://images.unsplash.com/photo-1518709766631-a6a7f45921c3?w=600&q=80',
    label: 'Flower Cards',
  },
  {
    src: 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=600&q=80',
    label: 'Hair Clips',
  },
]

export function CustomOrderPage() {
  const [step, setStep] = useState(0)
  const [submitted, setSubmitted] = useState(false)
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([])
  const fileInputRef = useRef<HTMLInputElement>(null)

  const [form, setForm] = useState({
    name: '', email: '', phone: '',
    category: '', description: '',
    budget: '', occasion: '',
  })
  const set = (k: string, v: string) => setForm(f => ({ ...f, [k]: v }))

  const handleFiles = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setUploadedFiles(prev => [...prev, ...Array.from(e.target.files!)])
    }
  }

  const removeFile = (i: number) =>
    setUploadedFiles(files => files.filter((_, idx) => idx !== i))

  if (submitted) {
    return (
      <div style={{
        minHeight: '100vh',
        backgroundColor: 'var(--surface)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        padding: 24,
      }}>
        <motion.div
          initial={{ opacity: 0, scale: 0.92 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ type: 'spring', stiffness: 200, damping: 22 }}
          style={{
            maxWidth: 480, width: '100%',
            textAlign: 'center',
          }}
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: 'spring', stiffness: 240 }}
            style={{
              width: 72, height: 72,
              backgroundColor: 'var(--secondary-container)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              margin: '0 auto 24px',
            }}
          >
            <CheckCircle size={32} color="var(--secondary)" />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <p className="label-caps" style={{ color: 'var(--secondary)', marginBottom: 12 }}>
              Request Received
            </p>
            <h2 style={{
              fontFamily: 'var(--font-display)',
              fontSize: 36, fontWeight: 700,
              color: 'var(--primary)',
              letterSpacing: '-0.02em', marginBottom: 16,
            }}>
              We'll be in touch.
            </h2>
            <p style={{
              fontFamily: 'var(--font-body)',
              fontSize: 15, color: 'var(--on-surface-variant)',
              lineHeight: 1.7, marginBottom: 40,
            }}>
              Thank you, <strong style={{ color: 'var(--primary)' }}>{form.name}</strong>.
              We've received your request and will get back to you at{' '}
              <strong style={{ color: 'var(--primary)' }}>{form.email}</strong> within 24 hours
              with a personalised quote.
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              <button
                onClick={() => {
                  setSubmitted(false)
                  setStep(0)
                  setForm({ name: '', email: '', phone: '', category: '', description: '', budget: '', occasion: '' })
                  setUploadedFiles([])
                }}
                style={{
                  padding: '14px 32px',
                  backgroundColor: 'var(--primary)', color: 'white',
                  border: 'none', cursor: 'pointer',
                  fontFamily: 'var(--font-body)',
                  fontSize: 12, fontWeight: 600,
                  letterSpacing: '0.1em', textTransform: 'uppercase',
                }}
              >
                Submit Another Request
              </button>
            </div>
          </motion.div>
        </motion.div>
      </div>
    )
  }

  return (
    <div style={{ backgroundColor: 'var(--surface)', minHeight: '100vh' }}>

      {/* Hero — full width editorial */}
      <div style={{
        backgroundColor: 'var(--primary)',
        padding: '80px var(--margin-desktop) 72px',
        position: 'relative', overflow: 'hidden',
      }}>
        {/* Background image grid (decorative) */}
        <div style={{
          position: 'absolute', inset: 0,
          display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)',
          opacity: 0.08,
        }}>
          {inspirationImages.map((img, i) => (
            <img
              key={i}
              src={img.src}
              alt=""
              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
            />
          ))}
        </div>

        <div style={{ maxWidth: 'var(--container)', margin: '0 auto', position: 'relative', zIndex: 1 }}>
          <motion.p
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            className="label-caps"
            style={{ color: 'var(--secondary-dim)', marginBottom: 20 }}
          >
            Made Just for You
          </motion.p>
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.08 }}
            style={{
              fontFamily: 'var(--font-display)',
              fontSize: 'clamp(40px, 6vw, 72px)',
              fontWeight: 700, color: 'white',
              letterSpacing: '-0.02em',
              lineHeight: 1.05, marginBottom: 24,
              maxWidth: 640,
            }}
          >
            Your Vision,
            <br />
            <em style={{ color: 'var(--secondary-dim)', fontStyle: 'italic' }}>
              Our Craft.
            </em>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.14 }}
            style={{
              fontFamily: 'var(--font-body)',
              fontSize: 17, color: 'var(--primary-dim)',
              lineHeight: 1.65, maxWidth: 500,
            }}
          >
            Describe what you have in mind — a colour, a feeling, a person you love.
            We'll handcraft something that's entirely, permanently yours.
          </motion.p>
        </div>
      </div>

      {/* Inspiration strip */}
      <div style={{
        backgroundColor: 'var(--surface-low)',
        borderBottom: '1px solid rgba(4,22,39,0.08)',
        overflow: 'hidden',
      }}>
        <div style={{
          display: 'flex',
          maxWidth: 'var(--container)', margin: '0 auto',
        }}>
          {inspirationImages.map((img, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 + i * 0.08 }}
              style={{
                flex: 1, position: 'relative',
                aspectRatio: '4/3', overflow: 'hidden',
              }}
            >
              <motion.img
                whileHover={{ scale: 1.05 }}
                transition={{ duration: 0.5 }}
                src={img.src}
                alt={img.label}
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              />
              <div style={{
                position: 'absolute', bottom: 0, left: 0, right: 0,
                padding: '20px 16px 14px',
                background: 'linear-gradient(to top, rgba(4,22,39,0.7) 0%, transparent 100%)',
              }}>
                <p className="label-caps" style={{ color: 'rgba(255,255,255,0.8)' }}>
                  {img.label}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Form area */}
      <div style={{
        maxWidth: 800, margin: '0 auto',
        padding: '72px var(--margin-mobile)',
      }}>

        {/* Step indicator */}
        <div style={{
          display: 'flex', alignItems: 'center',
          gap: 0, marginBottom: 56,
        }}>
          {steps.map((s, i) => (
            <div key={s} style={{ display: 'flex', alignItems: 'center', flex: i < steps.length - 1 ? 1 : 'none' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexShrink: 0 }}>
                <div style={{
                  width: 28, height: 28,
                  backgroundColor: i <= step ? 'var(--primary)' : 'var(--surface-high)',
                  color: i <= step ? 'white' : 'var(--outline)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontFamily: 'var(--font-body)',
                  fontSize: 12, fontWeight: 700,
                  transition: 'all 0.3s',
                }}>
                  {i < step ? '✓' : i + 1}
                </div>
                <span style={{
                  fontFamily: 'var(--font-body)',
                  fontSize: 12, fontWeight: 600,
                  letterSpacing: '0.06em',
                  color: i <= step ? 'var(--primary)' : 'var(--outline)',
                  textTransform: 'uppercase',
                  whiteSpace: 'nowrap',
                  transition: 'all 0.3s',
                }}>{s}</span>
              </div>
              {i < steps.length - 1 && (
                <div style={{
                  flex: 1, height: 1, margin: '0 16px',
                  backgroundColor: i < step ? 'var(--primary)' : 'rgba(4,22,39,0.12)',
                  transition: 'all 0.3s',
                }} />
              )}
            </div>
          ))}
        </div>

        {/* Step content */}
        <AnimatePresence mode="wait">

          {/* Step 0 — Details */}
          {step === 0 && (
            <motion.div
              key="step0"
              initial={{ opacity: 0, x: 24 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -24 }}
              transition={{ duration: 0.3 }}
            >
              <h2 style={{
                fontFamily: 'var(--font-display)',
                fontSize: 28, fontWeight: 600,
                color: 'var(--primary)',
                letterSpacing: '-0.02em', marginBottom: 8,
              }}>Tell us about yourself</h2>
              <p style={{
                fontFamily: 'var(--font-body)',
                fontSize: 14, color: 'var(--on-surface-variant)',
                marginBottom: 36,
              }}>
                We'll use this to reach out with your quote and updates.
              </p>

              <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                  {[
                    { label: 'Full Name *', key: 'name', type: 'text', placeholder: 'Priya Sharma' },
                    { label: 'Email *', key: 'email', type: 'email', placeholder: 'priya@email.com' },
                  ].map(f => (
                    <div key={f.key}>
                      <label style={{
                        display: 'block',
                        fontFamily: 'var(--font-body)',
                        fontSize: 11, fontWeight: 600,
                        letterSpacing: '0.08em', textTransform: 'uppercase',
                        color: 'var(--on-surface-variant)', marginBottom: 8,
                      }}>{f.label}</label>
                      <input
                        type={f.type}
                        placeholder={f.placeholder}
                        value={(form as any)[f.key]}
                        onChange={e => set(f.key, e.target.value)}
                        style={{
                          width: '100%', padding: '12px 0',
                          border: 'none',
                          borderBottom: '1.5px solid rgba(4,22,39,0.2)',
                          backgroundColor: 'transparent',
                          fontFamily: 'var(--font-body)',
                          fontSize: 15, color: 'var(--primary)',
                          outline: 'none',
                          transition: 'border-color 0.2s',
                          boxSizing: 'border-box',
                        }}
                        onFocus={e => e.target.style.borderBottomColor = 'var(--primary)'}
                        onBlur={e => e.target.style.borderBottomColor = 'rgba(4,22,39,0.2)'}
                      />
                    </div>
                  ))}
                </div>

                <div>
                  <label style={{
                    display: 'block',
                    fontFamily: 'var(--font-body)',
                    fontSize: 11, fontWeight: 600,
                    letterSpacing: '0.08em', textTransform: 'uppercase',
                    color: 'var(--on-surface-variant)', marginBottom: 8,
                  }}>Phone</label>
                  <input
                    type="tel"
                    placeholder="+91 98765 43210"
                    value={form.phone}
                    onChange={e => set('phone', e.target.value)}
                    style={{
                      width: '100%', padding: '12px 0',
                      border: 'none',
                      borderBottom: '1.5px solid rgba(4,22,39,0.2)',
                      backgroundColor: 'transparent',
                      fontFamily: 'var(--font-body)',
                      fontSize: 15, color: 'var(--primary)',
                      outline: 'none', boxSizing: 'border-box',
                    }}
                    onFocus={e => e.target.style.borderBottomColor = 'var(--primary)'}
                    onBlur={e => e.target.style.borderBottomColor = 'rgba(4,22,39,0.2)'}
                  />
                </div>

                <div>
                  <label style={{
                    display: 'block',
                    fontFamily: 'var(--font-body)',
                    fontSize: 11, fontWeight: 600,
                    letterSpacing: '0.08em', textTransform: 'uppercase',
                    color: 'var(--on-surface-variant)', marginBottom: 8,
                  }}>Category</label>
                  <select
                    value={form.category}
                    onChange={e => set('category', e.target.value)}
                    style={{
                      width: '100%', padding: '12px 0',
                      border: 'none',
                      borderBottom: '1.5px solid rgba(4,22,39,0.2)',
                      backgroundColor: 'transparent',
                      fontFamily: 'var(--font-body)',
                      fontSize: 15,
                      color: form.category ? 'var(--primary)' : 'var(--outline)',
                      outline: 'none', cursor: 'pointer',
                      appearance: 'none',
                    }}
                  >
                    <option value="">Select a category</option>
                    {CATEGORIES.map(c => (
                      <option key={c.slug} value={c.slug}>{c.name}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label style={{
                    display: 'block',
                    fontFamily: 'var(--font-body)',
                    fontSize: 11, fontWeight: 600,
                    letterSpacing: '0.08em', textTransform: 'uppercase',
                    color: 'var(--on-surface-variant)', marginBottom: 8,
                  }}>Describe your vision *</label>
                  <textarea
                    rows={5}
                    placeholder="Tell us what you have in mind — colours, flowers, who it's for, any special meaning behind it..."
                    value={form.description}
                    onChange={e => set('description', e.target.value)}
                    style={{
                      width: '100%', padding: '12px 0',
                      border: 'none',
                      borderBottom: '1.5px solid rgba(4,22,39,0.2)',
                      backgroundColor: 'transparent',
                      fontFamily: 'var(--font-body)',
                      fontSize: 15, color: 'var(--primary)',
                      outline: 'none', resize: 'none',
                      lineHeight: 1.65, boxSizing: 'border-box',
                    }}
                    onFocus={e => e.target.style.borderBottomColor = 'var(--primary)'}
                    onBlur={e => e.target.style.borderBottomColor = 'rgba(4,22,39,0.2)'}
                  />
                </div>
              </div>

              <motion.button
                whileHover={{ opacity: 0.88 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setStep(1)}
                disabled={!form.name || !form.email || !form.description}
                style={{
                  marginTop: 40,
                  display: 'inline-flex', alignItems: 'center', gap: 12,
                  padding: '14px 36px',
                  backgroundColor: 'var(--primary)', color: 'white',
                  border: 'none', cursor: 'pointer',
                  fontFamily: 'var(--font-body)',
                  fontSize: 12, fontWeight: 600,
                  letterSpacing: '0.1em', textTransform: 'uppercase',
                  opacity: (!form.name || !form.email || !form.description) ? 0.4 : 1,
                  transition: 'opacity 0.2s',
                }}
              >
                Continue <ArrowRight size={14} />
              </motion.button>
            </motion.div>
          )}

          {/* Step 1 — Style */}
          {step === 1 && (
            <motion.div
              key="step1"
              initial={{ opacity: 0, x: 24 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -24 }}
              transition={{ duration: 0.3 }}
            >
              <h2 style={{
                fontFamily: 'var(--font-display)',
                fontSize: 28, fontWeight: 600,
                color: 'var(--primary)',
                letterSpacing: '-0.02em', marginBottom: 8,
              }}>Shape your request</h2>
              <p style={{
                fontFamily: 'var(--font-body)',
                fontSize: 14, color: 'var(--on-surface-variant)',
                marginBottom: 40,
              }}>
                Help us understand the feel and budget so we can craft the perfect piece.
              </p>

              {/* Budget */}
              <div style={{ marginBottom: 40 }}>
                <label style={{
                  display: 'block',
                  fontFamily: 'var(--font-body)',
                  fontSize: 11, fontWeight: 600,
                  letterSpacing: '0.08em', textTransform: 'uppercase',
                  color: 'var(--on-surface-variant)', marginBottom: 16,
                }}>Budget Range</label>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                  {budgetOptions.map(b => (
                    <motion.button
                      key={b.label}
                      whileHover={{ x: 4 }}
                      onClick={() => set('budget', b.label)}
                      style={{
                        display: 'flex', alignItems: 'center',
                        justifyContent: 'space-between',
                        padding: '14px 20px',
                        backgroundColor: form.budget === b.label
                          ? 'var(--primary)' : 'var(--surface-white)',
                        border: `1px solid ${form.budget === b.label
                          ? 'var(--primary)' : 'rgba(4,22,39,0.1)'}`,
                        cursor: 'pointer', textAlign: 'left',
                        transition: 'all 0.2s',
                      }}
                    >
                      <div>
                        <p style={{
                          fontFamily: 'var(--font-body)',
                          fontSize: 14, fontWeight: 600,
                          color: form.budget === b.label ? 'white' : 'var(--primary)',
                          marginBottom: 2,
                        }}>{b.label}</p>
                        <p style={{
                          fontFamily: 'var(--font-body)',
                          fontSize: 12,
                          color: form.budget === b.label
                            ? 'rgba(255,255,255,0.7)' : 'var(--on-surface-variant)',
                        }}>{b.sub}</p>
                      </div>
                      {form.budget === b.label && (
                        <CheckCircle size={16} color="white" />
                      )}
                    </motion.button>
                  ))}
                </div>
              </div>

              {/* Occasion */}
              <div style={{ marginBottom: 40 }}>
                <label style={{
                  display: 'block',
                  fontFamily: 'var(--font-body)',
                  fontSize: 11, fontWeight: 600,
                  letterSpacing: '0.08em', textTransform: 'uppercase',
                  color: 'var(--on-surface-variant)', marginBottom: 16,
                }}>Occasion (optional)</label>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                  {occasionOptions.map(o => (
                    <button
                      key={o}
                      onClick={() => set('occasion', form.occasion === o ? '' : o)}
                      style={{
                        padding: '8px 16px',
                        backgroundColor: form.occasion === o
                          ? 'var(--secondary-container)' : 'transparent',
                        border: `1px solid ${form.occasion === o
                          ? 'var(--secondary)' : 'rgba(4,22,39,0.15)'}`,
                        color: form.occasion === o
                          ? 'var(--secondary)' : 'var(--on-surface-variant)',
                        fontFamily: 'var(--font-body)',
                        fontSize: 12, fontWeight: 500,
                        cursor: 'pointer', transition: 'all 0.2s',
                      }}
                    >
                      {o}
                    </button>
                  ))}
                </div>
              </div>

              {/* Reference images */}
              <div style={{ marginBottom: 40 }}>
                <label style={{
                  display: 'block',
                  fontFamily: 'var(--font-body)',
                  fontSize: 11, fontWeight: 600,
                  letterSpacing: '0.08em', textTransform: 'uppercase',
                  color: 'var(--on-surface-variant)', marginBottom: 16,
                }}>Reference Images (optional)</label>

                <input
                  ref={fileInputRef}
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={handleFiles}
                  style={{ display: 'none' }}
                />

                {/* Upload zone */}
                <div
                  onClick={() => fileInputRef.current?.click()}
                  style={{
                    border: '1.5px dashed rgba(4,22,39,0.2)',
                    padding: '32px 24px',
                    textAlign: 'center',
                    cursor: 'pointer',
                    backgroundColor: 'var(--surface-low)',
                    transition: 'all 0.2s',
                    marginBottom: uploadedFiles.length > 0 ? 16 : 0,
                  }}
                  onMouseEnter={e => {
                    e.currentTarget.style.borderColor = 'var(--primary)'
                    e.currentTarget.style.backgroundColor = 'var(--surface-container)'
                  }}
                  onMouseLeave={e => {
                    e.currentTarget.style.borderColor = 'rgba(4,22,39,0.2)'
                    e.currentTarget.style.backgroundColor = 'var(--surface-low)'
                  }}
                >
                  <ImagePlus size={24} color="var(--outline)" style={{ margin: '0 auto 10px' }} />
                  <p style={{
                    fontFamily: 'var(--font-body)',
                    fontSize: 13, color: 'var(--on-surface-variant)',
                    marginBottom: 4,
                  }}>
                    Drop images or{' '}
                    <span style={{ color: 'var(--primary)', fontWeight: 600 }}>browse</span>
                  </p>
                  <p style={{
                    fontFamily: 'var(--font-body)',
                    fontSize: 11, color: 'var(--outline)',
                  }}>PNG, JPG up to 5MB each</p>
                </div>

                {/* Uploaded previews */}
                {uploadedFiles.length > 0 && (
                  <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
                    {uploadedFiles.map((file, i) => (
                      <motion.div
                        key={i}
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        style={{
                          position: 'relative',
                          width: 72, height: 72,
                          backgroundColor: 'var(--surface-container)',
                          overflow: 'hidden',
                        }}
                      >
                        <img
                          src={URL.createObjectURL(file)}
                          alt=""
                          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                        />
                        <button
                          onClick={() => removeFile(i)}
                          style={{
                            position: 'absolute', top: 2, right: 2,
                            width: 18, height: 18,
                            backgroundColor: 'var(--primary)',
                            color: 'white', border: 'none',
                            cursor: 'pointer',
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                          }}
                        >
                          <X size={10} />
                        </button>
                      </motion.div>
                    ))}
                  </div>
                )}
              </div>

              <div style={{ display: 'flex', gap: 12 }}>
                <button
                  onClick={() => setStep(0)}
                  style={{
                    padding: '14px 28px',
                    backgroundColor: 'transparent',
                    border: '1px solid rgba(4,22,39,0.2)',
                    color: 'var(--on-surface-variant)',
                    fontFamily: 'var(--font-body)',
                    fontSize: 12, fontWeight: 600,
                    letterSpacing: '0.08em', textTransform: 'uppercase',
                    cursor: 'pointer',
                  }}
                >
                  Back
                </button>
                <motion.button
                  whileHover={{ opacity: 0.88 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setStep(2)}
                  style={{
                    display: 'inline-flex', alignItems: 'center', gap: 10,
                    padding: '14px 36px',
                    backgroundColor: 'var(--primary)', color: 'white',
                    border: 'none', cursor: 'pointer',
                    fontFamily: 'var(--font-body)',
                    fontSize: 12, fontWeight: 600,
                    letterSpacing: '0.1em', textTransform: 'uppercase',
                  }}
                >
                  Review Request <ArrowRight size={14} />
                </motion.button>
              </div>
            </motion.div>
          )}

          {/* Step 2 — Review & Submit */}
          {step === 2 && (
            <motion.div
              key="step2"
              initial={{ opacity: 0, x: 24 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -24 }}
              transition={{ duration: 0.3 }}
            >
              <h2 style={{
                fontFamily: 'var(--font-display)',
                fontSize: 28, fontWeight: 600,
                color: 'var(--primary)',
                letterSpacing: '-0.02em', marginBottom: 8,
              }}>Review your request</h2>
              <p style={{
                fontFamily: 'var(--font-body)',
                fontSize: 14, color: 'var(--on-surface-variant)',
                marginBottom: 36,
              }}>
                Everything look good? We'll reach out within 24 hours.
              </p>

              {/* Summary card */}
              <div style={{
                backgroundColor: 'var(--surface-white)',
                border: '1px solid rgba(4,22,39,0.08)',
                padding: '28px 32px',
                marginBottom: 32,
              }}>
                {[
                  { label: 'Name', value: form.name },
                  { label: 'Email', value: form.email },
                  { label: 'Phone', value: form.phone || '—' },
                  { label: 'Category', value: form.category || '—' },
                  { label: 'Budget', value: form.budget || '—' },
                  { label: 'Occasion', value: form.occasion || '—' },
                  { label: 'Images', value: uploadedFiles.length > 0 ? `${uploadedFiles.length} file(s)` : 'None' },
                ].map(row => (
                  <div key={row.label} style={{
                    display: 'flex', gap: 24,
                    padding: '12px 0',
                    borderBottom: '1px solid rgba(4,22,39,0.06)',
                  }}>
                    <span className="label-caps" style={{ minWidth: 80, paddingTop: 2 }}>
                      {row.label}
                    </span>
                    <span style={{
                      fontFamily: 'var(--font-body)',
                      fontSize: 14, color: 'var(--primary)',
                    }}>{row.value}</span>
                  </div>
                ))}

                {/* Vision */}
                <div style={{ padding: '12px 0' }}>
                  <span className="label-caps" style={{ display: 'block', marginBottom: 8 }}>
                    Vision
                  </span>
                  <p style={{
                    fontFamily: 'var(--font-body)',
                    fontSize: 14, color: 'var(--on-surface-variant)',
                    lineHeight: 1.65,
                  }}>{form.description}</p>
                </div>
              </div>

              {/* Trust note */}
              <div style={{
                display: 'flex', alignItems: 'flex-start', gap: 14,
                padding: '16px 20px',
                backgroundColor: 'var(--secondary-container)',
                marginBottom: 32,
              }}>
                <Sparkles size={16} color="var(--secondary)" style={{ flexShrink: 0, marginTop: 2 }} />
                <p style={{
                  fontFamily: 'var(--font-body)',
                  fontSize: 13, color: 'var(--secondary)',
                  lineHeight: 1.6,
                }}>
                  No payment required now. We'll send a personalised quote after
                  reviewing your request — you approve before anything is made.
                </p>
              </div>

              <div style={{ display: 'flex', gap: 12 }}>
                <button
                  onClick={() => setStep(1)}
                  style={{
                    padding: '14px 28px',
                    backgroundColor: 'transparent',
                    border: '1px solid rgba(4,22,39,0.2)',
                    color: 'var(--on-surface-variant)',
                    fontFamily: 'var(--font-body)',
                    fontSize: 12, fontWeight: 600,
                    letterSpacing: '0.08em', textTransform: 'uppercase',
                    cursor: 'pointer',
                  }}
                >
                  Back
                </button>
                <motion.button
                  whileHover={{ opacity: 0.88 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={() => setSubmitted(true)}
                  style={{
                    display: 'inline-flex', alignItems: 'center', gap: 10,
                    padding: '14px 36px',
                    backgroundColor: 'var(--primary)', color: 'white',
                    border: 'none', cursor: 'pointer',
                    fontFamily: 'var(--font-body)',
                    fontSize: 12, fontWeight: 600,
                    letterSpacing: '0.1em', textTransform: 'uppercase',
                  }}
                >
                  <Send size={14} /> Send Request
                </motion.button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}
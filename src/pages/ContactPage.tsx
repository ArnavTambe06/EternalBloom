import { useState } from 'react'
import { motion } from 'framer-motion'
import { Mail, Clock, Send } from 'lucide-react'
import { BRAND } from '@/lib/constants'

export function ContactPage() {
  const [sent, setSent] = useState(false)
  const [form, setForm] = useState({ name: '', email: '', message: '' })

  return (
    <div style={{ backgroundColor: '#FFF9F2', minHeight: '100vh' }}>
      <div style={{
        background: 'linear-gradient(135deg, #F6EFE7 0%, #FFF9F2 100%)',
        padding: '64px 24px 48px', textAlign: 'center',
        borderBottom: '1px solid #E7DDD5',
      }}>
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}>
          <h1 style={{
            fontFamily: 'Playfair Display, serif',
            fontSize: 'clamp(32px, 4vw, 48px)',
            fontWeight: 700, color: '#46352A', marginBottom: 12,
          }}>Get in Touch</h1>
          <p style={{
            fontFamily: 'Inter, sans-serif', fontSize: 15,
            color: '#786A61', maxWidth: 420, margin: '0 auto', lineHeight: 1.6,
          }}>
            Have a question, special request, or just want to say hello?
            We'd love to hear from you.
          </p>
        </motion.div>
      </div>

      <div style={{ maxWidth: 880, margin: '0 auto', padding: '48px 24px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.4fr', gap: 28 }} className="contact-grid">

          {/* Info */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            {[
              { icon: <Mail size={18} color="#B56A45" />, label: 'Email', value: BRAND.email, href: `mailto:${BRAND.email}` },
              { icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#B56A45" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="20" rx="5"/><circle cx="12" cy="12" r="4"/><circle cx="17.5" cy="6.5" r="0.5" fill="#B56A45"/></svg>, label: 'Instagram', value: '@eternalbloom', href: BRAND.instagram },
              { icon: <Clock size={18} color="#B56A45" />, label: 'Response time', value: 'Within 24 hours', href: null },
            ].map(item => (
              <div key={item.label} style={{
                backgroundColor: 'white', borderRadius: 16,
                padding: '18px 20px', border: '1px solid #E7DDD5',
                display: 'flex', alignItems: 'center', gap: 14,
                boxShadow: '0 2px 8px rgba(70,53,42,0.05)',
              }}>
                {item.icon}
                <div>
                  <p style={{ fontFamily: 'Poppins, sans-serif', fontSize: 11, fontWeight: 600, color: '#786A61', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                    {item.label}
                  </p>
                  {item.href ? (
                    <a href={item.href} style={{ fontFamily: 'Inter, sans-serif', fontSize: 14, color: '#46352A', textDecoration: 'none' }}>
                      {item.value}
                    </a>
                  ) : (
                    <p style={{ fontFamily: 'Inter, sans-serif', fontSize: 14, color: '#46352A' }}>{item.value}</p>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Form */}
          {sent ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              style={{
                backgroundColor: 'white', borderRadius: 20,
                padding: '40px', textAlign: 'center',
                border: '1px solid #E7DDD5',
              }}
            >
              <div style={{ fontSize: 48, marginBottom: 12 }}>🌸</div>
              <h3 style={{ fontFamily: 'Playfair Display, serif', fontSize: 22, color: '#46352A', marginBottom: 8 }}>Message Sent!</h3>
              <p style={{ fontFamily: 'Inter, sans-serif', fontSize: 14, color: '#786A61' }}>
                We'll get back to you within 24 hours.
              </p>
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              style={{
                backgroundColor: 'white', borderRadius: 20,
                padding: '28px 24px', border: '1px solid #E7DDD5',
                boxShadow: '0 2px 12px rgba(70,53,42,0.06)',
              }}
            >
              <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                {[
                  { label: 'Name', key: 'name', type: 'text', placeholder: 'Your name' },
                  { label: 'Email', key: 'email', type: 'email', placeholder: 'your@email.com' },
                ].map(f => (
                  <div key={f.key}>
                    <label style={{ display: 'block', fontFamily: 'Poppins, sans-serif', fontSize: 12, fontWeight: 600, color: '#46352A', marginBottom: 6 }}>{f.label}</label>
                    <input
                      type={f.type}
                      placeholder={f.placeholder}
                      value={(form as any)[f.key]}
                      onChange={e => setForm(frm => ({ ...frm, [f.key]: e.target.value }))}
                      style={{
                        width: '100%', padding: '11px 14px',
                        border: '1.5px solid #E7DDD5', borderRadius: 10,
                        fontFamily: 'Inter, sans-serif', fontSize: 14,
                        color: '#46352A', backgroundColor: '#FFF9F2',
                        outline: 'none', boxSizing: 'border-box',
                      }}
                    />
                  </div>
                ))}
                <div>
                  <label style={{ display: 'block', fontFamily: 'Poppins, sans-serif', fontSize: 12, fontWeight: 600, color: '#46352A', marginBottom: 6 }}>Message</label>
                  <textarea
                    rows={4}
                    placeholder="What's on your mind?"
                    value={form.message}
                    onChange={e => setForm(frm => ({ ...frm, message: e.target.value }))}
                    style={{
                      width: '100%', padding: '11px 14px',
                      border: '1.5px solid #E7DDD5', borderRadius: 10,
                      fontFamily: 'Inter, sans-serif', fontSize: 14,
                      color: '#46352A', backgroundColor: '#FFF9F2',
                      outline: 'none', resize: 'vertical',
                      boxSizing: 'border-box', lineHeight: 1.6,
                    }}
                  />
                </div>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={() => setSent(true)}
                  style={{
                    width: '100%', padding: '13px',
                    backgroundColor: '#B56A45', color: 'white',
                    border: 'none', borderRadius: 12,
                    fontFamily: 'Poppins, sans-serif',
                    fontSize: 14, fontWeight: 600, cursor: 'pointer',
                    display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
                    boxShadow: '0 4px 16px rgba(181,106,69,0.3)',
                  }}
                >
                  <Send size={15} /> Send Message
                </motion.button>
              </div>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  )
}
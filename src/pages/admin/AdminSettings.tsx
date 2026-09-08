import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { Check, Save, Settings2, Truck } from 'lucide-react'
import {
  DEFAULT_SHIPPING_SETTINGS,
  getShippingSettings,
  updateShippingSettings,
} from '@/services/settings'
import { useCartStore } from '@/store/cartStore'

const inputStyle: React.CSSProperties = {
  width: '100%',
  padding: '12px 14px',
  border: '1.5px solid rgba(232,163,185,0.25)',
  borderRadius: 10,
  fontFamily: 'DM Sans, sans-serif',
  fontSize: 15,
  color: '#241B20',
  backgroundColor: '#FFF0E8',
  outline: 'none',
  boxSizing: 'border-box',
}

const labelStyle: React.CSSProperties = {
  display: 'block',
  marginBottom: 8,
  fontFamily: 'DM Sans, sans-serif',
  fontSize: 11,
  fontWeight: 700,
  letterSpacing: '0.1em',
  textTransform: 'uppercase',
  color: '#8C665D',
}

const toForm = (settings: typeof DEFAULT_SHIPPING_SETTINGS) => ({
  flat: String(settings.flat),
  freeAbove: String(settings.freeAbove),
})

function errorMessage(error: unknown) {
  if (error && typeof error === 'object' && 'message' in error) {
    return String(error.message)
  }
  return 'Something went wrong. Please try again.'
}

export function AdminSettings() {
  const [form, setForm] = useState(toForm(DEFAULT_SHIPPING_SETTINGS))
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [saved, setSaved] = useState(false)
  const setShippingSettings = useCartStore(state => state.setShippingSettings)

  useEffect(() => {
    async function load() {
      try {
        setForm(toForm(await getShippingSettings()))
      } catch (loadError) {
        setError(`Could not load shipping settings: ${errorMessage(loadError)}`)
      } finally {
        setLoading(false)
      }
    }

    void load()
  }, [])

  const set = (key: 'flat' | 'freeAbove', value: string) => {
    setSaved(false)
    setError('')
    setForm(current => ({ ...current, [key]: value }))
  }

  const handleSave = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const flat = Number(form.flat)
    const freeAbove = Number(form.freeAbove)

    if (
      !form.flat.trim() || !form.freeAbove.trim() ||
      !Number.isFinite(flat) || !Number.isFinite(freeAbove) ||
      flat < 0 || freeAbove < 0
    ) {
      setError('Enter valid non-negative amounts for both fields.')
      return
    }

    setSaving(true)
    setError('')
    setSaved(false)

    try {
      await updateShippingSettings({ flat, freeAbove })
      setShippingSettings({ flat, freeAbove })
      setForm({ flat: String(flat), freeAbove: String(freeAbove) })
      setSaved(true)
    } catch (saveError) {
      setError(`Could not save shipping settings: ${errorMessage(saveError)}`)
    } finally {
      setSaving(false)
    }
  }

  const flat = Number(form.flat) || 0
  const freeAbove = Number(form.freeAbove) || 0

  return (
    <div style={{ maxWidth: 860 }}>
      <div style={{ marginBottom: 28 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <div style={{
            width: 42, height: 42, borderRadius: 12,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            background: 'linear-gradient(135deg,rgba(232,163,185,0.2),rgba(244,223,154,0.35))',
            color: '#9E5E73',
          }}>
            <Settings2 size={21} />
          </div>
          <div>
            <h1 style={{ fontFamily: 'Playfair Display, serif', fontSize: 26, fontWeight: 700, color: '#241B20' }}>
              Store Settings
            </h1>
            <p style={{ fontFamily: 'DM Sans, sans-serif', fontSize: 14, color: '#8C665D', marginTop: 4 }}>
              Control what customers pay for delivery.
            </p>
          </div>
        </div>
      </div>

      <form onSubmit={handleSave}>
        <section style={{
          backgroundColor: '#FFFFFF',
          border: '1px solid rgba(232,163,185,0.18)',
          borderRadius: 18,
          padding: '28px 30px',
          boxShadow: '0 4px 18px rgba(28,15,10,0.04)',
        }}>
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: 14, marginBottom: 26 }}>
            <Truck size={20} color="#9E5E73" style={{ marginTop: 2, flexShrink: 0 }} />
            <div>
              <h2 style={{ fontFamily: 'Playfair Display, serif', fontSize: 20, fontWeight: 700, color: '#241B20' }}>
                Shipping charges
              </h2>
              <p style={{ fontFamily: 'DM Sans, sans-serif', fontSize: 13, color: '#8C665D', marginTop: 5 }}>
                These values apply to new carts and orders across the store.
              </p>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, minmax(0, 1fr))', gap: 18 }}>
            <label>
              <span style={labelStyle}>Flat shipping charge (&#8377;)</span>
              <input
                type="number"
                min="0"
                step="1"
                value={form.flat}
                onChange={event => set('flat', event.target.value)}
                disabled={loading || saving}
                style={inputStyle}
                aria-describedby="flat-help"
              />
              <span id="flat-help" style={{ display: 'block', marginTop: 7, fontFamily: 'DM Sans, sans-serif', fontSize: 12, color: '#8C665D' }}>
                Charged below the free-shipping threshold.
              </span>
            </label>

            <label>
              <span style={labelStyle}>Free shipping above (&#8377;)</span>
              <input
                type="number"
                min="0"
                step="1"
                value={form.freeAbove}
                onChange={event => set('freeAbove', event.target.value)}
                disabled={loading || saving}
                style={inputStyle}
                aria-describedby="free-above-help"
              />
              <span id="free-above-help" style={{ display: 'block', marginTop: 7, fontFamily: 'DM Sans, sans-serif', fontSize: 12, color: '#8C665D' }}>
                Use 0 to make shipping free on every order.
              </span>
            </label>
          </div>

          <div style={{
            marginTop: 24, padding: '15px 16px', borderRadius: 12,
            backgroundColor: '#FFF0E8', border: '1px solid rgba(232,163,185,0.14)',
            fontFamily: 'DM Sans, sans-serif', fontSize: 13, color: '#5C4033',
          }}>
            Preview: orders below <strong>&#8377;{freeAbove.toLocaleString('en-IN')}</strong> show a shipping charge of <strong>&#8377;{flat.toLocaleString('en-IN')}</strong>. Orders at or above that amount are free.
          </div>

          {(error || saved) && (
            <p
              role={saved ? 'status' : 'alert'}
              style={{
                display: 'flex', alignItems: 'center', gap: 7, marginTop: 18,
                fontFamily: 'DM Sans, sans-serif', fontSize: 13,
                color: saved ? '#4C8A63' : '#B33A3A',
              }}
            >
              {saved && <Check size={16} />}
              {saved ? 'Shipping settings saved successfully.' : error}
            </p>
          )}

          <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 24 }}>
            <motion.button
              type="submit"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.97 }}
              disabled={loading || saving}
              style={{
                display: 'inline-flex', alignItems: 'center', gap: 8,
                padding: '12px 22px', borderRadius: 999,
                background: loading || saving ? '#EAD9D2' : 'linear-gradient(135deg,#E8A3B9,#F4C6A8,#F4DF9A)',
                border: 'none', cursor: loading || saving ? 'not-allowed' : 'pointer',
                fontFamily: 'DM Sans, sans-serif', fontSize: 14, fontWeight: 700,
                color: '#241B20',
              }}
            >
              <Save size={16} />
              {saving ? 'Saving...' : loading ? 'Loading...' : 'Save changes'}
            </motion.button>
          </div>
        </section>
      </form>

      <p style={{ marginTop: 16, fontFamily: 'DM Sans, sans-serif', fontSize: 12, color: '#8C665D' }}>
        Existing orders keep the shipping amount that was recorded when they were placed.
      </p>
    </div>
  )
}

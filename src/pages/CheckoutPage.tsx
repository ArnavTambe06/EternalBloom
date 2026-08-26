import { useEffect, useState } from 'react'
import { ArrowLeft, ArrowRight, Check, MapPin, Package, Pencil, ShieldCheck, ShoppingBag, Truck } from 'lucide-react'
import { Link, useNavigate } from 'react-router-dom'
import { getCartVariantKey, useCartStore } from '@/store/cartStore'
import { useAuth } from '@/hooks/useAuth'
import { createOrder } from '@/services/orders'
import type { Address } from '@/types'

type AddressForm = {
  full_name: string
  phone: string
  line1: string
  line2: string
  city: string
  state: string
  pincode: string
}

type AddressField = keyof AddressForm

const initialAddress: AddressForm = {
  full_name: '',
  phone: '',
  line1: '',
  line2: '',
  city: '',
  state: '',
  pincode: '',
}

const fields: Array<{
  key: AddressField
  label: string
  placeholder: string
  type?: string
  inputMode?: 'text' | 'tel' | 'numeric'
  wide?: boolean
}> = [
  { key: 'full_name', label: 'Full name', placeholder: 'Your full name', wide: true },
  { key: 'phone', label: 'Phone number', placeholder: '+91 98765 43210', type: 'tel', inputMode: 'tel' },
  { key: 'pincode', label: 'Pincode', placeholder: '6-digit pincode', inputMode: 'numeric' },
  { key: 'line1', label: 'Address line 1', placeholder: 'House / flat number, street', wide: true },
  { key: 'line2', label: 'Address line 2', placeholder: 'Landmark (optional)', wide: true },
  { key: 'city', label: 'City', placeholder: 'Your city' },
  { key: 'state', label: 'State', placeholder: 'Your state' },
]

const requiredFields: AddressField[] = ['full_name', 'phone', 'line1', 'city', 'state', 'pincode']

function formatCurrency(value: number) {
  return `₹${value.toLocaleString('en-IN')}`
}

export function CheckoutPage() {
  const [step, setStep] = useState(0)
  const [address, setAddress] = useState<AddressForm>(initialAddress)
  const [errors, setErrors] = useState<Partial<Record<AddressField, string>>>({})
  const [placing, setPlacing] = useState(false)
  const [submitError, setSubmitError] = useState('')
  const { items, subtotal, shipping, total, clearCart } = useCartStore()
  const { user, profile } = useAuth()
  const navigate = useNavigate()

  const sub = subtotal()
  const ship = shipping()
  const tot = total()

  useEffect(() => {
    setAddress(current => ({
      ...current,
      full_name: current.full_name || profile?.full_name || '',
      phone: current.phone || profile?.phone || '',
    }))
  }, [profile])

  const setAddressField = (key: AddressField, value: string) => {
    setAddress(current => ({ ...current, [key]: value }))
    setErrors(current => ({ ...current, [key]: '' }))
    setSubmitError('')
  }

  const validateAddress = () => {
    const nextErrors: Partial<Record<AddressField, string>> = {}

    requiredFields.forEach(key => {
      if (!address[key].trim()) nextErrors[key] = 'This field is required.'
    })

    if (address.phone.trim() && address.phone.replace(/\D/g, '').length < 10) {
      nextErrors.phone = 'Enter a valid phone number.'
    }

    if (address.pincode.trim() && !/^\d{6}$/.test(address.pincode.trim())) {
      nextErrors.pincode = 'Enter a valid 6-digit pincode.'
    }

    setErrors(nextErrors)
    return Object.keys(nextErrors).length === 0
  }

  const handlePlaceOrder = async () => {
    if (items.length === 0 || !validateAddress()) return

    setPlacing(true)
    setSubmitError('')
    try {
      const order = await createOrder({
        userId: user?.id,
        items,
        address: address as unknown as Address,
        subtotal: sub,
        shipping: ship,
        total: tot,
      })
      clearCart()
      navigate(`/order-success/${order.id}`)
    } catch (err) {
      console.error('Order creation failed:', err)
      setSubmitError('We could not place your order right now. Please try again.')
    } finally {
      setPlacing(false)
    }
  }

  if (items.length === 0) {
    return (
      <div className="checkout-page">
        <div className="checkout-empty">
          <div className="checkout-empty__icon"><ShoppingBag size={26} /></div>
          <p className="checkout-eyebrow">Checkout</p>
          <h1>Your bag is empty</h1>
          <p>Add something handmade to your bag before checking out.</p>
          <Link to="/#products" className="checkout-button checkout-button--primary">Browse the collection <ArrowRight size={16} /></Link>
        </div>
        <CheckoutStyles />
      </div>
    )
  }

  return (
    <div className="checkout-page">
      <div className="checkout-container">
        <div className="checkout-topbar">
          <Link to="/cart" className="checkout-back"><ArrowLeft size={15} /> Back to bag</Link>
          <div className="checkout-secure"><ShieldCheck size={15} /> Secure checkout</div>
        </div>

        <div className="checkout-heading">
          <p className="checkout-eyebrow">A little closer to forever</p>
          <h1>Complete your order</h1>
          <p>Share your delivery details, review your handmade picks, and place your COD order.</p>
        </div>

        <div className="checkout-progress" aria-label="Checkout progress">
          {[
            { label: 'Delivery details', icon: MapPin },
            { label: 'Review & confirm', icon: Check },
          ].map((item, index) => {
            const Icon = item.icon
            const complete = index < step
            const active = index === step
            return (
              <div className="checkout-progress__item" key={item.label}>
                <div className={`checkout-progress__step ${active || complete ? 'is-active' : ''}`}>
                  <span className="checkout-progress__dot">{complete ? <Check size={15} /> : <Icon size={15} />}</span>
                  <span>{item.label}</span>
                </div>
                {index === 0 && <div className={`checkout-progress__line ${step > 0 ? 'is-active' : ''}`} />}
              </div>
            )
          })}
        </div>

        <div className="checkout-layout">
          <main className="checkout-main">
            {step === 0 && (
              <section className="checkout-card">
                <div className="checkout-card__header">
                  <div className="checkout-card__icon"><MapPin size={19} /></div>
                  <div>
                    <p className="checkout-card__eyebrow">Step 1 of 2</p>
                    <h2>Where should we deliver?</h2>
                    <p>We will use these details to handcraft and deliver your order.</p>
                  </div>
                </div>

                <div className="checkout-form">
                  {fields.map(field => (
                    <div className={`checkout-field ${field.wide ? 'checkout-field--wide' : ''}`} key={field.key}>
                      <label htmlFor={`checkout-${field.key}`}>{field.label}{requiredFields.includes(field.key) && <span> *</span>}</label>
                      <input
                        id={`checkout-${field.key}`}
                        type={field.type || 'text'}
                        inputMode={field.inputMode}
                        autoComplete={field.key === 'full_name' ? 'name' : field.key === 'phone' ? 'tel' : field.key === 'pincode' ? 'postal-code' : 'street-address'}
                        placeholder={field.placeholder}
                        value={address[field.key]}
                        onChange={event => setAddressField(field.key, event.target.value)}
                        className={errors[field.key] ? 'has-error' : ''}
                      />
                      {errors[field.key] && <span className="checkout-field__error">{errors[field.key]}</span>}
                    </div>
                  ))}
                </div>

                <div className="checkout-note">
                  <Truck size={18} />
                  <div><strong>Made to order</strong><span>Dispatch in 3–5 business days, with delivery updates along the way.</span></div>
                </div>

                <button className="checkout-button checkout-button--primary checkout-button--full" onClick={() => validateAddress() && setStep(1)}>
                  Continue to review <ArrowRight size={16} />
                </button>
              </section>
            )}

            {step === 1 && (
              <section className="checkout-card">
                <div className="checkout-card__header">
                  <div className="checkout-card__icon"><Check size={19} /></div>
                  <div>
                    <p className="checkout-card__eyebrow">Step 2 of 2</p>
                    <h2>Review & confirm</h2>
                    <p>Everything look right? Place your order and pay when it arrives.</p>
                  </div>
                </div>

                <div className="checkout-review-block">
                  <div className="checkout-review-block__heading">
                    <div><p className="checkout-card__eyebrow">Delivery address</p><h3>{address.full_name}</h3></div>
                    <button className="checkout-edit" onClick={() => setStep(0)}><Pencil size={13} /> Edit</button>
                  </div>
                  <p>{address.phone}<br />{address.line1}{address.line2 ? `, ${address.line2}` : ''}<br />{address.city}, {address.state} – {address.pincode}</p>
                </div>

                <div className="checkout-items">
                  <div className="checkout-section-label">Your items</div>
                  {items.map(item => {
                    const image = item.selected_variant?.images?.[0] || item.product.images?.[0]
                    const variant = item.selected_variant?.name || item.selected_color?.name
                    return (
                      <div className="checkout-item" key={`${item.product.id}-${getCartVariantKey(item)}`}>
                        <div className="checkout-item__image">
                          {image ? <img src={image} alt={item.product.name} /> : <span>✿</span>}
                        </div>
                        <div className="checkout-item__details">
                          <h3>{item.product.name}</h3>
                          <p>{variant ? `${variant} · ` : ''}Qty {item.quantity}</p>
                        </div>
                        <strong>{formatCurrency(item.product.price * item.quantity)}</strong>
                      </div>
                    )
                  })}
                </div>

                <div className="checkout-cod">
                  <div className="checkout-cod__icon"><Package size={19} /></div>
                  <div><strong>Cash on Delivery</strong><p>No payment is needed now. Please keep {formatCurrency(tot)} ready when your order arrives.</p></div>
                  <span className="checkout-cod__check"><Check size={14} /></span>
                </div>

                {submitError && <p className="checkout-submit-error" role="alert">{submitError}</p>}

                <div className="checkout-actions">
                  <button className="checkout-button checkout-button--secondary" onClick={() => setStep(0)}><ArrowLeft size={15} /> Back</button>
                  <button className="checkout-button checkout-button--primary" onClick={handlePlaceOrder} disabled={placing}>
                    {placing ? <span className="checkout-spinner" /> : <Check size={16} />}
                    {placing ? 'Placing order…' : 'Place COD order'}
                  </button>
                </div>
              </section>
            )}
          </main>

          <aside className="checkout-summary">
            <div className="checkout-summary__header"><h2>Order summary</h2><span>{items.length} {items.length === 1 ? 'item' : 'items'}</span></div>
            <div className="checkout-summary__items">
              {items.map(item => {
                const image = item.selected_variant?.images?.[0] || item.product.images?.[0]
                const variant = item.selected_variant?.name || item.selected_color?.name
                return (
                  <div className="checkout-summary__item" key={`${item.product.id}-${getCartVariantKey(item)}`}>
                    <div className="checkout-summary__image">{image ? <img src={image} alt="" /> : <span>✿</span>}<b>{item.quantity}</b></div>
                    <div><p>{item.product.name}</p>{variant && <small>{variant}</small>}</div>
                    <strong>{formatCurrency(item.product.price * item.quantity)}</strong>
                  </div>
                )
              })}
            </div>
            <div className="checkout-summary__rows">
              <div><span>Subtotal</span><strong>{formatCurrency(sub)}</strong></div>
              <div><span>Shipping</span><strong>{ship === 0 ? 'Free' : formatCurrency(ship)}</strong></div>
            </div>
            <div className="checkout-summary__total"><span>Total</span><strong>{formatCurrency(tot)}</strong></div>
            <div className="checkout-summary__cod"><span>✓</span><div><strong>Cash on Delivery</strong><small>Pay when your order arrives</small></div></div>
          </aside>
        </div>
      </div>
      <CheckoutStyles />
    </div>
  )
}

function CheckoutStyles() {
  return (
    <style>{`
      .checkout-page {
        min-height: 100vh;
        padding: 42px var(--px) 84px;
        background: linear-gradient(135deg, rgba(255,240,247,.82) 0%, #fffdfa 42%, rgba(255,246,218,.62) 100%);
      }
      .checkout-container { max-width: 1120px; margin: 0 auto; }
      .checkout-topbar { display:flex; justify-content:space-between; align-items:center; margin-bottom:42px; }
      .checkout-back, .checkout-secure { display:inline-flex; align-items:center; gap:7px; color:#786a61; font-size:12px; font-weight:600; }
      .checkout-back:hover { color:#b56a45; }
      .checkout-secure { color:#91a57a; }
      .checkout-heading { text-align:center; margin:0 auto 32px; max-width:620px; }
      .checkout-eyebrow, .checkout-card__eyebrow, .checkout-section-label { color:#b56a45; font-size:10px; font-weight:700; letter-spacing:.17em; text-transform:uppercase; }
      .checkout-heading h1 { margin:8px 0 10px; color:#46352a; font-family:var(--serif); font-size:clamp(34px, 5vw, 52px); font-weight:700; letter-spacing:-.045em; }
      .checkout-heading > p:last-child { color:#786a61; font-size:14px; }
      .checkout-progress { display:flex; justify-content:center; align-items:center; margin:0 auto 34px; max-width:540px; }
      .checkout-progress__item { display:flex; align-items:center; flex:1; }
      .checkout-progress__item:last-child { flex:0 1 auto; }
      .checkout-progress__step { display:flex; align-items:center; gap:9px; color:#b6aaa1; font-size:12px; white-space:nowrap; }
      .checkout-progress__step.is-active { color:#46352a; font-weight:700; }
      .checkout-progress__dot { display:grid; place-items:center; width:32px; height:32px; border:1px solid #e7ddd5; border-radius:50%; background:#fff; color:#b6aaa1; }
      .checkout-progress__step.is-active .checkout-progress__dot { border-color:transparent; background:linear-gradient(135deg,#ff85d0,#ffc8a2); color:#46352a; box-shadow:0 5px 14px rgba(255,133,208,.22); }
      .checkout-progress__line { flex:1; height:1px; margin:0 14px; background:#e7ddd5; }
      .checkout-progress__line.is-active { background:#e8609a; }
      .checkout-layout { display:grid; grid-template-columns:minmax(0, 1fr) 350px; gap:24px; align-items:start; }
      .checkout-card, .checkout-summary { border:1px solid #eadfd8; border-radius:24px; background:rgba(255,255,255,.91); box-shadow:0 16px 50px rgba(86,42,28,.07); }
      .checkout-card { padding:32px; }
      .checkout-card__header { display:flex; align-items:flex-start; gap:14px; padding-bottom:25px; border-bottom:1px solid #eee5df; margin-bottom:25px; }
      .checkout-card__icon { display:grid; place-items:center; flex:0 0 auto; width:42px; height:42px; border-radius:13px; background:#fff0f7; color:#e8609a; }
      .checkout-card__header h2 { margin:3px 0 5px; color:#46352a; font-family:var(--serif); font-size:25px; font-weight:700; }
      .checkout-card__header > div:last-child > p:last-child { color:#786a61; font-size:13px; line-height:1.5; }
      .checkout-form { display:grid; grid-template-columns:1fr 1fr; gap:18px 14px; }
      .checkout-field--wide { grid-column:1 / -1; }
      .checkout-field label { display:block; margin-bottom:7px; color:#46352a; font-size:11px; font-weight:700; letter-spacing:.07em; text-transform:uppercase; }
      .checkout-field label span { color:#e8609a; }
      .checkout-field input { display:block; width:100%; height:46px; padding:0 14px; border:1px solid #e2d7d0; border-radius:11px; outline:none; background:#fffdfa; color:#46352a; font:inherit; font-size:14px; transition:border-color .2s, box-shadow .2s, background .2s; }
      .checkout-field input::placeholder { color:#b6aaa1; }
      .checkout-field input:focus { border-color:#e8609a; background:#fff; box-shadow:0 0 0 3px rgba(232,96,154,.12); }
      .checkout-field input.has-error { border-color:#d65f69; }
      .checkout-field__error { display:block; margin-top:5px; color:#c24b57; font-size:11px; }
      .checkout-note { display:flex; align-items:center; gap:12px; margin-top:25px; padding:14px 16px; border:1px solid #f0dfbd; border-radius:13px; background:#fffaf0; color:#b56a45; }
      .checkout-note > div { display:flex; flex-direction:column; gap:2px; }
      .checkout-note strong { color:#46352a; font-size:12px; }
      .checkout-note span { color:#786a61; font-size:12px; }
      .checkout-button { display:inline-flex; align-items:center; justify-content:center; gap:8px; min-height:46px; padding:0 19px; border-radius:11px; font-size:13px; font-weight:700; transition:transform .2s, box-shadow .2s, opacity .2s; }
      .checkout-button:hover:not(:disabled) { transform:translateY(-1px); }
      .checkout-button:disabled { cursor:not-allowed; opacity:.65; }
      .checkout-button--primary { background:linear-gradient(135deg,#ff85d0,#ffc8a2 68%,#ffe680); color:#46352a; box-shadow:0 8px 20px rgba(255,133,208,.22); }
      .checkout-button--primary:hover:not(:disabled) { box-shadow:0 11px 26px rgba(255,133,208,.32); }
      .checkout-button--secondary { border:1px solid #e3d8d1; background:#fff; color:#786a61; }
      .checkout-button--full { width:100%; margin-top:23px; }
      .checkout-actions { display:flex; gap:10px; margin-top:24px; }
      .checkout-actions .checkout-button:first-child { flex:0 0 110px; }
      .checkout-actions .checkout-button:last-child { flex:1; }
      .checkout-review-block { padding:16px; border:1px solid #eadfd8; border-radius:14px; background:#fffdfa; }
      .checkout-review-block__heading { display:flex; align-items:flex-start; justify-content:space-between; gap:12px; }
      .checkout-review-block h3 { margin-top:4px; color:#46352a; font-family:var(--sans); font-size:14px; font-weight:700; }
      .checkout-review-block > p { margin-top:8px; color:#786a61; font-size:13px; line-height:1.65; }
      .checkout-edit { display:inline-flex; align-items:center; gap:5px; color:#b56a45; font-size:12px; font-weight:700; }
      .checkout-edit:hover { color:#e8609a; }
      .checkout-items { margin-top:26px; }
      .checkout-section-label { margin-bottom:10px; color:#786a61; }
      .checkout-item { display:flex; align-items:center; gap:12px; padding:11px 0; border-bottom:1px solid #f0e9e4; }
      .checkout-item:last-child { border-bottom:0; }
      .checkout-item__image { display:grid; place-items:center; flex:0 0 auto; width:60px; height:60px; overflow:hidden; border-radius:11px; background:#f6efe7; color:#b56a45; font-size:22px; }
      .checkout-item__image img { width:100%; height:100%; object-fit:cover; }
      .checkout-item__details { flex:1; min-width:0; }
      .checkout-item__details h3 { overflow:hidden; color:#46352a; font-family:var(--sans); font-size:13px; font-weight:700; text-overflow:ellipsis; white-space:nowrap; }
      .checkout-item__details p { margin-top:4px; color:#786a61; font-size:12px; }
      .checkout-item > strong { color:#46352a; font-size:13px; white-space:nowrap; }
      .checkout-cod { display:flex; align-items:center; gap:12px; margin-top:23px; padding:15px; border:1px solid #cfe2d1; border-radius:14px; background:#f5fbf5; }
      .checkout-cod__icon { display:grid; place-items:center; flex:0 0 auto; width:38px; height:38px; border-radius:11px; background:#e0f1e1; color:#719477; }
      .checkout-cod > div:nth-child(2) { flex:1; }
      .checkout-cod strong { color:#46694b; font-size:13px; }
      .checkout-cod p { margin-top:3px; color:#719477; font-size:11px; line-height:1.45; }
      .checkout-cod__check { display:grid; place-items:center; flex:0 0 auto; width:23px; height:23px; border-radius:50%; background:#91a57a; color:#fff; }
      .checkout-submit-error { margin-top:15px; padding:11px 13px; border-radius:10px; background:#fff0f0; color:#b33f4b; font-size:12px; }
      .checkout-summary { position:sticky; top:24px; padding:23px; }
      .checkout-summary__header { display:flex; align-items:center; justify-content:space-between; padding-bottom:17px; border-bottom:1px solid #eee5df; }
      .checkout-summary__header h2 { color:#46352a; font-family:var(--serif); font-size:21px; font-weight:700; }
      .checkout-summary__header span { color:#b56a45; font-size:11px; font-weight:700; }
      .checkout-summary__items { padding:14px 0 6px; }
      .checkout-summary__item { display:grid; grid-template-columns:45px minmax(0,1fr) auto; gap:10px; align-items:center; margin-bottom:14px; }
      .checkout-summary__image { position:relative; display:grid; place-items:center; width:45px; height:45px; overflow:visible; border-radius:9px; background:#f6efe7; color:#b56a45; }
      .checkout-summary__image img { width:100%; height:100%; overflow:hidden; border-radius:9px; object-fit:cover; }
      .checkout-summary__image b { position:absolute; top:-6px; right:-6px; display:grid; place-items:center; width:18px; height:18px; border:2px solid #fff; border-radius:50%; background:#e8609a; color:#fff; font-size:9px; }
      .checkout-summary__item p { overflow:hidden; color:#46352a; font-size:12px; font-weight:700; text-overflow:ellipsis; white-space:nowrap; }
      .checkout-summary__item small { display:block; overflow:hidden; margin-top:2px; color:#9b8f87; font-size:10px; text-overflow:ellipsis; white-space:nowrap; }
      .checkout-summary__item > strong { color:#46352a; font-size:12px; white-space:nowrap; }
      .checkout-summary__rows { padding:15px 0 5px; border-top:1px solid #eee5df; }
      .checkout-summary__rows > div, .checkout-summary__total { display:flex; justify-content:space-between; align-items:center; }
      .checkout-summary__rows > div { margin-bottom:9px; color:#786a61; font-size:12px; }
      .checkout-summary__rows strong { color:#46352a; font-size:12px; }
      .checkout-summary__total { padding-top:13px; border-top:1px solid #eee5df; }
      .checkout-summary__total span { color:#46352a; font-family:var(--serif); font-size:17px; font-weight:700; }
      .checkout-summary__total strong { color:#b56a45; font-family:var(--serif); font-size:22px; }
      .checkout-summary__cod { display:flex; align-items:center; gap:9px; margin-top:20px; padding:12px; border-radius:11px; background:#fff5e9; }
      .checkout-summary__cod > span { display:grid; place-items:center; width:21px; height:21px; border-radius:50%; background:#f0c16c; color:#fff; font-size:12px; }
      .checkout-summary__cod div { display:flex; flex-direction:column; gap:1px; }
      .checkout-summary__cod strong { color:#8f6732; font-size:11px; }
      .checkout-summary__cod small { color:#b58d57; font-size:10px; }
      .checkout-spinner { width:15px; height:15px; border:2px solid rgba(70,53,42,.25); border-top-color:#46352a; border-radius:50%; animation:checkout-spin .7s linear infinite; }
      .checkout-empty { display:flex; flex-direction:column; align-items:center; justify-content:center; min-height:55vh; text-align:center; }
      .checkout-empty__icon { display:grid; place-items:center; width:64px; height:64px; margin-bottom:17px; border-radius:50%; background:#fff0f7; color:#e8609a; }
      .checkout-empty h1 { margin:8px 0; color:#46352a; font-family:var(--serif); font-size:36px; font-weight:700; }
      .checkout-empty > p:not(.checkout-eyebrow) { margin-bottom:22px; color:#786a61; font-size:14px; }
      @keyframes checkout-spin { to { transform:rotate(360deg); } }
      @media (max-width: 1024px) {
        .checkout-layout { grid-template-columns:1fr; }
        .checkout-summary { position:static; order:-1; }
      }
      @media (max-width: 640px) {
        .checkout-page { padding-top:26px; padding-bottom:55px; }
        .checkout-topbar { margin-bottom:32px; }
        .checkout-secure { display:none; }
        .checkout-heading { margin-bottom:26px; }
        .checkout-heading h1 { font-size:38px; }
        .checkout-progress { justify-content:space-between; }
        .checkout-progress__step { gap:6px; font-size:10px; }
        .checkout-progress__dot { width:28px; height:28px; }
        .checkout-progress__line { margin:0 8px; }
        .checkout-card { padding:22px 17px; border-radius:18px; }
        .checkout-card__header { margin-bottom:21px; padding-bottom:20px; }
        .checkout-card__header h2 { font-size:22px; }
        .checkout-form { grid-template-columns:1fr; gap:16px; }
        .checkout-field--wide { grid-column:auto; }
        .checkout-summary { padding:18px; border-radius:18px; }
        .checkout-actions { flex-direction:column-reverse; }
        .checkout-actions .checkout-button:first-child, .checkout-actions .checkout-button:last-child { flex:auto; width:100%; }
      }
    `}</style>
  )
}

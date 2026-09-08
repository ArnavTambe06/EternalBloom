import { ArrowRight, Gift, Heart, Sparkles } from 'lucide-react'
import { Link } from 'react-router-dom'

const benefits = [
  { icon: Sparkles, title: '100%', detail: 'handmade' },
  { icon: Gift, title: 'Customisable', detail: 'for you' },
  { icon: Heart, title: 'Made to', detail: 'last forever' },
]

export function Hero() {
  const scrollToProducts = () => {
    document.getElementById('products')?.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <section className="landing-hero">
      <div className="wrap landing-hero__inner">
        <div className="landing-hero__copy">
          <div className="hero-monogram" aria-hidden="true">EB</div>
          <p className="hero-brandline" aria-hidden="true">E T E R N A L  B L O O M</p>
          <p className="landing-hero__eyebrow">Never-dying creations</p>
          <h1>
            Creations that <em>never fade.</em>
          </h1>
          <p className="landing-hero__description">
            Handcrafted Chenille pieces for gifting, decorating, and keeping close &mdash; made slowly, meant to stay.
          </p>
          <div className="landing-hero__actions">
            <button className="landing-hero__primary" type="button" onClick={scrollToProducts}>
              Explore the collection <ArrowRight size={16} />
            </button>
            <Link className="landing-hero__secondary" to="/custom-order">
              Create something custom <ArrowRight size={14} />
            </Link>
          </div>
          <div className="landing-hero__benefits" aria-label="Why choose Eternal Bloom">
            {benefits.map(({ icon: Icon, title, detail }, index) => (
              <div className="hero-benefit" key={title}>
                <Icon size={22} strokeWidth={1.5} />
                <p><strong>{title}</strong><span>{detail}</span></p>
                {index < benefits.length - 1 && <i aria-hidden="true" />}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

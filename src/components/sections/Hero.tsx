import { ArrowRight } from 'lucide-react'

export function Hero() {
  const scrollToProducts = () => {
    document.getElementById('products')?.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <section className="landing-hero">
      <div className="wrap landing-hero__inner">
        <div className="landing-hero__copy">
          <p className="landing-hero__eyebrow">
            Handmade in India <span>·</span> Never-dying creations
          </p>

          <h1>
            Flowers that <em>never fade.</em>
          </h1>

          <p className="landing-hero__description">
            Handcrafted crochet keychains, desk buddies, bouquets & more — made slowly, meant to stay.
          </p>

          <div className="landing-hero__actions">
            <button className="landing-hero__primary" type="button" onClick={scrollToProducts}>
              Shop the collection <ArrowRight size={15} />
            </button>
            <span className="landing-hero__note">Made to order / one of one</span>
          </div>

        </div>
      </div>
    </section>
  )
}

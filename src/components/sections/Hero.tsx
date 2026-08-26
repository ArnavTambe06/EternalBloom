import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { ArrowDown, ArrowRight } from 'lucide-react'
import { getProducts } from '@/services/products'
import { ProductModal } from '@/components/product/ProductModal'
import { ProductRibbon } from '@/components/sections/ProductRibbon'
import type { Product } from '@/types'

export function Hero() {
  const [products, setProducts] = useState<Product[]>([])
  const [selected, setSelected] = useState<Product | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    getProducts({ featured: true }).then(items => {
      setProducts(items)
      setLoading(false)
    })
  }, [])

  const scrollToProducts = () => {
    document.getElementById('products')?.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <>
      <section className="landing-hero">
        <div className="landing-hero__wash landing-hero__wash--pink" />
        <div className="landing-hero__wash landing-hero__wash--gold" />
        <div className="wrap landing-hero__inner">
          <div className="landing-hero__copy">
            <motion.p
              className="landing-hero__eyebrow"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
            >
              Handmade in India <span>·</span> Never-dying creations
            </motion.p>

            <motion.h1
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.06 }}
            >
              Flowers that <em>never fade.</em>
            </motion.h1>

            <motion.p
              className="landing-hero__description"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.12 }}
            >
              Handcrafted crochet keychains, desk buddies, bouquets & more — made slowly, meant to stay.
            </motion.p>

            <motion.div
              className="landing-hero__actions"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.18 }}
            >
              <button className="landing-hero__primary" type="button" onClick={scrollToProducts}>
                Shop the collection <ArrowRight size={15} />
              </button>
              <span className="landing-hero__note">Made to order / one of one</span>
            </motion.div>

            <motion.button
              className="landing-hero__scroll"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.28 }}
              onClick={scrollToProducts}
              whileHover={{ y: 3 }}
              type="button"
            >
              <span>Scroll to browse</span>
              <ArrowDown size={15} />
            </motion.button>
          </div>

          <ProductRibbon products={products} loading={loading} onSelect={setSelected} />
        </div>
      </section>

      <ProductModal product={selected} onClose={() => setSelected(null)} />
    </>
  )
}

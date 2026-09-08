import { useState, useEffect } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { ArrowRight } from 'lucide-react'
import { Link } from 'react-router-dom'
import { getProducts } from '@/services/products'
import { ProductCard } from '@/components/product/ProductCard'
import { ProductModal } from '@/components/product/ProductModal'
import type { Product } from '@/types'

export function ProductsSection() {
  const [products, setProducts] = useState<Product[]>([])
  const [selected, setSelected] = useState<Product | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    getProducts()
      .then(setProducts)
      .finally(() => setLoading(false))
  }, [])

  const featured = products.filter(product => product.is_featured).slice(0, 4)

  return (
    <section id="products" className="featured-products">
      <div className="featured-products__header">
        <div>
          <p className="label">The collection</p>
          <h2>Small joys, made to stay.</h2>
        </div>
        <Link className="section-link" to="/categories">
          Browse collections <ArrowRight size={14} />
        </Link>
      </div>

      {loading ? (
        <div className="product-grid-3 product-grid-featured">
          {Array.from({ length: 4 }).map((_, i) => (
            <div className="product-skeleton" key={i} />
          ))}
        </div>
      ) : featured.length === 0 ? (
        <div className="featured-products__empty">
          <p>{products.length === 0 ? 'New pieces are being crafted.' : 'Featured pieces are coming soon.'}</p>
          <span>Check back shortly for the latest handmade creations.</span>
        </div>
      ) : (
        <motion.div
          layout
          className="product-grid-3 product-grid-featured"
        >
          <AnimatePresence>
            {featured.map(product => (
              <motion.div
                key={product.id}
                layout
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -12 }}
              >
                <ProductCard product={product} onViewDetails={setSelected} />
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
      )}

      <ProductModal product={selected} onClose={() => setSelected(null)} />
      <style>{`@keyframes pulse { 0%,100%{opacity:1} 50%{opacity:0.45} }`}</style>
    </section>
  )
}

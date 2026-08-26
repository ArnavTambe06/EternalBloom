import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ArrowLeft } from 'lucide-react'
import { getProductsByCategory, getCategories } from '@/services/products'
import { ProductCard } from '@/components/product/ProductCard'
import { ProductModal } from '@/components/product/ProductModal'
import { ProductGridSkeleton } from '@/components/ui/LoadingSkeleton'
import type { Product, Category } from '@/types'

export function CategoryPage() {
  const { slug } = useParams<{ slug: string }>()
  const [products, setProducts] = useState<Product[]>([])
  const [category, setCategory] = useState<Category | null>(null)
  const [selected, setSelected] = useState<Product | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!slug) return
    async function load() {
      setLoading(true)
      const [prods, cats] = await Promise.all([
        getProductsByCategory(slug!),
        getCategories(),
      ])
      setProducts(prods)
      setCategory(cats.find(c => c.slug === slug) || null)
      setLoading(false)
    }
    load()
  }, [slug])

  return (
    <div style={{ backgroundColor: 'var(--surface)', minHeight: '100vh' }}>

      {/* Banner */}
      <div style={{
        background: 'linear-gradient(135deg, rgba(255,133,208,0.12) 0%, rgba(255,230,128,0.12) 100%)',
        padding: '48px 24px 40px',
        borderBottom: '1px solid var(--border)',
      }}>
        <div className="container">
          <Link to="/" style={{
            display: 'inline-flex', alignItems: 'center', gap: 6,
            fontFamily: 'var(--font-body)', fontSize: 13,
            color: 'var(--on-surface-muted)', marginBottom: 24,
          }}>
            <ArrowLeft size={14} /> Back to Home
          </Link>
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <p className="label-caps" style={{ marginBottom: 10 }}>Collection</p>
            <h1 style={{
              fontFamily: 'var(--font-display)',
              fontSize: 'clamp(32px, 4vw, 48px)',
              fontWeight: 700, color: 'var(--on-surface)', marginBottom: 10,
            }}>
              {category?.name || (loading ? 'Loading...' : 'Collection')}
            </h1>
            {category?.description && (
              <p style={{
                fontFamily: 'var(--font-body)', fontSize: 15,
                color: 'var(--on-surface-muted)', maxWidth: 480,
              }}>{category.description}</p>
            )}
          </motion.div>
        </div>
      </div>

      {/* Products */}
      <div className="container" style={{ padding: '56px var(--px)' }}>
        {loading ? (
          <ProductGridSkeleton count={8} />
        ) : products.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '80px 0' }}>
            <p style={{ fontSize: 48, marginBottom: 16 }}>🌸</p>
            <p style={{
              fontFamily: 'var(--font-display)',
              fontSize: 22, color: 'var(--on-surface)', marginBottom: 8,
            }}>Coming Soon</p>
            <p style={{ fontFamily: 'var(--font-body)', color: 'var(--on-surface-muted)', fontSize: 14 }}>
              New pieces in this collection are on their way.
            </p>
            <Link to="/" style={{
              display: 'inline-block', marginTop: 24,
              padding: '12px 24px',
              background: 'var(--primary-gradient)',
              borderRadius: 999,
              fontFamily: 'var(--font-body)', fontSize: 13, fontWeight: 600,
              color: 'var(--on-surface)',
            }}>Browse All</Link>
          </div>
        ) : (
          <>
            <p style={{
              fontFamily: 'var(--font-body)', fontSize: 13,
              color: 'var(--on-surface-muted)', marginBottom: 28,
            }}>
              {products.length} {products.length === 1 ? 'product' : 'products'}
            </p>
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(4, 1fr)',
              gap: 20,
            }} className="products-grid">
              {products.map((product, i) => (
                <motion.div
                  key={product.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.06 }}
                >
                  <ProductCard product={product} onViewDetails={setSelected} />
                </motion.div>
              ))}
            </div>
          </>
        )}
      </div>

      <ProductModal product={selected} onClose={() => setSelected(null)} />
    </div>
  )
}

import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ArrowLeft } from 'lucide-react'
import { getProductsByCategory, getCategoryBySlug } from '@/services/products'
import { ProductCard } from '@/components/product/ProductCard'
import { ProductModal } from '@/components/product/ProductModal'
import { ProductGridSkeleton } from '@/components/ui/LoadingSkeleton'
import type { Product, Category } from '@/types'

export function CategoryPage() {
  const { slug, subcategorySlug } = useParams<{ slug: string; subcategorySlug?: string }>()
  const [products, setProducts] = useState<Product[]>([])
  const [category, setCategory] = useState<Category | null>(null)
  const [selected, setSelected] = useState<Product | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!slug) return
    async function load() {
      setLoading(true)
      const [prods, category] = await Promise.all([
        getProductsByCategory(slug!, subcategorySlug),
        getCategoryBySlug(slug!),
      ])
      setProducts(prods)
      setCategory(category)
      setLoading(false)
    }
    load()
  }, [slug, subcategorySlug])

  const activeSubcategory = category?.subcategories?.find(subcategory => subcategory.slug === subcategorySlug)

  return (
    <div style={{ backgroundColor: 'var(--surface)', minHeight: '100vh' }}>

      {/* Banner */}
      <div style={{
        background: 'linear-gradient(135deg, rgba(232,163,185,0.12) 0%, rgba(244,223,154,0.12) 100%)',
        padding: '48px 24px 40px',
        borderBottom: '1px solid var(--border)',
      }}>
        <div className="container">
          <Link to="/categories" style={{
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
            <p className="label-caps" style={{ marginBottom: 10 }}>{activeSubcategory ? `${category?.name} collection` : 'Collection'}</p>
            <h1 style={{
              fontFamily: 'var(--font-display)',
              fontSize: 'clamp(32px, 4vw, 48px)',
              fontWeight: 700, color: 'var(--on-surface)', marginBottom: 10,
            }}>
              {activeSubcategory?.name || category?.name || (loading ? 'Loading...' : 'Collection')}
            </h1>
            {(activeSubcategory?.description || category?.description) && (
              <p style={{
                fontFamily: 'var(--font-body)', fontSize: 15,
                color: 'var(--on-surface-muted)', maxWidth: 480,
              }}>{activeSubcategory?.description || category?.description}</p>
            )}
            {category?.subcategories && category.subcategories.length > 0 && (
              <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginTop: 24 }}>
                <Link to={`/categories/${category.slug}`} style={categoryPillStyle(!subcategorySlug)}>All pieces</Link>
                {category.subcategories.map(subcategory => (
                  <Link key={subcategory.id} to={`/categories/${category.slug}/${subcategory.slug}`} style={categoryPillStyle(subcategory.slug === subcategorySlug)}>
                    {subcategory.name}
                  </Link>
                ))}
              </div>
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
            <Link to="/categories" style={{
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

const categoryPillStyle = (active: boolean): React.CSSProperties => ({
  display: 'inline-flex', alignItems: 'center',
  padding: '8px 14px', borderRadius: 999,
  background: active ? 'var(--ink)' : 'rgba(255,255,255,0.7)',
  border: `1px solid ${active ? 'var(--ink)' : 'var(--line-2)'}`,
  color: active ? '#FFFFFF' : 'var(--ink-2)',
  fontFamily: 'var(--font-body)', fontSize: 12, fontWeight: active ? 700 : 500,
})

import { useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ArrowLeft } from 'lucide-react'
import { CATEGORIES } from '@/lib/constants'
import { mockProducts } from '@/lib/mockData'
import { ProductCard } from '@/components/product/ProductCard'
import { ProductModal } from '@/components/product/ProductModal'
import type { Product } from '@/types'

export function CategoryPage() {
  const { slug } = useParams<{ slug: string }>()
  const [selected, setSelected] = useState<Product | null>(null)

  const category = CATEGORIES.find(c => c.slug === slug)
  const products = mockProducts.filter(p => p.category?.slug === slug)

  return (
    <div style={{ backgroundColor: '#FFF9F2', minHeight: '100vh' }}>

      {/* Hero banner */}
      <div style={{
        background: 'linear-gradient(135deg, #F6EFE7 0%, #FFF9F2 100%)',
        padding: '48px 24px 40px',
        borderBottom: '1px solid #E7DDD5',
      }}>
        <div style={{ maxWidth: 1280, margin: '0 auto' }}>
          <Link
            to="/"
            style={{
              display: 'inline-flex', alignItems: 'center', gap: 6,
              color: '#786A61', fontFamily: 'Inter, sans-serif',
              fontSize: 13, textDecoration: 'none', marginBottom: 24,
            }}
          >
            <ArrowLeft size={14} /> Back to Home
          </Link>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <p style={{
              fontFamily: 'Poppins, sans-serif', fontSize: 11,
              fontWeight: 600, letterSpacing: '0.18em',
              color: '#B56A45', textTransform: 'uppercase', marginBottom: 10,
            }}>Collection</p>
            <h1 style={{
              fontFamily: 'Playfair Display, serif',
              fontSize: 'clamp(32px, 4vw, 48px)',
              fontWeight: 700, color: '#46352A', marginBottom: 10,
            }}>
              {category?.name || 'Products'}
            </h1>
            <p style={{
              fontFamily: 'Inter, sans-serif', fontSize: 15,
              color: '#786A61', maxWidth: 480,
            }}>
              {category?.tagline || 'Handcrafted with love and care.'}
            </p>
          </motion.div>
        </div>
      </div>

      {/* Products */}
      <div style={{ maxWidth: 1280, margin: '0 auto', padding: '48px 24px' }}>
        {products.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '80px 0' }}>
            <p style={{ fontSize: 48, marginBottom: 16 }}>🌸</p>
            <p style={{
              fontFamily: 'Playfair Display, serif',
              fontSize: 22, color: '#46352A', marginBottom: 8,
            }}>Coming Soon</p>
            <p style={{ fontFamily: 'Inter, sans-serif', color: '#786A61', fontSize: 14 }}>
              New pieces in this collection are on their way.
            </p>
            <Link to="/" style={{
              display: 'inline-block', marginTop: 24,
              padding: '12px 24px',
              backgroundColor: '#B56A45', color: 'white',
              borderRadius: 12, textDecoration: 'none',
              fontFamily: 'Poppins, sans-serif', fontSize: 13, fontWeight: 600,
            }}>
              Browse All
            </Link>
          </div>
        ) : (
          <>
            <p style={{
              fontFamily: 'Inter, sans-serif', fontSize: 13,
              color: '#786A61', marginBottom: 24,
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
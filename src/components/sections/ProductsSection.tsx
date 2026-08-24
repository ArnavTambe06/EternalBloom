import { useState, useEffect } from 'react'
import { getProducts, getCategories } from '@/services/products'
import { ProductCard } from '@/components/product/ProductCard'
import { ProductModal } from '@/components/product/ProductModal'
import type { Product, Category } from '@/types'

export function ProductsSection() {
  const [products, setProducts] = useState<Product[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [selected, setSelected] = useState<Product | null>(null)
  const [activeCategory, setActiveCategory] = useState('all')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    Promise.all([getProducts(), getCategories()]).then(([prods, cats]) => {
      setProducts(prods)
      setCategories(cats)
      setLoading(false)
    })
  }, [])

  const filtered = activeCategory === 'all'
    ? products
    : products.filter(p => p.category?.slug === activeCategory)

  const filters = [
    { label: 'All', value: 'all' },
    ...categories.map(c => ({ label: c.name, value: c.slug })),
  ]

  return (
    <section
      id="products"
      style={{
        backgroundColor: 'var(--bg)',
        padding: '80px 0',
      }}
    >
      <div className="wrap">

        {/* Header */}
        <div
          style={{
            display: 'flex',
            alignItems: 'flex-end',
            justifyContent: 'space-between',
            marginBottom: 40,
            paddingBottom: 24,
            borderBottom: '1px solid var(--line)',
          }}
        >
          <div>
            <p
              style={{
                fontFamily: 'var(--sans)',
                fontSize: 11,
                fontWeight: 600,
                letterSpacing: '0.15em',
                textTransform: 'uppercase',
                color: 'var(--ink-3)',
                marginBottom: 8,
              }}
            >
              The Collection
            </p>

            <h2
              style={{
                fontFamily: 'var(--serif)',
                fontSize: 'clamp(26px, 3vw, 36px)',
                fontWeight: 600,
                color: 'var(--ink)',
                letterSpacing: '-0.02em',
              }}
            >
              All Products
            </h2>
          </div>

          <p
            style={{
              fontFamily: 'var(--sans)',
              fontSize: 13,
              color: 'var(--ink-3)',
            }}
          >
            {loading ? '' : `${filtered.length} products`}
          </p>
        </div>

        {/* Filter tabs */}
        {!loading && categories.length > 0 && (
          <div
            style={{
              display: 'flex',
              gap: 8,
              flexWrap: 'wrap',
              marginBottom: 48,
              overflowX: 'auto',
            }}
          >
            {filters.map(f => (
              <button
                key={f.value}
                onClick={() => setActiveCategory(f.value)}
                style={{
                  padding: '7px 16px',
                  backgroundColor:
                    activeCategory === f.value
                      ? 'var(--ink)'
                      : 'transparent',
                  color:
                    activeCategory === f.value
                      ? 'white'
                      : 'var(--ink-2)',
                  border: '1px solid',
                  borderColor:
                    activeCategory === f.value
                      ? 'var(--ink)'
                      : 'var(--line)',
                  borderRadius: 0,
                  fontFamily: 'var(--sans)',
                  fontSize: 12,
                  fontWeight: 500,
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                  whiteSpace: 'nowrap',
                  letterSpacing: '0.03em',
                }}
              >
                {f.label}
              </button>
            ))}
          </div>
        )}

        {/* Grid */}
        {loading ? (
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(4, 1fr)',
              gap: 24,
            }}
            className="product-grid"
          >
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i}>
                <div
                  style={{
                    aspectRatio: '3/4',
                    backgroundColor: 'var(--bg-soft)',
                    marginBottom: 12,
                    animation: 'pulse 1.5s ease infinite',
                  }}
                />

                <div
                  style={{
                    height: 12,
                    backgroundColor: 'var(--bg-soft)',
                    marginBottom: 8,
                    width: '60%',
                    animation: 'pulse 1.5s ease infinite',
                  }}
                />

                <div
                  style={{
                    height: 10,
                    backgroundColor: 'var(--bg-soft)',
                    width: '40%',
                    animation: 'pulse 1.5s ease infinite',
                  }}
                />
              </div>
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div
            style={{
              textAlign: 'center',
              padding: '80px 0',
            }}
          >
            <p
              style={{
                fontFamily: 'var(--serif)',
                fontSize: 20,
                color: 'var(--ink)',
                marginBottom: 8,
              }}
            >
              No products yet
            </p>

            <p
              style={{
                fontFamily: 'var(--sans)',
                fontSize: 14,
                color: 'var(--ink-3)',
              }}
            >
              Check back soon — new pieces are being crafted.
            </p>
          </div>
        ) : (
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(4, 1fr)',
              gap: '32px 24px',
            }}
            className="product-grid"
          >
            {filtered.map((product) => (
              <div key={product.id}>
                <ProductCard
                  product={product}
                  onViewDetails={setSelected}
                />
              </div>
            ))}
          </div>
        )}
      </div>

      <ProductModal
        product={selected}
        onClose={() => setSelected(null)}
      />

      <style>{`
        @keyframes pulse {
          0%,100% {
            opacity: 1;
          }

          50% {
            opacity: 0.4;
          }
        }
      `}</style>
    </section>
  )
}
import { motion } from 'framer-motion'
import { Link, useParams } from 'react-router-dom'
import { CheckCircle, Package, ArrowRight } from 'lucide-react'

export function OrderSuccessPage() {
  const { orderId } = useParams()

  return (
    <div style={{
      minHeight: '100vh', backgroundColor: '#FFF9F2',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      padding: 24,
    }}>
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ type: 'spring', stiffness: 200, damping: 20 }}
        style={{
          backgroundColor: 'white', borderRadius: 28,
          padding: '48px 40px', maxWidth: 480,
          width: '100%', textAlign: 'center',
          boxShadow: '0 12px 60px rgba(70,53,42,0.12)',
          border: '1px solid #E7DDD5',
        }}
      >
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
          style={{ marginBottom: 20 }}
        >
          <div style={{
            width: 72, height: 72, borderRadius: '50%',
            backgroundColor: '#F0FDF4',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            margin: '0 auto',
          }}>
            <CheckCircle size={36} color="#91A57A" />
          </div>
        </motion.div>

        <div style={{ fontSize: 40, marginBottom: 16 }}>🌸</div>

        <h1 style={{
          fontFamily: 'Playfair Display, serif',
          fontSize: 28, fontWeight: 700, color: '#46352A', marginBottom: 10,
        }}>Order Placed!</h1>

        <p style={{
          fontFamily: 'Inter, sans-serif', fontSize: 14,
          color: '#786A61', lineHeight: 1.6, marginBottom: 24,
        }}>
          Thank you for your order. We're already getting started on crafting
          your pieces with love. You'll receive a confirmation email shortly.
        </p>

        <div style={{
          backgroundColor: '#F6EFE7', borderRadius: 14,
          padding: '16px 20px', marginBottom: 28,
          display: 'flex', alignItems: 'center', gap: 12,
        }}>
          <Package size={20} color="#B56A45" />
          <div style={{ textAlign: 'left' }}>
            <p style={{ fontFamily: 'Poppins, sans-serif', fontSize: 12, fontWeight: 600, color: '#46352A' }}>
              Order ID
            </p>
            <p style={{ fontFamily: 'Inter, sans-serif', fontSize: 13, color: '#786A61', marginTop: 2 }}>
              #{orderId?.toUpperCase()}
            </p>
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          <Link to="/my-orders" style={{ textDecoration: 'none' }}>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.97 }}
              style={{
                width: '100%', padding: '13px',
                backgroundColor: '#B56A45', color: 'white',
                border: 'none', borderRadius: 12,
                fontFamily: 'Poppins, sans-serif',
                fontSize: 14, fontWeight: 600, cursor: 'pointer',
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
                boxShadow: '0 4px 16px rgba(181,106,69,0.25)',
              }}
            >
              Track My Order <ArrowRight size={15} />
            </motion.button>
          </Link>
          <Link to="/" style={{ textDecoration: 'none' }}>
            <button style={{
              width: '100%', padding: '13px',
              border: '1.5px solid #E7DDD5', borderRadius: 12,
              backgroundColor: 'white', color: '#46352A',
              fontFamily: 'Poppins, sans-serif', fontSize: 14, cursor: 'pointer',
            }}>
              Continue Shopping
            </button>
          </Link>
        </div>
      </motion.div>
    </div>
  )
}
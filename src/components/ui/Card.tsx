import { cn } from '@/lib/utils'
import { motion } from 'framer-motion'

interface CardProps {
  className?: string
  children: React.ReactNode
  hover?: boolean
  onClick?: () => void
}

export function Card({ className, children, hover = false, onClick }: CardProps) {
  if (hover) {
    return (
      <motion.div
        whileHover={{ y: -4, boxShadow: '0 8px 32px 0 rgba(70,53,42,0.13)' }}
        transition={{ type: 'spring', stiffness: 300, damping: 24 }}
        onClick={onClick}
        className={cn(
          'bg-white rounded-2xl border border-[#E7DDD5] shadow-[0_2px_12px_0_rgba(70,53,42,0.07)] overflow-hidden cursor-pointer',
          className,
        )}
      >
        {children}
      </motion.div>
    )
  }

  return (
    <div
      className={cn(
        'bg-white rounded-2xl border border-[#E7DDD5] shadow-[0_2px_12px_0_rgba(70,53,42,0.07)] overflow-hidden',
        className,
      )}
    >
      {children}
    </div>
  )
}

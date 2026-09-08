import { forwardRef } from 'react'
import { cn } from '@/lib/utils'
import { motion } from 'framer-motion'

type Variant = 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger'
type Size = 'sm' | 'md' | 'lg'

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant
  size?: Size
  loading?: boolean
  fullWidth?: boolean
}

const variantStyles: Record<Variant, string> = {
  primary:   'bg-[#9E5E73] text-white hover:bg-[#7F475B] shadow-[0_8px_18px_rgba(158,94,115,0.22)]',
  secondary: 'bg-[#FFF0E8] text-[#241B20] hover:bg-[#FCEAF2] border border-[#EAD9D2]',
  outline:   'border border-[#9E5E73] bg-white text-[#9E5E73] hover:bg-[#FFF0E8]',
  ghost:     'text-[#5C4033] hover:bg-[#FFF0E8]',
  danger:    'bg-red-500 text-white hover:bg-red-600',
}

const sizeStyles: Record<Size, string> = {
  sm: 'h-9 px-3.5 text-xs rounded-lg',
  md: 'h-11 px-5 text-sm rounded-xl',
  lg: 'h-12 px-6 text-sm rounded-xl',
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ variant = 'primary', size = 'md', loading, fullWidth, className, children, disabled, ...props }, ref) => {
    return (
      <motion.button
        ref={ref}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.97 }}
        disabled={disabled || loading}
        className={cn(
          'inline-flex items-center justify-center gap-2 font-[Poppins] font-semibold tracking-[0.01em] transition-all duration-200 cursor-pointer select-none disabled:opacity-50 disabled:cursor-not-allowed disabled:shadow-none',
          variantStyles[variant],
          sizeStyles[size],
          fullWidth && 'w-full',
          className,
        )}
        {...(props as any)}
      >
        {loading && (
          <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
          </svg>
        )}
        {children}
      </motion.button>
    )
  }
)

Button.displayName = 'Button'

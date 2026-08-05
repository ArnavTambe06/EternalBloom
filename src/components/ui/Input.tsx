import { forwardRef } from 'react'
import { cn } from '@/lib/utils'

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string
  error?: string
  hint?: string
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, hint, className, id, ...props }, ref) => {
    const inputId = id || label?.toLowerCase().replace(/\s+/g, '-')
    return (
      <div className="flex flex-col gap-1.5">
        {label && (
          <label htmlFor={inputId} className="text-sm font-medium text-[#46352A] font-[Inter]">
            {label}
          </label>
        )}
        <input
          ref={ref}
          id={inputId}
          className={cn(
            'h-10 w-full rounded-lg border border-[#E7DDD5] bg-white px-3 text-sm text-[#46352A] placeholder:text-[#786A61] transition-colors',
            'focus:outline-none focus:ring-2 focus:ring-[#B56A45]/30 focus:border-[#B56A45]',
            'disabled:bg-[#F6EFE7] disabled:cursor-not-allowed',
            error && 'border-red-400 focus:ring-red-200 focus:border-red-400',
            className,
          )}
          {...props}
        />
        {hint && !error && <p className="text-xs text-[#786A61]">{hint}</p>}
        {error && <p className="text-xs text-red-500">{error}</p>}
      </div>
    )
  }
)

Input.displayName = 'Input'
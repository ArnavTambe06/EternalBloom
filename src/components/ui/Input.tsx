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
      <div className="flex flex-col gap-2">
        {label && (
          <label htmlFor={inputId} className="text-sm font-medium text-[#5C4033] font-[Inter]">
            {label}
          </label>
        )}
        <input
          ref={ref}
          id={inputId}
          className={cn(
            'h-11 w-full rounded-xl border border-[#EAD9D2] bg-white px-3.5 text-sm text-[#5C4033] placeholder:text-[#9B8F87] transition-colors',
            'focus:outline-none focus:ring-2 focus:ring-[#9E5E73]/30 focus:border-[#9E5E73]',
            'disabled:bg-[#FFF0E8] disabled:cursor-not-allowed',
            error && 'border-red-400 focus:ring-red-200 focus:border-red-400',
            className,
          )}
          {...props}
        />
        {hint && !error && <p className="text-xs text-[#8C665D]">{hint}</p>}
        {error && <p className="text-xs text-red-500">{error}</p>}
      </div>
    )
  }
)

Input.displayName = 'Input'

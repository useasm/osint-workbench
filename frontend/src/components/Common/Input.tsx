import { forwardRef, useId, type InputHTMLAttributes, type ReactNode } from 'react'
import { cn } from '../../lib/cn'

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string
  hint?: string
  error?: string
  leftIcon?: ReactNode
  rightIcon?: ReactNode
  containerClassName?: string
}

export const Input = forwardRef<HTMLInputElement, InputProps>(function Input(
  { label, hint, error, leftIcon, rightIcon, className, containerClassName, id, ...props },
  ref,
) {
  const autoId = useId()
  const inputId = id ?? autoId

  return (
    <div className={cn('flex flex-col gap-1.5', containerClassName)}>
      {label && (
        <label
          htmlFor={inputId}
          className="text-[11px] font-medium uppercase tracking-wider text-text-secondary"
        >
          {label}
        </label>
      )}

      <div className="relative">
        {leftIcon && (
          <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-text-secondary">
            {leftIcon}
          </span>
        )}
        <input
          ref={ref}
          id={inputId}
          aria-invalid={error ? true : undefined}
          className={cn(
            'w-full rounded-sm border bg-bg-secondary px-3 py-2.5 text-sm text-text-primary',
            'placeholder:text-text-secondary/60 transition-all duration-300 ease-out-soft',
            'focus:outline-none',
            leftIcon && 'pl-9',
            rightIcon && 'pr-9',
            error
              ? 'border-accent-red/70 focus:border-accent-red focus:shadow-glow-red'
              : 'border-border-color focus:border-accent-cyan focus:shadow-glow-cyan',
            className,
          )}
          {...props}
        />
        {rightIcon && (
          <span className="absolute right-3 top-1/2 -translate-y-1/2 text-text-secondary">
            {rightIcon}
          </span>
        )}
      </div>

      {error ? (
        <p className="text-[11px] text-accent-red">{error}</p>
      ) : (
        hint && <p className="text-[11px] text-text-secondary">{hint}</p>
      )}
    </div>
  )
})

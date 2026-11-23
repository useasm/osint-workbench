import { forwardRef, type ButtonHTMLAttributes, type ReactNode } from 'react'
import { Loader2 } from 'lucide-react'
import { cn } from '../../lib/cn'

export type ButtonVariant = 'primary' | 'secondary' | 'danger' | 'ghost'
export type ButtonSize = 'sm' | 'md' | 'lg'

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant
  size?: ButtonSize
  leftIcon?: ReactNode
  rightIcon?: ReactNode
  loading?: boolean
  fullWidth?: boolean
}

const base =
  'inline-flex items-center justify-center gap-2 font-medium uppercase tracking-normal ' +
  'rounded-lg border transition-all duration-300 ease-out-soft select-none ' +
  'focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-bg-primary ' +
  'disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:shadow-none active:translate-y-px'

const variants: Record<ButtonVariant, string> = {
  primary:
    'bg-accent-green/10 text-accent-green border-accent-green/60 ' +
    'hover:bg-accent-green/20 hover:shadow-glow-green hover:border-accent-green ' +
    'focus-visible:ring-accent-green',
  secondary:
    'bg-bg-tertiary text-text-primary border-border-color ' +
    'hover:border-accent-cyan/70 hover:text-accent-cyan hover:shadow-glow-cyan ' +
    'focus-visible:ring-accent-cyan',
  danger:
    'bg-accent-red/10 text-accent-red border-accent-red/60 ' +
    'hover:bg-accent-red/20 hover:shadow-glow-red hover:border-accent-red ' +
    'focus-visible:ring-accent-red',
  ghost:
    'bg-transparent text-text-secondary border-transparent ' +
    'hover:text-accent-cyan hover:bg-bg-tertiary ' +
    'focus-visible:ring-accent-cyan',
}

const sizes: Record<ButtonSize, string> = {
  sm: 'text-[11px] px-3 py-1.5',
  md: 'text-xs px-4 py-2.5',
  lg: 'text-sm px-6 py-3',
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(function Button(
  {
    variant = 'primary',
    size = 'md',
    leftIcon,
    rightIcon,
    loading = false,
    fullWidth = false,
    className,
    children,
    disabled,
    type = 'button',
    ...props
  },
  ref,
) {
  return (
    <button
      ref={ref}
      type={type}
      disabled={disabled || loading}
      className={cn(base, variants[variant], sizes[size], fullWidth && 'w-full', className)}
      {...props}
    >
      {loading ? (
        <Loader2 className="h-4 w-4 animate-spin" aria-hidden />
      ) : (
        leftIcon && <span className="shrink-0">{leftIcon}</span>
      )}
      {children && <span className="truncate">{children}</span>}
      {!loading && rightIcon && <span className="shrink-0">{rightIcon}</span>}
    </button>
  )
})

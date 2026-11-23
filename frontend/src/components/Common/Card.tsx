import type { HTMLAttributes, ReactNode } from 'react'
import { cn } from '../../lib/cn'

export interface CardProps extends Omit<HTMLAttributes<HTMLDivElement>, 'title'> {
  title?: ReactNode
  subtitle?: ReactNode
  /** Rendered on the right side of the header row. */
  action?: ReactNode
  /** Remove inner padding (useful when embedding a Table). */
  noPadding?: boolean
  /** Add an accent glow + colored top border on hover. */
  interactive?: boolean
  children?: ReactNode
}

export function Card({
  title,
  subtitle,
  action,
  noPadding = false,
  interactive = false,
  className,
  children,
  ...props
}: CardProps) {
  const hasHeader = title || subtitle || action

  return (
    <div
      className={cn(
        'rounded border border-border-color bg-bg-secondary/80 backdrop-blur-sm',
        'transition-all duration-300 ease-out-soft',
        interactive && 'hover:border-accent-cyan/50 hover:shadow-glow-cyan',
        className,
      )}
      {...props}
    >
      {hasHeader && (
        <div className="flex items-start justify-between gap-4 border-b border-border-color px-5 py-4">
          <div className="min-w-0">
            {title && (
              <h3 className="truncate text-sm font-semibold uppercase tracking-wide text-text-primary">
                {title}
              </h3>
            )}
            {subtitle && <p className="mt-0.5 truncate text-xs text-text-secondary">{subtitle}</p>}
          </div>
          {action && <div className="shrink-0">{action}</div>}
        </div>
      )}
      <div className={cn(!noPadding && 'p-5')}>{children}</div>
    </div>
  )
}

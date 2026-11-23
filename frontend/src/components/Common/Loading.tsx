import { Loader2 } from 'lucide-react'
import { cn } from '../../lib/cn'

export interface LoadingProps {
  size?: 'sm' | 'md' | 'lg'
  label?: string
  /** Fill the parent and center the spinner. */
  fullScreen?: boolean
  className?: string
}

const sizes = {
  sm: 'h-4 w-4',
  md: 'h-7 w-7',
  lg: 'h-10 w-10',
}

export function Loading({ size = 'md', label, fullScreen = false, className }: LoadingProps) {
  const spinner = (
    <div
      className={cn('flex flex-col items-center justify-center gap-3 text-accent-green', className)}
      role="status"
      aria-live="polite"
    >
      <Loader2 className={cn('animate-spin', sizes[size])} />
      {label ? (
        <span className="text-xs uppercase tracking-widest text-text-secondary">
          {label}
          <span className="animate-blink">_</span>
        </span>
      ) : (
        <span className="sr-only">Loading</span>
      )}
    </div>
  )

  if (fullScreen) {
    return <div className="flex min-h-[60vh] w-full items-center justify-center">{spinner}</div>
  }
  return spinner
}

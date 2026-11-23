import { useEffect, useRef, type ReactNode } from 'react'
import { createPortal } from 'react-dom'
import { X } from 'lucide-react'
import { cn } from '../../lib/cn'

export type ModalSize = 'sm' | 'md' | 'lg'

export interface ModalProps {
  open: boolean
  onClose: () => void
  title?: ReactNode
  description?: ReactNode
  size?: ModalSize
  /** Optional footer area (e.g. action buttons). */
  footer?: ReactNode
  children?: ReactNode
}

const sizes: Record<ModalSize, string> = {
  sm: 'max-w-sm',
  md: 'max-w-lg',
  lg: 'max-w-2xl',
}

export function Modal({ open, onClose, title, description, size = 'md', footer, children }: ModalProps) {
  const panelRef = useRef<HTMLDivElement>(null)

  // Close on Escape + lock body scroll while open.
  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    document.addEventListener('keydown', onKey)
    const prevOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    // Move focus into the dialog for keyboard users.
    panelRef.current?.focus()
    return () => {
      document.removeEventListener('keydown', onKey)
      document.body.style.overflow = prevOverflow
    }
  }, [open, onClose])

  if (!open) return null

  return createPortal(
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
      aria-label={typeof title === 'string' ? title : 'Dialog'}
    >
      {/* Overlay */}
      <button
        type="button"
        aria-label="Close dialog"
        onClick={onClose}
        className="absolute inset-0 cursor-default bg-bg-primary/80 backdrop-blur-sm animate-fade-in"
      />

      {/* Panel */}
      <div
        ref={panelRef}
        tabIndex={-1}
        className={cn(
          'relative w-full overflow-hidden rounded border border-border-color bg-bg-secondary shadow-glow-cyan',
          'animate-scale-in focus:outline-none',
          sizes[size],
        )}
      >
        {(title || description) && (
          <div className="flex items-start justify-between gap-4 border-b border-border-color px-5 py-4">
            <div className="min-w-0">
              {title && (
                <h2 className="text-sm font-semibold uppercase tracking-wide text-text-primary">
                  {title}
                </h2>
              )}
              {description && <p className="mt-1 text-xs text-text-secondary">{description}</p>}
            </div>
            <button
              type="button"
              onClick={onClose}
              aria-label="Close"
              className="rounded-sm p-1 text-text-secondary transition-colors duration-300 hover:bg-bg-tertiary hover:text-accent-red focus:outline-none focus-visible:ring-2 focus-visible:ring-accent-red"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        )}

        {children && <div className="px-5 py-4 text-sm text-text-primary">{children}</div>}

        {footer && (
          <div className="flex justify-end gap-3 border-t border-border-color bg-bg-primary/40 px-5 py-4">
            {footer}
          </div>
        )}
      </div>
    </div>,
    document.body,
  )
}

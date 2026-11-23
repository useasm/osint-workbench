import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from 'react'
import { createPortal } from 'react-dom'
import { AlertTriangle, CheckCircle2, Info, X, XCircle } from 'lucide-react'
import { cn } from '../../lib/cn'

export type ToastVariant = 'success' | 'error' | 'warning' | 'info'

export interface ToastItem {
  id: number
  title: string
  message?: string
  variant: ToastVariant
}

type ToastInput = Omit<ToastItem, 'id'>

interface ToastContextValue {
  showToast: (toast: ToastInput) => void
}

const ToastContext = createContext<ToastContextValue | null>(null)

const config: Record<
  ToastVariant,
  { icon: typeof Info; border: string; text: string; glow: string }
> = {
  success: { icon: CheckCircle2, border: 'border-accent-green/60', text: 'text-accent-green', glow: 'shadow-glow-green' },
  error: { icon: XCircle, border: 'border-accent-red/60', text: 'text-accent-red', glow: 'shadow-glow-red' },
  warning: { icon: AlertTriangle, border: 'border-accent-orange/60', text: 'text-accent-orange', glow: 'shadow-glow-orange' },
  info: { icon: Info, border: 'border-accent-cyan/60', text: 'text-accent-cyan', glow: 'shadow-glow-cyan' },
}

function ToastCard({ toast, onDismiss }: { toast: ToastItem; onDismiss: (id: number) => void }) {
  const c = config[toast.variant]
  const Icon = c.icon
  return (
    <div
      role="status"
      className={cn(
        'pointer-events-auto flex w-80 items-start gap-3 rounded border bg-bg-secondary px-4 py-3',
        'animate-slide-in-right',
        c.border,
        c.glow,
      )}
    >
      <Icon className={cn('mt-0.5 h-4 w-4 shrink-0', c.text)} />
      <div className="min-w-0 flex-1">
        <p className="text-xs font-semibold uppercase tracking-wide text-text-primary">{toast.title}</p>
        {toast.message && <p className="mt-0.5 text-xs text-text-secondary">{toast.message}</p>}
      </div>
      <button
        type="button"
        aria-label="Dismiss notification"
        onClick={() => onDismiss(toast.id)}
        className="rounded-sm p-0.5 text-text-secondary transition-colors duration-300 hover:text-text-primary focus:outline-none focus-visible:ring-1 focus-visible:ring-accent-cyan"
      >
        <X className="h-3.5 w-3.5" />
      </button>
    </div>
  )
}

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<ToastItem[]>([])
  const idRef = useRef(0)

  const dismiss = useCallback((id: number) => {
    setToasts((prev) => prev.filter((t) => t.id !== id))
  }, [])

  const showToast = useCallback((toast: ToastInput) => {
    const id = ++idRef.current
    setToasts((prev) => [...prev, { ...toast, id }])
  }, [])

  const value = useMemo(() => ({ showToast }), [showToast])

  return (
    <ToastContext.Provider value={value}>
      {children}
      {createPortal(
        <div className="pointer-events-none fixed right-4 top-4 z-[60] flex flex-col gap-3">
          {toasts.map((t) => (
            <AutoDismiss key={t.id} id={t.id} onDismiss={dismiss}>
              <ToastCard toast={t} onDismiss={dismiss} />
            </AutoDismiss>
          ))}
        </div>,
        document.body,
      )}
    </ToastContext.Provider>
  )
}

function AutoDismiss({
  id,
  onDismiss,
  children,
}: {
  id: number
  onDismiss: (id: number) => void
  children: ReactNode
}) {
  useEffect(() => {
    const timer = window.setTimeout(() => onDismiss(id), 4000)
    return () => window.clearTimeout(timer)
  }, [id, onDismiss])
  return <>{children}</>
}

// eslint-disable-next-line react-refresh/only-export-components
export function useToast(): ToastContextValue {
  const ctx = useContext(ToastContext)
  if (!ctx) throw new Error('useToast must be used within a <ToastProvider>')
  return ctx
}

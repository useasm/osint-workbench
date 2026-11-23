import type { HTMLAttributes, ReactNode } from 'react'
import { cn } from '../../lib/cn'
import type { CaseStatus, FindingStatus, Severity } from '../../mocks/data'

export type BadgeVariant =
  | 'critical'
  | 'high'
  | 'medium'
  | 'low'
  | 'info'
  | 'success'
  | 'warning'
  | 'neutral'

export interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  variant?: BadgeVariant
  /** Render a small leading status dot. */
  dot?: boolean
  children: ReactNode
}

const variants: Record<BadgeVariant, string> = {
  critical: 'bg-accent-red/10 text-accent-red border-accent-red/40',
  high: 'bg-accent-orange/10 text-accent-orange border-accent-orange/40',
  medium: 'bg-yellow-400/10 text-yellow-300 border-yellow-400/40',
  low: 'bg-accent-green/10 text-accent-green border-accent-green/40',
  info: 'bg-accent-cyan/10 text-accent-cyan border-accent-cyan/40',
  success: 'bg-accent-green/10 text-accent-green border-accent-green/40',
  warning: 'bg-accent-orange/10 text-accent-orange border-accent-orange/40',
  neutral: 'bg-bg-tertiary text-text-secondary border-border-color',
}

const dotColor: Record<BadgeVariant, string> = {
  critical: 'bg-accent-red',
  high: 'bg-accent-orange',
  medium: 'bg-yellow-300',
  low: 'bg-accent-green',
  info: 'bg-accent-cyan',
  success: 'bg-accent-green',
  warning: 'bg-accent-orange',
  neutral: 'bg-text-secondary',
}

export function Badge({ variant = 'neutral', dot = false, className, children, ...props }: BadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 rounded-sm border px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider',
        variants[variant],
        className,
      )}
      {...props}
    >
      {dot && <span className={cn('h-1.5 w-1.5 rounded-full', dotColor[variant])} />}
      {children}
    </span>
  )
}

// ── Mapping helpers so pages can pass domain values directly ─────────────────
export function severityToVariant(severity: Severity): BadgeVariant {
  switch (severity) {
    case 'Critical':
      return 'critical'
    case 'High':
      return 'high'
    case 'Medium':
      return 'medium'
    case 'Low':
      return 'low'
    case 'Info':
      return 'info'
  }
}

export function statusToVariant(status: CaseStatus | FindingStatus): BadgeVariant {
  switch (status) {
    case 'Active':
    case 'Open':
      return 'info'
    case 'In Progress':
    case 'In Review':
    case 'Triaged':
      return 'warning'
    case 'Resolved':
    case 'Closed':
      return 'success'
    case 'Archived':
      return 'neutral'
    default:
      return 'neutral'
  }
}

export function SeverityBadge({ severity }: { severity: Severity }) {
  return (
    <Badge variant={severityToVariant(severity)} dot>
      {severity}
    </Badge>
  )
}

export function StatusBadge({ status }: { status: CaseStatus | FindingStatus }) {
  return <Badge variant={statusToVariant(status)}>{status}</Badge>
}

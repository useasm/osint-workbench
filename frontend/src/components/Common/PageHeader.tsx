import type { ReactNode } from 'react'

export interface PageHeaderProps {
  title: string
  subtitle?: string
  /** Right-aligned actions (buttons, etc.). */
  action?: ReactNode
}

export function PageHeader({ title, subtitle, action }: PageHeaderProps) {
  return (
    <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      <div>
        <h1 className="text-xl font-bold tracking-wide text-text-primary sm:text-2xl">
          <span className="text-accent-green">/</span> {title}
        </h1>
        {subtitle && <p className="mt-1 text-sm text-text-secondary">{subtitle}</p>}
      </div>
      {action && <div className="flex shrink-0 items-center gap-3">{action}</div>}
    </div>
  )
}

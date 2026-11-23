import type { ReactNode } from 'react'
import { cn } from '../../lib/cn'

export interface TabItem {
  id: string
  label: string
  icon?: ReactNode
  count?: number
}

export interface TabsProps {
  tabs: TabItem[]
  active: string
  onChange: (id: string) => void
  className?: string
}

export function Tabs({ tabs, active, onChange, className }: TabsProps) {
  return (
    <div role="tablist" className={cn('flex gap-1 overflow-x-auto border-b border-border-color', className)}>
      {tabs.map((tab) => {
        const selected = tab.id === active
        return (
          <button
            key={tab.id}
            role="tab"
            type="button"
            aria-selected={selected}
            onClick={() => onChange(tab.id)}
            className={cn(
              'group relative flex shrink-0 items-center gap-2 px-4 py-3 text-xs font-medium uppercase tracking-wide',
              'transition-colors duration-300 ease-out-soft focus:outline-none focus-visible:text-accent-cyan',
              selected ? 'text-accent-green' : 'text-text-secondary hover:text-text-primary',
            )}
          >
            {tab.icon && <span className="shrink-0">{tab.icon}</span>}
            {tab.label}
            {typeof tab.count === 'number' && (
              <span
                className={cn(
                  'rounded-sm px-1.5 py-0.5 text-[10px]',
                  selected ? 'bg-accent-green/15 text-accent-green' : 'bg-bg-tertiary text-text-secondary',
                )}
              >
                {tab.count}
              </span>
            )}
            <span
              className={cn(
                'absolute inset-x-0 -bottom-px h-0.5 transition-all duration-300 ease-out-soft',
                selected ? 'bg-accent-green shadow-glow-green' : 'bg-transparent group-hover:bg-border-color',
              )}
            />
          </button>
        )
      })}
    </div>
  )
}

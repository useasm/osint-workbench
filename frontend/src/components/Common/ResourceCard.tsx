import { ExternalLink } from 'lucide-react'
import { cn } from '../../lib/cn'
import { accents, type Accent } from '../../lib/accents'
import { tierLabel, type OsintResource } from '../../data/osint'

const tierStyle: Record<OsintResource['tier'], string> = {
  free: 'border-accent-green/40 text-accent-green',
  freemium: 'border-accent-cyan/40 text-accent-cyan',
  opensource: 'border-accent-violet/40 text-accent-violet',
}

export function ResourceCard({ resource, accent }: { resource: OsintResource; accent: Accent }) {
  const a = accents[accent]
  let host = resource.url
  try {
    host = new URL(resource.url).hostname.replace(/^www\./, '')
  } catch {
    /* keep raw url */
  }

  return (
    <a
      href={resource.url}
      target="_blank"
      rel="noopener noreferrer"
      className={cn(
        'group flex flex-col gap-2 rounded border border-border-color bg-bg-secondary/80 p-4',
        'transition-all duration-300 ease-out-soft focus:outline-none focus-visible:ring-2 focus-visible:ring-accent-cyan',
        a.hover,
      )}
    >
      <div className="flex items-start justify-between gap-2">
        <span className={cn('text-sm font-semibold text-text-primary transition-colors duration-300', a.groupHoverText)}>
          {resource.name}
        </span>
        <ExternalLink className="h-3.5 w-3.5 shrink-0 text-text-secondary transition-colors duration-300 group-hover:text-accent-cyan" />
      </div>
      <p className="text-xs leading-relaxed text-text-secondary">{resource.description}</p>
      <div className="mt-auto flex items-center justify-between gap-2 pt-1">
        <span className="truncate font-mono text-[10px] text-text-secondary/70">{host}</span>
        <span
          className={cn(
            'shrink-0 rounded-sm border px-1.5 py-0.5 text-[9px] font-semibold uppercase tracking-wider',
            tierStyle[resource.tier],
          )}
        >
          {tierLabel[resource.tier]}
        </span>
      </div>
    </a>
  )
}

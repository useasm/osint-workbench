import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { ArrowRight, Boxes, Layers, Link2, Search } from 'lucide-react'
import { PageHeader } from '../components/Common/PageHeader'
import { Input } from '../components/Common/Input'
import { cn } from '../lib/cn'
import { accents } from '../lib/accents'
import { osintBranches, totalFunctions, totalResources } from '../data/osint'

export function ModulesHubPage() {
  const [query, setQuery] = useState('')

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    if (!q) return osintBranches
    return osintBranches.filter(
      (b) =>
        b.name.toLowerCase().includes(q) ||
        b.short.toLowerCase().includes(q) ||
        b.description.toLowerCase().includes(q) ||
        b.subBranches.some((s) => s.name.toLowerCase().includes(q)) ||
        b.resources.some((r) => r.name.toLowerCase().includes(q)),
    )
  }, [query])

  return (
    <div className="animate-fade-in">
      <PageHeader
        title="OSINT modules"
        subtitle="15 intelligence branches, each with sub-branches, functions and free resources."
      />

      <div className="mb-6 grid grid-cols-3 gap-4">
        <StatStrip icon={Layers} value={String(osintBranches.length)} label="Branches" accent="green" />
        <StatStrip icon={Boxes} value={String(totalFunctions)} label="Functions" accent="cyan" />
        <StatStrip icon={Link2} value={`${totalResources}+`} label="Free resources" accent="violet" />
      </div>

      <div className="mb-6 max-w-md">
        <Input
          placeholder="Search branches and resources…"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          leftIcon={<Search className="h-4 w-4" />}
        />
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {filtered.map((b) => {
          const a = accents[b.accent]
          const Icon = b.icon
          return (
            <Link
              key={b.id}
              to={`/modules/${b.id}`}
              className={cn(
                'group flex flex-col rounded border border-border-color bg-bg-secondary/80 p-5',
                'transition-all duration-300 ease-out-soft focus:outline-none focus-visible:ring-2 focus-visible:ring-accent-cyan',
                a.hover,
              )}
            >
              <div className="flex items-start justify-between">
                <div className={cn('flex h-11 w-11 items-center justify-center rounded border', a.chip)}>
                  <Icon className="h-5 w-5" />
                </div>
                <span className="font-mono text-xs text-text-secondary/60">
                  {String(b.number).padStart(2, '0')}
                </span>
              </div>

              <h3 className={cn('mt-4 text-sm font-semibold text-text-primary transition-colors duration-300', a.groupHoverText)}>
                {b.name}
              </h3>
              <p className="mt-1 line-clamp-2 text-xs leading-relaxed text-text-secondary">{b.description}</p>

              <div className="mt-4 flex items-center justify-between border-t border-border-color/60 pt-3">
                <div className="flex gap-3 text-[11px] text-text-secondary">
                  <span>{b.subBranches.length} sub-branches</span>
                  <span className={a.text}>{b.resources.length} resources</span>
                </div>
                <ArrowRight className="h-4 w-4 -translate-x-1 text-text-secondary opacity-0 transition-all duration-300 group-hover:translate-x-0 group-hover:text-accent-cyan group-hover:opacity-100" />
              </div>
            </Link>
          )
        })}
      </div>

      {filtered.length === 0 && (
        <div className="rounded border border-dashed border-border-color py-16 text-center text-sm text-text-secondary">
          Nothing found for “{query}”.
        </div>
      )}
    </div>
  )
}

function StatStrip({
  icon: Icon,
  value,
  label,
  accent,
}: {
  icon: typeof Boxes
  value: string
  label: string
  accent: keyof typeof accents
}) {
  const a = accents[accent]
  return (
    <div className="flex items-center gap-3 rounded border border-border-color bg-bg-secondary/80 p-4">
      <div className={cn('flex h-10 w-10 shrink-0 items-center justify-center rounded border', a.chip)}>
        <Icon className="h-5 w-5" />
      </div>
      <div className="min-w-0">
        <p className={cn('text-xl font-bold', a.text)}>{value}</p>
        <p className="truncate text-[11px] uppercase tracking-wider text-text-secondary">{label}</p>
      </div>
    </div>
  )
}

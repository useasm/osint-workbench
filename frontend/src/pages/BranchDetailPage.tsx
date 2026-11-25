import { useEffect, useMemo, useState } from 'react'
import { Link, Navigate, useNavigate, useParams } from 'react-router-dom'
import { ArrowLeft, ArrowUpRight, Boxes, Link2, Play, ShieldQuestion } from 'lucide-react'
import { Card } from '../components/Common/Card'
import { Button } from '../components/Common/Button'
import { Badge } from '../components/Common/Badge'
import { Tabs, type TabItem } from '../components/Common/Tabs'
import { Input } from '../components/Common/Input'
import { ResourceCard } from '../components/Common/ResourceCard'
import { useToast } from '../components/Common/Toast'
import { cn } from '../lib/cn'
import { accents } from '../lib/accents'
import { branchById } from '../data/osint'

export function BranchDetailPage() {
  const { branchId } = useParams()
  const navigate = useNavigate()
  const { showToast } = useToast()
  const branch = branchId ? branchById(branchId) : undefined
  const [active, setActive] = useState('resources')
  const [query, setQuery] = useState('')

  // reset tab and filter when switching branches
  useEffect(() => {
    setActive('resources')
    setQuery('')
  }, [branchId])

  const filteredResources = useMemo(() => {
    if (!branch) return []
    const q = query.trim().toLowerCase()
    if (!q) return branch.resources
    return branch.resources.filter(
      (r) => r.name.toLowerCase().includes(q) || r.description.toLowerCase().includes(q),
    )
  }, [branch, query])

  if (!branch) return <Navigate to="/modules" replace />

  const a = accents[branch.accent]
  const Icon = branch.icon

  const tabs: TabItem[] = [
    { id: 'resources', label: 'Free resources', icon: <Link2 className="h-3.5 w-3.5" />, count: branch.resources.length },
    { id: 'functions', label: 'Sub-branches & functions', icon: <Boxes className="h-3.5 w-3.5" />, count: branch.subBranches.length },
  ]

  return (
    <div className="animate-fade-in">
      <Link
        to="/modules"
        className="mb-4 inline-flex items-center gap-1.5 text-xs text-text-secondary transition-colors duration-300 hover:text-accent-cyan"
      >
        <ArrowLeft className="h-3.5 w-3.5" /> All modules
      </Link>

      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center">
        <div className={cn('flex h-14 w-14 shrink-0 items-center justify-center rounded border', a.chip)}>
          <Icon className="h-7 w-7" />
        </div>
        <div className="min-w-0">
          <div className="flex items-center gap-2">
            <span className="font-mono text-xs text-text-secondary/60">
              {String(branch.number).padStart(2, '0')}
            </span>
            <h1 className="text-xl font-bold tracking-wide text-text-primary sm:text-2xl">{branch.name}</h1>
          </div>
          <p className="mt-1 max-w-2xl text-sm text-text-secondary">{branch.description}</p>
        </div>
      </div>

      <Tabs tabs={tabs} active={active} onChange={setActive} className="mb-6" />

      {active === 'resources' && (
        <div className="animate-fade-in">
          <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-sm text-text-secondary">
              Curated free resources for the{' '}
              <span className={a.text}>{branch.short}</span> branch. Links open in a new tab.
            </p>
            <Input
              containerClassName="sm:w-64"
              placeholder="Filter resources…"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
          </div>

          {filteredResources.length > 0 ? (
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
              {filteredResources.map((r) => (
                <ResourceCard key={r.name + r.url} resource={r} accent={branch.accent} />
              ))}
            </div>
          ) : (
            <div className="rounded border border-dashed border-border-color py-12 text-center text-sm text-text-secondary">
              No resources match “{query}”.
            </div>
          )}

          <p className="mt-6 flex items-start gap-2 rounded-sm border border-border-color bg-bg-secondary/60 p-3 text-[11px] leading-relaxed text-text-secondary">
            <ShieldQuestion className="mt-0.5 h-4 w-4 shrink-0 text-accent-orange" />
            For legal and authorized use only: OSINT, contracted pentesting, CTF and
            research. Follow each service’s terms and the applicable law.
          </p>
        </div>
      )}

      {active === 'functions' && (
        <div className="grid animate-fade-in grid-cols-1 gap-4 md:grid-cols-2">
          {branch.subBranches.map((sub) => (
            <Card key={sub.id}>
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-2">
                  <span className={cn('rounded-sm border px-1.5 py-0.5 font-mono text-[10px]', a.chip)}>{sub.id}</span>
                  <h3 className="text-sm font-semibold text-text-primary">{sub.name}</h3>
                </div>
                {sub.route ? (
                  <Button size="sm" variant="secondary" rightIcon={<ArrowUpRight className="h-3.5 w-3.5" />} onClick={() => navigate(sub.route!)}>
                    Open
                  </Button>
                ) : (
                  <Button
                    size="sm"
                    variant="ghost"
                    leftIcon={<Play className="h-3.5 w-3.5" />}
                    onClick={() =>
                      showToast({
                        variant: 'info',
                        title: sub.name,
                        message: 'Running tools will be available once the backend is connected.',
                      })
                    }
                  >
                    Run
                  </Button>
                )}
              </div>
              <div className="mt-3 flex flex-wrap gap-2">
                {sub.functions.map((fn) => (
                  <Badge key={fn} variant="neutral">
                    {fn}
                  </Badge>
                ))}
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}

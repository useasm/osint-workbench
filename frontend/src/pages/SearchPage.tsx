import { useState, type FormEvent } from 'react'
import { Radar, Search } from 'lucide-react'
import { PageHeader } from '../components/Common/PageHeader'
import { Card } from '../components/Common/Card'
import { Button } from '../components/Common/Button'
import { Input } from '../components/Common/Input'
import { Loading } from '../components/Common/Loading'
import { useToast } from '../components/Common/Toast'
import { cn } from '../lib/cn'
import { searchScopes } from '../mocks/data'

type Phase = 'idle' | 'scanning' | 'empty'

export function SearchPage() {
  const { showToast } = useToast()
  const [scope, setScope] = useState(searchScopes[0].id)
  const [value, setValue] = useState('')
  const [phase, setPhase] = useState<Phase>('idle')

  const activeScope = searchScopes.find((s) => s.id === scope) ?? searchScopes[0]

  const runSearch = (e: FormEvent) => {
    e.preventDefault()
    if (!value.trim()) {
      showToast({ variant: 'warning', title: 'Enter a query', message: `Enter a ${activeScope.label.toLowerCase()} to search.` })
      return
    }
    setPhase('scanning')
    // Simulate a lookup purely on the client — no network, no backend.
    window.setTimeout(() => setPhase('empty'), 1100)
  }

  return (
    <div className="animate-fade-in">
      <PageHeader title="Global search" subtitle="Quick search across connected OSINT sources." />

      <Card>
        {/* Scope selector */}
        <div className="flex flex-wrap gap-2">
          {searchScopes.map((s) => {
            const selected = s.id === scope
            return (
              <button
                key={s.id}
                type="button"
                onClick={() => {
                  setScope(s.id)
                  setPhase('idle')
                  setValue('')
                }}
                className={cn(
                  'rounded-sm border px-4 py-2 text-xs font-medium uppercase tracking-wide transition-all duration-300 ease-out-soft focus:outline-none focus-visible:ring-2 focus-visible:ring-accent-cyan',
                  selected
                    ? 'border-accent-green/60 bg-accent-green/10 text-accent-green shadow-glow-green'
                    : 'border-border-color text-text-secondary hover:border-accent-cyan/50 hover:text-text-primary',
                )}
              >
                {s.label}
              </button>
            )
          })}
        </div>

        {/* Query input */}
        <form onSubmit={runSearch} className="mt-5 flex flex-col gap-3 sm:flex-row">
          <Input
            containerClassName="flex-1"
            placeholder={activeScope.placeholder}
            value={value}
            onChange={(e) => setValue(e.target.value)}
            leftIcon={<Search className="h-4 w-4" />}
          />
          <Button type="submit" size="lg" leftIcon={<Radar className="h-4 w-4" />} loading={phase === 'scanning'}>
            {phase === 'scanning' ? 'Scanning' : 'Search'}
          </Button>
        </form>
      </Card>

      {/* Results */}
      <Card title="Results" subtitle={`Scope: ${activeScope.label}`} className="mt-6">
        {phase === 'idle' && (
          <div className="flex flex-col items-center justify-center gap-3 py-16 text-center">
            <Radar className="h-10 w-10 text-text-secondary" />
            <p className="text-sm text-text-secondary">No search has been run yet</p>
            <p className="max-w-sm text-[11px] text-text-secondary/70">
              Pick a scope, enter a value and run the search. Real connectors will arrive with the backend.
            </p>
          </div>
        )}

        {phase === 'scanning' && (
          <div className="py-16">
            <Loading label="Querying sources" />
          </div>
        )}

        {phase === 'empty' && (
          <div className="flex flex-col items-center justify-center gap-3 py-16 text-center">
            <Search className="h-10 w-10 text-text-secondary" />
            <p className="text-sm text-text-primary">
              No results for <span className="text-accent-cyan">{value}</span>
            </p>
            <p className="max-w-sm text-[11px] text-text-secondary/70">
              This is a frontend demo — results will appear once the backend and sources are connected.
            </p>
            <Button variant="ghost" size="sm" onClick={() => setPhase('idle')}>
              Clear
            </Button>
          </div>
        )}
      </Card>
    </div>
  )
}

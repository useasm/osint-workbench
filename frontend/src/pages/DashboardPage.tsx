import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import {
  Activity,
  ArrowUpRight,
  FolderPlus,
  LayoutGrid,
  Network,
  ShieldAlert,
  TrendingUp,
} from 'lucide-react'
import { PageHeader } from '../components/Common/PageHeader'
import { Card } from '../components/Common/Card'
import { Button } from '../components/Common/Button'
import { Table, type Column } from '../components/Common/Table'
import { SeverityBadge, StatusBadge } from '../components/Common/Badge'
import { Modal } from '../components/Common/Modal'
import { Input } from '../components/Common/Input'
import { Select } from '../components/Common/Select'
import { useToast } from '../components/Common/Toast'
import { cn } from '../lib/cn'
import { accents } from '../lib/accents'
import {
  mockCases,
  mockFindings,
  mockStats,
  type Case,
  type DashboardStat,
  type Finding,
} from '../mocks/data'
import { osintBranches, totalResources } from '../data/osint'

const accentText: Record<DashboardStat['accent'], string> = {
  green: 'text-accent-green',
  red: 'text-accent-red',
  cyan: 'text-accent-cyan',
  orange: 'text-accent-orange',
}
const accentGlow: Record<DashboardStat['accent'], string> = {
  green: 'hover:shadow-glow-green hover:border-accent-green/50',
  red: 'hover:shadow-glow-red hover:border-accent-red/50',
  cyan: 'hover:shadow-glow-cyan hover:border-accent-cyan/50',
  orange: 'hover:shadow-glow-orange hover:border-accent-orange/50',
}
const statIcon = [Activity, Network, ShieldAlert]
const featuredBranches = osintBranches.slice(0, 6)

export function DashboardPage() {
  const navigate = useNavigate()
  const { showToast } = useToast()
  const [open, setOpen] = useState(false)

  const recentCaseColumns: Column<Case>[] = [
    { key: 'name', header: 'Case', render: (c) => <span className="font-medium text-text-primary">{c.name}</span> },
    { key: 'entities', header: 'Entities', align: 'right', render: (c) => <span className="text-text-secondary">{c.entities}</span> },
    { key: 'findings', header: 'Findings', align: 'right', render: (c) => <span className="text-text-secondary">{c.findings}</span> },
    { key: 'severity', header: 'Severity', render: (c) => <SeverityBadge severity={c.severity} /> },
  ]

  const findingColumns: Column<Finding>[] = [
    { key: 'title', header: 'Finding', render: (f) => <span className="font-medium text-text-primary">{f.title}</span> },
    { key: 'case', header: 'Case', render: (f) => <span className="text-text-secondary">{f.case}</span> },
    { key: 'severity', header: 'Severity', render: (f) => <SeverityBadge severity={f.severity} /> },
    { key: 'status', header: 'Status', render: (f) => <StatusBadge status={f.status} /> },
    { key: 'date', header: 'Date', align: 'right', render: (f) => <span className="text-text-secondary">{f.date}</span> },
  ]

  return (
    <div className="animate-fade-in">
      <PageHeader
        title="Welcome back!"
        subtitle="An overview of your investigations and quick access to OSINT modules."
        action={
          <Button leftIcon={<FolderPlus className="h-4 w-4" />} onClick={() => setOpen(true)}>
            New case
          </Button>
        }
      />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {mockStats.map((stat, i) => {
          const Icon = statIcon[i] ?? Activity
          return (
            <div
              key={stat.label}
              className={cn(
                'rounded border border-border-color bg-bg-secondary/80 p-5 transition-all duration-300 ease-out-soft',
                accentGlow[stat.accent],
              )}
            >
              <div className="flex items-start justify-between">
                <p className="text-xs uppercase tracking-wider text-text-secondary">{stat.label}</p>
                <Icon className={cn('h-5 w-5', accentText[stat.accent])} />
              </div>
              <p className={cn('mt-3 text-3xl font-bold', accentText[stat.accent])}>{stat.value}</p>
              <p className="mt-2 flex items-center gap-1 text-[11px] text-text-secondary">
                <TrendingUp className="h-3 w-3 text-accent-green" />
                {stat.delta}
              </p>
            </div>
          )
        })}
      </div>

      <div className="mt-6">
        <div className="mb-3 flex items-center justify-between">
          <h2 className="text-sm font-semibold uppercase tracking-wide text-text-primary">
            <span className="text-accent-green">/</span> OSINT modules
          </h2>
          <Button variant="ghost" size="sm" rightIcon={<ArrowUpRight className="h-3.5 w-3.5" />} onClick={() => navigate('/modules')}>
            All {osintBranches.length} branches
          </Button>
        </div>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
          {featuredBranches.map((b) => {
            const a = accents[b.accent]
            const Icon = b.icon
            return (
              <Link
                key={b.id}
                to={`/modules/${b.id}`}
                className={cn(
                  'group flex flex-col items-center gap-2 rounded border border-border-color bg-bg-secondary/80 p-4 text-center',
                  'transition-all duration-300 ease-out-soft focus:outline-none focus-visible:ring-2 focus-visible:ring-accent-cyan',
                  a.hover,
                )}
              >
                <div className={cn('flex h-10 w-10 items-center justify-center rounded border', a.chip)}>
                  <Icon className="h-5 w-5" />
                </div>
                <span className={cn('text-[11px] font-medium leading-tight text-text-secondary transition-colors duration-300', a.groupHoverText)}>
                  {b.short}
                </span>
              </Link>
            )
          })}
        </div>
        <p className="mt-2 flex items-center gap-1.5 text-[11px] text-text-secondary">
          <LayoutGrid className="h-3 w-3 text-accent-cyan" />
          {totalResources}+ free OSINT resources organized by branch
        </p>
      </div>

      <div className="mt-6 grid grid-cols-1 gap-6 xl:grid-cols-2">
        <Card
          title="Recent cases"
          subtitle="Active investigations"
          noPadding
          action={
            <Button variant="ghost" size="sm" rightIcon={<ArrowUpRight className="h-3.5 w-3.5" />} onClick={() => navigate('/cases')}>
              All
            </Button>
          }
        >
          <Table
            columns={recentCaseColumns}
            data={mockCases.slice(0, 4)}
            rowKey={(c) => c.id}
            onRowClick={(c) => navigate(`/cases/${c.id}`)}
          />
        </Card>

        <Card
          title="Latest findings"
          subtitle="Latest across all cases"
          noPadding
          action={
            <Button variant="ghost" size="sm" rightIcon={<ArrowUpRight className="h-3.5 w-3.5" />} onClick={() => navigate('/findings')}>
              All
            </Button>
          }
        >
          <Table
            columns={findingColumns}
            data={mockFindings.slice(0, 5)}
            rowKey={(f) => f.id}
            onRowClick={() => navigate('/findings')}
          />
        </Card>
      </div>

      <Modal
        open={open}
        onClose={() => setOpen(false)}
        title="New case"
        description="Open a new investigation workspace."
        footer={
          <>
            <Button variant="ghost" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button
              onClick={() => {
                setOpen(false)
                showToast({ variant: 'success', title: 'Case created', message: 'New investigation opened.' })
                navigate('/cases')
              }}
            >
              Create case
            </Button>
          </>
        }
      >
        <div className="space-y-4">
          <Input label="Case name" placeholder="e.g. APT-2024-014" autoFocus />
          <Select
            label="Initial severity"
            defaultValue="Medium"
            options={[
              { label: 'Critical', value: 'Critical' },
              { label: 'High', value: 'High' },
              { label: 'Medium', value: 'Medium' },
              { label: 'Low', value: 'Low' },
              { label: 'Info', value: 'Info' },
            ]}
          />
          <Input label="Description" placeholder="What are we investigating?" />
        </div>
      </Modal>
    </div>
  )
}

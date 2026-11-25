import { useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import {
  ArrowLeft,
  Download,
  FileText,
  GitBranch,
  LayoutDashboard,
  Network,
  Share2,
  ShieldAlert,
} from 'lucide-react'
import { Card } from '../components/Common/Card'
import { Button } from '../components/Common/Button'
import { Tabs, type TabItem } from '../components/Common/Tabs'
import { Table, type Column } from '../components/Common/Table'
import { Badge, SeverityBadge, StatusBadge } from '../components/Common/Badge'
import { useToast } from '../components/Common/Toast'
import { cn } from '../lib/cn'
import {
  mockActivity,
  mockCaseOverview,
  mockCases,
  mockEntities,
  mockFindings,
  mockRelations,
  type CaseOverviewStat,
  type Entity,
  type Finding,
  type Relation,
} from '../mocks/data'

const accentText: Record<CaseOverviewStat['accent'], string> = {
  green: 'text-accent-green',
  red: 'text-accent-red',
  cyan: 'text-accent-cyan',
  orange: 'text-accent-orange',
}

const tabs: TabItem[] = [
  { id: 'overview', label: 'Overview', icon: <LayoutDashboard className="h-3.5 w-3.5" /> },
  { id: 'entities', label: 'Entities', icon: <Network className="h-3.5 w-3.5" />, count: 12 },
  { id: 'findings', label: 'Findings', icon: <ShieldAlert className="h-3.5 w-3.5" />, count: 8 },
  { id: 'relations', label: 'Relations', icon: <GitBranch className="h-3.5 w-3.5" />, count: 6 },
  { id: 'reports', label: 'Reports', icon: <FileText className="h-3.5 w-3.5" /> },
]

export function CaseDetailPage() {
  const { id } = useParams()
  const { showToast } = useToast()
  const [active, setActive] = useState('overview')

  const current = mockCases.find((c) => String(c.id) === id) ?? mockCases[0]

  return (
    <div className="animate-fade-in">
      <Link
        to="/cases"
        className="mb-4 inline-flex items-center gap-1.5 text-xs text-text-secondary transition-colors duration-300 hover:text-accent-cyan"
      >
        <ArrowLeft className="h-3.5 w-3.5" /> Back to cases
      </Link>

      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-3">
            <h1 className="text-xl font-bold tracking-wide text-text-primary sm:text-2xl">{current.name}</h1>
            <SeverityBadge severity={current.severity} />
            <StatusBadge status={current.status} />
          </div>
          <p className="mt-2 max-w-2xl text-sm text-text-secondary">{current.description}</p>
        </div>
        <div className="flex shrink-0 gap-3">
          <Button
            variant="secondary"
            leftIcon={<Share2 className="h-4 w-4" />}
            onClick={() => showToast({ variant: 'info', title: 'Link copied', message: 'Demo link copied to clipboard.' })}
          >
            Share
          </Button>
          <Button
            leftIcon={<Download className="h-4 w-4" />}
            onClick={() => showToast({ variant: 'success', title: 'Export started', message: 'Generating the report.' })}
          >
            Export
          </Button>
        </div>
      </div>

      <Tabs tabs={tabs} active={active} onChange={setActive} className="mb-6" />

      {active === 'overview' && <OverviewTab />}
      {active === 'entities' && <EntitiesTab />}
      {active === 'findings' && <FindingsTab caseName={current.name} />}
      {active === 'relations' && <RelationsTab />}
      {active === 'reports' && <ReportsTab onAction={(m) => showToast({ variant: 'info', title: 'Reports', message: m })} />}
    </div>
  )
}

function OverviewTab() {
  return (
    <div className="grid animate-fade-in grid-cols-1 gap-6 lg:grid-cols-3">
      <div className="lg:col-span-2 space-y-6">
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
          {mockCaseOverview.map((s) => (
            <div key={s.label} className="rounded border border-border-color bg-bg-secondary/80 p-4">
              <p className="text-[11px] uppercase tracking-wider text-text-secondary">{s.label}</p>
              <p className={cn('mt-2 text-2xl font-bold', accentText[s.accent])}>{s.value}</p>
            </div>
          ))}
        </div>

        <Card title="Investigation summary">
          <p className="text-sm leading-relaxed text-text-secondary">
            This case links infrastructure, identities and financial traces from multiple sources.
            Confidence scores are aggregated per connector. The graph currently links{' '}
            <span className="text-accent-cyan">12 entities</span> via{' '}
            <span className="text-accent-green">6 confirmed relations</span>, with{' '}
            <span className="text-accent-red">3 critical findings</span> awaiting triage.
          </p>
          <div className="mt-4 flex flex-wrap gap-2">
            {['infrastructure', 'attribution', 'credentials', 'crypto', 'active'].map((t) => (
              <Badge key={t} variant="neutral">
                #{t}
              </Badge>
            ))}
          </div>
        </Card>
      </div>

      <Card title="Recent activity">
        <ul className="space-y-4">
          {mockActivity.map((a) => (
            <li key={a.id} className="flex gap-3">
              <span
                className={cn(
                  'mt-1.5 h-2 w-2 shrink-0 rounded-full',
                  a.accent === 'green' && 'bg-accent-green',
                  a.accent === 'red' && 'bg-accent-red',
                  a.accent === 'cyan' && 'bg-accent-cyan',
                  a.accent === 'orange' && 'bg-accent-orange',
                )}
              />
              <div className="min-w-0">
                <p className="text-xs text-text-primary">{a.text}</p>
                <p className="text-[10px] uppercase tracking-wide text-text-secondary">{a.time}</p>
              </div>
            </li>
          ))}
        </ul>
      </Card>
    </div>
  )
}

function EntitiesTab() {
  const columns: Column<Entity>[] = [
    { key: 'name', header: 'Entity', render: (e) => <span className="font-medium text-text-primary">{e.name}</span> },
    { key: 'type', header: 'Type', render: (e) => <Badge variant="info">{e.type}</Badge> },
    { key: 'confidence', header: 'Confidence', align: 'right', render: (e) => <ConfidenceBar value={e.confidence} /> },
    { key: 'source', header: 'Source', render: (e) => <span className="text-text-secondary">{e.source}</span> },
  ]
  return (
    <Card noPadding className="animate-fade-in">
      <Table columns={columns} data={mockEntities.slice(0, 8)} rowKey={(e) => e.id} />
    </Card>
  )
}

function FindingsTab({ caseName }: { caseName: string }) {
  const data = mockFindings.filter((f) => f.case === caseName)
  const columns: Column<Finding>[] = [
    { key: 'title', header: 'Finding', render: (f) => <span className="font-medium text-text-primary">{f.title}</span> },
    { key: 'severity', header: 'Severity', render: (f) => <SeverityBadge severity={f.severity} /> },
    { key: 'status', header: 'Status', render: (f) => <StatusBadge status={f.status} /> },
    { key: 'date', header: 'Date', align: 'right', render: (f) => <span className="text-text-secondary">{f.date}</span> },
  ]
  return (
    <Card noPadding className="animate-fade-in">
      <Table
        columns={columns}
        data={data.length ? data : mockFindings.slice(0, 4)}
        rowKey={(f) => f.id}
        emptyMessage="No findings for this case yet."
      />
    </Card>
  )
}

function RelationsTab() {
  const columns: Column<Relation>[] = [
    { key: 'from', header: 'Source', render: (r) => <span className="font-medium text-accent-cyan">{r.from}</span> },
    { key: 'label', header: 'Relation', render: (r) => <Badge variant="neutral">{r.label}</Badge> },
    { key: 'to', header: 'Target', render: (r) => <span className="font-medium text-accent-green">{r.to}</span> },
    { key: 'confidence', header: 'Confidence', align: 'right', render: (r) => <ConfidenceBar value={r.confidence} /> },
  ]
  return (
    <Card noPadding className="animate-fade-in">
      <Table columns={columns} data={mockRelations} rowKey={(r) => r.id} />
    </Card>
  )
}

function ReportsTab({ onAction }: { onAction: (m: string) => void }) {
  const reports = [
    { id: 1, name: 'Executive summary', date: 'Created 2h ago', status: 'Ready' },
    { id: 2, name: 'Technical appendix', date: 'Created 1d ago', status: 'Ready' },
    { id: 3, name: 'Graph export', date: 'Draft', status: 'Draft' },
  ]
  return (
    <div className="grid animate-fade-in grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {reports.map((r) => (
        <Card key={r.id} interactive>
          <div className="flex items-start justify-between">
            <FileText className="h-6 w-6 text-accent-cyan" />
            <Badge variant={r.status === 'Ready' ? 'success' : 'warning'}>{r.status === 'Ready' ? 'Ready' : 'Draft'}</Badge>
          </div>
          <p className="mt-4 text-sm font-medium text-text-primary">{r.name}</p>
          <p className="text-[11px] text-text-secondary">{r.date}</p>
          <Button
            variant="secondary"
            size="sm"
            fullWidth
            className="mt-4"
            leftIcon={<Download className="h-3.5 w-3.5" />}
            onClick={() => onAction(`Downloading “${r.name}” is a stub.`)}
          >
            Download
          </Button>
        </Card>
      ))}
    </div>
  )
}

// literal width classes so tailwind jit can see them
const decileWidth: Record<number, string> = {
  0: 'w-0',
  10: 'w-[10%]',
  20: 'w-[20%]',
  30: 'w-[30%]',
  40: 'w-[40%]',
  50: 'w-[50%]',
  60: 'w-[60%]',
  70: 'w-[70%]',
  80: 'w-[80%]',
  90: 'w-[90%]',
  100: 'w-full',
}

function ConfidenceBar({ value }: { value: number }) {
  const color = value >= 90 ? 'bg-accent-green' : value >= 75 ? 'bg-accent-cyan' : 'bg-accent-orange'
  const decile = Math.min(100, Math.max(0, Math.round(value / 10) * 10))
  return (
    <div className="flex items-center justify-end gap-2">
      <div className="hidden h-1.5 w-16 overflow-hidden rounded-full bg-bg-tertiary sm:block">
        <div className={cn('h-full rounded-full', color, decileWidth[decile])} />
      </div>
      <span className="tabular-nums text-text-secondary">{value}%</span>
    </div>
  )
}

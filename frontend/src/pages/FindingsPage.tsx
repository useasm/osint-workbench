import { useMemo, useState } from 'react'
import { Plus, Search } from 'lucide-react'
import { PageHeader } from '../components/Common/PageHeader'
import { Card } from '../components/Common/Card'
import { Button } from '../components/Common/Button'
import { Input } from '../components/Common/Input'
import { Select } from '../components/Common/Select'
import { Modal } from '../components/Common/Modal'
import { Table, type Column } from '../components/Common/Table'
import { SeverityBadge, StatusBadge } from '../components/Common/Badge'
import { useToast } from '../components/Common/Toast'
import { cn } from '../lib/cn'
import { mockFindings, type Finding, type Severity } from '../mocks/data'

const severityCount = (sev: Severity) => mockFindings.filter((f) => f.severity === sev).length

const summary: { label: string; sev: Severity; text: string; dot: string }[] = [
  { label: 'Critical', sev: 'Critical', text: 'text-accent-red', dot: 'bg-accent-red' },
  { label: 'High', sev: 'High', text: 'text-accent-orange', dot: 'bg-accent-orange' },
  { label: 'Medium', sev: 'Medium', text: 'text-yellow-300', dot: 'bg-yellow-300' },
  { label: 'Low', sev: 'Low', text: 'text-accent-green', dot: 'bg-accent-green' },
]

export function FindingsPage() {
  const { showToast } = useToast()
  const [open, setOpen] = useState(false)
  const [query, setQuery] = useState('')
  const [severity, setSeverity] = useState('all')

  const filtered = useMemo(
    () =>
      mockFindings.filter((f) => {
        const matchesQuery =
          f.title.toLowerCase().includes(query.toLowerCase()) ||
          f.case.toLowerCase().includes(query.toLowerCase())
        const matchesSeverity = severity === 'all' || f.severity === severity
        return matchesQuery && matchesSeverity
      }),
    [query, severity],
  )

  const columns: Column<Finding>[] = [
    { key: 'title', header: 'Finding', render: (f) => <span className="font-medium text-text-primary">{f.title}</span> },
    { key: 'severity', header: 'Severity', render: (f) => <SeverityBadge severity={f.severity} /> },
    { key: 'status', header: 'Status', render: (f) => <StatusBadge status={f.status} /> },
    { key: 'case', header: 'Case', render: (f) => <span className="text-text-secondary">{f.case}</span> },
    { key: 'date', header: 'Date', align: 'right', render: (f) => <span className="text-text-secondary">{f.date}</span> },
  ]

  return (
    <div className="animate-fade-in">
      <PageHeader
        title="Findings"
        subtitle={`${filtered.length} of ${mockFindings.length} findings`}
        action={
          <Button leftIcon={<Plus className="h-4 w-4" />} onClick={() => setOpen(true)}>
            Create finding
          </Button>
        }
      />

      <div className="mb-6 grid grid-cols-2 gap-4 sm:grid-cols-4">
        {summary.map((s) => (
          <div key={s.label} className="rounded border border-border-color bg-bg-secondary/80 p-4">
            <div className="flex items-center gap-2">
              <span className={cn('h-2 w-2 rounded-full', s.dot)} />
              <p className="text-[11px] uppercase tracking-wider text-text-secondary">{s.label}</p>
            </div>
            <p className={cn('mt-2 text-2xl font-bold', s.text)}>{severityCount(s.sev)}</p>
          </div>
        ))}
      </div>

      <Card noPadding>
        <div className="flex flex-col gap-3 border-b border-border-color p-4 sm:flex-row sm:items-center">
          <Input
            containerClassName="flex-1"
            placeholder="Search findings…"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            leftIcon={<Search className="h-4 w-4" />}
          />
          <Select
            containerClassName="sm:w-48"
            value={severity}
            onChange={(e) => setSeverity(e.target.value)}
            options={[
              { label: 'All severities', value: 'all' },
              { label: 'Critical', value: 'Critical' },
              { label: 'High', value: 'High' },
              { label: 'Medium', value: 'Medium' },
              { label: 'Low', value: 'Low' },
              { label: 'Info', value: 'Info' },
            ]}
          />
        </div>
        <Table columns={columns} data={filtered} rowKey={(f) => f.id} emptyMessage="No findings match the filters." />
      </Card>

      <Modal
        open={open}
        onClose={() => setOpen(false)}
        title="Create finding"
        description="Record a new finding for a case."
        footer={
          <>
            <Button variant="ghost" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button
              variant="danger"
              onClick={() => {
                setOpen(false)
                showToast({ variant: 'success', title: 'Finding created', message: 'Saved to the case (demo).' })
              }}
            >
              Create finding
            </Button>
          </>
        }
      >
        <div className="space-y-4">
          <Input label="Title" placeholder="e.g. Exposed admin panel" autoFocus />
          <div className="grid grid-cols-2 gap-4">
            <Select
              label="Severity"
              defaultValue="High"
              options={[
                { label: 'Critical', value: 'Critical' },
                { label: 'High', value: 'High' },
                { label: 'Medium', value: 'Medium' },
                { label: 'Low', value: 'Low' },
                { label: 'Info', value: 'Info' },
              ]}
            />
            <Select
              label="Status"
              defaultValue="Open"
              options={[
                { label: 'Open', value: 'Open' },
                { label: 'In Progress', value: 'In Progress' },
                { label: 'Triaged', value: 'Triaged' },
                { label: 'Resolved', value: 'Resolved' },
              ]}
            />
          </div>
          <Input label="Case" placeholder="e.g. APT-2024-001" />
        </div>
      </Modal>
    </div>
  )
}

import { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { FolderPlus, Search } from 'lucide-react'
import { PageHeader } from '../components/Common/PageHeader'
import { Card } from '../components/Common/Card'
import { Button } from '../components/Common/Button'
import { Input } from '../components/Common/Input'
import { Select } from '../components/Common/Select'
import { Modal } from '../components/Common/Modal'
import { Table, type Column } from '../components/Common/Table'
import { SeverityBadge, StatusBadge } from '../components/Common/Badge'
import { useToast } from '../components/Common/Toast'
import { mockCases, type Case } from '../mocks/data'

export function CasesListPage() {
  const navigate = useNavigate()
  const { showToast } = useToast()
  const [open, setOpen] = useState(false)
  const [query, setQuery] = useState('')
  const [status, setStatus] = useState('all')

  const filtered = useMemo(() => {
    return mockCases.filter((c) => {
      const matchesQuery = c.name.toLowerCase().includes(query.toLowerCase())
      const matchesStatus = status === 'all' || c.status === status
      return matchesQuery && matchesStatus
    })
  }, [query, status])

  const columns: Column<Case>[] = [
    {
      key: 'name',
      header: 'Case name',
      render: (c) => (
        <div className="min-w-0">
          <p className="font-medium text-text-primary">{c.name}</p>
          <p className="truncate text-[11px] text-text-secondary">{c.description}</p>
        </div>
      ),
    },
    { key: 'entities', header: 'Entities', align: 'right', render: (c) => <span className="text-text-secondary">{c.entities}</span> },
    { key: 'findings', header: 'Findings', align: 'right', render: (c) => <span className="text-text-secondary">{c.findings}</span> },
    { key: 'severity', header: 'Severity', render: (c) => <SeverityBadge severity={c.severity} /> },
    { key: 'status', header: 'Status', render: (c) => <StatusBadge status={c.status} /> },
    { key: 'date', header: 'Updated', align: 'right', render: (c) => <span className="text-text-secondary">{c.date}</span> },
  ]

  return (
    <div className="animate-fade-in">
      <PageHeader
        title="Cases"
        subtitle={`${filtered.length} of ${mockCases.length} investigations`}
        action={
          <Button leftIcon={<FolderPlus className="h-4 w-4" />} onClick={() => setOpen(true)}>
            Create case
          </Button>
        }
      />

      <Card noPadding>
        <div className="flex flex-col gap-3 border-b border-border-color p-4 sm:flex-row sm:items-center">
          <Input
            containerClassName="flex-1"
            placeholder="Filter by case name…"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            leftIcon={<Search className="h-4 w-4" />}
          />
          <Select
            containerClassName="sm:w-48"
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            options={[
              { label: 'All statuses', value: 'all' },
              { label: 'Active', value: 'Active' },
              { label: 'In Review', value: 'In Review' },
              { label: 'Closed', value: 'Closed' },
              { label: 'Archived', value: 'Archived' },
            ]}
          />
        </div>
        <Table
          columns={columns}
          data={filtered}
          rowKey={(c) => c.id}
          onRowClick={(c) => navigate(`/cases/${c.id}`)}
          emptyMessage="No cases match the filters."
        />
      </Card>

      <Modal
        open={open}
        onClose={() => setOpen(false)}
        title="Create case"
        description="Open a new workspace."
        footer={
          <>
            <Button variant="ghost" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button
              onClick={() => {
                setOpen(false)
                showToast({ variant: 'success', title: 'Case created', message: 'New investigation opened.' })
              }}
            >
              Create
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

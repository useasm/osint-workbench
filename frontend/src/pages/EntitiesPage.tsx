import { useMemo, useState } from 'react'
import { AtSign, Globe, Hash, Plus, Search, Server, User } from 'lucide-react'
import { PageHeader } from '../components/Common/PageHeader'
import { Card } from '../components/Common/Card'
import { Button } from '../components/Common/Button'
import { Input } from '../components/Common/Input'
import { Select } from '../components/Common/Select'
import { Modal } from '../components/Common/Modal'
import { Table, type Column } from '../components/Common/Table'
import { Badge } from '../components/Common/Badge'
import { useToast } from '../components/Common/Toast'
import { cn } from '../lib/cn'
import { mockEntities, type Entity, type EntityType } from '../mocks/data'

const typeIcon: Partial<Record<EntityType, typeof User>> = {
  email: AtSign,
  phone: Hash,
  domain: Globe,
  ip: Server,
  person: User,
  username: AtSign,
}

export function EntitiesPage() {
  const { showToast } = useToast()
  const [open, setOpen] = useState(false)
  const [query, setQuery] = useState('')
  const [type, setType] = useState('all')

  const filtered = useMemo(
    () =>
      mockEntities.filter((e) => {
        const matchesQuery = e.name.toLowerCase().includes(query.toLowerCase())
        const matchesType = type === 'all' || e.type === type
        return matchesQuery && matchesType
      }),
    [query, type],
  )

  const columns: Column<Entity>[] = [
    {
      key: 'name',
      header: 'Name',
      render: (e) => {
        const Icon = typeIcon[e.type] ?? Hash
        return (
          <div className="flex items-center gap-2.5">
            <span className="flex h-7 w-7 items-center justify-center rounded-sm border border-border-color bg-bg-tertiary text-accent-cyan">
              <Icon className="h-3.5 w-3.5" />
            </span>
            <span className="font-medium text-text-primary">{e.name}</span>
          </div>
        )
      },
    },
    { key: 'type', header: 'Type', render: (e) => <Badge variant="info">{e.type}</Badge> },
    {
      key: 'confidence',
      header: 'Confidence',
      align: 'right',
      render: (e) => (
        <span
          className={cn(
            'tabular-nums font-medium',
            e.confidence >= 90 ? 'text-accent-green' : e.confidence >= 75 ? 'text-accent-cyan' : 'text-accent-orange',
          )}
        >
          {e.confidence}%
        </span>
      ),
    },
    { key: 'source', header: 'Source', render: (e) => <span className="text-text-secondary">{e.source}</span> },
    { key: 'date', header: 'Created', align: 'right', render: (e) => <span className="text-text-secondary">{e.date}</span> },
  ]

  return (
    <div className="animate-fade-in">
      <PageHeader
        title="Entities"
        subtitle={`${filtered.length} indicators across all cases`}
        action={
          <Button leftIcon={<Plus className="h-4 w-4" />} onClick={() => setOpen(true)}>
            Add entity
          </Button>
        }
      />

      <Card noPadding>
        <div className="flex flex-col gap-3 border-b border-border-color p-4 sm:flex-row sm:items-center">
          <Input
            containerClassName="flex-1"
            placeholder="Search entities…"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            leftIcon={<Search className="h-4 w-4" />}
          />
          <Select
            containerClassName="sm:w-48"
            value={type}
            onChange={(e) => setType(e.target.value)}
            options={[
              { label: 'All types', value: 'all' },
              { label: 'Email', value: 'email' },
              { label: 'Phone', value: 'phone' },
              { label: 'Domain', value: 'domain' },
              { label: 'IP', value: 'ip' },
              { label: 'Person', value: 'person' },
              { label: 'Username', value: 'username' },
              { label: 'Organization', value: 'organization' },
              { label: 'Wallet', value: 'wallet' },
            ]}
          />
        </div>
        <Table columns={columns} data={filtered} rowKey={(e) => e.id} emptyMessage="No entities match the filters." />
      </Card>

      <Modal
        open={open}
        onClose={() => setOpen(false)}
        title="Add entity"
        description="Manually add an indicator to the workspace."
        footer={
          <>
            <Button variant="ghost" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button
              onClick={() => {
                setOpen(false)
                showToast({ variant: 'success', title: 'Entity added', message: 'Indicator added (demo).' })
              }}
            >
              Add
            </Button>
          </>
        }
      >
        <div className="space-y-4">
          <Input label="Value" placeholder="e.g. target@example.com" autoFocus />
          <Select
            label="Type"
            defaultValue="email"
            options={[
              { label: 'Email', value: 'email' },
              { label: 'Phone', value: 'phone' },
              { label: 'Domain', value: 'domain' },
              { label: 'IP', value: 'ip' },
              { label: 'Person', value: 'person' },
              { label: 'Username', value: 'username' },
            ]}
          />
          <Input label="Source" placeholder="e.g. Shodan" />
        </div>
      </Modal>
    </div>
  )
}

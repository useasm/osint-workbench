import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Bell, KeyRound, LogOut, Plus, Shield, Smartphone, Moon } from 'lucide-react'
import { PageHeader } from '../components/Common/PageHeader'
import { Card } from '../components/Common/Card'
import { Button } from '../components/Common/Button'
import { Input } from '../components/Common/Input'
import { Modal } from '../components/Common/Modal'
import { Badge } from '../components/Common/Badge'
import { useToast } from '../components/Common/Toast'
import { cn } from '../lib/cn'
import { mockUser } from '../mocks/data'

interface ToggleSetting {
  id: string
  label: string
  description: string
  icon: typeof Bell
  enabled: boolean
}

export function ProfilePage() {
  const navigate = useNavigate()
  const { showToast } = useToast()
  const [pwOpen, setPwOpen] = useState(false)
  const [settings, setSettings] = useState<ToggleSetting[]>([
    { id: 'mfa', label: 'Two-factor auth', description: 'Require a second factor on sign in.', icon: Smartphone, enabled: true },
    { id: 'alerts', label: 'Critical alerts', description: 'Notify me on new critical findings.', icon: Bell, enabled: true },
    { id: 'theme', label: 'Always dark', description: 'Force the dark operator theme.', icon: Moon, enabled: true },
  ])

  const toggle = (id: string) =>
    setSettings((prev) => prev.map((s) => (s.id === id ? { ...s, enabled: !s.enabled } : s)))

  return (
    <div className="animate-fade-in">
      <PageHeader title="Profile" subtitle="Manage your operator identity and preferences." />

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Identity card */}
        <Card className="lg:col-span-1">
          <div className="flex flex-col items-center text-center">
            <div className="flex h-20 w-20 items-center justify-center rounded border border-accent-green/50 bg-accent-green/10 text-2xl font-bold text-accent-green shadow-glow-green">
              {mockUser.initials}
            </div>
            <h2 className="mt-4 text-lg font-bold text-text-primary">{mockUser.name}</h2>
            <p className="text-sm text-text-secondary">@{mockUser.username}</p>
            <Badge variant="info" className="mt-3">
              {mockUser.role}
            </Badge>
            <p className="mt-4 text-[11px] uppercase tracking-wider text-text-secondary">
              Joined {mockUser.joined}
            </p>
          </div>
        </Card>

        {/* Account + settings */}
        <div className="space-y-6 lg:col-span-2">
          <Card title="Account" subtitle="Read-only in this demo build">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <Input label="Full name" defaultValue={mockUser.name} readOnly />
              <Input label="Username" defaultValue={mockUser.username} readOnly />
              <Input label="Email" defaultValue={mockUser.email} readOnly containerClassName="sm:col-span-2" />
            </div>
            <div className="mt-5 flex flex-wrap gap-3">
              <Button variant="secondary" leftIcon={<KeyRound className="h-4 w-4" />} onClick={() => setPwOpen(true)}>
                Change password
              </Button>
              <Button
                variant="ghost"
                leftIcon={<Shield className="h-4 w-4" />}
                onClick={() => showToast({ variant: 'info', title: 'Security log', message: 'No suspicious sessions (mock).' })}
              >
                View security log
              </Button>
            </div>
          </Card>

          <Card
            title="API Keys"
            subtitle="Connect OSINT data sources"
            action={
              <Button
                size="sm"
                leftIcon={<Plus className="h-3.5 w-3.5" />}
                onClick={() => showToast({ variant: 'info', title: 'API keys', message: 'Key vault wiring comes with the backend.' })}
              >
                New key
              </Button>
            }
          >
            <div className="flex flex-col items-center justify-center gap-2 rounded-sm border border-dashed border-border-color py-10 text-center">
              <KeyRound className="h-6 w-6 text-text-secondary" />
              <p className="text-sm text-text-secondary">No API keys yet</p>
              <p className="text-[11px] text-text-secondary/70">
                Add a key to connect sources like Shodan, Hunter or VirusTotal.
              </p>
            </div>
          </Card>

          <Card title="Settings">
            <ul className="divide-y divide-border-color">
              {settings.map((s) => {
                const Icon = s.icon
                return (
                  <li key={s.id} className="flex items-center justify-between gap-4 py-3 first:pt-0 last:pb-0">
                    <div className="flex items-start gap-3">
                      <Icon className="mt-0.5 h-4 w-4 text-accent-cyan" />
                      <div>
                        <p className="text-sm text-text-primary">{s.label}</p>
                        <p className="text-[11px] text-text-secondary">{s.description}</p>
                      </div>
                    </div>
                    <button
                      type="button"
                      role="switch"
                      aria-checked={s.enabled}
                      aria-label={s.label}
                      onClick={() => toggle(s.id)}
                      className={cn(
                        'relative h-6 w-11 shrink-0 rounded-full border transition-colors duration-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-accent-green',
                        s.enabled ? 'border-accent-green/60 bg-accent-green/20' : 'border-border-color bg-bg-tertiary',
                      )}
                    >
                      <span
                        className={cn(
                          'absolute top-0.5 h-4 w-4 rounded-full transition-all duration-300',
                          s.enabled ? 'left-[22px] bg-accent-green shadow-glow-green' : 'left-0.5 bg-text-secondary',
                        )}
                      />
                    </button>
                  </li>
                )
              })}
            </ul>
          </Card>

          <Card>
            <div className="flex flex-col items-start justify-between gap-3 sm:flex-row sm:items-center">
              <div>
                <p className="text-sm font-medium text-text-primary">Sign out</p>
                <p className="text-[11px] text-text-secondary">End your current operator session.</p>
              </div>
              <Button variant="danger" leftIcon={<LogOut className="h-4 w-4" />} onClick={() => navigate('/login')}>
                Logout
              </Button>
            </div>
          </Card>
        </div>
      </div>

      <Modal
        open={pwOpen}
        onClose={() => setPwOpen(false)}
        title="Change password"
        size="sm"
        footer={
          <>
            <Button variant="ghost" onClick={() => setPwOpen(false)}>
              Cancel
            </Button>
            <Button
              onClick={() => {
                setPwOpen(false)
                showToast({ variant: 'success', title: 'Password updated', message: 'Your password was changed (mock).' })
              }}
            >
              Update
            </Button>
          </>
        }
      >
        <div className="space-y-4">
          <Input label="Current password" type="password" placeholder="••••••••" autoFocus />
          <Input label="New password" type="password" placeholder="••••••••" />
          <Input label="Confirm new password" type="password" placeholder="••••••••" />
        </div>
      </Modal>
    </div>
  )
}

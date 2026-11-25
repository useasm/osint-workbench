import { useState, type ReactNode } from 'react'
import { NavLink } from 'react-router-dom'
import {
  ChevronDown,
  FolderKanban,
  LayoutDashboard,
  LayoutGrid,
  Network as NetworkIcon,
  Search,
  ShieldAlert,
  Terminal,
  UserCircle,
  Workflow,
  type LucideIcon,
} from 'lucide-react'
import { cn } from '../../lib/cn'
import { accents } from '../../lib/accents'
import { osintBranches } from '../../data/osint'

export interface SidebarProps {
  open: boolean
  onClose: () => void
}

const osintModules = osintBranches.filter((b) => b.id !== 'analysis')

export function Sidebar({ open, onClose }: SidebarProps) {
  return (
    <>
      <div
        onClick={onClose}
        className={cn(
          'fixed inset-0 z-30 bg-bg-primary/70 backdrop-blur-sm transition-opacity duration-300 lg:hidden',
          open ? 'opacity-100' : 'pointer-events-none opacity-0',
        )}
        aria-hidden
      />

      <aside
        className={cn(
          'fixed inset-y-0 left-0 z-40 flex w-[280px] flex-col border-r border-border-color bg-bg-secondary',
          'transition-transform duration-300 ease-out-soft',
          open ? 'translate-x-0' : '-translate-x-full',
          'lg:translate-x-0',
        )}
      >
        <div className="flex h-[60px] shrink-0 items-center gap-3 border-b border-border-color px-5">
          <div className="flex h-8 w-8 items-center justify-center rounded-sm border border-accent-green/50 bg-accent-green/10 text-accent-green shadow-glow-green">
            <Terminal className="h-4 w-4" />
          </div>
          <div className="leading-tight">
            <p className="text-sm font-bold tracking-wide text-text-primary">
              OSINT<span className="text-accent-green">_</span>WB
            </p>
            <p className="text-[10px] uppercase tracking-widest text-text-secondary">Workbench</p>
          </div>
        </div>

        <nav className="scrollbar-thin flex-1 space-y-1 overflow-y-auto p-3">
          <SectionLabel>Overview</SectionLabel>
          <Item to="/" end icon={LayoutDashboard} label="Dashboard" onNavigate={onClose} />
          <Item to="/modules" icon={LayoutGrid} label="All modules" onNavigate={onClose} />

          <Group title="OSINT modules" defaultOpen count={osintModules.length}>
            {osintModules.map((b) => (
              <Item
                key={b.id}
                to={`/modules/${b.id}`}
                icon={b.icon}
                label={`${b.number}. ${b.short}`}
                accentDot={b.accent}
                onNavigate={onClose}
                small
              />
            ))}
          </Group>

          <Group title="Investigation" defaultOpen>
            <Item to="/cases" icon={FolderKanban} label="Cases" onNavigate={onClose} small />
            <Item to="/entities" icon={NetworkIcon} label="Entities" onNavigate={onClose} small />
            <Item to="/findings" icon={ShieldAlert} label="Findings" onNavigate={onClose} small />
            <Item to="/search" icon={Search} label="Global search" onNavigate={onClose} small />
            <Item to="/modules/analysis" icon={Workflow} label="Analytics" onNavigate={onClose} small />
          </Group>

          <SectionLabel>Account</SectionLabel>
          <Item to="/profile" icon={UserCircle} label="Profile" onNavigate={onClose} />
        </nav>

        <div className="shrink-0 border-t border-border-color p-4">
          <div className="flex items-center gap-2 rounded-sm border border-border-color bg-bg-primary/50 px-3 py-2">
            <span className="h-2 w-2 animate-pulse rounded-full bg-accent-green shadow-glow-green" />
            <span className="text-[11px] uppercase tracking-wider text-text-secondary">
              System <span className="text-accent-green">online</span>
            </span>
          </div>
        </div>
      </aside>
    </>
  )
}

function SectionLabel({ children }: { children: ReactNode }) {
  return (
    <p className="px-3 pb-1 pt-3 text-[10px] uppercase tracking-widest text-text-secondary/70">{children}</p>
  )
}

function Group({
  title,
  count,
  defaultOpen = true,
  children,
}: {
  title: string
  count?: number
  defaultOpen?: boolean
  children: ReactNode
}) {
  const [openGroup, setOpenGroup] = useState(defaultOpen)
  return (
    <div className="pt-2">
      <button
        type="button"
        onClick={() => setOpenGroup((o) => !o)}
        className="flex w-full items-center justify-between px-3 py-1.5 text-[10px] uppercase tracking-widest text-text-secondary/70 transition-colors duration-300 hover:text-text-primary focus:outline-none"
      >
        <span className="flex items-center gap-2">
          {title}
          {typeof count === 'number' && (
            <span className="rounded-sm bg-bg-tertiary px-1.5 py-0.5 text-[9px] text-text-secondary">{count}</span>
          )}
        </span>
        <ChevronDown className={cn('h-3.5 w-3.5 transition-transform duration-300', openGroup ? 'rotate-0' : '-rotate-90')} />
      </button>
      <div className={cn('space-y-1 overflow-hidden transition-all duration-300', openGroup ? 'mt-1' : 'h-0')}>
        {openGroup && children}
      </div>
    </div>
  )
}

function Item({
  to,
  end,
  icon: Icon,
  label,
  accentDot,
  small,
  onNavigate,
}: {
  to: string
  end?: boolean
  icon: LucideIcon
  label: string
  accentDot?: keyof typeof accents
  small?: boolean
  onNavigate: () => void
}) {
  return (
    <NavLink
      to={to}
      end={end}
      onClick={onNavigate}
      className={({ isActive }) =>
        cn(
          'group flex items-center gap-3 rounded-sm border px-3 transition-all duration-300 ease-out-soft',
          'focus:outline-none focus-visible:ring-2 focus-visible:ring-accent-cyan',
          small ? 'py-2 text-[13px]' : 'py-2.5 text-sm',
          isActive
            ? 'border-accent-green/40 bg-accent-green/10 text-accent-green shadow-glow-green'
            : 'border-transparent text-text-secondary hover:border-border-color hover:bg-bg-tertiary hover:text-text-primary',
        )
      }
    >
      {({ isActive }) => (
        <>
          <Icon
            className={cn(
              'h-4 w-4 shrink-0 transition-colors duration-300',
              isActive ? 'text-accent-green' : 'text-text-secondary group-hover:text-accent-cyan',
            )}
          />
          <span className="flex-1 truncate font-medium tracking-wide">{label}</span>
          {accentDot && <span className={cn('h-1.5 w-1.5 shrink-0 rounded-full', accents[accentDot].solid)} />}
        </>
      )}
    </NavLink>
  )
}

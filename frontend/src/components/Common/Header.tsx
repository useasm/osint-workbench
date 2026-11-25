import { useEffect, useRef, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Bell, LogOut, Menu, Search, Settings, UserCircle } from 'lucide-react'
import { cn } from '../../lib/cn'
import { mockUser } from '../../mocks/data'

export interface HeaderProps {
  onMenuClick: () => void
}

export function Header({ onMenuClick }: HeaderProps) {
  const navigate = useNavigate()
  const [menuOpen, setMenuOpen] = useState(false)
  const menuRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!menuOpen) return
    const onClick = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) setMenuOpen(false)
    }
    document.addEventListener('mousedown', onClick)
    return () => document.removeEventListener('mousedown', onClick)
  }, [menuOpen])

  return (
    <header className="sticky top-0 z-20 flex h-[60px] items-center justify-between gap-4 border-b border-border-color bg-bg-secondary/90 px-4 backdrop-blur-md lg:px-6">
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={onMenuClick}
          aria-label="Toggle navigation"
          className="rounded-sm p-2 text-text-secondary transition-colors duration-300 hover:bg-bg-tertiary hover:text-accent-cyan focus:outline-none focus-visible:ring-2 focus-visible:ring-accent-cyan lg:hidden"
        >
          <Menu className="h-5 w-5" />
        </button>

        {/* fake command bar, opens the search page */}
        <Link
          to="/search"
          className="group hidden items-center gap-2 rounded-sm border border-border-color bg-bg-primary/60 px-3 py-2 text-xs text-text-secondary transition-all duration-300 hover:border-accent-cyan/50 hover:text-text-primary sm:flex sm:w-72"
        >
          <Search className="h-4 w-4 text-text-secondary group-hover:text-accent-cyan" />
          <span className="flex-1">Search entities, cases…</span>
          <kbd className="rounded-sm border border-border-color px-1.5 py-0.5 text-[10px] text-text-secondary">
            /
          </kbd>
        </Link>
      </div>

      <div className="flex items-center gap-1 sm:gap-2">
        <Link
          to="/findings"
          aria-label="Notifications"
          className="relative rounded-sm p-2 text-text-secondary transition-colors duration-300 hover:bg-bg-tertiary hover:text-accent-cyan focus:outline-none focus-visible:ring-2 focus-visible:ring-accent-cyan"
        >
          <Bell className="h-5 w-5" />
          <span className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full bg-accent-red shadow-glow-red" />
        </Link>

        <div className="relative" ref={menuRef}>
          <button
            type="button"
            onClick={() => setMenuOpen((o) => !o)}
            aria-haspopup="menu"
            aria-expanded={menuOpen}
            className="flex items-center gap-2 rounded-sm border border-border-color bg-bg-primary/60 py-1.5 pl-1.5 pr-2 transition-all duration-300 hover:border-accent-green/50 focus:outline-none focus-visible:ring-2 focus-visible:ring-accent-green"
          >
            <span className="flex h-7 w-7 items-center justify-center rounded-sm bg-accent-green/15 text-xs font-bold text-accent-green">
              {mockUser.initials}
            </span>
            <span className="hidden text-left leading-tight sm:block">
              <span className="block text-xs font-medium text-text-primary">{mockUser.name}</span>
              <span className="block text-[10px] uppercase tracking-wide text-text-secondary">
                {mockUser.role}
              </span>
            </span>
          </button>

          <div
            role="menu"
            className={cn(
              'absolute right-0 mt-2 w-52 origin-top-right overflow-hidden rounded border border-border-color bg-bg-secondary shadow-glow-cyan',
              'transition-all duration-200 ease-out-soft',
              menuOpen ? 'visible scale-100 opacity-100' : 'invisible scale-95 opacity-0',
            )}
          >
            <div className="border-b border-border-color px-4 py-3">
              <p className="truncate text-xs font-medium text-text-primary">{mockUser.name}</p>
              <p className="truncate text-[11px] text-text-secondary">{mockUser.email}</p>
            </div>
            <MenuItem icon={UserCircle} label="Profile" onClick={() => { setMenuOpen(false); navigate('/profile') }} />
            <MenuItem icon={Settings} label="Settings" onClick={() => { setMenuOpen(false); navigate('/profile') }} />
            <div className="border-t border-border-color">
              <MenuItem
                icon={LogOut}
                label="Sign out"
                danger
                onClick={() => { setMenuOpen(false); navigate('/login') }}
              />
            </div>
          </div>
        </div>
      </div>
    </header>
  )
}

function MenuItem({
  icon: Icon,
  label,
  onClick,
  danger = false,
}: {
  icon: typeof UserCircle
  label: string
  onClick: () => void
  danger?: boolean
}) {
  return (
    <button
      type="button"
      role="menuitem"
      onClick={onClick}
      className={cn(
        'flex w-full items-center gap-3 px-4 py-2.5 text-left text-xs uppercase tracking-wide transition-colors duration-300 focus:outline-none',
        danger
          ? 'text-accent-red hover:bg-accent-red/10'
          : 'text-text-secondary hover:bg-bg-tertiary hover:text-text-primary',
      )}
    >
      <Icon className="h-4 w-4" />
      {label}
    </button>
  )
}

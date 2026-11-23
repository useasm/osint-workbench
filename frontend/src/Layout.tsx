import { useState } from 'react'
import { Outlet } from 'react-router-dom'
import { Sidebar } from './components/Common/Sidebar'
import { Header } from './components/Common/Header'

/**
 * Application shell: fixed sidebar (280px) + sticky header (60px) + routed content.
 * On mobile the sidebar collapses into a hamburger-triggered drawer.
 */
export function Layout() {
  const [sidebarOpen, setSidebarOpen] = useState(false)

  return (
    <div className="min-h-screen">
      <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <div className="lg:pl-[280px]">
        <Header onMenuClick={() => setSidebarOpen((o) => !o)} />
        <main className="mx-auto w-full max-w-[1400px] p-4 sm:p-6 lg:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  )
}

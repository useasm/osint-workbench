import { useState } from 'react'
import { Outlet } from 'react-router-dom'
import { Sidebar } from './components/Common/Sidebar'
import { Header } from './components/Common/Header'

// sidebar turns into a drawer on mobile
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

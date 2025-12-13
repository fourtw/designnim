import { useState } from 'react'
import type { ReactNode } from 'react'

import { Sidebar } from './Sidebar'
import { Header } from './Header'
import { useAuth } from '../hooks/useAuth'

type DashboardLayoutProps = {
  children: ReactNode
}

export const DashboardLayout = ({ children }: DashboardLayoutProps) => {
  const [collapsed, setCollapsed] = useState(false)
  const { logout } = useAuth()

  return (
    <div className="flex min-h-screen bg-slate-950 text-white">
      <Sidebar
        collapsed={collapsed}
        onToggle={() => setCollapsed((prev) => !prev)}
        onLogout={logout}
      />
      <div className="flex-1">
        <Header />
        <main className="px-6 py-8">{children}</main>
      </div>
    </div>
  )
}


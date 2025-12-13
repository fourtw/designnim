import { NavLink } from 'react-router-dom'
import {
  LayoutDashboard,
  Building2,
  ReceiptText,
  Wallet,
  LogOut,
  Menu,
} from 'lucide-react'
import type { ReactNode } from 'react'

type NavItem = {
  label: string
  icon: ReactNode
  to: string
}

const items: NavItem[] = [
  { label: 'Dashboard', icon: <LayoutDashboard size={18} />, to: '/dashboard' },
  { label: 'Panti Jompo', icon: <Building2 size={18} />, to: '/panti' },
  { label: 'Transaksi', icon: <ReceiptText size={18} />, to: '/transaksi' },
  { label: 'Withdraw', icon: <Wallet size={18} />, to: '/withdraw' },
]

type SidebarProps = {
  collapsed: boolean
  onToggle: () => void
  onLogout: () => void
}

export const Sidebar = ({ collapsed, onToggle, onLogout }: SidebarProps) => {
  return (
    <aside
      className={`flex h-full flex-col border-r border-white/5 bg-slate-950/90 px-4 py-6 transition-all ${
        collapsed ? 'w-[70px]' : 'w-64'
      }`}
    >
      <div className="mb-10 flex items-center justify-between px-2">
        <div>
          <p className="text-xs uppercase tracking-[0.3em] text-accent/80">
            Admin
          </p>
          {!collapsed && (
            <p className="text-lg font-semibold text-white">
              Panti Jompo Link
            </p>
          )}
        </div>
        <button
          type="button"
          onClick={onToggle}
          className="rounded-full border border-white/10 p-1 text-white/70 hover:text-white"
        >
          <Menu size={16} />
        </button>
      </div>

      <nav className="flex-1 space-y-2">
        {items.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive }) =>
              `flex items-center gap-3 rounded-2xl px-3 py-3 text-sm font-medium transition ${
                isActive
                  ? 'bg-primary/20 text-white'
                  : 'text-white/70 hover:bg-white/5'
              } ${collapsed ? 'justify-center px-0' : ''}`
            }
          >
            {item.icon}
            {!collapsed && item.label}
          </NavLink>
        ))}
      </nav>

      <button
        type="button"
        onClick={onLogout}
        className="mt-auto flex items-center gap-3 rounded-2xl bg-white/5 px-3 py-3 text-sm font-semibold text-white transition hover:bg-white/10"
      >
        <LogOut size={18} />
        {!collapsed && 'Logout'}
      </button>
    </aside>
  )
}


import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '@/contexts/AuthContext'
import {
  LayoutDashboard,
  Users,
  BookOpen,
  Shield,
  LogOut,
  Menu,
  X,
} from 'lucide-react'
import { useState } from 'react'
import type { ReactNode } from 'react'

const navItems = [
  { label: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
  { label: 'Employees', href: '/dashboard/employees', icon: Users },
  { label: 'Training', href: '/dashboard/training', icon: BookOpen },
  { label: 'Readiness', href: '/dashboard/readiness', icon: Shield },
]

export function DashboardLayout({ children }: { children: ReactNode }) {
  const { organization, user, signOut } = useAuth()
  const location = useLocation()
  const navigate = useNavigate()
  const [sidebarOpen, setSidebarOpen] = useState(false)

  const handleSignOut = async () => {
    await signOut()
    navigate('/org/login')
  }

  return (
    <div className="min-h-screen bg-brand-bg">
      {/* Mobile header */}
      <div className="flex items-center justify-between border-b border-white/10 bg-brand-card px-4 py-3 lg:hidden">
        <Link to="/dashboard" className="font-semibold text-brand-accent">
          {organization?.name || 'Adroa Domain'}
        </Link>
        <button onClick={() => setSidebarOpen(!sidebarOpen)} className="text-white">
          {sidebarOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      <div className="flex">
        {/* Sidebar */}
        <aside
          className={`fixed inset-y-0 left-0 z-40 w-64 transform border-r border-white/10 bg-brand-card transition-transform duration-200 lg:static lg:translate-x-0 ${
            sidebarOpen ? 'translate-x-0' : '-translate-x-full'
          }`}
        >
          <div className="flex h-full flex-col">
            <div className="border-b border-white/10 p-5">
              <Link to="/" className="text-lg font-bold text-brand-accent">
                Adroa Domain
              </Link>
              <p className="mt-1 truncate text-xs text-white/50">
                {organization?.name || 'Organization'}
              </p>
            </div>

            <nav className="flex-1 space-y-1 p-3">
              {navItems.map((item) => {
                const isActive = location.pathname === item.href
                return (
                  <Link
                    key={item.href}
                    to={item.href}
                    onClick={() => setSidebarOpen(false)}
                    className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm transition-colors ${
                      isActive
                        ? 'bg-brand-accent/10 text-brand-accent'
                        : 'text-white/70 hover:bg-white/5 hover:text-white'
                    }`}
                  >
                    <item.icon size={18} />
                    {item.label}
                  </Link>
                )
              })}
            </nav>

            <div className="border-t border-white/10 p-3">
              <div className="mb-2 px-3 py-1">
                <p className="truncate text-sm text-white/70">{user?.email}</p>
              </div>
              <button
                onClick={handleSignOut}
                className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-white/70 transition-colors hover:bg-white/5 hover:text-white"
              >
                <LogOut size={18} />
                Sign out
              </button>
            </div>
          </div>
        </aside>

        {/* Overlay for mobile */}
        {sidebarOpen && (
          <div
            className="fixed inset-0 z-30 bg-black/50 lg:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}

        {/* Main content */}
        <main className="flex-1 overflow-auto">
          <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
            {children}
          </div>
        </main>
      </div>
    </div>
  )
}

import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useVcmAuth } from '@/contexts/VcmAuthContext'
import {
  LayoutDashboard,
  Award,
  BookOpen,
  Compass,
  UserCircle,
  LogOut,
  Menu,
  X,
} from 'lucide-react'
import { useState } from 'react'
import type { ReactNode } from 'react'

const navItems = [
  { label: 'Dashboard', href: '/vcm/dashboard', icon: LayoutDashboard },
  { label: 'Certifications', href: '/vcm/certifications', icon: Award },
  { label: 'Training Log', href: '/vcm/training-log', icon: BookOpen },
  { label: 'Opportunities', href: '/vcm/opportunities', icon: Compass },
  { label: 'Profile', href: '/vcm/profile', icon: UserCircle },
]

export function VcmLayout({ children }: { children: ReactNode }) {
  const { user, profile, signOut } = useVcmAuth()
  const location = useLocation()
  const navigate = useNavigate()
  const [sidebarOpen, setSidebarOpen] = useState(false)

  const handleSignOut = async () => {
    await signOut()
    navigate('/vcm/login')
  }

  const displayName = profile?.first_name
    ? `${profile.first_name} ${profile.last_name}`.trim()
    : user?.email || ''

  return (
    <div className="min-h-screen bg-brand-bg">
      {/* Mobile header */}
      <div className="flex items-center justify-between border-b border-white/10 bg-brand-card px-4 py-3 lg:hidden">
        <Link to="/vcm/dashboard" className="font-semibold text-brand-accent">
          Virtual Certification Manager
        </Link>
        <button onClick={() => setSidebarOpen(!sidebarOpen)} className="text-white">
          {sidebarOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      <div className="flex">
        {/* Sidebar */}
        <aside
          className={`fixed inset-y-0 left-0 z-30 w-64 transform border-r border-white/10 bg-brand-card transition-transform duration-200 lg:relative lg:translate-x-0 ${
            sidebarOpen ? 'translate-x-0' : '-translate-x-full'
          }`}
        >
          <div className="flex h-full flex-col">
            {/* Logo */}
            <div className="border-b border-white/10 px-6 py-5">
              <Link to="/vcm/dashboard" className="text-lg font-bold text-brand-accent">
                Adroa Domain
              </Link>
              <p className="mt-0.5 text-xs text-white/40">Virtual Certification Manager</p>
            </div>

            {/* Navigation */}
            <nav className="flex-1 space-y-1 px-3 py-4">
              {navItems.map((item) => {
                const isActive = location.pathname === item.href
                const Icon = item.icon
                return (
                  <Link
                    key={item.href}
                    to={item.href}
                    onClick={() => setSidebarOpen(false)}
                    className={`flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors ${
                      isActive
                        ? 'bg-brand-accent text-white'
                        : 'text-white/60 hover:bg-white/5 hover:text-white'
                    }`}
                  >
                    <Icon size={18} />
                    {item.label}
                  </Link>
                )
              })}
            </nav>

            {/* Footer */}
            <div className="border-t border-white/10 px-4 py-4">
              <div className="mb-3 px-2">
                <p className="truncate text-sm text-white/80">{displayName}</p>
                <p className="truncate text-xs text-white/40">{user?.email}</p>
              </div>
              <button
                onClick={handleSignOut}
                className="flex w-full items-center gap-2 rounded-xl px-3 py-2 text-sm text-white/60 hover:bg-white/5 hover:text-white"
              >
                <LogOut size={16} />
                Sign out
              </button>
            </div>
          </div>
        </aside>

        {/* Overlay */}
        {sidebarOpen && (
          <div
            className="fixed inset-0 z-20 bg-black/50 lg:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}

        {/* Main content */}
        <main className="min-h-screen flex-1 px-4 py-6 lg:px-8 lg:py-8">
          {children}
        </main>
      </div>
    </div>
  )
}

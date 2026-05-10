import { Navigate } from 'react-router-dom'
import { useAuth } from '@/contexts/AuthContext'
import type { ReactNode } from 'react'

export function ProtectedRoute({ children }: { children: ReactNode }) {
  const { user, loading } = useAuth()

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-brand-bg">
        <div className="text-center">
          <div className="mx-auto h-8 w-8 animate-spin rounded-full border-2 border-brand-accent border-t-transparent" />
          <p className="mt-3 text-sm text-white/60">Loading...</p>
        </div>
      </div>
    )
  }

  if (!user) {
    return <Navigate to="/org/login" replace />
  }

  return <>{children}</>
}

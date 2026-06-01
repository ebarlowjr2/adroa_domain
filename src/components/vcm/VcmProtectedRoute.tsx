import { Navigate } from 'react-router-dom'
import { useVcmAuth } from '@/contexts/VcmAuthContext'
import type { ReactNode } from 'react'

export function VcmProtectedRoute({ children }: { children: ReactNode }) {
  const { user, loading } = useVcmAuth()

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-brand-bg">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-brand-accent border-t-transparent" />
      </div>
    )
  }

  if (!user) {
    return <Navigate to="/vcm/login" replace />
  }

  return <>{children}</>
}

import { useAuth } from '@/contexts/AuthContext'

export function useIsAdmin(): boolean {
  const { membership } = useAuth()
  return membership?.role === 'owner' || membership?.role === 'admin'
}

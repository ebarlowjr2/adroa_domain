import { createContext, useContext, useEffect, useState, useCallback } from 'react'
import type { ReactNode } from 'react'
import type { User, Session } from '@supabase/supabase-js'
import { supabase } from '@/lib/supabase'
import type { VcmUserProfile } from '@/lib/vcm-types'

interface VcmAuthState {
  user: User | null
  session: Session | null
  profile: VcmUserProfile | null
  loading: boolean
}

interface VcmAuthContextType extends VcmAuthState {
  signUp: (email: string, password: string, firstName: string, lastName: string) => Promise<{ error: string | null; needsConfirmation?: boolean }>
  signIn: (email: string, password: string) => Promise<{ error: string | null }>
  signOut: () => Promise<void>
  refreshProfile: () => Promise<void>
}

const VcmAuthContext = createContext<VcmAuthContextType | undefined>(undefined)

export function VcmAuthProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<VcmAuthState>({
    user: null,
    session: null,
    profile: null,
    loading: true,
  })

  const loadProfile = useCallback(async (userId: string, email?: string) => {
    try {
      const { data: profile } = await supabase
        .from('vcm_user_profiles')
        .select('*')
        .eq('user_id', userId)
        .single()

      if (profile) {
        setState(prev => ({ ...prev, profile: profile as VcmUserProfile, loading: false }))
      } else {
        // Auto-create profile on first load; pull name from user_metadata
        const { data: { user: currentUser } } = await supabase.auth.getUser()
        const meta = currentUser?.user_metadata
        const { data: newProfile } = await supabase
          .from('vcm_user_profiles')
          .insert({
            user_id: userId,
            email: email || '',
            first_name: (meta?.first_name as string) || '',
            last_name: (meta?.last_name as string) || '',
          })
          .select()
          .single()
        setState(prev => ({ ...prev, profile: newProfile as VcmUserProfile | null, loading: false }))
      }
    } catch {
      setState(prev => ({ ...prev, loading: false }))
    }
  }, [])

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setState(prev => ({ ...prev, user: session?.user ?? null, session }))
      if (session?.user) {
        loadProfile(session.user.id, session.user.email)
      } else {
        setState(prev => ({ ...prev, loading: false }))
      }
    })

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (_event, session) => {
      setState(prev => ({ ...prev, user: session?.user ?? null, session }))
      if (session?.user) {
        loadProfile(session.user.id, session.user.email)
      } else {
        setState(prev => ({ ...prev, profile: null, loading: false }))
      }
    })

    return () => subscription.unsubscribe()
  }, [loadProfile])

  const signUp = async (email: string, password: string, firstName: string, lastName: string) => {
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: { data: { first_name: firstName, last_name: lastName, app: 'vcm' } },
      })
      if (error) return { error: error.message }
      if (!data.user) return { error: 'Signup failed.' }

      // If no session, email confirmation is required — name is stored in user_metadata
      // and will be pulled into the profile when loadProfile runs after confirmation
      if (!data.session) {
        return { error: null, needsConfirmation: true }
      }

      // Session exists — create VCM profile immediately
      const { error: profileErr } = await supabase.from('vcm_user_profiles').insert({
        user_id: data.user.id,
        first_name: firstName,
        last_name: lastName,
        email,
      })
      if (profileErr) return { error: profileErr.message }
      return { error: null }
    } catch (err) {
      return { error: err instanceof Error ? err.message : 'Signup failed.' }
    }
  }

  const signIn = async (email: string, password: string) => {
    try {
      const { error } = await supabase.auth.signInWithPassword({ email, password })
      if (error) return { error: error.message }
      return { error: null }
    } catch (err) {
      return { error: err instanceof Error ? err.message : 'Sign in failed.' }
    }
  }

  const signOut = async () => {
    await supabase.auth.signOut()
    setState({ user: null, session: null, profile: null, loading: false })
  }

  const refreshProfile = async () => {
    if (state.user) {
      await loadProfile(state.user.id, state.user.email)
    }
  }

  return (
    <VcmAuthContext.Provider value={{ ...state, signUp, signIn, signOut, refreshProfile }}>
      {children}
    </VcmAuthContext.Provider>
  )
}

export function useVcmAuth() {
  const context = useContext(VcmAuthContext)
  if (!context) throw new Error('useVcmAuth must be used within VcmAuthProvider')
  return context
}

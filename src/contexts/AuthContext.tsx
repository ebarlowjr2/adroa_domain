import { createContext, useContext, useEffect, useState, useCallback } from 'react'
import type { ReactNode } from 'react'
import type { User, Session } from '@supabase/supabase-js'
import { supabase } from '@/lib/supabase'
import type { Organization, OrganizationMember } from '@/lib/types'

interface AuthState {
  user: User | null
  session: Session | null
  organization: Organization | null
  membership: OrganizationMember | null
  loading: boolean
}

interface AuthContextType extends AuthState {
  signUp: (email: string, password: string, orgName: string, firstName: string, lastName: string, companySize: string, plan: string) => Promise<{ error: string | null }>
  signIn: (email: string, password: string) => Promise<{ error: string | null }>
  signOut: () => Promise<void>
  refreshOrg: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<AuthState>({
    user: null,
    session: null,
    organization: null,
    membership: null,
    loading: true,
  })

  const loadOrgData = useCallback(async (userId: string) => {
    const { data: member } = await supabase
      .from('organization_members')
      .select('*')
      .eq('user_id', userId)
      .eq('status', 'active')
      .single()

    if (member) {
      const { data: org } = await supabase
        .from('organizations')
        .select('*')
        .eq('id', member.org_id)
        .single()

      setState(prev => ({
        ...prev,
        organization: org as Organization | null,
        membership: member as OrganizationMember,
        loading: false,
      }))
    } else {
      setState(prev => ({ ...prev, loading: false }))
    }
  }, [])

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setState(prev => ({ ...prev, user: session?.user ?? null, session }))
      if (session?.user) {
        loadOrgData(session.user.id)
      } else {
        setState(prev => ({ ...prev, loading: false }))
      }
    })

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setState(prev => ({ ...prev, user: session?.user ?? null, session }))
      if (session?.user) {
        loadOrgData(session.user.id)
      } else {
        setState(prev => ({
          ...prev,
          organization: null,
          membership: null,
          loading: false,
        }))
      }
    })

    return () => subscription.unsubscribe()
  }, [loadOrgData])

  const signUp = async (
    email: string,
    password: string,
    orgName: string,
    firstName: string,
    lastName: string,
    companySize: string,
    plan: string
  ) => {
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { first_name: firstName, last_name: lastName },
      },
    })

    if (authError) return { error: authError.message }
    if (!authData.user) return { error: 'Signup failed' }

    const slug = orgName.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')
    const seatLimit = plan === 'starter' ? 25 : 5

    const { data: org, error: orgError } = await supabase
      .from('organizations')
      .insert({
        name: orgName,
        slug,
        plan,
        seat_limit: seatLimit,
        status: 'active',
      })
      .select()
      .single()

    if (orgError) return { error: orgError.message }

    const { error: memberError } = await supabase
      .from('organization_members')
      .insert({
        org_id: org.id,
        user_id: authData.user.id,
        role: 'owner',
        status: 'active',
      })

    if (memberError) return { error: memberError.message }

    // Store company size as metadata
    await supabase.from('organizations').update({
      updated_at: new Date().toISOString(),
    }).eq('id', org.id)

    return { error: null }
  }

  const signIn = async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) return { error: error.message }
    return { error: null }
  }

  const signOut = async () => {
    await supabase.auth.signOut()
    setState({
      user: null,
      session: null,
      organization: null,
      membership: null,
      loading: false,
    })
  }

  const refreshOrg = async () => {
    if (state.user) {
      await loadOrgData(state.user.id)
    }
  }

  return (
    <AuthContext.Provider value={{ ...state, signUp, signIn, signOut, refreshOrg }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

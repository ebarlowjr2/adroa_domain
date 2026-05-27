import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { CheckCircle } from 'lucide-react'
import { supabase } from '@/lib/supabase'

export default function OrgConfirm() {
  const [status, setStatus] = useState<'processing' | 'success'>('processing')

  useEffect(() => {
    const hash = window.location.hash
    if (hash && hash.includes('access_token')) {
      supabase.auth.getSession().then(() => {
        setStatus('success')
      })
    } else {
      setStatus('success')
    }
  }, [])

  if (status === 'processing') {
    return (
      <div className="flex min-h-screen items-center justify-center bg-brand-bg px-4">
        <div className="text-center">
          <div className="mx-auto mb-4 h-8 w-8 animate-spin rounded-full border-2 border-brand-accent border-t-transparent" />
          <p className="text-sm text-white/60">Confirming your email...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="relative min-h-screen overflow-hidden bg-brand-bg">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(60%_60%_at_70%_10%,rgba(0,175,241,0.15),transparent_60%)]" />
      <div className="container mx-auto flex min-h-screen items-center justify-center px-6 py-12">
        <div className="w-full max-w-md text-center">
          <Link to="/" className="text-2xl font-bold text-brand-accent">
            Adroa Domain
          </Link>

          <div className="mt-8 rounded-2xl border border-white/10 bg-brand-card p-8">
            <CheckCircle size={48} className="mx-auto mb-4 text-green-400" />
            <h1 className="mb-3 text-2xl font-bold text-white">Email Confirmed!</h1>
            <p className="text-sm text-white/60">
              Thank you for verifying your email address. Your account is now active.
            </p>
            <p className="mt-2 text-sm text-white/60">
              Please return to the login page to sign in to your organization dashboard.
            </p>
            <Link
              to="/org/login"
              className="mt-6 inline-flex rounded-xl bg-brand-accent px-6 py-2.5 text-sm font-medium text-white hover:bg-brand-accent-light"
            >
              Go to Sign In
            </Link>
          </div>

          <p className="mt-6 text-xs text-white/30">
            <Link to="/" className="hover:text-white/60">Adroa Domain</Link>
          </p>
        </div>
      </div>
    </div>
  )
}

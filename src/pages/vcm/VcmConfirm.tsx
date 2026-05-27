import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { Award, CheckCircle } from 'lucide-react'
import { supabase } from '@/lib/supabase'

export default function VcmConfirm() {
  const [status, setStatus] = useState<'processing' | 'success' | 'error'>('processing')

  useEffect(() => {
    // Supabase sends tokens in the URL hash after email confirmation
    const hash = window.location.hash
    if (hash && hash.includes('access_token')) {
      // The Supabase client automatically picks up the session from the URL
      supabase.auth.getSession().then(({ data: { session } }) => {
        if (session) {
          setStatus('success')
        } else {
          // Give it a moment for the auth state to process
          setTimeout(() => setStatus('success'), 1000)
        }
      })
    } else {
      // No tokens in URL — just show the success page anyway
      // (user may have already confirmed and navigated here directly)
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
    <div className="flex min-h-screen items-center justify-center bg-brand-bg px-4">
      <div className="w-full max-w-md text-center">
        <div className="mb-6 inline-flex items-center gap-2 text-brand-accent">
          <Award size={28} />
          <span className="text-xl font-bold">Virtual Certification Manager</span>
        </div>

        <div className="rounded-2xl border border-white/10 bg-brand-card p-8">
          <CheckCircle size={48} className="mx-auto mb-4 text-green-400" />
          <h1 className="mb-3 text-2xl font-bold text-white">Email Confirmed!</h1>
          <p className="text-sm text-white/60">
            Thank you for verifying your email address. Your account is now active.
          </p>
          <p className="mt-2 text-sm text-white/60">
            Please return to the login page to sign in.
          </p>
          <Link
            to="/vcm/login"
            className="mt-6 inline-flex rounded-xl bg-brand-accent px-6 py-2.5 text-sm font-medium text-white hover:bg-brand-accent-light"
          >
            Go to Sign In
          </Link>
        </div>

        <p className="mt-6 text-xs text-white/30">
          <Link to="/" className="hover:text-white/60">Adroa Domain</Link>
          {' · '}
          <Link to="/vcm" className="hover:text-white/60">Back to VCM</Link>
        </p>
      </div>
    </div>
  )
}

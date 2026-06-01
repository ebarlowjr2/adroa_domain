import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useVcmAuth } from '@/contexts/VcmAuthContext'
import { Award } from 'lucide-react'

export default function VcmLogin() {
  const { signIn } = useVcmAuth()
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    const { error: err } = await signIn(email, password)
    setLoading(false)
    if (err) {
      setError(err)
    } else {
      navigate('/vcm/dashboard')
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-brand-bg px-4">
      <div className="w-full max-w-md">
        <div className="mb-8 text-center">
          <Link to="/vcm" className="inline-flex items-center gap-2 text-brand-accent">
            <Award size={28} />
            <span className="text-xl font-bold">Virtual Certification Manager</span>
          </Link>
          <p className="mt-2 text-sm text-white/40">
            Sign in to manage your certifications
          </p>
        </div>

        <div className="rounded-2xl border border-white/10 bg-brand-card p-8">
          <h2 className="mb-6 text-xl font-semibold text-white">Sign In</h2>

          {error && (
            <div className="mb-4 rounded-lg bg-red-500/10 px-4 py-3 text-sm text-red-400">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="mb-1.5 block text-sm text-white/60">Email</label>
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-sm text-white placeholder-white/30 focus:border-brand-accent focus:outline-none"
                placeholder="you@example.com"
                required
              />
            </div>
            <div>
              <label className="mb-1.5 block text-sm text-white/60">Password</label>
              <input
                type="password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-sm text-white placeholder-white/30 focus:border-brand-accent focus:outline-none"
                placeholder="••••••••"
                required
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-xl bg-brand-accent px-4 py-2.5 text-sm font-medium text-white hover:bg-brand-accent-light disabled:opacity-50"
            >
              {loading ? 'Signing in...' : 'Sign In'}
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-white/40">
            Don't have an account?{' '}
            <Link to="/vcm/signup" className="text-brand-accent hover:underline">
              Sign up free
            </Link>
          </p>
        </div>

        <p className="mt-6 text-center text-xs text-white/30">
          <Link to="/" className="hover:text-white/60">Adroa Domain</Link>
          {' · '}
          <Link to="/vcm" className="hover:text-white/60">Back to VCM</Link>
        </p>
      </div>
    </div>
  )
}

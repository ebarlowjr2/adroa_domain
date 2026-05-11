import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '@/contexts/AuthContext'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select } from '@/components/ui/select'

export default function Signup() {
  const { signUp } = useAuth()
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [confirmationSent, setConfirmationSent] = useState(false)
  const [form, setForm] = useState({
    orgName: '',
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    companySize: '1-10',
    plan: 'free',
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    const result = await signUp(
      form.email,
      form.password,
      form.orgName,
      form.firstName,
      form.lastName,
      form.companySize,
      form.plan
    )

    if (result.error) {
      setError(result.error)
      setLoading(false)
      return
    }

    if (result.needsConfirmation) {
      setConfirmationSent(true)
      setLoading(false)
      return
    }

    navigate('/dashboard')
  }

  if (confirmationSent) {
    return (
      <div className="relative min-h-screen overflow-hidden bg-brand-bg">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(60%_60%_at_70%_10%,rgba(0,175,241,0.15),transparent_60%)]" />
        <div className="container mx-auto flex min-h-screen items-center justify-center px-6 py-12">
          <div className="w-full max-w-md text-center">
            <Link to="/" className="text-2xl font-bold text-brand-accent">
              Adroa Domain
            </Link>
            <h1 className="mt-4 text-3xl font-bold text-white">Check your email</h1>
            <p className="mt-2 text-white/60">
              We sent a confirmation link to <span className="text-white font-medium">{form.email}</span>.
              Click the link to activate your account, then sign in.
            </p>
            <div className="mt-6 rounded-xl border border-brand-accent/20 bg-brand-accent/5 p-6 text-left">
              <p className="text-sm text-white/70">
                Didn&apos;t receive the email? Check your spam folder or{' '}
                <button
                  onClick={() => setConfirmationSent(false)}
                  className="text-brand-accent hover:underline"
                >
                  try signing up again
                </button>.
              </p>
            </div>
            <p className="mt-6 text-sm text-white/50">
              Already confirmed?{' '}
              <Link to="/org/login" className="text-brand-accent hover:underline">
                Sign in
              </Link>
            </p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="relative min-h-screen overflow-hidden bg-brand-bg">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(60%_60%_at_70%_10%,rgba(0,175,241,0.15),transparent_60%)]" />
      <div className="container mx-auto flex min-h-screen items-center justify-center px-6 py-12">
        <div className="w-full max-w-md">
          <div className="mb-8 text-center">
            <Link to="/" className="text-2xl font-bold text-brand-accent">
              Adroa Domain
            </Link>
            <h1 className="mt-4 text-3xl font-bold text-white">Create your organization</h1>
            <p className="mt-2 text-white/60">Start managing cybersecurity training for your team</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              id="orgName"
              name="orgName"
              label="Organization Name"
              placeholder="Acme Corp"
              value={form.orgName}
              onChange={handleChange}
              required
            />

            <div className="grid grid-cols-2 gap-3">
              <Input
                id="firstName"
                name="firstName"
                label="First Name"
                placeholder="Jane"
                value={form.firstName}
                onChange={handleChange}
                required
              />
              <Input
                id="lastName"
                name="lastName"
                label="Last Name"
                placeholder="Smith"
                value={form.lastName}
                onChange={handleChange}
                required
              />
            </div>

            <Input
              id="email"
              name="email"
              type="email"
              label="Email"
              placeholder="jane@acme.com"
              value={form.email}
              onChange={handleChange}
              required
            />

            <Input
              id="password"
              name="password"
              type="password"
              label="Password"
              placeholder="Min 6 characters"
              value={form.password}
              onChange={handleChange}
              required
              minLength={6}
            />

            <Select
              id="companySize"
              name="companySize"
              label="Company Size"
              value={form.companySize}
              onChange={handleChange}
            >
              <option value="1-10">1-10 employees</option>
              <option value="11-50">11-50 employees</option>
              <option value="51-200">51-200 employees</option>
              <option value="201-500">201-500 employees</option>
              <option value="500+">500+ employees</option>
            </Select>

            <div className="space-y-1.5">
              <label className="block text-sm font-medium text-white/80">Plan</label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setForm(prev => ({ ...prev, plan: 'free' }))}
                  className={`rounded-xl border p-4 text-left transition-all ${
                    form.plan === 'free'
                      ? 'border-brand-accent bg-brand-accent/10'
                      : 'border-white/10 bg-white/5 hover:border-white/20'
                  }`}
                >
                  <div className="text-sm font-semibold text-white">Free</div>
                  <div className="text-xs text-white/60">Up to 5 users</div>
                </button>
                <button
                  type="button"
                  onClick={() => setForm(prev => ({ ...prev, plan: 'starter' }))}
                  className={`rounded-xl border p-4 text-left transition-all ${
                    form.plan === 'starter'
                      ? 'border-brand-accent bg-brand-accent/10'
                      : 'border-white/10 bg-white/5 hover:border-white/20'
                  }`}
                >
                  <div className="text-sm font-semibold text-white">Starter</div>
                  <div className="text-xs text-white/60">$20/mo — 25 users</div>
                </button>
              </div>
            </div>

            {error && (
              <div className="rounded-lg border border-red-500/30 bg-red-500/10 p-3 text-sm text-red-400">
                {error}
              </div>
            )}

            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? 'Creating organization...' : 'Create Organization'}
            </Button>
          </form>

          <p className="mt-6 text-center text-sm text-white/50">
            Already have an account?{' '}
            <Link to="/org/login" className="text-brand-accent hover:underline">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}

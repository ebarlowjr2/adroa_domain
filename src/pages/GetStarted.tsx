import { Link } from 'react-router-dom'
import { Building2, User, Award, ArrowRight, ChevronRight } from 'lucide-react'
import Footer from '@/components/Footer'

export default function GetStarted() {
  return (
    <div className="relative min-h-screen overflow-hidden bg-brand-bg">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(60%_60%_at_70%_10%,rgba(0,175,241,0.15),transparent_60%)]" />

      {/* Header */}
      <header className="container mx-auto flex items-center justify-between px-6 py-6">
        <Link to="/" className="text-lg font-bold tracking-wide text-brand-accent">
          Adroa Domain
        </Link>
        <nav className="flex items-center gap-3">
          <Link
            to="/org/login"
            className="rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-sm text-white hover:bg-white/10"
          >
            Dashboard Login
          </Link>
        </nav>
      </header>

      <main className="container mx-auto flex min-h-[calc(100vh-200px)] flex-col items-center justify-center px-6 py-16">
        <span className="mb-4 inline-flex items-center gap-2 rounded-full border border-brand-neutral-600 bg-brand-neutral-700/30 px-3 py-1 text-xs text-brand-neutral-100">
          Choose Your Path
        </span>
        <h1 className="text-center text-3xl font-extrabold text-white md:text-5xl">
          How would you like to{' '}
          <span className="text-brand-accent">get started?</span>
        </h1>
        <p className="mx-auto mt-4 max-w-xl text-center text-lg text-white/60">
          Whether you're building cybersecurity readiness for your team or growing your own skills,
          we have a path for you.
        </p>

        <div className="mt-12 grid w-full max-w-5xl gap-6 md:grid-cols-2 lg:grid-cols-3">
          {/* Organization Card */}
          <Link
            to="/org/signup"
            className="group relative rounded-2xl border border-white/10 bg-brand-card p-8 transition-all hover:border-brand-accent/40 hover:shadow-lg hover:shadow-brand-accent/5"
          >
            <div className="mb-5 inline-flex rounded-xl bg-brand-accent/10 p-4 text-brand-accent transition-colors group-hover:bg-brand-accent/20">
              <Building2 size={28} />
            </div>
            <h2 className="text-2xl font-bold text-white">Organization</h2>
            <p className="mt-3 text-sm leading-relaxed text-white/60">
              Create a business account to manage cybersecurity training for your team.
              Add employees, assign courses, track completion, and build organization-wide
              security readiness from a single dashboard.
            </p>
            <ul className="mt-5 space-y-2 text-sm text-white/50">
              <li className="flex items-center gap-2">
                <ChevronRight size={14} className="text-brand-accent" />
                Employee management & training assignment
              </li>
              <li className="flex items-center gap-2">
                <ChevronRight size={14} className="text-brand-accent" />
                Completion tracking & compliance reporting
              </li>
              <li className="flex items-center gap-2">
                <ChevronRight size={14} className="text-brand-accent" />
                Free tier: up to 5 users
              </li>
            </ul>
            <div className="mt-6 inline-flex items-center gap-2 text-sm font-medium text-brand-accent transition-all group-hover:gap-3">
              Create Organization <ArrowRight size={16} />
            </div>
          </Link>

          {/* Individual Card */}
          <a
            href="https://learn.adroadomain.com"
            className="group relative rounded-2xl border border-white/10 bg-brand-card p-8 transition-all hover:border-brand-accent/40 hover:shadow-lg hover:shadow-brand-accent/5"
          >
            <div className="mb-5 inline-flex rounded-xl bg-brand-accent/10 p-4 text-brand-accent transition-colors group-hover:bg-brand-accent/20">
              <User size={28} />
            </div>
            <h2 className="text-2xl font-bold text-white">Individual Learner</h2>
            <p className="mt-3 text-sm leading-relaxed text-white/60">
              Jump straight into cybersecurity training at your own pace.
              Access courses on phishing awareness, AI safety, digital hygiene,
              and more — no organization account needed.
            </p>
            <ul className="mt-5 space-y-2 text-sm text-white/50">
              <li className="flex items-center gap-2">
                <ChevronRight size={14} className="text-brand-accent" />
                Self-paced interactive courses
              </li>
              <li className="flex items-center gap-2">
                <ChevronRight size={14} className="text-brand-accent" />
                Quizzes, scenarios & real-world examples
              </li>
              <li className="flex items-center gap-2">
                <ChevronRight size={14} className="text-brand-accent" />
                Free to start — no credit card required
              </li>
            </ul>
            <div className="mt-6 inline-flex items-center gap-2 text-sm font-medium text-brand-accent transition-all group-hover:gap-3">
              Start Learning <ArrowRight size={16} />
            </div>
          </a>
          {/* Certification Tracking Card */}
          <Link
            to="/vcm/signup"
            className="group relative rounded-2xl border border-white/10 bg-brand-card p-8 transition-all hover:border-brand-accent/40 hover:shadow-lg hover:shadow-brand-accent/5"
          >
            <div className="mb-5 inline-flex rounded-xl bg-brand-accent/10 p-4 text-brand-accent transition-colors group-hover:bg-brand-accent/20">
              <Award size={28} />
            </div>
            <h2 className="text-2xl font-bold text-white">Track Certifications</h2>
            <p className="mt-3 text-sm leading-relaxed text-white/60">
              Stay ahead of certification renewals by tracking credentials, continuing
              education units, completed training, and upcoming opportunities — all in
              one dashboard.
            </p>
            <ul className="mt-5 space-y-2 text-sm text-white/50">
              <li className="flex items-center gap-2">
                <ChevronRight size={14} className="text-brand-accent" />
                Track CEUs, CPEs & PDUs across certifications
              </li>
              <li className="flex items-center gap-2">
                <ChevronRight size={14} className="text-brand-accent" />
                Renewal reminders & expiration alerts
              </li>
              <li className="flex items-center gap-2">
                <ChevronRight size={14} className="text-brand-accent" />
                Log training activities & discover opportunities
              </li>
            </ul>
            <div className="mt-6 inline-flex items-center gap-2 text-sm font-medium text-brand-accent transition-all group-hover:gap-3">
              Start Tracking <ArrowRight size={16} />
            </div>
          </Link>
        </div>

        <p className="mt-10 text-center text-sm text-white/40">
          Already have an account?{' '}
          <Link to="/org/login" className="text-brand-accent hover:underline">
            Sign in to your dashboard
          </Link>{' '}
          or{' '}
          <a href="https://learn.adroadomain.com" className="text-brand-accent hover:underline">
            go to the training portal
          </a>
        </p>
      </main>

      <Footer />
    </div>
  )
}

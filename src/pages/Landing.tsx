import { Link } from 'react-router-dom'
import Footer from '@/components/Footer'
import {
  Shield,
  BookOpen,
  Users,
  Building2,
  User,
  ChevronRight,
  ArrowRight,
  CheckCircle,
  BarChart3,
  UserPlus,
  GraduationCap,
  Award,
} from 'lucide-react'

export default function Landing() {
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
            to="/vcm"
            className="hidden rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-sm text-white hover:bg-white/10 sm:inline-flex"
          >
            Certification Manager
          </Link>
          <a
            href="https://learn.adroadomain.com"
            className="hidden rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-sm text-white hover:bg-white/10 sm:inline-flex"
          >
            Training Portal
          </a>
          <Link
            to="/org/login"
            className="rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-sm text-white hover:bg-white/10"
          >
            Dashboard Login
          </Link>
        </nav>
      </header>

      <main>
        {/* Hero */}
        <section className="container mx-auto px-6 pt-16 pb-12 text-center">
          <span className="mb-4 inline-flex items-center gap-2 rounded-full border border-brand-neutral-600 bg-brand-neutral-700/30 px-3 py-1 text-xs text-brand-neutral-100">
            Cybersecurity Training by One Circle Solutions
          </span>
          <h1 className="mx-auto mt-4 max-w-4xl text-4xl font-extrabold leading-tight text-white md:text-6xl">
            Build Real Cybersecurity{' '}
            <span className="text-brand-accent">Readiness</span>
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg text-white/70">
            The Adroa Domain is a modern training platform that combines guided learning
            with hands-on exercises. Whether you're protecting a team or growing your own
            skills, start here.
          </p>
        </section>

        {/* Choose Your Path — integrated directly */}
        <section className="container mx-auto px-6 py-12" id="paths">
          <h2 className="mb-2 text-center text-2xl font-bold text-white md:text-3xl">
            Choose Your Path
          </h2>
          <p className="mx-auto mb-10 max-w-xl text-center text-white/50">
            Select the option that best fits how you want to use the platform.
          </p>

          <div className="mx-auto grid max-w-5xl gap-8 md:grid-cols-2 lg:grid-cols-3">
            {/* Organization Card */}
            <Link
              to="/org/signup"
              className="group relative rounded-2xl border border-white/10 bg-brand-card p-8 transition-all hover:border-brand-accent/40 hover:shadow-lg hover:shadow-brand-accent/5"
            >
              <div className="mb-5 inline-flex rounded-xl bg-brand-accent/10 p-4 text-brand-accent transition-colors group-hover:bg-brand-accent/20">
                <Building2 size={28} />
              </div>
              <h3 className="text-2xl font-bold text-white">Sign Up Your Company</h3>
              <p className="mt-3 text-sm leading-relaxed text-white/60">
                Create a business account to manage cybersecurity training for your
                entire team. Assign courses, track completion, and build organization-wide
                security readiness from one dashboard.
              </p>
              <ul className="mt-5 space-y-2 text-sm text-white/50">
                <li className="flex items-center gap-2">
                  <CheckCircle size={14} className="text-brand-accent" />
                  Employee management & training assignment
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle size={14} className="text-brand-accent" />
                  Completion tracking & compliance reporting
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle size={14} className="text-brand-accent" />
                  Free tier: up to 5 users
                </li>
              </ul>
              <div className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-brand-accent transition-all group-hover:gap-3">
                Create Organization Account <ArrowRight size={16} />
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
              <h3 className="text-2xl font-bold text-white">Start Learning Individually</h3>
              <p className="mt-3 text-sm leading-relaxed text-white/60">
                Jump straight into cybersecurity training at your own pace. Access
                courses on phishing awareness, AI safety, digital hygiene, and more — no
                organization account needed.
              </p>
              <ul className="mt-5 space-y-2 text-sm text-white/50">
                <li className="flex items-center gap-2">
                  <CheckCircle size={14} className="text-brand-accent" />
                  Self-paced interactive courses
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle size={14} className="text-brand-accent" />
                  Quizzes, scenarios & real-world examples
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle size={14} className="text-brand-accent" />
                  Free to start — no credit card required
                </li>
              </ul>
              <div className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-brand-accent transition-all group-hover:gap-3">
                Browse Courses <ArrowRight size={16} />
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
              <h3 className="text-2xl font-bold text-white">Track Your Certifications</h3>
              <p className="mt-3 text-sm leading-relaxed text-white/60">
                Stay ahead of certification renewals by tracking credentials, continuing
                education units, completed training, and upcoming opportunities — all in
                one dashboard.
              </p>
              <ul className="mt-5 space-y-2 text-sm text-white/50">
                <li className="flex items-center gap-2">
                  <CheckCircle size={14} className="text-brand-accent" />
                  Track CEUs, CPEs & PDUs across certifications
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle size={14} className="text-brand-accent" />
                  Renewal reminders & expiration alerts
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle size={14} className="text-brand-accent" />
                  Log training activities & discover opportunities
                </li>
              </ul>
              <div className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-brand-accent transition-all group-hover:gap-3">
                Start Tracking <ArrowRight size={16} />
              </div>
            </Link>
          </div>

          <p className="mt-8 text-center text-sm text-white/40">
            Already have an account?{' '}
            <Link to="/org/login" className="text-brand-accent hover:underline">
              Sign in to your dashboard
            </Link>
            {' '}or{' '}
            <a href="https://learn.adroadomain.com" className="text-brand-accent hover:underline">
              go to the training portal
            </a>
          </p>
        </section>

        {/* What You Get — brief value props */}
        <section className="container mx-auto px-6 py-16">
          <h2 className="mb-2 text-center text-2xl font-bold text-white md:text-3xl">
            What Makes Adroa Domain Different
          </h2>
          <p className="mx-auto mb-10 max-w-xl text-center text-white/50">
            Go beyond checkbox compliance with training built for real-world threats.
          </p>
          <div className="mx-auto grid max-w-5xl gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {[
              { icon: BookOpen, title: 'Guided Learning', desc: 'Structured courses covering phishing, AI safety, passwords, social engineering, and more.' },
              { icon: Shield, title: 'Hands-On Exercises', desc: 'Scenario-based training with real-world breach examples and decision-point exercises.' },
              { icon: BarChart3, title: 'Track Progress', desc: 'Organizations can assign training, monitor completion, and generate readiness reports.' },
              { icon: GraduationCap, title: 'Earn Certification', desc: 'Complete the Modern Cyber Awareness course to earn your digital safety certification.' },
            ].map((item) => (
              <div key={item.title} className="rounded-2xl border border-white/10 bg-brand-card p-6 text-center transition-all hover:border-brand-accent/30">
                <div className="mx-auto mb-3 inline-flex rounded-xl bg-brand-accent/10 p-3 text-brand-accent">
                  <item.icon size={22} />
                </div>
                <h3 className="font-semibold text-white">{item.title}</h3>
                <p className="mt-2 text-sm text-white/50">{item.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Who It's For — compact */}
        <section className="container mx-auto px-6 py-16">
          <h2 className="mb-8 text-center text-2xl font-bold text-white">Who It's Built For</h2>
          <div className="mx-auto flex max-w-4xl flex-wrap items-center justify-center gap-4">
            {[
              { icon: Building2, label: 'Small Businesses' },
              { icon: Users, label: 'HR & Compliance Teams' },
              { icon: User, label: 'Individual Learners' },
              { icon: Shield, label: 'Security Teams' },
              { icon: UserPlus, label: 'MSPs & IT Providers' },
              { icon: GraduationCap, label: 'New IT Professionals' },
            ].map((item) => (
              <div
                key={item.label}
                className="flex items-center gap-2 rounded-full border border-white/10 bg-brand-card px-5 py-2.5"
              >
                <item.icon size={16} className="text-brand-accent" />
                <span className="text-sm text-white/70">{item.label}</span>
              </div>
            ))}
          </div>
        </section>

        {/* Bottom CTA */}
        <section className="container mx-auto px-6 py-16">
          <div className="rounded-2xl border border-brand-accent/30 bg-gradient-to-r from-brand-accent/10 to-transparent p-8 text-center md:p-12">
            <h2 className="text-2xl font-bold text-white md:text-3xl">
              Ready to get started?
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-white/60">
              Choose the path that fits your needs and start building real cybersecurity readiness today.
            </p>
            <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
              <Link
                to="/org/signup"
                className="inline-flex items-center gap-2 rounded-xl bg-brand-accent px-6 py-3 font-medium text-black shadow-lg shadow-brand-accent/25 transition-colors hover:bg-brand-accent-light"
              >
                Sign Up Your Company <ArrowRight size={18} />
              </Link>
              <a
                href="https://learn.adroadomain.com/courses"
                className="inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-6 py-3 text-white transition-colors hover:bg-white/10"
              >
                Start Learning Free <ChevronRight size={18} />
              </a>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}

import { Link } from 'react-router-dom'
import Footer from '@/components/Footer'
import {
  Award,
  BookOpen,
  Calendar,
  CheckCircle,
  ChevronRight,
  Compass,
  Shield,
  TrendingUp,
} from 'lucide-react'

export default function VcmLanding() {
  return (
    <div className="relative min-h-screen overflow-hidden bg-brand-bg">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(60%_60%_at_70%_10%,rgba(0,175,241,0.15),transparent_60%)]" />

      {/* Header */}
      <header className="container mx-auto flex items-center justify-between px-6 py-6">
        <Link to="/vcm" className="text-lg font-bold tracking-wide text-brand-accent">
          Adroa Domain
        </Link>
        <nav className="flex items-center gap-3">
          <Link
            to="/vcm/login"
            className="rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-sm text-white hover:bg-white/10"
          >
            Sign In
          </Link>
          <Link
            to="/vcm/signup"
            className="rounded-xl bg-brand-accent px-4 py-2 text-sm font-medium text-white hover:bg-brand-accent-light"
          >
            Get Started Free
          </Link>
        </nav>
      </header>

      <main>
        {/* Hero */}
        <section className="container mx-auto px-6 pt-16 pb-16 text-center">
          <span className="mb-4 inline-flex items-center gap-2 rounded-full border border-brand-neutral-600 bg-brand-neutral-700/30 px-3 py-1 text-xs text-brand-neutral-100">
            <Award size={14} />
            Virtual Certification Manager
          </span>
          <h1 className="mx-auto mt-4 max-w-4xl text-4xl font-extrabold leading-tight text-white md:text-6xl">
            Track Your Certifications.{' '}
            <span className="text-brand-accent">Manage Your Credits.</span>{' '}
            Stay Ready for Renewal.
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg text-brand-neutral-300">
            The Virtual Certification Manager helps professionals stay ahead of certification
            renewals by tracking credentials, required continuing education units, completed
            training, and upcoming opportunities in one simple dashboard.
          </p>
          <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
            <Link
              to="/vcm/signup"
              className="inline-flex items-center gap-2 rounded-xl bg-brand-accent px-6 py-3 text-base font-semibold text-white shadow-lg shadow-brand-accent/20 hover:bg-brand-accent-light"
            >
              Start Tracking Free
              <ChevronRight size={18} />
            </Link>
            <Link
              to="/vcm/login"
              className="inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-6 py-3 text-base text-white hover:bg-white/10"
            >
              Sign In
            </Link>
          </div>
        </section>

        {/* Features */}
        <section className="container mx-auto px-6 pb-20">
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {[
              {
                icon: <Award size={24} />,
                title: 'Certification Tracker',
                desc: 'Track all your professional certifications in one place — Security+, CISSP, PMP, AWS, and more.',
              },
              {
                icon: <BookOpen size={24} />,
                title: 'CEU/CPE/PDU Logging',
                desc: 'Log completed training activities and continuing education credits toward certification renewals.',
              },
              {
                icon: <Calendar size={24} />,
                title: 'Renewal Timeline',
                desc: 'Never miss a renewal deadline. See exactly when certifications expire and what credits you still need.',
              },
              {
                icon: <TrendingUp size={24} />,
                title: 'Progress Dashboard',
                desc: 'Visual summary of active certifications, completed credits, remaining requirements, and upcoming renewals.',
              },
              {
                icon: <Compass size={24} />,
                title: 'Training Opportunities',
                desc: 'Discover upcoming webinars, courses, and events that count toward your certification credits.',
              },
              {
                icon: <Shield size={24} />,
                title: 'Secure & Private',
                desc: 'Your certification data is encrypted and only visible to you. No employer access unless you share.',
              },
            ].map((feature, i) => (
              <div
                key={i}
                className="rounded-2xl border border-white/10 bg-brand-card p-6 transition-all duration-200 hover:border-brand-accent/30"
              >
                <div className="mb-4 inline-flex rounded-lg bg-brand-accent/10 p-2.5 text-brand-accent">
                  {feature.icon}
                </div>
                <h3 className="mb-2 text-lg font-semibold text-white">{feature.title}</h3>
                <p className="text-sm text-white/60">{feature.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Who it's for */}
        <section className="container mx-auto px-6 pb-20">
          <h2 className="mb-8 text-center text-2xl font-bold text-white">
            Built for Professionals Who Need to{' '}
            <span className="text-brand-accent">Stay Certified</span>
          </h2>
          <div className="mx-auto grid max-w-3xl gap-4 md:grid-cols-2">
            {[
              'Cybersecurity Professionals',
              'IT Administrators & Engineers',
              'Compliance Officers',
              'Project Managers',
              'Cloud Architects',
              'Students Entering Certification Paths',
            ].map((role, i) => (
              <div key={i} className="flex items-center gap-3 rounded-xl border border-white/10 bg-brand-card px-4 py-3">
                <CheckCircle size={18} className="shrink-0 text-brand-accent" />
                <span className="text-sm text-white">{role}</span>
              </div>
            ))}
          </div>
        </section>

        {/* CTA */}
        <section className="container mx-auto px-6 pb-20 text-center">
          <div className="rounded-2xl border border-brand-accent/20 bg-brand-accent/5 px-8 py-12">
            <h2 className="text-2xl font-bold text-white">Ready to take control of your certifications?</h2>
            <p className="mx-auto mt-3 max-w-lg text-white/60">
              Join professionals who use the Virtual Certification Manager to stay ahead of renewals and never lose a credential.
            </p>
            <Link
              to="/vcm/signup"
              className="mt-6 inline-flex items-center gap-2 rounded-xl bg-brand-accent px-6 py-3 text-base font-semibold text-white shadow-lg shadow-brand-accent/20 hover:bg-brand-accent-light"
            >
              Create Your Free Account
              <ChevronRight size={18} />
            </Link>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}

import { Link } from 'react-router-dom'
import Footer from '@/components/Footer'
import {
  Shield,
  BookOpen,
  Users,
  Zap,
  Target,
  Brain,
  Building,
  GraduationCap,
  ChevronRight,
  ArrowRight,
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
          <Link
            to="/get-started"
            className="rounded-xl bg-brand-accent/90 px-4 py-2 text-sm font-medium text-black hover:bg-brand-accent"
          >
            Get Started
          </Link>
        </nav>
      </header>

      <main>
        {/* Hero */}
        <section className="container mx-auto px-6 pt-16 pb-20 text-center">
          <span className="mb-4 inline-flex items-center gap-2 rounded-full border border-brand-neutral-600 bg-brand-neutral-700/30 px-3 py-1 text-xs text-brand-neutral-100">
            Next-Generation Cybersecurity Training
          </span>
          <h1 className="mx-auto mt-4 max-w-4xl text-4xl font-extrabold leading-tight text-white md:text-6xl">
            Modern Cybersecurity Training{' '}
            <span className="text-brand-accent">Built for the Real World</span>
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg text-white/70">
            The Adroa Domain by One Circle Solutions combines guided learning with hands-on
            operational training in a modern interactive environment designed for today's workforce.
          </p>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
            <Link
              to="/get-started"
              className="inline-flex items-center gap-2 rounded-xl bg-brand-accent px-6 py-3 font-medium text-black shadow-lg shadow-brand-accent/25 transition-colors hover:bg-brand-accent-light"
            >
              Start Learning <ArrowRight size={18} />
            </Link>
            <a
              href="https://learn.adroadomain.com/courses"
              className="inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-6 py-3 text-white transition-colors hover:bg-white/10"
            >
              Explore Training Paths <ChevronRight size={18} />
            </a>
          </div>
        </section>

        {/* Platform Description */}
        <section className="container mx-auto px-6 py-16">
          <div className="mx-auto max-w-3xl text-center">
            <h2 className="text-2xl font-bold text-white md:text-3xl">
              A Next-Generation Cybersecurity Training Platform
            </h2>
            <p className="mt-4 text-white/60">
              The Adroa Domain was designed to move beyond standard awareness slides and checkbox quizzes.
              It teaches real cybersecurity concepts through guided training modules, interactive exercises,
              and practical workplace scenarios that help learners recognize, respond to, and prevent
              real-world threats.
            </p>
          </div>
        </section>

        {/* Two-Part Learning */}
        <section className="container mx-auto px-6 py-16">
          <div className="grid gap-8 md:grid-cols-2">
            <div className="rounded-2xl border border-white/10 bg-brand-card p-8">
              <div className="mb-4 inline-flex rounded-xl bg-brand-accent/10 p-3 text-brand-accent">
                <BookOpen size={24} />
              </div>
              <h3 className="text-xl font-semibold text-white">Learn the Concepts</h3>
              <p className="mt-2 text-sm text-white/60">
                Start with modern guided training modules designed for:
              </p>
              <ul className="mt-4 space-y-2 text-sm text-white/70">
                <li className="flex items-center gap-2"><ChevronRight size={14} className="text-brand-accent" /> Phishing & social engineering awareness</li>
                <li className="flex items-center gap-2"><ChevronRight size={14} className="text-brand-accent" /> Password, MFA & identity protection</li>
                <li className="flex items-center gap-2"><ChevronRight size={14} className="text-brand-accent" /> AI safety & responsible usage</li>
                <li className="flex items-center gap-2"><ChevronRight size={14} className="text-brand-accent" /> Safe browsing & internet behavior</li>
                <li className="flex items-center gap-2"><ChevronRight size={14} className="text-brand-accent" /> Incident recognition & reporting</li>
              </ul>
              <p className="mt-4 text-xs text-white/40">
                Lessons include scenario-based exercises, decision points, quizzes, and real-world examples.
              </p>
            </div>

            <div className="rounded-2xl border border-white/10 bg-brand-card p-8">
              <div className="mb-4 inline-flex rounded-xl bg-brand-accent/10 p-3 text-brand-accent">
                <Zap size={24} />
              </div>
              <h3 className="text-xl font-semibold text-white">Apply the Skills</h3>
              <p className="mt-2 text-sm text-white/60">
                Practice security concepts in realistic environments through:
              </p>
              <ul className="mt-4 space-y-2 text-sm text-white/70">
                <li className="flex items-center gap-2"><ChevronRight size={14} className="text-brand-accent" /> Simulated phishing exercises</li>
                <li className="flex items-center gap-2"><ChevronRight size={14} className="text-brand-accent" /> Security decision scenarios</li>
                <li className="flex items-center gap-2"><ChevronRight size={14} className="text-brand-accent" /> Incident response walkthroughs</li>
                <li className="flex items-center gap-2"><ChevronRight size={14} className="text-brand-accent" /> Real-world breach case studies</li>
                <li className="flex items-center gap-2"><ChevronRight size={14} className="text-brand-accent" /> Interactive security assessments</li>
              </ul>
              <p className="mt-4 text-xs text-white/40">
                This creates a more engaging and effective learning experience for every role.
              </p>
            </div>
          </div>
        </section>

        {/* Why Different */}
        <section className="container mx-auto px-6 py-16">
          <h2 className="mb-8 text-center text-2xl font-bold text-white">Why This Is Different</h2>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {[
              { icon: Brain, title: 'Judgment-Based', desc: 'Teaches critical thinking and behavioral security, not just checkbox compliance.' },
              { icon: Target, title: 'Threat-Aware', desc: 'Covers modern risks including AI threats, deepfakes, OSINT, and social engineering.' },
              { icon: Shield, title: 'Operationally Focused', desc: 'Designed around real-world workplace scenarios and practical decision-making.' },
              { icon: Users, title: 'Team-Ready', desc: 'Built for organizations to assign, track, and certify employee training at scale.' },
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

        {/* Who It's For */}
        <section className="container mx-auto px-6 py-16">
          <h2 className="mb-8 text-center text-2xl font-bold text-white">Who It's Built For</h2>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {[
              { icon: Building, title: 'Small Businesses', desc: 'Affordable training to protect your team without a dedicated security department.' },
              { icon: Users, title: 'HR & Compliance Teams', desc: 'Assign training, track completions, and generate compliance-ready reports.' },
              { icon: GraduationCap, title: 'Individual Learners', desc: 'Build practical cybersecurity skills for your career and personal safety.' },
              { icon: Shield, title: 'Security Teams', desc: 'Supplement technical controls with operational cybersecurity training for staff.' },
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

        {/* CTA */}
        <section className="container mx-auto px-6 py-16">
          <div className="rounded-2xl border border-brand-accent/30 bg-gradient-to-r from-brand-accent/10 to-transparent p-8 text-center md:p-12">
            <h2 className="text-2xl font-bold text-white md:text-3xl">
              Experience a modern approach to cybersecurity training
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-white/60">
              Start building security awareness across your organization with interactive courses,
              hands-on operational labs, guided security exercises, and role-based learning paths.
            </p>
            <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
              <Link
                to="/get-started"
                className="inline-flex items-center gap-2 rounded-xl bg-brand-accent px-6 py-3 font-medium text-black shadow-lg shadow-brand-accent/25 transition-colors hover:bg-brand-accent-light"
              >
                Get Started Free <ArrowRight size={18} />
              </Link>
              <a
                href="https://learn.adroadomain.com/courses"
                className="inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-6 py-3 text-white transition-colors hover:bg-white/10"
              >
                Browse Courses
              </a>
            </div>
          </div>
        </section>

        {/* Coming Soon */}
        <section className="container mx-auto px-6 py-16">
          <h2 className="mb-6 text-center text-lg font-semibold text-white/70">Coming Soon</h2>
          <div className="flex flex-wrap items-center justify-center gap-3">
            {[
              'Interactive Training Modules',
              'Awareness Courses',
              'Hands-On Operational Labs',
              'Guided Security Exercises',
              'Role-Based Learning Paths',
            ].map((item) => (
              <span
                key={item}
                className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm text-white/60"
              >
                {item}
              </span>
            ))}
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}

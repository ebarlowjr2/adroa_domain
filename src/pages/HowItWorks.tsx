import React from "react";

const Badge = ({ children }: { children: React.ReactNode }) => (
  <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-white/80">
    {children}
  </span>
);

const Step = ({ n, title, desc }: { n: number; title: string; desc: string }) => (
  <div className="relative rounded-2xl border border-white/10 bg-white/5 p-5">
    <div className="absolute -top-3 left-5 flex h-7 w-7 items-center justify-center rounded-full bg-brand-accent text-black text-xs font-bold shadow">
      {n}
    </div>
    <div className="mt-2 font-semibold">{title}</div>
    <p className="mt-2 text-sm text-white/70">{desc}</p>
  </div>
);

const Architecture = () => (
  <div className="relative overflow-hidden rounded-2xl border border-white/10 bg-gradient-to-b from-white/5 to-transparent p-6">
    <svg viewBox="0 0 900 380" className="w-full h-auto">
      <defs>
        <linearGradient id="g1" x1="0" x2="1">
          <stop offset="0%" stopColor="#22d3ee" stopOpacity="0.9"/>
          <stop offset="100%" stopColor="#22d3ee" stopOpacity="0.2"/>
        </linearGradient>
      </defs>

      {/* Portal */}
      <rect x="30" y="40" width="240" height="90" rx="14" fill="#0f1729" stroke="rgba(255,255,255,0.15)"/>
      <text x="50" y="70" fill="#a3e7f5" fontSize="14" fontWeight="600">Portal (Vercel)</text>
      <text x="50" y="96" fill="#cbd5e1" fontSize="12">Auth (Auth0, later)</text>

      {/* Gateway */}
      <rect x="330" y="40" width="240" height="90" rx="14" fill="#0f1729" stroke="rgba(255,255,255,0.15)"/>
      <text x="350" y="70" fill="#a3e7f5" fontSize="14" fontWeight="600">Lab Gateway</text>
      <text x="350" y="96" fill="#cbd5e1" fontSize="12">Nginx+OIDC / Cloudflare Access</text>

      {/* Sandboxes */}
      <rect x="630" y="25" width="240" height="120" rx="14" fill="#0f1729" stroke="rgba(255,255,255,0.15)"/>
      <text x="650" y="55" fill="#a3e7f5" fontSize="14" fontWeight="600">Sandboxes</text>
      <text x="650" y="80" fill="#cbd5e1" fontSize="12">Guacamole · Jupyter · VS Code</text>
      <text x="650" y="100" fill="#cbd5e1" fontSize="12">Wazuh · Zeek · Suricata</text>

      {/* Data plane */}
      <rect x="330" y="180" width="240" height="160" rx="14" fill="#0f1729" stroke="rgba(255,255,255,0.15)"/>
      <text x="350" y="210" fill="#a3e7f5" fontSize="14" fontWeight="600">Data & Telemetry</text>
      <text x="350" y="236" fill="#cbd5e1" fontSize="12">Supabase (profiles, progress)</text>
      <text x="350" y="256" fill="#cbd5e1" fontSize="12">SIEM / Logs (Wazuh)</text>
      <text x="350" y="276" fill="#cbd5e1" fontSize="12">Artifacts (reports, notes)</text>

      {/* Arrows */}
      <path d="M270 85 H330" stroke="url(#g1)" strokeWidth="3"/>
      <polygon points="330,85 320,80 320,90" fill="#22d3ee"/>
      <path d="M570 85 H630" stroke="url(#g1)" strokeWidth="3"/>
      <polygon points="630,85 620,80 620,90" fill="#22d3ee"/>
      <path d="M750 145 V180" stroke="url(#g1)" strokeWidth="3"/>
      <polygon points="750,180 745,170 755,170" fill="#22d3ee"/>
    </svg>

    <div className="mt-4 grid gap-3 text-xs text-white/70 md:grid-cols-3">
      <div><span className="text-brand-accent">Portal</span> — public site, announcements, docs, SSO (later).</div>
      <div><span className="text-brand-accent">Gateway</span> — forces login, routes to the right lab.</div>
      <div><span className="text-brand-accent">Sandboxes</span> — browser-based labs with logging and guardrails.</div>
    </div>

    <div className="pointer-events-none absolute inset-0 -z-10 opacity-40 blur-2xl"
         style={{ background: "radial-gradient(600px 200px at 70% 10%, rgba(34,211,238,0.2), transparent 60%)" }} />
  </div>
);

const Divider = () => (
  <div className="my-12 h-px w-full bg-gradient-to-r from-transparent via-white/15 to-transparent" />
);

export default function HowItWorks() {
  return (
    <div className="relative min-h-screen overflow-hidden">
      {/* background aura */}
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(60%_60%_at_70%_10%,rgba(34,211,238,0.15),transparent_60%)]" />

      <main className="container mx-auto px-6 py-10">
        {/* HERO */}
        <section className="grid gap-10 md:grid-cols-2 md:items-center">
          <div>
            <Badge>Public brief</Badge>
            <h1 className="mt-4 text-4xl font-extrabold leading-tight md:text-5xl">
              How the <span className="text-brand-accent">Adroa Domain</span> works
            </h1>
            <p className="mt-4 max-w-2xl text-white/75">
              Train onsite or remotely in a monitored, safe environment. Students learn real tools,
              complete hands-on labs, and build portfolio artifacts—without needing their own hardware.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <a href="#tracks" className="rounded-xl bg-brand-accent/90 px-5 py-3 font-medium text-black hover:bg-brand-accent">
                See participation tracks
              </a>
              <a href="#journey" className="rounded-xl border border-white/10 bg-white/5 px-5 py-3 hover:bg-white/10">
                View the learning journey
              </a>
            </div>
          </div>

          {/* Right: compact step tiles */}
          <div className="grid grid-cols-2 gap-4">
            <Step n={1} title="Apply" desc="Request access or join a cohort." />
            <Step n={2} title="Provision" desc="We spin up a safe sandbox tied to your account." />
            <Step n={3} title="Practice" desc="Follow guided tracks, blue/red team labs, and challenges." />
            <Step n={4} title="Showcase" desc="Export reports and evidence to your portfolio." />
          </div>
        </section>

        <Divider />

        {/* TRACKS */}
        <section id="tracks">
          <h2 className="text-2xl font-semibold">Two ways to participate</h2>
          <p className="mt-2 text-white/70">Choose the path that fits your schedule—switch anytime.</p>
          <div className="mt-6 grid gap-6 md:grid-cols-2">
            <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
              <div className="text-sm uppercase tracking-wide text-white/60">Onsite track</div>
              <h3 className="mt-1 text-xl font-semibold">Train at the Cyber Lab</h3>
              <ul className="mt-4 space-y-2 text-white/80">
                <li>• Instructor-led sessions and office hours</li>
                <li>• Team projects and live incident drills</li>
                <li>• Dedicated workstations with secured access</li>
                <li>• Fast feedback and peer learning</li>
              </ul>
              <div className="mt-5 rounded-xl border border-white/10 bg-brand.card p-4 text-sm text-white/70">
                <strong className="text-white">Cadence:</strong> Weekday evenings + Saturday open lab.
              </div>
            </div>

            <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
              <div className="text-sm uppercase tracking-wide text-white/60">Remote track</div>
              <h3 className="mt-1 text-xl font-semibold">Browser-based from anywhere</h3>
              <ul className="mt-4 space-y-2 text-white/80">
                <li>• Access labs via secure gateway (SSO enforced)</li>
                <li>• Self-paced learning paths and checkpoints</li>
                <li>• Cloud sandboxes (no local installs)</li>
                <li>• Progress tracking and badges</li>
              </ul>
              <div className="mt-5 rounded-xl border border-white/10 bg-brand.card p-4 text-sm text-white/70">
                <strong className="text-white">Cadence:</strong> Flexible, with weekly live reviews.
              </div>
            </div>
          </div>
        </section>

        <Divider />

        {/* JOURNEY */}
        <section id="journey">
          <h2 className="text-2xl font-semibold">Your learning journey</h2>
          <p className="mt-2 text-white/70">High-level steps students follow to gain skills and evidence.</p>

        <div className="mt-6 grid gap-4 md:grid-cols-4">
            <Step n={1} title="Request" desc="Submit a short form to join or be placed in a cohort." />
            <Step n={2} title="Orientation" desc="We cover platform safety, rules, and your goals." />
            <Step n={3} title="Skills Labs" desc="Blue team (Wazuh/Zeek), Red team (attack chains), Cloud security." />
            <Step n={4} title="Portfolio" desc="Export reports, dashboards, and write-ups you can share." />
          </div>
        </section>

        <Divider />

        {/* ARCHITECTURE GRAPHIC */}
        <section id="architecture">
          <h2 className="text-2xl font-semibold">What's under the hood (simple view)</h2>
          <p className="mt-2 text-white/70">A secure path from the public portal to monitored sandboxes.</p>
          <div className="mt-6">
            <Architecture />
          </div>
        </section>

        <Divider />

        {/* FAQ */}
        <section id="faq" className="grid gap-6 md:grid-cols-3">
          <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
            <h3 className="font-semibold">What do I need?</h3>
            <p className="mt-2 text-sm text-white/70">
              Any modern browser. Onsite gear is provided. Remote users do not need admin rights
              on their own computer—everything runs in the browser.
            </p>
          </div>
          <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
            <h3 className="font-semibold">How do I get access?</h3>
            <p className="mt-2 text-sm text-white/70">
              Click "Request access" on the portal. After approval, we provision your sandbox and
              send a welcome email with next steps.
            </p>
          </div>
          <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
            <h3 className="font-semibold">Is it safe?</h3>
            <p className="mt-2 text-sm text-white/70">
              Yes. Labs are isolated and monitored. Activities are logged, and internet egress is
              restricted where appropriate to keep training safe and auditable.
            </p>
          </div>
        </section>

        {/* CTA */}
        <section className="mt-12 rounded-2xl border border-white/10 bg-gradient-to-r from-white/5 to-white/10 p-6">
          <div className="flex flex-col items-start justify-between gap-4 md:flex-row md:items-center">
            <div>
              <h3 className="text-xl font-semibold">Ready to get started?</h3>
              <p className="mt-1 text-white/70">Join the next cohort or request access for your school or team.</p>
            </div>
            <div className="flex gap-3">
              <a href="#" className="rounded-xl bg-brand-accent/90 px-5 py-3 font-medium text-black hover:bg-brand-accent">Request access</a>
              <a href="#" className="rounded-xl border border-white/10 bg-white/5 px-5 py-3 hover:bg-white/10">Login</a>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}

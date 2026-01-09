import { Link } from "react-router-dom";

export default function Hero() {
  return (
    <section className="mt-12 grid gap-8 md:mt-20 md:grid-cols-2 md:items-center">
      <div>
        <span className="mb-4 inline-flex items-center gap-2 rounded-full border border-brand-neutral-600 bg-brand-neutral-700/30 px-3 py-1 text-xs text-brand-neutral-100">
          Now onboarding learners & teams
        </span>
        <h1 className="mt-4 text-4xl font-extrabold leading-tight md:text-5xl text-brand-neutral-50">
          Welcome to the <span className="text-brand-accent">Adroa Domain</span>
        </h1>
        <p className="mt-4 max-w-xl text-brand-neutral-200">
          A modern sandbox to learn cybersecurity, practice real skills, and
          launch into blue-team and red-team workflows—guided, hands-on, and auditable.
        </p>
        <div className="mt-6 flex flex-wrap gap-3">
          <a
            href="#cards"
            className="rounded-xl bg-brand-accent px-5 py-3 font-medium text-brand-neutral-900 hover:bg-brand-accent-light transition-colors shadow-lg shadow-brand-accent/25"
          >
            Explore resources
          </a>
          <Link
            to="/how-it-works"
            className="rounded-xl border border-brand-neutral-600 bg-brand-neutral-700/30 px-5 py-3 text-brand-neutral-100 hover:bg-brand-neutral-600/40 hover:border-brand-neutral-500 transition-colors"
          >
            See how it works
          </Link>
        </div>
      </div>

      <div className="rounded-2xl border border-brand-neutral-600 bg-gradient-to-b from-brand-neutral-700/50 to-brand-neutral-800/30 p-6 shadow-xl">
        <div className="grid grid-cols-2 gap-4">
          {[
            { title: "Request Access", desc: "Join the Adroa Domain community and start your cybersecurity journey." },
            { title: "Contribute a Project", desc: "Share your expertise by contributing labs, tools, or educational content." },
            { title: "Get Involved", desc: "Connect with peers, mentors, and industry professionals in our community." },
            { title: "Learn More", desc: "Explore our comprehensive resources and hands-on learning opportunities." }
          ].map((item,i)=>(
            <div key={i} className="rounded-xl bg-brand-neutral-700/40 border border-brand-neutral-600/50 p-4 hover:bg-brand-neutral-600/40 hover:border-brand-accent/30 transition-all duration-200 hover:shadow-lg hover:shadow-brand-accent/10">
              <div className="text-xs text-brand-neutral-300">Step {i+1}</div>
              <div className="mt-1 font-semibold text-brand-neutral-50">{item.title}</div>
              <div className="mt-2 text-xs text-brand-neutral-300">
                {item.desc}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

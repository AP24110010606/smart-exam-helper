import { Link } from 'react-router-dom';

function MatteHeader() {
  return (
    <header className="sticky top-0 z-50 border-b border-matte-border bg-matte-cream">
      <div className="mx-auto flex h-14 max-w-6xl items-center justify-between gap-4 px-4 sm:px-6">
        <Link to="/" className="font-landing text-lg font-semibold tracking-tight text-matte-charcoal">
          Ultimate Exam Helper
        </Link>
        <nav className="flex items-center gap-2 sm:gap-4" aria-label="Main">
          <a
            href="#features"
            className="hidden text-sm font-medium text-matte-charcoal-soft transition hover:text-matte-charcoal sm:inline"
          >
            Features
          </a>
          <a
            href="#preview"
            className="hidden text-sm font-medium text-matte-charcoal-soft transition hover:text-matte-charcoal md:inline"
          >
            Preview
          </a>
          <Link
            to="/login"
            className="rounded-xl px-3 py-2 text-sm font-medium text-matte-charcoal-soft transition hover:bg-matte-cream-dark hover:text-matte-charcoal"
          >
            Sign in
          </Link>
          <Link
            to="/register"
            className="rounded-xl bg-matte-terracotta px-4 py-2 text-sm font-semibold text-white transition hover:scale-[1.02] hover:bg-matte-terracotta-hover active:scale-[0.99]"
          >
            Get started
          </Link>
        </nav>
      </div>
    </header>
  );
}

/** Flat matte illustration — study motif, no gradients */
function HeroIllustration() {
  return (
    <div className="relative mx-auto w-full max-w-md" aria-hidden>
      <div className="aspect-[4/3] rounded-3xl border border-matte-border bg-matte-paper p-6 shadow-matte-md">
        <div className="flex h-full flex-col justify-between">
          <div className="flex gap-3">
            <div className="h-14 w-10 rounded-lg bg-matte-terracotta-muted/35" />
            <div className="h-14 w-10 rounded-lg bg-matte-sage-muted/40" />
            <div className="h-14 w-10 rounded-lg bg-matte-mustard-soft/50" />
          </div>
          <div className="space-y-2">
            <div className="h-2 w-3/4 max-w-[200px] rounded-full bg-matte-border-strong/60" />
            <div className="h-2 w-full max-w-[240px] rounded-full bg-matte-border" />
            <div className="h-2 w-5/6 max-w-[220px] rounded-full bg-matte-border" />
          </div>
          <div className="flex items-end justify-between">
            <div className="flex gap-1">
              <span className="h-8 w-8 rounded-full border-2 border-matte-sage bg-matte-sage/25" />
              <span className="h-8 w-8 rounded-full border-2 border-matte-terracotta bg-matte-terracotta-muted/20" />
            </div>
            <div className="h-10 w-10 rounded-xl border border-matte-border bg-matte-cream-dark" />
          </div>
        </div>
      </div>
    </div>
  );
}

const features = [
  {
    title: 'Smart Notes',
    desc: 'Organize topics, attach materials, and keep everything exam-ready in one calm workspace.',
    icon: (
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
    ),
  },
  {
    title: 'Practice Tests',
    desc: 'Timed quizzes and recall drills that mirror real exam pressure—without the noise.',
    icon: (
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
    ),
  },
  {
    title: 'AI Doubt Solver',
    desc: 'Ask tricky questions in plain language and get clear, step-by-step explanations on demand.',
    icon: (
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
    ),
  },
  {
    title: 'Progress Tracker',
    desc: 'See what you have mastered and what still needs attention—honest, simple, and motivating.',
    icon: (
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
    ),
  },
];

const testimonials = [
  {
    quote: 'Finally a study tool that feels calm. I use it every morning before class.',
    name: 'Priya M.',
    role: 'Biology major',
  },
  {
    quote: 'Clean layout, no distractions. Progress tracking keeps me honest about weak topics.',
    name: 'Jordan L.',
    role: 'Engineering student',
  },
  {
    quote: 'The practice flow is smooth. It is like having a quiet desk in a busy semester.',
    name: 'Sam R.',
    role: 'Pre-law',
  },
];

export default function Landing() {
  return (
    <div className="min-h-screen bg-matte-cream font-sans text-matte-charcoal antialiased">
      <MatteHeader />

      <main>
        {/* Hero */}
        <section className="border-b border-matte-border bg-matte-paper">
          <div className="mx-auto grid max-w-6xl gap-12 px-4 py-16 sm:px-6 lg:grid-cols-2 lg:items-center lg:py-24">
            <div>
              <p className="landing-fade-up text-xs font-semibold uppercase tracking-[0.2em] text-matte-sage-dark">
                Ultimate Exam Helper
              </p>
              <h1 className="landing-fade-up landing-delay-1 mt-4 font-landing text-4xl font-semibold leading-tight tracking-tight text-matte-charcoal sm:text-5xl lg:text-[2.75rem]">
                Study Smart. Score Better.
              </h1>
              <p className="landing-fade-up landing-delay-2 mt-5 max-w-lg text-lg leading-relaxed text-matte-charcoal-soft">
                Plan your revision, practice with focus, and track progress in a distraction-free space—built for students who
                want clarity, not clutter.
              </p>
              <div className="landing-fade-up landing-delay-3 mt-8 flex flex-wrap gap-3">
                <Link
                  to="/register"
                  className="inline-flex rounded-2xl bg-matte-terracotta px-6 py-3 text-sm font-semibold text-white transition hover:scale-[1.02] hover:bg-matte-terracotta-hover active:scale-[0.99]"
                >
                  Get started
                </Link>
                <a
                  href="#features"
                  className="inline-flex rounded-2xl border border-matte-border-strong bg-matte-cream px-6 py-3 text-sm font-semibold text-matte-charcoal transition hover:scale-[1.02] hover:border-matte-charcoal-soft hover:bg-matte-cream-dark active:scale-[0.99]"
                >
                  Explore features
                </a>
              </div>
            </div>
            <div className="landing-fade-up landing-delay-4">
              <HeroIllustration />
            </div>
          </div>
        </section>

        {/* Features */}
        <section id="features" className="scroll-mt-14 border-b border-matte-border py-16 sm:py-20">
          <div className="mx-auto max-w-6xl px-4 sm:px-6">
            <h2 className="font-landing text-3xl font-semibold text-matte-charcoal">Everything you need to prepare</h2>
            <p className="mt-3 max-w-2xl text-matte-charcoal-soft">
              Matte cards, soft structure, and tools that respect your attention.
            </p>
            <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {features.map((f) => (
                <article
                  key={f.title}
                  className="rounded-2xl border border-matte-border bg-matte-paper p-6 shadow-matte transition hover:scale-[1.02] hover:shadow-matte-md"
                >
                  <div className="flex h-11 w-11 items-center justify-center rounded-xl border border-matte-border bg-matte-cream text-matte-sage-dark">
                    <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden>
                      {f.icon}
                    </svg>
                  </div>
                  <h3 className="mt-4 font-landing text-lg font-semibold text-matte-charcoal">{f.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-matte-charcoal-soft">{f.desc}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        {/* Dashboard preview */}
        <section id="preview" className="scroll-mt-14 border-b border-matte-border bg-matte-cream-dark/40 py-16 sm:py-20">
          <div className="mx-auto max-w-6xl px-4 sm:px-6">
            <h2 className="font-landing text-3xl font-semibold text-matte-charcoal">Dashboard preview</h2>
            <p className="mt-3 max-w-xl text-matte-charcoal-soft">A glance at subjects, progress, and what is coming next.</p>
            <div className="mt-10 overflow-hidden rounded-3xl border border-matte-border bg-matte-paper shadow-matte-md">
              <div className="border-b border-matte-border bg-matte-cream px-5 py-4">
                <div className="h-3 w-28 rounded-full bg-matte-border-strong/70" />
              </div>
              <div className="grid gap-6 p-5 sm:grid-cols-2 lg:grid-cols-3">
                <div className="rounded-2xl border border-matte-border bg-matte-cream p-4">
                  <p className="text-xs font-semibold uppercase tracking-wider text-matte-sage-dark">Subjects</p>
                  <ul className="mt-3 space-y-2 text-sm text-matte-charcoal">
                    <li className="flex justify-between rounded-lg bg-matte-paper px-3 py-2">
                      <span>Organic Chemistry</span>
                    </li>
                    <li className="flex justify-between rounded-lg bg-matte-paper px-3 py-2">
                      <span>Modern History</span>
                    </li>
                    <li className="flex justify-between rounded-lg bg-matte-paper px-3 py-2">
                      <span>Calculus II</span>
                    </li>
                  </ul>
                </div>
                <div className="rounded-2xl border border-matte-border bg-matte-cream p-4 sm:col-span-1 lg:col-span-2">
                  <p className="text-xs font-semibold uppercase tracking-wider text-matte-sage-dark">Progress</p>
                  <div className="mt-4 space-y-4">
                    {[
                      { label: 'Unit 4 — complete', pct: 78, tone: 'bg-matte-sage' },
                      { label: 'Practice set B', pct: 45, tone: 'bg-matte-terracotta-muted' },
                      { label: 'Revision deck', pct: 92, tone: 'bg-matte-mustard' },
                    ].map((row) => (
                      <div key={row.label}>
                        <div className="flex justify-between text-sm text-matte-charcoal">
                          <span>{row.label}</span>
                          <span className="text-matte-charcoal-soft">{row.pct}%</span>
                        </div>
                        <div className="mt-2 h-2.5 overflow-hidden rounded-full bg-matte-border">
                          <div className={`h-full rounded-full ${row.tone}`} style={{ width: `${row.pct}%` }} />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
              <div className="border-t border-matte-border bg-matte-cream px-5 py-4">
                <p className="text-xs font-semibold uppercase tracking-wider text-matte-mustard">Upcoming exams</p>
                <div className="mt-3 flex flex-wrap gap-2">
                  <span className="rounded-xl border border-matte-border bg-matte-paper px-3 py-1.5 text-xs font-medium text-matte-charcoal">
                    May 12 — Data Structures
                  </span>
                  <span className="rounded-xl border border-matte-border bg-matte-paper px-3 py-1.5 text-xs font-medium text-matte-charcoal">
                    May 18 — Cell Biology
                  </span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Testimonials */}
        <section id="testimonials" className="py-16 sm:py-20">
          <div className="mx-auto max-w-6xl px-4 sm:px-6">
            <h2 className="font-landing text-3xl font-semibold text-matte-charcoal">What students say</h2>
            <p className="mt-3 text-matte-charcoal-soft">Short, honest feedback—no loud marketing.</p>
            <div className="mt-10 grid gap-6 md:grid-cols-3">
              {testimonials.map((t) => (
                <blockquote
                  key={t.name}
                  className="rounded-2xl border border-matte-border bg-matte-paper p-6 transition hover:scale-[1.01]"
                >
                  <p className="text-sm leading-relaxed text-matte-charcoal">&ldquo;{t.quote}&rdquo;</p>
                  <footer className="mt-4 border-t border-matte-border pt-4">
                    <p className="text-sm font-semibold text-matte-charcoal">{t.name}</p>
                    <p className="text-xs text-matte-charcoal-soft">{t.role}</p>
                  </footer>
                </blockquote>
              ))}
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-matte-border bg-matte-charcoal text-matte-cream">
        <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
          <div className="flex flex-col gap-8 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <p className="font-landing text-lg font-semibold text-matte-cream">Ultimate Exam Helper</p>
              <p className="mt-2 max-w-xs text-sm text-matte-border-strong">Calm tools for serious students.</p>
            </div>
            <div className="flex flex-wrap gap-8 text-sm">
              <div>
                <p className="font-semibold text-matte-cream">Product</p>
                <ul className="mt-2 space-y-2 text-matte-border-strong">
                  <li>
                    <a href="#features" className="transition hover:text-matte-cream">
                      Features
                    </a>
                  </li>
                  <li>
                    <Link to="/register" className="transition hover:text-matte-cream">
                      Create account
                    </Link>
                  </li>
                </ul>
              </div>
              <div>
                <p className="font-semibold text-matte-cream">Account</p>
                <ul className="mt-2 space-y-2 text-matte-border-strong">
                  <li>
                    <Link to="/login" className="transition hover:text-matte-cream">
                      Sign in
                    </Link>
                  </li>
                </ul>
              </div>
            </div>
          </div>
          <p className="mt-10 border-t border-matte-charcoal-soft/30 pt-8 text-center text-xs text-matte-border-strong">
            © {new Date().getFullYear()} Ultimate Exam Helper. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}

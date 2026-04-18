import { NavLink } from 'react-router-dom';

const links = [
  { to: '/dashboard', label: 'Dashboard', icon: 'M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6' },
  { to: '/upload', label: 'Upload', icon: 'M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12' },
  { to: '/flashcards', label: 'Flashcards', icon: 'M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10' },
  { to: '/quiz', label: 'Quiz', icon: 'M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z' },
  { to: '/study-plan', label: 'Study Plan', icon: 'M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z' },
  { to: '/progress', label: 'Progress', icon: 'M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z' },
  { to: '/settings', label: 'Settings', icon: 'M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4' },
];

export default function Sidebar({ open, onClose }) {
  return (
    <>
      <div
        className={`fixed inset-0 z-30 bg-matte-charcoal/40 transition-opacity lg:hidden ${
          open ? 'opacity-100' : 'pointer-events-none opacity-0'
        }`}
        onClick={onClose}
        aria-hidden="true"
      />
      <aside
        className={`fixed inset-y-0 left-0 z-40 w-64 transform border-r border-matte-border bg-matte-paper transition-transform dark:border-matte-night-border dark:bg-matte-night-card lg:static lg:translate-x-0 ${
          open ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex h-full flex-col pt-14 lg:pt-0">
          <div className="hidden h-14 items-center border-b border-matte-border px-4 dark:border-matte-night-border lg:flex">
            <span className="font-landing text-sm font-semibold text-matte-charcoal-soft dark:text-matte-border-strong">Study hub</span>
          </div>
          <nav className="flex-1 space-y-1 p-3">
            {links.map((l) => (
              <NavLink
                key={l.to}
                to={l.to}
                end={l.to === '/dashboard'}
                onClick={() => onClose?.()}
                className={({ isActive }) =>
                  `flex items-center gap-3 rounded-2xl px-3 py-2.5 text-sm font-medium transition hover:scale-[1.01] ${
                    isActive
                      ? 'bg-matte-terracotta text-white shadow-matte dark:bg-matte-terracotta'
                      : 'text-matte-charcoal-soft hover:bg-matte-cream-dark dark:text-matte-border-strong dark:hover:bg-matte-night-elevated'
                  }`
                }
              >
                <svg className="h-5 w-5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={l.icon} />
                </svg>
                {l.label}
              </NavLink>
            ))}
          </nav>
          <p className="border-t border-matte-border p-4 text-xs text-matte-charcoal-soft dark:border-matte-night-border dark:text-matte-border-strong">
            Ultimate Exam Helper — study calm, stay sharp.
          </p>
        </div>
      </aside>
    </>
  );
}

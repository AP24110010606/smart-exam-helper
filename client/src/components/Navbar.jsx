import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import UserAvatar from './UserAvatar';

export default function Navbar({ onMenuClick }) {
  const { user, logout } = useAuth();
  const { dark, toggle } = useTheme();

  return (
    <header className="sticky top-0 z-40 border-b border-matte-border bg-matte-paper dark:border-matte-night-border dark:bg-matte-night-card">
      <div className="flex h-14 items-center justify-between gap-4 px-4 lg:px-6">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={onMenuClick}
            className="rounded-xl p-2 text-matte-charcoal-soft transition hover:bg-matte-cream-dark dark:text-matte-border-strong dark:hover:bg-matte-night-elevated lg:hidden"
            aria-label="Open menu"
          >
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
          <Link
            to="/dashboard"
            className="font-landing text-lg font-semibold tracking-tight text-matte-terracotta dark:text-matte-terracotta-muted"
          >
            Ultimate Exam Helper
          </Link>
        </div>

        <div className="flex items-center gap-2 sm:gap-3">
          <button
            type="button"
            onClick={toggle}
            className="rounded-xl border border-matte-border-strong bg-matte-cream px-3 py-1.5 text-sm font-medium text-matte-charcoal transition hover:bg-matte-cream-dark dark:border-matte-night-border dark:bg-matte-night-elevated dark:text-matte-cream dark:hover:bg-matte-charcoal"
          >
            {dark ? 'Light' : 'Dark'}
          </button>
          {user && (
            <>
              <Link
                to="/settings"
                className="hidden items-center gap-2 rounded-xl border border-matte-border-strong bg-matte-cream px-2 py-1 pr-3 text-sm font-medium text-matte-charcoal transition hover:bg-matte-cream-dark dark:border-matte-night-border dark:bg-matte-night-elevated dark:text-matte-cream dark:hover:bg-matte-charcoal sm:flex"
              >
                <UserAvatar user={user} size={28} />
                <span className="max-w-[120px] truncate">Settings</span>
              </Link>
              <Link
                to="/settings"
                className="flex rounded-xl border border-matte-border-strong bg-matte-cream p-1 transition hover:bg-matte-cream-dark dark:border-matte-night-border dark:bg-matte-night-elevated sm:hidden"
                aria-label="Settings"
              >
                <UserAvatar user={user} size={32} />
              </Link>
              <span className="hidden text-sm text-matte-charcoal-soft dark:text-matte-border-strong md:inline">
                Hi, <span className="font-medium text-matte-charcoal dark:text-matte-cream">{user.name}</span>
              </span>
            </>
          )}
          {user && (
            <button
              type="button"
              onClick={logout}
              className="rounded-xl bg-matte-charcoal px-3 py-1.5 text-sm font-medium text-matte-cream transition hover:bg-matte-charcoal-soft dark:bg-matte-terracotta dark:hover:bg-matte-terracotta-hover"
            >
              Log out
            </button>
          )}
        </div>
      </div>
    </header>
  );
}

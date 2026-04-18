import { Link } from 'react-router-dom';

export default function StatCard({ title, value, hint, icon, to }) {
  const content = (
    <div className="flex items-start justify-between gap-3">
      <div>
        <p className="text-sm font-medium text-matte-charcoal-soft dark:text-matte-border-strong">{title}</p>
        <p className="mt-1 font-landing text-2xl font-semibold text-matte-charcoal dark:text-matte-cream">{value}</p>
        {hint && <p className="mt-1 text-xs text-matte-charcoal-soft dark:text-matte-border-strong">{hint}</p>}
      </div>
      {icon && (
        <div className="rounded-xl border border-matte-border bg-matte-cream p-3 text-matte-sage-dark transition group-hover:scale-105 dark:border-matte-night-border dark:bg-matte-night-elevated dark:text-matte-sage-muted">
          {icon}
        </div>
      )}
    </div>
  );

  const className =
    'group rounded-2xl border border-matte-border bg-matte-paper p-5 shadow-matte transition hover:scale-[1.02] hover:border-matte-border-strong dark:border-matte-night-border dark:bg-matte-night-card dark:shadow-none dark:hover:border-matte-charcoal-soft ' +
    (to ? 'cursor-pointer focus:outline-none focus:ring-2 focus:ring-matte-terracotta' : '');

  if (to) {
    return (
      <Link to={to} className={className}>
        {content}
      </Link>
    );
  }

  return <div className={className}>{content}</div>;
}

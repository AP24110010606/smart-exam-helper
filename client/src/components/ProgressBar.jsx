/**
 * Reusable progress bar (0–100). Flat matte fill — no gradients.
 */
export default function ProgressBar({ value, label }) {
  const pct = Math.min(100, Math.max(0, Number(value) || 0));
  return (
    <div className="w-full">
      {label && (
        <div className="mb-1 flex justify-between text-sm">
          <span className="text-matte-charcoal-soft dark:text-matte-border-strong">{label}</span>
          <span className="font-medium text-matte-charcoal dark:text-matte-cream">{pct}%</span>
        </div>
      )}
      <div className="h-2.5 w-full overflow-hidden rounded-full bg-matte-border dark:bg-matte-night-border">
        <div
          className="h-full rounded-full bg-matte-sage transition-all duration-500 ease-out dark:bg-matte-sage-muted"
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
}

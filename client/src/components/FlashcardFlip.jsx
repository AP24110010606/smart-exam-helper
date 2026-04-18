import { useState } from 'react';

/**
 * Flashcard with CSS 3D flip — matte surfaces only (no gradients).
 */
export default function FlashcardFlip({ question, answer, difficulty, onDifficulty }) {
  const [flipped, setFlipped] = useState(false);

  return (
    <div className="w-full max-w-lg perspective-1000">
      <div
        role="button"
        tabIndex={0}
        onClick={() => setFlipped((f) => !f)}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            setFlipped((f) => !f);
          }
        }}
        className="relative min-h-[220px] cursor-pointer rounded-2xl shadow-matte transition-transform duration-300 hover:scale-[1.01] dark:shadow-none"
      >
        <div
          className={`relative h-full min-h-[220px] w-full transform-style-3d transition-transform duration-500 ease-in-out ${
            flipped ? 'rotate-y-180' : ''
          }`}
        >
          <div className="absolute inset-0 backface-hidden rounded-2xl border border-matte-border bg-matte-paper p-6 dark:border-matte-night-border dark:bg-matte-night-card">
            <p className="text-xs font-semibold uppercase tracking-wider text-matte-terracotta dark:text-matte-terracotta-muted">Question</p>
            <p className="mt-3 text-lg font-medium leading-relaxed text-matte-charcoal dark:text-matte-cream">{question}</p>
            <p className="absolute bottom-4 left-6 right-6 text-center text-xs text-matte-charcoal-soft dark:text-matte-border-strong">
              Tap to reveal answer
            </p>
          </div>
          <div className="absolute inset-0 rotate-y-180 backface-hidden rounded-2xl border border-matte-sage-muted bg-matte-cream-dark p-6 dark:border-matte-sage-dark dark:bg-matte-night-elevated">
            <p className="text-xs font-semibold uppercase tracking-wider text-matte-sage-dark dark:text-matte-sage-muted">Answer</p>
            <p className="mt-3 text-lg leading-relaxed text-matte-charcoal dark:text-matte-cream">{answer}</p>
            <p className="absolute bottom-4 left-6 right-6 text-center text-xs text-matte-charcoal-soft dark:text-matte-border-strong">
              Tap to flip back
            </p>
          </div>
        </div>
      </div>

      <div className="mt-4 flex flex-wrap items-center justify-center gap-2">
        <span className="text-xs text-matte-charcoal-soft dark:text-matte-border-strong">Rate:</span>
        {['easy', 'medium', 'hard'].map((d) => (
          <button
            key={d}
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onDifficulty?.(d);
            }}
            className={`rounded-full px-3 py-1 text-xs font-semibold capitalize transition hover:scale-[1.02] ${
              difficulty === d
                ? 'bg-matte-terracotta text-white dark:bg-matte-terracotta-muted'
                : 'border border-matte-border bg-matte-cream text-matte-charcoal hover:bg-matte-cream-dark dark:border-matte-night-border dark:bg-matte-night-elevated dark:text-matte-cream dark:hover:bg-matte-charcoal'
            }`}
          >
            {d}
          </button>
        ))}
      </div>
    </div>
  );
}

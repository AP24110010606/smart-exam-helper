import { useEffect, useState } from 'react';
import api from '../api/client';
import ProgressBar from '../components/ProgressBar';

export default function ProgressTracker() {
  const [completed, setCompleted] = useState([]);
  const [pending, setPending] = useState([]);
  const [topicComplete, setTopicComplete] = useState('');
  const [topicPending, setTopicPending] = useState('');
  const [msg, setMsg] = useState('');
  const [loading, setLoading] = useState(true);

  async function load() {
    const { data } = await api.get('/api/progress');
    setCompleted(data.completedTopics || []);
    setPending(data.pendingTopics || []);
  }

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        await load();
      } catch {
        if (!cancelled) setMsg('Could not load progress');
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const total = completed.length + pending.length;
  const pct = total === 0 ? 0 : Math.round((completed.length / total) * 100);

  async function save(nextCompleted, nextPending) {
    setMsg('');
    try {
      await api.patch('/api/progress', {
        completedTopics: nextCompleted,
        pendingTopics: nextPending,
      });
      setCompleted(nextCompleted);
      setPending(nextPending);
    } catch {
      setMsg('Save failed');
    }
  }

  function addCompleted(ev) {
    ev.preventDefault();
    const t = topicComplete.trim();
    if (!t) return;
    const nextPending = pending.filter((x) => x.toLowerCase() !== t.toLowerCase());
    if (completed.includes(t)) return;
    save([...completed, t], nextPending);
    setTopicComplete('');
  }

  function addPending(ev) {
    ev.preventDefault();
    const t = topicPending.trim();
    if (!t) return;
    if (pending.includes(t) || completed.includes(t)) return;
    save(completed, [...pending, t]);
    setTopicPending('');
  }

  function removeCompleted(t) {
    save(
      completed.filter((x) => x !== t),
      pending
    );
  }

  function removePending(t) {
    save(
      completed,
      pending.filter((x) => x !== t)
    );
  }

  function markDone(t) {
    save(
      [...completed, t],
      pending.filter((x) => x !== t)
    );
  }

  return (
    <div className="mx-auto max-w-4xl space-y-8">
      <div>
        <h1 className="font-landing text-3xl font-semibold text-matte-charcoal dark:text-matte-cream">Progress tracker</h1>
        <p className="mt-1 text-matte-charcoal-soft dark:text-matte-border-strong">Track topics you have finished vs what is still pending.</p>
      </div>

      <div className="rounded-2xl border border-matte-border bg-matte-paper p-6 shadow-matte dark:border-matte-night-border dark:bg-matte-night-card dark:shadow-none">
        <h2 className="font-landing text-lg font-semibold text-matte-charcoal dark:text-matte-cream">Summary</h2>
        {loading ? (
          <div className="flex justify-center py-8">
            <div className="h-8 w-8 animate-spin rounded-full border-2 border-matte-terracotta border-t-transparent" />
          </div>
        ) : (
          <div className="mt-4 max-w-xl space-y-2">
            <ProgressBar value={pct} label="Topics completed" />
            <p className="text-sm text-matte-charcoal-soft dark:text-matte-border-strong">
              {completed.length} completed · {pending.length} pending
            </p>
          </div>
        )}
      </div>

      {msg && (
        <div className="rounded-xl bg-matte-error-bg px-3 py-2 text-sm text-matte-error dark:bg-matte-terracotta/15 dark:text-matte-mustard-soft">
          {msg}
        </div>
      )}

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="rounded-2xl border border-matte-border bg-matte-paper p-6 shadow-matte dark:border-matte-night-border dark:bg-matte-night-card dark:shadow-none">
          <h3 className="font-semibold text-matte-sage-dark dark:text-matte-sage-muted">Completed topics</h3>
          <form onSubmit={addCompleted} className="mt-3 flex gap-2">
            <input
              value={topicComplete}
              onChange={(e) => setTopicComplete(e.target.value)}
              placeholder="e.g. Cell division"
              className="flex-1 rounded-xl border border-matte-border-strong px-3 py-2 text-matte-charcoal dark:border-matte-night-border dark:bg-matte-night-elevated dark:text-matte-cream"
            />
            <button
              type="submit"
              className="rounded-xl bg-matte-sage px-3 py-2 text-sm font-semibold text-white transition hover:bg-matte-sage-dark hover:scale-[1.02] active:scale-[0.99]"
            >
              Add
            </button>
          </form>
          <ul className="mt-4 space-y-2">
            {completed.map((t) => (
              <li
                key={t}
                className="flex items-center justify-between rounded-xl border border-matte-sage-muted/50 bg-matte-success-bg px-3 py-2 text-sm dark:border-matte-sage-dark dark:bg-matte-sage-dark/20"
              >
                <span className="text-matte-charcoal dark:text-matte-cream">{t}</span>
                <button
                  type="button"
                  onClick={() => removeCompleted(t)}
                  className="text-xs text-matte-error hover:underline dark:text-matte-mustard-soft"
                >
                  Remove
                </button>
              </li>
            ))}
            {completed.length === 0 && <li className="text-sm text-matte-charcoal-soft dark:text-matte-border-strong">None yet.</li>}
          </ul>
        </div>

        <div className="rounded-2xl border border-matte-border bg-matte-paper p-6 shadow-matte dark:border-matte-night-border dark:bg-matte-night-card dark:shadow-none">
          <h3 className="font-semibold text-matte-mustard dark:text-matte-mustard-soft">Pending topics</h3>
          <form onSubmit={addPending} className="mt-3 flex gap-2">
            <input
              value={topicPending}
              onChange={(e) => setTopicPending(e.target.value)}
              placeholder="e.g. Organic chemistry"
              className="flex-1 rounded-xl border border-matte-border-strong px-3 py-2 text-matte-charcoal dark:border-matte-night-border dark:bg-matte-night-elevated dark:text-matte-cream"
            />
            <button
              type="submit"
              className="rounded-xl bg-matte-mustard px-3 py-2 text-sm font-semibold text-matte-charcoal transition hover:brightness-95 hover:scale-[1.02] active:scale-[0.99]"
            >
              Add
            </button>
          </form>
          <ul className="mt-4 space-y-2">
            {pending.map((t) => (
              <li
                key={t}
                className="flex items-center justify-between rounded-xl border border-matte-mustard/40 bg-matte-cream-dark px-3 py-2 text-sm dark:border-matte-mustard/30 dark:bg-matte-night-elevated"
              >
                <span className="text-matte-charcoal dark:text-matte-cream">{t}</span>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => markDone(t)}
                    className="text-xs font-semibold text-matte-terracotta hover:underline dark:text-matte-terracotta-muted"
                  >
                    Done
                  </button>
                  <button
                    type="button"
                    onClick={() => removePending(t)}
                    className="text-xs text-matte-error hover:underline dark:text-matte-mustard-soft"
                  >
                    Remove
                  </button>
                </div>
              </li>
            ))}
            {pending.length === 0 && (
              <li className="text-sm text-matte-charcoal-soft dark:text-matte-border-strong">Nothing pending.</li>
            )}
          </ul>
        </div>
      </div>
    </div>
  );
}

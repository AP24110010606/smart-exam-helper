import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/client';
import StatCard from '../components/StatCard';
import ProgressBar from '../components/ProgressBar';

export default function Dashboard() {
  const [stats, setStats] = useState({ materials: 0, flashcards: 0, plans: 0, progressPct: 0, dueCards: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const [m, f, s, p, d] = await Promise.all([
          api.get('/api/materials'),
          api.get('/api/flashcards'),
          api.get('/api/studyplans'),
          api.get('/api/progress'),
          api.get('/api/flashcards/due'),
        ]);
        const completed = p.data.completedTopics?.length || 0;
        const pending = p.data.pendingTopics?.length || 0;
        const total = completed + pending;
        const progressPct = total === 0 ? 0 : Math.round((completed / total) * 100);
        if (!cancelled) {
          setStats({
            materials: m.data.length,
            flashcards: f.data.length,
            plans: s.data.length,
            progressPct,
            dueCards: d.data.length,
          });
        }
      } catch {
        if (!cancelled) setStats({ materials: 0, flashcards: 0, plans: 0, progressPct: 0, dueCards: 0 });
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <div className="mx-auto max-w-6xl space-y-8">
      <div>
        <h1 className="font-landing text-3xl font-semibold text-matte-charcoal dark:text-matte-cream">Dashboard</h1>
        <p className="mt-1 text-matte-charcoal-soft dark:text-matte-border-strong">Your study snapshot at a glance.</p>
      </div>

      {loading ? (
        <div className="flex justify-center py-12">
          <div className="h-10 w-10 animate-spin rounded-full border-2 border-matte-terracotta border-t-transparent" />
        </div>
      ) : (
        <>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <StatCard
              title="Materials"
              value={stats.materials}
              hint="Uploaded notes & files"
              to="/upload"
              icon={
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                </svg>
              }
            />
            <StatCard
              title="Flashcards"
              value={stats.flashcards}
              hint="Practice deck size"
              to="/flashcards"
              icon={
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                </svg>
              }
            />
            <StatCard
              title="Due for Review"
              value={stats.dueCards}
              hint="Cards ready to study"
              to="/flashcards"
              icon={
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              }
            />
            <StatCard
              title="Study plans"
              value={stats.plans}
              hint="Upcoming exams tracked"
              to="/study-plan"
              icon={
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              }
            />
          </div>

          <div className="rounded-2xl border border-matte-border bg-matte-paper p-6 shadow-matte dark:border-matte-night-border dark:bg-matte-night-card dark:shadow-none">
            <h2 className="font-landing text-lg font-semibold text-matte-charcoal dark:text-matte-cream">Overall progress</h2>
            <p className="mt-1 text-sm text-matte-charcoal-soft dark:text-matte-border-strong">Based on topics you marked in Progress Tracker.</p>
            <div className="mt-4 max-w-xl">
              <ProgressBar value={stats.progressPct} />
            </div>
            <div className="mt-6 flex flex-wrap gap-3">
              <Link
                to="/upload"
                className="rounded-xl bg-matte-terracotta px-4 py-2 text-sm font-semibold text-white transition hover:bg-matte-terracotta-hover hover:scale-[1.02] active:scale-[0.99]"
              >
                Upload material
              </Link>
              <Link
                to="/flashcards"
                className="rounded-xl border border-matte-border-strong bg-matte-cream px-4 py-2 text-sm font-semibold text-matte-charcoal transition hover:bg-matte-cream-dark dark:border-matte-night-border dark:bg-matte-night-elevated dark:text-matte-cream dark:hover:bg-matte-charcoal"
              >
                Review flashcards
              </Link>
              <Link
                to="/quiz"
                className="rounded-xl border border-matte-border-strong bg-matte-cream px-4 py-2 text-sm font-semibold text-matte-charcoal transition hover:bg-matte-cream-dark dark:border-matte-night-border dark:bg-matte-night-elevated dark:text-matte-cream dark:hover:bg-matte-charcoal"
              >
                Take a quiz
              </Link>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

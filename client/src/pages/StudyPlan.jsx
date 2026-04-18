import { useEffect, useMemo, useState } from 'react';
import api from '../api/client';

const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

function startOfMonth(d) {
  return new Date(d.getFullYear(), d.getMonth(), 1);
}

function buildMonthGrid(viewMonth) {
  const first = startOfMonth(viewMonth);
  const startPad = first.getDay();
  const year = first.getFullYear();
  const month = first.getMonth();
  const lastDate = new Date(year, month + 1, 0).getDate();
  const cells = [];
  for (let i = 0; i < startPad; i++) cells.push({ type: 'empty', key: `e-${i}` });
  for (let day = 1; day <= lastDate; day++) {
    cells.push({ type: 'day', date: new Date(year, month, day), key: `d-${day}` });
  }
  while (cells.length % 7 !== 0) cells.push({ type: 'empty', key: `t-${cells.length}` });
  return cells;
}

export default function StudyPlan() {
  const [plans, setPlans] = useState([]);
  const [viewMonth, setViewMonth] = useState(() => new Date());
  const [selectedDate, setSelectedDate] = useState(() => new Date());
  const [subject, setSubject] = useState('');
  const [examDate, setExamDate] = useState('');
  const [dailyStudyHours, setDailyStudyHours] = useState('2');
  const [errors, setErrors] = useState({});
  const [msg, setMsg] = useState('');
  const [loading, setLoading] = useState(true);

  async function load() {
    const { data } = await api.get('/api/studyplans');
    setPlans(data);
  }

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        await load();
      } catch {
        if (!cancelled) setMsg('Could not load study plans');
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const examMap = useMemo(() => {
    const m = new Map();
    plans.forEach((p) => {
      const d = new Date(p.examDate);
      const key = `${d.getFullYear()}-${d.getMonth()}-${d.getDate()}`;
      const list = m.get(key) || [];
      list.push(p);
      m.set(key, list);
    });
    return m;
  }, [plans]);

  const selectedKey = selectedDate
    ? `${selectedDate.getFullYear()}-${selectedDate.getMonth()}-${selectedDate.getDate()}`
    : null;
  const selectedPlans = selectedKey ? examMap.get(selectedKey) || [] : [];
  const selectedHours = selectedPlans.reduce((sum, plan) => sum + Number(plan.dailyStudyHours), 0);

  const grid = useMemo(() => buildMonthGrid(viewMonth), [viewMonth]);

  function validateForm() {
    const e = {};
    if (!subject.trim()) e.subject = 'Subject is required';
    if (!examDate) e.examDate = 'Exam date is required';
    const h = Number(dailyStudyHours);
    if (Number.isNaN(h) || h < 0.5 || h > 24) e.dailyStudyHours = 'Hours must be 0.5–24';
    setErrors(e);
    return Object.keys(e).length === 0;
  }

  async function handleSubmit(ev) {
    ev.preventDefault();
    setMsg('');
    if (!validateForm()) return;
    try {
      await api.post('/api/studyplans', {
        subject: subject.trim(),
        examDate,
        dailyStudyHours: Number(dailyStudyHours),
      });
      setSubject('');
      setExamDate('');
      setDailyStudyHours('2');
      await load();
    } catch (err) {
      setMsg(err.response?.data?.message || 'Could not save plan');
    }
  }

  async function handleDelete(id) {
    if (!window.confirm('Delete this study plan?')) return;
    try {
      await api.delete(`/api/studyplans/${id}`);
      await load();
    } catch {
      setMsg('Delete failed');
    }
  }

  const label = viewMonth.toLocaleString('default', { month: 'long', year: 'numeric' });

  return (
    <div className="mx-auto max-w-6xl space-y-8">
      <div>
        <h1 className="font-landing text-3xl font-semibold text-matte-charcoal dark:text-matte-cream">Study plan</h1>
        <p className="mt-1 text-matte-charcoal-soft dark:text-matte-border-strong">
          Schedule subjects, exam dates, and daily hours. Calendar shows exam milestones.
        </p>
      </div>

      <div className="grid gap-8 lg:grid-cols-2">
        <form
          onSubmit={handleSubmit}
          className="h-fit rounded-2xl border border-matte-border bg-matte-paper p-6 shadow-matte dark:border-matte-night-border dark:bg-matte-night-card dark:shadow-none"
        >
          <h2 className="font-landing text-lg font-semibold text-matte-charcoal dark:text-matte-cream">New plan</h2>
          {msg && (
            <div className="mt-3 rounded-xl bg-matte-error-bg px-3 py-2 text-sm text-matte-error dark:bg-matte-terracotta/15 dark:text-matte-mustard-soft">
              {msg}
            </div>
          )}
          <div className="mt-4 space-y-4">
            <div>
              <label className="block text-sm font-medium text-matte-charcoal dark:text-matte-cream">Subject</label>
              <input
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                className="mt-1 w-full rounded-xl border border-matte-border-strong bg-matte-paper px-3 py-2 text-matte-charcoal dark:border-matte-night-border dark:bg-matte-night-elevated dark:text-matte-cream"
              />
              {errors.subject && <p className="mt-1 text-xs text-matte-error">{errors.subject}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium text-matte-charcoal dark:text-matte-cream">Exam date</label>
              <input
                type="date"
                value={examDate}
                onChange={(e) => setExamDate(e.target.value)}
                className="mt-1 w-full rounded-xl border border-matte-border-strong bg-matte-paper px-3 py-2 text-matte-charcoal dark:border-matte-night-border dark:bg-matte-night-elevated dark:text-matte-cream"
              />
              {errors.examDate && <p className="mt-1 text-xs text-matte-error">{errors.examDate}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium text-matte-charcoal dark:text-matte-cream">Daily study hours</label>
              <input
                type="number"
                step="0.5"
                min="0.5"
                max="24"
                value={dailyStudyHours}
                onChange={(e) => setDailyStudyHours(e.target.value)}
                className="mt-1 w-full rounded-xl border border-matte-border-strong bg-matte-paper px-3 py-2 text-matte-charcoal dark:border-matte-night-border dark:bg-matte-night-elevated dark:text-matte-cream"
              />
              {errors.dailyStudyHours && <p className="mt-1 text-xs text-matte-error">{errors.dailyStudyHours}</p>}
            </div>
          </div>
          <button
            type="submit"
            className="mt-6 w-full rounded-xl bg-matte-terracotta py-2.5 font-semibold text-white transition hover:bg-matte-terracotta-hover hover:scale-[1.01] active:scale-[0.99]"
          >
            Add plan
          </button>
        </form>

        <div className="rounded-2xl border border-matte-border bg-matte-paper p-6 shadow-matte dark:border-matte-night-border dark:bg-matte-night-card dark:shadow-none">
          <div className="flex items-center justify-between">
            <h2 className="font-landing text-lg font-semibold text-matte-charcoal dark:text-matte-cream">Calendar</h2>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setViewMonth(new Date(viewMonth.getFullYear(), viewMonth.getMonth() - 1, 1))}
                className="rounded-xl border border-matte-border-strong px-2 py-1 text-sm transition hover:bg-matte-cream-dark dark:border-matte-night-border dark:hover:bg-matte-night-elevated"
              >
                ←
              </button>
              <button
                type="button"
                onClick={() => setViewMonth(new Date(viewMonth.getFullYear(), viewMonth.getMonth() + 1, 1))}
                className="rounded-xl border border-matte-border-strong px-2 py-1 text-sm transition hover:bg-matte-cream-dark dark:border-matte-night-border dark:hover:bg-matte-night-elevated"
              >
                →
              </button>
            </div>
          </div>
          <p className="mt-1 text-sm font-medium text-matte-terracotta dark:text-matte-terracotta-muted">{label}</p>
          <div className="mt-4 grid grid-cols-7 gap-1 text-center text-xs font-semibold text-matte-charcoal-soft dark:text-matte-border-strong">
            {days.map((d) => (
              <div key={d} className="py-1">
                {d}
              </div>
            ))}
          </div>
          <div className="mt-1 grid grid-cols-7 gap-1">
            {grid.map((cell) => {
              if (cell.type === 'empty') return <div key={cell.key} className="aspect-square rounded-lg bg-transparent" />;
              const key = `${cell.date.getFullYear()}-${cell.date.getMonth()}-${cell.date.getDate()}`;
              const onDay = examMap.get(key);
              const isToday =
                new Date().toDateString() ===
                new Date(cell.date.getFullYear(), cell.date.getMonth(), cell.date.getDate()).toDateString();
              const isSelected =
                selectedDate &&
                selectedDate.toDateString() ===
                  new Date(cell.date.getFullYear(), cell.date.getMonth(), cell.date.getDate()).toDateString();
              return (
                <button
                  key={cell.key}
                  type="button"
                  onClick={() => setSelectedDate(cell.date)}
                  className={`flex aspect-square flex-col items-center justify-center rounded-xl border text-sm transition ${
                    onDay?.length
                      ? 'border-matte-terracotta bg-matte-cream-dark font-semibold text-matte-charcoal dark:border-matte-terracotta-muted dark:bg-matte-terracotta/20 dark:text-matte-cream'
                      : 'border-matte-border bg-matte-cream text-matte-charcoal dark:border-matte-night-border dark:bg-matte-night-elevated dark:text-matte-cream'
                  } ${isToday ? 'ring-2 ring-matte-mustard ring-offset-2 ring-offset-matte-paper dark:ring-offset-matte-night-card' : ''} ${
                    isSelected ? 'ring-2 ring-matte-terracotta ring-offset-2 ring-offset-matte-paper dark:ring-offset-matte-night-card' : ''
                  } cursor-pointer hover:-translate-y-px active:translate-y-0`}
                >
                  <span>{cell.date.getDate()}</span>
                  {onDay?.length ? (
                    <div className="mt-2 flex w-full flex-col gap-1 px-1">
                      {onDay.map((plan) => (
                        <span
                          key={plan._id}
                          className="truncate rounded-full bg-matte-terracotta/10 px-2 py-0.5 text-[10px] font-semibold text-matte-terracotta dark:bg-matte-terracotta/20 dark:text-matte-cream"
                        >
                          {plan.subject.slice(0, 3).toUpperCase()} · {plan.dailyStudyHours}h
                        </span>
                      ))}
                    </div>
                  ) : null}
                </button>
              );
            })}
          </div>
          <p className="mt-3 text-xs text-matte-charcoal-soft dark:text-matte-border-strong">
            Mustard ring = today. Terracotta fill = at least one exam.
          </p>
        </div>
      </div>

      <div className="rounded-2xl border border-matte-border bg-matte-paper p-6 shadow-matte dark:border-matte-night-border dark:bg-matte-night-card dark:shadow-none">
        <h2 className="font-landing text-lg font-semibold text-matte-charcoal dark:text-matte-cream">Daily plan</h2>
        <div className="mt-1 space-y-2 text-sm text-matte-charcoal-soft dark:text-matte-border-strong">
          <p>
            {selectedDate
              ? selectedDate.toLocaleDateString(undefined, {
                  weekday: 'long',
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                })
              : 'Select a date to view the plan.'}
          </p>
          {selectedDate && (
            <p className="font-medium text-matte-charcoal dark:text-matte-cream">
              Total daily study hours: {selectedHours} h
            </p>
          )}
        </div>
        {loading ? (
          <div className="flex justify-center py-8">
            <div className="h-8 w-8 animate-spin rounded-full border-2 border-matte-terracotta border-t-transparent" />
          </div>
        ) : selectedPlans.length === 0 ? (
          <p className="mt-4 text-matte-charcoal-soft dark:text-matte-border-strong">No plan for this date.</p>
        ) : (
          <ul className="mt-4 divide-y divide-matte-border dark:divide-matte-night-border">
            {selectedPlans.map((p) => (
              <li key={p._id} className="flex flex-wrap items-start justify-between gap-3 py-3">
                <div>
                  <p className="font-medium text-matte-charcoal dark:text-matte-cream">{p.subject}</p>
                  <p className="text-sm text-matte-charcoal-soft dark:text-matte-border-strong">
                    Exam: {new Date(p.examDate).toLocaleDateString()} · {p.dailyStudyHours} h/day
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => handleDelete(p._id)}
                  className="rounded-xl border border-matte-error/40 px-3 py-1 text-sm text-matte-error transition hover:bg-matte-error-bg dark:border-matte-terracotta/50 dark:text-matte-mustard-soft dark:hover:bg-matte-terracotta/10"
                >
                  Delete
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>

      <div className="rounded-2xl border border-matte-border bg-matte-paper p-6 shadow-matte dark:border-matte-night-border dark:bg-matte-night-card dark:shadow-none">
        <h2 className="font-landing text-lg font-semibold text-matte-charcoal dark:text-matte-cream">Your plans</h2>
        {loading ? (
          <div className="flex justify-center py-8">
            <div className="h-8 w-8 animate-spin rounded-full border-2 border-matte-terracotta border-t-transparent" />
          </div>
        ) : plans.length === 0 ? (
          <p className="mt-3 text-matte-charcoal-soft dark:text-matte-border-strong">No plans yet.</p>
        ) : (
          <ul className="mt-4 divide-y divide-matte-border dark:divide-matte-night-border">
            {plans.map((p) => (
              <li key={p._id} className="flex flex-wrap items-center justify-between gap-3 py-3 first:pt-0">
                <div>
                  <p className="font-medium text-matte-charcoal dark:text-matte-cream">{p.subject}</p>
                  <p className="text-sm text-matte-charcoal-soft dark:text-matte-border-strong">
                    Exam: {new Date(p.examDate).toLocaleDateString()} · {p.dailyStudyHours} h/day
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => handleDelete(p._id)}
                  className="rounded-xl border border-matte-error/40 px-3 py-1 text-sm text-matte-error transition hover:bg-matte-error-bg dark:border-matte-terracotta/50 dark:text-matte-mustard-soft dark:hover:bg-matte-terracotta/10"
                >
                  Delete
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

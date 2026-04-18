import { useEffect, useState } from 'react';
import api from '../api/client';
import FlashcardFlip from '../components/FlashcardFlip';

export default function FlashcardsPage() {
  const [materials, setMaterials] = useState([]);
  const [cards, setCards] = useState([]);
  const [index, setIndex] = useState(0);
  const [text, setText] = useState('');
  const [materialId, setMaterialId] = useState('');
  const [msg, setMsg] = useState('');
  const [ok, setOk] = useState('');
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);

  async function refresh() {
    const [m, f] = await Promise.all([api.get('/api/materials'), api.get('/api/flashcards')]);
    setMaterials(m.data);
    setCards(f.data);
    setIndex(0);
  }

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        await refresh();
      } catch {
        if (!cancelled) setMsg('Could not load data');
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  async function handleGenerate(ev) {
    ev.preventDefault();
    setMsg('');
    setOk('');
    if (!text.trim() && !materialId) {
      setMsg('Paste text or select a material (.txt works best for auto-read).');
      return;
    }
    setGenerating(true);
    try {
      const body = {};
      if (text.trim()) body.text = text;
      if (materialId) body.materialId = materialId;
      const { data } = await api.post('/api/flashcards/generate', body);
      setOk(`Created ${data.count} flashcards.`);
      setText('');
      await refresh();
    } catch (err) {
      setMsg(err.response?.data?.message || 'Generation failed');
    } finally {
      setGenerating(false);
    }
  }

  async function setDifficulty(id, difficulty) {
    try {
      const { data } = await api.patch(`/api/flashcards/${id}/difficulty`, { difficulty });
      setCards((prev) => prev.map((c) => (c._id === id ? data : c)));
    } catch {
      setMsg('Could not update difficulty');
    }
  }

  return (
    <div className="mx-auto max-w-4xl space-y-8">
      <div>
        <h1 className="font-landing text-3xl font-semibold text-matte-charcoal dark:text-matte-cream">Flashcards</h1>
        <p className="mt-1 text-matte-charcoal-soft dark:text-matte-border-strong">
          Generate cards from paragraphs (first line = question) or paired{' '}
          <code className="rounded-lg bg-matte-cream-dark px-1.5 py-0.5 text-matte-charcoal dark:bg-matte-night-elevated dark:text-matte-cream">Q:</code> /{' '}
          <code className="rounded-lg bg-matte-cream-dark px-1.5 py-0.5 text-matte-charcoal dark:bg-matte-night-elevated dark:text-matte-cream">A:</code> lines.
        </p>
      </div>

      <form
        onSubmit={handleGenerate}
        className="rounded-2xl border border-matte-border bg-matte-paper p-6 shadow-matte dark:border-matte-night-border dark:bg-matte-night-card dark:shadow-none"
      >
        {ok && (
          <div className="mb-4 rounded-xl bg-matte-success-bg px-3 py-2 text-sm text-matte-sage-dark dark:bg-matte-sage-dark/25 dark:text-matte-sage-muted">
            {ok}
          </div>
        )}
        {msg && (
          <div className="mb-4 rounded-xl bg-matte-error-bg px-3 py-2 text-sm text-matte-error dark:bg-matte-terracotta/15 dark:text-matte-mustard-soft">
            {msg}
          </div>
        )}
        <div className="grid gap-4 lg:grid-cols-2">
          <div className="lg:col-span-2">
            <label className="block text-sm font-medium text-matte-charcoal dark:text-matte-cream">Paste study text</label>
            <textarea
              value={text}
              onChange={(e) => setText(e.target.value)}
              rows={6}
              placeholder={'Q: What is photosynthesis?\nA: Process plants use to convert light to energy.\n\nSecond question line\nRest is answer...'}
              className="mt-1 w-full rounded-xl border border-matte-border-strong bg-matte-paper px-3 py-2 font-mono text-sm text-matte-charcoal outline-none transition focus:border-matte-terracotta focus:ring-2 focus:ring-matte-terracotta/25 dark:border-matte-night-border dark:bg-matte-night-elevated dark:text-matte-cream"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-matte-charcoal dark:text-matte-cream">Optional: material (.txt)</label>
            <select
              value={materialId}
              onChange={(e) => setMaterialId(e.target.value)}
              className="mt-1 w-full rounded-xl border border-matte-border-strong bg-matte-paper px-3 py-2 text-matte-charcoal dark:border-matte-night-border dark:bg-matte-night-elevated dark:text-matte-cream"
            >
              <option value="">— None —</option>
              {materials.map((m) => (
                <option key={m._id} value={m._id}>
                  {m.title} ({m.subject})
                </option>
              ))}
            </select>
          </div>
        </div>
        <button
          type="submit"
          disabled={generating}
          className="mt-4 rounded-xl bg-matte-terracotta px-6 py-2.5 font-semibold text-white transition hover:bg-matte-terracotta-hover hover:scale-[1.01] active:scale-[0.99] disabled:opacity-60"
        >
          {generating ? 'Generating…' : 'Generate flashcards'}
        </button>
      </form>

      <div className="rounded-2xl border border-matte-border bg-matte-paper p-6 shadow-matte dark:border-matte-night-border dark:bg-matte-night-card dark:shadow-none">
        <h2 className="font-landing text-lg font-semibold text-matte-charcoal dark:text-matte-cream">Viewer</h2>
        {loading ? (
          <div className="flex justify-center py-12">
            <div className="h-10 w-10 animate-spin rounded-full border-2 border-matte-terracotta border-t-transparent" />
          </div>
        ) : cards.length === 0 ? (
          <p className="mt-4 text-matte-charcoal-soft dark:text-matte-border-strong">No flashcards yet. Generate some above.</p>
        ) : (
          <>
            <p className="mt-1 text-sm text-matte-charcoal-soft dark:text-matte-border-strong">
              Card {index + 1} of {cards.length}
            </p>
            <div className="mt-6 flex flex-col items-center">
              <FlashcardFlip
                question={cards[index].question}
                answer={cards[index].answer}
                difficulty={cards[index].difficulty === 'unrated' ? null : cards[index].difficulty}
                onDifficulty={(d) => setDifficulty(cards[index]._id, d)}
              />
            </div>
            <div className="mt-6 flex flex-wrap justify-center gap-2">
              <button
                type="button"
                disabled={index <= 0}
                onClick={() => setIndex((i) => Math.max(0, i - 1))}
                className="rounded-xl border border-matte-border-strong bg-matte-cream px-4 py-2 text-sm font-medium text-matte-charcoal transition hover:bg-matte-cream-dark disabled:opacity-40 dark:border-matte-night-border dark:bg-matte-night-elevated dark:text-matte-cream dark:hover:bg-matte-charcoal"
              >
                Previous
              </button>
              <button
                type="button"
                disabled={index >= cards.length - 1}
                onClick={() => setIndex((i) => Math.min(cards.length - 1, i + 1))}
                className="rounded-xl bg-matte-charcoal px-4 py-2 text-sm font-medium text-matte-cream transition hover:bg-matte-charcoal-soft disabled:opacity-40 dark:bg-matte-terracotta dark:hover:bg-matte-terracotta-hover"
              >
                Next
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

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
  const [deletingCardId, setDeletingCardId] = useState('');
  const [useAI, setUseAI] = useState(true);
  const [cardCount, setCardCount] = useState(10);

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
      setMsg('Paste study text or select a material to generate flashcards.');
      return;
    }
    setGenerating(true);
    try {
      const body = { useAI, cardCount };
      if (text.trim()) body.text = text;
      if (materialId) body.materialId = materialId;
      const { data } = await api.post('/api/flashcards/generate', body);
      setOk(`✨ Created ${data.count} flashcards${useAI ? ' with AI!' : '.'}`);
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

  async function handleDeleteCard(id) {
    const confirmed = window.confirm('Delete this flashcard?');
    if (!confirmed) return;

    setMsg('');
    setOk('');
    setDeletingCardId(id);
    try {
      await api.delete(`/api/flashcards/${id}`);
      setCards((prev) => {
        const next = prev.filter((c) => c._id !== id);
        if (index >= next.length) {
          setIndex(Math.max(0, next.length - 1));
        }
        return next;
      });
      setOk('Flashcard removed.');
    } catch {
      setMsg('Could not delete flashcard.');
    } finally {
      setDeletingCardId('');
    }
  }

  return (
    <div className="mx-auto max-w-4xl space-y-8">
      <div>
        <h1 className="font-landing text-3xl font-semibold text-matte-charcoal dark:text-matte-cream">Flashcards</h1>
        <p className="mt-1 text-matte-charcoal-soft dark:text-matte-border-strong">
          Select a study material or paste text — AI will automatically generate meaningful Q&A flashcards from your content.
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
            <label className="block text-sm font-medium text-matte-charcoal dark:text-matte-cream">Paste study text <span className="text-matte-charcoal-soft dark:text-matte-border-strong">(or select a material below)</span></label>
            <textarea
              value={text}
              onChange={(e) => setText(e.target.value)}
              rows={6}
              placeholder={'Paste any study material here — notes, textbook excerpts, lecture content...\n\nThe AI will automatically identify key concepts and generate flashcards.'}
              className="mt-1 w-full rounded-xl border border-matte-border-strong bg-matte-paper px-3 py-2 font-mono text-sm text-matte-charcoal outline-none transition focus:border-matte-terracotta focus:ring-2 focus:ring-matte-terracotta/25 dark:border-matte-night-border dark:bg-matte-night-elevated dark:text-matte-cream"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-matte-charcoal dark:text-matte-cream">Select uploaded material</label>
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
          <div>
            <label className="block text-sm font-medium text-matte-charcoal dark:text-matte-cream">Number of cards</label>
            <select
              value={cardCount}
              onChange={(e) => setCardCount(Number(e.target.value))}
              className="mt-1 w-full rounded-xl border border-matte-border-strong bg-matte-paper px-3 py-2 text-matte-charcoal dark:border-matte-night-border dark:bg-matte-night-elevated dark:text-matte-cream"
            >
              <option value={5}>5 cards</option>
              <option value={10}>10 cards</option>
              <option value={15}>15 cards</option>
              <option value={20}>20 cards</option>
              <option value={25}>25 cards</option>
            </select>
          </div>
        </div>

        {/* AI Toggle & Generate Button */}
        <div className="mt-4 flex flex-wrap items-center gap-4">
          <button
            type="submit"
            disabled={generating}
            className="inline-flex items-center gap-2 rounded-xl bg-matte-terracotta px-6 py-2.5 font-semibold text-white transition hover:bg-matte-terracotta-hover hover:scale-[1.01] active:scale-[0.99] disabled:opacity-60 disabled:hover:scale-100"
          >
            {generating ? (
              <>
                <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24" fill="none">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
                Generating…
              </>
            ) : (
              useAI ? '✦ Generate with AI' : 'Generate flashcards'
            )}
          </button>
          <label className="flex cursor-pointer items-center gap-2 text-sm text-matte-charcoal dark:text-matte-cream">
            <div className="relative">
              <input
                type="checkbox"
                checked={useAI}
                onChange={(e) => setUseAI(e.target.checked)}
                className="peer sr-only"
              />
              <div className="h-6 w-11 rounded-full bg-matte-border-strong transition peer-checked:bg-matte-terracotta dark:bg-matte-night-border" />
              <div className="absolute left-0.5 top-0.5 h-5 w-5 rounded-full bg-white shadow transition-transform peer-checked:translate-x-5" />
            </div>
            AI Mode
          </label>
        </div>

        {generating && useAI && (
          <div className="mt-3 flex items-center gap-2 rounded-lg bg-matte-cream-dark px-3 py-2 text-sm text-matte-charcoal dark:bg-matte-night-elevated dark:text-matte-cream">
            <div className="h-4 w-4 animate-spin rounded-full border-2 border-matte-terracotta border-t-transparent" />
            AI is reading your material and generating flashcards… This may take 5-10 seconds.
          </div>
        )}
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
              <button
                type="button"
                disabled={!cards[index] || deletingCardId === cards[index]._id}
                onClick={() => cards[index] && handleDeleteCard(cards[index]._id)}
                className="rounded-xl bg-matte-error-bg px-4 py-2 text-sm font-medium text-white transition hover:bg-matte-error dark:bg-matte-terracotta dark:hover:bg-matte-terracotta-hover disabled:opacity-50"
              >
                {deletingCardId === (cards[index] && cards[index]._id) ? 'Removing…' : 'Delete'}
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

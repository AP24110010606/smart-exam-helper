import { useEffect, useState } from 'react';
import api from '../api/client';

export default function UploadMaterial() {
  const [subject, setSubject] = useState('');
  const [title, setTitle] = useState('');
  const [file, setFile] = useState(null);
  const [errors, setErrors] = useState({});
  const [msg, setMsg] = useState('');
  const [ok, setOk] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [deletingId, setDeletingId] = useState('');
  const [materials, setMaterials] = useState([]);
  const [loadingMaterials, setLoadingMaterials] = useState(true);

  function validate() {
    const e = {};
    if (!subject.trim()) e.subject = 'Subject is required';
    if (!title.trim()) e.title = 'Title is required';
    setErrors(e);
    return Object.keys(e).length === 0;
  }

  async function loadMaterials() {
    setLoadingMaterials(true);
    try {
      const { data } = await api.get('/api/materials');
      setMaterials(data);
    } catch (err) {
      console.error('Load materials error:', err);
      setMsg(err.response?.data?.message || err.message || 'Could not load uploaded materials.');
    } finally {
      setLoadingMaterials(false);
    }
  }

  useEffect(() => {
    let cancelled = false;
    (async () => {
      if (!cancelled) await loadMaterials();
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  async function handleSubmit(ev) {
    ev.preventDefault();
    setMsg('');
    setOk('');
    if (!validate()) return;
    setSubmitting(true);
    try {
      const form = new FormData();
      form.append('subject', subject.trim());
      form.append('title', title.trim());
      if (file) form.append('file', file);
      const { data } = await api.post('/api/materials', form);
      const generatedCount = data.generated?.count || 0;

      if (generatedCount > 0) {
        setOk(`Material saved and generated ${generatedCount} flashcards.`);
      } else {
        setOk('Material saved successfully.');
      }
      setSubject('');
      setTitle('');
      setFile(null);
      await loadMaterials();
    } catch (err) {
      console.error('Upload error:', err);
      setMsg(err.response?.data?.message || err.message || 'Upload failed');
    } finally {
      setSubmitting(false);
    }
  }

  async function handleDeleteMaterial(id) {
    const confirmed = window.confirm('Delete this uploaded material?');
    if (!confirmed) return;

    setMsg('');
    setOk('');
    setDeletingId(id);
    try {
      await api.delete(`/api/materials/${id}`);
      setMaterials((prev) => prev.filter((m) => m._id !== id));
      setOk('Material removed successfully.');
    } catch (err) {
      setMsg(err.response?.data?.message || 'Could not remove material.');
    } finally {
      setDeletingId('');
    }
  }

  const uploadBase = import.meta.env.VITE_API_URL?.replace(/\/$/, '') || '';
  const getMaterialUrl = (fileUrl) => {
    if (!fileUrl) return '';
    return fileUrl.startsWith('http') ? fileUrl : `${uploadBase}${fileUrl}`;
  };

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <div>
        <h1 className="font-landing text-3xl font-semibold text-matte-charcoal dark:text-matte-cream">Upload study material</h1>
        <p className="mt-1 text-matte-charcoal-soft dark:text-matte-border-strong">
          Store metadata and a local file URL. Upload common documents like <strong className="font-medium text-matte-charcoal dark:text-matte-cream">.txt</strong>, <strong className="font-medium text-matte-charcoal dark:text-matte-cream">.pdf</strong> (including scanned PDFs with OCR), or <strong className="font-medium text-matte-charcoal dark:text-matte-cream">.docx</strong> and the app will try to generate flashcards automatically.
        </p>
      </div>

      <form
        onSubmit={handleSubmit}
        className="rounded-2xl border border-matte-border bg-matte-paper p-6 shadow-matte dark:border-matte-night-border dark:bg-matte-night-card dark:shadow-none"
      >
        {ok && (
          <div className="mb-4 rounded-xl bg-matte-success-bg px-3 py-2 text-sm text-matte-sage-dark dark:bg-matte-sage-dark/25 dark:text-matte-sage-muted" role="status">
            {ok}
          </div>
        )}
        {msg && (
          <div className="mb-4 rounded-xl bg-matte-error-bg px-3 py-2 text-sm text-matte-error dark:bg-matte-terracotta/15 dark:text-matte-mustard-soft" role="alert">
            {msg}
          </div>
        )}

        <div className="space-y-4">
          <div>
            <label htmlFor="subject" className="block text-sm font-medium text-matte-charcoal dark:text-matte-cream">
              Subject
            </label>
            <input
              id="subject"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              placeholder="e.g. Biology"
              className="mt-1 w-full rounded-xl border border-matte-border-strong bg-matte-paper px-3 py-2 text-matte-charcoal outline-none transition focus:border-matte-terracotta focus:ring-2 focus:ring-matte-terracotta/25 dark:border-matte-night-border dark:bg-matte-night-elevated dark:text-matte-cream"
            />
            {errors.subject && <p className="mt-1 text-xs text-matte-error">{errors.subject}</p>}
          </div>
          <div>
            <label htmlFor="title" className="block text-sm font-medium text-matte-charcoal dark:text-matte-cream">
              Title
            </label>
            <input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Chapter 5 notes"
              className="mt-1 w-full rounded-xl border border-matte-border-strong bg-matte-paper px-3 py-2 text-matte-charcoal outline-none transition focus:border-matte-terracotta focus:ring-2 focus:ring-matte-terracotta/25 dark:border-matte-night-border dark:bg-matte-night-elevated dark:text-matte-cream"
            />
            {errors.title && <p className="mt-1 text-xs text-matte-error">{errors.title}</p>}
          </div>
          <div>
            <label htmlFor="file" className="block text-sm font-medium text-matte-charcoal dark:text-matte-cream">
              File (optional)
            </label>
            <input
              id="file"
              type="file"
              onChange={(e) => setFile(e.target.files?.[0] || null)}
              className="mt-1 w-full text-sm text-matte-charcoal-soft file:mr-3 file:rounded-xl file:border-0 file:bg-matte-cream-dark file:px-3 file:py-2 file:font-semibold file:text-matte-charcoal hover:file:bg-matte-border dark:text-matte-border-strong dark:file:bg-matte-night-elevated dark:file:text-matte-cream"
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={submitting}
          className="mt-6 w-full rounded-xl bg-matte-terracotta py-2.5 font-semibold text-white transition hover:bg-matte-terracotta-hover hover:scale-[1.01] active:scale-[0.99] disabled:opacity-60 sm:w-auto sm:px-8"
        >
          {submitting ? 'Saving…' : 'Save material'}
        </button>
      </form>

      <section className="rounded-2xl border border-matte-border bg-matte-paper p-6 shadow-matte dark:border-matte-night-border dark:bg-matte-night-card dark:shadow-none">
        <div className="flex items-center justify-between gap-4">
          <div>
            <h2 className="font-landing text-xl font-semibold text-matte-charcoal dark:text-matte-cream">Uploaded materials</h2>
            <p className="mt-1 text-sm text-matte-charcoal-soft dark:text-matte-border-strong">See the files and titles you've uploaded so far.</p>
          </div>
        </div>

        {loadingMaterials ? (
          <div className="mt-6 flex justify-center py-12">
            <div className="h-10 w-10 animate-spin rounded-full border-2 border-matte-terracotta border-t-transparent" />
          </div>
        ) : materials.length === 0 ? (
          <p className="mt-6 text-matte-charcoal-soft dark:text-matte-border-strong">No uploaded materials yet.</p>
        ) : (
          <div className="mt-6 space-y-4">
            {materials.map((m) => (
              <div key={m._id} className="rounded-2xl border border-matte-border-strong bg-matte-cream p-4 dark:border-matte-night-border dark:bg-matte-night-elevated">
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <p className="text-base font-semibold text-matte-charcoal dark:text-matte-cream">{m.title}</p>
                    <p className="text-sm text-matte-charcoal-soft dark:text-matte-border-strong">{m.subject}</p>
                    <p className="text-sm text-matte-charcoal-soft dark:text-matte-border-strong">{new Date(m.createdAt).toLocaleString()}</p>
                    {m.originalName && <p className="text-sm text-matte-charcoal-soft dark:text-matte-border-strong">Filename: {m.originalName}</p>}
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {m.fileUrl ? (
                      <a
                        href={getMaterialUrl(m.fileUrl)}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center rounded-xl bg-matte-tertiary px-4 py-2 text-sm font-semibold text-matte-charcoal transition hover:bg-matte-border dark:bg-matte-night-elevated dark:text-matte-cream dark:hover:bg-matte-border"
                      >
                        View file
                      </a>
                    ) : (
                      <span className="inline-flex items-center rounded-xl bg-matte-border px-4 py-2 text-sm text-matte-charcoal-soft dark:bg-matte-night-border dark:text-matte-border-strong">No file attached</span>
                    )}
                    <button
                      type="button"
                      onClick={() => handleDeleteMaterial(m._id)}
                      disabled={deletingId === m._id}
                      className="inline-flex items-center rounded-xl bg-matte-error-bg px-4 py-2 text-sm font-semibold text-white transition hover:bg-matte-error dark:bg-matte-terracotta dark:hover:bg-matte-terracotta-hover disabled:opacity-50"
                    >
                      {deletingId === m._id ? 'Removing…' : 'Remove'}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}

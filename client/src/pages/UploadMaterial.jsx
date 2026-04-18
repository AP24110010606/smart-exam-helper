import { useState } from 'react';
import api from '../api/client';

export default function UploadMaterial() {
  const [subject, setSubject] = useState('');
  const [title, setTitle] = useState('');
  const [file, setFile] = useState(null);
  const [errors, setErrors] = useState({});
  const [msg, setMsg] = useState('');
  const [ok, setOk] = useState('');
  const [submitting, setSubmitting] = useState(false);

  function validate() {
    const e = {};
    if (!subject.trim()) e.subject = 'Subject is required';
    if (!title.trim()) e.title = 'Title is required';
    setErrors(e);
    return Object.keys(e).length === 0;
  }

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
      await api.post('/api/materials', form, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      setOk('Material saved successfully.');
      setTitle('');
      setFile(null);
    } catch (err) {
      setMsg(err.response?.data?.message || 'Upload failed');
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <div>
        <h1 className="font-landing text-3xl font-semibold text-matte-charcoal dark:text-matte-cream">Upload study material</h1>
        <p className="mt-1 text-matte-charcoal-soft dark:text-matte-border-strong">
          Store metadata and a local file URL. Use <strong className="font-medium text-matte-charcoal dark:text-matte-cream">.txt</strong> files for automatic flashcard text extraction.
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
    </div>
  );
}

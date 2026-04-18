/**
 * Resolve avatar URL for <img src>. Relative paths work in dev (Vite proxy) and prod same-origin.
 */
export function avatarSrc(avatarUrl) {
  if (!avatarUrl || typeof avatarUrl !== 'string') return '';
  const u = avatarUrl.trim();
  if (!u) return '';
  if (u.startsWith('http://') || u.startsWith('https://')) return u;
  const base = import.meta.env.VITE_API_URL || '';
  if (base && u.startsWith('/uploads/')) {
    return `${base.replace(/\/$/, '')}${u}`;
  }
  return u;
}

/** Built-in sample avatars (served from /public/avatars) */
export const SAMPLE_AVATARS = [
  { id: 'sample-1', label: 'Azure', path: '/avatars/sample-1.svg' },
  { id: 'sample-2', label: 'Teal', path: '/avatars/sample-2.svg' },
  { id: 'sample-3', label: 'Sunset', path: '/avatars/sample-3.svg' },
  { id: 'sample-4', label: 'Violet', path: '/avatars/sample-4.svg' },
  { id: 'sample-5', label: 'Ocean', path: '/avatars/sample-5.svg' },
  { id: 'sample-6', label: 'Amber', path: '/avatars/sample-6.svg' },
];

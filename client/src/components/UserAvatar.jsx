import { avatarSrc } from '../utils/avatarSrc';

/**
 * Circular avatar; flat matte fallback initials (no gradients).
 */
export default function UserAvatar({ user, size = 40, className = '' }) {
  const src = user?.avatarUrl ? avatarSrc(user.avatarUrl) : '';
  const initial = (user?.name || user?.email || '?').charAt(0).toUpperCase();
  const dim = { width: size, height: size };

  if (src) {
    return (
      <img
        src={src}
        alt=""
        width={size}
        height={size}
        className={`rounded-full object-cover ring-2 ring-matte-paper dark:ring-matte-night-card ${className}`}
        style={dim}
      />
    );
  }

  return (
    <span
      className={`flex items-center justify-center rounded-full bg-matte-terracotta text-sm font-bold text-white ring-2 ring-matte-paper dark:ring-matte-night-card ${className}`}
      style={dim}
      aria-hidden
    >
      {initial}
    </span>
  );
}

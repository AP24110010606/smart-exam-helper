import { useEffect, useState } from 'react';
import api from '../api/client';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import UserAvatar from '../components/UserAvatar';
import { avatarSrc, SAMPLE_AVATARS } from '../utils/avatarSrc';

const inputClass =
  'mt-1 w-full rounded-xl border border-matte-border-strong bg-matte-paper px-3 py-2 text-matte-charcoal outline-none transition focus:border-matte-terracotta focus:ring-2 focus:ring-matte-terracotta/25 dark:border-matte-night-border dark:bg-matte-night-elevated dark:text-matte-cream';

const cardClass =
  'rounded-2xl border border-matte-border bg-matte-paper p-6 shadow-matte dark:border-matte-night-border dark:bg-matte-night-card dark:shadow-none';

export default function Settings() {
  const { user, updateUser } = useAuth();
  const { dark, toggle } = useTheme();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [profileMsg, setProfileMsg] = useState({ type: '', text: '' });

  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [pwErrors, setPwErrors] = useState({});
  const [pwMsg, setPwMsg] = useState({ type: '', text: '' });
  const [pwSubmitting, setPwSubmitting] = useState(false);

  const [profileSubmitting, setProfileSubmitting] = useState(false);
  const [avatarUploading, setAvatarUploading] = useState(false);
  const [sampleSaving, setSampleSaving] = useState(null);

  useEffect(() => {
    if (user) {
      setName(user.name || '');
      setEmail(user.email || '');
    }
  }, [user]);

  async function handleProfileSave(ev) {
    ev.preventDefault();
    setProfileMsg({ type: '', text: '' });
    if (!name.trim()) {
      setProfileMsg({ type: 'err', text: 'Display name is required.' });
      return;
    }
    if (!email.trim()) {
      setProfileMsg({ type: 'err', text: 'Email is required.' });
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setProfileMsg({ type: 'err', text: 'Enter a valid email address.' });
      return;
    }
    setProfileSubmitting(true);
    try {
      const { data } = await api.patch('/api/auth/profile', {
        name: name.trim(),
        email: email.trim(),
      });
      updateUser(data.user);
      setProfileMsg({ type: 'ok', text: 'Profile updated successfully.' });
    } catch (err) {
      setProfileMsg({ type: 'err', text: err.response?.data?.message || 'Could not update profile.' });
    } finally {
      setProfileSubmitting(false);
    }
  }

  async function handleSampleAvatar(path) {
    setProfileMsg({ type: '', text: '' });
    setSampleSaving(path);
    try {
      const { data } = await api.patch('/api/auth/profile', { avatarUrl: path });
      updateUser(data.user);
      setProfileMsg({ type: 'ok', text: 'Profile picture updated.' });
    } catch (err) {
      setProfileMsg({ type: 'err', text: err.response?.data?.message || 'Could not set avatar.' });
    } finally {
      setSampleSaving(null);
    }
  }

  async function handleAvatarFile(ev) {
    const file = ev.target.files?.[0];
    ev.target.value = '';
    if (!file) return;
    setProfileMsg({ type: '', text: '' });
    setAvatarUploading(true);
    try {
      const form = new FormData();
      form.append('avatar', file);
      const { data } = await api.post('/api/auth/avatar', form, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      updateUser(data.user);
      setProfileMsg({ type: 'ok', text: 'Photo uploaded.' });
    } catch (err) {
      setProfileMsg({ type: 'err', text: err.response?.data?.message || 'Upload failed.' });
    } finally {
      setAvatarUploading(false);
    }
  }

  function validatePasswordForm() {
    const e = {};
    if (!currentPassword) e.currentPassword = 'Required';
    if (!newPassword) e.newPassword = 'Required';
    else if (newPassword.length < 6) e.newPassword = 'At least 6 characters';
    if (newPassword !== confirmPassword) e.confirmPassword = 'Passwords do not match';
    setPwErrors(e);
    return Object.keys(e).length === 0;
  }

  async function handlePasswordSubmit(ev) {
    ev.preventDefault();
    setPwMsg({ type: '', text: '' });
    if (!validatePasswordForm()) return;
    setPwSubmitting(true);
    try {
      await api.patch('/api/auth/password', { currentPassword, newPassword });
      setPwMsg({ type: 'ok', text: 'Password changed. Use it next time you sign in.' });
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
      setPwErrors({});
    } catch (err) {
      setPwMsg({ type: 'err', text: err.response?.data?.message || 'Could not change password.' });
    } finally {
      setPwSubmitting(false);
    }
  }

  const previewSrc = user?.avatarUrl ? avatarSrc(user.avatarUrl) : '';

  return (
    <div className="mx-auto max-w-3xl space-y-8">
      <div>
        <h1 className="font-landing text-3xl font-semibold text-matte-charcoal dark:text-matte-cream">Settings</h1>
        <p className="mt-1 text-matte-charcoal-soft dark:text-matte-border-strong">Manage your account, profile photo, and security.</p>
      </div>

      <section className={cardClass}>
        <h2 className="font-landing text-lg font-semibold text-matte-charcoal dark:text-matte-cream">Profile picture</h2>
        <p className="mt-1 text-sm text-matte-charcoal-soft dark:text-matte-border-strong">
          Upload your own image or pick a sample look. Uploaded photos are stored on the server; samples use built-in artwork.
        </p>

        {profileMsg.text && (
          <div
            className={`mt-4 rounded-xl px-3 py-2 text-sm ${
              profileMsg.type === 'ok'
                ? 'bg-matte-success-bg text-matte-sage-dark dark:bg-matte-sage-dark/25 dark:text-matte-sage-muted'
                : 'bg-matte-error-bg text-matte-error dark:bg-matte-terracotta/15 dark:text-matte-mustard-soft'
            }`}
            role="status"
          >
            {profileMsg.text}
          </div>
        )}

        <div className="mt-6 flex flex-col items-start gap-6 sm:flex-row sm:items-center">
          <div className="relative">
            <div className="h-24 w-24 overflow-hidden rounded-2xl ring-2 ring-matte-border dark:ring-matte-night-border">
              {previewSrc ? (
                <img src={previewSrc} alt="" className="h-full w-full object-cover" />
              ) : (
                <div className="flex h-full w-full items-center justify-center bg-matte-cream-dark dark:bg-matte-night-elevated">
                  <UserAvatar user={user} size={80} className="!ring-0" />
                </div>
              )}
            </div>
          </div>
          <div className="flex flex-wrap gap-2">
            <label className="cursor-pointer rounded-xl bg-matte-terracotta px-4 py-2 text-sm font-semibold text-white transition hover:bg-matte-terracotta-hover hover:scale-[1.02] active:scale-[0.99]">
              {avatarUploading ? 'Uploading…' : 'Upload photo'}
              <input type="file" accept="image/jpeg,image/png,image/gif,image/webp" className="hidden" onChange={handleAvatarFile} disabled={avatarUploading} />
            </label>
          </div>
        </div>

        <div className="mt-8">
          <h3 className="text-sm font-semibold text-matte-charcoal dark:text-matte-cream">Sample profiles</h3>
          <p className="mt-1 text-xs text-matte-charcoal-soft dark:text-matte-border-strong">One click applies — saved to your account.</p>
          <div className="mt-3 grid grid-cols-3 gap-3 sm:grid-cols-6">
            {SAMPLE_AVATARS.map((s) => (
              <button
                key={s.id}
                type="button"
                title={s.label}
                onClick={() => handleSampleAvatar(s.path)}
                disabled={sampleSaving !== null}
                className={`group relative overflow-hidden rounded-xl ring-2 transition hover:scale-[1.03] hover:ring-matte-terracotta-muted focus:outline-none focus:ring-2 focus:ring-matte-terracotta disabled:opacity-50 ${
                  user?.avatarUrl === s.path ? 'ring-matte-terracotta dark:ring-matte-terracotta-muted' : 'ring-transparent'
                }`}
              >
                <img src={s.path} alt="" className="aspect-square w-full object-cover" />
                <span className="absolute inset-x-0 bottom-0 bg-matte-charcoal/75 py-0.5 text-center text-[10px] font-medium text-matte-cream opacity-0 transition group-hover:opacity-100">
                  {sampleSaving === s.path ? '…' : s.label}
                </span>
              </button>
            ))}
          </div>
        </div>
      </section>

      <section className={cardClass}>
        <h2 className="font-landing text-lg font-semibold text-matte-charcoal dark:text-matte-cream">Account details</h2>
        <p className="mt-1 text-sm text-matte-charcoal-soft dark:text-matte-border-strong">Your display name and sign-in email.</p>
        <form onSubmit={handleProfileSave} className="mt-6 space-y-4">
          <div>
            <label htmlFor="settings-name" className="block text-sm font-medium text-matte-charcoal dark:text-matte-cream">
              Display name
            </label>
            <input id="settings-name" value={name} onChange={(e) => setName(e.target.value)} className={inputClass} />
          </div>
          <div>
            <label htmlFor="settings-email" className="block text-sm font-medium text-matte-charcoal dark:text-matte-cream">
              Email
            </label>
            <input id="settings-email" type="email" autoComplete="email" value={email} onChange={(e) => setEmail(e.target.value)} className={inputClass} />
          </div>
          <button
            type="submit"
            disabled={profileSubmitting}
            className="rounded-xl bg-matte-charcoal px-6 py-2.5 text-sm font-semibold text-matte-cream transition hover:bg-matte-charcoal-soft disabled:opacity-60 dark:bg-matte-terracotta dark:hover:bg-matte-terracotta-hover"
          >
            {profileSubmitting ? 'Saving…' : 'Save changes'}
          </button>
        </form>
      </section>

      <section className={cardClass}>
        <h2 className="font-landing text-lg font-semibold text-matte-charcoal dark:text-matte-cream">Change password</h2>
        <p className="mt-1 text-sm text-matte-charcoal-soft dark:text-matte-border-strong">Enter your current password, then choose a new one.</p>

        {pwMsg.text && (
          <div
            className={`mt-4 rounded-xl px-3 py-2 text-sm ${
              pwMsg.type === 'ok'
                ? 'bg-matte-success-bg text-matte-sage-dark dark:bg-matte-sage-dark/25 dark:text-matte-sage-muted'
                : 'bg-matte-error-bg text-matte-error dark:bg-matte-terracotta/15 dark:text-matte-mustard-soft'
            }`}
            role="status"
          >
            {pwMsg.text}
          </div>
        )}

        <form onSubmit={handlePasswordSubmit} className="mt-6 space-y-4" noValidate>
          <div>
            <label htmlFor="current-pw" className="block text-sm font-medium text-matte-charcoal dark:text-matte-cream">
              Current password
            </label>
            <input
              id="current-pw"
              type="password"
              autoComplete="current-password"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              className={inputClass}
            />
            {pwErrors.currentPassword && <p className="mt-1 text-xs text-matte-error">{pwErrors.currentPassword}</p>}
          </div>
          <div>
            <label htmlFor="new-pw" className="block text-sm font-medium text-matte-charcoal dark:text-matte-cream">
              New password
            </label>
            <input
              id="new-pw"
              type="password"
              autoComplete="new-password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className={inputClass}
            />
            {pwErrors.newPassword && <p className="mt-1 text-xs text-matte-error">{pwErrors.newPassword}</p>}
          </div>
          <div>
            <label htmlFor="confirm-pw" className="block text-sm font-medium text-matte-charcoal dark:text-matte-cream">
              Confirm new password
            </label>
            <input
              id="confirm-pw"
              type="password"
              autoComplete="new-password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className={inputClass}
            />
            {pwErrors.confirmPassword && <p className="mt-1 text-xs text-matte-error">{pwErrors.confirmPassword}</p>}
          </div>
          <button
            type="submit"
            disabled={pwSubmitting}
            className="rounded-xl border border-matte-border-strong bg-matte-cream px-6 py-2.5 text-sm font-semibold text-matte-charcoal transition hover:bg-matte-cream-dark disabled:opacity-60 dark:border-matte-night-border dark:bg-matte-night-elevated dark:text-matte-cream dark:hover:bg-matte-charcoal"
          >
            {pwSubmitting ? 'Updating…' : 'Update password'}
          </button>
        </form>
      </section>

      <section className={cardClass}>
        <h2 className="font-landing text-lg font-semibold text-matte-charcoal dark:text-matte-cream">Appearance</h2>
        <p className="mt-1 text-sm text-matte-charcoal-soft dark:text-matte-border-strong">Customize how the app looks.</p>
        <div className="mt-6">
          <label className="flex items-center gap-3">
            <input
              type="checkbox"
              checked={dark}
              onChange={toggle}
              className="rounded border-matte-border text-matte-terracotta focus:ring-matte-terracotta dark:border-matte-night-border"
            />
            <span className="text-sm font-medium text-matte-charcoal dark:text-matte-cream">Dark mode</span>
          </label>
        </div>
      </section>
    </div>
  );
}

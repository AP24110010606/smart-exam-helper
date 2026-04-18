import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import api from '../api/client';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(() => localStorage.getItem('token'));
  const [loading, setLoading] = useState(true);

  const refreshUser = useCallback(async () => {
    const t = localStorage.getItem('token');
    if (!t) return;
    const { data } = await api.get('/api/auth/me');
    setUser(data.user);
  }, []);

  useEffect(() => {
    if (!token) {
      setUser(null);
      setLoading(false);
      return;
    }
    let cancelled = false;
    (async () => {
      try {
        const { data } = await api.get('/api/auth/me');
        if (!cancelled) setUser(data.user);
      } catch {
        if (!cancelled) {
          localStorage.removeItem('token');
          setToken(null);
          setUser(null);
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [token]);

  const login = (newToken, u) => {
    localStorage.setItem('token', newToken);
    setToken(newToken);
    setUser(u);
  };

  const logout = () => {
    localStorage.removeItem('token');
    setToken(null);
    setUser(null);
  };

  /** Merge partial fields into current user (e.g. after profile PATCH). */
  const updateUser = useCallback((partial) => {
    setUser((u) => (u ? { ...u, ...partial } : u));
  }, []);

  const value = useMemo(
    () => ({
      user,
      token,
      loading,
      login,
      logout,
      refreshUser,
      updateUser,
      isAuthenticated: !!token && !!user,
    }),
    [user, token, loading, refreshUser, updateUser]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}

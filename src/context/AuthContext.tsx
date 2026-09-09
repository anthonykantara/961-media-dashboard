import { createContext, useCallback, useContext, useEffect, useMemo, useState, ReactNode } from 'react';

export interface AuthUser {
  id: string;
  email: string;
  role: 'user' | 'contributor' | 'editor' | 'admin' | string;
  displayName?: string | null;
}

interface AuthContextValue {
  user: AuthUser | null;
  loading: boolean;
  requestOtp: (email: string) => Promise<number>;
  verifyOtp: (email: string, code: string) => Promise<void>;
  logout: () => Promise<void>;
}

const API_URL = (import.meta.env.VITE_API_URL || '').replace(/\/$/, '');
const AuthContext = createContext<AuthContextValue | undefined>(undefined);

async function api(path: string, options: RequestInit = {}) {
  const response = await fetch(`${API_URL}${path}`, { ...options, credentials: 'include' });
  const body = await response.json().catch(() => ({}));
  if (!response.ok) throw new Error(body.message || 'Something went wrong. Please try again.');
  return body;
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api('/api/auth/me')
      .then((body) => setUser(body.user || null))
      .catch(() => setUser(null))
      .finally(() => setLoading(false));
  }, []);

  const requestOtp = useCallback(async (email: string) => {
    const body = await api('/api/auth/request-otp', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email })
    });
    return body.expiresInSeconds || 600;
  }, []);

  const verifyOtp = useCallback(async (email: string, code: string) => {
    const body = await api('/api/auth/verify-otp', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, code })
    });
    setUser(body.user);
  }, []);

  const logout = useCallback(async () => {
    await api('/api/auth/logout', { method: 'POST' });
    setUser(null);
  }, []);

  useEffect(() => {
    const handleLogoutClick = (event: MouseEvent) => {
      const target = event.target as HTMLElement | null;
      const button = target?.closest('button');
      if (button?.textContent?.trim().toLowerCase() === 'log out') {
        event.preventDefault();
        event.stopPropagation();
        void logout();
      }
    };
    document.addEventListener('click', handleLogoutClick, true);
    return () => document.removeEventListener('click', handleLogoutClick, true);
  }, [logout]);

  const value = useMemo(() => ({ user, loading, requestOtp, verifyOtp, logout }), [user, loading, requestOtp, verifyOtp, logout]);
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const value = useContext(AuthContext);
  if (!value) throw new Error('useAuth must be used within AuthProvider');
  return value;
}

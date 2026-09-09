import { createContext, useCallback, useContext, useEffect, useMemo, useState, ReactNode } from 'react';

export interface AuthUser { id: string; email: string; role: string; displayName?: string | null; }
interface AuthContextValue { user: AuthUser | null; loading: boolean; requestOtp: (email: string) => Promise<number>; verifyOtp: (email: string, code: string) => Promise<void>; logout: () => Promise<void>; }
const API_URL = (import.meta.env.VITE_API_URL || (import.meta.env.DEV ? 'http://localhost:5000' : 'https://api.961.co')).replace(/\/$/, '');
const AuthContext = createContext<AuthContextValue | undefined>(undefined);
async function api(path: string, options: RequestInit = {}) { const r = await fetch(`${API_URL}${path}`, { ...options, credentials: 'include' }); const body = await r.json().catch(() => ({})); if (!r.ok) throw new Error(body.message || body.error || 'Request failed'); return body; }
export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null); const [loading, setLoading] = useState(true);
  useEffect(() => { api('/api/auth/me').then(b => setUser(b.user || null)).catch(() => setUser(null)).finally(() => setLoading(false)); }, []);
  const requestOtp = useCallback(async (email: string) => (await api('/api/auth/request-otp', { method: 'POST', headers: {'Content-Type':'application/json'}, body: JSON.stringify({ email }) })).expiresInSeconds || 600, []);
  const verifyOtp = useCallback(async (email: string, code: string) => { const b = await api('/api/auth/verify-otp', { method:'POST', headers:{'Content-Type':'application/json'}, body:JSON.stringify({email, code}) }); setUser(b.user); }, []);
  const logout = useCallback(async () => { await api('/api/auth/logout', { method:'POST' }); setUser(null); }, []);
  const value = useMemo(() => ({ user, loading, requestOtp, verifyOtp, logout }), [user, loading, requestOtp, verifyOtp, logout]);
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
export function useAuth() { const value = useContext(AuthContext); if (!value) throw new Error('useAuth must be used within AuthProvider'); return value; }

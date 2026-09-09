import { ReactNode } from 'react';
import { useAuth } from '../../context/AuthContext';
import LoginPage from './LoginPage';
export default function AuthGate({ children }: { children: ReactNode }) { const { user, loading } = useAuth(); if (loading) return <div className="min-h-screen flex items-center justify-center text-sm text-gray-400">Loading...</div>; return user ? <>{children}</> : <LoginPage />; }

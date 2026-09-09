import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { TeamMember } from './types';
import { useDataTable } from '../../../hooks/useDataTable';

const API = (import.meta.env.VITE_API_URL || '').replace(/\/$/, '');

async function api(path: string, options: RequestInit = {}) {
  const r = await fetch(`${API}${path}`, { ...options, credentials: 'include' });
  const b = await r.json().catch(() => ({}));
  if (!r.ok) throw new Error(b.message || b.error || 'Request failed');
  return b;
}

const INITIAL_TEAM: TeamMember[] = [
  { 
    id: '1', 
    username: 'anthony', 
    name: 'Anthony Rahayel', 
    role: 'Admin', 
    joinedDate: 'Jan 2024',
    avatar: 'https://picsum.photos/seed/anthony/100/100',
    bio: 'Editor-in-Chief at 961, passionate about Lebanese culture and food.',
    socialLink: 'https://961.com/anthony'
  },
  { 
    id: '2', 
    username: 'sarah_k', 
    name: 'Sarah Khoury', 
    role: 'Editor', 
    joinedDate: 'Feb 2024',
    avatar: 'https://picsum.photos/seed/sarah/100/100',
    bio: 'Senior Editor focusing on lifestyle and travel.',
    socialLink: 'https://961.com/sarah_k'
  },
  { 
    id: '3', 
    username: 'jdoe', 
    name: 'John Doe', 
    role: 'Contributor', 
    joinedDate: 'Mar 2024',
    avatar: 'https://picsum.photos/seed/john/100/100',
    bio: 'Freelance writer and photographer.',
    socialLink: 'https://961.com/jdoe'
  },
];

interface Ctx {
  team: TeamMember[];
  searchQuery: string;
  setSearchQuery: (q: string) => void;
  filteredTeam: TeamMember[];
  addMember: (email: string, role: TeamMember['role']) => Promise<void>;
  removeMember: (id: string) => Promise<void>;
  updateMember: (id: string, updates: Partial<TeamMember>) => Promise<void>;
  getMember: (id: string) => TeamMember | undefined;
  sortField: string | keyof TeamMember | null;
  sortDirection: 'asc' | 'desc';
  handleSort: (f: string | keyof TeamMember) => void;
  isLoading: boolean;
}

const TeamContext = createContext<Ctx | undefined>(undefined);

export function TeamProvider({ children }: { children: ReactNode }) {
  const [team, setTeam] = useState<TeamMember[]>(INITIAL_TEAM);
  const [loading, setLoading] = useState(true);
  const table = useDataTable<TeamMember>({ data: team, searchFields: ['username', 'name', 'role'] });

  useEffect(() => {
    let mounted = true;
    api('/api/admin/users')
      .then(rows => {
        if (!mounted) return;
        const users = Array.isArray(rows) ? rows : (rows.users || []);
        if (users.length > 0) {
          setTeam(users.map((u: any) => ({
            id: String(u.id),
            username: String(u.email).split('@')[0],
            name: u.display_name || u.email,
            role: String(u.role).charAt(0).toUpperCase() + String(u.role).slice(1),
            joinedDate: u.created_at ? new Date(u.created_at).toLocaleDateString() : '',
            avatar: '',
            bio: '',
            socialLink: '',
            email: u.email,
            isActive: u.is_active
          } as TeamMember)));
        } else {
          setTeam(INITIAL_TEAM);
        }
      })
      .catch(() => {
        if (mounted) setTeam(INITIAL_TEAM);
      })
      .finally(() => {
        if (mounted) setLoading(false);
      });
    return () => { mounted = false; };
  }, []);

  const addMember = async (email: string, role: TeamMember['role']) => {
    try {
      const u = await api('/api/admin/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, role: role.toLowerCase() })
      });
      setTeam(p => [{
        id: String(u.id),
        username: String(u.email).split('@')[0],
        name: u.display_name || u.email,
        role: role,
        joinedDate: new Date().toLocaleDateString(),
        avatar: '',
        bio: '',
        socialLink: ''
      } as TeamMember, ...p]);
    } catch {
      setTeam(p => [{
        id: String(Date.now()),
        username: email.split('@')[0],
        name: email,
        role,
        joinedDate: new Date().toLocaleDateString(),
        avatar: '',
        bio: '',
        socialLink: ''
      } as TeamMember, ...p]);
    }
  };

  const removeMember = async (id: string) => {
    try {
      await api(`/api/admin/users/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isActive: false })
      });
    } catch {}
    setTeam(p => p.filter(x => x.id !== id));
  };

  const updateMember = async (id: string, updates: Partial<TeamMember>) => {
    try {
      const body: any = {};
      if (updates.name !== undefined) body.displayName = updates.name;
      if (updates.role !== undefined) body.role = String(updates.role).toLowerCase();
      if ((updates as any).isActive !== undefined) body.isActive = (updates as any).isActive;
      const u = await api(`/api/admin/users/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
      });
      setTeam(p => p.map(x => x.id === id ? {
        ...x,
        ...updates,
        name: u.display_name || x.name,
        role: String(u.role).charAt(0).toUpperCase() + String(u.role).slice(1)
      } : x));
    } catch {
      setTeam(p => p.map(x => x.id === id ? { ...x, ...updates } : x));
    }
  };

  const getMember = (id: string) => team.find(x => x.id === id);

  return (
    <TeamContext.Provider value={{
      team,
      searchQuery: table.searchQuery,
      setSearchQuery: table.setSearchQuery,
      filteredTeam: table.filteredData,
      addMember,
      removeMember,
      updateMember,
      getMember,
      sortField: table.sortField,
      sortDirection: table.sortDirection,
      handleSort: table.handleSort,
      isLoading: loading
    }}>
      {children}
    </TeamContext.Provider>
  );
}

export function useTeamContext() {
  const c = useContext(TeamContext);
  if (!c) throw new Error('useTeamContext must be used within TeamProvider');
  return c;
}

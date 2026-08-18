import React, { createContext, useContext, useState, useEffect, useMemo, ReactNode } from 'react';
import { TeamMember } from './types';
import { initialTeam } from './mockData';

const API_BASE = (import.meta as any).env?.VITE_API_URL || 'http://localhost:5001';

interface TeamContextType {
  team: TeamMember[];
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  filteredTeam: TeamMember[];
  addMember: (username: string, role: TeamMember['role']) => void;
  removeMember: (id: string) => void;
  updateMember: (id: string, updates: Partial<TeamMember>) => void;
  getMember: (id: string) => TeamMember | undefined;
}

const TeamContext = createContext<TeamContextType | undefined>(undefined);

export function TeamProvider({ children }: { children: ReactNode }) {
  const [team, setTeam] = useState<TeamMember[]>(initialTeam);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    let isMounted = true;
    const fetchTeam = async () => {
      try {
        const response = await fetch(`${API_BASE}/api/team`);
        if (response.ok) {
          const data = await response.json();
          if (Array.isArray(data) && data.length > 0) {
            const normalized: TeamMember[] = data.map((item: any) => ({
              id: String(item.id || item._id || Math.random().toString(36).substr(2, 9)),
              username: item.username || item.name?.toLowerCase().replace(/\s+/g, '_') || 'user',
              name: item.name || item.username || 'Team Member',
              role: item.role || 'Writer',
              joinedDate: item.joinedDate || new Date().toLocaleDateString('en-US', { month: 'short', year: 'numeric' }),
              avatar: item.avatar || `https://picsum.photos/seed/${item.username || 'user'}/100/100`,
              bio: item.bio || '',
              socialLink: item.socialLink || item.socials?.website || ''
            }));
            if (isMounted) {
              setTeam(normalized);
            }
          }
        }
      } catch (error) {
        console.error('Error fetching team from backend:', error);
      }
    };

    fetchTeam();
    return () => { isMounted = false; };
  }, []);

  const filteredTeam = useMemo(() => {
    return team.filter(member => 
      member.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
      member.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [team, searchQuery]);

  const addMember = (username: string, role: TeamMember['role']) => {
    const member: TeamMember = {
      id: Math.random().toString(36).substr(2, 9),
      username: username.toLowerCase().replace(/\s+/g, '_'),
      name: username.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' '),
      role,
      joinedDate: new Date().toLocaleDateString('en-US', { month: 'short', year: 'numeric' }),
      avatar: `https://picsum.photos/seed/${username}/100/100`,
      bio: '',
      socialLink: ''
    };

    setTeam(prev => [member, ...prev]);

    fetch(`${API_BASE}/api/team`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(member),
    })
      .then(async res => {
        if (res.ok) {
          const data = await res.json();
          if (data && (data.id || data._id)) {
            const serverId = String(data.id || data._id);
            if (serverId !== member.id) {
              setTeam(prev => prev.map(m => m.id === member.id ? { ...m, id: serverId } : m));
            }
          }
        }
      })
      .catch(error => {
        console.error('Error adding team member to backend:', error);
      });
  };

  const removeMember = (id: string) => {
    setTeam(prev => prev.filter(m => m.id !== id));

    fetch(`${API_BASE}/api/team/${id}`, {
      method: 'DELETE',
    }).catch(error => {
      console.error('Error removing team member on backend:', error);
    });
  };

  const updateMember = (id: string, updates: Partial<TeamMember>) => {
    setTeam(prev => prev.map(m => m.id === id ? { ...m, ...updates } : m));

    fetch(`${API_BASE}/api/team/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(updates),
    }).catch(error => {
      console.error('Error updating team member on backend:', error);
    });
  };

  const getMember = (id: string) => {
    return team.find(m => m.id === id);
  };

  return (
    <TeamContext.Provider value={{
      team,
      searchQuery,
      setSearchQuery,
      filteredTeam,
      addMember,
      removeMember,
      updateMember,
      getMember
    }}>
      {children}
    </TeamContext.Provider>
  );
}

export function useTeamContext() {
  const context = useContext(TeamContext);
  if (context === undefined) {
    throw new Error('useTeamContext must be used within a TeamProvider');
  }
  return context;
}

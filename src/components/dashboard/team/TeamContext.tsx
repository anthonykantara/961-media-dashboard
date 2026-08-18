import React, { createContext, useContext, useState, ReactNode } from 'react';
import { TeamMember } from './types';
import { initialTeam } from './mockData';
import { useDataTable } from '../../../hooks/useDataTable';

interface TeamContextType {
  team: TeamMember[];
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  filteredTeam: TeamMember[];
  addMember: (username: string, role: TeamMember['role']) => void;
  removeMember: (id: string) => void;
  updateMember: (id: string, updates: Partial<TeamMember>) => void;
  getMember: (id: string) => TeamMember | undefined;
  sortField: string | keyof TeamMember | null;
  sortDirection: 'asc' | 'desc';
  handleSort: (field: string | keyof TeamMember) => void;
  isLoading: boolean;
}

const TeamContext = createContext<TeamContextType | undefined>(undefined);

export function TeamProvider({ children }: { children: ReactNode }) {
  const [team, setTeam] = useState<TeamMember[]>(initialTeam);

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
  };

  const removeMember = (id: string) => {
    setTeam(prev => prev.filter(m => m.id !== id));
  };

  const updateMember = (id: string, updates: Partial<TeamMember>) => {
    setTeam(prev => prev.map(m => m.id === id ? { ...m, ...updates } : m));
  };

  const getMember = (id: string) => {
    return team.find(m => m.id === id);
  };

  const dataTable = useDataTable<TeamMember>({
    data: team,
    searchFields: ['username', 'name', 'role'],
  });

  return (
    <TeamContext.Provider value={{
      team,
      searchQuery: dataTable.searchQuery,
      setSearchQuery: dataTable.setSearchQuery,
      filteredTeam: dataTable.filteredData,
      addMember,
      removeMember,
      updateMember,
      getMember,
      sortField: dataTable.sortField,
      sortDirection: dataTable.sortDirection,
      handleSort: dataTable.handleSort,
      isLoading: dataTable.isLoading,
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

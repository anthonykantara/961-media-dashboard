import { useState } from 'react';
import { TeamMember } from './types';
import { useDataTable } from '../../../hooks/useDataTable';

export function useTeam(initialTeamList: TeamMember[]) {
  const [team, setTeam] = useState<TeamMember[]>(initialTeamList);

  const addMember = (username: string, role: TeamMember['role']) => {
    const member: TeamMember = {
      id: Math.random().toString(36).substr(2, 9),
      username: username.toLowerCase().replace(/\s+/g, '_'),
      name: username.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' '),
      role,
      joinedDate: new Date().toLocaleDateString('en-US', { month: 'short', year: 'numeric' }),
      avatar: `https://picsum.photos/seed/${username}/100/100`
    };

    setTeam(prev => [member, ...prev]);
  };

  const removeMember = (id: string) => {
    setTeam(prev => prev.filter(m => m.id !== id));
  };

  const dataTable = useDataTable<TeamMember>({
    data: team,
    searchFields: ['username', 'name', 'role'],
  });

  return {
    team,
    searchQuery: dataTable.searchQuery,
    setSearchQuery: dataTable.setSearchQuery,
    filteredTeam: dataTable.filteredData,
    addMember,
    removeMember,
    sortField: dataTable.sortField,
    sortDirection: dataTable.sortDirection,
    handleSort: dataTable.handleSort,
    isLoading: dataTable.isLoading,
    setIsLoading: dataTable.setIsLoading,
  };
}

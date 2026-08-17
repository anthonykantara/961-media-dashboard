import { useState, useMemo } from 'react';
import { TeamMember } from './types';

export function useTeam(initialTeam: TeamMember[]) {
  const [team, setTeam] = useState<TeamMember[]>(initialTeam);
  const [searchQuery, setSearchQuery] = useState('');

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
      avatar: `https://picsum.photos/seed/${username}/100/100`
    };

    setTeam(prev => [member, ...prev]);
  };

  const removeMember = (id: string) => {
    setTeam(prev => prev.filter(m => m.id !== id));
  };

  return {
    team,
    searchQuery, setSearchQuery,
    filteredTeam,
    addMember,
    removeMember
  };
}

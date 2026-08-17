import { 
  Plus, 
  Search, 
  User
} from 'lucide-react';
import { useState } from 'react';
import { useTeamContext } from './team/TeamContext';
import TeamTable from './team/TeamTable';
import TeamModal from './team/TeamModal';

export default function TeamPage() {
  const {
    searchQuery, setSearchQuery,
    filteredTeam,
    addMember,
    removeMember
  } = useTeamContext();

  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <div className="max-w-[1200px] mx-auto space-y-6 pb-12">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="relative flex-1 min-w-[300px]">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input 
            type="text"
            placeholder="Search team members..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-11 pr-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm focus:ring-1 focus:ring-primary focus:border-primary outline-none transition-all font-medium text-gray-600"
          />
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="bg-gray-900 text-white px-5 py-2.5 rounded-xl font-semibold text-xs hover:bg-primary transition-all flex items-center gap-2 shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>Add Team Member</span>
        </button>
      </div>

      <TeamTable 
        members={filteredTeam} 
        onRemove={removeMember} 
      />

      {filteredTeam.length === 0 && (
        <div className="p-16 text-center bg-white rounded-xl border border-gray-200">
          <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4 border border-gray-100">
            <User className="w-6 h-6 text-gray-300" />
          </div>
          <h3 className="text-sm font-semibold text-gray-900">No members found</h3>
          <p className="text-gray-400 text-xs mt-1">Try adjusting your search query</p>
        </div>
      )}

      <TeamModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        onAdd={(username, role) => {
          addMember(username, role);
          setIsModalOpen(false);
        }} 
      />
    </div>
  );
}

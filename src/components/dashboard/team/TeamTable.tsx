import { 
  Trash2,
  Edit
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { TeamMember } from './types';
import { DataTable, Column } from '../../common/DataTable';

interface TeamTableProps {
  members: TeamMember[];
  onRemove: (id: string) => void;
  sortField?: string | keyof TeamMember | null;
  sortDirection?: 'asc' | 'desc';
  onSort?: (field: string) => void;
  isLoading?: boolean;
}

export default function TeamTable({
  members,
  onRemove,
  sortField,
  sortDirection,
  onSort,
  isLoading = false,
}: TeamTableProps) {
  const columns: Column<TeamMember>[] = [
    {
      key: 'name',
      header: 'Member',
      sortable: true,
      headerClassName: 'pl-8 pr-6 py-4 text-xs font-semibold text-gray-500 text-left',
      className: 'pl-8 pr-6 py-4',
      render: (member) => (
        <div className="flex items-center gap-4">
          <div className="w-8 h-8 rounded-full overflow-hidden border border-gray-200 shrink-0">
            <img src={member.avatar} alt={member.name} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
          </div>
          <div>
            <p className="text-sm font-medium text-gray-900 leading-tight">{member.name}</p>
          </div>
        </div>
      ),
    },
    {
      key: 'username',
      header: 'Username',
      sortable: true,
      headerClassName: 'px-6 py-4 text-xs font-semibold text-gray-500 text-left',
      className: 'px-6 py-4',
      render: (member) => (
        <span className="text-xs font-medium text-gray-400">@{member.username}</span>
      ),
    },
    {
      key: 'role',
      header: 'Role',
      sortable: true,
      headerClassName: 'px-6 py-4 text-xs font-semibold text-gray-500 text-left',
      className: 'px-6 py-4',
      render: (member) => (
        <span className="text-xs font-medium text-gray-600">{member.role}</span>
      ),
    },
    {
      key: 'joinedDate',
      header: 'Joined',
      sortable: true,
      headerClassName: 'px-6 py-4 text-xs font-semibold text-gray-500 text-left',
      className: 'px-6 py-4',
      render: (member) => (
        <p className="text-sm font-medium text-gray-500">{member.joinedDate}</p>
      ),
    },
    {
      key: 'actions',
      header: 'Actions',
      headerClassName: 'px-8 py-4 text-xs font-semibold text-gray-500 text-right pr-8',
      className: 'px-8 py-4 text-right pr-8',
      render: (member) => (
        <div className="flex items-center justify-end gap-2">
          <Link 
            to={`/dashboard/team/edit/${member.id}`}
            className="p-1.5 hover:bg-gray-50 rounded-lg text-gray-500 hover:text-primary transition-all border border-transparent" 
            title="Edit"
          >
            <Edit className="w-4 h-4" />
          </Link>
          <button 
            onClick={() => onRemove(member.id)}
            className="p-1.5 hover:bg-gray-50 rounded-lg text-gray-500 hover:text-red-600 transition-all border border-transparent cursor-pointer"
            title="Remove Member"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      ),
    },
  ];

  return (
    <DataTable
      columns={columns}
      data={members}
      keyExtractor={(m) => m.id}
      isLoading={isLoading}
      sortField={typeof sortField === 'string' ? sortField : sortField ? String(sortField) : null}
      sortDirection={sortDirection}
      onSort={onSort}
    />
  );
}

import { 
  Shield, 
  Trash2,
  Edit
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { TeamMember } from './types';

interface TeamTableProps {
  members: TeamMember[];
  onRemove: (id: string) => void;
}

export default function TeamTable({ members, onRemove }: TeamTableProps) {
  return (
    <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr className="border-b border-gray-100 bg-gray-50/30">
              <th className="pl-8 pr-6 py-4 text-xs font-semibold text-gray-500 text-left">
                Member
              </th>
              <th className="px-6 py-4 text-xs font-semibold text-gray-500 text-left">
                Username
              </th>
              <th className="px-6 py-4 text-xs font-semibold text-gray-500 text-left">
                Role
              </th>
              <th className="px-6 py-4 text-xs font-semibold text-gray-500 text-left">
                Joined
              </th>
              <th className="px-8 py-4 text-xs font-semibold text-gray-500 text-right pr-8">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {members.map((member) => (
              <tr key={member.id} className="hover:bg-gray-50/50 transition-colors group">
                <td className="pl-8 pr-6 py-4">
                  <div className="flex items-center gap-4">
                    <div className="w-8 h-8 rounded-full overflow-hidden border border-gray-200 shrink-0">
                      <img src={member.avatar} alt={member.name} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-900 leading-tight">{member.name}</p>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <span className="text-xs font-medium text-gray-400">@{member.username}</span>
                </td>
                <td className="px-6 py-4">
                  <span className="text-xs font-medium text-gray-600">{member.role}</span>
                </td>
                <td className="px-6 py-4">
                  <p className="text-sm font-medium text-gray-500">{member.joinedDate}</p>
                </td>
                <td className="px-8 py-4 text-right pr-8">
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
                      className="p-1.5 hover:bg-gray-50 rounded-lg text-gray-500 hover:text-red-600 transition-all border border-transparent"
                      title="Remove Member"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

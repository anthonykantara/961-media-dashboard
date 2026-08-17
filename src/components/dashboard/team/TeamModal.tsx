import { X, User } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useState, FormEvent } from 'react';
import { TeamMember } from './types';

interface TeamModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (username: string, role: TeamMember['role']) => void;
}

export default function TeamModal({ isOpen, onClose, onAdd }: TeamModalProps) {
  const [newMember, setNewMember] = useState<{ username: string; role: TeamMember['role'] }>({
    username: '',
    role: 'Contributor'
  });

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!newMember.username) return;
    onAdd(newMember.username, newMember.role);
    setNewMember({ username: '', role: 'Contributor' });
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
          />
          <motion.div 
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="relative w-full max-w-md bg-white rounded-[2.5rem] border border-gray-200 overflow-hidden"
          >
            <div className="p-8 border-b border-gray-50 flex items-center justify-between">
              <div>
                <h3 className="text-2xl font-bold tracking-tight text-gray-900">Add Member</h3>
              </div>
              <button 
                onClick={onClose}
                className="p-2 hover:bg-gray-50 rounded-xl text-gray-400 hover:text-primary transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-8 space-y-6">
              <div className="space-y-2">
                <label className="text-xs font-semibold text-gray-500 ml-1">Username</label>
                <div className="relative">
                  <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input 
                    required
                    autoFocus
                    type="text"
                    placeholder="e.g. janesmith"
                    value={newMember.username}
                    onChange={(e) => setNewMember(prev => ({ ...prev, username: e.target.value }))}
                    className="w-full pl-11 pr-5 py-4 bg-gray-50 border border-transparent rounded-2xl text-sm font-medium focus:bg-white focus:border-primary outline-none transition-all"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-semibold text-gray-500 ml-1">Role</label>
                <div className="relative group">
                  <select 
                    required
                    value={newMember.role}
                    onChange={(e) => setNewMember(prev => ({ ...prev, role: e.target.value as any }))}
                    className="w-full px-5 py-4 bg-gray-50 border border-transparent rounded-2xl text-sm font-medium focus:bg-white focus:border-primary outline-none transition-all appearance-none cursor-pointer"
                  >
                    <option value="Contributor">Contributor</option>
                    <option value="Editor">Editor</option>
                    <option value="Admin">Admin</option>
                  </select>
                  <div className="absolute right-5 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400 group-hover:text-primary transition-colors">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>
                </div>
              </div>

              <div className="pt-4 flex gap-4">
                <button 
                  type="button"
                  onClick={onClose}
                  className="flex-1 py-4 rounded-2xl font-semibold text-sm text-gray-400 hover:text-gray-900 transition-all"
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  className="flex-1 bg-gray-900 text-white py-4 rounded-2xl font-semibold text-sm hover:bg-primary transition-all"
                >
                  Add Member
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useTeamContext } from './TeamContext';
import { ArrowLeft, Save, User, Mail, Link as LinkIcon, FileText } from 'lucide-react';
import UnsavedChangesModal from '../../common/UnsavedChangesModal';
import useUnsavedChangesProtection from '../../../hooks/useUnsavedChangesProtection';

export default function EditUserPage() {
  const { userId } = useParams();
  const navigate = useNavigate();
  const { getMember, updateMember } = useTeamContext();
  
  const member = getMember(userId || '');
  
  const [formData, setFormData] = useState({
    name: '',
    username: '',
    role: 'Contributor' as any,
    bio: '',
    socialLink: '',
    avatar: ''
  });

  const [initialFormData, setInitialFormData] = useState<typeof formData | null>(null);
  const isSavedRef = useRef(false);

  useEffect(() => {
    if (member && !initialFormData) {
      const initial = {
        name: member.name,
        username: member.username,
        role: member.role,
        bio: member.bio || '',
        socialLink: member.socialLink || '',
        avatar: member.avatar
      };
      setFormData(initial);
      setInitialFormData(initial);
    }
  }, [member, initialFormData]);

  const checkIsDirty = useCallback(() => {
    if (isSavedRef.current || !initialFormData) return false;
    return JSON.stringify(formData) !== JSON.stringify(initialFormData);
  }, [formData, initialFormData]);

  const { showModal, handleConfirm, handleCancel } = useUnsavedChangesProtection(checkIsDirty);

  if (!member) {
    return (
      <div className="p-12 text-center">
        <h2 className="text-2xl font-bold">User not found</h2>
        <button 
          onClick={() => navigate('/dashboard/team')}
          className="mt-4 text-primary font-bold hover:underline"
        >
          Back to Team
        </button>
      </div>
    );
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    isSavedRef.current = true;
    updateMember(member.id, formData);
    navigate('/dashboard/team');
  };

  const handleChangeAvatar = () => {
    const newAvatar = `https://picsum.photos/seed/${Math.random()}/100/100`;
    setFormData(prev => ({ ...prev, avatar: newAvatar }));
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-12">
      <div className="flex items-center justify-between">
        <button 
          onClick={() => navigate('/dashboard/team')}
          className="flex items-center gap-2 text-gray-400 hover:text-gray-900 transition-colors font-medium group"
        >
          <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
          <span>Back to Team</span>
        </button>
        <h2 className="text-2xl font-bold tracking-tight text-gray-900">Edit Profile</h2>
      </div>

      <div className="bento-card p-10">
        <form onSubmit={handleSubmit} className="space-y-10">
          <div className="flex flex-col md:flex-row gap-12">
            {/* Avatar Section */}
            <div className="flex flex-col items-center gap-4 shrink-0">
              <div className="relative group">
                <div className="w-32 h-32 rounded-full overflow-hidden border-2 border-gray-100">
                  <img src={formData.avatar} alt={member.name} className="w-full h-full object-cover" />
                </div>
                <button 
                  type="button"
                  onClick={handleChangeAvatar}
                  className="absolute inset-0 bg-black/40 text-white opacity-0 group-hover:opacity-100 transition-opacity rounded-full flex items-center justify-center text-xs font-medium backdrop-blur-[2px]"
                >
                  Change
                </button>
              </div>
            </div>

            {/* Form Fields */}
            <div className="flex-1 space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-2">
                  <label className="text-xs font-semibold text-gray-500 ml-1">Full Name</label>
                  <div className="relative">
                    <User className="absolute left-5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input 
                      type="text"
                      value={formData.name}
                      onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                      className="w-full pl-12 pr-6 py-4 bg-gray-50 border border-transparent rounded-2xl text-sm font-medium focus:bg-white focus:border-primary outline-none transition-all"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-semibold text-gray-500 ml-1">Username</label>
                  <div className="relative">
                    <span className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400 font-medium text-sm">@</span>
                    <input 
                      type="text"
                      readOnly
                      value={formData.username}
                      className="w-full pl-10 pr-6 py-4 bg-gray-50 border border-transparent rounded-2xl text-sm font-medium outline-none transition-all opacity-50 cursor-not-allowed"
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-semibold text-gray-500 ml-1">Role</label>
                <div className="relative group">
                  <select 
                    disabled
                    value={formData.role}
                    className="w-full px-6 py-4 bg-gray-50 border border-transparent rounded-2xl text-sm font-medium outline-none transition-all appearance-none opacity-50 cursor-not-allowed"
                  >
                    <option value="Contributor">Contributor</option>
                    <option value="Editor">Editor</option>
                    <option value="Admin">Admin</option>
                  </select>
                  <div className="absolute right-6 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-semibold text-gray-500 ml-1">961 Social Link</label>
                <div className="relative">
                  <LinkIcon className="absolute left-5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input 
                    type="url"
                    placeholder="https://961.com/username"
                    value={formData.socialLink}
                    onChange={(e) => setFormData(prev => ({ ...prev, socialLink: e.target.value }))}
                    className="w-full pl-12 pr-6 py-4 bg-gray-50 border border-transparent rounded-2xl text-sm font-medium focus:bg-white focus:border-primary outline-none transition-all"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-semibold text-gray-500 ml-1">Bio</label>
                <div className="relative">
                  <FileText className="absolute left-5 top-6 w-4 h-4 text-gray-400" />
                  <textarea 
                    rows={4}
                    placeholder="Tell us about this team member..."
                    value={formData.bio}
                    onChange={(e) => setFormData(prev => ({ ...prev, bio: e.target.value }))}
                    className="w-full pl-12 pr-6 py-4 bg-gray-50 border border-transparent rounded-2xl text-sm font-medium focus:bg-white focus:border-primary outline-none transition-all resize-none"
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="pt-8 border-t border-gray-50 flex justify-end">
            <button 
              type="submit"
              className="bg-gray-900 text-white px-10 py-4 rounded-2xl font-bold text-sm hover:bg-primary transition-all flex items-center gap-2"
            >
              <Save className="w-4 h-4" />
              <span>Save Changes</span>
            </button>
          </div>
        </form>
      </div>

      <UnsavedChangesModal
        isOpen={showModal}
        onConfirm={handleConfirm}
        onCancel={handleCancel}
      />
    </div>
  );
}

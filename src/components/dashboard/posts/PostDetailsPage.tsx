import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { usePostContext } from './PostContext';
import UnsavedChangesModal from '../../common/UnsavedChangesModal';
import useUnsavedChangesProtection from '../../../hooks/useUnsavedChangesProtection';
import { 
  ArrowLeft, 
  Eye, 
  Send, 
  Clock, 
  Trash2, 
  CheckCircle, 
  Edit3, 
  Calendar, 
  FileText, 
  TrendingUp, 
  Share2, 
  AlertCircle 
} from 'lucide-react';

export default function PostDetailsPage() {
  const { postId } = useParams();
  const navigate = useNavigate();
  const { getPost, updatePost, deletePost } = usePostContext();

  const post = getPost(postId || '');
  const [isEditingQuick, setIsEditingQuick] = useState(false);
  const [quickForm, setQuickForm] = useState({
    title: '',
    category: '',
    status: 'Draft' as any,
    views: '',
    shares: ''
  });

  const [initialQuickForm, setInitialQuickForm] = useState<typeof quickForm | null>(null);
  const isSavedRef = useRef(false);

  // Load state
  useEffect(() => {
    if (post) {
      const initial = {
        title: post.title,
        category: post.category,
        status: post.status,
        views: post.views,
        shares: post.shares
      };
      setQuickForm(initial);
      if (isEditingQuick && !initialQuickForm) {
        setInitialQuickForm(initial);
      }
    }
  }, [post, isEditingQuick, initialQuickForm]);

  useEffect(() => {
    if (isEditingQuick && post && !initialQuickForm) {
      setInitialQuickForm({
        title: quickForm.title || post.title,
        category: quickForm.category || post.category,
        status: quickForm.status || post.status,
        views: quickForm.views || post.views,
        shares: quickForm.shares || post.shares
      });
    } else if (!isEditingQuick) {
      setInitialQuickForm(null);
      isSavedRef.current = false;
    }
  }, [isEditingQuick, post, quickForm, initialQuickForm]);

  const checkIsDirty = useCallback(() => {
    if (!isEditingQuick || isSavedRef.current || !initialQuickForm) return false;
    return JSON.stringify(quickForm) !== JSON.stringify(initialQuickForm);
  }, [isEditingQuick, quickForm, initialQuickForm]);

  const { showModal, handleConfirm, handleCancel } = useUnsavedChangesProtection(checkIsDirty);

  if (!post) {
    return (
      <div className="max-w-xl mx-auto p-12 text-center bg-white border border-gray-200 rounded-xl space-y-4">
        <AlertCircle className="w-12 h-12 text-red-500 mx-auto" />
        <h2 className="text-lg font-semibold text-gray-900">Post not found</h2>
        <p className="text-xs text-gray-500">The post might have been removed or the link is broken.</p>
        <button 
          onClick={() => navigate('/dashboard/posts')}
          className="bg-gray-900 text-white px-4 py-2 rounded-xl text-xs font-semibold hover:bg-primary transition-all"
        >
          Back to Posts List
        </button>
      </div>
    );
  }

  const handleQuickSave = (e: React.FormEvent) => {
    e.preventDefault();
    isSavedRef.current = true;
    updatePost(post.id, {
      title: quickForm.title,
      category: quickForm.category,
      status: quickForm.status,
      views: quickForm.views,
      shares: quickForm.shares
    });
    setIsEditingQuick(false);
  };

  const handleDelete = () => {
    const ok = confirm('Are you sure you want to delete this post?');
    if (ok) {
      deletePost(post.id);
      navigate('/dashboard/posts');
    }
  };

  // Generate mockup stats daily data points for elegant SVG trend lines
  const viewsTrend = [120, 240, 310, 480, 720, 950, 1100, 1050, 1250, 1500, 1850, 1920, 2300, 2600, 3200];
  const maxVal = Math.max(...viewsTrend);
  const minVal = Math.min(...viewsTrend);
  const points = viewsTrend.map((val, i) => {
    const x = (i / (viewsTrend.length - 1)) * 100; // percent
    const y = 100 - ((val - minVal) / (maxVal - minVal)) * 80 - 10; // offset
    return `${x},${y}`;
  }).join(' ');

  const postAuthors = Array.isArray(post.author) ? post.author : [post.author];

  return (
    <div className="max-w-5xl mx-auto space-y-6 pb-12 font-sans text-gray-900">
      
      {/* Upper Navigation and Core Action Bar */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <button 
          onClick={() => navigate('/dashboard/posts')}
          className="flex items-center gap-2 text-gray-500 hover:text-gray-900 transition-colors text-xs font-semibold group"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          <span>Back to Posts</span>
        </button>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsEditingQuick(!isEditingQuick)}
            className="flex items-center gap-1.5 px-4 py-2 border border-gray-200 hover:bg-gray-50 rounded-xl text-xs font-semibold text-gray-700 transition-all"
          >
            <Edit3 className="w-3.5 h-3.5" />
            <span>{isEditingQuick ? 'Cancel Edit' : 'Edit Post'}</span>
          </button>
          
          <button
            onClick={handleDelete}
            className="flex items-center gap-1.5 px-4 py-2 border border-transparent bg-red-50 text-red-600 hover:bg-red-100 rounded-xl text-xs font-semibold transition-all"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>Delete</span>
          </button>
        </div>
      </div>

      {/* Main Grid: Left for content & analytics; Right for Quick Actions & Metadata */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Column (Content & Visuals) */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Main Cover Card */}
          <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
            {/* Aspect frame with status badge overlay */}
            <div className="relative aspect-video w-full max-h-[300px] bg-gray-50">
              <img src={post.image} alt={post.title} className="w-full h-full object-cover" />
              <div className="absolute top-4 left-4 flex gap-2">
                <span className="bg-white/95 text-gray-900 backdrop-blur px-2.5 py-1 rounded-lg text-[10px] font-bold border border-gray-100 uppercase tracking-wider">
                  {post.category}
                </span>
                <span className={`px-2.5 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wider border backdrop-blur ${
                  post.status === 'Published' 
                    ? 'bg-green-50/95 text-green-600 border-green-200' 
                    : post.status === 'Draft'
                    ? 'bg-gray-50/95 text-gray-500 border-gray-200'
                    : 'bg-orange-50/95 text-orange-600 border-orange-200'
                }`}>
                  {post.status}
                </span>
              </div>
            </div>

            {/* Title / Authors description block */}
            <div className="p-6 space-y-4">
              <h1 className="text-xl font-semibold tracking-tight text-gray-900 leading-snug">
                {post.title}
              </h1>

              <div className="flex flex-wrap items-center gap-4 text-xs text-gray-400 border-t border-gray-50 pt-4">
                <div className="flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5" />
                  <span>{post.date} at {post.time}</span>
                </div>
                {post.isEdited && (
                  <div className="text-amber-600 flex items-center gap-1 bg-amber-50 px-2 py-0.5 rounded text-[10px] font-semibold border border-amber-100">
                    <span>Edited on {post.editDate} at {post.editTime}</span>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Quick Editing Box */}
          {isEditingQuick && (
            <div className="bg-white p-6 border border-gray-200 rounded-xl space-y-4">
              <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Quick Edit Details</h3>
              <form onSubmit={handleQuickSave} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-[10px] font-semibold text-gray-400">Post Title</label>
                    <input 
                      type="text"
                      value={quickForm.title}
                      onChange={(e) => setQuickForm(p => ({ ...p, title: e.target.value }))}
                      className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-xs font-semibold outline-none focus:bg-white focus:border-primary"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-semibold text-gray-400">Category</label>
                    <select 
                      value={quickForm.category}
                      onChange={(e) => setQuickForm(p => ({ ...p, category: e.target.value }))}
                      className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-xs font-semibold outline-none focus:bg-white focus:border-primary"
                    >
                      <option value="News">News</option>
                      <option value="Lifestyle">Lifestyle</option>
                      <option value="Food & Drink">Food & Drink</option>
                      <option value="Travel">Travel</option>
                      <option value="Diaspora">Diaspora</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="space-y-1">
                    <label className="text-[10px] font-semibold text-gray-400">Status</label>
                    <select 
                      value={quickForm.status}
                      onChange={(e) => setQuickForm(p => ({ ...p, status: e.target.value as any }))}
                      className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-xs font-semibold outline-none focus:bg-white focus:border-primary"
                    >
                      <option value="Draft">Draft</option>
                      <option value="Published">Published</option>
                      <option value="Scheduled">Scheduled</option>
                      <option value="Review">Review</option>
                    </select>
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-semibold text-gray-400">Views</label>
                    <input 
                      type="text"
                      value={quickForm.views}
                      onChange={(e) => setQuickForm(p => ({ ...p, views: e.target.value }))}
                      className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-xs font-semibold outline-none focus:bg-white"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-semibold text-gray-400">Shares</label>
                    <input 
                      type="text"
                      value={quickForm.shares}
                      onChange={(e) => setQuickForm(p => ({ ...p, shares: e.target.value }))}
                      className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-xs font-semibold outline-none focus:bg-white"
                    />
                  </div>
                </div>

                <div className="flex justify-end gap-2 pt-2">
                  <button 
                    type="button" 
                    onClick={() => setIsEditingQuick(false)}
                    className="px-3.5 py-1.5 text-xs font-semibold border border-gray-200 rounded-lg text-gray-500 hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                  <button 
                    type="submit" 
                    className="px-3.5 py-1.5 text-xs font-semibold bg-gray-900 text-white rounded-lg hover:bg-primary transition-all"
                  >
                    Save Changes
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* Stats Analytics Dashboard for Post */}
          <div className="bg-white border border-gray-200 rounded-xl p-6 space-y-6">
            <div className="flex items-center justify-between border-b border-gray-100 pb-3">
              <h3 className="text-sm font-semibold text-gray-900">Post Analytics</h3>
              <span className="text-[10px] font-medium text-gray-400">Last 14 Days trend</span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div className="p-3 bg-gray-50 rounded-xl border border-gray-100">
                <span className="text-[10px] font-medium text-gray-400 block">Total Views</span>
                <span className="text-base font-semibold text-gray-900 mt-1 block">{post.views}</span>
              </div>
              <div className="p-3 bg-gray-50 rounded-xl border border-gray-100">
                <span className="text-[10px] font-medium text-gray-400 block">Total Shares</span>
                <span className="text-base font-semibold text-gray-900 mt-1 block">{post.shares}</span>
              </div>
              <div className="p-3 bg-gray-50 rounded-xl border border-gray-100">
                <span className="text-[10px] font-medium text-gray-400 block">Avg Read Time</span>
                <span className="text-base font-semibold text-gray-900 mt-1 block">2.4m</span>
              </div>
              <div className="p-3 bg-gray-50 rounded-xl border border-gray-100">
                <span className="text-[10px] font-medium text-gray-400 block">Engagement</span>
                <span className="text-base font-semibold text-gray-900 mt-1 block">82.4%</span>
              </div>
            </div>

            {/* Performance SVG Chart */}
            <div className="space-y-2">
              <span className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider block">Traffic views progression</span>
              <div className="relative h-28 bg-gray-50/50 rounded-lg p-2 border border-gray-100">
                <svg className="w-full h-full overflow-visible" preserveAspectRatio="none" viewBox="0 0 100 100">
                  {/* Subtle Grid Lines */}
                  <line x1="0" y1="20" x2="100" y2="20" stroke="#f1f3f5" strokeWidth="0.5" />
                  <line x1="0" y1="50" x2="100" y2="50" stroke="#f1f3f5" strokeWidth="0.5" />
                  <line x1="0" y1="80" x2="100" y2="80" stroke="#f1f3f5" strokeWidth="0.5" />
                  
                  {/* Glowing line shadow */}
                  <polyline
                    fill="none"
                    stroke="#fee2e2"
                    strokeWidth="4"
                    points={points}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  {/* Active Primary Line */}
                  <polyline
                    fill="none"
                    stroke="#FF0000"
                    strokeWidth="1.5"
                    points={points}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
                <div className="absolute bottom-1.5 left-2.5 right-2.5 flex justify-between text-[8px] font-bold text-gray-400 uppercase">
                  <span>Day 1</span>
                  <span>Today</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Post Metadata & Editorial Actions */}
        <div className="space-y-6">
          
          {/* Authors List Card */}
          <div className="bg-white p-5 border border-gray-200 rounded-xl space-y-3.5">
            <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider border-b border-gray-50 pb-2">Editorial Team</h3>
            <div className="space-y-3">
              {postAuthors.map((authorName, i) => (
                <div key={i} className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-gray-100 border border-gray-200 flex items-center justify-center text-xs font-bold text-gray-700">
                    {authorName.charAt(0)}
                  </div>
                  <div>
                    <h5 className="text-xs font-semibold text-gray-900 leading-snug">{authorName}</h5>
                    <p className="text-[10px] font-medium text-gray-400">Contributor</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Detailed Metadata Summary */}
          <div className="bg-white p-5 border border-gray-200 rounded-xl space-y-3">
            <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider border-b border-gray-50 pb-2">Metadata Summary</h3>
            <table className="w-full text-xs">
              <tbody className="divide-y divide-gray-100">
                <tr>
                  <td className="py-2 text-gray-400 font-medium">Post ID</td>
                  <td className="py-2 text-gray-900 font-semibold text-right text-[11px] font-mono">{post.id}</td>
                </tr>
                <tr>
                  <td className="py-2 text-gray-400 font-medium">Status</td>
                  <td className="py-2 font-semibold text-right">
                    <span className={`text-[10px] font-bold uppercase tracking-wider ${
                      post.status === 'Published' ? 'text-green-600' : 'text-gray-500'
                    }`}>{post.status}</span>
                  </td>
                </tr>
                <tr>
                  <td className="py-2 text-gray-400 font-medium">Topic Channel</td>
                  <td className="py-2 text-gray-900 font-semibold text-right">{post.category}</td>
                </tr>
                <tr>
                  <td className="py-2 text-gray-400 font-medium">Word Count</td>
                  <td className="py-2 text-gray-900 font-semibold text-right">485 words</td>
                </tr>
                <tr>
                  <td className="py-2 text-gray-400 font-medium">Readability Score</td>
                  <td className="py-2 text-gray-900 font-semibold text-right">Flesch 82.4</td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* Audit / Action Log Card */}
          <div className="bg-white p-5 border border-gray-200 rounded-xl space-y-4">
            <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider border-b border-gray-50 pb-2">Activity Audit Trail</h3>
            
            <div className="space-y-4">
              <div className="flex gap-3 items-start">
                <div className="w-5 h-5 rounded-full bg-green-50 border border-green-200 flex items-center justify-center shrink-0 mt-0.5">
                  <CheckCircle className="w-3 h-3 text-green-600" />
                </div>
                <div className="min-w-0">
                  <p className="text-xs text-gray-800 font-medium">Post status changed to <span className="font-semibold">{post.status}</span></p>
                  <span className="text-[9px] text-gray-400">By Admin • {post.date}</span>
                </div>
              </div>

              <div className="flex gap-3 items-start">
                <div className="w-5 h-5 rounded-full bg-blue-50 border border-blue-200 flex items-center justify-center shrink-0 mt-0.5">
                  <FileText className="w-3 h-3 text-blue-600" />
                </div>
                <div className="min-w-0">
                  <p className="text-xs text-gray-800 font-medium">Post entry initialized in CMS</p>
                  <span className="text-[9px] text-gray-400">By System • Mar 22, 2026</span>
                </div>
              </div>
            </div>
          </div>

        </div>

      </div>

      <UnsavedChangesModal
        isOpen={showModal}
        onConfirm={handleConfirm}
        onCancel={handleCancel}
      />
    </div>
  );
}

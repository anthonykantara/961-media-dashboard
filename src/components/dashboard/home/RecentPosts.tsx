import { usePostContext } from '../posts/PostContext';
import { useNavigate } from 'react-router-dom';

export default function RecentPosts() {
  const { posts } = usePostContext();
  const navigate = useNavigate();

  const recentList = posts.slice(0, 8);

  return (
    <div className="bg-white p-6 rounded-xl border border-gray-100 flex flex-col h-auto">
      <div className="flex items-center justify-between mb-5 shrink-0">
        <h3 className="text-base font-semibold text-gray-900">Recent Posts</h3>
        <button 
          onClick={() => navigate('/dashboard/posts')} 
          className="text-xs font-semibold text-primary hover:underline cursor-pointer border-0 bg-transparent"
        >
          View all
        </button>
      </div>
      <div className="space-y-5">
        {recentList.map((post) => (
          <div 
            key={post.id} 
            onClick={() => navigate(`/dashboard/posts/${post.id}`)}
            className="flex items-center gap-4 group cursor-pointer border-b border-gray-50 pb-3 last:border-b-0 last:pb-0"
          >
            <div className="w-12 h-12 rounded-lg bg-gray-100 overflow-hidden shrink-0 border border-gray-100">
              <img 
                src={post.image || 'https://images.unsplash.com/photo-1545569341-9eb8b30979d9?auto=format&fit=crop&w=200&h=200&q=80'} 
                alt={post.title} 
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
                referrerPolicy="no-referrer"
              />
            </div>
            <div className="flex-1 min-w-0">
              <h4 className="text-xs font-semibold text-gray-900 group-hover:text-primary transition-colors line-clamp-2 leading-snug">
                {post.title}
              </h4>
              <p className="text-[10px] font-medium text-gray-400 mt-1">
                {post.date} • {post.category}
              </p>
            </div>
            <div className="text-right shrink-0">
              <p className="text-sm font-semibold text-gray-900 tracking-tight">{post.views || '0.0k'}</p>
              <p className="text-[10px] font-medium text-gray-400">Views</p>
            </div>
          </div>
        ))}

        {recentList.length === 0 && (
          <div className="py-8 text-center text-gray-400 text-xs italic">
            No recent posts found
          </div>
        )}
      </div>
    </div>
  );
}

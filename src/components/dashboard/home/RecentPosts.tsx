interface RecentPostProps {
  index: number;
}

export default function RecentPosts() {
  const posts = [1, 2, 3, 4, 5, 6, 7, 8];
  
  return (
    <div className="bg-white p-6 rounded-xl border border-gray-100 flex flex-col h-auto">
      <h3 className="text-base font-semibold text-gray-900 mb-5 shrink-0">Recent Posts</h3>
      <div className="space-y-5">
        {posts.map((i) => (
          <div key={i} className="flex items-center gap-4 group cursor-pointer border-b border-gray-50 pb-3 last:border-b-0 last:pb-0">
            <div className="w-12 h-12 rounded-lg bg-gray-100 overflow-hidden shrink-0 border border-gray-100">
              <img 
                src={`https://picsum.photos/seed/post-${i}/200/200`} 
                alt="Post" 
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
                referrerPolicy="no-referrer"
              />
            </div>
            <div className="flex-1 min-w-0">
              <h4 className="text-xs font-semibold text-gray-900 group-hover:text-primary transition-colors line-clamp-2 leading-snug">
                {i % 4 === 1 ? "Lebanon's Tech Scene is Booming in 2026: A New Era of Innovation" : 
                 i % 4 === 2 ? "The Best Rooftop Bars in Beirut for the Perfect Summer Sunset" :
                 i % 4 === 3 ? "How the Diaspora is Shaping Lebanon's Future Economy" :
                 "10 Hidden Gems in the Mountains You Need to Visit This Weekend"}
              </h4>
              <p className="text-[10px] font-medium text-gray-400 mt-1">2h ago • News</p>
            </div>
            <div className="text-right shrink-0">
              <p className="text-sm font-semibold text-gray-900 tracking-tight">12.4k</p>
              <p className="text-[10px] font-medium text-gray-400">Views</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

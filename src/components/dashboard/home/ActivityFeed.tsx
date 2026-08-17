export default function ActivityFeed() {
  const activities = [
    { name: 'Sarah Khoury', action: 'published', target: "Lebanon's Tech Scene is Booming", time: '10m' },
    { name: 'John Doe', action: 'updated category', target: 'Lifestyle', time: '45m' },
    { name: 'Jane Smith', action: 'uploaded', target: '12 new images', time: '1h' },
    { name: 'Anthony Rahayel', action: 'became a member', target: '', time: '3h' },
    { name: 'Michel Aoun', action: 'edited', target: 'Mountain Gems', time: '5h' },
    { name: 'Nadine Labaki', action: 'published', target: 'Beirut Sunsets', time: '6h' },
    { name: 'Fairuz', action: 'commented on', target: 'Diaspora Future', time: '8h' },
    { name: 'Ziad Rahbani', action: 'shared', target: 'Tech Scene', time: '12h' },
  ];

  return (
    <div className="bg-white p-6 rounded-xl border border-gray-100 flex flex-col h-auto">
      <h3 className="text-base font-semibold text-gray-900 mb-5 shrink-0">Activity</h3>
      <div className="space-y-4">
        {activities.map((activity, i) => (
          <div key={i} className="flex items-center gap-3 border-b border-gray-50 pb-3 last:border-b-0 last:pb-0">
            <div className="w-8 h-8 rounded-full bg-gray-100 overflow-hidden shrink-0 border border-gray-100">
              <img 
                src={`https://picsum.photos/seed/user-${i}/100/100`} 
                alt="User" 
                className="w-full h-full object-cover" 
                referrerPolicy="no-referrer"
              />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs text-gray-500 leading-normal">
                <span className="font-semibold text-gray-900">{activity.name}</span> {activity.action} {activity.target && <span className="font-semibold text-primary">"{activity.target}"</span>}
              </p>
            </div>
            <div className="shrink-0 text-[10px] font-medium text-gray-400">
              {activity.time}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

import StatCard from './home/StatCard';
import RecentPosts from './home/RecentPosts';
import ActivityFeed from './home/ActivityFeed';
import { DashboardPageSkeleton } from '../common/Skeletons';
import { usePostContext } from './posts/PostContext';

export default function DashboardHome({ isLoading = false }: { isLoading?: boolean }) {
  const { posts } = usePostContext();

  if (isLoading) {
    return <DashboardPageSkeleton />;
  }

  const totalPostsCount = posts.length;

  const totalViewsNum = posts.reduce((acc, p) => {
    if (!p.views) return acc;
    const vStr = String(p.views).toLowerCase().trim();
    if (vStr.endsWith('k')) {
      return acc + parseFloat(vStr.replace('k', '')) * 1000;
    } else if (vStr.endsWith('m')) {
      return acc + parseFloat(vStr.replace('m', '')) * 1000000;
    }
    return acc + (parseFloat(vStr) || 0);
  }, 0);

  const formattedViews = totalViewsNum >= 1000000
    ? `${(totalViewsNum / 1000000).toFixed(1)}M`
    : totalViewsNum >= 1000
    ? `${(totalViewsNum / 1000).toFixed(1)}k`
    : `${totalViewsNum}`;

  return (
    <div className="max-w-[1200px] mx-auto space-y-10 pb-12">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <StatCard 
          label="Posts" 
          value={totalPostsCount.toLocaleString()} 
          change="12" 
        />
        <StatCard 
          label="Views" 
          value={formattedViews || '0'} 
          change="24" 
        />
        <StatCard 
          label="Engagement" 
          value="4.2%" 
          change="8" 
        />
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <RecentPosts />
        <ActivityFeed />
      </div>
    </div>
  );
}


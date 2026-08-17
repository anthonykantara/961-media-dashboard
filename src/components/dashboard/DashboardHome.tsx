import StatCard from './home/StatCard';
import RecentPosts from './home/RecentPosts';
import ActivityFeed from './home/ActivityFeed';
import { DashboardPageSkeleton } from '../common/Skeletons';

export default function DashboardHome({ isLoading = false }: { isLoading?: boolean }) {
  if (isLoading) {
    return <DashboardPageSkeleton />;
  }

  return (
    <div className="max-w-[1200px] mx-auto space-y-10 pb-12">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <StatCard 
          label="Posts" 
          value="1,284" 
          change="12" 
        />
        <StatCard 
          label="Views" 
          value="842.5k" 
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


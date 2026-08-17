import React, { useState } from 'react';
import { 
  Globe, 
  Smartphone, 
  Search, 
  Share2, 
  Sparkles, 
  TrendingUp, 
  TrendingDown,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from 'recharts';

const deviceData = [
  { name: 'Mobile', value: 72 },
  { name: 'Desktop', value: 24 },
  { name: 'Tablet', value: 4 },
];

const COLORS = ['#FF0000', '#000000', '#666666', '#999999', '#CCCCCC'];

interface MetricCardProps {
  label: string;
  value: string;
  change: number;
  key?: React.Key;
}

function MetricCard({ label, value, change }: MetricCardProps) {
  const isPositive = change > 0;
  return (
    <div className="bento-card p-8 group relative overflow-hidden">
      <div className="relative z-10">
        <p className="text-[11px] font-medium text-gray-400 tracking-wider mb-2">{label}</p>
        <h3 className="text-4xl font-bold tracking-tight text-gray-900 leading-none mb-3">{value}</h3>
        <div className={`inline-flex items-center gap-1 text-[11px] font-semibold px-2.5 py-1 rounded-full ${isPositive ? 'text-green-600 bg-green-50' : 'text-red-600 bg-red-50'}`}>
          {isPositive ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
          <span>{Math.abs(change)}%</span>
        </div>
      </div>
    </div>
  );
}

const PERIOD_OPTIONS = ['30 days', 'Last month', 'This year', 'Last year'];

const topMetricsMap: Record<string, Array<{ label: string; value: string; change: number }>> = {
  '30 days': [
    { label: 'Views', value: '9.8M', change: 15.2 },
    { label: 'Avg. Session', value: '4m 25s', change: 4.8 },
    { label: 'Users', value: '342k', change: 22.1 },
    { label: 'Pages/User', value: '4.1', change: 8.5 },
  ],
  'Last month': [
    { label: 'Views', value: '8.9M', change: 12.0 },
    { label: 'Avg. Session', value: '4m 10s', change: 3.2 },
    { label: 'Users', value: '310k', change: 18.4 },
    { label: 'Pages/User', value: '3.9', change: 6.1 },
  ],
  'This year': [
    { label: 'Views', value: '78.4M', change: 28.5 },
    { label: 'Avg. Session', value: '4m 45s', change: 9.1 },
    { label: 'Users', value: '2.8M', change: 34.2 },
    { label: 'Pages/User', value: '4.5', change: 12.0 },
  ],
  'Last year': [
    { label: 'Views', value: '62.1M', change: 19.0 },
    { label: 'Avg. Session', value: '4m 15s', change: 5.0 },
    { label: 'Users', value: '2.1M', change: 21.0 },
    { label: 'Pages/User', value: '4.0', change: 7.2 },
  ],
};

const trafficDataMap: Record<string, any[]> = {
  'Hour': [
    { name: '00:00', views: 4000 }, { name: '04:00', views: 3000 }, { name: '08:00', views: 2000 },
    { name: '12:00', views: 2780 }, { name: '16:00', views: 1890 }, { name: '20:00', views: 2390 },
    { name: '23:59', views: 3490 },
  ],
  'Week': [
    { name: 'Mon', views: 24000 }, { name: 'Tue', views: 18000 }, { name: 'Wed', views: 22000 },
    { name: 'Thu', views: 27000 }, { name: 'Fri', views: 31000 }, { name: 'Sat', views: 29000 },
    { name: 'Sun', views: 34000 },
  ],
  'Month': [
    { name: 'Jan', views: 640000 }, { name: 'Feb', views: 720000 }, { name: 'Mar', views: 840000 },
    { name: 'Apr', views: 790000 }, { name: 'May', views: 910000 }, { name: 'Jun', views: 880000 },
  ],
};

// Mock Data Maps for the Period Selectors
const teamPerformanceMap: Record<string, any[]> = {
  '30 days': [
    { name: 'Anthony Rahayel', views: '1.2M', posts: 124, avgViews: '9.6k', revenue: '$12,400', revPerPost: '$100', avatar: 'https://picsum.photos/seed/anthony/100/100' },
    { name: 'Sarah Khoury', views: '842k', posts: 86, avgViews: '9.7k', revenue: '$8,600', revPerPost: '$100', avatar: 'https://picsum.photos/seed/sarah/100/100' },
    { name: 'John Doe', views: '456k', posts: 52, avgViews: '8.7k', revenue: '$4,500', revPerPost: '$86', avatar: 'https://picsum.photos/seed/john/100/100' },
    { name: 'Jane Smith', views: '289k', posts: 41, avgViews: '7.0k', revenue: '$2,800', revPerPost: '$68', avatar: 'https://picsum.photos/seed/jane/100/100' },
    { name: 'Michael Abdo', views: '245k', posts: 38, avgViews: '6.4k', revenue: '$2,400', revPerPost: '$63', avatar: 'https://picsum.photos/seed/michael/100/100' },
    { name: 'Layla Haddad', views: '210k', posts: 32, avgViews: '6.5k', revenue: '$2,100', revPerPost: '$65', avatar: 'https://picsum.photos/seed/layla/100/100' },
    { name: 'Rami Zgheib', views: '185k', posts: 29, avgViews: '6.3k', revenue: '$1,850', revPerPost: '$63', avatar: 'https://picsum.photos/seed/rami/100/100' },
    { name: 'Nour Karam', views: '160k', posts: 25, avgViews: '6.4k', revenue: '$1,600', revPerPost: '$64', avatar: 'https://picsum.photos/seed/nour/100/100' },
    { name: 'Jad Sleiman', views: '140k', posts: 22, avgViews: '6.3k', revenue: '$1,400', revPerPost: '$63', avatar: 'https://picsum.photos/seed/jad/100/100' },
    { name: 'Maya Gemayel', views: '125k', posts: 20, avgViews: '6.2k', revenue: '$1,250', revPerPost: '$62', avatar: 'https://picsum.photos/seed/maya/100/100' },
    { name: 'Hassan Saleh', views: '95k', posts: 16, avgViews: '5.9k', revenue: '$950', revPerPost: '$59', avatar: 'https://picsum.photos/seed/hassan/100/100' },
    { name: 'Lea Chami', views: '80k', posts: 14, avgViews: '5.7k', revenue: '$800', revPerPost: '$57', avatar: 'https://picsum.photos/seed/lea/100/100' },
  ],
  'Last month': [
    { name: 'Anthony Rahayel', views: '1.05M', posts: 110, avgViews: '9.5k', revenue: '$11,000', revPerPost: '$100', avatar: 'https://picsum.photos/seed/anthony/100/100' },
    { name: 'Sarah Khoury', views: '890k', posts: 92, avgViews: '9.6k', revenue: '$9,200', revPerPost: '$100', avatar: 'https://picsum.photos/seed/sarah/100/100' },
    { name: 'John Doe', views: '420k', posts: 48, avgViews: '8.7k', revenue: '$4,100', revPerPost: '$85', avatar: 'https://picsum.photos/seed/john/100/100' },
    { name: 'Jane Smith', views: '240k', posts: 35, avgViews: '6.8k', revenue: '$2,300', revPerPost: '$65', avatar: 'https://picsum.photos/seed/jane/100/100' },
    { name: 'Michael Abdo', views: '195k', posts: 30, avgViews: '6.5k', revenue: '$1,900', revPerPost: '$63', avatar: 'https://picsum.photos/seed/michael/100/100' },
    { name: 'Layla Haddad', views: '180k', posts: 28, avgViews: '6.4k', revenue: '$1,800', revPerPost: '$64', avatar: 'https://picsum.photos/seed/layla/100/100' },
    { name: 'Rami Zgheib', views: '160k', posts: 25, avgViews: '6.4k', revenue: '$1,600', revPerPost: '$64', avatar: 'https://picsum.photos/seed/rami/100/100' },
    { name: 'Nour Karam', views: '140k', posts: 22, avgViews: '6.3k', revenue: '$1,400', revPerPost: '$63', avatar: 'https://picsum.photos/seed/nour/100/100' },
    { name: 'Jad Sleiman', views: '120k', posts: 19, avgViews: '6.3k', revenue: '$1,200', revPerPost: '$63', avatar: 'https://picsum.photos/seed/jad/100/100' },
    { name: 'Maya Gemayel', views: '110k', posts: 18, avgViews: '6.1k', revenue: '$1,100', revPerPost: '$61', avatar: 'https://picsum.photos/seed/maya/100/100' },
    { name: 'Hassan Saleh', views: '85k', posts: 14, avgViews: '6.0k', revenue: '$850', revPerPost: '$60', avatar: 'https://picsum.photos/seed/hassan/100/100' },
    { name: 'Lea Chami', views: '70k', posts: 12, avgViews: '5.8k', revenue: '$700', revPerPost: '$58', avatar: 'https://picsum.photos/seed/lea/100/100' },
  ],
  'This year': [
    { name: 'Anthony Rahayel', views: '8.9M', posts: 890, avgViews: '10.0k', revenue: '$89,000', revPerPost: '$100', avatar: 'https://picsum.photos/seed/anthony/100/100' },
    { name: 'Sarah Khoury', views: '6.2M', posts: 640, avgViews: '9.6k', revenue: '$64,000', revPerPost: '$100', avatar: 'https://picsum.photos/seed/sarah/100/100' },
    { name: 'John Doe', views: '3.8M', posts: 410, avgViews: '9.2k', revenue: '$38,000', revPerPost: '$92', avatar: 'https://picsum.photos/seed/john/100/100' },
    { name: 'Jane Smith', views: '2.4M', posts: 310, avgViews: '7.7k', revenue: '$24,000', revPerPost: '$77', avatar: 'https://picsum.photos/seed/jane/100/100' },
    { name: 'Michael Abdo', views: '2.1M', posts: 280, avgViews: '7.5k', revenue: '$21,000', revPerPost: '$75', avatar: 'https://picsum.photos/seed/michael/100/100' },
    { name: 'Layla Haddad', views: '1.8M', posts: 240, avgViews: '7.5k', revenue: '$18,000', revPerPost: '$75', avatar: 'https://picsum.photos/seed/layla/100/100' },
    { name: 'Rami Zgheib', views: '1.5M', posts: 200, avgViews: '7.5k', revenue: '$15,000', revPerPost: '$75', avatar: 'https://picsum.photos/seed/rami/100/100' },
    { name: 'Nour Karam', views: '1.3M', posts: 175, avgViews: '7.4k', revenue: '$13,000', revPerPost: '$74', avatar: 'https://picsum.photos/seed/nour/100/100' },
    { name: 'Jad Sleiman', views: '1.1M', posts: 150, avgViews: '7.3k', revenue: '$11,000', revPerPost: '$73', avatar: 'https://picsum.photos/seed/jad/100/100' },
    { name: 'Maya Gemayel', views: '950k', posts: 130, avgViews: '7.3k', revenue: '$9,500', revPerPost: '$73', avatar: 'https://picsum.photos/seed/maya/100/100' },
    { name: 'Hassan Saleh', views: '750k', posts: 105, avgViews: '7.1k', revenue: '$7,500', revPerPost: '$71', avatar: 'https://picsum.photos/seed/hassan/100/100' },
    { name: 'Lea Chami', views: '600k', posts: 88, avgViews: '6.8k', revenue: '$6,000', revPerPost: '$68', avatar: 'https://picsum.photos/seed/lea/100/100' },
  ],
  'Last year': [
    { name: 'Anthony Rahayel', views: '11.2M', posts: 1120, avgViews: '10.0k', revenue: '$112,000', revPerPost: '$100', avatar: 'https://picsum.photos/seed/anthony/100/100' },
    { name: 'Sarah Khoury', views: '7.5M', posts: 780, avgViews: '9.6k', revenue: '$78,000', revPerPost: '$100', avatar: 'https://picsum.photos/seed/sarah/100/100' },
    { name: 'John Doe', views: '4.8M', posts: 520, avgViews: '9.2k', revenue: '$48,000', revPerPost: '$92', avatar: 'https://picsum.photos/seed/john/100/100' },
    { name: 'Jane Smith', views: '3.1M', posts: 390, avgViews: '7.9k', revenue: '$31,000', revPerPost: '$79', avatar: 'https://picsum.photos/seed/jane/100/100' },
    { name: 'Michael Abdo', views: '2.6M', posts: 340, avgViews: '7.6k', revenue: '$26,000', revPerPost: '$76', avatar: 'https://picsum.photos/seed/michael/100/100' },
    { name: 'Layla Haddad', views: '2.2M', posts: 290, avgViews: '7.5k', revenue: '$22,000', revPerPost: '$75', avatar: 'https://picsum.photos/seed/layla/100/100' },
    { name: 'Rami Zgheib', views: '1.9M', posts: 250, avgViews: '7.6k', revenue: '$19,000', revPerPost: '$76', avatar: 'https://picsum.photos/seed/rami/100/100' },
    { name: 'Nour Karam', views: '1.6M', posts: 210, avgViews: '7.6k', revenue: '$16,000', revPerPost: '$76', avatar: 'https://picsum.photos/seed/nour/100/100' },
    { name: 'Jad Sleiman', views: '1.4M', posts: 185, avgViews: '7.5k', revenue: '$14,000', revPerPost: '$75', avatar: 'https://picsum.photos/seed/jad/100/100' },
    { name: 'Maya Gemayel', views: '1.2M', posts: 160, avgViews: '7.5k', revenue: '$12,000', revPerPost: '$75', avatar: 'https://picsum.photos/seed/maya/100/100' },
    { name: 'Hassan Saleh', views: '900k', posts: 125, avgViews: '7.2k', revenue: '$9,000', revPerPost: '$72', avatar: 'https://picsum.photos/seed/hassan/100/100' },
    { name: 'Lea Chami', views: '750k', posts: 105, avgViews: '7.1k', revenue: '$7,500', revPerPost: '$71', avatar: 'https://picsum.photos/seed/lea/100/100' },
  ],
};

const topSectionsMap: Record<string, any[]> = {
  '30 days': [
    { name: 'Breaking News', views: '842k', revenue: '$8,400' },
    { name: 'Lifestyle', views: '456k', revenue: '$4,500' },
    { name: 'Food & Drink', views: '289k', revenue: '$2,800' },
    { name: 'Travel', views: '156k', revenue: '$1,500' },
    { name: 'Diaspora', views: '98k', revenue: '$900' },
  ],
  'Last month': [
    { name: 'Breaking News', views: '790k', revenue: '$7,900' },
    { name: 'Food & Drink', views: '510k', revenue: '$5,100' },
    { name: 'Lifestyle', views: '410k', revenue: '$4,100' },
    { name: 'Travel', views: '180k', revenue: '$1,800' },
    { name: 'Diaspora', views: '110k', revenue: '$1,100' },
  ],
  'This year': [
    { name: 'Breaking News', views: '6.8M', revenue: '$68,000' },
    { name: 'Lifestyle', views: '3.9M', revenue: '$39,000' },
    { name: 'Food & Drink', views: '2.7M', revenue: '$27,000' },
    { name: 'Travel', views: '1.8M', revenue: '$18,000' },
    { name: 'Diaspora', views: '1.2M', revenue: '$12,000' },
  ],
  'Last year': [
    { name: 'Breaking News', views: '8.4M', revenue: '$84,000' },
    { name: 'Lifestyle', views: '4.8M', revenue: '$48,000' },
    { name: 'Food & Drink', views: '3.2M', revenue: '$32,000' },
    { name: 'Travel', views: '2.1M', revenue: '$21,000' },
    { name: 'Diaspora', views: '1.5M', revenue: '$15,000' },
  ],
};

const topArticlesMap: Record<string, any[]> = {
  '30 days': [
    { title: "Lebanon's Tech Scene is Booming", views: '42.4k', revenue: '$424' },
    { title: "Best Rooftop Bars in Beirut", views: '38.2k', revenue: '$382' },
    { title: "Diaspora Shaping Future", views: '31.5k', revenue: '$315' },
    { title: "Hidden Gems in the Mountains", views: '28.9k', revenue: '$289' },
    { title: "Summer Festivals 2026", views: '24.1k', revenue: '$241' },
    { title: "Culinary Revival in Byblos", views: '22.8k', revenue: '$228' },
    { title: "Cedar Reserves Conservation Drive", views: '21.4k', revenue: '$214' },
    { title: "Beirut Art Fair Highlights", views: '19.8k', revenue: '$198' },
    { title: "Ancient Ruins of Baalbek Guide", views: '18.3k', revenue: '$183' },
    { title: "Local Farmers Organic Revolution", views: '17.1k', revenue: '$171' },
    { title: "Co-Working Spaces in Ashrafieh", views: '15.9k', revenue: '$159' },
    { title: "Mediterranean Sunset Spots", views: '14.2k', revenue: '$142' },
    { title: "Traditional Lebanese Bakery Guide", views: '13.0k', revenue: '$130' },
    { title: "Top Wineries in the Bekaa Valley", views: '12.5k', revenue: '$125' },
    { title: "Hiking Trails of Kadisha Valley", views: '11.8k', revenue: '$118' },
  ],
  'Last month': [
    { title: "Best Rooftop Bars in Beirut", views: '45.1k', revenue: '$451' },
    { title: "Lebanon's Tech Scene is Booming", views: '39.8k', revenue: '$398' },
    { title: "Summer Festivals 2026", views: '34.2k', revenue: '$342' },
    { title: "Culinary Revival in Byblos", views: '29.5k', revenue: '$295' },
    { title: "Diaspora Shaping Future", views: '25.8k', revenue: '$258' },
    { title: "Beirut Art Fair Highlights", views: '23.4k', revenue: '$234' },
    { title: "Cedar Reserves Conservation Drive", views: '22.1k', revenue: '$221' },
    { title: "Hidden Gems in the Mountains", views: '20.6k', revenue: '$206' },
    { title: "Ancient Ruins of Baalbek Guide", views: '19.2k', revenue: '$192' },
    { title: "Top Wineries in the Bekaa Valley", views: '18.0k', revenue: '$180' },
    { title: "Local Farmers Organic Revolution", views: '16.5k', revenue: '$165' },
    { title: "Co-Working Spaces in Ashrafieh", views: '15.1k', revenue: '$151' },
    { title: "Mediterranean Sunset Spots", views: '13.8k', revenue: '$138' },
    { title: "Traditional Lebanese Bakery Guide", views: '12.9k', revenue: '$129' },
    { title: "Hiking Trails of Kadisha Valley", views: '11.4k', revenue: '$114' },
  ],
  'This year': [
    { title: "Lebanon's Tech Scene is Booming", views: '380k', revenue: '$3,800' },
    { title: "Best Rooftop Bars in Beirut", views: '310k', revenue: '$3,100' },
    { title: "Summer Festivals 2026", views: '270k', revenue: '$2,700' },
    { title: "Diaspora Shaping Future", views: '240k', revenue: '$2,400' },
    { title: "Hidden Gems in the Mountains", views: '210k', revenue: '$2,100' },
    { title: "Culinary Revival in Byblos", views: '195k', revenue: '$1,950' },
    { title: "Cedar Reserves Conservation Drive", views: '180k', revenue: '$1,800' },
    { title: "Beirut Art Fair Highlights", views: '165k', revenue: '$1,650' },
    { title: "Ancient Ruins of Baalbek Guide", views: '150k', revenue: '$1,500' },
    { title: "Top Wineries in the Bekaa Valley", views: '140k', revenue: '$1,400' },
    { title: "Local Farmers Organic Revolution", views: '130k', revenue: '$1,300' },
    { title: "Co-Working Spaces in Ashrafieh", views: '120k', revenue: '$1,200' },
    { title: "Mediterranean Sunset Spots", views: '110k', revenue: '$1,100' },
    { title: "Traditional Lebanese Bakery Guide", views: '100k', revenue: '$1,000' },
    { title: "Hiking Trails of Kadisha Valley", views: '95k', revenue: '$950' },
  ],
  'Last year': [
    { title: "Beirut Nightlife Guide 2025", views: '490k', revenue: '$4,900' },
    { title: "Lebanon's Tech Scene is Booming", views: '420k', revenue: '$4,200' },
    { title: "Top Wineries to Visit in Bekaa", views: '380k', revenue: '$3,800' },
    { title: "Best Rooftop Bars in Beirut", views: '350k', revenue: '$3,500' },
    { title: "Traditional Lebanese Recipes", views: '310k', revenue: '$3,100' },
    { title: "Culinary Revival in Byblos", views: '280k', revenue: '$2,800' },
    { title: "Cedar Reserves Conservation Drive", views: '250k', revenue: '$2,500' },
    { title: "Beirut Art Fair Highlights", views: '230k', revenue: '$2,300' },
    { title: "Ancient Ruins of Baalbek Guide", views: '210k', revenue: '$2,100' },
    { title: "Hidden Gems in the Mountains", views: '190k', revenue: '$1,900' },
    { title: "Local Farmers Organic Revolution", views: '170k', revenue: '$1,700' },
    { title: "Co-Working Spaces in Ashrafieh", views: '150k', revenue: '$1,500' },
    { title: "Mediterranean Sunset Spots", views: '130k', revenue: '$1,300' },
    { title: "Summer Festivals 2025", views: '120k', revenue: '$1,200' },
    { title: "Hiking Trails of Kadisha Valley", views: '105k', revenue: '$1,050' },
  ],
};

const trafficSourcesMap: Record<string, any[]> = {
  '30 days': [
    { name: 'Google Search', icon: Search, value: '42%', color: 'bg-blue-500' },
    { name: 'Social Media', icon: Share2, value: '28%', color: 'bg-pink-500' },
    { name: 'Direct Traffic', icon: Globe, value: '18%', color: 'bg-purple-500' },
    { name: 'AI', icon: Sparkles, value: '12%', color: 'bg-emerald-500' },
  ],
  'Last month': [
    { name: 'Google Search', icon: Search, value: '40%', color: 'bg-blue-500' },
    { name: 'Social Media', icon: Share2, value: '30%', color: 'bg-pink-500' },
    { name: 'Direct Traffic', icon: Globe, value: '16%', color: 'bg-purple-500' },
    { name: 'AI', icon: Sparkles, value: '14%', color: 'bg-emerald-500' },
  ],
  'This year': [
    { name: 'Google Search', icon: Search, value: '45%', color: 'bg-blue-500' },
    { name: 'Social Media', icon: Share2, value: '25%', color: 'bg-pink-500' },
    { name: 'Direct Traffic', icon: Globe, value: '15%', color: 'bg-purple-500' },
    { name: 'AI', icon: Sparkles, value: '15%', color: 'bg-emerald-500' },
  ],
  'Last year': [
    { name: 'Google Search', icon: Search, value: '48%', color: 'bg-blue-500' },
    { name: 'Social Media', icon: Share2, value: '27%', color: 'bg-pink-500' },
    { name: 'Direct Traffic', icon: Globe, value: '19%', color: 'bg-purple-500' },
    { name: 'AI', icon: Sparkles, value: '6%', color: 'bg-emerald-500' },
  ],
};

// Helper function to parse metrics into sortable numbers
function parseMetricValue(str: string | number): number {
  if (typeof str === 'number') return str;
  const clean = str.replace(/[\$,]/g, '');
  if (clean.endsWith('k') || clean.endsWith('K')) {
    return parseFloat(clean.slice(0, -1)) * 1000;
  }
  if (clean.endsWith('M') || clean.endsWith('m')) {
    return parseFloat(clean.slice(0, -1)) * 1000000;
  }
  if (clean.endsWith('%')) {
    return parseFloat(clean.slice(0, -1));
  }
  return parseFloat(clean) || 0;
}

export default function AnalyticsPage() {
  const [metricsPeriod, setMetricsPeriod] = useState('30 days');
  const [geoView, setGeoView] = useState<'cities' | 'countries'>('cities');
  const [trafficView, setTrafficView] = useState<'Hour' | 'Week' | 'Month'>('Week');

  // Pagination states
  const [teamPage, setTeamPage] = useState(1);
  const [articlesPage, setArticlesPage] = useState(1);

  // Periods per section
  const [teamPeriod, setTeamPeriod] = useState('30 days');
  const [sectionsPeriod, setSectionsPeriod] = useState('30 days');
  const [articlesPeriod, setArticlesPeriod] = useState('30 days');
  const [sourcesPeriod, setSourcesPeriod] = useState('30 days');

  // Sort states
  const [teamSortField, setTeamSortField] = useState<string>('views');
  const [teamSortDir, setTeamSortDir] = useState<'asc' | 'desc'>('desc');

  const [sectionsSortField, setSectionsSortField] = useState<string>('views');
  const [sectionsSortDir, setSectionsSortDir] = useState<'asc' | 'desc'>('desc');

  const [articlesSortField, setArticlesSortField] = useState<string>('views');
  const [articlesSortDir, setArticlesSortDir] = useState<'asc' | 'desc'>('desc');

  const handleTeamSort = (field: string) => {
    if (teamSortField === field) {
      setTeamSortDir(prev => prev === 'asc' ? 'desc' : 'asc');
    } else {
      setTeamSortField(field);
      setTeamSortDir(field === 'name' ? 'asc' : 'desc');
    }
  };

  const handleSectionsSort = (field: string) => {
    if (sectionsSortField === field) {
      setSectionsSortDir(prev => prev === 'asc' ? 'desc' : 'asc');
    } else {
      setSectionsSortField(field);
      setSectionsSortDir(field === 'name' ? 'asc' : 'desc');
    }
  };

  const handleArticlesSort = (field: string) => {
    if (articlesSortField === field) {
      setArticlesSortDir(prev => prev === 'asc' ? 'desc' : 'asc');
    } else {
      setArticlesSortField(field);
      setArticlesSortDir(field === 'title' ? 'asc' : 'desc');
    }
  };

  // Get current top metrics based on period
  const currentMetrics = topMetricsMap[metricsPeriod] || topMetricsMap['30 days'];

  // Get and sort team data (10 items per page)
  const rawTeamData = teamPerformanceMap[teamPeriod] || teamPerformanceMap['30 days'];
  const sortedTeamData = [...rawTeamData].sort((a, b) => {
    const valA = a[teamSortField as keyof typeof a];
    const valB = b[teamSortField as keyof typeof b];
    if (typeof valA === 'string' && typeof valB === 'string') {
      const numA = parseMetricValue(valA);
      const numB = parseMetricValue(valB);
      if (!isNaN(numA) && !isNaN(numB) && !valA.match(/^[a-zA-Z\s]+$/)) {
        return teamSortDir === 'asc' ? numA - numB : numB - numA;
      }
      return teamSortDir === 'asc' ? valA.localeCompare(valB) : valB.localeCompare(valA);
    }
    if (typeof valA === 'number' && typeof valB === 'number') {
      return teamSortDir === 'asc' ? valA - valB : valB - valA;
    }
    return 0;
  });

  const TEAM_PAGE_SIZE = 10;
  const teamTotalPages = Math.ceil(sortedTeamData.length / TEAM_PAGE_SIZE);
  const paginatedTeamData = sortedTeamData.slice((teamPage - 1) * TEAM_PAGE_SIZE, teamPage * TEAM_PAGE_SIZE);

  // Get and sort sections data
  const rawSectionsData = topSectionsMap[sectionsPeriod] || topSectionsMap['30 days'];
  const sortedSectionsData = [...rawSectionsData].sort((a, b) => {
    const valA = a[sectionsSortField as keyof typeof a];
    const valB = b[sectionsSortField as keyof typeof b];
    if (typeof valA === 'string' && typeof valB === 'string') {
      const numA = parseMetricValue(valA);
      const numB = parseMetricValue(valB);
      if (!isNaN(numA) && !isNaN(numB) && !valA.match(/^[a-zA-Z\s]+$/)) {
        return sectionsSortDir === 'asc' ? numA - numB : numB - numA;
      }
      return sectionsSortDir === 'asc' ? valA.localeCompare(valB) : valB.localeCompare(valA);
    }
    return 0;
  });

  // Get and sort articles data (5 items per page)
  const rawArticlesData = topArticlesMap[articlesPeriod] || topArticlesMap['30 days'];
  const sortedArticlesData = [...rawArticlesData].sort((a, b) => {
    const valA = a[articlesSortField as keyof typeof a];
    const valB = b[articlesSortField as keyof typeof b];
    if (typeof valA === 'string' && typeof valB === 'string') {
      const numA = parseMetricValue(valA);
      const numB = parseMetricValue(valB);
      if (!isNaN(numA) && !isNaN(numB) && !valA.match(/^[a-zA-Z\s]+$/)) {
        return articlesSortDir === 'asc' ? numA - numB : numB - numA;
      }
      return articlesSortDir === 'asc' ? valA.localeCompare(valB) : valB.localeCompare(valA);
    }
    return 0;
  });

  const ARTICLES_PAGE_SIZE = 5;
  const articlesTotalPages = Math.ceil(sortedArticlesData.length / ARTICLES_PAGE_SIZE);
  const paginatedArticlesData = sortedArticlesData.slice((articlesPage - 1) * ARTICLES_PAGE_SIZE, articlesPage * ARTICLES_PAGE_SIZE);

  const currentSourcesData = trafficSourcesMap[sourcesPeriod] || trafficSourcesMap['30 days'];
  const currentViewsData = trafficDataMap[trafficView];

  return (
    <div className="space-y-8">
      {/* Top Metrics Row Header with Period Selector */}
      <div className="space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <h2 className="text-xl font-bold tracking-tight text-gray-900">Key Metrics</h2>
          <div className="flex items-center bg-gray-50 p-1 rounded-2xl border border-gray-100 flex-wrap">
            {PERIOD_OPTIONS.map((period) => (
              <button
                key={period}
                onClick={() => setMetricsPeriod(period)}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                  metricsPeriod === period ? 'bg-white text-gray-900 border border-gray-200 shadow-2xs' : 'text-gray-400 hover:text-gray-600'
                }`}
              >
                {period}
              </button>
            ))}
          </div>
        </div>

        {/* 4 Cards without icons, change badge below number */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {currentMetrics.map((m) => (
            <MetricCard key={m.label} label={m.label} value={m.value} change={m.change} />
          ))}
        </div>
      </div>

      {/* Traffic Overview - Full Row */}
      <div className="bento-card p-10">
        <div className="flex items-center justify-between mb-10">
          <div>
            <h3 className="text-2xl font-bold tracking-tight text-gray-900">Traffic Overview</h3>
          </div>
          <div className="flex items-center bg-gray-50 p-1.5 rounded-2xl border border-gray-100">
            {['Hour', 'Week', 'Month'].map((view) => (
              <button 
                key={view}
                onClick={() => setTrafficView(view as any)}
                className={`px-5 py-2.5 rounded-xl text-xs font-semibold transition-all duration-300 ${
                  trafficView === view ? 'bg-white text-gray-900 border border-gray-200 shadow-2xs' : 'text-gray-400 hover:text-gray-600'
                }`}
              >
                {view}
              </button>
            ))}
          </div>
        </div>
        <div className="h-[400px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={currentViewsData}>
              <defs>
                <linearGradient id="barGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#FF0000" stopOpacity={1} />
                  <stop offset="100%" stopColor="#CC0000" stopOpacity={1} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F3F4F6" />
              <XAxis 
                dataKey="name" 
                axisLine={false} 
                tickLine={false} 
                tick={{ fontSize: 10, fontWeight: 900, fill: '#9CA3AF', letterSpacing: '0.05em' }}
                dy={15}
              />
              <YAxis 
                axisLine={false} 
                tickLine={false} 
                tick={{ fontSize: 10, fontWeight: 900, fill: '#9CA3AF' }}
              />
              <Tooltip 
                cursor={{ fill: '#F9FAFB', radius: 12 }}
                contentStyle={{ 
                  borderRadius: '20px', 
                  border: '1px solid #E5E7EB', 
                  fontSize: '12px',
                  fontWeight: 900,
                  padding: '16px'
                }} 
              />
              <Bar 
                dataKey="views" 
                fill="url(#barGradient)" 
                radius={[8, 8, 0, 0]}
                barSize={trafficView === 'Hour' ? 24 : 56}
                animationDuration={1500}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Geographic Distribution - Full Row */}
      <div className="bento-card p-10">
        <div className="flex items-center justify-between mb-10">
          <div>
            <h3 className="text-xl font-bold tracking-tight text-gray-900">Geographic Distribution</h3>
          </div>
          <div className="flex items-center bg-gray-50 p-1.5 rounded-2xl border border-gray-100">
            <button 
              onClick={() => setGeoView('cities')}
              className={`px-5 py-2.5 rounded-xl text-xs font-semibold transition-all duration-300 ${
                geoView === 'cities' ? 'bg-white text-gray-900 border border-gray-200 shadow-2xs' : 'text-gray-400 hover:text-gray-600'
              }`}
            >
              Cities
            </button>
            <button 
              onClick={() => setGeoView('countries')}
              className={`px-5 py-2.5 rounded-xl text-xs font-semibold transition-all duration-300 ${
                geoView === 'countries' ? 'bg-white text-gray-900 border border-gray-200 shadow-2xs' : 'text-gray-400 hover:text-gray-600'
              }`}
            >
              Countries
            </button>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <div className="space-y-6">
            {(geoView === 'cities' ? [
              { name: 'Beirut', country: 'Lebanon', value: 64, color: '#FF0000' },
              { name: 'Dubai', country: 'UAE', value: 12, color: '#000000' },
              { name: 'Paris', country: 'France', value: 8, color: '#666666' },
              { name: 'London', country: 'UK', value: 6, color: '#999999' },
              { name: 'New York', country: 'USA', value: 4, color: '#CCCCCC' },
            ] : [
              { name: 'Lebanon', value: 72, color: '#FF0000' },
              { name: 'UAE', value: 10, color: '#000000' },
              { name: 'USA', value: 6, color: '#666666' },
              { name: 'France', value: 5, color: '#999999' },
              { name: 'Canada', value: 3, color: '#CCCCCC' },
            ]).map((location, i) => (
              <div key={i} className="group cursor-pointer">
                <div className="flex items-center justify-between mb-2">
                  <div>
                    <span className="text-sm font-semibold text-gray-900 group-hover:text-primary transition-colors">{location.name}</span>
                    {geoView === 'cities' && 'country' in location && (
                      <span className="text-xs font-medium text-gray-400 ml-2">{location.country}</span>
                    )}
                  </div>
                  <span className="text-xs font-semibold text-gray-900">{location.value}%</span>
                </div>
                <div className="h-2 w-full bg-gray-50 rounded-full overflow-hidden">
                  <div 
                    className="h-full rounded-full transition-all duration-1000 ease-out" 
                    style={{ width: `${location.value}%`, backgroundColor: location.color }}
                  />
                </div>
              </div>
            ))}
          </div>
          
          <div className="flex flex-col items-center justify-center relative">
            <div className="h-64 w-64 relative">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={geoView === 'cities' ? [
                      { name: 'Beirut', value: 64 },
                      { name: 'Dubai', value: 12 },
                      { name: 'Paris', value: 8 },
                      { name: 'London', value: 6 },
                      { name: 'New York', value: 4 },
                    ] : [
                      { name: 'Lebanon', value: 72 },
                      { name: 'UAE', value: 10 },
                      { name: 'USA', value: 6 },
                      { name: 'France', value: 5 },
                      { name: 'Canada', value: 3 },
                    ]}
                    innerRadius={80}
                    outerRadius={110}
                    paddingAngle={8}
                    dataKey="value"
                    animationDuration={1500}
                  >
                    {COLORS.map((color, index) => (
                      <Cell key={`cell-${index}`} fill={color} stroke="none" />
                    ))}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </div>

      {/* Devices - Breakdown on left, Chart on right */}
      <div className="bento-card p-10">
        <div className="mb-8">
          <h3 className="text-xl font-bold tracking-tight text-gray-900">Devices</h3>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          {/* Breakdown first (left) */}
          <div className="space-y-6">
            {deviceData.map((device, i) => (
              <div key={device.name} className="flex items-center justify-between group cursor-pointer">
                <div className="flex items-center gap-4">
                  <div className="w-3 h-3 rounded-full shrink-0" style={{ backgroundColor: COLORS[i] }} />
                  <span className="text-xs font-semibold text-gray-600 group-hover:text-gray-900 transition-colors tracking-wide">{device.name}</span>
                </div>
                <div className="flex items-center gap-4">
                  <div className="w-48 sm:w-64 h-2 bg-gray-50 rounded-full overflow-hidden">
                    <div className="h-full rounded-full transition-all duration-1000" style={{ width: `${device.value}%`, backgroundColor: COLORS[i] }} />
                  </div>
                  <span className="text-xs font-semibold text-gray-900 w-10 text-right">{device.value}%</span>
                </div>
              </div>
            ))}
          </div>

          {/* Chart second (right), no text/icon overlay inside */}
          <div className="flex flex-col items-center justify-center relative">
            <div className="h-64 w-64 relative">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={deviceData}
                    innerRadius={80}
                    outerRadius={110}
                    paddingAngle={8}
                    dataKey="value"
                    animationDuration={1500}
                  >
                    {deviceData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} stroke="none" />
                    ))}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </div>

      {/* Team Performance - Circle avatar, up to 10 per page with pagination, $/post in black */}
      <div className="bento-card overflow-hidden">
        <div className="px-10 py-8 border-b border-gray-50 flex flex-wrap items-center justify-between gap-4">
          <div>
            <h3 className="text-xl font-bold tracking-tight text-gray-900">Team Performance</h3>
          </div>
          <div className="flex items-center bg-gray-50 p-1 rounded-2xl border border-gray-100 flex-wrap">
            {PERIOD_OPTIONS.map((period) => (
              <button
                key={period}
                onClick={() => {
                  setTeamPeriod(period);
                  setTeamPage(1);
                }}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                  teamPeriod === period ? 'bg-white text-gray-900 border border-gray-200 shadow-2xs' : 'text-gray-400 hover:text-gray-600'
                }`}
              >
                {period}
              </button>
            ))}
          </div>
        </div>
        <div className="overflow-x-auto custom-scrollbar">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-gray-50/30">
                <th 
                  onClick={() => handleTeamSort('name')}
                  className="pl-10 pr-6 py-6 text-[10px] font-semibold text-gray-400 tracking-wider text-left cursor-pointer select-none"
                >
                  Author
                </th>
                <th 
                  onClick={() => handleTeamSort('posts')}
                  className="px-6 py-6 text-[10px] font-semibold text-gray-400 tracking-wider text-right cursor-pointer select-none"
                >
                  Posts
                </th>
                <th 
                  onClick={() => handleTeamSort('views')}
                  className="px-6 py-6 text-[10px] font-semibold text-gray-400 tracking-wider text-right cursor-pointer select-none"
                >
                  Views
                </th>
                <th 
                  onClick={() => handleTeamSort('avgViews')}
                  className="px-6 py-6 text-[10px] font-semibold text-gray-400 tracking-wider text-right cursor-pointer select-none"
                >
                  Avg Views
                </th>
                <th 
                  onClick={() => handleTeamSort('revenue')}
                  className="px-6 py-6 text-[10px] font-semibold text-gray-400 tracking-wider text-right cursor-pointer select-none"
                >
                  Revenue
                </th>
                <th 
                  onClick={() => handleTeamSort('revPerPost')}
                  className="px-10 py-6 text-[10px] font-semibold text-gray-400 tracking-wider text-right cursor-pointer select-none"
                >
                  $/Post
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {paginatedTeamData.map((author, i) => (
                <tr key={i} className="group hover:bg-gray-50/50 transition-all duration-300">
                  <td className="pl-10 pr-6 py-6">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-full overflow-hidden border border-gray-200 group-hover:scale-105 transition-transform duration-300 shrink-0">
                        <img src={author.avatar} alt={author.name} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                      </div>
                      <span className="text-sm font-semibold text-gray-900 group-hover:text-primary transition-colors">{author.name}</span>
                    </div>
                  </td>
                  <td className="px-6 py-6 text-right text-sm font-medium text-gray-500 group-hover:text-gray-900 transition-colors">{author.posts}</td>
                  <td className="px-6 py-6 text-right text-sm font-medium text-gray-500 group-hover:text-gray-900 transition-colors">{author.views}</td>
                  <td className="px-6 py-6 text-right text-sm font-medium text-gray-500 group-hover:text-gray-900 transition-colors">{author.avgViews}</td>
                  <td className="px-6 py-6 text-right text-sm font-semibold text-gray-900">{author.revenue}</td>
                  <td className="px-10 py-6 text-right text-sm font-semibold text-gray-900">{author.revPerPost}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Simple Pagination for Team Performance */}
        {teamTotalPages > 1 && (
          <div className="px-10 py-6 border-t border-gray-50 flex items-center justify-between text-xs text-gray-500">
            <span>
              Showing <span className="font-semibold text-gray-900">{(teamPage - 1) * TEAM_PAGE_SIZE + 1}</span> to <span className="font-semibold text-gray-900">{Math.min(teamPage * TEAM_PAGE_SIZE, sortedTeamData.length)}</span> of <span className="font-semibold text-gray-900">{sortedTeamData.length}</span> members
            </span>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setTeamPage(prev => Math.max(prev - 1, 1))}
                disabled={teamPage === 1}
                className="p-2 rounded-xl border border-gray-200 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors cursor-pointer"
              >
                <ChevronLeft className="w-4 h-4 text-gray-600" />
              </button>
              <span className="font-medium text-gray-700 px-2">Page {teamPage} of {teamTotalPages}</span>
              <button
                onClick={() => setTeamPage(prev => Math.min(prev + 1, teamTotalPages))}
                disabled={teamPage === teamTotalPages}
                className="p-2 rounded-xl border border-gray-200 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors cursor-pointer"
              >
                <ChevronRight className="w-4 h-4 text-gray-600" />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Top Sections - Full Row */}
      <div className="bento-card overflow-hidden">
        <div className="px-10 py-8 border-b border-gray-50 flex flex-wrap items-center justify-between gap-4">
          <div>
            <h3 className="text-xl font-bold tracking-tight text-gray-900">Top Sections</h3>
          </div>
          <div className="flex items-center bg-gray-50 p-1 rounded-2xl border border-gray-100 flex-wrap">
            {PERIOD_OPTIONS.map((period) => (
              <button
                key={period}
                onClick={() => setSectionsPeriod(period)}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                  sectionsPeriod === period ? 'bg-white text-gray-900 border border-gray-200 shadow-2xs' : 'text-gray-400 hover:text-gray-600'
                }`}
              >
                {period}
              </button>
            ))}
          </div>
        </div>
        <div className="overflow-x-auto custom-scrollbar">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-gray-50/30">
                <th 
                  onClick={() => handleSectionsSort('name')}
                  className="pl-10 pr-6 py-6 text-[10px] font-semibold text-gray-400 tracking-wider text-left cursor-pointer select-none"
                >
                  Section
                </th>
                <th 
                  onClick={() => handleSectionsSort('views')}
                  className="px-6 py-6 text-[10px] font-semibold text-gray-400 tracking-wider text-right cursor-pointer select-none"
                >
                  Views
                </th>
                <th 
                  onClick={() => handleSectionsSort('revenue')}
                  className="px-10 py-6 text-[10px] font-semibold text-gray-400 tracking-wider text-right cursor-pointer select-none"
                >
                  Revenue
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {sortedSectionsData.map((sec, i) => (
                <tr key={i} className="group hover:bg-gray-50/50 transition-all duration-300">
                  <td className="pl-10 pr-6 py-6">
                    <span className="text-sm font-semibold text-gray-900 group-hover:text-primary transition-colors">{sec.name}</span>
                  </td>
                  <td className="px-6 py-6 text-right text-sm font-medium text-gray-500 group-hover:text-gray-900 transition-colors">{sec.views}</td>
                  <td className="px-10 py-6 text-right text-sm font-semibold text-gray-900">{sec.revenue}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Top Articles - Full Row with Pagination at Bottom */}
      <div className="bento-card overflow-hidden">
        <div className="px-10 py-8 border-b border-gray-50 flex flex-wrap items-center justify-between gap-4">
          <div>
            <h3 className="text-xl font-bold tracking-tight text-gray-900">Top Articles</h3>
          </div>
          <div className="flex items-center bg-gray-50 p-1 rounded-2xl border border-gray-100 flex-wrap">
            {PERIOD_OPTIONS.map((period) => (
              <button
                key={period}
                onClick={() => {
                  setArticlesPeriod(period);
                  setArticlesPage(1);
                }}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                  articlesPeriod === period ? 'bg-white text-gray-900 border border-gray-200 shadow-2xs' : 'text-gray-400 hover:text-gray-600'
                }`}
              >
                {period}
              </button>
            ))}
          </div>
        </div>
        <div className="overflow-x-auto custom-scrollbar">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-gray-50/30">
                <th 
                  onClick={() => handleArticlesSort('title')}
                  className="pl-10 pr-6 py-6 text-[10px] font-semibold text-gray-400 tracking-wider text-left cursor-pointer select-none"
                >
                  Article
                </th>
                <th 
                  onClick={() => handleArticlesSort('views')}
                  className="px-6 py-6 text-[10px] font-semibold text-gray-400 tracking-wider text-right cursor-pointer select-none"
                >
                  Views
                </th>
                <th 
                  onClick={() => handleArticlesSort('revenue')}
                  className="px-10 py-6 text-[10px] font-semibold text-gray-400 tracking-wider text-right cursor-pointer select-none"
                >
                  Revenue
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {paginatedArticlesData.map((article, i) => (
                <tr key={i} className="group hover:bg-gray-50/50 transition-all duration-300">
                  <td className="pl-10 pr-6 py-6">
                    <span className="text-sm font-semibold text-gray-900 group-hover:text-primary transition-colors block">{article.title}</span>
                  </td>
                  <td className="px-6 py-6 text-right text-sm font-medium text-gray-500 group-hover:text-gray-900 transition-colors">{article.views}</td>
                  <td className="px-10 py-6 text-right text-sm font-semibold text-gray-900">{article.revenue}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Better Pagination Under the List */}
        <div className="px-10 py-6 border-t border-gray-50 flex items-center justify-between text-xs text-gray-500">
          <span>
            Showing <span className="font-semibold text-gray-900">{(articlesPage - 1) * ARTICLES_PAGE_SIZE + 1}</span> to <span className="font-semibold text-gray-900">{Math.min(articlesPage * ARTICLES_PAGE_SIZE, sortedArticlesData.length)}</span> of <span className="font-semibold text-gray-900">{sortedArticlesData.length}</span> articles
          </span>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setArticlesPage(prev => Math.max(prev - 1, 1))}
              disabled={articlesPage === 1}
              className="p-2 rounded-xl border border-gray-200 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors cursor-pointer"
            >
              <ChevronLeft className="w-4 h-4 text-gray-600" />
            </button>
            <div className="flex items-center gap-1">
              {Array.from({ length: articlesTotalPages }, (_, idx) => idx + 1).map(p => (
                <button
                  key={p}
                  onClick={() => setArticlesPage(p)}
                  className={`w-8 h-8 rounded-xl font-semibold text-xs transition-all cursor-pointer ${
                    articlesPage === p ? 'bg-gray-900 text-white' : 'text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  {p}
                </button>
              ))}
            </div>
            <button
              onClick={() => setArticlesPage(prev => Math.min(prev + 1, articlesTotalPages))}
              disabled={articlesPage === articlesTotalPages}
              className="p-2 rounded-xl border border-gray-200 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors cursor-pointer"
            >
              <ChevronRight className="w-4 h-4 text-gray-600" />
            </button>
          </div>
        </div>
      </div>

      {/* Traffic Sources - Full Row */}
      <div className="bento-card p-10">
        <div className="flex flex-wrap items-center justify-between gap-4 mb-10">
          <div>
            <h3 className="text-xl font-bold tracking-tight text-gray-900">Traffic Sources</h3>
          </div>
          <div className="flex items-center bg-gray-50 p-1 rounded-2xl border border-gray-100 flex-wrap">
            {PERIOD_OPTIONS.map((period) => (
              <button
                key={period}
                onClick={() => setSourcesPeriod(period)}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                  sourcesPeriod === period ? 'bg-white text-gray-900 border border-gray-200 shadow-2xs' : 'text-gray-400 hover:text-gray-600'
                }`}
              >
                {period}
              </button>
            ))}
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          {currentSourcesData.map((source) => (
            <div key={source.name} className="group cursor-pointer">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-xl bg-gray-50 group-hover:bg-primary/10 group-hover:text-primary transition-all duration-300">
                    <source.icon className="w-4 h-4" />
                  </div>
                  <span className="text-[11px] font-semibold text-gray-400 tracking-wider group-hover:text-gray-900 transition-colors">{source.name}</span>
                </div>
                <span className="text-sm font-semibold text-gray-900">{source.value}</span>
              </div>
              <div className="h-2 w-full bg-gray-50 rounded-full overflow-hidden">
                <div 
                  className={`h-full rounded-full transition-all duration-1000 ease-out ${source.color}`} 
                  style={{ width: source.value }} 
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { ThemeProvider } from './context/ThemeContext';
import { LocationProvider } from './context/LocationContext';
import DashboardLayout from './components/dashboard/DashboardLayout';
import DashboardHome from './components/dashboard/DashboardHome';
import AnalyticsPage from './components/dashboard/AnalyticsPage';
import PagesPage from './components/dashboard/PagesPage';
import CategoriesPage from './components/dashboard/CategoriesPage';
import TeamPage from './components/dashboard/TeamPage';
import EditUserPage from './components/dashboard/team/EditUserPage';
import { TeamProvider } from './components/dashboard/team/TeamContext';
import { PostProvider } from './components/dashboard/posts/PostContext';
import PostsPage from './components/dashboard/PostsPage';
import CreatePostPage from './components/dashboard/posts/CreatePostPage';
import CreateListiclePage from './components/dashboard/posts/CreateListiclePage';
import CreateExpressPage from './components/dashboard/posts/CreateExpressPage';
import PostDetailsPage from './components/dashboard/posts/PostDetailsPage';
import MediaPage from './components/dashboard/MediaPage';
import IdeasPage from './components/dashboard/IdeasPage';
import AIPromptsPage from './components/dashboard/AIPromptsPage';
import LocationsPage from './components/dashboard/LocationsPage';
import MessagesPage from './components/dashboard/MessagesPage';
import AdRequestsPage from './components/dashboard/AdRequestsPage';
import { BrowserRouter as Router, Routes, Route, Outlet } from 'react-router-dom';

function LayoutWrapper() {
  return (
    <TeamProvider>
      <DashboardLayout>
        <Outlet />
      </DashboardLayout>
    </TeamProvider>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <LocationProvider>
        <PostProvider>
          <Router>
            <Routes>
              {/* All dashboard routes wrapped in the layout wrapper */}
              <Route element={<LayoutWrapper />}>
                {/* Flat Paths */}
                <Route path="/" element={<DashboardHome />} />
                <Route path="/analytics" element={<AnalyticsPage />} />
                <Route path="/posts" element={<PostsPage />} />
                <Route path="/posts/create" element={<CreatePostPage />} />
                <Route path="/create/express" element={<CreateExpressPage />} />
                <Route path="/create/article" element={<CreatePostPage />} />
                <Route path="/create/listicle" element={<CreateListiclePage />} />
                <Route path="/posts/:postId" element={<PostDetailsPage />} />
                <Route path="/ideas" element={<IdeasPage />} />
                <Route path="/sections" element={<CategoriesPage />} />
                <Route path="/categories" element={<CategoriesPage />} />
                <Route path="/media" element={<MediaPage />} />
                <Route path="/pages" element={<PagesPage />} />
                <Route path="/team" element={<TeamPage />} />
                <Route path="/team/edit/:userId" element={<EditUserPage />} />
                <Route path="/messages" element={<MessagesPage />} />
                <Route path="/ads" element={<AdRequestsPage />} />
                <Route path="/ad-requests" element={<AdRequestsPage />} />
                <Route path="/ai" element={<AIPromptsPage />} />
                <Route path="/locations" element={<LocationsPage />} />

                {/* Prefixed Paths */}
                <Route path="/dashboard" element={<DashboardHome />} />
                <Route path="/dashboard/analytics" element={<AnalyticsPage />} />
                <Route path="/dashboard/posts" element={<PostsPage />} />
                <Route path="/dashboard/posts/create" element={<CreatePostPage />} />
                <Route path="/dashboard/create/express" element={<CreateExpressPage />} />
                <Route path="/dashboard/create/article" element={<CreatePostPage />} />
                <Route path="/dashboard/create/listicle" element={<CreateListiclePage />} />
                <Route path="/dashboard/posts/:postId" element={<PostDetailsPage />} />
                <Route path="/dashboard/ideas" element={<IdeasPage />} />
                <Route path="/dashboard/sections" element={<CategoriesPage />} />
                <Route path="/dashboard/categories" element={<CategoriesPage />} />
                <Route path="/dashboard/media" element={<MediaPage />} />
                <Route path="/dashboard/pages" element={<PagesPage />} />
                <Route path="/dashboard/team" element={<TeamPage />} />
                <Route path="/dashboard/team/edit/:userId" element={<EditUserPage />} />
                <Route path="/dashboard/messages" element={<MessagesPage />} />
                <Route path="/dashboard/ads" element={<AdRequestsPage />} />
                <Route path="/dashboard/ad-requests" element={<AdRequestsPage />} />
                <Route path="/dashboard/ai" element={<AIPromptsPage />} />
                <Route path="/dashboard/locations" element={<LocationsPage />} />
              </Route>
            </Routes>
          </Router>
        </PostProvider>
      </LocationProvider>
    </ThemeProvider>
  );
}

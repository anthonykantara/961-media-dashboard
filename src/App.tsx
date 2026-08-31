/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

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
import { createBrowserRouter, RouterProvider, Outlet } from 'react-router-dom';

function LayoutWrapper() {
  return (
    <TeamProvider>
      <DashboardLayout>
        <Outlet />
      </DashboardLayout>
    </TeamProvider>
  );
}

const router = createBrowserRouter([
  {
    element: <LayoutWrapper />,
    children: [
      { path: '/', element: <DashboardHome /> },
      { path: '/analytics', element: <AnalyticsPage /> },
      { path: '/posts', element: <PostsPage /> },
      { path: '/posts/create', element: <CreatePostPage /> },
      { path: '/create/express', element: <CreateExpressPage /> },
      { path: '/create/article', element: <CreatePostPage /> },
      { path: '/create/listicle', element: <CreateListiclePage /> },
      { path: '/posts/:postId', element: <PostDetailsPage /> },
      { path: '/ideas', element: <IdeasPage /> },
      { path: '/sections', element: <CategoriesPage /> },
      { path: '/categories', element: <CategoriesPage /> },
      { path: '/media', element: <MediaPage /> },
      { path: '/pages', element: <PagesPage /> },
      { path: '/team', element: <TeamPage /> },
      { path: '/team/edit/:userId', element: <EditUserPage /> },
      { path: '/messages', element: <MessagesPage /> },
      { path: '/ads', element: <AdRequestsPage /> },
      { path: '/ad-requests', element: <AdRequestsPage /> },
      { path: '/ai', element: <AIPromptsPage /> },
      { path: '/locations', element: <LocationsPage /> },

      { path: '/dashboard', element: <DashboardHome /> },
      { path: '/dashboard/analytics', element: <AnalyticsPage /> },
      { path: '/dashboard/posts', element: <PostsPage /> },
      { path: '/dashboard/posts/create', element: <CreatePostPage /> },
      { path: '/dashboard/create/express', element: <CreateExpressPage /> },
      { path: '/dashboard/create/article', element: <CreatePostPage /> },
      { path: '/dashboard/create/listicle', element: <CreateListiclePage /> },
      { path: '/dashboard/posts/:postId', element: <PostDetailsPage /> },
      { path: '/dashboard/ideas', element: <IdeasPage /> },
      { path: '/dashboard/sections', element: <CategoriesPage /> },
      { path: '/dashboard/categories', element: <CategoriesPage /> },
      { path: '/dashboard/media', element: <MediaPage /> },
      { path: '/dashboard/pages', element: <PagesPage /> },
      { path: '/dashboard/team', element: <TeamPage /> },
      { path: '/dashboard/team/edit/:userId', element: <EditUserPage /> },
      { path: '/dashboard/messages', element: <MessagesPage /> },
      { path: '/dashboard/ads', element: <AdRequestsPage /> },
      { path: '/dashboard/ad-requests', element: <AdRequestsPage /> },
      { path: '/dashboard/ai', element: <AIPromptsPage /> },
      { path: '/dashboard/locations', element: <LocationsPage /> },
    ],
  },
]);

export default function App() {
  return (
    <LocationProvider>
      <PostProvider>
        <RouterProvider router={router} />
      </PostProvider>
    </LocationProvider>
  );
}

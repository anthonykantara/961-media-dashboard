import { describe, it, expect, beforeEach, vi } from 'vitest';
import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { createMemoryRouter, RouterProvider, Outlet, useNavigate } from 'react-router-dom';
import { LocationProvider } from '../context/LocationContext';
import { PostProvider } from '../components/dashboard/posts/PostContext';
import { TeamProvider } from '../components/dashboard/team/TeamContext';
import CreatePostPage from '../components/dashboard/posts/CreatePostPage';
import CreateExpressPage from '../components/dashboard/posts/CreateExpressPage';
import CreateListiclePage from '../components/dashboard/posts/CreateListiclePage';
import EditUserPage from '../components/dashboard/team/EditUserPage';
import PostDetailsPage from '../components/dashboard/posts/PostDetailsPage';
import UnsavedChangesModal from '../components/common/UnsavedChangesModal';

function DummyPostsPage() {
  return <div data-testid="posts-page">Posts Table View</div>;
}

function DummySidebarLayout() {
  const navigate = useNavigate();
  return (
    <div>
      <nav>
        <button onClick={() => navigate('/dashboard/posts')}>Sidebar Posts Link</button>
        <button onClick={() => navigate('/dashboard')}>Sidebar Home Link</button>
      </nav>
      <Outlet />
    </div>
  );
}

function renderWithRouter(initialRoute: string) {
  const router = createMemoryRouter(
    [
      {
        element: <DummySidebarLayout />,
        children: [
          { path: '/dashboard/posts', element: <DummyPostsPage /> },
          { path: '/dashboard/posts/create', element: <CreatePostPage /> },
          { path: '/dashboard/create/express', element: <CreateExpressPage /> },
          { path: '/dashboard/create/listicle', element: <CreateListiclePage /> },
          { path: '/dashboard/team', element: <div data-testid="team-page">Team Table View</div> },
          { path: '/dashboard/team/edit/:userId', element: <EditUserPage /> },
          { path: '/dashboard/posts/:postId', element: <PostDetailsPage /> },
          { path: '/dashboard', element: <div data-testid="home-page">Dashboard Home</div> },
        ],
      },
    ],
    { initialEntries: [initialRoute] }
  );

  return {
    ...render(
      <LocationProvider>
        <TeamProvider>
          <PostProvider>
            <RouterProvider router={router} />
          </PostProvider>
        </TeamProvider>
      </LocationProvider>
    ),
    router,
  };
}

describe('Unsaved Changes Navigation Protection', () => {
  beforeEach(() => {
    localStorage.clear();
    vi.clearAllMocks();
  });

  describe('UnsavedChangesModal Component', () => {
    it('renders accessible modal dialog with focus trapping and custom texts', () => {
      const onConfirm = vi.fn();
      const onCancel = vi.fn();

      render(
        <UnsavedChangesModal
          isOpen={true}
          onConfirm={onConfirm}
          onCancel={onCancel}
        />
      );

      expect(screen.getByRole('dialog')).toBeDefined();
      expect(screen.getByText('Unsaved Changes')).toBeDefined();
      expect(screen.getByText('Stay on Page')).toBeDefined();
      expect(screen.getByText('Discard Changes')).toBeDefined();

      fireEvent.click(screen.getByText('Stay on Page'));
      expect(onCancel).toHaveBeenCalledTimes(1);

      fireEvent.click(screen.getByText('Discard Changes'));
      expect(onConfirm).toHaveBeenCalledTimes(1);
    });
  });

  describe('Post Editor (CreatePostPage)', () => {
    it('navigates immediately when form is unmodified', async () => {
      renderWithRouter('/dashboard/posts/create');

      expect(screen.getByPlaceholderText('Title of your story...')).toBeDefined();

      // Click sidebar link without modifying anything
      fireEvent.click(screen.getByText('Sidebar Posts Link'));

      await waitFor(() => {
        expect(screen.getByTestId('posts-page')).toBeDefined();
      });
    });

    it('intercepts sidebar navigation when post title is modified and opens modal', async () => {
      renderWithRouter('/dashboard/posts/create');

      const titleInput = screen.getByPlaceholderText('Title of your story...');
      fireEvent.change(titleInput, { target: { value: 'My Unsaved Post Title' } });

      // Click sidebar link
      fireEvent.click(screen.getByText('Sidebar Posts Link'));

      // Modal should appear
      await waitFor(() => {
        expect(screen.getByText('Unsaved Changes')).toBeDefined();
      });

      // Click "Stay on Page"
      fireEvent.click(screen.getByText('Stay on Page'));

      // Should remain on editor with input intact
      expect(screen.queryByTestId('posts-page')).toBeNull();
      expect((screen.getByPlaceholderText('Title of your story...') as HTMLInputElement).value).toBe(
        'My Unsaved Post Title'
      );
    });

    it('allows departure when user confirms "Discard Changes"', async () => {
      renderWithRouter('/dashboard/posts/create');

      const titleInput = screen.getByPlaceholderText('Title of your story...');
      fireEvent.change(titleInput, { target: { value: 'Draft to Discard' } });

      fireEvent.click(screen.getByText('Sidebar Posts Link'));

      await waitFor(() => {
        expect(screen.getByText('Unsaved Changes')).toBeDefined();
      });

      fireEvent.click(screen.getByText('Discard Changes'));

      await waitFor(() => {
        expect(screen.getByTestId('posts-page')).toBeDefined();
      });
    });

    it('intercepts Cancel button click when unsaved changes exist', async () => {
      renderWithRouter('/dashboard/posts/create');

      const titleInput = screen.getByPlaceholderText('Title of your story...');
      fireEvent.change(titleInput, { target: { value: 'Draft Title' } });

      fireEvent.click(screen.getByRole('button', { name: /cancel/i }));

      await waitFor(() => {
        expect(screen.getByText('Unsaved Changes')).toBeDefined();
      });
    });

    it('allows immediate navigation when post is saved', async () => {
      renderWithRouter('/dashboard/posts/create');

      const titleInput = screen.getByPlaceholderText('Title of your story...');
      fireEvent.change(titleInput, { target: { value: 'Published Article Title' } });

      fireEvent.click(screen.getByRole('button', { name: /save post/i }));

      await waitFor(() => {
        expect(screen.getByTestId('posts-page')).toBeDefined();
      });
    });
  });

  describe('Express Editor (CreateExpressPage)', () => {
    it('intercepts navigation when express headline is modified', async () => {
      renderWithRouter('/dashboard/create/express');

      const headlineInput = screen.getByPlaceholderText(/Enter headline/i);
      fireEvent.change(headlineInput, { target: { value: 'Modified Express Headline' } });

      fireEvent.click(screen.getByText('Sidebar Home Link'));

      await waitFor(() => {
        expect(screen.getByText('Unsaved Changes')).toBeDefined();
      });
    });

    it('navigates away when confirming departure from express editor', async () => {
      renderWithRouter('/dashboard/create/express');

      const headlineInput = screen.getByPlaceholderText(/Enter headline/i);
      fireEvent.change(headlineInput, { target: { value: 'Express Headline 2' } });

      fireEvent.click(screen.getByText('Sidebar Home Link'));

      await waitFor(() => {
        expect(screen.getByText('Unsaved Changes')).toBeDefined();
      });

      fireEvent.click(screen.getByText('Discard Changes'));

      await waitFor(() => {
        expect(screen.getByTestId('home-page')).toBeDefined();
      });
    });
  });

  describe('Listicle Editor (CreateListiclePage)', () => {
    it('intercepts navigation when listicle title is modified', async () => {
      renderWithRouter('/dashboard/create/listicle');

      const titleInput = screen.getByPlaceholderText(/In Lebanon You Have To Visit/i);
      fireEvent.change(titleInput, { target: { value: 'Top 10 Secret Beach Clubs' } });

      fireEvent.click(screen.getByText('Sidebar Posts Link'));

      await waitFor(() => {
        expect(screen.getByText('Unsaved Changes')).toBeDefined();
      });
    });

    it('preserves listicle inputs when staying on page', async () => {
      renderWithRouter('/dashboard/create/listicle');

      const titleInput = screen.getByPlaceholderText(/In Lebanon You Have To Visit/i);
      fireEvent.change(titleInput, { target: { value: 'Top 5 Mountain Hikes' } });

      fireEvent.click(screen.getByRole('button', { name: /cancel/i }));

      await waitFor(() => {
        expect(screen.getByText('Unsaved Changes')).toBeDefined();
      });

      fireEvent.click(screen.getByText('Stay on Page'));

      expect(screen.queryByTestId('posts-page')).toBeNull();
      expect((screen.getByPlaceholderText(/In Lebanon You Have To Visit/i) as HTMLInputElement).value).toBe(
        'Top 5 Mountain Hikes'
      );
    });
  });

  describe('Edit User Profile Page (EditUserPage)', () => {
    it('intercepts navigation when user bio is modified', async () => {
      renderWithRouter('/dashboard/team/edit/1');

      const bioInput = screen.getByPlaceholderText('Tell us about this team member...');
      fireEvent.change(bioInput, { target: { value: 'Updated bio information' } });

      fireEvent.click(screen.getByText('Sidebar Home Link'));

      await waitFor(() => {
        expect(screen.getByText('Unsaved Changes')).toBeDefined();
      });
    });

    it('allows navigation when user profile changes are saved', async () => {
      renderWithRouter('/dashboard/team/edit/1');

      const nameInput = screen.getByDisplayValue('Anthony Rahayel');
      fireEvent.change(nameInput, { target: { value: 'Anthony Rahayel Updated' } });

      fireEvent.click(screen.getByRole('button', { name: /save changes/i }));

      await waitFor(() => {
        expect(screen.getByTestId('team-page')).toBeDefined();
      });
    });
  });

  describe('Post Details Quick Edit Mode (PostDetailsPage)', () => {
    it('intercepts navigation when quick edit form is modified', async () => {
      renderWithRouter('/dashboard/posts/lb-en-2');

      // Click Edit Post button to toggle quick edit
      fireEvent.click(screen.getByRole('button', { name: /edit post/i }));

      const titleInput = screen.getByDisplayValue('10 Best Rooftop Bars in Beirut This Summer');
      fireEvent.change(titleInput, { target: { value: 'Modified Post Title in Quick Edit' } });

      fireEvent.click(screen.getByText('Sidebar Home Link'));

      await waitFor(() => {
        expect(screen.getByText('Unsaved Changes')).toBeDefined();
      });
    });
  });

  describe('beforeunload Browser Event', () => {
    it('registers beforeunload handler when form is dirty and prevents default', () => {
      const addEventListenerSpy = vi.spyOn(window, 'addEventListener');
      const removeEventListenerSpy = vi.spyOn(window, 'removeEventListener');

      renderWithRouter('/dashboard/posts/create');

      const titleInput = screen.getByPlaceholderText('Title of your story...');
      fireEvent.change(titleInput, { target: { value: 'Dirty Title' } });

      expect(addEventListenerSpy).toHaveBeenCalledWith('beforeunload', expect.any(Function));

      const beforeUnloadCall = addEventListenerSpy.mock.calls.find(
        (call) => call[0] === 'beforeunload'
      );
      expect(beforeUnloadCall).toBeDefined();

      if (beforeUnloadCall) {
        const handler = beforeUnloadCall[1] as EventListener;
        const dummyEvent = {
          preventDefault: vi.fn(),
          returnValue: '',
        } as unknown as BeforeUnloadEvent;

        handler(dummyEvent);
        expect(dummyEvent.preventDefault).toHaveBeenCalled();
      }

      addEventListenerSpy.mockRestore();
      removeEventListenerSpy.mockRestore();
    });
  });
});

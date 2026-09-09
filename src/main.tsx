import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';

const apiBase = (import.meta.env.VITE_API_URL || '').replace(/\/$/, '');
const apiOrigin = apiBase ? new URL(apiBase, window.location.origin).origin : window.location.origin;
const originalFetch = window.fetch.bind(window);

window.fetch = (input: RequestInfo | URL, init?: RequestInit) => {
  const requestUrl = typeof input === 'string'
    ? new URL(input, window.location.origin)
    : input instanceof URL
      ? input
      : new URL(input.url);

  if (requestUrl.origin === apiOrigin && requestUrl.pathname.startsWith('/api/')) {
    return originalFetch(input, { ...init, credentials: 'include' });
  }
  return originalFetch(input, init);
};

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);

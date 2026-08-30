import { describe, it, expect } from 'vitest';
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import AdRequestsPage from '../components/dashboard/AdRequestsPage';

describe('Admin Operations Dashboard - Leads & Campaigns', () => {
  it('renders budget priority opportunities table', () => {
    render(
      <MemoryRouter>
        <AdRequestsPage />
      </MemoryRouter>
    );
    expect(screen.getByText(/All Opportunities/i)).toBeDefined();
    expect(screen.getAllByText(/Riyadh Seasons/i).length).toBeGreaterThan(0);
    expect(screen.getAllByText(/BankMed/i).length).toBeGreaterThan(0);
  });

  it('allows sorting by budget priority tier', () => {
    render(
      <MemoryRouter>
        <AdRequestsPage />
      </MemoryRouter>
    );
    const sortSelect = screen.getByRole('combobox');
    fireEvent.change(sortSelect, { target: { value: 'budget' } });
    expect(screen.getByText(/18500 USD/i)).toBeDefined();
  });

  it('supports Slack channel creation button action', () => {
    render(
      <MemoryRouter>
        <AdRequestsPage />
      </MemoryRouter>
    );
    const slackButtons = screen.getAllByText(/Create #ads-/i);
    expect(slackButtons.length).toBeGreaterThan(0);
  });
});

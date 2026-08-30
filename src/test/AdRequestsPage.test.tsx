import { describe, it, expect } from 'vitest';
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import AdRequestsPage from '../components/dashboard/AdRequestsPage';

describe('Admin Operations Dashboard - Leads & Campaigns', () => {
  it('renders budget priority opportunities table', () => {
    render(<AdRequestsPage />);
    expect(screen.getByText(/All Opportunities/i)).toBeDefined();
    expect(screen.getAllByText(/Riyadh Seasons/i).length).toBeGreaterThan(0);
    expect(screen.getAllByText(/BankMed/i).length).toBeGreaterThan(0);
  });

  it('allows sorting by budget priority tier', () => {
    render(<AdRequestsPage />);
    const sortSelect = screen.getByRole('combobox');
    fireEvent.change(sortSelect, { target: { value: 'budget' } });
    expect(screen.getByText(/18500 USD/i)).toBeDefined();
  });

  it('supports Slack channel creation button action', () => {
    render(<AdRequestsPage />);
    const slackButtons = screen.getAllByText(/Create #ads-/i);
    expect(slackButtons.length).toBeGreaterThan(0);
  });
});

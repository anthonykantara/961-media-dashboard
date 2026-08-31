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
    const selects = screen.getAllByRole('combobox');
    const sortSelect = selects[selects.length - 1];
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

  it('filters opportunities by search query', () => {
    render(
      <MemoryRouter>
        <AdRequestsPage />
      </MemoryRouter>
    );
    const searchInput = screen.getByPlaceholderText('Search leads...');
    fireEvent.change(searchInput, { target: { value: 'Riyadh' } });

    expect(screen.getAllByText(/Riyadh Seasons/i).length).toBeGreaterThan(0);
    expect(screen.queryByText(/BankMed/i)).toBeNull();
  });

  it('opens details modal showing advertiser info, contact, and itemized campaign package breakdown', () => {
    render(
      <MemoryRouter>
        <AdRequestsPage />
      </MemoryRouter>
    );
    const detailsButtons = screen.getAllByText('Details');
    fireEvent.click(detailsButtons[0]);

    expect(screen.getByText('Opportunity Ref #cmp_sa_tier5')).toBeDefined();
    expect(screen.getByText('Fahad Al-Harbi')).toBeDefined();
    expect(screen.getByText('Itemized Campaign Package Breakdown')).toBeDefined();
    expect(screen.getByText('Featured Article Package')).toBeDefined();
  });

  it('allows updating campaign state from the details modal', () => {
    render(
      <MemoryRouter>
        <AdRequestsPage />
      </MemoryRouter>
    );
    const detailsButtons = screen.getAllByText('Details');
    fireEvent.click(detailsButtons[0]);

    const statusSelect = screen.getByDisplayValue('Active / Paid');
    fireEvent.change(statusSelect, { target: { value: 'completed' } });

    expect(screen.getByDisplayValue('Completed')).toBeDefined();
  });
});

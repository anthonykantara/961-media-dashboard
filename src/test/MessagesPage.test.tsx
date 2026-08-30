import { describe, it, expect } from 'vitest';
import React from 'react';
import { render, screen } from '@testing-library/react';
import MessagesPage from '../components/dashboard/MessagesPage';

describe('Messages Page', () => {
  it('renders messages and does not contain reply form elements', () => {
    render(<MessagesPage />);

    expect(screen.getByText('Messages')).toBeDefined();
    expect(screen.getAllByText('Sami Haddad').length).toBeGreaterThan(0);
    expect(screen.queryByPlaceholderText('Write your response...')).toBeNull();
    expect(screen.queryByText('Send Reply')).toBeNull();
  });
});

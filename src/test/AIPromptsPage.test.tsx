import { describe, it, expect, beforeEach } from 'vitest';
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import AIPromptsPage from '../components/dashboard/AIPromptsPage';

describe('AI Prompts Dashboard - Advertising Prompts & Settings', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('renders prompt options including Sponsored Article Writer', () => {
    render(
      <MemoryRouter>
        <AIPromptsPage />
      </MemoryRouter>
    );

    expect(screen.getByText('AI Prompts')).toBeDefined();
    expect(screen.getByText('Main Article Writer')).toBeDefined();
    expect(screen.getByText('Sponsored Article Writer')).toBeDefined();
    expect(screen.queryByText('Ad Copy & Creative Generator')).toBeNull();
  });

  it('switches to Sponsored Article Writer prompt and displays brand guidelines', () => {
    render(
      <MemoryRouter>
        <AIPromptsPage />
      </MemoryRouter>
    );

    const select = screen.getByRole('combobox');
    fireEvent.change(select, { target: { value: 'sponsored_article' } });

    const textarea = screen.getByRole('textbox') as HTMLTextAreaElement;
    expect(textarea.value).toContain('commercial copywriter');
    expect(textarea.value).toContain('{brand_name}');
  });

  it('automatically selects prompt type specified in URL search params', () => {
    render(
      <MemoryRouter initialEntries={['/dashboard/ai?type=sponsored_article']}>
        <AIPromptsPage />
      </MemoryRouter>
    );

    const select = screen.getByRole('combobox') as HTMLSelectElement;
    expect(select.value).toBe('sponsored_article');

    const textarea = screen.getByRole('textbox') as HTMLTextAreaElement;
    expect(textarea.value).toContain('commercial copywriter');
  });

  it('saves modified prompt text to localStorage', () => {
    render(
      <MemoryRouter>
        <AIPromptsPage />
      </MemoryRouter>
    );

    const select = screen.getByRole('combobox');
    fireEvent.change(select, { target: { value: 'sponsored_article' } });

    const textarea = screen.getByRole('textbox');
    fireEvent.change(textarea, { target: { value: 'Custom sponsored prompt template for 961 Ads' } });

    const saveButton = screen.getByRole('button', { name: /save/i });
    fireEvent.click(saveButton);

    const saved = localStorage.getItem('961_ai_prompts');
    expect(saved).not.toBeNull();
    if (saved) {
      const parsed = JSON.parse(saved);
      expect(parsed.sponsored_article).toBe('Custom sponsored prompt template for 961 Ads');
    }
  });
});

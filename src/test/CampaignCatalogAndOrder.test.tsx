import { describe, it, expect } from 'vitest';
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import AdRequestsPage from '../components/dashboard/AdRequestsPage';
import { 
  PRODUCT_CATALOG, 
  ADDON_CATALOG, 
  calculateDistanceKm, 
  calculateDistanceSurcharge, 
  formatDistanceSurchargeText,
  BEIRUT_DOWNTOWN
} from '../types/campaign';

describe('Ad Products Catalog & Campaign Order Specifications', () => {

  it('contains updated product catalog pricing and inclusions', () => {
    const articleProd = PRODUCT_CATALOG.find(p => p.id === 'prod_featured_article');
    expect(articleProd?.price).toBe(2000);
    expect(articleProd?.inclusions).toContain('Custom engaging article in 3 languages (English, Arabic, French)');
    expect(articleProd?.inclusions).toContain('Instagram Carousel');

    const carouselProd = PRODUCT_CATALOG.find(p => p.id === 'prod_in_carousel_ig');
    expect(carouselProd?.price).toBe(500);
    expect(carouselProd?.inclusions).toContain('100k impressions guaranteed');

    const eventProd = PRODUCT_CATALOG.find(p => p.id === 'prod_event_package');
    expect(eventProd?.price).toBe(1000);
    expect(eventProd?.maxQuantity).toBe(1);
  });

  it('calculates distance surcharge from Beirut Downtown (25km free zone / $150 fee)', () => {
    // 0 km (Downtown Beirut)
    const dist0 = calculateDistanceKm(BEIRUT_DOWNTOWN.lat, BEIRUT_DOWNTOWN.lng);
    expect(dist0).toBe(0);
    expect(calculateDistanceSurcharge(dist0)).toBe(0);
    expect(formatDistanceSurchargeText(dist0)).toBe('0km from Beirut - $0 Distance surcharge');

    // 67 km venue (Batroun ~52km or similar)
    const dist67 = 67;
    expect(calculateDistanceSurcharge(dist67)).toBe(150);
    expect(formatDistanceSurchargeText(dist67)).toBe('67km from Beirut - $150 Distance surcharge');
  });

  it('renders order summary sub-header copy and grouped add-ons in details modal', () => {
    render(
      <MemoryRouter>
        <AdRequestsPage />
      </MemoryRouter>
    );

    const detailsButtons = screen.getAllByText('Details');
    fireEvent.click(detailsButtons[0]); // Open Riyadh Seasons campaign

    expect(screen.getByText('Review your campaign order summary and complete payment to launch.')).toBeDefined();
    expect(screen.getByText('Distance Surcharge')).toBeDefined();
    expect(screen.getAllByText('Featured Article Package').length).toBeGreaterThan(0);
  });

  it('renders campaign details & specifications intake tab with schedule and location calculation', () => {
    render(
      <MemoryRouter>
        <AdRequestsPage />
      </MemoryRouter>
    );

    const detailsButtons = screen.getAllByText('Details');
    fireEvent.click(detailsButtons[0]);

    // Switch to Intake Specs Tab
    const intakeTab = screen.getByText('Campaign Details & Specifications Intake');
    fireEvent.click(intakeTab);

    expect(screen.getByText('Event Specifications')).toBeDefined();
    expect(screen.getAllByText('Only 1 tag permitted').length).toBeGreaterThan(0);
    expect(screen.getByText('Adding as much information as possible is helpful')).toBeDefined();
    expect(screen.getAllByText('Upload Creative Assets').length).toBeGreaterThan(0);
  });

  it('renders product offerings catalog tab allowing adding products and add-ons', () => {
    render(
      <MemoryRouter>
        <AdRequestsPage />
      </MemoryRouter>
    );

    const detailsButtons = screen.getAllByText('Details');
    fireEvent.click(detailsButtons[0]);

    // Switch to Catalog Tab
    const catalogTab = screen.getByText('Product Offerings Catalog');
    fireEvent.click(catalogTab);

    expect(screen.getByText('1. Select Ad Products')).toBeDefined();
    expect(screen.getByText('2. Product-Bound & Campaign Add-ons')).toBeDefined();
  });

});

import { Post } from '../components/dashboard/posts/types';
import { LocationTerritory } from '../types/location';

/**
 * Returns true if a given location (country, city, or topic) has at least one published article.
 */
export function hasPublishedArticlesForLocation(
  location: LocationTerritory,
  allLocations: LocationTerritory[],
  posts: Post[]
): boolean {
  const published = posts.filter(p => p.status === 'Published');
  
  if (location.level === 'country') {
    // Check if there are posts directly for this country or for any of its cities
    const cityIds = allLocations
      .filter(l => l.parentId === location.id || l.countryCode === location.countryCode)
      .map(l => l.id);
    
    return published.some(p => p.locationId === location.id || (p.locationId && cityIds.includes(p.locationId)));
  }

  // City or Topic level
  return published.some(p => p.locationId === location.id);
}

/**
 * Returns the list of language codes ('en', 'ar', 'fr', etc.) that have at least one published article
 * for the active location.
 */
export function getAvailableLanguagesForLocation(
  activeLocation: LocationTerritory | null,
  allLocations: LocationTerritory[],
  posts: Post[]
): string[] {
  if (!activeLocation) {
    return ['en'];
  }

  const published = posts.filter(p => p.status === 'Published');
  
  let matchingPosts: Post[] = [];
  if (activeLocation.level === 'country') {
    const cityIds = allLocations
      .filter(l => l.parentId === activeLocation.id || l.countryCode === activeLocation.countryCode)
      .map(l => l.id);
    
    matchingPosts = published.filter(p => p.locationId === activeLocation.id || (p.locationId && cityIds.includes(p.locationId)));
  } else {
    matchingPosts = published.filter(p => p.locationId === activeLocation.id);
  }

  const availableLangCodes = Array.from(
    new Set(matchingPosts.map(p => p.language).filter(Boolean))
  ) as string[];

  // Fallback: If no posts yet or matching, respect location's supportedLanguages or defaultLanguage
  if (availableLangCodes.length === 0) {
    return [activeLocation.defaultLanguage || 'en'];
  }

  // Order languages according to the location's defined supportedLanguages list
  const definedOrder = activeLocation.supportedLanguages || ['en', 'ar', 'fr'];
  const sorted = definedOrder.filter(code => availableLangCodes.includes(code));
  
  return sorted.length > 0 ? sorted : availableLangCodes;
}

/**
 * Returns the unique list of categories that have at least one published article for the current
 * location and language combination.
 */
export function getAvailableCategoriesForLocationAndLang(
  activeLocation: LocationTerritory | null,
  activeLanguage: string,
  allLocations: LocationTerritory[],
  posts: Post[]
): string[] {
  const published = posts.filter(p => p.status === 'Published');
  
  let matchingPosts: Post[] = [];

  if (!activeLocation) {
    matchingPosts = published.filter(p => !p.language || p.language === activeLanguage);
  } else if (activeLocation.level === 'country') {
    const cityIds = allLocations
      .filter(l => l.parentId === activeLocation.id || l.countryCode === activeLocation.countryCode)
      .map(l => l.id);
    
    matchingPosts = published.filter(p => 
      (p.locationId === activeLocation.id || (p.locationId && cityIds.includes(p.locationId))) &&
      (!p.language || p.language === activeLanguage)
    );
  } else {
    matchingPosts = published.filter(p => 
      p.locationId === activeLocation.id && 
      (!p.language || p.language === activeLanguage)
    );
  }

  const categories = Array.from(new Set(matchingPosts.map(p => p.category).filter(Boolean)));
  return categories;
}

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { LocationTerritory, SupportedLanguage, SUPPORTED_LANGUAGES } from '../types/location';

export const INITIAL_LOCATIONS: LocationTerritory[] = [
  // Topic Global Editions
  {
    id: 'topic-tech',
    name: 'Tech',
    slug: 'tech',
    level: 'topic',
    countryCode: 'TECH',
    flagEmoji: '⚡',
    isHub: false,
    status: 'active',
    supportedLanguages: ['en', 'ar', 'fr', 'sk'],
    defaultLanguage: 'en',
  },
  {
    id: 'topic-business',
    name: 'Business',
    slug: 'business',
    level: 'topic',
    countryCode: 'BIZ',
    flagEmoji: '💼',
    isHub: false,
    status: 'active',
    supportedLanguages: ['en', 'ar', 'fr', 'sk'],
    defaultLanguage: 'en',
  },
  {
    id: 'topic-sports',
    name: 'Sports',
    slug: 'sports',
    level: 'topic',
    countryCode: 'SPORTS',
    flagEmoji: '⚽',
    isHub: false,
    status: 'active',
    supportedLanguages: ['en', 'ar', 'fr', 'sk'],
    defaultLanguage: 'en',
  },

  // Country Markets
  {
    id: 'lb',
    name: 'Lebanon',
    slug: 'lb',
    level: 'country',
    countryCode: 'LB',
    flagEmoji: '🇱🇧',
    isHub: false,
    status: 'active',
    supportedLanguages: ['en', 'ar', 'fr'],
    defaultLanguage: 'en',
  },
  {
    id: 'sk',
    name: 'Slovakia',
    slug: 'sk',
    level: 'country',
    countryCode: 'SK',
    flagEmoji: '🇸🇰',
    isHub: false,
    status: 'beta',
    supportedLanguages: ['en', 'sk'],
    defaultLanguage: 'en',
  },

  // Multi-City Hubs: Saudi Arabia
  {
    id: 'sa',
    name: 'Saudi Arabia',
    slug: 'sa',
    level: 'country',
    countryCode: 'SA',
    flagEmoji: '🇸🇦',
    isHub: true,
    status: 'active',
    supportedLanguages: ['ar', 'en'],
    defaultLanguage: 'ar',
  },
  {
    id: 'sa-riyadh',
    name: 'Riyadh',
    slug: 'riyadh',
    level: 'city',
    parentId: 'sa',
    countryCode: 'SA',
    flagEmoji: '🇸🇦',
    isHub: false,
    status: 'active',
    supportedLanguages: ['ar', 'en'],
    defaultLanguage: 'ar',
  },
  {
    id: 'sa-jeddah',
    name: 'Jeddah',
    slug: 'jeddah',
    level: 'city',
    parentId: 'sa',
    countryCode: 'SA',
    flagEmoji: '🇸🇦',
    isHub: false,
    status: 'soon',
    supportedLanguages: ['ar', 'en'],
    defaultLanguage: 'ar',
  },

  // Multi-City Hubs: UAE
  {
    id: 'ae',
    name: 'United Arab Emirates',
    slug: 'ae',
    level: 'country',
    countryCode: 'AE',
    flagEmoji: '🇦🇪',
    isHub: true,
    status: 'active',
    supportedLanguages: ['en', 'ar'],
    defaultLanguage: 'en',
  },
  {
    id: 'ae-dubai',
    name: 'Dubai',
    slug: 'dubai',
    level: 'city',
    parentId: 'ae',
    countryCode: 'AE',
    flagEmoji: '🇦🇪',
    isHub: false,
    status: 'active',
    supportedLanguages: ['en', 'ar'],
    defaultLanguage: 'en',
  },
  {
    id: 'ae-abudhabi',
    name: 'Abu Dhabi',
    slug: 'abu-dhabi',
    level: 'city',
    parentId: 'ae',
    countryCode: 'AE',
    flagEmoji: '🇦🇪',
    isHub: false,
    status: 'new',
    supportedLanguages: ['en', 'ar'],
    defaultLanguage: 'en',
  },
];

export const GLOBAL_SUPPORTED_LANGUAGES = ['en', 'ar', 'fr', 'sk'];

interface LocationContextType {
  locations: LocationTerritory[];
  activeLocationId: string | null; // null = Default / First Region
  activeLocation: LocationTerritory | null;
  activeLanguage: string;
  activeLanguageInfo: SupportedLanguage;
  availableLanguages: SupportedLanguage[];
  setActiveLocationId: (id: string | null) => void;
  setActiveLanguage: (lang: string) => void;
  setActiveLocationAndLanguage: (id: string | null, lang?: string) => void;
  addLocation: (location: LocationTerritory) => void;
  updateLocation: (location: LocationTerritory) => void;
  deleteLocation: (id: string) => void;
  smartDetectLocation: () => Promise<LocationTerritory | null>;
  isDetecting: boolean;
  detectedMessage: string | null;
  getLocationUrl: (loc: LocationTerritory | null, lang?: string) => string;
}

const LocationContext = createContext<LocationContextType | undefined>(undefined);

const STORAGE_KEY_LOCATIONS = 'the961_locations_list_v7';
const STORAGE_KEY_ACTIVE = 'the961_active_location_id_v7';
const STORAGE_KEY_LANG = 'the961_active_language_v7';

export function LocationProvider({ children }: { children: ReactNode }) {
  const [locations, setLocations] = useState<LocationTerritory[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_LOCATIONS);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          // Merge initial locations to ensure updated statuses/topics are present
          const initialMap = new Map(INITIAL_LOCATIONS.map(loc => [loc.id, loc]));
          const merged = [...INITIAL_LOCATIONS];
          
          parsed.forEach((savedLoc: LocationTerritory) => {
            if (!initialMap.has(savedLoc.id)) {
              merged.push(savedLoc);
            }
          });
          return merged;
        }
      }
      return INITIAL_LOCATIONS;
    } catch {
      return INITIAL_LOCATIONS;
    }
  });

  const [activeLocationId, setActiveLocationIdState] = useState<string | null>(() => {
    try {
      return localStorage.getItem(STORAGE_KEY_ACTIVE) || 'lb';
    } catch {
      return 'lb';
    }
  });

  const [activeLanguage, setActiveLanguageState] = useState<string>(() => {
    try {
      return localStorage.getItem(STORAGE_KEY_LANG) || 'en';
    } catch {
      return 'en';
    }
  });

  const [isDetecting, setIsDetecting] = useState(false);
  const [detectedMessage, setDetectedMessage] = useState<string | null>(null);

  // Sync locations to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_LOCATIONS, JSON.stringify(locations));
    } catch (e) {
      console.error(e);
    }
  }, [locations]);

  // RTL & DOM Language Sync
  useEffect(() => {
    const langInfo = SUPPORTED_LANGUAGES[activeLanguage] || SUPPORTED_LANGUAGES.en;
    document.documentElement.dir = langInfo.dir;
    document.documentElement.lang = activeLanguage;
    if (langInfo.dir === 'rtl') {
      document.documentElement.classList.add('rtl');
    } else {
      document.documentElement.classList.remove('rtl');
    }
  }, [activeLanguage]);

  const activeLocation = activeLocationId 
    ? locations.find(l => l.id === activeLocationId) || null
    : null;

  // Compute available languages based on active location
  const currentSupportedCodes = activeLocation
    ? (activeLocation.supportedLanguages || ['en'])
    : GLOBAL_SUPPORTED_LANGUAGES;

  const availableLanguages = currentSupportedCodes
    .map(code => SUPPORTED_LANGUAGES[code])
    .filter(Boolean);

  const activeLanguageInfo = SUPPORTED_LANGUAGES[activeLanguage] || SUPPORTED_LANGUAGES.en;

  const setActiveLanguage = (lang: string) => {
    if (SUPPORTED_LANGUAGES[lang]) {
      setActiveLanguageState(lang);
      try {
        localStorage.setItem(STORAGE_KEY_LANG, lang);
      } catch (e) {
        console.error(e);
      }
    }
  };

  const setActiveLocationId = (id: string | null) => {
    setActiveLocationIdState(id);
    try {
      if (id) {
        localStorage.setItem(STORAGE_KEY_ACTIVE, id);
      } else {
        localStorage.removeItem(STORAGE_KEY_ACTIVE);
      }
    } catch (e) {
      console.error(e);
    }

    // Auto-adjust activeLanguage if not supported by the new location
    if (id) {
      const loc = locations.find(l => l.id === id);
      if (loc && loc.supportedLanguages && !loc.supportedLanguages.includes(activeLanguage)) {
        setActiveLanguage(loc.defaultLanguage || loc.supportedLanguages[0] || 'en');
      }
    }
  };

  const setActiveLocationAndLanguage = (id: string | null, lang?: string) => {
    setActiveLocationId(id);
    if (lang) {
      setActiveLanguage(lang);
    } else if (id) {
      const loc = locations.find(l => l.id === id);
      if (loc && loc.supportedLanguages && !loc.supportedLanguages.includes(activeLanguage)) {
        setActiveLanguage(loc.defaultLanguage || loc.supportedLanguages[0] || 'en');
      }
    }
  };

  const addLocation = (newLoc: LocationTerritory) => {
    setLocations(prev => [...prev, newLoc]);
  };

  const updateLocation = (updatedLoc: LocationTerritory) => {
    setLocations(prev => prev.map(l => l.id === updatedLoc.id ? updatedLoc : l));
  };

  const deleteLocation = (id: string) => {
    setLocations(prev => prev.filter(l => l.id !== id && l.parentId !== id));
    if (activeLocationId === id) {
      setActiveLocationId('lb');
    }
  };

  const smartDetectLocation = async (): Promise<LocationTerritory | null> => {
    setIsDetecting(true);
    setDetectedMessage(null);
    
    // Simulate smart IP geolocation check
    await new Promise(res => setTimeout(res, 600));

    // Simulated detection logic
    const detected = locations.find(l => l.id === 'lb') || locations[0] || null;
    
    if (detected) {
      setActiveLocationAndLanguage(detected.id, detected.defaultLanguage || 'en');
      setDetectedMessage(`Detected location: ${detected.flagEmoji} ${detected.name}`);
    } else {
      setActiveLocationAndLanguage(null, 'en');
      setDetectedMessage('Global region selected');
    }

    setIsDetecting(false);

    setTimeout(() => {
      setDetectedMessage(null);
    }, 4000);

    return detected;
  };

  // Option A SEO URL structure: /country/city/lang or /country/lang or /lang
  const getLocationUrl = (loc: LocationTerritory | null, lang: string = activeLanguage): string => {
    if (!loc) return `/${lang}`;
    if (loc.level === 'country') {
      return `/${loc.countryCode.toLowerCase()}/${lang}`;
    }
    // City level
    const parent = locations.find(l => l.id === loc.parentId);
    const countrySegment = parent ? parent.countryCode.toLowerCase() : loc.countryCode.toLowerCase();
    return `/${countrySegment}/${loc.slug}/${lang}`;
  };

  return (
    <LocationContext.Provider value={{
      locations,
      activeLocationId,
      activeLocation,
      activeLanguage,
      activeLanguageInfo,
      availableLanguages,
      setActiveLocationId,
      setActiveLanguage,
      setActiveLocationAndLanguage,
      addLocation,
      updateLocation,
      deleteLocation,
      smartDetectLocation,
      isDetecting,
      detectedMessage,
      getLocationUrl,
    }}>
      {children}
    </LocationContext.Provider>
  );
}

export function useLocationContext() {
  const context = useContext(LocationContext);
  if (!context) {
    throw new Error('useLocationContext must be used within a LocationProvider');
  }
  return context;
}

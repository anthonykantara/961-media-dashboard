export type LocationLevel = 'country' | 'city' | 'topic';

export interface SupportedLanguage {
  code: string;       // 'en', 'ar', 'fr', 'sk'
  name: string;       // 'English', 'Arabic', 'French', 'Slovak'
  nativeName: string; // 'English', 'العربية', 'Français', 'Slovenčina'
  short: string;      // 'EN', 'AR', 'FR', 'SK'
  dir: 'ltr' | 'rtl';
}

export const SUPPORTED_LANGUAGES: Record<string, SupportedLanguage> = {
  en: { code: 'en', name: 'English', nativeName: 'English', short: 'EN', dir: 'ltr' },
  ar: { code: 'ar', name: 'Arabic', nativeName: 'العربية', short: 'AR', dir: 'rtl' },
  fr: { code: 'fr', name: 'French', nativeName: 'Français', short: 'FR', dir: 'ltr' },
  sk: { code: 'sk', name: 'Slovak', nativeName: 'Slovenčina', short: 'SK', dir: 'ltr' },
};

export interface LocationTerritory {
  id: string;            // e.g. 'lb', 'sk', 'sa', 'sa-riyadh', 'sa-jeddah', 'ae', 'ae-dubai', 'topic-tech', 'topic-business'
  name: string;          // e.g. 'Lebanon', 'Slovakia', 'Tech', 'Business'
  slug: string;          // e.g. 'lb', 'sk', 'sa', 'tech', 'business'
  level: LocationLevel;  // 'country' | 'city' | 'topic'
  parentId?: string;     // ID of parent country if level === 'city'
  countryCode: string;   // ISO 2-letter: 'LB', 'SK', 'SA', 'AE', 'TECH', 'BIZ'
  flagEmoji: string;     // 🇱🇧, 🇸🇰, 🇸🇦, 🇦🇪, ⚡, 💼
  isHub: boolean;        // true if has sub-cities or is country hub
  status: 'active' | 'beta' | 'soon' | 'new' | 'draft';
  supportedLanguages: string[]; // e.g. ['en', 'ar', 'fr']
  defaultLanguage: string;      // e.g. 'en' or 'ar'
}

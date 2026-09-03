export type ProductId =
  | 'prod_featured_article'
  | 'prod_in_carousel_ig'
  | 'prod_event_package';

export type AddonId =
  | 'addon_plus_2_articles'
  | 'addon_additional_100k_impressions'
  | 'addon_event_additional_3_stories'
  | 'addon_event_recap_reel'
  | 'addon_event_extra_day'
  | 'addon_event_highlight_7d'
  | 'addon_express_delivery';

export interface AdProductCatalogItem {
  id: ProductId;
  name: string;
  price: number;
  currency: string;
  inclusions: string[];
  description?: string;
  maxQuantity?: number; // 1 for prod_event_package
  allowsMultiQuantity: boolean;
}

export interface AdAddonCatalogItem {
  id: AddonId;
  name: string;
  parentProductId: ProductId | 'campaign_wide';
  price: number;
  currency: string;
  allowsMultiQuantity: boolean;
  unitLabel?: string;
  getHelperText?: (quantity: number, parentQuantity?: number) => string;
}

export interface EventDaySchedule {
  dayLabel: string; // e.g. "Day 1 (Main Event)", "Day 2 (Extra Day Coverage)"
  date: string; // YYYY-MM-DD
  startTime: string; // HH:mm
  endTime: string; // HH:mm
}

export interface VenueLocation {
  name: string;
  address?: string;
  lat: number;
  lng: number;
  distanceKm: number;
  surchargeAmount: number;
}

export interface CampaignIntakeSpecs {
  // Event Specs
  eventTitle?: string;
  eventInstagramTag?: string; // @yourbrand
  eventSchedules?: EventDaySchedule[];
  venueLocation?: VenueLocation;

  // In-Carousel Specs
  carouselInstagramTag?: string; // @yourbrand

  // Featured Article Specs
  articleTargetPublishDate?: string;

  // Notes & Assets
  campaignObjectivesNotes?: string;
  creativeAssets?: Array<{ id: string; name: string; size?: string; url?: string }>;
}

export interface CampaignOrderItem {
  id: string;
  productId?: ProductId;
  addonId?: AddonId;
  type: 'product' | 'addon';
  parentProductId?: ProductId | 'campaign_wide';
  name: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
}

// Distance Surcharge Constants
export const BEIRUT_DOWNTOWN = {
  lat: 33.8969,
  lng: 35.5017,
  name: 'Beirut Downtown'
};

export const SURCHARGE_FREE_RADIUS_KM = 25;
export const SURCHARGE_FLAT_FEE_USD = 150;

/**
 * Distance calculation in km using Haversine formula
 */
export function calculateDistanceKm(lat1: number, lon1: number, lat2: number = BEIRUT_DOWNTOWN.lat, lon2: number = BEIRUT_DOWNTOWN.lng): number {
  const R = 6371; // Earth radius in km
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return Math.round(R * c);
}

export function calculateDistanceSurcharge(distanceKm: number): number {
  return distanceKm <= SURCHARGE_FREE_RADIUS_KM ? 0 : SURCHARGE_FLAT_FEE_USD;
}

export function formatDistanceSurchargeText(distanceKm: number): string {
  const surcharge = calculateDistanceSurcharge(distanceKm);
  return `${distanceKm}km from Beirut - $${surcharge} Distance surcharge`;
}

// Product Catalog
export const PRODUCT_CATALOG: AdProductCatalogItem[] = [
  {
    id: 'prod_featured_article',
    name: 'Featured Article Package',
    price: 2000,
    currency: 'USD',
    allowsMultiQuantity: true,
    inclusions: [
      'Custom engaging article in 3 languages (English, Arabic, French)',
      'Instagram Carousel',
      'IG post shared to Stories',
      'Facebook post',
      'LinkedIn post',
      'WhatsApp channel update'
    ]
  },
  {
    id: 'prod_in_carousel_ig',
    name: 'In-Carousel Instagram Placement',
    price: 500,
    currency: 'USD',
    allowsMultiQuantity: true,
    inclusions: [
      '100k impressions guaranteed',
      'Dedicated slide placement before final carousel slide',
      'Published on @961app Instagram page'
    ]
  },
  {
    id: 'prod_event_package',
    name: 'Event Coverage Package',
    price: 1000,
    currency: 'USD',
    maxQuantity: 1,
    allowsMultiQuantity: false,
    inclusions: [
      '3 IG stories filmed on site of an event (e.g. launch or opening)',
      'Clear & subtle brand tag included in the first and last story',
      'On-site 961 media team coverage'
    ]
  }
];

// Add-on Catalog
export const ADDON_CATALOG: AdAddonCatalogItem[] = [
  {
    id: 'addon_plus_2_articles',
    name: '+2 Article Packages',
    parentProductId: 'prod_featured_article',
    price: 2000,
    currency: 'USD',
    allowsMultiQuantity: false
  },
  {
    id: 'addon_additional_100k_impressions',
    name: 'Additional 100k Impressions',
    parentProductId: 'prod_in_carousel_ig',
    price: 350,
    currency: 'USD',
    allowsMultiQuantity: true,
    unitLabel: 'per 100k impressions',
    getHelperText: (qty: number) => `${(1 + qty) * 100}k guaranteed`
  },
  {
    id: 'addon_event_additional_3_stories',
    name: 'Additional 3 IG Stories',
    parentProductId: 'prod_event_package',
    price: 350,
    currency: 'USD',
    allowsMultiQuantity: true,
    unitLabel: 'per 3 stories'
  },
  {
    id: 'addon_event_recap_reel',
    name: 'Recap Reel',
    parentProductId: 'prod_event_package',
    price: 750,
    currency: 'USD',
    allowsMultiQuantity: false,
    unitLabel: 'per reel'
  },
  {
    id: 'addon_event_extra_day',
    name: 'Additional Event Day Coverage',
    parentProductId: 'prod_event_package',
    price: 500,
    currency: 'USD',
    allowsMultiQuantity: true,
    unitLabel: 'per day'
  },
  {
    id: 'addon_event_highlight_7d',
    name: 'Dedicated IG Highlight (7 Days)',
    parentProductId: 'prod_event_package',
    price: 250,
    currency: 'USD',
    allowsMultiQuantity: true,
    unitLabel: 'per 7-day block',
    getHelperText: (qty: number) => `${qty * 7} Days`
  },
  {
    id: 'addon_express_delivery',
    name: 'Express 24-Hour Production & Delivery',
    parentProductId: 'campaign_wide',
    price: 250,
    currency: 'USD',
    allowsMultiQuantity: false
  }
];

// Sample Lebanese Venues with Coordinates
export const PRESET_VENUES = [
  { name: 'Beirut Waterfront / Downtown', address: 'Downtown Beirut', lat: 33.8969, lng: 35.5017 },
  { name: 'Phoenicia Hotel Beirut', address: 'Minet El Hosn, Beirut', lat: 33.9008, lng: 35.4925 },
  { name: 'Forum de Beyrouth', address: 'Karantina, Beirut', lat: 33.9022, lng: 35.5283 },
  { name: 'Sea-Side Arena (BIEL)', address: 'Waterfront, Beirut', lat: 33.9056, lng: 35.5140 },
  { name: 'Automobil Club du Liban (ATCL)', address: 'Kaslik, Jounieh', lat: 33.9856, lng: 35.6178 }, // ~22km
  { name: 'Byblos Harbour Citadel', address: 'Byblos / Jbeil', lat: 34.1214, lng: 35.6461 }, // ~38km
  { name: 'Batroun Old Port', address: 'Batroun', lat: 34.2556, lng: 35.6583 }, // ~52km
  { name: 'Faraya Mzaar Ski Resort', address: 'Faraya, Kfardebian', lat: 33.9986, lng: 35.8361 }, // ~48km
  { name: 'Mir Amin Palace', address: 'Beiteddine, Chouf', lat: 33.6939, lng: 35.5794 }, // ~35km
  { name: 'Rashid Karami International Fair', address: 'Tripoli', lat: 34.4367, lng: 35.8286 }, // ~80km
  { name: 'Rest House Tyre Resort', address: 'Tyre / Soor', lat: 33.2667, lng: 35.2078 }, // ~83km
];

import React, { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { 
  Check, 
  X, 
  Eye, 
  Hash, 
  ArrowUpDown, 
  Building, 
  MessageSquare, 
  FileText, 
  DollarSign,
  AlertCircle,
  ExternalLink,
  Bot,
  Search,
  Phone,
  Globe,
  Tag,
  Edit3,
  Layers,
  ChevronDown
} from 'lucide-react';

import { 
  ProductId, 
  AddonId, 
  CampaignOrderItem, 
  CampaignIntakeSpecs, 
  PRODUCT_CATALOG, 
  ADDON_CATALOG,
  calculateDistanceSurcharge,
  formatDistanceSurchargeText,
  calculateDistanceKm
} from '../../types/campaign';

import CampaignOrderSummary from './ads/CampaignOrderSummary';
import CampaignIntakeForm from './ads/CampaignIntakeForm';
import CatalogSelector from './ads/CatalogSelector';

export interface OpportunityItem {
  id: string;
  name: string;
  objective: string;
  countryId: string;
  status: 'lead_captured' | 'draft' | 'pending_payment' | 'active' | 'completed' | 'cancelled';
  totalAmount: number;
  currency: string;
  accessToken: string;
  slackChannel?: string;
  sessionId?: string;
  notes?: string;
  priorityTier: number; // 5 ($15k+), 4 ($7.5k-$15k), 3 ($3k-$7.5k), 2 ($1k-$3k), 1 (<$1k)
  createdAt: string;
  advertiser?: {
    id: string;
    companyName: string;
    companySlug: string;
    brandName: string;
    website?: string;
    industry?: string;
  };
  contact?: {
    id: string;
    fullName: string;
    email: string;
    phoneNumber: string;
  };
  items?: CampaignOrderItem[];
  intakeSpecs?: CampaignIntakeSpecs;
  assets?: Array<{
    id: string;
    fileName: string;
    wasabiPath: string;
  }>;
}

const INITIAL_OPPORTUNITIES: OpportunityItem[] = [
  {
    id: 'cmp_sa_tier5',
    name: 'Riyadh Seasons Gulf Regional Campaign',
    objective: 'Brand Awareness & Regional Reach',
    countryId: 'sa',
    status: 'active',
    totalAmount: 18500,
    currency: 'USD',
    accessToken: 'cmp_tok_riyadh_seasons_99',
    slackChannel: '#ads-riyadh-seasons',
    priorityTier: 5,
    createdAt: new Date(Date.now() - 3600000 * 2).toISOString(),
    advertiser: {
      id: 'adv_sa_1',
      companyName: 'Riyadh Seasons Tourism Authority',
      companySlug: 'riyadh-seasons-tourism-authority',
      brandName: 'Riyadh Seasons',
      website: 'https://riyadhseasons.sa',
      industry: 'Tourism & Culture'
    },
    contact: {
      id: 'cnt_sa_1',
      fullName: 'Fahad Al-Harbi',
      email: 'fahad@riyadhseasons.sa',
      phoneNumber: '+966 50 111 2222'
    },
    items: [
      { id: 'i1', type: 'product', productId: 'prod_featured_article', name: 'Featured Article Package', quantity: 4, unitPrice: 2000, totalPrice: 8000 },
      { id: 'i2', type: 'product', productId: 'prod_in_carousel_ig', name: 'In-Carousel Instagram Placement', quantity: 10, unitPrice: 500, totalPrice: 5000 },
      { id: 'i3', type: 'addon', addonId: 'addon_additional_100k_impressions', parentProductId: 'prod_in_carousel_ig', name: 'Additional 100k Impressions', quantity: 10, unitPrice: 350, totalPrice: 3500 },
      { id: 'i4', type: 'product', productId: 'prod_event_package', name: 'Event Coverage Package', quantity: 1, unitPrice: 1000, totalPrice: 1000 },
      { id: 'i5', type: 'addon', addonId: 'addon_express_delivery', parentProductId: 'campaign_wide', name: 'Express 24-Hour Production & Delivery', quantity: 1, unitPrice: 250, totalPrice: 250 },
      { id: 'i6', type: 'addon', addonId: 'addon_event_extra_day', parentProductId: 'prod_event_package', name: 'Additional Event Day Coverage', quantity: 1, unitPrice: 500, totalPrice: 500 }
    ],
    intakeSpecs: {
      eventTitle: 'Riyadh Seasons Opening Night',
      eventInstagramTag: '@riyadhseasons',
      carouselInstagramTag: '@riyadhseasons',
      articleTargetPublishDate: '2026-10-15',
      venueLocation: {
        name: 'Byblos Harbour Citadel',
        address: 'Byblos',
        lat: 34.1214,
        lng: 35.6461,
        distanceKm: 38,
        surchargeAmount: 150
      },
      campaignObjectivesNotes: 'Launch multi-channel regional awareness across Saudi Arabia and the Gulf for Riyadh Seasons 2026. Adding as much information as possible is helpful',
      creativeAssets: [
        { id: 'a1', name: 'Riyadh_Seasons_KeyVisual_4K.png', size: '12.4 MB' },
        { id: 'a2', name: 'Campaign_Guidelines_v2.pdf', size: '3.1 MB' }
      ]
    }
  },
  {
    id: 'cmp_lb_tier4',
    name: 'BankMed Expat Account Launch',
    objective: 'Lead Generation',
    countryId: 'lb',
    status: 'pending_payment',
    totalAmount: 9200,
    currency: 'USD',
    accessToken: 'cmp_tok_bankmed_expats',
    slackChannel: '#ads-bankmed-lebanon',
    priorityTier: 4,
    createdAt: new Date(Date.now() - 3600000 * 5).toISOString(),
    advertiser: {
      id: 'adv_lb_1',
      companyName: 'BankMed Lebanon SAL',
      companySlug: 'bankmed-lebanon-sal',
      brandName: 'BankMed',
      website: 'https://bankmed.com.lb',
      industry: 'Banking & Financial Services'
    },
    contact: {
      id: 'cnt_lb_1',
      fullName: 'Rami Touma',
      email: 'rami.t@bankmed.com.lb',
      phoneNumber: '+961 70 333 444'
    },
    items: [
      { id: 'i7', type: 'product', productId: 'prod_featured_article', name: 'Featured Article Package', quantity: 2, unitPrice: 2000, totalPrice: 4000 },
      { id: 'i8', type: 'product', productId: 'prod_in_carousel_ig', name: 'In-Carousel Instagram Placement', quantity: 6, unitPrice: 500, totalPrice: 3000 },
      { id: 'i9', type: 'addon', addonId: 'addon_plus_2_articles', parentProductId: 'prod_featured_article', name: '+2 Article Packages', quantity: 1, unitPrice: 2000, totalPrice: 2000 }
    ],
    intakeSpecs: {
      carouselInstagramTag: '@bankmed',
      articleTargetPublishDate: '2026-09-20',
      campaignObjectivesNotes: 'Promote new expatriate high-yield account with low transfer fees.'
    }
  },
  {
    id: 'cmp_ae_tier3',
    name: 'Dubai Fintech Week Regional Takeover',
    objective: 'Sales & Conversions',
    countryId: 'ae',
    status: 'active',
    totalAmount: 4500,
    currency: 'USD',
    accessToken: 'cmp_tok_dubai_fintech',
    slackChannel: '#ads-dubai-fintech-week',
    priorityTier: 3,
    createdAt: new Date(Date.now() - 3600000 * 12).toISOString(),
    advertiser: {
      id: 'adv_ae_1',
      companyName: 'Dubai Fintech Week Ltd',
      companySlug: 'dubai-fintech-week-ltd',
      brandName: 'Dubai Fintech Week',
      website: 'https://dubaifintech.ae',
      industry: 'Fintech & Tech'
    },
    contact: {
      id: 'cnt_ae_1',
      fullName: 'Sarah Jenkins',
      email: 'sarah.j@dubaifintech.ae',
      phoneNumber: '+971 50 999 8888'
    },
    items: [
      { id: 'i10', type: 'product', productId: 'prod_featured_article', name: 'Featured Article Package', quantity: 1, unitPrice: 2000, totalPrice: 2000 },
      { id: 'i11', type: 'product', productId: 'prod_in_carousel_ig', name: 'In-Carousel Instagram Placement', quantity: 5, unitPrice: 500, totalPrice: 2500 }
    ],
    intakeSpecs: {
      carouselInstagramTag: '@dubaifintech',
      articleTargetPublishDate: '2026-10-01'
    }
  },
  {
    id: 'cmp_lb_tier2',
    name: 'Almaza Craft Edition Summer Campaign',
    objective: 'Brand Awareness',
    countryId: 'lb',
    status: 'lead_captured',
    totalAmount: 1700,
    currency: 'USD',
    accessToken: 'cmp_tok_almaza_craft',
    priorityTier: 2,
    createdAt: new Date(Date.now() - 3600000 * 24).toISOString(),
    advertiser: {
      id: 'adv_lb_2',
      companyName: 'Almaza Brewery SAL',
      companySlug: 'almaza-brewery-sal',
      brandName: 'Almaza',
      website: 'https://almaza.com.lb',
      industry: 'Food & Beverage'
    },
    contact: {
      id: 'cnt_lb_2',
      fullName: 'Ziad Chemali',
      email: 'z.chemali@almaza.com.lb',
      phoneNumber: '+961 71 555 666'
    },
    items: [
      { id: 'i12', type: 'product', productId: 'prod_event_package', name: 'Event Coverage Package', quantity: 1, unitPrice: 1000, totalPrice: 1000 },
      { id: 'i13', type: 'addon', addonId: 'addon_event_recap_reel', parentProductId: 'prod_event_package', name: 'Recap Reel', quantity: 1, unitPrice: 750, totalPrice: 750 }
    ],
    intakeSpecs: {
      eventTitle: 'Almaza Craft Edition Launch',
      eventInstagramTag: '@almazabeer',
      venueLocation: {
        name: 'Batroun Old Port',
        address: 'Batroun',
        lat: 34.2556,
        lng: 35.6583,
        distanceKm: 52,
        surchargeAmount: 150
      }
    }
  }
];

export default function AdRequestsPage() {
  const [opportunities, setOpportunities] = useState<OpportunityItem[]>(INITIAL_OPPORTUNITIES);
  const [stateFilter, setStateFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [sortBy, setSortBy] = useState<'priority' | 'budget' | 'date'>('priority');
  const [selectedOpp, setSelectedOpp] = useState<OpportunityItem | null>(null);
  const [creatingChannelId, setCreatingChannelId] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'summary' | 'intake' | 'catalog'>('summary');

  useEffect(() => {
    async function fetchLeadsAndCampaigns() {
      try {
        const res = await fetch('/api/v1/admin/leads-and-campaigns');
        if (res.ok) {
          const data = await res.json();
          if (Array.isArray(data.opportunities) && data.opportunities.length > 0) {
            setOpportunities(data.opportunities);
          }
        }
      } catch (err) {
        console.warn('Backend admin leads API offline, using dashboard store.');
      }
    }
    fetchLeadsAndCampaigns();
  }, []);

  const getCompanySlug = (opp: OpportunityItem) => {
    if (opp.advertiser?.companySlug && opp.advertiser.companySlug.trim()) {
      return opp.advertiser.companySlug;
    }
    const base = opp.advertiser?.brandName || opp.advertiser?.companyName || opp.name;
    return base.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '') || 'company';
  };

  // Filter and sort opportunities
  const processedOpportunities = useMemo(() => {
    let list = [...opportunities];

    if (stateFilter !== 'all') {
      if (stateFilter === 'lead_captured') {
        list = list.filter(o => o.status === 'lead_captured' || o.status === 'draft');
      } else {
        list = list.filter(o => o.status === stateFilter);
      }
    }

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      list = list.filter(o =>
        (o.advertiser?.brandName?.toLowerCase().includes(q)) ||
        (o.advertiser?.companyName?.toLowerCase().includes(q)) ||
        (o.contact?.fullName?.toLowerCase().includes(q)) ||
        (o.contact?.email?.toLowerCase().includes(q)) ||
        (o.name.toLowerCase().includes(q)) ||
        (o.objective.toLowerCase().includes(q))
      );
    }

    list.sort((a, b) => {
      if (sortBy === 'priority') {
        const tierA = a.priorityTier || (a.totalAmount >= 15000 ? 5 : a.totalAmount >= 7500 ? 4 : a.totalAmount >= 3000 ? 3 : a.totalAmount >= 1000 ? 2 : 1);
        const tierB = b.priorityTier || (b.totalAmount >= 15000 ? 5 : b.totalAmount >= 7500 ? 4 : b.totalAmount >= 3000 ? 3 : b.totalAmount >= 1000 ? 2 : 1);
        if (tierB !== tierA) return tierB - tierA;
        return b.totalAmount - a.totalAmount;
      }
      if (sortBy === 'budget') {
        return b.totalAmount - a.totalAmount;
      }
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    });

    return list;
  }, [opportunities, stateFilter, searchQuery, sortBy]);

  // Handle Slack channel creation trigger
  const handleCreateSlackChannel = async (opp: OpportunityItem) => {
    setCreatingChannelId(opp.id);
    const companySlug = getCompanySlug(opp);
    const channelName = `#ads-${companySlug.substring(0, 50)}`;

    try {
      const res = await fetch(`/api/v1/admin/campaigns/${opp.id}/slack-channel`, {
        method: 'POST'
      });

      if (res.ok) {
        const data = await res.json();
        const createdChannel = data.slackChannel || channelName;
        setOpportunities(prev => prev.map(o => o.id === opp.id ? { ...o, slackChannel: createdChannel } : o));
        if (selectedOpp && selectedOpp.id === opp.id) {
          setSelectedOpp(prev => prev ? { ...prev, slackChannel: createdChannel } : null);
        }
      } else {
        setOpportunities(prev => prev.map(o => o.id === opp.id ? { ...o, slackChannel: channelName } : o));
        if (selectedOpp && selectedOpp.id === opp.id) {
          setSelectedOpp(prev => prev ? { ...prev, slackChannel: channelName } : null);
        }
      }
    } catch (err) {
      setOpportunities(prev => prev.map(o => o.id === opp.id ? { ...o, slackChannel: channelName } : o));
      if (selectedOpp && selectedOpp.id === opp.id) {
        setSelectedOpp(prev => prev ? { ...prev, slackChannel: channelName } : null);
      }
    } finally {
      setCreatingChannelId(null);
    }
  };

  const handleUpdateStatus = (oppId: string, newStatus: OpportunityItem['status']) => {
    setOpportunities(prev => prev.map(o => o.id === oppId ? { ...o, status: newStatus } : o));
    if (selectedOpp && selectedOpp.id === oppId) {
      setSelectedOpp(prev => prev ? { ...prev, status: newStatus } : null);
    }
  };

  // Helper functions for updating campaign order items and specifications for selected opportunity
  const updateSelectedOppOrder = (newItems: CampaignOrderItem[], newSpecs?: CampaignIntakeSpecs) => {
    if (!selectedOpp) return;

    // Recalculate total deal amount
    const itemsTotal = newItems.reduce((acc, curr) => acc + curr.totalPrice, 0);
    const hasEvent = newItems.some(i => i.type === 'product' && i.productId === 'prod_event_package');
    const specsToUse = newSpecs || selectedOpp.intakeSpecs || {};
    const distanceKm = specsToUse.venueLocation?.distanceKm || 0;
    const distanceSurcharge = hasEvent ? calculateDistanceSurcharge(distanceKm) : 0;
    const updatedTotal = itemsTotal + distanceSurcharge;

    const updatedOpp: OpportunityItem = {
      ...selectedOpp,
      items: newItems,
      intakeSpecs: specsToUse,
      totalAmount: updatedTotal
    };

    setSelectedOpp(updatedOpp);
    setOpportunities(prev => prev.map(o => o.id === selectedOpp.id ? updatedOpp : o));
  };

  const handleAddProduct = (productId: ProductId) => {
    if (!selectedOpp) return;
    const currentItems = selectedOpp.items || [];
    const catalogProd = PRODUCT_CATALOG.find(p => p.id === productId);
    if (!catalogProd) return;

    const existingIdx = currentItems.findIndex(i => i.type === 'product' && i.productId === productId);

    let updatedItems: CampaignOrderItem[];
    if (existingIdx >= 0) {
      if (catalogProd.maxQuantity === 1) return;
      updatedItems = [...currentItems];
      const item = updatedItems[existingIdx];
      const newQty = item.quantity + 1;
      updatedItems[existingIdx] = {
        ...item,
        quantity: newQty,
        totalPrice: newQty * item.unitPrice
      };
    } else {
      const newItem: CampaignOrderItem = {
        id: `item_${Date.now()}_${Math.random().toString(36).substr(2, 4)}`,
        type: 'product',
        productId,
        name: catalogProd.name,
        quantity: 1,
        unitPrice: catalogProd.price,
        totalPrice: catalogProd.price
      };
      updatedItems = [...currentItems, newItem];
    }

    updateSelectedOppOrder(updatedItems);
  };

  const handleAddAddon = (addonId: AddonId) => {
    if (!selectedOpp) return;
    const currentItems = selectedOpp.items || [];
    const catalogAddon = ADDON_CATALOG.find(a => a.id === addonId);
    if (!catalogAddon) return;

    const existingIdx = currentItems.findIndex(i => i.type === 'addon' && i.addonId === addonId);

    let updatedItems: CampaignOrderItem[];
    if (existingIdx >= 0) {
      if (!catalogAddon.allowsMultiQuantity) return;
      updatedItems = [...currentItems];
      const item = updatedItems[existingIdx];
      const newQty = item.quantity + 1;
      updatedItems[existingIdx] = {
        ...item,
        quantity: newQty,
        totalPrice: newQty * item.unitPrice
      };
    } else {
      const newItem: CampaignOrderItem = {
        id: `item_${Date.now()}_${Math.random().toString(36).substr(2, 4)}`,
        type: 'addon',
        addonId,
        parentProductId: catalogAddon.parentProductId,
        name: catalogAddon.name,
        quantity: 1,
        unitPrice: catalogAddon.price,
        totalPrice: catalogAddon.price
      };
      updatedItems = [...currentItems, newItem];
    }

    updateSelectedOppOrder(updatedItems);
  };

  const handleUpdateQuantity = (id: string, newQty: number) => {
    if (!selectedOpp) return;
    const currentItems = selectedOpp.items || [];

    if (newQty <= 0) {
      handleRemoveItem(id);
      return;
    }

    const updatedItems = currentItems.map(item => {
      if (item.id === id) {
        return {
          ...item,
          quantity: newQty,
          totalPrice: newQty * item.unitPrice
        };
      }
      return item;
    });

    updateSelectedOppOrder(updatedItems);
  };

  const handleRemoveItem = (id: string) => {
    if (!selectedOpp) return;
    const currentItems = selectedOpp.items || [];
    const itemToRemove = currentItems.find(i => i.id === id);
    if (!itemToRemove) return;

    let filtered = currentItems.filter(i => i.id !== id);

    // Product Binding: Deselect add-ons bound to parent product when product is removed
    if (itemToRemove.type === 'product' && itemToRemove.productId) {
      filtered = filtered.filter(i => !(i.type === 'addon' && i.parentProductId === itemToRemove.productId));
    }

    updateSelectedOppOrder(filtered);
  };

  const handleUpdateSpecs = (updatedSpecs: CampaignIntakeSpecs) => {
    if (!selectedOpp) return;
    updateSelectedOppOrder(selectedOpp.items || [], updatedSpecs);
  };

  const getPriorityBadge = (tier: number, amount: number) => {
    if (amount >= 15000 || tier === 5) {
      return { label: '$15,000+ (Tier 1 Priority)', bg: 'bg-purple-100 text-purple-900 border-purple-300' };
    }
    if (amount >= 7500 || tier === 4) {
      return { label: '$7,500 - $15,000 (High)', bg: 'bg-blue-100 text-blue-900 border-blue-300' };
    }
    if (amount >= 3000 || tier === 3) {
      return { label: '$3,000 - $7,500 (Medium)', bg: 'bg-emerald-100 text-emerald-900 border-emerald-300' };
    }
    if (amount >= 1000 || tier === 2) {
      return { label: '$1,000 - $3,000 (Standard)', bg: 'bg-amber-100 text-amber-900 border-amber-300' };
    }
    return { label: 'Under $1,000 (Micro)', bg: 'bg-gray-100 text-gray-800 border-gray-300' };
  };

  const getStateBadge = (status: string) => {
    switch (status) {
      case 'active':
        return { label: 'Active / Paid', bg: 'bg-emerald-50 text-emerald-700 border-emerald-200' };
      case 'pending_payment':
        return { label: 'Pending Payment', bg: 'bg-amber-50 text-amber-700 border-amber-200' };
      case 'lead_captured':
      case 'draft':
        return { label: 'Lead / Draft', bg: 'bg-blue-50 text-blue-700 border-blue-200' };
      case 'completed':
        return { label: 'Completed', bg: 'bg-purple-50 text-purple-700 border-purple-200' };
      case 'cancelled':
        return { label: 'Cancelled', bg: 'bg-red-50 text-red-700 border-red-200' };
      default:
        return { label: status, bg: 'bg-gray-100 text-gray-700 border-gray-200' };
    }
  };

  const formatProductName = (productId?: string) => {
    if (!productId) return 'Product Item';
    const map: Record<string, string> = {
      prod_featured_article: 'Featured Article Package',
      prod_in_carousel_ig: 'In-Carousel Instagram Placement',
      prod_event_package: 'Event Coverage Package',
      addon_plus_2_articles: '+2 Article Packages',
      addon_additional_100k_impressions: 'Additional 100k Impressions',
      addon_event_additional_3_stories: 'Additional 3 IG Stories',
      addon_event_recap_reel: 'Recap Reel',
      addon_event_extra_day: 'Additional Event Day Coverage',
      addon_event_highlight_7d: 'Dedicated IG Highlight (7 Days)',
      addon_express_delivery: 'Express 24-Hour Production & Delivery'
    };
    return map[productId] || productId.replace(/^prod_/, '').replace(/^addon_/, '').replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
  };

  // Selected opportunity product IDs
  const selectedProductIds = (selectedOpp?.items || [])
    .filter(i => i.type === 'product' && i.productId)
    .map(i => i.productId as ProductId);

  // Extra day add-on qty
  const extraDayAddon = (selectedOpp?.items || []).find(i => i.addonId === 'addon_event_extra_day');
  const extraDayQty = extraDayAddon ? extraDayAddon.quantity : 0;

  return (
    <div className="space-y-6 font-['Inter'] text-gray-900">
      
      {/* Controls Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 bg-white p-4 rounded-2xl border border-gray-200 shadow-xs">
        
        {/* State Filter Tabs */}
        <div className="flex items-center gap-1.5 overflow-x-auto text-xs">
          {[
            { id: 'all', label: 'All Opportunities' },
            { id: 'lead_captured', label: 'Leads & Drafts' },
            { id: 'pending_payment', label: 'Pending Payment' },
            { id: 'active', label: 'Active / Paid' },
            { id: 'completed', label: 'Completed' }
          ].map(tab => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setStateFilter(tab.id)}
              className={`px-3 py-1.5 rounded-lg font-semibold transition-colors cursor-pointer whitespace-nowrap ${
                stateFilter === tab.id
                  ? 'bg-gray-900 text-white'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Search, Sort Dropdown & AI Settings */}
        <div className="flex flex-wrap items-center gap-3 shrink-0">
          <div className="relative">
            <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search leads..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="pl-8 pr-3 py-1.5 bg-gray-50 border border-gray-200 rounded-lg text-xs font-medium text-gray-900 placeholder-gray-400 focus:outline-none focus:border-gray-400 w-44"
            />
          </div>

          <Link
            to="/dashboard/ai?type=sponsored_article"
            className="px-3 py-1.5 bg-gray-100 hover:bg-gray-200 text-gray-800 text-xs font-semibold rounded-lg transition-colors flex items-center gap-1.5 shrink-0"
            title="Configure AI Prompts for Sponsored Article Writer"
          >
            <Bot className="w-3.5 h-3.5 text-[#FF0000]" />
            <span>AI Article Settings</span>
          </Link>

          <div className="flex items-center gap-1.5">
            <ArrowUpDown className="w-4 h-4 text-gray-400" />
            <span className="text-xs text-gray-500 font-semibold">Sort:</span>
            <select
              value={sortBy}
              onChange={e => setSortBy(e.target.value as any)}
              className="px-3 py-1.5 bg-gray-50 border border-gray-300 rounded-lg text-xs font-semibold focus:outline-none"
            >
              <option value="priority">Budget Priority (Highest First)</option>
              <option value="budget">Investment Amount</option>
              <option value="date">Date Created</option>
            </select>
          </div>
        </div>
      </div>

      {/* Opportunities Table */}
      <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-left">
            <thead>
              <tr className="bg-gray-50/70 text-[10px] font-bold text-gray-400 uppercase tracking-wider border-b border-gray-100">
                <th className="pl-6 pr-4 py-3.5">Brand / Company</th>
                <th className="px-4 py-3.5">Budget Priority Tier</th>
                <th className="px-4 py-3.5">Total Deal Value</th>
                <th className="px-4 py-3.5">Campaign State</th>
                <th className="px-4 py-3.5">Internal Slack Channel</th>
                <th className="pr-6 pl-4 py-3.5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 text-xs">
              {processedOpportunities.length === 0 ? (
                <tr>
                  <td colSpan={6} className="p-8 text-center text-gray-400">
                    No leads or campaigns found matching selected filters.
                  </td>
                </tr>
              ) : (
                processedOpportunities.map(opp => {
                  const pBadge = getPriorityBadge(opp.priorityTier, opp.totalAmount);
                  const sBadge = getStateBadge(opp.status);
                  const companySlug = getCompanySlug(opp);

                  return (
                    <tr key={opp.id} className="hover:bg-gray-50/60 transition-colors">
                      <td className="pl-6 pr-4 py-4">
                        <span className="font-bold text-gray-900 block">{opp.advertiser?.brandName || opp.name}</span>
                        <span className="text-[11px] text-gray-500">{opp.advertiser?.companyName}</span>
                      </td>

                      <td className="px-4 py-4">
                        <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-[10px] font-bold border ${pBadge.bg}`}>
                          {pBadge.label}
                        </span>
                      </td>

                      <td className="px-4 py-4 font-bold text-gray-900">
                        ${opp.totalAmount} {opp.currency}
                      </td>

                      <td className="px-4 py-4">
                        <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-[10px] font-bold border capitalize ${sBadge.bg}`}>
                          {sBadge.label}
                        </span>
                      </td>

                      <td className="px-4 py-4">
                        {opp.slackChannel ? (
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-slate-100 text-slate-800 rounded-lg text-[11px] font-mono font-semibold">
                            <Hash className="w-3 h-3 text-slate-500" />
                            <span>{opp.slackChannel}</span>
                          </span>
                        ) : (
                          <button
                            type="button"
                            disabled={creatingChannelId === opp.id}
                            onClick={() => handleCreateSlackChannel(opp)}
                            className="px-2.5 py-1 bg-[#4A154B] hover:bg-[#3F0E40] text-white rounded-lg text-[11px] font-semibold transition-colors flex items-center gap-1 cursor-pointer"
                          >
                            <Hash className="w-3 h-3" />
                            <span>{creatingChannelId === opp.id ? 'Creating...' : `Create #ads-${companySlug}`}</span>
                          </button>
                        )}
                      </td>

                      <td className="pr-6 pl-4 py-4 text-right">
                        <button
                          type="button"
                          onClick={() => {
                            setSelectedOpp(opp);
                            setActiveTab('summary');
                          }}
                          className="px-3 py-1.5 bg-gray-100 hover:bg-gray-200 text-gray-800 rounded-lg text-xs font-semibold transition-colors cursor-pointer flex items-center gap-1 ml-auto"
                        >
                          <Eye className="w-3.5 h-3.5" />
                          <span>Details</span>
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Opportunity Details & Workspace Modal */}
      {selectedOpp && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
          <div className="bg-white rounded-2xl border border-gray-200 max-w-4xl w-full p-6 space-y-5 max-h-[92vh] overflow-y-auto">
            
            {/* Modal Header */}
            <div className="flex items-center justify-between pb-4 border-b border-gray-100">
              <div>
                <h3 className="text-base font-bold text-gray-900">{selectedOpp.advertiser?.brandName || selectedOpp.name}</h3>
                <p className="text-xs text-gray-400">Opportunity Ref #{selectedOpp.id}</p>
              </div>
              <button
                type="button"
                onClick={() => setSelectedOpp(null)}
                className="p-2 text-gray-400 hover:text-gray-600 rounded-lg cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Opportunity Details Summary */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 bg-gray-50 p-4 rounded-xl border border-gray-100 text-xs">
              <div>
                <span className="text-gray-400 block text-[10px] uppercase font-bold">Brand / Company</span>
                <span className="font-bold text-gray-900">{selectedOpp.advertiser?.brandName || selectedOpp.name}</span>
                {selectedOpp.advertiser?.companyName && (
                  <span className="text-gray-500 block text-[11px]">{selectedOpp.advertiser.companyName}</span>
                )}
              </div>

              <div>
                <span className="text-gray-400 block text-[10px] uppercase font-bold">Contact Person</span>
                <span className="font-semibold text-gray-900">{selectedOpp.contact?.fullName || 'N/A'}</span>
                {selectedOpp.contact?.email && (
                  <span className="text-gray-500 block text-[11px]">{selectedOpp.contact.email}</span>
                )}
                {selectedOpp.contact?.phoneNumber && (
                  <span className="text-gray-500 flex items-center gap-1 text-[11px] mt-0.5">
                    <Phone className="w-3 h-3 text-gray-400" />
                    <span>{selectedOpp.contact.phoneNumber}</span>
                  </span>
                )}
              </div>

              <div>
                <span className="text-gray-400 block text-[10px] uppercase font-bold">Campaign Objective</span>
                <span className="font-semibold text-gray-900">{selectedOpp.objective}</span>
              </div>

              <div>
                <span className="text-gray-400 block text-[10px] uppercase font-bold">Total Deal Amount</span>
                <span className="font-bold text-gray-900 text-sm">${selectedOpp.totalAmount.toLocaleString()} {selectedOpp.currency}</span>
              </div>
            </div>

            {/* Campaign State Control */}
            <div className="p-3.5 bg-gray-50 border border-gray-200 rounded-xl flex items-center justify-between gap-3 text-xs">
              <div>
                <span className="text-[10px] text-gray-400 uppercase font-bold block">Update Campaign State</span>
                <span className="text-xs font-semibold text-gray-700">Current: {getStateBadge(selectedOpp.status).label}</span>
              </div>
              <select
                value={selectedOpp.status}
                onChange={(e) => handleUpdateStatus(selectedOpp.id, e.target.value as OpportunityItem['status'])}
                className="px-3 py-1.5 bg-white border border-gray-300 rounded-lg text-xs font-semibold text-gray-900 focus:outline-none focus:border-gray-900 cursor-pointer"
              >
                <option value="lead_captured">Lead / Draft</option>
                <option value="pending_payment">Pending Payment</option>
                <option value="active">Active / Paid</option>
                <option value="completed">Completed</option>
                <option value="cancelled">Cancelled</option>
              </select>
            </div>

            {/* Workspace View Navigation Tabs */}
            <div className="flex items-center gap-2 border-b border-gray-200 pb-2">
              <button
                type="button"
                onClick={() => setActiveTab('summary')}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-colors cursor-pointer flex items-center gap-1.5 ${
                  activeTab === 'summary'
                    ? 'bg-gray-900 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                <FileText className="w-3.5 h-3.5" />
                <span>Order Summary & Items</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveTab('intake')}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-colors cursor-pointer flex items-center gap-1.5 ${
                  activeTab === 'intake'
                    ? 'bg-gray-900 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                <Edit3 className="w-3.5 h-3.5" />
                <span>Campaign Details & Specifications Intake</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveTab('catalog')}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-colors cursor-pointer flex items-center gap-1.5 ${
                  activeTab === 'catalog'
                    ? 'bg-gray-900 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                <Layers className="w-3.5 h-3.5" />
                <span>Product Offerings Catalog</span>
              </button>
            </div>

            {/* Tab 1: Campaign Order Summary */}
            {activeTab === 'summary' && (
              <div className="space-y-4">
                <span className="text-xs font-bold text-gray-700 uppercase tracking-wider block">
                  Itemized Campaign Package Breakdown
                </span>

                <CampaignOrderSummary
                  items={selectedOpp.items || []}
                  venueLocation={selectedOpp.intakeSpecs?.venueLocation}
                  onUpdateQuantity={handleUpdateQuantity}
                  onRemoveItem={handleRemoveItem}
                  onAddProduct={handleAddProduct}
                  onAddAddon={handleAddAddon}
                />
              </div>
            )}

            {/* Tab 2: Specifications Intake Form */}
            {activeTab === 'intake' && (
              <CampaignIntakeForm
                selectedProducts={selectedProductIds}
                extraDayQty={extraDayQty}
                specs={selectedOpp.intakeSpecs || {}}
                onChangeSpecs={handleUpdateSpecs}
              />
            )}

            {/* Tab 3: Catalog Selector */}
            {activeTab === 'catalog' && (
              <CatalogSelector
                items={selectedOpp.items || []}
                onAddProduct={handleAddProduct}
                onAddAddon={handleAddAddon}
              />
            )}

            {/* Slack Channel Status & Action */}
            <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl flex items-center justify-between gap-3 text-xs">
              <span className="font-semibold text-slate-800 flex items-center gap-1.5">
                <Hash className="w-4 h-4 text-[#4A154B]" />
                <span>Slack Channel: {selectedOpp.slackChannel ? <strong>{selectedOpp.slackChannel}</strong> : <em className="text-gray-400">Not provisioned</em>}</span>
              </span>
              {selectedOpp.slackChannel ? (
                <span className="text-[10px] text-emerald-600 font-bold bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200 shrink-0">
                  Channel Created
                </span>
              ) : (
                <button
                  type="button"
                  disabled={creatingChannelId === selectedOpp.id}
                  onClick={() => handleCreateSlackChannel(selectedOpp)}
                  className="px-3 py-1 bg-[#4A154B] hover:bg-[#3F0E40] text-white rounded-lg text-xs font-semibold transition-colors flex items-center gap-1 cursor-pointer shrink-0"
                >
                  <Hash className="w-3.5 h-3.5" />
                  <span>{creatingChannelId === selectedOpp.id ? 'Creating...' : `Create #ads-${getCompanySlug(selectedOpp)}`}</span>
                </button>
              )}
            </div>

            {selectedOpp.accessToken && (
              <div className="p-3 bg-gray-50 border border-gray-200 rounded-xl flex items-center justify-between text-xs">
                <div>
                  <span className="text-[10px] text-gray-400 uppercase font-bold block">Client Workspace Token URL</span>
                  <code className="text-xs font-mono font-bold text-gray-800">/campaign/{selectedOpp.accessToken}</code>
                </div>
                <a
                  href={`/campaign/${selectedOpp.accessToken}`}
                  target="_blank"
                  rel="noreferrer"
                  className="text-[#FF0000] hover:underline text-xs font-bold flex items-center gap-1"
                >
                  <span>Open Workspace</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>
            )}

            <div className="pt-4 flex items-center justify-end border-t border-gray-100">
              <button
                type="button"
                onClick={() => setSelectedOpp(null)}
                className="px-5 py-2 text-xs font-semibold bg-gray-900 hover:bg-black text-white rounded-xl transition-colors cursor-pointer"
              >
                Close
              </button>
            </div>

          </div>
        </div>
      )}
    </div>
  );
}

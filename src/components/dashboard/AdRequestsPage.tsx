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
  Tag
} from 'lucide-react';

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
  items?: Array<{
    id: string;
    productId: string;
    quantity: number;
    unitPrice: number;
    totalPrice: number;
  }>;
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
    objective: 'Brand Awareness & Event RSVPs',
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
      { id: 'i1', productId: 'prod_featured_article', quantity: 2, unitPrice: 1200, totalPrice: 2400 },
      { id: 'i2', productId: 'prod_social_video', quantity: 5, unitPrice: 1500, totalPrice: 7500 },
      { id: 'i3', productId: 'prod_display_banner', quantity: 10, unitPrice: 500, totalPrice: 5000 },
      { id: 'i4', productId: 'prod_newsletter_feature', quantity: 4, unitPrice: 750, totalPrice: 3600 }
    ]
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
      { id: 'i5', productId: 'prod_featured_article', quantity: 2, unitPrice: 750, totalPrice: 1500 },
      { id: 'i6', productId: 'prod_social_video', quantity: 3, unitPrice: 950, totalPrice: 2850 },
      { id: 'i7', productId: 'prod_display_banner', quantity: 10, unitPrice: 300, totalPrice: 3000 },
      { id: 'i8', productId: 'prod_newsletter_feature', quantity: 4, unitPrice: 450, totalPrice: 1800 }
    ]
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
      companyName: 'Dubai Fintech Week Events Ltd',
      companySlug: 'dubai-fintech-week-events-ltd',
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
      { id: 'i9', productId: 'prod_featured_article', quantity: 1, unitPrice: 1200, totalPrice: 1200 },
      { id: 'i10', productId: 'prod_newsletter_feature', quantity: 3, unitPrice: 750, totalPrice: 2250 },
      { id: 'i11', productId: 'prod_dedicated_social_post', quantity: 1, unitPrice: 800, totalPrice: 800 }
    ]
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
      { id: 'i12', productId: 'prod_featured_article', quantity: 1, unitPrice: 750, totalPrice: 750 },
      { id: 'i13', productId: 'prod_social_video', quantity: 1, unitPrice: 950, totalPrice: 950 }
    ]
  }
];

export default function AdRequestsPage() {
  const [opportunities, setOpportunities] = useState<OpportunityItem[]>(INITIAL_OPPORTUNITIES);
  const [stateFilter, setStateFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [sortBy, setSortBy] = useState<'priority' | 'budget' | 'date'>('priority');
  const [selectedOpp, setSelectedOpp] = useState<OpportunityItem | null>(null);
  const [creatingChannelId, setCreatingChannelId] = useState<string | null>(null);

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

  // Filter and sort opportunities by budget priority, state, and search query
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

  const formatProductName = (productId: string) => {
    const map: Record<string, string> = {
      prod_featured_article: 'Featured Sponsored Article',
      prod_social_video: 'Social Video Feature',
      prod_display_banner: 'Display Banner Placement',
      prod_newsletter_feature: 'Newsletter Sponsorship Feature',
      prod_dedicated_social_post: 'Dedicated Social Media Post',
    };
    return map[productId] || productId.replace(/^prod_/, '').replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
  };

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
                          onClick={() => setSelectedOpp(opp)}
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

      {/* Opportunity Details Modal */}
      {selectedOpp && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
          <div className="bg-white rounded-2xl border border-gray-200 max-w-2xl w-full p-6 space-y-5 max-h-[90vh] overflow-y-auto">
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

            <div className="space-y-4 text-xs">
              {/* Advertiser & Contact Information */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 bg-gray-50 p-4 rounded-xl border border-gray-100">
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
                  <span className="font-bold text-gray-900 text-sm">${selectedOpp.totalAmount} {selectedOpp.currency}</span>
                </div>

                {selectedOpp.advertiser?.website && (
                  <div>
                    <span className="text-gray-400 block text-[10px] uppercase font-bold">Website</span>
                    <a
                      href={selectedOpp.advertiser.website}
                      target="_blank"
                      rel="noreferrer"
                      className="text-primary hover:underline font-semibold flex items-center gap-1"
                    >
                      <Globe className="w-3 h-3" />
                      <span>{selectedOpp.advertiser.website}</span>
                    </a>
                  </div>
                )}

                {selectedOpp.advertiser?.industry && (
                  <div>
                    <span className="text-gray-400 block text-[10px] uppercase font-bold">Industry</span>
                    <span className="font-semibold text-gray-900">{selectedOpp.advertiser.industry}</span>
                  </div>
                )}
              </div>

              {/* Status Update Control */}
              <div className="p-3.5 bg-gray-50 border border-gray-200 rounded-xl flex items-center justify-between gap-3">
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

              {/* Itemized Deals Table */}
              {selectedOpp.items && selectedOpp.items.length > 0 && (
                <div className="space-y-2">
                  <span className="text-[11px] font-bold text-gray-700 uppercase tracking-wider block">
                    Itemized Campaign Package Breakdown
                  </span>
                  <div className="border border-gray-200 rounded-xl overflow-hidden">
                    <table className="w-full text-left border-collapse">
                      <thead>
                        <tr className="bg-gray-50 border-b border-gray-200 text-[10px] font-bold text-gray-400 uppercase">
                          <th className="p-2.5">Product Item</th>
                          <th className="p-2.5 text-center">Qty</th>
                          <th className="p-2.5 text-right">Unit Price</th>
                          <th className="p-2.5 text-right">Total Price</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-100 text-xs font-medium">
                        {selectedOpp.items.map(item => (
                          <tr key={item.id} className="hover:bg-gray-50/50">
                            <td className="p-2.5 font-semibold text-gray-900">
                              {formatProductName(item.productId)}
                            </td>
                            <td className="p-2.5 text-center text-gray-600">{item.quantity}</td>
                            <td className="p-2.5 text-right text-gray-600">${item.unitPrice}</td>
                            <td className="p-2.5 text-right font-bold text-gray-900">${item.totalPrice}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* Slack Channel Status & Action */}
              <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl flex items-center justify-between gap-3">
                <span className="text-xs font-semibold text-slate-800 flex items-center gap-1.5">
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
                <div className="p-3 bg-gray-50 border border-gray-200 rounded-xl flex items-center justify-between">
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

              <div className="p-3 bg-red-50/50 border border-red-100 rounded-xl flex items-center justify-between">
                <div>
                  <span className="text-[10px] text-gray-500 uppercase font-bold block">AI Content Settings</span>
                  <span className="text-xs font-medium text-gray-700">Sponsored article prompt templates</span>
                </div>
                <Link
                  to="/dashboard/ai?type=sponsored_article"
                  className="px-3 py-1 bg-[#FF0000] hover:bg-red-700 text-white rounded-lg text-xs font-semibold transition-colors flex items-center gap-1 shrink-0"
                >
                  <Bot className="w-3.5 h-3.5" />
                  <span>Configure Prompts</span>
                </Link>
              </div>
            </div>

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

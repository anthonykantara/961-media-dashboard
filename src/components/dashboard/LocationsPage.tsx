import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { useLocationContext } from '../../context/LocationContext';
import { LocationTerritory, LocationLevel, SUPPORTED_LANGUAGES } from '../../types/location';
import { 
  Plus, 
  Search, 
  Trash2, 
  Edit3, 
  Check, 
  X,
  Building2,
  MapPin
} from 'lucide-react';
import { FlagIcon } from '../common/FlagIcon';

export default function LocationsPage() {
  const { locations, addLocation, updateLocation, deleteLocation } = useLocationContext();

  const [headerSlot, setHeaderSlot] = useState<HTMLElement | null>(null);

  useEffect(() => {
    setHeaderSlot(document.getElementById('dashboard-header-actions'));
  }, []);

  const [searchQuery, setSearchQuery] = useState('');
  const [filterLevel, setFilterLevel] = useState<'all' | 'country' | 'city'>('all');
  const [filterStatus, setFilterStatus] = useState<'all' | 'active' | 'beta' | 'soon' | 'new' | 'draft'>('all');

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingLoc, setEditingLoc] = useState<LocationTerritory | null>(null);

  // Form states for Add / Edit
  const [formData, setFormData] = useState<{
    name: string;
    slug: string;
    level: LocationLevel;
    parentId: string;
    countryCode: string;
    flagEmoji: string;
    isHub: boolean;
    status: 'active' | 'beta' | 'soon' | 'new' | 'draft';
    supportedLanguages: string[];
    defaultLanguage: string;
  }>({
    name: '',
    slug: '',
    level: 'country',
    parentId: '',
    countryCode: '',
    flagEmoji: '🇱🇧',
    isHub: false,
    status: 'active',
    supportedLanguages: ['en', 'ar'],
    defaultLanguage: 'en',
  });

  // Filter out topics entirely since topics are external redirects
  const geographicLocations = locations.filter(l => l.level === 'country' || l.level === 'city');
  const parentCountries = geographicLocations.filter(l => l.level === 'country');

  const handleOpenAdd = () => {
    setEditingLoc(null);
    setFormData({
      name: '',
      slug: '',
      level: 'country',
      parentId: '',
      countryCode: '',
      flagEmoji: '🇱🇧',
      isHub: false,
      status: 'active',
      supportedLanguages: ['en', 'ar'],
      defaultLanguage: 'en',
    });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (loc: LocationTerritory) => {
    setEditingLoc(loc);
    const langs = loc.supportedLanguages && loc.supportedLanguages.length > 0 ? loc.supportedLanguages : ['en'];
    setFormData({
      name: loc.name,
      slug: loc.slug,
      level: loc.level,
      parentId: loc.parentId || '',
      countryCode: loc.countryCode,
      flagEmoji: loc.flagEmoji,
      isHub: loc.isHub,
      status: loc.status,
      supportedLanguages: langs,
      defaultLanguage: loc.defaultLanguage || langs[0] || 'en',
    });
    setIsModalOpen(true);
  };

  const toggleLanguage = (code: string) => {
    setFormData(prev => {
      const exists = prev.supportedLanguages.includes(code);
      let updated: string[];
      if (exists) {
        if (prev.supportedLanguages.length === 1) return prev;
        updated = prev.supportedLanguages.filter(c => c !== code);
      } else {
        updated = [...prev.supportedLanguages, code];
      }
      
      const newDefault = updated.includes(prev.defaultLanguage) ? prev.defaultLanguage : updated[0];
      return {
        ...prev,
        supportedLanguages: updated,
        defaultLanguage: newDefault,
      };
    });
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name) return;

    const generatedSlug = formData.slug || formData.name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
    const id = editingLoc ? editingLoc.id : `${formData.countryCode.toLowerCase()}-${generatedSlug}`;

    const territory: LocationTerritory = {
      id,
      name: formData.name,
      slug: generatedSlug,
      level: formData.level,
      parentId: formData.level === 'city' ? formData.parentId : undefined,
      countryCode: formData.countryCode.toUpperCase() || 'LB',
      flagEmoji: formData.flagEmoji || '🇱🇧',
      isHub: formData.level === 'country' ? formData.isHub : false,
      status: formData.status,
      supportedLanguages: formData.supportedLanguages,
      defaultLanguage: formData.defaultLanguage,
    };

    if (editingLoc) {
      updateLocation(territory);
    } else {
      addLocation(territory);
    }

    setIsModalOpen(false);
  };

  const filteredLocations = geographicLocations.filter(loc => {
    const matchesSearch = loc.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          loc.countryCode.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesLevel = filterLevel === 'all' || loc.level === filterLevel;
    const matchesStatus = filterStatus === 'all' || loc.status === filterStatus;
    return matchesSearch && matchesLevel && matchesStatus;
  });

  const renderStatusBadge = (status?: string) => {
    switch (status) {
      case 'new':
        return (
          <span className="inline-flex items-center text-[9px] font-semibold px-2 py-0.5 rounded-full bg-[#FF0000] text-white lowercase">
            new
          </span>
        );
      case 'beta':
        return (
          <span className="inline-flex items-center text-[9px] font-semibold px-2 py-0.5 rounded-full bg-blue-600 text-white lowercase">
            beta
          </span>
        );
      case 'soon':
        return (
          <span className="inline-flex items-center text-[9px] font-semibold px-2 py-0.5 rounded-full bg-emerald-600 text-white lowercase">
            soon
          </span>
        );
      case 'draft':
        return (
          <span className="inline-flex items-center text-[9px] font-semibold px-2 py-0.5 rounded-full bg-gray-200 text-gray-700 dark:bg-gray-800 dark:text-gray-300 capitalize">
            draft
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center text-[9px] font-semibold px-2 py-0.5 rounded-full bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300 capitalize">
            active
          </span>
        );
    }
  };

  return (
    <div className="space-y-6">
      {/* Portal Add Location Button to Dashboard Header */}
      {headerSlot && createPortal(
        <button
          type="button"
          onClick={handleOpenAdd}
          className="flex items-center gap-2 px-4 py-2 bg-[#FF0000] hover:bg-red-700 text-white rounded-xl text-xs font-semibold transition-colors cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Add Location</span>
        </button>,
        headerSlot
      )}

      {/* Summary Metrics */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5">
        <div className="bg-white dark:bg-[#121418] p-4 rounded-xl border border-gray-200 dark:border-gray-800">
          <p className="text-xs text-gray-400 font-medium">Total Locations</p>
          <p className="text-xl font-bold text-gray-900 dark:text-white mt-1">{geographicLocations.length}</p>
        </div>
        <div className="bg-white dark:bg-[#121418] p-4 rounded-xl border border-gray-200 dark:border-gray-800">
          <p className="text-xs text-gray-400 font-medium">Countries</p>
          <p className="text-xl font-bold text-gray-900 dark:text-white mt-1">
            {geographicLocations.filter(l => l.level === 'country').length}
          </p>
        </div>
        <div className="bg-white dark:bg-[#121418] p-4 rounded-xl border border-gray-200 dark:border-gray-800">
          <p className="text-xs text-gray-400 font-medium">Cities</p>
          <p className="text-xl font-bold text-gray-900 dark:text-white mt-1">
            {geographicLocations.filter(l => l.level === 'city').length}
          </p>
        </div>
        <div className="bg-white dark:bg-[#121418] p-4 rounded-xl border border-gray-200 dark:border-gray-800">
          <p className="text-xs text-gray-400 font-medium">Languages</p>
          <p className="text-xl font-bold text-gray-900 dark:text-white mt-1">
            {Object.keys(SUPPORTED_LANGUAGES).length}
          </p>
        </div>
      </div>

      {/* Search & Filter Bar */}
      <div className="bg-white dark:bg-[#121418] p-3.5 rounded-xl border border-gray-200 dark:border-gray-800 flex flex-col sm:flex-row items-center gap-3">
        <div className="relative flex-1 w-full">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search locations..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-gray-50 dark:bg-gray-800/80 border border-gray-200 dark:border-gray-700/60 rounded-xl text-xs text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:border-[#FF0000]"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto flex-wrap">
          {/* Level Filter */}
          <div className="flex items-center bg-gray-100 dark:bg-gray-800 p-1 rounded-xl text-xs">
            <button
              type="button"
              onClick={() => setFilterLevel('all')}
              className={`px-3 py-1 rounded-lg font-medium transition-colors cursor-pointer ${
                filterLevel === 'all' ? 'bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-2xs' : 'text-gray-500'
              }`}
            >
              All
            </button>
            <button
              type="button"
              onClick={() => setFilterLevel('country')}
              className={`px-3 py-1 rounded-lg font-medium transition-colors cursor-pointer ${
                filterLevel === 'country' ? 'bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-2xs' : 'text-gray-500'
              }`}
            >
              Countries
            </button>
            <button
              type="button"
              onClick={() => setFilterLevel('city')}
              className={`px-3 py-1 rounded-lg font-medium transition-colors cursor-pointer ${
                filterLevel === 'city' ? 'bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-2xs' : 'text-gray-500'
              }`}
            >
              Cities
            </button>
          </div>

          {/* Status Filter */}
          <div className="flex items-center bg-gray-100 dark:bg-gray-800 p-1 rounded-xl text-xs">
            {(['all', 'active', 'beta', 'soon', 'draft'] as const).map(st => (
              <button
                key={st}
                type="button"
                onClick={() => setFilterStatus(st)}
                className={`px-2.5 py-1 rounded-lg font-medium capitalize transition-colors cursor-pointer ${
                  filterStatus === st ? 'bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-2xs' : 'text-gray-500'
                }`}
              >
                {st}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Locations Table */}
      <div className="bg-white dark:bg-[#121418] border border-gray-200 dark:border-gray-800 rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-left">
            <thead>
              <tr className="bg-gray-50/70 dark:bg-gray-800/40 text-[10px] font-semibold text-gray-400 uppercase tracking-wider border-b border-gray-100 dark:border-gray-800">
                <th className="pl-6 pr-4 py-3.5">Location</th>
                <th className="px-4 py-3.5">Type</th>
                <th className="px-4 py-3.5">Parent Country</th>
                <th className="px-4 py-3.5">Languages</th>
                <th className="px-4 py-3.5">Status</th>
                <th className="pr-6 pl-4 py-3.5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-gray-800 text-xs">
              {filteredLocations.length === 0 ? (
                <tr>
                  <td colSpan={6} className="p-8 text-center text-gray-400">
                    No locations found.
                  </td>
                </tr>
              ) : (
                filteredLocations.map((loc) => {
                  const parent = loc.parentId ? locations.find(l => l.id === loc.parentId) : null;
                  const supportedLangs = loc.supportedLanguages && loc.supportedLanguages.length > 0 ? loc.supportedLanguages : ['en'];

                  return (
                    <tr key={loc.id} className="hover:bg-gray-50/60 dark:hover:bg-gray-800/30 transition-colors">
                      <td className="pl-6 pr-4 py-3.5">
                        <div className="flex items-center gap-2.5">
                          <FlagIcon countryCode={loc.countryCode} className="w-4.5 h-3.5 shrink-0" />
                          <span className="font-semibold text-gray-900 dark:text-white">{loc.name}</span>
                        </div>
                      </td>

                      <td className="px-4 py-3.5">
                        <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[11px] font-medium capitalize ${
                          loc.level === 'country' 
                            ? 'bg-blue-50 text-blue-700 dark:bg-blue-950/40 dark:text-blue-300' 
                            : 'bg-purple-50 text-purple-700 dark:bg-purple-950/40 dark:text-purple-300'
                        }`}>
                          {loc.level === 'country' ? <MapPin className="w-3 h-3" /> : <Building2 className="w-3 h-3" />}
                          <span>{loc.level}</span>
                        </span>
                      </td>

                      <td className="px-4 py-3.5 text-gray-600 dark:text-gray-400">
                        {parent ? parent.name : '—'}
                      </td>

                      <td className="px-4 py-3.5">
                        <div className="flex items-center gap-1 flex-wrap">
                          {supportedLangs.map((langCode) => {
                            const isDefault = loc.defaultLanguage === langCode;
                            const langInfo = SUPPORTED_LANGUAGES[langCode];
                            return (
                              <span 
                                key={langCode}
                                className={`px-1.5 py-0.5 rounded text-[10px] font-medium ${
                                  isDefault 
                                    ? 'bg-red-50 text-[#FF0000] border border-red-200' 
                                    : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300'
                                }`}
                                title={langInfo ? `${langInfo.name} ${isDefault ? '(Default)' : ''}` : langCode}
                              >
                                {langInfo?.short || langCode.toUpperCase()}
                              </span>
                            );
                          })}
                        </div>
                      </td>

                      <td className="px-4 py-3.5">
                        {renderStatusBadge(loc.status)}
                      </td>

                      <td className="pr-6 pl-4 py-3.5 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            type="button"
                            onClick={() => handleOpenEdit(loc)}
                            className="p-1.5 text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors cursor-pointer"
                            title="Edit location"
                          >
                            <Edit3 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            type="button"
                            onClick={() => deleteLocation(loc.id)}
                            className="p-1.5 text-gray-400 hover:text-red-600 rounded-lg hover:bg-red-50 dark:hover:bg-red-950/40 transition-colors cursor-pointer"
                            title="Delete location"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add / Edit Location Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
          <div className="bg-white dark:bg-[#121418] rounded-2xl border border-gray-200 dark:border-gray-800 max-w-md w-full p-6 space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-gray-100 dark:border-gray-800">
              <h3 className="text-base font-bold text-gray-900 dark:text-white">
                {editingLoc ? `Edit Location` : 'Add Location'}
              </h3>
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="p-1.5 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 rounded-lg cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSave} className="space-y-4">
              {/* Type selection */}
              <div>
                <label className="text-xs font-semibold text-gray-700 dark:text-gray-300 block mb-1.5">Type</label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setFormData(prev => ({ ...prev, level: 'country' }))}
                    className={`py-2 px-3 rounded-xl border text-xs font-medium flex items-center justify-center gap-2 transition-all cursor-pointer ${
                      formData.level === 'country' ? 'bg-red-50 dark:bg-red-950/30 border-[#FF0000] text-[#FF0000] font-semibold' : 'border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-50'
                    }`}
                  >
                    <MapPin className="w-3.5 h-3.5" />
                    <span>Country</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setFormData(prev => ({ ...prev, level: 'city' }))}
                    className={`py-2 px-3 rounded-xl border text-xs font-medium flex items-center justify-center gap-2 transition-all cursor-pointer ${
                      formData.level === 'city' ? 'bg-red-50 dark:bg-red-950/30 border-[#FF0000] text-[#FF0000] font-semibold' : 'border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-50'
                    }`}
                  >
                    <Building2 className="w-3.5 h-3.5" />
                    <span>City</span>
                  </button>
                </div>
              </div>

              {/* Name */}
              <div>
                <label className="text-xs font-semibold text-gray-700 dark:text-gray-300 block mb-1">Name</label>
                <input
                  type="text"
                  required
                  placeholder={formData.level === 'country' ? 'e.g., Slovakia' : 'e.g., Riyadh'}
                  value={formData.name}
                  onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                  className="w-full p-2.5 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl text-xs text-gray-900 dark:text-white focus:outline-none focus:border-[#FF0000]"
                />
              </div>

              {/* Parent Country dropdown (if city) */}
              {formData.level === 'city' && (
                <div>
                  <label className="text-xs font-semibold text-gray-700 dark:text-gray-300 block mb-1">Parent Country</label>
                  <select
                    value={formData.parentId}
                    onChange={(e) => {
                      const parent = parentCountries.find(p => p.id === e.target.value);
                      setFormData(prev => ({
                        ...prev,
                        parentId: e.target.value,
                        countryCode: parent ? parent.countryCode : prev.countryCode,
                        flagEmoji: parent ? parent.flagEmoji : prev.flagEmoji
                      }));
                    }}
                    className="w-full p-2.5 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl text-xs text-gray-900 dark:text-white focus:outline-none focus:border-[#FF0000] cursor-pointer"
                  >
                    <option value="">Select Parent Country...</option>
                    {parentCountries.map(p => (
                      <option key={p.id} value={p.id}>{p.name} ({p.countryCode})</option>
                    ))}
                  </select>
                </div>
              )}

              {/* Country Code & Status */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-gray-700 dark:text-gray-300 block mb-1">Country Code</label>
                  <input
                    type="text"
                    required
                    maxLength={2}
                    placeholder="SK"
                    value={formData.countryCode}
                    onChange={(e) => setFormData(prev => ({ ...prev, countryCode: e.target.value.toUpperCase() }))}
                    className="w-full p-2.5 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl text-xs font-mono uppercase text-gray-900 dark:text-white focus:outline-none focus:border-[#FF0000]"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-gray-700 dark:text-gray-300 block mb-1">Status</label>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData(prev => ({ ...prev, status: e.target.value as any }))}
                    className="w-full p-2.5 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl text-xs text-gray-900 dark:text-white focus:outline-none focus:border-[#FF0000] cursor-pointer"
                  >
                    <option value="active">Active</option>
                    <option value="new">New</option>
                    <option value="beta">Beta</option>
                    <option value="soon">Soon</option>
                    <option value="draft">Draft</option>
                  </select>
                </div>
              </div>

              {/* Languages Selection */}
              <div>
                <label className="text-xs font-semibold text-gray-700 dark:text-gray-300 block mb-1.5">
                  Languages
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {Object.values(SUPPORTED_LANGUAGES).map((lang) => {
                    const isSelected = formData.supportedLanguages.includes(lang.code);
                    return (
                      <button
                        key={lang.code}
                        type="button"
                        onClick={() => toggleLanguage(lang.code)}
                        className={`p-2 rounded-xl border text-xs font-medium flex items-center justify-between transition-colors cursor-pointer ${
                          isSelected
                            ? 'bg-red-50/70 dark:bg-red-950/30 border-[#FF0000] text-[#FF0000]'
                            : 'border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400 hover:bg-gray-50'
                        }`}
                      >
                        <span>{lang.name} ({lang.short})</span>
                        {isSelected && <Check className="w-3.5 h-3.5 text-[#FF0000]" />}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Default Language */}
              <div>
                <label className="text-xs font-semibold text-gray-700 dark:text-gray-300 block mb-1">
                  Default Language
                </label>
                <select
                  value={formData.defaultLanguage}
                  onChange={(e) => setFormData(prev => ({ ...prev, defaultLanguage: e.target.value }))}
                  className="w-full p-2.5 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl text-xs text-gray-900 dark:text-white focus:outline-none focus:border-[#FF0000] cursor-pointer"
                >
                  {formData.supportedLanguages.map(code => (
                    <option key={code} value={code}>
                      {SUPPORTED_LANGUAGES[code]?.name} ({SUPPORTED_LANGUAGES[code]?.short})
                    </option>
                  ))}
                </select>
              </div>

              {/* Form Buttons */}
              <div className="pt-3 flex items-center justify-end gap-2.5 border-t border-gray-100 dark:border-gray-800">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-xl border border-gray-200 dark:border-gray-700 text-xs font-medium text-gray-600 dark:text-gray-300 hover:bg-gray-50 transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-[#FF0000] hover:bg-red-700 text-white rounded-xl text-xs font-semibold transition-colors cursor-pointer"
                >
                  {editingLoc ? 'Save Changes' : 'Create Location'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

import React, { useState, useMemo } from 'react';
import { useLocationContext, GLOBAL_SUPPORTED_LANGUAGES } from '../../context/LocationContext';
import { Check, Search, X } from 'lucide-react';
import { LocationTerritory, SUPPORTED_LANGUAGES } from '../../types/location';

interface LocationSwitcherModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface CountryGroup {
  country: LocationTerritory | { id: string; name: string; flagEmoji: string; level: 'country'; status: string; isHub: boolean; supportedLanguages: string[]; defaultLanguage: string };
  cities: LocationTerritory[];
}

export default function LocationSwitcherModal({ isOpen, onClose }: LocationSwitcherModalProps) {
  const { 
    locations, 
    activeLocationId, 
    activeLanguage,
    setActiveLocationAndLanguage, 
  } = useLocationContext();

  const [searchQuery, setSearchQuery] = useState('');

  // Active locations only
  const activeLocations = useMemo(() => locations.filter(l => l.status !== 'draft'), [locations]);

  // Group locations by country
  const countryGroups = useMemo(() => {
    const countries = activeLocations.filter(l => l.level === 'country');
    const cities = activeLocations.filter(l => l.level === 'city');

    const groups: CountryGroup[] = [];

    countries.forEach(country => {
      const countryCities = cities.filter(c => c.parentId === country.id || c.countryCode === country.countryCode);
      groups.push({
        country,
        cities: countryCities,
      });
    });

    // Catch any orphan cities
    const groupedCityIds = new Set(groups.flatMap(g => g.cities.map(c => c.id)));
    const orphanCities = cities.filter(c => !groupedCityIds.has(c.id));
    if (orphanCities.length > 0) {
      const orphanMap = new Map<string, LocationTerritory[]>();
      orphanCities.forEach(c => {
        const arr = orphanMap.get(c.countryCode) || [];
        arr.push(c);
        orphanMap.set(c.countryCode, arr);
      });
      orphanMap.forEach((cList, code) => {
        groups.push({
          country: {
            id: `country-${code.toLowerCase()}`,
            name: cList[0]?.name || code,
            flagEmoji: cList[0]?.flagEmoji || '🏳️',
            level: 'country',
            status: 'active',
            isHub: true,
            supportedLanguages: ['en', 'ar'],
            defaultLanguage: 'en',
          },
          cities: cList,
        });
      });
    }

    return groups;
  }, [activeLocations]);

  if (!isOpen) return null;

  const query = searchQuery.trim().toLowerCase();
  const showGlobal = !query || 'global'.includes(query) || 'worldwide'.includes(query) || 'all'.includes(query);

  // Filter country groups based on search (supports searching by country, city, or language name)
  const filteredGroups = countryGroups.map(group => {
    const countryMatch = group.country.name.toLowerCase().includes(query) ||
      (group.country.supportedLanguages || []).some(l => 
        SUPPORTED_LANGUAGES[l]?.name.toLowerCase().includes(query) ||
        SUPPORTED_LANGUAGES[l]?.nativeName.toLowerCase().includes(query) ||
        l.toLowerCase() === query
      );

    const matchingCities = group.cities.filter(city => 
      city.name.toLowerCase().includes(query) || 
      city.countryCode.toLowerCase().includes(query) ||
      (city.supportedLanguages || group.country.supportedLanguages || []).some(l => 
        SUPPORTED_LANGUAGES[l]?.name.toLowerCase().includes(query) ||
        SUPPORTED_LANGUAGES[l]?.nativeName.toLowerCase().includes(query)
      )
    );

    if (!query) return group;
    if (countryMatch) return group;
    if (matchingCities.length > 0) {
      return {
        ...group,
        cities: matchingCities,
      };
    }
    return null;
  }).filter((g): g is CountryGroup => g !== null);

  const handleSelect = (locId: string | null, lang?: string) => {
    setActiveLocationAndLanguage(locId, lang);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/50 backdrop-blur-xs transition-opacity" 
        onClick={onClose}
      />

      {/* Modal Dialog (Time Out Destinations layout with Language Support) */}
      <div className="relative w-full max-w-2xl bg-white dark:bg-[#121418] rounded-2xl border border-gray-200 dark:border-gray-800 overflow-hidden z-10 flex flex-col max-h-[85vh] shadow-2xl">
        {/* Search Header */}
        <div className="p-3.5 sm:p-4 border-b border-gray-100 dark:border-gray-800 flex items-center gap-2">
          <div className="relative flex-1">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search location or language..."
              autoFocus
              className="w-full pl-10 pr-9 py-2 bg-gray-50 dark:bg-gray-800/80 border-0 rounded-xl text-sm text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-[#FF0000] transition-all"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 cursor-pointer"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors cursor-pointer shrink-0"
            aria-label="Close"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Destinations Directory Body */}
        <div className="p-4 sm:p-6 overflow-y-auto space-y-6 flex-1">
          {/* Global / Worldwide Option */}
          {showGlobal && (
            <div>
              <div
                className={`w-full flex items-center justify-between px-4 py-3 rounded-xl border transition-all ${
                  activeLocationId === null
                    ? 'bg-red-50/70 dark:bg-red-950/30 border-[#FF0000]'
                    : 'bg-gray-50/60 dark:bg-gray-800/50 border-gray-200/80 dark:border-gray-800 hover:border-gray-300 dark:hover:border-gray-700'
                }`}
              >
                <button
                  type="button"
                  onClick={() => handleSelect(null)}
                  className="flex items-center gap-3 cursor-pointer text-left flex-1"
                >
                  <span className="text-xl leading-none">🌐</span>
                  <div>
                    <span className={`text-sm font-medium ${activeLocationId === null ? 'text-[#FF0000] font-semibold' : 'text-gray-900 dark:text-white'}`}>
                      Global
                    </span>
                    <span className="text-xs text-gray-400 dark:text-gray-500 ml-2 font-normal">All Destinations</span>
                  </div>
                </button>

                {/* Global Language Switcher */}
                <div className="flex items-center gap-1.5 ml-2">
                  {GLOBAL_SUPPORTED_LANGUAGES.map((langCode) => {
                    const isLangActive = activeLocationId === null && activeLanguage === langCode;
                    const langInfo = SUPPORTED_LANGUAGES[langCode];
                    if (!langInfo) return null;

                    return (
                      <button
                        key={langCode}
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleSelect(null, langCode);
                        }}
                        className={`px-2 py-1 rounded-md text-[11px] font-medium transition-colors cursor-pointer ${
                          isLangActive
                            ? 'bg-[#FF0000] text-white font-semibold'
                            : 'bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 border border-gray-200 dark:border-gray-700'
                        }`}
                        title={langInfo.nativeName}
                      >
                        {langInfo.short}
                      </button>
                    );
                  })}

                  {activeLocationId === null && (
                    <Check className="w-4 h-4 text-[#FF0000] ml-1 shrink-0" />
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Destinations Directory Grid (Time Out style with Language Badges) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {filteredGroups.map(({ country, cities }) => {
              const hasCities = cities.length > 0;
              const isCountrySelected = activeLocationId === country.id;
              const supportedLangs = country.supportedLanguages || ['en'];

              return (
                <div 
                  key={country.id}
                  className="rounded-xl border border-gray-100 dark:border-gray-800 bg-gray-50/40 dark:bg-gray-850/40 p-3.5 flex flex-col justify-between"
                >
                  <div>
                    {/* Country Header */}
                    <div className="flex items-center justify-between pb-2 mb-2 border-b border-gray-100 dark:border-gray-800">
                      <button
                        type="button"
                        onClick={() => handleSelect(country.id)}
                        className={`flex items-center gap-2 text-left cursor-pointer hover:text-[#FF0000] transition-colors group ${
                          isCountrySelected ? 'text-[#FF0000] font-semibold' : 'text-gray-900 dark:text-white font-medium'
                        }`}
                      >
                        <span className="text-lg leading-none">{country.flagEmoji}</span>
                        <span className="text-sm tracking-tight">{country.name}</span>
                      </button>

                      <div className="flex items-center gap-1">
                        {/* Language Selector for Country */}
                        {supportedLangs.map((langCode) => {
                          const isLangActive = isCountrySelected && activeLanguage === langCode;
                          const langInfo = SUPPORTED_LANGUAGES[langCode];
                          if (!langInfo) return null;

                          return (
                            <button
                              key={langCode}
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleSelect(country.id, langCode);
                              }}
                              className={`px-1.5 py-0.5 rounded text-[10px] font-medium transition-colors cursor-pointer ${
                                isLangActive
                                  ? 'bg-[#FF0000] text-white font-semibold'
                                  : 'bg-white/80 dark:bg-gray-800/80 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 border border-gray-200/80 dark:border-gray-700'
                              }`}
                              title={langInfo.nativeName}
                            >
                              {langInfo.short}
                            </button>
                          );
                        })}

                        {isCountrySelected && (
                          <Check className="w-3.5 h-3.5 text-[#FF0000] ml-1 shrink-0" />
                        )}
                      </div>
                    </div>

                    {/* Cities List */}
                    {hasCities && (
                      <div className="space-y-1 pl-1">
                        {cities.map((city) => {
                          const isCitySelected = activeLocationId === city.id;
                          const cityLangs = city.supportedLanguages || supportedLangs;

                          return (
                            <div
                              key={city.id}
                              className={`w-full flex items-center justify-between px-2 py-1.5 rounded-lg text-xs transition-colors ${
                                isCitySelected
                                  ? 'bg-red-50/80 dark:bg-red-950/40 text-[#FF0000] font-semibold'
                                  : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100/70 dark:hover:bg-gray-800'
                              }`}
                            >
                              <button
                                type="button"
                                onClick={() => handleSelect(city.id)}
                                className="flex-1 text-left cursor-pointer hover:text-gray-900 dark:hover:text-white"
                              >
                                <span>{city.name}</span>
                              </button>

                              <div className="flex items-center gap-1">
                                {cityLangs.map((langCode) => {
                                  const isLangActive = isCitySelected && activeLanguage === langCode;
                                  const langInfo = SUPPORTED_LANGUAGES[langCode];
                                  if (!langInfo) return null;

                                  return (
                                    <button
                                      key={langCode}
                                      type="button"
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        handleSelect(city.id, langCode);
                                      }}
                                      className={`px-1 py-0.5 rounded text-[9px] font-medium transition-colors cursor-pointer ${
                                        isLangActive
                                          ? 'bg-[#FF0000] text-white font-semibold'
                                          : 'bg-white dark:bg-gray-800 text-gray-500 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 border border-gray-200 dark:border-gray-700'
                                      }`}
                                      title={langInfo.nativeName}
                                    >
                                      {langInfo.short}
                                    </button>
                                  );
                                })}

                                {isCitySelected && (
                                  <Check className="w-3 h-3 text-[#FF0000] ml-0.5 shrink-0" />
                                )}
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          {filteredGroups.length === 0 && !showGlobal && (
            <div className="text-center py-12 text-sm text-gray-400">
              No destination found matching "{searchQuery}"
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

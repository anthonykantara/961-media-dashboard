import React, { useMemo, useRef, useEffect } from 'react';
import { useLocationContext } from '../../context/LocationContext';
import { ChevronRight, Cpu, TrendingUp, Trophy } from 'lucide-react';
import { LocationTerritory } from '../../types/location';
import { FlagIcon } from './FlagIcon';
import { usePostContext } from '../dashboard/posts/PostContext';
import { initialPosts } from '../dashboard/posts/mockData';
import { hasPublishedArticlesForLocation } from '../../utils/contentVisibility';

interface LocationDropdownProps {
  isOpen: boolean;
  onClose: () => void;
  className?: string;
  hideTopics?: boolean;
  hideBadges?: boolean;
}

interface CountryGroup {
  country: LocationTerritory;
  cities: LocationTerritory[];
}

export default function LocationDropdown({ 
  isOpen, 
  onClose, 
  className,
  hideTopics = false,
  hideBadges = false,
}: LocationDropdownProps) {
  const { 
    locations, 
    activeLocationId, 
    setActiveLocationAndLanguage, 
  } = useLocationContext();

  // Safely get posts from context if inside PostProvider, else fallback to initialPosts
  let posts = initialPosts;
  try {
    const postContext = usePostContext();
    if (postContext && postContext.posts) {
      posts = postContext.posts;
    }
  } catch {
    posts = initialPosts;
  }

  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close on Escape or click outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        onClose();
      }
    };
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('keydown', handleKeyDown);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  // Active locations only
  const visibleLocations = useMemo(() => locations.filter(l => l.status !== 'draft'), [locations]);

  // Topic editions (e.g. Tech, Business, Sports) - only if not hidden and has published articles
  const topicEditions = useMemo(() => {
    if (hideTopics) return [];
    return visibleLocations.filter(l => l.level === 'topic' && hasPublishedArticlesForLocation(l, locations, posts));
  }, [visibleLocations, hideTopics, locations, posts]);

  // Group country markets and their subordinate cities (only showing countries and cities with published articles)
  const countryGroups = useMemo(() => {
    const countries = visibleLocations.filter(l => l.level === 'country');
    const cities = visibleLocations.filter(l => l.level === 'city');

    const groups: CountryGroup[] = [];

    countries.forEach(country => {
      // Filter subordinate cities to ONLY those that have published articles
      const countryCities = cities.filter(c => 
        (c.parentId === country.id || c.countryCode === country.countryCode) &&
        hasPublishedArticlesForLocation(c, locations, posts)
      );

      // Only include country group if the country itself has published articles OR has visible cities with articles
      const countryHasArticles = hasPublishedArticlesForLocation(country, locations, posts);
      if (countryHasArticles || countryCities.length > 0) {
        groups.push({
          country,
          cities: countryCities,
        });
      }
    });

    return groups;
  }, [visibleLocations, locations, posts]);

  if (!isOpen) return null;

  const handleSelect = (locId: string) => {
    setActiveLocationAndLanguage(locId);
    onClose();
  };

  const getTopicIcon = (slug: string, isActive: boolean) => {
    switch (slug) {
      case 'tech':
        return <Cpu className={`w-3.5 h-3.5 ${isActive ? 'text-primary' : 'text-gray-600 dark:text-gray-400'}`} />;
      case 'business':
        return <TrendingUp className={`w-3.5 h-3.5 ${isActive ? 'text-primary' : 'text-gray-600 dark:text-gray-400'}`} />;
      case 'sports':
        return <Trophy className={`w-3.5 h-3.5 ${isActive ? 'text-primary' : 'text-gray-600 dark:text-gray-400'}`} />;
      default:
        return <span className="text-xs">⚡</span>;
    }
  };

  const renderBadge = (status?: string) => {
    if (hideBadges || !status || status === 'active' || status === 'draft') return null;

    if (status === 'new') {
      return (
        <span className="inline-flex items-center text-[8px] font-semibold px-1.5 py-0.5 rounded-full bg-[#FF0000] text-white lowercase leading-none shrink-0 shadow-none">
          new
        </span>
      );
    }
    if (status === 'beta') {
      return (
        <span className="inline-flex items-center text-[8px] font-semibold px-1.5 py-0.5 rounded-full bg-blue-600 text-white lowercase leading-none shrink-0 shadow-none">
          beta
        </span>
      );
    }
    if (status === 'soon') {
      return (
        <span className="inline-flex items-center text-[8px] font-semibold px-1.5 py-0.5 rounded-full bg-emerald-600 text-white lowercase leading-none shrink-0 shadow-none">
          soon
        </span>
      );
    }
    return null;
  };

  return (
    <>
      {/* Subtle backdrop overlay */}
      <div 
        className="fixed inset-0 z-40 bg-black/20 backdrop-blur-[1px] transition-opacity"
        onClick={onClose}
      />

      {/* Floating editorial dropdown directly under the switcher */}
      <div 
        ref={dropdownRef}
        className={className || "absolute top-full left-4 sm:left-6 z-50 mt-1.5 w-[calc(100vw-2rem)] sm:w-[360px] bg-white dark:bg-[#121418] sepia:bg-[#FAF6EE] border border-gray-200 dark:border-gray-800 sepia:border-[#E5DBC7] rounded-xl shadow-2xl overflow-hidden animate-in fade-in slide-in-from-top-1 duration-150"}
      >
        <div className="p-3 space-y-3 max-h-[calc(100vh-140px)] overflow-y-auto scrollbar-thin">
          {/* Horizontal Topic Global Editions (Tech, Business, Sports) */}
          {topicEditions.length > 0 && (
            <div className="flex items-center gap-1.5 pb-2.5 border-b border-gray-100 dark:border-gray-800/80 sepia:border-[#EAE1D0]">
              {topicEditions.map((topic) => {
                const isTopicActive = activeLocationId === topic.id;

                return (
                  <button
                    key={topic.id}
                    type="button"
                    onClick={() => handleSelect(topic.id)}
                    className={`flex items-center justify-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-semibold transition-colors cursor-pointer flex-1 min-w-0 ${
                      isTopicActive 
                        ? 'bg-primary/10 text-primary font-bold' 
                        : 'bg-gray-50 dark:bg-gray-900/50 text-gray-800 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-white/5'
                    }`}
                  >
                    <div className="w-4 h-4 rounded flex items-center justify-center shrink-0">
                      {getTopicIcon(topic.slug, isTopicActive)}
                    </div>
                    <span className="truncate">{topic.name}</span>
                    {renderBadge(topic.status)}
                  </button>
                );
              })}
            </div>
          )}

          {/* Clean Flat List of Countries & Nested Cities */}
          <div className="space-y-1.5">
            {countryGroups.map(({ country, cities }) => {
              const isCountryActive = activeLocationId === country.id;

              return (
                <div key={country.id} className="space-y-0.5">
                  {/* Country List Row (Level 1) */}
                  <div className="flex items-center py-1 px-1.5 rounded-md hover:bg-gray-50 dark:hover:bg-white/5 transition-colors">
                    <button
                      type="button"
                      onClick={() => handleSelect(country.id)}
                      className="flex items-center gap-2 text-left cursor-pointer flex-1 min-w-0"
                    >
                      <FlagIcon countryCode={country.countryCode} className="w-4.5 h-3.5 shrink-0" />
                      <span className={`text-sm tracking-tight truncate transition-colors ${
                        isCountryActive 
                          ? 'text-primary font-bold' 
                          : 'text-gray-900 dark:text-white sepia:text-[#2D251E] font-medium'
                      }`}>
                        {country.name}
                      </span>
                      {renderBadge(country.status)}
                    </button>
                  </div>

                  {/* Nested Subordinate Cities (Level 2) - Clean inline list */}
                  {cities.length > 0 && (
                    <div className="pl-6 space-y-0.5">
                      {cities.map((city) => {
                        const isCityActive = activeLocationId === city.id;

                        return (
                          <div 
                            key={city.id}
                            className="flex items-center py-1 px-1.5 rounded-md hover:bg-gray-50 dark:hover:bg-white/5 transition-colors group/city"
                          >
                            <button
                              type="button"
                              onClick={() => handleSelect(city.id)}
                              className="flex items-center gap-1.5 text-left cursor-pointer flex-1 min-w-0"
                            >
                              <ChevronRight className={`w-3.5 h-3.5 shrink-0 transition-colors ${
                                isCityActive 
                                  ? 'text-primary' 
                                  : 'text-gray-400 dark:text-gray-600 group-hover/city:text-primary'
                              }`} />
                              <span className={`text-[13px] truncate transition-colors ${
                                isCityActive 
                                  ? 'text-primary font-bold' 
                                  : 'text-gray-700 dark:text-gray-300 sepia:text-[#4A3E31] group-hover/city:text-gray-900 dark:group-hover/city:text-white font-normal'
                              }`}>
                                {city.name}
                              </span>
                              {renderBadge(city.status)}
                            </button>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </>
  );
}

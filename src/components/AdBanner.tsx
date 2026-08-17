import React, { useState } from 'react';
import { Info, ExternalLink, X } from 'lucide-react';

interface AdBannerProps {
  format?: 'leaderboard' | 'rectangle' | 'in-feed' | 'responsive';
  className?: string;
  adSlotId?: string;
}

const AD_CREATIVES = [
  {
    sponsor: 'Emirates',
    headline: 'Fly Better to Over 140 Destinations',
    tagline: 'Book flights with special fares, free cancellation & luxury dining.',
    cta: 'Book Now',
    url: 'https://www.emirates.com',
    displayUrl: 'emirates.com/deals',
    badge: 'Sponsored',
    image: 'https://images.unsplash.com/photo-1436491865332-7a61a109cc05?w=600&auto=format&fit=crop&q=80',
    color: '#D71921',
  },
  {
    sponsor: 'Google Cloud',
    headline: 'Build Faster with Generative AI on Vertex AI',
    tagline: 'Get $300 in free credits to build and deploy modern AI solutions.',
    cta: 'Start Free',
    url: 'https://cloud.google.com',
    displayUrl: 'cloud.google.com/vertex-ai',
    badge: 'Ads by Google',
    image: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=600&auto=format&fit=crop&q=80',
    color: '#1A73E8',
  },
  {
    sponsor: 'Alfa Telecom',
    headline: 'High-Speed 4.5G+ Data Bundles',
    tagline: 'Stay connected anywhere with unlimited night streaming & social packs.',
    cta: 'Recharge Now',
    url: 'https://www.alfa.com.lb',
    displayUrl: 'alfa.com.lb/mobile-plans',
    badge: 'Ads by Google',
    image: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=600&auto=format&fit=crop&q=80',
    color: '#E60000',
  },
  {
    sponsor: 'Audi Bank',
    headline: 'Cedars Global Accounts & Direct Transfers',
    tagline: 'Manage international wealth & remittances with zero transaction fees.',
    cta: 'Open Account',
    url: 'https://www.bankaudi.com.lb',
    displayUrl: 'bankaudi.com.lb/wealth',
    badge: 'Ads by Google',
    image: 'https://images.unsplash.com/photo-1559526324-4b87b5e36e44?w=600&auto=format&fit=crop&q=80',
    color: '#0B3A60',
  }
];

export default function AdBanner({ format = 'responsive', className = '', adSlotId }: AdBannerProps) {
  // Pick creative based on adSlotId or stable hash
  const creativeIndex = adSlotId 
    ? Math.abs(adSlotId.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0)) % AD_CREATIVES.length 
    : 0;
  
  const ad = AD_CREATIVES[creativeIndex];
  const [showInfo, setShowInfo] = useState(false);

  // Common AdSense Header Badge & AdChoices icon
  const AdChoicesBadge = () => (
    <div className="absolute top-1.5 right-2 flex items-center gap-1 z-20 select-none">
      <div className="flex items-center gap-0.5 bg-white/90 backdrop-blur-xs px-1.5 py-0.5 rounded text-[9px] font-sans font-medium text-gray-500 border border-gray-200/60 shadow-2xs">
        <span>Ad</span>
        <div className="flex items-center text-blue-600 hover:text-blue-700 cursor-pointer" onClick={() => setShowInfo(!showInfo)} title="AdChoices">
          <svg className="w-2.5 h-2.5 fill-current ml-0.5" viewBox="0 0 24 24">
            <path d="M12 2L1 21h22L12 2zm0 3.8l7.5 13.2H4.5L12 5.8z" />
          </svg>
          <Info className="w-2 h-2 ml-0.5" />
        </div>
      </div>
    </div>
  );

  if (format === 'rectangle') {
    return (
      <div className={`relative bg-white border border-gray-200 rounded-xl overflow-hidden shadow-2xs ${className}`}>
        <AdChoicesBadge />
        
        <div className="p-4 flex flex-col items-center text-center">
          <div className="w-full h-32 rounded-lg overflow-hidden mb-3 bg-gray-100 relative">
            <img 
              src={ad.image} 
              alt={ad.headline} 
              className="w-full h-full object-cover" 
              referrerPolicy="no-referrer"
            />
            <div className="absolute bottom-2 left-2 bg-black/70 backdrop-blur-xs text-white text-[10px] font-semibold px-2 py-0.5 rounded">
              {ad.sponsor}
            </div>
          </div>

          <h4 className="text-sm font-bold text-gray-900 leading-snug line-clamp-2 mb-1">
            {ad.headline}
          </h4>
          <p className="text-xs text-gray-500 line-clamp-2 leading-relaxed mb-3">
            {ad.tagline}
          </p>

          <div className="w-full flex items-center justify-between pt-2 border-t border-gray-100">
            <span className="text-[11px] text-gray-400 font-medium truncate max-w-[140px]">
              {ad.displayUrl}
            </span>
            <a 
              href={ad.url} 
              target="_blank" 
              rel="noopener noreferrer"
              className="px-4 py-1.5 bg-[#1A73E8] hover:bg-blue-700 text-white text-xs font-semibold rounded-lg transition-colors inline-flex items-center gap-1"
            >
              <span>{ad.cta}</span>
              <ExternalLink className="w-3 h-3" />
            </a>
          </div>
        </div>
      </div>
    );
  }

  if (format === 'leaderboard') {
    return (
      <div className={`relative bg-white border border-gray-200 rounded-xl overflow-hidden shadow-2xs ${className}`}>
        <AdChoicesBadge />

        <div className="p-4 sm:p-5 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-4 w-full sm:w-auto">
            <div className="w-20 h-16 sm:w-24 sm:h-20 rounded-lg overflow-hidden bg-gray-100 shrink-0">
              <img 
                src={ad.image} 
                alt={ad.headline} 
                className="w-full h-full object-cover" 
                referrerPolicy="no-referrer"
              />
            </div>
            <div className="min-w-0 pr-12 sm:pr-0">
              <div className="flex items-center gap-2 mb-0.5">
                <span className="text-[11px] font-bold text-gray-900">{ad.sponsor}</span>
                <span className="text-[10px] text-gray-400">•</span>
                <span className="text-[10px] text-gray-400 truncate">{ad.displayUrl}</span>
              </div>
              <h4 className="text-sm sm:text-base font-bold text-gray-900 truncate leading-snug">
                {ad.headline}
              </h4>
              <p className="text-xs text-gray-500 line-clamp-1 mt-0.5">
                {ad.tagline}
              </p>
            </div>
          </div>

          <div className="shrink-0 w-full sm:w-auto flex justify-end">
            <a 
              href={ad.url} 
              target="_blank" 
              rel="noopener noreferrer"
              className="w-full sm:w-auto px-6 py-2.5 bg-[#1A73E8] hover:bg-blue-700 text-white text-xs font-semibold rounded-lg transition-colors flex items-center justify-center gap-1.5"
            >
              <span>{ad.cta}</span>
              <ExternalLink className="w-3 h-3" />
            </a>
          </div>
        </div>
      </div>
    );
  }

  // Responsive / In-Article Standard Banner (AdSense style display unit)
  return (
    <div className={`relative bg-[#FAFAFA] border border-gray-200/90 rounded-2xl overflow-hidden shadow-2xs ${className}`}>
      <AdChoicesBadge />

      <div className="p-4 sm:p-6 flex flex-col sm:flex-row items-center justify-between gap-5 sm:gap-6">
        <div className="flex items-start sm:items-center gap-4 w-full">
          <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-xl overflow-hidden bg-gray-200 shrink-0 border border-gray-100">
            <img 
              src={ad.image} 
              alt={ad.headline} 
              className="w-full h-full object-cover" 
              referrerPolicy="no-referrer"
            />
          </div>
          <div className="flex-1 min-w-0 pr-8 sm:pr-0">
            <div className="flex items-center gap-1.5 mb-1">
              <span className="text-xs font-bold text-gray-900">{ad.sponsor}</span>
              <span className="text-[10px] text-gray-400">•</span>
              <span className="text-[11px] text-blue-600 font-medium truncate">{ad.displayUrl}</span>
            </div>
            <h4 className="text-sm sm:text-base font-bold text-gray-900 leading-snug line-clamp-1">
              {ad.headline}
            </h4>
            <p className="text-xs text-gray-600 line-clamp-2 mt-1 leading-relaxed">
              {ad.tagline}
            </p>
          </div>
        </div>

        <div className="w-full sm:w-auto shrink-0 flex items-center justify-end">
          <a 
            href={ad.url} 
            target="_blank" 
            rel="noopener noreferrer"
            className="w-full sm:w-auto px-6 py-2.5 bg-[#1A73E8] hover:bg-blue-700 text-white text-xs font-semibold rounded-xl transition-colors flex items-center justify-center gap-1.5 shadow-2xs"
          >
            <span>{ad.cta}</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>
      </div>
    </div>
  );
}

import { useState } from 'react';
import { 
  Globe, 
  Twitter, 
  Facebook, 
  MessageCircle, 
  CheckCircle2, 
  AlertCircle, 
  Smartphone,
  Monitor
} from 'lucide-react';

interface SocialPreviewValidatorProps {
  title: string;
  excerpt: string;
  content: string;
  image: string;
  sections: string[];
  keywords: string[];
  author: string[];
}

export default function SocialPreviewValidator({
  title,
  excerpt,
  content,
  image,
  sections,
  keywords,
  author,
}: SocialPreviewValidatorProps) {
  const [activePlatform, setActivePlatform] = useState<'google' | 'twitter' | 'facebook' | 'whatsapp'>('google');
  const [serpDevice, setSerpDevice] = useState<'desktop' | 'mobile'>('desktop');

  // Strip HTML tags for clean description fallback
  const cleanContent = content.replace(/<[^>]*>?/gm, '').trim();
  const displayTitle = title || 'Lebanon’s Tech Scene is Booming in 2026: A New Era of Innovation';
  const displayExcerpt = excerpt || (cleanContent.slice(0, 155) ? `${cleanContent.slice(0, 155)}...` : 'Discover how Lebanese innovation, entrepreneurship, and talent are shaping the future of technology across the Middle East in 2026.');
  const displayImage = image || 'https://images.unsplash.com/photo-1526778548025-fa2f459cd5c1?auto=format&fit=crop&w=1200&h=630&q=80';
  const displaySection = sections[0] || 'News';
  const sectionSlug = displaySection.toLowerCase().replace(/ & /g, '-').replace(/\s+/g, '-');
  const postSlug = title ? title.toLowerCase().replace(/[^\w ]+/g, '').replace(/ +/g, '-') : 'lebanon-tech-scene-2026';
  const canonicalUrl = `https://the961.com/${sectionSlug}/${postSlug}`;

  // SEO Scorecard Metrics
  const titleLength = title.length;
  const titleStatus = titleLength >= 40 && titleLength <= 65 ? 'optimal' : titleLength < 40 ? 'short' : 'long';

  const descLength = (excerpt || displayExcerpt).length;
  const descStatus = descLength >= 120 && descLength <= 160 ? 'optimal' : descLength < 120 ? 'short' : 'long';

  const hasImage = Boolean(image);
  const hasSection = sections.length > 0;
  const hasKeywords = keywords.length >= 3;

  // Overall Score Calculation (out of 100)
  let score = 0;
  if (titleStatus === 'optimal') score += 25;
  else if (titleLength > 10) score += 15;

  if (descStatus === 'optimal') score += 25;
  else if (descLength > 30) score += 15;

  if (hasImage) score += 20;
  if (hasSection) score += 15;
  if (hasKeywords) score += 15;

  return (
    <div className="space-y-8 animate-in fade-in duration-200">
      
      {/* Header & Overall Health Scorecard */}
      <div className="flex items-center justify-between bg-gray-50/70 p-6 rounded-2xl border border-gray-100">
        <div>
          <h2 className="text-xl font-bold text-gray-900 tracking-tight">Social Snippets & Search Engine Previews</h2>
        </div>

        <div className="flex items-center justify-end gap-5">
          <div className="text-right">
            <div className="text-2xl font-black text-gray-900 leading-none">{score}/100</div>
            <span className="text-[11px] font-semibold text-gray-400">SEO Health Index</span>
          </div>
          <div className="relative w-14 h-14 shrink-0">
            <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
              <path
                className="text-gray-200"
                strokeWidth="3.5"
                stroke="currentColor"
                fill="none"
                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
              />
              <path
                className={score >= 80 ? 'text-green-500' : score >= 50 ? 'text-amber-500' : 'text-primary'}
                strokeDasharray={`${score}, 100`}
                strokeWidth="3.5"
                strokeLinecap="round"
                stroke="currentColor"
                fill="none"
                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
              />
            </svg>
            <span className="absolute inset-0 flex items-center justify-center text-xs font-bold text-gray-700">
              {score}%
            </span>
          </div>
        </div>
      </div>

      {/* Validation Checklist Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Title Check */}
        <div className="bg-white p-4 rounded-xl border border-gray-100 space-y-1.5">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-gray-700">SEO Headline</span>
            {titleStatus === 'optimal' ? (
              <CheckCircle2 className="w-4 h-4 text-green-500" />
            ) : (
              <AlertCircle className="w-4 h-4 text-amber-500" />
            )}
          </div>
          <div className="text-[11px] text-gray-500 flex items-center justify-between">
            <span>{titleLength}/60 chars</span>
            <span className={titleStatus === 'optimal' ? 'text-green-600 font-semibold' : 'text-amber-600 font-semibold'}>
              {titleStatus === 'optimal' ? 'Ideal length' : titleStatus === 'short' ? 'Too brief' : 'May truncate'}
            </span>
          </div>
        </div>

        {/* Description Check */}
        <div className="bg-white p-4 rounded-xl border border-gray-100 space-y-1.5">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-gray-700">Meta Snippet</span>
            {descStatus === 'optimal' ? (
              <CheckCircle2 className="w-4 h-4 text-green-500" />
            ) : (
              <AlertCircle className="w-4 h-4 text-amber-500" />
            )}
          </div>
          <div className="text-[11px] text-gray-500 flex items-center justify-between">
            <span>{descLength}/160 chars</span>
            <span className={descStatus === 'optimal' ? 'text-green-600 font-semibold' : 'text-amber-600 font-semibold'}>
              {descStatus === 'optimal' ? 'Optimal' : descStatus === 'short' ? 'Add details' : 'Trim excess'}
            </span>
          </div>
        </div>

        {/* Social Image Check */}
        <div className="bg-white p-4 rounded-xl border border-gray-100 space-y-1.5">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-gray-700">OG Cover Image</span>
            {hasImage ? (
              <CheckCircle2 className="w-4 h-4 text-green-500" />
            ) : (
              <AlertCircle className="w-4 h-4 text-primary" />
            )}
          </div>
          <div className="text-[11px] text-gray-500 flex items-center justify-between">
            <span>{hasImage ? 'Selected' : 'Missing'}</span>
            <span className={hasImage ? 'text-green-600 font-semibold' : 'text-primary font-semibold'}>
              {hasImage ? '1.91:1 ready' : 'Required'}
            </span>
          </div>
        </div>

        {/* Section & Taxonomy */}
        <div className="bg-white p-4 rounded-xl border border-gray-100 space-y-1.5">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-gray-700">Section Assigned</span>
            {hasSection ? (
              <CheckCircle2 className="w-4 h-4 text-green-500" />
            ) : (
              <AlertCircle className="w-4 h-4 text-amber-500" />
            )}
          </div>
          <div className="text-[11px] text-gray-500 flex items-center justify-between">
            <span>{sections.length} selected</span>
            <span className="text-gray-700 font-semibold">{displaySection}</span>
          </div>
        </div>
      </div>

      {/* Main Interactive Simulator Section */}
      <div className="bg-white rounded-2xl border border-gray-100 p-6 md:p-8 space-y-6">
        
        {/* Platform Selector Tabs */}
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-gray-100 pb-4">
          <div className="flex items-center gap-2">
            {[
              { id: 'google', label: 'Google Search', icon: Globe },
              { id: 'twitter', label: 'X / Twitter Card', icon: Twitter },
              { id: 'facebook', label: 'Facebook Feed', icon: Facebook },
              { id: 'whatsapp', label: 'WhatsApp / Chat', icon: MessageCircle },
            ].map(({ id, label, icon: Icon }) => {
              const isActive = activePlatform === id;
              return (
                <button
                  key={id}
                  type="button"
                  onClick={() => setActivePlatform(id as any)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                    isActive 
                      ? 'bg-gray-900 text-white' 
                      : 'bg-gray-50 text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  <span>{label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* 1. GOOGLE SERP SIMULATOR */}
        {activePlatform === 'google' && (
          <div className="space-y-4 max-w-2xl">
            <div className="flex items-center justify-between pb-2">
              <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">SERP Result Snippet</span>
              <div className="flex items-center gap-1 bg-gray-100 p-0.5 rounded-lg">
                <button
                  type="button"
                  onClick={() => setSerpDevice('desktop')}
                  className={`p-1 rounded text-xs font-medium cursor-pointer ${serpDevice === 'desktop' ? 'bg-white shadow-2xs text-gray-900' : 'text-gray-500'}`}
                  title="Desktop Preview"
                >
                  <Monitor className="w-3.5 h-3.5" />
                </button>
                <button
                  type="button"
                  onClick={() => setSerpDevice('mobile')}
                  className={`p-1 rounded text-xs font-medium cursor-pointer ${serpDevice === 'mobile' ? 'bg-white shadow-2xs text-gray-900' : 'text-gray-500'}`}
                  title="Mobile Preview"
                >
                  <Smartphone className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            <div className={`p-5 bg-white rounded-xl border border-gray-200 shadow-2xs font-sans ${serpDevice === 'mobile' ? 'max-w-sm' : ''}`}>
              {/* Domain & Favicon */}
              <div className="flex items-center gap-2 mb-1.5">
                <div className="w-5 h-5 rounded-full bg-primary flex items-center justify-center text-white text-[10px] font-black">
                  961
                </div>
                <div className="flex flex-col">
                  <span className="text-[12px] font-medium text-[#202124] leading-tight">The 961</span>
                  <span className="text-[11px] text-[#4d5156] leading-tight">
                    https://the961.com › {sectionSlug} › {postSlug}
                  </span>
                </div>
              </div>

              {/* SERP Headline */}
              <h3 className="text-lg md:text-xl font-normal text-[#1a0dab] hover:underline cursor-pointer leading-snug mb-1">
                {displayTitle} - The 961
              </h3>

              {/* Snippet Description */}
              <p className="text-xs text-[#4d5156] leading-relaxed line-clamp-2">
                <span className="text-gray-400 mr-1.5">{new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })} —</span>
                {displayExcerpt}
              </p>
            </div>
          </div>
        )}

        {/* 2. TWITTER / X SUMMARY LARGE IMAGE SIMULATOR */}
        {activePlatform === 'twitter' && (
          <div className="space-y-4 max-w-xl">
            <div className="flex items-center justify-between pb-2">
              <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">X (Twitter) Large Card Preview</span>
            </div>

            <div className="border border-gray-200 rounded-2xl overflow-hidden bg-white shadow-2xs">
              {/* Big 1.91:1 Aspect Ratio Cover */}
              <div className="aspect-[1.91/1] w-full bg-gray-100 relative overflow-hidden">
                <img 
                  src={displayImage} 
                  alt="X Card Preview" 
                  className="w-full h-full object-cover" 
                  referrerPolicy="no-referrer"
                />
                <span className="absolute bottom-2 left-2 px-2 py-0.5 bg-black/75 text-white text-[10px] font-bold rounded">
                  the961.com
                </span>
              </div>

              {/* Meta Card Details */}
              <div className="p-3.5 space-y-1">
                <p className="text-[11px] text-gray-500 font-medium">the961.com</p>
                <h4 className="text-sm font-bold text-gray-900 leading-snug line-clamp-2">
                  {displayTitle}
                </h4>
                <p className="text-xs text-gray-500 line-clamp-2 leading-relaxed">
                  {displayExcerpt}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* 3. FACEBOOK FEED OPENGRAPH SIMULATOR */}
        {activePlatform === 'facebook' && (
          <div className="space-y-4 max-w-xl">
            <div className="flex items-center justify-between pb-2">
              <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">Facebook Feed Post Preview</span>
            </div>

            <div className="border border-gray-200 rounded-2xl overflow-hidden bg-white shadow-2xs">
              {/* Facebook Post Header */}
              <div className="p-3 flex items-center gap-2.5 border-b border-gray-100">
                <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-white text-xs font-black">
                  961
                </div>
                <div>
                  <h5 className="text-xs font-bold text-gray-900 leading-tight">The 961</h5>
                  <p className="text-[10px] text-gray-400">Just now • 🌐</p>
                </div>
              </div>

              {/* Cover */}
              <div className="aspect-[1.91/1] w-full bg-gray-100 overflow-hidden">
                <img 
                  src={displayImage} 
                  alt="Facebook preview" 
                  className="w-full h-full object-cover" 
                  referrerPolicy="no-referrer"
                />
              </div>

              {/* Bottom Strip */}
              <div className="p-3 bg-gray-50 border-t border-gray-100">
                <span className="text-[10px] text-gray-500 uppercase font-semibold tracking-wider block">THE961.COM</span>
                <h4 className="text-sm font-bold text-gray-900 leading-snug line-clamp-2 mt-0.5">
                  {displayTitle}
                </h4>
                <p className="text-xs text-gray-500 line-clamp-1 mt-0.5">
                  {displayExcerpt}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* 4. WHATSAPP CHAT PREVIEW */}
        {activePlatform === 'whatsapp' && (
          <div className="space-y-4 max-w-md">
            <div className="flex items-center justify-between pb-2">
              <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">WhatsApp Message Preview</span>
            </div>

            <div className="p-4 bg-[#EFEAE2] rounded-2xl">
              <div className="bg-[#E7FFDB] rounded-xl p-2.5 max-w-xs shadow-2xs border border-[#D0E6C5] space-y-2">
                {/* Embedded Card */}
                <div className="bg-[#D9FDD3] rounded-lg overflow-hidden border border-[#C5EAB9]">
                  <div className="aspect-[1.8/1] w-full bg-gray-200 overflow-hidden">
                    <img 
                      src={displayImage} 
                      alt="WhatsApp preview" 
                      className="w-full h-full object-cover" 
                      referrerPolicy="no-referrer"
                    />
                  </div>
                  <div className="p-2">
                    <h5 className="text-xs font-bold text-gray-900 line-clamp-2 leading-tight">
                      {displayTitle}
                    </h5>
                    <p className="text-[11px] text-gray-600 line-clamp-2 mt-1 leading-snug">
                      {displayExcerpt}
                    </p>
                    <span className="text-[10px] text-gray-400 mt-1 block">the961.com</span>
                  </div>
                </div>

                {/* Sent Link */}
                <div className="flex items-end justify-between gap-2 px-1">
                  <span className="text-xs text-[#006699] underline truncate font-medium">
                    {canonicalUrl}
                  </span>
                  <span className="text-[10px] text-gray-400 shrink-0">12:45 PM ✓✓</span>
                </div>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}

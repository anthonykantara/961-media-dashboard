import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Lightbulb, 
  Calendar, 
  TrendingUp, 
  Search, 
  Filter, 
  ArrowRight, 
  Copy, 
  Check, 
  Flame, 
  X,
  Newspaper,
  Compass,
  Globe,
  Zap
} from 'lucide-react';

interface IdeaItem {
  id: string;
  title: string;
  description: string;
  category: 'News' | 'Lifestyle' | 'Food & Drink' | 'Travel' | 'Diaspora' | 'Things To Do';
  type: 'date-specific' | 'viral-trending';
  dateLabel?: string;
  viralityScore: number; // 0 to 100
  trendingKeywords: string[];
  headlines: string[];
  image: string;
}

const ideaRecommendations: IdeaItem[] = [
  {
    id: 'world-manousheh-day',
    title: 'World Manousheh Day',
    description: "An international celebration of Lebanon's ultimate street food staple. Every Lebanese worldwide connects over a fresh, warm Manousheh.",
    category: 'Food & Drink',
    type: 'date-specific',
    dateLabel: 'November 2',
    viralityScore: 98,
    trendingKeywords: ['Manousheh', 'Zaatar', 'Beirut Street Food', 'Lebanese Breakfast'],
    headlines: [
      'The Ultimate Battle: Thyme, Cheese, or Half-and-Half? Celebrating World Manousheh Day',
      'From Beirut Bakeries to Paris and New York: How the Manousheh Became a Global Sensation',
      '5 Historic Bakeries in Lebanon Keeping the Traditional Tannour Manousheh Alive',
      "The Science of Za'atar: Why Beirut's Favorite Breakfast is Actually Good for Your Brain"
    ],
    image: 'https://images.unsplash.com/photo-1541518763669-27fef04b14ea?auto=format&fit=crop&w=600&h=900&q=80'
  },
  {
    id: 'mothers-day',
    title: "Lebanese Mother's Day",
    description: "Mother's Day in Lebanon and the region is uniquely celebrated on the Spring Equinox. Emotional, nostalgic, family-driven narrative stories perform exceptionally well.",
    category: 'Lifestyle',
    type: 'date-specific',
    dateLabel: 'March 21',
    viralityScore: 94,
    trendingKeywords: ['Lebanese Mothers', 'Family Heritage', 'Teta Recipes', 'March 21'],
    headlines: [
      '10 Classic Phrases Every Lebanese Mother Says (and What They Actually Mean)',
      'More Than a Recipe: The Culinary Secrets Passed Down by Generations of Lebanese Mothers',
      'Distance Can\'t Separate Us: How Diaspora Lebanese Are Surprising Their Moms This March 21',
      'The Unsung Heroines of Lebanon: Stories of Mothers Rebuilding and Leading Communities'
    ],
    image: 'https://images.unsplash.com/photo-1605810230434-7631ac76ec81?auto=format&fit=crop&w=600&h=900&q=80'
  },
  {
    id: 'diaspora-homecoming',
    title: 'Diaspora Homecoming Summer Spike',
    description: 'Millions of expats travel back to Lebanon during the summer, injecting immense vitality and energy. Expats and locals love highly relatable homecoming stories.',
    category: 'Diaspora',
    type: 'viral-trending',
    viralityScore: 96,
    trendingKeywords: ['Homecoming', 'Lebanese Diaspora', 'Beirut Summer', 'Airport Arrivals'],
    headlines: [
      'The Tearful Terminal: Why Beirut Airport Arrivals is the Most Emotional Place in Lebanon',
      'An Expat\'s Guide to Reconnecting with Lebanon: 7 Things You Can\'t Miss This Summer',
      'How Diaspora Summers Are Fueling a Vibrant Small-Business Renaissance Across the Coast',
      'The Ultimate 24-Hour Beirut Itinerary for Visiting Expats'
    ],
    image: 'https://images.unsplash.com/photo-1545569341-9eb8b30979d9?auto=format&fit=crop&w=600&h=900&q=80'
  },
  {
    id: 'beirut-port-remembrance',
    title: 'Beirut Port Commemoration',
    description: 'A solemn day of remembrance, solidarity, and demand for justice. Requires respectful, powerful tribute journalism and tracking of neighborhood revivals.',
    category: 'News',
    type: 'date-specific',
    dateLabel: 'August 4',
    viralityScore: 92,
    trendingKeywords: ['August 4', 'Beirut Explosion', 'Remembrance', 'Hope & Justice'],
    headlines: [
      'Beirut Remembers: Emotional Tributes and Untold Stories of Resilience Six Years Later',
      'The Global Diaspora Standing with Beirut: Vigils and Memorials Around the World',
      'Rebuilding the Soul of Mar Mikhael: The Independent Artisans Reviving Beirut\'s Creative Hub'
    ],
    image: 'https://images.unsplash.com/photo-1517524206127-48bbd363f3d7?auto=format&fit=crop&w=600&h=900&q=80'
  },
  {
    id: 'lebanese-independence',
    title: 'Lebanese Independence Day',
    description: 'Marking Lebanon\'s independence from the French mandate. Focuses on history, cultural identity, national symbols, and modern citizen perspectives.',
    category: 'News',
    type: 'date-specific',
    dateLabel: 'November 22',
    viralityScore: 89,
    trendingKeywords: ['Independence Day', 'November 22', 'National Pride', 'History'],
    headlines: [
      'The Forgotten Heroes of Rachaya: The Hidden History of Lebanon\'s Independence Struggle',
      'Beyond the Flag: What Independence Means to the New Generation of Lebanese',
      '5 National Monuments in Lebanon You Should Visit This Independence Day Weekend'
    ],
    image: 'https://images.unsplash.com/photo-1578345218746-50a229b3d0f8?auto=format&fit=crop&w=600&h=900&q=80'
  },
  {
    id: 'lebanese-vineyards',
    title: 'The Lebanese Vineyard Boom',
    description: 'Lebanese boutique wine is gaining massive global acclaim. High-density reader interest in Batroun and Bekaa Valley wine-tours, history, and boutique wineries.',
    category: 'Travel',
    type: 'viral-trending',
    viralityScore: 87,
    trendingKeywords: ['Lebanese Wine', 'Bekaa Valley', 'Boutique Wineries', 'Wine Harvest'],
    headlines: [
      'From Phoenician Traders to Modern Masters: The Incredible Story of Lebanese Wine',
      '7 Boutique Vineyards in Batroun and Bekaa that Look Straight Out of Tuscany',
      'Why International Sommeliers Are Obsessing Over Lebanon\'s Indigenous Grapes'
    ],
    image: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=600&h=900&q=80'
  },
  {
    id: 'traditional-saj-mezze',
    title: 'The Saj & Mezze Comeback',
    description: 'Authentic, rural culinary traditions are seeing a huge urban revival. Youth-led farm-to-table initiatives are trending heavily across social platforms.',
    category: 'Food & Drink',
    type: 'viral-trending',
    viralityScore: 91,
    trendingKeywords: ['Farm to Table', 'Traditional Mezze', 'Saj Bread', 'Culinary Revival'],
    headlines: [
      'Ditching Fast Food for the Saj: The Lebanese Gen-Z Reviving Rural Bakery Traditions',
      'Where to Find the Best Authentically Sourced Mezze in Mount Lebanon This Weekend',
      'How Lebanese Food Influencers Are Putting Hidden Mountain Villages on the Global Culinary Map'
    ],
    image: 'https://images.unsplash.com/photo-1541518763669-27fef04b14ea?auto=format&fit=crop&w=600&h=900&q=80'
  },
  {
    id: 'tech-nomads-batroun',
    title: 'Digital Nomads in Batroun & Byblos',
    description: 'Remote workers and digital nomads from Europe and the Americas are setting up bases in Batroun for seaside workations.',
    category: 'Travel',
    type: 'viral-trending',
    viralityScore: 85,
    trendingKeywords: ['Digital Nomads', 'Batroun Coastal Work', 'Ancient Cities', 'Coworking'],
    headlines: [
      'Batroun is Becoming the Mediterranean\'s Best Kept Secret for Tech Nomads',
      'Working from an 8,000-Year-Old Port: A Day in the Life of a Nomad in Byblos',
      '5 Coastal Cafes in Lebanon with Perfect Wi-Fi and Stunning Sunset Views'
    ],
    image: 'https://images.unsplash.com/photo-1545569341-9eb8b30979d9?auto=format&fit=crop&w=600&h=900&q=80'
  }
];

const presetBrainstormSuggestions = [
  'Batroun Sunset',
  'Lebanese Mezze',
  'Saj Pizza',
  'Cedars Forest Hike',
  'Diaspora Remittances',
  'Jeita Grotto',
  'Byblos Harbour'
];

export default function IdeasPage() {
  const navigate = useNavigate();
  
  // States
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedType, setSelectedType] = useState<'all' | 'date-specific' | 'viral-trending'>('all');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [copiedHeadline, setCopiedHeadline] = useState<string | null>(null);

  // AI Brainstormer State
  const [brainstormInput, setBrainstormInput] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [generationStep, setGenerationStep] = useState('');
  const [generatedHeadlines, setGeneratedHeadlines] = useState<string[]>([]);
  const [generatedCategory, setGeneratedCategory] = useState<string>('News');

  const categories = ['All', 'News', 'Lifestyle', 'Food & Drink', 'Travel', 'Diaspora'];

  // Handle copying headline to clipboard
  const handleCopy = (headline: string) => {
    navigator.clipboard.writeText(headline);
    setCopiedHeadline(headline);
    setTimeout(() => {
      setCopiedHeadline(null);
    }, 2000);
  };

  // Draft a post using this headline
  const handleDraftPost = (headline: string, category: string, image: string, keywords: string[]) => {
    navigate('/dashboard/create/article', { 
      state: { 
        title: headline, 
        category: category, 
        image: image,
        keywords: keywords 
      } 
    });
  };

  // AI Headline & Idea Generation simulation
  const handleBrainstormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!brainstormInput.trim()) return;

    setIsGenerating(true);
    setGeneratedHeadlines([]);
    
    const steps = [
      'Analyzing current trending angles in Beirut...',
      'Mapping historical search velocity of keyword...',
      'Drafting click-worthy headlines and emotional hooks...'
    ];

    let currentStep = 0;
    setGenerationStep(steps[0]);

    const interval = setInterval(() => {
      currentStep++;
      if (currentStep < steps.length) {
        setGenerationStep(steps[currentStep]);
      } else {
        clearInterval(interval);
        
        // Formulate viral headlines based on inputs
        const kw = brainstormInput.trim();
        const templates = [
          `The Untold Story of ${kw}: Why Lebanon's Favorite is More Than Just a Trend`,
          `Is This the Absolute Best ${kw} in Lebanon? We Investigated the Hidden Spots`,
          `An Expat's Dream: Why We Still Nostalgically Crave ${kw} When We Go Abroad`,
          `5 Surprising Facts You Definitely Didn't Know About ${kw}`,
          `The Ultimate Guide to ${kw}: From Ancient Cultural Roots to Modern Twists`
        ];

        // Deduce appropriate category based on keywords
        let deducedCat = 'News';
        const kwLower = kw.toLowerCase();
        if (kwLower.match(/(food|mezze|cuisine|restaurant|saj|wine|grape|taste|eat|drink|knafeh|manousheh)/)) {
          deducedCat = 'Food & Drink';
        } else if (kwLower.match(/(sunset|hike|travel|resort|beach|sea|valley|mountain|batroun|byblos|cedars|trip)/)) {
          deducedCat = 'Travel';
        } else if (kwLower.match(/(expat|diaspora|arrival|airport|remittance|leaving|abroad)/)) {
          deducedCat = 'Diaspora';
        } else if (kwLower.match(/(fashion|lifestyle|teta|mother|wedding|art|design|concert)/)) {
          deducedCat = 'Lifestyle';
        }

        setGeneratedCategory(deducedCat);
        setGeneratedHeadlines(templates);
        setIsGenerating(false);
      }
    }, 800);
  };

  const handleQuickBrainstorm = (term: string) => {
    setBrainstormInput(term);
    // Submit programmatically
    setIsGenerating(true);
    setGeneratedHeadlines([]);
    
    const steps = [
      'Analyzing current trending angles in Beirut...',
      'Mapping historical search velocity of keyword...',
      'Drafting click-worthy headlines and emotional hooks...'
    ];

    let currentStep = 0;
    setGenerationStep(steps[0]);

    const interval = setInterval(() => {
      currentStep++;
      if (currentStep < steps.length) {
        setGenerationStep(steps[currentStep]);
      } else {
        clearInterval(interval);
        
        const templates = [
          `The Untold Story of ${term}: Why Lebanon's Favorite is More Than Just a Trend`,
          `Is This the Absolute Best ${term} in Lebanon? We Investigated the Hidden Spots`,
          `An Expat's Dream: Why We Still Nostalgically Crave ${term} When We Go Abroad`,
          `5 Surprising Facts You Definitely Didn't Know About ${term}`,
          `The Ultimate Guide to ${term}: From Ancient Cultural Roots to Modern Twists`
        ];

        let deducedCat = 'News';
        const kwLower = term.toLowerCase();
        if (kwLower.match(/(food|mezze|cuisine|restaurant|saj|wine|grape|taste|eat|drink|knafeh|manousheh)/)) {
          deducedCat = 'Food & Drink';
        } else if (kwLower.match(/(sunset|hike|travel|resort|beach|sea|valley|mountain|batroun|byblos|cedars|trip)/)) {
          deducedCat = 'Travel';
        } else if (kwLower.match(/(expat|diaspora|arrival|airport|remittance|leaving|abroad)/)) {
          deducedCat = 'Diaspora';
        } else if (kwLower.match(/(fashion|lifestyle|teta|mother|wedding|art|design|concert)/)) {
          deducedCat = 'Lifestyle';
        }

        setGeneratedCategory(deducedCat);
        setGeneratedHeadlines(templates);
        setIsGenerating(false);
      }
    }, 700);
  };

  // Filter recommendations based on search
  const filteredRecommendations = ideaRecommendations.filter(idea => {
    const matchesSearch = 
      idea.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      idea.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      idea.trendingKeywords.some(kw => kw.toLowerCase().includes(searchTerm.toLowerCase())) ||
      idea.headlines.some(hl => hl.toLowerCase().includes(searchTerm.toLowerCase()));

    return matchesSearch;
  });

  return (
    <div className="font-sans text-gray-900 pb-12">
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        
        {/* LEFT & CENTER 2/3: Recommended curated directory */}
        <div className="lg:col-span-2 space-y-8">
          
          {/* Search bar inside the catalog */}
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-gray-400" />
            <input 
              type="text"
              placeholder="Search through milestones, themes, and curated headlines..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-transparent rounded-xl text-xs font-medium outline-none focus:bg-white focus:border-gray-200 transition-all text-gray-900 placeholder:text-gray-400"
            />
            {searchTerm && (
              <button 
                onClick={() => setSearchTerm('')} 
                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 bg-transparent border-0 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Catalog grid cards */}
          <div className="space-y-6">
            {filteredRecommendations.map((idea) => (
              <div 
                key={idea.id} 
                className="p-6 bg-white border border-gray-100 rounded-xl flex flex-col gap-4 hover:border-gray-200 transition-colors"
              >
                {/* Content details side */}
                <div className="flex-1 flex flex-col justify-between space-y-4">
                  <div className="space-y-2">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-md bg-gray-100 text-gray-600 border border-transparent">
                        {idea.category}
                      </span>
                      {idea.dateLabel && (
                        <span className="text-[10px] font-semibold text-gray-500 bg-gray-50 border border-gray-100 px-2 py-0.5 rounded-full flex items-center gap-1">
                          <Calendar className="w-3 h-3 text-primary" />
                          {idea.dateLabel}
                        </span>
                      )}
                      
                      <span className="text-[10px] font-semibold text-orange-600 bg-orange-50/50 border border-orange-100/30 px-2 py-0.5 rounded-full flex items-center gap-1 ml-auto">
                        <Flame className="w-3 h-3 text-orange-500" />
                        {idea.viralityScore}% Engagement Potential
                      </span>
                    </div>

                    <h3 className="text-base font-semibold text-gray-900">{idea.title}</h3>
                    <p className="text-xs text-gray-500 leading-relaxed">{idea.description}</p>
                  </div>

                  {/* Curated Headlines with instant Draft functionality */}
                  <div className="space-y-2.5 pt-2 border-t border-gray-100">
                    <span className="text-[10px] font-semibold text-gray-400 block tracking-wide">
                      CURATED POTENTIAL HEADLINES
                    </span>
                    
                    <div className="space-y-1.5">
                      {idea.headlines.map((hl, i) => (
                        <div 
                          key={i} 
                          className="group/headline flex items-center justify-between p-3 bg-gray-50/30 hover:bg-gray-50 rounded-xl border border-transparent hover:border-gray-100 transition-colors gap-3"
                        >
                          <span className="text-xs font-semibold text-gray-800 leading-snug">{hl}</span>
                          
                          <div className="flex items-center gap-1 shrink-0">
                            {/* Copy Headline */}
                            <button
                               type="button"
                              onClick={() => handleCopy(hl)}
                              className="p-2 text-gray-400 hover:text-gray-900 bg-white hover:bg-gray-50 rounded-lg transition-all cursor-pointer border border-transparent hover:border-gray-100"
                              title="Copy headline"
                            >
                              {copiedHeadline === hl ? (
                                <Check className="w-3.5 h-3.5 text-green-600" />
                              ) : (
                                <Copy className="w-3.5 h-3.5" />
                              )}
                            </button>

                            {/* Draft Headline */}
                            <button
                              type="button"
                              onClick={() => handleDraftPost(hl, idea.category, idea.image, idea.trendingKeywords)}
                              className="px-3 py-1.5 text-[11px] font-bold bg-gray-900 text-white rounded-lg hover:bg-primary transition-all flex items-center gap-1 cursor-pointer border-0"
                              title="Draft with this headline"
                            >
                              <span>Draft</span>
                              <ArrowRight className="w-3 h-3 group-hover/headline:translate-x-0.5 transition-transform" />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                </div>
              </div>
            ))}

            {filteredRecommendations.length === 0 && (
              <div className="p-12 text-center bg-white border border-gray-100 rounded-xl">
                <Lightbulb className="w-8 h-8 text-gray-300 mx-auto mb-3" />
                <h4 className="text-xs font-semibold text-gray-800">No content ideas match your filters</h4>
                <p className="text-[11px] text-gray-400 mt-1 max-w-sm mx-auto">
                  Try adjusting your search criteria, category filters, or switching back to "All" types to find editorial angles.
                </p>
              </div>
            )}
          </div>

        </div>

        {/* RIGHT 1/3: AI Real-Time Brainstormer / Generator Panel (Flat style) */}
        <div className="lg:col-span-1">
          <div className="p-6 bg-white border border-gray-100 rounded-xl sticky top-28 space-y-6">
            
            <div className="space-y-1.5">
              <div className="flex items-center gap-2">
                <Lightbulb className="w-4 h-4 text-primary" />
                <h3 className="text-sm font-semibold text-gray-900">Viral Headline Brainstormer</h3>
              </div>
              <p className="text-xs text-gray-500 leading-relaxed">
                Enter any Lebanese milestone, neighborhood, dish, or theme to dynamically formulate high-clickthrough headlines.
              </p>
            </div>

            {/* Simulated generation input */}
            <form onSubmit={handleBrainstormSubmit} className="space-y-3">
              <div className="space-y-1">
                <label className="text-[11px] font-semibold text-gray-400">Target Concept or Keyword</label>
                <input 
                  type="text"
                  required
                  placeholder="e.g. Faraya Skiing, Knafeh, Batroun, Expats"
                  value={brainstormInput}
                  onChange={(e) => setBrainstormInput(e.target.value)}
                  className="w-full px-4 py-3 bg-gray-50 border border-transparent rounded-xl text-xs font-medium outline-none focus:bg-white focus:border-gray-150 transition-all text-gray-900"
                  disabled={isGenerating}
                />
              </div>

              <button
                type="submit"
                disabled={isGenerating || !brainstormInput.trim()}
                className="w-full bg-[#FF0000] hover:bg-red-700 disabled:bg-gray-200 text-white py-3 rounded-xl text-xs font-semibold transition-colors flex items-center justify-center gap-2 cursor-pointer border-0"
              >
                {isGenerating && <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />}
                <span>{isGenerating ? 'Brainstorming...' : 'Generate viral headlines'}</span>
              </button>
            </form>

            {/* Easy Click Pre-sets */}
            <div className="space-y-2.5">
              <span className="text-[10px] font-semibold text-gray-400 block tracking-wider">
                TRY QUICK KEYWORDS
              </span>
              <div className="flex flex-wrap gap-1.5">
                {presetBrainstormSuggestions.map((term) => (
                  <button
                    key={term}
                    type="button"
                    onClick={() => handleQuickBrainstorm(term)}
                    disabled={isGenerating}
                    className="px-2.5 py-1.5 bg-gray-50 hover:bg-red-50 text-[10px] font-semibold text-gray-600 hover:text-primary rounded-lg border border-transparent hover:border-red-100 transition-all cursor-pointer"
                  >
                    {term}
                  </button>
                ))}
              </div>
            </div>

            {/* Generated Outputs Area with clean flat design */}
            {isGenerating && (
              <div className="p-6 bg-gray-50 rounded-xl border border-gray-100 space-y-3 flex flex-col items-center justify-center text-center">
                <div className="w-4 h-4 rounded-full border-2 border-primary border-t-transparent animate-spin" />
                <span className="text-xs font-semibold text-gray-700 animate-pulse">{generationStep}</span>
              </div>
            )}

            {!isGenerating && generatedHeadlines.length > 0 && (
              <div className="space-y-4 animate-in fade-in slide-in-from-bottom-2 duration-300">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-semibold text-gray-400 tracking-wider">
                    DRAFT BRAINSTORMS
                  </span>
                  <span className="text-[10px] font-semibold text-primary bg-red-50 border border-red-100/30 px-2 py-0.5 rounded-full">
                    {generatedCategory}
                  </span>
                </div>

                <div className="space-y-2">
                  {generatedHeadlines.map((hl, idx) => (
                    <div 
                      key={idx}
                      className="p-3 bg-red-50/20 border border-red-100/20 hover:border-[#FF0000]/10 rounded-xl flex flex-col justify-between gap-3 group/item transition-all"
                    >
                      <span className="text-xs font-medium text-gray-800 leading-snug">{hl}</span>
                      
                      <div className="flex items-center gap-1 justify-end pt-1">
                        <button
                          type="button"
                          onClick={() => handleCopy(hl)}
                          className="p-1.5 text-gray-400 hover:text-gray-900 bg-white hover:bg-gray-50 border border-gray-100 rounded-lg transition-all cursor-pointer"
                          title="Copy"
                        >
                          {copiedHeadline === hl ? (
                            <Check className="w-3.5 h-3.5 text-green-600" />
                          ) : (
                            <Copy className="w-3.5 h-3.5" />
                          )}
                        </button>
                        
                        <button
                          type="button"
                          onClick={() => handleDraftPost(
                            hl, 
                            generatedCategory, 
                            'https://images.unsplash.com/photo-1545569341-9eb8b30979d9?auto=format&fit=crop&w=600&h=900&q=80',
                            [brainstormInput, 'Lebanese Culture', 'Trending']
                          )}
                          className="px-2.5 py-1.5 bg-gray-900 text-white rounded-lg text-[10px] font-bold hover:bg-primary transition-all flex items-center gap-1 border-0 cursor-pointer"
                        >
                          <span>Draft</span>
                          <ArrowRight className="w-2.5 h-2.5" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

          </div>
        </div>

      </div>

    </div>
  );
}

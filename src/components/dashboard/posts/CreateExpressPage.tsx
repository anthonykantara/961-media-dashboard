import React, { useState, useRef, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { usePostContext } from './PostContext';
import { useTeamContext } from '../team/TeamContext';
import UnsavedChangesModal from '../../common/UnsavedChangesModal';
import useUnsavedChangesProtection from '../../../hooks/useUnsavedChangesProtection';
import { 
  Zap, 
  Sparkles, 
  ArrowRight, 
  ArrowLeft,
  Upload, 
  Image as ImageIcon, 
  Check, 
  CheckCircle2, 
  X, 
  HelpCircle, 
  Share2, 
  Instagram, 
  Bold, 
  Italic, 
  List, 
  Quote, 
  Link as LinkIcon, 
  Smile,
  Heading2,
  Globe,
  User,
  Search,
  Languages
} from 'lucide-react';

interface HeadlineOption {
  id: string;
  text: string;
  tag: 'Listicle' | 'Clickbait/Hook' | 'SEO-Optimized' | 'Short' | 'Curiosity Gap';
  tagColor: string;
}

interface SlideData {
  id: number;
  text: string;
  customImage: string | null;
}

const CATEGORIES = [
  'Food & Drink',
  'Travel',
  'Things To Do',
  'Lifestyle',
  'News',
  'Diaspora'
];

const AVAILABLE_LANGUAGES = [
  { code: 'en', name: 'English', nativeName: 'English', short: 'EN', flag: '🇬🇧', dir: 'ltr' },
  { code: 'ar', name: 'Arabic', nativeName: 'العربية', short: 'AR', flag: '🇱🇧', dir: 'rtl' },
  { code: 'fr', name: 'French', nativeName: 'Français', short: 'FR', flag: '🇫🇷', dir: 'ltr' },
  { code: 'sk', name: 'Slovak', nativeName: 'Slovenčina', short: 'SK', flag: '🇸🇰', dir: 'ltr' }
];

const STATUS_OPTIONS: Array<'Published' | 'Draft' | 'Scheduled' | 'Review'> = [
  'Draft',
  'Review',
  'Scheduled',
  'Published'
];

const PRESET_IMAGES = [
  { url: 'https://images.unsplash.com/photo-1545569341-9eb8b30979d9?auto=format&fit=crop&w=1080&h=1350&q=80', title: 'Beirut Gemmayzeh Street' },
  { url: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=1080&h=1350&q=80', title: 'Modern Beirut Restaurant' },
  { url: 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?auto=format&fit=crop&w=1080&h=1350&q=80', title: 'Batroun Coastline' },
  { url: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1080&h=1350&q=80', title: 'Mediterranean Sunset' },
  { url: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?auto=format&fit=crop&w=1080&h=1350&q=80', title: 'Cedars Nature Trail' },
  { url: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=1080&h=1350&q=80', title: 'Lebanese Mezze Spread' }
];

export default function CreateExpressPage() {
  const navigate = useNavigate();
  const { addPost } = usePostContext();
  const { team } = useTeamContext();

  // Step 1: Initial Setup Modal State (Accepts raw text / dropped ideas)
  const [isSetupModalOpen, setIsSetupModalOpen] = useState(true);
  const [rawInputText, setRawInputText] = useState(
    `Top 7 Secret Rooftop Bars in Beirut for Sunset Drinks.\n- Unobstructed sunset views over the Mediterranean\n- Signature botanical cocktails with local herbs and orange blossom\n- Hidden balconies in Mar Mikhael and Gemmayzeh\n- Exclusive Friday sunset reservations`
  );
  const [category, setCategory] = useState('Food & Drink');
  const [isGeneratingHeadlines, setIsGeneratingHeadlines] = useState(false);
  const [headlineOptions, setHeadlineOptions] = useState<HeadlineOption[]>([]);
  const [selectedHeadlineId, setSelectedHeadlineId] = useState<string | null>(null);

  // Metadata Settings (Author & Language components from Article Creator)
  const [selectedAuthors, setSelectedAuthors] = useState<string[]>(['Anthony Rahayel']);
  const [authorSearch, setAuthorSearch] = useState('');
  const [language, setLanguage] = useState('en');
  const [isLanguageModalOpen, setIsLanguageModalOpen] = useState(false);
  const [status, setStatus] = useState<'Published' | 'Draft' | 'Scheduled' | 'Review'>('Published');

  // Step 2: Main Workspace State
  const [headline, setHeadline] = useState('7 [Secret Rooftops in Beirut] That Locals Keep to Themselves');
  const [activeSocialTab, setActiveSocialTab] = useState<'summary' | 'instagram'>('summary');
  const [socialSummary, setSocialSummary] = useState('');
  const [instagramCaption, setInstagramCaption] = useState('');
  
  // Carousel Slide Snippets (4 slides) - First slide has same text as headline
  const [slides, setSlides] = useState<SlideData[]>([
    { id: 1, text: '7 [Secret Rooftops in Beirut] That Locals Keep to Themselves', customImage: null },
    { id: 2, text: 'Order the signature [Pomegranate Gin Fizz] while soaking in sunset views.', customImage: null },
    { id: 3, text: 'Secret terrace access hidden behind [Historic Heritage Buildings] in Mar Mikhael.', customImage: null },
    { id: 4, text: 'Save this guide and tag your [Weekend Squad] in the comments below!', customImage: null }
  ]);

  // Media state
  const [mainCoverImage, setMainCoverImage] = useState<string | null>(PRESET_IMAGES[0].url);
  const [isMediaPickerOpen, setIsMediaPickerOpen] = useState(false);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  // Rich ContentEditable Editor Ref
  const editorRef = useRef<HTMLDivElement | null>(null);

  // Active Preview & Status State
  const [previewSlideId, setPreviewSlideId] = useState<number>(1);
  const [isPublishing, setIsPublishing] = useState(false);
  const [isPublishedModalOpen, setIsPublishedModalOpen] = useState(false);
  const [publishedPostId, setPublishedPostId] = useState<string | null>(null);

  const [initialExpressState, setInitialExpressState] = useState<any>(null);
  const isSavedRef = useRef(false);

  useEffect(() => {
    if (!initialExpressState) {
      setInitialExpressState({
        rawInputText,
        category,
        selectedAuthors,
        language,
        status,
        headline,
        socialSummary,
        instagramCaption,
        slides,
        mainCoverImage,
      });
    }
  }, []);

  const checkIsDirty = React.useCallback(() => {
    if (isSavedRef.current || !initialExpressState) return false;
    const currentEditorBody = editorRef.current ? editorRef.current.innerHTML : '';
    const current = {
      rawInputText,
      category,
      selectedAuthors,
      language,
      status,
      headline,
      socialSummary,
      instagramCaption,
      slides,
      mainCoverImage,
      editorBody: currentEditorBody,
    };
    return JSON.stringify(current) !== JSON.stringify(initialExpressState);
  }, [
    rawInputText,
    category,
    selectedAuthors,
    language,
    status,
    headline,
    socialSummary,
    instagramCaption,
    slides,
    mainCoverImage,
    initialExpressState,
  ]);

  const isDirty = checkIsDirty();

  const { showModal, handleConfirm, handleCancel } = useUnsavedChangesProtection(checkIsDirty);

  // Auto detect category from raw text
  const detectCategoryFromText = (text: string): string => {
    const lower = text.toLowerCase();
    if (lower.includes('food') || lower.includes('drink') || lower.includes('restaurant') || lower.includes('cocktail') || lower.includes('bar') || lower.includes('cafe') || lower.includes('mezze') || lower.includes('rooftop') || lower.includes('eat') || lower.includes('brunch') || lower.includes('wine')) {
      return 'Food & Drink';
    }
    if (lower.includes('travel') || lower.includes('hike') || lower.includes('trip') || lower.includes('hotel') || lower.includes('resort') || lower.includes('guesthouse') || lower.includes('batroun') || lower.includes('byblos') || lower.includes('coast') || lower.includes('mountain') || lower.includes('cedar')) {
      return 'Travel';
    }
    if (lower.includes('things to do') || lower.includes('nightlife') || lower.includes('party') || lower.includes('concert') || lower.includes('event') || lower.includes('weekend') || lower.includes('activity') || lower.includes('fun') || lower.includes('club')) {
      return 'Things To Do';
    }
    if (lower.includes('news') || lower.includes('government') || lower.includes('breaking') || lower.includes('economy') || lower.includes('politics') || lower.includes('minister') || lower.includes('parliament')) {
      return 'News';
    }
    if (lower.includes('diaspora') || lower.includes('expat') || lower.includes('abroad') || lower.includes('emigrant') || lower.includes('canada') || lower.includes('france') || lower.includes('brazil') || lower.includes('community')) {
      return 'Diaspora';
    }
    return 'Lifestyle';
  };

  const generateHeadlinesFromText = (inputText: string) => {
    setIsGeneratingHeadlines(true);
    setSelectedHeadlineId(null);

    // Auto-detect category from raw input
    const detectedCategory = detectCategoryFromText(inputText);
    setCategory(detectedCategory);

    setTimeout(() => {
      const firstLine = inputText.split('\n')[0].trim().replace(/^[-*•#\d.]+\s*/, '') || 'Secret Gems in Beirut';
      const cleanSnippet = firstLine.slice(0, 45);

      const generated: HeadlineOption[] = [
        {
          id: 'h1',
          text: `7 [Secret Rooftops in ${detectedCategory === 'Food & Drink' ? 'Beirut' : 'Lebanon'}] That Locals Keep to Themselves`,
          tag: 'Listicle',
          tagColor: 'bg-purple-50 text-purple-700 border-purple-200'
        },
        {
          id: 'h2',
          text: `You Won't Believe These [Breathtaking Spots] Actually Exist in ${cleanSnippet.split(' ').slice(0, 3).join(' ')}`,
          tag: 'Clickbait/Hook',
          tagColor: 'bg-amber-50 text-amber-700 border-amber-200'
        },
        {
          id: 'h3',
          text: `The Ultimate 2026 Guide to [${cleanSnippet}]: Locations, Prices, and Tips`,
          tag: 'SEO-Optimized',
          tagColor: 'bg-blue-50 text-blue-700 border-blue-200'
        },
        {
          id: 'h4',
          text: `[${cleanSnippet}]: 5 Must-Visit Gems Right Now`,
          tag: 'Short',
          tagColor: 'bg-gray-100 text-gray-700 border-gray-200'
        },
        {
          id: 'h5',
          text: `Why Everyone in Lebanon Is Talking About [${cleanSnippet.split(' ').slice(0, 4).join(' ')}] This Summer`,
          tag: 'Curiosity Gap',
          tagColor: 'bg-emerald-50 text-emerald-700 border-emerald-200'
        }
      ];

      setHeadlineOptions(generated);
      setSelectedHeadlineId('h1');
      setIsGeneratingHeadlines(false);
    }, 450);
  };

  const handleSelectHeadlineAndGenerateWorkspace = () => {
    const selectedOption = headlineOptions.find(h => h.id === selectedHeadlineId);
    const chosenHeadline = selectedOption ? selectedOption.text : headline;
    
    setHeadline(chosenHeadline);
    
    // Set formatted Rich Text HTML directly
    const initialHtml = `
      <p style="font-size: 15px; line-height: 1.7; color: #1F2937; margin-bottom: 16px;">
        When golden hour strikes across the Mediterranean, there is no better vantage point than Beirut's vibrant rooftops. From lush bohemian terraces in Mar Mikhael to sleek cocktail sanctuaries overlooking the port, the city's open-air scene continues to reinvent itself.
      </p>
      <h3 style="font-size: 17px; font-weight: 700; color: #111827; margin-top: 20px; margin-bottom: 12px;">
        What Makes This Experience Unforgettable
      </h3>
      <ul style="list-style-type: disc; padding-left: 20px; color: #374151; font-size: 14px; line-height: 1.8; margin-bottom: 16px;">
        <li><strong>Panoramic Views:</strong> Unobstructed vistas stretching from Mount Lebanon to the coastal horizon.</li>
        <li><strong>Handcrafted Mixology:</strong> Curated botanical cocktails featuring local ingredients like wild thyme, orange blossom, and Zahle arak.</li>
        <li><strong>Authentic Atmosphere:</strong> Intimate sunset acoustics that transition into dynamic weekend DJ sets.</li>
      </ul>
      <blockquote style="border-left: 3px solid #FF0000; padding-left: 14px; margin: 18px 0; font-style: italic; color: #4B5563; font-size: 14px;">
        "There is a distinct magic to Beirut as the sun slips below the coastline—it's an energy you simply cannot replicate anywhere else."
      </blockquote>
      <h3 style="font-size: 17px; font-weight: 700; color: #111827; margin-top: 20px; margin-bottom: 12px;">
        Quick Insider Tips Before You Go
      </h3>
      <ol style="list-style-type: decimal; padding-left: 20px; color: #374151; font-size: 14px; line-height: 1.8;">
        <li><strong>Book ahead:</strong> Table reservations are essential for Friday and Saturday sunset slots.</li>
        <li><strong>Dress code:</strong> Smart casual is universally welcomed across all featured venues.</li>
        <li><strong>Best time to arrive:</strong> 6:15 PM to catch the full color spectrum of the sunset sky.</li>
      </ol>
    `;

    if (editorRef.current) {
      editorRef.current.innerHTML = initialHtml;
    }

    setSocialSummary(
`Looking for your next sunset spot? 🌅 We've rounded up the finest secret rooftop bars across Beirut that you need to experience this season.

Read the full guide on the961.com: https://the961.com/p/beirut-secret-rooftops`
    );

    setInstagramCaption(
`Sunset drinks just got upgraded. ✨🍹

We curated the top secret rooftop spots in Beirut with unbeatable views, crafted cocktails, and effortless vibes. Which one are you trying first?

📍 Tag your weekend partner in crime
🔖 Save this post for your next night out

#The961 #Beirut #Lebanon #BeirutNightlife #LebaneseFood #SunsetLovers #BeirutRooftops #VisitLebanon`
    );

    // Slide 1 has the exact same text as the chosen headline
    setSlides([
      { id: 1, text: chosenHeadline, customImage: null },
      { id: 2, text: 'Sip on handcrafted [Botanical Cocktails] as the sun dips below the Mediterranean horizon.', customImage: null },
      { id: 3, text: 'Secret terrace access hidden behind [Historic Heritage Buildings] in Mar Mikhael.', customImage: null },
      { id: 4, text: 'Save this post & tag your [Sunset Squad] in the comments below!', customImage: null }
    ]);

    if (!mainCoverImage) {
      setMainCoverImage(PRESET_IMAGES[0].url);
    }

    setIsSetupModalOpen(false);
  };

  // Sync editor content on initial render if already open
  useEffect(() => {
    if (editorRef.current && !editorRef.current.innerHTML) {
      editorRef.current.innerHTML = `
        <p style="font-size: 15px; line-height: 1.7; color: #1F2937; margin-bottom: 16px;">
          When golden hour strikes across the Mediterranean, there is no better vantage point than Beirut's vibrant rooftops. From lush bohemian terraces in Mar Mikhael to sleek cocktail sanctuaries overlooking the port, the city's open-air scene continues to reinvent itself.
        </p>
        <h3 style="font-size: 17px; font-weight: 700; color: #111827; margin-top: 20px; margin-bottom: 12px;">
          What Makes This Experience Unforgettable
        </h3>
        <ul style="list-style-type: disc; padding-left: 20px; color: #374151; font-size: 14px; line-height: 1.8; margin-bottom: 16px;">
          <li><strong>Panoramic Views:</strong> Unobstructed vistas stretching from Mount Lebanon to the coastal horizon.</li>
          <li><strong>Handcrafted Mixology:</strong> Curated botanical cocktails featuring local ingredients like wild thyme, orange blossom, and Zahle arak.</li>
          <li><strong>Authentic Atmosphere:</strong> Intimate sunset acoustics that transition into dynamic weekend DJ sets.</li>
        </ul>
      `;
    }
  }, [isSetupModalOpen]);

  const handleFormatCommand = (command: string, value: string | undefined = undefined) => {
    document.execCommand(command, false, value);
    if (editorRef.current) {
      editorRef.current.focus();
    }
  };

  const handleMainImageDrop = (e: React.DragEvent) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      const url = URL.createObjectURL(file);
      setMainCoverImage(url);
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const url = URL.createObjectURL(file);
      setMainCoverImage(url);
      setIsMediaPickerOpen(false);
    }
  };

  const handleHeadlineChange = (val: string) => {
    setHeadline(val);
    setSlides(prev => prev.map(s => s.id === 1 ? { ...s, text: val } : s));
  };

  const handleSlideTextChange = (slideId: number, text: string) => {
    setSlides(prev => prev.map(s => s.id === slideId ? { ...s, text } : s));
    if (slideId === 1) {
      setHeadline(text);
    }
  };

  const handleAuthorToggle = (name: string) => {
    setSelectedAuthors(prev => {
      const exists = prev.includes(name);
      if (exists) {
        return prev.length > 1 ? prev.filter(a => a !== name) : prev;
      }
      return [...prev, name];
    });
  };

  const filteredAuthors = (team || []).filter(member => 
    member.name.toLowerCase().includes(authorSearch.toLowerCase())
  );

  const handlePublish = () => {
    isSavedRef.current = true;
    setIsPublishing(true);
    setTimeout(() => {
      const newPost = addPost({
        title: headline,
        category: category,
        status: status,
        author: selectedAuthors.join(', '),
        image: mainCoverImage || PRESET_IMAGES[0].url,
        language: language
      });
      setPublishedPostId(newPost.id);
      setIsPublishing(false);
      setIsPublishedModalOpen(true);
    }, 800);
  };

  // Helper function to render text with highlighted words in red font (without background highlight)
  const renderHighlightedSnippet = (rawText: string) => {
    const parts = rawText.split(/(\[[^\]]+\])/g);
    return parts.map((part, i) => {
      if (part.startsWith('[') && part.endsWith(']')) {
        const word = part.slice(1, -1);
        return (
          <span key={i} className="text-[#FF0000] font-semibold">
            {word}
          </span>
        );
      }
      return <span key={i}>{part}</span>;
    });
  };

  return (
    <div className="min-h-screen bg-white -m-10 p-6 sm:p-10 font-sans text-gray-900">
      <input 
        type="file" 
        ref={fileInputRef} 
        onChange={handleFileUpload} 
        accept="image/*" 
        className="hidden" 
      />

      {/* Action Header Bar */}
      <header className="sticky top-0 z-30 bg-white border-b border-gray-200 -mx-6 sm:-mx-10 -mt-6 sm:-mt-10 px-6 sm:px-10 py-3.5 mb-8 flex items-center justify-between gap-4 transition-all">
        {/* Left: Clean Back Button (No outline, just the back arrow) + Section Selector */}
        <div className="flex items-center gap-3 min-w-0">
          {/* Flat Back Button with no outline */}
          <button
            type="button"
            onClick={() => navigate('/dashboard/posts')}
            className="p-2 -ml-2 rounded-xl text-gray-600 hover:text-black hover:bg-gray-100 transition-colors shrink-0 cursor-pointer border-0 bg-transparent"
            title="Back to Posts"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>

          <div className="h-4 w-px bg-gray-200" />

          {/* Section / Category Dropdown */}
          <div className="flex items-center gap-1.5 shrink-0">
            <span className="text-xs font-semibold text-gray-500 hidden sm:inline">Section:</span>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="px-2.5 py-1.5 rounded-lg bg-gray-50 border border-gray-200 hover:border-gray-300 text-gray-800 text-xs font-semibold outline-none cursor-pointer"
            >
              {CATEGORIES.map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Right: Status Dropdown & Publish Button */}
        <div className="flex items-center gap-2.5 shrink-0">
          {/* Article Status Dropdown */}
          <div className="relative flex items-center">
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value as any)}
              className="px-3 py-1.5 rounded-xl bg-gray-50 border border-gray-200 hover:border-gray-300 text-gray-800 text-xs font-semibold outline-none cursor-pointer"
            >
              {STATUS_OPTIONS.map(st => (
                <option key={st} value={st}>{st}</option>
              ))}
            </select>
          </div>

          {/* Publish Button */}
          <button
            type="button"
            onClick={handlePublish}
            disabled={isPublishing}
            className="flex items-center gap-2 px-5 py-2 rounded-xl bg-[#FF0000] hover:bg-red-700 text-white text-xs font-semibold transition-colors disabled:opacity-50 cursor-pointer shadow-none"
          >
            {isPublishing ? (
              <>
                <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                <span>Publishing...</span>
              </>
            ) : (
              <>
                <span>Publish</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </>
            )}
          </button>
        </div>
      </header>

      {/* Main Workspace Layout (Two-Column Split: 60% Left / 40% Right) */}
      <div className="max-w-[1500px] mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* ============================================================ */}
        {/* LEFT COLUMN (60% / col-span-7): TEXT EDITORS & COPYWRITING  */}
        {/* ============================================================ */}
        <div className="lg:col-span-7 space-y-6">
          
          {/* 1. Headline Field (Clean, no 'Live Highlight' instructional block) */}
          <div className="bg-white rounded-2xl border border-gray-200 p-5 space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-xs font-semibold text-gray-700">
                Headline
              </label>
              <button
                type="button"
                onClick={() => setIsSetupModalOpen(true)}
                className="text-[11px] font-medium text-[#FF0000] hover:underline flex items-center gap-1 cursor-pointer"
              >
                <Sparkles className="w-3 h-3" />
                <span>Change Angle</span>
              </button>
            </div>
            <input
              type="text"
              value={headline}
              onChange={(e) => handleHeadlineChange(e.target.value)}
              placeholder="Enter headline (e.g. 7 [Secret Rooftops in Beirut] That Locals Keep to Themselves)..."
              className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-base font-semibold text-gray-900 focus:bg-white focus:border-[#FF0000] outline-none transition-all"
            />
          </div>

          {/* 2. Article Body Editor (Clean toolbar, no header banner) */}
          <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
            {/* Direct Styling Toolbar */}
            <div className="px-4 py-2.5 border-b border-gray-100 flex items-center gap-1 text-gray-500 bg-gray-50/50">
              <button 
                type="button" 
                onClick={() => handleFormatCommand('bold')} 
                className="p-1.5 hover:bg-gray-200 rounded text-gray-700 font-bold cursor-pointer" 
                title="Bold"
              >
                <Bold className="w-3.5 h-3.5" />
              </button>
              <button 
                type="button" 
                onClick={() => handleFormatCommand('italic')} 
                className="p-1.5 hover:bg-gray-200 rounded text-gray-700 cursor-pointer" 
                title="Italic"
              >
                <Italic className="w-3.5 h-3.5" />
              </button>
              <button 
                type="button" 
                onClick={() => handleFormatCommand('formatBlock', '<h3>')} 
                className="p-1.5 hover:bg-gray-200 rounded text-gray-700 font-bold text-xs cursor-pointer" 
                title="Heading"
              >
                <Heading2 className="w-3.5 h-3.5" />
              </button>
              <button 
                type="button" 
                onClick={() => handleFormatCommand('insertUnorderedList')} 
                className="p-1.5 hover:bg-gray-200 rounded text-gray-700 cursor-pointer" 
                title="Bullet List"
              >
                <List className="w-3.5 h-3.5" />
              </button>
              <button 
                type="button" 
                onClick={() => handleFormatCommand('formatBlock', 'blockquote')} 
                className="p-1.5 hover:bg-gray-200 rounded text-gray-700 cursor-pointer" 
                title="Quote Block"
              >
                <Quote className="w-3.5 h-3.5" />
              </button>
              <button 
                type="button" 
                onClick={() => {
                  const url = prompt('Enter link URL:', 'https://the961.com');
                  if (url) handleFormatCommand('createLink', url);
                }} 
                className="p-1.5 hover:bg-gray-200 rounded text-gray-700 cursor-pointer" 
                title="Insert Link"
              >
                <LinkIcon className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Direct ContentEditable Body */}
            <div className="p-5">
              <div
                ref={editorRef}
                contentEditable
                className="min-h-[240px] outline-none text-sm text-gray-800 leading-relaxed font-sans focus:ring-0"
                style={{ minHeight: '260px' }}
              />
            </div>
          </div>

          {/* 3. Social Captions Tabs */}
          <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
            <div className="px-5 py-3 border-b border-gray-100 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Share2 className="w-4 h-4 text-gray-500" />
                <span className="text-xs font-semibold text-gray-800">Social Captions</span>
              </div>
              
              {/* Tab Selector */}
              <div className="flex items-center p-1 bg-gray-100 rounded-lg text-xs">
                <button
                  type="button"
                  onClick={() => setActiveSocialTab('summary')}
                  className={`px-3 py-1 rounded-md font-medium transition-colors cursor-pointer ${
                    activeSocialTab === 'summary' ? 'bg-white text-gray-900 font-semibold' : 'text-gray-500 hover:text-gray-900'
                  }`}
                >
                  FB / LinkedIn / WA
                </button>
                <button
                  type="button"
                  onClick={() => setActiveSocialTab('instagram')}
                  className={`px-3 py-1 rounded-md font-medium transition-colors cursor-pointer flex items-center gap-1.5 ${
                    activeSocialTab === 'instagram' ? 'bg-white text-gray-900 font-semibold' : 'text-gray-500 hover:text-gray-900'
                  }`}
                >
                  <Instagram className="w-3.5 h-3.5 text-pink-600" />
                  <span>Instagram</span>
                </button>
              </div>
            </div>

            <div className="p-5">
              {activeSocialTab === 'summary' ? (
                <div className="space-y-2">
                  <textarea
                    rows={4}
                    value={socialSummary}
                    onChange={(e) => setSocialSummary(e.target.value)}
                    placeholder="Broadcast summary for Facebook, LinkedIn, and WhatsApp..."
                    className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs text-gray-800 leading-relaxed focus:bg-white focus:border-[#FF0000] outline-none transition-all resize-none"
                  />
                </div>
              ) : (
                <div className="space-y-2">
                  <div className="flex justify-end">
                    <button
                      type="button"
                      onClick={() => setInstagramCaption(prev => prev + ' ✨ 🇱🇧 🔥')}
                      className="text-xs text-gray-600 hover:text-gray-900 flex items-center gap-1 cursor-pointer"
                    >
                      <Smile className="w-3 h-3" />
                      <span>Add Emojis</span>
                    </button>
                  </div>
                  <textarea
                    rows={5}
                    value={instagramCaption}
                    onChange={(e) => setInstagramCaption(e.target.value)}
                    placeholder="Instagram caption formatted with hook, body, and hashtag block..."
                    className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs text-gray-800 leading-relaxed focus:bg-white focus:border-[#FF0000] outline-none transition-all resize-none"
                  />
                </div>
              )}
            </div>
          </div>

          {/* 4. Carousel Slides Text */}
          <div className="bg-white rounded-2xl border border-gray-200 p-5 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Instagram className="w-4 h-4 text-pink-600" />
                <span className="text-xs font-semibold text-gray-800">Carousel Slides</span>
              </div>
            </div>

            {/* Helper Tooltip Banner */}
            <div className="p-3 bg-red-50/60 border border-red-100 rounded-xl flex items-start gap-2 text-xs text-gray-700">
              <HelpCircle className="w-4 h-4 text-[#FF0000] shrink-0 mt-0.5" />
              <span>
                Wrap words in brackets like <strong className="text-[#FF0000] font-semibold">[Red]</strong> to color them red on the slide image. Slide 1 matches the headline.
              </span>
            </div>

            {/* 4 Stacked Textboxes for Slides with large multiline input */}
            <div className="space-y-3">
              {slides.map((slide) => (
                <div 
                  key={slide.id} 
                  onClick={() => setPreviewSlideId(slide.id)}
                  className={`p-3.5 rounded-xl border transition-all cursor-pointer ${
                    previewSlideId === slide.id 
                      ? 'border-gray-900 bg-gray-50/40 ring-1 ring-gray-900/10' 
                      : 'border-gray-200 bg-white hover:border-gray-300'
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <span className="w-6 h-6 rounded-full bg-gray-900 text-white text-xs font-bold flex items-center justify-center shrink-0 mt-1">
                      {slide.id}
                    </span>
                    <div className="flex-1 space-y-2">
                      <textarea
                        rows={2}
                        value={slide.text}
                        onChange={(e) => handleSlideTextChange(slide.id, e.target.value)}
                        placeholder={`Enter text content for slide ${slide.id}...`}
                        className="w-full px-3.5 py-2.5 bg-white border border-gray-200 rounded-lg text-xs text-gray-900 focus:border-[#FF0000] outline-none transition-all resize-none leading-relaxed"
                      />

                      {/* Visual Highlight Preview */}
                      <div className="text-[11px] text-gray-600 flex items-center gap-1.5 flex-wrap">
                        <span className="text-gray-400">Preview:</span>
                        <span className="bg-gray-100 px-2.5 py-1 rounded text-gray-800">
                          {renderHighlightedSnippet(slide.text)}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ============================================================ */}
        {/* RIGHT COLUMN (40% / col-span-5): AUTHORS, LANGUAGE & MEDIA  */}
        {/* ============================================================ */}
        <div className="lg:col-span-5 space-y-6">

          {/* 1. Authors & Language Selector Component (from Article Creator) */}
          <div className="bg-white rounded-2xl border border-gray-200 p-5 space-y-5">
            
            {/* Authors List: Search & Select, Current User Defaulted */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <label className="text-xs font-semibold text-gray-700 flex items-center gap-1.5">
                  <User className="w-4 h-4 text-gray-500" />
                  <span>Authors</span>
                </label>
                <span className="text-[11px] text-gray-400">
                  {selectedAuthors.length} selected
                </span>
              </div>
              
              {/* Inline Search */}
              <div className="relative">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400" />
                <input 
                  type="text"
                  placeholder="Search and select authors..."
                  value={authorSearch}
                  onChange={(e) => setAuthorSearch(e.target.value)}
                  className="w-full pl-9 pr-3.5 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs font-medium outline-none focus:bg-white focus:border-[#FF0000] transition-all"
                />
              </div>

              {/* Scrollable list of team members */}
              <div className="space-y-1 max-h-[140px] overflow-y-auto pr-1">
                {filteredAuthors.map((member) => {
                  const isSelected = selectedAuthors.includes(member.name);
                  return (
                    <div 
                      key={member.id}
                      onClick={() => handleAuthorToggle(member.name)}
                      className={`flex items-center justify-between p-2 rounded-xl cursor-pointer transition-all border ${
                        isSelected 
                          ? 'bg-red-50/40 border-red-100' 
                          : 'border-transparent hover:bg-gray-50'
                      }`}
                    >
                      <div className="flex items-center gap-2.5">
                        <img 
                          src={member.avatar} 
                          alt={member.name} 
                          className="w-6 h-6 rounded-full object-cover shrink-0"
                          referrerPolicy="no-referrer"
                        />
                        <span className="text-xs font-semibold text-gray-800">
                          {member.name}
                        </span>
                      </div>
                      
                      {/* Clean flat check indicator */}
                      <div className="w-5 h-5 flex items-center justify-center shrink-0">
                        {isSelected && <Check className="w-4 h-4 text-[#FF0000]" />}
                      </div>
                    </div>
                  );
                })}
                {filteredAuthors.length === 0 && (
                  <p className="text-xs text-gray-400 italic text-center py-2">No contributors found</p>
                )}
              </div>
            </div>

            <div className="border-t border-gray-100" />

            {/* Language & Translations Manager Component */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <label className="text-xs font-semibold text-gray-700 flex items-center gap-1.5">
                  <Globe className="w-4 h-4 text-gray-500" />
                  <span>Language & Edition</span>
                </label>
                <button
                  type="button"
                  onClick={() => setIsLanguageModalOpen(true)}
                  className="text-[11px] font-medium text-[#FF0000] hover:underline flex items-center gap-1 cursor-pointer"
                >
                  <Languages className="w-3.5 h-3.5" />
                  <span>Manage Languages</span>
                </button>
              </div>

              {/* Quick Language Switcher Pills */}
              <div className="grid grid-cols-4 gap-2">
                {AVAILABLE_LANGUAGES.map((lang) => {
                  const isSelected = language === lang.code;
                  return (
                    <button
                      key={lang.code}
                      type="button"
                      onClick={() => setLanguage(lang.code)}
                      className={`px-2.5 py-1.5 rounded-xl text-xs font-semibold transition-all flex items-center justify-center gap-1.5 cursor-pointer border ${
                        isSelected
                          ? 'bg-[#FF0000] text-white border-[#FF0000]'
                          : 'bg-gray-50 text-gray-700 border-gray-200 hover:bg-gray-100 hover:border-gray-300'
                      }`}
                    >
                      <span>{lang.flag}</span>
                      <span>{lang.short}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
          
          {/* 2. Main Cover Image Card (Matches Article Card Style with bottom black gradient) */}
          <div className="bg-white rounded-2xl border border-gray-200 p-5 space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-xs font-semibold text-gray-800 flex items-center gap-1.5">
                <ImageIcon className="w-4 h-4 text-gray-500" />
                <span>Main Cover Image</span>
              </label>
              {mainCoverImage && (
                <button
                  type="button"
                  onClick={() => setIsMediaPickerOpen(true)}
                  className="text-xs font-semibold text-[#FF0000] hover:underline cursor-pointer"
                >
                  Replace Image
                </button>
              )}
            </div>

            {mainCoverImage ? (
              <div className="relative rounded-2xl overflow-hidden border border-gray-200 aspect-[4/5] bg-gray-900 select-none">
                <img 
                  src={mainCoverImage} 
                  alt="Main Cover" 
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />

                {/* Bottom Black Background with Smooth Gradient Transition & Pure Headline with Red Font Highlights */}
                <div className="absolute inset-x-0 bottom-0 h-[40%] bg-gradient-to-t from-black via-black/85 to-transparent flex flex-col justify-end p-6 z-10">
                  <p className="text-lg sm:text-xl font-bold text-white leading-snug tracking-tight">
                    {renderHighlightedSnippet(headline)}
                  </p>
                </div>
              </div>
            ) : (
              <div
                onDragOver={(e) => e.preventDefault()}
                onDrop={handleMainImageDrop}
                onClick={() => setIsMediaPickerOpen(true)}
                className="border-2 border-dashed border-gray-300 hover:border-[#FF0000] rounded-2xl p-8 text-center bg-gray-50/50 hover:bg-red-50/20 transition-all cursor-pointer space-y-3"
              >
                <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center mx-auto border border-gray-200 text-gray-400">
                  <Upload className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-xs font-semibold text-gray-800">
                    Main Cover Image
                  </h4>
                  <p className="text-[11px] text-gray-400 mt-1">
                    Drag and drop your photo here, or click to browse library
                  </p>
                </div>
                <div className="pt-1">
                  <span className="inline-block px-3 py-1 rounded-lg bg-gray-200 text-gray-700 text-[10px] font-semibold">
                    Select File or Preset
                  </span>
                </div>
              </div>
            )}
          </div>

          {/* 3. Live 961 Instagram Carousel Slide Preview */}
          <div className="bg-white rounded-2xl border border-gray-200 p-5 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Instagram className="w-4 h-4 text-pink-600" />
                <span className="text-xs font-semibold text-gray-800">Instagram Carousel Preview</span>
              </div>
              <div className="flex gap-1.5">
                {[1, 2, 3, 4].map(id => (
                  <button
                    key={id}
                    type="button"
                    onClick={() => setPreviewSlideId(id)}
                    className={`w-6 h-6 rounded-lg text-xs font-bold cursor-pointer transition-colors ${
                      previewSlideId === id ? 'bg-gray-900 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }`}
                  >
                    {id}
                  </button>
                ))}
              </div>
            </div>

            {/* The 961 Instagram Slide Card */}
            <div className="relative rounded-2xl overflow-hidden aspect-[4/5] bg-black border border-gray-800 text-white flex flex-col justify-between p-6 select-none shadow-md">
              {/* Background Image: Vibrant on slide 1 to match cover style */}
              <img 
                src={
                  slides.find(s => s.id === previewSlideId)?.customImage || 
                  mainCoverImage || 
                  PRESET_IMAGES[0].url
                } 
                alt="Slide Preview" 
                className={`absolute inset-0 w-full h-full object-cover transition-all ${
                  previewSlideId === 1 ? 'opacity-100' : 'opacity-70'
                }`}
                referrerPolicy="no-referrer"
              />
              
              {/* Slide 1 uses bottom black gradient styling matching cover image, other slides have full-height readability overlay */}
              {previewSlideId === 1 ? (
                <div className="absolute inset-x-0 bottom-0 h-[45%] bg-gradient-to-t from-black via-black/90 to-transparent" />
              ) : (
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-black/70" />
              )}

              {/* Top Bar: 961 Brand (no category) + Progress */}
              <div className="relative z-10 flex items-center justify-between">
                <div className="flex items-center gap-1.5">
                  <span className="text-base font-extrabold text-[#FF0000] tracking-tighter">961</span>
                </div>
                <div className="px-2.5 py-0.5 rounded-full bg-white/20 backdrop-blur-md text-[10px] font-bold">
                  {previewSlideId} / 4
                </div>
              </div>

              {/* Slide Typography - Slide 1 displays the same headline text */}
              {previewSlideId === 1 ? (
                <div className="relative z-10 mt-auto mb-2 space-y-1">
                  <div className="text-lg sm:text-xl font-bold leading-snug tracking-tight text-white">
                    {renderHighlightedSnippet(slides[0]?.text || headline)}
                  </div>
                </div>
              ) : (
                <div className="relative z-10 space-y-3 my-auto">
                  <div className="text-xl sm:text-2xl font-bold leading-snug tracking-tight text-white">
                    {renderHighlightedSnippet(slides.find(s => s.id === previewSlideId)?.text || '')}
                  </div>
                </div>
              )}

              {/* Footer */}
              <div className="relative z-10 flex items-center justify-between text-[10px] text-gray-400 pt-3 border-t border-white/10">
                <span>the961.com</span>
                <div className="flex items-center justify-center w-6 h-6 rounded-full bg-[#FF0000] text-white">
                  <ArrowRight className="w-3.5 h-3.5 stroke-[2.5]" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ============================================================ */}
      {/* LANGUAGE & TRANSLATIONS MANAGER MODAL                        */}
      {/* ============================================================ */}
      {isLanguageModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-7 space-y-5 border border-gray-100 shadow-xl animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between pb-3 border-b border-gray-100">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-red-50 text-[#FF0000] flex items-center justify-center">
                  <Globe className="w-4.5 h-4.5" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-gray-900">Language & Translations</h3>
                  <p className="text-[11px] text-gray-500">Manage article edition language and multilingual translations</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsLanguageModalOpen(false)}
                className="p-1.5 hover:bg-gray-100 rounded-xl text-gray-400 hover:text-gray-700 transition-colors cursor-pointer border-0 bg-transparent"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Language List */}
            <div className="space-y-2.5 max-h-[320px] overflow-y-auto pr-1">
              {AVAILABLE_LANGUAGES.map((lang) => {
                const isSelected = language === lang.code;
                return (
                  <div
                    key={lang.code}
                    onClick={() => {
                      setLanguage(lang.code);
                    }}
                    className={`p-3.5 rounded-2xl border transition-all cursor-pointer flex items-center justify-between gap-3 ${
                      isSelected 
                        ? 'border-[#FF0000] bg-red-50/30 ring-1 ring-[#FF0000]' 
                        : 'border-gray-200 bg-white hover:border-gray-300'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">{lang.flag}</span>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-bold text-gray-900">{lang.name}</span>
                          <span className="text-[11px] text-gray-500 font-medium">({lang.nativeName})</span>
                        </div>
                        <div className="flex items-center gap-2 text-[10px] text-gray-400 mt-0.5">
                          <span className="font-semibold uppercase tracking-wider">{lang.short}</span>
                          <span>•</span>
                          <span>Direction: {lang.dir.toUpperCase()}</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      {isSelected ? (
                        <span className="px-2.5 py-1 rounded-md text-[10px] font-bold bg-[#FF0000] text-white">
                          Primary
                        </span>
                      ) : (
                        <span className="px-2.5 py-1 rounded-md text-[10px] font-medium bg-gray-100 text-gray-600">
                          Switch
                        </span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="pt-3 border-t border-gray-100 flex items-center justify-between">
              <span className="text-xs text-gray-500">
                Active Edition: <strong className="text-gray-900">{AVAILABLE_LANGUAGES.find(l => l.code === language)?.name}</strong>
              </span>
              <button
                type="button"
                onClick={() => setIsLanguageModalOpen(false)}
                className="px-5 py-2 bg-gray-900 hover:bg-black text-white rounded-xl text-xs font-semibold transition-colors cursor-pointer border-0"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ============================================================ */}
      {/* STEP 1: INITIAL SETUP & HEADLINE SELECTOR MODAL              */}
      {/* ============================================================ */}
      {isSetupModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-2xl w-full p-6 sm:p-8 space-y-6 border border-gray-100 max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="flex items-start justify-between pb-4 border-b border-gray-100">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center shrink-0">
                  <Zap className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-gray-900">
                    Express Article Setup
                  </h3>
                  <p className="text-xs text-gray-500 mt-0.5">
                    Drop raw thoughts, trending ideas, or notes to instantly formulate high-impact headlines and generate your workspace.
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsSetupModalOpen(false)}
                className="p-1.5 hover:bg-gray-100 rounded-xl text-gray-400 hover:text-gray-700 transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Input Ideas & Text */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-xs font-semibold text-gray-700">
                  Drop Thoughts, Notes, or Raw Concept
                </label>
                <span className="text-[11px] text-gray-400">
                  Auto-categorized
                </span>
              </div>
              <textarea
                rows={4}
                value={rawInputText}
                onChange={(e) => setRawInputText(e.target.value)}
                placeholder="Paste rough notes, a trending concept, or an outline (e.g. 7 secret rooftops in Beirut with cocktails and sunset views)..."
                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-2xl text-xs text-gray-800 focus:bg-white focus:border-[#FF0000] outline-none transition-all resize-none leading-relaxed"
              />
            </div>

            {/* Auto Category Override Option */}
            <div className="flex items-center justify-between p-3.5 bg-gray-50 rounded-2xl border border-gray-200">
              <span className="text-xs font-medium text-gray-700">
                Assigned Section:
              </span>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="px-3 py-1.5 rounded-xl bg-white border border-gray-200 text-gray-800 text-xs font-semibold outline-none cursor-pointer"
              >
                {CATEGORIES.map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>

            {/* Primary CTA: Generate 5 Headline Ideas */}
            <button
              type="button"
              onClick={() => generateHeadlinesFromText(rawInputText)}
              disabled={isGeneratingHeadlines || !rawInputText.trim()}
              className="w-full py-3 px-4 rounded-2xl bg-gray-900 hover:bg-black text-white text-xs font-semibold transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 shadow-none"
            >
              {isGeneratingHeadlines ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>Formulating Angles...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4 text-amber-300" />
                  <span>Generate 5 Headline Ideas</span>
                </>
              )}
            </button>

            {/* Headline Selection Cards (Appears only post-click) */}
            {headlineOptions.length > 0 && (
              <div className="space-y-3 pt-2 animate-in fade-in duration-200">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-gray-800">
                    Select Your Angle:
                  </span>
                </div>

                <div className="space-y-2 max-h-[220px] overflow-y-auto pr-1">
                  {headlineOptions.map((opt) => {
                    const isSelected = selectedHeadlineId === opt.id;
                    return (
                      <div
                        key={opt.id}
                        onClick={() => setSelectedHeadlineId(opt.id)}
                        className={`p-3.5 rounded-2xl border transition-all cursor-pointer flex items-start gap-3 ${
                          isSelected 
                            ? 'border-[#FF0000] bg-red-50/20 ring-1 ring-[#FF0000]' 
                            : 'border-gray-200 bg-white hover:border-gray-300'
                        }`}
                      >
                        {/* Radio indicator */}
                        <div className="mt-0.5 shrink-0">
                          <div className={`w-4 h-4 rounded-full border flex items-center justify-center ${
                            isSelected ? 'border-[#FF0000] bg-[#FF0000]' : 'border-gray-300 bg-white'
                          }`}>
                            {isSelected && <div className="w-1.5 h-1.5 rounded-full bg-white" />}
                          </div>
                        </div>

                        <div className="flex-1 space-y-1.5">
                          <p className="text-xs font-semibold text-gray-900 leading-snug">
                            {renderHighlightedSnippet(opt.text)}
                          </p>
                          <span className={`inline-block px-2 py-0.5 rounded-md text-[10px] font-semibold border ${opt.tagColor}`}>
                            {opt.tag}
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Modal Bottom CTA */}
            <div className="pt-3 border-t border-gray-100 flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={() => setIsSetupModalOpen(false)}
                className="px-4 py-2 text-xs font-semibold text-gray-600 hover:text-gray-900 cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleSelectHeadlineAndGenerateWorkspace}
                disabled={!selectedHeadlineId}
                className="px-6 py-2.5 rounded-xl bg-[#FF0000] hover:bg-red-700 text-white text-xs font-semibold transition-all disabled:opacity-40 flex items-center gap-2 cursor-pointer shadow-none"
              >
                <span>Next</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ============================================================ */}
      {/* MEDIA PICKER MODAL (Presets & Upload)                         */}
      {/* ============================================================ */}
      {isMediaPickerOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-2xl w-full p-6 sm:p-8 space-y-6 border border-gray-100 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-gray-100">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-red-50 text-[#FF0000] flex items-center justify-center">
                  <ImageIcon className="w-4 h-4" />
                </div>
                <h3 className="text-sm font-bold text-gray-900">Choose Cover Photo</h3>
              </div>
              <button
                type="button"
                onClick={() => setIsMediaPickerOpen(false)}
                className="p-1.5 hover:bg-gray-100 rounded-xl text-gray-400 hover:text-gray-700 transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Upload Option */}
            <div
              onClick={() => fileInputRef.current?.click()}
              className="border-2 border-dashed border-gray-200 hover:border-[#FF0000] rounded-2xl p-6 text-center bg-gray-50/50 hover:bg-red-50/20 transition-all cursor-pointer space-y-2"
            >
              <Upload className="w-6 h-6 text-gray-400 mx-auto" />
              <p className="text-xs font-semibold text-gray-800">Upload Image</p>
              <p className="text-[10px] text-gray-400">Click to browse PNG, JPG or WebP</p>
            </div>

            {/* Preset Library */}
            <div className="space-y-2">
              <span className="text-xs font-semibold text-gray-700">Preset Photos:</span>
              <div className="grid grid-cols-3 gap-3">
                {PRESET_IMAGES.map((img, i) => (
                  <div
                    key={i}
                    onClick={() => {
                      setMainCoverImage(img.url);
                      setIsMediaPickerOpen(false);
                    }}
                    className="group relative rounded-xl overflow-hidden aspect-[4/5] bg-gray-100 border border-gray-200 hover:border-[#FF0000] cursor-pointer transition-all"
                  >
                    <img 
                      src={img.url} 
                      alt={img.title} 
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                      referrerPolicy="no-referrer"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent flex items-end p-2">
                      <span className="text-[10px] font-medium text-white line-clamp-1">{img.title}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="pt-2 flex justify-end">
              <button
                type="button"
                onClick={() => setIsMediaPickerOpen(false)}
                className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-800 rounded-xl text-xs font-semibold cursor-pointer"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ============================================================ */}
      {/* PUBLISH CONFIRMATION MODAL                                    */}
      {/* ============================================================ */}
      {isPublishedModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-8 text-center space-y-6 border border-gray-100 shadow-2xl">
            <div className="w-16 h-16 bg-emerald-50 text-emerald-600 rounded-full flex items-center justify-center mx-auto border border-emerald-200">
              <CheckCircle2 className="w-8 h-8" />
            </div>

            <div className="space-y-2">
              <h2 className="text-xl font-bold text-gray-900">
                Post Published Successfully!
              </h2>
              <p className="text-xs text-gray-500 leading-relaxed max-w-sm mx-auto">
                Your post <strong className="text-gray-900">"{headline}"</strong> has been saved with status <span className="font-semibold text-gray-900">{status}</span>.
              </p>
            </div>

            {/* Distribution Checklist */}
            <div className="bg-gray-50 rounded-2xl p-4 text-left space-y-2.5 text-xs">
              <div className="flex items-center gap-2.5 text-gray-800">
                <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Saved under <strong>the961.com</strong> ({category})</span>
              </div>
              <div className="flex items-center gap-2.5 text-gray-800">
                <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Authors: <strong>{selectedAuthors.join(', ')}</strong> • Language: <strong>{AVAILABLE_LANGUAGES.find(l => l.code === language)?.name}</strong></span>
              </div>
              <div className="flex items-center gap-2.5 text-gray-800">
                <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Instagram carousel slides formatted with red text styling</span>
              </div>
            </div>

            <div className="flex items-center justify-center gap-3 pt-2">
              <button
                type="button"
                onClick={() => navigate('/dashboard/posts')}
                className="px-5 py-2.5 bg-gray-900 hover:bg-black text-white rounded-xl text-xs font-semibold transition-colors cursor-pointer"
              >
                View in Posts Table
              </button>
              <button
                type="button"
                onClick={() => {
                  setIsPublishedModalOpen(false);
                  setIsSetupModalOpen(true);
                }}
                className="px-5 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-800 rounded-xl text-xs font-semibold transition-colors cursor-pointer"
              >
                Create Another Express Post
              </button>
            </div>
          </div>
        </div>
      )}
      {/* Unsaved Changes Confirmation Modal */}
      <UnsavedChangesModal
        isOpen={showModal}
        onConfirm={handleConfirm}
        onCancel={handleCancel}
      />
    </div>
  );
}

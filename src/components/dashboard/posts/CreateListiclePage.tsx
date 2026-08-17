import React, { useState, useRef, useEffect } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { usePostContext } from './PostContext';
import { useTeamContext } from '../team/TeamContext';
import AdBanner from '../../AdBanner';
import SocialPreviewValidator from './SocialPreviewValidator';
import { 
  Image as ImageIcon, 
  Newspaper, 
  Compass, 
  Globe, 
  X, 
  Bold, 
  Italic, 
  Quote,
  Link as LinkIcon, 
  Search, 
  Check, 
  Upload, 
  Heart,
  Facebook,
  Twitter,
  MessageCircle,
  Plus,
  Trash2,
  MoveUp,
  MoveDown,
  GripVertical
} from 'lucide-react';

export interface ListicleItem {
  id: string;
  title: string;
  visual: string; // Image URL or 961 embed payload
  visualType?: 'image' | '961';
  visualMeta?: {
    name?: string;
    type?: string;
    location?: string;
    description?: string;
    url?: string;
    cta?: string;
    meta?: string;
  };
  text: string;
}

export default function CreateListiclePage() {
  const navigate = useNavigate();
  const { addPost } = usePostContext();
  const { team } = useTeamContext();

  const [activeTab, setActiveTab] = useState<'edit' | 'preview' | 'social'>('edit');
  
  // Media Selector Modal State for Cover
  const [isCoverModalOpen, setIsCoverModalOpen] = useState(false);
  const [coverTab, setCoverTab] = useState<'presets' | 'upload'>('presets');
  
  // Item Visual Modal State (Targeted to a specific item index or ID)
  const [activeItemVisualIndex, setActiveItemVisualIndex] = useState<number | null>(null);
  const [itemVisualTab, setItemVisualTab] = useState<'upload' | '961' | 'presets'>('upload');
  const [ecosystemSearch, setEcosystemSearch] = useState('');
  const [ecosystemCategory, setEcosystemCategory] = useState<'All' | 'Restaurant' | 'Nightlife' | 'Creators' | 'Stays'>('All');

  // Simulated AI Generating states
  const [isGeneratingKeywords, setIsGeneratingKeywords] = useState(false);
  const [isRecommendingCategories, setIsRecommendingCategories] = useState(false);
  const [authorSearch, setAuthorSearch] = useState('');

  const location = useLocation();

  useEffect(() => {
    if (location.state) {
      const { title, category, image, keywords } = location.state as {
        title?: string;
        category?: string;
        image?: string;
        keywords?: string[];
      };
      
      setFormData(prev => ({
        ...prev,
        title: title || prev.title,
        categories: category ? [category] : prev.categories,
        image: image || prev.image,
        keywords: keywords && keywords.length > 0 ? keywords : prev.keywords,
      }));
    }
  }, [location.state]);

  // Form State for Listicle
  const [formData, setFormData] = useState({
    title: '',
    intro: '',
    categories: ['Lifestyle'] as string[],
    status: 'Draft' as 'Draft' | 'Published' | 'Scheduled' | 'Review',
    image: 'https://images.unsplash.com/photo-1545569341-9eb8b30979d9?auto=format&fit=crop&w=600&h=900&q=80',
    selectedAuthors: ['Anthony Rahayel'] as string[],
    keywords: ['Beirut', 'Lebanon', 'List'] as string[],
    newKeywordInput: '',
    scheduleDate: '',
    scheduleTime: '',
    items: [
      {
        id: 'item-1',
        title: 'Em Sherif Café',
        visual: 'https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=800&h=600&q=80',
        visualType: '961' as 'image' | '961',
        visualMeta: {
          name: 'Em Sherif Café',
          type: 'Restaurant',
          location: 'Ashrafieh, Beirut',
          description: 'A landmark of Lebanese luxury gastronomy offering an elegant café concept with traditional home-style dishes and flawless hospitality.',
          url: 'https://the961.com/places/em-sherif-cafe',
          cta: 'Book Table',
          meta: 'Lebanese Café • $$$'
        },
        text: 'A landmark of Lebanese gastronomy offering authentic flavors with immaculate presentation and traditional hospitality.'
      },
      {
        id: 'item-2',
        title: 'Baron Beirut',
        visual: 'https://images.unsplash.com/photo-1514933651103-005eec06c04b?auto=format&fit=crop&w=800&h=600&q=80',
        visualType: '961' as 'image' | '961',
        visualMeta: {
          name: 'Baron',
          type: 'Restaurant',
          location: 'Mar Mikhael, Beirut',
          description: 'Acclaimed vegetable-forward and wood-fired Mediterranean dishes. Baron is repeatedly named among the best restaurants in the Middle East.',
          url: 'https://the961.com/places/baron',
          cta: 'Book Table',
          meta: 'Mediterranean • $$$$'
        },
        text: 'Ranked consistently among the best in MENA, Baron serves organic, vegetable-forward Mediterranean plates with wood-fired flare.'
      }
    ] as ListicleItem[]
  });

  const introEditorRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (activeTab === 'edit' && introEditorRef.current) {
      introEditorRef.current.innerHTML = formData.intro;
    }
  }, [activeTab]);

  const allCategories = [
    { name: 'News', icon: Newspaper, color: 'text-red-600 bg-red-50 border-red-100' },
    { name: 'Lifestyle', icon: Heart, color: 'text-purple-600 bg-purple-50 border-purple-100' },
    { name: 'Food & Drink', icon: Compass, color: 'text-amber-600 bg-amber-50 border-amber-100' },
    { name: 'Travel', icon: Compass, color: 'text-blue-600 bg-blue-50 border-blue-100' },
    { name: 'Diaspora', icon: Globe, color: 'text-emerald-600 bg-emerald-50 border-emerald-100' }
  ];

  const verticalPresets = [
    { name: 'Beirut Streets', url: 'https://images.unsplash.com/photo-1545569341-9eb8b30979d9?auto=format&fit=crop&w=600&h=900&q=80' },
    { name: 'Lebanese Mountains', url: 'https://images.unsplash.com/photo-1605810230434-7631ac76ec81?auto=format&fit=crop&w=600&h=900&q=80' },
    { name: 'Traditional Mezze', url: 'https://images.unsplash.com/photo-1541518763669-27fef04b14ea?auto=format&fit=crop&w=600&h=900&q=80' },
    { name: 'Beirut Skyline Night', url: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=600&h=900&q=80' },
    { name: 'Byblos Port Harbour', url: 'https://images.unsplash.com/photo-1578345218746-50a229b3d0f8?auto=format&fit=crop&w=600&h=900&q=80' },
    { name: 'Cedars Forest Hike', url: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=600&h=900&q=80' }
  ];

  const ECOSYSTEM_ITEMS = [
    {
      id: 'eco-1',
      name: 'Em Sherif Café',
      type: 'Restaurant',
      location: 'Ashrafieh, Beirut',
      description: 'A landmark of Lebanese luxury gastronomy offering an elegant café concept with traditional home-style dishes and flawless hospitality.',
      image: 'https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=400&h=400&q=80',
      url: 'https://the961.com/places/em-sherif-cafe',
      cta: 'Book Table',
      meta: 'Lebanese Café • $$$'
    },
    {
      id: 'eco-2',
      name: 'Baron',
      type: 'Restaurant',
      location: 'Mar Mikhael, Beirut',
      description: 'Acclaimed vegetable-forward and wood-fired Mediterranean dishes. Baron is repeatedly named among the best restaurants in the Middle East.',
      image: 'https://images.unsplash.com/photo-1514933651103-005eec06c04b?auto=format&fit=crop&w=400&h=400&q=80',
      url: 'https://the961.com/places/baron',
      cta: 'Book Table',
      meta: 'Mediterranean • $$$$'
    },
    {
      id: 'eco-3',
      name: 'Liza Beirut',
      type: 'Restaurant',
      location: 'Achrafieh, Beirut',
      description: 'Set in a stunning 19th-century palace, Liza serves light, contemporary Lebanese food in one of the world’s most beautiful restaurant interiors.',
      image: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=400&h=400&q=80',
      url: 'https://the961.com/places/liza',
      cta: 'Book Table',
      meta: 'Contemporary Lebanese • $$$$'
    },
    {
      id: 'eco-4',
      name: 'Babel Bay',
      type: 'Restaurant',
      location: 'Zaitunay Bay, Beirut',
      description: 'A premium seafood restaurant reinventing Lebanese coastal heritage dishes, situated on the lively Beirut Marina boardwalk.',
      image: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=400&h=400&q=80',
      url: 'https://the961.com/places/babel-bay',
      cta: 'Book Table',
      meta: 'Seafood • $$$'
    },
    {
      id: 'eco-5',
      name: 'B018',
      type: 'Nightlife',
      location: 'Karantina, Beirut',
      description: 'The world-famous underground shelter club designed by Bernard Khoury, renowned for its retracting roof and dark techno heritage.',
      image: 'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?auto=format&fit=crop&w=400&h=400&q=80',
      url: 'https://the961.com/places/b018',
      cta: 'Book Lounge',
      meta: 'Techno Club • 10 PM - 5 AM'
    },
    {
      id: 'eco-6',
      name: 'Iris Beirut',
      type: 'Nightlife',
      location: 'Downtown Beirut',
      description: 'An open-air rooftop lounge with stellar cityscape and sea views, famous for sunset cocktails and live acoustic music sessions.',
      image: 'https://images.unsplash.com/photo-1533777857889-4be7c70b33f7?auto=format&fit=crop&w=400&h=400&q=80',
      url: 'https://the961.com/places/iris',
      cta: 'Book Lounge',
      meta: 'Rooftop Lounge • 6 PM - 2 AM'
    }
  ];

  // Intro formatting helpers
  const applyIntroFormat = (command: string, value: string = '') => {
    document.execCommand(command, false, value);
    if (introEditorRef.current) {
      setFormData(prev => ({
        ...prev,
        intro: introEditorRef.current?.innerHTML || ''
      }));
    }
  };

  // Add Item
  const handleAddItem = () => {
    const newItem: ListicleItem = {
      id: `item-${Date.now()}`,
      title: '',
      visual: '',
      visualType: 'image',
      text: ''
    };
    setFormData(prev => ({
      ...prev,
      items: [...prev.items, newItem]
    }));
  };

  // Remove Item
  const handleRemoveItem = (index: number) => {
    if (formData.items.length <= 1) return;
    setFormData(prev => ({
      ...prev,
      items: prev.items.filter((_, i) => i !== index)
    }));
  };

  // Update Item
  const handleUpdateItem = (index: number, field: keyof ListicleItem, value: any) => {
    setFormData(prev => {
      const nextItems = [...prev.items];
      nextItems[index] = {
        ...nextItems[index],
        [field]: value
      };
      return { ...prev, items: nextItems };
    });
  };

  // Move Item up or down
  const handleMoveItem = (index: number, direction: 'up' | 'down') => {
    if (direction === 'up' && index === 0) return;
    if (direction === 'down' && index === formData.items.length - 1) return;
    
    setFormData(prev => {
      const nextItems = [...prev.items];
      const targetIndex = direction === 'up' ? index - 1 : index + 1;
      const temp = nextItems[index];
      nextItems[index] = nextItems[targetIndex];
      nextItems[targetIndex] = temp;
      return { ...prev, items: nextItems };
    });
  };

  // Item Visual Upload
  const handleItemVisualUpload = (index: number, file: File) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      handleUpdateItem(index, 'visual', reader.result as string);
      handleUpdateItem(index, 'visualType', 'image');
      setActiveItemVisualIndex(null);
    };
    reader.readAsDataURL(file);
  };

  // Item 961 Embed Selection
  const handleSelect961Item = (index: number, ecoItem: typeof ECOSYSTEM_ITEMS[0]) => {
    setFormData(prev => {
      const nextItems = [...prev.items];
      nextItems[index] = {
        ...nextItems[index],
        visual: ecoItem.image,
        visualType: '961',
        visualMeta: {
          name: ecoItem.name,
          type: ecoItem.type,
          location: ecoItem.location,
          description: ecoItem.description,
          url: ecoItem.url,
          cta: ecoItem.cta,
          meta: ecoItem.meta
        }
      };
      return { ...prev, items: nextItems };
    });
    setActiveItemVisualIndex(null);
  };

  const handleSuggestKeywords = () => {
    setIsGeneratingKeywords(true);
    setTimeout(() => {
      const words = `${formData.title} ${formData.intro}`
        .toLowerCase()
        .replace(/[^\w\s]/g, '')
        .split(/\s+/)
        .filter(w => w.length > 3);
      
      const uniqueWords = Array.from(new Set(words));
      const extracted = uniqueWords.slice(0, 4).map(w => w.charAt(0).toUpperCase() + w.slice(1));
      
      setFormData(prev => ({
        ...prev,
        keywords: Array.from(new Set([...prev.keywords, ...extracted]))
      }));
      setIsGeneratingKeywords(false);
    }, 800);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title.trim()) {
      alert('Listicle Title is required.');
      return;
    }

    let date: string | undefined;
    let time: string | undefined;

    if (formData.status === 'Scheduled' && formData.scheduleDate) {
      const sDate = new Date(formData.scheduleDate);
      date = sDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
      if (formData.scheduleTime) {
        time = formData.scheduleTime;
      }
    }

    addPost({
      title: formData.title,
      category: formData.categories.join(', '),
      status: formData.status,
      author: formData.selectedAuthors,
      image: formData.image,
      date: date,
      time: time
    });

    navigate('/dashboard/posts');
  };

  const filteredAuthors = team.filter(member => 
    member.name.toLowerCase().includes(authorSearch.toLowerCase())
  );

  return (
    <div className="max-w-[1300px] mx-auto pb-24 font-sans min-h-screen">
      
      {/* Top Action Bar */}
      <div className="flex items-center justify-between border-b border-gray-100 pb-5 mb-8">
        <div className="flex items-center gap-4">
          <div className="flex bg-gray-100/50 p-1 rounded-xl border border-gray-100">
            <button 
              type="button"
              onClick={() => setActiveTab('edit')}
              className={`px-3.5 py-1.5 text-xs font-semibold rounded-lg transition-all cursor-pointer border border-transparent ${activeTab === 'edit' ? 'bg-white text-gray-900 border-gray-100 shadow-2xs' : 'text-gray-400 hover:text-gray-600'}`}
            >
              Listicle items
            </button>
            <button 
              type="button"
              onClick={() => setActiveTab('preview')}
              className={`px-3.5 py-1.5 text-xs font-semibold rounded-lg transition-all cursor-pointer border border-transparent ${activeTab === 'preview' ? 'bg-white text-gray-900 border-gray-100 shadow-2xs' : 'text-gray-400 hover:text-gray-600'}`}
            >
              Live preview
            </button>
            <button 
              type="button"
              onClick={() => setActiveTab('social')}
              className={`px-3.5 py-1.5 text-xs font-semibold rounded-lg transition-all cursor-pointer border border-transparent ${activeTab === 'social' ? 'bg-white text-gray-900 border-gray-100 shadow-2xs' : 'text-gray-400 hover:text-gray-600'}`}
            >
              Social & SEO Snippets
            </button>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <button 
            type="button"
            onClick={() => navigate('/dashboard/posts')}
            className="px-4 py-2 hover:bg-gray-50 rounded-xl text-xs font-semibold text-gray-500 transition-all cursor-pointer bg-transparent"
          >
            Cancel
          </button>
          
          <button 
            type="button"
            onClick={handleSubmit}
            className="bg-[#FF0000] hover:bg-red-700 text-white px-5 py-2 rounded-xl font-semibold text-xs transition-all flex items-center justify-center cursor-pointer border-0"
          >
            Save listicle
          </button>
        </div>
      </div>

      {/* Main Workspace */}
      {activeTab === 'edit' ? (
        <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-10 gap-8">
          
          {/* LEFT 70% PANEL: Title, Intro & Listicle Items */}
          <div className="lg:col-span-7 space-y-6">
            
            {/* Title Field */}
            <div className="space-y-2">
              <label className="text-xs font-semibold text-gray-500 ml-1">Listicle title</label>
              <input 
                type="text"
                placeholder="e.g. 10 Spectacular Spots In Lebanon You Have To Visit in 2026"
                value={formData.title}
                onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                className="w-full px-4 py-3 bg-white border border-gray-100 rounded-xl text-sm font-medium focus:border-gray-200 outline-none transition-all text-gray-900 placeholder:text-gray-400"
              />
            </div>

            {/* Intro Section - Half height, simplified toolbar (Bold, Italic, Link only) */}
            <div className="space-y-2">
              <label className="text-xs font-semibold text-gray-500 ml-1">Intro</label>
              
              <div className="flex flex-wrap items-center gap-1 bg-white border border-gray-100 rounded-xl p-1.5">
                <button 
                  type="button" 
                  onClick={() => applyIntroFormat('bold')}
                  className="p-2 hover:bg-gray-50 text-gray-600 rounded-lg transition-all cursor-pointer border-0 bg-transparent"
                  title="Bold"
                >
                  <Bold className="w-4 h-4" />
                </button>
                <button 
                  type="button" 
                  onClick={() => applyIntroFormat('italic')}
                  className="p-2 hover:bg-gray-50 text-gray-600 rounded-lg transition-all cursor-pointer border-0 bg-transparent"
                  title="Italic"
                >
                  <Italic className="w-4 h-4" />
                </button>
                <div className="h-4 w-px bg-gray-200 mx-1" />
                <button 
                  type="button" 
                  onClick={() => {
                    const url = prompt('Enter link URL:');
                    if (url) applyIntroFormat('createLink', url);
                  }}
                  className="p-2 hover:bg-gray-50 text-gray-600 rounded-lg transition-all cursor-pointer border-0 bg-transparent"
                  title="Hyperlink"
                >
                  <LinkIcon className="w-4 h-4" />
                </button>
              </div>

              <div 
                ref={introEditorRef}
                contentEditable
                onInput={(e) => setFormData(prev => ({ ...prev, intro: e.currentTarget.innerHTML }))}
                className="w-full min-h-[140px] p-4 bg-white border border-gray-100 rounded-xl text-sm font-medium leading-relaxed outline-none focus:border-gray-200 transition-all font-sans text-gray-800 overflow-y-auto prose max-w-none"
                style={{ minHeight: '140px' }}
                placeholder="Write an introductory lead-in for this listicle..."
              />
            </div>

            {/* Listicle Items Stream */}
            <div className="space-y-4 pt-4">
              <div className="flex items-center justify-between pb-2 border-b border-gray-100">
                <h3 className="text-sm font-bold text-gray-900">List items ({formData.items.length})</h3>
                <span className="text-xs text-gray-400 font-medium">Drag or arrange in desired reading order</span>
              </div>

              <div className="space-y-5">
                {formData.items.map((item, index) => (
                  <div 
                    key={item.id}
                    className="bento-card p-5 border border-gray-100 rounded-2xl bg-white space-y-4 hover:border-gray-200 transition-all"
                  >
                    {/* Item Top Header & Re-order Controls */}
                    <div className="flex items-center justify-between gap-3">
                      <div className="flex items-center gap-2">
                        <span className="w-6 h-6 rounded-full bg-gray-100 flex items-center justify-center text-xs font-bold text-gray-600">
                          {index + 1}
                        </span>
                        <span className="text-xs font-bold text-gray-500">Item #{index + 1}</span>
                      </div>

                      <div className="flex items-center gap-1">
                        <button 
                          type="button"
                          onClick={() => handleMoveItem(index, 'up')}
                          disabled={index === 0}
                          className="p-1.5 text-gray-400 hover:text-gray-700 disabled:opacity-30 disabled:hover:text-gray-400 cursor-pointer rounded-lg hover:bg-gray-50"
                          title="Move up"
                        >
                          <MoveUp className="w-3.5 h-3.5" />
                        </button>
                        <button 
                          type="button"
                          onClick={() => handleMoveItem(index, 'down')}
                          disabled={index === formData.items.length - 1}
                          className="p-1.5 text-gray-400 hover:text-gray-700 disabled:opacity-30 disabled:hover:text-gray-400 cursor-pointer rounded-lg hover:bg-gray-50"
                          title="Move down"
                        >
                          <MoveDown className="w-3.5 h-3.5" />
                        </button>
                        <button 
                          type="button"
                          onClick={() => handleRemoveItem(index)}
                          className="p-1.5 text-gray-400 hover:text-red-600 cursor-pointer rounded-lg hover:bg-red-50 transition-colors ml-1"
                          title="Delete item"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>

                    {/* Title */}
                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold text-gray-500">Title</label>
                      <input 
                        type="text"
                        value={item.title}
                        onChange={(e) => handleUpdateItem(index, 'title', e.target.value)}
                        placeholder="Title"
                        className="w-full px-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm font-medium focus:border-gray-300 outline-none transition-all text-gray-900 placeholder:text-gray-400"
                      />
                    </div>

                    {/* Visual */}
                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold text-gray-500">Visual</label>
                      
                      {item.visual ? (
                        <div className="relative rounded-2xl overflow-hidden border border-gray-100 bg-white max-w-sm">
                          {item.visualType === '961' && item.visualMeta ? (
                            <div className="p-4">
                              <img src={item.visual} alt={item.visualMeta.name} className="w-full h-44 object-cover rounded-xl mb-3" />
                              <div className="flex items-center justify-between gap-3">
                                <span className="font-bold text-base text-gray-900">{item.visualMeta.name}</span>
                                <a 
                                  href={item.visualMeta.url || '#'} 
                                  target="_blank" 
                                  rel="noopener noreferrer" 
                                  className="text-xs font-bold bg-[#FF0000] text-white px-3.5 py-1.5 rounded-lg hover:bg-red-700 transition-colors"
                                >
                                  {item.visualMeta.cta || 'View'}
                                </a>
                              </div>
                              <p className="font-medium text-xs text-gray-500 mt-1.5">{item.visualMeta.location} • {item.visualMeta.meta}</p>
                            </div>
                          ) : (
                            <img src={item.visual} alt="Item visual" className="w-full h-52 object-cover" />
                          )}
                          
                          <div className="absolute top-3 right-3 flex items-center gap-2">
                            <button
                              type="button"
                              onClick={() => {
                                handleUpdateItem(index, 'visual', '');
                                handleUpdateItem(index, 'visualType', 'image');
                                handleUpdateItem(index, 'visualMeta', undefined);
                              }}
                              className="p-1.5 bg-red-600/90 text-white rounded-lg hover:bg-red-600 cursor-pointer shadow-2xs"
                              title="Remove visual"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>
                      ) : (
                        <div className="border border-dashed border-gray-200 rounded-xl p-4 flex items-center justify-center gap-3 bg-gray-50/50">
                          <label className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 hover:border-gray-300 rounded-xl text-xs font-semibold text-gray-700 cursor-pointer hover:bg-gray-50 transition-colors shadow-2xs">
                            <Upload className="w-3.5 h-3.5 text-gray-500" />
                            <span>Upload</span>
                            <input 
                              type="file" 
                              accept="image/*"
                              onChange={(e) => {
                                const file = e.target.files?.[0];
                                if (file) handleItemVisualUpload(index, file);
                              }}
                              className="hidden"
                            />
                          </label>

                          <button
                            type="button"
                            onClick={() => {
                              setActiveItemVisualIndex(index);
                              setItemVisualTab('961');
                            }}
                            className="flex items-center gap-2 px-4 py-2 bg-red-50/80 border border-red-100 hover:border-red-200 rounded-xl text-xs font-bold text-[#FF0000] cursor-pointer hover:bg-red-100/50 transition-colors"
                          >
                            <span>961</span>
                          </button>
                        </div>
                      )}
                    </div>

                    {/* Text */}
                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold text-gray-500">Text</label>
                      <textarea 
                        rows={3}
                        value={item.text}
                        onChange={(e) => handleUpdateItem(index, 'text', e.target.value)}
                        placeholder="Provide commentary, tips, or narrative details for this list item..."
                        className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl text-sm font-medium focus:border-gray-300 outline-none transition-all text-gray-800 placeholder:text-gray-400 resize-y"
                      />
                    </div>

                  </div>
                ))}
              </div>

              {/* Add Another Item Button */}
              <button
                type="button"
                onClick={handleAddItem}
                className="w-full py-4 border border-dashed border-gray-200 rounded-2xl hover:border-red-300 hover:bg-red-50/20 text-gray-700 hover:text-[#FF0000] font-semibold text-xs transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <Plus className="w-4 h-4 text-[#FF0000]" />
                <span>Add another item</span>
              </button>
            </div>

          </div>

          {/* RIGHT 30% PANEL: Settings, Cover, Authors & Keywords */}
          <div className="lg:col-span-3">
            <div className="bento-card p-6 space-y-6">
              
              {/* 1. Status & Schedule */}
              <div className="space-y-4">
                <label className="text-xs font-semibold text-gray-500 ml-1">Status and schedule</label>
                
                <div className="space-y-1">
                  {['Draft', 'Published', 'Scheduled', 'Review'].map((st) => (
                    <label key={st} className="flex items-center gap-3 cursor-pointer group p-2 rounded-xl hover:bg-gray-50 transition-colors">
                      <input 
                        type="radio" 
                        name="status"
                        checked={formData.status === st}
                        onChange={() => setFormData(p => ({ ...p, status: st as any }))}
                        className="text-primary focus:ring-primary border-gray-300 w-4 h-4 cursor-pointer"
                      />
                      <span className={`text-xs font-semibold ${formData.status === st ? 'text-gray-900' : 'text-gray-400 group-hover:text-gray-600'}`}>{st}</span>
                    </label>
                  ))}
                </div>

                {formData.status === 'Scheduled' && (
                  <div className="pt-2 border-t border-gray-100 space-y-2">
                    <input 
                      type="date"
                      value={formData.scheduleDate}
                      onChange={(e) => setFormData(p => ({ ...p, scheduleDate: e.target.value }))}
                      className="w-full px-3 py-2 bg-white border border-gray-100 rounded-lg text-xs font-medium outline-none text-gray-900"
                    />
                    <input 
                      type="time"
                      value={formData.scheduleTime}
                      onChange={(e) => setFormData(p => ({ ...p, scheduleTime: e.target.value }))}
                      className="w-full px-3 py-2 bg-white border border-gray-100 rounded-lg text-xs font-medium outline-none text-gray-900"
                    />
                  </div>
                )}
              </div>

              {/* 2. Cover Visual (Vertical ratio) */}
              <div className="pt-4 border-t border-gray-100 space-y-3">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-semibold text-gray-500">Cover visual</label>
                  <button 
                    type="button"
                    onClick={() => setIsCoverModalOpen(true)}
                    className="text-[11px] font-bold text-[#FF0000] hover:text-red-700 cursor-pointer"
                  >
                    Change
                  </button>
                </div>

                <div 
                  onClick={() => setIsCoverModalOpen(true)}
                  className="w-full h-48 bg-gray-50 rounded-2xl overflow-hidden border border-gray-100 cursor-pointer relative group"
                >
                  <img src={formData.image} alt="Cover" className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
                  <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <span className="bg-white/90 text-gray-900 text-xs font-bold px-3 py-1.5 rounded-xl shadow-2xs">Change Cover</span>
                  </div>
                </div>
              </div>

              {/* 3. Section Categories */}
              <div className="pt-4 border-t border-gray-100 space-y-3">
                <label className="text-xs font-semibold text-gray-500">Section</label>
                <div className="flex flex-wrap gap-1.5">
                  {allCategories.map(cat => {
                    const isSelected = formData.categories.includes(cat.name);
                    return (
                      <button
                        key={cat.name}
                        type="button"
                        onClick={() => {
                          setFormData(p => ({
                            ...p,
                            categories: isSelected ? p.categories.filter(c => c !== cat.name) : [...p.categories, cat.name]
                          }));
                        }}
                        className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer border ${
                          isSelected ? 'bg-primary text-white border-primary' : 'bg-gray-50 text-gray-600 border-gray-100 hover:bg-gray-100'
                        }`}
                      >
                        {cat.name}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* 4. Authors */}
              <div className="pt-4 border-t border-gray-100 space-y-3">
                <label className="text-xs font-semibold text-gray-500">Authors</label>
                <div className="space-y-1.5 max-h-36 overflow-y-auto">
                  {filteredAuthors.map(auth => {
                    const isSelected = formData.selectedAuthors.includes(auth.name);
                    return (
                      <label key={auth.id} className="flex items-center gap-2.5 p-1.5 rounded-lg hover:bg-gray-50 cursor-pointer">
                        <input 
                          type="checkbox"
                          checked={isSelected}
                          onChange={() => {
                            setFormData(p => ({
                              ...p,
                              selectedAuthors: isSelected ? p.selectedAuthors.filter(a => a !== auth.name) : [...p.selectedAuthors, auth.name]
                            }));
                          }}
                          className="rounded text-primary focus:ring-primary border-gray-300"
                        />
                        <span className="text-xs font-medium text-gray-700">{auth.name}</span>
                      </label>
                    );
                  })}
                </div>
              </div>

              {/* 5. Keywords & Tags */}
              <div className="pt-4 border-t border-gray-100 space-y-3">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-semibold text-gray-500">Keywords & Tags</label>
                  <button 
                    type="button"
                    onClick={handleSuggestKeywords}
                    className="text-[11px] font-bold text-[#FF0000] hover:text-red-700 bg-red-50 border border-red-100 px-2 py-0.5 rounded-md cursor-pointer"
                  >
                    {isGeneratingKeywords ? 'Extracting...' : 'Suggest'}
                  </button>
                </div>
                
                <div className="flex flex-wrap gap-1.5">
                  {formData.keywords.map(kw => (
                    <span key={kw} className="inline-flex items-center gap-1 px-2.5 py-1 bg-gray-50 text-gray-700 text-xs font-medium rounded-lg border border-gray-100">
                      <span>#{kw}</span>
                      <button 
                        type="button"
                        onClick={() => setFormData(p => ({ ...p, keywords: p.keywords.filter(k => k !== kw) }))}
                        className="hover:text-red-600"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </span>
                  ))}
                </div>

                <div className="flex items-center gap-2">
                  <input 
                    type="text"
                    placeholder="Add tag..."
                    value={formData.newKeywordInput}
                    onChange={(e) => setFormData(p => ({ ...p, newKeywordInput: e.target.value }))}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' && formData.newKeywordInput.trim()) {
                        e.preventDefault();
                        setFormData(p => ({
                          ...p,
                          keywords: [...p.keywords, p.newKeywordInput.trim()],
                          newKeywordInput: ''
                        }));
                      }
                    }}
                    className="flex-1 px-3 py-1.5 bg-white border border-gray-100 rounded-lg text-xs font-medium outline-none text-gray-900"
                  />
                  <button 
                    type="button"
                    onClick={() => {
                      if (formData.newKeywordInput.trim()) {
                        setFormData(p => ({
                          ...p,
                          keywords: [...p.keywords, p.newKeywordInput.trim()],
                          newKeywordInput: ''
                        }));
                      }
                    }}
                    className="px-3 py-1.5 bg-gray-100 hover:bg-gray-200 text-xs font-semibold rounded-lg"
                  >
                    Add
                  </button>
                </div>
              </div>

            </div>
          </div>

        </form>
      ) : activeTab === 'preview' ? (
        /* LIVE PREVIEW TAB - Matches Public Article Page Layout */
        <div className="max-w-4xl mx-auto bg-white rounded-3xl border border-gray-100 p-6 sm:p-10 space-y-10">
          
          <header className="space-y-6 max-w-[690px] mx-auto">
            {/* Section Tag Badge ABOVE Cover Image */}
            <div className="flex flex-wrap items-center gap-2">
              {formData.categories.map((c) => (
                <span key={c} className="text-[10px] font-bold uppercase tracking-wider text-primary bg-red-50 border border-red-100 px-2.5 py-1 rounded-md">
                  {c}
                </span>
              ))}
            </div>

            {/* Featured Cover Image */}
            <div className="w-full overflow-hidden rounded-3xl border border-gray-100 h-64 sm:h-80 md:h-[380px] bg-gray-100">
              <img 
                src={formData.image} 
                alt={formData.title || 'Story cover'} 
                className="w-full h-full object-cover object-top"
                referrerPolicy="no-referrer"
              />
            </div>

            {/* Headline */}
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-black leading-[1.2] mb-3 tracking-tight text-gray-900">
              {formData.title || 'Untitled Listicle'}
            </h1>

            {/* Author & Sleek Share Row (Updated metadata row without tags) */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 py-3.5 border-y border-gray-100">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center text-xs font-bold text-gray-700">
                  {formData.selectedAuthors[0]?.charAt(0) || 'A'}
                </div>
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-gray-900 text-xs font-semibold">{formData.selectedAuthors.join(', ') || 'The 961 Editorial'}</span>
                  <span className="text-gray-300 text-xs">•</span>
                  <span className="text-gray-500 text-xs">5 min read</span>
                  <span className="text-gray-300 text-xs">•</span>
                  <span className="text-gray-500 text-xs">{formData.scheduleDate || 'Today, Mar 28, 2026'}</span>
                </div>
              </div>

              {/* Clean Modern Social Actions */}
              <div className="flex items-center gap-1.5 self-start sm:self-auto">
                <button type="button" className="w-8 h-8 rounded-full flex items-center justify-center text-gray-500 hover:text-gray-900 hover:bg-gray-100 transition-colors"><Twitter className="w-3.5 h-3.5 fill-current" /></button>
                <button type="button" className="w-8 h-8 rounded-full flex items-center justify-center text-gray-500 hover:text-[#1877F2] hover:bg-gray-100 transition-colors"><Facebook className="w-3.5 h-3.5 fill-current" /></button>
                <button type="button" className="w-8 h-8 rounded-full flex items-center justify-center text-gray-500 hover:text-[#25D366] hover:bg-gray-100 transition-colors"><MessageCircle className="w-3.5 h-3.5 fill-current" /></button>
                <button type="button" className="h-8 px-2.5 rounded-full flex items-center gap-1.5 text-xs font-medium text-gray-500 hover:text-gray-900 hover:bg-gray-100"><LinkIcon className="w-3.5 h-3.5" /></button>
              </div>
            </div>
          </header>

          {/* Intro Narrative */}
          {formData.intro && (
            <div className="prose prose-base max-w-[690px] mx-auto px-2 md:px-0 text-gray-800 leading-relaxed font-sans font-normal text-base sm:text-lg mb-12">
              <div dangerouslySetInnerHTML={{ __html: formData.intro }} />
            </div>
          )}

          {/* Listicle Items Public View */}
          <div className="max-w-[690px] mx-auto space-y-16">
            {formData.items.map((item, idx) => {
              const displayTitle = /^\d+\./.test(item.title) ? item.title : `${idx + 1}. ${item.title}`;
              return (
                <div key={item.id} className="space-y-4">
                  <h2 className="text-xl sm:text-2xl font-black text-gray-900 tracking-tight">{displayTitle}</h2>
                  
                  {item.visual && (
                    item.visualType === '961' && item.visualMeta ? (
                      <div className="not-prose my-6 bg-white border border-gray-100 rounded-2xl overflow-hidden max-w-[400px]" style={{ fontFamily: "'Inter', sans-serif" }}>
                        <img src={item.visual} alt={item.visualMeta.name} className="w-full h-48 object-cover" style={{ margin: 0, display: 'block' }} />
                        <div className="p-5">
                          <div className="flex items-center justify-between gap-4">
                            <span style={{ fontWeight: 700, fontSize: '18px', color: '#111827' }}>{item.visualMeta.name}</span>
                            <a 
                              href={item.visualMeta.url || '#'} 
                              target="_blank" 
                              rel="noopener noreferrer" 
                              style={{ display: 'inline-block', fontWeight: 700, fontSize: '12px', backgroundColor: '#FF0000', color: '#ffffff', padding: '6px 16px', borderRadius: '8px', textDecoration: 'none' }}
                            >
                              {item.visualMeta.cta || 'View'}
                            </a>
                          </div>
                          <p style={{ fontWeight: 500, fontSize: '13px', color: '#4b5563', margin: '8px 0 0 0' }}>{item.visualMeta.location} • {item.visualMeta.meta}</p>
                        </div>
                      </div>
                    ) : (
                      <figure className="my-4">
                        <img src={item.visual} alt={item.title} className="w-full rounded-2xl border border-gray-100" />
                      </figure>
                    )
                  )}

                  {item.text && (
                    <p className="text-base sm:text-lg leading-[1.9] text-gray-800">{item.text}</p>
                  )}

                  {/* Ad placement after each list item, except the last one */}
                  {idx < formData.items.length - 1 && (
                    <div className="my-10">
                      <AdBanner format="responsive" adSlotId={`preview-listicle-item-${idx}`} />
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Footer Share */}
          <div className="mt-14 max-w-4xl mx-auto">
            <div className="bg-primary text-white rounded-2xl md:rounded-3xl p-5 md:py-5 md:px-8 flex flex-col md:flex-row items-center justify-between gap-4 md:gap-6">
              <div className="text-center md:text-left">
                <h3 className="text-xl md:text-2xl font-black tracking-tight">Share this story</h3>
              </div>
              <div className="flex flex-wrap justify-center gap-3">
                <button type="button" className="flex items-center gap-2 bg-white text-primary px-5 py-2 rounded-full font-bold hover:bg-gray-50 transition-colors text-xs">
                  <Facebook className="w-3.5 h-3.5 fill-current" />
                  <span>Facebook</span>
                </button>
                <button type="button" className="flex items-center gap-2 bg-white text-primary px-5 py-2 rounded-full font-bold hover:bg-gray-50 transition-colors text-xs">
                  <Twitter className="w-3.5 h-3.5 fill-current" />
                  <span>Twitter</span>
                </button>
                <button type="button" className="flex items-center gap-2 bg-white text-primary px-5 py-2 rounded-full font-bold hover:bg-gray-50 transition-colors text-xs">
                  <MessageCircle className="w-3.5 h-3.5 fill-current" />
                  <span>WhatsApp</span>
                </button>
              </div>
            </div>
          </div>

          {/* Bottom Banner */}
          <div className="max-w-[690px] mx-auto">
            <AdBanner format="responsive" adSlotId="preview-bottom-listicle" className="w-full" />
          </div>

        </div>
      ) : (
        /* SOCIAL TAB */
        <div className="max-w-5xl mx-auto">
          <SocialPreviewValidator
            title={formData.title}
            excerpt={formData.intro.replace(/<[^>]*>?/gm, '').slice(0, 160)}
            content={formData.intro}
            image={formData.image}
            sections={formData.categories}
            keywords={formData.keywords}
            author={formData.selectedAuthors}
          />
        </div>
      )}

      {/* MODAL: Cover Selector Modal */}
      {isCoverModalOpen && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-fade-in">
          <div className="bg-white rounded-3xl max-w-2xl w-full p-6 space-y-6 max-h-[85vh] overflow-y-auto">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-base text-gray-900">Select Cover Visual</h3>
              <button 
                type="button" 
                onClick={() => setIsCoverModalOpen(false)}
                className="p-2 text-gray-400 hover:text-gray-600 rounded-full hover:bg-gray-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="flex border-b border-gray-100 pb-2 gap-4 text-xs font-semibold">
              <button 
                type="button"
                onClick={() => setCoverTab('presets')}
                className={`pb-2 border-b-2 transition-all ${coverTab === 'presets' ? 'border-primary text-primary' : 'border-transparent text-gray-400'}`}
              >
                Curated Presets
              </button>
              <button 
                type="button"
                onClick={() => setCoverTab('upload')}
                className={`pb-2 border-b-2 transition-all ${coverTab === 'upload' ? 'border-primary text-primary' : 'border-transparent text-gray-400'}`}
              >
                Upload File
              </button>
            </div>

            {coverTab === 'presets' ? (
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {verticalPresets.map((preset) => (
                  <div 
                    key={preset.name}
                    onClick={() => {
                      setFormData(p => ({ ...p, image: preset.url }));
                      setIsCoverModalOpen(false);
                    }}
                    className="group relative h-48 rounded-2xl overflow-hidden cursor-pointer border border-gray-100"
                  >
                    <img src={preset.url} alt={preset.name} className="w-full h-full object-cover group-hover:scale-105 transition-all" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent p-3 flex flex-col justify-end">
                      <span className="text-white text-xs font-bold leading-tight">{preset.name}</span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="border border-dashed border-gray-200 rounded-2xl p-10 text-center flex flex-col items-center justify-center space-y-3">
                <Upload className="w-8 h-8 text-gray-400" />
                <label className="bg-primary text-white px-5 py-2 rounded-xl text-xs font-bold cursor-pointer hover:bg-red-700">
                  Select File from Computer
                  <input 
                    type="file" 
                    accept="image/*"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) {
                        const reader = new FileReader();
                        reader.onloadend = () => {
                          setFormData(p => ({ ...p, image: reader.result as string }));
                          setIsCoverModalOpen(false);
                        };
                        reader.readAsDataURL(file);
                      }
                    }}
                    className="hidden"
                  />
                </label>
              </div>
            )}
          </div>
        </div>
      )}

      {/* MODAL: Item Visual (Upload / 961 Ecosystem) */}
      {activeItemVisualIndex !== null && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-fade-in">
          <div className="bg-white rounded-3xl max-w-2xl w-full p-6 space-y-6 max-h-[85vh] overflow-y-auto">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-bold text-base text-gray-900">Add Visual for Item {activeItemVisualIndex + 1}</h3>
                <p className="text-xs text-gray-400">Upload a photograph or link directly to a 961 verified venue</p>
              </div>
              <button 
                type="button" 
                onClick={() => setActiveItemVisualIndex(null)}
                className="p-2 text-gray-400 hover:text-gray-600 rounded-full hover:bg-gray-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="flex border-b border-gray-100 pb-2 gap-4 text-xs font-semibold">
              <button 
                type="button"
                onClick={() => setItemVisualTab('upload')}
                className={`pb-2 border-b-2 transition-all ${itemVisualTab === 'upload' ? 'border-primary text-primary' : 'border-transparent text-gray-400'}`}
              >
                Upload / Drag & Drop
              </button>
              <button 
                type="button"
                onClick={() => setItemVisualTab('961')}
                className={`pb-2 border-b-2 transition-all ${itemVisualTab === '961' ? 'border-[#FF0000] text-[#FF0000]' : 'border-transparent text-gray-400'}`}
              >
                961 Places & Embeds
              </button>
              <button 
                type="button"
                onClick={() => setItemVisualTab('presets')}
                className={`pb-2 border-b-2 transition-all ${itemVisualTab === 'presets' ? 'border-primary text-primary' : 'border-transparent text-gray-400'}`}
              >
                Curated Presets
              </button>
            </div>

            {itemVisualTab === 'upload' ? (
              <div className="border border-dashed border-gray-200 rounded-2xl p-10 text-center flex flex-col items-center justify-center space-y-3 hover:border-gray-300">
                <Upload className="w-8 h-8 text-gray-400" />
                <span className="text-xs font-semibold text-gray-700">Drag and drop an image here, or browse</span>
                <label className="bg-primary text-white px-5 py-2 rounded-xl text-xs font-bold cursor-pointer hover:bg-red-700">
                  Select image
                  <input 
                    type="file" 
                    accept="image/*"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file && activeItemVisualIndex !== null) {
                        handleItemVisualUpload(activeItemVisualIndex, file);
                      }
                    }}
                    className="hidden"
                  />
                </label>
              </div>
            ) : itemVisualTab === '961' ? (
              <div className="space-y-4">
                <div className="relative">
                  <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input 
                    type="text"
                    placeholder="Search 961 restaurants, rooftops, stays, creators..."
                    value={ecosystemSearch}
                    onChange={(e) => setEcosystemSearch(e.target.value)}
                    className="w-full pl-9 pr-4 py-2.5 bg-gray-50 border border-gray-100 rounded-xl text-xs font-medium outline-none focus:bg-white focus:border-gray-200"
                  />
                </div>

                <div className="space-y-2.5 max-h-80 overflow-y-auto">
                  {ECOSYSTEM_ITEMS
                    .filter(eco => eco.name.toLowerCase().includes(ecosystemSearch.toLowerCase()) || eco.type.toLowerCase().includes(ecosystemSearch.toLowerCase()))
                    .map((eco) => (
                      <div 
                        key={eco.id}
                        onClick={() => activeItemVisualIndex !== null && handleSelect961Item(activeItemVisualIndex, eco)}
                        className="p-3 bg-white border border-gray-100 rounded-xl flex items-center justify-between hover:border-red-200 hover:bg-red-50/20 transition-all cursor-pointer group"
                      >
                        <div className="flex items-center gap-3">
                          <img src={eco.image} alt={eco.name} className="w-12 h-12 rounded-lg object-cover" />
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="text-xs font-bold text-gray-900 group-hover:text-primary">{eco.name}</span>
                              <span className="text-[10px] font-semibold text-gray-400">• {eco.type}</span>
                            </div>
                            <p className="text-[11px] text-gray-500 line-clamp-1">{eco.location}</p>
                          </div>
                        </div>
                        <span className="text-xs font-bold text-[#FF0000] group-hover:translate-x-1 transition-transform">Select →</span>
                      </div>
                    ))}
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 max-h-80 overflow-y-auto">
                {verticalPresets.map((preset) => (
                  <div 
                    key={preset.name}
                    onClick={() => {
                      if (activeItemVisualIndex !== null) {
                        handleUpdateItem(activeItemVisualIndex, 'visual', preset.url);
                        handleUpdateItem(activeItemVisualIndex, 'visualType', 'image');
                        setActiveItemVisualIndex(null);
                      }
                    }}
                    className="group relative h-36 rounded-2xl overflow-hidden cursor-pointer border border-gray-100"
                  >
                    <img src={preset.url} alt={preset.name} className="w-full h-full object-cover group-hover:scale-105 transition-all" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent p-2.5 flex flex-col justify-end">
                      <span className="text-white text-xs font-bold leading-tight">{preset.name}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

    </div>
  );
}

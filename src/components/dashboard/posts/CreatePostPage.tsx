import React, { useState, useRef, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
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
  Heading1, 
  Heading2, 
  List, 
  ListOrdered, 
  Quote, 
  Link as LinkIcon, 
  Code, 
  Search, 
  Check, 
  Upload, 
  Heart,
  Facebook,
  Twitter,
  MessageCircle
} from 'lucide-react';

export default function CreatePostPage() {
  const navigate = useNavigate();
  const { addPost } = usePostContext();
  const { team } = useTeamContext();

  const [activeTab, setActiveTab] = useState<'edit' | 'preview' | 'social'>('edit');
  
  // Media Selector Modal State
  const [isMediaModalOpen, setIsMediaModalOpen] = useState(false);
  const [mediaTab, setMediaTab] = useState<'presets' | 'upload'>('presets');
  
  // Simulated AI Generating states
  const [isGeneratingKeywords, setIsGeneratingKeywords] = useState(false);
  const [isRecommendingCategories, setIsRecommendingCategories] = useState(false);
  const [authorSearch, setAuthorSearch] = useState('');
  
  // 961 Ecosystem Modal and Search States
  const [isEcosystemModalOpen, setIsEcosystemModalOpen] = useState(false);
  const [ecosystemSearch, setEcosystemSearch] = useState('');
  const [ecosystemCategory, setEcosystemCategory] = useState<'All' | 'Restaurant' | 'Nightlife' | 'Creators' | 'Stays'>('All');

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

  useEffect(() => {
    if (activeTab === 'edit' && editorRef.current) {
      editorRef.current.innerHTML = formData.content;
    }
  }, [activeTab]);

  // Form State
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    categories: ['News'] as string[],
    status: 'Draft' as 'Draft' | 'Published' | 'Scheduled' | 'Review',
    image: 'https://images.unsplash.com/photo-1545569341-9eb8b30979d9?auto=format&fit=crop&w=600&h=900&q=80', // Default Beirut street vertical
    selectedAuthors: ['Anthony Rahayel'] as string[], // Defaulted to current user
    keywords: ['Beirut', 'Lebanon'] as string[],
    newKeywordInput: '',
    scheduleDate: '',
    scheduleTime: ''
  });

  const allCategories = [
    { name: 'News', icon: Newspaper, color: 'text-red-600 bg-red-50 border-red-100' },
    { name: 'Lifestyle', icon: Heart, color: 'text-purple-600 bg-purple-50 border-purple-100' },
    { name: 'Food & Drink', icon: Compass, color: 'text-amber-600 bg-amber-50 border-amber-100' },
    { name: 'Travel', icon: Compass, color: 'text-blue-600 bg-blue-50 border-blue-100' },
    { name: 'Diaspora', icon: Globe, color: 'text-emerald-600 bg-emerald-50 border-emerald-100' }
  ];

  // Stunning Portrait/Vertical presets (Lebanese scenery)
  const verticalPresets = [
    { name: 'Beirut Streets', url: 'https://images.unsplash.com/photo-1545569341-9eb8b30979d9?auto=format&fit=crop&w=600&h=900&q=80' },
    { name: 'Lebanese Mountains', url: 'https://images.unsplash.com/photo-1605810230434-7631ac76ec81?auto=format&fit=crop&w=600&h=900&q=80' },
    { name: 'Traditional Mezze', url: 'https://images.unsplash.com/photo-1541518763669-27fef04b14ea?auto=format&fit=crop&w=600&h=900&q=80' },
    { name: 'Beirut Skyline Night', url: 'https://images.unsplash.com/photo-1517524206127-48bbd363f3d7?auto=format&fit=crop&w=600&h=900&q=80' },
    { name: 'Byblos Port Harbour', url: 'https://images.unsplash.com/photo-1578345218746-50a229b3d0f8?auto=format&fit=crop&w=600&h=900&q=80' },
    { name: 'Cedars Forest Hike', url: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=600&h=900&q=80' }
  ];

  const editorRef = useRef<HTMLDivElement>(null);

  // Visual text formatting helper (using contentEditable commands)
  const applyFormat = (command: string, value: string = '') => {
    document.execCommand(command, false, value);
    if (editorRef.current) {
      setFormData(prev => ({
        ...prev,
        content: editorRef.current?.innerHTML || ''
      }));
    }
  };

  const insert961Text = () => {
    document.execCommand('insertHTML', false, '<span style="color: #FF0000; font-weight: bold;">961</span>');
    if (editorRef.current) {
      setFormData(prev => ({
        ...prev,
        content: editorRef.current?.innerHTML || ''
      }));
    }
  };

  const insertHtmlAtCursor = (html: string) => {
    if (!editorRef.current) return;
    editorRef.current.focus();

    const selection = window.getSelection();
    if (selection && selection.rangeCount > 0) {
      const range = selection.getRangeAt(0);
      // Check if selection is actually inside our editorRef
      if (editorRef.current.contains(range.commonAncestorContainer)) {
        range.deleteContents();
        const el = document.createElement('div');
        el.innerHTML = html;
        const fragment = document.createDocumentFragment();
        let node;
        let lastNode;
        while ((node = el.firstChild)) {
          lastNode = fragment.appendChild(node);
        }
        range.insertNode(fragment);
        
        // Put cursor after inserted content
        if (lastNode) {
          range.setStartAfter(lastNode);
          range.collapse(true);
          selection.removeAllRanges();
          selection.addRange(range);
        }

        setFormData(prev => ({
          ...prev,
          content: editorRef.current?.innerHTML || ''
        }));
        return;
      }
    }

    // Fallback: append to content
    const currentHtml = editorRef.current.innerHTML;
    const newHtml = currentHtml + html;
    editorRef.current.innerHTML = newHtml;
    setFormData(prev => ({
      ...prev,
      content: newHtml
    }));
  };

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
    },
    {
      id: 'eco-7',
      name: 'MusicHall',
      type: 'Nightlife',
      location: 'Waterfront, Beirut',
      description: 'An iconic cabaret venue presenting an eclectic mix of short, live musical performances from opera and rock to Arabic fusion.',
      image: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?auto=format&fit=crop&w=400&h=400&q=80',
      url: 'https://the961.com/places/musichall',
      cta: 'Book Lounge',
      meta: 'Music Cabaret • 9 PM - 3 AM'
    },
    {
      id: 'eco-8',
      name: 'Albergo Hotel',
      type: 'Stays',
      location: 'Achrafieh, Beirut',
      description: 'Beirut’s most legendary boutique hotel. Indulge in individual custom-themed suites, vintage orientalist charm, and a stunning rooftop pool garden.',
      image: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=400&h=400&q=80',
      url: 'https://the961.com/places/albergo',
      cta: 'Book Stay',
      meta: 'Boutique Hotel • From $220/night'
    },
    {
      id: 'eco-9',
      name: 'Bkerzay',
      type: 'Stays',
      location: 'Chouf Mountains',
      description: 'A tranquil eco-village nestled in the Chouf pine forests, highlighting stone architecture, organic pottery workshops, and hiking trails.',
      image: 'https://images.unsplash.com/photo-1445019980597-93fa8acb246c?auto=format&fit=crop&w=400&h=400&q=80',
      url: 'https://the961.com/places/bkerzay',
      cta: 'Book Stay',
      meta: 'Eco-Village • From $180/night'
    },
    {
      id: 'eco-10',
      name: 'Beit Douma',
      type: 'Stays',
      location: 'Douma, Batroun District',
      description: 'A restored 19th-century Lebanese home perched in a historic village, celebrated for its gourmet homemade farm breakfasts and slow lifestyle.',
      image: 'https://images.unsplash.com/photo-1546548970-71785318a17b?auto=format&fit=crop&w=400&h=400&q=80',
      url: 'https://the961.com/places/beit-douma',
      cta: 'Book Stay',
      meta: 'Heritage Guesthouse • From $150/night'
    },
    {
      id: 'eco-11',
      name: 'Arthaus Beirut',
      type: 'Stays',
      location: 'Gemmayzeh, Beirut',
      description: 'An oasis of art and design located inside four interconnected heritage houses, featuring a private leafy courtyard and modern art collections.',
      image: 'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?auto=format&fit=crop&w=400&h=400&q=80',
      url: 'https://the961.com/places/arthaus',
      cta: 'Book Stay',
      meta: 'Boutique Art Hotel • From $200/night'
    },
    {
      id: 'eco-12',
      name: 'Anthony Rahayel',
      type: 'Creators',
      location: 'NoGarlicNoOnions creator',
      description: 'Lebanon’s most famous food and travel ambassador, chronicling culinary treasures, local farmers, and hidden gastronomic gems of the country.',
      image: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&h=400&q=80',
      url: 'https://the961.com/creators/anthony-rahayel',
      cta: 'Follow',
      meta: 'Food & Travel • 1.2M Followers'
    },
    {
      id: 'eco-13',
      name: 'Serge Majdalani',
      type: 'Creators',
      location: 'Travel photographer',
      description: 'A leading travel and adventure storyteller showcasing spectacular aerial drone perspectives and rugged natural wonders of Lebanese landscapes.',
      image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&h=400&q=80',
      url: 'https://the961.com/creators/serge-majdalani',
      cta: 'Follow',
      meta: 'Travel & Photography • 450K Followers'
    }
  ];

  const filteredEcosystemItems = ECOSYSTEM_ITEMS.filter(item => {
    const matchesSearch = 
      item.name.toLowerCase().includes(ecosystemSearch.toLowerCase()) ||
      item.description.toLowerCase().includes(ecosystemSearch.toLowerCase()) ||
      item.location.toLowerCase().includes(ecosystemSearch.toLowerCase());
    const matchesCategory = ecosystemCategory === 'All' || item.type === ecosystemCategory;
    return matchesSearch && matchesCategory;
  });

  const handleAuthorToggle = (name: string) => {
    setFormData(prev => {
      const exists = prev.selectedAuthors.includes(name);
      return {
        ...prev,
        selectedAuthors: exists 
          ? prev.selectedAuthors.filter(a => a !== name)
          : [...prev.selectedAuthors, name]
      };
    });
  };

  const handleCategoryToggle = (name: string) => {
    setFormData(prev => {
      const exists = prev.categories.includes(name);
      const updated = exists 
        ? prev.categories.filter(c => c !== name)
        : [...prev.categories, name];
      return {
        ...prev,
        // Make sure we have at least 1 category selected
        categories: updated.length > 0 ? updated : [name]
      };
    });
  };

  const addCustomKeyword = () => {
    const val = formData.newKeywordInput.trim();
    if (val && !formData.keywords.includes(val)) {
      setFormData(prev => ({
        ...prev,
        keywords: [...prev.keywords, val],
        newKeywordInput: ''
      }));
    }
  };

  const removeKeyword = (kw: string) => {
    setFormData(prev => ({
      ...prev,
      keywords: prev.keywords.filter(k => k !== kw)
    }));
  };

  // Automated Keyword Extraction Generator
  const generateAIKeywords = () => {
    if (!formData.title.trim() && !formData.content.trim()) {
      alert('Please add some title or body text content first so AI can analyze it.');
      return;
    }
    
    setIsGeneratingKeywords(true);

    setTimeout(() => {
      const textToAnalyze = `${formData.title} ${formData.content}`.toLowerCase();
      
      // Smart Lebanese content keywords dictionary
      const lebaneseMap: { [key: string]: string[] } = {
        beirut: ['Beirut', 'Lebanon', 'Capital', 'Mediterranean'],
        food: ['Gastronomy', 'Lebanese Food', 'Cuisine', 'Culinary'],
        mezze: ['Mezze', 'Hummus', 'Lebanese Cuisine', 'Food Culture'],
        lebanon: ['Lebanon', 'Middle East', 'Levant'],
        byblos: ['Byblos', 'Historic Harbour', 'Archaeology'],
        cedars: ['Cedars of Lebanon', 'Nature Reserve', 'Ecotourism'],
        diaspora: ['Lebanese Diaspora', 'Expat Community', 'Global Lebanese'],
        summer: ['Lebanese Summer', 'Beaches', 'Tourism Season'],
        night: ['Beirut Nightlife', 'Entertainment', 'Events'],
        culture: ['Heritage', 'Lebanese Culture', 'Art & Design']
      };

      const extracted: string[] = [];
      
      // Perform lookup matches
      Object.entries(lebaneseMap).forEach(([trigger, tags]) => {
        if (textToAnalyze.includes(trigger)) {
          tags.forEach(t => {
            if (!extracted.includes(t)) extracted.push(t);
          });
        }
      });

      // Default backup extractions if nothing triggered
      if (extracted.length === 0) {
        // Extract proper nouns
        const properNouns = `${formData.title} ${formData.content}`
          .split(/[\s,.:;!?]+/)
          .filter(word => word.length > 3 && /^[A-Z]/.test(word))
          .map(word => word.replace(/[^a-zA-Z]/g, ''));
        
        const uniqueNouns = Array.from(new Set(properNouns)).slice(0, 5);
        extracted.push(...uniqueNouns);
      }

      // Merge with existing keywords
      setFormData(prev => {
        const merged = Array.from(new Set([...prev.keywords, ...extracted])).slice(0, 10);
        return {
          ...prev,
          keywords: merged.length > 0 ? merged : [...prev.keywords, 'Lebanese Culture', 'Editorial']
        };
      });

      setIsGeneratingKeywords(false);
    }, 1200);
  };

  // Automated Category Recommendation Engine
  const recommendAICategories = () => {
    if (!formData.title.trim() && !formData.content.trim()) {
      alert('Please write a title or body text content first so AI can recommend appropriate channels.');
      return;
    }

    setIsRecommendingCategories(true);

    setTimeout(() => {
      const textToAnalyze = `${formData.title} ${formData.content}`.toLowerCase();
      const recommended: string[] = [];

      if (textToAnalyze.match(/(beirut|news|government|parliament|announcement|president|minister|breaking|security)/i)) {
        recommended.push('News');
      }
      if (textToAnalyze.match(/(beach|summer|resort|byblos|mountains|cedars|trip|hotel|guide|travel|explore|tour)/i)) {
        recommended.push('Travel');
      }
      if (textToAnalyze.match(/(food|mezze|hummus|restaurant|wine|dine|cuisine|chef|eat|recipe|delicious|kitchen)/i)) {
        recommended.push('Food & Drink');
      }
      if (textToAnalyze.match(/(expat|diaspora|abroad|community|emigrant|brazil|canada|gulf|dollar)/i)) {
        recommended.push('Diaspora');
      }
      if (textToAnalyze.match(/(lifestyle|fashion|culture|art|design|music|party|nightlife|club|concert|trend|beauty)/i)) {
        recommended.push('Lifestyle');
      }

      setFormData(prev => {
        const finalCategories = recommended.length > 0 ? recommended : ['News'];
        return {
          ...prev,
          categories: finalCategories
        };
      });

      setIsRecommendingCategories(false);
    }, 1000);
  };

  // Cover image local file handler
  const handleLocalImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData(prev => ({
          ...prev,
          image: reader.result as string
        }));
        setIsMediaModalOpen(false);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0];
    if (file && file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData(prev => ({
          ...prev,
          image: reader.result as string
        }));
        setIsMediaModalOpen(false);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title.trim()) {
      alert('Post Title is required.');
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
      category: formData.categories.join(', '), // Comma separated for table listing compatibility
      status: formData.status,
      author: formData.selectedAuthors,
      image: formData.image,
      date: date,
      time: time
    });

    navigate('/dashboard/posts');
  };

  // Filter out authors based on search input
  const filteredAuthors = team.filter(member => 
    member.name.toLowerCase().includes(authorSearch.toLowerCase())
  );

  return (
    <div className="max-w-[1300px] mx-auto pb-24 font-sans min-h-screen">
      
      {/* Top Save & Close Editor Action bar - Flat & Slick */}
      <div className="flex items-center justify-between border-b border-gray-100 pb-5 mb-8">
        <div className="flex items-center gap-4">
          {/* Editor/Preview/Social Switch */}
          <div className="flex bg-gray-100/50 p-1 rounded-xl border border-gray-100">
            <button 
              type="button"
              onClick={() => setActiveTab('edit')}
              className={`px-3.5 py-1.5 text-xs font-semibold rounded-lg transition-all cursor-pointer border border-transparent ${activeTab === 'edit' ? 'bg-white text-gray-900 border-gray-100 shadow-2xs' : 'text-gray-400 hover:text-gray-600'}`}
            >
              Write content
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

          {/* Quick Actions */}
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
            <span>Save post</span>
          </button>
        </div>
      </div>

      {activeTab === 'edit' ? (
        <form onSubmit={(e) => e.preventDefault()} className="grid grid-cols-1 lg:grid-cols-10 gap-10">
          
          {/* LEFT 70% PANEL: Editor content (Plain layout, nested card removed) */}
          <div className="lg:col-span-7 space-y-6">
            
            {/* Title Input Field */}
            <div className="space-y-2">
              <label className="text-xs font-semibold text-gray-500 ml-1">Title</label>
              <input 
                type="text"
                required
                placeholder="Title of your story..."
                value={formData.title}
                onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                className="w-full px-4 py-3 bg-white border border-gray-100 rounded-xl text-sm font-medium focus:border-gray-200 outline-none transition-all text-gray-900 placeholder:text-gray-400"
              />
            </div>

            {/* Body Text Editor */}
            <div className="space-y-2">
              <label className="text-xs font-semibold text-gray-500 ml-1">Content</label>
              
              {/* Flat Formatting Toolbar */}
              <div className="flex flex-wrap items-center gap-1 bg-white border border-gray-100 rounded-xl p-1.5">
                <button 
                  type="button" 
                  onClick={() => applyFormat('bold')}
                  className="p-2 hover:bg-gray-50 text-gray-600 rounded-lg transition-all cursor-pointer border-0 bg-transparent"
                  title="Bold"
                >
                  <Bold className="w-4 h-4" />
                </button>
                <button 
                  type="button" 
                  onClick={() => applyFormat('italic')}
                  className="p-2 hover:bg-gray-50 text-gray-600 rounded-lg transition-all cursor-pointer border-0 bg-transparent"
                  title="Italic"
                >
                  <Italic className="w-4 h-4" />
                </button>
                <div className="h-4 w-px bg-gray-200 mx-1" />
                <button 
                  type="button" 
                  onClick={() => applyFormat('formatBlock', '<h1>')}
                  className="p-2 hover:bg-gray-50 text-gray-600 rounded-lg transition-all cursor-pointer border-0 bg-transparent"
                  title="Heading 1"
                >
                  <Heading1 className="w-4 h-4" />
                </button>
                <button 
                  type="button" 
                  onClick={() => applyFormat('formatBlock', '<h2>')}
                  className="p-2 hover:bg-gray-50 text-gray-600 rounded-lg transition-all cursor-pointer border-0 bg-transparent"
                  title="Heading 2"
                >
                  <Heading2 className="w-4 h-4" />
                </button>
                <div className="h-4 w-px bg-gray-200 mx-1" />
                <button 
                  type="button" 
                  onClick={() => applyFormat('insertUnorderedList')}
                  className="p-2 hover:bg-gray-50 text-gray-600 rounded-lg transition-all cursor-pointer border-0 bg-transparent"
                  title="Bullet list"
                >
                  <List className="w-4 h-4" />
                </button>
                <button 
                  type="button" 
                  onClick={() => applyFormat('insertOrderedList')}
                  className="p-2 hover:bg-gray-50 text-gray-600 rounded-lg transition-all cursor-pointer border-0 bg-transparent"
                  title="Numbered list"
                >
                  <ListOrdered className="w-4 h-4" />
                </button>
                <button 
                  type="button" 
                  onClick={() => applyFormat('formatBlock', '<blockquote>')}
                  className="p-2 hover:bg-gray-50 text-gray-600 rounded-lg transition-all cursor-pointer border-0 bg-transparent"
                  title="Blockquote"
                >
                  <Quote className="w-4 h-4" />
                </button>
                <div className="h-4 w-px bg-gray-200 mx-1" />
                <button 
                  type="button" 
                  onClick={() => {
                    const url = prompt('Enter link URL:');
                    if (url) applyFormat('createLink', url);
                  }}
                  className="p-2 hover:bg-gray-50 text-gray-600 rounded-lg transition-all cursor-pointer border-0 bg-transparent"
                  title="Hyperlink"
                >
                  <LinkIcon className="w-4 h-4" />
                </button>

                {/* 961 Ecosystem Search & Embed button on the far right end */}
                <button 
                  type="button" 
                  onClick={() => setIsEcosystemModalOpen(true)}
                  className="ml-auto px-3 py-1.5 text-[#FF0000] hover:text-red-700 transition-all cursor-pointer border-0 bg-transparent text-xs font-bold"
                  title="961 Embed"
                >
                  961
                </button>
              </div>

              {/* Content input contentEditable area */}
              <div 
                ref={editorRef}
                contentEditable
                onInput={(e) => setFormData(prev => ({ ...prev, content: e.currentTarget.innerHTML }))}
                className="w-full min-h-[480px] p-4 bg-white border border-gray-100 rounded-xl text-sm font-medium leading-relaxed outline-none focus:border-gray-200 transition-all font-sans text-gray-800 overflow-y-auto prose max-w-none focus:ring-0 [&_h1]:text-xl [&_h1]:font-semibold [&_h1]:mt-4 [&_h1]:mb-2 [&_h2]:text-lg [&_h2]:font-semibold [&_h2]:mt-3 [&_h2]:mb-2 [&_blockquote]:border-l-4 [&_blockquote]:border-gray-200 [&_blockquote]:pl-4 [&_blockquote]:italic [&_ul]:list-disc [&_ul]:pl-5 [&_ol]:list-decimal [&_ol]:pl-5 [&_a]:text-[#FF0000] [&_a]:underline"
                style={{ minHeight: '480px' }}
              />
            </div>

          </div>

          {/* RIGHT 30% PANEL: Settings, Authors & Keywords (Unified Bento-Card Layout) */}
          <div className="lg:col-span-3">
            <div className="bento-card p-6 space-y-6">
              
              {/* 1. Status & Publishing Details (Moved to top of sidebar) */}
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
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-gray-400">Date</label>
                      <input 
                        type="date"
                        value={formData.scheduleDate}
                        onChange={(e) => setFormData(p => ({ ...p, scheduleDate: e.target.value }))}
                        className="w-full px-4 py-2 bg-gray-50 border border-transparent rounded-xl text-xs font-semibold outline-none focus:bg-white focus:border-gray-200"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-gray-400">Time</label>
                      <input 
                        type="time"
                        value={formData.scheduleTime}
                        onChange={(e) => setFormData(p => ({ ...p, scheduleTime: e.target.value }))}
                        className="w-full px-4 py-2 bg-gray-50 border border-transparent rounded-xl text-xs font-semibold outline-none focus:bg-white focus:border-gray-200"
                      />
                    </div>
                  </div>
                )}
              </div>

              <div className="border-t border-gray-100/80 my-4" />

              {/* 2. Cover Image Box */}
              <div className="space-y-2">
                <label className="text-xs font-semibold text-gray-500 ml-1">Cover Image</label>
                
                <div 
                  onClick={() => setIsMediaModalOpen(true)}
                  className="relative aspect-[3/4] w-full max-w-[180px] mx-auto bg-gray-50 hover:bg-gray-100/30 border-2 border-dashed border-gray-100 rounded-xl overflow-hidden cursor-pointer group transition-all"
                >
                  {formData.image ? (
                    <>
                      <img 
                        src={formData.image} 
                        alt="Cover portrait" 
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
                        referrerPolicy="no-referrer"
                      />
                      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                        <span className="text-white text-xs font-semibold bg-[#FF0000] px-3 py-1.5 rounded-lg">
                          Replace cover
                        </span>
                      </div>
                    </>
                  ) : (
                    <div className="absolute inset-0 flex flex-col items-center justify-center p-4 text-center">
                      <ImageIcon className="w-8 h-8 text-gray-300 mb-2 group-hover:text-[#FF0000] transition-colors" />
                      <span className="text-xs font-semibold text-gray-600 block">Choose cover image</span>
                      <span className="text-[10px] text-gray-400 mt-1 block">Magazine portrait (3:4)</span>
                    </div>
                  )}
                </div>
              </div>

              <div className="border-t border-gray-100/80 my-4" />

              {/* 3. Multiple Section Grid Buttons */}
              <div className="space-y-3">
                <label className="text-xs font-semibold text-gray-500 ml-1">Sections</label>

                {/* Elegant Section Bento Toggle Options */}
                <div className="flex flex-wrap gap-2">
                  {allCategories.map((cat) => {
                    const isSelected = formData.categories.includes(cat.name);
                    return (
                      <button
                        key={cat.name}
                        type="button"
                        onClick={() => handleCategoryToggle(cat.name)}
                        className={`flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-semibold border transition-all cursor-pointer ${
                          isSelected 
                            ? 'bg-[#FF0000] text-white border-[#FF0000]' 
                            : 'bg-gray-50 text-gray-600 hover:bg-gray-100 border-transparent'
                        }`}
                      >
                        <span>{cat.name}</span>
                        {isSelected && <Check className="w-3.5 h-3.5 shrink-0 text-white" />}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="border-t border-gray-100/80 my-4" />

              {/* 4. Authors List: Search & Select, Current User Defaulted */}
              <div className="space-y-3">
                <label className="text-xs font-semibold text-gray-500 ml-1">Authors</label>
                
                {/* Simple inline search tool */}
                <div className="relative">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input 
                    type="text"
                    placeholder="Search and select authors..."
                    value={authorSearch}
                    onChange={(e) => setAuthorSearch(e.target.value)}
                    className="w-full pl-11 pr-4 py-2.5 bg-gray-50 border border-transparent rounded-xl text-xs font-semibold outline-none focus:bg-white focus:border-gray-200 transition-all"
                  />
                </div>

                {/* Scrollable grid list of filtered team members */}
                <div className="space-y-1.5 max-h-[160px] overflow-y-auto pr-1 custom-scrollbar">
                  {filteredAuthors.map((member) => {
                    const isSelected = formData.selectedAuthors.includes(member.name);
                    return (
                      <div 
                        key={member.id}
                        onClick={() => handleAuthorToggle(member.name)}
                        className="flex items-center justify-between p-2 rounded-xl cursor-pointer transition-all border border-transparent hover:bg-gray-50"
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
                        
                        {/* Simple Flat Check Indicator (No Outline, Fill, or Name color change) */}
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

              <div className="border-t border-gray-100/80 my-4" />

              {/* 5. Keywords Container with AI Keywords Generation */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-semibold text-gray-500 ml-1">Keywords</label>
                  <button
                    type="button"
                    onClick={generateAIKeywords}
                    disabled={isGeneratingKeywords}
                    className="text-[11px] font-bold text-[#FF0000] hover:text-red-700 flex items-center gap-1 transition-colors bg-red-50 border border-red-100/50 px-2.5 py-1 rounded-lg cursor-pointer"
                  >
                    {isGeneratingKeywords && <div className="w-3 h-3 border-2 border-primary border-t-transparent rounded-full animate-spin" />}
                    <span>{isGeneratingKeywords ? 'Extracting...' : 'Suggest'}</span>
                  </button>
                </div>

                {/* Keywords Input bar (Integrated "Add" inside the field) */}
                <div className="relative flex items-center">
                  <input 
                    type="text"
                    placeholder="Add custom keyword..."
                    value={formData.newKeywordInput}
                    onChange={(e) => setFormData(p => ({ ...p, newKeywordInput: e.target.value }))}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        addCustomKeyword();
                      }
                    }}
                    className="w-full pl-4 pr-14 py-2.5 bg-gray-50 border border-transparent rounded-xl text-xs font-semibold outline-none focus:bg-white focus:border-gray-200 transition-all text-gray-800 placeholder:text-gray-400"
                  />
                  <button
                    type="button"
                    onClick={addCustomKeyword}
                    className="absolute right-1.5 top-1/2 -translate-y-1/2 px-2.5 py-1.5 bg-gray-900 hover:bg-black text-white rounded-lg text-[10px] font-bold transition-all cursor-pointer border-0"
                  >
                    Add
                  </button>
                </div>

                {/* Keywords Badge Container */}
                <div className="flex flex-wrap gap-1.5 pt-1">
                  {formData.keywords.map((kw) => (
                    <span 
                      key={kw} 
                      className="flex items-center gap-1.5 px-3 py-1 bg-gray-50 border border-gray-100 text-xs font-semibold text-gray-600 rounded-full"
                    >
                      <span>{kw}</span>
                      <button 
                        type="button" 
                        onClick={() => removeKeyword(kw)}
                        className="hover:text-primary transition-colors text-gray-400 cursor-pointer border-0 bg-transparent"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </span>
                  ))}
                  {formData.keywords.length === 0 && (
                    <span className="text-xs text-gray-400 italic">No keywords added yet</span>
                  )}
                </div>
              </div>

            </div>
          </div>

        </form>
      ) : activeTab === 'preview' ? (
        /* PREVIEW TAB WORKSPACE - Matches Public Article Page Layout */
        <div className="max-w-4xl mx-auto bg-white rounded-3xl border border-gray-100 p-6 sm:p-10 space-y-10">
          
          {/* Header Section */}
          <header className="space-y-6 max-w-[690px] mx-auto">
            {/* Section Tag Badge ABOVE Image */}
            <div className="flex flex-wrap items-center gap-2">
              {formData.categories.map((c) => (
                <span key={c} className="text-[10px] font-bold uppercase tracking-wider text-primary bg-red-50 border border-red-100 px-2.5 py-1 rounded-md">
                  {c}
                </span>
              ))}
            </div>

            {/* Featured Image - Top half only */}
            <div className="w-full overflow-hidden rounded-3xl border border-gray-100 h-64 sm:h-80 md:h-[380px] bg-gray-100">
              {formData.image ? (
                <img 
                  src={formData.image} 
                  alt={formData.title || 'Story cover'} 
                  className="w-full h-full object-cover object-top transition-transform duration-500 hover:scale-[1.01]"
                  referrerPolicy="no-referrer"
                />
              ) : (
                <div className="w-full h-full flex flex-col items-center justify-center text-gray-400">
                  <ImageIcon className="w-8 h-8 mb-2" />
                  <span className="text-xs font-semibold">No cover image selected</span>
                </div>
              )}
            </div>

            {/* Headline */}
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-black leading-[1.2] mb-3 tracking-tight text-gray-900">
              {formData.title || 'Untitled Narrative'}
            </h1>

            {/* Author & Sleek Share Row - Aligned with updated Article Page */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 py-3.5 border-y border-gray-100">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center text-xs font-bold text-gray-700">
                  {formData.selectedAuthors[0]?.charAt(0) || 'A'}
                </div>
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-gray-900 text-xs font-semibold">
                    {formData.selectedAuthors.join(', ') || 'The 961 Editorial'}
                  </span>
                  <span className="text-gray-300 text-xs">•</span>
                  <span className="text-gray-500 text-xs font-normal">5 min read</span>
                  <span className="text-gray-300 text-xs">•</span>
                  <span className="text-gray-500 text-xs font-normal">{formData.scheduleDate || 'Today, Mar 28, 2026'}</span>
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

          {/* Article Body - Constrained Width (690px) */}
          <div className="prose prose-base max-w-[690px] mx-auto px-2 md:px-0 text-gray-800 font-sans [&_p]:text-base [&_p]:sm:text-lg [&_p]:leading-[1.85] [&_h1]:text-2xl [&_h1]:font-black [&_h1]:tracking-tight [&_h1]:mt-6 [&_h1]:mb-3 [&_h2]:text-xl [&_h2]:font-bold [&_h2]:tracking-tight [&_h2]:mt-5 [&_h2]:mb-2 [&_blockquote]:border-l-4 [&_blockquote]:border-primary [&_blockquote]:pl-4 [&_blockquote]:italic [&_ul]:list-disc [&_ul]:pl-5 [&_ol]:list-decimal [&_ol]:pl-5 [&_a]:text-primary [&_a]:underline">
            {formData.content ? (
              <div dangerouslySetInnerHTML={{ __html: formData.content }} />
            ) : (
              <p className="text-sm text-gray-400 italic">No narrative content has been written yet. Return to the editor tab to draft your story.</p>
            )}
          </div>

          {/* Footer Share - Compact height */}
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

          {/* Ad Placement after Share this Story - AdSense Display Banner */}
          <div className="max-w-[690px] mx-auto">
            <AdBanner format="responsive" adSlotId="preview-bottom" className="w-full" />
          </div>

        </div>
      ) : (
        /* SOCIAL & SEO SNIPPETS TAB WORKSPACE */
        <div className="max-w-5xl mx-auto">
          <SocialPreviewValidator
            title={formData.title}
            excerpt={formData.excerpt}
            content={formData.content}
            image={formData.image}
            sections={formData.categories}
            keywords={formData.keywords}
            author={formData.selectedAuthors}
          />
        </div>
      )}

      {/* PORTRAIT MEDIA CHOOSE MODAL SELECTOR */}
      {isMediaModalOpen && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
          <div className="bg-white rounded-xl max-w-xl w-full border border-gray-200 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
              <h3 className="text-sm font-semibold text-gray-900">Select portrait cover</h3>
              <button 
                type="button"
                onClick={() => setIsMediaModalOpen(false)}
                className="p-1 hover:bg-gray-100 rounded-lg text-gray-400 hover:text-gray-600 transition-colors cursor-pointer border-0 bg-transparent"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Media Tabs */}
            <div className="flex border-b border-gray-100 px-6">
              <button
                type="button"
                onClick={() => setMediaTab('presets')}
                className={`px-4 py-2 text-xs font-semibold border-b-2 transition-all cursor-pointer bg-transparent border-0 ${
                  mediaTab === 'presets' ? 'border-[#FF0000] text-gray-900' : 'border-transparent text-gray-400 hover:text-gray-600'
                }`}
              >
                Preset Lebanese scenery
              </button>
              <button
                type="button"
                onClick={() => setMediaTab('upload')}
                className={`px-4 py-2 text-xs font-semibold border-b-2 transition-all cursor-pointer bg-transparent border-0 ${
                  mediaTab === 'upload' ? 'border-[#FF0000] text-gray-900' : 'border-transparent text-gray-400 hover:text-gray-600'
                }`}
              >
                Upload cover (3:4 format)
              </button>
            </div>

            <div className="p-6">
              {mediaTab === 'presets' ? (
                <div className="grid grid-cols-3 gap-3">
                  {verticalPresets.map((preset) => (
                    <button
                      key={preset.name}
                      type="button"
                      onClick={() => {
                        setFormData(prev => ({ ...prev, image: preset.url }));
                        setIsMediaModalOpen(false);
                      }}
                      className="group relative aspect-[3/4] rounded-xl overflow-hidden border border-gray-100 hover:border-[#FF0000] transition-all text-left bg-transparent p-0 cursor-pointer"
                    >
                      <img 
                        src={preset.url} 
                        alt={preset.name} 
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" 
                        referrerPolicy="no-referrer"
                      />
                      <div className="absolute inset-0 bg-black/40 flex items-end p-3 opacity-80 group-hover:opacity-100 transition-opacity">
                        <span className="text-xs font-semibold text-white leading-tight">
                          {preset.name}
                        </span>
                      </div>
                    </button>
                  ))}
                </div>
              ) : (
                /* Interactive Drag & Drop / Direct File select upload */
                <div 
                  onDragOver={handleDragOver}
                  onDrop={handleDrop}
                  className="border-2 border-dashed border-gray-100 rounded-xl p-8 text-center bg-gray-50/50 hover:bg-gray-50 hover:border-[#FF0000] transition-colors group relative"
                >
                  <input 
                    type="file"
                    accept="image/*"
                    id="file-upload"
                    onChange={handleLocalImageUpload}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  />
                  <Upload className="w-8 h-8 text-gray-300 mx-auto mb-2 group-hover:text-[#FF0000] transition-colors" />
                  <p className="text-xs font-semibold text-gray-700">Drag and drop your image here</p>
                  <p className="text-[10px] text-gray-400 mt-1">Or click to browse your local files</p>
                  <p className="text-xs text-[#FF0000] mt-3 font-semibold">Supports PNG, JPG, JPEG, WEBP</p>
                </div>
              )}
            </div>
            
            <div className="px-6 py-4 bg-gray-50/50 border-t border-gray-100 flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setIsMediaModalOpen(false)}
                className="px-4 py-2 border border-gray-100 rounded-xl text-xs font-semibold text-gray-500 hover:bg-white transition-colors cursor-pointer bg-transparent"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 961 Ecosystem Search & Embed Modal */}
      {isEcosystemModalOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl w-full max-w-2xl overflow-hidden border border-gray-200 flex flex-col max-h-[85vh]">
            
            {/* Header */}
            <div className="px-6 py-5 border-b border-gray-100 flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-gray-900">
                  961 Embed
                </h3>
              </div>
              <button 
                type="button"
                onClick={() => {
                  setIsEcosystemModalOpen(false);
                  setEcosystemSearch('');
                  setEcosystemCategory('All');
                }}
                className="p-1.5 hover:bg-gray-100 rounded-lg text-gray-400 hover:text-gray-700 transition-colors border-0 bg-transparent cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Filter and Search Bar */}
            <div className="p-5 bg-gray-50/50 border-b border-gray-100 space-y-3">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input 
                  type="text"
                  placeholder="Search spots, food, creators, hotels..."
                  value={ecosystemSearch}
                  onChange={(e) => setEcosystemSearch(e.target.value)}
                  className="w-full pl-11 pr-4 py-2.5 bg-white border border-gray-200/80 rounded-2xl text-xs font-semibold outline-none focus:border-[#FF0000] focus:ring-1 focus:ring-[#FF0000]/20 transition-all text-gray-800 placeholder:text-gray-400"
                />
              </div>

              {/* Categorization tabs */}
              <div className="flex flex-wrap gap-1.5">
                {(['All', 'Restaurant', 'Nightlife', 'Creators', 'Stays'] as const).map((cat) => (
                  <button
                    key={cat}
                    type="button"
                    onClick={() => setEcosystemCategory(cat)}
                    className={`px-3 py-1.5 rounded-xl text-[11px] font-bold transition-all cursor-pointer border ${
                      ecosystemCategory === cat 
                        ? 'bg-[#FF0000] text-white border-[#FF0000]' 
                        : 'bg-white text-gray-500 hover:bg-gray-50 border-gray-100'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            {/* Scrollable list of items */}
            <div className="p-5 overflow-y-auto flex-1 space-y-4 custom-scrollbar max-h-[400px]">
              {filteredEcosystemItems.map((item) => (
                <div 
                  key={item.id}
                  className="p-3 bg-white border border-gray-100 rounded-2xl flex flex-row items-center gap-3 hover:border-gray-200 transition-all group"
                >
                  <img 
                    src={item.image} 
                    alt={item.name}
                    className="w-12 h-12 rounded-lg object-cover shrink-0"
                    referrerPolicy="no-referrer"
                  />
                  <div className="flex-1 min-w-0">
                    <h4 className="text-sm font-bold text-gray-900 group-hover:text-[#FF0000] transition-colors truncate">
                      {item.name}
                    </h4>
                    <p className="text-[11px] text-gray-500 font-medium truncate mt-0.5">{item.location}</p>
                  </div>

                  <div className="flex justify-end pt-2 border-t border-gray-50">
                    <button
                      type="button"
                      onClick={() => {
                        const embedHtml = `
                          <div class="not-prose my-6 bg-white border border-gray-100 rounded-2xl overflow-hidden" style="font-family: 'Inter', sans-serif; max-width: 400px;">
                            <img src="${item.image}" alt="${item.name}" class="w-full h-auto" style="margin: 0; display: block;" />
                            <div class="p-5">
                              <div class="flex items-center justify-between gap-4">
                                  <span style="font-weight: 700; font-size: 18px; color: #111827;">${item.name}</span>
                                  <a href="${item.url}" target="_blank" rel="noopener noreferrer" style="display: inline-block; font-weight: 700; font-size: 12px; background-color: #FF0000; color: #ffffff; padding: 6px 16px; border-radius: 8px; text-decoration: none; transition: background-color 0.2s;">
                                  ${item.cta}
                                  </a>
                              </div>
                              <p style="font-weight: 500; font-size: 13px; color: #4b5563; margin: 8px 0 0 0;">${item.location} • ${item.meta}</p>
                            </div>
                          </div>
                          <p>&nbsp;</p>
                        `;
                        insertHtmlAtCursor(embedHtml);
                        setIsEcosystemModalOpen(false);
                        setEcosystemSearch('');
                        setEcosystemCategory('All');
                      }}
                      className="px-3 py-1.5 bg-gray-900 hover:bg-[#FF0000] text-white hover:text-white rounded-lg text-[10px] font-bold transition-all cursor-pointer border-0 flex items-center gap-1"
                    >
                      <span>Embed</span>
                    </button>
                  </div>
                </div>
              ))}
              {filteredEcosystemItems.length === 0 && (
                <div className="text-center py-10">
                  <p className="text-xs text-gray-400 italic">No ecosystem resources found matching search filters</p>
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="px-6 py-4 bg-gray-50 border-t border-gray-100 flex justify-end">
              <button
                type="button"
                onClick={() => {
                  setIsEcosystemModalOpen(false);
                  setEcosystemSearch('');
                  setEcosystemCategory('All');
                }}
                className="px-4 py-2 bg-white hover:bg-gray-50 border border-gray-200 text-gray-500 rounded-xl text-xs font-semibold transition-colors cursor-pointer"
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

import { ReactNode, useState, useRef, useEffect, useMemo } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { 
  LayoutDashboard, 
  FileText, 
  Layers, 
  Image as ImageIcon, 
  Copy, 
  Users, 
  LogOut, 
  TrendingUp, 
  Lightbulb, 
  X, 
  Zap, 
  ListTree, 
  ChevronRight,
  ChevronUp,
  ChevronDown,
  Bot,
  Globe,
  Mail,
  Megaphone
} from 'lucide-react';
import { useLocationContext } from '../../context/LocationContext';
import LocationDropdown from '../common/LocationDropdown';
import { FlagIcon } from '../common/FlagIcon';
import { usePostContext } from './posts/PostContext';
import { initialPosts } from './posts/mockData';
import { getAvailableLanguagesForLocation } from '../../utils/contentVisibility';
import { SUPPORTED_LANGUAGES } from '../../types/location';

interface SidebarItemProps {
  key?: string;
  to: string;
  icon: any;
  label: string;
  active?: boolean;
  hasUnread?: boolean;
  count?: number;
}

function SidebarItem({ to, icon: Icon, label, active, hasUnread, count }: SidebarItemProps) {
  return (
    <Link
      to={to}
      className={`flex items-center gap-3 px-4 py-2.5 rounded-xl transition-all duration-200 group relative ${
        active 
          ? 'bg-red-50 text-[#FF0000]' 
          : 'text-gray-500 hover:text-gray-900 hover:bg-gray-50'
      }`}
    >
      <div className="relative shrink-0 flex items-center justify-center">
        <Icon className={`w-4 h-4 transition-transform duration-200 ${active ? 'text-[#FF0000] scale-105' : 'text-gray-400 group-hover:text-gray-700 group-hover:scale-105'}`} />
        {/* Red indicator dot on top-right corner of the icon */}
        {hasUnread && (
          <span className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-[#FF0000] ring-2 ring-white" />
        )}
      </div>

      <span className={`text-[13px] tracking-tight transition-all duration-200 ${active ? 'font-semibold' : 'font-medium'}`}>{label}</span>

      {/* Solid red counter badge with white number */}
      {count !== undefined && count > 0 && (
        <span className="ml-auto px-1.5 py-0.5 rounded-full text-[10px] font-bold leading-none shrink-0 bg-[#FF0000] text-white">
          {count}
        </span>
      )}
    </Link>
  );
}

export default function DashboardLayout({ children }: { children: ReactNode }) {
  const location = useLocation();
  const navigate = useNavigate();
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [isLocationDropdownOpen, setIsLocationDropdownOpen] = useState(false);
  const [isLangMenuOpen, setIsLangMenuOpen] = useState(false);
  const langMenuRef = useRef<HTMLDivElement>(null);

  const { locations, activeLocation, activeLanguage, activeLanguageInfo, setActiveLanguage } = useLocationContext();

  let posts = initialPosts;
  try {
    const postCtx = usePostContext();
    if (postCtx && postCtx.posts) {
      posts = postCtx.posts;
    }
  } catch {
    posts = initialPosts;
  }

  // Dynamic available languages based on published articles for this location
  const availableLangCodes = useMemo(() => {
    return getAvailableLanguagesForLocation(activeLocation, locations, posts);
  }, [activeLocation, locations, posts]);

  const dynamicAvailableLanguages = useMemo(() => {
    return availableLangCodes.map(code => SUPPORTED_LANGUAGES[code]).filter(Boolean);
  }, [availableLangCodes]);

  // If activeLanguage not available in current location, sync it
  useEffect(() => {
    if (availableLangCodes.length > 0 && !availableLangCodes.includes(activeLanguage)) {
      setActiveLanguage(availableLangCodes[0]);
    }
  }, [availableLangCodes, activeLanguage, setActiveLanguage]);

  // Close lang menu if clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (langMenuRef.current && !langMenuRef.current.contains(event.target as Node)) {
        setIsLangMenuOpen(false);
      }
    };
    if (isLangMenuOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isLangMenuOpen]);

  // Sidebar items with Messages moved to the end
  const menuItems = [
    { to: '/dashboard', icon: LayoutDashboard, label: 'Overview' },
    { to: '/dashboard/posts', icon: FileText, label: 'Posts' },
    { to: '/dashboard/ads', icon: Megaphone, label: 'Ad Requests', count: 4 },
    { to: '/dashboard/sections', icon: Layers, label: 'Sections' },
    { to: '/dashboard/analytics', icon: TrendingUp, label: 'Analytics' },
    { to: '/dashboard/ideas', icon: Lightbulb, label: 'Ideas' },
    { to: '/dashboard/media', icon: ImageIcon, label: 'Media' },
    { to: '/dashboard/pages', icon: Copy, label: 'Pages' },
    { to: '/dashboard/team', icon: Users, label: 'Team' },
    { to: '/dashboard/locations', icon: Globe, label: 'Locations' },
    { to: '/dashboard/ai', icon: Bot, label: 'AI' },
    { to: '/dashboard/messages', icon: Mail, label: 'Messages', hasUnread: true },
  ];

  const handleSelectCreateType = (type: 'express' | 'article' | 'listicle') => {
    setIsCreateModalOpen(false);
    if (type === 'express') {
      navigate('/dashboard/create/express');
    } else if (type === 'article') {
      navigate('/dashboard/create/article');
    } else if (type === 'listicle') {
      navigate('/dashboard/create/listicle');
    }
  };

  const isCreatePage = location.pathname.startsWith('/dashboard/create') || 
                       location.pathname === '/dashboard/posts/create' ||
                       location.pathname.startsWith('/create') ||
                       location.pathname === '/posts/create';

  return (
    <div className="min-h-screen bg-white flex font-sans dashboard-root">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r border-gray-100 flex flex-col shrink-0 sticky top-0 h-screen z-20">
        {/* Sidebar Header with 961 Logo & Location/Language Switcher matching Home */}
        <div className="p-5 pb-4 border-b border-gray-100 flex items-center justify-between gap-2 relative">
          <Link to="/dashboard" className="text-2xl font-bold text-primary tracking-tighter hover:scale-105 transition-transform shrink-0">
            961
          </Link>

          {/* Location & Language Switcher */}
          <div className="flex items-center gap-1 shrink-0">
            {/* Location Trigger */}
            <button
              type="button"
              onClick={() => setIsLocationDropdownOpen(!isLocationDropdownOpen)}
              className="flex items-center gap-1.5 px-2 py-1 rounded-lg text-xs font-semibold text-gray-800 hover:bg-gray-100 transition-colors cursor-pointer"
              title="Change location"
            >
              {activeLocation ? (
                <>
                  {activeLocation.level === 'topic' ? (
                    <span className="text-xs">{activeLocation.flagEmoji}</span>
                  ) : (
                    <FlagIcon countryCode={activeLocation.countryCode} className="w-4 h-3 shrink-0" />
                  )}
                  <span className="truncate max-w-[70px]">{activeLocation.name}</span>
                </>
              ) : (
                <>
                  <FlagIcon countryCode="LB" className="w-4 h-3 shrink-0" />
                  <span className="truncate max-w-[70px]">Lebanon</span>
                </>
              )}
              <ChevronDown className={`w-3 h-3 text-gray-400 transition-transform shrink-0 ${isLocationDropdownOpen ? 'rotate-180 text-primary' : ''}`} />
            </button>

            {/* Language Selector */}
            {dynamicAvailableLanguages && dynamicAvailableLanguages.length > 1 && (
              <div className="relative shrink-0 flex items-center" ref={langMenuRef}>
                <span className="text-gray-300 select-none text-xs mr-1">/</span>
                {!isLangMenuOpen ? (
                  <button
                    type="button"
                    onClick={() => setIsLangMenuOpen(true)}
                    className="flex items-center gap-0.5 px-1 py-1 rounded-lg text-xs font-semibold text-gray-800 hover:bg-gray-100 transition-colors cursor-pointer"
                    title="Change language"
                  >
                    <span>{activeLanguageInfo.short}</span>
                    <ChevronDown className="w-2.5 h-2.5 text-gray-400 shrink-0" />
                  </button>
                ) : (
                  <div className="flex items-center gap-1 bg-gray-100 p-0.5 rounded-lg">
                    {dynamicAvailableLanguages.map((lang) => (
                      <button
                        key={lang.code}
                        type="button"
                        onClick={() => {
                          setActiveLanguage(lang.code);
                          setIsLangMenuOpen(false);
                        }}
                        className={`px-1.5 py-0.5 text-[10px] font-semibold rounded cursor-pointer transition-colors ${
                          activeLanguage === lang.code ? 'bg-[#FF0000] text-white' : 'text-gray-600 hover:text-gray-900'
                        }`}
                      >
                        {lang.short}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Location Dropdown floating menu (no topics, no beta/soon/new badges) */}
          <LocationDropdown 
            isOpen={isLocationDropdownOpen} 
            onClose={() => setIsLocationDropdownOpen(false)} 
            hideTopics={true}
            hideBadges={true}
            className="absolute top-full left-2 z-50 mt-1.5 w-[320px] bg-white border border-gray-200 rounded-xl shadow-2xl overflow-hidden animate-in fade-in slide-in-from-top-1 duration-150"
          />
        </div>

        {/* Sidebar Create Button */}
        <div className="px-5 pt-3 pb-2">
          <button
            type="button"
            onClick={() => setIsCreateModalOpen(true)}
            className="w-full bg-[#FF0000] hover:bg-red-700 text-white py-2.5 px-4 rounded-xl font-semibold text-xs tracking-tight transition-all active:scale-95 flex items-center justify-center cursor-pointer shadow-2xs"
          >
            <span>Create</span>
          </button>
        </div>

        {/* Navigation Menu */}
        <nav className="flex-1 px-5 py-2 space-y-1 overflow-y-auto">
          {menuItems.map((item) => (
            <SidebarItem
              key={item.to}
              to={item.to}
              icon={item.icon}
              label={item.label}
              hasUnread={item.hasUnread}
              count={item.count}
              active={
                location.pathname === item.to || 
                (item.to !== '/dashboard' && location.pathname.startsWith(item.to + '/')) ||
                location.pathname === item.to.replace('/dashboard', '') ||
                (item.to !== '/dashboard' && location.pathname.startsWith(item.to.replace('/dashboard', '') + '/')) ||
                (item.to === '/dashboard' && location.pathname === '/')
              }
            />
          ))}
        </nav>

        {/* User Card */}
        <div className="p-3.5 border-t border-gray-100 mt-auto bg-gray-50/30 relative">
          <div className="relative">
            <button
              type="button"
              onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
              className="w-full flex items-center gap-2.5 p-2 rounded-xl hover:bg-gray-100/80 transition-all text-left cursor-pointer group"
            >
              <img 
                src="https://picsum.photos/seed/anthony/100/100" 
                alt="Anthony Rahayel" 
                className="w-8 h-8 rounded-full object-cover shrink-0 border border-gray-200"
                referrerPolicy="no-referrer"
              />
              <div className="min-w-0 flex-1">
                <p className="text-xs font-semibold text-gray-900 leading-tight truncate group-hover:text-primary transition-colors">Anthony Rahayel</p>
                <p className="text-[10px] font-medium text-gray-400 truncate">Editor-in-Chief</p>
              </div>
              <ChevronUp className={`w-3.5 h-3.5 text-gray-400 group-hover:text-gray-600 transition-transform duration-200 ${isUserMenuOpen ? 'rotate-180' : ''}`} />
            </button>

            {/* Logout Dropdown */}
            {isUserMenuOpen && (
              <>
                <div 
                  className="fixed inset-0 z-20" 
                  onClick={() => setIsUserMenuOpen(false)} 
                />
                <div className="absolute bottom-full left-0 right-0 mb-2 p-1 bg-white rounded-2xl shadow-lg border border-gray-100 z-30 animate-fade-in">
                  <button
                    type="button"
                    onClick={() => {
                      setIsUserMenuOpen(false);
                      navigate('/');
                    }}
                    className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-medium text-red-600 hover:bg-red-50 transition-colors cursor-pointer text-left"
                  >
                    <LogOut className="w-3.5 h-3.5 text-red-600" />
                    <span>Log out</span>
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto">
        {!isCreatePage && (
          <header className="bg-white/80 backdrop-blur-md border-b border-gray-100 px-10 py-5 flex items-center justify-between sticky top-0 z-10">
            <div className="flex items-center gap-6">
              <h1 className="text-2xl font-bold tracking-tight text-gray-900">
                {menuItems.find(item => item.to === location.pathname || (item.to !== '/dashboard' && location.pathname.startsWith(item.to)))?.label || 'Dashboard'}
              </h1>
              {location.pathname === '/dashboard' && (
                <div className="flex items-center gap-2.5 text-green-600">
                  <div className="relative">
                    <div className="w-2 h-2 rounded-full bg-green-500 animate-ping absolute inset-0" />
                    <div className="w-2 h-2 rounded-full bg-green-500 relative" />
                  </div>
                  <span className="text-[10px] font-semibold tracking-wide">1,284 Live Readers</span>
                </div>
              )}
            </div>

            {/* Dashboard Header Actions portal target */}
            <div id="dashboard-header-actions" className="flex items-center gap-3"></div>
          </header>
        )}

        <div className="p-10 max-w-[1600px] mx-auto">
          {children}
        </div>
      </main>

      {/* Create Modal Dialogue */}
      {isCreateModalOpen && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-fade-in">
          <div className="bg-white rounded-3xl max-w-sm w-full p-6 space-y-4 shadow-xl border border-gray-100">
            <div className="flex items-center justify-end">
              <button 
                type="button" 
                onClick={() => setIsCreateModalOpen(false)}
                className="p-1.5 text-gray-400 hover:text-gray-600 rounded-full hover:bg-gray-100 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-2.5">
              {/* Option 1: Express */}
              <button
                type="button"
                onClick={() => handleSelectCreateType('express')}
                className="w-full p-3.5 rounded-2xl border border-gray-100 hover:border-gray-200 hover:bg-gray-50/70 transition-all text-left flex items-center justify-between group cursor-pointer"
              >
                <div className="flex items-center gap-3.5">
                  <div className="w-9 h-9 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center shrink-0">
                    <Zap className="w-4 h-4" />
                  </div>
                  <h4 className="text-sm font-bold text-gray-900 group-hover:text-amber-600 transition-colors">Express</h4>
                </div>
                <ChevronRight className="w-4 h-4 text-gray-300 group-hover:text-gray-600 group-hover:translate-x-0.5 transition-all" />
              </button>

              {/* Option 2: Article */}
              <button
                type="button"
                onClick={() => handleSelectCreateType('article')}
                className="w-full p-3.5 rounded-2xl border border-gray-100 hover:border-red-200 hover:bg-red-50/20 transition-all text-left flex items-center justify-between group cursor-pointer"
              >
                <div className="flex items-center gap-3.5">
                  <div className="w-9 h-9 rounded-xl bg-red-50 text-[#FF0000] flex items-center justify-center shrink-0">
                    <FileText className="w-4 h-4" />
                  </div>
                  <h4 className="text-sm font-bold text-gray-900 group-hover:text-[#FF0000] transition-colors">Article</h4>
                </div>
                <ChevronRight className="w-4 h-4 text-gray-300 group-hover:text-[#FF0000] group-hover:translate-x-0.5 transition-all" />
              </button>

              {/* Option 3: Listicle */}
              <button
                type="button"
                onClick={() => handleSelectCreateType('listicle')}
                className="w-full p-3.5 rounded-2xl border border-gray-100 hover:border-purple-200 hover:bg-purple-50/20 transition-all text-left flex items-center justify-between group cursor-pointer"
              >
                <div className="flex items-center gap-3.5">
                  <div className="w-9 h-9 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center shrink-0">
                    <ListTree className="w-4 h-4" />
                  </div>
                  <h4 className="text-sm font-bold text-gray-900 group-hover:text-purple-600 transition-colors">Listicle</h4>
                </div>
                <ChevronRight className="w-4 h-4 text-gray-300 group-hover:text-purple-600 group-hover:translate-x-0.5 transition-all" />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}


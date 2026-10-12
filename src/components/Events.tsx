import React, { useState, useMemo, useEffect, useRef } from 'react';
import {
  Search,
  Plus,
  Trophy,
  Calendar,
  Clock,
  ExternalLink,
  ChevronLeft,
  ChevronRight,
  SlidersHorizontal,
  X,
  Check,
  Radio,
  Swords,
  Flame,
  Award,
  Users,
  ShieldCheck,
  AlertCircle,
  Share2,
  Sparkles,
  ChevronDown,
  ArrowLeft,
  Upload,
  Image as ImageIcon,
  MessageSquare,
} from 'lucide-react';

export type EventStatus = 'ongoing' | 'upcoming' | 'completed';
export type EventFormat = '5v5 War' | '1v1 Showdown' | 'CWL Tournament' | 'Trophy Race' | 'All Formats';

export interface ClashEvent {
  id: string;
  title: string;
  hostName: string;
  hostAvatar?: string;
  hostVerified?: boolean;
  status: EventStatus;
  format: string;
  townHall: string;
  prizePool?: string;
  startDate: string;
  timeInfo: string;
  bannerUrl?: string;
  registrationUrl?: string;
  hostContact?: string;
  streamUrl?: string;
  description: string;
  participantsCount?: string;
  winner?: string;
  addedAt: number;
}

export const TOWNHALL_OPTIONS = [
  'TH18',
  'TH17',
  'TH16',
  'TH15',
  'TH14',
  'TH13',
  'TH12',
  'TH11',
  'TH10',
  'TH9',
  'TH8',
  'TH7',
  'TH6',
  'TH5',
  'TH4',
  'TH3',
  'TH2',
  'TH1',
];


const INITIAL_EVENTS: ClashEvent[] = [];

interface EventsProps {
  onNavigateHome?: () => void;
  onNavigateCreators?: () => void;
}

export const Events: React.FC<EventsProps> = ({ onNavigateHome, onNavigateCreators }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [formatFilter, setFormatFilter] = useState<string>('all');
  const [townHallFilter, setTownHallFilter] = useState<string>('all');
  const [isFilterOpen, setIsFilterOpen] = useState<boolean>(false);
  const [viewingCategory, setViewingCategory] = useState<'all' | 'ongoing' | 'upcoming' | 'completed'>('all');

  // Modal State
  const [isAddModalOpen, setIsAddModalOpen] = useState<boolean>(false);
  const [formSuccess, setFormSuccess] = useState<boolean>(false);
  const [formError, setFormError] = useState<string>('');

  // Form Fields
  const [title, setTitle] = useState<string>('');
  const [hostName, setHostName] = useState<string>('');
  const [status, setStatus] = useState<EventStatus>('upcoming');
  const [isStatusDropdownOpen, setIsStatusDropdownOpen] = useState<boolean>(false);
  const [format, setFormat] = useState<string>('');
  const [selectedTownHalls, setSelectedTownHalls] = useState<string[]>([]);
  const [isTownHallDropdownOpen, setIsTownHallDropdownOpen] = useState<boolean>(false);
  const [prizePool, setPrizePool] = useState<string>('');
  const [timeInfo, setTimeInfo] = useState<string>('');
  const [isCalendarOpen, setIsCalendarOpen] = useState<boolean>(false);
  const [calCurrentMonth, setCalCurrentMonth] = useState<Date>(() => new Date());
  const [hostContact, setHostContact] = useState<string>('');
  const [bannerUrl, setBannerUrl] = useState<string>('');
  const [registrationUrl, setRegistrationUrl] = useState<string>('');
  const [description, setDescription] = useState<string>('');

  const toggleTownHall = (th: string) => {
    setSelectedTownHalls((prev) => {
      let updated: string[];
      if (prev.includes(th)) {
        updated = prev.filter((item) => item !== th);
      } else {
        updated = [...prev, th];
      }
      updated.sort((a, b) => TOWNHALL_OPTIONS.indexOf(a) - TOWNHALL_OPTIONS.indexOf(b));
      return updated;
    });
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setFormError('Please select a valid image file (PNG, JPG, or WEBP).');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setFormError('Image size exceeds 5MB. Please upload a smaller banner.');
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const result = event.target?.result as string;
      if (result) {
        setBannerUrl(result);
        setFormError('');
      }
    };
    reader.readAsDataURL(file);
  };

  // References for horizontal scrolling rows
  const ongoingRowRef = useRef<HTMLDivElement>(null);
  const upcomingRowRef = useRef<HTMLDivElement>(null);
  const completedRowRef = useRef<HTMLDivElement>(null);

  // Events State (Persisted in localStorage)
  const [events, setEvents] = useState<ClashEvent[]>(() => {
    try {
      const saved = localStorage.getItem('clashnet_community_events_v2');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) {
          // Keep only user-created events, filter out mock/dummy events
          return parsed
            .filter((e: ClashEvent) => e.id?.startsWith('evt-user-'))
            .map((e: ClashEvent) => {
              if (
                e.bannerUrl ===
                'https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&w=1200&q=80'
              ) {
                return { ...e, bannerUrl: undefined };
              }
              return e;
            });
        }
      }
    } catch {
      // fallback
    }
    return INITIAL_EVENTS;
  });

  useEffect(() => {
    try {
      localStorage.setItem('clashnet_community_events_v2', JSON.stringify(events));
    } catch {
      // ignore
    }
  }, [events]);

  // Scroll to top on mount
  useEffect(() => {
    const lenis = (window as any).__lenis;
    if (lenis) lenis.scrollTo(0, { immediate: true });
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' as ScrollBehavior });
    document.documentElement.scrollTop = 0;
    document.body.scrollTop = 0;
  }, []);

  // Prevent background scroll and pause Lenis while the Add Event modal is open
  useEffect(() => {
    if (isAddModalOpen) {
      document.body.style.overflow = 'hidden';
      const lenis = (window as any).__lenis;
      if (lenis) lenis.stop();
    } else {
      document.body.style.overflow = '';
      const lenis = (window as any).__lenis;
      if (lenis) lenis.start();
    }

    return () => {
      document.body.style.overflow = '';
      const lenis = (window as any).__lenis;
      if (lenis) lenis.start();
    };
  }, [isAddModalOpen]);

  // Close filter dropdown on outside click
  useEffect(() => {
    if (!isFilterOpen) return;
    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (!target.closest('[data-event-filter-container]')) {
        setIsFilterOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isFilterOpen]);

  // Close Town Hall dropdown on outside click
  useEffect(() => {
    if (!isTownHallDropdownOpen) return;
    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (!target.closest('[data-th-dropdown]')) {
        setIsTownHallDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isTownHallDropdownOpen]);

  // Close Status dropdown on outside click
  useEffect(() => {
    if (!isStatusDropdownOpen) return;
    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (!target.closest('[data-status-dropdown]')) {
        setIsStatusDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isStatusDropdownOpen]);

  // Close Calendar dropdown on outside click
  useEffect(() => {
    if (!isCalendarOpen) return;
    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (!target.closest('[data-calendar-dropdown]')) {
        setIsCalendarOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isCalendarOpen]);

  // Calendar Helpers
  const calYear = calCurrentMonth.getFullYear();
  const calMonth = calCurrentMonth.getMonth();
  const calMonthName = calCurrentMonth.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
  const calFirstDay = new Date(calYear, calMonth, 1).getDay();
  const calTotalDays = new Date(calYear, calMonth + 1, 0).getDate();

  const calToday = new Date();
  const calTodayStr = `${calToday.getFullYear()}-${String(calToday.getMonth() + 1).padStart(2, '0')}-${String(calToday.getDate()).padStart(2, '0')}`;

  const formatFriendlyDate = (dateStr: string) => {
    if (!dateStr) return '';
    try {
      const [y, m, d] = dateStr.split('-').map(Number);
      if (!y || !m || !d) return dateStr;
      const dateObj = new Date(y, m - 1, d);
      return dateObj.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
      });
    } catch {
      return dateStr;
    }
  };

  const handleGoHome = (e?: React.MouseEvent) => {
    if (e) e.preventDefault();
    setViewingCategory('all');
    window.location.hash = '#home';
    const lenis = (window as any).__lenis;
    if (lenis) lenis.scrollTo(0, { immediate: true });
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' as ScrollBehavior });
    document.documentElement.scrollTop = 0;
    document.body.scrollTop = 0;
    if (onNavigateHome) {
      onNavigateHome();
    }
  };

  const handleGoCreators = (e?: React.MouseEvent) => {
    if (e) e.preventDefault();
    if (onNavigateCreators) {
      onNavigateCreators();
    } else {
      window.location.hash = '#creators';
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  // Horizontal scroll row helper
  const scrollRow = (ref: React.RefObject<HTMLDivElement>, direction: 'left' | 'right') => {
    if (ref.current) {
      const scrollAmount = direction === 'left' ? -380 : 380;
      ref.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  // Filtered Events
  const filteredEvents = useMemo(() => {
    return events.filter((evt) => {
      // Search Query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matches =
          evt.title.toLowerCase().includes(q) ||
          evt.hostName.toLowerCase().includes(q) ||
          evt.format.toLowerCase().includes(q) ||
          evt.townHall.toLowerCase().includes(q) ||
          (evt.prizePool && evt.prizePool.toLowerCase().includes(q)) ||
          evt.description.toLowerCase().includes(q);
        if (!matches) return false;
      }

      // Format Filter
      if (formatFilter !== 'all') {
        if (!evt.format.toLowerCase().includes(formatFilter.toLowerCase())) return false;
      }

      // Town Hall Filter
      if (townHallFilter !== 'all') {
        if (!evt.townHall.toLowerCase().includes(townHallFilter.toLowerCase())) return false;
      }

      return true;
    });
  }, [events, searchQuery, formatFilter, townHallFilter]);

  // Split into the 3 requested parts: Upcoming, Ongoing, Completed
  const ongoingEvents = useMemo(() => {
    return filteredEvents.filter((e) => e.status === 'ongoing');
  }, [filteredEvents]);

  const upcomingEvents = useMemo(() => {
    return filteredEvents.filter((e) => e.status === 'upcoming');
  }, [filteredEvents]);

  const completedEvents = useMemo(() => {
    return filteredEvents.filter((e) => e.status === 'completed');
  }, [filteredEvents]);

  // Active list when a category is selected via 'View More'
  const categoryEventsList = useMemo(() => {
    if (viewingCategory === 'ongoing') return ongoingEvents;
    if (viewingCategory === 'upcoming') return upcomingEvents;
    if (viewingCategory === 'completed') return completedEvents;
    return filteredEvents;
  }, [viewingCategory, ongoingEvents, upcomingEvents, completedEvents, filteredEvents]);

  const handleAddEventSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      setFormError('Please enter an event title.');
      return;
    }
    if (!hostName.trim()) {
      setFormError('Please enter the host or clan name.');
      return;
    }
    if (!format.trim()) {
      setFormError('Please specify the breakdown format (e.g. TH18 5v5, 2/2/1).');
      return;
    }
    if (selectedTownHalls.length === 0) {
      setFormError('Please select at least one applied townhall level.');
      return;
    }
    if (!timeInfo.trim()) {
      setFormError('Please select a registration ending date from the calendar.');
      return;
    }
    if (!hostContact.trim()) {
      setFormError('Please provide host contact details (Discord tag, WhatsApp no, or email).');
      return;
    }
    if (!registrationUrl.trim()) {
      setFormError('Please provide a registration link.');
      return;
    }

    const now = Date.now();
    let displayDate = timeInfo.trim();
    if (/^\d{4}-\d{2}-\d{2}$/.test(displayDate)) {
      try {
        const [y, m, d] = displayDate.split('-').map(Number);
        const dateObj = new Date(y, m - 1, d);
        displayDate = dateObj.toLocaleDateString('en-US', {
          month: 'short',
          day: 'numeric',
          year: 'numeric',
        });
      } catch {
        // fallback
      }
    }

    let cleanRegUrl = registrationUrl.trim();
    if (cleanRegUrl && !cleanRegUrl.startsWith('http://') && !cleanRegUrl.startsWith('https://')) {
      cleanRegUrl = `https://${cleanRegUrl}`;
    }

    const newEvent: ClashEvent = {
      id: `evt-user-${now}`,
      title: title.trim(),
      hostName: hostName.trim(),
      hostAvatar: `https://api.dicebear.com/7.x/identicon/svg?seed=${encodeURIComponent(hostName.trim())}`,
      hostVerified: false,
      status: status,
      format: format.trim() || '5v5 Clan War',
      townHall:
        selectedTownHalls.length > 0 ? selectedTownHalls.join(' & ') : 'TH18',
      prizePool: prizePool.trim() || undefined,
      startDate: status === 'ongoing' ? 'Live Now' : displayDate || 'Upcoming',
      timeInfo: displayDate ? `Ends ${displayDate}` : 'Starts Soon',
      bannerUrl: bannerUrl.trim() || undefined,
      registrationUrl: cleanRegUrl || undefined,
      hostContact: hostContact.trim() || undefined,
      description: description.trim() || 'Community tournament hosted on ClashNet.',
      participantsCount: 'Open Entry',
      addedAt: now,
    };

    setEvents((prev) => [newEvent, ...prev]);
    setFormSuccess(true);
    setFormError('');

    setTimeout(() => {
      setFormSuccess(false);
      setIsAddModalOpen(false);
      setTitle('');
      setHostName('');
      setStatus('upcoming');
      setIsStatusDropdownOpen(false);
      setFormat('');
      setSelectedTownHalls([]);
      setIsTownHallDropdownOpen(false);
      setPrizePool('');
      setTimeInfo('');
      setIsCalendarOpen(false);
      setBannerUrl('');
      setRegistrationUrl('');
      setHostContact('');
      setDescription('');
    }, 1200);
  };

  return (
    <div id="events" data-page="events" className="min-h-screen bg-white text-slate-900 font-outfit selection:bg-rose-500 selection:text-white flex flex-col">
      {/* 
        =======================================================================
        TOP NAVBAR (SAME STYLING AS CREATORS - NEVER FADES AWAY OR HIDES ON SCROLL)
        =======================================================================
      */}
      <header className="sticky top-0 left-0 w-full h-[86px] z-50 bg-white/95 backdrop-blur-md border-b border-slate-200/90 shadow-sm transition-none">
        <div className="relative w-full h-full px-6 md:px-10 flex items-center justify-between">
          {/* Brand Logo & Title */}
          <div className="flex items-center min-w-[160px] z-10">
            <a
              href="#home"
              onClick={handleGoHome}
              className="flex items-center space-x-2 group transition-transform duration-300 hover:scale-105"
            >
              <img
                src="/images/logo.webp"
                alt="ClashNet Logo"
                className="h-9 md:h-11 w-auto object-contain brightness-0"
              />
              <span className="font-montserrat font-bold text-base md:text-lg tracking-[0.2em] uppercase text-black">
                clashnet
              </span>
            </a>
          </div>

          {/* Desktop Navigation Links */}
          <div className="hidden md:flex items-center justify-center flex-1">
            <ul className="flex items-center space-x-8">
              <li>
                <a
                  href="#home"
                  onClick={handleGoHome}
                  className="relative inline-block py-1 text-xs md:text-sm font-bold uppercase tracking-[0.22em] text-black/70 hover:text-black hover:-translate-y-[2px] transition-all duration-200 after:content-[''] after:absolute after:bottom-[-6px] after:left-1/2 after:-translate-x-1/2 after:h-[2px] after:bg-black after:w-0 hover:after:w-full after:transition-all after:duration-300"
                >
                  HOME
                </a>
              </li>
              <li>
                <a
                  href="#creators"
                  onClick={handleGoCreators}
                  className="relative inline-block py-1 text-xs md:text-sm font-bold uppercase tracking-[0.22em] text-black/70 hover:text-black hover:-translate-y-[2px] transition-all duration-200 after:content-[''] after:absolute after:bottom-[-6px] after:left-1/2 after:-translate-x-1/2 after:h-[2px] after:bg-black after:w-0 hover:after:w-full after:transition-all after:duration-300"
                >
                  CREATORS
                </a>
              </li>
              <li>
                <span className="relative inline-block py-1 text-xs md:text-sm font-bold uppercase tracking-[0.22em] text-black cursor-default after:content-[''] after:absolute after:bottom-[-6px] after:left-1/2 after:-translate-x-1/2 after:h-[2px] after:bg-black after:w-full">
                  EVENTS
                </span>
              </li>
              <li>
                <a
                  href="#tools"
                  className="relative inline-block py-1 text-xs md:text-sm font-bold uppercase tracking-[0.22em] text-black/70 hover:text-black hover:-translate-y-[2px] transition-all duration-200 after:content-[''] after:absolute after:bottom-[-6px] after:left-1/2 after:-translate-x-1/2 after:h-[2px] after:bg-black after:w-0 hover:after:w-full after:transition-all after:duration-300"
                >
                  TOOLS
                </a>
              </li>
            </ul>
          </div>

          {/* Right Action: Login button & Mobile toggle */}
          <div className="flex items-center justify-end space-x-4 min-w-[160px] z-10">
            <button className="relative px-6 py-2 rounded-full border border-black/30 hover:border-black text-black hover:bg-black/5 text-xs md:text-sm font-bold uppercase tracking-[0.18em] transition-all duration-200 ease-out active:scale-95">
              LOGIN
            </button>

            {/* Mobile Hamburger Menu */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden focus:outline-none p-1.5 text-black hover:opacity-75 transition-opacity"
              aria-label="Toggle navigation menu"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                {isMobileMenuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile Dropdown Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden relative px-6 py-6 bg-white border-b border-black/10 shadow-lg animate-fadeIn">
            <ul className="flex flex-col space-y-4 text-center">
              <li>
                <a
                  href="#home"
                  onClick={handleGoHome}
                  className="inline-block py-1 text-sm font-bold uppercase tracking-[0.22em] text-black/70 hover:text-black"
                >
                  HOME
                </a>
              </li>
              <li>
                <a
                  href="#creators"
                  onClick={handleGoCreators}
                  className="inline-block py-1 text-sm font-bold uppercase tracking-[0.22em] text-black/70 hover:text-black"
                >
                  CREATORS
                </a>
              </li>
              <li>
                <span className="inline-block py-1 text-sm font-bold uppercase tracking-[0.22em] text-black border-b-2 border-black">
                  EVENTS
                </span>
              </li>
              <li>
                <a
                  href="#tools"
                  className="inline-block py-1 text-sm font-bold uppercase tracking-[0.22em] text-black/70 hover:text-black"
                >
                  TOOLS
                </a>
              </li>
            </ul>
          </div>
        )}
      </header>

      {/* 
        =======================================================================
        MAIN CONTENT BODY
        =======================================================================
      */}
      <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 md:px-8 py-6 md:py-8">
        {/* 
          =======================================================================
          SEARCH BAR, FILTER, AND + ADD EVENT BUTTON (SAME STRUCTURE AS CREATORS)
          =======================================================================
        */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 mb-8">
          {/* Search Input Box */}
          <div className="relative flex-1">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400">
              <Search className="w-5 h-5" />
            </div>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search event name, host, war format, prize pool..."
              className="w-full pl-12 pr-10 py-3 bg-slate-50 border border-slate-200/90 rounded-2xl text-slate-900 placeholder-slate-400 text-sm focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent transition-all shadow-inner"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-black"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Right Controls: Filter Dropdown & + Add Event */}
          <div className="flex items-center gap-2.5 shrink-0">
            {/* Filter Button & Popover */}
            <div className="relative" data-event-filter-container>
              <button
                onClick={() => setIsFilterOpen(!isFilterOpen)}
                className={`flex items-center space-x-2 px-4 py-3 rounded-2xl border text-xs font-bold uppercase tracking-wider transition-all duration-200 ${
                  formatFilter !== 'all' || townHallFilter !== 'all'
                    ? 'bg-black text-white border-black shadow-sm'
                    : isFilterOpen
                    ? 'bg-black text-white border-black'
                    : 'bg-slate-50 hover:bg-slate-100 text-slate-800 border-slate-200'
                }`}
              >
                <SlidersHorizontal className="w-3.5 h-3.5" />
                <span>
                  {formatFilter !== 'all'
                    ? formatFilter
                    : townHallFilter !== 'all'
                    ? townHallFilter
                    : 'Filter'}
                </span>
                {(formatFilter !== 'all' || townHallFilter !== 'all') && (
                  <span className="w-1.5 h-1.5 rounded-full bg-rose-400" />
                )}
                <ChevronDown
                  className={`w-3.5 h-3.5 opacity-60 transition-transform duration-200 ${
                    isFilterOpen ? 'rotate-180' : ''
                  }`}
                />
              </button>

              {/* Filter Dropdown Popover */}
              {isFilterOpen && (
                <div className="absolute right-0 mt-2 w-72 p-3 bg-white rounded-2xl shadow-xl border border-slate-200 z-30 animate-fadeIn space-y-3">
                  <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                      Filter Events
                    </span>
                    {(formatFilter !== 'all' || townHallFilter !== 'all') && (
                      <button
                        onClick={() => {
                          setFormatFilter('all');
                          setTownHallFilter('all');
                          setIsFilterOpen(false);
                        }}
                        className="text-[11px] font-bold text-rose-500 hover:underline capitalize"
                      >
                        Reset All
                      </button>
                    )}
                  </div>

                  {/* Format Filter */}
                  <div>
                    <label className="text-[10px] font-bold uppercase text-slate-400 mb-1 block">
                      Breakdown
                    </label>
                    <div className="grid grid-cols-2 gap-1.5">
                      {['all', '5v5 War', '1v1 Showdown', 'CWL Tournament'].map((fmt) => (
                        <button
                          key={fmt}
                          onClick={() => {
                            setFormatFilter(fmt);
                            setIsFilterOpen(false);
                          }}
                          className={`text-xs px-2.5 py-1.5 rounded-xl text-left font-semibold truncate transition-colors ${
                            formatFilter === fmt
                              ? 'bg-black text-white'
                              : 'bg-slate-50 text-slate-700 hover:bg-slate-100'
                          }`}
                        >
                          {fmt === 'all' ? 'All Formats' : fmt}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Town Hall Filter */}
                  <div>
                    <label className="text-[10px] font-bold uppercase text-slate-400 mb-1 block">
                      Town Hall
                    </label>
                    <select
                      value={townHallFilter}
                      onChange={(e) => {
                        setTownHallFilter(e.target.value);
                        setIsFilterOpen(false);
                      }}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-black transition-all"
                    >
                      <option value="all">All Town Halls</option>
                      {Array.from({ length: 18 }, (_, i) => 18 - i).map((num) => (
                        <option key={num} value={`TH${num}`}>
                          Town Hall {num} (TH{num})
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              )}
            </div>

            {/* + Add Event Button */}
            <button
              onClick={() => {
                setFormError('');
                setIsAddModalOpen(true);
              }}
              className="flex items-center space-x-2 px-5 py-3 rounded-2xl bg-black hover:bg-neutral-800 text-white text-xs font-bold uppercase tracking-wider transition-all duration-200 shadow-sm hover:shadow active:scale-95 shrink-0"
            >
              <Plus className="w-4 h-4 text-white" />
              <span>Add Event</span>
            </button>
          </div>
        </div>

        {/* 
          =======================================================================
          SECTION VIEW: EITHER FULL LIST VIEW (VIEW MORE) OR 3 HORIZONTAL TRACKS
          =======================================================================
        */}
        {viewingCategory !== 'all' ? (
          /* ── FULL LIST / GRID VIEW WHEN 'VIEW MORE' IS CLICKED ── */
          <div className="space-y-6 animate-fadeIn">
            {/* Header with back button, category title & switcher tabs */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
              <div className="flex items-center space-x-3">
                <button
                  onClick={() => {
                    setViewingCategory('all');
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className="w-10 h-10 rounded-2xl bg-black hover:bg-neutral-800 text-white flex items-center justify-center transition-all shadow-sm hover:shadow active:scale-95 group"
                  title="Back to All Sections"
                  aria-label="Back to All Sections"
                >
                  <ArrowLeft className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" />
                </button>
                <div>
                  <div className="flex items-center space-x-2.5">
                    <h2 className="font-montserrat font-bold text-2xl md:text-3xl text-black">
                      {viewingCategory === 'ongoing'
                        ? 'Ongoing Events'
                        : viewingCategory === 'upcoming'
                        ? 'Upcoming Events'
                        : 'Completed Events'}
                    </h2>
                    <span
                      className={`px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-wider ${
                        viewingCategory === 'ongoing'
                          ? 'bg-emerald-100 text-emerald-800'
                          : viewingCategory === 'upcoming'
                          ? 'bg-amber-100 text-amber-800'
                          : 'bg-slate-100 text-slate-800'
                      }`}
                    >
                      {viewingCategory === 'ongoing'
                        ? 'Live Now'
                        : viewingCategory === 'upcoming'
                        ? 'Upcoming'
                        : 'Archived'}
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 mt-0.5">
                    {viewingCategory === 'ongoing'
                      ? `Showing all ${ongoingEvents.length} ongoing matches and live tournaments`
                      : viewingCategory === 'upcoming'
                      ? `Showing all ${upcomingEvents.length} scheduled tournaments open for registration`
                      : `Showing all ${completedEvents.length} concluded tournaments and champions`}
                  </p>
                </div>
              </div>

              {/* Category Quick Switcher Pills */}
              <div className="flex items-center gap-1.5 bg-slate-100 p-1 rounded-2xl self-start sm:self-auto">
                <button
                  onClick={() => setViewingCategory('all')}
                  className="px-3 py-1.5 rounded-xl text-xs font-bold text-slate-600 hover:text-black transition-all"
                >
                  All Sections
                </button>
                <button
                  onClick={() => setViewingCategory('upcoming')}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                    viewingCategory === 'upcoming'
                      ? 'bg-black text-white shadow-xs'
                      : 'text-slate-600 hover:text-black'
                  }`}
                >
                  Upcoming ({upcomingEvents.length})
                </button>
                <button
                  onClick={() => setViewingCategory('ongoing')}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                    viewingCategory === 'ongoing'
                      ? 'bg-black text-white shadow-xs'
                      : 'text-slate-600 hover:text-black'
                  }`}
                >
                  Ongoing ({ongoingEvents.length})
                </button>
                <button
                  onClick={() => setViewingCategory('completed')}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                    viewingCategory === 'completed'
                      ? 'bg-black text-white shadow-xs'
                      : 'text-slate-600 hover:text-black'
                  }`}
                >
                  Completed ({completedEvents.length})
                </button>
              </div>
            </div>

            {/* List / Grid of category events */}
            {categoryEventsList.length === 0 ? (
              <div className="w-full -mx-4 sm:-mx-6 md:mx-0 w-[calc(100%+2rem)] sm:w-[calc(100%+3rem)] md:w-full py-20 sm:py-24 px-6 sm:px-10 text-center bg-slate-50/90 rounded-2xl sm:rounded-3xl border border-dashed border-slate-300 flex flex-col items-center justify-center shadow-xs">
                <div className="w-16 h-16 rounded-2xl bg-slate-100 border border-slate-200 text-slate-600 flex items-center justify-center mb-4 shadow-xs">
                  <Trophy className="w-8 h-8 text-amber-500" />
                </div>
                <h3 className="font-montserrat font-bold text-xl sm:text-2xl text-slate-900 mb-2">
                  No {viewingCategory !== 'all' ? `${viewingCategory.charAt(0).toUpperCase() + viewingCategory.slice(1)} ` : ''}Events Found
                </h3>
                <p className="text-sm text-slate-500 max-w-md mx-auto mb-6 leading-relaxed">
                  {searchQuery
                    ? `No ${viewingCategory} events match "${searchQuery}".`
                    : `No ${viewingCategory} events match the active filters.`}
                </p>
                <div className="flex flex-wrap items-center justify-center gap-3">
                  {(searchQuery || formatFilter !== 'all' || townHallFilter !== 'all') && (
                    <button
                      onClick={() => {
                        setSearchQuery('');
                        setFormatFilter('all');
                        setTownHallFilter('all');
                      }}
                      className="px-6 py-2.5 rounded-full bg-slate-200 text-slate-800 text-xs font-bold uppercase tracking-wider hover:bg-slate-300 transition-all shadow-sm"
                    >
                      Clear Filters
                    </button>
                  )}
                  <button
                    onClick={() => {
                      setFormError('');
                      setIsAddModalOpen(true);
                    }}
                    className="flex items-center space-x-2 px-6 py-2.5 rounded-full bg-black hover:bg-neutral-800 text-white text-xs font-bold uppercase tracking-wider transition-all duration-200 shadow-sm hover:scale-105 active:scale-95"
                  >
                    <Plus className="w-4 h-4 text-white" />
                    <span>Host New Event</span>
                  </button>
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 pt-2 pb-16">
                {categoryEventsList.map((evt) => (
                  <EventCard key={evt.id} event={evt} isGridView />
                ))}
              </div>
            )}
          </div>
        ) : (
          /* ── 3 HORIZONTAL SCROLL SECTIONS ── */
          <div className="space-y-12">
            {/* PART 1: UPCOMING EVENTS */}
            <section>
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <div className="w-9 h-9 rounded-xl bg-amber-500 text-black flex items-center justify-center shadow-md">
                    <Calendar className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="flex items-center space-x-2">
                      <h2 className="font-montserrat font-bold text-xl md:text-2xl text-black">
                        Upcoming Events
                      </h2>
                      <span className="px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-800 text-[10px] font-extrabold uppercase tracking-wider">
                        Registration Open
                      </span>
                    </div>
                    <p className="text-xs text-slate-500 mt-0.5">
                      Prepare your clan and register for upcoming competitive showdowns
                    </p>
                  </div>
                </div>

                {/* View More and Slider Controls */}
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => {
                      setViewingCategory('upcoming');
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                    }}
                    className="flex items-center space-x-1.5 px-3.5 py-1.5 rounded-full bg-slate-100 hover:bg-black hover:text-white text-slate-800 text-xs font-bold transition-all uppercase tracking-wider"
                  >
                    <span>View More</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>

                  {upcomingEvents.length > 0 && (
                    <div className="flex items-center space-x-1">
                      <button
                        onClick={() => scrollRow(upcomingRowRef, 'left')}
                        className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-700 flex items-center justify-center transition-colors shadow-xs"
                        title="Scroll Left"
                        aria-label="Scroll upcoming events left"
                      >
                        <ChevronLeft className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => scrollRow(upcomingRowRef, 'right')}
                        className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-700 flex items-center justify-center transition-colors shadow-xs"
                        title="Scroll Right"
                        aria-label="Scroll upcoming events right"
                      >
                        <ChevronRight className="w-4 h-4" />
                      </button>
                    </div>
                  )}
                </div>
              </div>

              {/* Horizontal Track */}
              {upcomingEvents.length === 0 ? (
                <div className="w-full -mx-4 sm:-mx-6 md:mx-0 w-[calc(100%+2rem)] sm:w-[calc(100%+3rem)] md:w-full py-16 sm:py-20 md:py-24 px-6 sm:px-10 text-center bg-slate-50/90 rounded-2xl sm:rounded-3xl border border-dashed border-slate-300 flex flex-col items-center justify-center shadow-xs">
                  <div className="w-14 h-14 rounded-2xl bg-amber-50 border border-amber-200/80 text-amber-600 flex items-center justify-center mb-4 shadow-xs">
                    <Calendar className="w-7 h-7" />
                  </div>
                  <h3 className="font-montserrat font-bold text-lg sm:text-xl text-slate-900 mb-1.5">
                    No Upcoming Events
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-500 max-w-lg mx-auto mb-6 leading-relaxed">
                    No upcoming tournaments or events right now. Ready to host your own event?
                  </p>
                  <button
                    onClick={() => {
                      setFormError('');
                      setIsAddModalOpen(true);
                    }}
                    className="flex items-center space-x-2 px-6 py-3 rounded-2xl bg-black hover:bg-neutral-800 text-white text-xs font-bold uppercase tracking-wider transition-all duration-200 shadow-sm hover:scale-105 active:scale-95"
                  >
                    <Plus className="w-4 h-4 text-white" />
                    <span>Host New Event</span>
                  </button>
                </div>
              ) : (
                <div
                  ref={upcomingRowRef}
                  className="flex items-stretch overflow-x-auto gap-5 pb-4 pt-1 scroll-smooth snap-x snap-mandatory"
                  style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
                >
                  {upcomingEvents.map((evt) => (
                    <EventCard key={evt.id} event={evt} />
                  ))}
                </div>
              )}
            </section>

            {/* PART 2: ONGOING EVENTS */}
            <section>
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <div className="w-9 h-9 rounded-xl bg-emerald-600 text-white flex items-center justify-center shadow-md">
                    <Radio className="w-5 h-5 animate-pulse" />
                  </div>
                  <div>
                    <div className="flex items-center space-x-2">
                      <h2 className="font-montserrat font-bold text-xl md:text-2xl text-black">
                        Ongoing Events
                      </h2>
                      <span className="px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-extrabold uppercase tracking-wider">
                        Live Now
                      </span>
                    </div>
                    <p className="text-xs text-slate-500 mt-0.5">
                      Active tournaments and matches broadcasting in real-time
                    </p>
                  </div>
                </div>

                {/* View More and Slider Controls */}
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => {
                      setViewingCategory('ongoing');
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                    }}
                    className="flex items-center space-x-1.5 px-3.5 py-1.5 rounded-full bg-slate-100 hover:bg-black hover:text-white text-slate-800 text-xs font-bold transition-all uppercase tracking-wider"
                  >
                    <span>View More</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>

                  {ongoingEvents.length > 0 && (
                    <div className="flex items-center space-x-1">
                      <button
                        onClick={() => scrollRow(ongoingRowRef, 'left')}
                        className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-700 flex items-center justify-center transition-colors shadow-xs"
                        title="Scroll Left"
                        aria-label="Scroll ongoing events left"
                      >
                        <ChevronLeft className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => scrollRow(ongoingRowRef, 'right')}
                        className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-700 flex items-center justify-center transition-colors shadow-xs"
                        title="Scroll Right"
                        aria-label="Scroll ongoing events right"
                      >
                        <ChevronRight className="w-4 h-4" />
                      </button>
                    </div>
                  )}
                </div>
              </div>

              {/* Horizontal Track */}
              {ongoingEvents.length === 0 ? (
                <div className="w-full -mx-4 sm:-mx-6 md:mx-0 w-[calc(100%+2rem)] sm:w-[calc(100%+3rem)] md:w-full py-16 sm:py-20 md:py-24 px-6 sm:px-10 text-center bg-slate-50/90 rounded-2xl sm:rounded-3xl border border-dashed border-slate-300 flex flex-col items-center justify-center shadow-xs">
                  <div className="w-14 h-14 rounded-2xl bg-emerald-50 border border-emerald-200/80 text-emerald-600 flex items-center justify-center mb-4 shadow-xs">
                    <Radio className="w-7 h-7 animate-pulse" />
                  </div>
                  <h3 className="font-montserrat font-bold text-lg sm:text-xl text-slate-900 mb-1.5">
                    No Ongoing Events
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-500 max-w-lg mx-auto mb-6 leading-relaxed">
                    No live tournament matches are currently underway. Check out upcoming scheduled events below or host one!
                  </p>
                  <button
                    onClick={() => {
                      setFormError('');
                      setIsAddModalOpen(true);
                    }}
                    className="flex items-center space-x-2 px-6 py-3 rounded-2xl bg-black hover:bg-neutral-800 text-white text-xs font-bold uppercase tracking-wider transition-all duration-200 shadow-sm hover:scale-105 active:scale-95"
                  >
                    <Plus className="w-4 h-4 text-white" />
                    <span>Host New Event</span>
                  </button>
                </div>
              ) : (
                <div
                  ref={ongoingRowRef}
                  className="flex items-stretch overflow-x-auto gap-5 pb-4 pt-1 scroll-smooth snap-x snap-mandatory"
                  style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
                >
                  {ongoingEvents.map((evt) => (
                    <EventCard key={evt.id} event={evt} />
                  ))}
                </div>
              )}
            </section>

            {/* PART 3: COMPLETED EVENTS */}
            <section>
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <div className="w-9 h-9 rounded-xl bg-slate-800 text-white flex items-center justify-center shadow-md">
                    <Award className="w-5 h-5 text-amber-400" />
                  </div>
                  <div>
                    <div className="flex items-center space-x-2">
                      <h2 className="font-montserrat font-bold text-xl md:text-2xl text-black">
                        Completed Events
                      </h2>
                      <span className="px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-800 text-[10px] font-extrabold uppercase tracking-wider">
                        Archived Results
                      </span>
                    </div>
                    <p className="text-xs text-slate-500 mt-0.5">
                      Browse tournament champions, final standings, and match archives
                    </p>
                  </div>
                </div>

                {/* View More and Slider Controls */}
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => {
                      setViewingCategory('completed');
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                    }}
                    className="flex items-center space-x-1.5 px-3.5 py-1.5 rounded-full bg-slate-100 hover:bg-black hover:text-white text-slate-800 text-xs font-bold transition-all uppercase tracking-wider"
                  >
                    <span>View More</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>

                  {completedEvents.length > 0 && (
                    <div className="flex items-center space-x-1">
                      <button
                        onClick={() => scrollRow(completedRowRef, 'left')}
                        className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-700 flex items-center justify-center transition-colors shadow-xs"
                        title="Scroll Left"
                        aria-label="Scroll completed events left"
                      >
                        <ChevronLeft className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => scrollRow(completedRowRef, 'right')}
                        className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-700 flex items-center justify-center transition-colors shadow-xs"
                        title="Scroll Right"
                        aria-label="Scroll completed events right"
                      >
                        <ChevronRight className="w-4 h-4" />
                      </button>
                    </div>
                  )}
                </div>
              </div>

              {/* Horizontal Track */}
              {completedEvents.length === 0 ? (
                <div className="w-full -mx-4 sm:-mx-6 md:mx-0 w-[calc(100%+2rem)] sm:w-[calc(100%+3rem)] md:w-full py-16 sm:py-20 md:py-24 px-6 sm:px-10 text-center bg-slate-50/90 rounded-2xl sm:rounded-3xl border border-dashed border-slate-300 flex flex-col items-center justify-center shadow-xs">
                  <div className="w-14 h-14 rounded-2xl bg-slate-100 border border-slate-200 text-slate-600 flex items-center justify-center mb-4 shadow-xs">
                    <Award className="w-7 h-7 text-amber-500" />
                  </div>
                  <h3 className="font-montserrat font-bold text-lg sm:text-xl text-slate-900 mb-1.5">
                    No Completed Events
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-500 max-w-lg mx-auto leading-relaxed">
                    No completed tournaments or match archives recorded yet. Concluded events will appear here.
                  </p>
                </div>
              ) : (
                <div
                  ref={completedRowRef}
                  className="flex items-stretch overflow-x-auto gap-5 pb-4 pt-1 scroll-smooth snap-x snap-mandatory"
                  style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
                >
                  {completedEvents.map((evt) => (
                    <EventCard key={evt.id} event={evt} />
                  ))}
                </div>
              )}
            </section>
          </div>
        )}
      </main>

      {/* 
        =======================================================================
        ADD EVENT MODAL
        =======================================================================
      */}
      {isAddModalOpen && (
        <div
          data-lenis-prevent
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn"
          onClick={(e) => {
            if (e.target === e.currentTarget) {
              setIsAddModalOpen(false);
            }
          }}
          onWheel={(e) => e.stopPropagation()}
        >
          <div
            data-lenis-prevent
            className="bg-white rounded-3xl max-w-xl w-full p-6 md:p-8 shadow-2xl border border-slate-200 relative max-h-[90vh] overflow-y-auto overscroll-contain"
            onWheel={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="flex items-start justify-between pb-4 border-b border-slate-100">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded-2xl bg-black text-white flex items-center justify-center shadow-md">
                  <Trophy className="w-5 h-5 text-amber-400" />
                </div>
                <div>
                  <h3 className="font-montserrat font-bold text-xl text-black">
                    Host a Community Event
                  </h3>
                  <p className="text-xs text-slate-500">
                    Publish your clan war, cup, or scrim to ClashNet for free
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 flex items-center justify-center transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Submission Feedback */}
            {formSuccess ? (
              <div className="py-12 text-center">
                <div className="w-14 h-14 rounded-full bg-emerald-100 text-emerald-600 mx-auto flex items-center justify-center mb-4">
                  <Check className="w-7 h-7" />
                </div>
                <h4 className="font-bold text-lg text-slate-900">Event Published Successfully!</h4>
                <p className="text-xs text-slate-500 mt-1">
                  Your event is now live and featured on the ClashNet community schedule.
                </p>
              </div>
            ) : (
              <form onSubmit={handleAddEventSubmit} className="mt-6 space-y-4">
                {formError && (
                  <div className="p-3 rounded-2xl bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-center space-x-2 animate-fadeIn">
                    <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
                    <span>{formError}</span>
                  </div>
                )}

                {/* Event Title */}
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                    Event Title *
                  </label>
                  <input
                    type="text"
                    required
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="e.g. ClashNet Winter Cup"
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-black transition-all"
                  />
                </div>

                {/* Host Name & Status */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                      Organizer / Clan Name *
                    </label>
                    <input
                      type="text"
                      required
                      value={hostName}
                      onChange={(e) => setHostName(e.target.value)}
                      placeholder="e.g. ClashNet"
                      className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-black transition-all"
                    />
                  </div>

                  <div className="relative" data-status-dropdown>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                      Event Status
                    </label>
                    <button
                      type="button"
                      onClick={() => setIsStatusDropdownOpen(!isStatusDropdownOpen)}
                      className={`w-full px-3.5 py-2.5 bg-slate-50 border rounded-xl text-sm flex items-center justify-between transition-all focus:outline-none focus:ring-2 focus:ring-black min-h-[42px] ${
                        isStatusDropdownOpen
                          ? 'border-black ring-1 ring-black bg-white shadow-xs'
                          : 'border-slate-200 hover:bg-slate-100'
                      }`}
                    >
                      <div className="truncate">
                        {status === 'upcoming' ? (
                          <span className="text-slate-800 text-sm truncate">
                            Upcoming (Registration Open)
                          </span>
                        ) : status === 'ongoing' ? (
                          <span className="text-slate-800 text-sm truncate">
                            Ongoing (Live Right Now)
                          </span>
                        ) : (
                          <span className="text-slate-800 text-sm truncate">
                            Completed (Concluded)
                          </span>
                        )}
                      </div>
                      <ChevronDown
                        className={`w-4 h-4 text-slate-400 shrink-0 transition-transform duration-200 ml-1 ${
                          isStatusDropdownOpen ? 'rotate-180' : ''
                        }`}
                      />
                    </button>

                    {isStatusDropdownOpen && (
                      <div
                        data-lenis-prevent
                        onWheel={(e) => e.stopPropagation()}
                        className="absolute left-0 right-0 top-full mt-1.5 p-2 bg-white border border-slate-200 rounded-2xl shadow-xl z-50 animate-fadeIn space-y-1"
                      >
                        {[
                          {
                            value: 'upcoming' as EventStatus,
                            label: 'Upcoming (Registration Open)',
                          },
                          {
                            value: 'ongoing' as EventStatus,
                            label: 'Ongoing (Live Right Now)',
                          },
                          {
                            value: 'completed' as EventStatus,
                            label: 'Completed (Concluded)',
                          },
                        ].map((opt) => {
                          const isSelected = status === opt.value;
                          return (
                            <button
                              key={opt.value}
                              type="button"
                              onClick={() => {
                                setStatus(opt.value);
                                setIsStatusDropdownOpen(false);
                              }}
                              className={`w-full px-3.5 py-2.5 rounded-xl text-left flex items-center justify-between transition-all ${
                                isSelected
                                  ? 'bg-black text-white shadow-xs'
                                  : 'hover:bg-slate-50 text-slate-700'
                              }`}
                            >
                              <span
                                className={`text-xs ${
                                  isSelected ? 'text-white' : 'text-slate-900'
                                }`}
                              >
                                {opt.label}
                              </span>
                              {isSelected && <Check className="w-4 h-4 text-white shrink-0" />}
                            </button>
                          );
                        })}
                      </div>
                    )}
                  </div>
                </div>

                {/* Format & Town Hall */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                      Breakdown *
                    </label>
                    <input
                      type="text"
                      required
                      value={format}
                      onChange={(e) => setFormat(e.target.value)}
                      placeholder="e.g. TH18 5v5, 2/2/1"
                      className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-black transition-all"
                    />
                  </div>

                  <div className="relative" data-th-dropdown>
                    <div className="flex items-center justify-between mb-1.5">
                      <label className="block text-xs font-bold uppercase tracking-wider text-slate-700">
                        Applied Townhall *
                      </label>
                      {selectedTownHalls.length > 0 && (
                        <span className="text-[11px] font-semibold text-slate-500">
                          {selectedTownHalls.length} selected
                        </span>
                      )}
                    </div>
                    <button
                      type="button"
                      onClick={() => setIsTownHallDropdownOpen(!isTownHallDropdownOpen)}
                      className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold text-slate-900 flex items-center justify-between hover:bg-slate-100 transition-all focus:outline-none focus:ring-2 focus:ring-black min-h-[42px]"
                    >
                      <div className="flex items-center gap-1.5 flex-nowrap flex-1 mr-2 overflow-hidden">
                        {selectedTownHalls.length === 0 ? (
                          <span className="text-slate-400 font-normal text-xs whitespace-nowrap">
                            Select Townhalls (Choose multiple)
                          </span>
                        ) : selectedTownHalls.length <= 3 ? (
                          selectedTownHalls.map((th) => (
                            <span
                              key={th}
                              className="px-2 py-0.5 rounded-md bg-black text-white text-[11px] font-bold shrink-0 whitespace-nowrap"
                            >
                              {th}
                            </span>
                          ))
                        ) : (
                          <>
                            {selectedTownHalls.slice(0, 2).map((th) => (
                              <span
                                key={th}
                                className="px-2 py-0.5 rounded-md bg-black text-white text-[11px] font-bold shrink-0 whitespace-nowrap"
                              >
                                {th}
                              </span>
                            ))}
                            <span className="px-2 py-0.5 rounded-md bg-slate-200 text-slate-800 text-[11px] font-bold shrink-0 whitespace-nowrap">
                              +{selectedTownHalls.length - 2} more
                            </span>
                          </>
                        )}
                      </div>
                      <ChevronDown
                        className={`w-4 h-4 text-slate-500 shrink-0 transition-transform duration-200 ${
                          isTownHallDropdownOpen ? 'rotate-180' : ''
                        }`}
                      />
                    </button>

                    {isTownHallDropdownOpen && (
                      <div className="absolute left-0 right-0 top-full mt-1.5 p-2.5 bg-white border border-slate-200 rounded-2xl shadow-xl z-50 animate-fadeIn">
                        <div className="flex items-center justify-between pb-2 mb-2 border-b border-slate-100">
                          <div>
                            <span className="block text-[11px] font-bold uppercase tracking-wider text-slate-600 whitespace-nowrap">
                              Choose Townhalls
                            </span>
                            <span className="block text-[10px] font-semibold text-slate-400 whitespace-nowrap">
                              ({selectedTownHalls.length} selected)
                            </span>
                          </div>
                          {selectedTownHalls.length > 0 && (
                            <button
                              type="button"
                              onClick={() => setSelectedTownHalls([])}
                              className="text-[11px] font-bold text-rose-500 hover:underline shrink-0 ml-2"
                            >
                              Clear
                            </button>
                          )}
                        </div>
                        <div data-lenis-prevent className="grid grid-cols-4 gap-1.5 max-h-52 overflow-y-auto overscroll-contain pr-0.5" onWheel={(e) => e.stopPropagation()}>
                          {TOWNHALL_OPTIONS.map((th) => {
                            const isSelected = selectedTownHalls.includes(th);
                            return (
                              <button
                                key={th}
                                type="button"
                                onClick={() => toggleTownHall(th)}
                                className={`py-2 px-1 text-center rounded-xl text-xs font-bold transition-all ${
                                  isSelected
                                    ? 'bg-black text-white shadow-xs'
                                    : 'bg-slate-50 hover:bg-slate-100 text-slate-700 hover:text-black border border-slate-200/60'
                                }`}
                              >
                                {th}
                              </button>
                            );
                          })}
                        </div>
                        <div className="pt-2 mt-2 border-t border-slate-100">
                          <button
                            type="button"
                            onClick={() => setIsTownHallDropdownOpen(false)}
                            className="w-full py-1.5 rounded-xl bg-black hover:bg-neutral-800 text-white text-xs font-bold uppercase tracking-wider transition-all shadow-xs"
                          >
                            Done
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Prize Pool & Date / Timing */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                      Prize Pool (Optional)
                    </label>
                    <input
                      type="text"
                      value={prizePool}
                      onChange={(e) => setPrizePool(e.target.value)}
                      placeholder="e.g. 10,000 INR"
                      className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-black transition-all"
                    />
                  </div>

                  <div className="relative" data-calendar-dropdown>
                    <div className="flex items-center justify-between mb-1.5">
                      <label className="block text-xs font-bold uppercase tracking-wider text-slate-700">
                        Registration Ending Time *
                      </label>
                      {timeInfo && (
                        <button
                          type="button"
                          onClick={() => setTimeInfo('')}
                          className="text-[11px] font-bold text-rose-500 hover:underline"
                        >
                          Clear
                        </button>
                      )}
                    </div>

                    {/* Trigger Button */}
                    <button
                      type="button"
                      onClick={() => setIsCalendarOpen(!isCalendarOpen)}
                      className={`w-full px-3.5 py-2.5 bg-slate-50 border rounded-xl text-sm flex items-center justify-between transition-all focus:outline-none focus:ring-2 focus:ring-black min-h-[42px] ${
                        isCalendarOpen ? 'border-black ring-1 ring-black bg-white shadow-xs' : 'border-slate-200 hover:bg-slate-100'
                      }`}
                    >
                      <div className="flex items-center space-x-2.5 truncate">
                        <Calendar className={`w-4 h-4 shrink-0 ${timeInfo ? 'text-black' : 'text-slate-400'}`} />
                        <span className={`text-sm truncate ${timeInfo ? 'font-semibold text-slate-900' : 'text-slate-400 font-normal'}`}>
                          {timeInfo ? formatFriendlyDate(timeInfo) : 'Choose date from calendar'}
                        </span>
                      </div>
                      <ChevronDown
                        className={`w-4 h-4 text-slate-400 shrink-0 transition-transform duration-200 ${
                          isCalendarOpen ? 'rotate-180' : ''
                        }`}
                      />
                    </button>

                    {/* Custom Popover Calendar */}
                    {isCalendarOpen && (
                      <div
                        data-lenis-prevent
                        onWheel={(e) => e.stopPropagation()}
                        className="absolute left-0 sm:left-auto sm:right-0 top-full mt-2 w-full sm:w-[310px] p-4 bg-white border border-slate-200 rounded-2xl shadow-2xl z-50 animate-fadeIn"
                      >
                        {/* Month Header & Controls */}
                        <div className="flex items-center justify-between pb-3 mb-3 border-b border-slate-100">
                          <span className="font-montserrat font-bold text-sm text-slate-900">
                            {calMonthName}
                          </span>
                          <div className="flex items-center space-x-1">
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                setCalCurrentMonth(new Date(calYear, calMonth - 1, 1));
                              }}
                              className="w-7 h-7 rounded-lg hover:bg-slate-100 text-slate-600 flex items-center justify-center transition-colors"
                              title="Previous Month"
                            >
                              <ChevronLeft className="w-4 h-4" />
                            </button>
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                setCalCurrentMonth(new Date(calYear, calMonth + 1, 1));
                              }}
                              className="w-7 h-7 rounded-lg hover:bg-slate-100 text-slate-600 flex items-center justify-center transition-colors"
                              title="Next Month"
                            >
                              <ChevronRight className="w-4 h-4" />
                            </button>
                          </div>
                        </div>

                        {/* Weekday Names */}
                        <div className="grid grid-cols-7 gap-1 text-center mb-1.5">
                          {['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].map((day) => (
                            <span key={day} className="text-[11px] font-bold uppercase tracking-wider text-slate-400 py-0.5">
                              {day}
                            </span>
                          ))}
                        </div>

                        {/* Calendar Day Grid */}
                        <div className="grid grid-cols-7 gap-1 text-center">
                          {/* Empty padding slots before first day */}
                          {Array.from({ length: calFirstDay }).map((_, i) => (
                            <div key={`empty-${i}`} className="h-8 w-8" />
                          ))}

                          {/* Days of month */}
                          {Array.from({ length: calTotalDays }).map((_, i) => {
                            const dayNum = i + 1;
                            const dateStr = `${calYear}-${String(calMonth + 1).padStart(2, '0')}-${String(dayNum).padStart(2, '0')}`;
                            const isSelected = timeInfo === dateStr;
                            const isToday = calTodayStr === dateStr;

                            return (
                              <button
                                key={dayNum}
                                type="button"
                                onClick={() => {
                                  setTimeInfo(dateStr);
                                  setIsCalendarOpen(false);
                                }}
                                className={`h-8 w-8 mx-auto rounded-xl text-xs font-semibold flex items-center justify-center transition-all ${
                                  isSelected
                                    ? 'bg-black text-white font-bold shadow-xs'
                                    : isToday
                                    ? 'border border-black text-black font-bold hover:bg-slate-100'
                                    : 'text-slate-700 hover:bg-slate-100 hover:text-black'
                                }`}
                              >
                                {dayNum}
                              </button>
                            );
                          })}
                        </div>

                        {/* Footer: Quick selection */}
                        <div className="flex items-center justify-between pt-3 mt-3 border-t border-slate-100">
                          <button
                            type="button"
                            onClick={() => {
                              setTimeInfo(calTodayStr);
                              setCalCurrentMonth(new Date());
                              setIsCalendarOpen(false);
                            }}
                            className="text-xs font-bold text-slate-600 hover:text-black hover:underline"
                          >
                            Today
                          </button>
                          <button
                            type="button"
                            onClick={() => setIsCalendarOpen(false)}
                            className="px-3 py-1 rounded-lg bg-black hover:bg-neutral-800 text-white text-xs font-bold uppercase tracking-wider transition-all shadow-xs"
                          >
                            Done
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Custom Event Banner Upload */}
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-700">
                      Upload Event Banner
                    </label>
                    <span className="text-[11px] font-semibold text-amber-800 bg-amber-50 border border-amber-200/80 px-2.5 py-0.5 rounded-full">
                      Recommended: 16:9 ratio (1920×1080)
                    </span>
                  </div>

                  {bannerUrl ? (
                    <div className="relative aspect-video w-full rounded-2xl overflow-hidden border border-slate-200 bg-slate-900 group shadow-inner">
                      <img
                        src={bannerUrl}
                        alt="Uploaded Event Banner Preview"
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2.5">
                        <label className="cursor-pointer px-4 py-2 rounded-xl bg-white text-black text-xs font-bold uppercase tracking-wider shadow hover:bg-slate-100 transition-all flex items-center space-x-1.5">
                          <Upload className="w-3.5 h-3.5" />
                          <span>Change Banner</span>
                          <input
                            type="file"
                            accept="image/*"
                            className="hidden"
                            onChange={handleImageUpload}
                          />
                        </label>
                        <button
                          type="button"
                          onClick={() => setBannerUrl('')}
                          className="px-4 py-2 rounded-xl bg-rose-600 text-white text-xs font-bold uppercase tracking-wider shadow hover:bg-rose-700 transition-all flex items-center space-x-1.5"
                        >
                          <X className="w-3.5 h-3.5" />
                          <span>Remove</span>
                        </button>
                      </div>
                      <div className="absolute bottom-2.5 left-2.5 px-2.5 py-1 rounded-lg bg-black/75 backdrop-blur-xs text-[10px] text-white font-bold tracking-wider uppercase">
                        Preview (16:9 Ratio)
                      </div>
                    </div>
                  ) : (
                    <label className="flex flex-col items-center justify-center w-full aspect-video border-2 border-dashed border-slate-300 hover:border-black rounded-2xl cursor-pointer bg-slate-50 hover:bg-slate-100/80 transition-all group p-4">
                      <div className="flex flex-col items-center justify-center text-center">
                        <div className="w-12 h-12 rounded-2xl bg-white shadow-xs border border-slate-200 flex items-center justify-center text-slate-600 group-hover:text-black group-hover:scale-105 transition-all mb-2.5">
                          <Upload className="w-6 h-6" />
                        </div>
                        <p className="text-xs font-bold text-slate-800">
                          Click to upload tournament banner
                        </p>
                        <p className="text-[11px] text-slate-500 mt-1">
                          PNG, JPG, or WEBP (Max 5MB)
                        </p>
                      </div>
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={handleImageUpload}
                      />
                    </label>
                  )}
                </div>

                {/* Host Contact Option */}
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                    Host Contact *
                  </label>
                  <input
                    type="text"
                    required
                    value={hostContact}
                    onChange={(e) => setHostContact(e.target.value)}
                    placeholder="e.g. Discord tag, WhatsApp no, email"
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-black transition-all"
                  />
                </div>

                {/* Registration Link */}
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                    Registration Link *
                  </label>
                  <input
                    type="text"
                    required
                    value={registrationUrl}
                    onChange={(e) => setRegistrationUrl(e.target.value)}
                    placeholder="e.g. Discord server, WhatsApp group, etc"
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-black transition-all"
                  />
                </div>

                {/* Description */}
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                    Tournament Rules & Description
                  </label>
                  <textarea
                    rows={3}
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Briefly describe about the match rules, sign up requirements..."
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-black transition-all resize-none"
                  />
                </div>

                {/* Submit button */}
                <div className="pt-2">
                  <button
                    type="submit"
                    className="w-full py-3.5 rounded-2xl bg-black hover:bg-neutral-800 text-white font-bold text-xs uppercase tracking-wider transition-all shadow-md active:scale-98 flex items-center justify-center space-x-2"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Publish Event</span>
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

// ─────────────────────────────────────────────────────────────────────────────
// REUSABLE EVENT CARD COMPONENT (FOR HORIZONTAL ROWS & GRID VIEW)
// ─────────────────────────────────────────────────────────────────────────────
interface EventCardProps {
  event: ClashEvent;
  isGridView?: boolean;
}

const EventCard: React.FC<EventCardProps> = ({ event, isGridView }) => {
  return (
    <div
      className={`${
        isGridView
          ? 'w-full min-w-0'
          : 'w-[300px] sm:w-[340px] md:w-[370px] shrink-0 snap-start'
      } bg-white rounded-3xl border border-slate-200/90 shadow-sm hover:shadow-md transition-all duration-300 flex flex-col overflow-hidden group`}
    >
      {/* 16:9 Banner Image Container */}
      <div className="relative aspect-video w-full overflow-hidden bg-slate-900">
        {event.bannerUrl ? (
          <>
            <img
              src={event.bannerUrl}
              alt={event.title}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
          </>
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-neutral-900 via-slate-900 to-zinc-900 flex items-center justify-center relative overflow-hidden">
            <div className="absolute inset-0 opacity-15 bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:16px_16px]" />
            <div className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-white/30 group-hover:scale-110 group-hover:text-white/50 transition-all">
              <Swords className="w-6 h-6" />
            </div>
          </div>
        )}

        {/* Status Pill (Top Left) */}
        <div className="absolute top-3 left-3">
          {event.status === 'ongoing' ? (
            <span className="px-2.5 py-1 rounded-md bg-emerald-600 text-white text-[10px] font-black uppercase tracking-wider flex items-center space-x-1.5 shadow-md">
              <span className="w-1.5 h-1.5 rounded-full bg-white animate-ping" />
              <span>LIVE NOW</span>
            </span>
          ) : event.status === 'upcoming' ? (
            <span className="px-2.5 py-1 rounded-md bg-amber-500 text-black text-[10px] font-black uppercase tracking-wider flex items-center space-x-1.5 shadow-md">
              <Clock className="w-3 h-3 text-black" />
              <span>UPCOMING</span>
            </span>
          ) : (
            <span className="px-2.5 py-1 rounded-md bg-slate-800 text-white text-[10px] font-black uppercase tracking-wider flex items-center space-x-1.5 shadow-md">
              <Check className="w-3 h-3 text-emerald-400" />
              <span>COMPLETED</span>
            </span>
          )}
        </div>

        {/* Prize Pool Pill (Top Right) */}
        {event.prizePool && (
          <div className="absolute top-3 right-3 px-2.5 py-1 rounded-md bg-black/80 backdrop-blur-xs text-amber-300 text-[10px] font-bold tracking-tight shadow flex items-center space-x-1">
            <Trophy className="w-3 h-3 text-amber-400" />
            <span>{event.prizePool}</span>
          </div>
        )}

        {/* Format & Town Hall Badges (Bottom Left) */}
        <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-[11px] text-white/90">
          <span className="font-bold truncate max-w-[170px] bg-black/60 backdrop-blur-xs px-2 py-0.5 rounded-md">
            {event.format}
          </span>
          <span className="font-semibold text-white/80 text-[10px] bg-black/60 backdrop-blur-xs px-2 py-0.5 rounded-md">
            {event.townHall}
          </span>
        </div>
      </div>

      {/* Card Content Area */}
      <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between">
        <div>
          {/* Host Info & Contact */}
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center space-x-1.5 truncate min-w-0">
              <span className="text-xs font-semibold text-slate-600 truncate">
                {event.hostName}
              </span>
              {event.hostVerified && (
                <ShieldCheck className="w-3.5 h-3.5 text-blue-500 shrink-0" />
              )}
            </div>
            {event.hostContact && (
              <a
                href={
                  event.hostContact.startsWith('http')
                    ? event.hostContact
                    : event.hostContact.includes('@') && !event.hostContact.toLowerCase().includes('discord')
                    ? `mailto:${event.hostContact}`
                    : undefined
                }
                target={event.hostContact.startsWith('http') ? '_blank' : undefined}
                rel={event.hostContact.startsWith('http') ? 'noopener noreferrer' : undefined}
                onClick={(e) => {
                  if (!event.hostContact?.startsWith('http') && !event.hostContact?.includes('@')) {
                    e.preventDefault();
                    navigator.clipboard?.writeText(event.hostContact);
                    alert(`Host Contact: ${event.hostContact}\n(Copied to clipboard)`);
                  }
                }}
                title={`Contact Host: ${event.hostContact} (Click to open or copy)`}
                className="inline-flex items-center space-x-1 text-[10px] font-bold text-slate-700 hover:text-black bg-slate-100 hover:bg-slate-200 px-2 py-0.5 rounded-lg shrink-0 transition-colors ml-2 cursor-pointer border border-slate-200/60"
              >
                <MessageSquare className="w-3 h-3 text-slate-500 shrink-0" />
                <span className="max-w-[120px] truncate">{event.hostContact}</span>
              </a>
            )}
          </div>

          {/* Event Title */}
          <h3 className="font-montserrat font-bold text-sm sm:text-base text-slate-900 group-hover:text-black line-clamp-2 leading-snug">
            {event.title}
          </h3>

          {/* Description */}
          <p className="text-xs text-slate-500 line-clamp-2 mt-2 leading-relaxed">
            {event.description}
          </p>
        </div>

        {/* Card Footer: Timing & Action */}
        <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
          <div className="text-[11px] text-slate-500 font-medium">
            {event.status === 'completed' && event.winner ? (
              <span className="text-amber-600 font-bold flex items-center space-x-1">
                <Award className="w-3.5 h-3.5 text-amber-500" />
                <span className="truncate max-w-[130px]">Won by {event.winner}</span>
              </span>
            ) : (
              <span>{event.timeInfo}</span>
            )}
          </div>

          {/* Action Button */}
          {event.registrationUrl ? (
            <a
              href={event.registrationUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="px-3.5 py-1.5 rounded-xl bg-black hover:bg-neutral-800 text-white text-[11px] font-bold uppercase tracking-wider flex items-center space-x-1 transition-colors"
            >
              <span>Join</span>
              <ExternalLink className="w-3 h-3 ml-0.5" />
            </a>
          ) : event.streamUrl ? (
            <a
              href={event.streamUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="px-3.5 py-1.5 rounded-xl bg-red-600 hover:bg-red-700 text-white text-[11px] font-bold uppercase tracking-wider flex items-center space-x-1 transition-colors"
            >
              <span>Watch</span>
              <ExternalLink className="w-3 h-3 ml-0.5" />
            </a>
          ) : (
            <button
              onClick={() => {
                alert(`Event: ${event.title}\nHost: ${event.hostName}\nDetails: ${event.description}`);
              }}
              className="px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-[11px] font-bold transition-colors"
            >
              Details
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default Events;

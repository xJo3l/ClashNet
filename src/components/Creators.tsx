import React, { useState, useMemo, useEffect } from 'react';
import {
  Search,
  Plus,
  Youtube,
  ExternalLink,
  CheckCircle2,
  Users,
  Video,
  X,
  Play,
  Share2,
  Tv,
  ArrowUpRight,
  ArrowUpDown,
  ArrowDown,
  ArrowUp,
  Sparkles,
  ShieldCheck,
  ChevronRight,
  Check,
  Loader2,
} from 'lucide-react';

function formatSubscriberCount(countStr?: string): string {
  if (!countStr) return 'Creator';
  const num = parseInt(countStr, 10);
  if (isNaN(num)) return countStr;
  if (num >= 1000000) return `${(num / 1000000).toFixed(1).replace(/\.0$/, '')}M Subs`;
  if (num >= 1000) return `${(num / 1000).toFixed(1).replace(/\.0$/, '')}K Subs`;
  return `${num} Subs`;
}

function parseYouTubeInput(input: string): { handle?: string; channelId?: string; videoId?: string; cleanName: string } {
  const trimmed = input.trim();
  const withoutQuery = trimmed.replace(/\?.*$/, '').replace(/\/+$/, '');

  // Check for video URL: /watch?v=ID or youtu.be/ID or /shorts/ID
  const videoIdMatch = trimmed.match(/(?:youtube\.com\/(?:watch\?.*v=|shorts\/)|youtu\.be\/)([a-zA-Z0-9_-]{11})/);
  if (videoIdMatch) {
    return { videoId: videoIdMatch[1], cleanName: 'YouTube Creator' };
  }

  // Check for channel ID: /channel/UC...
  const channelIdMatch = withoutQuery.match(/youtube\.com\/channel\/([a-zA-Z0-9_-]+)/);
  if (channelIdMatch) {
    return { channelId: channelIdMatch[1], cleanName: channelIdMatch[1] };
  }

  // Check for @handle in URL or direct @handle
  const handleMatch = withoutQuery.match(/(?:youtube\.com\/(?:@)?|@)([a-zA-Z0-9._-]+)/);
  if (handleMatch) {
    const raw = handleMatch[1].replace(/\/.*$/, '');
    return { handle: raw, cleanName: raw };
  }

  // Check for custom/legacy URL: /c/name or /user/name
  const customUrlMatch = withoutQuery.match(/youtube\.com\/(?:c|user)\/([a-zA-Z0-9._-]+)/);
  if (customUrlMatch) {
    const raw = customUrlMatch[1].replace(/\/.*$/, '');
    return { handle: raw, cleanName: raw };
  }

  const cleaned = withoutQuery.replace(/^https?:\/\/(?:www\.)?youtube\.com\//, '').replace(/^@/, '').replace(/\/.*$/, '');
  return { handle: cleaned, cleanName: cleaned || 'Creator' };
}

// Types
export interface CreatorChannel {
  id: string;
  name: string;
  handle: string;
  subscribers: string;
  subscriberCount?: number;
  addedAt?: number;
  avatarUrl: string;
  bannerUrl?: string;
  bannerGradient: string;
  category: string;
  townHall: string;
  description: string;
  youtubeUrl: string;
  isVerified?: boolean;
  isCommunityAdded?: boolean;
}

export interface ContentItem {
  id: string;
  title: string;
  channelName: string;
  channelHandle: string;
  channelAvatar: string;
  thumbnailUrl: string;
  duration: string;
  views: string;
  timeAgo: string;
  category: string;
  townHall: string;
  youtubeUrl: string;
}

// Initial Community Channels (empty until added)
const INITIAL_CHANNELS: CreatorChannel[] = [];

// Content (empty until fetched from YouTube)
const PREVIEW_CONTENT: ContentItem[] = [];

export type SortCriterion = 'subscribers' | 'recent' | 'name';
export type SortDirection = 'desc' | 'asc';

function getSubscriberCount(channel: CreatorChannel): number {
  if (typeof channel.subscriberCount === 'number' && !isNaN(channel.subscriberCount)) {
    return channel.subscriberCount;
  }
  const str = channel.subscribers || '';
  const numStr = str.replace(/[^0-9.]/g, '');
  const val = parseFloat(numStr) || 0;
  if (/M/i.test(str)) return val * 1_000_000;
  if (/K/i.test(str)) return val * 1_000;
  return val;
}

function getChannelAddedTime(channel: CreatorChannel): number {
  if (typeof channel.addedAt === 'number') return channel.addedAt;
  const match = channel.id.match(/\d+/);
  return match ? parseInt(match[0], 10) : 0;
}

interface CreatorsProps {
  onNavigateHome?: () => void;
}

export const Creators: React.FC<CreatorsProps> = ({ onNavigateHome }) => {
  // Navigation / Tabs state
  const [activeSection, setActiveSection] = useState<'channels' | 'content'>('channels');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState<boolean>(false);

  // Search & Sort state (initially sorted by subscribers descending)
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [sortCriterion, setSortCriterion] = useState<SortCriterion>('subscribers');
  const [sortDirection, setSortDirection] = useState<SortDirection>('desc');
  const [isSortOpen, setIsSortOpen] = useState<boolean>(false);

  useEffect(() => {
    if (!isSortOpen) return;
    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (!target.closest('[data-sort-container]')) {
        setIsSortOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isSortOpen]);

  // Channels state (persists in localStorage so added channels stay uploaded on site)
  const [channels, setChannels] = useState<CreatorChannel[]>(() => {
    try {
      const saved = localStorage.getItem('clashnet_creator_channels_v3');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) return parsed;
      }
    } catch {
      // fallback
    }
    return INITIAL_CHANNELS;
  });

  useEffect(() => {
    try {
      localStorage.setItem('clashnet_creator_channels_v3', JSON.stringify(channels));
    } catch {
      // ignore
    }
  }, [channels]);

  // Modal state
  const [isAddModalOpen, setIsAddModalOpen] = useState<boolean>(false);
  const [youtubeLink, setYoutubeLink] = useState<string>('');
  const [isFetching, setIsFetching] = useState<boolean>(false);
  const [formSuccess, setFormSuccess] = useState<boolean>(false);

  // Handle Home navigation
  const handleGoHome = (e?: React.MouseEvent) => {
    if (e) e.preventDefault();
    if (onNavigateHome) {
      onNavigateHome();
    } else {
      window.location.hash = '#home';
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  // Filtered & Sorted Channels (initially sorted by subscribers descending)
  const filteredChannels = useMemo(() => {
    const list = channels.filter((channel) => {
      const matchesSearch =
        searchQuery.trim() === '' ||
        channel.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        channel.handle.toLowerCase().includes(searchQuery.toLowerCase()) ||
        channel.description.toLowerCase().includes(searchQuery.toLowerCase());

      return matchesSearch;
    });

    return [...list].sort((a, b) => {
      if (sortCriterion === 'subscribers') {
        const countA = getSubscriberCount(a);
        const countB = getSubscriberCount(b);
        return sortDirection === 'desc' ? countB - countA : countA - countB;
      } else if (sortCriterion === 'recent') {
        const timeA = getChannelAddedTime(a);
        const timeB = getChannelAddedTime(b);
        return sortDirection === 'desc' ? timeB - timeA : timeA - timeB;
      } else {
        const cmp = a.name.localeCompare(b.name, undefined, { sensitivity: 'base' });
        return sortDirection === 'asc' ? cmp : -cmp;
      }
    });
  }, [channels, searchQuery, sortCriterion, sortDirection]);

  // Filtered Content (Mock auto-fetch preview)
  const filteredContent = useMemo(() => {
    return PREVIEW_CONTENT.filter((item) => {
      const matchesSearch =
        searchQuery.trim() === '' ||
        item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.channelName.toLowerCase().includes(searchQuery.toLowerCase());

      return matchesSearch;
    });
  }, [searchQuery]);

  // Submit new channel with YouTube Data API auto-fetch (multi-stage resolution & banner fetch)
  const handleAddChannelSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const rawLink = youtubeLink.trim();
    if (!rawLink) return;

    setIsFetching(true);

    const apiKey = import.meta.env.VITE_YOUTUBE_API_KEY;
    const { handle, channelId: parsedChannelId, videoId, cleanName } = parseYouTubeInput(rawLink);

    let channelName = cleanName;
    let channelHandle = handle ? (handle.startsWith('@') ? handle : `@${handle}`) : `@${cleanName}`;
    let avatarUrl = `https://api.dicebear.com/7.x/identicon/svg?seed=${encodeURIComponent(cleanName)}`;
    let bannerUrl: string | undefined = undefined;
    let subscribers = 'Community Creator';
    let subscriberCountNumber = 0;
    let description = 'Clash of Clans YouTube creator.';
    let isVerified = false;
    let finalYoutubeUrl = rawLink.startsWith('http')
      ? rawLink
      : `https://www.youtube.com/${channelHandle}`;

    if (apiKey) {
      try {
        let targetChannelId = parsedChannelId;

        // If video URL was provided, resolve channel ID first
        if (!targetChannelId && videoId) {
          try {
            const vRes = await fetch(
              `https://www.googleapis.com/youtube/v3/videos?part=snippet&id=${encodeURIComponent(videoId)}&key=${apiKey}`
            );
            const vData = await vRes.json();
            if (vData.items?.[0]?.snippet?.channelId) {
              targetChannelId = vData.items[0].snippet.channelId;
            }
          } catch {
            // continue
          }
        }

        const handleWithAt = handle ? (handle.startsWith('@') ? handle : `@${handle}`) : '';
        const handleWithoutAt = handle ? handle.replace(/^@/, '') : '';

        let channelItem: any = null;

        // Method 1: If channelId is present (e.g. youtube.com/channel/UC...)
        if (targetChannelId) {
          const res = await fetch(
            `https://www.googleapis.com/youtube/v3/channels?part=snippet,statistics,brandingSettings&id=${encodeURIComponent(targetChannelId)}&key=${apiKey}`
          );
          const data = await res.json();
          if (data.items?.length > 0) channelItem = data.items[0];
        }

        // Method 2: Query by handle WITH '@' prefix (Google YouTube Data API v3 requirement)
        if (!channelItem && handleWithAt) {
          const res = await fetch(
            `https://www.googleapis.com/youtube/v3/channels?part=snippet,statistics,brandingSettings&forHandle=${encodeURIComponent(handleWithAt)}&key=${apiKey}`
          );
          const data = await res.json();
          if (data.items?.length > 0) channelItem = data.items[0];
        }

        // Method 3: Query by handle WITHOUT '@' prefix
        if (!channelItem && handleWithoutAt) {
          const res = await fetch(
            `https://www.googleapis.com/youtube/v3/channels?part=snippet,statistics,brandingSettings&forHandle=${encodeURIComponent(handleWithoutAt)}&key=${apiKey}`
          );
          const data = await res.json();
          if (data.items?.length > 0) channelItem = data.items[0];
        }

        // Method 4: Query by legacy username (for older channels)
        if (!channelItem && handleWithoutAt) {
          const res = await fetch(
            `https://www.googleapis.com/youtube/v3/channels?part=snippet,statistics,brandingSettings&forUsername=${encodeURIComponent(handleWithoutAt)}&key=${apiKey}`
          );
          const data = await res.json();
          if (data.items?.length > 0) channelItem = data.items[0];
        }

        // Method 5: Search API fallback (finds the channel even with complex names, handles or punctuation)
        if (!channelItem && (handleWithAt || cleanName)) {
          const searchQuery = handleWithAt || cleanName;
          const searchRes = await fetch(
            `https://www.googleapis.com/youtube/v3/search?part=snippet&type=channel&q=${encodeURIComponent(searchQuery)}&maxResults=1&key=${apiKey}`
          );
          const searchData = await searchRes.json();
          const foundId = searchData.items?.[0]?.snippet?.channelId || searchData.items?.[0]?.id?.channelId;
          if (foundId) {
            const res = await fetch(
              `https://www.googleapis.com/youtube/v3/channels?part=snippet,statistics,brandingSettings&id=${encodeURIComponent(foundId)}&key=${apiKey}`
            );
            const data = await res.json();
            if (data.items?.length > 0) channelItem = data.items[0];
          }
        }

        // If channel data is found, populate full metadata & banner
        if (channelItem) {
          const snippet = channelItem.snippet || {};
          const stats = channelItem.statistics || {};
          const branding = channelItem.brandingSettings || {};

          channelName = snippet.title || channelName;
          if (snippet.customUrl) {
            channelHandle = snippet.customUrl.startsWith('@') ? snippet.customUrl : `@${snippet.customUrl}`;
          }
          if (snippet.thumbnails?.medium?.url || snippet.thumbnails?.high?.url || snippet.thumbnails?.default?.url) {
            avatarUrl = snippet.thumbnails.medium?.url || snippet.thumbnails.high?.url || snippet.thumbnails.default?.url;
          }
          if (branding.image?.bannerExternalUrl) {
            bannerUrl = branding.image.bannerExternalUrl;
          }
          if (snippet.description) {
            description = snippet.description;
          }
          if (stats.subscriberCount) {
            subscriberCountNumber = parseInt(stats.subscriberCount, 10) || 0;
            subscribers = formatSubscriberCount(stats.subscriberCount);
          }
          isVerified = true;
          finalYoutubeUrl = `https://www.youtube.com/${channelHandle}`;
        }
      } catch (err) {
        console.warn('YouTube API fetch error:', err);
      }
    }

    const now = Date.now();
    const newChannel: CreatorChannel = {
      id: `comm-${now}`,
      name: channelName,
      handle: channelHandle,
      subscribers: subscribers,
      subscriberCount: subscriberCountNumber,
      addedAt: now,
      avatarUrl: avatarUrl,
      bannerUrl: bannerUrl,
      bannerGradient: 'from-slate-900 via-neutral-800 to-black',
      category: 'Clash Creator',
      townHall: 'All Town Halls',
      description: description,
      youtubeUrl: finalYoutubeUrl,
      isVerified: isVerified,
      isCommunityAdded: true,
    };

    setChannels((prev) => [newChannel, ...prev]);
    setIsFetching(false);
    setFormSuccess(true);

    setTimeout(() => {
      setFormSuccess(false);
      setIsAddModalOpen(false);
      setYoutubeLink('');
    }, 1200);
  };

  return (
    <div id="creators" data-page="creators" className="min-h-screen bg-white text-slate-900 font-outfit selection:bg-rose-500 selection:text-white flex flex-col">
      {/* 
        =======================================================================
        TOP NAVBAR (BLACK STYLING - NEVER FADES AWAY OR HIDES ON SCROLL)
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

          {/* Desktop Navigation Links (Black theme, permanent) */}
          <div className="hidden md:flex flex-1 justify-center items-center">
            <ul className="flex items-center space-x-12">
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
                <span className="relative inline-block py-1 text-xs md:text-sm font-bold uppercase tracking-[0.22em] text-black cursor-default after:content-[''] after:absolute after:bottom-[-6px] after:left-1/2 after:-translate-x-1/2 after:h-[2px] after:bg-black after:w-full">
                  CREATORS
                </span>
              </li>
              <li>
                <a
                  href="#events"
                  className="relative inline-block py-1 text-xs md:text-sm font-bold uppercase tracking-[0.22em] text-black/70 hover:text-black hover:-translate-y-[2px] transition-all duration-200 after:content-[''] after:absolute after:bottom-[-6px] after:left-1/2 after:-translate-x-1/2 after:h-[2px] after:bg-black after:w-0 hover:after:w-full after:transition-all after:duration-300"
                >
                  EVENTS
                </a>
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
            <button
              className="relative px-6 py-2 rounded-full border border-black/30 hover:border-black text-black hover:bg-black/5 text-xs md:text-sm font-bold uppercase tracking-[0.18em] transition-all duration-200 ease-out active:scale-95"
            >
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
                <span className="inline-block py-1 text-sm font-bold uppercase tracking-[0.22em] text-black border-b-2 border-black">
                  CREATORS
                </span>
              </li>
              <li>
                <a
                  href="#events"
                  className="inline-block py-1 text-sm font-bold uppercase tracking-[0.22em] text-black/70 hover:text-black"
                >
                  EVENTS
                </a>
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
        HERO SECTION (WHITE BACKGROUND)
        =======================================================================
      */}
      <main className="flex-1">
        <section className="relative pt-8 pb-12 px-6 md:px-10 max-w-7xl mx-auto">
          {/* Top Controls: Search Bar on Left, Filter and Add Channel on Right */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 mb-6">
            {/* Search Input Box (Left Side) */}
            <div className="relative flex-1">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400">
                <Search className="w-5 h-5" />
              </div>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search creator name, @handle, Town Hall level, or strategy type..."
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

            {/* Right: Filter Button & Add Channel Button */}
            <div className="flex items-center gap-3 shrink-0">
              {/* Sort Button & Dropdown */}
              <div className="relative" data-sort-container>
                <button
                  onClick={() => setIsSortOpen(!isSortOpen)}
                  className={`flex items-center space-x-2 px-5 py-3 rounded-2xl border text-xs font-bold uppercase tracking-wider transition-all duration-200 ${
                    isSortOpen
                      ? 'bg-black text-white border-black shadow-sm'
                      : 'bg-slate-50 hover:bg-slate-100 text-slate-800 border-slate-200'
                  }`}
                >
                  <ArrowUpDown className="w-4 h-4" />
                  <span>Sort</span>
                </button>

                {/* Sort Dropdown */}
                {isSortOpen && (
                  <div className="absolute right-0 mt-2 w-64 p-2.5 bg-white rounded-2xl shadow-xl border border-slate-200 z-30 animate-fadeIn">
                    <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400 px-2.5 py-1 mb-1">
                      Sort By
                    </div>

                    {/* Criteria options: Subscribers, Newly Added, or A-Z */}
                    <div className="space-y-1 mb-2">
                      <button
                        onClick={() => setSortCriterion('subscribers')}
                        className={`w-full text-left px-3 py-2.5 rounded-xl text-xs font-semibold flex items-center justify-between transition-colors ${
                          sortCriterion === 'subscribers'
                            ? 'bg-black text-white'
                            : 'text-slate-700 hover:bg-slate-100'
                        }`}
                      >
                        <span>Subscribers</span>
                        {sortCriterion === 'subscribers' && <Check className="w-3.5 h-3.5" />}
                      </button>

                      <button
                        onClick={() => setSortCriterion('recent')}
                        className={`w-full text-left px-3 py-2.5 rounded-xl text-xs font-semibold flex items-center justify-between transition-colors ${
                          sortCriterion === 'recent'
                            ? 'bg-black text-white'
                            : 'text-slate-700 hover:bg-slate-100'
                        }`}
                      >
                        <span>Newly Added</span>
                        {sortCriterion === 'recent' && <Check className="w-3.5 h-3.5" />}
                      </button>

                      <button
                        onClick={() => setSortCriterion('name')}
                        className={`w-full text-left px-3 py-2.5 rounded-xl text-xs font-semibold flex items-center justify-between transition-colors ${
                          sortCriterion === 'name'
                            ? 'bg-black text-white'
                            : 'text-slate-700 hover:bg-slate-100'
                        }`}
                      >
                        <span>A - Z</span>
                        {sortCriterion === 'name' && <Check className="w-3.5 h-3.5" />}
                      </button>
                    </div>

                    {/* Order Selection in the same single line */}
                    <div className="pt-2 border-t border-slate-100 flex items-center justify-between px-1">
                      <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                        Order
                      </span>
                      <div className="flex items-center gap-1 bg-slate-100 p-0.5 rounded-xl">
                        <button
                          type="button"
                          onClick={() => setSortDirection('desc')}
                          title="Descending"
                          className={`flex items-center space-x-1.5 py-1.5 px-2.5 rounded-lg text-xs font-bold transition-all ${
                            sortDirection === 'desc'
                              ? 'bg-black text-white shadow-sm'
                              : 'text-slate-600 hover:text-black'
                          }`}
                        >
                          <ArrowDown className="w-3.5 h-3.5" />
                          <span>Desc</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => setSortDirection('asc')}
                          title="Ascending"
                          className={`flex items-center space-x-1.5 py-1.5 px-2.5 rounded-lg text-xs font-bold transition-all ${
                            sortDirection === 'asc'
                              ? 'bg-black text-white shadow-sm'
                              : 'text-slate-600 hover:text-black'
                          }`}
                        >
                          <ArrowUp className="w-3.5 h-3.5" />
                          <span>Asc</span>
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Add Channel Button */}
              <button
                onClick={() => setIsAddModalOpen(true)}
                className="flex items-center space-x-2 px-6 py-3 rounded-2xl bg-black hover:bg-neutral-800 text-white text-xs font-bold uppercase tracking-[0.16em] transition-all duration-200 shadow-sm hover:scale-105 active:scale-95"
              >
                <Plus className="w-4 h-4 text-rose-400" />
                <span>Add Channel</span>
              </button>
            </div>
          </div>

          {/* 
            =======================================================================
            2 SECTIONS SWITCHER: "CHANNELS" & "CONTENT"
            =======================================================================
          */}
          <div className="border-b border-slate-200 mb-8">
            <div className="flex space-x-8">
              {/* CHANNELS SECTION TAB */}
              <button
                onClick={() => setActiveSection('channels')}
                className={`group flex items-center space-x-2.5 pb-4 text-sm md:text-base font-bold uppercase tracking-[0.16em] transition-all relative ${
                  activeSection === 'channels'
                    ? 'text-black'
                    : 'text-slate-400 hover:text-slate-700'
                }`}
              >
                <Tv className={`w-4 h-4 ${activeSection === 'channels' ? 'text-black' : 'text-slate-400'}`} />
                <span>Channels</span>
                <span className={`text-[11px] px-2 py-0.5 rounded-full font-semibold ${
                  activeSection === 'channels'
                    ? 'bg-black text-white'
                    : 'bg-slate-100 text-slate-500'
                }`}>
                  {filteredChannels.length}
                </span>
                {activeSection === 'channels' && (
                  <div className="absolute bottom-0 left-0 right-0 h-[2.5px] bg-black rounded-full" />
                )}
              </button>

              {/* CONTENT SECTION TAB */}
              <button
                onClick={() => setActiveSection('content')}
                className={`group flex items-center space-x-2.5 pb-4 text-sm md:text-base font-bold uppercase tracking-[0.16em] transition-all relative ${
                  activeSection === 'content'
                    ? 'text-black'
                    : 'text-slate-400 hover:text-slate-700'
                }`}
              >
                <Video className={`w-4 h-4 ${activeSection === 'content' ? 'text-black' : 'text-slate-400'}`} />
                <span>Content</span>
                <span className={`text-[11px] px-2 py-0.5 rounded-full font-semibold ${
                  activeSection === 'content'
                    ? 'bg-black text-white'
                    : 'bg-slate-100 text-slate-500'
                }`}>
                  {filteredContent.length}
                </span>
                {activeSection === 'content' && (
                  <div className="absolute bottom-0 left-0 right-0 h-[2.5px] bg-black rounded-full" />
                )}
              </button>
            </div>
          </div>

          {/* 
            =======================================================================
            SECTION 1: CHANNELS (People add their youtube channels to promote themselves)
            =======================================================================
          */}
          {activeSection === 'channels' && (
            <div className="animate-fadeIn">

              {/* Channels Grid */}
              {filteredChannels.length === 0 ? (
                <div className="text-center py-16 bg-slate-50 rounded-3xl border border-dashed border-slate-300">
                  <Users className="w-12 h-12 text-slate-400 mx-auto mb-3" />
                  <h3 className="text-lg font-bold text-slate-800">No channels found</h3>
                  <p className="text-sm text-slate-500 max-w-md mx-auto mt-1 mb-6">
                    We couldn't find any channels matching &quot;{searchQuery}&quot;. Be the first to add a channel!
                  </p>
                  <button
                    onClick={() => setIsAddModalOpen(true)}
                    className="px-6 py-2.5 rounded-full bg-black text-white text-xs font-bold uppercase tracking-wider hover:bg-slate-800 transition-all"
                  >
                    Add Channel Now
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredChannels.map((channel) => (
                    <div
                      key={channel.id}
                      className="group bg-white rounded-3xl border border-slate-200/90 overflow-hidden shadow-sm hover:shadow-xl hover:border-slate-300 transition-all duration-300 flex flex-col justify-between"
                    >
                      {/* Card Top Banner */}
                      <div>
                        {/* Card Top Banner with real YouTube banner */}
                        <div className={`h-28 md:h-32 relative overflow-hidden flex justify-between items-start p-3 ${channel.bannerUrl ? 'bg-slate-900' : `bg-gradient-to-r ${channel.bannerGradient}`}`}>
                          {channel.bannerUrl && (
                            <img
                              src={channel.bannerUrl}
                              alt={`${channel.name} Banner`}
                              referrerPolicy="no-referrer"
                              className="absolute inset-0 w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
                              onError={(e) => {
                                (e.target as HTMLImageElement).style.display = 'none';
                              }}
                            />
                          )}
                          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/15 to-transparent pointer-events-none" />

                          {/* Delete/Remove button if community added */}
                          {channel.isCommunityAdded ? (
                            <button
                              onClick={(e) => {
                                e.preventDefault();
                                e.stopPropagation();
                                setChannels((prev) => prev.filter((c) => c.id !== channel.id));
                              }}
                              title="Remove channel"
                              className="relative z-10 w-7 h-7 rounded-full bg-black/60 hover:bg-red-600 text-white/90 hover:text-white flex items-center justify-center backdrop-blur-md transition-all shadow"
                            >
                              <X className="w-3.5 h-3.5" />
                            </button>
                          ) : (
                            <div />
                          )}

                          <div className="relative z-10 w-7 h-7 rounded-full bg-black/50 backdrop-blur-md flex items-center justify-center text-white/90 shadow">
                            <Youtube className="w-3.5 h-3.5 text-red-500" />
                          </div>
                        </div>

                        {/* Avatar & Header */}
                        <div className="px-6 pt-0 pb-4 relative">
                          <div className="-mt-10 mb-3 flex items-end justify-between">
                            <div className="relative">
                              <img
                                src={channel.avatarUrl}
                                alt={channel.name}
                                referrerPolicy="no-referrer"
                                className="w-20 h-20 rounded-2xl object-cover border-4 border-white shadow-md bg-white"
                                onError={(e) => {
                                  (e.target as HTMLImageElement).src = `https://api.dicebear.com/7.x/identicon/svg?seed=${encodeURIComponent(channel.name)}`;
                                }}
                              />
                              <div className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-red-600 text-white flex items-center justify-center shadow">
                                <Youtube className="w-3.5 h-3.5" />
                              </div>
                            </div>
                            <span className="text-xs font-bold uppercase tracking-wider text-slate-500 bg-slate-100 px-3 py-1 rounded-full">
                              {channel.subscribers}
                            </span>
                          </div>

                          {/* Channel Details */}
                          <div className="flex items-center space-x-1.5 mb-0.5">
                            <h3 className="font-montserrat font-bold text-lg text-slate-900 group-hover:text-black">
                              {channel.name}
                            </h3>
                            {channel.isVerified && (
                              <CheckCircle2 className="w-4 h-4 text-rose-500 fill-rose-500/10 shrink-0" />
                            )}
                          </div>

                          <div className="text-xs font-medium text-slate-500 mb-3">
                            {channel.handle}
                          </div>

                          <p className="text-xs text-slate-600 leading-relaxed line-clamp-3 mb-4">
                            {channel.description}
                          </p>
                        </div>
                      </div>

                      {/* Card Footer Actions */}
                      <div className="px-6 pb-6 pt-2 border-t border-slate-100 flex items-center gap-3">
                        <a
                          href={channel.youtubeUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex-1 py-2.5 px-4 rounded-xl bg-black hover:bg-neutral-800 text-white text-xs font-bold uppercase tracking-[0.14em] text-center transition-all duration-200 flex items-center justify-center space-x-2 group-hover:shadow-md"
                        >
                          <Youtube className="w-3.5 h-3.5 text-red-500" />
                          <span>Visit Channel</span>
                          <ArrowUpRight className="w-3.5 h-3.5 opacity-60" />
                        </a>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* 
            =======================================================================
            SECTION 2: CONTENT (Automatically fetched from YouTube - To build later)
            =======================================================================
          */}
          {activeSection === 'content' && (
            <div className="py-4 animate-fadeIn">

              {/* Video Feed / Empty State */}
              {filteredContent.length === 0 ? (
                <div className="text-center py-16 bg-slate-50 rounded-3xl border border-dashed border-slate-300">
                  <Video className="w-12 h-12 text-slate-400 mx-auto mb-3" />
                  <h3 className="text-lg font-bold text-slate-800">No content available</h3>
                  <p className="text-sm text-slate-500 max-w-md mx-auto mt-1">
                    YouTube videos and guides will appear here once connected and synchronized with creator channels.
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-8">
                  {filteredContent.map((video) => (
                    <div
                      key={video.id}
                      className="group bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-sm hover:shadow-xl hover:border-slate-300 transition-all duration-300 flex flex-col"
                    >
                      {/* Video Thumbnail with duration overlay */}
                      <div className="relative aspect-video w-full overflow-hidden bg-slate-900">
                        <img
                          src={video.thumbnailUrl}
                          alt={video.title}
                          referrerPolicy="no-referrer"
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-90 group-hover:opacity-100"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                        
                        {/* Play Button Overlay */}
                        <div className="absolute inset-0 flex items-center justify-center">
                          <div className="w-14 h-14 rounded-full bg-red-600/90 text-white flex items-center justify-center shadow-lg group-hover:scale-110 group-hover:bg-red-600 transition-all duration-200">
                            <Play className="w-6 h-6 fill-white ml-0.5" />
                          </div>
                        </div>

                        {/* Duration badge */}
                        <div className="absolute bottom-3 right-3 px-2 py-0.5 rounded bg-black/80 text-[11px] font-mono font-bold text-white">
                          {video.duration}
                        </div>
                      </div>

                      {/* Content Details */}
                      <div className="p-6 flex-1 flex flex-col justify-between">
                        <div>
                          <div className="flex items-center space-x-2.5 mb-3">
                            <img
                              src={video.channelAvatar}
                              alt={video.channelName}
                              referrerPolicy="no-referrer"
                              className="w-8 h-8 rounded-full object-cover border border-slate-200"
                            />
                            <div>
                              <span className="text-xs font-bold text-slate-900 block leading-tight">
                                {video.channelName}
                              </span>
                              <span className="text-[11px] text-slate-500 block">
                                {video.views} • {video.timeAgo}
                              </span>
                            </div>
                          </div>

                          <h3 className="font-montserrat font-bold text-base md:text-lg text-slate-900 group-hover:text-black line-clamp-2 leading-snug">
                            {video.title}
                          </h3>
                        </div>

                        <div className="mt-5 pt-4 border-t border-slate-100 flex items-center justify-between">
                          <span className="text-xs font-semibold text-slate-400 flex items-center">
                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 mr-1.5" />
                            YouTube Video
                          </span>
                          <a
                            href={video.youtubeUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center space-x-1.5 text-xs font-bold uppercase tracking-wider text-black hover:text-red-600 transition-colors"
                          >
                            <span>Watch on YouTube</span>
                            <ArrowUpRight className="w-3.5 h-3.5" />
                          </a>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </section>
      </main>

      {/* 
        =======================================================================
        PROMOTIONAL "ADD YOUTUBE CHANNEL" MODAL
        =======================================================================
      */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 md:p-8 shadow-2xl border border-slate-200 relative overflow-hidden">
            {/* Modal Header */}
            <div className="flex items-start justify-between pb-4 border-b border-slate-100">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded-2xl bg-red-600 text-white flex items-center justify-center shadow-md">
                  <Youtube className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-montserrat font-bold text-xl text-black">
                    Promote Your Channel
                  </h3>
                  <p className="text-xs text-slate-500">
                    Join the ClashNet creator directory for free
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
                <h4 className="font-bold text-lg text-slate-900">Channel Added Successfully!</h4>
                <p className="text-xs text-slate-500 mt-1">
                  Your channel is now live in the ClashNet directory.
                </p>
              </div>
            ) : (
              /* Modal Form */
              <form onSubmit={handleAddChannelSubmit} className="mt-6 space-y-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
                    YouTube Channel Link *
                  </label>
                  <input
                    type="text"
                    required
                    value={youtubeLink}
                    onChange={(e) => setYoutubeLink(e.target.value)}
                    placeholder="https://www.youtube.com/@YourChannel or @handle"
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-black placeholder-slate-400 transition-all"
                  />
                  <p className="mt-1.5 text-[11px] text-slate-500">
                    Paste your YouTube channel link or @handle to promote your channel.
                  </p>
                </div>

                <div className="pt-2 flex items-center justify-end space-x-3">
                  <button
                    type="button"
                    onClick={() => setIsAddModalOpen(false)}
                    className="px-5 py-2.5 rounded-full text-xs font-bold uppercase tracking-wider text-slate-600 hover:text-black transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isFetching}
                    className="px-6 py-2.5 rounded-full bg-black text-white hover:bg-neutral-800 text-xs font-bold uppercase tracking-[0.16em] transition-all hover:scale-105 active:scale-95 shadow-md flex items-center space-x-2 disabled:opacity-75 disabled:pointer-events-none"
                  >
                    {isFetching ? (
                      <>
                        <Loader2 className="w-3.5 h-3.5 animate-spin text-rose-400" />
                        <span>Fetching Details...</span>
                      </>
                    ) : (
                      <>
                        <Plus className="w-3.5 h-3.5 text-rose-400" />
                        <span>Publish Channel</span>
                      </>
                    )}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}

      {/* Padding at bottom of page */}
      <div className="pb-16" />
    </div>
  );
};

export default Creators;

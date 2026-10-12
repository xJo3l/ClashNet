import React, { useState, useMemo, useEffect, useRef } from 'react';
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
  AlertCircle,
  Loader2,
  Radio,
  SlidersHorizontal,
  ChevronDown,
  Clock,
  Calendar,
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
  const withoutQuery = trimmed.replace(/[?#].*$/, '').replace(/\/+$/, '');

  // 1. Check for video URL: /watch?v=ID or youtu.be/ID or /shorts/ID
  const videoIdMatch = trimmed.match(/(?:youtube\.com\/(?:watch\?.*v=|shorts\/)|youtu\.be\/)([a-zA-Z0-9_-]{11})/);
  if (videoIdMatch) {
    return { videoId: videoIdMatch[1], cleanName: 'YouTube Creator' };
  }

  // 2. Check for channel ID: /channel/(UC...)
  const channelIdMatch = withoutQuery.match(/youtube\.com\/channel\/([a-zA-Z0-9_-]+)/i);
  if (channelIdMatch) {
    const raw = channelIdMatch[1].replace(/\/.*$/, '');
    return { channelId: raw, cleanName: raw };
  }

  // 3. Check for custom/legacy URL: /c/name or /user/name
  const customUrlMatch = withoutQuery.match(/youtube\.com\/(?:c|user)\/([a-zA-Z0-9._-]+)/i);
  if (customUrlMatch) {
    const raw = customUrlMatch[1].replace(/\/.*$/, '');
    return { handle: raw, cleanName: raw };
  }

  // 4. Check for @handle in URL or direct @handle (e.g. youtube.com/@handle or @handle)
  const handleMatch = withoutQuery.match(/(?:youtube\.com\/@|^@)([a-zA-Z0-9._-]+)/i);
  if (handleMatch) {
    const raw = handleMatch[1].replace(/\/.*$/, '');
    return { handle: raw, cleanName: raw };
  }

  // 5. Check for direct vanity path: youtube.com/handle (without @, c, user)
  const vanityMatch = withoutQuery.match(/youtube\.com\/([a-zA-Z0-9._-]+)/i);
  if (vanityMatch) {
    const raw = vanityMatch[1].replace(/\/.*$/, '');
    const reserved = ['feed', 'gaming', 'watch', 'shorts', 'playlist', 'results', 'channel', 'c', 'user', 'live'];
    if (!reserved.includes(raw.toLowerCase())) {
      return { handle: raw, cleanName: raw };
    }
  }

  // 6. Direct input fallback
  const cleaned = withoutQuery.replace(/^https?:\/\/(?:www\.)?youtube\.com\//i, '').replace(/^@/, '').replace(/\/.*$/, '');
  return { handle: cleaned, cleanName: cleaned || 'Creator' };
}

// Types
export interface CreatorChannel {
  id: string;
  youtubeChannelId?: string;
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

export type VideoType = 'video' | 'short' | 'live';

export interface YouTubeVideoItem {
  id: string;
  videoId: string;
  title: string;
  description?: string;
  tags?: string[];
  thumbnailUrl: string;
  publishedAt: string;
  timeAgo: string;
  channelId: string;
  channelName: string;
  channelAvatar: string;
  channelHandle?: string;
  durationSeconds?: number;
  formattedDuration?: string;
  videoType: VideoType;
  isLive?: boolean;
  isUpcoming?: boolean;
}

// Initial Community Channels (empty until added)
const INITIAL_CHANNELS: CreatorChannel[] = [];

function parseDurationToSeconds(durationStr?: string): number {
  if (!durationStr) return 0;
  const match = durationStr.match(/PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?/);
  if (!match) return 0;
  const hours = parseInt(match[1] || '0', 10);
  const minutes = parseInt(match[2] || '0', 10);
  const seconds = parseInt(match[3] || '0', 10);
  return hours * 3600 + minutes * 60 + seconds;
}

function formatDuration(seconds: number): string {
  if (seconds <= 0) return '';
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = seconds % 60;
  if (h > 0) {
    return `${h}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  }
  return `${m}:${s.toString().padStart(2, '0')}`;
}

function formatTimeAgo(dateStr: string): string {
  try {
    const date = new Date(dateStr);
    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

    if (diffInSeconds < 60) return 'Just now';
    const diffInMinutes = Math.floor(diffInSeconds / 60);
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
    const diffInHours = Math.floor(diffInMinutes / 60);
    if (diffInHours < 24) return `${diffInHours}h ago`;
    const diffInDays = Math.floor(diffInHours / 24);
    if (diffInDays < 7) return `${diffInDays}d ago`;
    const diffInWeeks = Math.floor(diffInDays / 7);
    if (diffInWeeks < 4) return `${diffInWeeks}w ago`;
    const diffInMonths = Math.floor(diffInDays / 30);
    if (diffInMonths < 12) return `${diffInMonths}mo ago`;
    const diffInYears = Math.floor(diffInDays / 365);
    return `${diffInYears}y ago`;
  } catch {
    return 'Recently';
  }
}

function isVideoUpcoming(v: YouTubeVideoItem): boolean {
  if (v.isUpcoming || v.formattedDuration === 'UPCOMING') return true;
  // If not currently live and has 0 or empty duration
  if (
    !v.isLive &&
    v.formattedDuration !== 'LIVE' &&
    (!v.durationSeconds || v.durationSeconds === 0) &&
    (!v.formattedDuration || v.formattedDuration === '' || v.videoType === 'live')
  ) {
    return true;
  }
  return false;
}

function getVideoType(v: YouTubeVideoItem): VideoType {
  if (v.isLive || v.isUpcoming || v.formattedDuration === 'UPCOMING' || v.formattedDuration === 'LIVE' || isVideoUpcoming(v)) {
    return 'live';
  }
  if (v.videoType === 'live' || v.videoType === 'short' || v.videoType === 'video') {
    return v.videoType;
  }
  const title = (v.title || '').toLowerCase();
  if (title.includes('🔴') || title.includes('livestream') || title.includes('live stream')) {
    return 'live';
  }
  const dur = v.durationSeconds || 0;
  if ((dur > 0 && dur <= 180) || title.includes('#short') || title.includes('#shorts')) {
    return 'short';
  }
  return 'video';
}

export type SortCriterion = 'subscribers' | 'recent' | 'name';
export type VideoSortCriterion = 'date' | 'duration';
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

// Clash of Clans content identification terms
const COC_KEYWORDS = [
  'clash of clans',
  'clashofclans',
  'clash',
  'coc',
  'supercell',
  'town hall',
  'townhall',
  'builder base',
  'builder hall',
  'clan war',
  'clan wars',
  'war attacks',
  'clan capital',
  'capital raid',
  'raid weekend',
  'cwl',
  'legend league',
  'th7', 'th8', 'th9', 'th10', 'th11', 'th12', 'th13', 'th14', 'th15', 'th16', 'th17', 'th18',
  'th 7', 'th 8', 'th 9', 'th 10', 'th 11', 'th 12', 'th 13', 'th 14', 'th 15', 'th 16', 'th 17', 'th 18',
  'electro dragon',
  'dragon rider',
  'root rider',
  'hog rider',
  'barbarian king',
  'archer queen',
  'grand warden',
  'royal champion',
  'minion prince',
  'pekka',
  'golem',
  'witch',
  'bowler',
  'valkyrie',
  'hero equipment',
  'giant gauntlet',
  'frozen arrow',
  'fireball',
  'spiky ball',
  'rocket spear',
  'magic mirror',
  'action figure',
  'judosloth',
  'judo sloth',
  'itzu',
  'carbonfin',
  'ericone',
  'sumit 007',
  'pixel gaming',
  'world championship',
  'last chance qualifier',
  'lcq',
  'golden ticket',
  'qualifier',
  'base design',
  'base layout',
  'war base',
  'trophy base',
  '3 star',
  'three star',
  'hammer jam',
  'clan games',
  'super troop',
  'super troops',
  'sneaky goblin',
  'super archer',
  'super bowler',
  'super dragon',
  'super wizard',
  'super miner',
  'super witch',
  'apprentice warden',
  'druid',
  'flame flinger',
  'battle drill',
  'log launcher',
  'wall wrecker',
  'battle blimp',
  'siege machine',
  'dark elixir',
  'blacksmith',
  'starry ore',
  'glowy ore',
  'shiny ore',
];

const NON_COC_GAME_TERMS = [
  'clash royale',
  'clashroyale',
  'brawl stars',
  'brawlstars',
  'squad busters',
  'squadbusters',
  'hay day',
  'boom beach',
  'mo.co',
  'minecraft',
  'fortnite',
  'roblox',
  'pubg',
  'bgmi',
  'free fire',
  'valorant',
  'gta 5',
  'gta v',
  'gta online',
  'call of duty',
  'cod mobile',
  'codm',
  'genshin impact',
  'league of legends',
  'apex legends',
  'fifa',
  'fc 24',
  'fc 25',
  'efootball',
];

function isNonCocGame(text?: string): boolean {
  if (!text) return false;
  const lower = text.toLowerCase();
  return NON_COC_GAME_TERMS.some((term) => lower.includes(term));
}

function matchesClashOfClans(text?: string): boolean {
  if (!text) return false;
  const lower = text.toLowerCase();
  return COC_KEYWORDS.some((kw) => {
    if (kw.length <= 4) {
      const reg = new RegExp(`\\b${kw}\\b`, 'i');
      return reg.test(lower);
    }
    return lower.includes(kw);
  });
}

function isClashOfClansVideo(v: YouTubeVideoItem): boolean {
  const title = v.title || '';
  const desc = v.description || '';
  const tagsStr = (v.tags || []).join(' ');

  // 1. If title is explicitly about another non-CoC game and doesn't mention Clash of Clans
  if (isNonCocGame(title)) {
    const lowerTitle = title.toLowerCase();
    const hasExplicitCoc =
      lowerTitle.includes('clash of clans') ||
      /\bcoc\b/i.test(lowerTitle) ||
      lowerTitle.includes('town hall') ||
      lowerTitle.includes('supercell');
    if (!hasExplicitCoc) return false;
  }

  // 2. Direct match on title
  if (matchesClashOfClans(title)) return true;

  // 3. Direct match on description or tags
  if ((desc && matchesClashOfClans(desc)) || (tagsStr && matchesClashOfClans(tagsStr))) {
    if (!isNonCocGame(title)) return true;
  }

  // 4. Dedicated Clash of Clans channel uploads
  const chLower = (v.channelName || '').toLowerCase();
  const isDedicatedCocChannel =
    chLower.includes('clash of clans') ||
    chLower.includes('coc') ||
    chLower.includes('judo sloth') ||
    chLower.includes('itzu');

  if (isDedicatedCocChannel && !isNonCocGame(title)) {
    return true;
  }

  return false;
}

interface CreatorsProps {
  onNavigateHome?: () => void;
  onNavigateEvents?: () => void;
}

export const Creators: React.FC<CreatorsProps> = ({ onNavigateHome, onNavigateEvents }) => {
  // Navigation / Tabs state
  const [activeSection, setActiveSection] = useState<'channels' | 'content'>('channels');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState<boolean>(false);

  // Search & Sort state (initially sorted by subscribers descending)
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [sortCriterion, setSortCriterion] = useState<SortCriterion>('subscribers');
  const [sortDirection, setSortDirection] = useState<SortDirection>('desc');
  const [isSortOpen, setIsSortOpen] = useState<boolean>(false);
  const [isFilterOpen, setIsFilterOpen] = useState<boolean>(false);

  // Video filter & sort state
  const [videoTypeFilter, setVideoTypeFilter] = useState<'all' | 'video' | 'short' | 'live'>('all');
  const [videoSortCriterion, setVideoSortCriterion] = useState<VideoSortCriterion>('date');
  const [videoSortDirection, setVideoSortDirection] = useState<SortDirection>('desc');

  // Always start at top of page when Creators is navigated to
  useEffect(() => {
    const lenis = (window as any).__lenis;
    if (lenis) {
      lenis.scrollTo(0, { immediate: true });
    }
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' as ScrollBehavior });
    document.documentElement.scrollTop = 0;
    document.body.scrollTop = 0;
  }, []);

  useEffect(() => {
    if (!isSortOpen && !isFilterOpen) return;
    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (!target.closest('[data-sort-container]')) {
        setIsSortOpen(false);
      }
      if (!target.closest('[data-filter-container]')) {
        setIsFilterOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isSortOpen, isFilterOpen]);

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
  const [formError, setFormError] = useState<string>('');
  const abortControllerRef = useRef<AbortController | null>(null);

  // Close modal and cancel any pending fetch immediately
  const handleCloseModal = () => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
      abortControllerRef.current = null;
    }
    setIsFetching(false);
    setFormError('');
    setIsAddModalOpen(false);
  };
  const handleGoHome = (e?: React.MouseEvent) => {
    if (e) e.preventDefault();
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

  const handleGoEvents = (e?: React.MouseEvent) => {
    if (e) e.preventDefault();
    if (onNavigateEvents) {
      onNavigateEvents();
    } else {
      window.location.hash = '#events';
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

  // Real YouTube Videos state fetched from added channels
  const [videos, setVideos] = useState<YouTubeVideoItem[]>([]);
  const [isLoadingVideos, setIsLoadingVideos] = useState<boolean>(false);

  // Fetch latest YouTube videos for all added channels
  useEffect(() => {
    if (channels.length === 0) {
      setVideos([]);
      setIsLoadingVideos(false);
      return;
    }

    const apiKey = import.meta.env.VITE_YOUTUBE_API_KEY;
    if (!apiKey) return;

    let isMounted = true;
    setIsLoadingVideos(true);

    const fetchVideosForChannels = async () => {
      try {
        const videoPromises = channels.map(async (channel) => {
          let channelId = channel.youtubeChannelId;

          // If channelId is not saved, resolve it from channel.youtubeUrl or handle
          if (!channelId) {
            const urlMatch = channel.youtubeUrl?.match(/channel\/([a-zA-Z0-9_-]+)/);
            if (urlMatch) {
              channelId = urlMatch[1];
            } else if (channel.handle) {
              try {
                const handleParam = channel.handle.startsWith('@') ? channel.handle : `@${channel.handle}`;
                const chRes = await fetch(
                  `https://www.googleapis.com/youtube/v3/channels?part=id&forHandle=${encodeURIComponent(handleParam)}&key=${apiKey}`
                );
                const chData = await chRes.json();
                if (chData.items?.[0]?.id) channelId = chData.items[0].id;
              } catch {
                // ignore
              }
            }
          }

          if (!channelId) return [];

          const uploadsPlaylistId = channelId.startsWith('UC')
            ? channelId.replace(/^UC/, 'UU')
            : channelId;

          try {
            const res = await fetch(
              `https://www.googleapis.com/youtube/v3/playlistItems?part=snippet&playlistId=${encodeURIComponent(uploadsPlaylistId)}&maxResults=24&key=${apiKey}`
            );
            const data = await res.json();
            if (!data.items) return [];

            return data.items
              .filter((item: any) => item.snippet?.resourceId?.videoId && item.snippet?.title !== 'Private video')
              .map((item: any) => {
                const snippet = item.snippet;
                const vId = snippet.resourceId.videoId;
                const thumb =
                  snippet.thumbnails?.maxres?.url ||
                  snippet.thumbnails?.high?.url ||
                  snippet.thumbnails?.medium?.url ||
                  `https://i.ytimg.com/vi/${vId}/mqdefault.jpg`;

                return {
                  id: vId,
                  videoId: vId,
                  title: snippet.title,
                  description: snippet.description || '',
                  thumbnailUrl: thumb,
                  publishedAt: snippet.publishedAt,
                  timeAgo: formatTimeAgo(snippet.publishedAt),
                  channelId: channelId,
                  channelName: channel.name,
                  channelAvatar: channel.avatarUrl,
                  channelHandle: channel.handle,
                  videoType: (snippet.title?.toLowerCase().includes('#short') ? 'short' : 'video') as VideoType,
                  isLive: false,
                };
              });
          } catch (err) {
            console.warn(`Error fetching videos for channel ${channel.name}:`, err);
            return [];
          }
        });

        const results = await Promise.all(videoPromises);
        const allVideos = results.flat();

        // Batch fetch contentDetails and live status for all videos in chunks of 50
        for (let i = 0; i < allVideos.length; i += 50) {
          const chunk = allVideos.slice(i, i + 50);
          const vIds = chunk.map((v) => v.videoId);
          if (vIds.length > 0) {
            try {
              const vDetailsRes = await fetch(
                `https://www.googleapis.com/youtube/v3/videos?part=contentDetails,snippet,liveStreamingDetails&id=${encodeURIComponent(vIds.join(','))}&key=${apiKey}`
              );
              const vDetailsData = await vDetailsRes.json();
              if (vDetailsData.items) {
                const detailsMap = new Map();
                vDetailsData.items.forEach((item: any) => {
                  detailsMap.set(item.id, item);
                });

                chunk.forEach((v) => {
                  const item = detailsMap.get(v.videoId);
                  if (item) {
                    if (item.snippet?.description) v.description = item.snippet.description;
                    if (item.snippet?.tags) v.tags = item.snippet.tags;

                    const isCurrentlyLive =
                      item.snippet?.liveBroadcastContent === 'live' ||
                      !!(item.liveStreamingDetails?.actualStartTime && !item.liveStreamingDetails?.actualEndTime);
                    const durSec = parseDurationToSeconds(item.contentDetails?.duration);

                    const isUpcomingStream =
                      !isCurrentlyLive &&
                      (item.snippet?.liveBroadcastContent === 'upcoming' ||
                        (!!item.liveStreamingDetails?.scheduledStartTime && !item.liveStreamingDetails?.actualStartTime) ||
                        (!!item.liveStreamingDetails && !item.liveStreamingDetails?.actualStartTime && durSec === 0));

                    const titleLower = (v.title || '').toLowerCase();
                    const descLower = (item.snippet?.description || '').toLowerCase();

                    const isLiveStream =
                      isCurrentlyLive ||
                      isUpcomingStream ||
                      item.snippet?.liveBroadcastContent === 'upcoming' ||
                      !!item.liveStreamingDetails ||
                      titleLower.includes('🔴') ||
                      titleLower.includes('livestream') ||
                      titleLower.includes('live stream');

                    const isShort =
                      !isCurrentlyLive &&
                      !isLiveStream &&
                      ((durSec > 0 && durSec <= 180) ||
                        titleLower.includes('#short') ||
                        titleLower.includes('#shorts') ||
                        descLower.includes('#short') ||
                        descLower.includes('#shorts'));

                    v.durationSeconds = durSec;
                    v.formattedDuration = isCurrentlyLive
                      ? 'LIVE'
                      : isUpcomingStream
                      ? 'UPCOMING'
                      : formatDuration(durSec);
                    v.isLive = isCurrentlyLive;
                    v.isUpcoming = isUpcomingStream;
                    v.videoType = isCurrentlyLive || isLiveStream ? 'live' : isShort ? 'short' : 'video';
                  }
                });
              }
            } catch (err) {
              console.warn('Error fetching video durations & live details:', err);
            }
          }
        }

        // Default sort: Live streams pinned first, then upcoming streams, then newest uploads
        allVideos.sort((a, b) => {
          const isLiveA = a.isLive || a.formattedDuration === 'LIVE';
          const isLiveB = b.isLive || b.formattedDuration === 'LIVE';
          if (isLiveA && !isLiveB) return -1;
          if (!isLiveA && isLiveB) return 1;

          const isUpA = isVideoUpcoming(a);
          const isUpB = isVideoUpcoming(b);
          if (isUpA && !isUpB) return -1;
          if (!isUpA && isUpB) return 1;

          return new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime();
        });

        if (isMounted) {
          setVideos(allVideos);
          setIsLoadingVideos(false);
        }
      } catch (err) {
        if (isMounted) setIsLoadingVideos(false);
      }
    };

    fetchVideosForChannels();

    return () => {
      isMounted = false;
    };
  }, [channels]);

  // Ensure videos are enriched with fresh videoType
  useEffect(() => {
    if (channels.length > 0 && videos.length > 0 && !videos.some((v) => v.videoType)) {
      setVideos([]);
    }
  }, [channels, activeSection]);

  // Filtered & Sorted Videos (supports type filtering, duration sorting, upload date, search, and live pin)
  const filteredVideos = useMemo(() => {
    let list = videos;

    // Filter out videos not related to Clash of Clans
    list = list.filter((v) => isClashOfClansVideo(v));

    // Filter by type: all, videos, shorts, live
    if (videoTypeFilter !== 'all') {
      list = list.filter((v) => getVideoType(v) === videoTypeFilter);
    }

    // Search query filter
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      list = list.filter(
        (v) =>
          v.title.toLowerCase().includes(q) ||
          v.channelName.toLowerCase().includes(q) ||
          (v.channelHandle && v.channelHandle.toLowerCase().includes(q))
      );
    }

    return [...list].sort((a, b) => {
      // 1. Live streams currently happening are ALWAYS pinned to the top!
      const isLiveA = a.isLive || a.formattedDuration === 'LIVE';
      const isLiveB = b.isLive || b.formattedDuration === 'LIVE';
      if (isLiveA && !isLiveB) return -1;
      if (!isLiveA && isLiveB) return 1;

      // 2. Scheduled upcoming live streams are ALWAYS pinned to the top!
      const isUpA = isVideoUpcoming(a);
      const isUpB = isVideoUpcoming(b);
      if (isUpA && !isUpB) return -1;
      if (!isUpA && isUpB) return 1;

      if (videoSortCriterion === 'duration') {
        const durA = a.durationSeconds || 0;
        const durB = b.durationSeconds || 0;
        return videoSortDirection === 'desc' ? durB - durA : durA - durB;
      } else {
        // Upload date
        const timeA = new Date(a.publishedAt).getTime();
        const timeB = new Date(b.publishedAt).getTime();
        return videoSortDirection === 'desc' ? timeB - timeA : timeA - timeB;
      }
    });
  }, [videos, videoTypeFilter, searchQuery, videoSortCriterion, videoSortDirection]);

  // Submit new channel with YouTube Data API auto-fetch (multi-stage resolution & banner fetch)
  const handleAddChannelSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const rawLink = youtubeLink.trim();
    if (!rawLink) return;

    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    const controller = new AbortController();
    abortControllerRef.current = controller;
    const signal = controller.signal;

    setFormError('');
    setIsFetching(true);

    try {
      const apiKey = import.meta.env.VITE_YOUTUBE_API_KEY;
      const { handle, channelId: parsedChannelId, videoId, cleanName } = parseYouTubeInput(rawLink);

      let targetChannelId = parsedChannelId;
      let channelItem: any = null;

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
        // If video URL was provided, resolve channel ID first
        if (!targetChannelId && videoId) {
          try {
            const vRes = await fetch(
              `https://www.googleapis.com/youtube/v3/videos?part=snippet&id=${encodeURIComponent(videoId)}&key=${apiKey}`,
              { signal }
            );
            const vData = await vRes.json();
            if (vData.items?.[0]?.snippet?.channelId) {
              targetChannelId = vData.items[0].snippet.channelId;
            }
          } catch {
            // continue
          }
        }

        if (signal.aborted) return;

        const handleWithAt = handle ? (handle.startsWith('@') ? handle : `@${handle}`) : '';
        const handleWithoutAt = handle ? handle.replace(/^@/, '') : '';

        // Method 1: If channelId is present (e.g. youtube.com/channel/UC...)
        if (targetChannelId) {
          const res = await fetch(
            `https://www.googleapis.com/youtube/v3/channels?part=snippet,statistics,brandingSettings&id=${encodeURIComponent(targetChannelId)}&key=${apiKey}`,
            { signal }
          );
          const data = await res.json();
          if (data.items?.length > 0) channelItem = data.items[0];
        }

        if (signal.aborted) return;

        // Method 2: Query by handle WITH '@' prefix (Google YouTube Data API v3 requirement)
        if (!channelItem && handleWithAt) {
          const res = await fetch(
            `https://www.googleapis.com/youtube/v3/channels?part=snippet,statistics,brandingSettings&forHandle=${encodeURIComponent(handleWithAt)}&key=${apiKey}`,
            { signal }
          );
          const data = await res.json();
          if (data.items?.length > 0) channelItem = data.items[0];
        }

        if (signal.aborted) return;

        // Method 3: Query by handle WITHOUT '@' prefix
        if (!channelItem && handleWithoutAt) {
          const res = await fetch(
            `https://www.googleapis.com/youtube/v3/channels?part=snippet,statistics,brandingSettings&forHandle=${encodeURIComponent(handleWithoutAt)}&key=${apiKey}`,
            { signal }
          );
          const data = await res.json();
          if (data.items?.length > 0) channelItem = data.items[0];
        }

        if (signal.aborted) return;

        // Method 4: Query by legacy username (for older channels)
        if (!channelItem && handleWithoutAt) {
          const res = await fetch(
            `https://www.googleapis.com/youtube/v3/channels?part=snippet,statistics,brandingSettings&forUsername=${encodeURIComponent(handleWithoutAt)}&key=${apiKey}`,
            { signal }
          );
          const data = await res.json();
          if (data.items?.length > 0) channelItem = data.items[0];
        }

        if (signal.aborted) return;

        // Method 5: Search API fallback (finds the channel even with complex names, handles or punctuation)
        if (!channelItem && (handleWithAt || cleanName)) {
          const searchQuery = handleWithAt || cleanName;
          const searchRes = await fetch(
            `https://www.googleapis.com/youtube/v3/search?part=snippet&type=channel&q=${encodeURIComponent(searchQuery)}&maxResults=1&key=${apiKey}`,
            { signal }
          );
          const searchData = await searchRes.json();
          const foundId = searchData.items?.[0]?.snippet?.channelId || searchData.items?.[0]?.id?.channelId;
          if (foundId) {
            const res = await fetch(
              `https://www.googleapis.com/youtube/v3/channels?part=snippet,statistics,brandingSettings&id=${encodeURIComponent(foundId)}&key=${apiKey}`,
              { signal }
            );
            const data = await res.json();
            if (data.items?.length > 0) channelItem = data.items[0];
          }
        }

        if (signal.aborted) return;

        // If channel data is found, verify Clash of Clans content & populate metadata
        if (channelItem) {
          const snippet = channelItem.snippet || {};
          const stats = channelItem.statistics || {};
          const branding = channelItem.brandingSettings || {};

          // Verify whether channel is related to Clash of Clans
          const titleText = snippet.title || '';
          const descText = snippet.description || '';
          const customUrlText = snippet.customUrl || '';
          const keywordsText = branding.channel?.keywords || '';

          let isCocVerified =
            matchesClashOfClans(titleText) ||
            matchesClashOfClans(descText) ||
            matchesClashOfClans(customUrlText) ||
            matchesClashOfClans(keywordsText);

          // If not explicit in channel metadata, inspect creator's recent video uploads via uploads playlist
          if (!isCocVerified && channelItem.id) {
            try {
              const uploadsPlaylistId = channelItem.id.startsWith('UC')
                ? channelItem.id.replace(/^UC/, 'UU')
                : channelItem.id;
              const vCheckRes = await fetch(
                `https://www.googleapis.com/youtube/v3/playlistItems?part=snippet&playlistId=${encodeURIComponent(uploadsPlaylistId)}&maxResults=10&key=${apiKey}`,
                { signal }
              );
              const vCheckData = await vCheckRes.json();
              if (vCheckData.items?.length > 0) {
                isCocVerified = vCheckData.items.some((v: any) =>
                  matchesClashOfClans(v.snippet?.title) ||
                  matchesClashOfClans(v.snippet?.description)
                );
              }
            } catch {
              // ignore
            }
          }

          if (signal.aborted) return;

          if (!isCocVerified) {
            setFormError(
              'This channel does not appear to feature Clash of Clans content. Only channels with Clash of Clans videos or guides can be added.'
            );
            return;
          }

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
        } else {
          setFormError('Could not find this YouTube channel. Please check the link or @handle and try again.');
          return;
        }
      }

      if (signal.aborted) return;

      // Check if already exists in directory
      const alreadyExists = channels.some(
        (c) =>
          (channelItem?.id && c.youtubeChannelId === channelItem.id) ||
          c.handle.toLowerCase() === channelHandle.toLowerCase()
      );
      if (alreadyExists) {
        setFormError(`Channel ${channelHandle} has already been added to the directory.`);
        return;
      }

      const now = Date.now();
      const newChannel: CreatorChannel = {
        id: `comm-${now}`,
        youtubeChannelId: channelItem?.id || targetChannelId,
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
      setFormSuccess(true);

      setTimeout(() => {
        setFormSuccess(false);
        setIsAddModalOpen(false);
        setYoutubeLink('');
      }, 1200);
    } catch (err: any) {
      if (err?.name === 'AbortError' || signal.aborted) {
        return;
      }
      console.warn('YouTube API fetch error:', err);
      setFormError(err?.message || 'Failed to fetch channel details. Please check the link and try again.');
    } finally {
      if (abortControllerRef.current === controller) {
        abortControllerRef.current = null;
      }
      setIsFetching(false);
    }
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
                  onClick={handleGoEvents}
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
                  onClick={handleGoEvents}
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
          {/* 
            =======================================================================
            2 SECTIONS SWITCHER: "CHANNELS" & "CONTENT"
            =======================================================================
          */}
          <div className="border-b border-slate-200 mb-6">
            <div className="flex space-x-8">
              {/* CHANNELS SECTION TAB */}
              <button
                onClick={() => setActiveSection('channels')}
                className={`group flex items-center space-x-2.5 pb-4 text-sm md:text-base font-bold uppercase tracking-[0.16em] transition-all relative ${activeSection === 'channels'
                    ? 'text-black'
                    : 'text-slate-400 hover:text-slate-700'
                  }`}
              >
                <Tv className={`w-4 h-4 ${activeSection === 'channels' ? 'text-black' : 'text-slate-400'}`} />
                <span>Channels</span>
                {activeSection === 'channels' && (
                  <div className="absolute bottom-0 left-0 right-0 h-[2.5px] bg-black rounded-full" />
                )}
              </button>

              {/* CONTENT SECTION TAB */}
              <button
                onClick={() => setActiveSection('content')}
                className={`group flex items-center space-x-2.5 pb-4 text-sm md:text-base font-bold uppercase tracking-[0.16em] transition-all relative ${activeSection === 'content'
                    ? 'text-black'
                    : 'text-slate-400 hover:text-slate-700'
                  }`}
              >
                <Video className={`w-4 h-4 ${activeSection === 'content' ? 'text-black' : 'text-slate-400'}`} />
                <span>Content</span>
                {activeSection === 'content' && (
                  <div className="absolute bottom-0 left-0 right-0 h-[2.5px] bg-black rounded-full" />
                )}
              </button>
            </div>
          </div>

          {/* Top Controls: Search Bar on Left, Filter and Add Channel on Right */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 mb-8">
            {/* Search Input Box (Left Side) */}
            <div className="relative flex-1">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400">
                <Search className="w-5 h-5" />
              </div>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={
                  activeSection === 'content'
                    ? "Search videos, titles, creators..."
                    : "Search creator name or @handle..."
                }
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

            {/* Right Controls: Filter & Sort / Add Channel */}
            <div className="flex items-center gap-2.5 shrink-0">
              {/* CONTENT TAB: Dedicated Type Filter Button & Dropdown */}
              {activeSection === 'content' && (
                <div className="relative" data-filter-container>
                  <button
                    onClick={() => {
                      setIsFilterOpen(!isFilterOpen);
                      setIsSortOpen(false);
                    }}
                    className={`flex items-center space-x-2 px-4 py-3 rounded-2xl border text-xs font-bold uppercase tracking-wider transition-all duration-200 ${
                      videoTypeFilter !== 'all'
                        ? 'bg-black text-white border-black shadow-sm'
                        : isFilterOpen
                        ? 'bg-black text-white border-black'
                        : 'bg-slate-50 hover:bg-slate-100 text-slate-800 border-slate-200'
                    }`}
                  >
                    <SlidersHorizontal className="w-3.5 h-3.5" />
                    <span>
                      {videoTypeFilter === 'all'
                        ? 'Type: All'
                        : videoTypeFilter === 'video'
                        ? 'Videos'
                        : videoTypeFilter === 'short'
                        ? 'Shorts'
                        : 'Live'}
                    </span>
                    {videoTypeFilter !== 'all' && (
                      <span className="w-1.5 h-1.5 rounded-full bg-rose-400" />
                    )}
                    <ChevronDown
                      className={`w-3.5 h-3.5 opacity-60 transition-transform duration-200 ${
                        isFilterOpen ? 'rotate-180' : ''
                      }`}
                    />
                  </button>

                  {/* Filter Dropdown */}
                  {isFilterOpen && (
                    <div className="absolute right-0 mt-2 w-64 p-2 bg-white rounded-2xl shadow-xl border border-slate-200 z-30 animate-fadeIn">
                      <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400 px-3 py-1.5 mb-1 flex items-center justify-between">
                        <span>Filter By Format</span>
                        {videoTypeFilter !== 'all' && (
                          <button
                            onClick={() => {
                              setVideoTypeFilter('all');
                              setIsFilterOpen(false);
                            }}
                            className="text-[11px] font-bold text-rose-500 hover:underline capitalize"
                          >
                            Reset
                          </button>
                        )}
                      </div>

                      <div className="space-y-1">
                        {[
                          {
                            id: 'all',
                            label: 'All Formats',
                            desc: 'Videos, Shorts & Live',
                            icon: Video,
                          },
                          {
                            id: 'video',
                            label: 'Videos',
                            desc: 'Standard long-form videos',
                            icon: Tv,
                          },
                          {
                            id: 'short',
                            label: 'Shorts',
                            desc: 'Short vertical clips (≤ 3m)',
                            icon: Sparkles,
                          },
                          {
                            id: 'live',
                            label: 'Live Streams',
                            desc: 'Current & past broadcasts',
                            icon: Radio,
                          },
                        ].map((t) => {
                          const Icon = t.icon;
                          const isSelected = videoTypeFilter === t.id;
                          return (
                            <button
                              key={t.id}
                              onClick={() => {
                                setVideoTypeFilter(t.id as any);
                                setIsFilterOpen(false);
                              }}
                              className={`w-full text-left p-2.5 rounded-xl text-xs font-semibold flex items-center justify-between transition-colors group ${
                                isSelected
                                  ? 'bg-black text-white'
                                  : 'text-slate-700 hover:bg-slate-100'
                              }`}
                            >
                              <div className="flex items-center space-x-2.5">
                                <div
                                  className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 ${
                                    isSelected
                                      ? 'bg-white/20 text-white'
                                      : 'bg-slate-100 text-slate-600 group-hover:bg-slate-200'
                                  }`}
                                >
                                  <Icon className="w-3.5 h-3.5" />
                                </div>
                                <div>
                                  <div className="font-bold">{t.label}</div>
                                  <div
                                    className={`text-[10px] ${
                                      isSelected ? 'text-white/70' : 'text-slate-400'
                                    }`}
                                  >
                                    {t.desc}
                                  </div>
                                </div>
                              </div>
                              {isSelected && <Check className="w-4 h-4 text-white shrink-0 ml-2" />}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Sort Button & Dropdown */}
              <div className="relative" data-sort-container>
                <button
                  onClick={() => {
                    setIsSortOpen(!isSortOpen);
                    setIsFilterOpen(false);
                  }}
                  className={`flex items-center space-x-2 px-4 py-3 rounded-2xl border text-xs font-bold uppercase tracking-wider transition-all duration-200 ${
                    isSortOpen
                      ? 'bg-black text-white border-black shadow-sm'
                      : 'bg-slate-50 hover:bg-slate-100 text-slate-800 border-slate-200'
                  }`}
                >
                  <ArrowUpDown className="w-3.5 h-3.5" />
                  <span>Sort</span>
                  <ChevronDown
                    className={`w-3.5 h-3.5 opacity-60 transition-transform duration-200 ${
                      isSortOpen ? 'rotate-180' : ''
                    }`}
                  />
                </button>

                {/* Sort Dropdown */}
                {isSortOpen && (
                  <div className="absolute right-0 mt-2 w-64 p-2.5 bg-white rounded-2xl shadow-xl border border-slate-200 z-30 animate-fadeIn">
                    {activeSection === 'channels' ? (
                      <>
                        <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400 px-2.5 py-1 mb-1">
                          Sort Channels By
                        </div>

                        {/* Criteria options: Subscribers, Newly Added, or A-Z */}
                        <div className="space-y-1 mb-2">
                          <button
                            onClick={() => {
                              setSortCriterion('subscribers');
                              setIsSortOpen(false);
                            }}
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
                            onClick={() => {
                              setSortCriterion('recent');
                              setIsSortOpen(false);
                            }}
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
                            onClick={() => {
                              setSortCriterion('name');
                              setIsSortOpen(false);
                            }}
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

                        {/* Order Selection */}
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
                      </>
                    ) : (
                      <>
                        <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400 px-2.5 py-1 mb-1">
                          Sort Videos By
                        </div>

                        {/* Criteria options: Upload Date or Duration */}
                        <div className="space-y-1 mb-2">
                          <button
                            onClick={() => {
                              setVideoSortCriterion('date');
                              setIsSortOpen(false);
                            }}
                            className={`w-full text-left px-3 py-2.5 rounded-xl text-xs font-semibold flex items-center justify-between transition-colors ${
                              videoSortCriterion === 'date'
                                ? 'bg-black text-white'
                                : 'text-slate-700 hover:bg-slate-100'
                            }`}
                          >
                            <div className="flex items-center space-x-2">
                              <Calendar className="w-3.5 h-3.5 opacity-60" />
                              <span>Upload Date</span>
                            </div>
                            {videoSortCriterion === 'date' && <Check className="w-3.5 h-3.5" />}
                          </button>

                          <button
                            onClick={() => {
                              setVideoSortCriterion('duration');
                              setIsSortOpen(false);
                            }}
                            className={`w-full text-left px-3 py-2.5 rounded-xl text-xs font-semibold flex items-center justify-between transition-colors ${
                              videoSortCriterion === 'duration'
                                ? 'bg-black text-white'
                                : 'text-slate-700 hover:bg-slate-100'
                            }`}
                          >
                            <div className="flex items-center space-x-2">
                              <Clock className="w-3.5 h-3.5 opacity-60" />
                              <span>Duration</span>
                            </div>
                            {videoSortCriterion === 'duration' && <Check className="w-3.5 h-3.5" />}
                          </button>

                        </div>

                        {/* Order Selection */}
                        <div className="pt-2 border-t border-slate-100 flex items-center justify-between px-1">
                          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                            Order
                          </span>
                          <div className="flex items-center gap-1 bg-slate-100 p-0.5 rounded-xl">
                            <button
                              type="button"
                              onClick={() => setVideoSortDirection('desc')}
                              title="Descending"
                              className={`flex items-center space-x-1.5 py-1.5 px-2.5 rounded-lg text-xs font-bold transition-all ${
                                videoSortDirection === 'desc'
                                  ? 'bg-black text-white shadow-sm'
                                  : 'text-slate-600 hover:text-black'
                              }`}
                            >
                              <ArrowDown className="w-3.5 h-3.5" />
                              <span>{videoSortCriterion === 'duration' ? 'Longest' : 'Newest'}</span>
                            </button>
                            <button
                              type="button"
                              onClick={() => setVideoSortDirection('asc')}
                              title="Ascending"
                              className={`flex items-center space-x-1.5 py-1.5 px-2.5 rounded-lg text-xs font-bold transition-all ${
                                videoSortDirection === 'asc'
                                  ? 'bg-black text-white shadow-sm'
                                  : 'text-slate-600 hover:text-black'
                              }`}
                            >
                              <ArrowUp className="w-3.5 h-3.5" />
                              <span>{videoSortCriterion === 'duration' ? 'Shortest' : 'Oldest'}</span>
                            </button>
                          </div>
                        </div>
                      </>
                    )}
                  </div>
                )}
              </div>

              {/* Add Channel Button (Only shown on channels section) */}
              {activeSection === 'channels' && (
                <button
                  onClick={() => setIsAddModalOpen(true)}
                  className="flex items-center space-x-2 px-6 py-3 rounded-2xl bg-black hover:bg-neutral-800 text-white text-xs font-bold uppercase tracking-[0.16em] transition-all duration-200 shadow-sm hover:scale-105 active:scale-95"
                >
                  <Plus className="w-4 h-4 text-rose-400" />
                  <span>Add Channel</span>
                </button>
              )}
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
            SECTION 2: CONTENT (Latest YouTube videos from added channels)
            =======================================================================
          */}
          {activeSection === 'content' && (
            <div className="py-2 animate-fadeIn">

              {/* Empty state when no channels are added yet */}
              {channels.length === 0 ? (
                <div className="text-center py-20 bg-slate-50 rounded-3xl border border-dashed border-slate-300">
                  <Tv className="w-12 h-12 text-slate-400 mx-auto mb-3" />
                  <h3 className="text-lg font-bold text-slate-900">No Channels Added Yet</h3>
                  <p className="text-sm text-slate-500 max-w-md mx-auto mt-1 mb-6">
                    Add your favorite Clash of Clans creator channels in the Channels tab to see their latest YouTube uploads here automatically!
                  </p>
                  <button
                    onClick={() => setActiveSection('channels')}
                    className="px-6 py-2.5 rounded-full bg-black text-white text-xs font-bold uppercase tracking-wider hover:bg-neutral-800 transition-all shadow-sm"
                  >
                    Go to Channels Tab
                  </button>
                </div>
              ) : isLoadingVideos ? (
                /* Loading spinner */
                <div className="py-24 text-center">
                  <Loader2 className="w-8 h-8 animate-spin text-black mx-auto mb-3" />
                  <p className="text-sm font-semibold text-slate-700">
                    Fetching latest videos from added creators...
                  </p>
                </div>
              ) : filteredVideos.length === 0 ? (
                /* No search results */
                <div className="text-center py-20 bg-slate-50 rounded-3xl border border-dashed border-slate-300">
                  <Video className="w-12 h-12 text-slate-400 mx-auto mb-3" />
                  <h3 className="text-lg font-bold text-slate-900">No videos found</h3>
                  <p className="text-sm text-slate-500 max-w-md mx-auto mt-1 mb-5">
                    {searchQuery
                      ? `No videos match "${searchQuery}".`
                      : `No ${videoTypeFilter === 'all' ? '' : videoTypeFilter} content found with the selected filter.`}
                  </p>
                  {(videoTypeFilter !== 'all' || searchQuery) && (
                    <button
                      onClick={() => {
                        setVideoTypeFilter('all');
                        setSearchQuery('');
                      }}
                      className="px-5 py-2.5 rounded-full bg-black text-white text-xs font-bold uppercase tracking-wider hover:bg-neutral-800 transition-all shadow-sm"
                    >
                      Clear Filters
                    </button>
                  )}
                </div>
              ) : (
                /* YouTube-style Responsive Video Grid */
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-5 gap-y-8">
                  {filteredVideos.map((video) => (
                    <a
                      key={`${video.channelId}-${video.videoId}`}
                      href={`https://www.youtube.com/watch?v=${video.videoId}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group block cursor-pointer transition-all duration-200"
                    >
                      {/* 16:9 Thumbnail Container */}
                      <div className="relative aspect-video w-full rounded-2xl overflow-hidden bg-slate-900 shadow-sm border border-slate-200/80">
                        <img
                          src={video.thumbnailUrl}
                          alt={video.title}
                          referrerPolicy="no-referrer"
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                          onError={(e) => {
                            (e.target as HTMLImageElement).src = `https://i.ytimg.com/vi/${video.videoId}/hqdefault.jpg`;
                          }}
                        />

                        {/* Red Play Button on hover */}
                        <div className="absolute inset-0 bg-black/25 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center">
                          <div className="w-12 h-12 rounded-full bg-red-600/95 text-white flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                            <Play className="w-5 h-5 fill-white ml-0.5" />
                          </div>
                        </div>

                        {/* YouTube Pill Badge (Top Right) */}
                        <div className="absolute top-2.5 right-2.5 px-2 py-0.5 rounded-md bg-black/75 backdrop-blur-sm text-[10px] font-bold text-white flex items-center space-x-1 opacity-90 group-hover:opacity-100 shadow">
                          <Youtube className="w-3 h-3 text-red-500" />
                          <span>YouTube</span>
                        </div>

                        {/* Pinned Live Stream Badge (Top Left) */}
                        {(video.isLive || video.formattedDuration === 'LIVE') && (
                          <div className="absolute top-2.5 left-2.5 px-2.5 py-1 rounded-md bg-red-600 text-white text-[10px] font-black uppercase tracking-wider flex items-center space-x-1.5 shadow-lg">
                            <span className="w-1.5 h-1.5 rounded-full bg-white animate-ping" />
                            <span>Pinned Live</span>
                          </div>
                        )}

                        {/* Duration, LIVE, or UPCOMING Badge (Bottom Right) */}
                        {video.isLive || video.formattedDuration === 'LIVE' ? (
                          <div className="absolute bottom-2.5 right-2.5 px-2 py-0.5 rounded-md bg-red-600 text-white text-[11px] font-extrabold uppercase tracking-wider flex items-center space-x-1 shadow">
                            <span className="w-1.5 h-1.5 rounded-full bg-white animate-ping" />
                            <span>LIVE</span>
                          </div>
                        ) : isVideoUpcoming(video) ? (
                          <div className="absolute bottom-2.5 right-2.5 px-2 py-0.5 rounded-md bg-amber-500 text-black text-[10px] font-black uppercase tracking-wider flex items-center space-x-1 shadow">
                            <Radio className="w-2.5 h-2.5 text-black shrink-0" />
                            <span>UPCOMING</span>
                          </div>
                        ) : video.formattedDuration ? (
                          <div className="absolute bottom-2.5 right-2.5 px-2 py-0.5 rounded-md bg-black/80 backdrop-blur-xs text-white text-[11px] font-semibold tracking-tight shadow">
                            {video.formattedDuration}
                          </div>
                        ) : null}

                        {/* Shorts Indicator (Bottom Left) */}
                        {getVideoType(video) === 'short' && (
                          <div className="absolute bottom-2.5 left-2.5 px-2 py-0.5 rounded-md bg-black/75 backdrop-blur-sm text-[10px] font-bold text-white shadow flex items-center space-x-1">
                            <Sparkles className="w-2.5 h-2.5 text-amber-400" />
                            <span>Short</span>
                          </div>
                        )}
                      </div>

                      {/* Video Info: Channel Avatar + Details */}
                      <div className="flex items-start space-x-3 mt-3">
                        <div className="relative shrink-0 mt-0.5">
                          <img
                            src={video.channelAvatar}
                            alt={video.channelName}
                            referrerPolicy="no-referrer"
                            className="w-9 h-9 rounded-full object-cover border border-slate-200 bg-white"
                            onError={(e) => {
                              (e.target as HTMLImageElement).src = `https://api.dicebear.com/7.x/identicon/svg?seed=${encodeURIComponent(video.channelName)}`;
                            }}
                          />
                        </div>

                        <div className="flex-1 min-w-0">
                          <h4
                            className="font-montserrat font-bold text-sm text-slate-900 group-hover:text-black line-clamp-2 leading-snug tracking-tight"
                            title={video.title}
                          >
                            {video.title}
                          </h4>

                          <div className="text-xs text-slate-600 font-medium mt-1 truncate hover:text-black">
                            {video.channelName}
                          </div>

                          <div className="text-[11px] text-slate-400 mt-0.5 flex items-center space-x-1.5">
                            {video.isLive ? (
                              <span className="text-red-600 font-bold uppercase tracking-wider text-[10px] flex items-center space-x-1">
                                <span className="w-1.5 h-1.5 rounded-full bg-red-600 animate-pulse inline-block" />
                                <span>Streaming Now</span>
                              </span>
                            ) : (
                              <span>{video.timeAgo}</span>
                            )}
                            <span>•</span>
                            <span className="text-rose-500 font-semibold group-hover:underline flex items-center">
                              Watch on YouTube <ArrowUpRight className="w-3 h-3 ml-0.5" />
                            </span>
                          </div>
                        </div>
                      </div>
                    </a>
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
                onClick={handleCloseModal}
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
                {formError && (
                  <div className="p-3.5 rounded-2xl bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-start space-x-2.5 animate-fadeIn">
                    <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                    <div className="flex-1">
                      <span className="font-bold block text-rose-900">Not a Clash of Clans Channel</span>
                      <span className="text-[11px] text-rose-700 mt-0.5 block leading-relaxed">{formError}</span>
                    </div>
                  </div>
                )}

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
                    YouTube Channel Link *
                  </label>
                  <input
                    type="text"
                    required
                    value={youtubeLink}
                    onChange={(e) => {
                      setYoutubeLink(e.target.value);
                      if (formError) setFormError('');
                    }}
                    placeholder="https://www.youtube.com/@YourChannel or @handle"
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-black placeholder-slate-400 transition-all"
                  />
                  <p className="mt-1.5 text-[11px] text-slate-500">
                    Paste your YouTube channel link or @handle. Channels are verified for Clash of Clans content before publishing.
                  </p>
                </div>

                <div className="pt-2 flex items-center justify-end space-x-3">
                  <button
                    type="button"
                    onClick={handleCloseModal}
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

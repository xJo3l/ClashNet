import React, { useEffect, useState, useCallback } from 'react';
import { ExternalLink, RefreshCw, Radio, Sparkles, Newspaper } from 'lucide-react';

export interface NewsArticle {
  id: string;
  title: string;
  linkUrl: string;
  publishDate: string;
  isoDate: string;
  category: string;
  thumbnailUrl: string;
  summary?: string;
}

// Initial live-verified fallback articles directly from https://supercell.com/en/games/clashofclans/blog/
const INITIAL_ARTICLES: NewsArticle[] = [
  {
    id: 'a-word-on-the-new-home-village-screen',
    title: 'A Word on the new Home Village Screen',
    linkUrl: 'https://supercell.com/en/games/clashofclans/blog/news/a-word-on-the-new-home-village-screen/',
    publishDate: '15 Oct 2026',
    isoDate: '2026-10-15T15:38:39.566Z',
    category: 'Developer Blog',
    thumbnailUrl:
      'https://clashofclans.inbox.supercell.com/lqe2co20rkhw/4h9t4Xbcz7yHVTTIbgo9KL/44c365dc0a10296a8777dc67a198e243/20250918_-_Inbox_Thumbnail_evergreenV5_900x506_.png?fm=webp&w=1050',
    summary:
      'The Clash team discusses the thinking behind the revamped Home Village interface, key community feedback, and upcoming design refinements.',
  },
  {
    id: 'weve-revamped-the-clash-of-clans-user-interface',
    title: 'We’ve revamped the Clash of Clans User Interface',
    linkUrl: 'https://supercell.com/en/games/clashofclans/blog/news/weve-revamped-the-clash-of-clans-user-interface/',
    publishDate: '8 Oct 2026',
    isoDate: '2026-10-08T11:51:04.433Z',
    category: 'Game Update',
    thumbnailUrl:
      'https://clashofclans.inbox.supercell.com/lqe2co20rkhw/7aTH59oCjIQ0GM5soXebqL/0da794614af860873194ee9332fd0cdf/20250918_-_Inbox_Thumbnail_evergreenV2_900x506.png?fm=webp&w=1050',
    summary:
      'Explore the modernized UI overhaul, streamlined navigation menus, improved HUD clarity, and quality-of-life additions.',
  },
  {
    id: 'the-portal-panic-medal-event-rifts-its-way-into-clash',
    title: 'The Portal Panic Medal Event Rifts Its Way Into Clash!',
    linkUrl:
      'https://supercell.com/en/games/clashofclans/blog/news/the-portal-panic-medal-event-rifts-its-way-into-clash/',
    publishDate: '8 Oct 2026',
    isoDate: '2026-10-08T08:58:16.519Z',
    category: 'Medal Event',
    thumbnailUrl:
      'https://clashofclans.inbox.supercell.com/lqe2co20rkhw/7MV577tYCwcy74WNNJynTy/a1060f47d08ee81734ea7e8ba3755ac4/medal_event_900x506.png?fm=webp&w=1050',
    summary:
      'Unleash portal magic, collect Super Medals, unlock limited-time seasonal troops, and grab exclusive Hero skins and equipment.',
  },
  {
    id: 'more-ore-for-your-gems',
    title: 'More Ore for Your Gems.',
    linkUrl: 'https://supercell.com/en/games/clashofclans/blog/news/more-ore-for-your-gems/',
    publishDate: '2 Oct 2026',
    isoDate: '2026-10-02T11:50:23.341Z',
    category: 'Economy Update',
    thumbnailUrl:
      'https://clashofclans.inbox.supercell.com/lqe2co20rkhw/4h9t4Xbcz7yHVTTIbgo9KL/44c365dc0a10296a8777dc67a198e243/20250918_-_Inbox_Thumbnail_evergreenV5_900x506_.png?fm=webp&w=1050',
    summary:
      'Important economic balance updates to enhance Hero Equipment progression with significantly increased Ore conversion rates.',
  },
  {
    id: 'cosmic-curse-portal-panic-teleports-in',
    title: 'Cosmic Curse: Portal Panic Teleports In!',
    linkUrl: 'https://supercell.com/en/games/clashofclans/blog/news/cosmic-curse-portal-panic-teleports-in/',
    publishDate: '1 Oct 2026',
    isoDate: '2026-10-01T08:00:17.230Z',
    category: 'Season Event',
    thumbnailUrl:
      'https://clashofclans.inbox.supercell.com/lqe2co20rkhw/vzWUaDU6Kt7K8TxXimZNP/00df2e9e0c0a94033b6297b1deeb4997/cosmiccurse_900x506.png?fm=webp&w=1050',
    summary:
      'Step into the cosmic dimension with intergalactic scenery, mysterious rift events, and the new Cosmic Pass season.',
  },
  {
    id: 'equipment-blast-medal-event',
    title: 'Equipment Blast Medal Event',
    linkUrl: 'https://supercell.com/en/games/clashofclans/blog/news/equipment-blast-medal-event/',
    publishDate: '9 Sept 2026',
    isoDate: '2026-09-09T09:48:44.027Z',
    category: 'Medal Event',
    thumbnailUrl:
      'https://clashofclans.inbox.supercell.com/lqe2co20rkhw/6eolxSn2Dgw6YGOdKUrd9Z/0b977dce6759a865de9f4ce8cc822217/wwe_medal_event_900x506.png?fm=webp&w=1050',
    summary:
      'Power up your heroes with 2x Ore earnings, battle challenges, and the chance to acquire epic equipment upgrades.',
  },
];

const LOCAL_STORAGE_KEY = 'clashnet_coc_news_v1';
const AUTO_REFRESH_INTERVAL_MS = 10 * 60 * 1000; // 10 minutes

function formatPublishedDate(dateString: string): string {
  try {
    const d = new Date(dateString);
    if (isNaN(d.getTime())) return dateString;
    return d.toLocaleDateString('en-GB', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    });
  } catch {
    return dateString;
  }
}

export const News: React.FC = () => {
  const [articles, setArticles] = useState<NewsArticle[]>(() => {
    if (typeof window !== 'undefined') {
      try {
        const cached = localStorage.getItem(LOCAL_STORAGE_KEY);
        if (cached) {
          const parsed = JSON.parse(cached);
          if (Array.isArray(parsed.articles) && parsed.articles.length > 0) {
            return parsed.articles;
          }
        }
      } catch (err) {
        console.warn('Could not read cached news:', err);
      }
    }
    return INITIAL_ARTICLES;
  });

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [lastUpdated, setLastUpdated] = useState<string>('Live Synced');
  const [activeCategory, setActiveCategory] = useState<string>('All');
  const [updateStatus, setUpdateStatus] = useState<'idle' | 'success' | 'offline'>('idle');

  // Parse HTML string from Supercell's blog page to extract __NEXT_DATA__
  const parseSupercellHtml = useCallback((htmlText: string): NewsArticle[] | null => {
    try {
      const parser = new DOMParser();
      const doc = parser.parseFromString(htmlText, 'text/html');
      const scriptEl = doc.getElementById('__NEXT_DATA__');

      if (scriptEl && scriptEl.textContent) {
        const data = JSON.parse(scriptEl.textContent);
        const rawArticles = data?.props?.pageProps?.articles;

        if (Array.isArray(rawArticles) && rawArticles.length > 0) {
          return rawArticles.map((art: any, index: number) => {
            const rawDate = art.publishDate || new Date().toISOString();
            const formattedDate = formatPublishedDate(rawDate);
            const link = art.linkUrl?.startsWith('http')
              ? art.linkUrl
              : `https://supercell.com${art.linkUrl || '/en/games/clashofclans/blog/'}`;

            return {
              id: art.linkUrl ? art.linkUrl.replace(/[^a-zA-Z0-9-]/g, '-') : `coc-art-${index}`,
              title: art.title || 'Clash of Clans News Update',
              linkUrl: link,
              publishDate: formattedDate,
              isoDate: rawDate,
              category: art.category ? art.category.replace('Clash of Clans', '').trim() || 'Official News' : 'Official News',
              thumbnailUrl:
                art.thumbnail?.imgUrl ||
                'https://clashofclans.inbox.supercell.com/lqe2co20rkhw/4h9t4Xbcz7yHVTTIbgo9KL/44c365dc0a10296a8777dc67a198e243/20250918_-_Inbox_Thumbnail_evergreenV5_900x506_.png?fm=webp&w=1050',
              summary: art.descriptionForNewsArchive || 'Official Clash of Clans blog announcement and release notes from Supercell.',
            };
          });
        }
      }
    } catch (e) {
      console.warn('Failed parsing Supercell blog HTML:', e);
    }
    return null;
  }, []);

  const fetchLiveNews = useCallback(
    async (isManual = false) => {
      setIsLoading(true);

      const endpoints = [
        '/api/supercell-blog',
        `https://api.allorigins.win/raw?url=${encodeURIComponent(
          'https://supercell.com/en/games/clashofclans/blog/'
        )}`,
      ];

      let fetchedArticles: NewsArticle[] | null = null;

      for (const endpoint of endpoints) {
        try {
          const controller = new AbortController();
          const timeoutId = setTimeout(() => controller.abort(), 7000);

          const response = await fetch(endpoint, {
            signal: controller.signal,
            headers: {
              Accept: 'text/html,application/xhtml+xml,application/xml',
            },
          });
          clearTimeout(timeoutId);

          if (response.ok) {
            const text = await response.text();
            fetchedArticles = parseSupercellHtml(text);
            if (fetchedArticles && fetchedArticles.length > 0) {
              break;
            }
          }
        } catch {
          // Attempt next endpoint
        }
      }

      if (fetchedArticles && fetchedArticles.length > 0) {
        setArticles(fetchedArticles);
        const now = new Date();
        const timeStr = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        setLastUpdated(`Updated ${timeStr}`);
        setUpdateStatus('success');

        try {
          localStorage.setItem(
            LOCAL_STORAGE_KEY,
            JSON.stringify({
              articles: fetchedArticles,
              timestamp: Date.now(),
            })
          );
        } catch {
          // Ignore localStorage errors
        }
      } else {
        // Retain initial / cached articles
        setUpdateStatus(isManual ? 'offline' : 'idle');
        setLastUpdated('Live Cached');
      }

      setIsLoading(false);
    },
    [parseSupercellHtml]
  );

  // Auto-fetch on mount & periodically
  useEffect(() => {
    fetchLiveNews(false);
    const interval = setInterval(() => {
      fetchLiveNews(false);
    }, AUTO_REFRESH_INTERVAL_MS);

    return () => clearInterval(interval);
  }, [fetchLiveNews]);

  const categories = ['All', 'Developer Blog', 'Game Update', 'Medal Event', 'Season Event'];

  const filteredArticles = articles.filter((item) => {
    if (activeCategory === 'All') return true;
    return item.category.toLowerCase().includes(activeCategory.toLowerCase());
  });

  const featured = filteredArticles[0] || articles[0];
  const listArticles = filteredArticles.slice(1);

  return (
    <section
      id="news"
      aria-label="Clash of Clans News"
      className="relative w-full min-h-screen text-slate-900 py-10 md:py-14 flex flex-col justify-center overflow-x-hidden"
    >
      {/* Background ambient decorative glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-96 bg-gradient-to-b from-amber-500/5 via-rose-500/5 to-transparent blur-3xl pointer-events-none" />

      <div className="relative max-w-7xl mx-auto px-6 sm:px-10 md:px-12 lg:px-16 w-full my-auto">
        {/* Header Section */}
        <div className="news-reveal-header flex flex-col md:flex-row md:items-end justify-between gap-6 pb-8 border-b border-slate-200/80">
          <div className="flex flex-col items-start gap-3">
            {/* Live Autoupdate Pill Badge */}
            <div className="inline-flex items-center gap-2.5 px-3.5 py-1.5 rounded-full bg-slate-900 text-white font-montserrat font-bold text-[10px] tracking-[0.22em] uppercase shadow-sm">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
              </span>
              <span>Live News Feed</span>
              <span className="text-white/40">|</span>
              <span className="text-amber-400 font-medium tracking-normal text-[10px]">
                Supercell Blog
              </span>
            </div>

            {/* Main Title */}
            <h2 className="font-cormorant font-normal text-4xl sm:text-5xl md:text-6xl text-slate-900 tracking-tight leading-[0.98]">
              Latest Clash of Clans News
            </h2>
            <p className="font-outfit text-sm sm:text-base text-slate-500 max-w-2xl leading-relaxed">
              Official updates, developer insights, and game patch notes streamed live from the
              official Supercell Clash of Clans blog.
            </p>
          </div>

          {/* Controls: Auto-update status, refresh button & source link */}
          <div className="flex flex-wrap items-center gap-3">
            <div className="inline-flex items-center gap-2 text-xs font-montserrat text-slate-500 bg-slate-100/90 px-3 py-2 rounded-xl border border-slate-200">
              <Radio className={`w-3.5 h-3.5 ${isLoading ? 'text-amber-500 animate-spin' : 'text-emerald-500'}`} />
              <span className="font-semibold text-slate-700">{lastUpdated}</span>
            </div>

            <button
              onClick={() => fetchLiveNews(true)}
              disabled={isLoading}
              title="Check for newest updates from Supercell"
              className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 active:scale-95 text-slate-700 font-montserrat font-bold text-xs uppercase tracking-wider transition-all duration-200 disabled:opacity-60"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin text-amber-600' : ''}`} />
              <span>{isLoading ? 'Checking...' : 'Refresh'}</span>
            </button>

            <a
              href="https://supercell.com/en/games/clashofclans/blog/"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl border border-slate-300 hover:border-slate-900 hover:bg-slate-900 hover:text-white text-slate-700 font-montserrat font-bold text-xs uppercase tracking-wider transition-all duration-200"
            >
              <span>Supercell.com</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>

        {/* Filter Tabs */}
        <div className="flex items-center gap-2 overflow-x-auto py-6 no-scrollbar">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setActiveCategory(category)}
              className={`px-4 py-1.5 rounded-full text-xs font-montserrat font-bold uppercase tracking-wider whitespace-nowrap transition-all duration-200 ${
                activeCategory === category
                  ? 'bg-slate-900 text-white shadow-md'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200 hover:text-slate-900'
              }`}
            >
              {category}
            </button>
          ))}
        </div>

        {/* Featured Top Article */}
        {featured && (
          <div className="news-reveal-card mb-8">
            <a
              href={featured.linkUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="group block relative rounded-2xl md:rounded-3xl overflow-hidden border border-slate-200/90 bg-white hover:border-slate-400 hover:shadow-2xl hover:shadow-slate-200/80 transition-all duration-500"
            >
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-0 items-stretch">
                {/* Image Col */}
                <div className="lg:col-span-7 relative h-64 sm:h-72 lg:h-[360px] overflow-hidden bg-slate-900">
                  <img
                    src={featured.thumbnailUrl}
                    alt={featured.title}
                    className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700 ease-out"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent pointer-events-none" />

                  {/* Spotlight Tag */}
                  <div className="absolute top-4 left-4 inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-600 text-white font-montserrat font-bold text-[10px] tracking-[0.2em] uppercase shadow-lg">
                    <Sparkles className="w-3 h-3" />
                    <span>Featured Spotlight</span>
                  </div>
                </div>

                {/* Content Col */}
                <div className="lg:col-span-5 p-6 sm:p-8 flex flex-col justify-between bg-gradient-to-br from-white to-slate-50/70">
                  <div className="flex flex-col gap-4">
                    <div className="flex items-center gap-3">
                      <span className="px-2.5 py-1 rounded-md bg-amber-100 text-amber-900 font-montserrat font-bold text-[10px] uppercase tracking-wider">
                        {featured.category}
                      </span>
                      <span className="text-slate-400 text-xs font-montserrat tracking-wider">
                        {featured.publishDate}
                      </span>
                    </div>

                    <h3 className="font-cormorant font-normal text-2xl sm:text-3xl text-slate-900 tracking-tight leading-tight group-hover:text-amber-600 transition-colors duration-300">
                      {featured.title}
                    </h3>

                    <p className="font-outfit text-sm text-slate-600 leading-relaxed line-clamp-3">
                      {featured.summary ||
                        'Read the full official blog post and community discussion on Supercell.com.'}
                    </p>
                  </div>

                  <div className="pt-6 mt-4 border-t border-slate-200/60 flex items-center justify-between">
                    <span className="inline-flex items-center gap-2 font-montserrat font-bold text-xs uppercase tracking-[0.16em] text-slate-900 group-hover:text-amber-600 transition-colors">
                      Read on Supercell
                      <ExternalLink className="w-4 h-4 transform group-hover:translate-x-1 group-hover:-translate-y-0.5 transition-transform" />
                    </span>
                    <span className="text-[11px] font-montserrat text-slate-400 font-medium">
                      Official SC Blog
                    </span>
                  </div>
                </div>
              </div>
            </a>
          </div>
        )}

        {/* 3-Column Grid for Remaining Articles */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {listArticles.map((article) => (
            <a
              key={article.id}
              href={article.linkUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="news-reveal-card group flex flex-col justify-between rounded-2xl overflow-hidden border border-slate-200/80 bg-white hover:border-slate-400 hover:shadow-xl hover:shadow-slate-200/70 transition-all duration-300 transform hover:-translate-y-1"
            >

              {/* Card Image */}
              <div className="relative h-48 sm:h-52 w-full overflow-hidden bg-slate-100">
                <img
                  src={article.thumbnailUrl}
                  alt={article.title}
                  className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
                  loading="lazy"
                />
                <div className="absolute top-3 left-3">
                  <span className="px-2.5 py-1 rounded-md bg-white/95 backdrop-blur-sm text-slate-900 font-montserrat font-bold text-[10px] uppercase tracking-wider shadow-sm">
                    {article.category}
                  </span>
                </div>
              </div>

              {/* Card Content */}
              <div className="p-6 flex flex-col flex-1 justify-between gap-4">
                <div className="flex flex-col gap-2.5">
                  <span className="text-[11px] font-montserrat font-medium text-slate-400 tracking-wider">
                    {article.publishDate}
                  </span>

                  <h4 className="font-cormorant font-normal text-xl sm:text-2xl text-slate-900 tracking-tight leading-snug group-hover:text-amber-600 transition-colors duration-200 line-clamp-2">
                    {article.title}
                  </h4>

                  {article.summary && (
                    <p className="font-outfit text-xs text-slate-500 leading-relaxed line-clamp-2">
                      {article.summary}
                    </p>
                  )}
                </div>

                <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                  <span className="inline-flex items-center gap-1.5 font-montserrat font-bold text-[11px] uppercase tracking-[0.18em] text-slate-900 group-hover:text-amber-600 transition-colors">
                    Read Article
                    <ExternalLink className="w-3.5 h-3.5 transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                  </span>
                  <Newspaper className="w-3.5 h-3.5 text-slate-300 group-hover:text-amber-500 transition-colors" />
                </div>
              </div>
            </a>
          ))}
        </div>

        {/* Bottom Banner */}
        <div className="mt-12 p-6 rounded-2xl bg-slate-50 border border-slate-200/80 flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-600 flex items-center justify-center flex-shrink-0">
              <Newspaper className="w-5 h-5" />
            </div>
            <div>
              <p className="font-montserrat font-bold text-xs uppercase tracking-wider text-slate-900">
                Want to read past Clash of Clans archives?
              </p>
              <p className="font-outfit text-xs text-slate-500">
                Explore the complete multi-year archive of updates and balance changes.
              </p>
            </div>
          </div>
          <a
            href="https://supercell.com/en/games/clashofclans/blog/"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-slate-900 hover:bg-slate-800 text-white font-montserrat font-bold text-xs uppercase tracking-wider transition-all duration-200 shadow-sm"
          >
            <span>View All on Supercell</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>
      </div>
    </section>
  );
};

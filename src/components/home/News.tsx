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

  const top3Articles = articles.slice(0, 3);

  return (
    <section
      id="news"
      aria-label="News"
      className="relative w-full text-slate-900 pt-16 sm:pt-20 md:pt-24 pb-16 sm:pb-20 px-6 sm:px-10 md:px-12 lg:px-16 flex flex-col justify-start selection:bg-rose-500 selection:text-white"
    >
      <div className="news-content-wrapper max-w-7xl mx-auto w-full my-0 relative z-10">
        <div className="flex flex-col gap-6 sm:gap-8">
          {/* Section Header: Full Width without Sidebar */}
          <div className="flex flex-col gap-3 pb-4 border-b border-slate-200/80" data-sc-in data-sc-stagger="50">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
              <div>
                <h2 className="font-cormorant font-normal text-6xl sm:text-7xl lg:text-8xl text-slate-950 tracking-tight leading-none mb-2">
                  <span className="sc-split sc-split--line">
                    <span className="sc-split__i">News</span>
                  </span>
                </h2>
                <p className="font-outfit text-sm sm:text-base md:text-[16px] text-slate-600 leading-relaxed max-w-2xl">
                  Stay updated with the latest gaming trends, news, and releases in the industry. Our informative articles cover a wide range of topics, from game reviews to upcoming events, ensuring you are always in the loop.
                </p>
              </div>
              <a
                href="https://supercell.com/en/games/clashofclans/blog/"
                target="_blank"
                rel="noopener noreferrer"
                data-sc-magnet="0.22"
                className="shrink-0 inline-flex items-center gap-1.5 font-montserrat font-bold text-xs uppercase tracking-wider text-amber-600 hover:text-amber-700 transition-colors pb-1 self-start md:self-end will-change-transform"
              >
                <span>See More News</span>
                <span>→</span>
              </a>
            </div>
          </div>

          {/* Top 3 Horizontal News Cards Stack with Staggered Entrance & 3D Tilt */}
          <div className="flex flex-col gap-4 sm:gap-5" data-sc-in data-sc-stagger="75">
            {top3Articles.map((article) => (
              <a
                key={article.id}
                href={article.linkUrl}
                target="_blank"
                rel="noopener noreferrer"
                data-sc-tilt="3"
                data-sc-spotlight
                className="group block rounded-3xl bg-white/90 hover:bg-white border border-slate-200/90 hover:border-slate-300 p-4 sm:p-5 md:p-6 transition-all duration-300 hover:shadow-xl hover:shadow-slate-300/50 hover:-translate-y-0.5 cursor-pointer backdrop-blur-sm will-change-transform"
              >
                <div className="flex flex-col sm:flex-row gap-5 md:gap-8 items-center">
                  {/* Left Thumbnail with clip-path wipe reveal */}
                  <div
                    data-sc-reveal="right"
                    className="w-full sm:w-[240px] md:w-[280px] lg:w-[320px] h-[160px] sm:h-[150px] md:h-[165px] shrink-0 rounded-2xl overflow-hidden bg-slate-200"
                  >
                    <img
                      src={article.thumbnailUrl}
                      alt={article.title}
                      className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500 ease-out"
                      loading="lazy"
                    />
                  </div>

                  {/* Right Content */}
                  <div className="flex-1 min-w-0 flex flex-col justify-center">
                    <h3 className="font-cormorant font-normal text-2xl sm:text-3xl md:text-4xl text-slate-900 group-hover:text-amber-600 transition-colors duration-200 tracking-tight leading-snug mb-1.5">
                      {article.title}
                    </h3>
                    <p className="font-montserrat text-xs sm:text-[13px] text-slate-500 font-medium tracking-wide mb-2.5">
                      {article.category} • {article.publishDate}
                    </p>
                    <p className="font-outfit text-xs sm:text-sm md:text-base text-slate-600 leading-relaxed line-clamp-2 md:line-clamp-3">
                      {article.summary ||
                        'Delve into the latest updates, balance changes, and exclusive developer insights directly from the official Clash team.'}
                    </p>
                  </div>
                </div>
              </a>
            ))}
          </div>

          {/* Bottom Right: See More Pill Button with Magnetic Hover */}
          <div className="flex justify-end pt-2 pb-2" data-sc-in>
            <a
              href="https://supercell.com/en/games/clashofclans/blog/"
              target="_blank"
              rel="noopener noreferrer"
              data-sc-magnet="0.25"
              className="inline-flex items-center gap-2 px-8 py-3 rounded-full bg-slate-950 hover:bg-slate-800 active:scale-95 text-white font-outfit font-semibold text-sm sm:text-base tracking-normal transition-all duration-200 shadow-md hover:shadow-lg hover:scale-[1.02] will-change-transform"
            >
              <span>See More</span>
              <span className="text-white/60">→</span>
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};

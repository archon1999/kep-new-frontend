import sitemap, { MenuItem } from './sitemap';

export interface RecentPage {
  path: string;
  labelKey?: string;
  fallbackLabel?: string;
}

export const RECENT_PAGES_STORAGE_KEY = 'kep-recent-pages';
export const MAX_RECENT_PAGES = 5;

const flattenSitemap = (items: MenuItem[]): MenuItem[] =>
  items.flatMap((item) => {
    if (item.active === false) return [] as MenuItem[];
    return [item, ...(item.items ? flattenSitemap(item.items) : [])];
  });

const sitemapItems = flattenSitemap(sitemap).filter((item) => item.path);

const matchMenuItem = (pathname: string) => {
  return sitemapItems.find((item) => {
    if (!item.path) return false;
    const pattern = item.path.replace(/:[^/]+/g, '[^/]+');
    const regex = new RegExp(`^${pattern}$`);
    if (regex.test(pathname)) {
      return true;
    }
    if (item.selectionPrefix && pathname.startsWith(item.selectionPrefix)) {
      return true;
    }
    return false;
  });
};

export const getRecentPages = (): RecentPage[] => {
  if (typeof window === 'undefined') return [];
  const stored = window.localStorage.getItem(RECENT_PAGES_STORAGE_KEY);
  if (!stored) return [];
  try {
    const parsed = JSON.parse(stored) as RecentPage[];
    if (Array.isArray(parsed)) {
      return parsed;
    }
    return [];
  } catch (error) {
    console.error('Failed to parse recent pages', error);
    return [];
  }
};

export const storeRecentPage = (pathname: string) => {
  if (typeof window === 'undefined') return;
  const match = matchMenuItem(pathname);
  const recentPage: RecentPage = {
    path: pathname,
    labelKey: match?.key,
    fallbackLabel: match?.name ?? pathname,
  };
  const existing = getRecentPages().filter((page) => page.path !== pathname);
  const next = [recentPage, ...existing].slice(0, MAX_RECENT_PAGES);
  window.localStorage.setItem(RECENT_PAGES_STORAGE_KEY, JSON.stringify(next));
};

export const searchableMenuItems = sitemapItems;

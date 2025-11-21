export interface RecentPage {
  path: string;
  label: string;
  icon?: string;
  visitedAt: number;
}

const RECENT_PAGES_STORAGE_KEY = 'kep-recent-pages';
const MAX_RECENT_PAGES = 5;

const isBrowser = typeof window !== 'undefined';

const readStorage = (): RecentPage[] => {
  if (!isBrowser) {
    return [];
  }

  const stored = window.localStorage.getItem(RECENT_PAGES_STORAGE_KEY);

  if (!stored) {
    return [];
  }

  try {
    const parsed = JSON.parse(stored) as RecentPage[];
    if (!Array.isArray(parsed)) {
      return [];
    }

    return parsed
      .filter((item) => Boolean(item?.path))
      .sort((a, b) => b.visitedAt - a.visitedAt)
      .slice(0, MAX_RECENT_PAGES);
  } catch (error) {
    console.error('Failed to parse recent pages from localStorage', error);
    return [];
  }
};

export const getRecentPages = () => readStorage();

export const addRecentPage = (page: Omit<RecentPage, 'visitedAt'>) => {
  if (!isBrowser || !page.path) {
    return;
  }

  const recentPages = readStorage().filter((item) => item.path !== page.path);
  const updatedPages: RecentPage[] = [
    {
      ...page,
      visitedAt: Date.now(),
    },
    ...recentPages,
  ].slice(0, MAX_RECENT_PAGES);

  window.localStorage.setItem(RECENT_PAGES_STORAGE_KEY, JSON.stringify(updatedPages));
};

export const clearRecentPages = () => {
  if (!isBrowser) {
    return;
  }

  window.localStorage.removeItem(RECENT_PAGES_STORAGE_KEY);
};

import sitemap, { MenuItem } from 'app/routes/sitemap';

export interface SitemapEntry extends MenuItem {
  parentKey?: string;
}

const flattenItems = (items: MenuItem[], parentKey?: string): SitemapEntry[] => {
  return items.reduce<SitemapEntry[]>((acc, item) => {
    const current: SitemapEntry = { ...item, parentKey };

    if (item.path) {
      acc.push(current);
    }

    if (item.items?.length) {
      acc.push(...flattenItems(item.items, item.key ?? parentKey));
    }

    return acc;
  }, []);
};

export const getFlatSitemap = () => flattenItems(sitemap);

export const findMenuItemByPath = (pathname: string, items: MenuItem[] = sitemap): MenuItem | undefined => {
  for (const item of items) {
    if (item.path && (item.path === pathname || (item.selectionPrefix && pathname.startsWith(item.selectionPrefix)))) {
      return item;
    }

    if (item.items?.length) {
      const nested = findMenuItemByPath(pathname, item.items);
      if (nested) {
        return nested;
      }
    }
  }

  return undefined;
};

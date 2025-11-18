import { SxProps } from '@mui/material';
import paths, { rootPaths } from './paths';

export interface SubMenuItem {
  name: string;
  pathName: string;
  key?: string;
  selectionPrefix?: string;
  path?: string;
  active?: boolean;
  icon?: string;
  iconSx?: SxProps;
  items?: SubMenuItem[];
}

export interface MenuItem {
  id: string;
  key?: string;
  subheader: string;
  icon: string;
  iconSx?: SxProps;
  items: SubMenuItem[];
}

const sitemap: MenuItem[] = [
  {
    id: 'home',
    subheader: 'Home',
    key: 'home',
    icon: 'material-symbols:home-rounded',
    items: [
      {
        name: 'Home',
        key: 'home',
        path: rootPaths.root,
        pathName: 'home',
        icon: 'material-symbols:home-rounded',
        active: true,
      },
    ],
  },
  {
    id: 'calendar',
    subheader: 'Calendar',
    key: 'calendar.title',
    icon: 'mdi:calendar-month-outline',
    items: [
      {
        name: 'Calendar',
        key: 'calendar.title',
        path: paths.calendar,
        pathName: 'calendar',
        icon: 'mdi:calendar-month-outline',
        active: true,
      },
    ],
  },
  {
    id: 'shop',
    subheader: 'Shop',
    key: 'shop.title',
    icon: 'mdi:store-outline',
    items: [
      {
        name: 'Shop',
        key: 'shop.title',
        path: paths.shop,
        pathName: 'shop',
        icon: 'mdi:store-outline',
        active: true,
      },
    ],
  },
  {
    id: 'kepcoin',
    subheader: 'Kepcoin',
    key: 'kepcoin',
    icon: 'mdi:currency-usd-circle',
    items: [
      {
        name: 'Kepcoin',
        key: 'kepcoin',
        path: paths.kepcoin,
        pathName: 'kepcoin',
        icon: 'mdi:currency-usd-circle',
        active: true,
      },
    ],
  },
];

export default sitemap;

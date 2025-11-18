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
    icon: 'material-symbols:calendar-month-rounded',
    items: [
      {
        name: 'Calendar',
        key: 'calendar.title',
        path: paths.calendar,
        pathName: 'calendar',
        icon: 'material-symbols:calendar-month-rounded',
        active: true,
      },
    ],
  },
  {
    id: 'shop',
    subheader: 'Shop',
    key: 'shop',
    icon: 'mdi:store-outline',
    items: [
      {
        name: 'Shop',
        key: 'shop',
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
    icon: 'material-symbols:payments-rounded',
    items: [
      {
        name: 'Kepcoin',
        key: 'kepcoin',
        path: paths.kepcoin,
        pathName: 'kepcoin',
        icon: 'material-symbols:payments-rounded',
        active: true,
      },
    ],
  },
];

export default sitemap;

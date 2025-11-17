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
  key?: string; // used for the locale
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
    id: 'engagement',
    subheader: 'Engagement',
    key: 'engagement',
    icon: 'solar:stars-line-duotone',
    items: [
      {
        name: 'Kepcoin',
        key: 'kepcoin',
        path: paths.kepcoin,
        pathName: 'kepcoin',
        icon: 'solar:wallet-2-bold-duotone',
      },
      {
        name: 'Notifications',
        key: 'notifications',
        path: paths.notifications,
        pathName: 'notifications',
        icon: 'solar:bell-bing-bold-duotone',
      },
      {
        name: 'Daily tasks',
        key: 'dailyTasks',
        path: paths.dailyTasks,
        pathName: 'dailyTasks',
        icon: 'solar:calendar-bold-duotone',
      },
    ],
  },
];

export default sitemap;

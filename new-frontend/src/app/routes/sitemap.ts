import { SxProps } from '@mui/material';
import paths, { rootPaths } from './paths';

export interface MenuItem {
  name: string;
  pathName: string;
  key?: string;
  selectionPrefix?: string;
  path?: string;
  active?: boolean;
  icon?: string;
  iconSx?: SxProps;
  items?: MenuItem[];
}

const sitemap: MenuItem[] = [
  {
    name: 'Home',
    key: 'home',
    path: rootPaths.root,
    pathName: 'home',
    icon: 'material-symbols:home-rounded',
    active: true,
  },
  {
    name: 'Shop',
    key: 'shop.title',
    path: paths.shop,
    pathName: 'shop',
    icon: 'mdi:store-outline',
    active: true,
  },
  {
    name: 'Users',
    key: 'users.title',
    path: paths.users,
    pathName: 'users',
    icon: 'mdi:account-multiple-outline',
    active: true,
  },
  {
    name: 'Kepcoin',
    key: 'kepcoin',
    path: paths.kepcoin,
    pathName: 'kepcoin',
    icon: 'mdi:currency-usd-circle',
    active: true,
  },
  {
    name: 'Scheduler',
    key: 'calendar.title',
    path: paths.scheduler,
    pathName: 'scheduler',
    selectionPrefix: paths.scheduler,
    icon: 'material-symbols:calendar-month-outline',
    active: true,
  },
];

export default sitemap;

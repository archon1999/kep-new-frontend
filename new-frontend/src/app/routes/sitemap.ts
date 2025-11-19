import { ComponentType } from 'react';
import { SxProps, SvgIconProps } from '@mui/material';
import paths, { rootPaths } from './paths';
import KepcoinIcon from 'shared/components/icons/KepcoinIcon';

export interface MenuItem {
  name: string;
  pathName: string;
  key?: string;
  selectionPrefix?: string;
  path?: string;
  active?: boolean;
  icon?: string;
  iconComponent?: ComponentType<SvgIconProps>;
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
    iconComponent: KepcoinIcon,
    active: true,
  },
  {
    name: 'Calendar',
    key: 'calendar.title',
    path: paths.calendar,
    pathName: 'calendar',
    selectionPrefix: paths.calendar,
    icon: 'material-symbols:calendar-month-outline',
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
];

export default sitemap;

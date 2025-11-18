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
    key: 'menu.home',
    icon: 'material-symbols:home-rounded',
    items: [
      {
        name: 'Home',
        key: 'menu.home',
        path: rootPaths.root,
        pathName: 'home',
        icon: 'material-symbols:home-rounded',
        active: true,
      },
    ],
  },
  {
    id: 'kepcoin',
    subheader: 'Kepcoin',
    key: 'menu.kepcoin',
    icon: 'material-symbols:payments-rounded',
    items: [
      {
        name: 'Kepcoin',
        key: 'menu.kepcoin',
        path: paths.kepcoin,
        pathName: 'kepcoin',
        icon: 'material-symbols:payments-rounded',
        active: true,
      },
    ],
  },
  {
    id: 'users',
    subheader: 'Users',
    key: 'menu.users',
    icon: 'mdi:account-multiple-outline',
    items: [
      {
        name: 'Users',
        key: 'menu.users',
        path: paths.users,
        pathName: 'users',
        icon: 'mdi:account-multiple-outline',
        active: true,
      },
    ],
  },
];

export default sitemap;

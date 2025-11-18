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
  {
    id: 'users',
    subheader: 'Users',
    key: 'users',
    icon: 'mdi:account-group-outline',
    items: [
      {
        name: 'Users list',
        key: 'users-list',
        path: paths.users,
        pathName: 'users',
        icon: 'mdi:account-group-outline',
        active: true,
      },
    ],
  },
];

export default sitemap;

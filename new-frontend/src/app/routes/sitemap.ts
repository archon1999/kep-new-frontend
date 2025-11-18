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
    id: 'kepcoin',
    subheader: 'Kepcoin',
    key: 'kepcoin',
    icon: 'mdi:coin-outline',
    items: [
      {
        name: 'Kepcoin',
        key: 'kepcoin',
        path: paths.kepcoin,
        pathName: 'kepcoin',
        icon: 'mdi:coin-outline',
      },
    ],
  },
];

export default sitemap;

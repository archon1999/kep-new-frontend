import { SxProps } from '@mui/material';
import paths, { rootPaths } from './paths';

export interface SubMenuItem {
  id?: string;
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

const sitemap: SubMenuItem[] = [
  {
    id: 'home',
    name: 'Home',
    key: 'home',
    path: rootPaths.root,
    pathName: 'home',
    icon: 'material-symbols:home-rounded',
    active: true,
  },
  {
    id: 'shop',
    name: 'Shop',
    key: 'shop.title',
    path: paths.shop,
    pathName: 'shop',
    icon: 'mdi:store-outline',
    active: true,
  },
  {
    id: 'kepcoin',
    name: 'Kepcoin',
    key: 'kepcoin',
    path: paths.kepcoin,
    pathName: 'kepcoin',
    icon: 'mdi:currency-usd-circle',
    active: true,
  },
];

export default sitemap;

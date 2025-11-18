import { mainDrawerWidth } from 'shared/lib/constants.ts';

export type ThemeMode = 'light' | 'dark' | 'system';
export type NavigationMenuType = 'sidenav' | 'topnav' | 'combo';
export type SidenavType = 'default' | 'stacked' | 'slim';
export type TopnavType = 'default' | 'stacked' | 'slim';
export type TextDirection = 'ltr' | 'rtl';
export type NavColor = 'default' | 'vibrant';
export type SupportedLocales = 'en-US' | 'ru-RU' | 'uz-UZ';

export interface Config {
  assetsDir: string;
  textDirection: TextDirection;
  navigationMenuType: NavigationMenuType;
  sidenavType: SidenavType;
  sidenavCollapsed: boolean;
  topnavType: TopnavType;
  navColor: NavColor;
  openNavbarDrawer: boolean;
  drawerWidth: number;
  locale: SupportedLocales;
}

export const initialConfig: Config = {
  assetsDir: import.meta.env.VITE_ASSET_BASE_URL ?? '',
  textDirection: 'ltr',
  navigationMenuType: 'sidenav',
  sidenavType: 'default',
  sidenavCollapsed: false,
  topnavType: 'default',
  navColor: 'default',
  openNavbarDrawer: false,
  drawerWidth: mainDrawerWidth.full,
  locale: 'en-US',
};

export const defaultAuthCredentials = {
  email: 'demo@aurora.com',
  password: 'password123',
};

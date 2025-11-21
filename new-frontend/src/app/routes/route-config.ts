import { resources } from './resources';

export const rootPaths = {
  root: resources.Home,
  authRoot: '',
} as const;

export const authPaths = {
  login: resources.Login,
} as const;

export const apiEndpoints = {
  register: '/auth/register',
  login: '/api/login/',
  logout: '/auth/logout',
  profile: '/api/me',
  getUsers: '/users',
} as const;

export type RootPathKey = keyof typeof rootPaths;

export const rootPaths = {
  root: '/',
  authRoot: 'authentication',
  appsRoot: 'apps',
  homeRoot: 'home',
  practiceRoot: 'practice',
  competitionsRoot: 'competitions',
  kepcoinRoot: 'kepcoin',
  shopRoot: 'shop',
  calendarRoot: 'calendar',
};

const paths = {
  home: rootPaths.root,
  homeAlias: `/${rootPaths.homeRoot}`,
  kepcoin: `/${rootPaths.kepcoinRoot}`,
  shop: `/${rootPaths.shopRoot}`,
  scheduler: `/${rootPaths.appsRoot}/scheduler`,
  practiceProblems: `/${rootPaths.practiceRoot}/problems`,
  practiceChallenges: `/${rootPaths.practiceRoot}/challenges`,
  practiceProjects: `/${rootPaths.practiceRoot}/projects`,
  practiceTests: `/${rootPaths.practiceRoot}/tests`,
  competitionsContests: `/${rootPaths.competitionsRoot}/contests`,
  competitionsArena: `/${rootPaths.competitionsRoot}/arena`,
  competitionsTournaments: `/${rootPaths.competitionsRoot}/tournaments`,
  competitionsHackathons: `/${rootPaths.competitionsRoot}/hackathons`,
  users: '/users',
  calendar: `/${rootPaths.calendarRoot}`,
  authLogin: `/${rootPaths.authRoot}/login`,
};

export const authPaths = {
  login: paths.authLogin,
};

export const apiEndpoints = {
  register: '/auth/register',
  login: '/auth/login',
  logout: '/auth/logout',
  profile: '/api/me',
  getUsers: '/users',
  forgotPassword: '/auth/forgot-password',
  setPassword: '/auth/set-password',
  getProduct: (id: string) => `e-commerce/products/${id}`,
};

export default paths;

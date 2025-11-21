export const rootPaths = {
  root: '/',
  authRoot: 'authentication',
  appsRoot: 'apps',
  kepcoinRoot: 'kepcoin',
  shopRoot: 'shop',
  calendarRoot: 'calendar',
  usersRoot: 'users',
};

const paths = {
  kepcoin: `/${rootPaths.kepcoinRoot}`,
  shop: `/${rootPaths.shopRoot}`,
  users: `/${rootPaths.usersRoot}`,
  calendar: `/${rootPaths.calendarRoot}`,
  challenges: '/practice/challenges',
  challenge: '/practice/challenges/challenge/:id',
  challengesRating: '/practice/challenges/rating',
  challengesStats: '/practice/challenges/user-statistics',
  arena: '/competitions/arena',
  arenaTournament: '/competitions/arena/tournament/:id',
  hackathons: '/competitions/hackathons',
  accountSettings: '/account-settings',
  projects: '/practice/projects',
  project: '/practice/projects/project/:slug',
  tests: '/practice/tests',
  test: '/practice/tests/test/:id',
  testPass: '/practice/tests/test-pass/:testPassId',
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
};

export default paths;

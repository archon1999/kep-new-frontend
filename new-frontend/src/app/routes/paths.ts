export const rootPaths = {
  root: '/',
  authRoot: '',
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
  problems: '/practice/problems',
  challenges: '/practice/challenges',
  challenge: '/practice/challenges/challenge/:id',
  challengesRating: '/practice/challenges/rating',
  challengesStats: '/practice/challenges/user-statistics',
  arena: '/competitions/arena',
  arenaTournament: '/competitions/arena/tournament/:id',
  contests: '/competitions/contests',
  contest: '/competitions/contests/contest/:id',
  tournaments: '/competitions/tournaments',
  tournament: '/competitions/tournaments/tournament/:id',
  hackathons: '/competitions/hackathons',
  hackathon: '/competitions/hackathons/hackathon/:id',
  hackathonProjects: '/competitions/hackathons/hackathon/:id/projects',
  hackathonProject: '/competitions/hackathons/hackathon/:id/projects/:symbol',
  hackathonAttempts: '/competitions/hackathons/hackathon/:id/attempts',
  hackathonRegistrants: '/competitions/hackathons/hackathon/:id/registrants',
  hackathonStandings: '/competitions/hackathons/hackathon/:id/standings',
  blog: '/learn/blog',
  blogPost: '/learn/blog/post/:id',
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
  login: '/api/login/',
  logout: '/auth/logout',
  profile: '/api/me',
  getUsers: '/users',
};

export default paths;

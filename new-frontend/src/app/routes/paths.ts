export const rootPaths = {
  root: '/',
  authRoot: 'authentication',
  appsRoot: 'apps',
  kepcoinRoot: 'kepcoin',
  shopRoot: 'shop',
  calendarRoot: 'calendar',
  usersRoot: 'users',
  practiceRoot: 'practice',
};

const paths = {
  kepcoin: `/${rootPaths.kepcoinRoot}`,
  shop: `/${rootPaths.shopRoot}`,
  users: `/${rootPaths.usersRoot}`,
  calendar: `/${rootPaths.calendarRoot}`,
  authLogin: `/${rootPaths.authRoot}/login`,
  tests: `/${rootPaths.practiceRoot}/tests`,
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

export const rootPaths = {
  root: '/',
  authRoot: 'authentication',
  authDefaultRoot: 'default',
  kepcoinRoot: 'kepcoin',
};

const paths = {
  kepcoin: `/${rootPaths.kepcoinRoot}`,
  calendar: '/calendar',

  authLogin: `/${rootPaths.authRoot}/login`,
  authSignup: `/${rootPaths.authRoot}/sign-up`,
  authForgotPassword: `/${rootPaths.authRoot}/forgot-password`,
  auth2FA: `/${rootPaths.authRoot}/2FA`,
  authSetPassword: `/${rootPaths.authRoot}/set-password`,

  defaultLoggedOut: `/${rootPaths.authRoot}/${rootPaths.authDefaultRoot}/logged-out`,
};

export const authPaths = {
  login: paths.authLogin,
  signup: paths.authSignup,
  forgotPassword: paths.authForgotPassword,
  setNewPassword: paths.authSetPassword,
  twoFactorAuth: paths.auth2FA,
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

export const rootPaths = {
  root: '/',
  dashboardRoot: 'dashboard',
  pagesRoot: 'pages',
  miscRoot: 'misc',
  authRoot: 'authentication',
  pricingRoot: 'pricing',
  errorRoot: 'error',
  ecommerceRoot: 'ecommerce',
  ecommerceAdminRoot: 'admin',
  ecommerceCustomerRoot: 'customer',
  eventsRoot: 'events',
  emailRoot: 'email',
  kanbanRoot: 'kanban',
  appsRoot: 'apps',
};

const paths = {
  home: rootPaths.root,

  authLogin: `/${rootPaths.authRoot}/login`,
  authSignup: `/${rootPaths.authRoot}/sign-up`,
  authForgotPassword: `/${rootPaths.authRoot}/forgot-password`,
  auth2FA: `/${rootPaths.authRoot}/2FA`,
  authSetPassword: `/${rootPaths.authRoot}/set-password`,

  defaultLoggedOut: `/${rootPaths.authRoot}/logged-out`,
  pricingColumn: `/${rootPaths.pricingRoot}/column`,
  notifications: `/${rootPaths.pagesRoot}/notifications`, //? update path

  404: `/${rootPaths.errorRoot}/404`,
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

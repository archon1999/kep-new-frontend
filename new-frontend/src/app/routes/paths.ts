export const rootPaths = {
  root: '/',
  authRoot: 'authentication',
  kepcoinRoot: 'kepcoin',
  shopRoot: 'shop',
  appsRoot: 'apps',
};

const paths = {
  kepcoin: `/${rootPaths.kepcoinRoot}`,
  shop: `/${rootPaths.shopRoot}`,
  calendar: `/${rootPaths.appsRoot}/calendar`,

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

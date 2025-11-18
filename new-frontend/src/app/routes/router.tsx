import { Suspense, lazy } from 'react';
import { Outlet, RouteObject, createBrowserRouter, useLocation } from 'react-router';
import App from 'app/App.tsx';
import AuthLayout from 'app/layouts/auth-layout';
import DefaultAuthLayout from 'app/layouts/auth-layout/DefaultAuthLayout';
import MainLayout from 'app/layouts/main-layout';
import Page404 from 'pages/errors/Page404';
import PageLoader from 'shared/components/loading/PageLoader';
import paths, { authPaths, rootPaths } from './paths';

const Home = lazy(() => import('pages/home/Home'));
const KepcoinPage = lazy(() => import('pages/kepcoin/KepcoinPage'));

const LoggedOut = lazy(() => import('pages/authentication/default/LoggedOut'));

const Login = lazy(() => import('pages/authentication/default/jwt/Login'));
const Signup = lazy(() => import('pages/authentication/default/jwt/Signup'));
const ForgotPassword = lazy(() => import('pages/authentication/default/jwt/ForgotPassword'));
const TwoFA = lazy(() => import('pages/authentication/default/jwt/TwoFA'));
const SetPassword = lazy(() => import('pages/authentication/default/jwt/SetPassword'));

export const SuspenseOutlet = () => {
  const location = useLocation();

  return (
    <Suspense key={location.pathname} fallback={<PageLoader />}>
      <Outlet />
    </Suspense>
  );
};

export const routes: RouteObject[] = [
  {
    element: <App />,
    children: [
      {
        path: '/',
        element: (
          <MainLayout>
            <SuspenseOutlet />
          </MainLayout>
        ),
        children: [
          {
            index: true,
            element: <Home />,
          },
          {
            path: paths.kepcoin,
            element: <KepcoinPage />,
          },
        ],
      },

      {
        path: rootPaths.authRoot,
        element: <AuthLayout />,
        children: [
          {
            element: (
              <DefaultAuthLayout>
                <SuspenseOutlet />
              </DefaultAuthLayout>
            ),
            children: [
              {
                path: authPaths.login,
                element: <Login />,
              },
              {
                path: authPaths.signup,
                element: <Signup />,
              },
              {
                path: authPaths.forgotPassword,
                element: <ForgotPassword />,
              },
              {
                path: authPaths.twoFactorAuth,
                element: <TwoFA />,
              },
              {
                path: authPaths.setNewPassword,
                element: <SetPassword />,
              },
              {
                path: paths.defaultLoggedOut,
                element: <LoggedOut />,
              },
            ],
          },
        ],
      },

      {
        path: '*',
        element: <Page404 />,
      },
    ],
  },
];

const router = createBrowserRouter(routes, {
  basename: import.meta.env.VITE_BASENAME || '/',
});

export default router;

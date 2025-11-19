import { Suspense, lazy } from 'react';
import { Outlet, RouteObject, createBrowserRouter, useLocation } from 'react-router';
import App from 'app/App.tsx';
import AuthLayout from 'app/layouts/auth-layout';
import DefaultAuthLayout from 'app/layouts/auth-layout/DefaultAuthLayout';
import MainLayout from 'app/layouts/main-layout';
import Page404 from 'modules/errors/ui/pages/Page404';
import PageLoader from 'shared/components/loading/PageLoader';
import paths, { authPaths, rootPaths } from './paths';

const Home = lazy(() => import('modules/home/ui/pages/HomePage'));
const KepcoinPage = lazy(() => import('modules/kepcoin/ui/pages/KepcoinPage'));
const ShopPage = lazy(() => import('modules/shop/ui/pages/ShopPage'));
const UsersListPage = lazy(() => import('modules/users/ui/pages/UsersListPage'));

const CalendarPage = lazy(() => import('modules/calendar/ui/pages/CalendarPage'));

const Login = lazy(() => import('modules/authentication/ui/pages/LoginPage'));

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
            path: paths.users,
            element: <UsersListPage />,
          },
          {
            path: paths.shop,
            element: <ShopPage />,
          },
          {
            path: paths.kepcoin,
            element: <KepcoinPage />,
          },
          {
            path: paths.calendar,
            element: <CalendarPage />,
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

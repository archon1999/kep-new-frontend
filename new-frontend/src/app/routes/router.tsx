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
const ProjectsListPage = lazy(() => import('modules/projects/ui/pages/ProjectsListPage'));
const ProjectDetailPage = lazy(() => import('modules/projects/ui/pages/ProjectDetailPage'));
const TestsListPage = lazy(() => import('modules/testing/ui/pages/TestsListPage'));
const TestDetailPage = lazy(() => import('modules/testing/ui/pages/TestDetailPage'));
const TestPassPage = lazy(() => import('modules/testing/ui/pages/TestPassPage'));
const HackathonsListPage = lazy(() => import('modules/hackathons/ui/pages/HackathonsListPage'));

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
            handle: { titleKey: 'pageTitles.home' },
          },
          {
            path: paths.users,
            element: <UsersListPage />,
            handle: { titleKey: 'pageTitles.users' },
          },
          {
            path: paths.projects,
            element: <ProjectsListPage />,
            handle: { titleKey: 'pageTitles.projects' },
          },
          {
            path: paths.project,
            element: <ProjectDetailPage />,
            handle: { titleKey: 'pageTitles.project' },
          },
          {
            path: paths.tests,
            element: <TestsListPage />,
            handle: { titleKey: 'pageTitles.tests' },
          },
          {
            path: paths.test,
            element: <TestDetailPage />,
            handle: { titleKey: 'pageTitles.test' },
          },
          {
            path: paths.testPass,
            element: <TestPassPage />,
            handle: { titleKey: 'pageTitles.testPass' },
          },
          {
            path: paths.shop,
            element: <ShopPage />,
            handle: { titleKey: 'pageTitles.shop' },
          },
          {
            path: paths.kepcoin,
            element: <KepcoinPage />,
            handle: { titleKey: 'pageTitles.kepcoin' },
          },
          {
            path: paths.calendar,
            element: <CalendarPage />,
            handle: { titleKey: 'pageTitles.calendar' },
          },
          {
            path: paths.hackathons,
            element: <HackathonsListPage />,
            handle: { titleKey: 'pageTitles.hackathons' },
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
                handle: { titleKey: 'pageTitles.login' },
              },
            ],
          },
        ],
      },

      {
        path: '*',
        element: <Page404 />,
        handle: { titleKey: 'pageTitles.notFound' },
      },
    ],
  },
];

const router = createBrowserRouter(routes, {
  basename: import.meta.env.VITE_BASENAME || '/',
});

export default router;

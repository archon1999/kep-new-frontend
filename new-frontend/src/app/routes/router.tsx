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
const ChallengesListPage = lazy(() => import('modules/challenges/ui/pages/ChallengesListPage'));
const ChallengeDetailPage = lazy(() => import('modules/challenges/ui/pages/ChallengeDetailPage'));
const ChallengesRatingPage = lazy(() => import('modules/challenges/ui/pages/ChallengesRatingPage'));
const ChallengeUserStatisticsPage = lazy(() => import('modules/challenges/ui/pages/UserStatisticsPage'));
const ArenaListPage = lazy(() => import('modules/arena/ui/pages/ArenaListPage'));
const ArenaDetailPage = lazy(() => import('modules/arena/ui/pages/ArenaDetailPage'));
const TournamentsListPage = lazy(() => import('modules/tournaments/ui/pages/TournamentsListPage'));
const TournamentPage = lazy(() => import('modules/tournaments/ui/pages/TournamentPage'));
const HackathonsListPage = lazy(() => import('modules/hackathons/ui/pages/HackathonsListPage'));
const HackathonPage = lazy(() => import('modules/hackathons/ui/pages/HackathonPage'));
const HackathonProjectsPage = lazy(() => import('modules/hackathons/ui/pages/HackathonProjectsPage'));
const HackathonProjectPage = lazy(() => import('modules/hackathons/ui/pages/HackathonProjectPage'));
const HackathonAttemptsPage = lazy(() => import('modules/hackathons/ui/pages/HackathonAttemptsPage'));
const HackathonRegistrantsPage = lazy(() => import('modules/hackathons/ui/pages/HackathonRegistrantsPage'));
const HackathonStandingsPage = lazy(() => import('modules/hackathons/ui/pages/HackathonStandingsPage'));
const AccountSettingsPage = lazy(() => import('modules/account-settings/ui/pages/AccountSettingsPage'));

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
            path: paths.challenges,
            element: <ChallengesListPage />,
            handle: { titleKey: 'pageTitles.challenges' },
          },
          {
            path: paths.challenge,
            element: <ChallengeDetailPage />,
            handle: { titleKey: 'pageTitles.challenge' },
          },
          {
            path: paths.challengesRating,
            element: <ChallengesRatingPage />,
            handle: { titleKey: 'pageTitles.challengesRating' },
          },
          {
            path: paths.challengesStats,
            element: <ChallengeUserStatisticsPage />,
            handle: { titleKey: 'pageTitles.challengesStats' },
          },
          {
            path: paths.arena,
            element: <ArenaListPage />,
            handle: { titleKey: 'pageTitles.arena' },
          },
          {
            path: paths.arenaTournament,
            element: <ArenaDetailPage />,
            handle: { titleKey: 'pageTitles.arenaTournament' },
          },
          {
            path: paths.tournaments,
            element: <TournamentsListPage />,
            handle: { titleKey: 'pageTitles.tournaments' },
          },
          {
            path: paths.tournament,
            element: <TournamentPage />,
            handle: { titleKey: 'pageTitles.tournament' },
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
          {
            path: paths.hackathon,
            element: <HackathonPage />,
            handle: { titleKey: 'pageTitles.hackathons' },
          },
          {
            path: paths.hackathonProjects,
            element: <HackathonProjectsPage />,
            handle: { titleKey: 'pageTitles.hackathons' },
          },
          {
            path: paths.hackathonProject,
            element: <HackathonProjectPage />,
            handle: { titleKey: 'pageTitles.hackathons' },
          },
          {
            path: paths.hackathonAttempts,
            element: <HackathonAttemptsPage />,
            handle: { titleKey: 'pageTitles.hackathons' },
          },
          {
            path: paths.hackathonRegistrants,
            element: <HackathonRegistrantsPage />,
            handle: { titleKey: 'pageTitles.hackathons' },
          },
          {
            path: paths.hackathonStandings,
            element: <HackathonStandingsPage />,
            handle: { titleKey: 'pageTitles.hackathons' },
          },
          {
            path: paths.accountSettings,
            element: <AccountSettingsPage />,
            handle: { titleKey: 'pageTitles.accountSettings' },
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

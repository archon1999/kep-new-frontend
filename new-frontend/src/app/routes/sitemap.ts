import { SxProps } from '@mui/material';
import paths, { rootPaths } from './paths';

export interface MenuItem {
  name: string;
  pathName: string;
  key?: string;
  selectionPrefix?: string;
  path?: string;
  active?: boolean;
  icon?: string;
  iconSx?: SxProps;
  items?: MenuItem[];
}

const practicePrefix = `/${rootPaths.practiceRoot}`;
const competitionsPrefix = `/${rootPaths.competitionsRoot}`;

const sitemap: MenuItem[] = [
  {
    name: 'Home',
    key: 'home',
    path: rootPaths.root,
    pathName: 'home',
    icon: 'material-symbols:home-rounded',
    active: true,
  },
  {
    name: 'Practice',
    key: 'menu.practice',
    pathName: 'practice',
    icon: 'material-symbols:psychology-alt-rounded',
    selectionPrefix: practicePrefix,
    items: [
      {
        name: 'Problems',
        key: 'menu.problems',
        path: paths.practiceProblems,
        pathName: 'practice-problems',
        icon: 'material-symbols:code-rounded',
        active: true,
      },
      {
        name: 'Challenges',
        key: 'menu.challenges',
        path: paths.practiceChallenges,
        pathName: 'practice-challenges',
        icon: 'material-symbols:flag-rounded',
        active: true,
      },
      {
        name: 'Projects',
        key: 'menu.projects',
        path: paths.practiceProjects,
        pathName: 'practice-projects',
        icon: 'material-symbols:device-hub-rounded',
        active: true,
      },
      {
        name: 'Tests',
        key: 'menu.tests',
        path: paths.practiceTests,
        pathName: 'practice-tests',
        icon: 'material-symbols:quiz-rounded',
        active: true,
      },
    ],
  },
  {
    name: 'Competitions',
    key: 'menu.competitions',
    pathName: 'competitions',
    icon: 'material-symbols:emoji-events-rounded',
    selectionPrefix: competitionsPrefix,
    items: [
      {
        name: 'Contests',
        key: 'menu.contests',
        path: paths.competitionsContests,
        pathName: 'competitions-contests',
        icon: 'mdi:trophy-outline',
        active: true,
      },
      {
        name: 'Arena',
        key: 'menu.arena',
        path: paths.competitionsArena,
        pathName: 'competitions-arena',
        icon: 'mdi:sword-cross',
        active: true,
      },
      {
        name: 'Tournaments',
        key: 'menu.tournaments',
        path: paths.competitionsTournaments,
        pathName: 'competitions-tournaments',
        icon: 'mdi:medal-outline',
        active: true,
      },
      {
        name: 'Hackathons',
        key: 'menu.hackathons',
        path: paths.competitionsHackathons,
        pathName: 'competitions-hackathons',
        icon: 'mdi:laptop',
        active: true,
      },
    ],
  },
  {
    name: 'Users',
    key: 'users.title',
    path: paths.users,
    pathName: 'users',
    icon: 'mdi:account-multiple-outline',
    active: true,
  },
  {
    name: 'Kepcoin',
    key: 'kepcoin',
    path: paths.kepcoin,
    pathName: 'kepcoin',
    icon: 'mdi:currency-usd-circle',
    active: true,
  },
  {
    name: 'Calendar',
    key: 'calendar.title',
    path: paths.calendar,
    pathName: 'calendar',
    selectionPrefix: paths.calendar,
    icon: 'material-symbols:calendar-month-outline',
    active: true,
  },
  {
    name: 'Shop',
    key: 'shop.title',
    path: paths.shop,
    pathName: 'shop',
    icon: 'mdi:store-outline',
    active: true,
  },
];

export default sitemap;

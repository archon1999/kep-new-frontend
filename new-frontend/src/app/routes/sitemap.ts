import { SxProps } from '@mui/material';
import paths, { rootPaths } from './paths';
import { resources } from './resources';

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

const sitemap: MenuItem[] = [
  {
    name: 'Home',
    key: 'menu.home',
    path: rootPaths.root,
    pathName: 'home',
    icon: 'material-symbols:home-rounded',
    active: true,
  },
  {
    name: 'Practice',
    key: 'menu.practice',
    pathName: 'practice',
    icon: 'mdi:target-variant',
    active: true,
    items: [
      {
        name: 'Problems',
        key: 'menu.problems',
        path: resources.Problems,
        pathName: 'practice-problems',
        selectionPrefix: '/practice/problems',
        icon: 'mdi:code-tags',
        active: true,
      },
      {
        name: 'Challenges',
        key: 'menu.challenges',
        path: resources.Challenges,
        pathName: 'practice-challenges',
        selectionPrefix: '/practice/challenges',
        icon: 'mdi:flag-checkered',
        active: true,
      },
      {
        name: 'Projects',
        key: 'menu.projects',
        path: resources.Projects,
        pathName: 'practice-projects',
        selectionPrefix: '/practice/projects',
        icon: 'mdi:briefcase-outline',
        active: true,
      },
      {
        name: 'Tests',
        key: 'menu.tests',
        path: resources.Tests,
        pathName: 'practice-tests',
        selectionPrefix: '/practice/tests',
        icon: 'mdi:clipboard-text-outline',
        active: true,
      },
    ],
  },
  {
    name: 'Competitions',
    key: 'menu.competitions',
    pathName: 'competitions',
    icon: 'mdi:trophy-outline',
    active: true,
    items: [
      {
        name: 'Contests',
        key: 'menu.contests',
        path: resources.Contests,
        pathName: 'competitions-contests',
        selectionPrefix: '/competitions/contests',
        icon: 'mdi:podium-gold',
        active: true,
      },
      {
        name: 'Arena',
        key: 'menu.arena',
        path: resources.Arena,
        pathName: 'competitions-arena',
        selectionPrefix: '/competitions/arena',
        icon: 'mdi:sword-cross',
        active: true,
      },
      {
        name: 'Tournaments',
        key: 'menu.tournaments',
        path: resources.Tournaments,
        pathName: 'competitions-tournaments',
        selectionPrefix: '/competitions/tournaments',
        icon: 'mdi:tournament',
        active: true,
      },
      {
        name: 'Hackathons',
        key: 'menu.hackathons',
        path: resources.Hackathons,
        pathName: 'competitions-hackathons',
        selectionPrefix: '/competitions/hackathons',
        icon: 'mdi:laptop-account',
        active: true,
      },
    ],
  },
  {
    name: 'Users',
    key: 'menu.users',
    path: paths.users,
    pathName: 'users',
    selectionPrefix: paths.users,
    icon: 'mdi:account-multiple-outline',
    active: true,
  },
  {
    name: 'Kepcoin',
    key: 'menu.kepcoin',
    path: paths.kepcoin,
    pathName: 'kepcoin',
    selectionPrefix: paths.kepcoin,
    icon: 'mdi:currency-usd-circle',
    active: true,
  },
  {
    name: 'Calendar',
    key: 'menu.calendar',
    path: paths.calendar,
    pathName: 'calendar',
    selectionPrefix: paths.calendar,
    icon: 'material-symbols:calendar-month-outline',
    active: true,
  },
  {
    name: 'Shop',
    key: 'menu.shop',
    path: paths.shop,
    pathName: 'shop',
    selectionPrefix: paths.shop,
    icon: 'mdi:store-outline',
    active: true,
  },
];

export default sitemap;

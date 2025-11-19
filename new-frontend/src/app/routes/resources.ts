export const resources = {
  Home: '/home',

  Problems: '/practice/problems',
  Problem: '/practice/problems/problem/:id',
  Attempt: '/practice/problems/attempts/:id',
  StudyPlan: '/practice/problems/study-plan/:id',

  Attempts: '/practice/problems/attempts',
  AttemptsByUser: '/practice/problems/attempts/:username',

  Contests: '/competitions/contests',
  Contest: '/competitions/contests/contest/:id',
  ContestStandings: '/competitions/contests/contest/:id/standings',
  ContestProblems: '/competitions/contests/contest/:id/problems',
  ContestAttempts: '/competitions/contests/contest/:id/attempts',
  ContestStatistics: '/competitions/contests/contest/:id/statistics',
  ContestRegistrants: '/competitions/contests/contest/:id/registrants',
  ContestRatingChanges: '/competitions/contests/contest/:id/rating-changes',
  ContestQuestions: '/competitions/contests/contest/:id/questions',
  ContestProblem: '/competitions/contests/contest/:id/problem/:symbol',
  ContestsUserStatistics: '/competitions/contests/user-statistics',

  Challenges: '/practice/challenges',
  ChallengesRating: '/practice/challenges/rating',
  Challenge: '/practice/challenges/challenge/:id',

  Duels: '/practice/duels',
  DuelsRating: '/practice/duels/rating',
  Duel: '/practice/duels/duel/:id',

  Arena: '/competitions/arena',
  ArenaTournament: '/competitions/arena/tournament/:id',

  Tournaments: '/competitions/tournaments',
  Tournament: '/competitions/tournaments/tournament/:id',

  Hackathons: '/competitions/hackathons',
  Hackathon: '/competitions/hackathons/hackathon/:id',
  HackathonProjects: '/competitions/hackathons/hackathon/:id/projects',
  HackathonProject: '/competitions/hackathons/hackathon/:id/projects/:symbol',
  HackathonAttempts: '/competitions/hackathons/hackathon/:id/attempts',
  HackathonRegistrants: '/competitions/hackathons/hackathon/:id/registrants/',
  HackathonStandings: '/competitions/hackathons/hackathon/:id/standings',

  Tests: '/practice/tests',
  Test: '/practice/tests/test/:id',

  Projects: '/practice/projects',
  Project: '/practice/projects/project/:id',

  Courses: '/learn/courses',
  Course: '/learn/courses/course/:id',
  CourseFirstLesson: '/learn/courses/course/:id/lesson/1',
  BlogPost: '/learn/blog/post/:id',

  Blog: '/learn/blog',
  Lugavar: '/learn/lugavar',

  Users: '/users',
  UserProfile: '/users/user/:username',
  UserProfileFollowers: '/users/user/:username/followers',
  UserProfileRatings: '/users/user/:username/ratings',
  UserProfileActivityHistory: '/users/user/:username/activity-history',
  UserProfileBlog: '/users/user/:username/blog',
  UserProfileAchievements: '/users/user/:username/achievements',

  Calendar: '/calendar',
  Shop: '/shop',
  Kepcoin: '/kepcoin',
  KepCover: '/kep-cover',

  Login: '/login',
  Settings: '/settings',
  SettingsChangePassword: '/settings/change-password',
  SettingsInformation: '/settings/information',
  SettingsSocial: '/settings/social',
  SettingsSkills: '/settings/skills',
  SettingsCareer: '/settings/career',
  SettingsTeams: '/settings/teams',
  SettingsSystem: '/settings/system',
  TeamJoin: '/teams/:id/join',
} as const;

export type Resource = keyof typeof resources;
export type ResourceValue = (typeof resources)[Resource];

export function getResourceById(resource: ResourceValue, id: number | string) {
  return resource.replace(':id', id.toString());
}

export function getResourceByUsername(resource: ResourceValue, username: string) {
  return resource.replace(':username', username);
}

export function getResourceByParams(
  resource: ResourceValue,
  params: Record<string, string | number>,
) {
  return Object.entries(params).reduce((result, [key, value]) => (
    result.replace(`:${key}`, value.toString())
  ), resource);
}

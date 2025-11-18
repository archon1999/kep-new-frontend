export interface UserRating {
  value?: number | string;
  title?: string;
}

export interface UserListItem {
  id?: number;
  username: string;
  firstName?: string;
  lastName?: string;
  avatar: string;
  country?: string;
  streak?: number;
  maxStreak?: number;
  lastSeen?: string;
  kepcoin?: number;
  skillsRating?: UserRating;
  activityRating?: UserRating;
  contestsRating?: UserRating;
  challengesRating?: UserRating;
  isOnline?: boolean;
}

export interface UsersListFilters {
  username?: string;
  firstName?: string;
  country?: string;
  ageFrom?: number;
  ageTo?: number;
}

export interface UsersListQuery extends UsersListFilters {
  page: number;
  pageSize: number;
  ordering?: string;
}

export interface UsersListResult {
  data: UserListItem[];
  total: number;
  page: number;
  pageSize: number;
  pagesCount?: number;
}

export interface CountryOption {
  code: string;
  name: string;
}

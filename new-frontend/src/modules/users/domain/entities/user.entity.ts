import type { ApiUsersListParams, UserList } from 'shared/api/orval/generated/endpoints';

export interface UsersListFilters {
  username?: string;
  firstName?: string;
  country?: string;
  ageFrom?: number | null;
  ageTo?: number | null;
}

export type UsersListParams = ApiUsersListParams;

export type UsersListItem = UserList & {
  country?: string;
  maxStreak?: number;
  contestsRating?: number | string;
  contestsRatingTitle?: string;
  challengesRating?: number | string;
  challengesRatingTitle?: string;
};

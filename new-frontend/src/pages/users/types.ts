import { UserList } from 'shared/api/orval/generated/endpoints/index.schemas';

export type RatingValue =
  | {
      value?: number | string;
      title?: string;
      rating?: number | string;
      ratingTitle?: string;
      rankTitle?: string;
    }
  | number
  | string
  | null
  | undefined;

export type UsersListRow = UserList & {
  country?: string;
  maxStreak?: number;
  skillsRating?: RatingValue;
  activityRating?: RatingValue;
  contestsRating?: RatingValue;
  challengesRating?: RatingValue;
};

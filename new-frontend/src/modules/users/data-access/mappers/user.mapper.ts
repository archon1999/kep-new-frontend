import { ApiUsersCountriesResult, ApiUsersListResult } from 'shared/api/orval/generated/endpoints';
import { RatingValue, UsersListItem, UsersListResponse } from '../../domain/entities/user.entity';

const normalizeRating = (rating?: unknown): RatingValue | undefined => {
  if (!rating) return undefined;

  if (typeof rating === 'object') {
    const ratingData = rating as Record<string, unknown>;
    return {
      value: (ratingData.value as number | string | undefined) ?? (ratingData.rating as number | string | undefined),
      title:
        (ratingData.title as string | undefined) ??
        (ratingData.ratingTitle as string | undefined) ??
        (ratingData.rankTitle as string | undefined),
    };
  }

  return { value: rating as number | string };
};

export const mapApiUserToDomain = (user: any): UsersListItem => ({
  id: user.id,
  username: user.username,
  firstName: user.firstName ?? user.first_name,
  lastName: user.lastName ?? user.last_name,
  avatar: user.avatar,
  country: user.country,
  streak: user.streak,
  maxStreak: user.maxStreak ?? user.max_streak,
  kepcoin: user.kepcoin,
  lastSeen: user.lastSeen ?? user.last_seen,
  skillsRating: normalizeRating(user.skillsRating ?? user.skills_rating),
  activityRating: normalizeRating(user.activityRating ?? user.activity_rating),
  contestsRating: normalizeRating(user.contestsRating ?? user.contests_rating),
  challengesRating: normalizeRating(user.challengesRating ?? user.challenges_rating),
});

export const mapApiUsersListToDomain = (response: ApiUsersListResult): UsersListResponse => ({
  page: response.page,
  pageSize: response.pageSize,
  pagesCount: response.pagesCount,
  total: response.total,
  count: response.count,
  data: (response.data ?? []).map(mapApiUserToDomain),
});

export const mapCountriesToCodes = (response: ApiUsersCountriesResult): string[] => {
  const data = (response as any)?.data ?? response;

  if (Array.isArray(data)) {
    return data
      .map((country) => {
        if (typeof country === 'string') return country;
        if (country && typeof country === 'object') {
          const countryObj = country as Record<string, unknown>;
          return (
            (countryObj.code as string | undefined) ??
            (countryObj.country as string | undefined) ??
            (countryObj.id as string | undefined)
          );
        }

        return undefined;
      })
      .filter((code): code is string => Boolean(code));
  }

  return [];
};

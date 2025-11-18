import {
  ApiUsersCountriesResult,
  ApiUsersListResult,
} from 'shared/api/orval/generated/endpoints';
import { UserList } from 'shared/api/orval/generated/endpoints/index.schemas';

import {
  CountryOption,
  UserListItem,
  UserRating,
  UsersListResult,
} from '../../domain/entities/user.entity';

const normalizeRating = (rating: unknown): UserRating | undefined => {
  if (rating === null || rating === undefined) return undefined;

  if (typeof rating === 'string' || typeof rating === 'number') {
    return { value: rating };
  }

  if (typeof rating === 'object') {
    const ratingObject = rating as Record<string, unknown>;
    const value = ratingObject.value ?? ratingObject.rating;

    return {
      value: (value as number | string | undefined) ?? undefined,
      title: (ratingObject.title ?? ratingObject.rankTitle) as string | undefined,
    };
  }

  return undefined;
};

const toUser = (user: UserList): UserListItem => {
  const maybeAnyUser = user as Record<string, any>;
  const contestsRating = maybeAnyUser.contestsRating ?? maybeAnyUser.contests_rating;
  const challengesRating = maybeAnyUser.challengesRating ?? maybeAnyUser.challenges_rating;

  return {
    id: user.id,
    username: user.username,
    firstName: user.firstName,
    lastName: user.lastName,
    avatar: user.avatar,
    country: maybeAnyUser.country ?? maybeAnyUser.country_code,
    streak: user.streak,
    maxStreak: maybeAnyUser.maxStreak ?? maybeAnyUser.max_streak,
    lastSeen: user.lastSeen,
    kepcoin: user.kepcoin,
    skillsRating: normalizeRating(user.skillsRating),
    activityRating: normalizeRating(user.activityRating),
    contestsRating: normalizeRating(contestsRating),
    challengesRating: normalizeRating(challengesRating),
    isOnline: maybeAnyUser.isOnline,
  };
};

export const mapUsersListResponse = (response: ApiUsersListResult): UsersListResult => {
  const data = response?.data?.map(toUser) ?? [];

  return {
    data,
    total: response?.total ?? response?.count ?? data.length,
    page: response?.page ?? 1,
    pageSize: response?.pageSize ?? data.length,
    pagesCount: response?.pagesCount,
  };
};

const extractCountryCode = (entry: unknown): string | null => {
  if (!entry) return null;

  if (typeof entry === 'string') return entry;

  const countryFromObject = (entry as Record<string, any>).country ?? (entry as Record<string, any>).code;

  if (typeof countryFromObject === 'string') {
    return countryFromObject;
  }

  return null;
};

const getCountryName = (code: string, locale: string) => {
  try {
    const displayNames = new Intl.DisplayNames([locale], { type: 'region' });

    return displayNames.of(code.toUpperCase()) ?? code.toUpperCase();
  } catch {
    return code.toUpperCase();
  }
};

export const mapCountriesResponse = (
  response: ApiUsersCountriesResult,
  locale: string,
): CountryOption[] => {
  const language = (locale || 'en').replace('_', '-').slice(0, 2) || 'en';
  const seenCodes = new Set<string>();

  const countries = (response?.data as Array<string | UserList> | undefined) ?? [];

  return countries
    .reduce<CountryOption[]>((acc, item) => {
      const code = extractCountryCode(item);

      if (!code) return acc;

      const normalizedCode = code.toUpperCase();

      if (seenCodes.has(normalizedCode)) return acc;
      seenCodes.add(normalizedCode);

      return [
        ...acc,
        {
          code: normalizedCode,
          name: getCountryName(normalizedCode, language),
        },
      ];
    }, [])
    .sort((first, second) => first.name.localeCompare(second.name));
};

import type { ApiUsersCountriesResult, ApiUsersListResult } from 'shared/api/orval/generated/endpoints';
import type { UserDetail } from 'shared/api/orval/generated/endpoints/index.schemas';
import {
  RatingValue,
  UserDetails,
  UserRatingInfo,
  UserRatings,
  UsersListItem,
  UsersListResponse,
} from '../../domain/entities/user.entity';
import { RatingInfoApiResponse, UserRatingsApiResponse } from '../api/users.client';
import {
  UserAchievement,
  UserEducation,
  UserInfo,
  UserSkillSet,
  UserSocial,
  UserTechnology,
  UserWorkExperience,
} from '../../domain/entities/user.entity';

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

const normalizeRatingInfo = (rating?: RatingInfoApiResponse): UserRatingInfo | undefined => {
  if (!rating) return undefined;

  return {
    value: rating.value,
    rank: rating.rank,
    percentile: rating.percentile,
    title: rating.title,
  };
};

export const mapApiUserDetailToDomain = (user: UserDetail): UserDetails => ({
  id: user.id,
  username: user.username,
  firstName: user.firstName ?? (user as any).first_name,
  lastName: user.lastName ?? (user as any).last_name,
  avatar: user.avatar,
  coverPhoto: user.coverPhoto ?? (user as any).cover_photo,
  streak: user.streak,
  maxStreak: (user as any).maxStreak ?? (user as any).max_streak,
  kepcoin: user.kepcoin,
  lastSeen: user.lastSeen ?? (user as any).last_seen,
  isOnline: user.isOnline ?? (user as any).is_online,
  country: (user as any).country,
});

export const mapApiUserRatingsToDomain = (ratings: UserRatingsApiResponse): UserRatings => ({
  skillsRating: normalizeRatingInfo(ratings.skillsRating ?? ratings.skills_rating),
  activityRating: normalizeRatingInfo(ratings.activityRating ?? ratings.activity_rating),
  contestsRating: normalizeRatingInfo(ratings.contestsRating ?? ratings.contests_rating),
  challengesRating: normalizeRatingInfo(ratings.challengesRating ?? ratings.challenges_rating),
});

export const mapApiUserInfoToDomain = (info: Record<string, unknown>): UserInfo => ({
  country: (info.country as string | undefined) ?? (info as any)?.countryCode,
  region: info.region as string | undefined,
  website: info.website as string | undefined,
  email: info.email as string | undefined,
  emailVisible: (info as any)?.email_visible ?? (info as any)?.emailVisible,
  dateJoined: (info as any)?.date_joined ?? (info as any)?.dateJoined,
  dateOfBirth: (info as any)?.date_of_birth ?? (info as any)?.dateOfBirth,
  bio: info.bio as string | undefined,
});

export const mapApiUserSocialToDomain = (social: Record<string, unknown>): UserSocial => ({
  codeforcesHandle: (social as any)?.codeforcesHandle ?? (social as any)?.codeforces_handle,
  codeforcesBadge: (social as any)?.codeforcesBadge ?? (social as any)?.codeforces_badge,
  telegram: social.telegram as string | undefined,
});

export const mapApiUserSkillsToDomain = (skills: Record<string, unknown>): UserSkillSet => ({
  python: Number((skills as any)?.python) || undefined,
  webDevelopment: Number((skills as any)?.webDevelopment ?? (skills as any)?.web_development) || undefined,
  webScraping: Number((skills as any)?.webScraping ?? (skills as any)?.web_scraping) || undefined,
  algorithms: Number((skills as any)?.algorithms) || undefined,
  dataScience: Number((skills as any)?.dataScience ?? (skills as any)?.data_science) || undefined,
});

export const mapApiUserTechnologyToDomain = (technology: Record<string, unknown>): UserTechnology => ({
  text: technology.text as string | undefined,
  devIconClass: (technology as any)?.devIconClass ?? (technology as any)?.dev_icon_class,
  badgeColor: (technology as any)?.badgeColor ?? (technology as any)?.badge_color,
});

export const mapApiUserEducationToDomain = (education: Record<string, unknown>): UserEducation => ({
  organization: (education as any)?.organization ?? (education as any)?.school,
  degree: education.degree as string | undefined,
  fromYear: Number((education as any)?.fromYear ?? (education as any)?.from_year) || undefined,
  toYear: Number((education as any)?.toYear ?? (education as any)?.to_year) || undefined,
});

export const mapApiUserWorkExperienceToDomain = (experience: Record<string, unknown>): UserWorkExperience => ({
  company: (experience as any)?.company,
  jobTitle: (experience as any)?.jobTitle ?? (experience as any)?.job_title,
  fromYear: Number((experience as any)?.fromYear ?? (experience as any)?.from_year) || undefined,
  toYear: Number((experience as any)?.toYear ?? (experience as any)?.to_year) || undefined,
});

export const mapApiUserAchievementToDomain = (achievement: Record<string, unknown>): UserAchievement => ({
  id: achievement.id as number | undefined,
  type: (achievement as any)?.type as number | undefined,
  title: achievement.title as string | undefined,
  description: achievement.description as string | undefined,
  totalProgress: Number((achievement as any)?.totalProgress ?? (achievement as any)?.total_progress) || undefined,
  userResult: (achievement as any)?.userResult ?? (achievement as any)?.user_result,
});

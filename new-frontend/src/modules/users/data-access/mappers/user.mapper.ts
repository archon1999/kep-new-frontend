import type { ApiUsersCountriesResult, ApiUsersListResult } from 'shared/api/orval/generated/endpoints';
import type { UserDetail, UserList } from 'shared/api/orval/generated/endpoints/index.schemas';
import {
  RatingValue,
  UserDetails,
  UserAchievement,
  UserCompetitionPrize,
  UserEducation,
  UserInfo,
  UserRatingInfo,
  UserRatings,
  UserSkills,
  UserSocial,
  UsersListItem,
  UsersListResponse,
  UserTechnology,
  UserWorkExperience,
} from '../../domain/entities/user.entity';
import { RatingInfoApiResponse, UserRatingsApiResponse } from '../api/users.client';

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

const toNumber = (value?: unknown): number | undefined => {
  if (typeof value === 'number' && Number.isFinite(value)) return value;
  if (typeof value === 'string' && value.trim() !== '') {
    const parsed = Number(value);
    if (Number.isFinite(parsed)) return parsed;
  }
  return undefined;
};

export const mapApiUserInfoToDomain = (info: UserList | Record<string, unknown>): UserInfo => ({
  country: (info as any).country,
  region: (info as any).region,
  website: (info as any).website,
  email: (info as any).email,
  emailVisible: (info as any).emailVisible ?? (info as any).email_visible,
  dateJoined: (info as any).dateJoined ?? (info as any).date_joined,
  dateOfBirth: (info as any).dateOfBirth ?? (info as any).date_of_birth,
  bio: (info as any).bio,
});

export const mapApiUserSocialToDomain = (social: Record<string, unknown>): UserSocial => ({
  codeforcesHandle: (social as any).codeforcesHandle ?? (social as any).codeforces_handle,
  codeforcesBadge: (social as any).codeforcesBadge ?? (social as any).codeforces_badge,
  telegram: (social as any).telegram,
});

export const mapApiUserSkillsToDomain = (skills: Record<string, unknown>): UserSkills => ({
  python: toNumber((skills as any).python),
  webDevelopment: toNumber((skills as any).webDevelopment ?? (skills as any).web_development),
  webScraping: toNumber((skills as any).webScraping ?? (skills as any).web_scraping),
  algorithms: toNumber((skills as any).algorithms),
  dataScience: toNumber((skills as any).dataScience ?? (skills as any).data_science),
});

export const mapApiUserTechnologiesToDomain = (
  technologies: Array<Record<string, unknown>>,
): UserTechnology[] =>
  (technologies ?? []).map((item) => ({
    text: item.text as string | undefined,
    devIconClass: (item as any).devIconClass ?? (item as any).dev_icon_class,
    badgeColor: (item as any).badgeColor ?? (item as any).badge_color,
  }));

export const mapApiUserEducationsToDomain = (
  educations: Array<Record<string, unknown>>,
): UserEducation[] =>
  (educations ?? []).map((education) => ({
    organization: education.organization as string | undefined,
    degree: education.degree as string | undefined,
    fromYear: toNumber((education as any).fromYear ?? (education as any).from_year),
    toYear: toNumber((education as any).toYear ?? (education as any).to_year),
  }));

export const mapApiUserWorkExperiencesToDomain = (
  experiences: Array<Record<string, unknown>>,
): UserWorkExperience[] =>
  (experiences ?? []).map((experience) => ({
    company: experience.company as string | undefined,
    jobTitle: (experience as any).jobTitle ?? (experience as any).job_title,
    fromYear: toNumber((experience as any).fromYear ?? (experience as any).from_year),
    toYear: toNumber((experience as any).toYear ?? (experience as any).to_year),
  }));

export const mapApiUserAchievementsToDomain = (
  achievements: Array<Record<string, unknown>>,
): UserAchievement[] =>
  (achievements ?? []).map((achievement) => ({
    id: toNumber(achievement.id),
    type: toNumber(achievement.type),
    title: achievement.title as string | undefined,
    description: achievement.description as string | undefined,
    totalProgress: toNumber((achievement as any).totalProgress ?? (achievement as any).total_progress),
    userResult: (achievement as any).userResult ?? (achievement as any).user_result,
  }));

export const mapApiUserCompetitionPrizesToDomain = (
  prizes: Array<Record<string, unknown>>,
): UserCompetitionPrize[] =>
  (prizes ?? []).map((prize) => ({
    prizeTitle: prize.prizeTitle as string | undefined,
    prizeType: prize.prizeType as any,
    moneyValue: toNumber(prize.moneyValue ?? (prize as any).money_value) ?? null,
    kepcoinValue: toNumber(prize.kepcoinValue ?? (prize as any).kepcoin_value) ?? null,
    currency: prize.currency as any,
    competitionType: prize.competitionType as any,
    competitionId: toNumber(prize.competitionId ?? (prize as any).competition_id),
    competitionTitle: prize.competitionTitle as string | undefined,
    telegramPremiumPeriod: toNumber(
      prize.telegramPremiumPeriod ?? (prize as any).telegram_premium_period,
    ),
    note: prize.note as string | undefined,
  }));

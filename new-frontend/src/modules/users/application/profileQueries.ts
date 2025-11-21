import useSWR from 'swr';
import { apiClient } from 'shared/api';
import { HttpUsersRepository } from '../data-access/repository/http.users.repository';
import {
  ApiUsersAchievementsResult,
  ApiUsersEducationsReadResult,
  ApiUsersInfoReadResult,
  ApiUsersSkillsReadResult,
  ApiUsersSocialReadResult,
  ApiUsersTechnologiesReadResult,
  ApiUsersWorkExperiencesReadResult,
} from 'shared/api/orval/generated/endpoints';
import { UserAchievements, UserAboutData } from '../domain/entities/userProfile.entity';

const repository = new HttpUsersRepository();

const mapSkills = (skills?: ApiUsersSkillsReadResult | null) => ({
  algorithms: (skills as any)?.algorithms ?? (skills as any)?.algorithms_skill ?? 0,
  python: (skills as any)?.python ?? 0,
  webDevelopment: (skills as any)?.webDevelopment ?? (skills as any)?.web_development ?? 0,
  webScraping: (skills as any)?.webScraping ?? (skills as any)?.web_scraping ?? 0,
  dataScience: (skills as any)?.dataScience ?? (skills as any)?.data_science ?? 0,
});

const mapTechnologies = (technologies?: ApiUsersTechnologiesReadResult | null) =>
  ((technologies as any)?.data ?? technologies ?? [])
    .map((tech: any) => ({
      text: tech.text ?? tech.title ?? tech.name ?? '',
      devIconClass: tech.devIconClass ?? tech.dev_icon_class ?? tech.icon ?? '',
      badgeColor: tech.badgeColor ?? tech.badge_color ?? tech.color ?? '',
    }))
    .filter((tech: { text?: string }) => Boolean(tech.text));

const mapTimeline = (items?: ApiUsersEducationsReadResult | ApiUsersWorkExperiencesReadResult | null) =>
  ((items as any)?.data ?? items ?? [])
    .map((item: any) => ({
      organization: item.organization ?? item.company ?? item.school ?? '',
      degree: item.degree ?? item.jobTitle ?? item.title ?? '',
      fromYear: item.fromYear ?? item.from_year ?? item.startYear ?? item.start_year,
      toYear: item.toYear ?? item.to_year ?? item.endYear ?? item.end_year,
    }))
    .filter((item: { organization?: string }) => Boolean(item.organization));

const mapBio = (info?: ApiUsersInfoReadResult | null) => ({
  bio: (info as any)?.bio ?? (info as any)?.about ?? '',
  country: (info as any)?.country ?? '',
  region: (info as any)?.region ?? '',
  website: (info as any)?.website ?? '',
  email: (info as any)?.email ?? '',
  dateJoined: (info as any)?.dateJoined ?? (info as any)?.date_joined ?? '',
  dateOfBirth: (info as any)?.dateOfBirth ?? (info as any)?.date_of_birth ?? '',
});

const mapSocial = (social?: ApiUsersSocialReadResult | null) => ({
  codeforcesHandle: (social as any)?.codeforcesHandle ?? (social as any)?.codeforces_handle ?? '',
  codeforcesBadge: (social as any)?.codeforcesBadge ?? (social as any)?.codeforces_badge ?? '',
  telegram: (social as any)?.telegram ?? '',
});

const mapAchievements = (achievements?: ApiUsersAchievementsResult | null): UserAchievements => ({
  data:
    ((achievements as any)?.data ?? achievements ?? []).map((item: any) => ({
      id: item.id,
      type: item.type,
      title: item.title ?? item.name,
      description: item.description ?? '',
      totalProgress: item.totalProgress ?? item.total_progress ?? 0,
      userResult: {
        progress: item.userResult?.progress ?? item.user_result?.progress ?? 0,
        done: Boolean(item.userResult?.done ?? item.user_result?.done),
      },
    })) ?? [],
});

export const useUserDetails = (username?: string | null) =>
  useSWR(username ? ['user-details', username] : null, () => repository.getUser(username!), {
    keepPreviousData: true,
    revalidateOnFocus: false,
  });

export const useUserRatings = (username?: string | null) =>
  useSWR(username ? ['user-ratings', username] : null, () => repository.getUserRatings(username!), {
    keepPreviousData: true,
    revalidateOnFocus: false,
  });

export const useUserAbout = (username?: string | null) =>
  useSWR<UserAboutData | null>(
    username ? ['user-about', username] : null,
    async () => {
      const [info, educations, workExperiences, skills, technologies, social] = await Promise.all([
        apiClient.apiUsersInfoRead(username!),
        apiClient.apiUsersEducationsRead(username!),
        apiClient.apiUsersWorkExperiencesRead(username!),
        apiClient.apiUsersSkillsRead(username!),
        apiClient.apiUsersTechnologiesRead(username!),
        apiClient.apiUsersSocialRead(username!),
      ]);

      return {
        info: mapBio(info),
        educations: mapTimeline(educations),
        workExperiences: mapTimeline(workExperiences),
        skills: mapSkills(skills),
        technologies: mapTechnologies(technologies),
        social: mapSocial(social),
      };
    },
    {
      keepPreviousData: true,
      revalidateOnFocus: false,
    },
  );

export const useUserAchievements = (username?: string | null) =>
  useSWR<UserAchievements | null>(
    username ? ['user-achievements', username] : null,
    async () => mapAchievements(await apiClient.apiUsersAchievements(username!)),
    {
      keepPreviousData: true,
      revalidateOnFocus: false,
    },
  );

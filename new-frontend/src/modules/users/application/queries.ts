import useSWR from 'swr';
import { HttpUsersRepository } from '../data-access/repository/http.users.repository';
import {
  UserAchievement,
  UserDetails,
  UserCompetitionPrize,
  UserEducation,
  UserInfo,
  UserRatings,
  UsersChartStatistics,
  UsersListRequest,
  UsersListResponse,
  UserSkills,
  UserSocial,
  UserTechnology,
  UserWorkExperience,
} from '../domain/entities/user.entity';

const repository = new HttpUsersRepository();

export const useUsersList = (params: UsersListRequest) =>
  useSWR<UsersListResponse>(['users-list', params], () => repository.getUsers(params), {
    keepPreviousData: true,
    revalidateOnFocus: false,
  });

export const useUsersCountries = () =>
  useSWR<string[]>(['users-countries'], () => repository.getCountries(), {
    keepPreviousData: true,
    revalidateOnFocus: false,
  });

export const useUsersChartStatistics = () =>
  useSWR<UsersChartStatistics>(['users-chart-statistics'], () => repository.getChartStatistics(), {
    keepPreviousData: true,
    revalidateOnFocus: false,
  });

export const useUserDetails = (username?: string | null) =>
  useSWR<UserDetails>(username ? ['user-details', username] : null, () => repository.getUser(username!), {
    keepPreviousData: true,
    revalidateOnFocus: false,
  });

export const useUserRatings = (username?: string | null) =>
  useSWR<UserRatings>(username ? ['user-ratings', username] : null, () => repository.getUserRatings(username!), {
    keepPreviousData: true,
    revalidateOnFocus: false,
  });

export const useUserInfo = (username?: string | null) =>
  useSWR<UserInfo>(username ? ['user-info', username] : null, () => repository.getUserInfo(username!), {
    keepPreviousData: true,
    revalidateOnFocus: false,
  });

export const useUserSocial = (username?: string | null) =>
  useSWR<UserSocial>(username ? ['user-social', username] : null, () => repository.getUserSocial(username!), {
    keepPreviousData: true,
    revalidateOnFocus: false,
  });

export const useUserSkills = (username?: string | null) =>
  useSWR<UserSkills>(username ? ['user-skills', username] : null, () => repository.getUserSkills(username!), {
    keepPreviousData: true,
    revalidateOnFocus: false,
  });

export const useUserTechnologies = (username?: string | null) =>
  useSWR<UserTechnology[]>(
    username ? ['user-technologies', username] : null,
    () => repository.getUserTechnologies(username!),
    {
      keepPreviousData: true,
      revalidateOnFocus: false,
    },
  );

export const useUserEducations = (username?: string | null) =>
  useSWR<UserEducation[]>(
    username ? ['user-educations', username] : null,
    () => repository.getUserEducations(username!),
    {
      keepPreviousData: true,
      revalidateOnFocus: false,
    },
  );

export const useUserWorkExperiences = (username?: string | null) =>
  useSWR<UserWorkExperience[]>(
    username ? ['user-work-experiences', username] : null,
    () => repository.getUserWorkExperiences(username!),
    {
      keepPreviousData: true,
      revalidateOnFocus: false,
    },
  );

export const useUserAchievements = (username?: string | null) =>
  useSWR<UserAchievement[]>(
    username ? ['user-achievements', username] : null,
    () => repository.getUserAchievements(username!),
    {
      keepPreviousData: true,
      revalidateOnFocus: false,
    },
  );

export const useUserCompetitionPrizes = (username?: string | null) =>
  useSWR<UserCompetitionPrize[]>(
    username ? ['user-competition-prizes', username] : null,
    () => repository.getUserCompetitionPrizes(username!),
    {
      keepPreviousData: true,
      revalidateOnFocus: false,
    },
  );

export const useUserAbout = (username?: string | null) =>
  useSWR<{
    info?: UserInfo;
    skills?: UserSkills;
    technologies: UserTechnology[];
    educations: UserEducation[];
    workExperiences: UserWorkExperience[];
  }>(
    username ? ['user-about', username] : null,
    async () => {
      const [info, skills, technologies, educations, workExperiences] = await Promise.all([
        repository.getUserInfo(username!),
        repository.getUserSkills(username!),
        repository.getUserTechnologies(username!),
        repository.getUserEducations(username!),
        repository.getUserWorkExperiences(username!),
      ]);

      return { info, skills, technologies, educations, workExperiences };
    },
    {
      keepPreviousData: true,
      revalidateOnFocus: false,
    },
  );

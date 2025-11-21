import { usersApiClient } from '../api/users.client';
import {
  mapApiUserAchievementToDomain,
  mapApiUserDetailToDomain,
  mapApiUserEducationToDomain,
  mapApiUserInfoToDomain,
  mapApiUserRatingsToDomain,
  mapApiUserSkillsToDomain,
  mapApiUserSocialToDomain,
  mapApiUserTechnologyToDomain,
  mapApiUserWorkExperienceToDomain,
  mapApiUsersListToDomain,
  mapCountriesToCodes,
} from '../mappers/user.mapper';
import { UsersRepository } from '../../domain/ports/users.repository';
import {
  UserAchievement,
  UserDetails,
  UserEducation,
  UserInfo,
  UserRatings,
  UserSkillSet,
  UserSocial,
  UserTechnology,
  UserWorkExperience,
  UsersChartStatistics,
  UsersListRequest,
  UsersListResponse,
} from '../../domain/entities/user.entity';
import { ApiUsersListResult } from '../../../../shared/api/orval/generated/endpoints';

export class HttpUsersRepository implements UsersRepository {
  async getUsers(params: UsersListRequest): Promise<UsersListResponse> {
    const response = await usersApiClient.list({
      // @ts-ignore
      full: true,
      page: params.page,
      page_size: params.pageSize,
      ordering: params.ordering,
      search: params.search,
      country: params.country,
      age_from: params.ageFrom ? String(params.ageFrom) : undefined,
      age_to: params.ageTo ? String(params.ageTo) : undefined,
    });

    return mapApiUsersListToDomain(response);
  }

  async getCountries(): Promise<string[]> {
    const response = await usersApiClient.countries();

    return mapCountriesToCodes(response);
  }

  async getChartStatistics(): Promise<UsersChartStatistics> {
    return usersApiClient.chartStatistics();
  }

  async getUser(username: string): Promise<UserDetails> {
    const response = await usersApiClient.details(username);

    return mapApiUserDetailToDomain(response);
  }

  async getUserRatings(username: string): Promise<UserRatings> {
    const response = await usersApiClient.ratings(username);

    return mapApiUserRatingsToDomain(response);
  }

  async getUserInfo(username: string): Promise<UserInfo> {
    const [generalInfo, info] = await Promise.all([
      usersApiClient.generalInfo(username),
      usersApiClient.info(username),
    ]);

    return {
      ...mapApiUserInfoToDomain(generalInfo ?? {}),
      ...mapApiUserInfoToDomain(info ?? {}),
    };
  }

  async getUserSocial(username: string): Promise<UserSocial> {
    const response = await usersApiClient.social(username);

    return mapApiUserSocialToDomain(response ?? {});
  }

  async getUserSkills(username: string): Promise<UserSkillSet> {
    const response = await usersApiClient.skills(username);

    return mapApiUserSkillsToDomain(response ?? {});
  }

  async getUserTechnologies(username: string): Promise<UserTechnology[]> {
    const response = await usersApiClient.technologies(username);

    return (response ?? []).map(mapApiUserTechnologyToDomain);
  }

  async getUserEducations(username: string): Promise<UserEducation[]> {
    const response = await usersApiClient.educations(username);

    return (response ?? []).map(mapApiUserEducationToDomain);
  }

  async getUserWorkExperiences(username: string): Promise<UserWorkExperience[]> {
    const response = await usersApiClient.workExperiences(username);

    return (response ?? []).map(mapApiUserWorkExperienceToDomain);
  }

  async getUserAchievements(username: string): Promise<UserAchievement[]> {
    const response = await usersApiClient.achievements(username);

    return (response ?? []).map(mapApiUserAchievementToDomain);
  }

  async getUserFollowers(
    username: string,
    params?: { page?: number; pageSize?: number },
  ): Promise<UsersListResponse> {
    const response = (await usersApiClient.followers(username, params)) as ApiUsersListResult;

    return mapApiUsersListToDomain(response);
  }
}

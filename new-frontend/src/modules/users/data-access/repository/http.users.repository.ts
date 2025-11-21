import { usersApiClient } from '../api/users.client';
import {
  mapApiUserDetailToDomain,
  mapApiUserAchievementsToDomain,
  mapApiUserCompetitionPrizesToDomain,
  mapApiUserEducationsToDomain,
  mapApiUserInfoToDomain,
  mapApiUserRatingsToDomain,
  mapApiUsersListToDomain,
  mapApiUserSkillsToDomain,
  mapApiUserSocialToDomain,
  mapApiUserTechnologiesToDomain,
  mapApiUserWorkExperiencesToDomain,
  mapCountriesToCodes,
} from '../mappers/user.mapper';
import { UsersRepository } from '../../domain/ports/users.repository';
import {
  UserDetails,
  UserAchievement,
  UserCompetitionPrize,
  UserEducation,
  UserInfo,
  UserRatings,
  UserSkills,
  UserSocial,
  UsersChartStatistics,
  UsersListRequest,
  UsersListResponse,
  UserTechnology,
  UserWorkExperience,
} from '../../domain/entities/user.entity';

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
    const response = await usersApiClient.info(username);

    return mapApiUserInfoToDomain(response as any);
  }

  async getUserSocial(username: string): Promise<UserSocial> {
    const response = await usersApiClient.social(username);

    return mapApiUserSocialToDomain(response as any);
  }

  async getUserSkills(username: string): Promise<UserSkills> {
    const response = await usersApiClient.skills(username);

    return mapApiUserSkillsToDomain(response as any);
  }

  async getUserTechnologies(username: string): Promise<UserTechnology[]> {
    const response = await usersApiClient.technologies(username);

    return mapApiUserTechnologiesToDomain((response as any)?.data ?? (response as any));
  }

  async getUserEducations(username: string): Promise<UserEducation[]> {
    const response = await usersApiClient.educations(username);

    return mapApiUserEducationsToDomain((response as any)?.data ?? (response as any));
  }

  async getUserWorkExperiences(username: string): Promise<UserWorkExperience[]> {
    const response = await usersApiClient.workExperiences(username);

    return mapApiUserWorkExperiencesToDomain((response as any)?.data ?? (response as any));
  }

  async getUserAchievements(username: string): Promise<UserAchievement[]> {
    const response = await usersApiClient.achievements(username);

    return mapApiUserAchievementsToDomain((response as any)?.data ?? (response as any));
  }

  async getUserCompetitionPrizes(username: string): Promise<UserCompetitionPrize[]> {
    const response = await usersApiClient.competitionPrizes(username);

    return mapApiUserCompetitionPrizesToDomain((response as any)?.data ?? (response as any));
  }
}

import {
  UserDetails,
  UserRatings,
  UsersChartStatistics,
  UserAchievement,
  UserEducation,
  UserInfo,
  UserSkillSet,
  UserSocial,
  UserTechnology,
  UserWorkExperience,
  UsersListRequest,
  UsersListResponse,
} from '../entities/user.entity';

export interface UsersRepository {
  getUsers: (params: UsersListRequest) => Promise<UsersListResponse>;
  getCountries: () => Promise<string[]>;
  getChartStatistics: () => Promise<UsersChartStatistics>;
  getUser: (username: string) => Promise<UserDetails>;
  getUserRatings: (username: string) => Promise<UserRatings>;
  getUserInfo: (username: string) => Promise<UserInfo>;
  getUserSocial: (username: string) => Promise<UserSocial>;
  getUserSkills: (username: string) => Promise<UserSkillSet>;
  getUserTechnologies: (username: string) => Promise<UserTechnology[]>;
  getUserEducations: (username: string) => Promise<UserEducation[]>;
  getUserWorkExperiences: (username: string) => Promise<UserWorkExperience[]>;
  getUserAchievements: (username: string) => Promise<UserAchievement[]>;
  getUserFollowers: (
    username: string,
    params?: { page?: number; pageSize?: number },
  ) => Promise<UsersListResponse>;
}

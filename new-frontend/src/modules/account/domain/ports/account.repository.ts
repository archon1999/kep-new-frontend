import {
  Team,
  UserEducation,
  UserGeneralInfo,
  UserInfo,
  UserSkills,
  UserSocial,
  UserTechnology,
  UserWorkExperience,
} from '../entities/account-settings.entity.ts';

export interface AccountRepository {
  getGeneralInfo(username: string): Promise<UserGeneralInfo>;
  updateGeneralInfo(username: string, payload: UserGeneralInfo): Promise<UserGeneralInfo>;
  getInformation(username: string): Promise<UserInfo>;
  updateInformation(username: string, payload: UserInfo): Promise<UserInfo>;
  getSocial(username: string): Promise<UserSocial>;
  updateSocial(username: string, payload: UserSocial): Promise<UserSocial>;
  getSkills(username: string): Promise<UserSkills>;
  updateSkills(username: string, payload: UserSkills): Promise<UserSkills>;
  getTechnologies(username: string): Promise<UserTechnology[]>;
  updateTechnologies(username: string, payload: UserTechnology[]): Promise<UserTechnology[]>;
  getEducations(username: string): Promise<UserEducation[]>;
  updateEducations(username: string, payload: UserEducation[]): Promise<UserEducation[]>;
  getWorkExperiences(username: string): Promise<UserWorkExperience[]>;
  updateWorkExperiences(username: string, payload: UserWorkExperience[]): Promise<UserWorkExperience[]>;
  changePassword(username: string, oldPassword: string, newPassword: string): Promise<void>;
  listTeams(): Promise<Team[]>;
  createTeam(name: string): Promise<Team>;
  joinTeam(code: string): Promise<Team>;
  refreshTeamCode(code: string): Promise<Team>;
}

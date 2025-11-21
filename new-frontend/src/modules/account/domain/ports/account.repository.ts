import type {
  ChangePasswordPayload,
  UserEducation,
  UserGeneralInfo,
  UserInfo,
  UserSkills,
  UserSocial,
  UserTechnology,
  UserWorkExperience,
} from '../entities/account.entity';
import type { Team } from 'shared/api/orval/generated/endpoints/index.schemas';

export interface AccountRepository {
  getGeneralInfo(username: string): Promise<UserGeneralInfo>;
  updateGeneralInfo(username: string, payload: UserGeneralInfo): Promise<UserGeneralInfo>;
  getInfo(username: string): Promise<UserInfo>;
  updateInfo(username: string, payload: UserInfo): Promise<UserInfo>;
  getSkills(username: string): Promise<UserSkills>;
  updateSkills(username: string, payload: UserSkills): Promise<UserSkills>;
  getSocial(username: string): Promise<UserSocial>;
  updateSocial(username: string, payload: UserSocial): Promise<UserSocial>;
  getTechnologies(username: string): Promise<UserTechnology[]>;
  updateTechnologies(username: string, payload: UserTechnology[]): Promise<UserTechnology[]>;
  getEducations(username: string): Promise<UserEducation[]>;
  updateEducations(username: string, payload: UserEducation[]): Promise<UserEducation[]>;
  getWorkExperiences(username: string): Promise<UserWorkExperience[]>;
  updateWorkExperiences(username: string, payload: UserWorkExperience[]): Promise<UserWorkExperience[]>;
  changePassword(username: string, payload: ChangePasswordPayload): Promise<void>;
  getTeams(): Promise<Team[]>;
  createTeam(name: string): Promise<Team>;
  joinTeam(code: string): Promise<Team>;
  refreshTeamCode(code: string): Promise<Team>;
}

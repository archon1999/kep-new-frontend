import {
  ChangePasswordPayload,
  Education,
  GeneralInfo,
  ProfileInfo,
  Skills,
  SocialLinks,
  Team,
  Technology,
  WorkExperience,
} from '../entities/account.entity';

export interface AccountRepository {
  getGeneralInfo(username: string): Promise<GeneralInfo>;
  updateGeneralInfo(username: string, payload: GeneralInfo): Promise<GeneralInfo>;

  getProfileInfo(username: string): Promise<ProfileInfo>;
  updateProfileInfo(username: string, payload: ProfileInfo): Promise<ProfileInfo>;

  getSocialLinks(username: string): Promise<SocialLinks>;
  updateSocialLinks(username: string, payload: SocialLinks): Promise<SocialLinks>;

  getSkills(username: string): Promise<Skills>;
  updateSkills(username: string, payload: Skills): Promise<Skills>;

  getTechnologies(username: string): Promise<Technology[]>;
  updateTechnologies(username: string, payload: Technology[]): Promise<Technology[]>;

  getEducations(username: string): Promise<Education[]>;
  updateEducations(username: string, payload: Education[]): Promise<Education[]>;

  getWorkExperiences(username: string): Promise<WorkExperience[]>;
  updateWorkExperiences(username: string, payload: WorkExperience[]): Promise<WorkExperience[]>;

  changePassword(username: string, payload: ChangePasswordPayload): Promise<void>;

  getTeams(): Promise<Team[]>;
  createTeam(name: string): Promise<Team>;
  joinTeam(code: string): Promise<Team>;
  refreshTeamCode(code: string): Promise<Team>;
}

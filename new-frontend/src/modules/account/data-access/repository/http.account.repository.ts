import { accountApiClient } from '../api/account.client.ts';
import { AccountRepository } from '../../domain/ports/account.repository.ts';
import {
  Team,
  UserEducation,
  UserGeneralInfo,
  UserInfo,
  UserSkills,
  UserSocial,
  UserTechnology,
  UserWorkExperience,
} from '../../domain/entities/account-settings.entity.ts';

export class HttpAccountRepository implements AccountRepository {
  async getGeneralInfo(username: string): Promise<UserGeneralInfo> {
    return accountApiClient.generalInfo(username);
  }

  async updateGeneralInfo(username: string, payload: UserGeneralInfo): Promise<UserGeneralInfo> {
    return accountApiClient.updateGeneralInfo(username, payload as any);
  }

  async getInformation(username: string): Promise<UserInfo> {
    return accountApiClient.information(username);
  }

  async updateInformation(username: string, payload: UserInfo): Promise<UserInfo> {
    return accountApiClient.updateInformation(username, payload as any);
  }

  async getSocial(username: string): Promise<UserSocial> {
    return accountApiClient.social(username);
  }

  async updateSocial(username: string, payload: UserSocial): Promise<UserSocial> {
    return accountApiClient.updateSocial(username, payload as any);
  }

  async getSkills(username: string): Promise<UserSkills> {
    return accountApiClient.skills(username);
  }

  async updateSkills(username: string, payload: UserSkills): Promise<UserSkills> {
    return accountApiClient.updateSkills(username, payload as any);
  }

  async getTechnologies(username: string): Promise<UserTechnology[]> {
    return accountApiClient.technologies(username) as any;
  }

  async updateTechnologies(username: string, payload: UserTechnology[]): Promise<UserTechnology[]> {
    return accountApiClient.updateTechnologies(username, payload as any);
  }

  async getEducations(username: string): Promise<UserEducation[]> {
    return accountApiClient.educations(username) as any;
  }

  async updateEducations(username: string, payload: UserEducation[]): Promise<UserEducation[]> {
    return accountApiClient.updateEducations(username, payload as any);
  }

  async getWorkExperiences(username: string): Promise<UserWorkExperience[]> {
    return accountApiClient.workExperiences(username) as any;
  }

  async updateWorkExperiences(username: string, payload: UserWorkExperience[]): Promise<UserWorkExperience[]> {
    return accountApiClient.updateWorkExperiences(username, payload as any);
  }

  async changePassword(username: string, oldPassword: string, newPassword: string): Promise<void> {
    await accountApiClient.changePassword(username, { oldPassword, newPassword } as any);
  }

  async listTeams(): Promise<Team[]> {
    return accountApiClient.teams() as any;
  }

  async createTeam(name: string): Promise<Team> {
    return accountApiClient.createTeam({ name } as any) as any;
  }

  async joinTeam(code: string): Promise<Team> {
    return accountApiClient.joinTeam(code, {} as any) as any;
  }

  async refreshTeamCode(code: string): Promise<Team> {
    return accountApiClient.refreshTeamCode(code, {} as any) as any;
  }
}

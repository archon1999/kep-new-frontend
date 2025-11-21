import { accountApiClient } from '../api/account.client';
import { AccountRepository } from '../../domain/ports/account.repository';
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
} from '../../domain/entities/account.entity';

export class HttpAccountRepository implements AccountRepository {
  async getGeneralInfo(username: string): Promise<GeneralInfo> {
    return accountApiClient.getGeneralInfo(username);
  }

  async updateGeneralInfo(username: string, payload: GeneralInfo): Promise<GeneralInfo> {
    return accountApiClient.updateGeneralInfo(username, payload);
  }

  async getProfileInfo(username: string): Promise<ProfileInfo> {
    return accountApiClient.getProfileInfo(username);
  }

  async updateProfileInfo(username: string, payload: ProfileInfo): Promise<ProfileInfo> {
    return accountApiClient.updateProfileInfo(username, payload);
  }

  async getSocialLinks(username: string): Promise<SocialLinks> {
    return accountApiClient.getSocial(username);
  }

  async updateSocialLinks(username: string, payload: SocialLinks): Promise<SocialLinks> {
    return accountApiClient.updateSocial(username, payload);
  }

  async getSkills(username: string): Promise<Skills> {
    return accountApiClient.getSkills(username);
  }

  async updateSkills(username: string, payload: Skills): Promise<Skills> {
    return accountApiClient.updateSkills(username, payload);
  }

  async getTechnologies(username: string): Promise<Technology[]> {
    return accountApiClient.getTechnologies(username);
  }

  async updateTechnologies(username: string, payload: Technology[]): Promise<Technology[]> {
    return accountApiClient.updateTechnologies(username, payload);
  }

  async getEducations(username: string): Promise<Education[]> {
    return accountApiClient.getEducations(username);
  }

  async updateEducations(username: string, payload: Education[]): Promise<Education[]> {
    return accountApiClient.updateEducations(username, payload);
  }

  async getWorkExperiences(username: string): Promise<WorkExperience[]> {
    return accountApiClient.getWorkExperiences(username);
  }

  async updateWorkExperiences(username: string, payload: WorkExperience[]): Promise<WorkExperience[]> {
    return accountApiClient.updateWorkExperiences(username, payload);
  }

  async changePassword(username: string, payload: ChangePasswordPayload): Promise<void> {
    await accountApiClient.changePassword(username, payload as unknown as Record<string, unknown>);
  }

  async getTeams(): Promise<Team[]> {
    return accountApiClient.getTeams();
  }

  async createTeam(name: string): Promise<Team> {
    return accountApiClient.createTeam(name);
  }

  async joinTeam(code: string): Promise<Team> {
    return accountApiClient.joinTeam(code);
  }

  async refreshTeamCode(code: string): Promise<Team> {
    return accountApiClient.refreshTeamCode(code);
  }
}

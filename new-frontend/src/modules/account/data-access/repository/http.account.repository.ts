import axiosInstance from 'shared/api/http/axiosInstance';
import type { AccountRepository } from '../../domain/ports/account.repository';
import type {
  ChangePasswordPayload,
  UserEducation,
  UserGeneralInfo,
  UserInfo,
  UserSkills,
  UserSocial,
  UserTechnology,
  UserWorkExperience,
} from '../../domain/entities/account.entity';
import type { Team } from 'shared/api/orval/generated/endpoints/index.schemas';

const withUsername = (username: string, path: string) => `/api/users/${username}${path}`;

export class HttpAccountRepository implements AccountRepository {
  async getGeneralInfo(username: string): Promise<UserGeneralInfo> {
    const response = await axiosInstance.get<UserGeneralInfo>(withUsername(username, '/general-info/'));
    return response.data;
  }

  async updateGeneralInfo(username: string, payload: UserGeneralInfo): Promise<UserGeneralInfo> {
    const response = await axiosInstance.post<UserGeneralInfo>(withUsername(username, '/general-info/'), payload);
    return response.data;
  }

  async getInfo(username: string): Promise<UserInfo> {
    const response = await axiosInstance.get<UserInfo>(withUsername(username, '/info/'));
    return response.data;
  }

  async updateInfo(username: string, payload: UserInfo): Promise<UserInfo> {
    const response = await axiosInstance.post<UserInfo>(withUsername(username, '/info/'), payload);
    return response.data;
  }

  async getSkills(username: string): Promise<UserSkills> {
    const response = await axiosInstance.get<UserSkills>(withUsername(username, '/skills/'));
    return response.data;
  }

  async updateSkills(username: string, payload: UserSkills): Promise<UserSkills> {
    const response = await axiosInstance.post<UserSkills>(withUsername(username, '/skills/'), payload);
    return response.data;
  }

  async getSocial(username: string): Promise<UserSocial> {
    const response = await axiosInstance.get<UserSocial>(withUsername(username, '/social/'));
    return response.data;
  }

  async updateSocial(username: string, payload: UserSocial): Promise<UserSocial> {
    const response = await axiosInstance.post<UserSocial>(withUsername(username, '/social/'), payload);
    return response.data;
  }

  async getTechnologies(username: string): Promise<UserTechnology[]> {
    const response = await axiosInstance.get<UserTechnology[]>(withUsername(username, '/technologies/'));
    return response.data;
  }

  async updateTechnologies(username: string, payload: UserTechnology[]): Promise<UserTechnology[]> {
    const response = await axiosInstance.post<UserTechnology[]>(withUsername(username, '/technologies/'), payload);
    return response.data;
  }

  async getEducations(username: string): Promise<UserEducation[]> {
    const response = await axiosInstance.get<UserEducation[]>(withUsername(username, '/educations/'));
    return response.data;
  }

  async updateEducations(username: string, payload: UserEducation[]): Promise<UserEducation[]> {
    const response = await axiosInstance.post<UserEducation[]>(withUsername(username, '/educations/'), payload);
    return response.data;
  }

  async getWorkExperiences(username: string): Promise<UserWorkExperience[]> {
    const response = await axiosInstance.get<UserWorkExperience[]>(withUsername(username, '/work-experiences/'));
    return response.data;
  }

  async updateWorkExperiences(username: string, payload: UserWorkExperience[]): Promise<UserWorkExperience[]> {
    const response = await axiosInstance.post<UserWorkExperience[]>(withUsername(username, '/work-experiences/'), payload);
    return response.data;
  }

  async changePassword(username: string, payload: ChangePasswordPayload): Promise<void> {
    await axiosInstance.post(withUsername(username, '/change-password/'), payload);
  }

  async getTeams(): Promise<Team[]> {
    const response = await axiosInstance.get<Team[]>('/api/user-teams/');
    return response.data;
  }

  async createTeam(name: string): Promise<Team> {
    const response = await axiosInstance.post<Team>('/api/user-teams/', { name });
    return response.data;
  }

  async joinTeam(code: string): Promise<Team> {
    const response = await axiosInstance.post<Team>(`/api/user-teams/${code}/join/`);
    return response.data;
  }

  async refreshTeamCode(code: string): Promise<Team> {
    const response = await axiosInstance.post<Team>(`/api/user-teams/${code}/refresh-code/`);
    return response.data;
  }
}

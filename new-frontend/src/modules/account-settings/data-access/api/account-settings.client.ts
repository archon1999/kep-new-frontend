import { apiClient } from 'shared/api';
import type {
  AccountEducation,
  AccountGeneralInfo,
  AccountProfileInfo,
  AccountSkills,
  AccountSocialLinks,
  AccountTechnology,
  AccountWorkExperience,
  ChangePasswordPayload,
} from '../../domain/entities/account-settings.entity';

export const accountSettingsApiClient = {
  getGeneralInfo: (username: string) => apiClient.apiUsersGeneralInfoRead(username) as Promise<AccountGeneralInfo>,
  updateGeneralInfo: (username: string, payload: AccountGeneralInfo) =>
    apiClient.apiUsersGeneralInfoCreate(username, payload as never) as Promise<AccountGeneralInfo>,

  getProfileInfo: (username: string) => apiClient.apiUsersInfoRead(username) as Promise<AccountProfileInfo>,
  updateProfileInfo: (username: string, payload: AccountProfileInfo) =>
    apiClient.apiUsersInfoCreate(username, payload as never) as Promise<AccountProfileInfo>,

  getSocial: (username: string) => apiClient.apiUsersSocialRead(username) as Promise<AccountSocialLinks>,
  updateSocial: (username: string, payload: AccountSocialLinks) =>
    apiClient.apiUsersSocialCreate(username, payload as never) as Promise<AccountSocialLinks>,

  getSkills: (username: string) => apiClient.apiUsersSkillsRead(username) as Promise<AccountSkills>,
  updateSkills: (username: string, payload: AccountSkills) =>
    apiClient.apiUsersSkillsCreate(username, payload as never) as Promise<AccountSkills>,

  getTechnologies: (username: string) => apiClient.apiUsersTechnologiesRead(username) as Promise<AccountTechnology[]>,
  updateTechnologies: (username: string, payload: AccountTechnology[]) =>
    apiClient.apiUsersTechnologiesCreate(username, payload as never) as Promise<AccountTechnology[]>,

  getEducations: (username: string) => apiClient.apiUsersEducationsRead(username) as Promise<AccountEducation[]>,
  updateEducations: (username: string, payload: AccountEducation[]) =>
    apiClient.apiUsersEducationsCreate(username, payload as never) as Promise<AccountEducation[]>,

  getWorkExperiences: (username: string) => apiClient.apiUsersWorkExperiencesRead(username) as Promise<AccountWorkExperience[]>,
  updateWorkExperiences: (username: string, payload: AccountWorkExperience[]) =>
    apiClient.apiUsersWorkExperiencesCreate(username, payload as never) as Promise<AccountWorkExperience[]>,

  changePassword: (username: string, payload: ChangePasswordPayload) =>
    apiClient.apiUsersChangePassword(username, payload as never).then(() => undefined),

  getTeams: () => apiClient.apiUserTeamsList(),
  createTeam: (name: string) => apiClient.apiUserTeamsCreate({ name } as never),
  joinTeam: (code: string) => apiClient.apiUserTeamsJoin(code),
  refreshTeamCode: (code: string) => apiClient.apiUserTeamsRefreshCode(code),
};

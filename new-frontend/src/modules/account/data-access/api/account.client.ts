import { apiClient } from 'shared/api';
import {
  ApiUserTeamsListResult,
  ApiUsersEducationsCreateResult,
  ApiUsersEducationsReadResult,
  ApiUsersGeneralInfoCreateResult,
  ApiUsersGeneralInfoReadResult,
  ApiUsersInfoCreateResult,
  ApiUsersInfoReadResult,
  ApiUsersSkillsCreateResult,
  ApiUsersSkillsReadResult,
  ApiUsersSocialCreateResult,
  ApiUsersSocialReadResult,
  ApiUsersTechnologiesCreateResult,
  ApiUsersTechnologiesReadResult,
  ApiUsersWorkExperiencesCreateResult,
  ApiUsersWorkExperiencesReadResult,
  UserListBody,
} from 'shared/api/orval/generated/endpoints';
import { BodyType } from 'shared/api/orval/generated/core/type';

export const accountApiClient = {
  getGeneralInfo: (username: string) => apiClient.apiUsersGeneralInfoRead(username) as Promise<ApiUsersGeneralInfoReadResult>,
  updateGeneralInfo: (username: string, body: BodyType<UserListBody>) =>
    apiClient.apiUsersGeneralInfoCreate(username, body) as Promise<ApiUsersGeneralInfoCreateResult>,

  getProfileInfo: (username: string) => apiClient.apiUsersInfoRead(username) as Promise<ApiUsersInfoReadResult>,
  updateProfileInfo: (username: string, body: BodyType<UserListBody>) =>
    apiClient.apiUsersInfoCreate(username, body) as Promise<ApiUsersInfoCreateResult>,

  getSocial: (username: string) => apiClient.apiUsersSocialRead(username) as Promise<ApiUsersSocialReadResult>,
  updateSocial: (username: string, body: BodyType<UserListBody>) =>
    apiClient.apiUsersSocialCreate(username, body) as Promise<ApiUsersSocialCreateResult>,

  getSkills: (username: string) => apiClient.apiUsersSkillsRead(username) as Promise<ApiUsersSkillsReadResult>,
  updateSkills: (username: string, body: BodyType<UserListBody>) =>
    apiClient.apiUsersSkillsCreate(username, body) as Promise<ApiUsersSkillsCreateResult>,

  getTechnologies: (username: string) =>
    apiClient.apiUsersTechnologiesRead(username) as Promise<ApiUsersTechnologiesReadResult>,
  updateTechnologies: (username: string, body: BodyType<UserListBody>) =>
    apiClient.apiUsersTechnologiesCreate(username, body) as Promise<ApiUsersTechnologiesCreateResult>,

  getEducations: (username: string) => apiClient.apiUsersEducationsRead(username) as Promise<ApiUsersEducationsReadResult>,
  updateEducations: (username: string, body: BodyType<UserListBody>) =>
    apiClient.apiUsersEducationsCreate(username, body) as Promise<ApiUsersEducationsCreateResult>,

  getWorkExperiences: (username: string) =>
    apiClient.apiUsersWorkExperiencesRead(username) as Promise<ApiUsersWorkExperiencesReadResult>,
  updateWorkExperiences: (username: string, body: BodyType<UserListBody>) =>
    apiClient.apiUsersWorkExperiencesCreate(username, body) as Promise<ApiUsersWorkExperiencesCreateResult>,

  changePassword: (username: string, body: BodyType<UserListBody>) =>
    apiClient.apiUsersChangePassword(username, body) as Promise<unknown>,

  getTeams: () => apiClient.apiUserTeamsList() as Promise<ApiUserTeamsListResult>,
  createTeam: (name: string) => apiClient.apiUserTeamsCreate({ name }),
  joinTeam: (code: string) => apiClient.apiUserTeamsJoin(code, {}),
  refreshTeamCode: (code: string) => apiClient.apiUserTeamsRefreshCode(code, {}),
};

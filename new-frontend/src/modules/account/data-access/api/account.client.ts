import { apiClient } from 'shared/api';
import {
  ApiUserTeamsCreateResult,
  ApiUserTeamsJoinResult,
  ApiUserTeamsListResult,
  ApiUserTeamsRefreshCodeResult,
  ApiUsersChangePasswordResult,
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
} from 'shared/api/orval/generated/endpoints';
import { UserListBody } from 'shared/api/orval/generated/schemas';

export const accountApiClient = {
  generalInfo: (username: string) => apiClient.apiUsersGeneralInfoRead(username) as Promise<ApiUsersGeneralInfoReadResult>,
  updateGeneralInfo: (username: string, payload: UserListBody) =>
    apiClient.apiUsersGeneralInfoCreate(username, payload) as Promise<ApiUsersGeneralInfoCreateResult>,
  information: (username: string) => apiClient.apiUsersInfoRead(username) as Promise<ApiUsersInfoReadResult>,
  updateInformation: (username: string, payload: UserListBody) =>
    apiClient.apiUsersInfoCreate(username, payload) as Promise<ApiUsersInfoCreateResult>,
  social: (username: string) => apiClient.apiUsersSocialRead(username) as Promise<ApiUsersSocialReadResult>,
  updateSocial: (username: string, payload: UserListBody) =>
    apiClient.apiUsersSocialCreate(username, payload) as Promise<ApiUsersSocialCreateResult>,
  skills: (username: string) => apiClient.apiUsersSkillsRead(username) as Promise<ApiUsersSkillsReadResult>,
  updateSkills: (username: string, payload: UserListBody) =>
    apiClient.apiUsersSkillsCreate(username, payload) as Promise<ApiUsersSkillsCreateResult>,
  technologies: (username: string) => apiClient.apiUsersTechnologiesRead(username) as Promise<ApiUsersTechnologiesReadResult>,
  updateTechnologies: (username: string, payload: UserListBody) =>
    apiClient.apiUsersTechnologiesCreate(username, payload) as Promise<ApiUsersTechnologiesCreateResult>,
  educations: (username: string) => apiClient.apiUsersEducationsRead(username) as Promise<ApiUsersEducationsReadResult>,
  updateEducations: (username: string, payload: UserListBody) =>
    apiClient.apiUsersEducationsCreate(username, payload) as Promise<ApiUsersEducationsCreateResult>,
  workExperiences: (username: string) =>
    apiClient.apiUsersWorkExperiencesRead(username) as Promise<ApiUsersWorkExperiencesReadResult>,
  updateWorkExperiences: (username: string, payload: UserListBody) =>
    apiClient.apiUsersWorkExperiencesCreate(username, payload) as Promise<ApiUsersWorkExperiencesCreateResult>,
  changePassword: (username: string, payload: UserListBody) =>
    apiClient.apiUsersChangePassword(username, payload) as Promise<ApiUsersChangePasswordResult>,
  teams: () => apiClient.apiUserTeamsList() as Promise<ApiUserTeamsListResult>,
  createTeam: (payload: UserListBody) => apiClient.apiUserTeamsCreate(payload) as Promise<ApiUserTeamsCreateResult>,
  joinTeam: (code: string, payload: UserListBody) =>
    apiClient.apiUserTeamsJoin(code, payload) as Promise<ApiUserTeamsJoinResult>,
  refreshTeamCode: (code: string, payload: UserListBody) =>
    apiClient.apiUserTeamsRefreshCode(code, payload) as Promise<ApiUserTeamsRefreshCodeResult>,
};

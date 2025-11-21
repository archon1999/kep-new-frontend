import { createKeyFactory } from 'shared/api';
import useSWR from 'swr';
import useSWRMutation from 'swr/mutation';
import { useMemo } from 'react';
import { HttpAccountRepository } from '../data-access/repository/http.account.repository';
import type {
  ChangePasswordPayload,
  UserEducation,
  UserGeneralInfo,
  UserInfo,
  UserSkills,
  UserSocial,
  UserTechnology,
  UserWorkExperience,
} from '../domain/entities/account.entity';
import type { AccountRepository } from '../domain/ports/account.repository';
import type { Team } from 'shared/api/orval/generated/endpoints/index.schemas';

const accountKeys = createKeyFactory('account');

const useRepository = (): AccountRepository => useMemo(() => new HttpAccountRepository(), []);

const useAccountSWR = <T>(
  key: readonly unknown[] | null,
  fetcher: () => Promise<T>,
  shouldRevalidate = true,
) => useSWR<T>(key, fetcher, { suspense: false, revalidateOnFocus: shouldRevalidate });

export const useGeneralInfo = (username?: string | null) => {
  const repository = useRepository();
  return useAccountSWR<UserGeneralInfo | null>(
    username ? accountKeys.detail('general-info', username) : null,
    () => repository.getGeneralInfo(username as string),
  );
};

export const useUpdateGeneralInfo = (username?: string | null) => {
  const repository = useRepository();
  return useSWRMutation<UserGeneralInfo, Error, readonly unknown[], UserGeneralInfo>(
    username ? accountKeys.detail('general-info', username) : null,
    (_key, { arg }) => repository.updateGeneralInfo(username as string, arg),
  );
};

export const useUserInfo = (username?: string | null) => {
  const repository = useRepository();
  return useAccountSWR<UserInfo | null>(
    username ? accountKeys.detail('info', username) : null,
    () => repository.getInfo(username as string),
  );
};

export const useUpdateUserInfo = (username?: string | null) => {
  const repository = useRepository();
  return useSWRMutation<UserInfo, Error, readonly unknown[], UserInfo>(
    username ? accountKeys.detail('info', username) : null,
    (_key, { arg }) => repository.updateInfo(username as string, arg),
  );
};

export const useUserSkills = (username?: string | null) => {
  const repository = useRepository();
  return useAccountSWR<UserSkills | null>(
    username ? accountKeys.detail('skills', username) : null,
    () => repository.getSkills(username as string),
  );
};

export const useUpdateUserSkills = (username?: string | null) => {
  const repository = useRepository();
  return useSWRMutation<UserSkills, Error, readonly unknown[], UserSkills>(
    username ? accountKeys.detail('skills', username) : null,
    (_key, { arg }) => repository.updateSkills(username as string, arg),
  );
};

export const useUserSocial = (username?: string | null) => {
  const repository = useRepository();
  return useAccountSWR<UserSocial | null>(
    username ? accountKeys.detail('social', username) : null,
    () => repository.getSocial(username as string),
  );
};

export const useUpdateUserSocial = (username?: string | null) => {
  const repository = useRepository();
  return useSWRMutation<UserSocial, Error, readonly unknown[], UserSocial>(
    username ? accountKeys.detail('social', username) : null,
    (_key, { arg }) => repository.updateSocial(username as string, arg),
  );
};

export const useUserTechnologies = (username?: string | null) => {
  const repository = useRepository();
  return useAccountSWR<UserTechnology[] | null>(
    username ? accountKeys.detail('technologies', username) : null,
    () => repository.getTechnologies(username as string),
  );
};

export const useUpdateUserTechnologies = (username?: string | null) => {
  const repository = useRepository();
  return useSWRMutation<UserTechnology[], Error, readonly unknown[], UserTechnology[]>(
    username ? accountKeys.detail('technologies', username) : null,
    (_key, { arg }) => repository.updateTechnologies(username as string, arg),
  );
};

export const useUserEducations = (username?: string | null) => {
  const repository = useRepository();
  return useAccountSWR<UserEducation[] | null>(
    username ? accountKeys.detail('educations', username) : null,
    () => repository.getEducations(username as string),
  );
};

export const useUpdateUserEducations = (username?: string | null) => {
  const repository = useRepository();
  return useSWRMutation<UserEducation[], Error, readonly unknown[], UserEducation[]>(
    username ? accountKeys.detail('educations', username) : null,
    (_key, { arg }) => repository.updateEducations(username as string, arg),
  );
};

export const useUserWorkExperiences = (username?: string | null) => {
  const repository = useRepository();
  return useAccountSWR<UserWorkExperience[] | null>(
    username ? accountKeys.detail('work-experiences', username) : null,
    () => repository.getWorkExperiences(username as string),
  );
};

export const useUpdateUserWorkExperiences = (username?: string | null) => {
  const repository = useRepository();
  return useSWRMutation<UserWorkExperience[], Error, readonly unknown[], UserWorkExperience[]>(
    username ? accountKeys.detail('work-experiences', username) : null,
    (_key, { arg }) => repository.updateWorkExperiences(username as string, arg),
  );
};

export const useTeams = () => {
  const repository = useRepository();
  return useAccountSWR<Team[]>(accountKeys.detail('teams'), () => repository.getTeams());
};

export const useCreateTeam = () => {
  const repository = useRepository();
  return useSWRMutation<Team, Error, readonly unknown[], string>(accountKeys.detail('teams'), (_key, { arg }) =>
    repository.createTeam(arg),
  );
};

export const useJoinTeam = () => {
  const repository = useRepository();
  return useSWRMutation<Team, Error, readonly unknown[], string>(accountKeys.detail('teams'), (_key, { arg }) =>
    repository.joinTeam(arg),
  );
};

export const useRefreshTeamCode = () => {
  const repository = useRepository();
  return useSWRMutation<Team, Error, readonly unknown[], string>(accountKeys.detail('teams'), (_key, { arg }) =>
    repository.refreshTeamCode(arg),
  );
};

export const useChangePassword = (username?: string | null) => {
  const repository = useRepository();
  return useSWRMutation<void, Error, readonly unknown[], ChangePasswordPayload>(
    username ? accountKeys.detail('password', username) : null,
    (_key, { arg }) => repository.changePassword(username as string, arg),
  );
};

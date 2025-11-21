import useSWRMutation from 'swr/mutation';
import { useAuth } from 'app/providers/AuthProvider';
import { HttpAccountRepository } from '../data-access/repository/http.account.repository';
import {
  ChangePasswordPayload,
  Education,
  GeneralInfo,
  ProfileInfo,
  Skills,
  SocialLinks,
  Technology,
  WorkExperience,
} from '../domain/entities/account.entity';
import { createKeyFactory } from 'shared/api';

const repository = new HttpAccountRepository();
const keys = createKeyFactory('account');

const useUsername = () => {
  const { currentUser } = useAuth();
  return currentUser?.username;
};

export const useUpdateGeneralInfo = () => {
  const username = useUsername();
  return useSWRMutation<GeneralInfo, Error, readonly unknown[], GeneralInfo>(
    username ? keys.detail(`general-${username}`) : null,
    async (_, { arg }) => repository.updateGeneralInfo(username!, arg),
  );
};

export const useUpdateProfileInfo = () => {
  const username = useUsername();
  return useSWRMutation<ProfileInfo, Error, readonly unknown[], ProfileInfo>(
    username ? keys.detail(`profile-${username}`) : null,
    async (_, { arg }) => repository.updateProfileInfo(username!, arg),
  );
};

export const useUpdateSocialLinks = () => {
  const username = useUsername();
  return useSWRMutation<SocialLinks, Error, readonly unknown[], SocialLinks>(
    username ? keys.detail(`social-${username}`) : null,
    async (_, { arg }) => repository.updateSocialLinks(username!, arg),
  );
};

export const useUpdateSkills = () => {
  const username = useUsername();
  return useSWRMutation<Skills, Error, readonly unknown[], Skills>(
    username ? keys.detail(`skills-${username}`) : null,
    async (_, { arg }) => repository.updateSkills(username!, arg),
  );
};

export const useUpdateTechnologies = () => {
  const username = useUsername();
  return useSWRMutation<Technology[], Error, readonly unknown[], Technology[]>(
    username ? keys.detail(`technologies-${username}`) : null,
    async (_, { arg }) => repository.updateTechnologies(username!, arg),
  );
};

export const useUpdateEducations = () => {
  const username = useUsername();
  return useSWRMutation<Education[], Error, readonly unknown[], Education[]>(
    username ? keys.detail(`educations-${username}`) : null,
    async (_, { arg }) => repository.updateEducations(username!, arg),
  );
};

export const useUpdateWorkExperiences = () => {
  const username = useUsername();
  return useSWRMutation<WorkExperience[], Error, readonly unknown[], WorkExperience[]>(
    username ? keys.detail(`work-${username}`) : null,
    async (_, { arg }) => repository.updateWorkExperiences(username!, arg),
  );
};

export const useChangePassword = () => {
  const username = useUsername();
  return useSWRMutation<void, Error, readonly unknown[], ChangePasswordPayload>(
    username ? keys.detail(`password-${username}`) : null,
    async (_, { arg }) => repository.changePassword(username!, arg),
  );
};

export const useCreateTeam = () =>
  useSWRMutation(keys.detail('create-team'), async (_: unknown, { arg }: { arg: { name: string } }) =>
    repository.createTeam(arg.name),
  );

export const useJoinTeam = () =>
  useSWRMutation(keys.detail('join-team'), async (_: unknown, { arg }: { arg: { code: string } }) =>
    repository.joinTeam(arg.code),
  );

export const useRefreshTeamCode = () =>
  useSWRMutation(keys.detail('refresh-team'), async (_: unknown, { arg }: { arg: { code: string } }) =>
    repository.refreshTeamCode(arg.code),
  );

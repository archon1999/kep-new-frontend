import useSWR from 'swr';
import { HttpAccountRepository } from '../data-access/repository/http.account.repository.ts';
import {
  Team,
  UserEducation,
  UserGeneralInfo,
  UserInfo,
  UserSkills,
  UserSocial,
  UserTechnology,
  UserWorkExperience,
} from '../domain/entities/account-settings.entity.ts';

const repository = new HttpAccountRepository();

export const useGeneralInfo = (username?: string) =>
  useSWR<UserGeneralInfo>(username ? ['account-general-info', username] : null, () =>
    repository.getGeneralInfo(username!),
  );

export const useInformation = (username?: string) =>
  useSWR<UserInfo>(username ? ['account-information', username] : null, () => repository.getInformation(username!));

export const useSocial = (username?: string) =>
  useSWR<UserSocial>(username ? ['account-social', username] : null, () => repository.getSocial(username!));

export const useSkills = (username?: string) =>
  useSWR<UserSkills>(username ? ['account-skills', username] : null, () => repository.getSkills(username!));

export const useTechnologies = (username?: string) =>
  useSWR<UserTechnology[]>(username ? ['account-technologies', username] : null, () =>
    repository.getTechnologies(username!),
  );

export const useEducations = (username?: string) =>
  useSWR<UserEducation[]>(username ? ['account-educations', username] : null, () =>
    repository.getEducations(username!),
  );

export const useWorkExperiences = (username?: string) =>
  useSWR<UserWorkExperience[]>(username ? ['account-work-experiences', username] : null, () =>
    repository.getWorkExperiences(username!),
  );

export const useTeams = () => useSWR<Team[]>(['account-teams'], () => repository.listTeams());

export const accountQueries = { repository };

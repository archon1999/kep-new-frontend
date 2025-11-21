import useSWR from 'swr';
import { useAuth } from 'app/providers/AuthProvider';
import { HttpAccountRepository } from '../data-access/repository/http.account.repository';
import {
  Education,
  GeneralInfo,
  ProfileInfo,
  Skills,
  SocialLinks,
  Team,
  Technology,
  WorkExperience,
} from '../domain/entities/account.entity';

const repository = new HttpAccountRepository();

const useUsername = () => {
  const { currentUser } = useAuth();
  return currentUser?.username;
};

export const useGeneralInfo = () => {
  const username = useUsername();
  return useSWR<GeneralInfo>(username ? ['general-info', username] : null, () =>
    repository.getGeneralInfo(username!),
  );
};

export const useProfileInfo = () => {
  const username = useUsername();
  return useSWR<ProfileInfo>(username ? ['profile-info', username] : null, () =>
    repository.getProfileInfo(username!),
  );
};

export const useSocialLinks = () => {
  const username = useUsername();
  return useSWR<SocialLinks>(username ? ['social-links', username] : null, () =>
    repository.getSocialLinks(username!),
  );
};

export const useSkills = () => {
  const username = useUsername();
  return useSWR<Skills>(username ? ['skills', username] : null, () => repository.getSkills(username!));
};

export const useTechnologies = () => {
  const username = useUsername();
  return useSWR<Technology[]>(username ? ['technologies', username] : null, () =>
    repository.getTechnologies(username!),
  );
};

export const useEducations = () => {
  const username = useUsername();
  return useSWR<Education[]>(username ? ['educations', username] : null, () =>
    repository.getEducations(username!),
  );
};

export const useWorkExperiences = () => {
  const username = useUsername();
  return useSWR<WorkExperience[]>(username ? ['work-experiences', username] : null, () =>
    repository.getWorkExperiences(username!),
  );
};

export const useTeams = () => useSWR<Team[]>(['teams'], () => repository.getTeams());

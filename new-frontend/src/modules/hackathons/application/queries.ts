import useSWR from 'swr';
import { HttpHackathonsRepository } from '../data-access/repository/http.hackathons.repository.ts';
import { Hackathon, HackathonProject, HackathonRegistrant, HackathonStanding } from '../domain/entities/hackathon.entity';
import { ProjectAttemptsPage } from 'modules/projects/domain/entities/project.entity';

const hackathonsRepository = new HttpHackathonsRepository();

export const useHackathonsList = () =>
  useSWR<Hackathon[]>(['hackathons-list'], () => hackathonsRepository.list(), { suspense: false });

export const useHackathon = (id?: string) =>
  useSWR<Hackathon>(id ? ['hackathon', id] : null, () => hackathonsRepository.getById(id!), { suspense: false });

export const useHackathonProjects = (id?: string) =>
  useSWR<HackathonProject[]>(id ? ['hackathon-projects', id] : null, () => hackathonsRepository.getProjects(id!), {
    suspense: false,
  });

export const useHackathonProject = (id?: string, symbol?: string) =>
  useSWR<HackathonProject | null>(
    id && symbol ? ['hackathon-project', id, symbol] : null,
    () => hackathonsRepository.getProject(id!, symbol!),
    { suspense: false },
  );

export const useHackathonStandings = (id?: string) =>
  useSWR<HackathonStanding[]>(id ? ['hackathon-standings', id] : null, () => hackathonsRepository.getStandings(id!), {
    suspense: false,
  });

export const useHackathonRegistrants = (id?: string) =>
  useSWR<HackathonRegistrant[]>(id ? ['hackathon-registrants', id] : null, () => hackathonsRepository.getRegistrants(id!), {
    suspense: false,
  });

export const useHackathonAttempts = (id?: string, params?: { page?: number; username?: string }) =>
  useSWR<ProjectAttemptsPage>(
    id ? ['hackathon-attempts', id, params?.page, params?.username] : null,
    () => hackathonsRepository.getAttempts(id!, params),
    {
      suspense: false,
      refreshInterval: 5000,
    },
  );

export const hackathonsQueries = { hackathonsRepository };

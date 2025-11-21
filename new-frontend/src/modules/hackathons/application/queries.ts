import useSWR from 'swr';
import { HttpHackathonsRepository } from '../data-access/repository/http.hackathons.repository';
import { Hackathon } from '../domain/entities/hackathon.entity';

const repository = new HttpHackathonsRepository();

export const useHackathonsList = () =>
  useSWR<{ data: Hackathon[]; total: number }>(['hackathons-list'], () => repository.list(), {
    suspense: false,
  });

export const useHackathonDetails = (id?: string) =>
  useSWR<Hackathon>(id ? ['hackathon-detail', id] : null, () => repository.getById(id!), {
    suspense: false,
  });

export const hackathonsQueries = { repository };

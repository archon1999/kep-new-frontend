import useSWR from 'swr';
import { ApiHackathonsListParams } from 'shared/api/orval/generated/endpoints/index.schemas';
import { HttpHackathonsRepository } from '../data-access/repository/http.hackathons.repository';
import { Hackathon } from '../domain/entities/hackathon.entity';
import { PageResult } from '../domain/ports/hackathons.repository';

const hackathonsRepository = new HttpHackathonsRepository();

export const useHackathonsList = (params?: ApiHackathonsListParams) =>
  useSWR<PageResult<Hackathon>>(['hackathons-list', params?.page, params?.pageSize], () => hackathonsRepository.list(params), {
    suspense: false,
  });

export const hackathonsQueries = {
  hackathonsRepository,
};

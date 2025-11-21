import useSWR from 'swr';
import { HttpTestingRepository } from '../data-access/repository/http.testing.repository';
import { TestsListRequest, TestsListResponse } from '../domain/entities/testing.entity';

const repository = new HttpTestingRepository();

export const useTestsList = (params: TestsListRequest) =>
  useSWR<TestsListResponse>(['tests-list', params], () => repository.getTests(params), {
    keepPreviousData: true,
    revalidateOnFocus: false,
  });

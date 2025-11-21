import useSWR from 'swr';
import { HttpTestingRepository } from '../data-access/repository/http.testing.repository';
import { PageResult, Test } from '../domain/entities/test.entity';
import { TestsListRequest } from '../domain/ports/testing.repository';

const repository = new HttpTestingRepository();

export const useTestsList = (params: TestsListRequest) =>
  useSWR<PageResult<Test>>(['tests-list', params], () => repository.getTests(params), {
    keepPreviousData: true,
    revalidateOnFocus: false,
  });

import useSWR from 'swr';
import { HttpTestsRepository } from '../data-access/repository/http.tests.repository.ts';
import { testsApiClient } from '../data-access/api/tests.client.ts';
import { TestDetail, TestResultItem, TestSummary } from '../domain/entities/test.entity.ts';
import { TestPass } from 'shared/api/orval/generated/endpoints/index.schemas';

const testsRepository = new HttpTestsRepository();

export const useTestsList = () =>
  useSWR<TestSummary[]>(['tests', 'list'], () => testsRepository.list(), {
    suspense: false,
  });

export const useTestDetail = (id?: string) =>
  useSWR<TestDetail>(id ? ['tests', id] : null, () => testsRepository.getById(id!), {
    suspense: false,
  });

export const useTestBestResults = (id?: string) =>
  useSWR<TestResultItem[]>(id ? ['tests', id, 'best-results'] : null, () => testsRepository.getBestResults(id!), {
    suspense: false,
  });

export const useTestLastResults = (id?: string) =>
  useSWR<TestResultItem[]>(id ? ['tests', id, 'last-results'] : null, () => testsRepository.getLastResults(id!), {
    suspense: false,
  });

export const useTestPass = (id?: string) =>
  useSWR<TestPass>(id ? ['tests', 'pass', id] : null, () => testsApiClient.getTestPass(id!), {
    suspense: false,
  });

export const testsQueries = {
  testsRepository,
};

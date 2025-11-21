import { testsApiClient } from '../api/tests.client.ts';
import { mapTestDetail, mapTestResult, mapTestSummary } from '../mappers/tests.mapper.ts';
import { TestDetail, TestResultItem, TestSummary } from '../../domain/entities/test.entity.ts';
import { TestsRepository } from '../../domain/ports/tests.repository.ts';

export class HttpTestsRepository implements TestsRepository {
  async list(): Promise<TestSummary[]> {
    const response = await testsApiClient.list({ pageSize: 100 });
    return (response.data ?? []).map(mapTestSummary);
  }

  async getById(id: string): Promise<TestDetail> {
    const test = await testsApiClient.getById(id);
    return mapTestDetail(test);
  }

  async getBestResults(id: string): Promise<TestResultItem[]> {
    const results = await testsApiClient.getBestResults(id);
    return (results ?? []).map(mapTestResult);
  }

  async getLastResults(id: string): Promise<TestResultItem[]> {
    const results = await testsApiClient.getLastResults(id);
    return (results ?? []).map(mapTestResult);
  }

  async start(id: string): Promise<{ testPassId?: string | number; [key: string]: any }> {
    const response = await testsApiClient.start(id);
    return response as { testPassId?: string | number; [key: string]: any };
  }
}

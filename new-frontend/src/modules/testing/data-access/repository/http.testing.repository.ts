import { PageResult, Test } from '../../domain/entities/test.entity';
import { TestingRepository, TestsListRequest } from '../../domain/ports/testing.repository';
import { testingApiClient } from '../api/testing.client';
import { mapApiPageResult, mapApiTestToDomain } from '../mappers/testing.mapper';

export class HttpTestingRepository implements TestingRepository {
  async getTests(params?: TestsListRequest): Promise<PageResult<Test>> {
    const response = await testingApiClient.list(params);

    return mapApiPageResult(response, mapApiTestToDomain);
  }
}

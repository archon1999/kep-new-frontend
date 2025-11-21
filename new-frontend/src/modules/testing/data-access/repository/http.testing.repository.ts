import { testingApiClient } from '../api/testing.client';
import { mapApiTestsListToDomain } from '../mappers/testing.mapper';
import { TestsListRequest, TestsListResponse } from '../../domain/entities/testing.entity';
import { TestingRepository } from '../../domain/ports/testing.repository';

export class HttpTestingRepository implements TestingRepository {
  async getTests(params: TestsListRequest): Promise<TestsListResponse> {
    const response = await testingApiClient.list({
      page: params.page,
      pageSize: params.pageSize,
    });

    return mapApiTestsListToDomain(response);
  }
}

import { TestsListRequest, TestsListResponse } from '../entities/testing.entity';

export interface TestingRepository {
  getTests(params: TestsListRequest): Promise<TestsListResponse>;
}

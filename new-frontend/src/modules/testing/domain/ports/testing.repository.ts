import { PageResult, Test } from '../entities/test.entity';

export interface TestsListRequest {
  page?: number;
  pageSize?: number;
}

export interface TestingRepository {
  getTests: (params?: TestsListRequest) => Promise<PageResult<Test>>;
}

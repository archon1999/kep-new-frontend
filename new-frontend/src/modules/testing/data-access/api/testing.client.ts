import axiosFetcher from 'shared/services/axios/axiosFetcher';
import { TestsListRequest } from '../../domain/ports/testing.repository';
import { ApiPageResult, ApiTest } from './testing.dto';

export const testingApiClient = {
  list: (params?: TestsListRequest) =>
    axiosFetcher([
      '/api/tests/',
      {
        params: {
          page: params?.page,
          page_size: params?.pageSize ?? 50,
        },
      },
    ]) as Promise<ApiPageResult<ApiTest>>,
};

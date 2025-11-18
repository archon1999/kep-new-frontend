import { apiEndpoints } from 'app/routes/paths';
import { DailyTasksResponse } from 'app/types/dailyTasks';
import axiosFetcher from 'shared/services/axios/axiosFetcher';
import useSWR, { SWRConfiguration } from 'swr';

export const useDailyTasks = (config?: SWRConfiguration<DailyTasksResponse>) => {
  return useSWR<DailyTasksResponse>(apiEndpoints.dailyTasks, axiosFetcher, {
    revalidateOnFocus: false,
    shouldRetryOnError: false,
    ...config,
  });
};

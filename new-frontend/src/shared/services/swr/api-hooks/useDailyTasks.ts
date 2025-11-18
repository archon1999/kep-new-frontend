import { apiEndpoints } from 'app/routes/paths';
import { DailyTasksResponse } from 'app/types/dailyTasks';
import useSWR, { SWRConfiguration } from 'swr';
import axiosFetcher from '../../axios/axiosFetcher';

export const useDailyTasks = (
  shouldFetch = true,
  config?: SWRConfiguration<DailyTasksResponse | null>,
) => {
  return useSWR<DailyTasksResponse | null>(
    shouldFetch ? [apiEndpoints.dailyTasks, {}] : null,
    axiosFetcher,
    {
      revalidateOnFocus: true,
      ...config,
    },
  );
};

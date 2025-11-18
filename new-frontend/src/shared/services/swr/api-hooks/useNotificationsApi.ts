import useSWR from 'swr';

import axiosFetcher from 'shared/services/axios/axiosFetcher';
import {
  ApiNotificationsAllListResult,
  ApiNotificationsListResult,
} from 'shared/api/orval/generated/endpoints';

export const NOTIFICATION_PAGE_SIZE = 4;

export const useNavbarNotifications = (page: number, showAll: boolean) => {
  const endpoint = showAll ? '/api/notifications-all/' : '/api/notifications/';

  return useSWR<ApiNotificationsAllListResult | ApiNotificationsListResult>(
    [endpoint, { params: { page, pageSize: NOTIFICATION_PAGE_SIZE } }],
    axiosFetcher,
    {
      revalidateOnFocus: false,
    },
  );
};

import { useCallback, useMemo } from 'react';
import useSWR from 'swr';
import useSWRMutation from 'swr/mutation';
import axiosFetcher from 'shared/services/axios/axiosFetcher';
import { ApiNotificationsList200, Notification as ApiNotification } from 'shared/api/orval/generated/endpoints';

export type NavbarNotification = ApiNotification & { id?: number; created?: string };

const NOTIFICATION_PAGE_SIZE = 4;

type NotificationsResponse = ApiNotificationsList200;

export const useNotificationsApi = (page: number, includeRead: boolean) => {
  const endpoint = includeRead ? '/api/notifications-all/' : '/api/notifications/';

  const query = useSWR<NotificationsResponse>([
    endpoint,
    {
      params: {
        page,
        pageSize: NOTIFICATION_PAGE_SIZE,
      },
    },
  ]);

  const readMutation = useSWRMutation('notification-read', (_, { arg }: { arg: number }) =>
    axiosFetcher([`/api/notifications/${arg}/read/`, { method: 'post' }]),
  );

  const readAllMutation = useSWRMutation('notification-read-all', () =>
    axiosFetcher(['/api/notifications/read-all/', { method: 'post' }]),
  );

  const markAsRead = useCallback(
    async (notificationId: number) => {
      if (!notificationId || includeRead) return;

      await readMutation.trigger(notificationId, { throwOnError: false });

      query.mutate((current) => {
        if (!current) return current;

        const updatedData = current.data.filter((notification) => notification.id !== notificationId);
        const total = Math.max((current.total ?? updatedData.length) - 1, 0);

        return {
          ...current,
          data: updatedData,
          total,
          count: updatedData.length,
        };
      }, false);
    },
    [includeRead, query, readMutation],
  );

  const markAllAsRead = useCallback(async () => {
    await readAllMutation.trigger(null, { throwOnError: false });

    query.mutate((current) => {
      if (!current) return current;

      return {
        ...current,
        data: [],
        total: 0,
        count: 0,
      };
    }, false);
  }, [query, readAllMutation]);

  const notifications = useMemo<NavbarNotification[]>(
    () => (query.data?.data ?? []) as NavbarNotification[],
    [query.data],
  );

  return {
    ...query,
    notifications,
    markAsRead,
    markAllAsRead,
    isMarkingRead: readMutation.isMutating,
    isMarkingAllRead: readAllMutation.isMutating,
    pageSize: NOTIFICATION_PAGE_SIZE,
  };
};

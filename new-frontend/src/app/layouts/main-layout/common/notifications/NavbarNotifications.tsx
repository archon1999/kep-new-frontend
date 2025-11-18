import { useEffect, useMemo, useState } from 'react';
import {
  Box,
  Button,
  Chip,
  Divider,
  Popover,
  Stack,
  Typography,
  badgeClasses,
  paperClasses,
} from '@mui/material';
import { apiClient } from 'shared/api';
import type {
  ApiNotificationsAllList200,
  ApiNotificationsList200,
  Notification,
  NotificationBody,
} from 'shared/api/orval/generated/endpoints';
import IconifyIcon from 'shared/components/base/IconifyIcon';
import SimpleBar from 'shared/components/base/SimpleBar';
import OutlinedBadge from 'shared/components/styled/OutlinedBadge';
import useSWRInfinite from 'swr/infinite';
import NotificationItem from './NotificationItem';

const PAGE_SIZE = 4;

type NotificationPage = ApiNotificationsList200 | ApiNotificationsAllList200;

interface NavbarNotificationsProps {
  type?: 'default' | 'slim';
}

const NavbarNotifications = ({ type = 'default' }: NavbarNotificationsProps) => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [isAll, setIsAll] = useState(false);

  const {
    data,
    size,
    setSize,
    isLoading,
    isValidating,
    mutate,
  } = useSWRInfinite<NotificationPage>(
    (pageIndex) => ['navbar-notifications', isAll ? 'all' : 'unread', pageIndex + 1],
    ([, scope, page]) =>
      scope === 'all'
        ? apiClient.apiNotificationsAllList({ page, pageSize: PAGE_SIZE })
        : apiClient.apiNotificationsList({ page, pageSize: PAGE_SIZE }),
    {
      revalidateFirstPage: false,
      revalidateOnFocus: false,
    },
  );

  const notifications = useMemo(
    () => data?.flatMap((page) => page.data ?? []) ?? [],
    [data],
  );

  const lastPage = data?.[data.length - 1];
  const total = data?.[0]?.total ?? 0;
  const currentPage = lastPage?.page ?? 0;
  const pagesCount = lastPage?.pagesCount ?? 0;
  const hasMore = currentPage < pagesCount;
  const isEmpty = !isLoading && notifications.length === 0;
  const isLoadingMore = isValidating && size > (data?.length ?? 0);

  useEffect(() => {
    setSize(1);
    mutate();
  }, [isAll, mutate, setSize]);

  const handleOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
    mutate();
  };

  const handleClose = () => setAnchorEl(null);

  const handleLoadMore = () => {
    if (hasMore) {
      setSize((prev) => prev + 1);
    }
  };

  const handleMarkAsRead = async (id: number) => {
    if (isAll || id === undefined || id === null) return;

    await mutate(
      async (pages) => {
        await apiClient.apiNotificationsRead(String(id), {} as NotificationBody);

        return (
          pages?.map((page) => ({
            ...page,
            data: page.data?.filter((notification: Notification) => notification.id !== id) ?? [],
            total: Math.max((page.total ?? 0) - 1, 0),
          })) ?? []
        );
      },
      { revalidate: false },
    );
  };

  const handleMarkAllAsRead = async () => {
    if (isAll || !notifications.length) return;

    await mutate(
      async (pages) => {
        await apiClient.apiNotificationsReadAll({} as NotificationBody);
        return (
          pages?.map((page) => ({
            ...page,
            data: [],
            total: 0,
            count: 0,
          })) ?? []
        );
      },
      { revalidate: false },
    );
  };

  const open = Boolean(anchorEl);

  return (
    <>
      <Button
        color="neutral"
        variant={type === 'default' ? 'soft' : 'text'}
        shape="circle"
        size={type === 'slim' ? 'small' : 'medium'}
        onClick={handleOpen}
      >
        <OutlinedBadge
          variant="dot"
          color="error"
          invisible={isAll || total === 0}
          sx={{
            [`& .${badgeClasses.badge}`]: {
              height: 10,
              width: 10,
              top: -2,
              right: -2,
              borderRadius: '50%',
            },
          }}
        >
          <IconifyIcon
            icon={
              type === 'slim'
                ? 'material-symbols:notifications-outline-rounded'
                : 'material-symbols-light:notifications-outline-rounded'
            }
            sx={{ fontSize: type === 'slim' ? 18 : 22 }}
          />
        </OutlinedBadge>
      </Button>

      <Popover
        anchorEl={anchorEl}
        id="navbar-notifications"
        open={open}
        onClose={handleClose}
        transformOrigin={{
          horizontal: 'right',
          vertical: 'top',
        }}
        anchorOrigin={{
          horizontal: 'right',
          vertical: 'bottom',
        }}
        sx={{
          [`& .${paperClasses.root}`]: {
            width: 420,
            height: 640,
            display: 'flex',
            flexDirection: 'column',
          },
        }}
      >
        <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ p: 2, pb: 1 }}>
          <Stack spacing={0.5}>
            <Typography variant="subtitle1">Notifications</Typography>
            {!isAll && (
              <Chip size="small" color="primary" label={`${total} unread`} variant="soft" />
            )}
          </Stack>

          <Stack direction="row" spacing={1} alignItems="center">
            {!isAll && notifications.length > 0 && (
              <Button onClick={handleMarkAllAsRead} size="small" variant="text">
                Mark all read
              </Button>
            )}
            <Button onClick={() => setIsAll((prev) => !prev)} size="small" variant="outlined">
              {isAll ? 'Unread only' : 'All notifications'}
            </Button>
          </Stack>
        </Stack>

        <Divider />

        <Box sx={{ pt: 1, flex: 1, overflow: 'hidden' }}>
          <SimpleBar disableHorizontal>
            <Stack spacing={1.25} sx={{ p: 2 }}>
              {notifications.map((notification) => (
                <NotificationItem
                  key={notification.id}
                  notification={notification}
                  disableActions={isAll}
                  onRead={handleMarkAsRead}
                />
              ))}

              {isEmpty && (
                <Stack spacing={1} alignItems="center" sx={{ py: 6 }}>
                  <IconifyIcon icon="mdi:bell-off-outline" sx={{ fontSize: 40, color: 'text.secondary' }} />
                  <Typography variant="body2" color="text.secondary">
                    No notifications to show
                  </Typography>
                </Stack>
              )}
            </Stack>
          </SimpleBar>
        </Box>

        <Divider />

        <Stack
          direction="row"
          alignItems="center"
          justifyContent="space-between"
          sx={{ px: 2, py: 1 }}
          spacing={1}
        >
          <Typography variant="caption" color="text.secondary">
            {isAll ? 'Showing all notifications' : 'Showing unread notifications'}
          </Typography>
          <Button
            size="small"
            variant="text"
            onClick={handleLoadMore}
            disabled={!hasMore || isLoadingMore}
          >
            {hasMore ? 'Load more' : 'No more'}
          </Button>
        </Stack>
      </Popover>
    </>
  );
};

export default NavbarNotifications;

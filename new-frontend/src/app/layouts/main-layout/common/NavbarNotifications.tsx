import { useCallback, useEffect, useMemo, useState } from 'react';
import {
  Box,
  Button,
  Chip,
  CircularProgress,
  Divider,
  Link,
  Popover,
  Stack,
  Typography,
  badgeClasses,
  paperClasses,
} from '@mui/material';
import { useSettingsContext } from 'app/providers/SettingsProvider';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import { apiClient } from 'shared/api/http/apiClient';
import { Notification as ApiNotification } from 'shared/api/orval/generated/endpoints/index.schemas';
import IconifyIcon from 'shared/components/base/IconifyIcon';
import SimpleBar from 'shared/components/base/SimpleBar';
import OutlinedBadge from 'shared/components/styled/OutlinedBadge';

dayjs.extend(relativeTime);

interface NavbarNotificationsProps {
  type?: 'default' | 'slim';
}

interface NotificationState extends ApiNotification {
  isRead?: boolean;
  key: string;
}

const getNotificationBody = (notification: NotificationState): ApiNotification => ({
  id: notification.id,
  type: notification.type,
  content: notification.content,
  message: notification.message,
  created: notification.created,
  createdNaturaltime: notification.createdNaturaltime,
});

const NavbarNotifications = ({ type = 'default' }: NavbarNotificationsProps) => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [notifications, setNotifications] = useState<NotificationState[]>([]);
  const [pagination, setPagination] = useState({ page: 1, pagesCount: 1 });
  const [loading, setLoading] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [markingAll, setMarkingAll] = useState(false);

  const {
    config: { textDirection },
  } = useSettingsContext();

  const unreadCount = useMemo(
    () => notifications.filter((notification) => !notification.isRead).length,
    [notifications],
  );

  const open = Boolean(anchorEl);

  const mapNotifications = useCallback(
    (items: ApiNotification[], page: number) =>
      items.map((item, index) => ({
        ...item,
        isRead: false,
        key: `${item.id ?? `${item.type}-${page}-${index}`}`,
      })),
    [],
  );

  const fetchNotifications = useCallback(
    async (pageToLoad = 1, append = false) => {
      if (append) {
        setLoadingMore(true);
      } else {
        setLoading(true);
      }

      try {
        const response = await apiClient.apiNotificationsList({ page: pageToLoad, pageSize: 10 });
        const { data, pagesCount, page } = response.data;

        setPagination({ page, pagesCount });
        setNotifications((prev) => {
          const mapped = mapNotifications(data, page);
          return append ? [...prev, ...mapped] : mapped;
        });
      } finally {
        setLoading(false);
        setLoadingMore(false);
      }
    },
    [mapNotifications],
  );

  useEffect(() => {
    fetchNotifications();
  }, [fetchNotifications]);

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const markAsRead = async (notification: NotificationState) => {
    setNotifications((prev) =>
      prev.map((item) => (item.key === notification.key ? { ...item, isRead: true } : item)),
    );

    if (!notification.id) return;

    try {
      await apiClient.apiNotificationsRead(
        String(notification.id),
        getNotificationBody(notification),
      );
    } catch {
      // ignore API errors; local state is already updated
    }
  };

  const handleMarkAllRead = async () => {
    setNotifications((prev) => prev.map((notification) => ({ ...notification, isRead: true })));

    setMarkingAll(true);
    try {
      const sampleNotification = notifications[0];
      if (sampleNotification) {
        await apiClient.apiNotificationsReadAll(getNotificationBody(sampleNotification));
      }
    } catch {
      // ignore API errors; local state is already updated
    } finally {
      setMarkingAll(false);
    }
  };

  const handleLoadMore = () => {
    if (pagination.page < pagination.pagesCount && !loadingMore) {
      fetchNotifications(pagination.page + 1, true);
    }
  };

  return (
    <>
      <Button
        color="neutral"
        variant={type === 'default' ? 'soft' : 'text'}
        shape="circle"
        size={type === 'slim' ? 'small' : 'medium'}
        onClick={handleClick}
      >
        <OutlinedBadge
          variant="dot"
          color="error"
          invisible={!unreadCount}
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
          horizontal: textDirection === 'rtl' ? 'left' : 'right',
          vertical: 'top',
        }}
        anchorOrigin={{
          horizontal: textDirection === 'rtl' ? 'left' : 'right',
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
        <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ p: 2 }}>
          <Typography variant="subtitle1">Notifications</Typography>
          <Button
            size="small"
            variant="text"
            color="primary"
            disabled={!unreadCount || markingAll}
            onClick={handleMarkAllRead}
          >
            {markingAll ? <CircularProgress size={16} /> : 'Mark all as read'}
          </Button>
        </Stack>
        <Divider />
        <Box sx={{ flex: 1, overflow: 'hidden' }}>
          <SimpleBar disableHorizontal>
            {loading ? (
              <Stack alignItems="center" justifyContent="center" sx={{ py: 6 }}>
                <CircularProgress size={28} />
              </Stack>
            ) : notifications.length ? (
              <Stack spacing={0.5} sx={{ p: 2 }}>
                {notifications.map((notification) => {
                  const createdTime = notification.createdNaturaltime
                    ? notification.createdNaturaltime
                    : notification.created
                      ? dayjs(notification.created).fromNow()
                      : '';

                  return (
                    <Stack
                      key={notification.key}
                      direction="row"
                      spacing={1.5}
                      alignItems="flex-start"
                      sx={{
                        p: 1.25,
                        borderRadius: 2,
                        bgcolor: notification.isRead ? 'background.neutral' : 'action.hover',
                        border: '1px solid',
                        borderColor: 'divider',
                        cursor: 'pointer',
                      }}
                      onClick={() => markAsRead(notification)}
                    >
                      <OutlinedBadge
                        variant="dot"
                        color="error"
                        invisible={notification.isRead}
                        sx={{
                          [`& .${badgeClasses.badge}`]: {
                            top: 4,
                            right: 4,
                          },
                        }}
                      >
                        <Box
                          sx={{
                            width: 40,
                            height: 40,
                            borderRadius: '50%',
                            bgcolor: 'primary.lighter',
                            color: 'primary.main',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                          }}
                        >
                          <IconifyIcon icon="material-symbols:notifications-outline-rounded" />
                        </Box>
                      </OutlinedBadge>

                      <Stack spacing={0.5} flex={1} minWidth={0}>
                        <Typography
                          variant="body2"
                          sx={{ fontWeight: notification.isRead ? 500 : 600 }}
                        >
                          {notification.content || notification.message || 'New notification'}
                        </Typography>
                        <Stack direction="row" spacing={1} alignItems="center">
                          <Chip
                            label={notification.type}
                            size="small"
                            variant="outlined"
                            sx={{ textTransform: 'capitalize' }}
                          />
                          {createdTime && (
                            <Typography variant="caption" color="text.secondary">
                              {createdTime}
                            </Typography>
                          )}
                        </Stack>
                      </Stack>
                    </Stack>
                  );
                })}
              </Stack>
            ) : (
              <Stack alignItems="center" justifyContent="center" sx={{ py: 8 }}>
                <IconifyIcon
                  icon="mdi:bell-off-outline"
                  sx={{ fontSize: 32, color: 'text.disabled', mb: 1 }}
                />
                <Typography variant="body2" color="text.secondary">
                  No notifications yet
                </Typography>
              </Stack>
            )}
          </SimpleBar>
        </Box>
        <Divider />
        <Stack alignItems="center" sx={{ py: 1.5, px: 2 }}>
          {pagination.page < pagination.pagesCount ? (
            <Button
              component={Link}
              underline="none"
              href="#!"
              variant="text"
              color="primary"
              disabled={loadingMore}
              onClick={handleLoadMore}
              startIcon={loadingMore ? <CircularProgress size={16} /> : undefined}
            >
              {loadingMore ? 'Loading' : 'Load more notifications'}
            </Button>
          ) : (
            <Typography variant="caption" color="text.secondary">
              You are all caught up
            </Typography>
          )}
        </Stack>
      </Popover>
    </>
  );
};

export default NavbarNotifications;

import { useMemo, useState } from 'react';
import {
  Avatar,
  Box,
  Button,
  CircularProgress,
  Divider,
  List,
  ListItemAvatar,
  ListItemButton,
  ListItemText,
  Popover,
  Stack,
  Typography,
  badgeClasses,
  paperClasses,
} from '@mui/material';
import { useSettingsContext } from 'app/providers/SettingsProvider';
import { apiClient } from 'shared/api';
import type {
  ApiNotificationsAllListResult,
  ApiNotificationsListResult,
  Notification,
  NotificationBody,
} from 'shared/api/orval/generated/endpoints';
import { NotificationType } from 'shared/api/orval/generated/endpoints/index.schemas';
import IconifyIcon from 'shared/components/base/IconifyIcon';
import SimpleBar from 'shared/components/base/SimpleBar';
import OutlinedBadge from 'shared/components/styled/OutlinedBadge';
import useSWR from 'swr';

interface NotificationMenuProps {
  type?: 'default' | 'slim';
}

const NotificationMenu = ({ type = 'default' }: NotificationMenuProps) => {
  const [page, setPage] = useState(1);
  const [showAll, setShowAll] = useState(false);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const {
    config: { textDirection },
  } = useSettingsContext();

  const pageSize = 4;
  type NotificationListResponse = ApiNotificationsListResult | ApiNotificationsAllListResult;

  const fetchNotifications = () =>
    showAll
      ? apiClient.apiNotificationsAllList({ page, pageSize })
      : apiClient.apiNotificationsList({ page, pageSize });

  const { data, isLoading, mutate, isValidating, error } = useSWR<NotificationListResponse>(
    ['notification-menu', page, showAll],
    fetchNotifications,
    { revalidateOnFocus: false },
  );

  const notifications = useMemo(() => data?.data ?? [], [data?.data]);
  const total = data?.total ?? 0;
  const pagesCount = data?.pagesCount ?? 0;
  const hasUnread = !showAll && total > 0;

  const handlePageChange = (_: unknown, value: number) => {
    setPage(value);
  };

  const open = Boolean(anchorEl);
  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  const getNotificationBody = (notification?: Notification): NotificationBody => ({
    type: notification?.type ?? NotificationType.NUMBER_1,
    message: notification?.message ?? null,
  });

  const getNotificationMessage = (notification: Notification) => {
    const fallback = NOTIFICATION_TYPE_LABELS[notification.type as number] ?? 'Notification';

    if (notification.message) return notification.message;
    if (typeof notification.content === 'string' && notification.content.trim().length)
      return notification.content;
    return fallback;
  };

  const handleNotificationClick = async (notification: Notification) => {
    if (!notification.id || showAll) return;

    try {
      await apiClient.apiNotificationsRead(
        String(notification.id),
        getNotificationBody(notification),
      );
      await mutate(
        (current) =>
          current
            ? {
                ...current,
                data: current.data.filter((item) => item.id !== notification.id),
                total: Math.max(0, current.total - 1),
              }
            : current,
        false,
      );
    } catch (readError) {
      // eslint-disable-next-line no-console
      console.error(readError);
    }
  };

  const handleReadAll = async () => {
    if (!notifications.length) return;

    try {
      await apiClient.apiNotificationsReadAll(getNotificationBody(notifications[0]));
      await mutate(
        (current) =>
          current
            ? {
                ...current,
                data: [],
                total: 0,
              }
            : current,
        false,
      );
    } catch (readError) {
      // eslint-disable-next-line no-console
      console.error(readError);
    }
  };

  const handleToggleAll = () => {
    setShowAll((prev) => !prev);
    setPage(1);
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
          invisible={!hasUnread}
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
        id="notification-menu"
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
            width: 400,
            height: 650,
            display: 'flex',
            flexDirection: 'column',
          },
        }}
      >
        <Box
          sx={{
            p: 2,
            pb: 0,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <Typography variant="subtitle1">Notifications</Typography>
          <Typography variant="caption" color="text.secondary">
            {showAll ? `${total} total` : `${total} unread`}
          </Typography>
        </Box>
        <Divider sx={{ my: 2 }} />
        <Box sx={{ flex: 1, overflow: 'hidden' }}>
          <SimpleBar disableHorizontal>
            {isLoading || isValidating ? (
              <Stack spacing={2} alignItems="center" justifyContent="center" sx={{ py: 6 }}>
                <CircularProgress size={28} />
                <Typography variant="body2" color="text.secondary">
                  Loading notifications...
                </Typography>
              </Stack>
            ) : notifications.length ? (
              <List disablePadding>
                {notifications.map((notification) => (
                  <ListItemButton
                    key={notification.id}
                    alignItems="flex-start"
                    onClick={() => handleNotificationClick(notification)}
                    sx={{
                      alignItems: 'center',
                      py: 1.5,
                      px: 2,
                    }}
                  >
                    <ListItemAvatar>
                      <Avatar
                        sx={{
                          bgcolor: 'primary.lighter',
                          color: 'primary.main',
                          width: 36,
                          height: 36,
                        }}
                        variant="rounded"
                      >
                        <IconifyIcon icon="material-symbols:notifications-outline-rounded" />
                      </Avatar>
                    </ListItemAvatar>
                    <ListItemText
                      primary={
                        <Typography variant="body2" color="text.primary">
                          {getNotificationMessage(notification)}
                        </Typography>
                      }
                      secondary={
                        <Stack direction="row" spacing={1} alignItems="center" sx={{ mt: 0.5 }}>
                          <Typography variant="caption" color="text.secondary">
                            {notification.createdNaturaltime ?? ''}
                          </Typography>
                          {showAll && (
                            <Typography variant="caption" color="text.disabled">
                              #{notification.id}
                            </Typography>
                          )}
                        </Stack>
                      }
                    />
                  </ListItemButton>
                ))}
              </List>
            ) : (
              <Stack spacing={2} alignItems="center" justifyContent="center" sx={{ py: 6 }}>
                <Avatar
                  variant="rounded"
                  sx={{ bgcolor: 'warning.lighter', color: 'warning.main', width: 48, height: 48 }}
                >
                  <IconifyIcon icon="material-symbols:notifications-off-rounded" />
                </Avatar>
                <Typography variant="body2" color="text.secondary" textAlign="center">
                  {error ? 'Could not load notifications.' : 'No notifications yet.'}
                </Typography>
              </Stack>
            )}
          </SimpleBar>
        </Box>
        {pagesCount > 1 && (
          <Stack alignItems="center" sx={{ py: 1 }}>
            <Button
              size="small"
              color="primary"
              variant="text"
              onClick={() => handlePageChange(null, Math.min(page + 1, pagesCount))}
              disabled={page >= pagesCount}
            >
              Load more
            </Button>
            <Typography
              variant="caption"
              color="text.secondary"
            >{`Page ${page} of ${pagesCount}`}</Typography>
          </Stack>
        )}
        <Divider />
        <Stack direction="row" spacing={1} sx={{ p: 2 }}>
          <Button onClick={handleToggleAll} variant="soft" color="primary" fullWidth>
            {showAll ? 'Show unread' : 'Show all'}
          </Button>
          {!showAll && notifications.length > 0 && (
            <Button onClick={handleReadAll} variant="contained" color="primary">
              Mark all read
            </Button>
          )}
        </Stack>
      </Popover>
    </>
  );
};

const NOTIFICATION_TYPE_LABELS: Record<number, string> = {
  1: 'System',
  2: 'Contest rating changes',
  3: 'Kepcoin earned',
  4: 'Challenge accepted',
  5: 'Challenge finished',
  6: 'Arena finished',
  7: 'Duel started',
  8: 'New achievement',
};

export default NotificationMenu;

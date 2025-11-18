import { useMemo, useState } from 'react';
import {
  Avatar,
  Box,
  Button,
  CircularProgress,
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
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import IconifyIcon from 'shared/components/base/IconifyIcon';
import SimpleBar from 'shared/components/base/SimpleBar';
import OutlinedBadge from 'shared/components/styled/OutlinedBadge';
import {
  ApiNotificationsListResult,
  Notification as ApiNotification,
  NotificationType,
} from 'shared/api/orval/generated/endpoints';
import axiosFetcher from 'shared/services/axios/axiosFetcher';
import useSWR from 'swr';

const NOTIFICATIONS_URL = '/api/notifications/';
const READ_ALL_URL = '/api/notifications/read-all/';

dayjs.extend(relativeTime);

const notificationIconMap: Record<NotificationType, { icon: string; color: string }> = {
  1: { icon: 'material-symbols:notifications', color: 'primary.main' },
  2: { icon: 'material-symbols:chat-bubble', color: 'info.main' },
  3: { icon: 'material-symbols:group', color: 'success.main' },
  4: { icon: 'material-symbols:campaign', color: 'warning.main' },
  5: { icon: 'material-symbols:event', color: 'primary.main' },
  6: { icon: 'material-symbols:rocket-launch', color: 'secondary.main' },
  7: { icon: 'material-symbols:bolt', color: 'error.main' },
  8: { icon: 'material-symbols:workspace-premium', color: 'primary.main' },
};

const DEFAULT_ICON = { icon: 'material-symbols-light:notifications-outline-rounded', color: 'primary.main' };

interface NavbarNotificationsProps {
  type?: 'default' | 'slim';
}

const NavbarNotifications = ({ type = 'default' }: NavbarNotificationsProps) => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const {
    config: { textDirection },
  } = useSettingsContext();

  const { data, isLoading, mutate, error } = useSWR<ApiNotificationsListResult>([
    NOTIFICATIONS_URL,
    { params: { pageSize: 10 } },
  ]);

  const notifications = useMemo(() => data?.data ?? [], [data]);
  const unreadCount = notifications.length;

  const open = Boolean(anchorEl);
  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  const getVisuals = (type?: NotificationType) => {
    if (!type || !notificationIconMap[type]) return DEFAULT_ICON;
    return notificationIconMap[type];
  };

  const refreshNotifications = async () => {
    await mutate();
  };

  const markAllAsRead = async () => {
    if (!notifications.length) return;
    await axiosFetcher([READ_ALL_URL, { method: 'post' }], {
      arg: { type: notifications[0].type, message: null },
    });
    await refreshNotifications();
  };

  const markOneAsRead = async (notification: ApiNotification) => {
    if (!notification.id) return;
    await axiosFetcher([`${NOTIFICATIONS_URL}${notification.id}/read/`, { method: 'post' }], {
      arg: { type: notification.type, message: notification.message ?? null },
    });
    await refreshNotifications();
    handleClose();
  };

  const renderNotifications = () => {
    if (isLoading) {
      return (
        <Stack alignItems="center" justifyContent="center" sx={{ py: 4 }}>
          <CircularProgress size={22} />
        </Stack>
      );
    }

    if (error) {
      return (
        <Stack alignItems="center" justifyContent="center" sx={{ py: 3, px: 2 }}>
          <Typography variant="body2" color="text.secondary">
            Unable to load notifications.
          </Typography>
          <Button size="small" onClick={refreshNotifications} sx={{ mt: 1 }}>
            Retry
          </Button>
        </Stack>
      );
    }

    if (!notifications.length) {
      return (
        <Stack alignItems="center" justifyContent="center" sx={{ py: 4 }}>
          <Typography variant="body2" color="text.secondary">
            No notifications
          </Typography>
        </Stack>
      );
    }

    return (
      <List disablePadding>
        {notifications.map((notification) => {
          const visuals = getVisuals(notification.type);
          return (
            <ListItemButton
              key={notification.id}
              alignItems="flex-start"
              onClick={() => markOneAsRead(notification)}
              sx={{
                gap: 1.5,
                py: 1.5,
                px: 2,
                '&:hover': { bgcolor: 'background.elevation1' },
              }}
            >
              <ListItemAvatar sx={{ minWidth: 0 }}>
                <Avatar
                  variant="rounded"
                  sx={{
                    bgcolor: visuals.color,
                    color: 'common.white',
                    width: 40,
                    height: 40,
                  }}
                >
                  <IconifyIcon icon={visuals.icon} sx={{ fontSize: 22 }} />
                </Avatar>
              </ListItemAvatar>
              <ListItemText
                primary={notification.content || notification.message || 'Notification'}
                secondary={
                  notification.createdNaturaltime ||
                  (notification.created ? dayjs(notification.created).fromNow() : undefined)
                }
                primaryTypographyProps={{
                  variant: 'body2',
                  color: 'text.primary',
                  sx: { lineHeight: 1.5 },
                }}
                secondaryTypographyProps={{
                  variant: 'caption',
                  color: 'text.secondary',
                }}
              />
            </ListItemButton>
          );
        })}
      </List>
    );
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
          overlap="circular"
          color={unreadCount ? 'error' : 'default'}
          badgeContent={unreadCount || null}
          sx={{
            [`& .${badgeClasses.badge}`]: {
              minWidth: 18,
              height: 18,
              px: 0.5,
              top: -4,
              right: -4,
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
            width: 400,
            maxHeight: 560,
            display: 'flex',
            flexDirection: 'column',
          },
        }}
      >
        <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ px: 2, pt: 1.5 }}>
          <Typography variant="h6">Notifications</Typography>
          <Button
            size="small"
            color="primary"
            variant="text"
            disabled={!unreadCount}
            onClick={markAllAsRead}
          >
            Mark all as read
          </Button>
        </Stack>
        <Box sx={{ flex: 1, overflow: 'hidden', pb: 1 }}>
          <SimpleBar disableHorizontal>
            <Box sx={{ pt: 1 }}>{renderNotifications()}</Box>
          </SimpleBar>
        </Box>
      </Popover>
    </>
  );
};

export default NavbarNotifications;

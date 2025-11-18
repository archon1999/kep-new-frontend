import { useEffect, useMemo, useState } from 'react';
import {
  Box,
  Button,
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
import { Notification as ApiNotification } from 'shared/api/orval/generated/endpoints';
import IconifyIcon from 'shared/components/base/IconifyIcon';
import SimpleBar from 'shared/components/base/SimpleBar';
import NavbarNotificationItem from 'shared/components/sections/notification/NavbarNotificationItem';
import OutlinedBadge from 'shared/components/styled/OutlinedBadge';
import { useNavbarNotifications } from 'shared/services/swr/api-hooks/useNotificationsApi';
import axiosFetcher from 'shared/services/axios/axiosFetcher';

interface NotificationMenuProps {
  type?: 'default' | 'slim';
}

const NotificationMenu = ({ type = 'default' }: NotificationMenuProps) => {
  const [notifications, setNotifications] = useState<ApiNotification[]>([]);
  const [page, setPage] = useState(1);
  const [showAll, setShowAll] = useState(false);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const { data, isLoading, mutate } = useNavbarNotifications(page, showAll);

  const {
    config: { textDirection },
  } = useSettingsContext();

  const open = Boolean(anchorEl);
  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  useEffect(() => {
    if (data?.data) {
      setNotifications((prev) => (page === 1 ? data.data : [...prev, ...data.data]));
    }
  }, [data, page]);

  const unreadCount = useMemo(() => (!showAll ? data?.total ?? data?.count ?? notifications.length : 0), [data, notifications.length, showAll]);

  const canLoadMore = useMemo(() => {
    if (!data?.pagesCount) return false;
    return page < data.pagesCount;
  }, [data?.pagesCount, page]);

  const handleToggleView = () => {
    setShowAll((prev) => !prev);
    setPage(1);
    setNotifications([]);
  };

  const handleLoadMore = () => {
    if (canLoadMore) {
      setPage((prev) => prev + 1);
    }
  };

  const handleMarkRead = async (notification: ApiNotification) => {
    if (!notification.id) return;

    await axiosFetcher([`/api/notifications/${notification.id}/read/`, { method: 'post' }], {
      arg: { type: notification.type, message: notification.message },
    });

    if (!showAll) {
      setNotifications((prev) => prev.filter((item) => item.id !== notification.id));
    }
    await mutate();
  };

  const handleReadAll = async () => {
    await axiosFetcher(['/api/notifications/read-all/', { method: 'post' }]);
    setNotifications([]);
    await mutate();
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
        <Stack direction="row" alignItems="center" justifyContent="space-between" px={2} pt={2} pb={1}>
          <Typography variant="subtitle1" color="text.primary">
            Notifications
          </Typography>
          {!showAll && (
            <OutlinedBadge
              color="error"
              badgeContent={unreadCount}
              overlap="circular"
              sx={{ [`& .${badgeClasses.badge}`]: { right: 4, top: 6 } }}
            >
              <Box />
            </OutlinedBadge>
          )}
        </Stack>
        <Divider />
        <Box sx={{ flex: 1, overflow: 'hidden', minHeight: 320 }}>
          <SimpleBar disableHorizontal>
            {isLoading && notifications.length === 0 ? (
              <Stack alignItems="center" justifyContent="center" sx={{ py: 6 }}>
                <CircularProgress size={28} />
              </Stack>
            ) : notifications.length === 0 ? (
              <Stack alignItems="center" justifyContent="center" spacing={1} sx={{ py: 5 }}>
                <IconifyIcon icon="material-symbols:notifications-off-outline" sx={{ fontSize: 36, color: 'text.secondary' }} />
                <Typography variant="body2" color="text.secondary">
                  No notifications
                </Typography>
              </Stack>
            ) : (
              notifications.map((notification) => (
                <NavbarNotificationItem key={notification.id} notification={notification} onMarkRead={handleMarkRead} />
              ))
            )}
          </SimpleBar>
        </Box>
        <Stack
          sx={{
            justifyContent: 'center',
            alignItems: 'center',
            py: 1,
          }}
        >
          <Button
            component={Link}
            underline="none"
            href="#!"
            variant="text"
            color="primary"
            onClick={handleLoadMore}
            disabled={!canLoadMore || isLoading}
          >
            {canLoadMore ? 'Load more notifications' : 'No more notifications'}
          </Button>
          <Stack direction="row" spacing={1} sx={{ width: '100%', px: 2, pb: 1 }}>
            <Button onClick={handleToggleView} fullWidth variant="outlined" color="primary">
              {showAll ? 'Show unread' : 'Show all'}
            </Button>
            <Button onClick={handleReadAll} fullWidth variant="contained" color="primary" disabled={notifications.length === 0}>
              Mark all read
            </Button>
          </Stack>
        </Stack>
      </Popover>
    </>
  );
};

export default NotificationMenu;

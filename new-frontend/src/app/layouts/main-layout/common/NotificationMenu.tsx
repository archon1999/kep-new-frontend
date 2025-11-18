import { useEffect, useMemo, useState } from 'react';
import {
  Avatar,
  Box,
  Button,
  Chip,
  CircularProgress,
  Divider,
  IconButton,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Popover,
  Stack,
  Typography,
  badgeClasses,
  paperClasses,
} from '@mui/material';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import { useSettingsContext } from 'app/providers/SettingsProvider';
import IconifyIcon from 'shared/components/base/IconifyIcon';
import SimpleBar from 'shared/components/base/SimpleBar';
import OutlinedBadge from 'shared/components/styled/OutlinedBadge';
import { NavbarNotification, useNotificationsApi } from 'shared/services/swr/api-hooks/useNotificationsApi';

dayjs.extend(relativeTime);

interface NotificationMenuProps {
  type?: 'default' | 'slim';
}

const NotificationMenu = ({ type = 'default' }: NotificationMenuProps) => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [page, setPage] = useState(1);
  const [showAll, setShowAll] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);

  const { config } = useSettingsContext();

  const {
    data,
    notifications,
    isLoading,
    isValidating,
    markAsRead,
    markAllAsRead,
    isMarkingRead,
    isMarkingAllRead,
    pageSize,
  } = useNotificationsApi(page, showAll);

  const totalPages = data?.pagesCount ?? 0;

  useEffect(() => {
    if (!showAll && typeof data?.total === 'number') {
      setUnreadCount(data.total);
    }
  }, [data?.total, showAll]);

  useEffect(() => {
    setPage(1);
  }, [showAll]);

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleNotificationClick = async (notification: NavbarNotification) => {
    await markAsRead(notification.id);
  };

  const handleToggleView = () => {
    setShowAll((prev) => !prev);
  };

  const handlePageChange = (direction: 'next' | 'previous') => {
    setPage((prev) => {
      if (direction === 'next') {
        return Math.min(prev + 1, totalPages || prev + 1);
      }
      return Math.max(prev - 1, 1);
    });
  };

  const open = Boolean(anchorEl);

  const notificationSubtitle = useMemo(
    () =>
      !notifications.length && !isLoading
        ? 'You have no notifications right now.'
        : `${showAll ? 'All' : 'Unread'} notifications`,
    [isLoading, notifications.length, showAll],
  );

  const renderNotificationTime = (notification: NavbarNotification) => {
    if (notification.createdNaturaltime) {
      return notification.createdNaturaltime;
    }

    if (notification.created) {
      return dayjs(notification.created).fromNow();
    }

    return 'Moments ago';
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
          horizontal: config.textDirection === 'rtl' ? 'left' : 'right',
          vertical: 'top',
        }}
        anchorOrigin={{
          horizontal: config.textDirection === 'rtl' ? 'left' : 'right',
          vertical: 'bottom',
        }}
        sx={{
          [`& .${paperClasses.root}`]: {
            width: 420,
            height: 600,
            display: 'flex',
            flexDirection: 'column',
          },
        }}
      >
        <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ px: 2, pt: 2, pb: 1 }}>
          <Box>
            <Typography variant="h6">Notifications</Typography>
            <Typography variant="body2" color="text.secondary">
              {notificationSubtitle}
            </Typography>
          </Box>
          <Chip label={unreadCount ? `${unreadCount} unread` : 'No unread'} color="primary" size="small" />
        </Stack>

        <Divider />

        <Box sx={{ flex: 1, overflow: 'hidden', position: 'relative' }}>
          <SimpleBar style={{ maxHeight: 430 }}>
            {isLoading && (
              <Stack sx={{ p: 2 }} spacing={1}>
                {[...Array(3)].map((_, index) => (
                  <Stack key={index} direction="row" spacing={2} alignItems="center">
                    <Box sx={{ width: 40, height: 40, borderRadius: 2, bgcolor: 'action.hover' }} />
                    <Stack spacing={1} sx={{ flex: 1 }}>
                      <Box sx={{ width: '80%', height: 10, borderRadius: 1, bgcolor: 'action.hover' }} />
                      <Box sx={{ width: '60%', height: 10, borderRadius: 1, bgcolor: 'action.hover' }} />
                    </Stack>
                  </Stack>
                ))}
              </Stack>
            )}

            {!isLoading && !notifications.length && (
              <Stack sx={{ py: 6, alignItems: 'center', justifyContent: 'center' }} spacing={2}>
                <Avatar
                  sx={{ bgcolor: 'background.elevation1', color: 'text.secondary', width: 64, height: 64 }}
                >
                  <IconifyIcon icon="material-symbols:notifications-off-outline" sx={{ fontSize: 28 }} />
                </Avatar>
                <Stack spacing={0.5} alignItems="center">
                  <Typography variant="subtitle1">No notifications</Typography>
                  <Typography variant="body2" color="text.secondary">
                    You&apos;re all caught up for now.
                  </Typography>
                </Stack>
              </Stack>
            )}

            {!!notifications.length && (
              <List disablePadding>
                {notifications.map((notification) => (
                  <ListItem
                    key={notification.id}
                    disableGutters
                    secondaryAction={
                      !showAll && (
                        <IconButton
                          edge="end"
                          aria-label="mark as read"
                          onClick={() => handleNotificationClick(notification)}
                          disabled={isValidating || isMarkingRead}
                        >
                          <IconifyIcon icon="material-symbols:close-rounded" />
                        </IconButton>
                      )
                    }
                    sx={{
                      px: 2,
                      py: 1.5,
                      alignItems: 'flex-start',
                      '&:hover': {
                        bgcolor: 'background.menuElevation1',
                      },
                    }}
                  >
                    <ListItemAvatar>
                      <Avatar
                        sx={{
                          bgcolor: 'primary.light',
                          color: 'primary.main',
                        }}
                      >
                        <IconifyIcon icon="material-symbols:notifications" />
                      </Avatar>
                    </ListItemAvatar>
                    <ListItemText
                      primary={
                        <Typography variant="body2" color="text.primary">
                          {notification.message || notification.content || 'Notification'}
                        </Typography>
                      }
                      secondary={
                        <Typography variant="caption" color="text.secondary">
                          {renderNotificationTime(notification)}
                        </Typography>
                      }
                    />
                  </ListItem>
                ))}
              </List>
            )}
          </SimpleBar>
          {isValidating && !isLoading && (
            <Box
              sx={{
                position: 'absolute',
                inset: 0,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                pointerEvents: 'none',
              }}
            >
              <CircularProgress size={24} />
            </Box>
          )}
        </Box>

        {!!notifications.length && !showAll && (
          <Box sx={{ px: 2, pb: 1 }}>
            <Button fullWidth variant="soft" color="primary" onClick={markAllAsRead} disabled={isMarkingAllRead}>
              Mark all as read
            </Button>
          </Box>
        )}

        <Divider />

        <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ p: 2, pt: 1 }}>
          <Button
            color="neutral"
            variant="text"
            size="small"
            onClick={() => handlePageChange('previous')}
            disabled={page === 1 || isLoading}
          >
            Prev
          </Button>
          <Typography variant="caption" color="text.secondary">
            Page {page}{totalPages ? ` of ${totalPages}` : ''} (showing {notifications.length} of {data?.total ?? 0})
          </Typography>
          <Button
            color="neutral"
            variant="text"
            size="small"
            onClick={() => handlePageChange('next')}
            disabled={isLoading || (totalPages ? page >= totalPages : notifications.length < pageSize)}
          >
            Next
          </Button>
        </Stack>

        <Stack sx={{ pb: 2, px: 2 }}>
          <Button variant="contained" color="primary" onClick={handleToggleView} fullWidth>
            {showAll ? 'Show unread only' : 'Show all notifications'}
          </Button>
        </Stack>
      </Popover>
    </>
  );
};

export default NotificationMenu;

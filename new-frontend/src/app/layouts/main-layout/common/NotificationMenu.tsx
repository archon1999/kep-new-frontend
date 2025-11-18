import { useCallback, useEffect, useMemo, useState } from 'react';
import {
  Avatar,
  Box,
  Button,
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
  alpha,
  badgeClasses,
  paperClasses,
} from '@mui/material';
import { useSettingsContext } from 'app/providers/SettingsProvider';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import IconifyIcon from 'shared/components/base/IconifyIcon';
import SimpleBar from 'shared/components/base/SimpleBar';
import OutlinedBadge from 'shared/components/styled/OutlinedBadge';
import { apiClient, normalizeError, notifyError } from 'shared/api';
import type { Notification, NotificationBody } from 'shared/api/orval/generated/endpoints/index.schemas';

dayjs.extend(relativeTime);

interface NotificationMenuProps {
  type?: 'default' | 'slim';
}

type ViewMode = 'unread' | 'all';

const PAGE_SIZE = 4;

const NotificationMenu = ({ type = 'default' }: NotificationMenuProps) => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [page, setPage] = useState(1);
  const [pagesCount, setPagesCount] = useState(0);
  const [viewMode, setViewMode] = useState<ViewMode>('unread');
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);

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

  const fetchNotifications = useCallback(
    async (targetPage = 1, mode: ViewMode = viewMode, append = false) => {
      const toggleLoader = append ? setIsLoadingMore : setIsLoading;
      toggleLoader(true);
      try {
        const response =
          mode === 'all'
            ? await apiClient.apiNotificationsAllList({ page: targetPage, pageSize: PAGE_SIZE })
            : await apiClient.apiNotificationsList({ page: targetPage, pageSize: PAGE_SIZE });

        setNotifications((prev) => (append ? [...prev, ...response.data] : response.data));
        setPage(response.page);
        setPagesCount(response.pagesCount);
        if (mode === 'unread') {
          setUnreadCount(response.total ?? response.data.length ?? 0);
        }
      } catch (error) {
        notifyError(normalizeError(error));
      } finally {
        toggleLoader(false);
      }
    },
    [viewMode],
  );

  useEffect(() => {
    fetchNotifications(1, viewMode, false);
  }, [fetchNotifications, viewMode]);

  const handleLoadMore = () => {
    if (page >= pagesCount || isLoading || isLoadingMore) return;
    fetchNotifications(page + 1, viewMode, true);
  };

  const handleToggleMode = () => {
    const nextMode: ViewMode = viewMode === 'unread' ? 'all' : 'unread';
    setNotifications([]);
    setPage(1);
    setPagesCount(0);
    setViewMode(nextMode);
  };

  const handleMarkAsRead = async (notificationId?: number) => {
    if (!notificationId) return;
    try {
      await apiClient.apiNotificationsRead(String(notificationId), {} as NotificationBody);
      setNotifications((prev) => prev.filter((item) => item.id !== notificationId));
      setUnreadCount((prev) => Math.max(prev - 1, 0));
    } catch (error) {
      notifyError(normalizeError(error));
    }
  };

  const handleReadAll = async () => {
    try {
      await apiClient.apiNotificationsReadAll({} as NotificationBody);
      setNotifications([]);
      setUnreadCount(0);
    } catch (error) {
      notifyError(normalizeError(error));
    }
  };

  const hasMore = useMemo(() => page < pagesCount, [page, pagesCount]);

  const renderEmptyState = () => (
    <Stack
      sx={{
        py: 5,
        alignItems: 'center',
        justifyContent: 'center',
        color: 'text.secondary',
      }}
      spacing={1}
    >
      <Avatar
        sx={{
          width: 64,
          height: 64,
          bgcolor: alpha('#ff5630', 0.12),
          color: 'error.main',
        }}
      >
        <IconifyIcon icon="material-symbols:notifications-off-outline" />
      </Avatar>
      <Typography variant="subtitle1" color="text.primary">
        No notifications
      </Typography>
      <Typography variant="body2">You are all caught up for now.</Typography>
    </Stack>
  );

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
          overlap="circular"
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
            width: 420,
            height: 640,
            display: 'flex',
            flexDirection: 'column',
          },
        }}
      >
        <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ p: 2, pb: 1 }}>
          <Typography variant="h6">Notifications</Typography>
          <Button variant="outlined" size="small" onClick={handleReadAll} disabled={!unreadCount}>
            Mark all read
          </Button>
        </Stack>
        <Stack direction="row" spacing={1} sx={{ px: 2, pb: 1 }}>
          <Typography variant="body2" color="text.secondary">
            {viewMode === 'unread' ? `${unreadCount} unread` : 'All notifications'}
          </Typography>
        </Stack>
        <Divider />
        <Box sx={{ flex: 1, overflow: 'hidden' }}>
          {isLoading && !notifications.length ? (
            <Stack alignItems="center" justifyContent="center" sx={{ py: 6 }}>
              <CircularProgress size={24} />
            </Stack>
          ) : notifications.length ? (
            <SimpleBar disableHorizontal>
              <List disablePadding>
                {notifications.map((notification) => (
                  <ListItem
                    key={notification.id}
                    alignItems="flex-start"
                    secondaryAction={
                      viewMode === 'unread' ? (
                        <IconButton edge="end" aria-label="mark as read" onClick={() => handleMarkAsRead(notification.id)}>
                          <IconifyIcon icon="mingcute:close-line" />
                        </IconButton>
                      ) : undefined
                    }
                    sx={{
                      borderBottom: (theme) => `1px dashed ${alpha(theme.palette.divider, 0.6)}`,
                      py: 1.5,
                      px: 2,
                    }}
                  >
                    <ListItemAvatar>
                      <Avatar variant="rounded" sx={{ bgcolor: 'primary.softBg', color: 'primary.main' }}>
                        <IconifyIcon icon="material-symbols:notifications-outline-rounded" />
                      </Avatar>
                    </ListItemAvatar>
                    <ListItemText
                      primary={
                        <Typography variant="body1" color="text.primary">
                          {notification.message || notification.content || 'Notification'}
                        </Typography>
                      }
                      secondary={
                        <Typography variant="caption" color="text.secondary">
                          {notification.createdNaturaltime ||
                            (notification.created ? dayjs(notification.created).fromNow() : '')}
                        </Typography>
                      }
                    />
                  </ListItem>
                ))}
              </List>
            </SimpleBar>
          ) : (
            renderEmptyState()
          )}
        </Box>
        {hasMore && (
          <Box sx={{ p: 2, pt: 1 }}>
            <Button fullWidth variant="outlined" onClick={handleLoadMore} disabled={isLoadingMore}>
              {isLoadingMore ? 'Loading...' : 'Load more notifications'}
            </Button>
          </Box>
        )}
        <Box sx={{ p: 2, pt: hasMore ? 0 : 2 }}>
          <Button fullWidth variant="text" color="primary" onClick={handleToggleMode}>
            {viewMode === 'unread' ? 'Show all notifications' : 'Show unread only'}
          </Button>
        </Box>
      </Popover>
    </>
  );
};

export default NotificationMenu;

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
  Avatar,
  Box,
  Button,
  Chip,
  Divider,
  IconButton,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Pagination,
  Popover,
  Skeleton,
  Stack,
  Typography,
  badgeClasses,
  paperClasses,
} from '@mui/material';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import { useTranslation } from 'react-i18next';
import { toast } from 'sonner';
import { useAuth } from 'app/providers/AuthProvider';
import IconifyIcon from 'shared/components/base/IconifyIcon';
import SimpleBar from 'shared/components/base/SimpleBar';
import OutlinedBadge from 'shared/components/styled/OutlinedBadge';
import { apiClient } from 'shared/api/http/apiClient';
import {
  Notification as ApiNotification,
  NotificationBody,
  NotificationType as ApiNotificationType,
} from 'shared/api/orval/generated/endpoints/index.schemas';
import { wsService } from 'shared/services/websocket';

const NOTIFICATIONS_PAGE_SIZE = 4;

interface NotificationContent {
  contestId?: number;
  contestTitle?: string;
  delta?: number;
  earnType?: number;
  kepcoin?: number;
  challengeId?: number;
  arena?: {
    id?: number;
    title?: string;
  };
  duel?: {
    id?: number;
    title?: string;
  };
  achievementTitle?: string;
  [key: string]: unknown;
}

dayjs.extend(relativeTime);

const typeIconMap: Partial<Record<ApiNotificationType, string>> = {
  [ApiNotificationType.NUMBER_1]: 'material-symbols:notifications',
  [ApiNotificationType.NUMBER_2]: 'material-symbols:workspace-premium',
  [ApiNotificationType.NUMBER_3]: 'material-symbols:redeem-outline',
  [ApiNotificationType.NUMBER_4]: 'material-symbols:call-received',
  [ApiNotificationType.NUMBER_5]: 'material-symbols:swords-outline',
  [ApiNotificationType.NUMBER_6]: 'material-symbols:trophy-outline',
  [ApiNotificationType.NUMBER_7]: 'material-symbols:swords',
  [ApiNotificationType.NUMBER_8]: 'material-symbols:stars-outline',
};

const parseContent = (content?: string): NotificationContent => {
  if (!content) return {};

  if (typeof content === 'string') {
    try {
      return JSON.parse(content) as NotificationContent;
    } catch {
      return { text: content } as NotificationContent;
    }
  }

  return content as NotificationContent;
};

const getNotificationMessage = (notification: ApiNotification): string => {
  const parsedContent = parseContent(notification.content);

  switch (notification.type) {
    case ApiNotificationType.NUMBER_2: {
      if (parsedContent.contestTitle) {
        const delta = parsedContent.delta;
        const deltaText = typeof delta === 'number' ? ` (${delta > 0 ? '+' : ''}${delta})` : '';
        return `${parsedContent.contestTitle} | Contest finished${deltaText}`;
      }
      break;
    }
    case ApiNotificationType.NUMBER_3: {
      if (parsedContent.kepcoin) {
        return `Earned ${parsedContent.kepcoin} Kepcoin`;
      }
      break;
    }
    case ApiNotificationType.NUMBER_4:
    case ApiNotificationType.NUMBER_5: {
      if (parsedContent.challengeId) {
        return `Challenge #${parsedContent.challengeId}`;
      }
      break;
    }
    case ApiNotificationType.NUMBER_6: {
      if (parsedContent.arena?.title) {
        return `${parsedContent.arena.title} | Arena finished`;
      }
      break;
    }
    case ApiNotificationType.NUMBER_7: {
      if (parsedContent.duel?.id) {
        return `Duel #${parsedContent.duel.id} starts soon`;
      }
      break;
    }
    case ApiNotificationType.NUMBER_8: {
      if (parsedContent.achievementTitle) {
        return `New achievement unlocked: ${parsedContent.achievementTitle}`;
      }
      break;
    }
    default:
      break;
  }

  if (notification.message) return notification.message;

  if (typeof notification.content === 'string' && notification.content.trim().length) {
    return notification.content;
  }

  return 'Notification';
};

const getNotificationMeta = (notification: ApiNotification): string =>
  notification.createdNaturaltime ||
  (notification.created ? dayjs(notification.created).fromNow() : 'Just now');

interface NotificationMenuProps {
  type?: 'default' | 'slim';
}

const NotificationMenu = ({ type = 'default' }: NotificationMenuProps) => {
  const [notifications, setNotifications] = useState<ApiNotification[]>([]);
  const [pageNumber, setPageNumber] = useState(1);
  const [pagesCount, setPagesCount] = useState(0);
  const [total, setTotal] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [showAll, setShowAll] = useState(false);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const { currentUser } = useAuth();
  const showAllRef = useRef(showAll);
  const { t } = useTranslation();

  const open = Boolean(anchorEl);

  const hasUnread = useMemo(() => !showAll && total > 0, [showAll, total]);

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const fetchNotifications = useCallback(async () => {
    setIsLoading(true);

    if (!currentUser) {
      setNotifications([]);
      setTotal(0);
      setPagesCount(0);
      setIsLoading(false);
      return;
    }

    try {
      const params = { page: pageNumber, pageSize: NOTIFICATIONS_PAGE_SIZE };
      const response = showAll
        ? await apiClient.apiNotificationsAllList(params)
        : await apiClient.apiNotificationsList(params);

      setNotifications(response.data ?? []);
      setTotal(response.total ?? 0);
      setPagesCount(response.pagesCount ?? 0);
      setPageNumber(response.page ?? 1);
    } catch {
      setNotifications([]);
      setPagesCount(0);
      setTotal(0);
    } finally {
      setIsLoading(false);
    }
  }, [currentUser, pageNumber, showAll]);

  useEffect(() => {
    fetchNotifications();
  }, [fetchNotifications]);

  useEffect(() => {
    showAllRef.current = showAll;
  }, [showAll]);

  const showSystemNotification = useCallback(
    (message?: string) => {
      if (!message) return;

      toast.custom(
        () => (
          <Stack spacing={0.75} sx={{ p: 1.5, maxWidth: 360 }}>
            <Typography variant="subtitle1" color="text.primary">
              {t('notifications.systemInfoTitle')}
            </Typography>
            <Typography
              variant="body2"
              color="text.secondary"
              sx={{
                '& a': {
                  color: 'primary.main',
                  textDecoration: 'underline',
                },
              }}
              dangerouslySetInnerHTML={{ __html: message }}
            />
          </Stack>
        ),
        {
          duration: 8000,
          className: 'system-notification-toast',
        },
      );
    },
    [t],
  );

  useEffect(() => {
    const username = currentUser?.username;

    if (!username) return undefined;

    wsService.send('notification-add', username);

    const unsubscribe = wsService.on<ApiNotification>(`notification-${username}`, (notification) => {
      if (!notification) return;

      setNotifications((prevNotifications) => {
        if (prevNotifications.some((item) => item.id === notification.id)) {
          return prevNotifications;
        }

        return [notification, ...prevNotifications];
      });

      if (notification.type === ApiNotificationType.NUMBER_1) {
        showSystemNotification(notification.message);
      }

      if (!showAllRef.current) {
        setTotal((prevTotal) => prevTotal + 1);
      }
    });

    return () => {
      wsService.send('notification-delete', username);
      unsubscribe();
    };
  }, [currentUser?.username, showSystemNotification]);

  const handleMarkRead = async (notificationId?: number) => {
    if (!notificationId || showAll) return;

    setNotifications((prev) => {
      const updated = prev.filter((item) => item.id !== notificationId);

      if (prev.length === 1 && pageNumber > 1) {
        setPageNumber((value) => Math.max(value - 1, 1));
      }

      return updated;
    });

    setTotal((prev) => Math.max(prev - 1, 0));

    try {
      await apiClient.apiNotificationsRead(String(notificationId), {} as NotificationBody);
    } catch {
      // silently ignore errors for UX consistency
    }
  };

  const handleReadAll = async () => {
    if (showAll || !total) return;

    setNotifications([]);
    setTotal(0);
    setPagesCount(0);
    setPageNumber(1);

    try {
      await apiClient.apiNotificationsReadAll({} as NotificationBody);
    } catch {
      // ignore errors to keep UI responsive
    }
  };

  const handleToggleView = () => {
    setShowAll((prev) => !prev);
    setPageNumber(1);
  };

  const handlePageChange = (_event: React.ChangeEvent<unknown>, value: number) => {
    setPageNumber(value);
  };

  const renderList = () => {
    if (isLoading) {
      return (
        <List disablePadding sx={{ px: 2 }}>
          {[...Array(5)].map((_, index) => (
            <Box key={`notification-skeleton-${index}`} component="li">
              <ListItem alignItems="flex-start" sx={{ py: 1.25, px: 0 }}>
                <ListItemAvatar>
                  <Skeleton variant="rounded" width={44} height={44} />
                </ListItemAvatar>
                <ListItemText
                  primary={<Skeleton variant="text" width="80%" />}
                  secondary={<Skeleton variant="text" width="60%" />}
                  sx={{ mr: showAll ? 0 : 5 }}
                />
              </ListItem>
              <Divider component="div" />
            </Box>
          ))}
        </List>
      );
    }

    if (!notifications.length) {
      return (
        <Stack direction="column" alignItems="center" justifyContent="center" spacing={1.5} sx={{ py: 6, height: '100%' }}>
          <Avatar sx={{ bgcolor: 'background.level1', color: 'text.neutral', width: 56, height: 56 }}>
            <IconifyIcon icon="material-symbols:notifications-off-outline" sx={{ fontSize: 28 }} />
          </Avatar>
          <Typography variant="body2" color="text.secondary">
            No notifications
          </Typography>
        </Stack>
      );
    }

    return (
      <SimpleBar disableHorizontal>
        <List disablePadding>
          {notifications.map((notification, index) => {
            const itemKey = notification.id || notification.created || `${notification.type}-${index}`;

            return (
              <Box key={itemKey} component="li">
                <ListItem
                alignItems="flex-start"
                sx={{ py: 1.25, px: 2 }}
                secondaryAction={
                  !showAll && (
                    <IconButton
                      size="small"
                      edge="end"
                      aria-label="mark as read"
                      onClick={() => handleMarkRead(notification.id)}
                    >
                      <IconifyIcon icon="material-symbols:close-rounded" />
                    </IconButton>
                  )
                }
              >
                <ListItemAvatar>
                  <Avatar
                    variant="rounded"
                    sx={{
                      bgcolor: 'primary.lighter',
                      color: 'primary.main',
                      width: 44,
                      height: 44,
                    }}
                  >
                    <IconifyIcon
                      icon={typeIconMap[notification.type] || 'material-symbols:notifications-outline-rounded'}
                      sx={{ fontSize: 22 }}
                    />
                  </Avatar>
                </ListItemAvatar>
                <ListItemText
                  primary={
                    <Typography variant="subtitle2" color="text.primary">
                      {getNotificationMessage(notification)}
                    </Typography>
                  }
                  secondary={
                    <Typography variant="caption" color="text.secondary">
                      {getNotificationMeta(notification)}
                    </Typography>
                  }
                  sx={{ mr: showAll ? 0 : 5 }}
                />
                </ListItem>
                <Divider component="div" />
              </Box>
            );
          })}
        </List>
      </SimpleBar>
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
        <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ px: 2, pt: 2, pb: 1 }}>
          <Box>
            <Typography variant="h6">Notifications</Typography>
            <Typography variant="caption" color="text.secondary">
              {showAll ? 'All notifications' : 'Unread notifications'}
            </Typography>
          </Box>
          <Chip
            color="primary"
            size="small"
            label={`${total} ${showAll ? 'total' : 'unread'}`}
            sx={{ borderRadius: 1 }}
          />
        </Stack>

        {!showAll && total > 0 && (
          <Box sx={{ px: 2, pb: 1 }}>
            <Button size="small" color="primary" variant="text" onClick={handleReadAll}>
              Mark all as read
            </Button>
          </Box>
        )}

        <Divider />

        <Box sx={{ pt: 1, flex: 1, overflow: 'hidden' }}>{renderList()}</Box>

        {pagesCount > 1 && (
          <Stack alignItems="center" justifyContent="center" sx={{ py: 1 }}>
            <Pagination count={pagesCount} page={pageNumber} onChange={handlePageChange} size="medium" />
          </Stack>
        )}

        <Divider />

        <Stack spacing={1} sx={{ px: 2, py: 1 }}>
          <Button fullWidth variant="contained" color="primary" onClick={handleToggleView}>
            {showAll ? 'Show unread only' : 'Show all notifications'}
          </Button>
        </Stack>
      </Popover>
    </>
  );
};

export default NotificationMenu;

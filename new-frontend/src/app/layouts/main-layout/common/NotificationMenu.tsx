import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
  Badge,
  Box,
  Button,
  Chip,
  CircularProgress,
  Divider,
  IconButton,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  Popover,
  Stack,
  Typography,
  badgeClasses,
  paperClasses,
} from '@mui/material';
import { useTranslation } from 'react-i18next';
import { useAuth } from 'app/providers/AuthProvider';
import { useSettingsContext } from 'app/providers/SettingsProvider';
import {
  ApiNotificationsAllListResult,
  ApiNotificationsListResult,
  Notification,
  NotificationType,
} from 'shared/api/orval/generated/endpoints';
import axiosInstance from 'shared/services/axios/axiosInstance';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import IconifyIcon from 'shared/components/base/IconifyIcon';
import SimpleBar from 'shared/components/base/SimpleBar';
import OutlinedBadge from 'shared/components/styled/OutlinedBadge';
import { apiClient } from 'shared/api/http/apiClient';

dayjs.extend(relativeTime);

type NotificationListResult = ApiNotificationsListResult | ApiNotificationsAllListResult;

type NotificationContent = Record<string, any> | null | undefined;

interface NotificationMenuProps {
  type?: 'default' | 'slim';
}

const notificationsPageSize = 10;

const NotificationMenu = ({ type = 'default' }: NotificationMenuProps) => {
  const { t } = useTranslation();
  const {
    config: { textDirection },
  } = useSettingsContext();
  const { sessionUser } = useAuth();

  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [page, setPage] = useState(1);
  const [pagesCount, setPagesCount] = useState(0);
  const [isAll, setIsAll] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);

  const wsRef = useRef<WebSocket | null>(null);

  const open = Boolean(anchorEl);

  const handleToggle = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const parseContent = (content: Notification['content']): NotificationContent => {
    if (typeof content === 'string') {
      try {
        return JSON.parse(content);
      } catch {
        return { message: content };
      }
    }

    return content;
  };

  const fetchNotifications = useCallback(
    async (targetPage = 1, viewAll = isAll) => {
      setIsLoading(true);

      try {
        const response: NotificationListResult = viewAll
          ? await apiClient.apiNotificationsAllList({ page: targetPage, pageSize: notificationsPageSize })
          : await apiClient.apiNotificationsList({ page: targetPage, pageSize: notificationsPageSize });

        setNotifications(response.data || []);
        setPagesCount(response.pagesCount || 0);
        setPage(response.page || targetPage);

        if (!viewAll) {
          setUnreadCount(response.total || response.data?.length || 0);
        }
      } catch (error) {
        console.error('Failed to load notifications', error);
      } finally {
        setIsLoading(false);
      }
    },
    [isAll],
  );

  const markNotificationAsRead = useCallback(
    async (notification: Notification) => {
      if (!notification.id) return;

      try {
        await apiClient.apiNotificationsRead(String(notification.id), {
          type: notification.type,
          message: notification.message,
          content: notification.content,
        });

        setNotifications((prevNotifications) =>
          prevNotifications.filter((item) => item.id !== notification.id),
        );

        setUnreadCount((prevCount) => Math.max(prevCount - 1, 0));
      } catch (error) {
        console.error('Unable to mark notification as read', error);
      }
    },
    [],
  );

  const markAllAsRead = useCallback(async () => {
    try {
      await axiosInstance.post('/api/notifications/read-all/');

      setNotifications([]);
      setUnreadCount(0);
    } catch (error) {
      console.error('Unable to mark all notifications as read', error);
    }
  }, []);

  useEffect(() => {
    fetchNotifications(page, isAll);
  }, [fetchNotifications, isAll, page]);

  useEffect(() => {
    const wsUrl = import.meta.env.VITE_WS_URL;

    if (!wsUrl || !sessionUser?.username) {
      return () => undefined;
    }

    const socket = new WebSocket(wsUrl);
    wsRef.current = socket;

    socket.onopen = () => {
      socket.send(
        JSON.stringify({
          event: 'notification-add',
          data: sessionUser.username,
        }),
      );
    };

    socket.onmessage = (event) => {
      try {
        const payload = JSON.parse(event.data ?? '{}');
        const channel = `notification-${sessionUser.username}`;

        if (payload.event !== channel || !payload.data) return;

        const incomingNotification: Notification = payload.data;

        setNotifications((prevNotifications) => {
          if (prevNotifications.some((item) => item.id === incomingNotification.id)) {
            return prevNotifications;
          }

          return [incomingNotification, ...prevNotifications];
        });
        setUnreadCount((prevCount) => prevCount + 1);
      } catch (error) {
        console.error('Unable to process incoming notification', error);
      }
    };

    return () => {
      try {
        socket.send(
          JSON.stringify({
            event: 'notification-delete',
            data: sessionUser.username,
          }),
        );
      } catch (error) {
        console.error('Unable to send notification delete event', error);
      }

      socket.close();
      wsRef.current = null;
    };
  }, [sessionUser?.username]);

  const toggleView = () => {
    setPage(1);
    setIsAll((prev) => !prev);
  };

  const handlePageChange = (value: number) => {
    setPage(value);
  };

  const renderKepcoinEarnLabel = (earnType?: number) => {
    switch (earnType) {
      case 4:
        return t('notifications_bonus_from_admin');
      case 7:
        return t('notifications_daily_rating_winner');
      case 8:
        return t('notifications_weekly_rating_winner');
      case 9:
        return t('notifications_monthly_rating_winner');
      default:
        return t('notifications_new_reward');
    }
  };

  const renderNotificationBody = (notification: Notification) => {
    const content = parseContent(notification.content);

    switch (notification.type) {
      case NotificationType.NUMBER_1:
        return notification.message || t('notifications_new_message');
      case NotificationType.NUMBER_2: {
        const delta = typeof content?.delta === 'number' ? content.delta : null;
        const deltaColor = delta === null ? 'default' : delta > 0 ? 'success' : delta < 0 ? 'error' : 'default';

        return (
          <Stack direction="row" alignItems="center" gap={1} flexWrap="wrap">
            <Typography component="span" variant="body2" fontWeight={600} color="text.primary">
              {content?.contestTitle || t('notifications_contest_finished')}
            </Typography>
            <Typography component="span" variant="body2" color="text.secondary">
              {t('notifications_contest_finished')}
            </Typography>
            {delta !== null && (
              <Chip
                label={`${delta > 0 ? '+' : ''}${delta}`}
                size="small"
                color={deltaColor as any}
                variant="outlined"
              />
            )}
          </Stack>
        );
      }
      case NotificationType.NUMBER_3:
        return (
          <Typography component="span" variant="body2" color="text.secondary">
            {renderKepcoinEarnLabel(content?.earnType)}
            {content?.kepcoin ? ` • ${content.kepcoin} Kepcoin` : ''}
          </Typography>
        );
      case NotificationType.NUMBER_4:
        return t('notifications_challenge_call_accepted');
      case NotificationType.NUMBER_5:
        return t('notifications_challenge_finished');
      case NotificationType.NUMBER_6:
        return t('notifications_arena_finished');
      case NotificationType.NUMBER_7:
        return t('notifications_duel_starts');
      case NotificationType.NUMBER_8:
        return t('notifications_new_achievement');
      default:
        return notification.message || t('notifications_new_message');
    }
  };

  const renderTimestamp = (notification: Notification) => {
    if (notification.createdNaturaltime) return notification.createdNaturaltime;
    if (notification.created) return dayjs(notification.created).fromNow();

    return '';
  };

  const hasUnread = useMemo(() => !isAll && unreadCount > 0, [isAll, unreadCount]);

  return (
    <>
      <Button
        color="neutral"
        variant={type === 'default' ? 'soft' : 'text'}
        shape="circle"
        size={type === 'slim' ? 'small' : 'medium'}
        onClick={handleToggle}
      >
        <OutlinedBadge
          variant={hasUnread ? 'dot' : undefined}
          color="error"
          badgeContent={hasUnread ? unreadCount : undefined}
          sx={{
            [`& .${badgeClasses.badge}`]: {
              height: hasUnread ? 18 : 10,
              minWidth: hasUnread ? 18 : 10,
              width: hasUnread ? 18 : 10,
              top: hasUnread ? 2 : -2,
              right: hasUnread ? 2 : -2,
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
            maxWidth: 'calc(100vw - 24px)',
            height: 560,
            display: 'flex',
            flexDirection: 'column',
          },
        }}
      >
        <Stack direction="row" alignItems="center" justifyContent="space-between" px={2} py={1.5} gap={1.5}>
          <Stack gap={0.5}>
            <Typography variant="subtitle1">{t('notifications')}</Typography>
            <Badge
              color="primary"
              badgeContent={notifications.length}
              anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
              sx={{ [`& .${badgeClasses.badge}`]: { position: 'relative' } }}
            >
              <Box />
            </Badge>
          </Stack>
          <Stack direction="row" gap={1} alignItems="center">
            {!isAll && (
              <Button
                size="small"
                variant="outlined"
                color="primary"
                onClick={markAllAsRead}
                disabled={!notifications.length || isLoading}
              >
                {t('notifications_mark_all_read')}
              </Button>
            )}
            <Button size="small" variant="soft" color="neutral" onClick={toggleView} disabled={isLoading}>
              {isAll ? t('notifications_unread') : t('notifications_all')}
            </Button>
          </Stack>
        </Stack>
        <Divider />

        <Box sx={{ flex: 1, overflow: 'hidden' }}>
          {isLoading ? (
            <Stack alignItems="center" justifyContent="center" height="100%" py={4} gap={1}>
              <CircularProgress size={28} />
              <Typography variant="body2" color="text.secondary">
                {t('notifications_loading')}
              </Typography>
            </Stack>
          ) : notifications.length > 0 ? (
            <SimpleBar disableHorizontal style={{ maxHeight: 400 }}>
              <List dense disablePadding>
                {notifications.map((notification) => (
                  <ListItem
                    key={notification.id}
                    secondaryAction={!isAll && (
                      <IconButton edge="end" aria-label={t('notifications_mark_read')} onClick={() => markNotificationAsRead(notification)}>
                        <IconifyIcon icon="material-symbols:close-rounded" />
                      </IconButton>
                    )}
                    sx={{
                      '& .MuiListItemSecondaryAction-root': {
                        right: 16,
                      },
                    }}
                  >
                    <ListItemButton
                      disableRipple
                      onClick={() => {
                        if (!isAll) {
                          markNotificationAsRead(notification);
                        }
                      }}
                      sx={{
                        borderRadius: 1,
                        alignItems: 'flex-start',
                        gap: 1.5,
                        py: 1.5,
                      }}
                    >
                      <Box
                        sx={{
                          height: 36,
                          width: 36,
                          borderRadius: '50%',
                          bgcolor: 'primary.soft',
                          display: 'grid',
                          placeItems: 'center',
                          color: 'primary.main',
                        }}
                      >
                        <IconifyIcon icon="material-symbols:notifications" />
                      </Box>

                      <ListItemText
                        primary={
                          <Typography variant="body2" color="text.primary" sx={{ wordBreak: 'break-word' }}>
                            {renderNotificationBody(notification)}
                          </Typography>
                        }
                        secondary={
                          <Typography variant="caption" color="text.secondary">
                            {renderTimestamp(notification)}
                          </Typography>
                        }
                      />
                    </ListItemButton>
                  </ListItem>
                ))}
              </List>
            </SimpleBar>
          ) : (
            <Stack alignItems="center" justifyContent="center" py={5} px={2} gap={1.5}>
              <IconifyIcon icon="material-symbols:notifications-off-outline-rounded" sx={{ fontSize: 32 }} />
              <Typography variant="body2" color="text.secondary" textAlign="center">
                {t('notifications_empty')}
              </Typography>
            </Stack>
          )}
        </Box>

        {pagesCount > 1 && (
          <Stack alignItems="center" justifyContent="center" py={1.5}>
            <Stack direction="row" spacing={1}>
              <Button
                size="small"
                variant="outlined"
                disabled={page <= 1}
                onClick={() => handlePageChange(page - 1)}
              >
                {t('notifications_previous')}
              </Button>
              <Button
                size="small"
                variant="outlined"
                disabled={page >= pagesCount}
                onClick={() => handlePageChange(page + 1)}
              >
                {t('notifications_next')}
              </Button>
            </Stack>
          </Stack>
        )}
      </Popover>
    </>
  );
};

export default NotificationMenu;

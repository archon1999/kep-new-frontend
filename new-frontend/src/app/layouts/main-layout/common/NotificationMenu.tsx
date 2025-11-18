import { useCallback, useEffect, useState } from 'react';
import {
  Box,
  Button,
  CircularProgress,
  IconButton,
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
import {
  ApiNotificationsAllList200,
  ApiNotificationsList200,
  Notification,
} from 'shared/api/orval/generated/endpoints';
import IconifyIcon from 'shared/components/base/IconifyIcon';
import SimpleBar from 'shared/components/base/SimpleBar';
import OutlinedBadge from 'shared/components/styled/OutlinedBadge';

dayjs.extend(relativeTime);

enum NotificationTypeEnum {
  System = 1,
  ContestRatingChanges,
  KepcoinEarn,
  ChallengeCallAccept,
  ChallengeFinished,
  ArenaFinished,
  DuelStarts,
  NewAchievement,
}

interface NotificationContent {
  arena?: { id: number; title?: string };
  challengeId?: number;
  contestId?: number;
  contestTitle?: string;
  delta?: number;
  duel?: { id?: number };
  earnType?: number;
  kepcoin?: number;
}

const NOTIFICATION_PAGE_SIZE = 4;

interface NotificationMenuProps {
  type?: 'default' | 'slim';
}

const NotificationMenu = ({ type = 'default' }: NotificationMenuProps) => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [page, setPage] = useState(1);
  const [pagesCount, setPagesCount] = useState(0);
  const [totalUnread, setTotalUnread] = useState(0);
  const [isAll, setIsAll] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

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

  const parseNotificationContent = useCallback((content?: Notification['content']) => {
    if (!content) return undefined;

    if (typeof content === 'string') {
      try {
        return JSON.parse(content) as NotificationContent;
      } catch {
        return content;
      }
    }

    return content as unknown as NotificationContent;
  }, []);

  const formatNotificationTitle = useCallback(
    (notification: Notification) => {
      if (notification.message) return notification.message;

      const parsedContent = parseNotificationContent(notification.content);
      const type = Number(notification.type);

      if (
        type === NotificationTypeEnum.ContestRatingChanges &&
        parsedContent &&
        typeof parsedContent === 'object'
      ) {
        const delta = (parsedContent as NotificationContent).delta;
        const contestTitle =
          (parsedContent as NotificationContent).contestTitle ?? 'Contest finished | Results';
        const deltaText = typeof delta === 'number' ? `${delta > 0 ? '+' : ''}${delta}` : '';

        return `${contestTitle}${deltaText ? ` | ${deltaText}` : ''}`;
      }

      if (
        type === NotificationTypeEnum.KepcoinEarn &&
        parsedContent &&
        typeof parsedContent === 'object'
      ) {
        const { kepcoin, earnType } = parsedContent as NotificationContent;
        const earnTitleMap: Record<number, string> = {
          4: 'Bonus from admin',
          7: 'Daily rating winner',
          8: 'Weekly rating winner',
          9: 'Monthly rating winner',
        };

        const earnText = earnType ? (earnTitleMap[earnType] ?? 'Kepcoin earned') : 'Kepcoin earned';
        const kepcoinValue = typeof kepcoin === 'number' ? ` +${kepcoin} Kepcoin` : '';

        return `${earnText}${kepcoinValue}`;
      }

      if (type === NotificationTypeEnum.ChallengeCallAccept) return 'Challenge call accepted';
      if (type === NotificationTypeEnum.ChallengeFinished) return 'Challenge finished | Results';

      if (
        type === NotificationTypeEnum.ArenaFinished &&
        parsedContent &&
        typeof parsedContent === 'object'
      ) {
        const arenaTitle = (parsedContent as NotificationContent).arena?.title;
        return arenaTitle ? `${arenaTitle} | Arena finished` : 'Arena finished | Results';
      }

      if (type === NotificationTypeEnum.DuelStarts) return 'Duel starts';
      if (type === NotificationTypeEnum.NewAchievement) return 'New achievement unlocked';

      if (typeof parsedContent === 'string') return parsedContent;

      return 'Notification';
    },
    [parseNotificationContent],
  );

  const formatNotificationTime = useCallback((notification: Notification) => {
    if (notification.createdNaturaltime) return notification.createdNaturaltime;
    if (notification.created) return dayjs(notification.created).fromNow();
    return '';
  }, []);

  const fetchNotifications = useCallback(
    async (pageToLoad = 1, append = false) => {
      setIsLoading(true);
      try {
        const request = isAll
          ? apiClient.apiNotificationsAllList({
              page: pageToLoad,
              pageSize: NOTIFICATION_PAGE_SIZE,
            })
          : apiClient.apiNotificationsList({ page: pageToLoad, pageSize: NOTIFICATION_PAGE_SIZE });

        const response = await request;
        const {
          data,
          pagesCount: totalPages,
          page: currentPage,
          total,
        } = response as ApiNotificationsAllList200 | ApiNotificationsList200;

        setNotifications((prev) => (append ? [...prev, ...data] : data));
        setPage(currentPage ?? pageToLoad);
        setPagesCount(totalPages ?? 0);
        if (!isAll) setTotalUnread(total ?? 0);
      } catch {
        setNotifications([]);
      } finally {
        setIsLoading(false);
      }
    },
    [isAll],
  );

  useEffect(() => {
    if (open) {
      fetchNotifications();
    }
  }, [open, fetchNotifications]);

  const handleMarkRead = async (id?: number) => {
    if (!id || isAll) return;

    try {
      await apiClient.apiNotificationsRead(String(id), {});
      setNotifications((prev) => prev.filter((item) => item.id !== id));
      setTotalUnread((prev) => Math.max(prev - 1, 0));
    } catch {
      /* handled silently */
    }
  };

  const handleReadAll = async () => {
    if (isAll || !notifications.length) return;

    try {
      await apiClient.apiNotificationsReadAll({});
      setNotifications([]);
      setTotalUnread(0);
    } catch {
      /* handled silently */
    }
  };

  const handleToggleView = () => {
    setIsAll((prev) => !prev);
    setPage(1);
    setNotifications([]);
  };

  const handleLoadMore = () => {
    if (page < pagesCount && !isLoading) {
      fetchNotifications(page + 1, true);
    }
  };

  const unreadBadgeVisible = !isAll && totalUnread > 0;
  const hasNotifications = notifications.length > 0;
  const showLoadMore = page < pagesCount;

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
          invisible={!unreadBadgeVisible}
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
        <Stack
          direction="row"
          alignItems="center"
          justifyContent="space-between"
          sx={{ px: 2, pt: 2, pb: 1, borderBottom: '1px solid', borderColor: 'divider' }}
          spacing={1}
        >
          <Typography variant="h6">Notifications</Typography>
          <Stack direction="row" spacing={1} alignItems="center">
            {!isAll && (
              <Button
                size="small"
                color="primary"
                onClick={handleReadAll}
                disabled={isLoading || !notifications.length}
              >
                Mark all read
              </Button>
            )}
            <Button size="small" variant="outlined" onClick={handleToggleView} disabled={isLoading}>
              {isAll ? 'Show unread' : 'Show all'}
            </Button>
          </Stack>
        </Stack>
        <Box sx={{ flex: 1, overflow: 'hidden' }}>
          <SimpleBar disableHorizontal style={{ maxHeight: '100%' }}>
            {isLoading && !hasNotifications ? (
              <Stack alignItems="center" justifyContent="center" sx={{ py: 6 }}>
                <CircularProgress size={28} />
              </Stack>
            ) : (
              <>
                {hasNotifications ? (
                  notifications.map((notification) => (
                    <Stack
                      key={notification.id ?? `${notification.created}-${notification.message}`}
                      direction="row"
                      alignItems="flex-start"
                      spacing={1.5}
                      sx={{ px: 2, py: 1.5, borderBottom: '1px solid', borderColor: 'divider' }}
                    >
                      <Box
                        sx={{
                          width: 40,
                          height: 40,
                          borderRadius: '50%',
                          bgcolor: 'primary.softBg',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          color: 'primary.main',
                          flexShrink: 0,
                        }}
                      >
                        <IconifyIcon icon="material-symbols:notifications" sx={{ fontSize: 22 }} />
                      </Box>
                      <Stack spacing={0.5} flex={1} minWidth={0}>
                        <Typography
                          variant="body2"
                          color="text.primary"
                          sx={{ wordBreak: 'break-word' }}
                        >
                          {formatNotificationTitle(notification)}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          {formatNotificationTime(notification)}
                        </Typography>
                      </Stack>
                      {!isAll && (
                        <IconButton
                          size="small"
                          aria-label="Mark notification as read"
                          onClick={() => handleMarkRead(notification.id)}
                          disabled={isLoading}
                        >
                          <IconifyIcon icon="mdi:check" sx={{ fontSize: 18 }} />
                        </IconButton>
                      )}
                    </Stack>
                  ))
                ) : (
                  <Stack alignItems="center" justifyContent="center" sx={{ py: 6 }} spacing={1}>
                    <IconifyIcon
                      icon="material-symbols:notifications-off-rounded"
                      sx={{ fontSize: 40, color: 'text.disabled' }}
                    />
                    <Typography variant="body2" color="text.secondary" textAlign="center">
                      {isAll ? 'No notifications yet' : 'No unread notifications'}
                    </Typography>
                  </Stack>
                )}
              </>
            )}
          </SimpleBar>
        </Box>
        {showLoadMore && (
          <Stack
            sx={{
              justifyContent: 'center',
              alignItems: 'center',
              py: 1,
            }}
          >
            <Button variant="text" color="primary" disabled={isLoading} onClick={handleLoadMore}>
              Load more notifications
            </Button>
          </Stack>
        )}
      </Popover>
    </>
  );
};

export default NotificationMenu;

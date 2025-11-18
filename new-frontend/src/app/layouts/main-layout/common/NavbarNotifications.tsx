import { useCallback, useMemo, useState } from 'react';
import {
  Avatar,
  Box,
  Button,
  CircularProgress,
  Divider,
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
import { useSettingsContext } from 'app/providers/SettingsProvider';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import IconifyIcon from 'shared/components/base/IconifyIcon';
import SimpleBar from 'shared/components/base/SimpleBar';
import OutlinedBadge from 'shared/components/styled/OutlinedBadge';
import { getSnippetsAPI } from 'shared/api/orval/generated/endpoints';
import type { ApiNotificationsList200, Notification } from 'shared/api/orval/generated/endpoints/index.schemas';

dayjs.extend(relativeTime);

type ApiNotification = ApiNotificationsList200['data'][number];

const notificationTypeIcons: Record<number, string> = {
  1: 'material-symbols:notifications-outline-rounded',
  2: 'material-symbols:mail-outline-rounded',
  3: 'material-symbols:person-alert-outline',
  4: 'material-symbols:event-note-outline-rounded',
  5: 'material-symbols:chat-outline-rounded',
  6: 'material-symbols:task-outline-rounded',
  7: 'material-symbols:campaign-outline',
  8: 'material-symbols:star-outline-rounded',
};

const iconBackgrounds: Record<number, string> = {
  1: 'primary.main',
  2: 'info.main',
  3: 'warning.main',
  4: 'success.main',
  5: 'secondary.main',
  6: 'text.secondary',
  7: 'error.main',
  8: 'primary.dark',
};

const formatNotificationTime = (notification: Notification) => {
  if (notification.createdNaturaltime) return notification.createdNaturaltime;

  return notification.created ? dayjs(notification.created).fromNow() : '';
};

const getNotificationTitle = (notification: Notification) => {
  return notification.message || notification.content || 'Notification';
};

const NavbarNotifications = ({ type = 'default' }: { type?: 'default' | 'slim' }) => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [notifications, setNotifications] = useState<ApiNotification[]>([]);
  const [page, setPage] = useState(1);
  const [pagesCount, setPagesCount] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const [error, setError] = useState('');

  const { config } = useSettingsContext();

  const snippetsApi = useMemo(() => getSnippetsAPI(), []);

  const loadNotifications = useCallback(
    async (nextPage = 1, append = false) => {
      setIsLoading(true);
      setError('');

      try {
        const response = await snippetsApi.apiNotificationsList({ page: nextPage, pageSize: 10 });

        setNotifications((prev) =>
          append ? [...prev, ...(response.data ?? [])] : (response.data as ApiNotification[]),
        );
        setPage(response.page || nextPage);
        setPagesCount(response.pagesCount || nextPage);
        setIsLoaded(true);
      } catch (fetchError) {
        setError(
          fetchError instanceof Error ? fetchError.message : 'Failed to load notifications',
        );
      } finally {
        setIsLoading(false);
      }
    },
    [snippetsApi],
  );

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);

    if (!isLoaded) {
      loadNotifications();
    }
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const hasMore = page < pagesCount;

  const renderNotification = (notification: ApiNotification) => {
    const icon = notificationTypeIcons[notification.type] || 'material-symbols:notifications-outline';
    const background = iconBackgrounds[notification.type] || 'primary.main';

    return (
      <ListItem
        key={notification.id}
        alignItems="flex-start"
        sx={{
          px: 2,
          py: 1.5,
          '&:hover': { backgroundColor: 'action.hover' },
        }}
      >
        <ListItemAvatar>
          <Avatar
            sx={{
              bgcolor: background,
              color: 'common.white',
              height: 40,
              width: 40,
            }}
          >
            <IconifyIcon icon={icon} />
          </Avatar>
        </ListItemAvatar>
        <ListItemText
          primary={
            <Typography variant="body2" color="text.primary" sx={{ fontWeight: 600 }}>
              {getNotificationTitle(notification)}
            </Typography>
          }
          secondary={
            <Typography variant="caption" color="text.secondary">
              {formatNotificationTime(notification)}
            </Typography>
          }
        />
      </ListItem>
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
        open={Boolean(anchorEl)}
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
            width: 400,
            height: 650,
            display: 'flex',
            flexDirection: 'column',
          },
        }}
      >
        <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ px: 2, pt: 2 }}>
          <Typography variant="h6">Notifications</Typography>
          {isLoading && <CircularProgress size={18} />}
        </Stack>

        <Divider sx={{ mt: 1 }} />

        <Box sx={{ flex: 1, overflow: 'hidden' }}>
          <SimpleBar disableHorizontal>
            <List>
              {notifications.map((notification) => renderNotification(notification))}
            </List>

            {!notifications.length && !isLoading && (
              <Stack sx={{ py: 4, alignItems: 'center' }}>
                <IconifyIcon icon="mdi:bell-off-outline" width={36} height={36} color="text.secondary" />
                <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                  No notifications yet
                </Typography>
              </Stack>
            )}

            {error && (
              <Stack sx={{ py: 2, px: 2 }}>
                <Typography variant="body2" color="error.main">
                  {error}
                </Typography>
                <Button variant="outlined" size="small" sx={{ mt: 1, alignSelf: 'flex-start' }} onClick={() => loadNotifications(page)}>
                  Retry
                </Button>
              </Stack>
            )}
          </SimpleBar>
        </Box>

        <Divider />

        <Stack
          sx={{
            justifyContent: 'center',
            alignItems: 'center',
            py: 1.5,
            px: 2,
            gap: 1,
          }}
        >
          {hasMore && (
            <Button
              variant="outlined"
              fullWidth
              disabled={isLoading}
              onClick={() => loadNotifications(page + 1, true)}
            >
              {isLoading ? 'Loading...' : 'Load more'}
            </Button>
          )}
          <Button
            component="a"
            href="/notifications"
            variant="text"
            color="primary"
            fullWidth
            onClick={handleClose}
          >
            View all notifications
          </Button>
        </Stack>
      </Popover>
    </>
  );
};

export default NavbarNotifications;

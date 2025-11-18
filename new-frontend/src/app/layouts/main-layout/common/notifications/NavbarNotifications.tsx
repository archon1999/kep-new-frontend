import { useCallback, useEffect, useMemo, useState } from 'react';
import {
  Box,
  Button,
  CircularProgress,
  Divider,
  List,
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
import { NotificationType, getSnippetsAPI } from 'shared/api/orval/generated/endpoints';
import type {
  Notification,
  NotificationBody,
} from 'shared/api/orval/generated/endpoints/index.schemas';
import IconifyIcon from 'shared/components/base/IconifyIcon';
import SimpleBar from 'shared/components/base/SimpleBar';
import OutlinedBadge from 'shared/components/styled/OutlinedBadge';

dayjs.extend(relativeTime);

interface NavbarNotificationsProps {
  type?: 'default' | 'slim';
}

const NavbarNotifications = ({ type = 'default' }: NavbarNotificationsProps) => {
  const api = useMemo(() => getSnippetsAPI(), []);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [newNotifications, setNewNotifications] = useState<Notification[]>([]);
  const [historyNotifications, setHistoryNotifications] = useState<Notification[]>([]);
  const [updatingId, setUpdatingId] = useState<number | null>(null);

  const {
    config: { textDirection },
  } = useSettingsContext();

  const open = Boolean(anchorEl);

  const buildBody = (notification?: Notification): NotificationBody => ({
    type: notification?.type ?? NotificationType.NUMBER_1,
    message: notification?.message ?? null,
  });

  const fetchNotifications = useCallback(async () => {
    setIsLoading(true);
    setError('');

    try {
      const [latest, all] = await Promise.all([
        api.apiNotificationsList({ page: 1, pageSize: 10 }),
        api.apiNotificationsAllList({ page: 1, pageSize: 10 }),
      ]);

      const latestItems = latest?.data ?? [];
      const allItems = all?.data ?? [];
      const seenIds = new Set(latestItems.map((item) => item.id).filter(Boolean));
      const historicItems = allItems.filter((item) => !item.id || !seenIds.has(item.id));

      setNewNotifications(latestItems);
      setHistoryNotifications(historicItems);
    } catch {
      setError('Failed to load notifications.');
    } finally {
      setIsLoading(false);
    }
  }, [api]);

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const markAllAsRead = async () => {
    try {
      await api.apiNotificationsReadAll(buildBody());
      await fetchNotifications();
    } catch {
      setError('Failed to mark all notifications as read.');
    }
  };

  const handleItemClick = async (notification: Notification) => {
    if (!notification.id) return;

    setUpdatingId(notification.id);
    try {
      await api.apiNotificationsRead(String(notification.id), buildBody(notification));
      await fetchNotifications();
    } catch {
      setError('Failed to update notification.');
    } finally {
      setUpdatingId(null);
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, [fetchNotifications]);

  const renderList = (title: string, items: Notification[], showUnreadDot?: boolean) => (
    <List
      subheader={
        <Typography
          variant="body2"
          fontWeight={700}
          sx={{ px: 2, pb: 1, pt: 1.5, color: 'text.primary' }}
        >
          {title}
        </Typography>
      }
      sx={{ py: 0 }}
    >
      {items.map((notification) => (
        <ListItemButton
          key={`${title}-${notification.id ?? notification.created}`}
          onClick={() => handleItemClick(notification)}
          sx={{
            alignItems: 'flex-start',
            gap: 1.25,
            py: 1.5,
            px: 2,
            '&:hover': {
              bgcolor: 'background.elevation1',
            },
          }}
        >
          {showUnreadDot ? (
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                pt: 0.5,
              }}
            >
              <Box
                sx={{
                  height: 10,
                  width: 10,
                  bgcolor: 'error.main',
                  borderRadius: '50%',
                }}
              />
            </Box>
          ) : (
            <IconifyIcon
              icon="material-symbols:notifications"
              sx={{ color: 'text.disabled', fontSize: 20, mt: 0.25 }}
            />
          )}

          <ListItemText
            primary={notification.content || notification.message || 'Notification'}
            secondary={
              notification.createdNaturaltime ||
              (notification.created ? dayjs(notification.created).fromNow() : undefined)
            }
            primaryTypographyProps={{
              variant: 'body2',
              color: 'text.primary',
              sx: { lineClamp: 2 },
            }}
            secondaryTypographyProps={{ variant: 'caption', color: 'text.secondary' }}
          />

          {updatingId === notification.id && <CircularProgress size={16} />}
        </ListItemButton>
      ))}
    </List>
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
          variant={newNotifications.length > 0 ? 'dot' : 'standard'}
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
            maxWidth: '100%',
            display: 'flex',
            flexDirection: 'column',
          },
        }}
      >
        <Stack
          direction="row"
          alignItems="center"
          justifyContent="space-between"
          sx={{ px: 2, pt: 2 }}
        >
          <Typography variant="h6">Notifications</Typography>
          <Button
            size="small"
            variant="text"
            color="primary"
            onClick={markAllAsRead}
            disabled={isLoading}
          >
            Mark all read
          </Button>
        </Stack>
        <Divider sx={{ my: 1 }} />

        <Box sx={{ pt: 0.5, flex: 1, overflow: 'hidden' }}>
          {isLoading ? (
            <Stack alignItems="center" justifyContent="center" sx={{ py: 4 }}>
              <CircularProgress size={24} />
            </Stack>
          ) : (
            <SimpleBar disableHorizontal>
              {newNotifications.length > 0 && renderList('New', newNotifications, true)}
              {historyNotifications.length > 0 && renderList('Earlier', historyNotifications)}

              {newNotifications.length === 0 && historyNotifications.length === 0 && (
                <Stack alignItems="center" justifyContent="center" sx={{ py: 6, px: 2 }}>
                  <IconifyIcon
                    icon="material-symbols:notifications-off"
                    sx={{ color: 'text.disabled', fontSize: 36 }}
                  />
                  <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                    You are all caught up.
                  </Typography>
                </Stack>
              )}
            </SimpleBar>
          )}
        </Box>

        {error && (
          <Typography variant="caption" color="error" sx={{ px: 2, pb: 1 }}>
            {error}
          </Typography>
        )}
      </Popover>
    </>
  );
};

export default NavbarNotifications;

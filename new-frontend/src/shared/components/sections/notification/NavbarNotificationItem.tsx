import { Avatar, IconButton, Stack, Typography, useTheme } from '@mui/material';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';

import { Notification as ApiNotification } from 'shared/api/orval/generated/endpoints';
import IconifyIcon from 'shared/components/base/IconifyIcon';

dayjs.extend(relativeTime);

const notificationVisuals: Record<number, { icon: string; color: string }> = {
  1: { icon: 'material-symbols:info-outline', color: 'info.main' },
  2: { icon: 'material-symbols:trending-up-rounded', color: 'success.main' },
  3: { icon: 'solar:coin-bold', color: 'warning.main' },
  4: { icon: 'mdi:handshake-outline', color: 'primary.main' },
  5: { icon: 'mdi:trophy-outline', color: 'success.main' },
  6: { icon: 'mdi:sword-cross', color: 'secondary.main' },
  7: { icon: 'material-symbols:swords-outline', color: 'error.main' },
  8: { icon: 'mdi:medal-outline', color: 'info.main' },
};

interface NavbarNotificationItemProps {
  notification: ApiNotification;
  onMarkRead?: (notification: ApiNotification) => void;
}

const NavbarNotificationItem = ({ notification, onMarkRead }: NavbarNotificationItemProps) => {
  const theme = useTheme();
  const visuals = notification.type ? notificationVisuals[notification.type] ?? notificationVisuals[1] : notificationVisuals[1];

  const message = notification.message ?? 'Notification';
  const createdAtLabel = notification.createdNaturaltime
    ? notification.createdNaturaltime
    : notification.created
      ? dayjs(notification.created).fromNow()
      : '';

  return (
    <Stack
      direction="row"
      spacing={1.5}
      alignItems="center"
      sx={{
        px: 2,
        py: 1.5,
        borderBottom: `1px solid ${theme.palette.divider}`,
      }}
    >
      <Avatar
        sx={{
          bgcolor: visuals.color,
          width: 40,
          height: 40,
        }}
      >
        <IconifyIcon icon={visuals.icon} sx={{ color: theme.palette.common.white }} />
      </Avatar>
      <Stack spacing={0.5} flex={1} minWidth={0}>
        <Typography variant="body2" color="text.primary" sx={{ wordBreak: 'break-word' }}>
          {message}
        </Typography>
        {createdAtLabel && (
          <Typography variant="caption" color="text.secondary">
            {createdAtLabel}
          </Typography>
        )}
      </Stack>
      <IconButton size="small" color="inherit" onClick={() => onMarkRead?.(notification)}>
        <IconifyIcon icon="material-symbols:close-rounded" />
      </IconButton>
    </Stack>
  );
};

export default NavbarNotificationItem;

import { Chip, IconButton, Stack, Typography, alpha, useTheme } from '@mui/material';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import { Notification, NotificationType } from 'shared/api/orval/generated/endpoints';
import IconifyIcon from 'shared/components/base/IconifyIcon';

interface NotificationItemProps {
  notification: Notification;
  disableActions?: boolean;
  onRead?: (id: number) => void;
}

interface NotificationDescription {
  title: string;
  badge?: { label: string; color: 'success' | 'default' | 'error' };
}

dayjs.extend(relativeTime);

type ParsedContent = Record<string, any> | string | null;

const parseContent = (content?: string | null): ParsedContent => {
  if (!content) return null;

  if (typeof content === 'string') {
    try {
      return JSON.parse(content);
    } catch {
      return content;
    }
  }

  return content;
};

const buildDescription = (notification: Notification): NotificationDescription => {
  const content = parseContent(notification.content);

  switch (notification.type) {
    case NotificationType.NUMBER_1:
      return { title: notification.message ?? 'System notification' };
    case NotificationType.NUMBER_2: {
      const delta = typeof content === 'object' ? content?.delta : null;
      const contestTitle = typeof content === 'object' ? content?.contestTitle : null;
      const contestChange = delta ? `${delta > 0 ? '+' : ''}${delta}` : null;

      return {
        title: contestTitle ? `${contestTitle} • Rating update` : notification.message ?? 'Contest rating update',
        badge: contestChange ? { label: contestChange, color: delta > 0 ? 'success' : delta === 0 ? 'default' : 'error' } : undefined,
      };
    }
    case NotificationType.NUMBER_3: {
      const kepcoin = typeof content === 'object' ? content?.kepcoin : null;
      return {
        title:
          kepcoin && Number.isFinite(kepcoin)
            ? `You earned ${kepcoin} Kepcoin`
            : notification.message ?? 'Kepcoin earned',
      };
    }
    case NotificationType.NUMBER_4:
      return { title: notification.message ?? 'Challenge call accepted' };
    case NotificationType.NUMBER_5:
      return { title: notification.message ?? 'Challenge finished' };
    case NotificationType.NUMBER_6: {
      const arenaTitle = typeof content === 'object' ? content?.arena?.title : null;
      return { title: arenaTitle ? `${arenaTitle} • Arena finished` : notification.message ?? 'Arena finished' };
    }
    case NotificationType.NUMBER_7:
      return { title: notification.message ?? 'Duel starts soon' };
    case NotificationType.NUMBER_8:
      return { title: notification.message ?? 'New achievement unlocked' };
    default:
      return { title: notification.message ?? 'Notification' };
  }
};

const NotificationItem = ({ notification, onRead, disableActions }: NotificationItemProps) => {
  const theme = useTheme();
  const description = buildDescription(notification);

  return (
    <Stack
      direction="row"
      spacing={1.5}
      alignItems="flex-start"
      sx={{
        p: 1.5,
        borderRadius: 1.5,
        bgcolor: alpha(theme.palette.background.paper, 0.96),
        boxShadow: (theme.vars || theme).customShadows?.z1,
        '&:hover': {
          boxShadow: (theme.vars || theme).customShadows?.z8,
        },
      }}
    >
      <Stack
        alignItems="center"
        justifyContent="center"
        sx={{
          width: 36,
          height: 36,
          borderRadius: 1,
          bgcolor: alpha(theme.palette.primary.main, 0.08),
          color: theme.palette.primary.main,
          flexShrink: 0,
        }}
      >
        <IconifyIcon icon="material-symbols:notifications-outline-rounded" sx={{ fontSize: 20 }} />
      </Stack>

      <Stack spacing={0.5} flex={1} minWidth={0}>
        <Typography variant="body2" color="text.primary" sx={{ wordBreak: 'break-word' }}>
          {description.title}
        </Typography>
        <Typography variant="caption" color="text.secondary">
          {notification.createdNaturaltime ??
            (notification.created ? dayjs(notification.created).fromNow() : 'Just now')}
        </Typography>
      </Stack>

      {!disableActions && (
        <IconButton
          size="small"
          aria-label="Mark notification as read"
          onClick={() =>
            notification.id !== undefined &&
            notification.id !== null &&
            onRead?.(notification.id)
          }
        >
          <IconifyIcon icon="material-symbols:close-rounded" />
        </IconButton>
      )}

      {description.badge && (
        <Chip
          label={description.badge.label}
          color={description.badge.color === 'default' ? 'default' : description.badge.color}
          variant="outlined"
          size="small"
          sx={{ alignSelf: 'center' }}
        />
      )}
    </Stack>
  );
};

export default NotificationItem;

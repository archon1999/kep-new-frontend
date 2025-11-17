import { useMemo } from 'react';
import { Avatar, Box, Chip, Divider, Paper, Stack, Typography } from '@mui/material';
import Grid from '@mui/material/Grid2';
import IconButton from '@mui/material/IconButton';
import { notificationBadge, notifications } from 'data/notifications';
import dayjs from 'dayjs';
import IconifyIcon from 'shared/components/base/IconifyIcon';

const NotificationRow = ({
  id,
  user,
  detail,
  type,
  createdAt,
  readAt,
  images,
}: (typeof notifications)[number]) => {
  const badge = notificationBadge[type];
  const primaryUser = user?.[0];

  return (
    <Paper
      key={id}
      variant="outlined"
      sx={{
        p: 2,
        borderColor: 'divider',
        backgroundColor: readAt ? 'background.default' : 'action.hover',
      }}
    >
      <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} alignItems={{ sm: 'center' }}>
        <Avatar src={primaryUser?.avatar} alt={primaryUser?.name} sx={{ width: 48, height: 48 }} />
        <Stack flex={1} spacing={1}>
          <Stack direction="row" spacing={1} alignItems="center">
            <Chip
              size="small"
              label={type.replace('_', ' ')}
              sx={{ textTransform: 'capitalize', color: badge.color }}
              icon={<IconifyIcon icon={badge.icon} />}
              variant="soft"
            />
            <Typography variant="caption" color="text.disabled">
              {dayjs(createdAt).fromNow()}
            </Typography>
          </Stack>
          <Typography variant="body1">{detail}</Typography>
          {images && images.length > 0 && (
            <Stack direction="row" spacing={1}>
              {images.map((image) => (
                <Box
                  key={image}
                  component="img"
                  src={image}
                  alt="notification media"
                  sx={{
                    width: 68,
                    height: 68,
                    borderRadius: 2,
                    objectFit: 'cover',
                    border: '1px solid',
                    borderColor: 'divider',
                  }}
                />
              ))}
            </Stack>
          )}
        </Stack>
        <IconButton>
          <IconifyIcon icon="solar:dot-menu-linear" />
        </IconButton>
      </Stack>
    </Paper>
  );
};

const NotificationsPage = () => {
  const groupedNotifications = useMemo(() => {
    const today = dayjs().startOf('day');
    const todayList = notifications.filter((item) => dayjs(item.createdAt).isAfter(today));
    const earlierList = notifications.filter((item) => !dayjs(item.createdAt).isAfter(today));

    return [
      { label: 'Today', data: todayList },
      { label: 'Earlier', data: earlierList },
    ];
  }, []);

  return (
    <Stack spacing={3} sx={{ p: { xs: 2, md: 3 } }}>
      <Paper
        sx={{
          p: { xs: 3, md: 4 },
          background:
            'linear-gradient(120deg, rgba(92,225,230,0.18) 0%, rgba(106,92,255,0.18) 100%)',
          border: '1px solid',
          borderColor: 'divider',
        }}
      >
        <Grid container spacing={2} alignItems="center">
          <Grid size={{ xs: 12, md: 8 }}>
            <Stack spacing={1}>
              <Chip
                label="Notifications"
                color="primary"
                icon={<IconifyIcon icon="solar:bell-bing-bold-duotone" />}
                sx={{ alignSelf: 'flex-start', fontWeight: 600 }}
              />
              <Typography variant="h4" fontWeight={800}>
                All activity in one place
              </Typography>
              <Typography variant="body1" color="text.secondary">
                Catch up on birthdays, follows, comments and invitations pulled from the previous
                experience and refreshed with Aurora styling.
              </Typography>
              <Stack direction="row" spacing={1}>
                <Chip
                  label="Mark all read"
                  variant="outlined"
                  icon={<IconifyIcon icon="solar:check-circle-bold" />}
                />
                <Chip
                  label="Filter"
                  variant="soft"
                  icon={<IconifyIcon icon="solar:filter-linear" />}
                />
              </Stack>
            </Stack>
          </Grid>
          <Grid size={{ xs: 12, md: 4 }}>
            <Box
              sx={{
                height: '100%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'flex-end',
              }}
            >
              <Box
                sx={{
                  width: { xs: '100%', md: 240 },
                  height: 140,
                  borderRadius: 3,
                  background:
                    'radial-gradient(circle at 20% 20%, rgba(92,225,230,0.35), transparent 48%), #0f1329',
                  border: '1px solid',
                  borderColor: 'divider',
                  display: 'grid',
                  placeItems: 'center',
                  color: 'white',
                  textAlign: 'center',
                  p: 2,
                }}
              >
                <IconifyIcon icon="solar:bell-bing-bold-duotone" sx={{ fontSize: 32, mb: 1 }} />
                <Typography variant="subtitle1" fontWeight={700}>
                  Real-time sync
                </Typography>
                <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.8)' }}>
                  Updated as soon as new activity lands.
                </Typography>
              </Box>
            </Box>
          </Grid>
        </Grid>
      </Paper>

      {groupedNotifications.map((section) => (
        <Stack key={section.label} spacing={2}>
          <Stack direction="row" spacing={1} alignItems="center">
            <Typography variant="h6" fontWeight={700}>
              {section.label}
            </Typography>
            <Divider sx={{ flex: 1 }} />
          </Stack>
          <Stack spacing={1.5}>
            {section.data.map((item) => (
              <NotificationRow key={item.id} {...item} />
            ))}
          </Stack>
        </Stack>
      ))}
    </Stack>
  );
};

export default NotificationsPage;

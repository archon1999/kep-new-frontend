import { useMemo } from 'react';
import {
  Avatar,
  AvatarGroup,
  Box,
  Card,
  CardContent,
  CardHeader,
  Skeleton,
  Stack,
  Typography,
} from '@mui/material';
import IconifyIcon from 'shared/components/base/IconifyIcon';
import { useOnlineUsers, useUsersChart } from '../hooks';

const buildSparklinePath = (values: number[], width = 260, height = 90) => {
  if (!values.length) return '';

  const max = Math.max(...values);
  const min = Math.min(...values);
  const diff = max - min || 1;

  return values
    .map((value, index) => {
      const x = (index / Math.max(values.length - 1, 1)) * width;
      const y = height - ((value - min) / diff) * height;
      return `${index === 0 ? 'M' : 'L'}${x.toFixed(2)},${y.toFixed(2)}`;
    })
    .join(' ');
};

const UsersChartCard = () => {
  const { data: onlineUsersData, isLoading: onlineLoading } = useOnlineUsers();
  const { data: chartData, isLoading: chartLoading } = useUsersChart();

  const series = useMemo(() => {
    if (!chartData) return [] as number[];
    if (Array.isArray((chartData as any).series)) return (chartData as any).series as number[];
    if (Array.isArray((chartData as any).data)) return (chartData as any).data as number[];
    return [] as number[];
  }, [chartData]);

  const totalUsers =
    (chartData as any)?.total ??
    (chartData as any)?.count ??
    series.reduce((sum, value) => sum + value, 0);
  const onlineUsers = onlineUsersData?.data ?? [];

  return (
    <Card sx={{ borderRadius: 3, height: '100%' }}>
      <CardHeader
        title={
          <Stack direction="row" alignItems="center" spacing={1}>
            <Typography variant="h5" fontWeight={700}>
              {chartLoading ? <Skeleton width={80} /> : (totalUsers ?? '—')}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Users
            </Typography>
          </Stack>
        }
        action={
          <IconifyIcon
            icon="solar:user-speak-rounded-broken"
            width={28}
            height={28}
            color="#6366f1"
          />
        }
        sx={{ pb: 1 }}
      />
      <CardContent sx={{ pt: 0, display: 'flex', flexDirection: 'column', gap: 2 }}>
        {chartLoading ? (
          <Skeleton variant="rounded" height={96} />
        ) : series.length ? (
          <Box component="svg" viewBox={`0 0 260 90`} width="100%" height={96}>
            <defs>
              <linearGradient id="spark" x1="0" x2="0" y1="0" y2="1">
                <stop offset="0%" stopColor="#6366f1" stopOpacity="0.6" />
                <stop offset="100%" stopColor="#6366f1" stopOpacity="0.05" />
              </linearGradient>
            </defs>
            <path d={`${buildSparklinePath(series, 260, 70)} L260,90 L0,90 Z`} fill="url(#spark)" />
            <path
              d={buildSparklinePath(series, 260, 70)}
              stroke="#6366f1"
              strokeWidth={3}
              fill="none"
            />
          </Box>
        ) : (
          <Typography variant="body2" color="text.secondary" textAlign="center" py={3}>
            No statistics yet.
          </Typography>
        )}

        <Stack direction="row" alignItems="center" spacing={1}>
          <AvatarGroup max={8} sx={{ '& .MuiAvatar-root': { width: 36, height: 36 } }}>
            {onlineLoading
              ? Array.from({ length: 5 }).map((_, index) => (
                  <Avatar key={index} sx={{ bgcolor: 'grey.200' }} />
                ))
              : onlineUsers.map((user) => (
                  <Avatar key={user.username} src={user.avatar} alt={user.username} />
                ))}
          </AvatarGroup>
          <Typography variant="body2" color="text.secondary">
            {onlineLoading ? <Skeleton width={80} /> : `${onlineUsers.length} online`}
          </Typography>
        </Stack>
      </CardContent>
    </Card>
  );
};

export default UsersChartCard;

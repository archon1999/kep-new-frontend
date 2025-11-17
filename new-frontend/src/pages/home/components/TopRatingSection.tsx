import {
  Avatar,
  Box,
  Card,
  CardContent,
  CardHeader,
  Divider,
  Skeleton,
  Stack,
  Typography,
} from '@mui/material';
import IconifyIcon from 'shared/components/base/IconifyIcon';
import { useTopUsers } from '../hooks';

const medalIcons = ['ph:medal-duotone', 'ph:medal-thin', 'ph:medal'];

const TopRatingSection = () => {
  const { data, isLoading } = useTopUsers();
  const users = data?.data ?? [];

  return (
    <Card sx={{ borderRadius: 3, height: '100%' }}>
      <CardHeader title={<Typography fontWeight={700}>Top rating</Typography>} />
      <CardContent sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
        {isLoading
          ? Array.from({ length: 3 }).map((_, index) => (
              <Skeleton key={index} variant="rounded" height={42} />
            ))
          : users.slice(0, 3).map((user, index) => (
              <Stack key={user.username ?? index} direction="row" alignItems="center" spacing={1.5}>
                <IconifyIcon
                  icon={medalIcons[index] ?? medalIcons[0]}
                  width={28}
                  height={28}
                  color="#f59e0b"
                />
                <Avatar src={user.avatar} alt={user.username} sx={{ width: 40, height: 40 }} />
                <Stack flex={1} minWidth={0} spacing={0.25}>
                  <Typography variant="subtitle1" noWrap fontWeight={600}>
                    {user.username}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    {user.firstName || user.lastName
                      ? `${user.firstName ?? ''} ${user.lastName ?? ''}`.trim()
                      : '—'}
                  </Typography>
                </Stack>
                <Stack direction="row" alignItems="center" spacing={0.5}>
                  <IconifyIcon icon="solar:fire-bold" width={18} height={18} color="#f97316" />
                  <Typography variant="body2" color="text.secondary">
                    {user.streak ?? '0'}
                  </Typography>
                </Stack>
              </Stack>
            ))}
        {!isLoading && users.length > 0 ? <Divider sx={{ mt: 1 }} /> : null}
        {!isLoading && users.length === 0 ? (
          <Box display="flex" justifyContent="center" py={2}>
            <Typography variant="body2" color="text.secondary">
              No users in the leaderboard yet.
            </Typography>
          </Box>
        ) : null}
      </CardContent>
    </Card>
  );
};

export default TopRatingSection;

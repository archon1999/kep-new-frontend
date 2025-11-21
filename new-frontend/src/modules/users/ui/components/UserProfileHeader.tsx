import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { Avatar, Box, Chip, Paper, Skeleton, Stack, Typography } from '@mui/material';
import dayjs from 'dayjs';
import { UserDetails } from '../../domain/entities/user.entity';
import CountryFlagIcon from 'shared/components/common/CountryFlagIcon';
import StatusAvatar from 'shared/components/base/StatusAvatar';
import Streak from 'shared/components/rating/Streak';

interface UserProfileHeaderProps {
  user?: UserDetails;
  isLoading?: boolean;
}

const UserProfileHeader = ({ user, isLoading }: UserProfileHeaderProps) => {
  const { t } = useTranslation();

  const fullName = useMemo(() => {
    const joined = [user?.firstName, user?.lastName].filter(Boolean).join(' ');
    return joined || undefined;
  }, [user?.firstName, user?.lastName]);

  const lastSeenLabel = useMemo(() => {
    if (!user?.lastSeen) return undefined;

    const formatted = dayjs(user.lastSeen).format('MMM DD, YYYY HH:mm');
    return `${t('users.columns.lastSeen')}: ${formatted}`;
  }, [t, user?.lastSeen]);

  const status = user?.isOnline ? 'online' : 'offline';

  return (
    <Paper
      background={1}
      sx={{
        position: 'relative',
        overflow: 'hidden',
        minHeight: 240,
      }}
    >
      <Box
        sx={{
          position: 'absolute',
          inset: 0,
          backgroundImage: user?.coverPhoto
            ? `url(${user.coverPhoto})`
            : 'linear-gradient(135deg, rgba(48, 86, 211, 0.28) 0%, rgba(99, 172, 245, 0.28) 100%)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          filter: user?.coverPhoto ? 'brightness(0.8)' : 'none',
        }}
      />

      <Box
        sx={{
          position: 'absolute',
          inset: 0,
          bgcolor: 'rgba(0, 0, 0, 0.35)',
        }}
      />

      <Stack
        direction={{ xs: 'column', md: 'row' }}
        alignItems={{ xs: 'flex-start', md: 'flex-end' }}
        spacing={3}
        sx={{
          position: 'relative',
          p: { xs: 3, md: 4 },
          height: '100%',
          color: 'common.white',
        }}
      >
        {isLoading ? (
          <Skeleton variant="circular" width={96} height={96} />
        ) : user?.avatar ? (
          <StatusAvatar
            status={status}
            src={user.avatar}
            alt={user.username}
            sx={{ width: 96, height: 96, border: '4px solid white' }}
          />
        ) : (
          <Avatar sx={{ width: 96, height: 96, bgcolor: 'primary.main', border: '4px solid white' }}>
            {user?.username?.[0]?.toUpperCase()}
          </Avatar>
        )}

        <Stack direction="column" spacing={1} flex={1} minWidth={0}>
          <Stack direction="row" alignItems="center" spacing={1} flexWrap="wrap">
            {isLoading ? (
              <Skeleton variant="text" width={180} sx={{ bgcolor: 'grey.700' }} />
            ) : (
              <Typography variant="h5" fontWeight={800} noWrap>
                {user?.username}
              </Typography>
            )}

            {user?.country && <CountryFlagIcon code={user.country as string} size={20} />}
          </Stack>

          {isLoading ? (
            <Skeleton variant="text" width={220} sx={{ bgcolor: 'grey.700' }} />
          ) : fullName ? (
            <Typography variant="body1" color="grey.100">
              {fullName}
            </Typography>
          ) : null}

          {lastSeenLabel ? (
            <Typography variant="body2" color="grey.200">
              {lastSeenLabel}
            </Typography>
          ) : null}

          <Stack direction="row" spacing={1.5} flexWrap="wrap" alignItems="center" mt={1}>
            <Chip
              label={
                <Stack direction="row" spacing={1} alignItems="center">
                  <Typography variant="body2" fontWeight={700}>
                    {t('users.profile.kepcoin')}
                  </Typography>
                  <Typography variant="body2">{user?.kepcoin ?? '—'}</Typography>
                </Stack>
              }
              color="default"
              sx={{ bgcolor: 'rgba(255,255,255,0.14)', color: 'inherit' }}
            />

            <Chip
              label={
                <Stack direction="row" spacing={1} alignItems="center">
                  <Typography variant="body2" fontWeight={700}>
                    {t('users.profile.streak')}
                  </Typography>
                  <Streak
                    streak={user?.streak}
                    maxStreak={user?.maxStreak}
                    iconSize={18}
                    direction="row"
                    spacing={0.75}
                    alignItems="center"
                  />
                </Stack>
              }
              color="default"
              sx={{ bgcolor: 'rgba(255,255,255,0.14)', color: 'inherit' }}
            />

            <Chip
              label={
                <Stack direction="row" spacing={1} alignItems="center">
                  <Typography variant="body2" fontWeight={700}>
                    {t('users.profile.maxStreak')}
                  </Typography>
                  <Typography variant="body2">{user?.maxStreak ?? '—'}</Typography>
                </Stack>
              }
              color="default"
              sx={{ bgcolor: 'rgba(255,255,255,0.14)', color: 'inherit' }}
            />
          </Stack>
        </Stack>
      </Stack>
    </Paper>
  );
};

export default UserProfileHeader;

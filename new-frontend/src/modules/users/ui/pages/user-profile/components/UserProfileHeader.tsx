import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { Link as RouterLink } from 'react-router-dom';
import { Avatar, Badge, Box, Button, Chip, Paper, Skeleton, Stack, Typography } from '@mui/material';
import { getResourceByUsername, resources } from 'app/routes/resources';
import { useUserDetails } from 'modules/users/application/queries';
import type { UserDetails } from 'modules/users/domain/entities/user.entity';
import CountryFlagIcon from 'shared/components/common/CountryFlagIcon';
import Streak from 'shared/components/rating/Streak';

interface UserProfileHeaderProps {
  username: string;
}

const Cover = ({ user }: { user?: UserDetails }) => (
  <Box
    sx={{
      position: 'relative',
      height: { xs: 180, md: 220 },
      borderRadius: 4,
      overflow: 'hidden',
      bgcolor: 'background.neutral',
    }}
  >
    {user?.coverPhoto ? (
      <Box
        component="img"
        src={user.coverPhoto}
        alt={`${user.username} cover`}
        sx={{ width: 1, height: 1, objectFit: 'cover' }}
      />
    ) : (
      <Skeleton variant="rectangular" width="100%" height="100%" />
    )}
  </Box>
);

const ProfileSummary = ({ user, username }: { user?: UserDetails; username: string }) => {
  const { t } = useTranslation();
  const fullName = useMemo(
    () => [user?.firstName, user?.lastName].filter(Boolean).join(' '),
    [user?.firstName, user?.lastName],
  );

  return (
    <Stack direction="row" spacing={2} alignItems="center" sx={{ mt: -7 }}>
      <Badge
        overlap="circular"
        variant="dot"
        color={user?.isOnline ? 'success' : 'default'}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Avatar src={user?.avatar} alt={username} sx={{ width: 96, height: 96 }} />
      </Badge>

      <Stack direction="column" spacing={0.5} minWidth={0}>
        <Stack direction="row" spacing={1.5} alignItems="center" flexWrap="wrap">
          <Typography variant="h5" fontWeight={700} noWrap>
            {user?.username ?? username}
          </Typography>

          {user?.country && <CountryFlagIcon code={user.country} size={20} />}

          {user?.streak ? <Streak streak={user.streak} iconSize={20} spacing={0.5} /> : null}
        </Stack>

        {fullName ? (
          <Typography variant="body2" color="text.secondary" noWrap>
            {fullName}
          </Typography>
        ) : null}

        {user?.lastSeen && (
          <Typography variant="caption" color="text.secondary">
            {t('users.profile.lastSeen', { value: user.lastSeen })}
          </Typography>
        )}
      </Stack>

      <Stack direction="row" spacing={1} ml="auto" alignItems="center">
        {typeof user?.kepcoin === 'number' && (
          <Chip label={`${user.kepcoin} kep`} color="primary" variant="soft" />
        )}
        <Button
          component={RouterLink}
          to={getResourceByUsername(resources.UserProfileFollowers, username)}
          variant="outlined"
          size="small"
        >
          {t('users.profile.followers')}
        </Button>
      </Stack>
    </Stack>
  );
};

const UserProfileHeader = ({ username }: UserProfileHeaderProps) => {
  const { data: user, isLoading } = useUserDetails(username);

  return (
    <Paper background={1} sx={{ p: 3, display: 'flex', flexDirection: 'column', gap: 2 }}>
      <Cover user={user ?? undefined} />

      {isLoading ? (
        <Stack direction="column" spacing={1}>
          <Skeleton variant="circular" width={96} height={96} />
          <Skeleton variant="text" width={200} />
          <Skeleton variant="text" width={160} />
        </Stack>
      ) : (
        <ProfileSummary user={user ?? undefined} username={username} />
      )}
    </Paper>
  );
};

export default UserProfileHeader;

import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { useParams } from 'react-router';
import { Box, CircularProgress, Grid, Stack } from '@mui/material';
import { responsivePagePaddingSx } from 'shared/lib/styles';
import HomeActivityHistory from 'modules/home/ui/components/HomeActivityHistory';
import RanksSection from 'modules/home/ui/components/RanksSection';
import { useUserActivityHistory } from 'modules/home/application/queries';
import { useUserDetails, useUserRatings } from '../../application/queries';
import UserProfileHeader from '../components/UserProfileHeader';
import UserProfileInfoCard from '../components/UserProfileInfoCard';

const UserProfilePage = () => {
  const { username = '' } = useParams<{ username: string }>();
  const { t } = useTranslation();

  const { data: user, isLoading: isUserLoading } = useUserDetails(username);
  const { data: ratings, isLoading: isRatingsLoading } = useUserRatings(username);
  const { data: activityHistory, isLoading: isActivityLoading } = useUserActivityHistory(username, 6);

  const displayName = useMemo(
    () => [user?.firstName, user?.lastName].filter(Boolean).join(' ') || user?.username || username,
    [user?.firstName, user?.lastName, user?.username, username],
  );

  if (!username) {
    return null;
  }

  if (isUserLoading && !user) {
    return (
      <Box
        sx={{
          ...responsivePagePaddingSx,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: 360,
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ ...responsivePagePaddingSx, display: 'flex', flexDirection: 'column', gap: 3 }}>
      <UserProfileHeader user={user} isLoading={isUserLoading} />

      <Grid container spacing={3} alignItems="flex-start">
        <Grid size={{ xs: 12, lg: 4 }}>
          <Stack spacing={3}>
            <UserProfileInfoCard user={user} isLoading={isUserLoading} />

            <Box sx={{ bgcolor: 'background.paper', borderRadius: 3, p: { xs: 2, md: 3 }, border: (theme) => `1px solid ${theme.palette.divider}` }}>
              <RanksSection
                ratings={ratings}
                isLoading={isRatingsLoading}
                titleKey="users.profile.ratings"
              />
            </Box>
          </Stack>
        </Grid>

        <Grid size={{ xs: 12, lg: 8 }}>
          <Stack spacing={2}>
            <HomeActivityHistory
              username={username}
              history={activityHistory}
              isLoading={isActivityLoading}
              title={t('users.profile.activityHistory', { name: displayName })}
            />
          </Stack>
        </Grid>
      </Grid>
    </Box>
  );
};

export default UserProfilePage;

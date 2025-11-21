import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { NavLink, Outlet, useLocation, useOutletContext, useParams } from 'react-router';
import {
  Avatar,
  Box,
  Chip,
  Divider,
  Grid,
  Paper,
  Skeleton,
  Stack,
  Tab,
  Tabs,
  Typography,
} from '@mui/material';
import { useUserDetails, useUserRatings } from '../../application/queries';
import { resources } from 'app/routes/resources';
import { formatDistanceToNowStrict } from 'date-fns';
import UserRatingsOverview from '../components/UserRatingsOverview';
import UserPersonalInfoCard from '../components/UserPersonalInfoCard';
import KepIcon from 'shared/components/base/KepIcon';
import { useAuth } from 'app/providers/AuthProvider';

export type UserProfileOutletContext = {
  username: string;
};

const TABS = ['about', 'ratings', 'activity-history', 'achievements'] as const;

const UserProfilePage = () => {
  const { username = '' } = useParams<{ username: string }>();
  const location = useLocation();
  const { t } = useTranslation();
  const { currentUser } = useAuth();

  const { data: user, isLoading } = useUserDetails(username);
  const { data: ratings, isLoading: ratingsLoading } = useUserRatings(username);

  const outletContext: UserProfileOutletContext = { username };

  const activeTab = useMemo(() => {
    const matchingTab = TABS.find((tab) => location.pathname.includes(tab));
    return matchingTab ?? 'about';
  }, [location.pathname]);

  const coverPhoto = user?.coverPhoto ?? '/images/cover-placeholder.jpg';

  return (
    <Stack direction="column" spacing={3}>
      <Paper sx={{ overflow: 'hidden' }}>
        <Box
          sx={{
            height: 180,
            backgroundImage: `url(${coverPhoto})`,
            backgroundSize: 'cover',
            backgroundRepeat: 'no-repeat',
            backgroundPosition: 'center',
          }}
        />

        <Stack
          direction="row"
          spacing={3}
          sx={{
            p: { xs: 2, md: 3 },
            position: 'relative',
            alignItems: 'center',
          }}
        >
          <Avatar
            src={user?.avatar}
            sx={{
              width: 96,
              height: 96,
              border: (theme) => `4px solid ${theme.palette.background.paper}`,
              mt: -9,
            }}
          />

          <Stack direction="column" spacing={0.5} flex={1}>
            <Stack direction="row" alignItems="center" spacing={1} flexWrap="wrap">
              <Typography variant="h5" fontWeight={700} component="div">
                {isLoading ? <Skeleton width={160} /> : user?.username}
              </Typography>

              {user?.streak && user.streak >= 7 ? (
                <Chip
                  color="primary"
                  size="small"
                  icon={<KepIcon name="fire" fontSize={18} />}
                  label={t('userProfile.streak', { value: user.streak })}
                />
              ) : null}

              {user?.isOnline ? (
                <Chip color="success" size="small" label={t('userProfile.status.online')} />
              ) : user?.lastSeen ? (
                <Chip
                  size="small"
                  variant="outlined"
                  label={t('userProfile.status.lastSeen', {
                    value: formatDistanceToNowStrict(new Date(user.lastSeen), { addSuffix: true }),
                  })}
                />
              ) : null}
            </Stack>

            <Typography variant="subtitle1" color="text.secondary">
              {isLoading ? <Skeleton width={200} /> : `${user?.firstName ?? ''} ${user?.lastName ?? ''}`}
            </Typography>

            <Stack direction="row" spacing={1} alignItems="center" flexWrap="wrap">
              {user?.country ? (
                <Chip size="small" variant="outlined" label={user.country.toUpperCase()} />
              ) : null}

              {user?.kepcoin ? (
                <Chip
                  size="small"
                  color="secondary"
                  icon={<KepIcon name="wallet" fontSize={18} />}
                  label={t('userProfile.kepcoin', { value: user.kepcoin })}
                />
              ) : null}
            </Stack>
          </Stack>

          <Box sx={{ minWidth: { xs: 0, md: 260 } }}>
            <UserRatingsOverview ratings={ratings} isLoading={ratingsLoading} />
          </Box>
        </Stack>

        <Divider />

        <Tabs
          value={activeTab}
          variant="scrollable"
          scrollButtons="auto"
          sx={{ px: { xs: 1, md: 3 } }}
        >
          <Tab
            label={t('userProfile.tabs.about')}
            value="about"
            component={NavLink}
            to={resources.UserProfile.replace(':username', username)}
          />
          <Tab
            label={t('userProfile.tabs.ratings')}
            value="ratings"
            component={NavLink}
            to={resources.UserProfileRatings.replace(':username', username)}
          />
          <Tab
            label={t('userProfile.tabs.activityHistory')}
            value="activity-history"
            component={NavLink}
            to={resources.UserProfileActivityHistory.replace(':username', username)}
          />
          <Tab
            label={t('userProfile.tabs.achievements')}
            value="achievements"
            component={NavLink}
            to={resources.UserProfileAchievements.replace(':username', username)}
          />
        </Tabs>
      </Paper>

      <Grid container spacing={3}>
        <Grid size={{ xs: 12, md: 4, lg: 3 }}>
          <Stack direction="column" spacing={3}>
            <UserPersonalInfoCard username={username} user={user} isOwnProfile={currentUser?.username === username} />
          </Stack>
        </Grid>

        <Grid size={{ xs: 12, md: 8, lg: 9 }}>
          <Outlet context={outletContext} />
        </Grid>
      </Grid>
    </Stack>
  );
};

export const useUserProfileContext = () => useOutletContext<UserProfileOutletContext>();

export default UserProfilePage;

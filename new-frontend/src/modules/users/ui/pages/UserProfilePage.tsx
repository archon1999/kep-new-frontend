import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { Outlet, Link as RouterLink, useLocation, useNavigate, useParams } from 'react-router';
import {
  Avatar,
  Badge,
  Box,
  Card,
  CardContent,
  Grid,
  Skeleton,
  Stack,
  Tab,
  Tabs,
  Typography,
} from '@mui/material';
import { getResourceByUsername, resources } from 'app/routes/resources';
import KepIcon from 'shared/components/base/KepIcon';
import { responsivePagePaddingSx } from 'shared/lib/styles';
import { useUserDetails, useUserRatings } from '../../application/queries';
import ProfileFollowButton from '../components/user-profile/ProfileFollowButton';
import UserFollowersCard from '../components/user-profile/UserFollowersCard';
import UserPersonalInfoCard from '../components/user-profile/UserPersonalInfoCard';
import UserRanksGrid from '../components/user-profile/UserRanksGrid';
import UserSocialCard from '../components/user-profile/UserSocialCard';

const TAB_KEYS = ['about', 'ratings', 'activity-history', 'achievements'] as const;
type TabKey = (typeof TAB_KEYS)[number];

const getCurrentTab = (pathname: string): TabKey => {
  if (pathname.includes('/ratings')) return 'ratings';
  if (pathname.includes('/activity-history')) return 'activity-history';
  if (pathname.includes('/achievements')) return 'achievements';
  return 'about';
};

const UserProfilePage = () => {
  const { t } = useTranslation();
  const { username = '' } = useParams();
  const location = useLocation();
  const navigate = useNavigate();

  const { data: userDetails, isLoading: isDetailsLoading } = useUserDetails(username);
  const { data: userRatings, isLoading: isRatingsLoading } = useUserRatings(username);

  const currentTab = getCurrentTab(location.pathname);

  const tabs = useMemo(
    () => [
      {
        value: 'about',
        label: t('users.profile.tabs.about'),
        to: getResourceByUsername(resources.UserProfile, username),
      },
      {
        value: 'ratings',
        label: t('users.profile.tabs.ratings'),
        to: getResourceByUsername(resources.UserProfileRatings, username),
      },
      {
        value: 'activity-history',
        label: t('users.profile.tabs.activityHistory'),
        to: getResourceByUsername(resources.UserProfileActivityHistory, username),
      },
      {
        value: 'achievements',
        label: t('users.profile.tabs.achievements'),
        to: getResourceByUsername(resources.UserProfileAchievements, username),
      },
    ],
    [t, username],
  );

  const displayName = useMemo(() => {
    const firstName = userDetails?.firstName ?? '';
    const lastName = userDetails?.lastName ?? '';
    return [firstName, lastName].filter(Boolean).join(' ');
  }, [userDetails?.firstName, userDetails?.lastName]);

  const coverPhoto = userDetails?.coverPhoto;
  const avatar = userDetails?.avatar;
  const isOnline = userDetails?.isOnline;

  const handleTabChange = (_: React.SyntheticEvent, newValue: TabKey) => {
    const next = tabs.find((tab) => tab.value === newValue);
    if (next) {
      navigate(next.to);
    }
  };

  return (
    <Stack direction="column" spacing={3} sx={responsivePagePaddingSx}>
      <Card>
        <Box
          sx={{ position: 'relative', height: { xs: 180, sm: 260, md: 400, lg: 500 }, bgcolor: 'background.neutral' }}
        >
          {coverPhoto ? (
            <Box
              component="img"
              src={coverPhoto}
              alt="cover"
              sx={{ width: '100%', height: '100%', objectFit: 'cover' }}
            />
          ) : (
            <Skeleton variant="rectangular" width="100%" height="100%" />
          )}

          <Box
            sx={{
              position: 'absolute',
              left: { xs: 10, sm: 16 },
              bottom: -36,
              display: 'flex',
              alignItems: 'center',
              gap: 2,
            }}
          >
            <Badge
              overlap="circular"
              variant="dot"
              color={isOnline ? 'success' : 'default'}
              anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
            >
              {avatar ? (
                <Avatar
                  alt={username}
                  src={avatar}
                  sx={{ width: 88, height: 88, border: '3px solid white' }}
                />
              ) : (
                <Skeleton variant="circular" width={88} height={88} />
              )}
            </Badge>
          </Box>
        </Box>

        <CardContent sx={{ pt: 6, pb: 3 }}>
          <Grid container spacing={3} alignItems="center">
            <Grid size={{ xs: 12, md: 7 }}>
              <Stack direction="column" spacing={1.5}>
                <Stack direction="column" spacing={1.5} flexWrap="wrap">
                  <Stack direction="row" spacing={1.5}>
                    <Typography variant="h5" fontWeight={700}>
                      {userDetails?.username ?? username}
                    </Typography>
                    <ProfileFollowButton
                      username={username}
                      isFollowing={Boolean((userDetails as any)?.isFollowing)}
                    />
                  </Stack>

                  {displayName && (
                    <Typography variant="body2" color="text.secondary">
                      {displayName}
                    </Typography>
                  )}
                  {userDetails?.streak ? (
                    <Stack direction="row" spacing={0.5} alignItems="center">
                      <KepIcon name="streak" fontSize={16} color="warning.main" />
                      <Typography variant="body2" fontWeight={600} color="warning.main">
                        {userDetails.streak}
                      </Typography>
                    </Stack>
                  ) : null}
                </Stack>

                <Stack direction="row" spacing={1} flexWrap="wrap" alignItems="center">
                  <Stack direction="row" spacing={0.5} alignItems="center">
                    <KepIcon name="challenge-time" fontSize={18} color="text.secondary" />
                    <Typography variant="body2" color="text.secondary">
                      {t('users.columns.lastSeen')}: {userDetails?.lastSeen ?? '—'}
                    </Typography>
                  </Stack>
                  {userDetails?.country ? (
                    <Stack direction="row" spacing={0.5} alignItems="center">
                      <KepIcon name="info" fontSize={18} color="text.secondary" />
                      <Typography variant="body2" color="text.secondary">
                        {userDetails.country}
                      </Typography>
                    </Stack>
                  ) : null}
                </Stack>
              </Stack>
            </Grid>

            <Grid size={{ xs: 12, md: 5 }}>
              <UserRanksGrid ratings={userRatings} isLoading={isRatingsLoading} />
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      <Grid container spacing={3}>
        <Grid size={{ xs: 12, md: 3 }}>
          <Stack direction="column" spacing={2}>
            <UserPersonalInfoCard username={username} />
            <UserSocialCard username={username} />
            <UserFollowersCard username={username} />
          </Stack>
        </Grid>

        <Grid size={{ xs: 12, md: 9 }}>
          <Card>
            <CardContent>
              <Tabs
                value={currentTab}
                onChange={handleTabChange}
                variant="scrollable"
                allowScrollButtonsMobile
              >
                {tabs.map((tab) => (
                  <Tab
                    key={tab.value}
                    value={tab.value}
                    label={tab.label}
                    component={RouterLink}
                    to={tab.to}
                  />
                ))}
              </Tabs>
            </CardContent>
            <CardContent>
              <Outlet />
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Stack>
  );
};

export default UserProfilePage;

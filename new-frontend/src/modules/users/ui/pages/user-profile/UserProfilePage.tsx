import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { Link as RouterLink, Outlet, useLocation, useNavigate, useParams } from 'react-router-dom';
import {
  Avatar,
  Badge,
  Box,
  Chip,
  Grid,
  Paper,
  Skeleton,
  Stack,
  Tab,
  Tabs,
  Tooltip,
  Typography,
} from '@mui/material';
import { getResourceByUsername, resources } from 'app/routes/resources';
import { useUserActivityHistory } from 'modules/home/application/queries';
import { useUserAbout, useUserAchievements, useUserDetails, useUserRatings } from 'modules/users/application/profileQueries';
import Streak from 'shared/components/rating/Streak';
import CountryFlagIcon from 'shared/components/common/CountryFlagIcon';
import { responsivePagePaddingSx } from 'shared/lib/styles';
import UserRanksGrid from '../../components/UserRanksGrid';
import UserAboutTab from './tabs/UserAboutTab';
import UserRatingsTab from './tabs/UserRatingsTab';
import UserActivityHistoryTab from './tabs/UserActivityHistoryTab';
import UserAchievementsTab from './tabs/UserAchievementsTab';

const ProfileHeader = ({
  username,
  fullName,
  coverPhoto,
  avatar,
  streak,
  country,
  isOnline,
  lastSeen,
  ratings,
  isLoadingRatings,
}: {
  username: string;
  fullName?: string;
  coverPhoto?: string;
  avatar?: string;
  streak?: number;
  country?: string;
  isOnline?: boolean;
  lastSeen?: string;
  ratings: ReturnType<typeof useUserRatings>['data'];
  isLoadingRatings: boolean;
}) => {
  const { t } = useTranslation();

  return (
    <Paper sx={{ overflow: 'hidden', borderRadius: 3 }}>
      <Box sx={{ position: 'relative', height: { xs: 220, md: 260 }, bgcolor: 'background.neutral' }}>
        {coverPhoto ? (
          <Box
            component="img"
            src={coverPhoto}
            alt={`${username} cover`}
            sx={{ width: '100%', height: '100%', objectFit: 'cover' }}
          />
        ) : (
          <Skeleton variant="rectangular" width="100%" height="100%" />
        )}

        <Grid
          container
          spacing={2}
          sx={{
            position: 'absolute',
            bottom: 0,
            left: 0,
            p: 3,
            alignItems: 'flex-end',
            background: (theme) => `linear-gradient(180deg, transparent 0%, ${theme.palette.background.paper} 90%)`,
          }}
        >
          <Grid item xs={12} md={8}>
            <Stack direction="row" spacing={2} alignItems="flex-end">
              <Tooltip
                arrow
                title={lastSeen ? `${t('users.columns.lastSeen')}: ${lastSeen}` : ''}
                disableInteractive
              >
                <Badge
                  overlap="circular"
                  variant="dot"
                  color={isOnline ? 'success' : 'default'}
                  anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                >
                  {avatar ? (
                    <Avatar src={avatar} alt={username} sx={{ width: 96, height: 96, border: '4px solid white' }} />
                  ) : (
                    <Skeleton variant="circular" width={96} height={96} />
                  )}
                </Badge>
              </Tooltip>

              <Stack direction="column" spacing={1} pb={0.5} minWidth={0}>
                <Stack direction="row" spacing={1} alignItems="center" minWidth={0}>
                  <Typography variant="h5" fontWeight={700} noWrap>
                    {username}
                  </Typography>
                  {country && <CountryFlagIcon code={country} size={20} />}
                  {typeof streak === 'number' && streak > 0 && <Streak streak={streak} />}
                </Stack>

                {fullName && (
                  <Typography variant="subtitle2" color="text.secondary" noWrap>
                    {fullName}
                  </Typography>
                )}

                {isOnline !== undefined && (
                  <Chip
                    size="small"
                    color={isOnline ? 'success' : 'default'}
                    label={isOnline ? t('users.status.online') : t('users.status.offline')}
                  />
                )}
              </Stack>
            </Stack>
          </Grid>

          <Grid item xs={12} md={4}>
            <UserRanksGrid ratings={ratings} isLoading={isLoadingRatings} />
          </Grid>
        </Grid>
      </Box>
    </Paper>
  );
};

const UserProfilePage = () => {
  const { username = '' } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const { t } = useTranslation();

  const { data: userDetails, isLoading: isDetailsLoading } = useUserDetails(username);
  const { data: userRatings, isLoading: isRatingsLoading } = useUserRatings(username);
  const { data: aboutData, isLoading: isAboutLoading } = useUserAbout(username);
  const { data: achievements, isLoading: isAchievementsLoading } = useUserAchievements(username);
  const { data: activityHistory, isLoading: isActivityLoading } = useUserActivityHistory(username, 6);

  const tabs = useMemo(
    () => [
      { label: t('users.profile.tabs.about'), value: resources.UserProfile },
      { label: t('users.profile.tabs.ratings'), value: resources.UserProfileRatings },
      { label: t('users.profile.tabs.activityHistory'), value: resources.UserProfileActivityHistory },
      { label: t('users.profile.tabs.achievements'), value: resources.UserProfileAchievements },
    ],
    [t],
  );

  const currentValue = useMemo(
    () => tabs.find((tab) => location.pathname.startsWith(getResourceByUsername(tab.value, username)))?.value ?? tabs[0].value,
    [location.pathname, tabs, username],
  );

  const handleTabChange = (_: unknown, value: string) => {
    navigate(getResourceByUsername(value, username));
  };

  const fullName = useMemo(() => {
    if (!userDetails) return '';
    return [userDetails.firstName, userDetails.lastName].filter(Boolean).join(' ');
  }, [userDetails]);

  return (
    <Stack direction="column" spacing={3} sx={responsivePagePaddingSx}>
      <ProfileHeader
        username={username}
        fullName={fullName}
        coverPhoto={userDetails?.coverPhoto}
        avatar={userDetails?.avatar}
        streak={userDetails?.streak}
        country={userDetails?.country}
        isOnline={userDetails?.isOnline}
        lastSeen={userDetails?.lastSeen}
        ratings={userRatings}
        isLoadingRatings={isRatingsLoading}
      />

      <Paper sx={{ p: 2, borderRadius: 3 }}>
        <Tabs value={currentValue} onChange={handleTabChange} variant="scrollable" allowScrollButtonsMobile>
          {tabs.map((tab) => (
            <Tab key={tab.value} label={tab.label} value={tab.value} component={RouterLink} to={getResourceByUsername(tab.value, username)} />
          ))}
        </Tabs>
      </Paper>

      <Grid container spacing={3} alignItems="flex-start">
        <Grid item xs={12} md={4}>
          <UserAboutTab
            username={username}
            aboutData={aboutData}
            isLoading={isAboutLoading || isDetailsLoading}
            userDetails={userDetails}
          />
        </Grid>

        <Grid item xs={12} md={8}>
          {currentValue === resources.UserProfile && (
            <UserActivityHistoryTab
              username={username}
              history={activityHistory}
              isLoading={isActivityLoading}
              showHeader={false}
            />
          )}

          {currentValue === resources.UserProfileRatings && (
            <UserRatingsTab ratings={userRatings} isLoading={isRatingsLoading} />
          )}

          {currentValue === resources.UserProfileActivityHistory && (
            <UserActivityHistoryTab
              username={username}
              history={activityHistory}
              isLoading={isActivityLoading}
              showHeader
            />
          )}

          {currentValue === resources.UserProfileAchievements && (
            <UserAchievementsTab achievements={achievements} isLoading={isAchievementsLoading} />
          )}

          <Outlet />
        </Grid>
      </Grid>
    </Stack>
  );
};

export default UserProfilePage;

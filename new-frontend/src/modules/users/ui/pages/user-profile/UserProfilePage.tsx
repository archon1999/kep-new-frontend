import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { NavLink, Outlet, useLocation, useOutletContext, useParams } from 'react-router-dom';
import { Box, Grid, Paper, Stack, Tab, Tabs, Typography } from '@mui/material';
import { getResourceByUsername, resources } from 'app/routes/resources';
import UserProfileHeader from './components/UserProfileHeader';
import UserAboutSection from './components/UserAboutSection';
import UserSocialSection from './components/UserSocialSection';
import UserFollowersPreview from './components/UserFollowersPreview';

interface ProfileOutletContext {
  username: string;
}

export const useProfileContext = () => useOutletContext<ProfileOutletContext>();

const UserProfileLayout = () => {
  const { username = '' } = useParams();
  const { pathname } = useLocation();
  const { t } = useTranslation();

  const tabs = useMemo(
    () => [
      { label: t('users.profile.tabs.about'), value: getResourceByUsername(resources.UserProfile, username) },
      { label: t('users.profile.tabs.ratings'), value: getResourceByUsername(resources.UserProfileRatings, username) },
      {
        label: t('users.profile.tabs.activity'),
        value: getResourceByUsername(resources.UserProfileActivityHistory, username),
      },
      { label: t('users.profile.tabs.achievements'), value: getResourceByUsername(resources.UserProfileAchievements, username) },
      { label: t('users.profile.tabs.followers'), value: getResourceByUsername(resources.UserProfileFollowers, username) },
    ],
    [t, username],
  );

  const activeTab = useMemo(
    () => tabs.find((tab) => pathname.startsWith(tab.value))?.value ?? tabs[0].value,
    [pathname, tabs],
  );

  return (
    <Stack direction="column" spacing={3} sx={{ mb: 4 }}>
      <UserProfileHeader username={username} />

      <Paper background={1} sx={{ px: 2 }}>
        <Tabs
          value={activeTab}
          variant="scrollable"
          allowScrollButtonsMobile
          TabIndicatorProps={{ sx: { height: 3 } }}
        >
          {tabs.map((tab) => (
            <Tab
              key={tab.value}
              value={tab.value}
              label={tab.label}
              component={NavLink}
              to={tab.value}
              sx={{ textTransform: 'none', fontWeight: 600 }}
            />
          ))}
        </Tabs>
      </Paper>

      <Grid container spacing={3} alignItems="flex-start">
        <Grid item xs={12} md={4} display="flex" flexDirection="column" gap={2}>
          <UserAboutSection username={username} />
          <UserSocialSection username={username} />
          <UserFollowersPreview username={username} />
        </Grid>

        <Grid item xs={12} md={8}>
          <Outlet context={{ username }} />
        </Grid>
      </Grid>
    </Stack>
  );
};

const UserProfilePage = () => {
  const { username } = useParams();
  const { t } = useTranslation();

  if (!username) {
    return (
      <Paper background={1} sx={{ p: 3 }}>
        <Typography variant="body2">{t('users.profile.notFound')}</Typography>
      </Paper>
    );
  }

  return (
    <Box>
      <Outlet context={{ username }} />
    </Box>
  );
};

export const UserProfileLayoutWrapper = () => <UserProfileLayout />;

export default UserProfilePage;

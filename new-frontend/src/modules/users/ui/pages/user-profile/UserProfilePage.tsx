import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { Link as RouterLink, useLocation, useNavigate, useParams } from 'react-router-dom';
import { Avatar, Box, Chip, Grid, Paper, Skeleton, Stack, Tab, Tabs, Typography } from '@mui/material';
import { getResourceByUsername, resources } from 'app/routes/resources';
import { useUserDetails } from 'modules/users/application/queries';
import type { UserDetails } from 'modules/users/domain/entities/user.entity';
import { Outlet } from 'react-router';
import { responsivePagePaddingSx } from 'shared/lib/styles';
import CountryFlagIcon from 'shared/components/common/CountryFlagIcon';

interface TabConfig {
  value: string;
  label: string;
  path: string;
}

export interface UserProfileOutletContext {
  username?: string;
  user?: UserDetails;
  isLoading?: boolean;
}

interface UserProfileHeaderProps {
  user?: UserDetails;
  isLoading?: boolean;
  tabs: TabConfig[];
  activeTab: string;
  onTabChange: (value: string) => void;
}

const UserProfileHeader = ({ user, isLoading, tabs, activeTab, onTabChange }: UserProfileHeaderProps) => {
  const { t } = useTranslation();

  return (
    <Paper
      sx={{
        overflow: 'hidden',
      }}
    >
      <Box
        sx={{
          height: 180,
          backgroundImage: `url(${user?.coverPhoto ?? '/images/profile-cover.svg'})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      />

      <Stack
        direction="column"
        spacing={2}
        sx={{
          ...responsivePagePaddingSx,
          pt: 0,
        }}
      >
        <Stack direction="row" spacing={2} alignItems="center" sx={{ mt: -7 }}>
          {isLoading ? (
            <Skeleton variant="circular" width={112} height={112} />
          ) : (
            <Avatar
              src={user?.avatar}
              alt={user?.username}
              sx={{ width: 112, height: 112, border: '4px solid', borderColor: 'background.paper' }}
            />
          )}

          <Stack direction="column" spacing={1} flex={1}>
            {isLoading ? (
              <Skeleton variant="text" width={180} />
            ) : (
              <Stack direction="row" spacing={1} alignItems="center" flexWrap="wrap">
                <Typography variant="h5" fontWeight={700} component="span">
                  {user?.username}
                </Typography>

                {user?.isOnline ? (
                  <Chip color="success" size="small" label={t('users.profile.labels.online')} />
                ) : null}
              </Stack>
            )}

            {isLoading ? (
              <Skeleton variant="text" width={220} />
            ) : (
              <Typography variant="subtitle1" color="text.secondary" component="span">
                {[user?.firstName, user?.lastName].filter(Boolean).join(' ') || '—'}
              </Typography>
            )}
          </Stack>
        </Stack>

        <Tabs
          value={activeTab}
          onChange={(_, value) => onTabChange(value)}
          variant="scrollable"
          scrollButtons="auto"
        >
          {tabs.map((tab) => (
            <Tab key={tab.value} value={tab.value} label={tab.label} component={RouterLink} to={tab.path} />
          ))}
        </Tabs>
      </Stack>
    </Paper>
  );
};

const UserInfoCard = ({ user, isLoading }: { user?: UserDetails; isLoading?: boolean }) => {
  const { t } = useTranslation();

  const infoItems = useMemo(
    () => [
      { label: t('users.profile.labels.name'), value: [user?.firstName, user?.lastName].filter(Boolean).join(' ') || '—' },
      { label: t('users.profile.labels.username'), value: user?.username ?? '—' },
      {
        label: t('users.profile.labels.country'),
        value: user?.country ? (
          <Stack direction="row" spacing={1} alignItems="center">
            <CountryFlagIcon countryCode={user.country} />
            <Typography variant="body2">{user.country}</Typography>
          </Stack>
        ) : (
          '—'
        ),
      },
      { label: t('users.profile.labels.streak'), value: user?.streak ?? '—' },
      { label: t('users.profile.labels.kepcoin'), value: user?.kepcoin ?? '—' },
      { label: t('users.profile.labels.lastSeen'), value: user?.lastSeen ?? '—' },
    ],
    [t, user?.country, user?.firstName, user?.kepcoin, user?.lastName, user?.lastSeen, user?.streak, user?.username],
  );

  return (
    <Paper background={1} sx={{ p: 3 }}>
      <Stack direction="column" spacing={2}>
        <Typography variant="h6" fontWeight={700}>
          {t('users.profile.sections.about')}
        </Typography>

        <Stack direction="column" spacing={1.5}>
          {infoItems.map((item) => (
            <Stack key={item.label} direction="row" spacing={1} alignItems="center" justifyContent="space-between">
              <Typography variant="body2" color="text.secondary">
                {item.label}
              </Typography>
              {isLoading ? (
                <Skeleton variant="text" width={120} />
              ) : typeof item.value === 'string' ? (
                <Typography variant="body2" fontWeight={600} textAlign="right">
                  {item.value}
                </Typography>
              ) : (
                item.value
              )}
            </Stack>
          ))}
        </Stack>
      </Stack>
    </Paper>
  );
};

const UserProfilePage = () => {
  const { username } = useParams<{ username: string }>();
  const navigate = useNavigate();
  const location = useLocation();
  const { t } = useTranslation();

  const { data: user, isLoading } = useUserDetails(username);

  const tabs = useMemo<TabConfig[]>(() => {
    const aboutPath = username ? getResourceByUsername(resources.UserProfile, username) : resources.UserProfile;

    return [
      {
        value: 'about',
        label: t('users.profile.tabs.about'),
        path: aboutPath,
      },
      {
        value: 'ratings',
        label: t('users.profile.tabs.ratings'),
        path: username ? getResourceByUsername(resources.UserProfileRatings, username) : resources.UserProfileRatings,
      },
      {
        value: 'activity-history',
        label: t('users.profile.tabs.activityHistory'),
        path: username
          ? getResourceByUsername(resources.UserProfileActivityHistory, username)
          : resources.UserProfileActivityHistory,
      },
      {
        value: 'achievements',
        label: t('users.profile.tabs.achievements'),
        path: username
          ? getResourceByUsername(resources.UserProfileAchievements, username)
          : resources.UserProfileAchievements,
      },
    ];
  }, [t, username]);

  const activeTab = useMemo(() => {
    const match = tabs.find((tab) => location.pathname.startsWith(tab.path));
    return match?.value ?? 'about';
  }, [location.pathname, tabs]);

  const handleTabChange = (value: string) => {
    const tab = tabs.find((item) => item.value === value);
    if (tab) {
      navigate(tab.path);
    }
  };

  return (
    <Stack direction="column" spacing={3} sx={responsivePagePaddingSx}>
      <UserProfileHeader user={user} isLoading={isLoading} tabs={tabs} activeTab={activeTab} onTabChange={handleTabChange} />

      <Grid container spacing={3}>
        <Grid size={{ xs: 12, md: 4 }}>
          <UserInfoCard user={user} isLoading={isLoading} />
        </Grid>

        <Grid size={{ xs: 12, md: 8 }}>
          <Outlet context={{ username, user, isLoading }} />
        </Grid>
      </Grid>
    </Stack>
  );
};

export default UserProfilePage;

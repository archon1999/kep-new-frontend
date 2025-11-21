import { useEffect, useMemo, useState } from 'react';
import { TabContext, TabList } from '@mui/lab';
import { Avatar, Box, Chip, Paper, Skeleton, Stack, Tab, Typography } from '@mui/material';
import { alpha, useTheme } from '@mui/material/styles';
import { useTranslation } from 'react-i18next';
import { Link as RouterLink } from 'react-router-dom';
import { getResourceByUsername, resources } from 'app/routes/resources';
import { useTopUsersByOrdering } from 'modules/users/application/queries';
import { UsersListItem } from 'modules/users/domain/entities/user.entity';
import UserPopover from 'modules/users/ui/components/UserPopover';
import IconifyIcon from 'shared/components/base/IconifyIcon';
import CountryFlagIcon from 'shared/components/common/CountryFlagIcon';
import KepcoinValue from 'shared/components/common/KepcoinValue';
import ChallengesRatingChip from 'shared/components/rating/ChallengesRatingChip';
import ContestsRatingChip from 'shared/components/rating/ContestsRatingChip';
import Streak from 'shared/components/rating/Streak';

type TopUserMetric = {
  key: 'contests' | 'skills' | 'activity' | 'challenges' | 'streak' | 'kepcoin';
  ordering: string;
};

const METRICS: TopUserMetric[] = [
  { key: 'contests', ordering: '-contests_rating__rating' },
  { key: 'skills', ordering: '-skills_rating' },
  { key: 'activity', ordering: '-activity_rating' },
  { key: 'challenges', ordering: '-challenges_rating__rating' },
  { key: 'streak', ordering: '-streak' },
  { key: 'kepcoin', ordering: '-kepcoin' },
];

const SKELETON_ITEMS = Array.from({ length: 3 });

const TopUsersSection = () => {
  const theme = useTheme();
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState<TopUserMetric['key']>(METRICS[0].key);

  useEffect(() => {
    const intervalId = setInterval(() => {
      setActiveTab((prev) => {
        const currentIndex = METRICS.findIndex((metric) => metric.key === prev);
        const nextIndex = currentIndex === -1 || currentIndex === METRICS.length - 1 ? 0 : currentIndex + 1;
        return METRICS[nextIndex].key;
      });
    }, 5000);

    return () => clearInterval(intervalId);
  }, []);

  const tabResponses = METRICS.map((metric) => useTopUsersByOrdering(metric.ordering));

  const activeIndex = useMemo(() => {
    const index = METRICS.findIndex((metric) => metric.key === activeTab);
    return index === -1 ? 0 : index;
  }, [activeTab]);

  const activeMetric = METRICS[activeIndex];
  const { data, isLoading } = tabResponses[activeIndex] ?? {};
  const users = data?.data ?? [];

  const renderUserValue = (user: UsersListItem) => {
    const emptyValue = t('users.emptyValue');

    switch (activeMetric.key) {
      case 'contests':
        return (
          <Stack direction="row" spacing={1} alignItems="center">
            <ContestsRatingChip title={user.contestsRating?.title} imgSize={28} />
            <Typography variant="subtitle1" fontWeight={700} noWrap>
              {user.contestsRating?.value ?? emptyValue}
            </Typography>
          </Stack>
        );
      case 'skills':
        return (
          <Chip
            label={user.skillsRating?.value ?? emptyValue}
            size="small"
            color="primary"
            variant="soft"
            sx={{ fontWeight: 700 }}
          />
        );
      case 'activity':
        return (
          <Chip
            label={user.activityRating?.value ?? emptyValue}
            size="small"
            color="info"
            variant="soft"
            sx={{ fontWeight: 700 }}
          />
        );
      case 'challenges':
        return (
          <Stack direction="row" spacing={1} alignItems="center">
            <ChallengesRatingChip title={user.challengesRating?.title} />
            <Typography variant="subtitle1" fontWeight={700} noWrap>
              {user.challengesRating?.value ?? emptyValue}
            </Typography>
          </Stack>
        );
      case 'streak':
        return (
          <Stack spacing={0.5} alignItems="flex-end">
            <Streak streak={user.streak} maxStreak={user.maxStreak} fallback={emptyValue} />
            <Typography variant="caption" color="text.secondary">
              {t('homePage.topUsers.valueLabels.streak')}
            </Typography>
          </Stack>
        );
      case 'kepcoin':
        return (
          <Stack spacing={0.5} alignItems="flex-end">
            <KepcoinValue value={user.kepcoin ?? 0} fontWeight={700} iconSize={20} />
            <Typography variant="caption" color="text.secondary">
              {t('homePage.topUsers.valueLabels.kepcoin')}
            </Typography>
          </Stack>
        );
      default:
        return null;
    }
  };

  const renderUserInfo = (user: UsersListItem) => {
    const countryCode = user.country?.toUpperCase();
    const fullName = [user.firstName, user.lastName].filter(Boolean).join(' ');
    const profilePath = getResourceByUsername(resources.UserProfile, user.username);

    return (
      <Stack direction="row" spacing={2} alignItems="center" sx={{ flex: 1, minWidth: 0 }}>
        <Avatar src={user.avatar} alt={user.username} sx={{ width: 48, height: 48 }} />
        <Stack direction="column" spacing={0.25} minWidth={0}>
          <UserPopover
            username={user.username}
            countryCode={countryCode}
            fullName={fullName}
            avatar={user.avatar}
            streak={user.streak}
          >
            <Stack direction="row" spacing={1} alignItems="center" minWidth={0}>
              <Typography
                component={RouterLink}
                to={profilePath}
                color="primary"
                fontWeight={700}
                variant="subtitle2"
                noWrap
                sx={{ textDecoration: 'none' }}
              >
                {user.username}
              </Typography>
              {countryCode && <CountryFlagIcon code={countryCode} size={18} />}
            </Stack>
          </UserPopover>
          {fullName && (
            <Typography variant="body2" color="text.secondary" noWrap>
              {fullName}
            </Typography>
          )}
        </Stack>
      </Stack>
    );
  };

  return (
    <Paper sx={{ p: 4, height: '100%' }}>
      <Stack spacing={3} sx={{ height: '100%' }}>
        <Stack direction="row" alignItems="center" spacing={1.5}>
          <IconifyIcon icon="mdi:trophy" fontSize={28} color={theme.palette.primary.main} />
          <Typography variant="h5" sx={{ fontWeight: 700 }}>
            {t('homePage.topUsers.title')}
          </Typography>
        </Stack>

        <TabContext value={activeTab}>
          <TabList onChange={(_, value) => setActiveTab(value)} variant="scrollable" allowScrollButtonsMobile>
            {METRICS.map((metric) => (
              <Tab
                key={metric.key}
                label={t(`homePage.topUsers.tabs.${metric.key}`)}
                value={metric.key}
                sx={{ textTransform: 'none', fontWeight: 600 }}
              />
            ))}
          </TabList>
        </TabContext>

        <Stack spacing={2.5}>
          {isLoading
            ? SKELETON_ITEMS.map((_, index) => (
                <Stack key={index} direction="row" spacing={2} alignItems="center">
                  <Skeleton variant="rounded" width={42} height={42} />
                  <Skeleton variant="circular" width={48} height={48} />
                  <Stack spacing={0.5} sx={{ flex: 1 }}>
                    <Skeleton variant="text" width="35%" />
                    <Skeleton variant="text" width="50%" />
                  </Stack>
                  <Skeleton variant="rounded" width={96} height={32} />
                </Stack>
              ))
            : users.length > 0
              ? users.slice(0, 3).map((user, index) => (
                  <Stack
                    key={user.id ?? user.username}
                    direction="row"
                    spacing={2}
                    alignItems="center"
                    sx={{
                      p: 2.5,
                      borderRadius: 2,
                      border: '1px solid',
                      borderColor: index === 0 ? theme.palette.primary.light : 'divider',
                      bgcolor:
                        index === 0
                          ? alpha(theme.palette.primary.main, 0.08)
                          : theme.palette.background.paper,
                      boxShadow:
                        index === 0
                          ? `0 10px 30px ${alpha(theme.palette.primary.main, 0.14)}`
                          : 'none',
                    }}
                  >
                    <Box
                      sx={{
                        width: 42,
                        height: 42,
                        borderRadius: '50%',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontWeight: 800,
                        color: index === 0 ? theme.palette.primary.contrastText : theme.palette.text.primary,
                        backgroundImage:
                          index === 0
                            ? `linear-gradient(135deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`
                            : alpha(theme.palette.text.primary, 0.08),
                      }}
                    >
                      {index + 1}
                    </Box>

                    {renderUserInfo(user)}

                    <Stack spacing={0.5} alignItems="flex-end" sx={{ minWidth: 120 }}>
                      <Typography variant="caption" color="text.secondary" fontWeight={600}>
                        {t(`homePage.topUsers.tabs.${activeMetric.key}`)}
                      </Typography>
                      {renderUserValue(user)}
                    </Stack>
                  </Stack>
                ))
              : (
                  <Typography variant="body2" color="text.secondary">
                    {t('homePage.topUsers.empty')}
                  </Typography>
                )}
        </Stack>
      </Stack>
    </Paper>
  );
};

export default TopUsersSection;

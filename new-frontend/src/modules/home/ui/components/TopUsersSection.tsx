import { SyntheticEvent, useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Link as RouterLink } from 'react-router-dom';
import { Avatar, Box, Chip, Divider, Link, Paper, Skeleton, Stack, Tab, Tabs, Typography } from '@mui/material';
import { useTopUsers } from '../../application/queries';
import { getResourceByUsername, resources } from 'app/routes/resources';
import CountryFlagIcon from 'shared/components/common/CountryFlagIcon';
import KepcoinValue from 'shared/components/common/KepcoinValue';
import ContestsRatingChip from 'shared/components/rating/ContestsRatingChip';
import ChallengesRatingChip from 'shared/components/rating/ChallengesRatingChip';
import Streak from 'shared/components/rating/Streak';
import { mapApiUserToDomain } from 'modules/users/data-access/mappers/user.mapper';
import type { UsersListItem } from 'modules/users/domain/entities/user.entity';

type TopUserMetric = 'contests' | 'skills' | 'activity' | 'challenges' | 'streak' | 'kepcoin';

type TopUserTab = {
  key: TopUserMetric;
  ordering: string;
  labelKey: string;
  renderValue: (user: UsersListItem, emptyValue: string) => React.ReactNode;
};

const METRIC_TABS: TopUserTab[] = [
  {
    key: 'contests',
    ordering: '-contests_rating__rating',
    labelKey: 'homePage.topUsers.tabs.contests',
    renderValue: (user, emptyValue) => (
      <Stack direction="row" spacing={1} alignItems="center" minWidth={0} justifyContent="flex-end">
        <ContestsRatingChip title={user.contestsRating?.title} imgSize={28} />
        <Typography variant="subtitle2" fontWeight={700} noWrap>
          {user.contestsRating?.value ?? emptyValue}
        </Typography>
      </Stack>
    ),
  },
  {
    key: 'skills',
    ordering: '-skills_rating',
    labelKey: 'homePage.topUsers.tabs.skills',
    renderValue: (user, emptyValue) => (
      <Chip size="small" label={user.skillsRating?.value ?? emptyValue} variant="soft" color="primary" />
    ),
  },
  {
    key: 'activity',
    ordering: '-activity_rating',
    labelKey: 'homePage.topUsers.tabs.activity',
    renderValue: (user, emptyValue) => (
      <Chip size="small" label={user.activityRating?.value ?? emptyValue} variant="soft" color="info" />
    ),
  },
  {
    key: 'challenges',
    ordering: '-challenges_rating__rating',
    labelKey: 'homePage.topUsers.tabs.challenges',
    renderValue: (user, emptyValue) => (
      <Stack direction="row" spacing={1} alignItems="center" minWidth={0} justifyContent="flex-end">
        <ChallengesRatingChip title={user.challengesRating?.title} />
        <Typography variant="subtitle2" fontWeight={700} noWrap>
          {user.challengesRating?.value ?? emptyValue}
        </Typography>
      </Stack>
    ),
  },
  {
    key: 'streak',
    ordering: '-streak',
    labelKey: 'homePage.topUsers.tabs.streak',
    renderValue: (user, emptyValue) => <Streak streak={user.streak} maxStreak={user.maxStreak} fallback={emptyValue} />,
  },
  {
    key: 'kepcoin',
    ordering: '-kepcoin',
    labelKey: 'homePage.topUsers.tabs.kepcoin',
    renderValue: (user, emptyValue) => {
      if (typeof user.kepcoin !== 'number') {
        return (
          <Typography variant="subtitle2" fontWeight={700} color="text.secondary">
            {emptyValue}
          </Typography>
        );
      }

      return <KepcoinValue value={user.kepcoin} width="100%" fontWeight={700} />;
    },
  },
];

const useTopUsersData = (ordering: string) => {
  const { data, isLoading } = useTopUsers(3, ordering);

  const users = useMemo(() => {
    const rawUsers = (data as any)?.data ?? data;

    if (Array.isArray(rawUsers)) {
      return rawUsers.map(mapApiUserToDomain);
    }

    return (rawUsers?.data as UsersListItem[] | undefined)?.map(mapApiUserToDomain) ?? [];
  }, [data]);

  return { users, isLoading };
};

const TopUsersSection = () => {
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState<TopUserMetric>('contests');

  const contests = useTopUsersData(METRIC_TABS[0].ordering);
  const skills = useTopUsersData(METRIC_TABS[1].ordering);
  const activity = useTopUsersData(METRIC_TABS[2].ordering);
  const challenges = useTopUsersData(METRIC_TABS[3].ordering);
  const streak = useTopUsersData(METRIC_TABS[4].ordering);
  const kepcoin = useTopUsersData(METRIC_TABS[5].ordering);

  const tabsByKey: Record<TopUserMetric, TopUserTab> = useMemo(
    () => Object.fromEntries(METRIC_TABS.map((tab) => [tab.key, tab])) as Record<TopUserMetric, TopUserTab>,
    [],
  );

  const tabUsers: Record<TopUserMetric, UsersListItem[]> = useMemo(
    () => ({
      contests: contests.users,
      skills: skills.users,
      activity: activity.users,
      challenges: challenges.users,
      streak: streak.users,
      kepcoin: kepcoin.users,
    }),
    [activity.users, challenges.users, contests.users, kepcoin.users, skills.users, streak.users],
  );

  const isLoadingMap: Record<TopUserMetric, boolean> = useMemo(
    () => ({
      contests: contests.isLoading,
      skills: skills.isLoading,
      activity: activity.isLoading,
      challenges: challenges.isLoading,
      streak: streak.isLoading,
      kepcoin: kepcoin.isLoading,
    }),
    [activity.isLoading, challenges.isLoading, contests.isLoading, kepcoin.isLoading, skills.isLoading, streak.isLoading],
  );

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveTab((current) => {
        const currentIndex = METRIC_TABS.findIndex((tab) => tab.key === current);
        const nextIndex = (currentIndex + 1) % METRIC_TABS.length;

        return METRIC_TABS[nextIndex]?.key ?? current;
      });
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const handleTabChange = (_: SyntheticEvent, value: string) => {
    if (tabsByKey[value as TopUserMetric]) {
      setActiveTab(value as TopUserMetric);
    }
  };

  const emptyValue = t('users.emptyValue');
  const activeUsers = tabUsers[activeTab] ?? [];
  const isLoading = isLoadingMap[activeTab];
  const activeTabMeta = tabsByKey[activeTab];

  const rankBadgeStyles = [
    { background: 'linear-gradient(135deg, rgba(103, 58, 183, 0.15), rgba(63, 81, 181, 0.25))', color: 'primary.main' },
    { background: 'rgba(255, 193, 7, 0.16)', color: 'warning.dark' },
    { background: 'rgba(0, 184, 217, 0.15)', color: 'info.dark' },
  ];

  return (
    <Paper sx={{ p: 4, height: '100%' }}>
      <Stack spacing={3} sx={{ height: '100%' }}>
        <Stack direction="row" alignItems="center" justifyContent="space-between" gap={2} flexWrap="wrap">
          <Stack spacing={0.5}>
            <Typography variant="h5" fontWeight={600} component="h2">
              {t('homePage.topUsers.title')}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {t('homePage.topUsers.subtitle')}
            </Typography>
          </Stack>

          <Tabs
            value={activeTab}
            onChange={handleTabChange}
            variant="scrollable"
            allowScrollButtonsMobile
            sx={{ minHeight: 40 }}
          >
            {METRIC_TABS.map((tab) => (
              <Tab
                key={tab.key}
                value={tab.key}
                label={t(tab.labelKey)}
                disableRipple
                sx={{ textTransform: 'none', minHeight: 40 }}
              />
            ))}
          </Tabs>
        </Stack>

        <Divider />

        {isLoading ? (
          <Stack spacing={1.5}>
            {Array.from({ length: 3 }).map((_, index) => (
              <Paper key={index} sx={{ p: 2, borderRadius: 3 }} variant="outlined">
                <Stack direction="row" alignItems="center" spacing={2} justifyContent="space-between">
                  <Stack direction="row" spacing={2} alignItems="center" sx={{ flex: 1 }}>
                    <Skeleton variant="rounded" width={36} height={36} />
                    <Stack spacing={1} direction="row" alignItems="center" sx={{ flex: 1 }}>
                      <Skeleton variant="circular" width={44} height={44} />
                      <Stack spacing={0.5} sx={{ flex: 1 }}>
                        <Skeleton variant="text" width="60%" />
                        <Skeleton variant="text" width="40%" />
                      </Stack>
                    </Stack>
                  </Stack>
                  <Skeleton variant="text" width={80} />
                </Stack>
              </Paper>
            ))}
          </Stack>
        ) : activeUsers.length ? (
          <Stack spacing={1.5} sx={{ flex: 1 }}>
            {activeUsers.map((user, index) => {
              const displayName = [user.firstName, user.lastName].filter(Boolean).join(' ');
              const profilePath = getResourceByUsername(resources.UserProfile, user.username);
              const rankStyle = rankBadgeStyles[index] ?? { background: 'rgba(145, 158, 171, 0.16)', color: 'text.primary' };
              const countryCode = user.country?.toUpperCase();

              return (
                <Paper
                  key={user.username}
                  variant="outlined"
                  sx={{
                    p: 2,
                    borderRadius: 3,
                    borderColor: index === 0 ? 'primary.light' : 'divider',
                    backgroundColor: index === 0 ? 'primary.lighter' : 'background.paper',
                  }}
                >
                  <Stack direction="row" alignItems="center" spacing={2} justifyContent="space-between">
                    <Stack direction="row" spacing={2} alignItems="center" sx={{ flex: 1, minWidth: 0 }}>
                      <Box
                        sx={{
                          width: 40,
                          height: 40,
                          borderRadius: 2,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontWeight: 700,
                          fontSize: 18,
                          background: rankStyle.background,
                          color: rankStyle.color,
                        }}
                      >
                        {index + 1}
                      </Box>

                      <Stack direction="row" spacing={1.5} alignItems="center" sx={{ flex: 1, minWidth: 0 }}>
                        <Avatar src={user.avatar} alt={user.username} sx={{ width: 44, height: 44 }} />
                        <Stack spacing={0.5} minWidth={0}>
                          <Stack direction="row" spacing={1} alignItems="center" minWidth={0}>
                            <Link
                              component={RouterLink}
                              to={profilePath}
                              underline="hover"
                              color="primary"
                              fontWeight={700}
                              noWrap
                            >
                              {user.username}
                            </Link>
                            {countryCode && <CountryFlagIcon code={countryCode} size={18} />}
                          </Stack>
                          {displayName && (
                            <Typography variant="body2" color="text.secondary" noWrap>
                              {displayName}
                            </Typography>
                          )}
                        </Stack>
                      </Stack>
                    </Stack>

                    <Box sx={{ minWidth: 140, display: 'flex', justifyContent: 'flex-end' }}>
                      {activeTabMeta.renderValue(user, emptyValue)}
                    </Box>
                  </Stack>
                </Paper>
              );
            })}
          </Stack>
        ) : (
          <Typography variant="body2" color="text.secondary">
            {t('homePage.topUsers.empty')}
          </Typography>
        )}
      </Stack>
    </Paper>
  );
};

export default TopUsersSection;

import { useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Avatar, Box, Chip, Paper, Skeleton, Stack, Tab, Tabs, Typography } from '@mui/material';
import { useUsersList } from 'modules/users/application/queries';
import { UsersListItem } from 'modules/users/domain/entities/user.entity';
import ChallengesRatingChip from 'shared/components/rating/ChallengesRatingChip';
import ContestsRatingChip from 'shared/components/rating/ContestsRatingChip';
import Streak from 'shared/components/rating/Streak';
import KepcoinValue from 'shared/components/common/KepcoinValue';
import CountryFlagIcon from 'shared/components/common/CountryFlagIcon';
import { responsivePagePaddingSx } from 'shared/lib/styles';

const TAB_SWITCH_INTERVAL = 5000;

const tabConfigs = [
  {
    value: 'contests',
    labelKey: 'homePage.topUsers.tabs.contests',
    ordering: '-contests_rating__rating',
    renderValue: (user: UsersListItem, emptyLabel: string) => (
      <Stack direction="row" spacing={1} alignItems="center">
        <ContestsRatingChip title={user.contestsRating?.title} imgSize={26} />
        <Typography variant="subtitle1" fontWeight={700} noWrap>
          {user.contestsRating?.value ?? emptyLabel}
        </Typography>
      </Stack>
    ),
  },
  {
    value: 'skills',
    labelKey: 'homePage.topUsers.tabs.skills',
    ordering: '-skills_rating',
    renderValue: (user: UsersListItem, emptyLabel: string) => (
      <Chip
        size="small"
        label={user.skillsRating?.value ?? emptyLabel}
        variant="soft"
        color="primary"
        sx={{ fontWeight: 700 }}
      />
    ),
  },
  {
    value: 'activity',
    labelKey: 'homePage.topUsers.tabs.activity',
    ordering: '-activity_rating',
    renderValue: (user: UsersListItem, emptyLabel: string) => (
      <Chip
        size="small"
        label={user.activityRating?.value ?? emptyLabel}
        variant="soft"
        color="info"
        sx={{ fontWeight: 700 }}
      />
    ),
  },
  {
    value: 'challenges',
    labelKey: 'homePage.topUsers.tabs.challenges',
    ordering: '-challenges_rating__rating',
    renderValue: (user: UsersListItem, emptyLabel: string) => (
      <Stack direction="row" spacing={1} alignItems="center">
        <ChallengesRatingChip title={user.challengesRating?.title} />
        <Typography variant="subtitle1" fontWeight={700} noWrap>
          {user.challengesRating?.value ?? emptyLabel}
        </Typography>
      </Stack>
    ),
  },
  {
    value: 'streak',
    labelKey: 'homePage.topUsers.tabs.streak',
    ordering: '-streak',
    renderValue: (user: UsersListItem, emptyLabel: string) => (
      <Streak streak={user.streak} maxStreak={user.maxStreak} fallback={emptyLabel} />
    ),
  },
  {
    value: 'kepcoin',
    labelKey: 'homePage.topUsers.tabs.kepcoin',
    ordering: '-kepcoin',
    renderValue: (user: UsersListItem) => (
      <KepcoinValue value={user.kepcoin ?? 0} fontWeight={700} iconSize={22} />
    ),
  },
] as const;

const backgroundByRank: Record<number, string> = {
  0: 'primary.lighter',
  1: 'warning.lighter',
  2: 'info.lighter',
};

const borderByRank: Record<number, string> = {
  0: 'primary.main',
  1: 'warning.main',
  2: 'info.main',
};

type TabValue = (typeof tabConfigs)[number]['value'];

const TopUsersSection = () => {
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState<TabValue>('contests');

  const tabOrder = useMemo(() => tabConfigs.map((tab) => tab.value), []);

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveTab((prev) => {
        const currentIndex = tabOrder.indexOf(prev);
        const nextIndex = currentIndex >= 0 ? (currentIndex + 1) % tabOrder.length : 0;

        return tabOrder[nextIndex];
      });
    }, TAB_SWITCH_INTERVAL);

    return () => clearInterval(interval);
  }, [tabOrder]);

  const contestsParams = useMemo(() => ({ page: 1, pageSize: 3, ordering: tabConfigs[0].ordering }), []);
  const skillsParams = useMemo(() => ({ page: 1, pageSize: 3, ordering: tabConfigs[1].ordering }), []);
  const activityParams = useMemo(() => ({ page: 1, pageSize: 3, ordering: tabConfigs[2].ordering }), []);
  const challengesParams = useMemo(() => ({ page: 1, pageSize: 3, ordering: tabConfigs[3].ordering }), []);
  const streakParams = useMemo(() => ({ page: 1, pageSize: 3, ordering: tabConfigs[4].ordering }), []);
  const kepcoinParams = useMemo(() => ({ page: 1, pageSize: 3, ordering: tabConfigs[5].ordering }), []);

  const contestsQuery = useUsersList(contestsParams);
  const skillsQuery = useUsersList(skillsParams);
  const activityQuery = useUsersList(activityParams);
  const challengesQuery = useUsersList(challengesParams);
  const streakQuery = useUsersList(streakParams);
  const kepcoinQuery = useUsersList(kepcoinParams);

  const tabQueries: Record<TabValue, typeof contestsQuery> = {
    contests: contestsQuery,
    skills: skillsQuery,
    activity: activityQuery,
    challenges: challengesQuery,
    streak: streakQuery,
    kepcoin: kepcoinQuery,
  };

  const activeConfig = tabConfigs.find((tab) => tab.value === activeTab) ?? tabConfigs[0];
  const { data: usersData, isLoading } = tabQueries[activeConfig.value];
  const users = useMemo(() => usersData?.data ?? [], [usersData?.data]);
  const showSkeleton = isLoading && !usersData?.data;
  const emptyLabel = t('users.emptyValue');
  const noData = !showSkeleton && users.length === 0;

  const renderUserRow = (user: UsersListItem, index: number) => {
    const name = [user.firstName, user.lastName].filter(Boolean).join(' ');
    const countryCode = user.country?.toUpperCase();

    return (
      <Stack
        key={user.username}
        direction="row"
        alignItems="center"
        spacing={2}
        sx={(theme) => ({
          p: 2,
          borderRadius: 3,
          bgcolor: backgroundByRank[index] ?? theme.vars.palette.background.level2,
          border: '1px solid',
          borderColor: borderByRank[index] ?? theme.vars.palette.divider,
          boxShadow: theme.shadows[0],
        })}
      >
        <Box
          sx={(theme) => ({
            width: 42,
            height: 42,
            display: 'grid',
            placeItems: 'center',
            borderRadius: '50%',
            fontWeight: 800,
            color: theme.vars.palette.common.white,
            backgroundImage: `linear-gradient(135deg, ${theme.vars.palette[borderByRank[index]?.split('.')[0] as any]?.main ?? theme.vars.palette.primary.main}, ${theme.vars.palette.primary.dark})`,
          })}
        >
          {index + 1}
        </Box>

        <Avatar src={user.avatar} alt={user.username} sx={{ width: 52, height: 52 }} />

        <Stack spacing={0.5} minWidth={0} flexGrow={1}>
          <Stack direction="row" spacing={1} alignItems="center" minWidth={0}>
            <Typography color="primary" fontWeight={700} variant="subtitle1" noWrap>
              {user.username}
            </Typography>
            {countryCode && <CountryFlagIcon code={countryCode} size={18} />}
          </Stack>
          {name && (
            <Typography variant="body2" color="text.secondary" noWrap>
              {name}
            </Typography>
          )}
        </Stack>

        <Box sx={{ minWidth: 120, display: 'flex', justifyContent: 'flex-end' }}>
          {activeConfig.renderValue(user, emptyLabel)}
        </Box>
      </Stack>
    );
  };

  return (
    <Paper>
      <Stack spacing={3} sx={responsivePagePaddingSx}>
        <Stack direction="row" alignItems="center" justifyContent="space-between" flexWrap="wrap" gap={1}>
          <Box>
            <Typography variant="h5" fontWeight={700}>
              {t('homePage.topUsers.title')}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {t('homePage.topUsers.subtitle')}
            </Typography>
          </Box>
        </Stack>

        <Tabs
          value={activeTab}
          onChange={(_, value: TabValue) => setActiveTab(value)}
          variant="scrollable"
          allowScrollButtonsMobile
          aria-label="top-users-tabs"
          sx={{ mt: -1 }}
        >
          {tabConfigs.map((tab) => (
            <Tab key={tab.value} label={t(tab.labelKey)} value={tab.value} />
          ))}
        </Tabs>

        <Stack spacing={1.5}>
          {showSkeleton && Array.from({ length: 3 }).map((_, index) => <Skeleton key={index} variant="rounded" height={88} />)}

          {noData && (
            <Box
              sx={(theme) => ({
                borderRadius: 3,
                border: `1px dashed ${theme.vars.palette.divider}`,
                py: 4,
                textAlign: 'center',
                bgcolor: theme.vars.palette.background.level2,
              })}
            >
              <Typography variant="body2" color="text.secondary">
                {t('homePage.topUsers.empty')}
              </Typography>
            </Box>
          )}

          {!showSkeleton && users.map((user, index) => renderUserRow(user, index))}
        </Stack>
      </Stack>
    </Paper>
  );
};

export default TopUsersSection;

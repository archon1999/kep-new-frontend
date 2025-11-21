import { SyntheticEvent, useEffect, useMemo, useState } from 'react';
import { TabContext, TabList } from '@mui/lab';
import { Avatar, Box, Chip, Divider, Link, Paper, Stack, Tab, Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { Link as RouterLink } from 'react-router-dom';
import ContestsRatingChip from 'shared/components/rating/ContestsRatingChip';
import ChallengesRatingChip from 'shared/components/rating/ChallengesRatingChip';
import Streak from 'shared/components/rating/Streak';
import CountryFlagIcon from 'shared/components/common/CountryFlagIcon';
import KepcoinValue from 'shared/components/common/KepcoinValue';
import KepIcon from 'shared/components/base/KepIcon';
import UserPopover from 'modules/users/ui/components/UserPopover';
import { UsersListItem } from 'modules/users/domain/entities/user.entity';
import { mapApiUserToDomain } from 'modules/users/data-access/mappers/user.mapper';
import { getResourceByUsername, resources } from 'app/routes/resources';
import { useTopUsers } from '../../application/queries';
import { HomeTopUsers } from '../../domain/entities/home.entity';

const TAB_ROTATION_INTERVAL = 5000;

const SKELETON_ITEMS = Array.from({ length: 3 });

type TabValue = 'contests' | 'skills' | 'activity' | 'challenges' | 'streak' | 'kepcoin';

type TabConfig = {
  value: TabValue;
  label: string;
  title: string;
  getNumericValue: (user: UsersListItem) => number;
  renderValue: (user: UsersListItem, emptyValue: string) => React.ReactNode;
};

const parseRatingNumber = (value?: unknown) => {
  const numeric = typeof value === 'number' ? value : Number(value);

  return Number.isFinite(numeric) ? Number(numeric) : Number.NEGATIVE_INFINITY;
};

const TopUsersSection = () => {
  const { t } = useTranslation();
  const [tabValue, setTabValue] = useState<TabValue>('contests');
  const { data, isLoading } = useTopUsers(10);

  const tabConfigs = useMemo<Readonly<TabConfig[]>>(
    () => [
      {
        value: 'contests',
        label: t('homePage.topUsers.tabs.contests'),
        title: t('homePage.topUsers.titles.contests'),
        getNumericValue: (user) => parseRatingNumber(user.contestsRating?.value),
        renderValue: (user, emptyValue) => (
          <Stack direction="row" alignItems="center" spacing={1}>
            <ContestsRatingChip title={user.contestsRating?.title} imgSize={28} />
            <Typography variant="body2" fontWeight={600} noWrap>
              {user.contestsRating?.value ?? emptyValue}
            </Typography>
          </Stack>
        ),
      },
      {
        value: 'skills',
        label: t('homePage.topUsers.tabs.skills'),
        title: t('homePage.topUsers.titles.skills'),
        getNumericValue: (user) => parseRatingNumber(user.skillsRating?.value),
        renderValue: (user, emptyValue) => (
          <Chip
            size="small"
            label={user.skillsRating?.value ?? emptyValue}
            variant="soft"
            color="primary"
          />
        ),
      },
      {
        value: 'activity',
        label: t('homePage.topUsers.tabs.activity'),
        title: t('homePage.topUsers.titles.activity'),
        getNumericValue: (user) => parseRatingNumber(user.activityRating?.value),
        renderValue: (user, emptyValue) => (
          <Chip
            size="small"
            label={user.activityRating?.value ?? emptyValue}
            variant="soft"
            color="info"
          />
        ),
      },
      {
        value: 'challenges',
        label: t('homePage.topUsers.tabs.challenges'),
        title: t('homePage.topUsers.titles.challenges'),
        getNumericValue: (user) => parseRatingNumber(user.challengesRating?.value),
        renderValue: (user, emptyValue) => (
          <Stack direction="row" spacing={1} alignItems="center">
            <ChallengesRatingChip title={user.challengesRating?.title} />
            <Typography variant="body2" fontWeight={600} noWrap>
              {user.challengesRating?.value ?? emptyValue}
            </Typography>
          </Stack>
        ),
      },
      {
        value: 'streak',
        label: t('homePage.topUsers.tabs.streak'),
        title: t('homePage.topUsers.titles.streak'),
        getNumericValue: (user) => (typeof user.streak === 'number' ? user.streak : Number.NEGATIVE_INFINITY),
        renderValue: (user, emptyValue) => (
          <Streak streak={user.streak} maxStreak={user.maxStreak} fallback={emptyValue} />
        ),
      },
      {
        value: 'kepcoin',
        label: t('homePage.topUsers.tabs.kepcoin'),
        title: t('homePage.topUsers.titles.kepcoin'),
        getNumericValue: (user) => (typeof user.kepcoin === 'number' ? user.kepcoin : Number.NEGATIVE_INFINITY),
        renderValue: (user) => <KepcoinValue value={user.kepcoin ?? 0} fontWeight={600} iconSize={20} />,
      },
    ],
    [t],
  );

  const emptyValue = t('users.emptyValue');

  const topUsers = useMemo(() => {
    const rawData = (data as HomeTopUsers)?.data ?? (Array.isArray(data) ? data : []);

    return (rawData ?? []).map((user) => mapApiUserToDomain(user));
  }, [data]);

  const tabOrder = useMemo(() => tabConfigs.map((config) => config.value), [tabConfigs]);

  useEffect(() => {
    const intervalId = setInterval(() => {
      setTabValue((prev) => {
        const currentIndex = tabOrder.indexOf(prev);
        const nextIndex = currentIndex === -1 ? 0 : (currentIndex + 1) % tabOrder.length;

        return tabOrder[nextIndex];
      });
    }, TAB_ROTATION_INTERVAL);

    return () => clearInterval(intervalId);
  }, [tabOrder]);

  const activeConfig = tabConfigs.find((config) => config.value === tabValue) ?? tabConfigs[0];

  const topThreeUsers = useMemo(() => {
    if (!activeConfig || !topUsers?.length) return [];

    const usersWithValue = topUsers.map((user) => ({
      user,
      value: activeConfig.getNumericValue(user),
    }));

    return usersWithValue
      .sort((a, b) => (b.value === a.value ? 0 : b.value - a.value))
      .slice(0, 3)
      .map(({ user }) => user);
  }, [activeConfig, topUsers]);

  const renderUser = (user: UsersListItem) => {
    const displayName = [user.firstName, user.lastName].filter(Boolean).join(' ');
    const profilePath = getResourceByUsername(resources.UserProfile, user.username);
    const countryCode = user.country?.toUpperCase();

    return (
      <Stack key={user.username} direction="row" spacing={2} alignItems="center" width="100%">
        <Avatar src={user.avatar} alt={user.username} sx={{ width: 48, height: 48 }} />

        <Stack direction="column" spacing={0.5} sx={{ flex: 1, minWidth: 0 }}>
          <UserPopover
            username={user.username}
            countryCode={countryCode}
            fullName={displayName}
            avatar={user.avatar}
            streak={user.streak}
          >
            <Stack direction="row" spacing={1} alignItems="center" minWidth={0}>
              <Link
                component={RouterLink}
                to={profilePath}
                underline="hover"
                color="primary"
                fontWeight={600}
                noWrap
              >
                {user.username}
              </Link>
              {countryCode && <CountryFlagIcon code={countryCode} size={18} />}
            </Stack>
          </UserPopover>
          {displayName && (
            <Typography variant="body2" color="text.secondary" noWrap>
              {displayName}
            </Typography>
          )}
        </Stack>

        <Box sx={{ minWidth: 140, textAlign: 'right' }}>
          {activeConfig.renderValue(user, emptyValue)}
        </Box>
      </Stack>
    );
  };

  return (
    <Paper sx={{ p: 4, height: '100%' }}>
      <Stack spacing={3} direction="column" sx={{ height: '100%' }}>
        <Stack direction="row" alignItems="center" spacing={1.5}>
          <KepIcon name="rating" fontSize={24} />
          <Typography variant="h5" sx={{ fontWeight: 600 }}>
            {t('homePage.topUsers.title')}
          </Typography>
        </Stack>

        <TabContext value={tabValue}>
          <Stack spacing={2.5}>
            <TabList onChange={(_: SyntheticEvent, value: TabValue) => setTabValue(value)} aria-label="top users tab list">
              {tabConfigs.map((config) => (
                <Tab key={config.value} label={config.label} value={config.value} />
              ))}
            </TabList>

            <Divider />

            <Stack spacing={2}>
              <Typography variant="subtitle2" color="text.secondary">
                {activeConfig.title}
              </Typography>

              {isLoading ? (
                <Stack spacing={2.5} divider={<Divider />}>
                  {SKELETON_ITEMS.map((_, index) => (
                    <Stack key={index} direction="row" spacing={2} alignItems="center">
                      <Box>
                        <Avatar sx={{ width: 48, height: 48 }} />
                      </Box>
                      <Stack spacing={0.75} sx={{ flex: 1 }}>
                        <Typography variant="body2" sx={{ opacity: 0.35 }}>
                          {t('homePage.topUsers.loading')}
                        </Typography>
                        <Typography variant="body2" sx={{ opacity: 0.2 }}>
                          {t('homePage.topUsers.loading')}
                        </Typography>
                      </Stack>
                      <Box sx={{ minWidth: 140 }}>
                        <Chip label="..." size="small" variant="soft" />
                      </Box>
                    </Stack>
                  ))}
                </Stack>
              ) : topThreeUsers.length ? (
                <Stack spacing={2.5} divider={<Divider />}>
                  {topThreeUsers.map((user) => renderUser(user))}
                </Stack>
              ) : (
                <Typography variant="body2" color="text.secondary">
                  {t('homePage.topUsers.empty')}
                </Typography>
              )}
            </Stack>
          </Stack>
        </TabContext>
      </Stack>
    </Paper>
  );
};

export default TopUsersSection;

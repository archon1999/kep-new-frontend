import { type ReactNode, useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { TabContext, TabList, TabPanel } from '@mui/lab';
import {
  Avatar,
  Box,
  Chip,
  Paper,
  Skeleton,
  Stack,
  Tab,
  Typography,
} from '@mui/material';
import { UsersListItem } from 'modules/users/domain/entities/user.entity';
import { useUsersList } from 'modules/users/application/queries';
import CountryFlagIcon from 'shared/components/common/CountryFlagIcon';
import KepcoinValue from 'shared/components/common/KepcoinValue';
import ContestsRatingChip from 'shared/components/rating/ContestsRatingChip';
import ChallengesRatingChip from 'shared/components/rating/ChallengesRatingChip';
import Streak from 'shared/components/rating/Streak';
import UserPopover from 'modules/users/ui/components/UserPopover';
import { responsivePagePaddingSx } from 'shared/lib/styles';

const ROTATION_INTERVAL_MS = 5000;

const tabDefinitions = [
  {
    key: 'contests',
    ordering: '-contests_rating__rating',
    label: 'homePage.topUsers.tabs.contests',
    valueLabel: 'homePage.topUsers.valueLabels.contests',
    renderValue: (user: UsersListItem, empty: string) => (
      <Stack direction="row" spacing={1} alignItems="center">
        <ContestsRatingChip title={user.contestsRating?.title} imgSize={28} />
        <Typography variant="subtitle1" fontWeight={700} noWrap>
          {user.contestsRating?.value ?? empty}
        </Typography>
      </Stack>
    ),
  },
  {
    key: 'skills',
    ordering: '-skills_rating',
    label: 'homePage.topUsers.tabs.skills',
    valueLabel: 'homePage.topUsers.valueLabels.skills',
    renderValue: (user: UsersListItem, empty: string) => (
      <Chip
        size="small"
        label={user.skillsRating?.value ?? empty}
        variant="soft"
        color="primary"
        sx={{ fontWeight: 700 }}
      />
    ),
  },
  {
    key: 'activity',
    ordering: '-activity_rating',
    label: 'homePage.topUsers.tabs.activity',
    valueLabel: 'homePage.topUsers.valueLabels.activity',
    renderValue: (user: UsersListItem, empty: string) => (
      <Chip
        size="small"
        label={user.activityRating?.value ?? empty}
        variant="soft"
        color="info"
        sx={{ fontWeight: 700 }}
      />
    ),
  },
  {
    key: 'challenges',
    ordering: '-challenges_rating__rating',
    label: 'homePage.topUsers.tabs.challenges',
    valueLabel: 'homePage.topUsers.valueLabels.challenges',
    renderValue: (user: UsersListItem, empty: string) => (
      <Stack direction="row" spacing={1} alignItems="center">
        <ChallengesRatingChip title={user.challengesRating?.title} />
        <Typography variant="subtitle1" fontWeight={700} noWrap>
          {user.challengesRating?.value ?? empty}
        </Typography>
      </Stack>
    ),
  },
  {
    key: 'streak',
    ordering: '-streak',
    label: 'homePage.topUsers.tabs.streak',
    valueLabel: 'homePage.topUsers.valueLabels.streak',
    renderValue: (user: UsersListItem, empty: string) => (
      <Stack spacing={0.5} alignItems="flex-end">
        <Streak streak={user.streak} maxStreak={user.maxStreak} fallback={empty} />
        <Typography variant="caption" color="text.secondary">
          max {user.maxStreak ?? empty}
        </Typography>
      </Stack>
    ),
  },
  {
    key: 'kepcoin',
    ordering: '-kepcoin',
    label: 'homePage.topUsers.tabs.kepcoin',
    valueLabel: 'homePage.topUsers.valueLabels.kepcoin',
    renderValue: (user: UsersListItem) => <KepcoinValue value={user.kepcoin ?? 0} iconSize={20} fontWeight={700} />,
  },
] as const;

const useTopUsersQueries = () => {
  const queryParams = useMemo(
    () => tabDefinitions.map((tab) => ({ page: 1, pageSize: 3, ordering: tab.ordering })),
    [],
  );

  return queryParams.map((params) => useUsersList(params));
};

const TopUsersRow = ({
  user,
  position,
  emptyValue,
  renderValue,
  valueLabel,
}: {
  user: UsersListItem;
  position: number;
  emptyValue: string;
  renderValue: (user: UsersListItem, emptyValue: string) => ReactNode;
  valueLabel: string;
}) => {
  const name = [user.firstName, user.lastName].filter(Boolean).join(' ');
  const countryCode = user.country?.toUpperCase();

  return (
    <Stack
      direction={{ xs: 'column', sm: 'row' }}
      spacing={2}
      alignItems={{ xs: 'flex-start', sm: 'center' }}
      justifyContent="space-between"
      sx={(theme) => ({
        p: 2,
        borderRadius: 3,
        border: `1px solid ${theme.vars.palette.divider}`,
        backgroundColor: theme.vars.palette.background.elevation1,
      })}
    >
      <Stack direction="row" spacing={2} alignItems="center" width={1}>
        <Box
          sx={(theme) => ({
            width: 36,
            height: 36,
            display: 'grid',
            placeItems: 'center',
            borderRadius: '50%',
            background: `linear-gradient(135deg, ${theme.vars.palette.primary.light}, ${theme.vars.palette.primary.main})`,
            color: theme.vars.palette.primary.contrastText,
            fontWeight: 700,
          })}
        >
          {position}
        </Box>

        <Avatar src={user.avatar} alt={user.username} sx={{ width: 48, height: 48 }} />

        <Stack spacing={0.5} minWidth={0} sx={{ flexGrow: 1 }}>
          <UserPopover
            username={user.username}
            countryCode={countryCode}
            fullName={name}
            avatar={user.avatar}
            streak={user.streak}
          >
            <Stack direction="row" spacing={1} alignItems="center" minWidth={0}>
              <Typography color="primary" fontWeight={700} variant="subtitle1" noWrap>
                {user.username}
              </Typography>
              {countryCode && (
                <CountryFlagIcon code={countryCode} size={18} />
              )}
            </Stack>
          </UserPopover>

          {name && (
            <Typography variant="body2" color="text.secondary" noWrap>
              {name}
            </Typography>
          )}
        </Stack>
      </Stack>

      <Stack direction="column" alignItems={{ xs: 'flex-start', sm: 'flex-end' }} spacing={0.5} width={{ xs: 1, sm: 'auto' }}>
        {renderValue(user, emptyValue)}
        <Typography variant="caption" color="text.secondary" textAlign={{ xs: 'left', sm: 'right' }}>
          {valueLabel}
        </Typography>
      </Stack>
    </Stack>
  );
};

const LoadingState = () => (
  <Stack direction="column" spacing={2}>
    {[1, 2, 3].map((index) => (
      <Skeleton key={index} variant="rounded" height={88} />
    ))}
  </Stack>
);

const TopUsersSection = () => {
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState<(typeof tabDefinitions)[number]['key']>('contests');
  const queries = useTopUsersQueries();

  useEffect(() => {
    const timer = setInterval(() => {
      setActiveTab((prev) => {
        const currentIndex = tabDefinitions.findIndex((tab) => tab.key === prev);
        const nextIndex = (currentIndex + 1) % tabDefinitions.length;
        return tabDefinitions[nextIndex].key;
      });
    }, ROTATION_INTERVAL_MS);

    return () => clearInterval(timer);
  }, []);

  return (
    <Paper>
      <TabContext value={activeTab}>
        <Stack spacing={3} sx={responsivePagePaddingSx}>
          <Stack
            direction={{ xs: 'column', sm: 'row' }}
            alignItems={{ sm: 'center' }}
            justifyContent="space-between"
            gap={1}
          >
            <Box>
              <Typography variant="h5" fontWeight={700}>
                {t('homePage.topUsers.title')}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {t('homePage.topUsers.subtitle')}
              </Typography>
            </Box>

            <TabList
              onChange={(_, value) => setActiveTab(value)}
              variant="scrollable"
              allowScrollButtonsMobile
              aria-label="top users tabs"
            >
              {tabDefinitions.map((tab) => (
                <Tab key={tab.key} label={t(tab.label)} value={tab.key} />
              ))}
            </TabList>
          </Stack>

          {tabDefinitions.map((tab, index) => {
            const users = queries[index].data?.data ?? [];
            const emptyValue = t('homePage.topUsers.emptyValue');
            const isLoading = queries[index].isLoading || queries[index].isValidating;

            return (
              <TabPanel key={tab.key} value={tab.key} sx={{ p: 0 }}>
                {isLoading ? (
                  <LoadingState />
                ) : users.length ? (
                  <Stack spacing={2}>
                    {users.slice(0, 3).map((user, userIndex) => (
                      <TopUsersRow
                        key={user.id ?? user.username}
                        user={user}
                        position={userIndex + 1}
                        emptyValue={emptyValue}
                        renderValue={(u, empty) => tab.renderValue(u, empty)}
                        valueLabel={t(tab.valueLabel)}
                      />
                    ))}
                  </Stack>
                ) : (
                  <Typography variant="body2" color="text.secondary">
                    {t('homePage.topUsers.empty')}
                  </Typography>
                )}
              </TabPanel>
            );
          })}
        </Stack>
      </TabContext>
    </Paper>
  );
};

export default TopUsersSection;

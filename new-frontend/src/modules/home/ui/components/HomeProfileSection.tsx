import { Divider, Paper, Stack, Typography } from '@mui/material';
import dayjs from 'dayjs';
import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { responsivePagePaddingSx } from 'shared/lib/styles';
import type { HomeUserActivityHistory, HomeUserRatings } from '../../domain/entities/home.entity';
import RanksSection from './RanksSection';
import HomeActivityHistory from './HomeActivityHistory';

interface GreetingCardProps {
  displayName: string;
  ratings?: HomeUserRatings | null;
  isLoading?: boolean;
  activityHistory?: HomeUserActivityHistory | null;
  isActivityLoading?: boolean;
  username?: string | null;
}

const HomeProfileSection = ({
  displayName,
  ratings,
  isLoading,
  activityHistory,
  isActivityLoading,
  username,
}: GreetingCardProps) => {
  const { t } = useTranslation();
  const todayLabel = useMemo(() => dayjs().format('dddd, MMM DD, YYYY'), []);

  return (
    <Paper background={1}>
      <Stack
        direction="column"
        sx={{
          ...responsivePagePaddingSx,
          gap: 3,
          height: 1,
          overflow: 'hidden',
        }}
      >
        <Stack direction="column" spacing={1}>
          <Typography
            variant="subtitle1"
            sx={{
              color: 'text.secondary',
              fontWeight: 500,
            }}
          >
            {todayLabel}
          </Typography>

          <Typography variant="h5" display="flex" columnGap={1} flexWrap="wrap">
            {t('homePage.greeting.goodMorning', { name: displayName })}
          </Typography>
        </Stack>

        <Divider />

        <RanksSection ratings={ratings} isLoading={isLoading} />

        <Divider />

        <HomeActivityHistory
          username={username}
          history={activityHistory}
          isLoading={isActivityLoading}
        />
    </Stack>
  </Paper>
  );
};

export default HomeProfileSection;

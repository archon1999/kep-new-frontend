import { Divider, Paper, Stack, Typography } from '@mui/material';
import dayjs from 'dayjs';
import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import type { HomeUserRatings } from '../../domain/entities/home.entity';
import RanksSection from './RanksSection';

interface GreetingCardProps {
  displayName: string;
  ratings?: HomeUserRatings | null;
  isLoading?: boolean;
}

const HomeProfileSection = ({ displayName, ratings, isLoading }: GreetingCardProps) => {
  const { t } = useTranslation();
  const todayLabel = useMemo(() => dayjs().format('dddd, MMM DD, YYYY'), []);

  return (
    <Paper background={1} sx={{ height: 1 }}>
      <Stack
        direction="column"
        divider={<Divider flexItem />}
        sx={{
          gap: 3,
          p: { xs: 3, md: 5 },
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

      <RanksSection ratings={ratings} isLoading={isLoading} />
    </Stack>
  </Paper>
  );
};

export default HomeProfileSection;

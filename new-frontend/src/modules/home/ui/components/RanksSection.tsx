import { Grid, IconButton, LinearProgress, Paper, Skeleton, Stack, Tooltip, Typography } from '@mui/material';
import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import type { HomeUserRatings } from '../../domain/entities/home.entity';
import KepIcon from 'shared/components/base/KepIcon';
import IconifyIcon from 'shared/components/base/IconifyIcon';

interface RanksSectionProps {
  ratings?: HomeUserRatings | null;
  isLoading?: boolean;
}

type RatingKey = 'skillsRating' | 'activityRating' | 'contestsRating' | 'challengesRating';

interface RankCardMeta {
  key: RatingKey;
  label: string;
  infoKey: string;
  icon: Parameters<typeof KepIcon>[0]['name'];
}

interface RatingEntry {
  value?: number | string;
  rank?: number | string;
  percentile?: number | string;
}

const rankCards: RankCardMeta[] = [
  { key: 'skillsRating', label: 'homePage.ranks.labels.skills', infoKey: 'homePage.ranks.info.skillsRating', icon: 'rating' },
  {
    key: 'activityRating',
    label: 'homePage.ranks.labels.activity',
    infoKey: 'homePage.ranks.info.activityRating',
    icon: 'rating',
  },
  { key: 'contestsRating', label: 'homePage.ranks.labels.contests', infoKey: 'homePage.ranks.info.contests', icon: 'contests' },
  { key: 'challengesRating', label: 'homePage.ranks.labels.challenges', infoKey: 'homePage.ranks.info.challenges', icon: 'challenges' },
];

const formatNumber = (value?: number | string, fractionDigits = 1) => {
  if (typeof value === 'number') {
    return value.toFixed(fractionDigits);
  }

  if (typeof value === 'string') {
    const parsed = Number(value);
    if (!Number.isNaN(parsed)) {
      return parsed.toFixed(fractionDigits);
    }
  }

  return undefined;
};

const normalizeNumber = (value?: number | string | null) => {
  if (value === '' || value === null || value === undefined) {
    return undefined;
  }

  if (typeof value === 'number') {
    return value;
  }

  if (typeof value === 'string') {
    const parsed = Number(value);
    return Number.isNaN(parsed) ? undefined : parsed;
  }

  return undefined;
};

const getRatingEntry = (ratings?: HomeUserRatings | null, key?: RatingKey): RatingEntry => {
  if (!ratings || !key) {
    return {};
  }

  return (ratings as Record<string, RatingEntry | undefined>)[key] ?? {};
};

const RanksSection = ({ ratings, isLoading }: RanksSectionProps) => {
  const { t } = useTranslation();
  const cards = useMemo(() => rankCards.map((card) => ({ ...card, ...getRatingEntry(ratings, card.key) })), [ratings]);

  return (
    <Stack spacing={3} height={1}>
      <Typography variant="h5" fontWeight={600} px={{ xs: 0, md: 1 }}>
        {t('homePage.ranks.title')}
      </Typography>

      <Grid container spacing={3} alignItems="stretch">
        {cards.map(({ key, label, infoKey, icon, value, rank, percentile }) => {
          const sanitizedPercentile = normalizeNumber(percentile);
          const percentileLabel = formatNumber(sanitizedPercentile) ?? '0.0';

          if (isLoading) {
            return (
              <Grid item xs={12} sm={6} key={key}>
                <Skeleton variant="rounded" height={184} />
              </Grid>
            );
          }

          return (
            <Grid item xs={12} sm={6} key={key}>
              <Paper
                variant="outlined"
                sx={{
                  borderRadius: 3,
                  height: '100%',
                  p: 3,
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 2,
                }}
              >
                <Stack direction="row" alignItems="center" justifyContent="space-between" gap={1}>
                  <Stack direction="row" spacing={1} alignItems="center">
                    <KepIcon name={icon} fontSize={26} color="primary.main" />
                    <Typography variant="subtitle2" fontWeight={600} color="text.secondary">
                      {t(label)}
                    </Typography>
                  </Stack>

                  <Tooltip title={t(infoKey)}>
                    <IconButton size="small" color="primary" sx={{ bgcolor: 'primary.lighter' }}>
                      <IconifyIcon icon="material-symbols:info-outline-rounded" />
                    </IconButton>
                  </Tooltip>
                </Stack>

                <Stack direction="row" alignItems="baseline" spacing={1}>
                  <Typography variant="h4" fontWeight={700}>
                    {value ?? '—'}
                  </Typography>
                  {rank !== undefined && rank !== null && rank !== '' && (
                    <Typography variant="subtitle2" fontWeight={500} color="text.secondary">
                      #{rank}
                    </Typography>
                  )}
                </Stack>

                <Stack spacing={0.5}>
                  <LinearProgress
                    variant="determinate"
                    value={sanitizedPercentile ?? 0}
                    sx={{ height: 6, borderRadius: 999, bgcolor: 'divider' }}
                  />
                  <Typography variant="caption" color="text.secondary">
                    {t('homePage.ranks.percentile', { percentile: percentileLabel })}
                  </Typography>
                </Stack>
              </Paper>
            </Grid>
          );
        })}
      </Grid>
    </Stack>
  );
};

export default RanksSection;

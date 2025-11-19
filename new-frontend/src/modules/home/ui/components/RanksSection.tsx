import { useMemo } from 'react';
import {
  Avatar,
  Grid,
  IconButton,
  Paper,
  Skeleton,
  Stack,
  Tooltip,
  Typography,
} from '@mui/material';
import { alpha } from '@mui/material/styles';
import { useTranslation } from 'react-i18next';
import KepIcon from 'shared/components/base/KepIcon';
import type { KepIconName } from 'shared/config/icons';
import type { HomeUserRatings } from '../../domain/entities/home.entity';

type RankKey = 'skillsRating' | 'activityRating' | 'contestsRating' | 'challengesRating';

interface RankConfig {
  key: RankKey;
  icon: KepIconName;
  gradient: [string, string];
}

interface RankMetrics {
  value?: number | string;
  rank?: number | string;
  percentile?: number | string;
}

const rankConfigs: RankConfig[] = [
  { key: 'skillsRating', icon: 'rating', gradient: ['#6C63FF', '#9276FF'] },
  { key: 'activityRating', icon: 'rating', gradient: ['#FF885E', '#FFAF7B'] },
  { key: 'contestsRating', icon: 'contests', gradient: ['#53C5FF', '#7DD6FF'] },
  { key: 'challengesRating', icon: 'challenges', gradient: ['#37C978', '#7FE29F'] },
];

const parseRankMetrics = (value?: unknown): RankMetrics => {
  if (!value) return {};

  if (typeof value === 'object') {
    const data = value as Record<string, unknown>;
    const resolvedValue =
      data.value ?? data.rating ?? data.points ?? data.score ?? data.total ?? data.amount;
    const resolvedRank = data.rank ?? data.position ?? data.place ?? data.ratingRank;
    const resolvedPercentile = data.percentile ?? data.percent ?? data.percentile_value;

    return {
      value: resolvedValue as number | string | undefined,
      rank: resolvedRank as number | string | undefined,
      percentile: resolvedPercentile as number | string | undefined,
    };
  }

  if (typeof value === 'number' || typeof value === 'string') {
    return { value };
  }

  return {};
};

const formatMetric = (value?: number | string) => {
  if (value === undefined || value === null || value === '') {
    return '—';
  }

  if (typeof value === 'number') {
    return new Intl.NumberFormat().format(value);
  }

  const numericValue = Number(value);
  if (!Number.isNaN(numericValue) && value !== '') {
    return new Intl.NumberFormat().format(numericValue);
  }

  return value;
};

interface RanksSectionProps {
  ratings?: HomeUserRatings | null;
  isLoading?: boolean;
}

const RanksSection = ({ ratings, isLoading }: RanksSectionProps) => {
  const { t } = useTranslation();

  const rankCards = useMemo(
    () =>
      rankConfigs.map((config) => ({
        ...config,
        metrics: parseRankMetrics((ratings as Record<string, unknown> | null | undefined)?.[config.key]),
      })),
    [ratings],
  );

  return (
    <Stack spacing={3}>
      <Typography variant="h5" sx={{ fontWeight: 700 }}>
        {t('homePage.ranks.title')}
      </Typography>
      <Grid container spacing={3}>
        {rankCards.map(({ key, icon, gradient, metrics }) => (
          <Grid item xs={12} sm={6} md={3} key={key}>
            <Paper
              sx={{
                position: 'relative',
                overflow: 'hidden',
                borderRadius: 3,
                p: 3,
                minHeight: 200,
                bgcolor: 'background.elevation2',
                '&::before': {
                  content: '""',
                  position: 'absolute',
                  inset: 0,
                  opacity: 0.8,
                  background: `linear-gradient(135deg, ${gradient[0]}, ${gradient[1]})`,
                  filter: 'blur(120px)',
                },
              }}
            >
              {isLoading ? (
                <Skeleton variant="rounded" height={160} />
              ) : (
                <Stack spacing={2} sx={{ position: 'relative' }}>
                  <Stack direction="row" alignItems="flex-start" justifyContent="space-between">
                    <Stack direction="row" spacing={1.5} alignItems="center">
                      <Avatar
                        sx={{
                          bgcolor: (theme) => alpha(theme.palette.common.white, 0.08),
                          color: 'text.primary',
                          border: 1,
                          borderColor: (theme) => alpha(theme.palette.common.white, 0.08),
                          width: 48,
                          height: 48,
                        }}
                      >
                        <KepIcon name={icon} fontSize={28} />
                      </Avatar>
                      <Stack spacing={0.5}>
                        <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                          {t(`homePage.ranks.cards.${key}.title`)}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          {t(`homePage.ranks.cards.${key}.subtitle`)}
                        </Typography>
                      </Stack>
                    </Stack>
                    <Tooltip title={t(`homePage.ranks.cards.${key}.description`)} placement="left">
                      <IconButton size="small" color="inherit">
                        <KepIcon name="question" fontSize={20} />
                      </IconButton>
                    </Tooltip>
                  </Stack>
                  <Typography variant="h4" sx={{ fontWeight: 700 }}>
                    {formatMetric(metrics.value)}
                  </Typography>
                  <Stack spacing={0.5}>
                    <Typography variant="body2" sx={{ fontWeight: 600 }}>
                      {metrics.rank ? `#${formatMetric(metrics.rank)}` : t('homePage.ranks.noRank')}
                    </Typography>
                    {metrics.percentile && (
                      <Typography variant="caption" color="text.secondary">
                        {t('homePage.ranks.percentileInformation', { percentile: metrics.percentile })}
                      </Typography>
                    )}
                  </Stack>
                </Stack>
              )}
            </Paper>
          </Grid>
        ))}
      </Grid>
    </Stack>
  );
};

export default RanksSection;

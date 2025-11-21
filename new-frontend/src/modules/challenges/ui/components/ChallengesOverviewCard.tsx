import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { alpha, useTheme } from '@mui/material/styles';
import { Box, Card, CardContent, Chip, Skeleton, Stack, Typography } from '@mui/material';
import { useUserChallengesRating } from '../../application/queries';
import { useAuth } from 'app/providers/AuthProvider';

const getWinRate = (wins?: number, draws?: number, losses?: number) => {
  const total = (wins || 0) + (draws || 0) + (losses || 0);
  if (!total) return 0;
  return Math.round(((wins || 0) / total) * 100);
};

const StatItem = ({ label, value, color }: { label: string; value: number | string; color?: string }) => (
  <Stack spacing={0.5} alignItems="flex-start">
    <Typography variant="caption" color="text.secondary">
      {label}
    </Typography>
    <Typography variant="h6" color={color || 'text.primary'}>
      {value}
    </Typography>
  </Stack>
);

const ChallengesOverviewCard = () => {
  const { currentUser } = useAuth();
  const { t } = useTranslation();
  const theme = useTheme();
  const { data, isLoading } = useUserChallengesRating(currentUser?.username);

  const winRate = useMemo(
    () => getWinRate(data?.wins, data?.draws, data?.losses),
    [data?.wins, data?.draws, data?.losses],
  );

  if (isLoading) {
    return <Skeleton variant="rounded" height={164} />;
  }

  if (!data) {
    return (
      <Card>
        <CardContent>
          <Typography variant="subtitle1" gutterBottom>
            {t('challenges.overview.title')}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {t('challenges.overview.empty')}
          </Typography>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardContent>
        <Stack spacing={2} direction={{ xs: 'column', md: 'row' }} justifyContent="space-between" alignItems="center">
          <Stack spacing={1} alignItems={{ xs: 'flex-start', md: 'flex-start' }}>
            <Typography variant="subtitle1" color="text.secondary">
              {t('challenges.overview.title')}
            </Typography>
            <Typography variant="h4" component="p">
              {data?.rating ?? '—'}
            </Typography>
            <Chip
              label={data.rankTitle}
              color="primary"
              variant="soft"
              sx={{ textTransform: 'capitalize', width: 'fit-content' }}
            />
          </Stack>

          <Box
            sx={{
              px: 3,
              py: 2,
              borderRadius: 3,
              bgcolor: alpha(theme.palette.primary.main, 0.04),
              minWidth: { md: 320 },
            }}
          >
            <Stack direction="row" spacing={3} flexWrap="wrap">
              <StatItem label={t('challenges.overview.wins')} value={data.wins || 0} color={theme.palette.success.main} />
              <StatItem label={t('challenges.overview.draws')} value={data.draws || 0} color={theme.palette.text.secondary} />
              <StatItem label={t('challenges.overview.losses')} value={data.losses || 0} color={theme.palette.error.main} />
              <StatItem label={t('challenges.overview.winRate')} value={`${winRate}%`} />
            </Stack>
          </Box>
        </Stack>
      </CardContent>
    </Card>
  );
};

export default ChallengesOverviewCard;

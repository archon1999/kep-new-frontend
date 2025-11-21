import { Card, CardContent, LinearProgress, Stack, Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { ProblemsSummary } from '../../domain/entities/stats.entity.ts';

interface ProblemsSummaryCardProps {
  summary?: ProblemsSummary;
  isLoading?: boolean;
}

const ProblemsSummaryCard = ({ summary, isLoading }: ProblemsSummaryCardProps) => {
  const { t } = useTranslation();

  return (
    <Card variant="outlined">
      <CardContent>
        <Stack spacing={2}>
          <Stack spacing={0.5}>
            <Typography variant="h6">{t('problems.summaryTitle')}</Typography>
            <Typography variant="body2" color="text.secondary">
              {t('problems.summarySubtitle')}
            </Typography>
          </Stack>

          {isLoading && <LinearProgress />}

          {!isLoading && (
            <Stack spacing={1.5}>
              <Stack direction="row" justifyContent="space-between">
                <Typography variant="body2" color="text.secondary">
                  {t('problems.totalSolved')}
                </Typography>
                <Typography variant="subtitle1" fontWeight={700}>
                  {summary?.solved ?? 0}
                </Typography>
              </Stack>
              <Stack direction="row" justifyContent="space-between">
                <Typography variant="body2" color="text.secondary">
                  {t('problems.rating')}
                </Typography>
                <Typography variant="subtitle1" fontWeight={700}>
                  {summary?.rating ?? '—'}
                </Typography>
              </Stack>
              <Stack direction="row" justifyContent="space-between">
                <Typography variant="body2" color="text.secondary">
                  {t('problems.totalAttempts')}
                </Typography>
                <Typography variant="subtitle1" fontWeight={700}>
                  {summary?.attempts ?? '—'}
                </Typography>
              </Stack>
              <Stack direction="row" justifyContent="space-between">
                <Typography variant="body2" color="text.secondary">
                  {t('problems.likesReceived')}
                </Typography>
                <Typography variant="subtitle1" fontWeight={700}>
                  {summary?.likesReceived ?? '—'}
                </Typography>
              </Stack>
              <Stack direction="row" justifyContent="space-between">
                <Typography variant="body2" color="text.secondary">
                  {t('problems.userRank')}
                </Typography>
                <Typography variant="subtitle1" fontWeight={700}>
                  {summary?.userRank ?? '—'}
                </Typography>
              </Stack>
            </Stack>
          )}
        </Stack>
      </CardContent>
    </Card>
  );
};

export default ProblemsSummaryCard;

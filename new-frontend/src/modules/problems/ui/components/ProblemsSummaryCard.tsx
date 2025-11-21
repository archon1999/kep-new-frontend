import { Card, CardContent, Skeleton, Stack, Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { ProblemsRatingSummary } from '../../domain/entities/problems-rating.entity.ts';
import KepIcon from 'shared/components/icons/KepIcon.tsx';

interface ProblemsSummaryCardProps {
  summary?: ProblemsRatingSummary | null;
  loading?: boolean;
}

const ProblemsSummaryCard = ({ summary, loading }: ProblemsSummaryCardProps) => {
  const { t } = useTranslation();

  return (
    <Card variant="outlined">
      <CardContent>
        {loading ? (
          <Stack direction="column" spacing={1}>
            <Skeleton height={32} />
            <Skeleton height={32} />
            <Skeleton height={32} />
          </Stack>
        ) : (
          <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} justifyContent="space-between">
            <Stack direction="row" spacing={1.5} alignItems="center">
              <KepIcon name="check-square" color="primary" fontSize={22} />
              <Typography variant="subtitle1" fontWeight={700} color="text.primary">
                {t('problems.solvedLabel', { count: summary?.solved ?? 0 })}
              </Typography>
            </Stack>
            <Stack direction="row" spacing={1.5} alignItems="center">
              <KepIcon name="rating" color="primary" fontSize={22} />
              <Typography variant="subtitle1" fontWeight={700} color="text.primary">
                {t('problems.ratingLabel', { value: summary?.rating ?? 0 })}
              </Typography>
            </Stack>
            <Stack direction="row" spacing={1.5} alignItems="center">
              <KepIcon name="ranking" color="primary" fontSize={22} />
              <Typography variant="subtitle1" fontWeight={700} color="text.primary">
                {t('problems.rankLabel', { rank: summary?.rank ?? 0, total: summary?.usersCount ?? 0 })}
              </Typography>
            </Stack>
          </Stack>
        )}
      </CardContent>
    </Card>
  );
};

export default ProblemsSummaryCard;

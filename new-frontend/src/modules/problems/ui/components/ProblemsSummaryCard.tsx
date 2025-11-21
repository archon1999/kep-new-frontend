import { Card, CardContent, Divider, Stack, Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { ProblemsRatingRow } from '../../domain/entities/problem.entity.ts';

interface ProblemsSummaryCardProps {
  rating?: ProblemsRatingRow | null;
}

const ProblemsSummaryCard = ({ rating }: ProblemsSummaryCardProps) => {
  const { t } = useTranslation();

  return (
    <Card variant="outlined">
      <CardContent>
        <Stack spacing={1.5} direction="column">
          <Typography variant="h6">{t('problems.summaryTitle')}</Typography>
          <Typography variant="body2" color="text.secondary">
            {t('problems.summarySubtitle')}
          </Typography>

          <Stack direction="row" spacing={2} alignItems="center">
            <Stack>
              <Typography variant="h4" fontWeight={800}>{rating?.solved ?? 0}</Typography>
              <Typography variant="body2" color="text.secondary">{t('problems.summarySolved')}</Typography>
            </Stack>
            <Divider orientation="vertical" flexItem />
            <Stack>
              <Typography variant="h5" fontWeight={700}>{rating?.rating ?? 0}</Typography>
              <Typography variant="body2" color="text.secondary">{t('problems.summaryRating')}</Typography>
            </Stack>
          </Stack>
        </Stack>
      </CardContent>
    </Card>
  );
};

export default ProblemsSummaryCard;

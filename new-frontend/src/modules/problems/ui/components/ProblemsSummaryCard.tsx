import { Card, CardContent, Divider, Stack, Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { ProblemsRatingSummary } from '../../domain';

interface Props {
  summary: ProblemsRatingSummary | null | undefined;
}

const ProblemsSummaryCard = ({ summary }: Props) => {
  const { t } = useTranslation();

  return (
    <Card variant="outlined">
      <CardContent>
        <Stack spacing={2} direction="column">
          <Typography variant="h6" fontWeight={800}>
            {t('problems.summary.title')}
          </Typography>

          {summary ? (
            <Stack spacing={1.5} direction="column">
              <Stack spacing={0.5} direction="column">
                <Typography variant="overline" color="text.secondary">
                  {t('problems.summary.solved')}
                </Typography>
                <Typography variant="h4" fontWeight={800}>
                  {summary.solved}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {t('problems.summary.rank', { rank: summary.rowIndex ?? '-' })}
                </Typography>
              </Stack>

              <Divider />

              <Stack spacing={0.5} direction="column">
                <Typography variant="overline" color="text.secondary">
                  {t('problems.summary.rating')}
                </Typography>
                <Typography variant="h5" fontWeight={700}>
                  {summary.rating}
                </Typography>
              </Stack>
            </Stack>
          ) : (
            <Typography variant="body2" color="text.secondary">
              {t('problems.summary.empty')}
            </Typography>
          )}
        </Stack>
      </CardContent>
    </Card>
  );
};

export default ProblemsSummaryCard;

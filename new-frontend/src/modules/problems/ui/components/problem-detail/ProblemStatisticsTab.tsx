import { Card, CardContent, Stack, Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { useProblemStatistics } from '../../../problems/application/queries';

export const ProblemStatisticsTab = ({ problemId }: { problemId: number }) => {
  const { t } = useTranslation();
  const { data: stats, isLoading } = useProblemStatistics(problemId);

  return (
    <Card variant="outlined" sx={{ mt: 2 }}>
      <CardContent>
        <Typography variant="h6" gutterBottom>
          {t('problems.detail.statisticsTitle')}
        </Typography>

        {isLoading ? (
          <Typography color="text.secondary">{t('common.loading')}</Typography>
        ) : stats ? (
          <Stack spacing={2}>
            <Stack spacing={1}>
              <Typography variant="subtitle2">{t('problems.detail.attemptStatistics')}</Typography>
              {(stats.attemptStatistics ?? []).map((item) => (
                <Stack key={item.verdict} direction="row" justifyContent="space-between" alignItems="center">
                  <Typography color="text.secondary">{item.verdict}</Typography>
                  <Typography fontWeight={700}>{item.value}</Typography>
                </Stack>
              ))}
            </Stack>

            <Stack spacing={1}>
              <Typography variant="subtitle2">{t('problems.detail.languageStatistics')}</Typography>
              {(stats.languageStatistics ?? []).map((item) => (
                <Stack key={item.lang} direction="row" justifyContent="space-between" alignItems="center">
                  <Typography color="text.secondary">{item.langFull}</Typography>
                  <Typography fontWeight={700}>{item.value}</Typography>
                </Stack>
              ))}
            </Stack>
          </Stack>
        ) : (
          <Typography color="text.secondary">{t('problems.detail.noStatistics')}</Typography>
        )}
      </CardContent>
    </Card>
  );
};

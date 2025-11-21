import { useTranslation } from 'react-i18next';
import { Card, CardContent, Chip, Grid, Stack, Typography } from '@mui/material';

const presets = [
  { timeSeconds: 60, questionsCount: 6 },
  { timeSeconds: 50, questionsCount: 5 },
  { timeSeconds: 40, questionsCount: 5 },
  { timeSeconds: 30, questionsCount: 6 },
];

const QuickStartPresets = () => {
  const { t } = useTranslation();

  return (
    <Card>
      <CardContent>
        <Stack spacing={2}>
          <Typography variant="h6">{t('challenges.quickStart.title')}</Typography>
          <Typography variant="body2" color="text.secondary">
            {t('challenges.quickStart.description')}
          </Typography>
          <Grid container spacing={1}>
            {presets.map((preset) => (
              <Grid item xs={6} key={`${preset.timeSeconds}-${preset.questionsCount}`}>
                <Stack
                  direction="row"
                  spacing={1}
                  alignItems="center"
                  sx={{
                    border: (theme) => `1px dashed ${theme.palette.divider}`,
                    borderRadius: 2,
                    px: 1.5,
                    py: 1,
                    bgcolor: 'background.default',
                  }}
                >
                  <Chip size="small" color="primary" label={`${preset.questionsCount} ${t('challenges.quickStart.questions')}`} />
                  <Typography variant="body2" color="text.secondary">
                    {t('challenges.quickStart.time', { seconds: preset.timeSeconds })}
                  </Typography>
                </Stack>
              </Grid>
            ))}
          </Grid>
          <Typography variant="caption" color="text.secondary">
            {t('challenges.quickStart.note')}
          </Typography>
        </Stack>
      </CardContent>
    </Card>
  );
};

export default QuickStartPresets;

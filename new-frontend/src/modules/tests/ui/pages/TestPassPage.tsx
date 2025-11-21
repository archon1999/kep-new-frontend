import { useMemo } from 'react';
import { useParams } from 'react-router';
import { Box, Card, CardContent, Chip, Divider, Grid2 as Grid, Skeleton, Stack, Typography } from '@mui/material';
import AccessTimeRoundedIcon from '@mui/icons-material/AccessTimeRounded';
import QuizRoundedIcon from '@mui/icons-material/QuizRounded';
import { useTranslation } from 'react-i18next';
import { useTestPass } from '../../application/queries';

const parseOptions = (raw?: string | null) => {
  if (!raw) return [] as any[];
  try {
    const parsed = typeof raw === 'string' ? JSON.parse(raw) : raw;
    return Array.isArray(parsed) ? parsed : [];
  } catch (error) {
    console.error('Failed to parse options', error);
    return [] as any[];
  }
};

const TestPassPage = () => {
  const { id } = useParams();
  const { t } = useTranslation();
  const { data: testPass, isLoading } = useTestPass(id);

  const duration = useMemo(() => {
    if (!testPass?.test?.duration) return '';
    return testPass.test.duration;
  }, [testPass?.test?.duration]);

  if (isLoading || !testPass) {
    return (
      <Box sx={{ p: { xs: 3, md: 5 } }}>
        <Skeleton variant="rounded" height={320} />
      </Box>
    );
  }

  return (
    <Box sx={{ p: { xs: 3, md: 5 } }}>
      <Stack spacing={3}>
        <Stack spacing={0.5}>
          <Typography variant="h4" fontWeight={800}>
            {testPass.test.title}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {t('testsPage.passIntro')}
          </Typography>
        </Stack>

        <Stack direction="row" spacing={2} alignItems="center">
          <Chip icon={<QuizRoundedIcon />} label={t('testsPage.questionsCount', { count: testPass.test.questionsCount })} />
          {duration && <Chip icon={<AccessTimeRoundedIcon />} label={duration} color="primary" variant="outlined" />}
        </Stack>

        <Grid container spacing={3}>
          {testPass.test.questions?.map((question) => {
            const options = parseOptions(question.options as any);
            return (
              <Grid key={question.number} size={{ xs: 12 }}>
                <Card variant="outlined">
                  <CardContent>
                    <Stack spacing={1.5}>
                      <Stack direction="row" justifyContent="space-between" alignItems="center">
                        <Typography variant="subtitle1" fontWeight={800}>
                          {t('testsPage.questionNumber', { number: question.number })}
                        </Typography>
                        <Chip label={t('testsPage.questionType', { type: question.type })} size="small" />
                      </Stack>
                      <Typography variant="body1" sx={{ whiteSpace: 'pre-line' }}>
                        {question.body}
                      </Typography>
                      {options.length ? (
                        <Stack spacing={1} divider={<Divider flexItem />}>
                          {options.map((option: any, idx: number) => (
                            <Typography key={idx} variant="body2">
                              {option.option ?? option.optionMain ?? option}
                            </Typography>
                          ))}
                        </Stack>
                      ) : null}
                    </Stack>
                  </CardContent>
                </Card>
              </Grid>
            );
          })}
        </Grid>
      </Stack>
    </Box>
  );
};

export default TestPassPage;

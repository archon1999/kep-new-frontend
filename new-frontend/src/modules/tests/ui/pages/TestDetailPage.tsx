import { useMemo } from 'react';
import { useNavigate, useParams } from 'react-router';
import { Box, Button, Card, CardContent, Chip, Divider, Grid2 as Grid, Skeleton, Stack, Typography } from '@mui/material';
import PlayArrowRoundedIcon from '@mui/icons-material/PlayArrowRounded';
import AccessTimeRoundedIcon from '@mui/icons-material/AccessTimeRounded';
import QuizRoundedIcon from '@mui/icons-material/QuizRounded';
import GroupRoundedIcon from '@mui/icons-material/GroupRounded';
import { useTranslation } from 'react-i18next';
import { useSnackbar } from 'notistack';
import { useTestBestResults, useTestDetail, useTestLastResults, testsQueries } from '../../application/queries';
import TestResultsList from '../components/TestResultsList.tsx';
import { DifficultyStars } from '../components/TestDifficulty.tsx';
import paths from 'app/routes/paths.ts';

const TestDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { enqueueSnackbar } = useSnackbar();

  const { data: test, isLoading } = useTestDetail(id);
  const { data: bestResults } = useTestBestResults(id);
  const { data: lastResults } = useTestLastResults(id);

  const metrics = useMemo(
    () => [
      { icon: <QuizRoundedIcon color="primary" />, value: test?.questionsCount, label: t('testsPage.metrics.questions') },
      { icon: <AccessTimeRoundedIcon color="secondary" />, value: test?.duration, label: t('testsPage.metrics.duration') },
      { icon: <GroupRoundedIcon color="success" />, value: test?.passesCount, label: t('testsPage.metrics.passed') },
    ],
    [test?.duration, test?.passesCount, test?.questionsCount, t],
  );

  const handleStart = async () => {
    if (!id) return;
    try {
      const response = await testsQueries.testsRepository.start(id);
      const testPassId = response?.testPassId || response?.id;
      enqueueSnackbar(t('testsPage.startSuccess'), { variant: 'success' });
      if (testPassId) {
        navigate(paths.testPass.replace(':id', String(testPassId)));
      }
    } catch (error) {
      enqueueSnackbar(t('testsPage.startError'), { variant: 'error' });
      console.error(error);
    }
  };

  if (isLoading || !test) {
    return (
      <Box sx={{ p: { xs: 3, md: 5 } }}>
        <Skeleton variant="rounded" height={320} />
      </Box>
    );
  }

  return (
    <Box sx={{ p: { xs: 3, md: 5 } }}>
      <Stack spacing={3}>
        <Stack spacing={1}>
          <Typography variant="h4" fontWeight={800}>
            {test.title}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {test.description}
          </Typography>
        </Stack>

        <Grid container spacing={3}>
          <Grid size={{ xs: 12, lg: 8 }}>
            <Card variant="outlined">
              <CardContent>
                <Stack spacing={2}>
                  <Stack direction="row" spacing={1} alignItems="center">
                    <DifficultyStars value={test.difficulty} />
                    <Chip label={test.difficultyTitle} size="small" />
                  </Stack>

                  <Stack direction={{ xs: 'column', sm: 'row' }} spacing={3} divider={<Divider flexItem orientation="vertical" />}>
                    {metrics.map((metric) => (
                      <Stack key={metric.label} direction="row" spacing={1} alignItems="center">
                        {metric.icon}
                        <Stack>
                          <Typography variant="subtitle2" fontWeight={700}>
                            {metric.value ?? '—'}
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            {metric.label}
                          </Typography>
                        </Stack>
                      </Stack>
                    ))}
                  </Stack>

                  {test.tags?.length ? (
                    <Stack spacing={1}>
                      <Typography variant="subtitle1" fontWeight={700}>
                        {t('testsPage.tags')}
                      </Typography>
                      <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
                        {test.tags.map((tag) => (
                          <Chip key={tag.id} label={tag.name} />
                        ))}
                      </Stack>
                    </Stack>
                  ) : null}
                </Stack>
              </CardContent>
            </Card>
          </Grid>

          <Grid size={{ xs: 12, lg: 4 }}>
            <Card variant="outlined" sx={{ height: '100%' }}>
              <CardContent>
                <Stack spacing={3}>
                  <Stack spacing={1} alignItems="flex-start">
                    <Typography variant="subtitle1" fontWeight={700}>
                      {t('testsPage.startTitle')}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {t('testsPage.startDescription')}
                    </Typography>
                    <Button
                      variant="contained"
                      size="large"
                      startIcon={<PlayArrowRoundedIcon />}
                      onClick={handleStart}
                    >
                      {t('testsPage.startButton')}
                    </Button>
                    <Typography variant="body2" color="text.secondary">
                      {t('testsPage.bestResult', { result: test.userBestResult ?? '0', total: test.questionsCount })}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {t('testsPage.lastPassed', { value: test.lastPassed ?? t('testsPage.notPassed') })}
                    </Typography>
                  </Stack>

                  <Divider />

                  <TestResultsList title={t('testsPage.bestResults')} results={bestResults} total={test.questionsCount} />
                  <TestResultsList title={t('testsPage.lastResults')} results={lastResults} total={test.questionsCount} />
                </Stack>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Stack>
    </Box>
  );
};

export default TestDetailPage;

import { useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate, useParams } from 'react-router';
import {
  Avatar,
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  CircularProgress,
  Divider,
  Grid,
  Stack,
  Typography,
} from '@mui/material';
import { getResourceById, resources } from 'app/routes/resources';
import { useSnackbar } from 'notistack';
import KepcoinSpendConfirm from 'shared/components/common/KepcoinSpendConfirm';
import { responsivePagePaddingSx } from 'shared/lib/styles';
import { startTest } from '../../application/mutations.ts';
import { useTestDetail, useTestResults } from '../../application/queries.ts';

const TestDetailPage = () => {
  const { t } = useTranslation();
  const { enqueueSnackbar } = useSnackbar();
  const navigate = useNavigate();
  const { id } = useParams();

  const { data: test, isLoading } = useTestDetail(id);
  const { data: results, isLoading: isResultsLoading } = useTestResults(id);
  const [canStart, setCanStart] = useState(false);
  const [isStarting, setIsStarting] = useState(false);

  useEffect(() => {
    if (test?.canStart !== undefined) {
      setCanStart(Boolean(test.canStart));
    }
  }, [test?.canStart]);

  const metrics = useMemo(
    () => [
      { label: t('tests.questions'), value: test?.questionsCount ?? test?.questions?.length ?? 0 },
      { label: t('tests.durationLabel'), value: test?.duration || '—' },
      { label: t('tests.difficulty'), value: test?.difficultyTitle || '—' },
      { label: t('tests.passes'), value: test?.passesCount ?? 0 },
    ],
    [
      t,
      test?.questionsCount,
      test?.questions?.length,
      test?.duration,
      test?.difficultyTitle,
      test?.passesCount,
    ],
  );

  const handleStart = async () => {
    if (!test) return;

    setIsStarting(true);

    try {
      const response = await startTest(test.id);

      if (response.success && response.testPassId) {
        navigate(getResourceById(resources.TestPass, response.testPassId));
        return;
      }

      enqueueSnackbar(t('tests.startError'), { variant: 'error' });
    } catch {
      enqueueSnackbar(t('tests.startError'), { variant: 'error' });
    } finally {
      setIsStarting(false);
    }
  };

  const renderStartButton = (enableStart: boolean) => (
    <Button
      variant="contained"
      size="large"
      onClick={enableStart ? handleStart : undefined}
      fullWidth
      disabled={enableStart && isStarting}
    >
      {enableStart && isStarting ? (
        <CircularProgress size={20} color="inherit" />
      ) : (
        t('tests.start')
      )}
    </Button>
  );

  if (isLoading || !test) {
    return (
      <Box sx={{ ...responsivePagePaddingSx, display: 'flex', justifyContent: 'center' }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={responsivePagePaddingSx}>
      <Stack direction="column" spacing={3}>
        <Stack direction="column" spacing={1}>
          <Typography variant="h4" fontWeight={800}>
            {test.title}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {test.description}
          </Typography>
        </Stack>

        <Grid container spacing={3}>
          <Grid size={{ xs: 12, md: 8 }}>
            <Card sx={{ height: '100%' }}>
              <CardContent>
                <Stack direction="row" spacing={2} alignItems="center" sx={{ mb: 2 }}>
                  <Avatar
                    src={test.chapter.icon}
                    variant="rounded"
                    sx={{width: 48, height: 48 }}
                  />
                  <Stack direction="column" spacing={0.5}>
                    <Typography variant="subtitle2" color="text.secondary">
                      {test.chapter.title}
                    </Typography>
                    <Typography variant="subtitle1" fontWeight={700}>
                      {t('tests.passTitle')}
                    </Typography>
                  </Stack>
                </Stack>

                <Grid container spacing={2}>
                  {metrics.map((metric) => (
                    <Grid key={metric.label} size={{ xs: 6, sm: 3 }}>
                      <Stack direction="column" spacing={0.5} alignItems="center" textAlign="center">
                        <Typography variant="h6" fontWeight={800}>
                          {metric.value}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          {metric.label}
                        </Typography>
                      </Stack>
                    </Grid>
                  ))}
                </Grid>

                {test.tags?.length ? (
                  <Stack direction="column" spacing={1} sx={{ mt: 3 }}>
                    <Typography variant="subtitle2" color="text.secondary">
                      {t('tests.tags')}
                    </Typography>
                    <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
                      {test.tags.map((tag) => (
                        <Chip key={tag.id} label={tag.name} size="small" />
                      ))}
                    </Stack>
                  </Stack>
                ) : null}
              </CardContent>
            </Card>
          </Grid>

          <Grid size={{ xs: 12, md: 4 }}>
            <Card>
              <CardContent>
                <Stack direction="column" spacing={2}>
                  {canStart ? (
                    renderStartButton(true)
                  ) : (
                    <KepcoinSpendConfirm
                      value={1}
                      purchaseUrl={`/api/tests/${test.id}/purchase/`}
                      onSuccess={() => setCanStart(true)}
                      disabled={isStarting}
                    >
                      {renderStartButton(false)}
                    </KepcoinSpendConfirm>
                  )}

                  <Divider />

                  <Stack direction="column" spacing={1}>
                    <Typography variant="subtitle1" fontWeight={700}>
                      {t('tests.bestResult')}
                    </Typography>
                    <Typography variant="h5" color="primary">
                      {test.userBestResult ?? 0}/
                      {test.questionsCount ?? test.questions?.length ?? 0}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {t('tests.lastPass')}: {test.lastPassed || t('tests.notPassed')}
                    </Typography>
                  </Stack>
                </Stack>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        <Grid spacing={2} container size={12}>
          <Grid size={{ xs: 12, lg: 6 }}>
            <Card>
              <CardContent>
                <Stack direction="column" spacing={2}>
                  <Typography variant="h6" fontWeight={800}>
                    {t('tests.recentResults')}
                  </Typography>
                  {isResultsLoading ? (
                    <CircularProgress size={24} />
                  ) : (
                    <Stack direction="column" spacing={2}>
                      <Stack direction="column" spacing={1}>
                        <Typography variant="subtitle2" color="text.secondary">
                          {t('tests.bestAttempts')}
                        </Typography>
                        <Stack direction="column" spacing={1}>
                          {results?.bestResults?.map((result) => (
                            <Stack
                              key={`${result.username}-${result.finished}`}
                              direction="row"
                              justifyContent="space-between"
                            >
                              <Typography variant="body2">{result.username}</Typography>
                              <Typography variant="body2" color="text.secondary">
                                {result.result}/{test.questionsCount ?? test.questions?.length ?? 0}
                              </Typography>
                            </Stack>
                          )) || null}
                        </Stack>
                      </Stack>
                    </Stack>
                  )}
                </Stack>
              </CardContent>
            </Card>
          </Grid>

          <Grid size={{ xs: 12, lg: 6 }}>
            <Card>
              <CardContent>
                <Stack direction="column" spacing={2}>
                  <Typography variant="h6" fontWeight={800}>
                    {t('tests.lastAttempts')}
                  </Typography>
                  <Stack direction="column" spacing={1}>
                    {results?.lastResults?.map((result) => (
                      <Stack
                        key={`${result.username}-${result.finished}`}
                        direction="row"
                        justifyContent="space-between"
                      >
                        <Stack direction="column" spacing={0.25}>
                          <Typography variant="body2">{result.username}</Typography>
                          <Typography variant="caption" color="text.secondary">
                            {result.finished}
                          </Typography>
                        </Stack>
                        <Typography variant="body2" color="text.secondary">
                          {result.result}/{test.questionsCount ?? test.questions?.length ?? 0}
                        </Typography>
                      </Stack>
                    )) || null}
                  </Stack>
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

import { useTranslation } from 'react-i18next';
import { Link as RouterLink, useParams } from 'react-router-dom';
import { Card, CardContent, Chip, Grid, Stack, Typography, Box } from '@mui/material';
import { useDocumentTitle } from 'app/providers/DocumentTitleProvider';
import { getResourceById, getResourceByParams, resources } from 'app/routes/resources';
import { responsivePagePaddingSx } from 'shared/lib/styles';
import KepIcon from 'shared/components/base/KepIcon';
import ContestCountdownCard from '../components/ContestCountdownCard';
import { useContest, useContestProblems } from '../../application/queries';
import { ContestProblemEntity } from '../../domain/entities/contest-problem.entity';
import { ContestStatus } from '../../domain/entities/contest-status';
import { contestHasBalls } from '../../utils/contestType';
import ContestPageHeader from '../components/ContestPageHeader';

const ContestProblemsPage = () => {
  const { id } = useParams<{ id: string }>();
  const contestId = id ? Number(id) : undefined;
  const { t } = useTranslation();

  const { data: contest } = useContest(contestId);
  const { data: problems = [], isLoading } = useContestProblems(contestId);
  useDocumentTitle(
    contest?.title ? 'pageTitles.contestProblems' : undefined,
    contest?.title
      ? {
          contestTitle: contest.title,
        }
      : undefined,
  );

  return (
    <Stack spacing={3} sx={responsivePagePaddingSx}>
      <ContestPageHeader
        title={contest?.title ?? t('contests.tabs.problems')}
        contest={contest as any}
        contestId={contestId}
      />

      <Grid container spacing={3}>
        <Grid size={{ xs: 12, md: 9 }}>
          <Stack spacing={1.25}>
            {problems.map((problem) => (
              <Box
                key={problem.symbol}
                sx={{
                  p: 1.5,
                  bgcolor: 'background.elevation1',
                  borderRadius: 2,
                  display: 'flex',
                  alignItems: 'center',
                  gap: 1.5,
                  justifyContent: 'space-between',
                }}
              >
                <Stack direction="row" spacing={1.25} alignItems="center" sx={{ minWidth: 0, flex: 1 }}>
                  <Chip label={problem.symbol} color="primary" size="small" />
                  <Stack spacing={0.25} minWidth={0}>
                    <Typography
                      component={RouterLink}
                      to={getResourceByParams(resources.ContestProblem, {
                        id: contest?.id ?? contestId ?? '',
                        symbol: problem.symbol,
                      })}
                      sx={{ textDecoration: 'none', color: 'text.primary', fontWeight: 700 }}
                      noWrap
                    >
                      {problem.problem.title}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      {problem.problem.timeLimit} ms · {problem.problem.memoryLimit} MB
                    </Typography>
                  </Stack>
                </Stack>

                <Stack direction="row" spacing={1} alignItems="center" flexShrink={0}>
                  {contestHasBalls(contest?.type) && (
                    <Chip label={problem.ball ?? '—'} size="small" variant="outlined" />
                  )}
                  <Stack direction="row" spacing={1}>
                    <Chip
                      icon={<KepIcon name="solved" fontSize={16} />}
                      label={problem.solved ?? 0}
                      size="small"
                      color="success"
                      variant="outlined"
                    />
                    <Chip
                      icon={<KepIcon name="unsolved" fontSize={16} />}
                      label={(problem.attemptUsersCount ?? 0) - (problem.solved ?? 0)}
                      size="small"
                      color="error"
                      variant="outlined"
                    />
                  </Stack>
                </Stack>
              </Box>
            ))}
            {!problems.length && (
              <Typography variant="body2" color="text.secondary">
                {isLoading ? t('contests.loading') : t('contests.noProblems')}
              </Typography>
            )}
          </Stack>
        </Grid>
        <Grid size={{ xs: 12, md: 3 }}>
          <ContestCountdownCard contest={contest} />
        </Grid>
      </Grid>
    </Stack>
  );
};

export default ContestProblemsPage;

import { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useParams } from 'react-router-dom';
import {
  Box,
  Button,
  Card,
  CardContent,
  Grid,
  Stack,
  TextField,
  Typography,
} from '@mui/material';
import { GridPaginationModel } from '@mui/x-data-grid';
import { useDocumentTitle } from 'app/providers/DocumentTitleProvider';
import { useAuth } from 'app/providers/AuthProvider';
import OnlyMeSwitch from 'shared/components/common/OnlyMeSwitch';
import { getResourceByParams, resources } from 'app/routes/resources';
import { gridPaginationToPageParams } from 'shared/lib/pagination';
import { responsivePagePaddingSx } from 'shared/lib/styles';
import ProblemsAttemptsTable from 'modules/problems/ui/components/ProblemsAttemptsTable.tsx';
import { AttemptsListParams } from 'modules/problems/domain/ports/problems.repository';
import { useAttemptVerdicts, useAttemptsList } from 'modules/problems/application/queries';
import ContestCountdownCard from '../components/ContestCountdownCard';
import { useContest, useContestProblems } from '../../application/queries';
import { ContestProblemEntity } from '../../domain/entities/contest-problem.entity';
import ContestPageHeader from '../components/ContestPageHeader';

interface AttemptsFilterState {
  contestProblem: string;
  verdict: string;
  userOnly: boolean;
}

const ContestAttemptsPage = () => {
  const { id } = useParams<{ id: string }>();
  const contestId = id ? Number(id) : undefined;
  const { currentUser } = useAuth();
  const { t } = useTranslation();

  const { data: contest } = useContest(contestId);
  const { data: contestProblems = [] } = useContestProblems(contestId);
  const { data: verdictOptions = [] } = useAttemptVerdicts();
  useDocumentTitle(
    contest?.title ? 'pageTitles.contestAttempts' : undefined,
    contest?.title
      ? {
          contestTitle: contest.title,
        }
      : undefined,
  );

  const [filter, setFilter] = useState<AttemptsFilterState>({
    contestProblem: '',
    verdict: '',
    userOnly: false,
  });

  const [paginationModel, setPaginationModel] = useState<GridPaginationModel>({
    page: 0,
    pageSize: 20,
  });
  const paginationParams = useMemo(
    () => gridPaginationToPageParams(paginationModel),
    [paginationModel],
  );

  const requestParams = useMemo<AttemptsListParams>(() => {
    const verdictNumber = filter.verdict ? Number(filter.verdict) : NaN;
    return {
      contestId,
      contestProblem: filter.contestProblem || undefined,
      verdict: Number.isNaN(verdictNumber) ? undefined : verdictNumber,
      username: filter.userOnly && currentUser?.username ? currentUser.username : undefined,
      ordering: '-id',
      page: paginationParams.page,
      pageSize: paginationParams.pageSize,
    };
  }, [contestId, currentUser?.username, filter.contestProblem, filter.userOnly, filter.verdict, paginationParams.page, paginationParams.pageSize]);

  const { data: attemptsPage, isLoading, mutate } = useAttemptsList(requestParams);

  const handleFilterChange = <K extends keyof AttemptsFilterState>(key: K, value: AttemptsFilterState[K]) => {
    setFilter((prev) => ({ ...prev, [key]: value }));
    setPaginationModel((prev) => ({ ...prev, page: 0 }));
  };

  const handleReset = () => {
    setFilter({ contestProblem: '', verdict: '', userOnly: false });
    setPaginationModel((prev) => ({ ...prev, page: 0 }));
  };

  const problemsOptions = useMemo(
    () =>
      contestProblems.map((problem: ContestProblemEntity) => ({
        value: problem.symbol,
        label: `${problem.symbol}. ${problem.problem.title}`,
      })),
    [contestProblems],
  );

  return (
    <Stack spacing={3} sx={responsivePagePaddingSx}>
      <ContestPageHeader
        title={contest?.title ?? t('contests.tabs.attempts')}
        contest={contest as any}
        contestId={contestId}
      />

      <Grid container spacing={3}>
        <Grid size={{ xs: 12, md: 9 }}>
          <ProblemsAttemptsTable
            attempts={attemptsPage?.data ?? []}
            total={attemptsPage?.total ?? 0}
            paginationModel={paginationModel}
            onPaginationChange={setPaginationModel}
            isLoading={isLoading}
            onRerun={() => mutate()}
            showProblemColumn
            getProblemLink={(attempt) =>
              getResourceByParams(resources.ContestProblem, {
                id: contest?.id ?? contestId ?? '',
                symbol: attempt.contestProblemSymbol ?? attempt.problemId?.toString() ?? '',
              })
            }
          />
        </Grid>
        <Grid size={{ xs: 12, md: 3 }}>
          <Stack spacing={2}>
            <ContestCountdownCard contest={contest} />

            <Card variant="outlined" sx={{ borderRadius: 3 }}>
              <CardContent>
                <Stack spacing={2}>
                  <Typography variant="subtitle2" fontWeight={700}>
                    {t('contests.filter.title')}
                  </Typography>

                  <TextField
                    select
                    label={t('contests.filter.problem')}
                    value={filter.contestProblem}
                    onChange={(event) => handleFilterChange('contestProblem', event.target.value)}
                    SelectProps={{ native: true }}
                    size="small"
                  >
                    <option value="">{t('contests.filter.anyProblem')}</option>
                    {problemsOptions.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </TextField>

                  <TextField
                    select
                    label={t('contests.filter.verdict')}
                    value={filter.verdict}
                    onChange={(event) => handleFilterChange('verdict', event.target.value)}
                    SelectProps={{ native: true }}
                    size="small"
                  >
                    <option value="">{t('contests.filter.anyVerdict')}</option>
                    {verdictOptions.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </TextField>

                  {currentUser ? (
                    <OnlyMeSwitch
                      label={t('contests.filter.onlyMe')}
                      checked={filter.userOnly}
                      onChange={(_, checked) => handleFilterChange('userOnly', checked)}
                    />
                  ) : null}

                  <Box display="flex" gap={1}>
                    <Button variant="contained" fullWidth onClick={() => mutate()}>
                      {t('contests.filter.apply')}
                    </Button>
                    <Button variant="outlined" fullWidth color="secondary" onClick={handleReset}>
                      {t('contests.filter.reset')}
                    </Button>
                  </Box>
                </Stack>
              </CardContent>
            </Card>
          </Stack>
        </Grid>
      </Grid>
    </Stack>
  );
};

export default ContestAttemptsPage;

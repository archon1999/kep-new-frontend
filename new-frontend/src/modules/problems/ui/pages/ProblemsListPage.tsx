import { useState } from 'react';
import { Box, Grid, Stack, Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { useAuth } from 'app/providers/AuthProvider.tsx';
import { responsivePagePaddingSx } from 'shared/lib/styles';
import ProblemsFilter from '../components/ProblemsFilter.tsx';
import ProblemsTable from '../components/ProblemsTable.tsx';
import ProblemsSummaryCard from '../components/ProblemsSummaryCard.tsx';
import ProblemsDifficultiesCard from '../components/ProblemsDifficultiesCard.tsx';
import ProblemsActivityTabs from '../components/ProblemsActivityTabs.tsx';
import {
  useLastAttempts,
  useLastContestProblems,
  useMostViewedProblems,
  useProblemFilters,
  useProblemsList,
  useProblemsSummary,
} from '../../application/queries.ts';
import { ProblemsListParams } from '../../domain';

const defaultFilter: ProblemsListParams = {
  page: 1,
  pageSize: 20,
  ordering: '-id',
  tags: [],
};

const ProblemsListPage = () => {
  const { t } = useTranslation();
  const { currentUser } = useAuth();

  const [filter, setFilter] = useState<ProblemsListParams>(defaultFilter);

  const filters = useProblemFilters();
  const { data: problemsPage, isLoading: problemsLoading } = useProblemsList(filter);
  const { data: summary, isLoading: summaryLoading } = useProblemsSummary(currentUser?.username);
  const { data: attempts } = useLastAttempts(currentUser?.username);
  const { data: lastContest } = useLastContestProblems();
  const { data: mostViewed } = useMostViewedProblems();

  const handleFilterChange = (value: Partial<ProblemsListParams>) => {
    setFilter((prev) => ({ ...prev, ...value, page: 1 }));
  };

  const handlePageChange = (page: number) => setFilter((prev) => ({ ...prev, page }));
  const handlePageSizeChange = (pageSize: number) => setFilter((prev) => ({ ...prev, pageSize, page: 1 }));

  return (
    <Box sx={responsivePagePaddingSx}>
      <Stack spacing={4} direction="column">
        <Stack spacing={1} direction="column">
          <Typography variant="h4" fontWeight={800}>
            {t('problems.pageTitle')}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {t('problems.pageSubtitle')}
          </Typography>
        </Stack>

        <Grid container spacing={3}>
          <Grid item xs={12} md={8}>
            <Stack spacing={2.5} direction="column">
              <ProblemsFilter
                filter={filter}
                onChange={handleFilterChange}
                categories={filters.categories.data}
                difficulties={filters.difficulties.data}
                languages={filters.languages.data}
                problemCount={problemsPage?.total ?? 0}
              />

              <ProblemsTable
                pageResult={problemsPage}
                loading={problemsLoading}
                onPageChange={handlePageChange}
                onPageSizeChange={handlePageSizeChange}
              />
            </Stack>
          </Grid>

          <Grid item xs={12} md={4}>
            <Stack spacing={2.5} direction="column">
              {currentUser ? (
                <>
                  <ProblemsSummaryCard summary={summary} />
                  <ProblemsDifficultiesCard summary={summary} loading={summaryLoading} />
                </>
              ) : null}

              <ProblemsActivityTabs
                attempts={attempts}
                lastContest={lastContest}
                mostViewed={mostViewed}
              />
            </Stack>
          </Grid>
        </Grid>
      </Stack>
    </Box>
  );
};

export default ProblemsListPage;

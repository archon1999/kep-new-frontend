import { useMemo, useState } from 'react';
import { Box, Grid2 as Grid, Stack, Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { useAuth } from 'app/providers/AuthProvider.tsx';
import { responsivePagePaddingSx } from 'shared/lib/styles';
import ProblemsFilter from '../components/ProblemsFilter.tsx';
import ProblemsTable from '../components/ProblemsTable.tsx';
import ProblemsSummaryCard from '../components/ProblemsSummaryCard.tsx';
import ProblemsDifficultiesCard from '../components/ProblemsDifficultiesCard.tsx';
import ProblemsHighlightsTabs from '../components/ProblemsHighlightsTabs.tsx';
import {
  useDifficulties,
  useLastAttempts,
  useLastContestProblems,
  useMostViewedProblems,
  useProblemsList,
  useProblemsSummary,
} from '../../application/queries.ts';
import { Problem } from '../../domain/entities/problem.entity.ts';

const defaultFilters = {
  search: '',
  difficulty: 0,
  status: 0,
  hasSolution: false,
  hasChecker: false,
  favorites: false,
  tags: [] as number[],
};

const mockTags = [
  { id: 1, name: 'Graphs' },
  { id: 2, name: 'Dynamic Programming' },
  { id: 3, name: 'Arrays' },
  { id: 4, name: 'Strings' },
];

const ProblemsListPage = () => {
  const { t } = useTranslation();
  const { currentUser } = useAuth();
  const [filters, setFilters] = useState(defaultFilters);

  const { data: problemsPage } = useProblemsList({ page: 1, pageSize: 10, filters });
  const { data: summary, isLoading: isSummaryLoading } = useProblemsSummary(currentUser?.username);
  const { data: difficulties, isLoading: isDifficultiesLoading } = useDifficulties(currentUser?.username);
  const { data: attempts } = useLastAttempts({ page: 1, pageSize: 5 });
  const { data: lastContest } = useLastContestProblems({ page: 1, pageSize: 5 });
  const { data: mostViewed } = useMostViewedProblems({ page: 1, pageSize: 5 });

  const filteredProblems = useMemo<Problem[]>(() => problemsPage?.data ?? [], [problemsPage]);

  return (
    <Box sx={responsivePagePaddingSx}>
      <Stack spacing={4}>
        <Stack spacing={1}>
          <Typography variant="h4" fontWeight={800}>
            {t('problems.pageTitle')}
          </Typography>
          <Typography variant="body1" color="text.secondary">
            {t('problems.pageSubtitle')}
          </Typography>
        </Stack>

        <Grid container spacing={3}>
          <Grid size={{ xs: 12, lg: 8 }}>
            <Stack spacing={3}>
              <ProblemsFilter
                value={filters}
                onChange={(updated) => setFilters({ ...filters, ...updated })}
                onReset={() => setFilters(defaultFilters)}
                availableTags={mockTags}
                selectedTags={filters.tags}
              />
              <ProblemsTable problems={filteredProblems} />
            </Stack>
          </Grid>

          <Grid size={{ xs: 12, lg: 4 }}>
            <Stack spacing={3}>
              <ProblemsSummaryCard summary={summary} isLoading={isSummaryLoading} />
              <ProblemsDifficultiesCard difficulties={difficulties} isLoading={isDifficultiesLoading} />
              <ProblemsHighlightsTabs
                attempts={attempts ?? []}
                lastContest={lastContest ?? []}
                mostViewed={mostViewed ?? []}
              />
            </Stack>
          </Grid>
        </Grid>
      </Stack>
    </Box>
  );
};

export default ProblemsListPage;

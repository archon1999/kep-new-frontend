import { useMemo, useState } from 'react';
import { Box, Grid, Stack, Tab, Tabs, Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { responsivePagePaddingSx } from 'shared/lib/styles';
import { useAuth } from 'app/providers/AuthProvider.tsx';
import ProblemsFilterPanel, { ProblemsFilterState } from '../components/ProblemsFilterPanel.tsx';
import ProblemsTable from '../components/ProblemsTable.tsx';
import ProblemsSummaryCard from '../components/ProblemsSummaryCard.tsx';
import ProblemsDifficultyCard from '../components/ProblemsDifficultyCard.tsx';
import ProblemsAttemptsCard from '../components/ProblemsAttemptsCard.tsx';
import MostViewedProblemsCard from '../components/MostViewedProblemsCard.tsx';
import LastContestProblemsCard from '../components/LastContestProblemsCard.tsx';
import {
  useLastContest,
  useMostViewedProblems,
  useProblemAttempts,
  useProblemDifficulties,
  useProblemTags,
  useProblemsList,
  useProblemsRating,
} from '../../application/queries.ts';

const defaultFilters: ProblemsFilterState = {
  search: '',
  tags: [],
  favorites: false,
};

const ProblemsListPage = () => {
  const { t } = useTranslation();
  const { currentUser } = useAuth();

  const [filters, setFilters] = useState<ProblemsFilterState>(defaultFilters);
  const [page, setPage] = useState(1);

  const listParams = useMemo(
    () => ({ ...filters, page, pageSize: 10 }),
    [filters, page],
  );

  const { data: problemsPage, isLoading } = useProblemsList(listParams);
  const { data: tags } = useProblemTags();
  const { data: difficulties } = useProblemDifficulties();
  const { data: rating } = useProblemsRating(currentUser?.username);
  const { data: attempts } = useProblemAttempts(currentUser?.username);
  const { data: mostViewed } = useMostViewedProblems();
  const { data: lastContest } = useLastContest();

  return (
    <Box sx={responsivePagePaddingSx}>
      <Stack spacing={3} direction="column">
        <Stack spacing={1} direction="column">
          <Typography variant="h4" fontWeight={800}>
            {t('problems.title')}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {t('problems.subtitle')}
          </Typography>
        </Stack>

        <Grid container spacing={3}>
          <Grid size={{ xs: 12, md: 8 }}>
            <Stack spacing={2} direction="column">
              <ProblemsFilterPanel
                value={filters}
                onChange={(next) => {
                  setFilters(next);
                  setPage(1);
                }}
                tags={tags}
                difficulties={difficulties}
              />

              <ProblemsTable
                pageResult={problemsPage}
                isLoading={isLoading}
                page={page}
                onPageChange={setPage}
              />
            </Stack>
          </Grid>

          <Grid size={{ xs: 12, md: 4 }}>
            <Stack spacing={2} direction="column">
              {currentUser && <ProblemsSummaryCard rating={rating ?? undefined} />}
              {currentUser && <ProblemsDifficultyCard rating={rating ?? undefined} />}

              <Tabs value={0} sx={{ borderRadius: 2, bgcolor: 'background.paper' }} variant="fullWidth">
                <Tab label={t('problems.lastAttemptsTab')} />
              </Tabs>
              <ProblemsAttemptsCard attempts={attempts ?? []} />

              <Tabs value={0} sx={{ borderRadius: 2, bgcolor: 'background.paper' }} variant="fullWidth">
                <Tab label={t('problems.lastContestTab')} />
              </Tabs>
              <LastContestProblemsCard contest={lastContest} />

              <Tabs value={0} sx={{ borderRadius: 2, bgcolor: 'background.paper' }} variant="fullWidth">
                <Tab label={t('problems.mostViewedTab')} />
              </Tabs>
              <MostViewedProblemsCard problems={mostViewed} />
            </Stack>
          </Grid>
        </Grid>
      </Stack>
    </Box>
  );
};

export default ProblemsListPage;

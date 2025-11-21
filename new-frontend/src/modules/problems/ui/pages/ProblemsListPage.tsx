import { useMemo, useState } from 'react';
import { Box, Grid, Stack, Tab, Tabs, Typography } from '@mui/material';
import { useNavigate } from 'react-router';
import { useTranslation } from 'react-i18next';
import { responsivePagePaddingSx } from 'shared/lib/styles';
import { useAuth } from 'app/providers/AuthProvider.tsx';
import { getResourceById, resources } from 'app/routes/resources.ts';
import {
  useLastAttempts,
  useLastContestProblems,
  useMostViewedProblems,
  useProblemCategories,
  useProblemDifficulties,
  useProblemLanguages,
  useProblemsList,
  useProblemsSummary,
} from '../../application/queries.ts';
import { ProblemsFilter } from '../../domain/entities/problems-filter.entity.ts';
import ProblemsFilterForm from '../components/ProblemsFilter.tsx';
import ProblemsTable from '../components/ProblemsTable.tsx';
import ProblemsSummaryCard from '../components/ProblemsSummaryCard.tsx';
import ProblemsDifficultiesCard from '../components/ProblemsDifficultiesCard.tsx';
import ProblemsListCard from '../components/ProblemsListCard.tsx';

const defaultFilter: ProblemsFilter = {
  page: 1,
  pageSize: 20,
  ordering: 'id',
  tags: [],
};

const ProblemsListPage = () => {
  const { t } = useTranslation();
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const [filter, setFilter] = useState<ProblemsFilter>(defaultFilter);
  const [activeTab, setActiveTab] = useState<'attempts' | 'contest' | 'mostViewed'>('attempts');

  const { data: pageResult, isLoading: isProblemsLoading } = useProblemsList(filter);
  const { data: categories } = useProblemCategories();
  const { data: difficulties } = useProblemDifficulties();
  const { data: languages } = useProblemLanguages();
  const { data: summary, isLoading: isSummaryLoading } = useProblemsSummary(currentUser?.username);
  const { data: mostViewed, isLoading: isMostViewedLoading } = useMostViewedProblems();
  const { data: lastContest, isLoading: isLastContestLoading } = useLastContestProblems();
  const { data: lastAttempts, isLoading: isLastAttemptsLoading } = useLastAttempts(currentUser?.username);

  const problems = useMemo(() => pageResult?.data ?? [], [pageResult]);

  const handleFilterChange = (next: ProblemsFilter) => {
    setFilter((prev) => ({ ...prev, ...next }));
  };

  const handleOrderingChange = (ordering: string) => {
    setFilter((prev) => ({ ...prev, ordering, page: 1 }));
  };

  const handleTagClick = (tagId: number) => {
    setFilter((prev) => {
      const tags = new Set(prev.tags ?? []);
      tags.add(tagId);
      return { ...prev, tags: Array.from(tags), page: 1 };
    });
  };

  const handlePageChange = (page: number) => {
    setFilter((prev) => ({ ...prev, page }));
  };

  const handlePageSizeChange = (pageSize: number) => {
    setFilter((prev) => ({ ...prev, pageSize, page: 1 }));
  };

  return (
    <Box sx={responsivePagePaddingSx}>
      <Stack direction="column" spacing={3}>
        <Stack direction="column" spacing={1}>
          <Typography variant="h4" fontWeight={800}>
            {t('problems.title')}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {t('problems.subtitle')}
          </Typography>
        </Stack>

        <Grid container spacing={3}>
          <Grid item xs={12} md={8}>
            <Stack direction="column" spacing={2}>
              <ProblemsFilterForm
                filter={filter}
                onChange={handleFilterChange}
                categories={categories}
                difficulties={difficulties}
                languages={languages}
                total={pageResult?.total}
              />

              <ProblemsTable
                problems={problems}
                total={pageResult?.total}
                page={filter.page ?? 1}
                pageSize={filter.pageSize ?? 20}
                ordering={filter.ordering}
                loading={isProblemsLoading}
                onOrderingChange={handleOrderingChange}
                onPageChange={handlePageChange}
                onPageSizeChange={handlePageSizeChange}
                onTagClick={handleTagClick}
              />
            </Stack>
          </Grid>

          <Grid item xs={12} md={4}>
            <Stack direction="column" spacing={2}>
              {currentUser ? (
                <>
                  <ProblemsSummaryCard summary={summary} loading={isSummaryLoading} />
                  <ProblemsDifficultiesCard summary={summary} loading={isSummaryLoading} />
                </>
              ) : null}

              <Stack direction="column" spacing={1}>
                <Tabs
                  value={activeTab}
                  onChange={(_, value) => setActiveTab(value)}
                  variant="fullWidth"
                  textColor="secondary"
                  indicatorColor="secondary"
                >
                  <Tab value="attempts" label={t('problems.tabLastAttempts')} />
                  <Tab value="contest" label={t('problems.tabLastContest')} />
                  <Tab value="mostViewed" label={t('problems.tabMostViewed')} />
                </Tabs>

                {activeTab === 'attempts' && (
                  <ProblemsListCard
                    titleKey="problems.tabLastAttempts"
                    icon="mdi:target-account"
                    items={lastAttempts ?? []}
                    loading={isLastAttemptsLoading}
                    actionLabel="problems.viewAllAttempts"
                    actionHref={resources.Attempts}
                  />
                )}

                {activeTab === 'contest' && (
                  <ProblemsListCard
                    titleKey="problems.tabLastContest"
                    icon="mdi:trophy-outline"
                    items={lastContest?.problems ?? []}
                    loading={isLastContestLoading}
                    actionLabel="problems.goToContest"
                    actionHref={lastContest ? resources.Contest.replace(':id', String(lastContest.id)) : undefined}
                  />
                )}

                {activeTab === 'mostViewed' && (
                  <ProblemsListCard
                    titleKey="problems.tabMostViewed"
                    icon="mdi:eye-outline"
                    items={mostViewed ?? []}
                    loading={isMostViewedLoading}
                    actionLabel="problems.pickOne"
                    onAction={() => {
                      if (!mostViewed || mostViewed.length === 0) return;
                      const random = mostViewed[Math.floor(Math.random() * mostViewed.length)];
                      if (random?.id) {
                        navigate(getResourceById(resources.Problem, random.id));
                      }
                    }}
                  />
                )}
              </Stack>
            </Stack>
          </Grid>
        </Grid>
      </Stack>
    </Box>
  );
};

export default ProblemsListPage;

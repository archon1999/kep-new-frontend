import { useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Box, Chip, Grid, Pagination, Skeleton, Stack, Typography } from '@mui/material';
import useDebouncedValue from 'shared/hooks/useDebouncedValue';
import { responsivePagePaddingSx } from 'shared/lib/styles';
import { useContestCategories, useContestsList } from '../../application/queries';
import ContestCard from '../components/ContestCard';
import ContestsFilters, { ContestsFilterState } from '../components/ContestsFilters';

const PAGE_SIZE = 6;

const initialFilters: ContestsFilterState = {
  title: '',
  category: '',
  type: '',
  isParticipated: '',
};

const ContestsListPage = () => {
  const { t } = useTranslation();
  const [filters, setFilters] = useState<ContestsFilterState>(initialFilters);
  const [page, setPage] = useState(1);
  const debouncedTitle = useDebouncedValue(filters.title, 400);

  const listParams = useMemo(
    () => ({
      page,
      pageSize: PAGE_SIZE,
      title: debouncedTitle || undefined,
      category: filters.category || undefined,
      type: filters.type || undefined,
      is_participated: filters.isParticipated || undefined,
    }),
    [page, debouncedTitle, filters.category, filters.type, filters.isParticipated],
  );

  const { data: contestsPage, isLoading } = useContestsList(listParams);
  const { data: categories = [] } = useContestCategories();

  const contests = contestsPage?.data ?? [];
  const total = contestsPage?.total ?? contestsPage?.count ?? contests.length;
  const showEmptyState = !isLoading && contests.length === 0;

  useEffect(() => {
    setPage(1);
  }, [debouncedTitle, filters.category, filters.type, filters.isParticipated]);

  const handleFiltersChange = (next: ContestsFilterState) => setFilters(next);

  return (
    <Box sx={responsivePagePaddingSx}>
      <Stack direction="column" spacing={3}>
        <Stack
          direction="row"
          alignItems="center"
          justifyContent="space-between"
          flexWrap="wrap"
          rowGap={1.5}
        >
          <Stack direction="column" spacing={0.5}>
            <Typography variant="h4" fontWeight={800}>
              {t('menu.contests')}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {t('contests.subtitle')}
            </Typography>
          </Stack>

          {contestsPage ? (
            <Chip label={t('contests.countLabel', { count: contestsPage.total ?? contests.length })} />
          ) : null}
        </Stack>

        <Grid container spacing={3}>
          <Grid size={{ xs: 12, lg: 8 }}>
            {showEmptyState ? (
              <Box
                sx={{
                  py: 6,
                  px: 3,
                  borderRadius: 3,
                  bgcolor: 'background.paper',
                  textAlign: 'center',
                }}
              >
                <Typography variant="subtitle1" fontWeight={700}>
                  {t('contests.emptyTitle')}
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                  {t('contests.emptySubtitle')}
                </Typography>
              </Box>
            ) : (
              <Grid container spacing={3}>
                {isLoading
                  ? Array.from({ length: PAGE_SIZE }).map((_, idx) => (
                      <Grid size={{ xs: 12, md: 6 }} key={idx}>
                        <Skeleton variant="rounded" height={260} />
                      </Grid>
                    ))
                  : contests.map((contest) => (
                      <Grid size={{ xs: 12, md: 6 }} key={contest.id}>
                        <ContestCard contest={contest} />
                      </Grid>
                    ))}
              </Grid>
            )}

            <Stack direction="row" justifyContent="center" sx={{ mt: 3 }}>
              {total > PAGE_SIZE ? (
                <Pagination
                  color="primary"
                  count={Math.ceil(total / PAGE_SIZE)}
                  page={page}
                  onChange={(_, value) => setPage(value)}
                  shape="rounded"
                  size="large"
                />
              ) : null}
            </Stack>
          </Grid>

          <Grid size={{ xs: 12, lg: 4 }}>
            <ContestsFilters filters={filters} categories={categories} onChange={handleFiltersChange} />
          </Grid>
        </Grid>
      </Stack>
    </Box>
  );
};

export default ContestsListPage;

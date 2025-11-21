import { useEffect, useMemo, useState } from 'react';
import { Box, Card, CardContent, Chip, Grid, Pagination, Skeleton, Stack, Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';
import useDebouncedValue from 'shared/hooks/useDebouncedValue';
import { responsivePagePaddingSx } from 'shared/lib/styles';
import ContestCard from '../components/ContestCard';
import ContestFilters, { ContestFiltersState } from '../components/ContestFilters';
import { useContestCategories, useContestsList } from '../../application/queries';

const PAGE_SIZE = 6;

const initialFilters: ContestFiltersState = {
  title: '',
  category: '',
  type: '',
  participation: 'all',
};

const ContestsListPage = () => {
  const { t } = useTranslation();
  const [filters, setFilters] = useState<ContestFiltersState>(initialFilters);
  const [page, setPage] = useState(1);
  const debouncedTitle = useDebouncedValue(filters.title, 600);

  const listParams = useMemo(
    () => ({
      page,
      pageSize: PAGE_SIZE,
      title: debouncedTitle || undefined,
      category: filters.category || undefined,
      type: filters.type || undefined,
      is_participated:
        filters.participation === 'all'
          ? undefined
          : filters.participation === 'participated'
            ? '1'
            : '0',
    }),
    [page, debouncedTitle, filters.category, filters.participation, filters.type],
  );

  const { data: pageResult, isLoading } = useContestsList(listParams);
  const { data: categories } = useContestCategories();

  const contests = pageResult?.data ?? [];
  const total = pageResult?.total ?? contests.length;

  useEffect(() => {
    setPage(1);
  }, [debouncedTitle, filters.category, filters.participation, filters.type]);

  const showEmptyState = !isLoading && contests.length === 0;

  return (
    <Box sx={responsivePagePaddingSx}>
      <Stack direction="column" spacing={3}>
        <Stack direction="row" spacing={2} alignItems="center" justifyContent="space-between" flexWrap="wrap" rowGap={1.5}>
          <Stack direction="column" spacing={0.75}>
            <Typography variant="h4" fontWeight={800} sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              {t('menu.contests')}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {t('contests.subtitle')}
            </Typography>
          </Stack>

          {pageResult ? (
            <Chip label={t('contests.countLabel', { count: pageResult.total ?? contests.length })} />
          ) : null}
        </Stack>

        <Card variant="outlined">
          <CardContent>
            <ContestFilters filters={filters} categories={categories} onChange={setFilters} />
          </CardContent>
        </Card>

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
                  <Grid size={{ xs: 12 }} key={idx}>
                    <Skeleton variant="rounded" height={260} />
                  </Grid>
                ))
              : contests.map((contest) => (
                  <Grid size={{ xs: 12 }} key={contest.id}>
                    <ContestCard contest={contest} />
                  </Grid>
                ))}
          </Grid>
        )}

        <Stack direction="row" alignItems="center" justifyContent="center">
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
      </Stack>
    </Box>
  );
};

export default ContestsListPage;

import { useMemo, useState } from 'react';
import Grid from '@mui/material/Grid';
import { Link as RouterLink } from 'react-router-dom';
import { Box, Button, Card, CardContent, Chip, Divider, Skeleton, Stack, Typography } from '@mui/material';
import { GridPaginationModel, GridSortModel } from '@mui/x-data-grid';
import { useTranslation } from 'react-i18next';
import PageHeader from 'shared/components/sections/common/PageHeader';
import IconifyIcon from 'shared/components/base/IconifyIcon';
import { resources } from 'app/routes/resources';
import { useProblemsPeriodRating, useProblemsRating } from '../../application/queries';
import ProblemsRatingDataGrid, { ProblemsRatingColumnLabels } from '../components/ProblemsRatingDataGrid';

const difficulties = [
  { key: 'beginner', color: 'success' },
  { key: 'basic', color: 'info' },
  { key: 'normal', color: 'primary' },
  { key: 'medium', color: 'primary' },
  { key: 'advanced', color: 'warning' },
  { key: 'hard', color: 'error' },
  { key: 'extremal', color: 'secondary' },
] as const;

const sortFieldMap: Record<string, string> = {
  rating: 'rating',
  solved: 'solved',
  beginner: 'beginner',
  basic: 'basic',
  normal: 'normal',
  medium: 'medium',
  advanced: 'advanced',
  hard: 'hard',
  extremal: 'extremal',
};

const ProblemsRatingPage = () => {
  const { t } = useTranslation();

  const [paginationModel, setPaginationModel] = useState<GridPaginationModel>({ page: 0, pageSize: 10 });
  const [sortModel, setSortModel] = useState<GridSortModel>([{ field: 'rating', sort: 'desc' }]);

  const ordering = useMemo(() => {
    const currentSort = sortModel[0];

    if (currentSort) {
      const field = sortFieldMap[currentSort.field] ?? currentSort.field;
      return `${currentSort.sort === 'desc' ? '-' : ''}${field}`;
    }

    return '-rating';
  }, [sortModel]);

  const { data: ratingPage, isLoading, isValidating } = useProblemsRating({
    page: paginationModel.page + 1,
    pageSize: paginationModel.pageSize,
    ordering,
  });

  const rows = ratingPage?.data ?? [];
  const rowCount = ratingPage?.total ?? 0;

  const columnLabels: ProblemsRatingColumnLabels = {
    place: t('problems.rating.columns.place'),
    user: t('problems.rating.columns.user'),
    rating: t('problems.rating.columns.rating'),
    solved: t('problems.rating.columns.solved'),
    emptyValue: t('problems.rating.emptyValue'),
    difficulties: {
      beginner: t('problems.rating.columns.beginner'),
      basic: t('problems.rating.columns.basic'),
      normal: t('problems.rating.columns.normal'),
      medium: t('problems.rating.columns.medium'),
      advanced: t('problems.rating.columns.advanced'),
      hard: t('problems.rating.columns.hard'),
      extremal: t('problems.rating.columns.extremal'),
    },
  };

  const handlePaginationChange = (model: GridPaginationModel) => setPaginationModel(model);
  const handleSortModelChange = (model: GridSortModel) =>
    setSortModel(model.length ? model : [{ field: 'rating', sort: 'desc' }]);

  return (
    <Stack direction="column" spacing={4} height={1}>
      <PageHeader
        title={t('problems.rating.title')}
        subtitle={t('problems.rating.subtitle')}
        breadcrumb={[
          { label: t('home'), url: '/' },
          { label: t('problems.title'), url: resources.Problems },
          { label: t('problems.rating.title'), active: true },
        ]}
        actionComponent={
          <Button
            variant="outlined"
            color="primary"
            component={RouterLink}
            to={resources.Problems}
            startIcon={<IconifyIcon icon="mdi:arrow-left" />}
          >
            {t('problems.rating.backToProblems')}
          </Button>
        }
      />

      <Box sx={{ px: { xs: 3, md: 5 } }}>
        <Card variant="outlined">
          <CardContent>
            <Stack spacing={2} direction="column">
              <Stack direction={{ xs: 'column', sm: 'row' }} justifyContent="space-between" alignItems={{ sm: 'center' }}>
                <Typography variant="body2" color="text.secondary">
                  {t('problems.rating.total', { count: ratingPage?.total ?? 0 })}
                </Typography>
                <Stack direction="row" spacing={1} alignItems="center" flexWrap="wrap">
                  <Typography variant="body2" color="text.secondary">
                    {t('problems.rating.ordering.rating')}
                  </Typography>
                  <Divider flexItem orientation="vertical" />
                  {difficulties.map((item) => (
                    <Chip
                      key={item.key}
                      size="small"
                      color={item.color}
                      variant="soft"
                      label={t(`problems.rating.columns.${item.key}`)}
                    />
                  ))}
                </Stack>
              </Stack>

              <ProblemsRatingDataGrid
                rows={rows}
                rowCount={rowCount}
                loading={isLoading || isValidating}
                paginationModel={paginationModel}
                onPaginationModelChange={handlePaginationChange}
                sortModel={sortModel}
                onSortModelChange={handleSortModelChange}
                columnLabels={columnLabels}
              />
            </Stack>
          </CardContent>
        </Card>

        <Box mt={3}>
          <PeriodRatings />
        </Box>
      </Box>
    </Stack>
  );
};

const periodConfigs = [
  { period: 'today' as const, color: 'success', icon: 'mdi:calendar-today' },
  { period: 'week' as const, color: 'info', icon: 'mdi:calendar-week' },
  { period: 'month' as const, color: 'primary', icon: 'mdi:calendar-month' },
];

const PeriodRatings = () => {
  const { t } = useTranslation();

  const today = useProblemsPeriodRating('today');
  const week = useProblemsPeriodRating('week');
  const month = useProblemsPeriodRating('month');

  const periodData = [
    { ...periodConfigs[0], hook: today },
    { ...periodConfigs[1], hook: week },
    { ...periodConfigs[2], hook: month },
  ];

  return (
    <Card variant="outlined">
      <CardContent>
        <Stack spacing={2}>
          <Typography variant="h6" fontWeight={800}>
            {t('problems.rating.periodTitle')}
          </Typography>

          <Grid container spacing={2}>
            {periodData.map(({ period, color, icon, hook }) => {
              const items = hook.data ?? [];
              const isLoading = hook.isLoading;

              return (
                <Grid size={{ xs: 12, md: 4 }} key={period}>
                  <Card variant="outlined" sx={{ borderColor: `var(--mui-palette-${color}-main)` }}>
                    <CardContent>
                      <Stack
                        direction="row"
                        alignItems="center"
                        justifyContent="space-between"
                        spacing={1}
                        mb={1.5}
                      >
                        <Stack direction="row" spacing={1} alignItems="center">
                          <IconifyIcon icon={icon} width={20} height={20} color={`var(--mui-palette-${color}-main)`} />
                          <Typography variant="subtitle1" fontWeight={700}>
                            {t(`problems.rating.period.${period}`)}
                          </Typography>
                        </Stack>
                      </Stack>

                      {isLoading ? (
                        <Skeleton variant="rounded" height={120} />
                      ) : items.length ? (
                        <Stack spacing={1}>
                          {items.map((item, index) => (
                            <Stack
                              key={`${period}-${item.username}-${index}`}
                              direction="row"
                              alignItems="center"
                              justifyContent="space-between"
                              sx={{
                                p: 1,
                                borderRadius: 1,
                                backgroundColor: `var(--mui-palette-${color}-main)`,
                                color: '#fff',
                              }}
                            >
                              <Typography variant="body2" fontWeight={700}>
                                #{index + 1} {item.username}
                              </Typography>
                              <Chip
                                size="small"
                                label={t('problems.rating.periodSolved', { value: item.solved })}
                                sx={{ backgroundColor: '#fff', color: 'inherit', fontWeight: 700 }}
                              />
                            </Stack>
                          ))}
                        </Stack>
                      ) : (
                        <Typography variant="body2" color="text.secondary">
                          {t('problems.rating.periodEmpty')}
                        </Typography>
                      )}
                    </CardContent>
                  </Card>
                </Grid>
              );
            })}
          </Grid>
        </Stack>
      </CardContent>
    </Card>
  );
};

export default ProblemsRatingPage;

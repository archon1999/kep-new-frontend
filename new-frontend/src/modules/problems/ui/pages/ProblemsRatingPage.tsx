import { useMemo, useState } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import {
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  LinearProgress,
  Skeleton,
  Stack,
  Typography,
  useTheme,
} from '@mui/material';
import Grid from '@mui/material/Grid';
import { GridPaginationModel, GridSortModel } from '@mui/x-data-grid';
import { useTranslation } from 'react-i18next';
import { responsivePagePaddingSx } from 'shared/lib/styles';
import PageHeader from 'shared/components/sections/common/PageHeader';
import IconifyIcon from 'shared/components/base/IconifyIcon';
import { difficultyColorByKey, difficultyOptions } from '../../config/difficulty';
import { useProblemsPeriodRating, useProblemsRating } from '../../application/queries';
import ProblemsRatingDataGrid from '../components/ProblemsRatingDataGrid';
import { resources } from 'app/routes/resources';

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

const orderingOptions = [
  ...difficultyOptions.map((option) => ({
    key: option.key,
    label: option.label,
    color: difficultyColorByKey[option.key],
  })),
  { key: 'solved', label: 'problems.rating.ordering.solved', color: 'info' },
  { key: 'rating', label: 'problems.rating.ordering.rating', color: 'primary' },
] as const;

const ProblemsRatingPage = () => {
  const { t } = useTranslation();

  const [paginationModel, setPaginationModel] = useState<GridPaginationModel>({ page: 0, pageSize: 10 });
  const [sortModel, setSortModel] = useState<GridSortModel>([{ field: 'rating', sort: 'desc' }]);

  const ordering = useMemo(() => {
    const currentSort = sortModel[0];

    if (!currentSort) return '-rating';

    const orderingField = sortFieldMap[currentSort.field] ?? currentSort.field;
    const orderingPrefix = currentSort.sort === 'desc' ? '-' : '';

    return `${orderingPrefix}${orderingField}`;
  }, [sortModel]);

  const { data: ratingPage, isLoading, isValidating } = useProblemsRating({
    ordering,
    page: paginationModel.page + 1,
    pageSize: paginationModel.pageSize,
  });

  const rows = ratingPage?.data ?? [];
  const rowCount = ratingPage?.total ?? 0;
  const activeSort = sortModel[0];

  const handlePaginationModelChange = (model: GridPaginationModel) => setPaginationModel(model);
  const handleSortModelChange = (model: GridSortModel) => setSortModel(model.slice(0, 1));

  const handleOrderingShortcut = (key: string) => {
    setSortModel((prev) => {
      const current = prev[0];

      if (current?.field === key) {
        return [{ field: key, sort: current.sort === 'desc' ? 'asc' : 'desc' }];
      }

      return [{ field: key, sort: 'desc' }];
    });
  };

  const labels = useMemo(
    () => ({
      rank: t('problems.rating.columns.rank'),
      user: t('problems.rating.columns.user'),
      rating: t('problems.rating.columns.rating'),
      solved: t('problems.rating.columns.solved'),
      difficulties: Object.fromEntries(
        difficultyOptions.map((option) => [option.key, t(option.label)]),
      ) as Record<(typeof difficultyOptions)[number]['key'], string>,
      emptyValue: t('problems.rating.emptyValue'),
    }),
    [t],
  );

  return (
    <Stack direction="column" spacing={4} sx={{ ...responsivePagePaddingSx, pb: 5 }}>
      <PageHeader
        title={t('problems.rating.title')}
        breadcrumb={[
          { label: t('home'), url: '/' },
          { label: t('problems.rating.title'), active: true },
        ]}
        actionComponent={
          <Button
            variant="outlined"
            color="primary"
            component={RouterLink}
            to={resources.Problems}
            startIcon={<IconifyIcon icon="mdi:arrow-left" width={18} height={18} />}
          >
            {t('problems.rating.backToProblems')}
          </Button>
        }
      />

      <Card variant="outlined">
        <CardContent>
          <Stack
            direction={{ xs: 'column', md: 'row' }}
            spacing={2}
            justifyContent="space-between"
            alignItems={{ md: 'center' }}
          >
            <Stack spacing={0.5}>
              <Typography variant="h6" fontWeight={800}>
                {t('problems.rating.subtitle')}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {t('problems.rating.total', { count: rowCount })}
              </Typography>
            </Stack>

            <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
              {orderingOptions.map((option) => {
                const isActive = activeSort?.field === option.key;
                const isDesc = activeSort?.sort !== 'asc';
                const icon = isActive ? (
                  <IconifyIcon icon={isDesc ? 'mdi:arrow-down' : 'mdi:arrow-up'} width={18} height={18} />
                ) : undefined;

                return (
                  <Button
                    key={option.key}
                    variant={isActive ? 'contained' : 'outlined'}
                    color={option.color as any}
                    size="small"
                    onClick={() => handleOrderingShortcut(option.key)}
                    endIcon={icon}
                    sx={{ textTransform: 'none' }}
                  >
                    {t(option.label)}
                  </Button>
                );
              })}
            </Stack>
          </Stack>
        </CardContent>
        {isLoading || isValidating ? <LinearProgress /> : null}
        <Box sx={{ px: { xs: 1, md: 2 }, pb: 2 }}>
          <ProblemsRatingDataGrid
            rows={rows}
            rowCount={rowCount}
            loading={isLoading || isValidating}
            paginationModel={paginationModel}
            onPaginationModelChange={handlePaginationModelChange}
            sortModel={sortModel}
            onSortModelChange={handleSortModelChange}
            labels={labels}
          />
        </Box>
      </Card>

      <PeriodRatings />
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
  const theme = useTheme();

  const today = useProblemsPeriodRating('today');
  const week = useProblemsPeriodRating('week');
  const month = useProblemsPeriodRating('month');

  const periodData = [
    { ...periodConfigs[0], hook: today },
    { ...periodConfigs[1], hook: week },
    { ...periodConfigs[2], hook: month },
  ];

  return (
    <Stack direction="column" spacing={2}>
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
                    <Stack direction="column" spacing={1}>
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
                            color: theme.palette.getContrastText(theme.palette[color].main),
                          }}
                        >
                          <Typography variant="body2" fontWeight={700}>
                            #{index + 1} {item.username}
                          </Typography>
                          <Chip
                            size="small"
                            label={t('problems.rating.periodSolved', { value: item.solved })}
                            sx={{
                              backgroundColor: theme.palette.getContrastText(theme.palette[color].main),
                              color: theme.palette[color].main,
                              fontWeight: 700,
                            }}
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
  );
};

export default ProblemsRatingPage;

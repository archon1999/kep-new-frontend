import { useMemo, useState } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import {
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  Divider,
  LinearProgress,
  Skeleton,
  Stack,
  TablePagination,
  Typography,
  alpha,
  useTheme,
} from '@mui/material';
import Grid from '@mui/material/Grid';
import { useTranslation } from 'react-i18next';
import { responsivePagePaddingSx } from 'shared/lib/styles';
import IconifyIcon from 'shared/components/base/IconifyIcon';
import { difficultyColorByKey, difficultyOptions } from '../../config/difficulty';
import { useProblemsPeriodRating, useProblemsRating } from '../../application/queries';
import { ProblemsRatingRow } from '../../domain/entities/problem.entity';
import { getResourceByUsername, resources } from 'app/routes/resources';
import CustomTablePaginationAction from 'shared/components/pagination/CustomTablePaginationAction';

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
  const theme = useTheme();

  const [ordering, setOrdering] = useState('-rating');
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(12);

  const { data: ratingPage, isLoading } = useProblemsRating({ ordering, page, pageSize });

  const orderingState = useMemo(
    () => ({ key: ordering.replace('-', ''), isDesc: ordering.startsWith('-') }),
    [ordering],
  );

  const difficultyOrdering = useMemo(
    () =>
      difficultyOptions.map((option) => ({
        key: option.key,
        label: option.label,
        color: difficultyColorByKey[option.key],
      })),
    [],
  );

  const rows = ratingPage?.data ?? [];

  const handleOrderingChange = (key: string) => {
    setPage(1);
    setOrdering((prev) => {
      const currentKey = prev.replace('-', '');
      const isDesc = prev.startsWith('-');

      if (currentKey === key) {
        return isDesc ? key : `-${key}`;
      }

      return `-${key}`;
    });
  };

  const handlePageChange = (_: unknown, newPage: number) => {
    setPage(newPage + 1);
  };

  const handleRowsPerPageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setPageSize(Number(event.target.value));
    setPage(1);
  };

  const renderOrderingButton = (option: (typeof orderingOptions)[number]) => {
    const isActive = orderingState.key === option.key;
    const icon =
      isActive && (orderingState.isDesc ? <IconifyIcon icon="mdi:arrow-down" width={18} height={18} /> : <IconifyIcon icon="mdi:arrow-up" width={18} height={18} />);

    return (
      <Button
        key={option.key}
        variant={isActive ? 'contained' : 'outlined'}
        color={isActive ? option.color : 'inherit'}
        size="small"
        onClick={() => handleOrderingChange(option.key)}
        endIcon={icon}
        sx={{ textTransform: 'none' }}
      >
        {t(option.label)}
      </Button>
    );
  };

  const renderCard = (row: ProblemsRatingRow) => {
    const displayName =
      row.user.firstName || row.user.lastName
        ? `${row.user.firstName ?? ''} ${row.user.lastName ?? ''}`.trim()
        : row.user.username;

    return (
      <Grid size={{ xs: 12, sm: 6, lg: 4 }} key={`${row.user.username}-${row.rowIndex}`}>
        <Card variant="outlined" sx={{ height: '100%' }}>
          <CardContent sx={{ display: 'flex', flexDirection: 'column', gap: 1.5, height: '100%' }}>
            <Stack direction="row" alignItems="center" spacing={1} justifyContent="space-between">
              <Chip
                label={`#${row.rowIndex}`}
                color="primary"
                sx={{ fontWeight: 700, minWidth: 64, justifyContent: 'center' }}
              />
              <Stack spacing={0.5} alignItems="flex-end">
                <Chip
                  label={t('problems.rating.score', { value: row.rating ?? 0 })}
                  color="secondary"
                  size="small"
                  sx={{ fontWeight: 700 }}
                />
                <Chip
                  label={t('problems.rating.solved', { value: row.solved ?? 0 })}
                  color="success"
                  size="small"
                  sx={{ fontWeight: 700 }}
                />
              </Stack>
            </Stack>

            <Typography
              component={RouterLink}
              to={getResourceByUsername(resources.UserProfile, row.user.username)}
              variant="subtitle1"
              fontWeight={700}
              sx={{ textDecoration: 'none', color: 'text.primary' }}
            >
              {displayName}
            </Typography>

            {row.user.ratingTitle ? (
              <Typography variant="caption" color="text.secondary">
                {row.user.ratingTitle}
              </Typography>
            ) : null}

            <Divider />

            <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
              {difficultyOrdering.map((item) => {
                const value = (row as any)[item.key] ?? 0;
                const color = theme.palette[item.color]?.main ?? theme.palette.primary.main;
                return (
                  <Chip
                    key={item.key}
                    size="small"
                    label={`${t(item.label)}: ${value}`}
                    sx={{
                      borderRadius: 1,
                      backgroundColor: alpha(color, 0.12),
                      color,
                      fontWeight: 600,
                    }}
                  />
                );
              })}
            </Stack>
          </CardContent>
        </Card>
      </Grid>
    );
  };

  return (
    <Box sx={responsivePagePaddingSx}>
      <Stack spacing={3} direction="column">
        <Stack spacing={1}>
          <Typography variant="h4" fontWeight={800}>
            {t('problems.rating.title')}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {t('problems.rating.subtitle')}
          </Typography>
          <Button
            variant="text"
            color="primary"
            component={RouterLink}
            to={resources.Problems}
            startIcon={<IconifyIcon icon="mdi:arrow-left" />}
            sx={{ alignSelf: 'flex-start' }}
          >
            {t('problems.rating.backToProblems')}
          </Button>
        </Stack>

        <Card variant="outlined">
          <CardContent>
            <Stack
              direction={{ xs: 'column', sm: 'row' }}
              spacing={1.5}
              justifyContent="space-between"
              alignItems={{ sm: 'center' }}
            >
              <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
                {orderingOptions.map(renderOrderingButton)}
              </Stack>
              <Typography variant="body2" color="text.secondary">
                {t('problems.rating.total', { count: ratingPage?.total ?? 0 })}
              </Typography>
            </Stack>
          </CardContent>
          {isLoading ? <LinearProgress /> : null}
        </Card>

        {isLoading ? (
          <Grid container spacing={2}>
            {Array.from({ length: pageSize }).map((_, idx) => (
              <Grid size={{ xs: 12, sm: 6, lg: 4 }} key={idx}>
                <Skeleton variant="rounded" height={180} />
              </Grid>
            ))}
          </Grid>
        ) : rows.length ? (
          <Grid container spacing={2}>
            {rows.map(renderCard)}
          </Grid>
        ) : (
          <Card variant="outlined">
            <CardContent>
              <Typography variant="body2" color="text.secondary">
                {t('problems.rating.empty')}
              </Typography>
            </CardContent>
          </Card>
        )}

        <Box display="flex" justifyContent="flex-end">
          <TablePagination
            component="div"
            count={ratingPage?.total ?? 0}
            page={page - 1}
            onPageChange={handlePageChange}
            rowsPerPage={pageSize}
            rowsPerPageOptions={[6, 9, 12, 24]}
            onRowsPerPageChange={handleRowsPerPageChange}
            ActionsComponent={CustomTablePaginationAction}
          />
        </Box>

        <PeriodRatings />
      </Stack>
    </Box>
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
                <Grid size={{ xs: 12, md: 4 }}key={period}>
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

import { useEffect, useMemo, useState } from 'react';
import {
  Box,
  Card,
  CardContent,
  Chip,
  Grid,
  InputAdornment,
  MenuItem,
  Pagination,
  Stack,
  TextField,
  ToggleButton,
  ToggleButtonGroup,
  Typography,
} from '@mui/material';
import { useTranslation } from 'react-i18next';
import { useDebounce } from 'shared/hooks/useDebounce';
import { responsivePagePaddingSx } from 'shared/lib/styles';
import ContestCard from '../components/ContestCard';
import { useContestCategories, useContestsList } from '../../application/queries';

const pageSizeOptions = [6, 9, 12];
const contestTypes = [
  'ACM20M',
  'ACM10M',
  'ACM2H',
  'Ball525',
  'Ball550',
  'LessCode',
  'LessLine',
  'OneAttempt',
  'Exam',
  'IQ',
  'MultiL',
  'DC',
  'CodeGolf',
  'Ball',
];

type ParticipationFilter = 'all' | 'participated' | 'not_participated';

const ContestsListPage = () => {
  const { t } = useTranslation();

  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(6);
  const [categoryId, setCategoryId] = useState<number | undefined>();
  const [participation, setParticipation] = useState<ParticipationFilter>('all');
  const [type, setType] = useState<string>('');
  const [search, setSearch] = useState('');

  const debouncedSearch = useDebounce(search, 350);

  const { data: categories } = useContestCategories();

  const listParams = useMemo(
    () => ({
      page,
      pageSize,
      category: categoryId ? String(categoryId) : undefined,
      is_participated: participation === 'all' ? undefined : participation === 'participated' ? '1' : '0',
      type: type || undefined,
      title: debouncedSearch || undefined,
    }),
    [page, pageSize, categoryId, participation, type, debouncedSearch],
  );

  const { data: pageResult, isLoading } = useContestsList(listParams);

  const contests = pageResult?.data ?? [];
  const showEmptyState = !isLoading && contests.length === 0;

  useEffect(() => {
    setPage(1);
  }, [categoryId, participation, type, debouncedSearch]);

  return (
    <Box sx={responsivePagePaddingSx}>
      <Stack direction="column" spacing={3}>
        <Stack direction="row" spacing={2} alignItems="center" flexWrap="wrap" rowGap={1}>
          <Box>
            <Typography variant="h4" fontWeight={800} sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              {t('menu.contests')}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {t('contests.subtitle')}
            </Typography>
          </Box>

          {pageResult ? (
            <Chip label={t('contests.countLabel', { count: pageResult.total ?? pageResult.count ?? contests.length })} />
          ) : null}
        </Stack>

        <Card variant="outlined">
          <CardContent>
            <Stack spacing={3}>
              <Stack direction={{ xs: 'column', md: 'row' }} spacing={2} alignItems={{ xs: 'stretch', md: 'center' }}>
                <TextField
                  fullWidth
                  placeholder={t('contests.searchPlaceholder')}
                  value={search}
                  onChange={(event) => setSearch(event.target.value)}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <Typography sx={{ color: 'text.secondary' }}>🔍</Typography>
                      </InputAdornment>
                    ),
                  }}
                />

                <ToggleButtonGroup
                  color="primary"
                  exclusive
                  value={participation}
                  onChange={(_, value) => value && setParticipation(value)}
                  size="small"
                >
                  <ToggleButton value="all">{t('contests.status.all')}</ToggleButton>
                  <ToggleButton value="participated">{t('contests.status.participated')}</ToggleButton>
                  <ToggleButton value="not_participated">{t('contests.status.notParticipated')}</ToggleButton>
                </ToggleButtonGroup>
              </Stack>

              <Stack direction={{ xs: 'column', md: 'row' }} spacing={2} alignItems={{ xs: 'stretch', md: 'center' }}>
                <Stack spacing={1} flex={1}>
                  <Typography variant="overline" color="text.secondary" sx={{ letterSpacing: 0 }}>
                    {t('contests.filterByCategory')}
                  </Typography>
                  <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
                    <Chip
                      label={t('contests.allCategories')}
                      color={!categoryId ? 'primary' : 'default'}
                      variant={!categoryId ? 'filled' : 'outlined'}
                      onClick={() => setCategoryId(undefined)}
                    />
                    {(categories ?? []).map((category) => (
                      <Chip
                        key={category.id}
                        label={category.title}
                        color={categoryId === category.id ? 'primary' : 'default'}
                        variant={categoryId === category.id ? 'filled' : 'outlined'}
                        onClick={() => setCategoryId(category.id)}
                      />
                    ))}
                  </Stack>
                </Stack>

                <Stack spacing={1} flex={{ xs: 1, md: 0.6 }}>
                  <Typography variant="overline" color="text.secondary" sx={{ letterSpacing: 0 }}>
                    {t('contests.filterByType')}
                  </Typography>
                  <TextField
                    select
                    fullWidth
                    size="small"
                    value={type}
                    onChange={(event) => setType(event.target.value)}
                  >
                    <MenuItem value="">{t('contests.allTypes')}</MenuItem>
                    {contestTypes.map((contestType) => (
                      <MenuItem key={contestType} value={contestType}>
                        {contestType}
                      </MenuItem>
                    ))}
                  </TextField>
                </Stack>
              </Stack>
            </Stack>
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
            {(isLoading ? Array.from({ length: 3 }) : contests).map((contest, index) => (
              <Grid item xs={12} md={6} key={isLoading ? index : contest.id}>
                {isLoading ? <Card variant="outlined" sx={{ height: 240 }} /> : <ContestCard contest={contest} />}
              </Grid>
            ))}
          </Grid>
        )}

        {pageResult?.pagesCount ? (
          <Stack direction="row" spacing={2} alignItems="center" justifyContent="space-between" flexWrap="wrap" rowGap={2}>
            <Stack direction="row" spacing={1} alignItems="center">
              <Typography variant="body2" color="text.secondary">
                {t('contests.pageSizeLabel')}
              </Typography>
              <TextField
                select
                size="small"
                value={pageSize}
                onChange={(event) => {
                  setPageSize(Number(event.target.value));
                  setPage(1);
                }}
                sx={{ width: 120 }}
              >
                {pageSizeOptions.map((option) => (
                  <MenuItem key={option} value={option}>
                    {option}
                  </MenuItem>
                ))}
              </TextField>
            </Stack>

            <Pagination
              color="primary"
              page={page}
              count={pageResult.pagesCount}
              onChange={(_, value) => setPage(value)}
              showFirstButton
              showLastButton
            />
          </Stack>
        ) : null}
      </Stack>
    </Box>
  );
};

export default ContestsListPage;

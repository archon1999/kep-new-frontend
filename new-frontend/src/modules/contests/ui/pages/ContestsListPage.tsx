import { MouseEvent, useMemo, useState } from 'react';
import {
  Box,
  Button,
  FormControl,
  Grid,
  InputAdornment,
  InputLabel,
  MenuItem,
  Popover,
  Pagination,
  Select,
  Skeleton,
  Stack,
  TextField,
  ToggleButton,
  ToggleButtonGroup,
  Typography,
} from '@mui/material';
import { useTranslation } from 'react-i18next';
import KepIcon from 'shared/components/base/KepIcon';
import Logo from 'shared/components/common/Logo';
import useDebouncedValue from 'shared/hooks/useDebouncedValue';
import { responsivePagePaddingSx } from 'shared/lib/styles';
import ContestCard from '../components/ContestCard';
import { useContestCategories, useContestsList } from '../../application/queries';

const contestTypes = [
  'ACM2H',
  'ACM10M',
  'ACM20M',
  'Ball525',
  'Ball550',
  'LessCode',
  'LessLine',
  'OneAttempt',
  'IQ',
  'Ball',
  'DC',
  'MultiL',
  'CodeGolf',
  'Exam',
] as const;

const DEFAULT_PAGE_SIZE = 6;

const ContestsListPage = () => {
  const { t } = useTranslation();
  const { data: categories } = useContestCategories();

  const [page, setPage] = useState(1);
  const [filters, setFilters] = useState({
    title: '',
    category: undefined as number | undefined,
    type: undefined as string | undefined,
    participation: 'all' as 'all' | 'joined' | 'notJoined',
  });
  const [filtersAnchor, setFiltersAnchor] = useState<HTMLElement | null>(null);

  const debouncedTitle = useDebouncedValue(filters.title, 400);

  const queryParams = useMemo(
    () => ({
      page,
      pageSize: DEFAULT_PAGE_SIZE,
      title: debouncedTitle || undefined,
      category: filters.category ? String(filters.category) : undefined,
      type: filters.type,
      is_participated:
        filters.participation === 'joined'
          ? '1'
          : filters.participation === 'notJoined'
            ? '0'
            : undefined,
    }),
    [debouncedTitle, filters.category, filters.participation, filters.type, page],
  );

  const { data: pageResult, isLoading } = useContestsList(queryParams);
  const contests = pageResult?.data ?? [];
  const showEmptyState = !isLoading && contests.length === 0;
  const totalCategoriesCount = useMemo(
    () => (categories ?? []).reduce((sum, category) => sum + (category.contestsCount ?? 0), 0),
    [categories],
  );

  const handleCategory = (id?: number) => {
    setFilters((prev) => ({ ...prev, category: id }));
    setPage(1);
  };

  const handleTypeChange = (value?: string) => {
    setFilters((prev) => ({ ...prev, type: value || undefined }));
    setPage(1);
  };

  const handleParticipationChange = (_: any, value: 'all' | 'joined' | 'notJoined') => {
    if (!value) return;
    setFilters((prev) => ({ ...prev, participation: value }));
    setPage(1);
  };

  const handleFiltersClick = (event: MouseEvent<HTMLElement>) => {
    setFiltersAnchor(event.currentTarget);
  };

  const handleFiltersClose = () => {
    setFiltersAnchor(null);
  };

  return (
    <Box sx={responsivePagePaddingSx}>
      <Stack direction="column" spacing={3}>
        <Box
          sx={{
            position: 'relative',
            overflow: 'hidden',
            borderRadius: 3,
            p: { xs: 3, md: 4 },
            bgcolor: 'background.paper',
            background: 'linear-gradient(135deg, rgba(0, 255, 190, 0.06), rgba(86, 112, 255, 0.05))',
          }}
        >
          <Stack
            direction="row"
            justifyContent="space-between"
            alignItems="flex-start"
            spacing={2}
            flexWrap="wrap"
            useFlexGap
          >
            <Stack direction="column" spacing={1}>
              <Typography variant="h4" fontWeight={800}>
                {t('contests.title')}
              </Typography>
              <Typography variant="body1" color="text.secondary" sx={{ maxWidth: 720 }}>
                {t('contests.subtitle')}
              </Typography>
            </Stack>

            <Button
              variant="contained"
              color="primary"
              startIcon={<KepIcon name="filter" fontSize={18} />}
              onClick={handleFiltersClick}
            >
              {t('contests.filtersButton')}
            </Button>
          </Stack>

          <Box sx={{ position: 'absolute', right: { xs: -24, md: 24 }, bottom: { xs: -24, md: 8 }, opacity: 0.08 }}>
            <Logo sx={{ width: { xs: 200, md: 280 }, height: { xs: 200, md: 280 } }} />
          </Box>
        </Box>

        <Popover
          open={Boolean(filtersAnchor)}
          anchorEl={filtersAnchor}
          onClose={handleFiltersClose}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
          transformOrigin={{ vertical: 'top', horizontal: 'right' }}
          slotProps={{ paper: { sx: { p: 2, width: { xs: 320, sm: 380 }, maxWidth: '90vw' } } }}
        >
          <Stack direction="column" spacing={2}>
            <TextField
              label={t('contests.searchLabel')}
              size="small"
              fullWidth
              value={filters.title}
              onChange={(event) => {
                setFilters((prev) => ({ ...prev, title: event.target.value }));
                setPage(1);
              }}
              placeholder={t('contests.searchPlaceholder')}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <KepIcon name="search" fontSize={20} />
                  </InputAdornment>
                ),
              }}
            />

            <FormControl fullWidth size="small">
              <InputLabel>{t('contests.typeLabel')}</InputLabel>
              <Select
                label={t('contests.typeLabel')}
                value={filters.type ?? ''}
                onChange={(event) => handleTypeChange(event.target.value || undefined)}
              >
                <MenuItem value="">
                  <em>{t('contests.allTypes')}</em>
                </MenuItem>
                {contestTypes.map((type) => (
                  <MenuItem key={type} value={type}>
                    {t(`contests.typeLabels.${type}` as const)}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <ToggleButtonGroup
              color="primary"
              exclusive
              fullWidth
              value={filters.participation}
              onChange={handleParticipationChange}
              size="small"
            >
              <ToggleButton value="all">{t('contests.participation.all')}</ToggleButton>
              <ToggleButton value="joined">{t('contests.participation.joined')}</ToggleButton>
              <ToggleButton value="notJoined">{t('contests.participation.notJoined')}</ToggleButton>
            </ToggleButtonGroup>

            <FormControl fullWidth size="small">
              <InputLabel>{t('contests.categoriesLabel')}</InputLabel>
              <Select
                label={t('contests.categoriesLabel')}
                value={filters.category ?? ''}
                onChange={(event) => handleCategory(event.target.value ? Number(event.target.value) : undefined)}
              >
                <MenuItem value="">
                  <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ width: '100%' }}>
                    <Typography>{t('contests.allCategories')}</Typography>
                    <Typography variant="body2" color="text.secondary">
                      {totalCategoriesCount}
                    </Typography>
                  </Stack>
                </MenuItem>
                {(categories ?? []).map((category) => (
                  <MenuItem key={category.id} value={category.id}>
                    <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ width: '100%' }}>
                      <Typography>{category.title}</Typography>
                      <Typography variant="body2" color="text.secondary">
                        {category.contestsCount ?? 0}
                      </Typography>
                    </Stack>
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Stack>
        </Popover>

        {showEmptyState ? (
          <Box
            sx={{
              py: 8,
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
          <Stack direction="column" spacing={3}>
            <Grid container spacing={3}>
              {isLoading
                ? Array.from({ length: DEFAULT_PAGE_SIZE }).map((_, idx) => (
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

            {pageResult && pageResult.pagesCount > 1 ? (
              <Stack direction="row" justifyContent="center">
                <Pagination
                  count={pageResult.pagesCount}
                  page={page}
                  onChange={(_, value) => setPage(value)}
                  color="primary"
                  shape="rounded"
                />
              </Stack>
            ) : null}
          </Stack>
        )}
      </Stack>
    </Box>
  );
};

export default ContestsListPage;

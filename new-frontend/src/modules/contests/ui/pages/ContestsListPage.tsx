import React, { useMemo, useState } from 'react';
import FilterAltRoundedIcon from '@mui/icons-material/FilterAltRounded';
import {
  Box,
  Button,
  FormControl,
  Grid,
  InputAdornment,
  InputLabel,
  MenuItem,
  Pagination,
  Popover,
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
  const [filtersAnchor, setFiltersAnchor] = useState<null | HTMLElement>(null);

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

  const handleFiltersToggle = (event: React.MouseEvent<HTMLElement>) => {
    setFiltersAnchor(event.currentTarget);
  };

  const handleFiltersClose = () => {
    setFiltersAnchor(null);
  };

  const isFiltersOpen = Boolean(filtersAnchor);

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
            direction={{ xs: 'column', sm: 'row' }}
            spacing={2}
            alignItems={{ xs: 'flex-start', sm: 'center' }}
            justifyContent="space-between"
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
              startIcon={<FilterAltRoundedIcon />}
              onClick={handleFiltersToggle}
              sx={{ alignSelf: { xs: 'stretch', sm: 'center' } }}
            >
              {t('contests.filters')}
            </Button>
          </Stack>

          <Box sx={{ position: 'absolute', right: { xs: -24, md: 24 }, bottom: { xs: -24, md: 8 }, opacity: 0.08 }}>
            <Logo sx={{ width: { xs: 200, md: 280 }, height: { xs: 200, md: 280 } }} />
          </Box>

          <Popover
            open={isFiltersOpen}
            anchorEl={filtersAnchor}
            onClose={handleFiltersClose}
            anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
            transformOrigin={{ vertical: 'top', horizontal: 'right' }}
            PaperProps={{ sx: { mt: 1.5, width: { xs: 320, sm: 420 }, p: 2.5 } }}
          >
            <Stack direction="column" spacing={2.5}>
              <TextField
                fullWidth
                value={filters.title}
                onChange={(event) => setFilters((prev) => ({ ...prev, title: event.target.value }))}
                placeholder={t('contests.searchPlaceholder')}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <KepIcon name="search" fontSize={20} />
                    </InputAdornment>
                  ),
                }}
                label={t('contests.searchLabel')}
              />

              <FormControl fullWidth>
                <InputLabel>{t('contests.typeLabel')}</InputLabel>
                <Select
                  label={t('contests.typeLabel')}
                  size="small"
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
                value={filters.participation}
                onChange={handleParticipationChange}
                size="small"
                fullWidth
              >
                <ToggleButton value="all" sx={{ flex: 1 }}>
                  {t('contests.participation.all')}
                </ToggleButton>
                <ToggleButton value="joined" sx={{ flex: 1 }}>
                  {t('contests.participation.joined')}
                </ToggleButton>
                <ToggleButton value="notJoined" sx={{ flex: 1 }}>
                  {t('contests.participation.notJoined')}
                </ToggleButton>
              </ToggleButtonGroup>

              <FormControl fullWidth>
                <InputLabel>{t('contests.categoriesLabel')}</InputLabel>
                <Select
                  label={t('contests.categoriesLabel')}
                  size="small"
                  value={filters.category ?? ''}
                  onChange={(event) => handleCategory(event.target.value ? Number(event.target.value) : undefined)}
                >
                  <MenuItem value="">
                    <Typography variant="body2" component="span">
                      {t('contests.allCategories')}
                    </Typography>
                  </MenuItem>
                  {(categories ?? []).map((category) => (
                    <MenuItem key={category.id} value={category.id} sx={{ display: 'flex', justifyContent: 'space-between' }}>
                      <Typography variant="body2">{category.title}</Typography>
                      <Typography variant="caption" color="text.secondary">
                        {category.contestsCount}
                      </Typography>
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Stack>
          </Popover>
        </Box>

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

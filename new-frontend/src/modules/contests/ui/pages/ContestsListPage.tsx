import { ChangeEvent, useMemo, useState } from 'react';
import {
  Box,
  Card,
  CardContent,
  Chip,
  Divider,
  Grid,
  MenuItem,
  Pagination,
  Skeleton,
  Stack,
  TextField,
  ToggleButton,
  ToggleButtonGroup,
  Typography,
} from '@mui/material';
import { useTranslation } from 'react-i18next';
import { useAuth } from 'app/providers/AuthProvider';
import { responsivePagePaddingSx } from 'shared/lib/styles';
import useDebouncedValue from 'shared/hooks/useDebouncedValue';
import ContestCard from '../components/ContestCard';
import { useContestCategories, useContestRating, useContestsList } from '../../application/queries';
import { contestTypes } from '../../domain/constants/contest-types';

const defaultPageSize = 7;

const ContestsListPage = () => {
  const { t } = useTranslation();
  const { currentUser } = useAuth();

  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState<string>('');
  const [contestType, setContestType] = useState<string>('');
  const [participation, setParticipation] = useState<'all' | 'participated' | 'notParticipated'>('all');

  const debouncedSearch = useDebouncedValue(search, 500);

  const { data: categories, isLoading: isCategoriesLoading } = useContestCategories();
  const { data: rating, isLoading: isRatingLoading } = useContestRating(currentUser?.username);

  const requestParams = useMemo(
    () => ({
      page,
      pageSize: defaultPageSize,
      title: debouncedSearch || undefined,
      category: category || undefined,
      type: contestType || undefined,
      is_participated:
        participation === 'all' ? undefined : participation === 'participated' ? '1' : '0',
    }),
    [page, category, contestType, participation, debouncedSearch],
  );

  const { data: contestsPage, isLoading: isContestsLoading } = useContestsList(requestParams);

  const contests = contestsPage?.data ?? [];
  const showEmptyState = !isContestsLoading && contests.length === 0;

  const handleParticipationChange = (_: unknown, value: typeof participation) => {
    if (value) {
      setParticipation(value);
      setPage(1);
    }
  };

  const handleTypeChange = (event: ChangeEvent<HTMLInputElement>) => {
    setContestType(event.target.value);
    setPage(1);
  };

  const handleCategoryChange = (event: ChangeEvent<HTMLInputElement>) => {
    setCategory(event.target.value);
    setPage(1);
  };

  const handleSearchChange = (event: ChangeEvent<HTMLInputElement>) => {
    setSearch(event.target.value);
    setPage(1);
  };

  return (
    <Box sx={responsivePagePaddingSx}>
      <Stack spacing={4} direction="column">
        <Stack spacing={1} direction="column">
          <Typography variant="h4" fontWeight={800}>
            {t('contests.title')}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {t('contests.subtitle')}
          </Typography>
        </Stack>

        {currentUser ? (
          <Card variant="outlined">
            <CardContent>
              <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} alignItems="center">
                <Stack spacing={0.5} flex={1} minWidth={0}>
                  <Typography variant="subtitle1" fontWeight={700}>
                    {t('contests.myRatingTitle')}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {t('contests.myRatingSubtitle')}
                  </Typography>
                </Stack>
                {isRatingLoading ? (
                  <Stack direction="row" spacing={2} alignItems="center">
                    <Skeleton variant="rounded" width={120} height={32} />
                    <Skeleton variant="rounded" width={120} height={32} />
                  </Stack>
                ) : rating ? (
                  <Stack direction="row" spacing={2} alignItems="center" flexWrap="wrap" useFlexGap>
                    <Chip
                      color="primary"
                      label={t('contests.ratingChip', {
                        rating: rating.rating ?? 0,
                        title: rating.ratingTitle ?? '-',
                      })}
                    />
                    <Chip
                      variant="outlined"
                      label={t('contests.ratingPlaceChip', {
                        place: rating.ratingPlace ?? '-'
                      })}
                    />
                    <Chip
                      variant="outlined"
                      label={t('contests.contestantsChip', {
                        count: rating.contestantsCount ?? 0,
                      })}
                    />
                  </Stack>
                ) : (
                  <Typography variant="body2" color="text.secondary">
                    {t('contests.noRatingData')}
                  </Typography>
                )}
              </Stack>
            </CardContent>
          </Card>
        ) : null}

        <Card variant="outlined">
          <CardContent>
            <Stack spacing={2}>
              <Stack direction={{ xs: 'column', md: 'row' }} spacing={2} alignItems="flex-start">
                <TextField
                  fullWidth
                  label={t('contests.searchPlaceholder')}
                  value={search}
                  onChange={handleSearchChange}
                />

                <TextField
                  select
                  label={t('contests.filters.category')}
                  value={category}
                  onChange={handleCategoryChange}
                  sx={{ minWidth: { xs: '100%', md: 220 } }}
                  SelectProps={{ displayEmpty: true }}
                >
                  <MenuItem value="">
                    {t('contests.filters.allCategories')}
                  </MenuItem>
                  {(categories ?? []).map((item) => (
                    <MenuItem key={item.id} value={item.id.toString()}>
                      <Stack direction="row" spacing={1} alignItems="center" width={1}>
                        <Typography variant="body2" flex={1}>
                          {item.title}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          {item.contestsCount ?? 0}
                        </Typography>
                      </Stack>
                    </MenuItem>
                  ))}
                  {isCategoriesLoading && categories?.length === 0 ? (
                    <MenuItem disabled>
                      <Skeleton variant="text" width={120} />
                    </MenuItem>
                  ) : null}
                </TextField>

                <TextField
                  select
                  label={t('contests.filters.type')}
                  value={contestType}
                  onChange={handleTypeChange}
                  sx={{ minWidth: { xs: '100%', md: 200 } }}
                  SelectProps={{ displayEmpty: true }}
                >
                  <MenuItem value="">{t('contests.filters.allTypes')}</MenuItem>
                  {contestTypes.map((type) => (
                    <MenuItem key={type} value={type}>
                      {t(`contests.types.${type}`, type)}
                    </MenuItem>
                  ))}
                </TextField>
              </Stack>

              <Divider />

              <Stack spacing={1}>
                <Typography variant="body2" color="text.secondary">
                  {t('contests.filters.participationLabel')}
                </Typography>
                <ToggleButtonGroup
                  color="primary"
                  value={participation}
                  exclusive
                  onChange={handleParticipationChange}
                  size="small"
                >
                  <ToggleButton value="all">{t('contests.filters.all')}</ToggleButton>
                  <ToggleButton value="participated">{t('contests.filters.participated')}</ToggleButton>
                  <ToggleButton value="notParticipated">{t('contests.filters.notParticipated')}</ToggleButton>
                </ToggleButtonGroup>
              </Stack>
            </Stack>
          </CardContent>
        </Card>

        {showEmptyState ? (
          <Card variant="outlined">
            <CardContent sx={{ textAlign: 'center', py: 6 }}>
              <Typography variant="subtitle1" fontWeight={700}>
                {t('contests.emptyTitle')}
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                {t('contests.emptySubtitle')}
              </Typography>
            </CardContent>
          </Card>
        ) : (
          <Grid container spacing={3}>
            {isContestsLoading
              ? Array.from({ length: defaultPageSize }).map((_, idx) => (
                  <Grid item xs={12} key={idx}>
                    <Skeleton variant="rounded" height={220} />
                  </Grid>
                ))
              : contests.map((contest) => (
                  <Grid item xs={12} key={contest.id}>
                    <ContestCard contest={contest} />
                  </Grid>
                ))}
          </Grid>
        )}

        {contestsPage && contestsPage.pagesCount > 1 ? (
          <Stack direction="row" justifyContent="center">
            <Pagination
              count={contestsPage.pagesCount}
              page={page}
              onChange={(_, value) => setPage(value)}
              color="primary"
              shape="rounded"
            />
          </Stack>
        ) : null}
      </Stack>
    </Box>
  );
};

export default ContestsListPage;

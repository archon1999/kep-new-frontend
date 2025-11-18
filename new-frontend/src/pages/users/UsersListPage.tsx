import { useEffect, useMemo, useState } from 'react';
import {
  Box,
  Button,
  Card,
  CardContent,
  Divider,
  Container,
  Grid,
  Stack,
  TextField,
  Typography,
} from '@mui/material';
import { DataGrid, GridColDef, GridPaginationModel, GridSortModel } from '@mui/x-data-grid';
import { useTranslation } from 'react-i18next';
import { useUserCountries, useUsersList } from 'modules/users/application/queries';
import type { UsersListFilters, UsersListItem } from 'modules/users/domain/entities/user.entity';
import { KepcoinAmount, RatingChip, StreakMeter, UserIdentity } from 'modules/users/ui/components';
import useDebounce from 'shared/hooks/useDebounce';

const defaultFilters: UsersListFilters = {
  username: '',
  firstName: '',
  country: '',
  ageFrom: null,
  ageTo: null,
};

const orderingMap: Record<string, string> = {
  id: 'id',
  skillsRating: 'skills_rating',
  activityRating: 'activity_rating',
  contestsRating: 'contests_rating__rating',
  challengesRating: 'challenges_rating__rating',
  streak: 'streak',
  kepcoin: 'kepcoin',
  lastSeen: 'last_seen',
};

const PAGE_SIZE_OPTIONS = [10, 25, 50];

const UsersListPage = () => {
  const { t, i18n } = useTranslation();
  const [filters, setFilters] = useState<UsersListFilters>(defaultFilters);
  const [paginationModel, setPaginationModel] = useState<GridPaginationModel>({ page: 0, pageSize: 10 });
  const [sortModel, setSortModel] = useState<GridSortModel>([{ field: 'id', sort: 'desc' }]);

  const hasActiveFilters = useMemo(() => JSON.stringify(filters) !== JSON.stringify(defaultFilters), [filters]);

  const debouncedFilters = useDebounce(filters, 700);

  const params = useMemo(() => {
    const ordering = sortModel[0];
    const orderingValue = ordering?.field
      ? `${ordering.sort === 'desc' ? '-' : ''}${orderingMap[ordering.field] ?? ordering.field}`
      : '-id';

    return {
      page: paginationModel.page + 1,
      pageSize: paginationModel.pageSize,
      ordering: orderingValue,
      username: debouncedFilters.username || undefined,
      first_name: debouncedFilters.firstName || undefined,
      country: debouncedFilters.country || undefined,
      age_from: debouncedFilters.ageFrom ? String(debouncedFilters.ageFrom) : undefined,
      age_to: debouncedFilters.ageTo ? String(debouncedFilters.ageTo) : undefined,
    };
  }, [debouncedFilters, paginationModel, sortModel]);

  const { data, isLoading } = useUsersList(params);
  const { data: countries = [], isLoading: isLoadingCountries } = useUserCountries();

  useEffect(() => {
    setPaginationModel((prev) => ({ ...prev, page: 0 }));
  }, [debouncedFilters]);

  const regionNames = useMemo(() => new Intl.DisplayNames([i18n.language], { type: 'region' }), [i18n.language]);

  const countryOptions = useMemo(
    () =>
      countries.map((code) => ({
        code,
        label: regionNames.of(code.toUpperCase()) || code.toUpperCase(),
      })),
    [countries, regionNames],
  );

  const rows = (data?.data as UsersListItem[]) ?? [];

  const columns = useMemo<GridColDef<UsersListItem>[]>(
    () => [
      {
        field: 'id',
        headerName: t('User'),
        flex: 1.5,
        sortable: true,
        minWidth: 220,
        renderCell: (params) => <UserIdentity user={params.row} />,
      },
      {
        field: 'skillsRating',
        headerName: t('Skills'),
        flex: 0.8,
        sortable: true,
        minWidth: 120,
        align: 'center',
        headerAlign: 'center',
        renderCell: ({ value }) => <RatingChip value={value} color="primary" />,
      },
      {
        field: 'activityRating',
        headerName: t('Activity'),
        flex: 0.8,
        sortable: true,
        minWidth: 120,
        align: 'center',
        headerAlign: 'center',
        renderCell: ({ value }) => <RatingChip value={value} color="info" />,
      },
      {
        field: 'contestsRating',
        headerName: t('Contests.Contests'),
        flex: 0.9,
        sortable: true,
        minWidth: 140,
        align: 'center',
        headerAlign: 'center',
        renderCell: ({ row }) => (
          <RatingChip value={row.contestsRating} tooltip={row.contestsRatingTitle} color="secondary" />
        ),
      },
      {
        field: 'challengesRating',
        headerName: t('Challenges'),
        flex: 0.9,
        sortable: true,
        minWidth: 140,
        align: 'center',
        headerAlign: 'center',
        renderCell: ({ row }) => (
          <RatingChip value={row.challengesRating} tooltip={row.challengesRatingTitle} color="warning" />
        ),
      },
      {
        field: 'streak',
        headerName: t('Streak'),
        flex: 1,
        sortable: true,
        minWidth: 170,
        renderCell: ({ row }) => (
          <StreakMeter
            streak={row.streak ?? null}
            maxStreak={row.maxStreak ?? null}
            currentLabel={t('Now')}
            maxLabel={t('MaxRating')}
          />
        ),
      },
      {
        field: 'kepcoin',
        headerName: t('Kepcoin'),
        flex: 0.8,
        sortable: true,
        minWidth: 110,
        align: 'right',
        headerAlign: 'right',
        renderCell: ({ value }) => <KepcoinAmount value={value as number | null} />,
      },
      {
        field: 'lastSeen',
        headerName: t('LastSeen'),
        flex: 1,
        sortable: true,
        minWidth: 150,
        align: 'center',
        headerAlign: 'center',
        renderCell: ({ value }) => (
          <Typography variant="body2" color="text.secondary">
            {value || '—'}
          </Typography>
        ),
      },
    ],
    [t],
  );

  const handleReset = () => {
    setFilters(defaultFilters);
  };

  return (
    <Container maxWidth="xl" sx={{ py: 3 }}>
      <Stack spacing={2.5}>
        <Stack direction="row" alignItems="center" justifyContent="space-between">
          <Typography variant="h4" fontWeight={700}>
            {t('Menu.Users')}
          </Typography>
          <Button variant="outlined" onClick={handleReset} disabled={!hasActiveFilters}>
            {t('Reset')}
          </Button>
        </Stack>

        <Card>
          <CardContent>
            <Grid container spacing={2} alignItems="center">
              <Grid item xs={12} sm={6} md={3}>
                <TextField
                  fullWidth
                  label={t('Username')}
                  value={filters.username}
                  onChange={(event) => setFilters((prev) => ({ ...prev, username: event.target.value }))}
                  size="small"
                />
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <TextField
                  fullWidth
                  label={t('Name')}
                  value={filters.firstName}
                  onChange={(event) => setFilters((prev) => ({ ...prev, firstName: event.target.value }))}
                  size="small"
                />
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <TextField
                  select
                  fullWidth
                  label={t('Country')}
                  value={filters.country}
                  onChange={(event) => setFilters((prev) => ({ ...prev, country: event.target.value }))}
                  size="small"
                  SelectProps={{
                    native: true,
                  }}
                  disabled={isLoadingCountries}
                >
                  <option value="">—</option>
                  {countryOptions.map((country) => (
                    <option key={country.code} value={country.code.toLowerCase()}>
                      {country.label}
                    </option>
                  ))}
                </TextField>
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <Stack direction="row" spacing={1} alignItems="center">
                  <TextField
                    fullWidth
                    type="number"
                    label={t('Age')}
                    value={filters.ageFrom ?? ''}
                    onChange={(event) =>
                      setFilters((prev) => ({ ...prev, ageFrom: event.target.value ? Number(event.target.value) : null }))
                    }
                    size="small"
                    inputProps={{ min: 0 }}
                  />
                  <Divider flexItem orientation="vertical" />
                  <TextField
                    fullWidth
                    type="number"
                    label=""
                    placeholder={t('Age') as string}
                    value={filters.ageTo ?? ''}
                    onChange={(event) =>
                      setFilters((prev) => ({ ...prev, ageTo: event.target.value ? Number(event.target.value) : null }))
                    }
                    size="small"
                    inputProps={{ min: 0 }}
                  />
                </Stack>
              </Grid>
            </Grid>
          </CardContent>
        </Card>

        <Card>
          <Box sx={{ width: '100%' }}>
            <DataGrid
              autoHeight
              disableRowSelectionOnClick
              rows={rows}
              getRowId={(row) => row.id ?? row.username}
              columns={columns}
              rowCount={data?.total ?? 0}
              paginationMode="server"
              sortingMode="server"
              paginationModel={paginationModel}
              onPaginationModelChange={setPaginationModel}
              sortModel={sortModel}
              onSortModelChange={(model) => setSortModel(model.length ? model : [{ field: 'id', sort: 'desc' }])}
              pageSizeOptions={PAGE_SIZE_OPTIONS}
              loading={isLoading}
            />
          </Box>
        </Card>
      </Stack>
    </Container>
  );
};

export default UsersListPage;

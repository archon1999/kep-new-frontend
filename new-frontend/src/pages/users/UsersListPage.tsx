import { ChangeEvent, MouseEvent, useCallback, useEffect, useMemo, useState } from 'react';
import {
  Box,
  Button,
  Divider,
  InputAdornment,
  MenuItem,
  Popover,
  Stack,
  TextField,
  Typography,
} from '@mui/material';
import { GridPaginationModel, GridSortModel } from '@mui/x-data-grid';
import { useTranslation } from 'react-i18next';
import StyledTextField from 'shared/components/styled/StyledTextField';
import IconifyIcon from 'shared/components/base/IconifyIcon';
import KepIcon from 'shared/components/base/KepIcon';
import { apiClient } from 'shared/api/http/apiClient';
import { ApiUsersListParams } from 'shared/api/orval/generated/endpoints/index.schemas';
import UsersListTable, { RatingValue, UserTableRow } from './components/UsersListTable';

const initialFilters = {
  search: '',
  username: '',
  firstName: '',
  country: '',
  ageFrom: '',
  ageTo: '',
};

type UsersFilterState = typeof initialFilters;

const orderingMap: Record<string, string> = {
  username: 'username',
  skills_rating: 'skills_rating',
  activity_rating: 'activity_rating',
  contests_rating__rating: 'contests_rating__rating',
  challenges_rating__rating: 'challenges_rating__rating',
  streak: 'streak',
  kepcoin: 'kepcoin',
  last_seen: 'last_seen',
};

const extractRating = (value: unknown): RatingValue | undefined => {
  if (typeof value === 'object' || typeof value === 'string' || typeof value === 'number') {
    return value as RatingValue;
  }

  return undefined;
};

const extractCountries = (payload: unknown): string[] => {
  if (Array.isArray(payload)) return payload.map(String);
  if (payload && typeof payload === 'object') {
    const maybeData = (payload as { data?: unknown }).data;
    if (Array.isArray(maybeData)) return maybeData.map(String);
  }

  return [];
};

const UsersListPage = () => {
  const { t, i18n } = useTranslation();

  const [filters, setFilters] = useState<UsersFilterState>(initialFilters);
  const [draftFilters, setDraftFilters] = useState<UsersFilterState>(initialFilters);
  const [searchValue, setSearchValue] = useState('');
  const [rows, setRows] = useState<UserTableRow[]>([]);
  const [rowCount, setRowCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [paginationModel, setPaginationModel] = useState<GridPaginationModel>({ page: 0, pageSize: 10 });
  const [sortModel, setSortModel] = useState<GridSortModel>([{ field: 'last_seen', sort: 'desc' }]);
  const [countries, setCountries] = useState<string[]>([]);
  const [filterAnchor, setFilterAnchor] = useState<HTMLElement | null>(null);

  useEffect(() => {
    const loadCountries = async () => {
      try {
        const response = await apiClient.apiUsersCountries();
        setCountries(extractCountries(response as unknown));
      } catch {
        setCountries([]);
      }
    };

    loadCountries();
  }, []);

  const regionNames = useMemo(() => {
    try {
      return new Intl.DisplayNames([i18n.language], { type: 'region' });
    } catch {
      return undefined;
    }
  }, [i18n.language]);

  useEffect(() => {
    const handle = setTimeout(() => {
      setFilters((prev) => {
        if (prev.search === searchValue) return prev;
        return { ...prev, search: searchValue };
      });
      setPaginationModel((prev) => ({ ...prev, page: 0 }));
    }, 400);

    return () => clearTimeout(handle);
  }, [searchValue]);

  const getOrderingKey = (model: GridSortModel) => {
    const sort = model[0];
    if (!sort) return undefined;

    const orderingKey = orderingMap[sort.field] ?? sort.field;
    return `${sort.sort === 'desc' ? '-' : ''}${orderingKey}`;
  };

  const mapUser = useCallback(
    (user: UserTableRow): UserTableRow => ({
      ...user,
      id: user.id ?? user.username,
      country: (user as unknown as { country?: string }).country,
      maxStreak: (user as unknown as { maxStreak?: number }).maxStreak,
      contestsRating: extractRating((user as unknown as { contestsRating?: RatingValue }).contestsRating),
      challengesRating: extractRating((user as unknown as { challengesRating?: RatingValue }).challengesRating),
    }),
    [],
  );

  const fetchUsers = useCallback(async () => {
    setLoading(true);
    try {
      const params: ApiUsersListParams & { full?: boolean } = {
        page: paginationModel.page + 1,
        pageSize: paginationModel.pageSize,
        ordering: getOrderingKey(sortModel),
        username: filters.username || undefined,
        first_name: filters.firstName || undefined,
        country: filters.country || undefined,
        age_from: filters.ageFrom || undefined,
        age_to: filters.ageTo || undefined,
        search: filters.search || undefined,
        full: true,
      };

      const response = await apiClient.apiUsersList(params as ApiUsersListParams);
      const mappedRows = (response.data ?? []).map((user) => mapUser(user as UserTableRow));

      setRows(mappedRows);
      setRowCount(response.total ?? response.count ?? mappedRows.length);
      setPaginationModel((prev) => ({
        ...prev,
        page: (response.page ?? prev.page + 1) - 1,
        pageSize: response.pageSize ?? prev.pageSize,
      }));
    } catch {
      setRows([]);
      setRowCount(0);
    } finally {
      setLoading(false);
    }
  }, [filters, mapUser, paginationModel.page, paginationModel.pageSize, sortModel]);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  const handleSearchChange = (event: ChangeEvent<HTMLInputElement>) => {
    setSearchValue(event.target.value);
  };

  const handlePaginationChange = (model: GridPaginationModel) => {
    setPaginationModel(model);
  };

  const handleSortModelChange = (model: GridSortModel) => {
    setSortModel(model.length ? model : [{ field: 'last_seen', sort: 'desc' }]);
  };

  const handleFilterFieldChange = (
    key: keyof UsersFilterState,
  ) => (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setDraftFilters((prev) => ({ ...prev, [key]: event.target.value }));
  };

  const handleOpenFilters = (event: MouseEvent<HTMLElement>) => {
    setFilterAnchor(event.currentTarget);
  };

  const handleCloseFilters = () => setFilterAnchor(null);

  const applyFilters = () => {
    setFilters((prev) => ({ ...prev, ...draftFilters }));
    setPaginationModel((prev) => ({ ...prev, page: 0 }));
    handleCloseFilters();
  };

  const resetFilters = () => {
    setDraftFilters(initialFilters);
    setFilters(initialFilters);
    setSearchValue('');
    setPaginationModel((prev) => ({ ...prev, page: 0 }));
    handleCloseFilters();
  };

  const countryOptions = useMemo(
    () =>
      countries.map((code) => ({
        code,
        label: regionNames?.of(code.toUpperCase()) ?? code.toUpperCase(),
      })),
    [countries, regionNames],
  );

  return (
    <Box sx={{ p: { xs: 3, md: 5 } }}>
      <Stack spacing={2.5}>
        <Stack spacing={0.5}>
          <Typography variant="h4" fontWeight={700}>
            {t('users.title')}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {t('users.subtitle')}
          </Typography>
        </Stack>

        <Stack
          direction={{ xs: 'column', sm: 'row' }}
          justifyContent="space-between"
          alignItems={{ xs: 'stretch', sm: 'center' }}
          spacing={1.5}
        >
          <Button
            variant="soft"
            color="neutral"
            startIcon={<KepIcon name="filters" width={18} height={18} />}
            onClick={handleOpenFilters}
            sx={{ alignSelf: { xs: 'flex-start', sm: 'center' } }}
          >
            {t('users.actions.filter')}
          </Button>

          <StyledTextField
            type="search"
            fullWidth
            value={searchValue}
            onChange={handleSearchChange}
            placeholder={t('users.search.placeholder')}
            slotProps={{
              input: {
                startAdornment: (
                  <InputAdornment position="start">
                    <IconifyIcon icon="material-symbols:search-rounded" fontSize={20} />
                  </InputAdornment>
                ),
              },
            }}
            sx={{ maxWidth: { sm: 320, md: 360 } }}
          />
        </Stack>

        <UsersListTable
          rows={rows}
          paginationModel={paginationModel}
          rowCount={rowCount}
          loading={loading}
          sortModel={sortModel}
          onPaginationChange={handlePaginationChange}
          onSortModelChange={handleSortModelChange}
        />
      </Stack>

      <Popover
        open={Boolean(filterAnchor)}
        anchorEl={filterAnchor}
        onClose={handleCloseFilters}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
        transformOrigin={{ vertical: 'top', horizontal: 'left' }}
        slotProps={{ paper: { sx: { minWidth: 320, p: 2.5 } } }}
      >
        <Stack spacing={2}>
          <Typography variant="subtitle1" fontWeight={700}>
            {t('users.filters.title')}
          </Typography>

          <StyledTextField
            label={t('users.filters.username')}
            value={draftFilters.username}
            onChange={handleFilterFieldChange('username')}
            placeholder={t('users.filters.usernamePlaceholder')}
          />

          <StyledTextField
            label={t('users.filters.name')}
            value={draftFilters.firstName}
            onChange={handleFilterFieldChange('firstName')}
            placeholder={t('users.filters.namePlaceholder')}
          />

          <StyledTextField
            select
            label={t('users.filters.country')}
            value={draftFilters.country}
            onChange={handleFilterFieldChange('country')}
          >
            <MenuItem value="">{t('users.filters.any')}</MenuItem>
            {countryOptions.map((option) => (
              <MenuItem key={option.code} value={option.code}>
                {option.label}
              </MenuItem>
            ))}
          </StyledTextField>

          <Stack direction="row" spacing={1.5}>
            <TextField
              type="number"
              label={t('users.filters.ageFrom')}
              value={draftFilters.ageFrom}
              onChange={handleFilterFieldChange('ageFrom')}
              fullWidth
            />
            <TextField
              type="number"
              label={t('users.filters.ageTo')}
              value={draftFilters.ageTo}
              onChange={handleFilterFieldChange('ageTo')}
              fullWidth
            />
          </Stack>

          <Divider />

          <Stack direction="row" spacing={1} justifyContent="flex-end">
            <Button color="neutral" variant="outlined" onClick={resetFilters}>
              {t('users.actions.reset')}
            </Button>
            <Button variant="contained" onClick={applyFilters}>
              {t('users.actions.apply')}
            </Button>
          </Stack>
        </Stack>
      </Popover>
    </Box>
  );
};

export default UsersListPage;

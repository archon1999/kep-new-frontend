import { ChangeEvent, useEffect, useMemo, useState } from 'react';
import {
  Box,
  Button,
  Card,
  CardContent,
  Collapse,
  InputAdornment,
  MenuItem,
  Stack,
  Typography,
} from '@mui/material';
import { GridPaginationModel, GridSortModel } from '@mui/x-data-grid';
import { useTranslation } from 'react-i18next';
import useSWR from 'swr';
import { useBreakpoints } from 'app/providers/BreakpointsProvider';
import StyledTextField from 'shared/components/styled/StyledTextField';
import IconifyIcon from 'shared/components/base/IconifyIcon';
import axiosFetcher from 'shared/services/axios/axiosFetcher';
import { ApiUsersList200 } from 'shared/api/orval/generated/endpoints/index.schemas';
import UsersListTable from './UsersListTable';
import { UsersListRow } from './types';

type UsersFiltersState = {
  username: string;
  firstName: string;
  country: string;
  ageFrom: string;
  ageTo: string;
};

const defaultPaginationModel: GridPaginationModel = {
  page: 0,
  pageSize: 10,
};

const defaultSortModel: GridSortModel = [
  {
    field: 'id',
    sort: 'desc',
  },
];

const orderingKeyMap: Record<string, string> = {
  id: 'id',
  username: 'username',
  skillsRating: 'skills_rating',
  activityRating: 'activity_rating',
  contestsRating: 'contests_rating__rating',
  challengesRating: 'challenges_rating__rating',
  streak: 'streak',
  kepcoin: 'kepcoin',
  lastSeen: 'last_seen',
};

const useDebouncedValue = <T,>(value: T, delay = 400) => {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const handle = setTimeout(() => setDebouncedValue(value), delay);

    return () => clearTimeout(handle);
  }, [value, delay]);

  return debouncedValue;
};

const UsersListPage = () => {
  const { t, i18n } = useTranslation();
  const { up } = useBreakpoints();
  const upMd = up('md');

  const [filters, setFilters] = useState<UsersFiltersState>({
    username: '',
    firstName: '',
    country: '',
    ageFrom: '',
    ageTo: '',
  });
  const [searchValue, setSearchValue] = useState('');
  const [paginationModel, setPaginationModel] = useState<GridPaginationModel>(defaultPaginationModel);
  const [sortModel, setSortModel] = useState<GridSortModel>(defaultSortModel);
  const [showFilters, setShowFilters] = useState(false);

  const debouncedFilters = useDebouncedValue(filters, 500);
  const debouncedSearchValue = useDebouncedValue(searchValue, 500);

  const languageCode = (i18n.language || 'en').slice(0, 2).toLowerCase();
  const countryDisplayNames = useMemo(
    () => (typeof Intl.DisplayNames !== 'undefined' ? new Intl.DisplayNames([languageCode], { type: 'region' }) : null),
    [languageCode],
  );

  const { data: countriesResponse } = useSWR<string[] | { data?: string[] }>(
    ['/api/users/countries/', { method: 'get' }],
    axiosFetcher,
  );

  const countryCodes = useMemo(() => {
    if (Array.isArray(countriesResponse)) return countriesResponse;
    if (countriesResponse && Array.isArray(countriesResponse.data)) return countriesResponse.data;

    return [];
  }, [countriesResponse]);

  const countryNameMap = useMemo(() => {
    const entries = countryCodes
      .filter((code): code is string => Boolean(code))
      .map((code) => {
        const normalized = code.toUpperCase();
        const label = countryDisplayNames?.of(normalized) ?? normalized;

        return [normalized, label] as const;
      });

    return Object.fromEntries(entries) as Record<string, string | undefined>;
  }, [countryCodes, countryDisplayNames]);

  const getCountryName = (code?: string) => {
    if (!code) return undefined;
    const normalized = code.toUpperCase();

    return countryNameMap[normalized] ?? normalized;
  };

  const ordering = useMemo(() => {
    const [activeSort] = sortModel;
    if (!activeSort?.field || !activeSort?.sort) return undefined;

    const orderingKey = orderingKeyMap[activeSort.field];
    if (!orderingKey) return undefined;

    return `${activeSort.sort === 'desc' ? '-' : ''}${orderingKey}`;
  }, [sortModel]);

  const queryParams = useMemo(
    () => ({
      page: paginationModel.page + 1,
      pageSize: paginationModel.pageSize,
      ordering,
      search: debouncedSearchValue || undefined,
      username: debouncedFilters.username || undefined,
      first_name: debouncedFilters.firstName || undefined,
      country: debouncedFilters.country || undefined,
      age_from: debouncedFilters.ageFrom || undefined,
      age_to: debouncedFilters.ageTo || undefined,
    }),
    [
      paginationModel.page,
      paginationModel.pageSize,
      ordering,
      debouncedSearchValue,
      debouncedFilters.username,
      debouncedFilters.firstName,
      debouncedFilters.country,
      debouncedFilters.ageFrom,
      debouncedFilters.ageTo,
    ],
  );

  const { data, isLoading, isValidating } = useSWR<ApiUsersList200>(
    ['/api/users/', { method: 'get', params: queryParams }],
    axiosFetcher,
  );

  const rows = (data?.data || []) as UsersListRow[];
  const loading = isLoading || isValidating;

  useEffect(() => {
    setPaginationModel((prev) => ({ ...prev, page: 0 }));
  }, [debouncedFilters, debouncedSearchValue, sortModel]);

  const handleFilterChange = (key: keyof UsersFiltersState) => (event: ChangeEvent<HTMLInputElement>) => {
    setFilters((prev) => ({ ...prev, [key]: event.target.value }));
  };

  const handleCountryChange = (event: ChangeEvent<HTMLInputElement>) => {
    setFilters((prev) => ({ ...prev, country: event.target.value }));
  };

  const handleSearchChange = (event: ChangeEvent<HTMLInputElement>) => {
    setSearchValue(event.target.value);
  };

  const handlePaginationChange = (model: GridPaginationModel) => {
    setPaginationModel(model);
  };

  const handleSortModelChange = (model: GridSortModel) => {
    setSortModel(model.length ? model : defaultSortModel);
  };

  return (
    <Box sx={{ p: { xs: 3, md: 5 } }}>
      <Stack spacing={3}>
        <Stack spacing={1}>
          <Typography variant="h4" fontWeight={700}>
            {t('users.title')}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {t('users.description')}
          </Typography>
        </Stack>

        <Card>
          <CardContent>
            <Stack
              sx={{
                gap: 2,
                mb: 2,
                alignItems: { md: 'center' },
                justifyContent: 'space-between',
                flexDirection: { xs: 'column', sm: 'row' },
              }}
            >
              <Button
                shape={upMd ? undefined : 'square'}
                variant="soft"
                color="neutral"
                onClick={() => setShowFilters((prev) => !prev)}
                sx={{ flexShrink: 0 }}
                startIcon={
                  <IconifyIcon
                    icon="mdi:filter-variant"
                    sx={{
                      fontSize: 20,
                      marginRight: { xs: 0, md: '4px' },
                    }}
                  />
                }
              >
                {upMd && <Box component="span">{t('users.actions.toggleFilters')}</Box>}
              </Button>

              <StyledTextField
                id="search-box"
                type="search"
                fullWidth
                value={searchValue}
                onChange={handleSearchChange}
                placeholder={t('users.searchPlaceholder')}
                slotProps={{
                  input: {
                    startAdornment: (
                      <InputAdornment position="start">
                        <IconifyIcon icon="material-symbols:search-rounded" fontSize={20} />
                      </InputAdornment>
                    ),
                  },
                }}
                sx={{
                  maxWidth: { sm: 260, md: 320 },
                  flexGrow: { xs: 1, sm: 0 },
                }}
              />
            </Stack>

            <Collapse in={showFilters} timeout="auto" unmountOnExit>
              <Stack
                spacing={2}
                sx={{
                  mb: 2,
                  display: 'grid',
                  gridTemplateColumns: {
                    xs: '1fr',
                    sm: 'repeat(2, minmax(0, 1fr))',
                    md: 'repeat(4, minmax(0, 1fr))',
                  },
                }}
              >
                <StyledTextField
                  label={t('users.filters.username')}
                  value={filters.username}
                  onChange={handleFilterChange('username')}
                  fullWidth
                />
                <StyledTextField
                  label={t('users.filters.name')}
                  value={filters.firstName}
                  onChange={handleFilterChange('firstName')}
                  fullWidth
                />
                <StyledTextField
                  select
                  label={t('users.filters.country')}
                  value={filters.country}
                  onChange={handleCountryChange}
                  fullWidth
                >
                  <MenuItem value="">{t('users.labels.allCountries')}</MenuItem>
                  {countryCodes.map((code) => {
                    const value = code?.toLowerCase();
                    const label = getCountryName(code);

                    return (
                      <MenuItem key={code} value={value} sx={{ textTransform: 'uppercase' }}>
                        {label}
                      </MenuItem>
                    );
                  })}
                </StyledTextField>
                <Stack spacing={1}>
                  <Typography variant="caption" color="text.secondary">
                    {t('users.filters.age')}
                  </Typography>
                  <Stack direction="row" spacing={1.5} alignItems="center">
                    <StyledTextField
                      type="number"
                      value={filters.ageFrom}
                      onChange={handleFilterChange('ageFrom')}
                      placeholder={t('users.labels.from')}
                      fullWidth
                      inputProps={{ min: 0 }}
                    />
                    <Typography variant="body2" color="text.secondary">
                      —
                    </Typography>
                    <StyledTextField
                      type="number"
                      value={filters.ageTo}
                      onChange={handleFilterChange('ageTo')}
                      placeholder={t('users.labels.to')}
                      fullWidth
                      inputProps={{ min: 0 }}
                    />
                  </Stack>
                </Stack>
              </Stack>
            </Collapse>

            <UsersListTable
              rows={rows}
              rowCount={data?.total ?? 0}
              loading={loading}
              paginationModel={paginationModel}
              onPaginationModelChange={handlePaginationChange}
              sortModel={sortModel}
              onSortModelChange={handleSortModelChange}
              getCountryName={getCountryName}
            />
          </CardContent>
        </Card>
      </Stack>
    </Box>
  );
};

export default UsersListPage;

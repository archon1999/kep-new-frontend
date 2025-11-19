import { ChangeEvent, MouseEvent, SyntheticEvent, useEffect, useMemo, useState } from 'react';
import { TabContext, TabList } from '@mui/lab';
import { Box, Button, InputAdornment, Menu, MenuItem, Stack, Tab, Typography } from '@mui/material';
import { GridPaginationModel, GridSortModel } from '@mui/x-data-grid';
import { useTranslation } from 'react-i18next';
import { useBreakpoints } from 'app/providers/BreakpointsProvider';
import { useUsersCountries, useUsersList } from 'modules/users/application/queries';
import StyledTextField from 'shared/components/styled/StyledTextField';
import IconifyIcon from 'shared/components/base/IconifyIcon';
import { formatCountryFlag } from 'shared/utils/formatCountryFlag';
import UsersDataGrid from './UsersDataGrid';

const tabOrderingMap = {
  all: '-id',
  skills: '-skills_rating',
  activity: '-activity_rating',
  contests: '-contests_rating__rating',
  challenges: '-kepcoin',
};

const sortFieldMap: Record<string, string> = {
  username: 'id',
  skillsRating: 'skills_rating',
  activityRating: 'activity_rating',
  contestsRating: 'contests_rating__rating',
  challengesRating: 'challenges_rating__rating',
  streak: 'streak',
  kepcoin: 'kepcoin',
  lastSeen: 'last_seen',
};

type TabValue = keyof typeof tabOrderingMap;

type FiltersState = {
  search: string;
  country: string;
  ageFrom: string;
  ageTo: string;
};

const UsersListContainer = () => {
  const { t, i18n } = useTranslation();
  const { up } = useBreakpoints();
  const upMd = up('md');

  const [tabValue, setTabValue] = useState<TabValue>('skills');
  const [filters, setFilters] = useState<FiltersState>({
    search: '',
    country: '',
    ageFrom: '',
    ageTo: '',
  });
  const [debouncedFilters, setDebouncedFilters] = useState(filters);
  const [filtersAnchorEl, setFiltersAnchorEl] = useState<null | HTMLElement>(null);
  const [paginationModel, setPaginationModel] = useState<GridPaginationModel>({ page: 0, pageSize: 10 });
  const [sortModel, setSortModel] = useState<GridSortModel>([]);

  useEffect(() => {
    const timeoutId = setTimeout(() => setDebouncedFilters(filters), 500);

    return () => clearTimeout(timeoutId);
  }, [filters]);

  useEffect(() => {
    setPaginationModel((prev) => ({ ...prev, page: 0 }));
  }, [debouncedFilters, tabValue]);

  const { data: countries } = useUsersCountries();

  const normalizeLocale = (language: string) => {
    if (language.includes('-')) return language;
    const match = language.match(/^(\w{2})([A-Z]{2})$/);

    if (match) {
      return `${match[1]}-${match[2]}`;
    }

    return language;
  };

  const regionNames = useMemo(
    () => new Intl.DisplayNames([normalizeLocale(i18n.language) ?? 'en-US'], { type: 'region' }),
    [i18n.language],
  );

  const countryOptions = useMemo(
    () =>
      (countries ?? []).map((code) => {
        const formattedCode = code?.toUpperCase?.() ?? code;
        return {
          code: formattedCode,
          label: regionNames.of(formattedCode) ?? formattedCode,
        };
      }),
    [countries, regionNames],
  );

  const countryLabels = useMemo(
    () => Object.fromEntries(countryOptions.map((country) => [country.code, country.label])),
    [countryOptions],
  );

  const ordering = useMemo(() => {
    const currentSort = sortModel[0];

    if (currentSort) {
      const orderingField = sortFieldMap[currentSort.field] ?? currentSort.field;
      return `${currentSort.sort === 'desc' ? '-' : ''}${orderingField}`;
    }

    return tabOrderingMap[tabValue];
  }, [sortModel, tabValue]);

  const queryParams = useMemo(
    () => ({
      page: paginationModel.page + 1,
      pageSize: paginationModel.pageSize,
      ordering,
      search: debouncedFilters.search || undefined,
      country: debouncedFilters.country || undefined,
      ageFrom: debouncedFilters.ageFrom ? Number(debouncedFilters.ageFrom) : undefined,
      ageTo: debouncedFilters.ageTo ? Number(debouncedFilters.ageTo) : undefined,
    }),
    [paginationModel.page, paginationModel.pageSize, ordering, debouncedFilters],
  );

  const { data, isLoading, isValidating } = useUsersList(queryParams);

  const rows = useMemo(() => data?.data ?? [], [data?.data]);
  const rowCount = data?.total ?? 0;

  const handleTabChange = (_: SyntheticEvent, value: TabValue) => {
    setTabValue(value);
    setSortModel([]);
  };

  const handleFilterChange = (field: keyof FiltersState) => (event: ChangeEvent<HTMLInputElement>) => {
    setFilters((prev) => ({ ...prev, [field]: event.target.value }));
  };

  const handlePaginationChange = (model: GridPaginationModel) => setPaginationModel(model);

  const handleSortModelChange = (model: GridSortModel) => setSortModel(model);

  const filtersOpen = Boolean(filtersAnchorEl);
  const handleFiltersButtonClick = (event: MouseEvent<HTMLButtonElement>) => {
    setFiltersAnchorEl((prev) => (prev ? null : event.currentTarget));
  };
  const handleFiltersClose = () => setFiltersAnchorEl(null);

  const columnLabels = {
    user: t('users.columns.user'),
    skills: t('users.columns.skills'),
    activity: t('users.columns.activity'),
    contests: t('users.columns.contests'),
    challenges: t('users.columns.challenges'),
    streak: t('users.columns.streak'),
    kepcoin: t('users.columns.kepcoin'),
    lastSeen: t('users.columns.lastSeen'),
    emptyValue: t('users.emptyValue'),
  } as const;

  return (
    <TabContext value={tabValue}>
      <Stack
        sx={{
          gap: 2,
          mb: 4,
          alignItems: { md: 'center' },
          justifyContent: 'space-between',
          flexDirection: { xs: 'column', sm: 'row' },
        }}
      >
        <Box sx={{ order: { xs: 1, sm: 0 } }}>
          <TabList onChange={handleTabChange} aria-label="users list tab">
            <Tab label={t('users.tabs.all')} value="all" />
            <Tab label={t('users.tabs.skills')} value="skills" />
            <Tab label={t('users.tabs.activity')} value="activity" />
            <Tab label={t('users.tabs.contests')} value="contests" />
            <Tab label={t('users.tabs.challenges')} value="challenges" />
          </TabList>
        </Box>
        <Stack sx={{ gap: 1 }} direction={{ xs: 'column', sm: 'row' }}>
          <Button
            shape={upMd ? undefined : 'square'}
            variant="soft"
            color="neutral"
            onClick={handleFiltersButtonClick}
            aria-haspopup="true"
            aria-expanded={filtersOpen ? 'true' : undefined}
            aria-controls={filtersOpen ? 'users-filters-menu' : undefined}
            sx={{ flexShrink: 0 }}
          >
            <IconifyIcon
              icon="mdi:filter-variant"
              sx={{
                fontSize: 20,
                marginRight: { xs: 0, md: '4px' },
              }}
            />
            {upMd && <Box component="span">{t('users.filters.toggle')}</Box>}
          </Button>
          <StyledTextField
            id="search-box"
            type="search"
            fullWidth
            value={filters.search}
            onChange={handleFilterChange('search')}
            placeholder={t('users.filters.searchPlaceholder')}
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
              maxWidth: { sm: 240, md: 280 },
              flexGrow: { xs: 1, sm: 0 },
            }}
          />
        </Stack>
      </Stack>
      <Menu
        id="users-filters-menu"
        anchorEl={filtersAnchorEl}
        open={filtersOpen}
        onClose={handleFiltersClose}
        MenuListProps={{ disablePadding: true }}
        slotProps={{
          paper: {
            sx: {
              width: { xs: 280, sm: 320 },
              p: 2,
              mt: 1,
            },
          },
        }}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
      >
        <Stack spacing={2} sx={{ width: '100%' }}>
          <StyledTextField
            select
            fullWidth
            label={t('users.filters.country')}
            value={filters.country}
            onChange={handleFilterChange('country')}
            placeholder={t('users.filters.countryPlaceholder')}
            InputLabelProps={{ shrink: true }}
            SelectProps={{
              displayEmpty: true,
              renderValue: (selected) => {
                if (!selected) {
                  return (
                    <Typography component="span" color="text.secondary">
                      {t('users.filters.anyCountry')}
                    </Typography>
                  );
                }

                const value = String(selected).toUpperCase();
                const label = countryLabels[value] ?? value;

                return (
                  <Stack direction="row" spacing={1} alignItems="center">
                    <Box component="span" sx={{ fontSize: 18, lineHeight: 1 }}>
                      {formatCountryFlag(value)}
                    </Box>
                    <Typography component="span">{label}</Typography>
                  </Stack>
                );
              },
            }}
          >
            <MenuItem value="">
              <Typography component="span" color="text.secondary">
                {t('users.filters.anyCountry')}
              </Typography>
            </MenuItem>
            {countryOptions.map((country) => (
              <MenuItem key={country.code} value={country.code}>
                <Stack direction="row" spacing={1} alignItems="center">
                  <Box component="span" sx={{ fontSize: 18, lineHeight: 1 }}>
                    {formatCountryFlag(country.code)}
                  </Box>
                  <Typography component="span">{country.label}</Typography>
                </Stack>
              </MenuItem>
            ))}
          </StyledTextField>
          <Stack direction="row" spacing={1} alignItems="flex-end">
            <StyledTextField
              fullWidth
              type="number"
              label={t('users.filters.ageFrom')}
              value={filters.ageFrom}
              onChange={handleFilterChange('ageFrom')}
              placeholder={t('users.filters.agePlaceholder')}
              disabledSpinButton
              InputLabelProps={{ shrink: true }}
            />
            <Typography color="text.secondary" sx={{ pb: 1.5 }}>
              —
            </Typography>
            <StyledTextField
              fullWidth
              type="number"
              label={t('users.filters.ageTo')}
              value={filters.ageTo}
              onChange={handleFilterChange('ageTo')}
              placeholder={t('users.filters.agePlaceholder')}
              disabledSpinButton
              InputLabelProps={{ shrink: true }}
            />
          </Stack>
        </Stack>
      </Menu>

      <UsersDataGrid
        rows={rows}
        rowCount={rowCount}
        loading={isLoading || isValidating}
        paginationModel={paginationModel}
        onPaginationModelChange={handlePaginationChange}
        sortModel={sortModel}
        onSortModelChange={handleSortModelChange}
        columnLabels={columnLabels}
        countryLabels={countryLabels}
      />
    </TabContext>
  );
};

export default UsersListContainer;

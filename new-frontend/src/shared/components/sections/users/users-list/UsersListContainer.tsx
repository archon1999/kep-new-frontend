import { ChangeEvent, MouseEvent, SyntheticEvent, useCallback, useMemo, useState } from 'react';
import { TabContext, TabList, TabPanel } from '@mui/lab';
import {
  Box,
  Button,
  Card,
  InputAdornment,
  MenuItem,
  Stack,
  Tab,
  Typography,
} from '@mui/material';
import { GridFilterItem, GridFilterModel, useGridApiRef } from '@mui/x-data-grid';
import { useBreakpoints } from 'app/providers/BreakpointsProvider';
import { useTranslation } from 'react-i18next';
import StyledTextField from 'shared/components/styled/StyledTextField';
import KepIcon from 'shared/components/base/KepIcon';
import { usersList } from 'data/users-list';
import UsersListTable from './UsersListTable';

export type TabValue = 'all' | 'online' | 'offline' | 'busy';

const statusTabs: { labelKey: string; value: TabValue }[] = [
  { labelKey: 'users.list.tabs.all', value: 'all' },
  { labelKey: 'users.list.status.online', value: 'online' },
  { labelKey: 'users.list.status.busy', value: 'busy' },
  { labelKey: 'users.list.status.offline', value: 'offline' },
];

const UsersListContainer = () => {
  const { up } = useBreakpoints();
  const upMd = up('md');
  const { t } = useTranslation();
  const apiRef = useGridApiRef();

  const [filterButtonEl, setFilterButtonEl] = useState<HTMLButtonElement | null>(null);
  const [value, setValue] = useState<TabValue>('all');
  const [filterModel, setFilterModel] = useState<GridFilterModel>({
    items: [],
    quickFilterValues: [],
  });
  const [filters, setFilters] = useState({
    username: '',
    fullName: '',
    country: '',
    ageFrom: '',
    ageTo: '',
  });

  const countries = useMemo(
    () => Array.from(new Set(usersList.map((user) => user.country))).sort(),
    [],
  );

  const updateFilterItems = (updater: (items: GridFilterItem[]) => GridFilterItem[]) => {
    setFilterModel((prev) => ({
      ...prev,
      items: updater(prev.items ?? []),
      quickFilterValues: prev.quickFilterValues ?? [],
    }));
  };

  const syncFiltersFromModel = (model: GridFilterModel) => {
    const getValue = (field: string, operator?: string) =>
      model.items.find((item) => item.field === field && (!operator || item.operator === operator))?.value ?? '';

    setFilters({
      username: (getValue('username') as string) || '',
      fullName: (getValue('fullName') as string) || '',
      country: (getValue('country') as string) || '',
      ageFrom: getValue('age', '>=')?.toString() || '',
      ageTo: getValue('age', '<=')?.toString() || '',
    });
  };

  const handleFilterModelChange = (model: GridFilterModel) => {
    setFilterModel(model);
    const statusFilter = model.items.find((item) => item.field === 'status');
    setValue((statusFilter?.value as TabValue) ?? 'all');
    syncFiltersFromModel(model);
  };

  const handleChange = (e: SyntheticEvent, newValue: TabValue) => {
    setValue(newValue);
    updateFilterItems((items) => {
      const rest = items.filter((item) => item.field !== 'status');

      if (newValue === 'all') {
        return rest;
      }

      return [...rest, { id: 'status', field: 'status', operator: 'equals', value: newValue }];
    });
  };

  const handleSearch = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      const searchTerm = e.target.value;
      apiRef.current?.setQuickFilterValues(searchTerm ? [searchTerm] : []);
    },
    [apiRef],
  );

  const handleToggleFilterPanel = (e: MouseEvent<HTMLButtonElement>) => {
    const clickedEl = e.currentTarget;

    if (filterButtonEl && filterButtonEl === clickedEl) {
      setFilterButtonEl(null);
      apiRef.current?.hideFilterPanel();

      return;
    }

    setFilterButtonEl(clickedEl);
    apiRef.current?.showFilterPanel();
  };

  const handleFieldFilterChange = (
    field: string,
    operator: GridFilterItem['operator'] = 'contains',
  ) =>
    (e: ChangeEvent<HTMLInputElement>) => {
      const { value: rawValue } = e.target;
      const value = rawValue === '' ? undefined : rawValue;

      setFilters((prev) => ({ ...prev, [field]: rawValue }));

      updateFilterItems((items) => {
        const rest = items.filter((item) => !(item.field === field && item.operator === operator));

        if (value === undefined) {
          return rest;
        }

        return [...rest, { id: `${field}-${operator}`, field, operator, value }];
      });
    };

  const handleAgeChange = (
    key: 'ageFrom' | 'ageTo',
    operator: GridFilterItem['operator'],
  ) =>
    (e: ChangeEvent<HTMLInputElement>) => {
      const value = e.target.value;
      const numericValue = value === '' ? undefined : Number(value);

      setFilters((prev) => ({ ...prev, [key]: value }));

      updateFilterItems((items) => {
        const rest = items.filter((item) => !(item.field === 'age' && item.operator === operator));

        if (numericValue === undefined || Number.isNaN(numericValue)) {
          return rest;
        }

        return [...rest, { id: `${key}-age`, field: 'age', operator, value: numericValue }];
      });
    };

  return (
    <Card sx={{ p: { xs: 2, md: 3 } }}>
      <Stack spacing={3}>
        <Stack spacing={0.5}>
          <Typography variant="h5">{t('users.list.title')}</Typography>
          <Typography variant="body2" color="text.secondary">
            {t('users.list.subtitle')}
          </Typography>
        </Stack>

        <TabContext value={value}>
          <Stack
            sx={{
              gap: 2,
              mb: 1,
              alignItems: { md: 'center' },
              justifyContent: 'space-between',
              flexDirection: { xs: 'column', sm: 'row' },
            }}
          >
            <Box sx={{ order: { xs: 1, sm: 0 } }}>
              <TabList onChange={handleChange} aria-label="users list tabs">
                {statusTabs.map((tab) => (
                  <Tab key={tab.value} label={t(tab.labelKey)} value={tab.value} />
                ))}
              </TabList>
            </Box>
            <Stack sx={{ gap: 1 }} direction={{ xs: 'column', sm: 'row' }}>
              <Button
                shape={upMd ? undefined : 'square'}
                variant="soft"
                color="neutral"
                onClick={handleToggleFilterPanel}
                sx={{ flexShrink: 0 }}
              >
                <KepIcon icon="mdi:filter-variant" sx={{ fontSize: 20, mr: { xs: 0, md: '4px' } }} />
                {upMd && <Box component="span">{t('users.list.actions.filter')}</Box>}
              </Button>
              <StyledTextField
                id="search-box"
                type="search"
                fullWidth
                onChange={handleSearch}
                placeholder={t('users.list.actions.searchPlaceholder')}
                slotProps={{
                  input: {
                    startAdornment: (
                      <InputAdornment position="start">
                        <KepIcon icon="material-symbols:search-rounded" fontSize={20} />
                      </InputAdornment>
                    ),
                  },
                }}
                sx={{
                  maxWidth: { sm: 240, md: 260 },
                  flexGrow: { xs: 1, sm: 0 },
                }}
              />
            </Stack>
          </Stack>

          {statusTabs.map((tab) => (
            <TabPanel
              key={tab.value}
              value={tab.value}
              sx={{
                p: 0,
              }}
            >
              <Stack spacing={2.5}>
                <Stack
                  direction={{ xs: 'column', md: 'row' }}
                  spacing={2}
                  useFlexGap
                  sx={{ flexWrap: { xs: 'wrap', md: 'nowrap' } }}
                >
                  <StyledTextField
                    label={t('users.list.filters.username')}
                    value={filters.username}
                    onChange={handleFieldFilterChange('username')}
                    placeholder={t('users.list.filters.usernamePlaceholder')}
                    fullWidth
                  />
                  <StyledTextField
                    label={t('users.list.filters.name')}
                    value={filters.fullName}
                    onChange={handleFieldFilterChange('fullName')}
                    placeholder={t('users.list.filters.namePlaceholder')}
                    fullWidth
                  />
                  <StyledTextField
                    label={t('users.list.filters.country')}
                    value={filters.country}
                    onChange={handleFieldFilterChange('country', 'equals')}
                    select
                    fullWidth
                  >
                    <MenuItem value="">{t('users.list.filters.any')}</MenuItem>
                    {countries.map((country) => (
                      <MenuItem key={country} value={country}>
                        {country}
                      </MenuItem>
                    ))}
                  </StyledTextField>
                  <Stack direction="row" spacing={1} sx={{ flex: { xs: 1, md: 0.8 } }}>
                    <StyledTextField
                      label={t('users.list.filters.ageFrom')}
                      value={filters.ageFrom}
                      onChange={handleAgeChange('ageFrom', '>=')}
                      type="number"
                      fullWidth
                    />
                    <StyledTextField
                      label={t('users.list.filters.ageTo')}
                      value={filters.ageTo}
                      onChange={handleAgeChange('ageTo', '<=')}
                      type="number"
                      fullWidth
                    />
                  </Stack>
                </Stack>

                <UsersListTable
                  data={usersList}
                  filterModel={filterModel}
                  onFilterModelChange={handleFilterModelChange}
                  apiRef={apiRef}
                  filterButtonEl={filterButtonEl}
                />
              </Stack>
            </TabPanel>
          ))}
        </TabContext>
      </Stack>
    </Card>
  );
};

export default UsersListContainer;

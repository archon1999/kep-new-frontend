import { ChangeEvent, MouseEvent, SyntheticEvent, useCallback, useMemo, useState } from 'react';
import { TabContext, TabList, TabPanel } from '@mui/lab';
import { Box, Button, InputAdornment, Stack, Tab } from '@mui/material';
import { GridFilterModel, useGridApiRef } from '@mui/x-data-grid';
import { useTranslation } from 'react-i18next';
import { useBreakpoints } from 'app/providers/BreakpointsProvider';
import { userListRows } from 'data/users-list';
import StyledTextField from 'shared/components/styled/StyledTextField';
import IconifyIcon from 'shared/components/base/IconifyIcon';
import UsersListFilters, { UserListFiltersState } from './UsersListFilters';
import UsersListTable from './UsersListTable';

export type UserStatusFilter = 'all' | 'online' | 'busy' | 'away' | 'offline';

const UsersListContainer = () => {
  const apiRef = useGridApiRef();
  const { up } = useBreakpoints();
  const upMd = up('md');
  const { t } = useTranslation();

  const [filterButtonEl, setFilterButtonEl] = useState<HTMLButtonElement | null>(null);
  const [value, setValue] = useState<UserStatusFilter>('all');
  const [filterModel, setFilterMode] = useState<GridFilterModel>({
    items: [],
  });
  const [filters, setFilters] = useState<UserListFiltersState>({
    username: '',
    name: '',
    country: '',
    ageFrom: undefined,
    ageTo: undefined,
  });

  const handleChange = (e: SyntheticEvent, newValue: UserStatusFilter) => {
    setValue(newValue);
    if (newValue === 'all') {
      setFilterMode({ items: [] });
    } else {
      setFilterMode({
        items: [{ field: 'status', operator: 'equals', value: newValue }],
      });
    }
  };

  const handleSearch = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      apiRef.current?.setQuickFilterValues([e.target.value]);
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

  const filteredData = useMemo(
    () =>
      userListRows.filter((user) => {
        if (filters.username && !user.username.toLowerCase().includes(filters.username.toLowerCase())) {
          return false;
        }
        if (filters.name && !user.fullName.toLowerCase().includes(filters.name.toLowerCase())) {
          return false;
        }
        if (filters.country && user.country !== filters.country) {
          return false;
        }
        if (filters.ageFrom && user.age < filters.ageFrom) {
          return false;
        }
        if (filters.ageTo && user.age > filters.ageTo) {
          return false;
        }
        if (value !== 'all' && user.status !== value) {
          return false;
        }

        return true;
      }),
    [filters.ageFrom, filters.ageTo, filters.country, filters.name, filters.username, value],
  );

  return (
    <TabContext value={value}>
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
          <Stack
            sx={{
              justifyContent: 'space-between',
            }}
          >
            <TabList onChange={handleChange} aria-label="user list tab">
              <Tab label={t('All')} value="all" />
              <Tab label={t('StatusOnline') ?? 'Online'} value="online" />
              <Tab label={t('StatusBusy') ?? 'Busy'} value="busy" />
              <Tab label={t('StatusAway') ?? 'Away'} value="away" />
              <Tab label={t('StatusOffline') ?? 'Offline'} value="offline" />
            </TabList>
          </Stack>
        </Box>
        <Stack sx={{ gap: 1 }} direction={{ xs: 'column', sm: 'row' }} alignItems={{ xs: 'stretch', sm: 'center' }}>
          <Button
            shape={upMd ? undefined : 'square'}
            variant="soft"
            color="neutral"
            onClick={handleToggleFilterPanel}
            sx={{ flexShrink: 0 }}
          >
            <IconifyIcon
              icon="mdi:filter-variant"
              sx={{
                fontSize: 20,
                marginRight: { xs: 0, md: '4px' },
              }}
            />
            {upMd && <Box component="span">{t('FilterProblems') ?? 'Filter'}</Box>}
          </Button>
          <StyledTextField
            id="search-box"
            type="search"
            fullWidth
            onChange={handleSearch}
            placeholder={t('Users') ?? 'Search users'}
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
              maxWidth: { sm: 220, md: 260 },
              flexGrow: { xs: 1, sm: 0 },
            }}
          />
        </Stack>
      </Stack>

      <UsersListFilters filters={filters} onChange={setFilters} data={userListRows} />

      {['all', 'online', 'busy', 'away', 'offline'].map((item) => (
        <TabPanel
          key={item}
          value={item}
          sx={{
            p: 0,
          }}
        >
          <UsersListTable
            data={filteredData}
            filterModel={filterModel}
            onFilterModelChange={setFilterMode}
            apiRef={apiRef}
            filterButtonEl={filterButtonEl}
          />
        </TabPanel>
      ))}
    </TabContext>
  );
};

export default UsersListContainer;

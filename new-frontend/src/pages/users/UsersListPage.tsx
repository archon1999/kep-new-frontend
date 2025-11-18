import { useMemo, useState } from 'react';
import {
  Box,
  Card,
  CardContent,
  Divider,
  Stack,
  Typography,
  alpha,
} from '@mui/material';
import {
  DataGrid,
  GridColDef,
  GridRenderCellParams,
  GridSortModel,
} from '@mui/x-data-grid';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import { useTranslation } from 'react-i18next';
import UserRatingChip from 'modules/users/ui/UserRatingChip';
import UserIdentityCell from 'modules/users/ui/UserIdentityCell';
import UserStreakCell from 'modules/users/ui/UserStreakCell';
import UsersFilters from 'modules/users/ui/UsersFilters';
import { useUserCountries, useUsersList } from 'modules/users/application/queries';
import { UserListItem, UsersListFilters } from 'modules/users/domain/entities/user.entity';
import KepIcon from 'shared/components/base/KepIcon';
import useDebouncedValue from 'shared/hooks/useDebouncedValue';
import { numberFormat } from 'shared/lib/utils';

dayjs.extend(relativeTime);

const DEFAULT_PAGE_SIZE = 25;

type UsersGridColDef = GridColDef<UserListItem> & { sortKey?: string };

const UsersListPage = () => {
  const { t, i18n } = useTranslation();

  const [filters, setFilters] = useState<UsersListFilters>({
    username: '',
    firstName: '',
    country: '',
    ageFrom: undefined,
    ageTo: undefined,
  });

  const [paginationModel, setPaginationModel] = useState({ page: 0, pageSize: DEFAULT_PAGE_SIZE });
  const [sortModel, setSortModel] = useState<GridSortModel>([{ field: 'user', sort: 'desc' }]);

  const debouncedFilters = useDebouncedValue(filters, 800);

  const ordering = useMemo(() => {
    const sortItem = sortModel[0];
    const sortKeyMap: Record<string, string> = {
      user: 'id',
      skillsRating: 'skills_rating',
      activityRating: 'activity_rating',
      contestsRating: 'contests_rating__rating',
      challengesRating: 'challenges_rating__rating',
      streak: 'streak',
      kepcoin: 'kepcoin',
      lastSeen: 'last_seen',
    };

    if (!sortItem) return undefined;

    const sortKey = sortKeyMap[sortItem.field] ?? sortItem.field;

    return `${sortItem.sort === 'desc' ? '-' : ''}${sortKey}`;
  }, [sortModel]);

  const queryParams = useMemo(
    () => ({
      page: paginationModel.page + 1,
      pageSize: paginationModel.pageSize,
      ordering,
      ...debouncedFilters,
    }),
    [debouncedFilters, ordering, paginationModel.page, paginationModel.pageSize],
  );

  const { data, isLoading } = useUsersList(queryParams);
  const { data: countries, isLoading: isLoadingCountries } = useUserCountries(i18n.language);

  const handleSortModelChange = (model: GridSortModel) => {
    setSortModel(model);
  };

  const handlePaginationChange = (model: { page: number; pageSize: number }) => {
    setPaginationModel(model);
  };

  const handleFiltersChange = (nextFilters: UsersListFilters) => {
    setFilters(nextFilters);
    setPaginationModel((current) => ({ ...current, page: 0 }));
  };

  const columns: UsersGridColDef[] = useMemo(
    () => [
      {
        field: 'user',
        headerName: t('users.columns.user'),
        flex: 1.4,
        minWidth: 240,
        sortable: true,
        sortKey: 'id',
        renderCell: ({ row }: GridRenderCellParams<UserListItem>) => <UserIdentityCell user={row} />,
      },
      {
        field: 'skillsRating',
        headerName: t('users.columns.skills'),
        flex: 0.8,
        minWidth: 120,
        sortable: true,
        renderCell: ({ value }) => <UserRatingChip rating={value as UserListItem['skillsRating']} color="primary" />,
      },
      {
        field: 'activityRating',
        headerName: t('users.columns.activity'),
        flex: 0.8,
        minWidth: 120,
        sortable: true,
        renderCell: ({ value }) => <UserRatingChip rating={value as UserListItem['activityRating']} color="info" />,
      },
      {
        field: 'contestsRating',
        headerName: t('users.columns.contests'),
        flex: 0.9,
        minWidth: 140,
        sortable: true,
        renderCell: ({ value }) => <UserRatingChip rating={value as UserListItem['contestsRating']} color="secondary" />,
      },
      {
        field: 'challengesRating',
        headerName: t('users.columns.challenges'),
        flex: 0.9,
        minWidth: 140,
        sortable: true,
        renderCell: ({ value }) => <UserRatingChip rating={value as UserListItem['challengesRating']} color="warning" />,
      },
      {
        field: 'streak',
        headerName: t('users.columns.streak'),
        flex: 1,
        minWidth: 180,
        sortable: true,
        renderCell: ({ row }) => (
          <UserStreakCell
            streak={row.streak}
            maxStreak={row.maxStreak}
            currentLabel={t('users.streak.current')}
            bestLabel={t('users.streak.best')}
          />
        ),
      },
      {
        field: 'kepcoin',
        headerName: t('users.columns.kepcoin'),
        flex: 0.8,
        minWidth: 120,
        sortable: true,
        renderCell: ({ value }) => (
          <Stack direction="row" spacing={0.75} alignItems="center">
            <KepIcon name="challenge" fontSize={18} />
            <Typography variant="subtitle2" fontWeight={700}>
              {typeof value === 'number' ? numberFormat(value) : '—'}
            </Typography>
          </Stack>
        ),
      },
      {
        field: 'lastSeen',
        headerName: t('users.columns.lastSeen'),
        flex: 0.9,
        minWidth: 160,
        sortable: true,
        renderCell: ({ value }) => (
          <Typography variant="body2" color="text.secondary">
            {value ? dayjs(value as string).fromNow() : '—'}
          </Typography>
        ),
      },
    ],
    [t],
  );

  return (
    <Box sx={{ p: { xs: 3, md: 5 } }}>
      <Stack spacing={3}>
        <Stack spacing={1}>
          <Typography variant="h4" fontWeight={700}>
            {t('users.title')}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {t('users.subtitle')}
          </Typography>
        </Stack>

        <Card variant="outlined" sx={{ borderColor: (theme) => alpha(theme.palette.primary.main, 0.2) }}>
          <CardContent>
            <UsersFilters
              filters={filters}
              countries={countries ?? []}
              isLoadingCountries={isLoadingCountries}
              onChange={handleFiltersChange}
            />
          </CardContent>

          <Divider />

          <Box sx={{ height: 720 }}>
            <DataGrid
              disableRowSelectionOnClick
              columns={columns}
              rows={data?.data ?? []}
              getRowId={(row) => row.id ?? row.username}
              getRowHeight={() => 110}
              paginationMode="server"
              sortingMode="server"
              rowCount={data?.total ?? 0}
              loading={isLoading}
              pageSizeOptions={[10, 25, 50]}
              paginationModel={paginationModel}
              onPaginationModelChange={handlePaginationChange}
              sortModel={sortModel}
              onSortModelChange={handleSortModelChange}
              sx={{
                border: 'none',
                ['& .MuiDataGrid-columnHeaders']: {
                  bgcolor: 'background.elevation1',
                },
              }}
            />
          </Box>
        </Card>
      </Stack>
    </Box>
  );
};

export default UsersListPage;

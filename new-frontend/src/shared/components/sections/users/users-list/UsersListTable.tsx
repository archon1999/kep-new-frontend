import { RefObject, useMemo } from 'react';
import { Avatar, Box, Chip, ChipOwnProps, IconButton, Stack, Typography } from '@mui/material';
import {
  DataGrid,
  GRID_CHECKBOX_SELECTION_COL_DEF,
  GridColDef,
  GridFilterModel,
} from '@mui/x-data-grid';
import { GridApiCommunity } from '@mui/x-data-grid/internals';
import dayjs from 'dayjs';
import { useTranslation } from 'react-i18next';
import DataGridPagination from 'shared/components/pagination/DataGridPagination';
import KepIcon from 'shared/components/base/KepIcon';
import { UserListRow } from 'app/types/users';

interface UsersListTableProps {
  apiRef: RefObject<GridApiCommunity | null>;
  data: UserListRow[];
  filterButtonEl: HTMLButtonElement | null;
  filterModel: GridFilterModel;
  onFilterModelChange: (model: GridFilterModel) => void;
}

const getStatusColor = (status: UserListRow['status']): ChipOwnProps['color'] => {
  switch (status) {
    case 'online':
      return 'success';
    case 'busy':
      return 'warning';
    default:
      return 'neutral';
  }
};

const defaultPageSize = 8;

const UsersListTable = ({
  apiRef,
  data,
  filterButtonEl,
  filterModel,
  onFilterModelChange,
}: UsersListTableProps) => {
  const { t } = useTranslation();

  const columns: GridColDef<UserListRow>[] = useMemo(
    () => [
      {
        ...GRID_CHECKBOX_SELECTION_COL_DEF,
        width: 64,
      },
      {
        field: 'username',
        headerName: t('users.list.columns.user'),
        minWidth: 260,
        filterable: true,
        flex: 1,
        valueGetter: ({ row }) => `${row.username} ${row.fullName}`,
        renderCell: ({ row }) => (
          <Stack direction="row" spacing={1.5} alignItems="center">
            <Box
              sx={{
                position: 'relative',
              }}
            >
              <Avatar src={row.avatar} alt={row.username} />
              <Box
                sx={{
                  width: 10,
                  height: 10,
                  borderRadius: '50%',
                  position: 'absolute',
                  right: -1,
                  bottom: -1,
                  border: '2px solid',
                  borderColor: 'background.paper',
                  bgcolor: (theme) => theme.palette[getStatusColor(row.status)]?.main,
                }}
              />
            </Box>
            <Stack spacing={0.25}>
              <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                {row.username}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {row.fullName}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                {row.email}
              </Typography>
            </Stack>
            <Chip
              label={row.country}
              variant="soft"
              size="small"
              color="neutral"
              sx={{ ml: 'auto' }}
            />
          </Stack>
        ),
      },
      {
        field: 'status',
        headerName: t('users.list.columns.status'),
        minWidth: 140,
        sortable: true,
        filterable: true,
        renderCell: ({ row }) => (
          <Chip
            label={t(`users.list.status.${row.status}`)}
            variant="soft"
            color={getStatusColor(row.status)}
            sx={{ textTransform: 'capitalize' }}
          />
        ),
      },
      {
        field: 'age',
        headerName: t('users.list.columns.age'),
        minWidth: 100,
        type: 'number',
        align: 'center',
        headerAlign: 'center',
      },
      {
        field: 'skillsRating',
        headerName: t('users.list.columns.skills'),
        minWidth: 140,
        type: 'number',
        valueGetter: ({ row }) => row.skillsRating.value,
        renderCell: ({ row }) => (
          <Stack spacing={0.25}>
            <Chip
              label={row.skillsRating.value}
              size="small"
              color="primary"
              variant="soft"
              sx={{ fontWeight: 600, minWidth: 64 }}
            />
            {row.skillsRating.title && (
              <Typography variant="caption" color="text.secondary">
                {row.skillsRating.title}
              </Typography>
            )}
          </Stack>
        ),
      },
      {
        field: 'activityRating',
        headerName: t('users.list.columns.activity'),
        minWidth: 140,
        type: 'number',
        valueGetter: ({ row }) => row.activityRating.value,
        renderCell: ({ row }) => (
          <Chip
            label={row.activityRating.value}
            size="small"
            color="info"
            variant="soft"
            sx={{ fontWeight: 600, minWidth: 64 }}
          />
        ),
      },
      {
        field: 'contestsRating',
        headerName: t('users.list.columns.contests'),
        minWidth: 150,
        type: 'number',
        flex: 1,
        valueGetter: ({ row }) => row.contestsRating.value,
        renderCell: ({ row }) => (
          <Stack spacing={0.25}>
            <Chip
              label={row.contestsRating.value}
              size="small"
              color="secondary"
              variant="soft"
              sx={{ fontWeight: 600, minWidth: 64 }}
            />
            {row.contestsRating.title && (
              <Typography variant="caption" color="text.secondary">
                {row.contestsRating.title}
              </Typography>
            )}
          </Stack>
        ),
      },
      {
        field: 'challengesRating',
        headerName: t('users.list.columns.challenges'),
        minWidth: 150,
        type: 'number',
        valueGetter: ({ row }) => row.challengesRating.value,
        renderCell: ({ row }) => (
          <Stack spacing={0.25}>
            <Chip
              label={row.challengesRating.value}
              size="small"
              color="warning"
              variant="soft"
              sx={{ fontWeight: 600, minWidth: 64 }}
            />
            {row.challengesRating.title && (
              <Typography variant="caption" color="text.secondary">
                {row.challengesRating.title}
              </Typography>
            )}
          </Stack>
        ),
      },
      {
        field: 'streak',
        headerName: t('users.list.columns.streak'),
        minWidth: 150,
        sortable: false,
        filterable: false,
        renderCell: ({ row }) => (
          <Stack spacing={0.5}>
            <Chip
              label={t('users.list.streak.current', { value: row.streak.current })}
              size="small"
              color="primary"
              variant="soft"
              sx={{ fontWeight: 600 }}
            />
            <Chip
              label={t('users.list.streak.best', { value: row.streak.max })}
              size="small"
              color="neutral"
              variant="soft"
              sx={{ fontWeight: 600 }}
            />
          </Stack>
        ),
      },
      {
        field: 'kepcoin',
        headerName: t('users.list.columns.kepcoin'),
        minWidth: 120,
        type: 'number',
        align: 'right',
        headerAlign: 'right',
        valueFormatter: ({ value }) => value.toLocaleString('en-US'),
        renderCell: ({ row }) => (
          <Typography variant="body2" sx={{ fontWeight: 600 }}>
            {row.kepcoin.toLocaleString('en-US')} KEP
          </Typography>
        ),
      },
      {
        field: 'lastSeen',
        headerName: t('users.list.columns.lastSeen'),
        minWidth: 170,
        valueGetter: ({ row }) => row.lastSeen,
        renderCell: ({ row }) => (
          <Stack spacing={0.25}>
            <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
              {dayjs(row.lastSeen).format('MMM DD, YYYY')}
            </Typography>
            <Typography variant="caption" color="text.secondary">
              {dayjs(row.lastSeen).format('HH:mm')}
            </Typography>
          </Stack>
        ),
      },
      {
        field: 'actions',
        headerName: '',
        sortable: false,
        filterable: false,
        align: 'right',
        headerAlign: 'right',
        width: 60,
        renderCell: () => (
          <IconButton color="neutral" size="small">
            <KepIcon icon="material-symbols:more-vert-rounded" />
          </IconButton>
        ),
      },
      {
        field: 'fullName',
        headerName: t('users.list.columns.name'),
        hide: true,
        filterable: true,
        valueGetter: ({ row }) => row.fullName,
      },
      {
        field: 'country',
        headerName: t('users.list.columns.country'),
        hide: true,
        filterable: true,
      },
    ],
    [t],
  );

  return (
    <Box sx={{ width: '100%' }}>
      <DataGrid
        rowHeight={80}
        rows={data}
        apiRef={apiRef}
        columns={columns}
        pageSizeOptions={[defaultPageSize]}
        filterModel={filterModel}
        onFilterModelChange={onFilterModelChange}
        initialState={{
          pagination: {
            paginationModel: {
              pageSize: defaultPageSize,
            },
          },
        }}
        checkboxSelection
        sx={{
          '& .MuiDataGrid-columnHeaders': {
            minWidth: '100%',
          },
        }}
        slots={{
          basePagination: (props) => <DataGridPagination showFullPagination {...props} />,
        }}
        slotProps={{
          panel: {
            target: filterButtonEl,
          },
        }}
      />
    </Box>
  );
};

export default UsersListTable;

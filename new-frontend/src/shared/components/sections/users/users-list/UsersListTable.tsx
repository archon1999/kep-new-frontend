import { RefObject, useMemo } from 'react';
import {
  Avatar,
  Box,
  Chip,
  ChipOwnProps,
  IconButton,
  Link,
  Stack,
  Typography,
} from '@mui/material';
import {
  DataGrid,
  GRID_CHECKBOX_SELECTION_COL_DEF,
  GridColDef,
  GridFilterModel,
} from '@mui/x-data-grid';
import { GridApiCommunity } from '@mui/x-data-grid/internals';
import { useTranslation } from 'react-i18next';
import KepIcon from 'shared/components/base/KepIcon';
import IconifyIcon from 'shared/components/base/IconifyIcon';
import DataGridPagination from 'shared/components/pagination/DataGridPagination';
import { UserListItem, UserStatus } from 'app/types/users';

interface UsersListTableProps {
  apiRef: RefObject<GridApiCommunity | null>;
  data: UserListItem[];
  filterButtonEl: HTMLButtonElement | null;
  filterModel?: GridFilterModel;
  onFilterModelChange?: (model: GridFilterModel) => void;
}

const defaultPageSize = 8;

const getStatusColor = (status: UserStatus): ChipOwnProps['color'] => {
  switch (status) {
    case 'online':
      return 'success';
    case 'busy':
      return 'warning';
    case 'away':
      return 'info';
    default:
      return 'default';
  }
};

const UsersListTable = ({ apiRef, data, filterButtonEl, filterModel, onFilterModelChange }: UsersListTableProps) => {
  const { t } = useTranslation();

  const columns: GridColDef<UserListItem>[] = useMemo(
    () => [
      {
        ...GRID_CHECKBOX_SELECTION_COL_DEF,
        width: 64,
      },
      {
        field: 'username',
        headerName: t('Username'),
        minWidth: 260,
        flex: 1.3,
        filterable: true,
        renderCell: ({ row }) => (
          <Stack direction="row" spacing={1.5} alignItems="center">
            <Avatar alt={row.fullName} src={row.avatar} sx={{ width: 40, height: 40 }} />
            <Stack spacing={0.5}>
              <Stack direction="row" spacing={0.75} alignItems="center">
                <Typography variant="subtitle2" fontWeight={600} color="text.primary">
                  {row.username}
                </Typography>
                <IconifyIcon
                  icon={`flag:${row.country}-4x3`}
                  width={20}
                  height={14}
                  sx={{ borderRadius: 0.5, boxShadow: (theme) => theme.shadows[3] }}
                />
              </Stack>
              <Typography variant="body2" color="text.secondary">
                {row.fullName}
              </Typography>
              <Link color="text.secondary" underline="hover" fontSize={12} href={`mailto:${row.email}`}>
                {row.email}
              </Link>
            </Stack>
          </Stack>
        ),
      },
      {
        field: 'skillsRating',
        headerName: t('Skills'),
        minWidth: 140,
        headerAlign: 'center',
        align: 'center',
        valueGetter: ({ row }) => row.skillsRating.value,
        renderCell: ({ row }) => (
          <Chip label={row.skillsRating.value} color="primary" size="small" variant="soft" />
        ),
      },
      {
        field: 'activityRating',
        headerName: t('Activity'),
        minWidth: 140,
        headerAlign: 'center',
        align: 'center',
        valueGetter: ({ row }) => row.activityRating.value,
        renderCell: ({ row }) => (
          <Chip label={row.activityRating.value} color="info" size="small" variant="soft" />
        ),
      },
      {
        field: 'contestsRating',
        headerName: t('Contests'),
        minWidth: 160,
        flex: 0.9,
        headerAlign: 'center',
        align: 'center',
        valueGetter: ({ row }) => row.contestsRating.value,
        renderCell: ({ row }) => (
          <Stack direction="row" spacing={1} alignItems="center" justifyContent="center">
            <KepIcon name="contests" fontSize={18} />
            <Typography variant="body2" color="text.primary" fontWeight={600}>
              {row.contestsRating.value}
            </Typography>
            <Typography variant="caption" color="text.secondary">
              {row.contestsRating.title}
            </Typography>
          </Stack>
        ),
      },
      {
        field: 'challengesRating',
        headerName: t('Challenges'),
        minWidth: 160,
        flex: 0.9,
        headerAlign: 'center',
        align: 'center',
        valueGetter: ({ row }) => row.challengesRating.value,
        renderCell: ({ row }) => (
          <Stack direction="row" spacing={1} alignItems="center" justifyContent="center">
            <KepIcon name="challenges" fontSize={18} />
            <Typography variant="body2" color="text.primary" fontWeight={600}>
              {row.challengesRating.value}
            </Typography>
            <Typography variant="caption" color="text.secondary">
              {row.challengesRating.title}
            </Typography>
          </Stack>
        ),
      },
      {
        field: 'streak',
        headerName: t('Streak') ?? 'Streak',
        minWidth: 150,
        headerAlign: 'center',
        align: 'center',
        sortable: false,
        renderCell: ({ row }) => (
          <Stack spacing={0.5} alignItems="center" width={1}>
            <Chip
              label={`${row.streak.current} ${t('StreakFreeze') ? '🔥' : ''}`}
              size="small"
              variant="soft"
              color="warning"
              sx={{ minWidth: 96 }}
            />
            <Typography variant="caption" color="text.secondary">
              {t('Reset')}: {row.streak.max}
            </Typography>
          </Stack>
        ),
      },
      {
        field: 'kepcoin',
        headerName: t('Kepcoin'),
        minWidth: 120,
        headerAlign: 'right',
        align: 'right',
        valueGetter: ({ row }) => row.kepcoin,
        renderCell: ({ row }) => (
          <Stack direction="row" spacing={1} alignItems="center" justifyContent="flex-end" width={1}>
            <KepIcon name="challenge" fontSize={18} />
            <Typography variant="subtitle2" fontWeight={600} color="text.primary">
              {row.kepcoin.toLocaleString()}
            </Typography>
          </Stack>
        ),
      },
      {
        field: 'status',
        headerName: t('Status'),
        minWidth: 140,
        flex: 0.8,
        headerAlign: 'center',
        align: 'center',
        renderCell: ({ row }) => (
          <Chip
            label={row.status}
            variant="soft"
            color={getStatusColor(row.status)}
            sx={{ textTransform: 'capitalize' }}
          />
        ),
      },
      {
        field: 'lastSeen',
        headerName: t('LastSeen'),
        minWidth: 140,
        flex: 0.9,
        valueGetter: ({ row }) => row.lastSeen,
        renderCell: ({ row }) => (
          <Typography variant="body2" color="text.secondary">
            {row.lastSeen}
          </Typography>
        ),
      },
      {
        field: 'action',
        headerName: '',
        filterable: false,
        sortable: false,
        align: 'right',
        width: 60,
        headerAlign: 'right',
        renderCell: () => (
          <IconButton size="small" color="inherit">
            <KepIcon name="more" fontSize={20} />
          </IconButton>
        ),
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
          '& .margin': {
            pr: 3,
          },
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

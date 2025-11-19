import {
  DataGrid,
  GridColDef,
  GridPaginationModel,
  GridSortModel,
  GridValidRowModel,
} from '@mui/x-data-grid';
import { Avatar, Box, Chip, Stack, Typography } from '@mui/material';
import { UsersListItem } from 'modules/users/domain/entities/user.entity';
import kepcoinImg from 'shared/assets/images/icons/kepcoin.png';
import { formatCountryFlag } from 'shared/utils/formatCountryFlag';

export interface UsersDataGridLabels {
  user: string;
  skills: string;
  activity: string;
  contests: string;
  challenges: string;
  streak: string;
  kepcoin: string;
  lastSeen: string;
  emptyValue: string;
}

interface UsersDataGridProps {
  rows: UsersListItem[];
  rowCount: number;
  loading?: boolean;
  paginationModel: GridPaginationModel;
  onPaginationModelChange: (model: GridPaginationModel) => void;
  sortModel: GridSortModel;
  onSortModelChange: (model: GridSortModel) => void;
  columnLabels: UsersDataGridLabels;
  countryLabels?: Record<string, string>;
}

const UsersDataGrid = ({
  rows,
  rowCount,
  loading,
  paginationModel,
  onPaginationModelChange,
  sortModel,
  onSortModelChange,
  columnLabels,
  countryLabels,
}: UsersDataGridProps) => {
  const columns: GridColDef<GridValidRowModel>[] = [
    {
      field: 'username',
      headerName: columnLabels.user,
      flex: 1.4,
      minWidth: 260,
      sortable: true,
      renderCell: ({ row }) => {
        const user = row as UsersListItem;
        const name = [user.firstName, user.lastName].filter(Boolean).join(' ');
        const countryCode = user.country?.toUpperCase();

        return (
          <Stack direction="row" spacing={2} alignItems="center" sx={{ minWidth: 0 }}>
            <Avatar src={user.avatar} alt={user.username} sx={{ width: 42, height: 42 }} />
            <Stack spacing={0.25} minWidth={0}>
              <Stack direction="row" spacing={1} alignItems="center" minWidth={0}>
                <Typography variant="subtitle2" noWrap>
                  {user.username}
                </Typography>
                {countryCode && (
                  <Stack direction="row" spacing={0.5} alignItems="center" flexShrink={0}>
                    <Typography component="span" sx={{ fontSize: 18, lineHeight: 1 }}>
                      {formatCountryFlag(countryCode)}
                    </Typography>
                    <Typography variant="caption" color="text.secondary" noWrap>
                      {countryLabels?.[countryCode] ?? countryCode}
                    </Typography>
                  </Stack>
                )}
              </Stack>
              {name && (
                <Typography variant="body2" color="text.secondary" noWrap>
                  {name}
                </Typography>
              )}
            </Stack>
          </Stack>
        );
      },
    },
    {
      field: 'skillsRating',
      headerName: columnLabels.skills,
      minWidth: 120,
      align: 'center',
      headerAlign: 'center',
      sortable: true,
      renderCell: ({ row }) => {
        const user = row as UsersListItem;

        return (
          <Chip
            size="small"
            label={user.skillsRating?.value ?? columnLabels.emptyValue}
            variant="soft"
            color="primary"
          />
        );
      },
    },
    {
      field: 'activityRating',
      headerName: columnLabels.activity,
      minWidth: 120,
      align: 'center',
      headerAlign: 'center',
      sortable: true,
      renderCell: ({ row }) => {
        const user = row as UsersListItem;

        return (
          <Chip
            size="small"
            label={user.activityRating?.value ?? columnLabels.emptyValue}
            variant="soft"
            color="info"
          />
        );
      },
    },
    {
      field: 'contestsRating',
      headerName: columnLabels.contests,
      minWidth: 160,
      flex: 0.9,
      align: 'center',
      headerAlign: 'center',
      sortable: true,
      renderCell: ({ row }) => {
        const user = row as UsersListItem;

        return (
          <Stack direction="row" alignItems="center" justifyContent="center" spacing={1} width="100%">
            {user.contestsRating?.title && (
              <Chip
                size="small"
                label={user.contestsRating?.title}
                variant="soft"
                color="secondary"
                sx={{ textTransform: 'capitalize' }}
              />
            )}
            <Typography variant="body2" fontWeight={600} noWrap>
              {user.contestsRating?.value ?? columnLabels.emptyValue}
            </Typography>
          </Stack>
        );
      },
    },
    {
      field: 'challengesRating',
      headerName: columnLabels.challenges,
      minWidth: 150,
      align: 'center',
      headerAlign: 'center',
      sortable: true,
      renderCell: ({ row }) => {
        const user = row as UsersListItem;

        return (
          <Stack direction="row" spacing={1} alignItems="center" justifyContent="center" width="100%">
            {user.challengesRating?.title && (
              <Chip
                size="small"
                label={user.challengesRating?.title}
                variant="soft"
                color="warning"
                sx={{ textTransform: 'capitalize' }}
              />
            )}
            <Typography variant="body2" fontWeight={600} noWrap>
              {user.challengesRating?.value ?? columnLabels.emptyValue}
            </Typography>
          </Stack>
        );
      },
    },
    {
      field: 'streak',
      headerName: columnLabels.streak,
      minWidth: 130,
      align: 'center',
      headerAlign: 'center',
      sortable: true,
      renderCell: ({ row }) => {
        const user = row as UsersListItem;

        return (
          <Stack spacing={0.5} alignItems="center" width="100%">
            <Typography variant="body2" fontWeight={600}>
              {user.streak ?? columnLabels.emptyValue}
            </Typography>
            <Typography variant="caption" color="text.secondary" noWrap>
              max {user.maxStreak ?? columnLabels.emptyValue}
            </Typography>
          </Stack>
        );
      },
    },
    {
      field: 'kepcoin',
      headerName: columnLabels.kepcoin,
      minWidth: 120,
      align: 'right',
      headerAlign: 'right',
      sortable: true,
      renderCell: ({ row }) => {
        const user = row as UsersListItem;

        return (
          <Stack direction="row" alignItems="center" justifyContent="flex-end" spacing={0.75} width="100%">
            <Box component="img" src={kepcoinImg} alt="Kepcoin" sx={{ width: 20, height: 20 }} />
            <Typography variant="body2" fontWeight={600}>
              {user.kepcoin ?? 0}
            </Typography>
          </Stack>
        );
      },
    },
    {
      field: 'lastSeen',
      headerName: columnLabels.lastSeen,
      minWidth: 160,
      align: 'right',
      headerAlign: 'right',
      sortable: true,
      renderCell: ({ row }) => {
        const user = row as UsersListItem;
        return (
          <Chip color="neutral" label={user.lastSeen}></Chip>
        );
      },
    },
  ];

  return (
    <DataGrid
      rowHeight={72}
      rows={rows}
      rowCount={rowCount}
      loading={loading}
      paginationModel={paginationModel}
      onPaginationModelChange={onPaginationModelChange}
      pageSizeOptions={[10, 25, 50]}
      paginationMode="server"
      sortModel={sortModel}
      onSortModelChange={onSortModelChange}
      sortingMode="server"
      columns={columns}
      disableRowSelectionOnClick
      getRowId={(row) => (row as UsersListItem).id ?? (row as UsersListItem).username}
      sx={{
        '& .MuiDataGrid-cell:focus, & .MuiDataGrid-columnHeader:focus': {
          outline: 'none',
        },
      }}
    />
  );
};

export default UsersDataGrid;

import {
  DataGrid,
  GridColDef,
  GridPaginationModel,
  GridSortModel,
  GridValidRowModel,
} from '@mui/x-data-grid';
import { Avatar, Chip, Stack, Typography } from '@mui/material';
import { UsersListItem } from 'modules/users/domain/entities/user.entity';
import ContestsRatingChip from 'shared/components/rating/ContestsRatingChip';
import ChallengesRatingChip from 'shared/components/rating/ChallengesRatingChip';
import Streak from 'shared/components/rating/Streak';
import KepcoinValue from 'shared/components/common/KepcoinValue';

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

const formatCountryFlag = (code?: string) => {
  if (!code) return '';
  const upperCased = code.toUpperCase();

  if (upperCased.length !== 2) return upperCased;

  return String.fromCodePoint(
    ...upperCased.split('').map((char) => 127397 + char.charCodeAt(0)),
  );
};

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
            <Stack direction="column" spacing={0.25} minWidth={0}>
              <Stack direction="row" spacing={1} alignItems="center" minWidth={0}>
                <Typography color="primary" fontWeight={600} variant="subtitle2" noWrap>
                  {user.username}
                </Typography>
                {countryCode && (
                  <Typography variant="caption" color="text.secondary" noWrap>
                    {formatCountryFlag(countryCode)} {countryLabels?.[countryCode] ?? countryCode}
                  </Typography>
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
            <ContestsRatingChip title={user.contestsRating?.title} imgSize={28} />
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
            <ChallengesRatingChip title={user.challengesRating?.title} />
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
            <Streak streak={user.streak} maxStreak={user.maxStreak} fallback={columnLabels.emptyValue} />
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
          <KepcoinValue
            value={user.kepcoin ?? 0}
            iconSize={20}
            justifyContent="flex-end"
            width="100%"
            fontWeight={600}
          />
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
      autoHeight
      rowHeight={72}
      rows={rows}
      rowCount={rowCount}
      loading={loading}
      paginationModel={paginationModel}
      onPaginationModelChange={onPaginationModelChange}
      pageSizeOptions={[10, 20, 50]}
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
        mb: 2,
      }}
    />
  );
};

export default UsersDataGrid;

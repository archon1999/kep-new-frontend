import { useMemo } from 'react';
import { Avatar, Chip, ChipOwnProps, Stack, Typography } from '@mui/material';
import {
  DataGrid,
  GridColDef,
  GridPaginationModel,
  GridSortModel,
} from '@mui/x-data-grid';
import dayjs from 'dayjs';
import { useTranslation } from 'react-i18next';
import KepIcon from 'shared/components/base/KepIcon';
import DataGridPagination from 'shared/components/pagination/DataGridPagination';
import { UserList } from 'shared/api/orval/generated/endpoints/index.schemas';

export type RatingValue = string | number | { value?: string | number; title?: string };

export type UserTableRow = UserList & {
  id: number | string;
  country?: string;
  maxStreak?: number;
  contestsRating?: RatingValue;
  challengesRating?: RatingValue;
};

interface UsersListTableProps {
  rows: UserTableRow[];
  paginationModel: GridPaginationModel;
  rowCount: number;
  loading?: boolean;
  sortModel: GridSortModel;
  onPaginationChange: (model: GridPaginationModel) => void;
  onSortModelChange: (model: GridSortModel) => void;
}

const getRatingValue = (rating?: RatingValue) => {
  if (!rating && rating !== 0) return '-';

  if (typeof rating === 'object') {
    if (rating.value !== undefined && rating.value !== null) return rating.value;
    if (rating.title) return rating.title;
  }

  return rating;
};

const getCountryFlag = (code?: string) => {
  if (!code) return '';

  const upper = code.toUpperCase();
  return [...upper].map((char) => String.fromCodePoint(127397 + char.charCodeAt(0))).join('');
};

const ratingColorMap: Record<string, ChipOwnProps['color']> = {
  skills_rating: 'primary',
  activity_rating: 'info',
  contests_rating: 'warning',
  challenges_rating: 'success',
};

const UsersListTable = ({
  rows,
  paginationModel,
  rowCount,
  loading,
  sortModel,
  onPaginationChange,
  onSortModelChange,
}: UsersListTableProps) => {
  const { t, i18n } = useTranslation();

  const columns: GridColDef<UserTableRow>[] = useMemo(
    () => [
      {
        field: 'username',
        headerName: t('users.table.user'),
        minWidth: 260,
        flex: 1.2,
        renderCell: ({ row }) => {
          const fullName = [row.firstName, row.lastName].filter(Boolean).join(' ');
          const countryFlag = getCountryFlag(row.country);

          return (
            <Stack direction="row" alignItems="center" spacing={1.5} sx={{ minWidth: 0 }}>
              <Avatar src={row.avatar} alt={row.username} sx={{ width: 40, height: 40 }} />
              <Stack spacing={0.25} sx={{ minWidth: 0 }}>
                <Stack direction="row" spacing={0.75} alignItems="center" sx={{ minWidth: 0 }}>
                  <Typography variant="subtitle2" fontWeight={700} noWrap>
                    {row.username}
                  </Typography>
                  {countryFlag && (
                    <Typography variant="body2" color="text.secondary">
                      {countryFlag}
                    </Typography>
                  )}
                </Stack>
                <Typography variant="body2" color="text.secondary" noWrap>
                  {fullName || t('users.table.noName')}
                </Typography>
              </Stack>
            </Stack>
          );
        },
        sortable: true,
      },
      {
        field: 'skills_rating',
        headerName: t('users.table.skills'),
        minWidth: 120,
        align: 'center',
        sortable: true,
        renderCell: ({ row }) => (
          <Chip
            variant="soft"
            color={ratingColorMap.skills_rating}
            label={getRatingValue(row.skillsRating)}
            size="small"
          />
        ),
      },
      {
        field: 'activity_rating',
        headerName: t('users.table.activity'),
        minWidth: 120,
        align: 'center',
        sortable: true,
        renderCell: ({ row }) => (
          <Chip
            variant="soft"
            color={ratingColorMap.activity_rating}
            label={getRatingValue(row.activityRating)}
            size="small"
          />
        ),
      },
      {
        field: 'contests_rating__rating',
        headerName: t('users.table.contests'),
        minWidth: 120,
        align: 'center',
        sortable: true,
        renderCell: ({ row }) => (
          <Chip
            variant="soft"
            color={ratingColorMap.contests_rating}
            label={getRatingValue(row.contestsRating)}
            icon={<KepIcon name="contest" width={18} height={18} />}
            size="small"
          />
        ),
      },
      {
        field: 'challenges_rating__rating',
        headerName: t('users.table.challenges'),
        minWidth: 140,
        align: 'center',
        sortable: true,
        renderCell: ({ row }) => (
          <Chip
            variant="soft"
            color={ratingColorMap.challenges_rating}
            label={getRatingValue(row.challengesRating)}
            icon={<KepIcon name="challenges" width={18} height={18} />}
            size="small"
          />
        ),
      },
      {
        field: 'streak',
        headerName: t('users.table.streak'),
        minWidth: 140,
        align: 'center',
        sortable: true,
        valueGetter: ({ row }) => row.streak ?? 0,
        renderCell: ({ row }) => (
          <Stack spacing={0.25} alignItems="center" sx={{ width: '100%' }}>
            <Stack direction="row" spacing={0.5} alignItems="center">
              <KepIcon name="streak" width={18} height={18} />
              <Typography variant="body2" fontWeight={600}>
                {row.streak ?? '—'}
              </Typography>
            </Stack>
            {row.maxStreak !== undefined && (
              <Typography variant="caption" color="text.secondary">
                {t('users.table.maxStreak', { value: row.maxStreak })}
              </Typography>
            )}
          </Stack>
        ),
      },
      {
        field: 'kepcoin',
        headerName: t('users.table.kepcoin'),
        minWidth: 110,
        sortable: true,
        align: 'right',
        headerAlign: 'right',
        valueGetter: ({ row }) => row.kepcoin ?? 0,
        renderCell: ({ row }) => (
          <Typography variant="body2" fontWeight={600} sx={{ width: '100%', textAlign: 'right' }}>
            {row.kepcoin ?? '—'}
          </Typography>
        ),
      },
      {
        field: 'last_seen',
        headerName: t('users.table.lastSeen'),
        minWidth: 160,
        sortable: true,
        valueGetter: ({ row }) => row.lastSeen,
        renderCell: ({ row }) => (
          <Typography variant="body2" color="text.secondary">
            {row.lastSeen ? dayjs(row.lastSeen).locale(i18n.language).format('MMM D, YYYY HH:mm') : '—'}
          </Typography>
        ),
      },
    ],
    [i18n.language, t],
  );

  return (
    <DataGrid
      rowHeight={72}
      rows={rows}
      rowCount={rowCount}
      loading={loading}
      columns={columns}
      sortingMode="server"
      paginationMode="server"
      disableRowSelectionOnClick
      paginationModel={paginationModel}
      onPaginationModelChange={onPaginationChange}
      sortModel={sortModel}
      onSortModelChange={onSortModelChange}
      disableColumnMenu
      initialState={{
        pagination: {
          paginationModel,
        },
      }}
      pageSizeOptions={[10, 25, 50]}
      sx={{
        '& .MuiDataGrid-columnHeaders': {
          minWidth: '100%',
        },
      }}
      slots={{
        basePagination: (props) => <DataGridPagination showFullPagination {...props} />,
      }}
    />
  );
};

export default UsersListTable;

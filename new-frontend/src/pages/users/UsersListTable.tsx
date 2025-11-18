import { useMemo } from 'react';
import { Avatar, Box, Chip, Stack, Typography } from '@mui/material';
import {
  DataGrid,
  GridColDef,
  GridPaginationModel,
  GridSortModel,
} from '@mui/x-data-grid';
import dayjs from 'dayjs';
import { useTranslation } from 'react-i18next';
import { RatingValue, UsersListRow } from './types';

interface UsersListTableProps {
  rows: UsersListRow[];
  rowCount?: number;
  loading?: boolean;
  paginationModel: GridPaginationModel;
  onPaginationModelChange: (model: GridPaginationModel) => void;
  sortModel: GridSortModel;
  onSortModelChange: (model: GridSortModel) => void;
  getCountryName: (code?: string) => string | undefined;
}

const getRatingValue = (rating: RatingValue) => {
  if (rating == null) return undefined;
  if (typeof rating === 'number') return rating;
  if (typeof rating === 'string') return rating;
  if ('value' in rating && rating.value != null) return rating.value;
  if ('rating' in rating && rating.rating != null) return rating.rating;

  return undefined;
};

const getRatingTitle = (rating: RatingValue) => {
  if (rating == null || typeof rating !== 'object') return undefined;
  if ('title' in rating && rating.title) return rating.title;
  if ('ratingTitle' in rating && rating.ratingTitle) return rating.ratingTitle;
  if ('rankTitle' in rating && rating.rankTitle) return rating.rankTitle;

  return undefined;
};

const formatLastSeen = (value?: string) => {
  if (!value) return '—';

  const parsed = dayjs(value);

  if (!parsed.isValid()) return value;

  return parsed.format('MMM DD, YYYY HH:mm');
};

const UsersListTable = ({
  rows,
  rowCount,
  loading,
  paginationModel,
  onPaginationModelChange,
  sortModel,
  onSortModelChange,
  getCountryName,
}: UsersListTableProps) => {
  const { t } = useTranslation();

  const columns = useMemo<GridColDef<UsersListRow>[]>(
    () => [
      {
        field: 'id',
        headerName: 'ID',
        sortable: true,
        hide: true,
      },
      {
        field: 'username',
        headerName: t('users.columns.user'),
        minWidth: 260,
        flex: 1.3,
        sortable: true,
        renderCell: (params) => {
          const countryName = getCountryName(params.row.country);

          return (
            <Stack direction="row" spacing={1.5} alignItems="center" sx={{ minWidth: 0 }}>
              <Avatar src={params.row.avatar} alt={params.row.username} sx={{ width: 40, height: 40 }} />
              <Stack spacing={0.5} sx={{ minWidth: 0 }}>
                <Stack direction="row" spacing={0.75} alignItems="center" sx={{ minWidth: 0 }}>
                  <Typography variant="subtitle2" noWrap>
                    {params.row.username}
                  </Typography>
                  {params.row.country ? (
                    <Chip
                      label={countryName}
                      size="small"
                      variant="soft"
                      sx={{ textTransform: 'uppercase' }}
                    />
                  ) : null}
                </Stack>
                <Typography variant="caption" color="text.secondary" noWrap>
                  {[params.row.firstName, params.row.lastName].filter(Boolean).join(' ') || '—'}
                </Typography>
              </Stack>
            </Stack>
          );
        },
      },
      {
        field: 'skillsRating',
        headerName: t('users.columns.skills'),
        sortable: true,
        minWidth: 120,
        align: 'center',
        headerAlign: 'center',
        renderCell: (params) => {
          const ratingValue = getRatingValue(params.row.skillsRating);
          const ratingTitle = getRatingTitle(params.row.skillsRating);

          return (
            <Stack spacing={0.25} alignItems="center" sx={{ width: '100%' }}>
              <Chip label={ratingValue ?? '—'} color="primary" variant="soft" size="small" />
              {ratingTitle && (
                <Typography variant="caption" color="text.secondary">
                  {ratingTitle}
                </Typography>
              )}
            </Stack>
          );
        },
      },
      {
        field: 'activityRating',
        headerName: t('users.columns.activity'),
        sortable: true,
        minWidth: 120,
        align: 'center',
        headerAlign: 'center',
        renderCell: (params) => (
          <Chip
            label={getRatingValue(params.row.activityRating) ?? '—'}
            color="info"
            variant="soft"
            size="small"
          />
        ),
      },
      {
        field: 'contestsRating',
        headerName: t('users.columns.contests'),
        sortable: true,
        minWidth: 130,
        align: 'center',
        headerAlign: 'center',
        renderCell: (params) => {
          const ratingValue = getRatingValue(params.row.contestsRating);
          const ratingTitle = getRatingTitle(params.row.contestsRating);

          return (
            <Stack spacing={0.25} alignItems="center" sx={{ width: '100%' }}>
              <Chip label={ratingValue ?? '—'} color="secondary" variant="soft" size="small" />
              {ratingTitle && (
                <Typography variant="caption" color="text.secondary">
                  {ratingTitle}
                </Typography>
              )}
            </Stack>
          );
        },
      },
      {
        field: 'challengesRating',
        headerName: t('users.columns.challenges'),
        sortable: true,
        minWidth: 140,
        align: 'center',
        headerAlign: 'center',
        renderCell: (params) => {
          const ratingValue = getRatingValue(params.row.challengesRating);
          const ratingTitle = getRatingTitle(params.row.challengesRating);

          return (
            <Stack spacing={0.25} alignItems="center" sx={{ width: '100%' }}>
              <Chip label={ratingValue ?? '—'} color="warning" variant="soft" size="small" />
              {ratingTitle && (
                <Typography variant="caption" color="text.secondary">
                  {ratingTitle}
                </Typography>
              )}
            </Stack>
          );
        },
      },
      {
        field: 'streak',
        headerName: t('users.columns.streak'),
        sortable: true,
        minWidth: 140,
        align: 'center',
        headerAlign: 'center',
        renderCell: (params) => (
          <Stack spacing={0.5} alignItems="center" sx={{ width: '100%' }}>
            <Chip label={params.row.streak ?? 0} color="error" variant="soft" size="small" />
            <Typography variant="caption" color="text.secondary">
              {t('users.labels.maxStreak', { count: params.row.maxStreak ?? 0 })}
            </Typography>
          </Stack>
        ),
      },
      {
        field: 'kepcoin',
        headerName: t('users.columns.kepcoin'),
        sortable: true,
        minWidth: 120,
        align: 'right',
        headerAlign: 'right',
        renderCell: (params) => (
          <Typography variant="body2" sx={{ fontWeight: 500, width: '100%', textAlign: 'right' }}>
            {params.row.kepcoin ?? '—'}
          </Typography>
        ),
      },
      {
        field: 'lastSeen',
        headerName: t('users.columns.lastSeen'),
        sortable: true,
        minWidth: 170,
        align: 'center',
        headerAlign: 'center',
        renderCell: (params) => (
          <Typography variant="caption" color="text.secondary">
            {formatLastSeen(params.row.lastSeen)}
          </Typography>
        ),
      },
    ],
    [getCountryName, t],
  );

  return (
    <Box sx={{ width: '100%' }}>
      <DataGrid
        rowHeight={88}
        rows={rows}
        getRowId={(row) => row.id ?? row.username}
        columns={columns}
        pageSizeOptions={[8, 16, 24]}
        paginationModel={paginationModel}
        onPaginationModelChange={onPaginationModelChange}
        paginationMode="server"
        rowCount={rowCount}
        loading={loading}
        sortModel={sortModel}
        onSortModelChange={onSortModelChange}
        sortingMode="server"
        disableRowSelectionOnClick
      />
    </Box>
  );
};

export default UsersListTable;

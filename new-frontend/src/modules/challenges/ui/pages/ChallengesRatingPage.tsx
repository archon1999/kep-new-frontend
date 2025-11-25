import { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Box, Stack, Typography } from '@mui/material';
import {
  DataGrid,
  GridColDef,
  GridPaginationModel,
  GridSortModel,
  GridValidRowModel,
} from '@mui/x-data-grid';
import { resources } from 'app/routes/resources';
import UserPopover from 'modules/users/ui/components/UserPopover.tsx';
import DataGridPaginationAction from 'shared/components/pagination/DataGridPaginationAction.tsx';
import ChallengesRatingChip from 'shared/components/rating/ChallengesRatingChip.tsx';
import PageHeader from 'shared/components/sections/common/PageHeader';
import { responsivePagePaddingSx } from 'shared/lib/styles';
import { useChallengesRating } from '../../application/queries.ts';

const ChallengesRatingPage = () => {
  const { t } = useTranslation();
  const [paginationModel, setPaginationModel] = useState<GridPaginationModel>({
    page: 0,
    pageSize: 12,
  });
  const [sortModel, setSortModel] = useState<GridSortModel>([{ field: 'rating', sort: 'desc' }]);

  const ordering = useMemo(() => {
    if (!sortModel.length) return '-rating';
    const [{ field, sort }] = sortModel;
    const prefix = sort === 'asc' ? '' : '-';
    return `${prefix}${field}`;
  }, [sortModel]);

  const page = paginationModel.page + 1;
  const pageSize = paginationModel.pageSize;

  const { data: ratingPage, isLoading } = useChallengesRating({ page, pageSize, ordering });

  type RatingRow = GridValidRowModel & {
    username: string;
    rating: number;
    rankTitle?: string;
    wins?: number;
    draws?: number;
    losses?: number;
    record?: string;
    all?: number;
  };

  const columns: GridColDef<RatingRow>[] = [
    {
      field: 'rowIndex',
      headerName: t('challenges.table.place'),
      width: 90,
      headerAlign: 'center',
      align: 'center',
      sortable: false,
      renderCell: (params) => {
        return (
          <Typography variant="subtitle1" fontWeight={800}>
            #{params.api.getRowIndexRelativeToVisibleRows(params.id) + 1}
          </Typography>
        );
      },
    },
    {
      field: 'username',
      headerName: t('challenges.table.username'),
      flex: 1.4,
      minWidth: 180,
      sortable: true,
      renderCell: ({ row }) => (
        <UserPopover username={row.username}>
          <Stack direction="row" spacing={0.25}>
            <Typography variant="subtitle1" fontWeight={700} color="text.primary">
              {row.username}
            </Typography>
          </Stack>
        </UserPopover>
      ),
    },
    {
      field: 'rankTitle',
      headerName: t('challenges.table.rank'),
      flex: 0.8,
      minWidth: 140,
      sortable: false,
      renderCell: ({ value }) => (
        <Stack direction="row" alignItems="center" spacing={1.5}>
          <ChallengesRatingChip title={value as string} size="small" />
          <Typography variant="caption" color="text.secondary" sx={{ textTransform: 'capitalize' }}>
            {value as string}
          </Typography>
        </Stack>
      ),
    },
    {
      field: 'rating',
      headerName: t('challenges.table.rating'),
      flex: 0.6,
      minWidth: 120,
      sortable: true,
      renderCell: ({ value, row }) => (
        <Stack direction="row" spacing={0.25}>
          <Typography variant="subtitle1" fontWeight={800} color="text.primary">
            {value ?? '—'}
          </Typography>
          <Typography variant="caption" color="text.secondary" sx={{ textTransform: 'capitalize' }}>
            {row.rankTitle}
          </Typography>
        </Stack>
      ),
    },
    {
      field: 'record',
      headerName: t('challenges.table.record'),
      flex: 1.1,
      minWidth: 180,
      sortable: false,
      renderCell: ({ row }) => (
        <Stack direction="row" spacing={1.25} alignItems="center" flexWrap="wrap" rowGap={1}>
          <Typography color="success">{row?.wins}W</Typography>
          <Typography>{row?.draws}D</Typography>
          <Typography color="error">{row?.losses}L</Typography>
        </Stack>
      ),
    },
  ];

  const rows: RatingRow[] = (ratingPage?.data ?? []).map((row) => ({
    id: row.username,
    ...row,
    record: t('challenges.record', {
      wins: row?.wins ?? 0,
      draws: row?.draws ?? 0,
      losses: row?.losses ?? 0,
    }),
  }));

  return (
    <Stack direction="column">
      <PageHeader
        title={t('challenges.ratingTitle')}
        breadcrumb={[
          { label: t('challenges.title'), url: resources.Challenges },
          { label: t('problems.rating.ordering.rating'), active: true },
        ]}
      />

      <Box sx={responsivePagePaddingSx}>
        <DataGrid
          autoHeight
          rowHeight={80}
          disableRowSelectionOnClick
          columns={columns}
          rows={rows}
          rowCount={ratingPage?.total ?? 0}
          paginationMode="server"
          sortingMode="server"
          paginationModel={paginationModel}
          onPaginationModelChange={setPaginationModel}
          sortModel={sortModel}
          onSortModelChange={(model) =>
            setSortModel(model.length ? model : [{ field: 'rating', sort: 'desc' }])
          }
          loading={isLoading}
          pageSizeOptions={[12, 24, 48]}
          disableColumnFilter
          disableColumnSelector
          disableColumnMenu
          slots={{
            pagination: DataGridPaginationAction,
          }}
        />
      </Box>
    </Stack>
  );
};

export default ChallengesRatingPage;

import { useMemo, useState } from 'react';
import { Box, Card, CardContent, Stack, Typography } from '@mui/material';
import {
  DataGrid,
  GridColDef,
  GridPaginationModel,
  GridSortModel,
  GridValidRowModel,
  GridValueGetterParams,
} from '@mui/x-data-grid';
import { useTranslation } from 'react-i18next';
import { useChallengesRating } from '../../application/queries.ts';
import ChallengesRatingChip from 'shared/components/rating/ChallengesRatingChip.tsx';
import DataGridPaginationAction from 'shared/components/pagination/DataGridPaginationAction.tsx';
import { responsivePagePaddingSx } from 'shared/lib/styles';

const ChallengesRatingPage = () => {
  const { t } = useTranslation();
  const [paginationModel, setPaginationModel] = useState<GridPaginationModel>({
    page: 0,
    pageSize: 12,
  });
  const [sortModel, setSortModel] = useState<GridSortModel>([
    { field: 'rating', sort: 'desc' },
  ]);

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
  };

  const columns: GridColDef<RatingRow>[] = [
    {
      field: 'rowIndex',
      headerName: t('challenges.table.place'),
      width: 90,
      sortable: true,
    },
    {
      field: 'username',
      headerName: t('challenges.table.username'),
      flex: 1.4,
      minWidth: 180,
      sortable: true,
    },
    {
      field: 'rankTitle',
      headerName: t('challenges.table.rank'),
      flex: 0.8,
      minWidth: 140,
      sortable: false,
      renderCell: ({ value }) => <ChallengesRatingChip title={value as string} size="small" />,
    },
    {
      field: 'rating',
      headerName: t('challenges.table.rating'),
      flex: 0.6,
      minWidth: 120,
      sortable: true,
    },
    {
      field: 'record',
      headerName: t('challenges.table.record'),
      flex: 1.1,
      minWidth: 180,
      sortable: false,
      valueGetter: (params: GridValueGetterParams<RatingRow>) =>
        t('challenges.record', {
          wins: params?.row?.wins ?? 0,
          draws: params?.row?.draws ?? 0,
          losses: params?.row?.losses ?? 0,
        }),
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
    <Box sx={responsivePagePaddingSx}>
      <Stack spacing={3} direction="column">
        <Stack spacing={0.5} direction="column">
          <Typography variant="h4" fontWeight={800}>
            {t('challenges.ratingTitle')}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {t('challenges.ratingSubtitle')}
          </Typography>
        </Stack>

        <Card variant="outlined">
          <CardContent>
            <DataGrid
              autoHeight
              disableRowSelectionOnClick
              columns={columns}
              rows={rows}
              rowCount={ratingPage?.total ?? 0}
              paginationMode="server"
              sortingMode="server"
              paginationModel={paginationModel}
              onPaginationModelChange={setPaginationModel}
              sortModel={sortModel}
              onSortModelChange={(model) => setSortModel(model.length ? model : [{ field: 'rating', sort: 'desc' }])}
              loading={isLoading}
              pageSizeOptions={[12, 24, 48]}
              slots={{
                pagination: DataGridPaginationAction,
              }}
            />
          </CardContent>
        </Card>
      </Stack>
    </Box>
  );
};

export default ChallengesRatingPage;

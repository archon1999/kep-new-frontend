import { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useParams } from 'react-router-dom';
import { Stack, Typography } from '@mui/material';
import { DataGrid, GridColDef, GridPaginationModel } from '@mui/x-data-grid';
import { useDocumentTitle } from 'app/providers/DocumentTitleProvider';
import { paginateRows } from 'shared/lib/pagination';
import ContestsRatingChip from 'shared/components/rating/ContestsRatingChip';
import { responsivePagePaddingSx } from 'shared/lib/styles';
import { useContest, useContestContestants } from '../../application/queries';
import { ContestantEntity } from '../../domain/entities/contestant.entity';
import ContestPageHeader from '../components/ContestPageHeader';
import ContestantView from '../components/ContestantView';

const ContestRatingChangesPage = () => {
  const { id } = useParams<{ id: string }>();
  const contestId = id ? Number(id) : undefined;
  const { t } = useTranslation();

  const { data: contest, isLoading: isContestLoading } = useContest(contestId);
  const { data: contestants = [], isLoading } = useContestContestants(contestId);
  useDocumentTitle(contest?.title, { contestTitle: contest?.title });

  const [paginationModel, setPaginationModel] = useState<GridPaginationModel>({
    page: 0,
    pageSize: 20,
  });

  const columns: GridColDef<ContestantEntity>[] = useMemo(
    () => [
      {
        field: 'rank',
        headerName: '#',
        minWidth: 70,
        flex: 0.3,
        renderCell: ({ row }) => (
          <Typography variant="body2" fontWeight={700}>
            {row.rank ?? '—'}
          </Typography>
        ),
      },
      {
        field: 'username',
        headerName: t('contests.ratingChanges.columns.contestant'),
        minWidth: 200,
        flex: 1.2,
        renderCell: ({ row }) => (
          <ContestantView
            contestant={row}
            imgSize={26}
            isVirtual={row.isVirtual}
            isUnrated={row.isUnrated}
            isOfficial={row.isOfficial}
          />
        ),
      },
      {
        field: 'points',
        headerName: t('contests.standings.points'),
        minWidth: 120,
        flex: 0.6,
        align: 'center',
        headerAlign: 'center',
        renderCell: ({ row }) => (
          <Typography color="primary" variant="body2" fontWeight={700}>
            {row.points ?? '—'}
          </Typography>
        ),
      },
      {
        field: 'delta',
        headerName: t('contests.ratingChanges.columns.delta'),
        minWidth: 120,
        flex: 0.6,
        align: 'center',
        headerAlign: 'center',
        renderCell: ({ row }) => (
          <Typography
            variant="body2"
            fontWeight={700}
            color={
              row.delta && row.delta > 0
                ? 'success.main'
                : row.delta && row.delta < 0
                  ? 'error.main'
                  : 'text.primary'
            }
          >
            {row.delta ? `${row.delta > 0 ? '+' : ''}${row.delta}` : '—'}
          </Typography>
        ),
      },
      {
        field: 'rating',
        headerName: t('contests.ratingChanges.columns.rating'),
        minWidth: 200,
        flex: 0.9,
        renderCell: ({ row }) => (
          <Stack direction="row" spacing={1} alignItems="center">
            {row.rating ? (
              <Stack direction="row" spacing={0.5} alignItems="center">
                <ContestsRatingChip title={row.ratingTitle} imgSize={22} />
                <Typography variant="body2" fontWeight={700}>
                  {row.rating}
                </Typography>
              </Stack>
            ) : null}
            <Typography variant="body2" color="text.secondary">
              →
            </Typography>
            {row.newRating ? (
              <Stack direction="row" spacing={0.5} alignItems="center">
                <ContestsRatingChip title={row.newRatingTitle} imgSize={22} />
                <Typography variant="body2" fontWeight={700}>
                  {row.newRating}
                </Typography>
              </Stack>
            ) : (
              <Typography variant="body2" color="text.secondary">
                —
              </Typography>
            )}
          </Stack>
        ),
      },
    ],
    [t],
  );

  const paginatedRows = useMemo(
    () => paginateRows(contestants, paginationModel),
    [contestants, paginationModel],
  );

  return (
    <Stack spacing={3} sx={responsivePagePaddingSx}>
      <ContestPageHeader
        title={contest?.title ?? t('contests.ratingChanges.title')}
        contest={contest as any}
        contestId={contestId}
        isLoading={isContestLoading}
      />

      <DataGrid
        autoHeight
        disableColumnMenu
        disableColumnFilter
        disableRowSelectionOnClick
        rows={paginatedRows}
        columns={columns}
        loading={isLoading}
        rowCount={contestants.length}
        paginationMode="server"
        paginationModel={paginationModel}
        onPaginationModelChange={setPaginationModel}
        pageSizeOptions={[20, 50, 100]}
        getRowId={(row) => row.username}
      />
    </Stack>
  );
};

export default ContestRatingChangesPage;

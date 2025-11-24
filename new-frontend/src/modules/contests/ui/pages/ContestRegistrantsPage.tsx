import { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Link as RouterLink, useParams } from 'react-router-dom';
import { Grid, Stack, Typography } from '@mui/material';
import { DataGrid, GridColDef, GridPaginationModel, GridSortModel } from '@mui/x-data-grid';
import { useDocumentTitle } from 'app/providers/DocumentTitleProvider';
import { getResourceById, resources } from 'app/routes/resources';
import { ApiContestsRegistrantsListOrdering } from 'shared/api/orval/generated/endpoints/index.schemas';
import ContestsRatingChip from 'shared/components/rating/ContestsRatingChip';
import { gridPaginationToPageParams } from 'shared/lib/pagination';
import { responsivePagePaddingSx } from 'shared/lib/styles';
import { useContest, useContestRegistrants } from '../../application/queries';
import { ContestRegistrant } from '../../domain/entities/contest-registrant.entity';
import ContestCountdownCard from '../components/ContestCountdownCard';
import ContestPageHeader from '../components/ContestPageHeader';

const ContestRegistrantsPage = () => {
  const { id } = useParams<{ id: string }>();
  const contestId = id ? Number(id) : undefined;
  const { t } = useTranslation();

  const { data: contest } = useContest(contestId);
  useDocumentTitle(contest?.title, { contestTitle: contest?.title });

  const [paginationModel, setPaginationModel] = useState<GridPaginationModel>({
    page: 0,
    pageSize: 20,
  });
  const [ordering, setOrdering] = useState<ApiContestsRegistrantsListOrdering>(
    ApiContestsRegistrantsListOrdering['-contests_rating'],
  );
  const paginationParams = useMemo(
    () => gridPaginationToPageParams(paginationModel),
    [paginationModel],
  );

  const { data: registrantsPage, isLoading } = useContestRegistrants(contestId, {
    page: paginationParams.page,
    pageSize: paginationParams.pageSize,
    ordering,
  });

  const total = registrantsPage?.total ?? 0;
  const registrants = registrantsPage?.data ?? [];

  const columns: GridColDef<ContestRegistrant>[] = useMemo(
    () => [
      {
        field: 'rowIndex',
        headerName: '#',
        minWidth: 70,
        flex: 0.3,
        renderCell: ({ row }) => (
          <Typography variant="body2" fontWeight={700}>
            {row.rowIndex ?? '—'}
          </Typography>
        ),
      },
      {
        field: 'username',
        headerName: t('contests.registrants.columns.user'),
        minWidth: 200,
        flex: 1.2,
        sortable: true,
        renderCell: ({ row }) => (
          <Stack direction="row" spacing={1} alignItems="center">
            <Typography
              component={RouterLink}
              to={getResourceById(resources.UserProfile, row.username)}
              sx={{ textDecoration: 'none', color: 'primary.main', fontWeight: 700 }}
            >
              {row.username}
            </Typography>
            {row.team?.name ? (
              <Typography variant="caption" color="text.secondary">
                · {row.team.name}
              </Typography>
            ) : null}
          </Stack>
        ),
      },
      {
        field: 'rating',
        headerName: t('contests.registrants.columns.rating'),
        minWidth: 140,
        flex: 0.8,
        sortable: true,
        renderCell: ({ row }) =>
          row.rating ? (
            <Stack direction="row" spacing={0.75} alignItems="center">
              <ContestsRatingChip title={row.ratingTitle} imgSize={22} />
              <Typography variant="body2" fontWeight={700}>
                {row.rating}
              </Typography>
            </Stack>
          ) : (
            <Typography variant="body2" color="text.secondary">
              —
            </Typography>
          ),
      },
    ],
    [t],
  );

  const handleSortChange = (model: GridSortModel) => {
    if (!model.length) {
      setOrdering(ApiContestsRegistrantsListOrdering['-contests_rating']);
      return;
    }

    const { field, sort } = model[0];
    if (field === 'rating') {
      setOrdering(
        sort === 'asc'
          ? ApiContestsRegistrantsListOrdering.contests_rating
          : ApiContestsRegistrantsListOrdering['-contests_rating'],
      );
      return;
    }
    if (field === 'username') {
      setOrdering(
        sort === 'asc'
          ? ApiContestsRegistrantsListOrdering.username
          : ApiContestsRegistrantsListOrdering['-username'],
      );
      return;
    }
    setOrdering(ApiContestsRegistrantsListOrdering['-contests_rating']);
  };

  return (
    <Stack spacing={3} sx={responsivePagePaddingSx}>
      <ContestPageHeader
        title={contest?.title ?? t('contests.registrants.title')}
        contest={contest}
        contestId={contestId}
      />

      <Grid container spacing={3}>
        <Grid size={{ xs: 12, md: 8 }}>
          <DataGrid
            autoHeight
            disableColumnMenu
            disableColumnFilter
            disableRowSelectionOnClick
            rows={registrants}
            columns={columns}
            loading={isLoading}
            rowCount={total}
            paginationMode="server"
            sortingMode="server"
            onSortModelChange={handleSortChange}
            paginationModel={paginationModel}
            onPaginationModelChange={setPaginationModel}
            pageSizeOptions={[20, 50, 100]}
            getRowId={(row) => row.username}
          />
        </Grid>
        <Grid size={{ xs: 12, md: 4 }}>
          <ContestCountdownCard contest={contest} />
        </Grid>
      </Grid>
    </Stack>
  );
};

export default ContestRegistrantsPage;

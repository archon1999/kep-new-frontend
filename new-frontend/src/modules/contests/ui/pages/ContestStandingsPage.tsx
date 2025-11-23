import { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useParams } from 'react-router-dom';
import { Box, Chip, Grid, Stack, Typography } from '@mui/material';
import { DataGrid, GridColDef, GridPaginationModel } from '@mui/x-data-grid';
import { useAuth } from 'app/providers/AuthProvider';
import { useDocumentTitle } from 'app/providers/DocumentTitleProvider';
import { ContestType } from 'shared/api/orval/generated/endpoints/index.schemas';
import KepIcon from 'shared/components/base/KepIcon';
import ContestsRatingChip from 'shared/components/rating/ContestsRatingChip';
import { responsivePagePaddingSx } from 'shared/lib/styles';
import {
  useContest,
  useContestFilters,
  useContestProblems,
  useContestStandings,
} from '../../application/queries';
import { ContestProblemEntity } from '../../domain/entities/contest-problem.entity';
import { ContestStatus } from '../../domain/entities/contest-status';
import { ContestantEntity } from '../../domain/entities/contestant.entity';
import { contestHasBalls, contestHasPenalties, isAcmStyle } from '../../utils/contestType';
import ContestPageHeader from '../components/ContestPageHeader';
import ContestantView from '../components/ContestantView';

const formatProblemResult = (contestType: ContestType | undefined, info: any) => {
  if (!info) {
    return { label: '-', color: 'default' as const, helper: '' };
  }

  if (isAcmStyle(contestType)) {
    if (info.firstAcceptedTime) {
      const attempts = info.attemptsCount > 0 ? `+${info.attemptsCount}` : '+';
      return {
        label: attempts,
        color: 'success' as const,
        helper: info.contestTime ?? '',
        isBest: info.theBest,
      };
    }
    if (info.attemptsCount > 0) {
      return { label: `-${info.attemptsCount}`, color: 'error' as const };
    }
    return { label: '-', color: 'default' as const };
  }

  if (contestType === ContestType.LessCode || contestType === ContestType.DC) {
    if (info.firstAcceptedTime) {
      return { label: `${info.points}`, color: 'success' as const, isBest: info.theBest };
    }
    return { label: '-', color: 'error' as const };
  }

  if (contestType === ContestType.LessLine) {
    if (info.firstAcceptedTime) {
      return { label: `${info.points}/10`, color: 'primary' as const, isBest: info.theBest };
    }
    return { label: '-', color: 'error' as const };
  }

  if (contestType === ContestType.MultiL) {
    if (info.firstAcceptedTime) {
      return { label: `${info.points}/10`, color: 'info' as const, isBest: info.theBest };
    }
    return { label: '-', color: 'error' as const };
  }

  if (contestHasBalls(contestType)) {
    if (info.firstAcceptedTime) {
      return {
        label: info.points ?? '',
        color: 'primary' as const,
        helper: info.contestTime ?? '',
        isBest: info.theBest,
      };
    }
    if (info.points > 0) {
      return { label: info.points, color: 'warning' as const };
    }
    return { label: info.points ?? '-', color: 'error' as const };
  }

  return { label: '-', color: 'default' as const };
};

const ContestStandingsPage = () => {
  const { id } = useParams<{ id: string }>();
  const contestId = id ? Number(id) : undefined;
  const { t } = useTranslation();
  const { currentUser } = useAuth();

  const { data: contest } = useContest(contestId);
  const { data: contestProblems = [] } = useContestProblems(contestId);
  const { data: contestFilters = [] } = useContestFilters(contestId);
  useDocumentTitle(
    contest?.title ? 'pageTitles.contestStandings' : undefined,
    contest?.title
      ? {
          contestTitle: contest.title,
        }
      : undefined,
  );

  const [paginationModel, setPaginationModel] = useState<GridPaginationModel>({
    page: 0,
    pageSize: 20,
  });
  const [selectedFilter, setSelectedFilter] = useState<string>('');
  const [followingOnly, setFollowingOnly] = useState(false);

  const refreshInterval = contest?.statusCode === ContestStatus.Already ? 30000 : undefined;

  const { data: standings, isLoading } = useContestStandings(
    contestId,
    {
      page: paginationModel.page + 1,
      pageSize: paginationModel.pageSize,
      filter: selectedFilter || null,
      following: followingOnly,
    },
    refreshInterval,
  );

  const contestants = standings?.data ?? [];
  const total = standings?.total ?? 0;
  const tabsRightContent = (
    <Stack direction="row" spacing={1} alignItems="center" sx={{ ml: { md: 'auto' } }}>
      <Chip
        icon={<KepIcon name="filter" fontSize={16} />}
        label={t('contests.standings.followingOnly')}
        color={followingOnly ? 'primary' : 'default'}
        variant={followingOnly ? 'filled' : 'outlined'}
        onClick={() => {
          setFollowingOnly((prev) => !prev);
          setPaginationModel((prev) => ({ ...prev, page: 0 }));
        }}
      />
      <Chip
        icon={<KepIcon name="filter" fontSize={16} />}
        label={
          selectedFilter
            ? contestFilters.find((f) => String(f.id) === String(selectedFilter))?.name
            : t('contests.standings.allFilters')
        }
        onClick={() => {
          if (!contestFilters.length) return;
          const currentIndex = contestFilters.findIndex(
            (f) => String(f.id) === String(selectedFilter),
          );
          const next =
            currentIndex === -1
              ? contestFilters[0]
              : contestFilters[(currentIndex + 1) % contestFilters.length];
          setSelectedFilter(next ? String(next.id) : '');
          setPaginationModel((prev) => ({ ...prev, page: 0 }));
        }}
        variant="outlined"
      />
    </Stack>
  );

  const columns: GridColDef<ContestantEntity>[] = useMemo(() => {
    const base: GridColDef<ContestantEntity>[] = [
      {
        field: 'rank',
        headerName: t('contests.standings.place'),
        minWidth: 70,
        flex: 0.3,
        sortable: false,
        renderHeader: (params) => (
          <Stack direction="row" alignItems="center" spacing={1} sx={{ pl: 1 }}>
            <Typography variant="subtitle2" fontWeight={500} color="text.primary">
              {params.colDef.headerName}
            </Typography>
          </Stack>
        ),
        renderCell: ({ row }) => (
          <Typography variant="body2" fontWeight={700}>
            {row.rank ?? '—'}
          </Typography>
        ),
      },
      {
        field: 'username',
        headerName: t('contests.standings.contestant'),
        minWidth: 200,
        flex: 1.2,
        sortable: false,
        renderCell: ({ row }) => (
          <ContestantView
            contestant={row}
            imgSize={28}
            isVirtual={row.isVirtual}
            isUnrated={row.isUnrated}
            isOfficial={row.isOfficial}
            showCountry
          />
        ),
      },
      {
        field: 'points',
        headerName: t('contests.standings.points'),
        minWidth: 60,
        flex: 0.8,
        sortable: false,
        renderCell: ({ row }) => (
          <Stack direction="row" spacing={0.5} alignItems="center">
            <Typography variant="body2" fontWeight={800} color="primary.main">
              {row.points ?? '—'}
            </Typography>
            {contestHasPenalties(contest?.type) ? (
              <Typography variant="caption" color="error.main">
                ({row.penalties ?? 0})
              </Typography>
            ) : null}
          </Stack>
        ),
      },
    ];

    if (contest?.isRated) {
      base.push({
        field: 'delta',
        headerName: t('contests.standings.delta'),
        minWidth: 110,
        flex: 0.6,
        align: 'center',
        headerAlign: 'center',
        sortable: false,
        renderCell: ({ row }) => {
          const deltaValue = row.delta ?? 0;
          const deltaLabel = `${deltaValue > 0 ? '+' : ''}${deltaValue}`;

          return (
            <Chip
              label={deltaLabel}
              color={
                row.delta && row.delta > 0
                  ? 'success'
                  : row.delta && row.delta < 0
                    ? 'error'
                    : 'default'
              }
              size="small"
              variant="outlined"
            />
          );
        },
      });

      base.push({
        field: 'performance',
        headerName: t('contests.standings.performance'),
        minWidth: 100,
        flex: 0.7,
        align: 'center',
        headerAlign: 'center',
        sortable: false,
        renderCell: ({ row }) => (
          <Stack direction="row" spacing={0.75} alignItems="center">
            <Typography variant="body2" fontWeight={700}>
              {row.performance ?? '—'}
            </Typography>
            {row.performanceTitle ? (
              <ContestsRatingChip title={row.performanceTitle} imgSize={22} />
            ) : null}
          </Stack>
        ),
      });
    }

    const problemColumns: GridColDef<ContestantEntity>[] = contestProblems.map(
      (problem: ContestProblemEntity) => ({
        field: `problem-${problem.symbol}`,
        headerName: problem.symbol,
        minWidth: 100,
        headerAlign: 'center',
        flex: 0.8,
        sortable: false,
        renderHeader: (params) => {
          const symbol = params.colDef.field.replace('problem-', '');
          const problemMap = useMemo(
            () => new Map(contestProblems.map((problem) => [problem.symbol, problem])),
            [contestProblems],
          );
          const problem = problemMap.get(symbol);

          return (
            <Box
              sx={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                px: 1.5,
                py: 1,
                borderRight: 1,
                borderColor: 'divider',
                '&:last-of-type': { borderRight: 'none' },
              }}
            >
              <Typography variant="subtitle2" fontWeight={700} color="text.primary">
                {problem?.symbol ?? symbol}
              </Typography>
              <Stack direction="row" spacing={0.4} alignItems="center">
                <Typography variant="caption" color="text.secondary">
                  (
                </Typography>
                <Typography variant="caption" color="success.main">
                  {problem?.solved ?? 0}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  /
                </Typography>
                <Typography variant="caption" color="error.main">
                  {problem?.unsolved ?? 0}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  /
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  {problem?.attemptsCount ?? 0}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  )
                </Typography>
              </Stack>
            </Box>
          );
        },
        renderCell: ({ row }) => {
          const info =
            row.problemsInfo?.find((item) => item.problemSymbol === problem.symbol) ?? null;
          const result = formatProblemResult(contest?.type, info);
          return (
            info && (
              <Stack spacing={0.25} alignItems="center" width="100%">
                <Typography color={result.color}>{result.label}</Typography>
                {result.helper ? (
                  <Typography variant="caption" fontWeight={500}>
                    {result.helper}
                  </Typography>
                ) : null}
              </Stack>
            )
          );
        },
      }),
    );

    return [...base, ...problemColumns];
  }, [contest?.id, contest?.isRated, contest?.type, contestProblems, t]);

  return (
    <Stack spacing={3} sx={responsivePagePaddingSx}>
      <ContestPageHeader
        title={contest?.title ?? t('contests.tabs.standings')}
        contest={contest as any}
        contestId={contestId}
        isRated={contest?.isRated}
        tabsRightContent={tabsRightContent}
        showLogoOverlay
      />

      <Grid container spacing={3}>
        <Grid size={{ xs: 12 }}>
          <DataGrid
            autoHeight
            rowHeight={72}
            disableColumnMenu
            disableColumnFilter
            disableRowSelectionOnClick
            rows={contestants}
            columns={columns}
            loading={isLoading}
            rowCount={total}
            paginationMode="server"
            paginationModel={paginationModel}
            onPaginationModelChange={setPaginationModel}
            pageSizeOptions={[10, 20, 50, 100]}
            getRowId={(row) => `${row.username}-${row.virtualTime ?? ''}`}
            getRowClassName={({ row }) =>
              row.username === currentUser?.username ? 'MuiDataGrid-row--current' : ''
            }
          />
        </Grid>
      </Grid>
    </Stack>
  );
};

export default ContestStandingsPage;

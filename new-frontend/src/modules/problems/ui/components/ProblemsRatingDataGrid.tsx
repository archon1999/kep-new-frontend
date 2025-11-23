import { Link as RouterLink } from 'react-router-dom';
import { Avatar, Chip, Stack, Typography, alpha, useTheme } from '@mui/material';
import {
  DataGrid,
  GridColDef,
  GridPaginationModel,
  GridSortModel,
  GridValidRowModel,
} from '@mui/x-data-grid';
import { getResourceByUsername, resources } from 'app/routes/resources';
import { difficultyColorByKey, difficultyOptions } from '../../config/difficulty';
import { ProblemsRatingRow } from '../../domain/entities/problem.entity';

export type ProblemsRatingDataGridLabels = {
  rank: string;
  user: string;
  rating: string;
  solved: string;
  difficulties: Record<(typeof difficultyOptions)[number]['key'], string>;
  emptyValue: string;
};

interface ProblemsRatingDataGridProps {
  rows: ProblemsRatingRow[];
  rowCount: number;
  loading?: boolean;
  paginationModel: GridPaginationModel;
  onPaginationModelChange: (model: GridPaginationModel) => void;
  sortModel: GridSortModel;
  onSortModelChange: (model: GridSortModel) => void;
  labels: ProblemsRatingDataGridLabels;
}

const ProblemsRatingDataGrid = ({
  rows,
  rowCount,
  loading,
  paginationModel,
  onPaginationModelChange,
  sortModel,
  onSortModelChange,
  labels,
}: ProblemsRatingDataGridProps) => {
  const theme = useTheme();

  const renderDifficultyCell = (key: (typeof difficultyOptions)[number]['key']) => {
    const colorKey = difficultyColorByKey[key];
    const color = theme.palette[colorKey]?.main ?? theme.palette.primary.main;

    return ({ row }: { row: GridValidRowModel }) => {
      const value = (row as ProblemsRatingRow)[key] ?? 0;

      return (
        <Chip
          size="small"
          label={value}
          sx={{
            backgroundColor: alpha(color, 0.08),
            color,
            fontWeight: 600,
            px: 1.25,
          }}
        />
      );
    };
  };

  const columns: GridColDef<GridValidRowModel>[] = [
    {
      field: 'rowIndex',
      headerName: labels.rank,
      width: 90,
      align: 'center',
      headerAlign: 'center',
      sortable: false,
      renderCell: ({ row }) => (
        <Chip
          color="primary"
          label={`#${(row as ProblemsRatingRow).rowIndex}`}
          sx={{ fontWeight: 700, minWidth: 64, justifyContent: 'center' }}
        />
      ),
    },
    {
      field: 'user',
      headerName: labels.user,
      flex: 1.3,
      minWidth: 260,
      sortable: false,
      renderHeader: (params) => (
        <Stack direction="row" alignItems="center" spacing={1} sx={{ pl: 1 }}>
          <Typography variant="subtitle2" fontWeight={700} color="text.primary">
            {params.colDef.headerName}
          </Typography>
        </Stack>
      ),
      renderCell: ({ row }) => {
        const ratingRow = row as ProblemsRatingRow;
        const displayName =
          ratingRow.user.firstName || ratingRow.user.lastName
            ? `${ratingRow.user.firstName ?? ''} ${ratingRow.user.lastName ?? ''}`.trim()
            : ratingRow.user.username;

        return (
          <Stack direction="row" spacing={2} alignItems="center" sx={{ minWidth: 0 }}>
            <Avatar src={ratingRow.user.avatar} alt={displayName} sx={{ width: 44, height: 44 }} />
            <Stack spacing={0.5} minWidth={0}>
              <Typography
                component={RouterLink}
                to={getResourceByUsername(resources.UserProfile, ratingRow.user.username)}
                variant="subtitle2"
                fontWeight={700}
                sx={{ textDecoration: 'none' }}
                color="primary"
                noWrap
              >
                {ratingRow.user.username}
              </Typography>
              <Typography variant="body2" color="text.secondary" noWrap>
                {displayName}
              </Typography>
              {ratingRow.user.ratingTitle ? (
                <Typography variant="caption" color="text.secondary" noWrap>
                  {ratingRow.user.ratingTitle}
                </Typography>
              ) : null}
            </Stack>
          </Stack>
        );
      },
    },
    {
      field: 'rating',
      headerName: labels.rating,
      minWidth: 140,
      flex: 0.5,
      sortable: true,
      renderCell: ({ row }) => (
        <Chip
          size="small"
          color="secondary"
          variant="soft"
          label={(row as ProblemsRatingRow).rating ?? labels.emptyValue}
          sx={{ fontWeight: 700 }}
        />
      ),
    },
    {
      field: 'solved',
      headerName: labels.solved,
      minWidth: 130,
      flex: 0.5,
      sortable: true,
      renderCell: ({ row }) => (
        <Chip
          size="small"
          color="success"
          variant="soft"
          label={(row as ProblemsRatingRow).solved ?? labels.emptyValue}
          sx={{ fontWeight: 700 }}
        />
      ),
    },
    ...difficultyOptions.map((option) => ({
      field: option.key,
      headerName: labels.difficulties[option.key],
      minWidth: 110,
      flex: 0.45,
      sortable: true,
      renderCell: renderDifficultyCell(option.key),
    } satisfies GridColDef<GridValidRowModel>)),
  ];

  return (
    <DataGrid
      autoHeight
      rowHeight={76}
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
      getRowId={(row) => `${(row as ProblemsRatingRow).user.username}-${(row as ProblemsRatingRow).rowIndex}`}
      disableColumnMenu
      sx={{
        '& .MuiDataGrid-columnHeaderTitle': {
          fontWeight: 700,
        },
        '& .MuiDataGrid-cell': {
          outline: 'none',
        },
      }}
    />
  );
};

export default ProblemsRatingDataGrid;

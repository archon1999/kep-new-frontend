import { Avatar, Box, Chip, Stack, Typography } from '@mui/material';
import { DataGrid, GridColDef, GridPaginationModel, GridSortModel } from '@mui/x-data-grid';
import { getResourceByUsername, resources } from 'app/routes/resources';
import { Link as RouterLink } from 'react-router-dom';
import { ProblemsRatingRow } from '../../domain/entities/problem.entity';

export interface ProblemsRatingColumnLabels {
  place: string;
  user: string;
  rating: string;
  solved: string;
  emptyValue: string;
  difficulties: Record<
    keyof Pick<
      ProblemsRatingRow,
      'beginner' | 'basic' | 'normal' | 'medium' | 'advanced' | 'hard' | 'extremal'
    >,
    string
  >;
}

interface ProblemsRatingDataGridProps {
  rows: ProblemsRatingRow[];
  rowCount: number;
  loading?: boolean;
  paginationModel: GridPaginationModel;
  onPaginationModelChange: (model: GridPaginationModel) => void;
  sortModel: GridSortModel;
  onSortModelChange: (model: GridSortModel) => void;
  columnLabels: ProblemsRatingColumnLabels;
}

const difficultiesConfig = [
  { key: 'beginner' as const, color: 'success' },
  { key: 'basic' as const, color: 'info' },
  { key: 'normal' as const, color: 'primary' },
  { key: 'medium' as const, color: 'primary' },
  { key: 'advanced' as const, color: 'warning' },
  { key: 'hard' as const, color: 'error' },
  { key: 'extremal' as const, color: 'secondary' },
];

const ProblemsRatingDataGrid = ({
  rows,
  rowCount,
  loading,
  paginationModel,
  onPaginationModelChange,
  sortModel,
  onSortModelChange,
  columnLabels,
}: ProblemsRatingDataGridProps) => {
  const columns: GridColDef[] = [
    {
      field: 'rowIndex',
      headerName: columnLabels.place,
      minWidth: 80,
      sortable: false,
      renderHeader: (params) => (
        <Box sx={{ pl: 2, fontWeight: 600, display: 'flex', alignItems: 'center' }}>
          {params.colDef.headerName}
        </Box>
      ),
      renderCell: ({ row }) => (
        <Chip
          size="small"
          color="primary"
          label={`#${(row as ProblemsRatingRow).rowIndex}`}
          sx={{ fontWeight: 700 }}
        />
      ),
    },
    {
      field: 'user',
      headerName: columnLabels.user,
      flex: 1.2,
      minWidth: 240,
      sortable: true,
      renderHeader: (params) => (
        <Box sx={{ display: 'flex', fontWeight: 600, alignItems: 'center' }}>{params.colDef.headerName}</Box>
      ),
      renderCell: ({ row }) => {
        const data = row as ProblemsRatingRow;
        const name = [data.user.firstName, data.user.lastName].filter(Boolean).join(' ');

        return (
          <Stack direction="row" spacing={1.5} alignItems="center" sx={{ minWidth: 0 }}>
            <Avatar src={data.user.avatar} alt={data.user.username} sx={{ width: 42, height: 42 }} />
            <Stack spacing={0.25} minWidth={0}>
              <Typography
                component={RouterLink}
                to={getResourceByUsername(resources.UserProfile, data.user.username)}
                variant="subtitle2"
                fontWeight={700}
                color="primary"
                noWrap
                sx={{ textDecoration: 'none' }}
              >
                {data.user.username}
              </Typography>
              {name && (
                <Typography variant="body2" color="text.secondary" noWrap>
                  {name}
                </Typography>
              )}
              {data.user.ratingTitle && (
                <Typography variant="caption" color="text.secondary" noWrap>
                  {data.user.ratingTitle}
                </Typography>
              )}
            </Stack>
          </Stack>
        );
      },
    },
    {
      field: 'rating',
      headerName: columnLabels.rating,
      flex: 0.5,
      minWidth: 120,
      sortable: true,
      renderCell: ({ row }) => (
        <Chip
          size="small"
          color="secondary"
          label={(row as ProblemsRatingRow).rating ?? columnLabels.emptyValue}
          sx={{ fontWeight: 700, minWidth: 72 }}
        />
      ),
    },
    {
      field: 'solved',
      headerName: columnLabels.solved,
      flex: 0.4,
      minWidth: 110,
      sortable: true,
      renderCell: ({ row }) => (
        <Typography variant="body2" fontWeight={700} color="text.primary">
          {(row as ProblemsRatingRow).solved ?? columnLabels.emptyValue}
        </Typography>
      ),
    },
    ...difficultiesConfig.map(({ key, color }) => ({
      field: key,
      headerName: columnLabels.difficulties[key],
      minWidth: 110,
      flex: 0.45,
      sortable: true,
      align: 'center',
      headerAlign: 'center',
      renderCell: ({ row }) => {
        const value = (row as ProblemsRatingRow)[key];

        return (
          <Chip
            size="small"
            color={color}
            variant="soft"
            label={value ?? columnLabels.emptyValue}
            sx={{ fontWeight: 700, minWidth: 64, justifyContent: 'center' }}
          />
        );
      },
    })),
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
      getRowId={(row) => (row as ProblemsRatingRow).user.username}
      sx={{
        '--DataGrid-containerBackground': 'transparent',
        backgroundColor: 'transparent',
        border: 'none',
        '& .MuiDataGrid-cell:focus': { outline: 'none' },
        '& .MuiDataGrid-columnHeader:focus': { outline: 'none' },
        '& .MuiDataGrid-columnHeaderTitle': { fontWeight: 700 },
        '& .MuiDataGrid-columnSeparator': { display: 'none' },
      }}
    />
  );
};

export default ProblemsRatingDataGrid;

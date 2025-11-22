import { useEffect, useMemo, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Link as RouterLink } from 'react-router-dom';
import { IconButton, Tooltip, Typography, alpha, useTheme, Chip } from '@mui/material';
import { DataGrid, GridColDef, GridPaginationModel } from '@mui/x-data-grid';
import { useAuth } from 'app/providers/AuthProvider';
import { getResourceById, getResourceByUsername, resources } from 'app/routes/resources';
import IconifyIcon from 'shared/components/base/IconifyIcon';
import AttemptLanguage from 'shared/components/problems/AttemptLanguage';
import AttemptVerdict, { VerdictKey } from 'shared/components/problems/AttemptVerdict';
import { wsService } from 'shared/services/websocket';
import { problemsQueries } from '../../application/queries';
import { AttemptListItem } from '../../domain/entities/problem.entity';

interface ProblemsAttemptsTableProps {
  attempts: AttemptListItem[];
  total: number;
  paginationModel: GridPaginationModel;
  onPaginationChange: (model: GridPaginationModel) => void;
  isLoading?: boolean;
  onRerun?: () => void;
}

interface AttemptUpdatePayload {
  id: number;
  verdict: number;
  verdictTitle: string;
  testCaseNumber?: number | null;
  time?: number | null;
  memory?: number | null;
  balls?: number | null;
}

const ProblemsAttemptsTable = ({
  attempts,
  total,
  paginationModel,
  onPaginationChange,
  isLoading,
  onRerun,
}: ProblemsAttemptsTableProps) => {
  const { t, i18n } = useTranslation();
  const theme = useTheme();
  const { currentUser } = useAuth();
  const [rows, setRows] = useState<AttemptListItem[]>(attempts ?? []);
  const trackedIdsRef = useRef<number[]>([]);

  useEffect(() => {
    setRows(attempts ?? []);
  }, [attempts]);

  useEffect(() => {
    const newIds = (attempts ?? []).map((attempt) => attempt.id);
    const previousIds = trackedIdsRef.current;

    const added = newIds.filter((id) => !previousIds.includes(id));
    const removed = previousIds.filter((id) => !newIds.includes(id));

    added.forEach((id) => wsService.send('attempt-add', id));
    removed.forEach((id) => wsService.send('attempt-delete', id));

    trackedIdsRef.current = newIds;
    wsService.send('lang-change', i18n.language);
  }, [attempts, i18n.language]);

  useEffect(
    () => () => {
      trackedIdsRef.current.forEach((id) => wsService.send('attempt-delete', id));
    },
    [],
  );

  useEffect(() => {
    const unsubscribe = wsService.on<AttemptUpdatePayload>('attempt-update', (payload) => {
      setRows((prev) => {
        const index = prev.findIndex((attempt) => attempt.id === payload.id);
        if (index === -1) return prev;

        const updatedAttempt: AttemptListItem = {
          ...prev[index],
          verdict: payload.verdict,
          verdictTitle: payload.verdictTitle,
          testCaseNumber: payload.testCaseNumber,
          time: payload.time ?? undefined,
          memory: payload.memory ?? undefined,
          balls: payload.balls ?? undefined,
        };

        const nextAttempts = [...prev];
        nextAttempts[index] = updatedAttempt;
        return nextAttempts;
      });
    });

    return unsubscribe;
  }, []);

  const formatDateTime = (value?: string) => {
    if (!value) return '—';
    const date = new Date(value);
    return `${date.toLocaleDateString()} ${date.toLocaleTimeString()}`;
  };

  const handleRerun = async (attemptId: number) => {
    await problemsQueries.problemsRepository.rerunAttempt(attemptId);
    onRerun?.();
  };

  const columns: GridColDef<AttemptListItem>[] = useMemo(() => {
    const baseColumns: GridColDef<AttemptListItem>[] = [
      {
        field: 'id',
        headerName: t('problems.attempts.columns.id'),
        minWidth: 90,
        flex: 0.4,
        sortable: false,
        headerAlign: 'center',
        renderCell: ({ row }) => (
          <Typography variant="body2" fontWeight={700}>
            {row.id}
          </Typography>
        ),
      },
      {
        field: 'created',
        headerName: t('problems.attempts.columns.submitted'),
        minWidth: 180,
        flex: 0.8,
        sortable: false,
        renderCell: ({ row }) => <Chip label={formatDateTime(row.created)}></Chip>,
      },
      {
        field: 'lang',
        headerName: t('problems.attempts.columns.lang'),
        minWidth: 80,
        flex: 0.5,
        sortable: false,
        renderCell: ({ row }) => <AttemptLanguage lang={row.lang} langFull={row.langFull} />,
      },
      {
        field: 'user',
        headerName: t('problems.attempts.columns.user'),
        minWidth: 100,
        flex: 1,
        sortable: false,
        renderCell: ({ row }) => (
          <Typography
            component={RouterLink}
            to={getResourceByUsername(resources.UserProfile, row.user.username)}
            sx={{ textDecoration: 'none', color: 'primary.main', fontWeight: 700 }}
          >
            {row.user.username}
          </Typography>
        ),
      },
      {
        field: 'problemTitle',
        headerName: t('problems.attempts.columns.problem'),
        minWidth: 240,
        flex: 1.4,
        sortable: false,
        renderCell: ({ row }) => (
          <Typography
            component={RouterLink}
            to={getResourceById(resources.Problem, row.problemId)}
            sx={{ textDecoration: 'none', color: 'text.primary', fontWeight: 700 }}
          >
            {row.contestProblemSymbol
              ? `${row.contestProblemSymbol}. ${row.problemTitle}`
              : `${row.problemId}. ${row.problemTitle}`}
          </Typography>
        ),
      },
      {
        field: 'verdictTitle',
        headerName: t('problems.attempts.columns.verdict'),
        minWidth: 100,
        flex: 0.6,
        sortable: false,
        renderCell: ({ row }) => (
          <AttemptVerdict
            verdict={row.verdict as VerdictKey | undefined}
            title={row.verdictTitle || t('problems.attempts.unknownVerdict')}
            testCaseNumber={row.testCaseNumber}
          />
        ),
      },
      {
        field: 'time',
        headerName: t('problems.attempts.columns.time'),
        minWidth: 80,
        flex: 0.5,
        sortable: false,
        renderCell: ({ row }) => (
          <Typography variant="body2" fontWeight={600}>
            {row.time ?? '—'} {t('problems.attempts.ms')}
          </Typography>
        ),
      },
      {
        field: 'memory',
        headerName: t('problems.attempts.columns.memory'),
        minWidth: 80,
        flex: 0.5,
        sortable: false,
        renderCell: ({ row }) => (
          <Typography variant="body2" fontWeight={600}>
            {row.memory ?? '—'} {t('problems.attempts.kb')}
          </Typography>
        ),
      },
      {
        field: 'sourceCodeSize',
        headerName: t('problems.attempts.columns.size'),
        minWidth: 80,
        flex: 0.4,
        sortable: false,
        renderCell: ({ row }) => (
          <Typography variant="body2" fontWeight={600}>
            {row.sourceCodeSize ?? '—'} B
          </Typography>
        ),
      },
    ];

    if (currentUser?.isSuperuser) {
      baseColumns.push({
        field: 'actions',
        headerName: '',
        width: 40,
        sortable: false,
        renderCell: ({ row }) => (
          <Tooltip title={t('problems.attempts.rerun')}>
            <IconButton size="small" color="primary" onClick={() => handleRerun(row.id)}>
              <IconifyIcon icon="mdi:refresh" />
            </IconButton>
          </Tooltip>
        ),
      });
    }

    return baseColumns;
  }, [currentUser?.isSuperuser, t]);

  return (
    <DataGrid
      autoHeight
      disableColumnMenu
      disableColumnSelector
      disableRowSelectionOnClick
      rows={rows}
      columns={columns}
      loading={isLoading}
      rowCount={total}
      pageSizeOptions={[10, 20, 50]}
      paginationMode="server"
      paginationModel={paginationModel}
      onPaginationModelChange={onPaginationChange}
      sortingMode="server"
      disableColumnFilter
      sx={{
        '& .MuiDataGrid-row--hovered': { backgroundColor: alpha(theme.palette.primary.main, 0.04) },
      }}
      getRowId={(row) => row.id}
    />
  );
};

export default ProblemsAttemptsTable;

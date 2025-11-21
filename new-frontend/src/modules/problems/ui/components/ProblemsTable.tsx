import {
  Chip,
  CircularProgress,
  Paper,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
  TableSortLabel,
  Typography,
  useTheme,
} from '@mui/material';
import { alpha } from '@mui/material/styles';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router';
import { resources } from 'app/routes/resources.ts';
import { getResourceById } from 'app/routes/resources.ts';
import KepIcon from 'shared/components/icons/KepIcon.tsx';
import { Problem } from '../../domain/entities/problem.entity.ts';

interface ProblemsTableProps {
  problems?: Problem[];
  total?: number;
  page: number;
  pageSize: number;
  ordering?: string;
  onOrderingChange: (ordering: string) => void;
  onPageChange: (page: number) => void;
  onPageSizeChange: (size: number) => void;
  loading?: boolean;
  onTagClick?: (tagId: number) => void;
}

const columnOrderings: Record<string, string> = {
  id: 'id',
  title: 'title',
  difficulty: 'difficulty',
  attempts: 'solved',
};

const ProblemsTable = ({
  problems,
  total = 0,
  page,
  pageSize,
  ordering = 'id',
  onOrderingChange,
  onPageChange,
  onPageSizeChange,
  loading,
  onTagClick,
}: ProblemsTableProps) => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const theme = useTheme();

  const handleSort = (key: string) => {
    const current = ordering === key ? key : ordering === `-${key}` ? `-${key}` : ordering;
    if (current === key) {
      onOrderingChange(`-${key}`);
    } else if (current === `-${key}`) {
      onOrderingChange(key);
    } else {
      onOrderingChange(key);
    }
  };

  const handleChangePage = (_: unknown, nextPage: number) => {
    onPageChange(nextPage + 1);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    onPageSizeChange(Number(event.target.value));
  };

  const renderSortLabel = (key: string, label: React.ReactNode, align: 'left' | 'center' | 'right' = 'left') => {
    const active = ordering === key || ordering === `-${key}`;
    const direction = ordering === `-${key}` ? 'desc' : 'asc';
    return (
      <TableSortLabel
        active={active}
        direction={direction}
        onClick={() => handleSort(key)}
        sx={{ justifyContent: align === 'center' ? 'center' : 'flex-start' }}
      >
        {label}
      </TableSortLabel>
    );
  };

  return (
    <Paper variant="outlined">
      <TableContainer>
        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell>{renderSortLabel(columnOrderings.id, 'ID')}</TableCell>
              <TableCell>{renderSortLabel(columnOrderings.title, t('problems.columnTitle'))}</TableCell>
              <TableCell>{t('problems.columnTags')}</TableCell>
              <TableCell align="center">
                {renderSortLabel(columnOrderings.difficulty, t('problems.columnDifficulty'), 'center')}
              </TableCell>
              <TableCell align="center">
                {renderSortLabel(columnOrderings.attempts, t('problems.columnAttempts'), 'center')}
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={5} align="center">
                  <Stack direction="row" spacing={1} alignItems="center" justifyContent="center">
                    <CircularProgress size={20} />
                    <Typography variant="body2" color="text.secondary">
                      {t('common.loading')}
                    </Typography>
                  </Stack>
                </TableCell>
              </TableRow>
            ) : (problems ?? []).length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} align="center">
                  <Typography variant="body2" color="text.secondary">
                    {t('problems.emptyState')}
                  </Typography>
                </TableCell>
              </TableRow>
            ) : (
              (problems ?? []).map((problem) => {
                const hasSolved = problem.userInfo?.hasSolved;
                const hasAttempted = problem.userInfo?.hasAttempted;
                return (
                  <TableRow
                    key={problem.id}
                    hover
                    sx={{
                      cursor: 'pointer',
                      bgcolor: hasSolved
                        ? alpha(theme.palette.success.main, 0.06)
                        : !hasSolved && hasAttempted
                          ? alpha(theme.palette.error.main, 0.04)
                          : undefined,
                    }}
                    onClick={() => navigate(getResourceById(resources.Problem, problem.id))}
                  >
                    <TableCell>{problem.id}</TableCell>
                    <TableCell>
                      <Stack direction="column" spacing={0.5}>
                        <Typography variant="body2" fontWeight={700} color="text.primary">
                          {problem.title}
                        </Typography>
                        <Stack direction="row" spacing={1} alignItems="center">
                          {problem.hasSolution ? (
                            <Chip size="small" label={t('problems.solution')} color="success" variant="outlined" />
                          ) : null}
                          {problem.hasChecker === false ? (
                            <Chip size="small" label={t('problems.checker')} color="warning" variant="outlined" />
                          ) : null}
                          {problem.hidden ? (
                            <Chip size="small" label={t('problems.hidden')} color="warning" variant="filled" />
                          ) : null}
                          <Stack direction="row" spacing={1} alignItems="center">
                            <Stack direction="row" spacing={0.5} alignItems="center">
                              <KepIcon name="thumb-up" fontSize={16} />
                              <Typography variant="caption" color="text.secondary">
                                {problem.likesCount}
                              </Typography>
                            </Stack>
                            <Stack direction="row" spacing={0.5} alignItems="center">
                              <KepIcon name="thumb-down" fontSize={16} />
                              <Typography variant="caption" color="text.secondary">
                                {problem.dislikesCount}
                              </Typography>
                            </Stack>
                          </Stack>
                        </Stack>
                      </Stack>
                    </TableCell>
                    <TableCell>
                      <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
                        {(problem.tags ?? []).map((tag) => (
                          <Chip
                            key={tag.id}
                            label={tag.name}
                            size="small"
                            onClick={(event) => {
                              event.stopPropagation();
                              onTagClick?.(tag.id);
                            }}
                          />
                        ))}
                      </Stack>
                    </TableCell>
                    <TableCell align="center">
                      <Chip
                        label={problem.difficultyTitle ?? problem.difficulty}
                        color="primary"
                        size="small"
                        variant="outlined"
                      />
                    </TableCell>
                    <TableCell align="center">
                      <Typography variant="body2" color="success.main" component="span" fontWeight={700}>
                        {problem.solved}
                      </Typography>
                      <Typography variant="body2" component="span" color="text.secondary" sx={{ ml: 0.5 }}>
                        / {problem.attemptsCount}
                      </Typography>
                    </TableCell>
                  </TableRow>
                );
              })
            )}
          </TableBody>
        </Table>
      </TableContainer>
      <TablePagination
        component="div"
        rowsPerPageOptions={[10, 20, 50]}
        count={total}
        rowsPerPage={pageSize}
        page={Math.max(0, page - 1)}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />
    </Paper>
  );
};

export default ProblemsTable;

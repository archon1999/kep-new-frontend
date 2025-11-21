import {
  Box,
  Card,
  CardContent,
  Chip,
  Divider,
  LinearProgress,
  Pagination,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Typography,
} from '@mui/material';
import { useTranslation } from 'react-i18next';
import { Problem, ProblemsPageResult } from '../../domain/entities/problem.entity.ts';

interface ProblemsTableProps {
  pageResult?: ProblemsPageResult<Problem>;
  isLoading?: boolean;
  page: number;
  onPageChange: (page: number) => void;
}

const ProblemsTable = ({ pageResult, isLoading, page, onPageChange }: ProblemsTableProps) => {
  const { t } = useTranslation();

  const rows = pageResult?.data ?? [];
  const totalPages = pageResult?.pageSize && pageResult?.total
    ? Math.ceil((pageResult.total ?? 0) / (pageResult.pageSize || 1))
    : 0;

  return (
    <Card variant="outlined">
      <CardContent>
        <Stack spacing={2} direction="column">
          <Stack direction="row" justifyContent="space-between" alignItems="center">
            <Typography variant="h6">{t('problems.listTitle')}</Typography>
            <Typography variant="body2" color="text.secondary">
              {t('problems.problemsFound', { count: pageResult?.total ?? 0 })}
            </Typography>
          </Stack>

          {isLoading && <LinearProgress />}

          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell>{t('problems.table.problem')}</TableCell>
                <TableCell>{t('problems.table.difficulty')}</TableCell>
                <TableCell>{t('problems.table.tags')}</TableCell>
                <TableCell align="right">{t('problems.table.solved')}</TableCell>
                <TableCell align="right">{t('problems.table.attempts')}</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {rows.map((problem) => (
                <TableRow key={problem.id} hover>
                  <TableCell>
                    <Stack spacing={0.5} direction="column">
                      <Typography variant="subtitle2" fontWeight={700}>
                        {problem.symbol ? `${problem.symbol}. ${problem.title}` : problem.title}
                      </Typography>
                      {problem.authorUsername && (
                        <Typography variant="caption" color="text.secondary">
                          {t('problems.authorLabel', { author: problem.authorUsername })}
                        </Typography>
                      )}
                    </Stack>
                  </TableCell>
                  <TableCell>
                    {problem.difficultyTitle ? (
                      <Chip label={problem.difficultyTitle} size="small" color="secondary" variant="outlined" />
                    ) : (
                      '-'
                    )}
                  </TableCell>
                  <TableCell>
                    <Stack direction="row" spacing={0.5} flexWrap="wrap" useFlexGap>
                      {(problem.tags ?? []).map((tag) => (
                        <Chip key={`${problem.id}-${tag.id}`} size="small" label={tag.name} />
                      ))}
                    </Stack>
                  </TableCell>
                  <TableCell align="right">{problem.solved ?? 0}</TableCell>
                  <TableCell align="right">{problem.attemptsCount ?? 0}</TableCell>
                </TableRow>
              ))}
              {!isLoading && rows.length === 0 && (
                <TableRow>
                  <TableCell colSpan={5}>
                    <Box py={4} textAlign="center">
                      <Typography variant="body2" color="text.secondary">
                        {t('problems.emptyState')}
                      </Typography>
                    </Box>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>

          {totalPages > 1 && (
            <>
              <Divider />
              <Box display="flex" justifyContent="flex-end">
                <Pagination color="primary" page={page} count={totalPages} onChange={(_, newPage) => onPageChange(newPage)} />
              </Box>
            </>
          )}
        </Stack>
      </CardContent>
    </Card>
  );
};

export default ProblemsTable;

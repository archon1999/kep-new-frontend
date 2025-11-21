import {
  Box,
  Card,
  CardContent,
  Chip,
  LinearProgress,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TablePagination,
  TableRow,
  Typography,
} from '@mui/material';
import { useTranslation } from 'react-i18next';
import { PageResult, Problem } from '../../domain';

interface Props {
  pageResult?: PageResult<Problem>;
  loading?: boolean;
  onPageChange: (page: number) => void;
  onPageSizeChange: (pageSize: number) => void;
}

const ProblemsTable = ({ pageResult, loading, onPageChange, onPageSizeChange }: Props) => {
  const { t } = useTranslation();

  return (
    <Card variant="outlined">
      {loading ? <LinearProgress /> : null}
      <CardContent>
        <Stack spacing={2} direction="column">
          <Typography variant="h6" fontWeight={700}>
            {t('problems.table.title')}
          </Typography>

          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell>{t('problems.table.columns.title')}</TableCell>
                <TableCell>{t('problems.table.columns.difficulty')}</TableCell>
                <TableCell>{t('problems.table.columns.solved')}</TableCell>
                <TableCell>{t('problems.table.columns.attempts')}</TableCell>
                <TableCell>{t('problems.table.columns.tags')}</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {(pageResult?.data ?? []).map((problem) => (
                <TableRow key={problem.id} hover>
                  <TableCell>
                    <Stack spacing={0.5} direction="column">
                      <Typography variant="subtitle1" fontWeight={700}>
                        {problem.title}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {problem.authorUsername}
                      </Typography>
                    </Stack>
                  </TableCell>
                  <TableCell>
                    <Chip label={problem.difficultyTitle || problem.difficulty} size="small" />
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2">{problem.solved}</Typography>
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2">{problem.attemptsCount}</Typography>
                  </TableCell>
                  <TableCell>
                    <Stack direction="row" spacing={0.5} flexWrap="wrap" useFlexGap>
                      {problem.tags.map((tag) => (
                        <Chip key={tag.id} label={tag.name} size="small" variant="outlined" />
                      ))}
                    </Stack>
                  </TableCell>
                </TableRow>
              ))}
              {!loading && (pageResult?.data?.length ?? 0) === 0 ? (
                <TableRow>
                  <TableCell colSpan={5}>
                    <Box py={2} textAlign="center">
                      <Typography variant="body2" color="text.secondary">
                        {t('problems.table.empty')}
                      </Typography>
                    </Box>
                  </TableCell>
                </TableRow>
              ) : null}
            </TableBody>
          </Table>

          <TablePagination
            component="div"
            page={(pageResult?.page ?? 1) - 1}
            onPageChange={(_, page) => onPageChange(page + 1)}
            rowsPerPage={pageResult?.pageSize ?? 20}
            onRowsPerPageChange={(event) => onPageSizeChange(Number(event.target.value))}
            rowsPerPageOptions={[10, 20, 50]}
            count={pageResult?.total ?? 0}
          />
        </Stack>
      </CardContent>
    </Card>
  );
};

export default ProblemsTable;

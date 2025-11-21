import { useMemo, useState } from 'react';
import { Link as RouterLink, useParams, useSearchParams } from 'react-router-dom';
import {
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  FormControl,
  Grid,
  InputLabel,
  LinearProgress,
  MenuItem,
  Select,
  Skeleton,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
  TextField,
  Typography,
  alpha,
  useTheme,
} from '@mui/material';
import { useTranslation } from 'react-i18next';
import IconifyIcon from 'shared/components/base/IconifyIcon';
import CustomTablePaginationAction from 'shared/components/pagination/CustomTablePaginationAction';
import { responsivePagePaddingSx } from 'shared/lib/styles';
import { useAttemptVerdicts, useAttemptsList, useProblemLanguages } from '../../application/queries';
import { AttemptsListParams } from '../../domain/ports/problems.repository';
import { getResourceById, getResourceByUsername, resources } from 'app/routes/resources';
import { useAuth } from 'app/providers/AuthProvider';

interface AttemptsFilterState {
  username: string;
  problemId: string;
  verdict: string;
  lang: string;
}

const ProblemsAttemptsPage = () => {
  const { t } = useTranslation();
  const theme = useTheme();
  const { currentUser } = useAuth();
  const params = useParams<{ username?: string }>();
  const [searchParams] = useSearchParams();

  const initialFilter: AttemptsFilterState = {
    username: params.username ?? searchParams.get('username') ?? '',
    problemId: searchParams.get('problemId') ?? '',
    verdict: searchParams.get('verdict') ?? '',
    lang: searchParams.get('lang') ?? '',
  };

  const [filter, setFilter] = useState<AttemptsFilterState>(initialFilter);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(20);

  const requestParams = useMemo<AttemptsListParams>(() => {
    const problemId = filter.problemId.trim() ? Number(filter.problemId) : NaN;
    const verdict = filter.verdict.trim() ? Number(filter.verdict) : NaN;

    return {
      username: filter.username || undefined,
      problemId: Number.isNaN(problemId) ? undefined : problemId,
      verdict: Number.isNaN(verdict) ? undefined : verdict,
      lang: filter.lang || undefined,
      page,
      pageSize,
      ordering: '-id',
    };
  }, [filter, page, pageSize]);

  const { data: attemptsPage, isLoading, mutate } = useAttemptsList(requestParams);
  const { data: languages } = useProblemLanguages();
  const { data: verdictOptions } = useAttemptVerdicts();

  const attempts = attemptsPage?.data ?? [];
  const total = attemptsPage?.total ?? 0;

  const handleFilterChange = <K extends keyof AttemptsFilterState>(key: K, value: AttemptsFilterState[K]) => {
    setFilter((prev) => ({ ...prev, [key]: value }));
    setPage(1);
  };

  const handleReset = () => {
    setFilter({ username: '', problemId: '', verdict: '', lang: '' });
    setPage(1);
  };

  const handleMyAttempts = () => {
    if (currentUser?.username) {
      handleFilterChange('username', currentUser.username);
    }
  };

  const handlePageChange = (_: unknown, newPage: number) => setPage(newPage + 1);

  const handleRowsPerPageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setPageSize(Number(event.target.value));
    setPage(1);
  };

  const formatDateTime = (value?: string) => {
    if (!value) return '—';
    const date = new Date(value);
    return `${date.toLocaleDateString()} ${date.toLocaleTimeString()}`;
  };

  return (
    <Box sx={responsivePagePaddingSx}>
      <Stack direction="column" spacing={3}>
        <Stack direction="column" spacing={1}>
          <Typography variant="h4" fontWeight={800}>
            {t('problems.attempts.title')}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {t('problems.attempts.subtitle')}
          </Typography>
        </Stack>

        <Card variant="outlined">
          <CardContent>
            <Stack
              direction={{ xs: 'column', sm: 'row' }}
              spacing={1.5}
              justifyContent="space-between"
              alignItems={{ sm: 'center' }}
              mb={2}
            >
              <Stack direction="row" spacing={1}>
                <Button
                  variant="outlined"
                  color="primary"
                  onClick={handleMyAttempts}
                  startIcon={<IconifyIcon icon="mdi:account-circle-outline" width={18} height={18} />}
                >
                  {t('problems.attempts.myAttempts')}
                </Button>
                <Button
                  variant="outlined"
                  color="secondary"
                  onClick={() => mutate()}
                  startIcon={<IconifyIcon icon="mdi:reload" width={18} height={18} />}
                >
                  {t('problems.attempts.refresh')}
                </Button>
              </Stack>

              <Button
                variant="text"
                color="error"
                onClick={handleReset}
                startIcon={<IconifyIcon icon="mdi:close" width={18} height={18} />}
                sx={{ alignSelf: { xs: 'flex-start', sm: 'center' } }}
              >
                {t('problems.attempts.clear')}
              </Button>
            </Stack>

            <Grid container spacing={2}>
              <Grid item xs={12} md={3}>
                <TextField
                  label={t('problems.attempts.problem')}
                  fullWidth
                  size="small"
                  value={filter.problemId}
                  onChange={(event) => handleFilterChange('problemId', event.target.value)}
                  type="number"
                  placeholder="1234"
                />
              </Grid>

              <Grid item xs={12} md={3}>
                <TextField
                  label={t('problems.attempts.user')}
                  fullWidth
                  size="small"
                  value={filter.username}
                  onChange={(event) => handleFilterChange('username', event.target.value)}
                  placeholder="username"
                />
              </Grid>

              <Grid item xs={12} md={3}>
                <FormControl fullWidth size="small">
                  <InputLabel>{t('problems.attempts.language')}</InputLabel>
                  <Select
                    label={t('problems.attempts.language')}
                    value={filter.lang}
                    onChange={(event) => handleFilterChange('lang', event.target.value)}
                  >
                    <MenuItem value="">{t('problems.attempts.anyLanguage')}</MenuItem>
                    {(languages ?? []).map((lang) => (
                      <MenuItem key={lang.lang} value={lang.lang}>
                        <Stack direction="row" spacing={1} alignItems="center">
                          <Chip label={lang.lang.toUpperCase()} size="small" />
                          <Typography variant="body2">{lang.langFull}</Typography>
                        </Stack>
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>

              <Grid item xs={12} md={3}>
                <FormControl fullWidth size="small">
                  <InputLabel>{t('problems.attempts.verdict')}</InputLabel>
                  <Select
                    label={t('problems.attempts.verdict')}
                    value={filter.verdict}
                    onChange={(event) => handleFilterChange('verdict', event.target.value)}
                  >
                    <MenuItem value="">{t('problems.attempts.anyVerdict')}</MenuItem>
                    {(verdictOptions ?? []).map((option) => (
                      <MenuItem key={option.value} value={String(option.value)}>
                        {option.label}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
            </Grid>
          </CardContent>
        </Card>

        <Card variant="outlined">
          {isLoading && <LinearProgress />}
          <CardContent>
            {isLoading && !attempts.length ? (
              <Stack spacing={1.5}>
                {Array.from({ length: 6 }).map((_, idx) => (
                  <Skeleton key={idx} variant="rounded" height={56} />
                ))}
              </Stack>
            ) : attempts.length === 0 ? (
              <Typography variant="body2" color="text.secondary">
                {t('problems.attempts.empty')}
              </Typography>
            ) : (
              <TableContainer>
                <Table size="small">
                  <TableHead>
                    <TableRow>
                      <TableCell>{t('problems.attempts.columns.id')}</TableCell>
                      <TableCell>{t('problems.attempts.columns.submitted')}</TableCell>
                      <TableCell>{t('problems.attempts.columns.lang')}</TableCell>
                      <TableCell>{t('problems.attempts.columns.user')}</TableCell>
                      <TableCell>{t('problems.attempts.columns.problem')}</TableCell>
                      <TableCell>{t('problems.attempts.columns.verdict')}</TableCell>
                      <TableCell align="right">{t('problems.attempts.columns.time')}</TableCell>
                      <TableCell align="right">{t('problems.attempts.columns.memory')}</TableCell>
                      <TableCell align="right">{t('problems.attempts.columns.size')}</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {attempts.map((attempt) => {
                      const isOwner = attempt.user?.username === currentUser?.username;
                      const rowBackground = isOwner ? alpha(theme.palette.primary.main, 0.06) : undefined;
                      return (
                        <TableRow key={attempt.id} sx={{ backgroundColor: rowBackground }}>
                          <TableCell width={80}>{attempt.id}</TableCell>
                          <TableCell width={160}>{formatDateTime(attempt.created)}</TableCell>
                          <TableCell width={120}>
                            <Chip size="small" label={attempt.lang.toUpperCase()} />
                          </TableCell>
                          <TableCell width={180}>
                            <Typography
                              component={RouterLink}
                              to={getResourceByUsername(resources.UserProfile, attempt.user.username)}
                              sx={{ textDecoration: 'none', color: 'text.primary', fontWeight: 700 }}
                            >
                              {attempt.user.username}
                            </Typography>
                          </TableCell>
                          <TableCell>
                            <Typography
                              component={RouterLink}
                              to={getResourceById(resources.Problem, attempt.problemId)}
                              sx={{ textDecoration: 'none', color: 'primary.main', fontWeight: 700 }}
                            >
                              {attempt.contestProblemSymbol ? `${attempt.contestProblemSymbol}. ` : `${attempt.problemId}. `}
                              {attempt.problemTitle}
                            </Typography>
                          </TableCell>
                          <TableCell width={160}>
                            <Chip
                              size="small"
                              color={attempt.verdict === 1 ? 'success' : attempt.verdict === -1 ? 'warning' : 'default'}
                              label={attempt.verdictTitle || t('problems.attempts.unknownVerdict')}
                            />
                          </TableCell>
                          <TableCell align="right" width={120}>
                            {attempt.time ?? '—'} {t('problems.attempts.ms')}
                          </TableCell>
                          <TableCell align="right" width={120}>
                            {attempt.memory ?? '—'} {t('problems.attempts.kb')}
                          </TableCell>
                          <TableCell align="right" width={120}>
                            {attempt.sourceCodeSize ?? '—'} B
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </TableContainer>
            )}
          </CardContent>
          {attempts.length > 0 && (
            <TablePagination
              component="div"
              count={total}
              page={page - 1}
              onPageChange={handlePageChange}
              rowsPerPage={pageSize}
              rowsPerPageOptions={[10, 20, 50]}
              onRowsPerPageChange={handleRowsPerPageChange}
              ActionsComponent={CustomTablePaginationAction}
            />
          )}
        </Card>
      </Stack>
    </Box>
  );
};

export default ProblemsAttemptsPage;

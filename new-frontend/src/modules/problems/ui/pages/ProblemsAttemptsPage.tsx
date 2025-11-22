import { useMemo, useState } from 'react';
import { useParams, useSearchParams } from 'react-router-dom';
import {
  Autocomplete,
  Avatar,
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  FormControl,
  InputLabel,
  LinearProgress,
  Menu,
  MenuItem,
  Select,
  Stack,
  Typography,
} from '@mui/material';
import { GridPaginationModel } from '@mui/x-data-grid';
import { useTranslation } from 'react-i18next';
import IconifyIcon from 'shared/components/base/IconifyIcon';
import { responsivePagePaddingSx } from 'shared/lib/styles';
import { problemsQueries, useAttemptVerdicts, useAttemptsList, useProblemLanguages } from '../../application/queries';
import { AttemptsListParams } from '../../domain/ports/problems.repository';
import { resources } from 'app/routes/resources';
import { useAuth } from 'app/providers/AuthProvider';
import { usersApiClient } from 'modules/users/data-access/api/users.client';
import StyledTextField from 'shared/components/styled/StyledTextField';
import useSWR from 'swr';
import PageHeader from 'shared/components/sections/common/PageHeader';
import ProblemsAttemptsTable from '../components/ProblemsAttemptsTable.tsx';

interface AttemptsFilterState {
  username: string;
  problemId: string;
  verdict: string;
  lang: string;
}

const ProblemsAttemptsPage = () => {
  const { t } = useTranslation();
  const { currentUser } = useAuth();
  const params = useParams<{ username?: string }>();
  const [searchParams] = useSearchParams();
  const [filtersAnchorEl, setFiltersAnchorEl] = useState<null | HTMLElement>(null);

  const initialFilter: AttemptsFilterState = {
    username: params.username ?? searchParams.get('username') ?? '',
    problemId: searchParams.get('problemId') ?? '',
    verdict: searchParams.get('verdict') ?? '',
    lang: searchParams.get('lang') ?? '',
  };

  const [filter, setFilter] = useState<AttemptsFilterState>(initialFilter);
  const [paginationModel, setPaginationModel] = useState<GridPaginationModel>({ page: 0, pageSize: 20 });
  const [problemInput, setProblemInput] = useState('');
  const [userInput, setUserInput] = useState('');

  const requestParams = useMemo<AttemptsListParams>(() => {
    const problemId = filter.problemId.trim() ? Number(filter.problemId) : NaN;
    const verdict = filter.verdict.trim() ? Number(filter.verdict) : NaN;

    return {
      username: filter.username || undefined,
      problemId: Number.isNaN(problemId) ? undefined : problemId,
      verdict: Number.isNaN(verdict) ? undefined : verdict,
      lang: filter.lang || undefined,
      page: paginationModel.page + 1,
      pageSize: paginationModel.pageSize,
      ordering: '-id',
    };
  }, [filter, paginationModel.page, paginationModel.pageSize]);

  const { data: attemptsPage, isLoading, mutate } = useAttemptsList(requestParams);
  const { data: languages } = useProblemLanguages();
  const { data: verdictOptions } = useAttemptVerdicts();

  const attempts = attemptsPage?.data ?? [];
  const total = attemptsPage?.total ?? 0;

  const handleFilterChange = <K extends keyof AttemptsFilterState>(
    key: K,
    value: AttemptsFilterState[K],
  ) => {
    setFilter((prev) => ({ ...prev, [key]: value }));
    setPaginationModel((prev) => ({ ...prev, page: 0 }));
  };

  const handleReset = () => {
    setFilter({ username: '', problemId: '', verdict: '', lang: '' });
    setPaginationModel((prev) => ({ ...prev, page: 0 }));
  };

  const handleMyAttempts = () => {
    if (currentUser?.username) {
      handleFilterChange('username', currentUser.username);
    }
  };

  const handlePaginationChange = (model: GridPaginationModel) => setPaginationModel(model);

  const filtersOpen = Boolean(filtersAnchorEl);

  const problemSuggestionsFetcher = async ([, search]: [string, string]) => {
    const term = (search ?? '').trim();
    const pageResult = await problemsQueries.problemsRepository.list({
      search: term || undefined,
      page: 1,
      pageSize: 10,
      ordering: 'id',
    });
    return pageResult.data.map((item): { id: number; title: string } => ({ id: item.id, title: item.title }));
  };

  const userSuggestionsFetcher = async ([, search]: [string, string]) => {
    const term = (search ?? '').trim();
    const response = await usersApiClient.list({ page: 1, pageSize: 10, search: term || undefined });
    return (response?.data ?? []).map((item) => ({
      username: item.username ?? '',
      fullName: `${item.firstName ?? ''} ${item.lastName ?? ''}`.trim(),
      avatar: item.avatar ?? (item as any).photo,
    }));
  };

  const { data: problemOptions = [] } = useSWR(['attempts-problem-options', problemInput], problemSuggestionsFetcher);
  const { data: userOptions = [] } = useSWR(['attempts-user-options', userInput], userSuggestionsFetcher);

  const selectedProblem = useMemo(
    () =>
      problemOptions.find((option) => String(option.id) === filter.problemId) ??
      (filter.problemId
        ? {
            id: Number(filter.problemId),
            title: `${filter.problemId}`,
          }
        : null),
    [problemOptions, filter.problemId],
  );

  const selectedUser = useMemo(() => {
    if (!filter.username) return null;
    return (
      userOptions.find((option) => option.username === filter.username) ?? {
        username: filter.username,
        fullName: '',
        avatar: undefined,
      }
    );
  }, [userOptions, filter.username]);

  return (
    <Box sx={responsivePagePaddingSx}>
      <Stack direction="column" spacing={3}>
          <PageHeader
            title={t('problems.attempts.title')}
            breadcrumb={[
              { label: t('problems.title'), url: resources.Problems },
              { label: t('problems.attempts.title'), active: true },
          ]}
          actionComponent={
            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1}>
              <Button
                variant="contained"
                color="primary"
                onClick={handleMyAttempts}
                startIcon={<IconifyIcon icon="mdi:account-circle-outline" width={18} height={18} />}
              >
                {t('problems.attempts.myAttempts')}
              </Button>
              <Button
                variant="outlined"
                color="primary"
                onClick={() => mutate()}
                startIcon={<IconifyIcon icon="mdi:reload" width={18} height={18} />}
              >
                {t('problems.attempts.refresh')}
              </Button>
              <Button
                id="attempts-filters-button"
                variant="outlined"
                color="secondary"
                onClick={(event) => setFiltersAnchorEl(event.currentTarget)}
                startIcon={<IconifyIcon icon="mdi:filter-variant" width={18} height={18} />}
                aria-haspopup="true"
                aria-expanded={filtersOpen ? 'true' : undefined}
                aria-controls={filtersOpen ? 'attempts-filters-menu' : undefined}
              >
                {t('problems.filterTitle')}
              </Button>
              <Button
                variant="text"
                color="error"
                onClick={handleReset}
                startIcon={<IconifyIcon icon="mdi:close" width={18} height={18} />}
              >
                {t('problems.attempts.clear')}
              </Button>
            </Stack>
          }
        />

        <Card variant="outlined">
          <CardContent>
            <Menu
              id="attempts-filters-menu"
              anchorEl={filtersAnchorEl}
              open={filtersOpen}
              onClose={() => setFiltersAnchorEl(null)}
              anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
              transformOrigin={{ vertical: 'top', horizontal: 'right' }}
              MenuListProps={{ disablePadding: true }}
              PaperProps={{ sx: { p: 2, width: 360 } }}
            >
              <Stack direction="column" spacing={2}>
                <Autocomplete
                  options={problemOptions}
                  value={selectedProblem}
                  onChange={(_, value) => handleFilterChange('problemId', value ? String(value.id) : '')}
                  onInputChange={(_, value) => setProblemInput(value)}
                  getOptionLabel={(option) => (`${option.id}. ${option.title}`).trim()}
                  filterOptions={(opts) => opts}
                  renderOption={(props, option) => (
                    <li {...props} key={option.id}>
                      <Stack direction="row" spacing={1} alignItems="center">
                        <Typography variant="body2" fontWeight={700}>
                          {option.id}
                        </Typography>
                        <Typography variant="body2">{option.title}</Typography>
                      </Stack>
                    </li>
                  )}
                  renderInput={(params) => (
                    <StyledTextField {...params} label={t('problems.attempts.problem')} placeholder="1234" />
                  )}
                  isOptionEqualToValue={(option, value) => option.id === value.id}
                  blurOnSelect
                  clearOnBlur={false}
                />

                <Autocomplete
                  options={userOptions}
                  value={selectedUser}
                  onChange={(_, value) => handleFilterChange('username', value?.username ?? '')}
                  onInputChange={(_, value) => setUserInput(value)}
                  getOptionLabel={(option) =>
                    option.fullName ? `${option.username} (${option.fullName})` : option.username
                  }
                  filterOptions={(opts) => opts}
                  renderOption={(props, option) => (
                    <li {...props} key={option.username}>
                      <Stack direction="row" spacing={1} alignItems="center">
                        <Avatar src={option.avatar} alt={option.username} sx={{ width: 28, height: 28 }} />
                        <Stack spacing={0.25}>
                          <Typography variant="body2" fontWeight={700}>
                            {option.username}
                          </Typography>
                          {option.fullName ? (
                            <Typography variant="caption" color="text.secondary">
                              {option.fullName}
                            </Typography>
                          ) : null}
                        </Stack>
                      </Stack>
                    </li>
                  )}
                  renderInput={(params) => (
                    <StyledTextField {...params} label={t('problems.attempts.user')} placeholder="username" />
                  )}
                  isOptionEqualToValue={(option, value) => option.username === value.username}
                  blurOnSelect
                  clearOnBlur={false}
                />

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
              </Stack>
            </Menu>
          </CardContent>
        </Card>

        <Card variant="outlined">
          {isLoading && <LinearProgress />}
          <ProblemsAttemptsTable
            attempts={attempts}
            total={total}
            paginationModel={paginationModel}
            onPaginationChange={handlePaginationChange}
            isLoading={isLoading}
            onRerun={() => mutate()}
          />
        </Card>
      </Stack>
    </Box>
  );
};

export default ProblemsAttemptsPage;

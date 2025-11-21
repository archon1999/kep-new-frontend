import { useMemo, useState } from 'react';
import {
  Box,
  Button,
  Card,
  CardContent,
  CardHeader,
  Chip,
  Divider,
  FormControl,
  FormControlLabel,
  InputLabel,
  LinearProgress,
  List,
  ListItemButton,
  ListItemText,
  MenuItem,
  Select,
  Skeleton,
  Stack,
  Switch,
  Tab,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
  TableSortLabel,
  Tabs,
  TextField,
  Typography,
  alpha,
  useTheme,
  Grid,
} from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import IconifyIcon from 'shared/components/base/IconifyIcon.tsx';
import { responsivePagePaddingSx } from 'shared/lib/styles';
import CustomTablePaginationAction from 'shared/components/pagination/CustomTablePaginationAction.tsx';
import { useAuth } from 'app/providers/AuthProvider.tsx';
import { getResourceById, resources } from 'app/routes/resources.ts';
import {
  useLastContestProblems,
  useMostViewedProblems,
  useProblemCategories,
  useProblemLanguages,
  useProblemsList,
  useUserProblemsAttempts,
  useUserProblemsRating,
} from '../../application/queries.ts';
import {
  DifficultyBreakdown,
  ProblemAttemptSummary,
  ProblemCategory,
  ProblemLanguageOption,
  ProblemListItem,
} from '../../domain/entities/problem.entity.ts';
import { ProblemsListParams } from '../../domain/ports/problems.repository.ts';

const orderingOptions = [
  { label: 'problems.orderNewest', value: '-id' },
  { label: 'problems.orderOldest', value: 'id' },
  { label: 'problems.orderEasiest', value: 'difficulty,-solved' },
  { label: 'problems.orderHardest', value: '-difficulty,solved' },
  { label: 'problems.orderMostSolved', value: '-solved' },
  { label: 'problems.orderLeastSolved', value: 'solved' },
];

const statusOptions = [
  { label: 'problems.statusUnknown', value: 3, icon: 'mdi:minus', color: 'warning.main' },
  { label: 'problems.statusSolved', value: 1, icon: 'mdi:check', color: 'success.main' },
  { label: 'problems.statusUnsolved', value: 2, icon: 'mdi:close', color: 'error.main' },
];

const difficulties = [
  { value: 1, label: 'problems.difficulty.beginner' },
  { value: 2, label: 'problems.difficulty.basic' },
  { value: 3, label: 'problems.difficulty.normal' },
  { value: 4, label: 'problems.difficulty.medium' },
  { value: 5, label: 'problems.difficulty.advanced' },
  { value: 6, label: 'problems.difficulty.hard' },
  { value: 7, label: 'problems.difficulty.extremal' },
];

const initialFilter: ProblemsListParams = {
  ordering: '-id',
  page: 1,
  pageSize: 20,
  tags: [],
};

const ProblemsListPage = () => {
  const { t } = useTranslation();
  const theme = useTheme();
  const { currentUser } = useAuth();

  const [filter, setFilter] = useState<ProblemsListParams>(initialFilter);
  const [activeTab, setActiveTab] = useState('attempts');

  const { data: problemsPage, isLoading } = useProblemsList(filter);
  const { data: languages } = useProblemLanguages();
  const { data: categories } = useProblemCategories();
  const { data: mostViewed, isLoading: isMostViewedLoading } = useMostViewedProblems();
  const { data: lastContest, isLoading: isLastContestLoading } = useLastContestProblems();
  const { data: attempts, isLoading: isAttemptsLoading } = useUserProblemsAttempts(currentUser?.username ?? undefined, 10);
  const { data: rating } = useUserProblemsRating(currentUser?.username ?? undefined);

  const problems = problemsPage?.data ?? [];
  const total = problemsPage?.total ?? 0;

  const difficultyMap = useMemo(
    () => new Map(difficulties.map((item) => [item.value, item.label])),
    [],
  );

  const handleFilterChange = <K extends keyof ProblemsListParams>(key: K, value: ProblemsListParams[K]) => {
    setFilter((prev) => ({ ...prev, [key]: value, page: 1 }));
  };

  const handlePageChange = (_: unknown, page: number) => {
    setFilter((prev) => ({ ...prev, page: page + 1 }));
  };

  const handleRowsPerPageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setFilter((prev) => ({ ...prev, pageSize: Number(event.target.value), page: 1 }));
  };

  const toggleTag = (tagId: number) => {
    setFilter((prev) => {
      const currentTags = prev.tags ?? [];
      const hasTag = currentTags.includes(tagId);
      const nextTags = hasTag ? currentTags.filter((id) => id !== tagId) : [...currentTags, tagId];
      return { ...prev, tags: nextTags, page: 1 };
    });
  };

  const renderDifficultyBadge = (problem: ProblemListItem) => (
    <Chip
      size="small"
      label={problem.difficultyTitle || t(difficultyMap.get(problem.difficulty) || '')}
      color="default"
      sx={{
        bgcolor: theme.palette.grey[100],
        fontWeight: 600,
        textTransform: 'capitalize',
      }}
    />
  );

  const renderProblemBadges = (problem: ProblemListItem) => (
    <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
      {problem.hasSolution && (
        <Chip size="small" color="success" label={t('problems.solution')} variant="outlined" />
      )}
      {!problem.hasChecker && (
        <Chip size="small" color="warning" label={t('problems.checkerMissing')} variant="outlined" />
      )}
      {problem.hidden && (
        <Chip size="small" color="info" label={t('problems.hidden')} variant="outlined" />
      )}
    </Stack>
  );

  const renderTags = (problem: ProblemListItem) => (
    <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
      {problem.tags.map((tag) => (
        <Chip
          key={`${problem.id}-${tag.id}`}
          size="small"
          label={tag.name}
          onClick={() => toggleTag(tag.id)}
          color="primary"
          variant="outlined"
        />
      ))}
    </Stack>
  );

  const getRowBackground = (problem: ProblemListItem) => {
    if (problem.userInfo?.hasSolved) {
      return alpha(theme.palette.success.main, 0.12);
    }
    if (problem.userInfo?.hasAttempted) {
      return alpha(theme.palette.error.main, 0.06);
    }
    return undefined;
  };

  return (
    <Box sx={responsivePagePaddingSx}>
      <Stack direction="column" spacing={4}>
        <Stack direction="column" spacing={1}>
          <Typography variant="h4" fontWeight={800}>
            {t('problems.title')}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {t('problems.subtitle')}
          </Typography>
        </Stack>

        <Grid container spacing={3}>
          <Grid item xs={12} md={8}>
            <Stack direction="column" spacing={3}>
              <FilterCard
                languages={languages ?? []}
                categories={categories ?? []}
                filter={filter}
                total={total}
                onChange={handleFilterChange}
              />
              <ProblemsTable
                problems={problems}
                isLoading={isLoading}
                filter={filter}
                total={total}
                difficultyMap={difficultyMap}
                onChange={handleFilterChange}
                onPageChange={handlePageChange}
                onRowsPerPageChange={handleRowsPerPageChange}
                renderDifficultyBadge={renderDifficultyBadge}
                renderProblemBadges={renderProblemBadges}
                renderTags={renderTags}
                getRowBackground={getRowBackground}
              />
            </Stack>
          </Grid>

          <Grid item xs={12} md={4}>
            <Stack direction="column" spacing={3}>
              {currentUser && (
                <SummaryCard
                  solved={rating?.solved ?? 0}
                  rating={rating?.rating ?? 0}
                  rank={rating?.rank ?? 0}
                  usersCount={rating?.usersCount ?? 0}
                />
              )}

              {currentUser && (
                <DifficultiesCard difficulties={rating?.difficulties} isLoading={!rating} />
              )}

              <TabsCard
                activeTab={activeTab}
                onTabChange={setActiveTab}
                attempts={{
                  isLoading: isAttemptsLoading,
                  items: attempts ?? [],
                }}
                lastContest={{
                  isLoading: isLastContestLoading,
                  data: lastContest,
                }}
                mostViewed={{
                  isLoading: isMostViewedLoading,
                  items: mostViewed ?? [],
                }}
              />
            </Stack>
          </Grid>
        </Grid>
      </Stack>
    </Box>
  );
};

interface FilterCardProps {
  languages: ProblemLanguageOption[];
  categories: ProblemCategory[];
  filter: ProblemsListParams;
  total: number;
  onChange: <K extends keyof ProblemsListParams>(key: K, value: ProblemsListParams[K]) => void;
}

const FilterCard = ({ languages, categories, filter, total, onChange }: FilterCardProps) => {
  const { t } = useTranslation();

  const tags = useMemo(
    () =>
      categories.flatMap((category) =>
        (category.tags ?? []).map((tag) => ({ ...tag, category: category.title })),
      ),
    [categories],
  );

  return (
    <Card variant="outlined">
      <CardHeader
        title={
          <Stack direction="row" spacing={1} alignItems="center">
            <IconifyIcon icon="mdi:filter" width={20} height={20} />
            <Typography variant="subtitle1" fontWeight={700}>
              {t('problems.filterTitle')}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              ({total})
            </Typography>
          </Stack>
        }
      />
      <CardContent>
        <Stack direction="column" spacing={2}>
          <TextField
            label={t('problems.searchPlaceholder')}
            value={filter.search ?? ''}
            onChange={(event) => onChange('search', event.target.value)}
            size="small"
            fullWidth
          />

          <Grid container spacing={2}>
            <Grid item xs={12} sm={6} md={4}>
              <FormControl fullWidth size="small">
                <InputLabel>{t('problems.orderBy')}</InputLabel>
                <Select
                  label={t('problems.orderBy')}
                  value={filter.ordering ?? ''}
                  onChange={(event) => onChange('ordering', event.target.value as string)}
                >
                  {orderingOptions.map((option) => (
                    <MenuItem key={option.value} value={option.value}>
                      {t(option.label)}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>

            <Grid item xs={12} sm={6} md={4}>
              <FormControl fullWidth size="small">
                <InputLabel>{t('problems.language')}</InputLabel>
                <Select
                  label={t('problems.language')}
                  value={filter.lang ?? ''}
                  onChange={(event) =>
                    onChange('lang', event.target.value === '' ? undefined : (event.target.value as string))
                  }
                >
                  <MenuItem value="">{t('problems.allLanguages')}</MenuItem>
                  {languages.map((item) => (
                    <MenuItem key={item.lang} value={item.lang}>
                      <Stack direction="row" spacing={1} alignItems="center">
                        <Typography variant="body2">{item.langFull}</Typography>
                        <Typography variant="caption" color="text.secondary">
                          {item.lang.toUpperCase()}
                        </Typography>
                      </Stack>
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>

            <Grid item xs={12} sm={6} md={4}>
              <Stack direction="row" alignItems="center" spacing={1} sx={{ height: '100%' }}>
                <FormControlLabel
                  control={
                    <Switch
                      checked={Boolean(filter.favorites)}
                      onChange={(event) => onChange('favorites', event.target.checked)}
                    />
                  }
                  label={t('problems.favoritesOnly')}
                />
              </Stack>
            </Grid>

            <Grid item xs={12} sm={6} md={4}>
              <FormControl fullWidth size="small">
                <InputLabel>{t('problems.category')}</InputLabel>
                <Select
                  label={t('problems.category')}
                  value={filter.category ?? ''}
                  onChange={(event) =>
                    onChange('category', event.target.value === '' ? undefined : Number(event.target.value))
                  }
                >
                  <MenuItem value="">{t('problems.allCategories')}</MenuItem>
                  {categories.map((category) => (
                    <MenuItem key={category.id} value={category.id}>
                      <Stack direction="row" spacing={1} alignItems="center" width="100%">
                        <Typography variant="body2">{category.title}</Typography>
                        <Typography variant="caption" color="text.secondary" sx={{ marginLeft: 'auto' }}>
                          {category.problemsCount ?? 0}
                        </Typography>
                      </Stack>
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>

            <Grid item xs={12} sm={6} md={4}>
              <FormControl fullWidth size="small">
                <InputLabel>{t('problems.tags')}</InputLabel>
                <Select
                  multiple
                  label={t('problems.tags')}
                  value={filter.tags ?? []}
                  onChange={(event) => onChange('tags', event.target.value as number[])}
                  renderValue={(selected) => (
                    <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
                      {(selected as number[]).map((id) => {
                        const tag = tags.find((item) => item.id === id);
                        return <Chip key={id} size="small" label={tag?.name ?? id} />;
                      })}
                    </Stack>
                  )}
                >
                  {tags.map((tag) => (
                    <MenuItem key={tag.id} value={tag.id}>
                      <Stack direction="row" spacing={1} alignItems="center">
                        <Typography variant="body2">{tag.name}</Typography>
                        <Typography variant="caption" color="text.secondary">
                          {tag.category}
                        </Typography>
                      </Stack>
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>

            <Grid item xs={12} sm={6} md={4}>
              <FormControl fullWidth size="small">
                <InputLabel>{t('problems.difficultyLabel')}</InputLabel>
                <Select
                  label={t('problems.difficultyLabel')}
                  value={filter.difficulty ?? ''}
                  onChange={(event) =>
                    onChange('difficulty', event.target.value === '' ? undefined : Number(event.target.value))
                  }
                >
                  <MenuItem value="">{t('problems.allDifficulties')}</MenuItem>
                  {difficulties.map((item) => (
                    <MenuItem key={item.value} value={item.value}>
                      {t(item.label)}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>

            <Grid item xs={12} sm={6} md={4}>
              <FormControl fullWidth size="small">
                <InputLabel>{t('problems.status')}</InputLabel>
                <Select
                  label={t('problems.status')}
                  value={filter.status ?? ''}
                  onChange={(event) =>
                    onChange('status', event.target.value === '' ? undefined : Number(event.target.value))
                  }
                >
                  <MenuItem value="">{t('problems.allStatuses')}</MenuItem>
                  {statusOptions.map((option) => (
                    <MenuItem key={option.value} value={option.value}>
                      <Stack direction="row" spacing={1} alignItems="center">
                        <IconifyIcon icon={option.icon} width={18} height={18} color={option.color as string} />
                        <Typography variant="body2">{t(option.label)}</Typography>
                      </Stack>
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
          </Grid>
        </Stack>
      </CardContent>
    </Card>
  );
};

interface ProblemsTableProps {
  problems: ProblemListItem[];
  isLoading: boolean;
  filter: ProblemsListParams;
  total: number;
  difficultyMap: Map<number, string>;
  onChange: <K extends keyof ProblemsListParams>(key: K, value: ProblemsListParams[K]) => void;
  onPageChange: (event: unknown, page: number) => void;
  onRowsPerPageChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  renderDifficultyBadge: (problem: ProblemListItem) => React.ReactNode;
  renderProblemBadges: (problem: ProblemListItem) => React.ReactNode;
  renderTags: (problem: ProblemListItem) => React.ReactNode;
  getRowBackground: (problem: ProblemListItem) => string | undefined;
}

const ProblemsTable = ({
  problems,
  isLoading,
  filter,
  total,
  onChange,
  onPageChange,
  onRowsPerPageChange,
  renderDifficultyBadge,
  renderProblemBadges,
  renderTags,
  getRowBackground,
}: ProblemsTableProps) => {
  const { t } = useTranslation();

  const getOrderingState = (column: string) => {
    const value = filter.ordering ?? '';
    const isDesc = value.startsWith('-');
    const clean = isDesc ? value.substring(1) : value;
    return { active: clean === column, direction: isDesc ? 'desc' : 'asc' as const };
  };

  const handleSort = (column: string) => {
    const { active, direction } = getOrderingState(column);
    const nextDirection = active && direction === 'desc' ? 'asc' : 'desc';
    const prefix = nextDirection === 'desc' ? '-' : '';
    onChange('ordering', `${prefix}${column}`);
  };

  return (
    <Card variant="outlined">
      <CardContent>
        {isLoading ? (
          <Stack direction="column" spacing={2}>
            {Array.from({ length: 5 }).map((_, idx) => (
              <Skeleton key={idx} variant="rectangular" height={54} />
            ))}
          </Stack>
        ) : problems.length === 0 ? (
          <Box sx={{ textAlign: 'center', py: 6 }}>
            <Typography variant="subtitle1" fontWeight={700}>
              {t('problems.emptyTitle')}
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
              {t('problems.emptySubtitle')}
            </Typography>
          </Box>
        ) : (
          <TableContainer>
            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell>
                    <TableSortLabel
                      active={getOrderingState('id').active}
                      direction={getOrderingState('id').direction}
                      onClick={() => handleSort('id')}
                    >
                      ID
                    </TableSortLabel>
                  </TableCell>
                  <TableCell>
                    <TableSortLabel
                      active={getOrderingState('title').active}
                      direction={getOrderingState('title').direction}
                      onClick={() => handleSort('title')}
                    >
                      <Stack direction="row" spacing={1} alignItems="center">
                        <IconifyIcon icon="mdi:format-text" width={18} height={18} />
                        <Typography variant="body2" fontWeight={600}>
                          {t('problems.titleColumn')}
                        </Typography>
                      </Stack>
                    </TableSortLabel>
                  </TableCell>
                  <TableCell>
                    <Stack direction="row" spacing={1} alignItems="center">
                      <IconifyIcon icon="mdi:tag" width={18} height={18} />
                      <Typography variant="body2" fontWeight={600}>
                        {t('problems.tags')}
                      </Typography>
                    </Stack>
                  </TableCell>
                  <TableCell align="center">
                    <TableSortLabel
                      active={getOrderingState('difficulty').active}
                      direction={getOrderingState('difficulty').direction}
                      onClick={() => handleSort('difficulty')}
                    >
                      <Stack direction="row" spacing={1} alignItems="center" justifyContent="center">
                        <IconifyIcon icon="mdi:chart-line" width={18} height={18} />
                        <Typography variant="body2" fontWeight={600}>
                          {t('problems.difficultyLabel')}
                        </Typography>
                      </Stack>
                    </TableSortLabel>
                  </TableCell>
                  <TableCell align="center">
                    <TableSortLabel
                      active={getOrderingState('solved').active}
                      direction={getOrderingState('solved').direction}
                      onClick={() => handleSort('solved')}
                    >
                      <Stack direction="row" spacing={1} alignItems="center" justifyContent="center">
                        <IconifyIcon icon="mdi:counter" width={18} height={18} />
                        <Typography variant="body2" fontWeight={600}>
                          {t('problems.attempts')}
                        </Typography>
                      </Stack>
                    </TableSortLabel>
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {problems.map((problem) => (
                  <TableRow key={problem.id} sx={{ backgroundColor: getRowBackground(problem) }}>
                    <TableCell width={70}>{problem.id}</TableCell>
                    <TableCell>
                      <Stack direction="column" spacing={1}>
                        <Button
                          component={RouterLink}
                          to={getResourceById(resources.Problem, problem.id)}
                          variant="text"
                          color="inherit"
                          sx={{ justifyContent: 'flex-start', textTransform: 'none', px: 0 }}
                        >
                          <Typography variant="subtitle2" fontWeight={700}>
                            {problem.title}
                          </Typography>
                        </Button>
                        {renderProblemBadges(problem)}
                        <Stack direction="row" spacing={1} alignItems="center">
                          <IconifyIcon icon="mdi:thumb-up-outline" width={16} height={16} />
                          <Typography variant="caption" color="text.secondary">
                            {problem.likesCount}
                          </Typography>
                          <IconifyIcon icon="mdi:thumb-down-outline" width={16} height={16} />
                          <Typography variant="caption" color="text.secondary">
                            {problem.dislikesCount}
                          </Typography>
                        </Stack>
                      </Stack>
                    </TableCell>
                    <TableCell width={260}>{renderTags(problem)}</TableCell>
                    <TableCell align="center" width={160}>
                      {renderDifficultyBadge(problem)}
                    </TableCell>
                    <TableCell align="center" width={140}>
                      <Typography variant="body2" color="success.main" fontWeight={700}>
                        {problem.solved}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        / {problem.attemptsCount ?? 0}
                      </Typography>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        )}

        {problems.length > 0 && (
          <TablePagination
            component="div"
            count={total}
            page={(filter.page ?? 1) - 1}
            onPageChange={onPageChange}
            rowsPerPage={filter.pageSize ?? 20}
            rowsPerPageOptions={[10, 20, 50]}
            onRowsPerPageChange={onRowsPerPageChange}
            ActionsComponent={CustomTablePaginationAction}
          />
        )}
      </CardContent>
    </Card>
  );
};

interface SummaryCardProps {
  solved: number;
  rating: number;
  rank: number;
  usersCount: number;
}

const SummaryCard = ({ solved, rating, rank, usersCount }: SummaryCardProps) => {
  const { t } = useTranslation();

  return (
    <Card variant="outlined">
      <CardContent>
        <Stack direction="row" spacing={2} justifyContent="space-between">
          <Stack direction="column" spacing={0.5} alignItems="flex-start">
            <Stack direction="row" spacing={0.5} alignItems="center">
              <IconifyIcon icon="mdi:check-decagram" width={18} height={18} color="var(--mui-palette-success-main)" />
              <Typography variant="subtitle2" fontWeight={700}>
                {t('problems.summarySolved', { value: solved })}
              </Typography>
            </Stack>
            <Typography variant="caption" color="text.secondary">
              {t('problems.summarySolvedLabel')}
            </Typography>
          </Stack>

          <Stack direction="column" spacing={0.5} alignItems="flex-start">
            <Stack direction="row" spacing={0.5} alignItems="center">
              <IconifyIcon icon="mdi:star" width={18} height={18} color="var(--mui-palette-warning-main)" />
              <Typography variant="subtitle2" fontWeight={700}>
                {t('problems.summaryRating', { value: rating })}
              </Typography>
            </Stack>
            <Typography variant="caption" color="text.secondary">
              {t('problems.summaryRatingLabel')}
            </Typography>
          </Stack>

          <Stack direction="column" spacing={0.5} alignItems="flex-start">
            <Stack direction="row" spacing={0.5} alignItems="center">
              <IconifyIcon icon="mdi:trophy-variant" width={18} height={18} color="var(--mui-palette-info-main)" />
              <Typography variant="subtitle2" fontWeight={700}>
                {t('problems.summaryRank', { rank, total: usersCount })}
              </Typography>
            </Stack>
            <Typography variant="caption" color="text.secondary">
              {t('problems.summaryRankLabel')}
            </Typography>
          </Stack>
        </Stack>
      </CardContent>
    </Card>
  );
};

interface DifficultiesCardProps {
  difficulties?: DifficultyBreakdown;
  isLoading: boolean;
}

const DifficultiesCard = ({ difficulties, isLoading }: DifficultiesCardProps) => {
  const { t } = useTranslation();

  const entries = [
    { key: 'beginner', totalKey: 'allBeginner', label: t('problems.difficulty.beginner') },
    { key: 'basic', totalKey: 'allBasic', label: t('problems.difficulty.basic') },
    { key: 'normal', totalKey: 'allNormal', label: t('problems.difficulty.normal') },
    { key: 'medium', totalKey: 'allMedium', label: t('problems.difficulty.medium') },
    { key: 'advanced', totalKey: 'allAdvanced', label: t('problems.difficulty.advanced') },
    { key: 'hard', totalKey: 'allHard', label: t('problems.difficulty.hard') },
    { key: 'extremal', totalKey: 'allExtremal', label: t('problems.difficulty.extremal') },
  ];

  return (
    <Card variant="outlined">
      <CardHeader
        title={
          <Stack direction="row" spacing={1} alignItems="center">
            <IconifyIcon icon="mdi:chart-pie" width={20} height={20} />
            <Typography variant="subtitle1" fontWeight={700}>
              {t('problems.difficultyBreakdown')}
            </Typography>
          </Stack>
        }
      />
      <CardContent>
        {isLoading || !difficulties ? (
          <Stack direction="column" spacing={1}>
            {Array.from({ length: 4 }).map((_, idx) => (
              <Skeleton key={idx} variant="rectangular" height={20} />
            ))}
          </Stack>
        ) : (
          <Stack direction="column" spacing={1.5}>
            <Typography variant="body2" color="text.secondary">
              {t('problems.difficultyOverview', {
                solved: difficulties.totalSolved,
                total: difficulties.totalProblems,
              })}
            </Typography>
            {entries.map((entry) => {
              const solved = (difficulties as any)[entry.key] as number;
              const total = (difficulties as any)[entry.totalKey] as number;
              const percent = total ? Math.min(100, (solved / total) * 100) : 0;

              return (
                <Stack key={entry.key} direction="column" spacing={0.5}>
                  <Stack direction="row" spacing={1} justifyContent="space-between" alignItems="center">
                    <Typography variant="body2" fontWeight={600}>
                      {entry.label}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      {solved} / {total}
                    </Typography>
                  </Stack>
                  <LinearProgress variant="determinate" value={percent} />
                </Stack>
              );
            })}
          </Stack>
        )}
      </CardContent>
    </Card>
  );
};

interface TabContentProps {
  activeTab: string;
  onTabChange: (value: string) => void;
  attempts: { isLoading: boolean; items: ProblemAttemptSummary[] };
  lastContest: { isLoading: boolean; data: any };
  mostViewed: { isLoading: boolean; items: ProblemListItem[] };
}

const TabsCard = ({ activeTab, onTabChange, attempts, lastContest, mostViewed }: TabContentProps) => {
  const { t } = useTranslation();

  const renderAttempts = () => {
    if (attempts.isLoading) {
      return <Skeleton variant="rectangular" height={120} />;
    }

    if (!attempts.items.length) {
      return (
        <Typography variant="body2" color="text.secondary">
          {t('problems.noAttempts')}
        </Typography>
      );
    }

    return (
      <List dense>
        {attempts.items.map((attempt) => (
          <ListItemButton
            key={attempt.id}
            component={RouterLink}
            to={getResourceById(resources.Problem, attempt.problemId)}
          >
            <ListItemText primary={`${attempt.problemId}. ${attempt.problemTitle}`} />
          </ListItemButton>
        ))}
      </List>
    );
  };

  const renderLastContest = () => {
    if (lastContest.isLoading) {
      return <Skeleton variant="rectangular" height={120} />;
    }

    if (!lastContest.data) {
      return (
        <Typography variant="body2" color="text.secondary">
          {t('problems.noLastContest')}
        </Typography>
      );
    }

    return (
      <Stack direction="column" spacing={1}>
        <Typography variant="subtitle2" fontWeight={700}>
          {lastContest.data.title}
        </Typography>
        <List dense>
          {(lastContest.data.problems ?? []).map((problem: any) => (
            <ListItemButton
              key={problem.id}
              component={RouterLink}
              to={getResourceById(resources.Problem, problem.id)}
            >
              <ListItemText primary={`${problem.symbol ? `${problem.symbol}. ` : ''}${problem.title}`} />
            </ListItemButton>
          ))}
        </List>
        <Button
          component={RouterLink}
          to={getResourceById(resources.Contest, lastContest.data.id)}
          variant="contained"
          color="primary"
          fullWidth
          size="small"
          sx={{ textTransform: 'none' }}
        >
          {t('problems.goToContest')}
        </Button>
      </Stack>
    );
  };

  const renderMostViewed = () => {
    if (mostViewed.isLoading) {
      return <Skeleton variant="rectangular" height={120} />;
    }

    if (!mostViewed.items.length) {
      return (
        <Typography variant="body2" color="text.secondary">
          {t('problems.noMostViewed')}
        </Typography>
      );
    }

    return (
      <List dense>
        {mostViewed.items.map((problem) => (
          <ListItemButton
            key={problem.id}
            component={RouterLink}
            to={getResourceById(resources.Problem, problem.id)}
          >
            <ListItemText primary={`${problem.id}. ${problem.title}`} />
          </ListItemButton>
        ))}
      </List>
    );
  };

  return (
    <Card variant="outlined">
      <Tabs
        value={activeTab}
        onChange={(_, value) => onTabChange(value)}
        variant="fullWidth"
        textColor="primary"
        indicatorColor="primary"
      >
        <Tab value="attempts" label={t('problems.lastAttempts')} />
        <Tab value="lastContest" label={t('problems.lastContestProblems')} />
        <Tab value="mostViewed" label={t('problems.mostViewed')} />
      </Tabs>
      <Divider />
      <CardContent>
        {activeTab === 'attempts' && renderAttempts()}
        {activeTab === 'lastContest' && renderLastContest()}
        {activeTab === 'mostViewed' && renderMostViewed()}
      </CardContent>
    </Card>
  );
};

export default ProblemsListPage;

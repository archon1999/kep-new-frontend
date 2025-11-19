import { useMemo, useState } from 'react';
import dayjs from 'dayjs';
import { useTranslation } from 'react-i18next';
import {
  Alert,
  Box,
  Button,
  Chip,
  Divider,
  Grid,
  Pagination,
  Skeleton,
  Stack,
  ToggleButton,
  ToggleButtonGroup,
  Typography,
} from '@mui/material';
import IconifyIcon from 'shared/components/base/IconifyIcon';
import {
  useKepcoinEarnHistory,
  useKepcoinSpendHistory,
  useKepcoinSummary,
} from '../../application/queries';
import { KepcoinEarnHistoryItem, KepcoinEarnType, KepcoinSpendHistoryItem, KepcoinSpendType } from '../../domain/entities/kepcoin.entity';

const earnTypeKeyMap: Record<KepcoinEarnType, string> = {
  [KepcoinEarnType.WroteBlog]: 'kepcoinPage.earnTypes.wroteBlog',
  [KepcoinEarnType.WroteProblemSolution]: 'kepcoinPage.earnTypes.wroteProblemSolution',
  [KepcoinEarnType.LoyaltyBonus]: 'kepcoinPage.earnTypes.loyaltyBonus',
  [KepcoinEarnType.BonusFromAdmin]: 'kepcoinPage.earnTypes.bonusFromAdmin',
  [KepcoinEarnType.DailyActivity]: 'kepcoinPage.earnTypes.dailyActivity',
  [KepcoinEarnType.DailyTaskCompletion]: 'kepcoinPage.earnTypes.dailyTaskCompletion',
  [KepcoinEarnType.DailyProblemsRatingWin]: 'kepcoinPage.earnTypes.dailyRatingWinner',
  [KepcoinEarnType.WeeklyProblemsRatingWin]: 'kepcoinPage.earnTypes.weeklyRatingWinner',
  [KepcoinEarnType.MonthlyProblemsRatingWin]: 'kepcoinPage.earnTypes.monthlyRatingWinner',
  [KepcoinEarnType.ContestParticipated]: 'kepcoinPage.earnTypes.contestParticipant',
  [KepcoinEarnType.ArenaParticipated]: 'kepcoinPage.earnTypes.arenaParticipant',
  [KepcoinEarnType.TournamentParticipated]: 'kepcoinPage.earnTypes.tournamentParticipant',
  [KepcoinEarnType.ProjectTaskComplete]: 'kepcoinPage.earnTypes.projectTask',
};

const spendTypeKeyMap: Record<KepcoinSpendType, string> = {
  [KepcoinSpendType.AttemptView]: 'kepcoinPage.spendTypes.attemptView',
  [KepcoinSpendType.AttemptTestView]: 'kepcoinPage.spendTypes.attemptTestView',
  [KepcoinSpendType.ProblemSolution]: 'kepcoinPage.spendTypes.problemSolution',
  [KepcoinSpendType.DoubleRating]: 'kepcoinPage.spendTypes.doubleRating',
  [KepcoinSpendType.CoverPhotoChange]: 'kepcoinPage.spendTypes.coverPhoto',
  [KepcoinSpendType.Course]: 'kepcoinPage.spendTypes.course',
  [KepcoinSpendType.StudyPlan]: 'kepcoinPage.spendTypes.studyPlan',
  [KepcoinSpendType.CodeEditorTesting]: 'kepcoinPage.spendTypes.codeEditorTesting',
  [KepcoinSpendType.SaveRating]: 'kepcoinPage.spendTypes.saveRating',
  [KepcoinSpendType.TestPass]: 'kepcoinPage.spendTypes.testPass',
  [KepcoinSpendType.UserContestCreate]: 'kepcoinPage.spendTypes.userContestCreate',
  [KepcoinSpendType.Project]: 'kepcoinPage.spendTypes.project',
  [KepcoinSpendType.StreakFreeze]: 'kepcoinPage.spendTypes.streakFreeze',
  [KepcoinSpendType.VirtualContest]: 'kepcoinPage.spendTypes.virtualContest',
  [KepcoinSpendType.UnratedContest]: 'kepcoinPage.spendTypes.unratedContest',
  [KepcoinSpendType.AnswerForInput]: 'kepcoinPage.spendTypes.answerForInput',
  [KepcoinSpendType.CheckSamples]: 'kepcoinPage.spendTypes.checkSamples',
  [KepcoinSpendType.Merch]: 'kepcoinPage.spendTypes.merch',
};

const PAGE_SIZE = 10;

type HistoryView = 'earns' | 'spends';

const getDetailText = (detail?: unknown): string | null => {
  if (!detail) {
    return null;
  }

  if (typeof detail === 'string') {
    return detail;
  }

  if (typeof detail === 'number') {
    return detail.toString();
  }

  if (typeof detail === 'object') {
    const possible = detail as Record<string, any>;

    if (typeof possible.description === 'string') {
      return possible.description;
    }

    if (typeof possible.date === 'string') {
      return possible.date;
    }

    if (possible.contest && typeof possible.contest.title === 'string') {
      return possible.contest.title;
    }

    if (possible.arena && typeof possible.arena.title === 'string') {
      return possible.arena.title;
    }

    if (possible.tournament && typeof possible.tournament.title === 'string') {
      return possible.tournament.title;
    }

    if (typeof possible.title === 'string') {
      return possible.title;
    }
  }

  return null;
};

const getHistoryDescription = (
  type: HistoryView,
  item: KepcoinEarnHistoryItem | KepcoinSpendHistoryItem,
  translate: (key: string, params?: Record<string, unknown>) => string,
) => {
  const key = type === 'earns'
    ? earnTypeKeyMap[(item as KepcoinEarnHistoryItem).earnType]
    : spendTypeKeyMap[(item as KepcoinSpendHistoryItem).spendType];
  const base = key ? translate(key) : translate('kepcoinPage.history.defaultLabel');
  const detail = getDetailText(item.detail);

  if (detail) {
    return translate('kepcoinPage.history.detail', { base, detail });
  }

  return base;
};

const KepcoinPage = () => {
  const { t } = useTranslation();
  const [view, setView] = useState<HistoryView>('earns');
  const [page, setPage] = useState(1);

  const { data: summary, isLoading: isSummaryLoading } = useKepcoinSummary();
  const {
    data: earnHistory,
    isLoading: isEarnHistoryLoading,
    error: earnError,
    mutate: reloadEarn,
  } = useKepcoinEarnHistory(page, PAGE_SIZE, view === 'earns');
  const {
    data: spendHistory,
    isLoading: isSpendHistoryLoading,
    error: spendError,
    mutate: reloadSpend,
  } = useKepcoinSpendHistory(page, PAGE_SIZE, view === 'spends');

  const activeHistory = view === 'earns' ? earnHistory : spendHistory;
  const isHistoryLoading = view === 'earns' ? isEarnHistoryLoading : isSpendHistoryLoading;
  const historyError = view === 'earns' ? earnError : spendError;
  const retryHistory = view === 'earns' ? reloadEarn : reloadSpend;

  const balanceLabel = useMemo(() => {
    const formatter = new Intl.NumberFormat();
    return formatter.format(summary?.balance ?? 0);
  }, [summary?.balance]);

  const howToEarnItems = useMemo(
    () => [
      { value: '1', label: t('kepcoinPage.howToEarn.items.dailyActivity') },
      { value: '1-10', label: t('kepcoinPage.howToEarn.items.dailyTasks') },
      { value: '3, 10, 50', label: t('kepcoinPage.howToEarn.items.ratingWinner') },
      { value: '5+', label: t('kepcoinPage.howToEarn.items.competitions') },
      { value: '10-100', label: t('kepcoinPage.howToEarn.items.blog') },
      { value: '1-50', label: t('kepcoinPage.howToEarn.items.problemEditing') },
    ],
    [t],
  );

  const howToSpendItems = useMemo(
    () => [
      { value: '0-14', label: t('kepcoinPage.howToSpend.items.viewAttempt') },
      { value: '1', label: t('kepcoinPage.howToSpend.items.viewTest') },
      { value: '2-50', label: t('kepcoinPage.howToSpend.items.problemSolution') },
      { value: '5', label: t('kepcoinPage.howToSpend.items.coverPhoto') },
      { value: '1', label: t('kepcoinPage.howToSpend.items.passTest') },
      { value: '1-1000', label: t('kepcoinPage.howToSpend.items.course') },
      { value: '10', label: t('kepcoinPage.howToSpend.items.testFunction') },
      { value: '25', label: t('kepcoinPage.howToSpend.items.doubleRating') },
      { value: '25', label: t('kepcoinPage.howToSpend.items.keepRating') },
    ],
    [t],
  );

  const handleViewChange = (_: unknown, nextView: HistoryView | null) => {
    if (!nextView || nextView === view) {
      return;
    }

    setView(nextView);
    setPage(1);
  };

  const handlePageChange = (_: unknown, nextPage: number) => {
    setPage(nextPage);
  };

  const historyItems = activeHistory?.items ?? [];
  const pagesCount = activeHistory?.pagesCount ?? 1;

  return (
    <Box sx={{ p: { xs: 3, md: 5 } }}>
      <Stack direction="column" spacing={5}>
        <Stack spacing={1}>
          {isSummaryLoading ? (
            <Skeleton variant="text" width={240} height={48} />
          ) : (
            <Typography variant="h3" fontWeight={700}>
              {t('kepcoinPage.youHave', { value: balanceLabel })}
            </Typography>
          )}
        </Stack>

        <Grid container spacing={4} alignItems="flex-start">
          <Grid item xs={12} md={7}>
            <Stack spacing={4} divider={<Divider flexItem sx={{ borderColor: 'divider' }} />}>
              <Box>
                <Stack direction="column" spacing={2}>
                  <Stack direction="row" spacing={1.5} flexWrap="wrap" alignItems="center">
                    {isSummaryLoading ? (
                      <Skeleton variant="rounded" width={160} height={36} />
                    ) : (
                      <Chip
                        icon={<IconifyIcon icon="solar:fire-bold-duotone" fontSize={18} />}
                        label={t('kepcoinPage.currentStreak', { value: summary?.streak ?? 0 })}
                        variant="outlined"
                      />
                    )}
                    {isSummaryLoading ? (
                      <Skeleton variant="rounded" width={190} height={36} />
                    ) : (
                      <Chip
                        icon={<IconifyIcon icon="solar:snowflake-line-duotone" fontSize={18} />}
                        label={t('kepcoinPage.streakFreeze.count', { value: summary?.streakFreeze ?? 0 })}
                        color="info"
                        variant="outlined"
                      />
                    )}
                  </Stack>
                  <Typography variant="body2" color="text.secondary">
                    {t('kepcoinPage.streakFreeze.description')}
                  </Typography>
                </Stack>
              </Box>

              <Box>
                <Stack direction="row" justifyContent="space-between" alignItems="center" flexWrap="wrap" gap={2} mb={2}>
                  <Typography variant="h5" fontWeight={700}>
                    {t('kepcoinPage.history.title')}
                  </Typography>
                  <ToggleButtonGroup value={view} exclusive onChange={handleViewChange} size="small">
                    <ToggleButton value="earns">{t('kepcoinPage.history.tabs.earns')}</ToggleButton>
                    <ToggleButton value="spends">{t('kepcoinPage.history.tabs.spends')}</ToggleButton>
                  </ToggleButtonGroup>
                </Stack>

                {isHistoryLoading ? (
                  <Stack spacing={2}>
                    {Array.from({ length: 4 }).map((_, index) => (
                      <Stack key={index} spacing={1.5}>
                        <Skeleton variant="text" width="60%" />
                        <Skeleton variant="text" width="40%" />
                        <Divider />
                      </Stack>
                    ))}
                  </Stack>
                ) : historyError ? (
                  <Alert
                    severity="error"
                    action={
                      <Button color="inherit" size="small" onClick={() => retryHistory()}>
                        {t('kepcoinPage.history.retry')}
                      </Button>
                    }
                  >
                    {t('kepcoinPage.history.error')}
                  </Alert>
                ) : historyItems.length === 0 ? (
                  <Stack spacing={1}>
                    <Typography variant="subtitle1" fontWeight={600}>
                      {t('kepcoinPage.history.emptyTitle')}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {t('kepcoinPage.history.emptySubtitle')}
                    </Typography>
                  </Stack>
                ) : (
                  <Stack direction="column" spacing={2} divider={<Divider flexItem sx={{ borderColor: 'divider' }} />}>
                    {historyItems.map((item) => (
                      <Stack key={item.id} spacing={1.25}>
                        <Stack direction="row" justifyContent="space-between" alignItems="center" flexWrap="wrap" gap={1}>
                          <Stack direction="row" spacing={1} alignItems="center">
                            <IconifyIcon icon="solar:coins-stacks-linear" fontSize={24} color="warning.main" />
                            <Typography variant="h6" color={view === 'earns' ? 'success.main' : 'error.main'}>
                              {`${view === 'earns' ? '+' : '-'}${item.amount}`}
                            </Typography>
                          </Stack>
                          <Typography variant="body2" color="text.secondary">
                            {item.happenedAt
                              ? dayjs(item.happenedAt).format('MMM D, YYYY · HH:mm')
                              : t('kepcoinPage.history.noDate')}
                          </Typography>
                        </Stack>
                        <Typography variant="body1" fontWeight={600}>
                          {getHistoryDescription(view, item, t)}
                        </Typography>
                        {item.note && (
                          <Typography variant="body2" color="text.secondary">
                            {t('kepcoinPage.history.note', { value: item.note })}
                          </Typography>
                        )}
                      </Stack>
                    ))}
                  </Stack>
                )}

                {pagesCount > 1 && (
                  <Box mt={3} display="flex" justifyContent="center">
                    <Pagination count={pagesCount} page={page} onChange={handlePageChange} color="primary" />
                  </Box>
                )}
              </Box>
            </Stack>
          </Grid>

          <Grid item xs={12} md={5}>
            <Stack spacing={4} divider={<Divider flexItem sx={{ borderColor: 'divider' }} />}>
              <Box>
                <Stack direction="column" spacing={2}>
                  <Typography variant="h5" fontWeight={700}>
                    {t('kepcoinPage.howToEarn.title')}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {t('kepcoinPage.howToEarn.description')}
                  </Typography>
                  <Stack direction="column" spacing={1.5} divider={<Divider flexItem sx={{ borderColor: 'divider' }} />}>
                    {howToEarnItems.map((item) => (
                      <Stack key={`${item.value}-${item.label}`} direction="row" spacing={2} alignItems="center">
                        <Chip
                          icon={<IconifyIcon icon="solar:coins-stacks-linear" fontSize={18} />}
                          label={t('kepcoinPage.valueLabel', { value: item.value })}
                          color="warning"
                          variant="outlined"
                          sx={{ minWidth: 120 }}
                        />
                        <Typography variant="body2" color="text.secondary">
                          {item.label}
                        </Typography>
                      </Stack>
                    ))}
                  </Stack>
                </Stack>
              </Box>

              <Box>
                <Stack direction="column" spacing={2}>
                  <Typography variant="h5" fontWeight={700}>
                    {t('kepcoinPage.howToSpend.title')}
                  </Typography>
                  <Stack direction="column" spacing={1.5} divider={<Divider flexItem sx={{ borderColor: 'divider' }} />}>
                    {howToSpendItems.map((item, index) => (
                      <Stack key={`${item.value}-${index}`} direction="row" spacing={2} alignItems="center">
                        <Chip
                          icon={<IconifyIcon icon="solar:wallet-line-duotone" fontSize={18} />}
                          label={t('kepcoinPage.valueLabel', { value: item.value })}
                          variant="outlined"
                          sx={{ minWidth: 120 }}
                        />
                        <Typography variant="body2" color="text.secondary">
                          {item.label}
                        </Typography>
                      </Stack>
                    ))}
                  </Stack>
                </Stack>
              </Box>
            </Stack>
          </Grid>
        </Grid>
      </Stack>
    </Box>
  );
};

export default KepcoinPage;

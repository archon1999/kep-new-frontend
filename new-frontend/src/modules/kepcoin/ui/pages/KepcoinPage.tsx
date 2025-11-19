import { type ChangeEvent, type MouseEvent, useMemo, useState } from 'react';
import { type TFunction } from 'i18next';
import { useTranslation } from 'react-i18next';
import Alert from '@mui/material/Alert';
import Box from '@mui/material/Box';
import Chip from '@mui/material/Chip';
import Divider from '@mui/material/Divider';
import Grid from '@mui/material/Grid';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import Pagination from '@mui/material/Pagination';
import Skeleton from '@mui/material/Skeleton';
import Stack from '@mui/material/Stack';
import ToggleButton from '@mui/material/ToggleButton';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';
import Typography from '@mui/material/Typography';
import dayjs from 'dayjs';
import 'dayjs/locale/ru';
import 'dayjs/locale/uz';
import KepcoinValue from 'shared/components/common/KepcoinValue';
import KepIcon from 'shared/components/base/KepIcon';
import kepcoinImage from 'shared/assets/images/icons/kepcoin.png';
import {
  EarnType,
  KepcoinEarn,
  KepcoinSpend,
  KepcoinTransactionDetail,
  SpendType,
} from '../../domain/entities/kepcoin.entity';
import {
  KEP_COIN_PAGE_SIZE,
  useKepcoinEarns,
  useKepcoinSpends,
  useKepcoinSummary,
} from '../../application/queries';

const ensureStringArray = (value: unknown): string[] => (Array.isArray(value) ? value.map(String) : []);

const formatDateTime = (value: string, locale: string) => {
  if (!value) {
    return '—';
  }
  return dayjs(value).locale(locale).format('MMM D, YYYY · HH:mm');
};

const getDetailValue = <T,>(detail: KepcoinTransactionDetail | null | undefined, path: string[]): T | undefined =>
  path.reduce<unknown>((current, key) => {
    if (current === null || typeof current !== 'object') {
      return undefined;
    }
    return (current as Record<string, unknown>)[key];
  }, detail ?? undefined) as T | undefined;

const getProblemLabel = (detail: KepcoinTransactionDetail | null | undefined) => {
  const id = getDetailValue<string | number>(detail, ['problemId']);
  const title = getDetailValue<string>(detail, ['problemTitle']);
  if (id && title) {
    return `${id}. ${title}`;
  }
  return title ?? (id ? id.toString() : undefined);
};

const getEarnDescription = (earn: KepcoinEarn, t: TFunction) => {
  const detail = earn.detail;
  const date = getDetailValue<string>(detail, ['date']);
  const description = getDetailValue<string>(detail, ['description']);
  const contestTitle = getDetailValue<string>(detail, ['contest', 'title']);
  const arenaTitle = getDetailValue<string>(detail, ['arena', 'title']);

  switch (earn.earnType) {
    case EarnType.WroteBlog:
      return t('kepcoinPage.earns.wroteBlog');
    case EarnType.WroteProblemSolution:
      return t('kepcoinPage.earns.wroteProblemSolution');
    case EarnType.LoyaltyBonus:
      return t('kepcoinPage.earns.loyaltyBonus');
    case EarnType.BonusFromAdmin:
      return t('kepcoinPage.earns.bonusFromAdmin');
    case EarnType.DailyActivity:
      return t('kepcoinPage.earns.dailyActivity', { date: date ?? '—' });
    case EarnType.DailyTaskCompletion:
      return t('kepcoinPage.earns.dailyTaskCompleted', { description: description ?? '—' });
    case EarnType.DailyProblemsRatingWin:
      return t('kepcoinPage.earns.dailyRatingWinner', { date: date ?? '—' });
    case EarnType.WeeklyProblemsRatingWin:
      return t('kepcoinPage.earns.weeklyRatingWinner', { date: date ?? '—' });
    case EarnType.MonthlyProblemsRatingWin:
      return t('kepcoinPage.earns.monthlyRatingWinner', { date: date ?? '—' });
    case EarnType.ContestParticipated:
      return t('kepcoinPage.earns.contestParticipant', { title: contestTitle ?? '—' });
    case EarnType.ArenaParticipated:
      return t('kepcoinPage.earns.arenaParticipant', { title: arenaTitle ?? '—' });
    case EarnType.TournamentParticipated:
      return t('kepcoinPage.earns.tournamentParticipant');
    case EarnType.ProjectTaskComplete:
      return t('kepcoinPage.earns.projectTaskComplete');
    default:
      return description ?? t('kepcoinPage.transactions.unknown');
  }
};

const getSpendDescription = (spend: KepcoinSpend, t: TFunction) => {
  const detail = spend.detail;
  const attemptId = getDetailValue<string | number>(detail, ['attemptId']);
  const testTitle = getDetailValue<string>(detail, ['test', 'title']);
  const problemLabel = getProblemLabel(detail);

  switch (spend.type) {
    case SpendType.AttemptView:
      return t('kepcoinPage.spends.viewAttempt', { id: attemptId ?? '—' });
    case SpendType.AttemptTestView:
      return t('kepcoinPage.spends.viewTestAttempt', { id: attemptId ?? '—' });
    case SpendType.ProblemSolution:
      return t('kepcoinPage.spends.viewProblemSolution', { title: problemLabel ?? '—' });
    case SpendType.DoubleRating:
      return t('kepcoinPage.spends.doubleRating');
    case SpendType.CoverPhotoChange:
      return t('kepcoinPage.spends.changeImage');
    case SpendType.Course:
      return t('kepcoinPage.spends.course');
    case SpendType.StudyPlan:
      return t('kepcoinPage.spends.studyPlan');
    case SpendType.CodeEditorTesting:
      return t('kepcoinPage.spends.codeEditorTesting');
    case SpendType.SaveRating:
      return t('kepcoinPage.spends.saveRating');
    case SpendType.TestPass:
      return t('kepcoinPage.spends.passTest', { title: testTitle ?? '—' });
    case SpendType.UserContestCreate:
      return t('kepcoinPage.spends.createContest');
    case SpendType.Project:
      return t('kepcoinPage.spends.project');
    case SpendType.StreakFreeze:
      return t('kepcoinPage.spends.streakFreeze');
    case SpendType.VirtualContest:
      return t('kepcoinPage.spends.virtualContest');
    case SpendType.UnratedContest:
      return t('kepcoinPage.spends.unratedContest');
    case SpendType.AnswerForInput:
      return t('kepcoinPage.spends.answerForInput');
    case SpendType.CheckSamples:
      return t('kepcoinPage.spends.checkSamples');
    case SpendType.Merch:
      return t('kepcoinPage.spends.merch');
    default:
      return t('kepcoinPage.transactions.unknown');
  }
};

const renderGuidelines = (items: string[]) => (
  <List disablePadding dense>
    {items.map((item, index) => (
      <ListItem key={`${item}-${index}`} disableGutters sx={{ py: 0.25 }}>
        <ListItemText
          primary={item}
          primaryTypographyProps={{ variant: 'body2', color: 'text.secondary' }}
        />
      </ListItem>
    ))}
  </List>
);

const KepcoinPage = () => {
  const { t, i18n } = useTranslation();
  const [view, setView] = useState<'earns' | 'spends'>('earns');
  const [page, setPage] = useState(1);

  const locale = useMemo(() => {
    if (i18n.language.startsWith('ru')) return 'ru';
    if (i18n.language.startsWith('uz')) return 'uz';
    return 'en';
  }, [i18n.language]);

  const { data: summary, isLoading: summaryLoading, error: summaryError } = useKepcoinSummary();
  const {
    data: earnsData,
    isLoading: earnsLoading,
    error: earnsError,
  } = useKepcoinEarns(view === 'earns' ? { page, perPage: KEP_COIN_PAGE_SIZE } : null);
  const {
    data: spendsData,
    isLoading: spendsLoading,
    error: spendsError,
  } = useKepcoinSpends(view === 'spends' ? { page, perPage: KEP_COIN_PAGE_SIZE } : null);

  const isEarnView = view === 'earns';
  const transactions = (isEarnView ? earnsData?.items : spendsData?.items) ?? [];
  const transactionsMeta = isEarnView ? earnsData : spendsData;
  const transactionsError = isEarnView ? earnsError : spendsError;
  const transactionsLoading = isEarnView ? earnsLoading : spendsLoading;
  const totalPages = transactionsMeta ? Math.ceil(transactionsMeta.total / transactionsMeta.perPage) : 0;

  const earnGuidelines = ensureStringArray(t('kepcoinPage.howToEarn.items', { returnObjects: true }));
  const spendGuidelines = ensureStringArray(t('kepcoinPage.howToSpend.items', { returnObjects: true }));

  const freezeCount = summary?.streakFreeze ?? 0;
  const streakValue = summary?.streak ?? 0;
  const formattedBalance = summary?.kepcoin?.toLocaleString(i18n.language) ?? '—';

  const handleViewChange = (_: MouseEvent<HTMLElement>, nextView: 'earns' | 'spends' | null) => {
    if (!nextView) return;
    setView(nextView);
    setPage(1);
  };

  const handlePageChange = (_: ChangeEvent<unknown>, value: number) => {
    setPage(value);
  };

  return (
    <Box sx={{ p: { xs: 3, md: 5 } }}>
      <Stack spacing={4}>
        <Stack spacing={1}>
          {summaryLoading ? (
            <Skeleton variant="rounded" width={260} height={48} />
          ) : (
            <Stack direction="row" spacing={1.5} flexWrap="wrap" alignItems="center">
              <Typography variant="h3" fontWeight={700}>
                {t('kepcoinPage.youHave.title')}
              </Typography>
              <KepcoinValue label={formattedBalance} iconSize={40} textVariant="h3" fontWeight={700} />
            </Stack>
          )}
          <Typography variant="body2" color="text.secondary">
            {t('kepcoinPage.youHave.subtitle')}
          </Typography>
          {summaryError && (
            <Alert severity="error" variant="outlined">
              {t('kepcoinPage.summary.loadError')}
            </Alert>
          )}
        </Stack>

        <Grid container spacing={6}>
          <Grid item xs={12} md={7}>
            <Stack spacing={4} divider={<Divider flexItem sx={{ borderStyle: 'dashed', borderColor: 'divider' }} />}>
              <Stack spacing={2}>
                <Typography variant="subtitle2" color="text.secondary" textTransform="uppercase">
                  {t('kepcoinPage.streak.title')}
                </Typography>
                <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} alignItems={{ xs: 'flex-start', sm: 'center' }}>
                  {summaryLoading ? (
                    <Skeleton variant="rounded" width={160} height={32} />
                  ) : (
                    <Chip
                      icon={<KepIcon name="freeze" fontSize={20} />}
                      label={t('kepcoinPage.streak.freezeCount', { count: freezeCount })}
                      color="warning"
                      variant="outlined"
                      sx={{ fontWeight: 600 }}
                    />
                  )}
                  <Typography variant="body2" color="text.secondary">
                    {t('kepcoinPage.streak.description')}
                  </Typography>
                </Stack>
                <Typography variant="subtitle1" fontWeight={600}>
                  {t('kepcoinPage.streak.currentStreak', { count: streakValue })}
                </Typography>
              </Stack>

              <Stack spacing={3}>
                <Stack direction={{ xs: 'column', sm: 'row' }} alignItems={{ sm: 'center' }} spacing={2} justifyContent="space-between">
                  <Stack direction="row" spacing={1.5} alignItems="center">
                    <Typography variant="h5" fontWeight={700}>
                      {t('kepcoinPage.transactions.title')}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {t('kepcoinPage.transactions.subtitle')}
                    </Typography>
                  </Stack>
                  <ToggleButtonGroup
                    size="small"
                    exclusive
                    value={view}
                    onChange={handleViewChange}
                    color="primary"
                  >
                    <ToggleButton value="earns">{t('kepcoinPage.transactions.tabs.earns')}</ToggleButton>
                    <ToggleButton value="spends">{t('kepcoinPage.transactions.tabs.spends')}</ToggleButton>
                  </ToggleButtonGroup>
                </Stack>

                {transactionsError && (
                  <Alert severity="error" variant="outlined">
                    {t('kepcoinPage.transactions.loadError')}
                  </Alert>
                )}

                {transactionsLoading ? (
                  <Stack spacing={2}>
                    {Array.from({ length: 3 }).map((_, index) => (
                      <Stack key={index} spacing={1.5}>
                        <Skeleton variant="rounded" height={20} width="60%" />
                        <Skeleton variant="rounded" height={16} width="80%" />
                      </Stack>
                    ))}
                  </Stack>
                ) : transactions.length ? (
                  <Stack spacing={2.5} divider={<Divider flexItem sx={{ borderStyle: 'dashed', borderColor: 'divider' }} />}>
                    {transactions.map((item) => {
                      const isEarn = isEarnView;
                      const description = isEarn
                        ? getEarnDescription(item as KepcoinEarn, t)
                        : getSpendDescription(item as KepcoinSpend, t);
                      const coverPhoto = !isEarn
                        ? getDetailValue<string>((item as KepcoinSpend).detail, ['coverPhoto'])
                        : undefined;
                      const amountLabel = `${isEarn ? '+' : '-'}${(item.kepcoin ?? 0).toLocaleString(i18n.language)}`;

                      return (
                        <Stack key={`${item.id}`} spacing={1.25}>
                          <Stack direction="row" spacing={2} alignItems="center" justifyContent="space-between" flexWrap="wrap">
                            <KepcoinValue
                              label={amountLabel}
                              iconSize={24}
                              textVariant="h6"
                              fontWeight={700}
                              sx={{ '& .MuiTypography-root': { color: isEarn ? 'success.main' : 'error.main' } }}
                            />
                            <Typography variant="body2" color="text.secondary">
                              {formatDateTime(item.datetime, locale)}
                            </Typography>
                          </Stack>
                          <Typography variant="body2" color="text.secondary">
                            {description}
                          </Typography>
                          {coverPhoto && (
                            <Box
                              component="img"
                              src={coverPhoto}
                              alt={t('kepcoinPage.transactions.coverPhotoAlt')}
                              loading="lazy"
                              sx={{ width: '100%', borderRadius: 2, border: (theme) => `1px solid ${theme.palette.divider}` }}
                            />
                          )}
                        </Stack>
                      );
                    })}
                  </Stack>
                ) : (
                  <Box
                    sx={{
                      py: 5,
                      px: 3,
                      borderRadius: 3,
                      border: (theme) => `1px dashed ${theme.palette.divider}`,
                      textAlign: 'center',
                    }}
                  >
                    <Typography variant="subtitle1" fontWeight={600}>
                      {t('kepcoinPage.transactions.emptyTitle')}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {t('kepcoinPage.transactions.emptySubtitle')}
                    </Typography>
                  </Box>
                )}

                {totalPages > 1 && (
                  <Stack direction="row" justifyContent="flex-end">
                    <Pagination
                      count={totalPages}
                      page={page}
                      onChange={handlePageChange}
                      color="primary"
                      shape="rounded"
                    />
                  </Stack>
                )}
              </Stack>
            </Stack>
          </Grid>

          <Grid item xs={12} md={5}>
            <Stack spacing={4} divider={<Divider flexItem sx={{ borderStyle: 'dashed', borderColor: 'divider' }} />}>
              <Stack spacing={2}>
                <Box textAlign="center">
                  <Box component="img" src={kepcoinImage} alt="Kepcoin" sx={{ width: 96, height: 96, mb: 1 }} />
                  <Typography variant="h5" fontWeight={700}>
                    {t('kepcoinPage.howToEarn.title')}
                  </Typography>
                </Box>
                <Typography variant="body2" color="text.secondary">
                  {t('kepcoinPage.howToEarn.description')}
                </Typography>
                {renderGuidelines(earnGuidelines)}
              </Stack>

              <Stack spacing={2}>
                <Typography variant="h5" fontWeight={700}>
                  {t('kepcoinPage.howToSpend.title')}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {t('kepcoinPage.howToSpend.description')}
                </Typography>
                {renderGuidelines(spendGuidelines)}
              </Stack>
            </Stack>
          </Grid>
        </Grid>
      </Stack>
    </Box>
  );
};

export default KepcoinPage;

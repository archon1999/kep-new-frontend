import { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import dayjs from 'dayjs';
import { Box, Button, Chip, Divider, LinearProgress, Pagination, Paper, Skeleton, Stack, Typography } from '@mui/material';
import Grid from '@mui/material/Unstable_Grid2';
import SouthWestIcon from '@mui/icons-material/SouthWest';
import NorthEastIcon from '@mui/icons-material/NorthEast';
import SnowflakeIcon from '@mui/icons-material/AcUnitOutlined';
import BoltIcon from '@mui/icons-material/Bolt';
import { useAuth } from 'app/providers/AuthProvider';
import kepcoinImage from 'shared/assets/images/icons/kepcoin.png';
import {
  useKepcoinBalance,
  useKepcoinEarns,
  useKepcoinSpends,
  useKepcoinStreak,
  useKepcoinTodayStats,
  usePurchaseStreakFreeze,
} from 'modules/kepcoin/application/queries';
import {
  KepcoinEarnEntry,
  KepcoinSpendEntry,
  KepcoinView,
} from 'modules/kepcoin/domain/entities/kepcoin.types';
import {
  UserKepcoinEarnEarnType,
  UserKepcoinSpendType,
} from 'shared/api/orval/generated/endpoints/index.schemas';
import { normalizeError, notifyError } from 'shared/api';

const PAGE_SIZE = 10;

type KepcoinHistoryItem = (KepcoinEarnEntry | KepcoinSpendEntry) & { direction: KepcoinView };

type ParsedDetail = Record<string, unknown> & {
  date?: string;
  description?: string;
  contest?: { title?: string };
  arena?: { title?: string };
  test?: { title?: string };
  problemTitle?: string;
  attemptId?: string | number;
  coverPhoto?: string;
};

const parseDetail = (detail?: unknown): ParsedDetail => {
  if (!detail) return {};

  if (typeof detail === 'string') {
    try {
      return JSON.parse(detail) as ParsedDetail;
    } catch {
      return { description: detail };
    }
  }

  if (typeof detail === 'object') {
    return detail as ParsedDetail;
  }

  return {};
};

const formatHistoryTitle = (
  item: KepcoinHistoryItem,
  t: (key: string, options?: Record<string, unknown>) => string,
): string => {
  const detail = parseDetail(item.detail);

  if (item.direction === 'earns') {
    switch (item.earnType) {
      case UserKepcoinEarnEarnType.NUMBER_1:
        return t('kepcoinPage.earnReasons.wroteBlog');
      case UserKepcoinEarnEarnType.NUMBER_2:
        return t('kepcoinPage.earnReasons.wroteProblemSolution');
      case UserKepcoinEarnEarnType.NUMBER_3:
        return t('kepcoinPage.earnReasons.loyaltyBonus');
      case UserKepcoinEarnEarnType.NUMBER_4:
        return t('kepcoinPage.earnReasons.bonusFromAdmin');
      case UserKepcoinEarnEarnType.NUMBER_5:
        return t('kepcoinPage.earnReasons.dailyActivity', { date: detail.date ?? '--' });
      case UserKepcoinEarnEarnType.NUMBER_6:
        return t('kepcoinPage.earnReasons.dailyTask', { description: detail.description ?? '--' });
      case UserKepcoinEarnEarnType.NUMBER_7:
        return t('kepcoinPage.earnReasons.dailyRating', { date: detail.date ?? '--' });
      case UserKepcoinEarnEarnType.NUMBER_8:
        return t('kepcoinPage.earnReasons.weeklyRating', { date: detail.date ?? '--' });
      case UserKepcoinEarnEarnType.NUMBER_9:
        return t('kepcoinPage.earnReasons.monthlyRating', { date: detail.date ?? '--' });
      case UserKepcoinEarnEarnType.NUMBER_10:
        return t('kepcoinPage.earnReasons.contestParticipant', { title: detail.contest?.title ?? '--' });
      case UserKepcoinEarnEarnType.NUMBER_11:
        return t('kepcoinPage.earnReasons.arenaParticipant', { title: detail.arena?.title ?? '--' });
      case UserKepcoinEarnEarnType.NUMBER_12:
        return t('kepcoinPage.earnReasons.tournamentParticipant');
      case UserKepcoinEarnEarnType.NUMBER_13:
        return t('kepcoinPage.earnReasons.projectTaskComplete');
      default:
        return detail.description?.toString() ?? item.note ?? t('kepcoinPage.history.generic');
    }
  }

  switch (item.type) {
    case UserKepcoinSpendType.NUMBER_1:
      return t('kepcoinPage.spendReasons.viewAttempt', { attempt: detail.attemptId ?? '--' });
    case UserKepcoinSpendType.NUMBER_2:
      return t('kepcoinPage.spendReasons.viewAttemptTest', { attempt: detail.attemptId ?? '--' });
    case UserKepcoinSpendType.NUMBER_3:
      return t('kepcoinPage.spendReasons.viewProblemSolution', { title: detail.problemTitle ?? '--' });
    case UserKepcoinSpendType.NUMBER_4:
      return t('kepcoinPage.spendReasons.doubleRating');
    case UserKepcoinSpendType.NUMBER_5:
      return t('kepcoinPage.spendReasons.changeCover');
    case UserKepcoinSpendType.NUMBER_6:
      return t('kepcoinPage.spendReasons.course');
    case UserKepcoinSpendType.NUMBER_7:
      return t('kepcoinPage.spendReasons.studyPlan');
    case UserKepcoinSpendType.NUMBER_8:
      return t('kepcoinPage.spendReasons.codeEditorTesting');
    case UserKepcoinSpendType.NUMBER_9:
      return t('kepcoinPage.spendReasons.saveRating');
    case UserKepcoinSpendType.NUMBER_10:
      return t('kepcoinPage.spendReasons.passTest', { title: detail.test?.title ?? '--' });
    case UserKepcoinSpendType.NUMBER_11:
      return t('kepcoinPage.spendReasons.createContest');
    case UserKepcoinSpendType.NUMBER_12:
      return t('kepcoinPage.spendReasons.project');
    case UserKepcoinSpendType.NUMBER_13:
      return t('kepcoinPage.spendReasons.streakFreeze');
    case UserKepcoinSpendType.NUMBER_14:
      return t('kepcoinPage.spendReasons.virtualContest');
    case UserKepcoinSpendType.NUMBER_15:
      return t('kepcoinPage.spendReasons.unratedContest');
    case UserKepcoinSpendType.NUMBER_16:
      return t('kepcoinPage.spendReasons.answerForInput');
    case UserKepcoinSpendType.NUMBER_17:
      return t('kepcoinPage.spendReasons.checkSamples');
    case UserKepcoinSpendType.NUMBER_18:
      return t('kepcoinPage.spendReasons.merch');
    default:
      return detail.description?.toString() ?? item.note ?? t('kepcoinPage.history.generic');
  }
};

const KepcoinHistoryItemRow = ({ item, loading }: { item: KepcoinHistoryItem; loading?: boolean }) => {
  const { t } = useTranslation();
  const amountColor = item.direction === 'earns' ? 'success.main' : 'error.main';
  const amountPrefix = item.direction === 'earns' ? '+' : '-';
  const timestamp = item.datetime ? dayjs(item.datetime).format('YYYY-MM-DD HH:mm') : '--';

  return (
    <Paper
      variant="outlined"
      sx={{
        p: 2,
        borderColor: 'divider',
        bgcolor: 'background.paper',
      }}
    >
      <Stack direction={{ xs: 'column', sm: 'row' }} alignItems={{ sm: 'center' }} justifyContent="space-between" spacing={1}>
        <Box>
          <Typography variant="subtitle1" fontWeight={700} gutterBottom>
            {loading ? <Skeleton width={220} /> : formatHistoryTitle(item, t)}
          </Typography>
          <Typography variant="caption" color="text.secondary">
            {loading ? <Skeleton width={140} /> : timestamp}
          </Typography>
        </Box>

        <Stack direction="row" spacing={1} alignItems="center">
          {loading ? (
            <Skeleton variant="text" width={48} />
          ) : (
            <Typography variant="subtitle1" fontWeight={800} sx={{ color: amountColor }}>
              {`${amountPrefix}${item.kepcoin}`}
            </Typography>
          )}
          <Box component="img" src={kepcoinImage} alt="Kepcoin" sx={{ width: 20, height: 20 }} />
        </Stack>
      </Stack>
    </Paper>
  );
};

const KepcoinPage = () => {
  const { t } = useTranslation();
  const { currentUser } = useAuth();

  const [view, setView] = useState<KepcoinView>('earns');
  const [page, setPage] = useState(1);

  const { data: balanceData, isLoading: balanceLoading, mutate: refetchBalance } = useKepcoinBalance();
  const { data: streakData, isLoading: streakLoading, mutate: refetchStreak } = useKepcoinStreak();
  const { data: todayStats } = useKepcoinTodayStats();
  const {
    data: earnsData,
    isLoading: earnsLoading,
    mutate: refetchEarns,
  } = useKepcoinEarns(view === 'earns' ? { page, pageSize: PAGE_SIZE } : null);
  const { data: spendsData, isLoading: spendsLoading, mutate: refetchSpends } = useKepcoinSpends(
    view === 'spends' ? { page, pageSize: PAGE_SIZE } : null,
  );
  const { trigger: purchaseStreakFreeze, isMutating: buyingFreeze } = usePurchaseStreakFreeze();

  const balance = balanceData?.kepcoin ?? currentUser?.kepcoin ?? 0;

  const handleToggleView = () => {
    setView((prev) => (prev === 'earns' ? 'spends' : 'earns'));
    setPage(1);
  };

  const handlePurchaseFreeze = () => {
    purchaseStreakFreeze()
      .then(() =>
        Promise.all([
          refetchStreak(),
          refetchBalance(),
          refetchEarns ? refetchEarns() : Promise.resolve(null),
          refetchSpends ? refetchSpends() : Promise.resolve(null),
        ]),
      )
      .catch((error) => notifyError(normalizeError(error)));
  };

  const historyData = useMemo(() => {
    const baseData = view === 'earns' ? earnsData?.data ?? [] : spendsData?.data ?? [];

    return baseData.map((entry) => ({ ...entry, direction: view })) as KepcoinHistoryItem[];
  }, [earnsData?.data, spendsData?.data, view]);

  const totalCount = view === 'earns' ? earnsData?.total ?? 0 : spendsData?.total ?? 0;
  const loadingHistory = view === 'earns' ? earnsLoading : spendsLoading;

  return (
    <Box sx={{ p: { xs: 3, md: 5 } }}>
      <Stack spacing={3}>
        <Paper
          sx={{
            p: 3,
            borderRadius: 3,
            background: (theme) =>
              theme.palette.mode === 'light'
                ? 'linear-gradient(90deg, rgba(21, 27, 35, 0.92) 0%, rgba(21, 27, 35, 0.84) 100%)'
                : 'linear-gradient(90deg, rgba(15, 21, 28, 0.95) 0%, rgba(15, 21, 28, 0.9) 100%)',
            color: 'common.white',
          }}
        >
          <Stack direction={{ xs: 'column', md: 'row' }} spacing={3} alignItems={{ md: 'center' }}>
            <Stack spacing={1} flex={1}>
              <Typography variant="overline" sx={{ opacity: 0.72 }}>
                {t('kepcoinPage.youHave')}
              </Typography>
              <Stack direction="row" spacing={1.5} alignItems="center" flexWrap="wrap">
                <Typography variant="h3" fontWeight={800} lineHeight={1}>
                  {balanceLoading ? '--' : balance.toLocaleString()}
                </Typography>
                <Box component="img" src={kepcoinImage} alt="Kepcoin" sx={{ width: 42, height: 42 }} />
                <Chip
                  size="small"
                  color="primary"
                  icon={<SnowflakeIcon fontSize="small" />}
                  label={`${t('kepcoinPage.streakFreeze')} ${streakLoading ? '--' : streakData?.streakFreeze ?? 0}`}
                  sx={{ color: 'common.white', bgcolor: 'rgba(255,255,255,0.12)' }}
                />
                <Chip
                  size="small"
                  color="primary"
                  icon={<BoltIcon fontSize="small" />}
                  label={`${t('kepcoinPage.streakLabel')} ${streakLoading ? '--' : streakData?.streak ?? 0}`}
                  sx={{ color: 'common.white', bgcolor: 'rgba(255,255,255,0.12)' }}
                />
              </Stack>
              <Typography variant="body2" sx={{ opacity: 0.82, maxWidth: 520 }}>
                {t('kepcoinPage.streakFreezeDescription')}
              </Typography>
              <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1.5} alignItems={{ xs: 'stretch', sm: 'center' }}>
                <Button
                  variant="contained"
                  color="warning"
                  onClick={handleToggleView}
                  startIcon={view === 'earns' ? <SouthWestIcon /> : <NorthEastIcon />}
                >
                  {view === 'earns' ? t('kepcoinPage.spends') : t('kepcoinPage.earns')}
                </Button>
                <Button
                  variant="outlined"
                  color="inherit"
                  startIcon={<SnowflakeIcon />}
                  onClick={handlePurchaseFreeze}
                  disabled={buyingFreeze}
                >
                  {buyingFreeze ? t('kepcoinPage.freezing') : t('kepcoinPage.buyStreakFreeze')}
                </Button>
              </Stack>
            </Stack>

            <Paper
              variant="outlined"
              sx={{ p: 2.5, borderRadius: 2, minWidth: { xs: '100%', md: 260 }, bgcolor: 'background.default', color: 'text.primary' }}
            >
              <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                {t('kepcoinPage.today.title')}
              </Typography>
              <Stack spacing={1.5}>
                <Stack direction="row" justifyContent="space-between" alignItems="center">
                  <Typography variant="body2" color="text.secondary">
                    {t('kepcoinPage.today.earn')}
                  </Typography>
                  <Stack direction="row" spacing={1} alignItems="center">
                    <Typography variant="subtitle1" fontWeight={700} color="success.main">
                      {todayStats?.earn ?? '--'}
                    </Typography>
                    <Box component="img" src={kepcoinImage} alt="Kepcoin" sx={{ width: 18, height: 18 }} />
                  </Stack>
                </Stack>
                <Stack direction="row" justifyContent="space-between" alignItems="center">
                  <Typography variant="body2" color="text.secondary">
                    {t('kepcoinPage.today.spend')}
                  </Typography>
                  <Stack direction="row" spacing={1} alignItems="center">
                    <Typography variant="subtitle1" fontWeight={700} color="error.main">
                      {todayStats?.spend ?? '--'}
                    </Typography>
                    <Box component="img" src={kepcoinImage} alt="Kepcoin" sx={{ width: 18, height: 18 }} />
                  </Stack>
                </Stack>
              </Stack>
            </Paper>
          </Stack>
        </Paper>

        <Grid container spacing={3}>
          <Grid xs={12} md={7}>
            <Paper variant="outlined" sx={{ p: 2.5, borderRadius: 3 }}>
              <Stack direction={{ xs: 'column', sm: 'row' }} justifyContent="space-between" alignItems="center" spacing={1.5}>
                <Stack direction="row" spacing={1} alignItems="center">
                  {view === 'earns' ? <NorthEastIcon color="success" /> : <SouthWestIcon color="error" />}
                  <Typography variant="h6" fontWeight={800}>
                    {view === 'earns' ? t('kepcoinPage.earns') : t('kepcoinPage.spends')}
                  </Typography>
                </Stack>
                <Button variant="outlined" color="warning" size="small" onClick={handleToggleView}>
                  {view === 'earns' ? t('kepcoinPage.spends') : t('kepcoinPage.earns')}
                </Button>
              </Stack>

              <Divider sx={{ my: 2 }} />

              <Stack spacing={1.5}>
                {loadingHistory && !historyData.length ? (
                  Array.from({ length: 4 }).map((_, idx) => (
                    <KepcoinHistoryItemRow
                      key={`skeleton-${idx}`}
                      item={
                        view === 'earns'
                          ? {
                              direction: view,
                              kepcoin: 0,
                              datetime: '',
                              earnType: UserKepcoinEarnEarnType.NUMBER_1,
                            }
                          : {
                              direction: view,
                              kepcoin: 0,
                              datetime: '',
                              type: UserKepcoinSpendType.NUMBER_1,
                            }
                      }
                      loading
                    />
                  ))
                ) : historyData.length ? (
                  historyData.map((item, idx) => <KepcoinHistoryItemRow key={`${item.datetime}-${idx}`} item={item} />)
                ) : (
                  <Box
                    sx={{
                      py: 4,
                      px: 2,
                      borderRadius: 2,
                      border: (theme) => `1px dashed ${theme.palette.divider}`,
                      textAlign: 'center',
                    }}
                  >
                    <Typography variant="subtitle1" fontWeight={700} gutterBottom>
                      {t('kepcoinPage.history.emptyTitle')}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {t('kepcoinPage.history.emptySubtitle')}
                    </Typography>
                  </Box>
                )}
              </Stack>

              {totalCount > PAGE_SIZE && (
                <Stack alignItems="center" sx={{ pt: 3 }}>
                  <Pagination
                    count={Math.ceil(totalCount / PAGE_SIZE)}
                    page={page}
                    onChange={(_, value) => setPage(value)}
                    color="primary"
                    shape="rounded"
                  />
                </Stack>
              )}

              {(earnsLoading || spendsLoading) && historyData.length > 0 && <LinearProgress sx={{ mt: 2 }} />}
            </Paper>
          </Grid>

          <Grid xs={12} md={5}>
            <Stack spacing={3}>
              <Paper variant="outlined" sx={{ p: 2.5, borderRadius: 3 }}>
                <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 1 }}>
                  <NorthEastIcon color="success" />
                  <Typography variant="h6" fontWeight={800}>
                    {t('kepcoinPage.howToEarn.title')}
                  </Typography>
                </Stack>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                  {t('kepcoinPage.howToEarn.subtitle')}
                </Typography>
                <Stack spacing={1.25}>
                  {[1, 2, 3, 4, 5, 6].map((value) => (
                    <Stack key={value} direction="row" spacing={1} alignItems="center">
                      <Box component="img" src={kepcoinImage} alt="Kepcoin" sx={{ width: 16, height: 16 }} />
                      <Typography variant="body2" fontWeight={600}>
                        {t(`kepcoinPage.howToEarn.items.${value}`)}
                      </Typography>
                    </Stack>
                  ))}
                </Stack>
              </Paper>

              <Paper variant="outlined" sx={{ p: 2.5, borderRadius: 3 }}>
                <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 1 }}>
                  <SouthWestIcon color="error" />
                  <Typography variant="h6" fontWeight={800}>
                    {t('kepcoinPage.howToSpend.title')}
                  </Typography>
                </Stack>
                <Stack spacing={1.25}>
                  {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((value) => (
                    <Stack key={value} direction="row" spacing={1} alignItems="center">
                      <Box component="img" src={kepcoinImage} alt="Kepcoin" sx={{ width: 16, height: 16 }} />
                      <Typography variant="body2" fontWeight={600}>
                        {t(`kepcoinPage.howToSpend.items.${value}`)}
                      </Typography>
                    </Stack>
                  ))}
                </Stack>
              </Paper>
            </Stack>
          </Grid>
        </Grid>
      </Stack>
    </Box>
  );
};

export default KepcoinPage;

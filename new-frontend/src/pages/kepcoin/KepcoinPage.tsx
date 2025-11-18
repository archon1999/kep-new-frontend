import { ChangeEvent, MouseEvent, useCallback, useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Box,
  Button,
  Card,
  CardContent,
  CardHeader,
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
import { useSnackbar } from 'notistack';
import { useAuth } from 'app/providers/AuthProvider';
import axiosFetcher from 'shared/services/axios/axiosFetcher';
import useSWR from 'swr';
import {
  ApiKepcoinEarnsList200,
  ApiKepcoinSpendsList200,
  KepCoinBalance,
  UserKepcoinEarn,
  UserKepcoinEarnEarnType,
  UserKepcoinSpend,
  UserKepcoinSpendType,
} from 'shared/api/orval/generated/endpoints';
import kepcoinImage from 'shared/assets/images/icons/kepcoin.png';

type StreakResponse = {
  streakFreeze?: number;
  streak?: number;
};

type KepcoinView = 'earns' | 'spends';

const parseDetail = (detail?: unknown) => {
  if (!detail) return null;

  if (typeof detail === 'string') {
    try {
      return JSON.parse(detail);
    } catch {
      return { raw: detail };
    }
  }

  if (typeof detail === 'object') {
    return detail as Record<string, unknown>;
  }

  return { raw: detail };
};

const CoinValue = ({ value }: { value: string | number }) => (
  <Stack direction="row" spacing={1} alignItems="center">
    <Box component="img" src={kepcoinImage} alt="Kepcoin" sx={{ width: 18, height: 18 }} />
    <Typography variant="body2" fontWeight={700} color="text.primary">
      {value}
    </Typography>
  </Stack>
);

const HistorySkeleton = () => (
  <Stack spacing={2} divider={<Divider flexItem />}> 
    {Array.from({ length: 3 }).map((_, idx) => (
      <Stack key={idx} spacing={1.5}>
        <Stack direction="row" justifyContent="space-between" alignItems="center">
          <Skeleton variant="rounded" width={120} height={22} />
          <Skeleton variant="text" width={120} height={22} />
        </Stack>
        <Skeleton variant="text" height={22} width="60%" />
        <Skeleton variant="text" height={20} width="30%" />
      </Stack>
    ))}
  </Stack>
);

const useKepcoinHistory = (view: KepcoinView, page: number) => {
  const earnsKey = view === 'earns' ? ['/api/kepcoin-earns/', { method: 'get', params: { page } }] : null;
  const spendsKey = view === 'spends' ? ['/api/kepcoin-spends/', { method: 'get', params: { page } }] : null;

  const {
    data: earnsData,
    isLoading: isEarnsLoading,
    mutate: mutateEarns,
  } = useSWR<ApiKepcoinEarnsList200>(earnsKey, axiosFetcher, {
    keepPreviousData: true,
  });

  const {
    data: spendsData,
    isLoading: isSpendsLoading,
    mutate: mutateSpends,
  } = useSWR<ApiKepcoinSpendsList200>(spendsKey, axiosFetcher, {
    keepPreviousData: true,
  });

  const data = view === 'earns' ? earnsData : spendsData;
  const isLoading = view === 'earns' ? isEarnsLoading : isSpendsLoading;
  const mutate = view === 'earns' ? mutateEarns : mutateSpends;

  return { data, isLoading, mutate };
};

const KepcoinPage = () => {
  const { t } = useTranslation();
  const { enqueueSnackbar } = useSnackbar();
  const { currentUser } = useAuth();

  const [view, setView] = useState<KepcoinView>('earns');
  const [page, setPage] = useState(1);
  const [isPurchasing, setIsPurchasing] = useState(false);

  const { data: balanceData } = useSWR<KepCoinBalance>(['/api/my-kepcoin', { method: 'get' }], axiosFetcher);
  const { data: streakData, mutate: mutateStreak } = useSWR<StreakResponse>(['/api/streak', { method: 'get' }], axiosFetcher);
  const { data: historyData, isLoading: isHistoryLoading, mutate: mutateHistory } = useKepcoinHistory(view, page);

  useEffect(() => {
    setPage(1);
  }, [view]);

  const balance = useMemo(() => balanceData?.kepcoin ?? currentUser?.kepcoin ?? 0, [balanceData?.kepcoin, currentUser?.kepcoin]);
  const streakFreeze = streakData?.streakFreeze ?? 0;
  const streak = streakData?.streak ?? 0;

  const handleViewChange = (_: MouseEvent<HTMLElement>, newView: KepcoinView | null) => {
    if (!newView || newView === view) return;
    setView(newView);
  };

  const handlePageChange = (_: ChangeEvent<unknown>, value: number) => {
    setPage(value);
  };

  const handlePurchaseStreakFreeze = useCallback(async () => {
    try {
      setIsPurchasing(true);
      await axiosFetcher(['/api/purchase-streak-freeze', { method: 'post' }]);
      enqueueSnackbar(t('kepcoinPage.streakFreezePurchased'), { variant: 'success' });
      mutateStreak();
      mutateHistory();
    } catch {
      enqueueSnackbar(t('kepcoinPage.purchaseFailed'), { variant: 'error' });
    } finally {
      setIsPurchasing(false);
    }
  }, [enqueueSnackbar, mutateHistory, mutateStreak, t]);

  const renderEarnDescription = (earn: UserKepcoinEarn) => {
    const detail = parseDetail(earn.detail) as Record<string, any> | null;

    switch (earn.earnType) {
      case UserKepcoinEarnEarnType.NUMBER_1:
        return t('kepcoinPage.earnTypes.wroteBlog');
      case UserKepcoinEarnEarnType.NUMBER_2:
        return t('kepcoinPage.earnTypes.wroteProblemSolution');
      case UserKepcoinEarnEarnType.NUMBER_3:
        return t('kepcoinPage.earnTypes.loyaltyBonus');
      case UserKepcoinEarnEarnType.NUMBER_4:
        return t('kepcoinPage.earnTypes.bonusFromAdmin');
      case UserKepcoinEarnEarnType.NUMBER_5:
        return `${t('kepcoinPage.earnTypes.dailyActivity')}: ${detail?.date ?? t('kepcoinPage.notAvailable')}`;
      case UserKepcoinEarnEarnType.NUMBER_6:
        return `${t('kepcoinPage.earnTypes.dailyTaskCompletion')}: ${detail?.description ?? t('kepcoinPage.notAvailable')}`;
      case UserKepcoinEarnEarnType.NUMBER_7:
        return `${t('kepcoinPage.earnTypes.dailyRatingWinner')}: ${detail?.date ?? t('kepcoinPage.notAvailable')}`;
      case UserKepcoinEarnEarnType.NUMBER_8:
        return `${t('kepcoinPage.earnTypes.weeklyRatingWinner')}: ${detail?.date ?? t('kepcoinPage.notAvailable')}`;
      case UserKepcoinEarnEarnType.NUMBER_9:
        return `${t('kepcoinPage.earnTypes.monthlyRatingWinner')}: ${detail?.date ?? t('kepcoinPage.notAvailable')}`;
      case UserKepcoinEarnEarnType.NUMBER_10:
        return `${t('kepcoinPage.earnTypes.contestParticipant')}: ${detail?.contest?.title ?? t('kepcoinPage.notAvailable')}`;
      case UserKepcoinEarnEarnType.NUMBER_11:
        return `${t('kepcoinPage.earnTypes.arenaParticipant')}: ${detail?.arena?.title ?? t('kepcoinPage.notAvailable')}`;
      case UserKepcoinEarnEarnType.NUMBER_12:
        return t('kepcoinPage.earnTypes.tournamentParticipant');
      case UserKepcoinEarnEarnType.NUMBER_13:
        return t('kepcoinPage.earnTypes.projectTaskComplete');
      default:
        return t('kepcoinPage.notAvailable');
    }
  };

  const renderSpendDescription = (spend: UserKepcoinSpend) => {
    const detail = parseDetail(spend.detail) as Record<string, any> | null;

    switch (spend.type) {
      case UserKepcoinSpendType.NUMBER_1:
        return `${t('kepcoinPage.spendTypes.viewAttempt')} ${detail?.attemptId ?? ''}`.trim();
      case UserKepcoinSpendType.NUMBER_2:
        return `${t('kepcoinPage.spendTypes.viewTestAttempt')} ${detail?.attemptId ?? ''}`.trim();
      case UserKepcoinSpendType.NUMBER_3:
        return `${t('kepcoinPage.spendTypes.viewProblemSolution')}: ${detail?.problemTitle ?? t('kepcoinPage.notAvailable')}`;
      case UserKepcoinSpendType.NUMBER_4:
        return t('kepcoinPage.spendTypes.doubleRating');
      case UserKepcoinSpendType.NUMBER_5:
        return t('kepcoinPage.spendTypes.changeImage');
      case UserKepcoinSpendType.NUMBER_6:
        return t('kepcoinPage.spendTypes.course');
      case UserKepcoinSpendType.NUMBER_7:
        return t('kepcoinPage.spendTypes.studyPlan');
      case UserKepcoinSpendType.NUMBER_8:
        return t('kepcoinPage.spendTypes.codeEditorTesting');
      case UserKepcoinSpendType.NUMBER_9:
        return t('kepcoinPage.spendTypes.saveRating');
      case UserKepcoinSpendType.NUMBER_10:
        return `${t('kepcoinPage.spendTypes.passTest')}: ${detail?.test?.title ?? t('kepcoinPage.notAvailable')}`;
      case UserKepcoinSpendType.NUMBER_11:
        return t('kepcoinPage.spendTypes.createContest');
      case UserKepcoinSpendType.NUMBER_12:
        return t('kepcoinPage.spendTypes.project');
      case UserKepcoinSpendType.NUMBER_13:
        return t('kepcoinPage.spendTypes.streakFreeze');
      case UserKepcoinSpendType.NUMBER_14:
        return t('kepcoinPage.spendTypes.virtualContest');
      case UserKepcoinSpendType.NUMBER_15:
        return t('kepcoinPage.spendTypes.unratedContest');
      case UserKepcoinSpendType.NUMBER_16:
        return t('kepcoinPage.spendTypes.answerForInput');
      case UserKepcoinSpendType.NUMBER_17:
        return t('kepcoinPage.spendTypes.checkSamples');
      case UserKepcoinSpendType.NUMBER_18:
        return t('kepcoinPage.spendTypes.merch');
      default:
        return t('kepcoinPage.notAvailable');
    }
  };

  const renderHistory = () => {
    if (isHistoryLoading && !historyData) {
      return <HistorySkeleton />;
    }

    if (!historyData?.data?.length) {
      return (
        <Box
          sx={{
            py: 4,
            textAlign: 'center',
            borderRadius: 2,
            border: (theme) => `1px dashed ${theme.palette.divider}`,
            bgcolor: 'background.paper',
          }}
        >
          <Typography variant="subtitle1" fontWeight={700} color="text.primary">
            {t('kepcoinPage.history.empty')}
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
            {t('kepcoinPage.history.hint')}
          </Typography>
        </Box>
      );
    }

    return (
      <Stack spacing={2} divider={<Divider flexItem />}>
        {historyData.data.map((entry) => {
          const isEarn = view === 'earns';
          const description = isEarn
            ? renderEarnDescription(entry as UserKepcoinEarn)
            : renderSpendDescription(entry as UserKepcoinSpend);

          return (
            <Stack key={`${entry.datetime}-${entry.kepcoin}-${description}`} spacing={1}>
              <Stack direction="row" justifyContent="space-between" alignItems="center">
                <Stack direction="row" spacing={1.5} alignItems="center">
                  <CoinValue value={entry.kepcoin} />
                  {isEarn && (
                    <Chip size="small" color="success" label={t('kepcoinPage.history.earned')} />
                  )}
                  {!isEarn && (
                    <Chip size="small" color="warning" label={t('kepcoinPage.history.spent')} />
                  )}
                </Stack>
                <Typography variant="caption" color="text.secondary">
                  {entry.datetime || t('kepcoinPage.notAvailable')}
                </Typography>
              </Stack>
              <Typography variant="body2" color="text.primary">
                {description}
              </Typography>
              {entry.note && (
                <Typography variant="body2" color="text.secondary">
                  {entry.note}
                </Typography>
              )}
            </Stack>
          );
        })}
      </Stack>
    );
  };

  return (
    <Box sx={{ p: { xs: 3, md: 5 } }}>
      <Stack spacing={3}>
        <Stack spacing={1} direction="row" alignItems="center" flexWrap="wrap" rowGap={1.5}>
          <Typography variant="h4" fontWeight={700} sx={{ mr: 1 }}>
            {t('kepcoin')}
          </Typography>
          <Stack
            direction="row"
            spacing={1.5}
            alignItems="center"
            sx={{
              bgcolor: 'background.paper',
              borderRadius: 2,
              border: (theme) => `1px solid ${theme.palette.divider}`,
              px: 2,
              py: 1,
            }}
          >
            <Typography variant="body1" color="text.secondary">
              {t('kepcoinPage.youHave')}
            </Typography>
            <CoinValue value={balance} />
          </Stack>
        </Stack>

        <Grid container spacing={3}>
          <Grid item xs={12} md={7} lg={8}>
            <Stack spacing={3}>
              <Card>
                <CardHeader
                  title={
                    <Stack direction="row" spacing={1} alignItems="center">
                      <Chip size="small" color="primary" label={t('kepcoinPage.streakLabel', { value: streak })} />
                      <Typography variant="h6" fontWeight={700}>
                        {t('kepcoinPage.streakFreeze')}
                      </Typography>
                    </Stack>
                  }
                  action={
                    <Button
                      variant="contained"
                      color="primary"
                      onClick={handlePurchaseStreakFreeze}
                      disabled={isPurchasing}
                    >
                      <Stack direction="row" spacing={1} alignItems="center">
                        <CoinValue value={10} />
                        <Typography variant="button" fontWeight={700}>
                          {t('kepcoinPage.freezeCta')}
                        </Typography>
                      </Stack>
                    </Button>
                  }
                />
                <CardContent>
                  <Stack spacing={2}>
                    <Chip
                      color="info"
                      label={t('kepcoinPage.streakFreezeCount', { count: streakFreeze })}
                      sx={{ fontWeight: 600, width: 'fit-content' }}
                    />
                    <Typography variant="body2" color="text.secondary">
                      {t('kepcoinPage.streakFreezeText')}
                    </Typography>
                  </Stack>
                </CardContent>
              </Card>

              <Card>
                <CardHeader
                  title={
                    <Stack direction="row" spacing={1} alignItems="center">
                      <Typography variant="h6" fontWeight={700}>
                        {view === 'earns'
                          ? t('kepcoinPage.history.earnsTitle')
                          : t('kepcoinPage.history.spendsTitle')}
                      </Typography>
                      <Chip
                        size="small"
                        color="secondary"
                        label={historyData?.total ?? 0}
                        sx={{ fontWeight: 700 }}
                      />
                    </Stack>
                  }
                  action={
                    <ToggleButtonGroup
                      exclusive
                      color="primary"
                      value={view}
                      onChange={handleViewChange}
                      size="small"
                    >
                      <ToggleButton value="earns">{t('kepcoinPage.history.earnsTitle')}</ToggleButton>
                      <ToggleButton value="spends">{t('kepcoinPage.history.spendsTitle')}</ToggleButton>
                    </ToggleButtonGroup>
                  }
                />
                <CardContent>
                  <Stack spacing={3}>
                    {renderHistory()}

                    {historyData?.pagesCount && historyData.pagesCount > 1 && (
                      <Pagination
                        count={historyData.pagesCount}
                        page={page}
                        onChange={handlePageChange}
                        color="primary"
                      />
                    )}
                  </Stack>
                </CardContent>
              </Card>
            </Stack>
          </Grid>

          <Grid item xs={12} md={5} lg={4}>
            <Stack spacing={3}>
              <Card>
                <CardHeader
                  title={
                    <Stack direction="row" spacing={1} alignItems="center">
                      <Typography variant="h6" fontWeight={700}>
                        {t('kepcoinPage.howToEarn.title')}
                      </Typography>
                    </Stack>
                  }
                />
                <CardContent>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                    {t('kepcoinPage.howToEarn.description')}
                  </Typography>
                  <Stack spacing={1.5}>
                    <Stack direction="row" spacing={1} alignItems="center">
                      <CoinValue value={1} />
                      <Typography variant="body2" color="text.primary">
                        {t('kepcoinPage.howToEarn.item1')}
                      </Typography>
                    </Stack>
                    <Stack direction="row" spacing={1} alignItems="center">
                      <CoinValue value="1-10" />
                      <Typography variant="body2" color="text.primary">
                        {t('kepcoinPage.howToEarn.item2')}
                      </Typography>
                    </Stack>
                    <Stack direction="row" spacing={1} alignItems="center">
                      <CoinValue value="3, 10, 50" />
                      <Typography variant="body2" color="text.primary">
                        {t('kepcoinPage.howToEarn.item3')}
                      </Typography>
                    </Stack>
                    <Stack direction="row" spacing={1} alignItems="center">
                      <CoinValue value="5+" />
                      <Typography variant="body2" color="text.primary">
                        {t('kepcoinPage.howToEarn.item4')}
                      </Typography>
                    </Stack>
                    <Stack direction="row" spacing={1} alignItems="center">
                      <CoinValue value="10-100" />
                      <Typography variant="body2" color="text.primary">
                        {t('kepcoinPage.howToEarn.item5')}
                      </Typography>
                    </Stack>
                    <Stack direction="row" spacing={1} alignItems="center">
                      <CoinValue value="1-50" />
                      <Typography variant="body2" color="text.primary">
                        {t('kepcoinPage.howToEarn.item6')}
                      </Typography>
                    </Stack>
                  </Stack>
                </CardContent>
              </Card>

              <Card>
                <CardHeader
                  title={
                    <Typography variant="h6" fontWeight={700}>
                      {t('kepcoinPage.howToSpend.title')}
                    </Typography>
                  }
                />
                <CardContent>
                  <Stack spacing={1.5}>
                    <Stack direction="row" spacing={1} alignItems="center">
                      <CoinValue value="0-14" />
                      <Typography variant="body2" color="text.primary">
                        {t('kepcoinPage.howToSpend.item1')}
                      </Typography>
                    </Stack>
                    <Stack direction="row" spacing={1} alignItems="center">
                      <CoinValue value={1} />
                      <Typography variant="body2" color="text.primary">
                        {t('kepcoinPage.howToSpend.item2')}
                      </Typography>
                    </Stack>
                    <Stack direction="row" spacing={1} alignItems="center">
                      <CoinValue value="2-50" />
                      <Typography variant="body2" color="text.primary">
                        {t('kepcoinPage.howToSpend.item3')}
                      </Typography>
                    </Stack>
                    <Stack direction="row" spacing={1} alignItems="center">
                      <CoinValue value={5} />
                      <Typography variant="body2" color="text.primary">
                        {t('kepcoinPage.howToSpend.item4')}
                      </Typography>
                    </Stack>
                    <Stack direction="row" spacing={1} alignItems="center">
                      <CoinValue value={1} />
                      <Typography variant="body2" color="text.primary">
                        {t('kepcoinPage.howToSpend.item5')}
                      </Typography>
                    </Stack>
                    <Stack direction="row" spacing={1} alignItems="center">
                      <CoinValue value="1-1000" />
                      <Typography variant="body2" color="text.primary">
                        {t('kepcoinPage.howToSpend.item6')}
                      </Typography>
                    </Stack>
                    <Stack direction="row" spacing={1} alignItems="center">
                      <CoinValue value={10} />
                      <Typography variant="body2" color="text.primary">
                        {t('kepcoinPage.howToSpend.item7')}
                      </Typography>
                    </Stack>
                    <Stack direction="row" spacing={1} alignItems="center">
                      <CoinValue value={25} />
                      <Typography variant="body2" color="text.primary">
                        {t('kepcoinPage.howToSpend.item8')}
                      </Typography>
                    </Stack>
                    <Stack direction="row" spacing={1} alignItems="center">
                      <CoinValue value={25} />
                      <Typography variant="body2" color="text.primary">
                        {t('kepcoinPage.howToSpend.item9')}
                      </Typography>
                    </Stack>
                  </Stack>
                </CardContent>
              </Card>
            </Stack>
          </Grid>
        </Grid>
      </Stack>
    </Box>
  );
};

export default KepcoinPage;

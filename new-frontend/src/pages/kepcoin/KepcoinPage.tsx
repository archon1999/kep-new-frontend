import { useMemo, useState } from 'react';
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
  Typography,
} from '@mui/material';
import { useAuth } from 'app/providers/AuthProvider';
import { useTranslation } from 'react-i18next';
import {
  ApiKepcoinEarnsList200,
  ApiKepcoinSpendsList200,
  KepCoinBalance,
  UserKepcoinEarn,
  UserKepcoinEarnEarnType,
  UserKepcoinSpend,
  UserKepcoinSpendType,
} from 'shared/api/orval/generated/endpoints/index.schemas';
import axiosFetcher from 'shared/services/axios/axiosFetcher';
import useSWR from 'swr';
import useSWRMutation from 'swr/mutation';
import kepcoinImage from 'shared/assets/images/icons/kepcoin.png';
import dayjs from 'dayjs';

interface StreakResponse {
  streakFreeze: number;
  streak: number;
}

interface EarnDetail {
  date?: string;
  description?: string;
  contest?: { id?: number | string; title?: string };
  arena?: { id?: number | string; title?: string };
}

interface SpendDetail {
  attemptId?: string | number;
  problemId?: string | number;
  problemTitle?: string;
  coverPhoto?: string;
  test?: { id?: string | number; title?: string };
}

const formatDate = (value?: string) => {
  if (!value) return '';
  const parsed = dayjs(value);

  if (!parsed.isValid()) return value;

  return parsed.format('YYYY-MM-DD HH:mm');
};

const parseDetail = <T,>(detail?: string | Record<string, unknown>): Partial<T> | null => {
  if (!detail) return null;
  if (typeof detail === 'object') return detail as Partial<T>;

  try {
    return JSON.parse(detail) as Partial<T>;
  } catch {
    return null;
  }
};

const EarnItem = ({ earn }: { earn: UserKepcoinEarn }) => {
  const { t } = useTranslation();
  const detail = useMemo(() => parseDetail<EarnDetail>(earn.detail), [earn.detail]);

  const description = useMemo(() => {
    switch (earn.earnType) {
      case UserKepcoinEarnEarnType.NUMBER_1:
        return t('kepcoin.earnTypes.wroteBlog');
      case UserKepcoinEarnEarnType.NUMBER_2:
        return t('kepcoin.earnTypes.wroteProblemSolution');
      case UserKepcoinEarnEarnType.NUMBER_3:
        return t('kepcoin.earnTypes.loyaltyBonus');
      case UserKepcoinEarnEarnType.NUMBER_4:
        return t('kepcoin.earnTypes.bonusFromAdmin');
      case UserKepcoinEarnEarnType.NUMBER_5:
        return detail?.date
          ? `${t('kepcoin.earnTypes.dailyActivity')}: ${detail.date}`
          : t('kepcoin.earnTypes.dailyActivity');
      case UserKepcoinEarnEarnType.NUMBER_6:
        return detail?.description
          ? `${t('kepcoin.earnTypes.dailyTaskCompleted')}: ${detail.description}`
          : t('kepcoin.earnTypes.dailyTaskCompleted');
      case UserKepcoinEarnEarnType.NUMBER_7:
        return detail?.date
          ? `${t('kepcoin.earnTypes.dailyRatingWinner')}: ${detail.date}`
          : t('kepcoin.earnTypes.dailyRatingWinner');
      case UserKepcoinEarnEarnType.NUMBER_8:
        return detail?.date
          ? `${t('kepcoin.earnTypes.weeklyRatingWinner')}: ${detail.date}`
          : t('kepcoin.earnTypes.weeklyRatingWinner');
      case UserKepcoinEarnEarnType.NUMBER_9:
        return detail?.date
          ? `${t('kepcoin.earnTypes.monthlyRatingWinner')}: ${detail.date}`
          : t('kepcoin.earnTypes.monthlyRatingWinner');
      case UserKepcoinEarnEarnType.NUMBER_10:
        return detail?.contest?.title
          ? `${t('kepcoin.earnTypes.contestParticipant')}: ${detail.contest.title}`
          : t('kepcoin.earnTypes.contestParticipant');
      case UserKepcoinEarnEarnType.NUMBER_11:
        return detail?.arena?.title
          ? `${t('kepcoin.earnTypes.arenaParticipant')}: ${detail.arena.title}`
          : t('kepcoin.earnTypes.arenaParticipant');
      case UserKepcoinEarnEarnType.NUMBER_12:
        return t('kepcoin.earnTypes.tournamentParticipant');
      case UserKepcoinEarnEarnType.NUMBER_13:
        return t('kepcoin.earnTypes.projectTaskComplete');
      default:
        return t('kepcoin.earnTypes.unknown');
    }
  }, [detail, earn.earnType, t]);

  return (
    <Stack spacing={0.5}>
      <Stack direction="row" justifyContent="space-between" alignItems="center">
        <Stack direction="row" spacing={1} alignItems="center">
          <Box component="img" src={kepcoinImage} alt="Kepcoin" sx={{ width: 20, height: 20 }} />
          <Typography fontWeight={700}>{earn.kepcoin}</Typography>
        </Stack>
        <Typography variant="caption" color="text.secondary">
          {formatDate(earn.datetime)}
        </Typography>
      </Stack>
      <Typography variant="body2" color="text.primary">
        {description}
      </Typography>
      <Divider />
    </Stack>
  );
};

const SpendItem = ({ spend }: { spend: UserKepcoinSpend }) => {
  const { t } = useTranslation();
  const detail = useMemo(() => parseDetail<SpendDetail>(spend.detail), [spend.detail]);

  const description = useMemo(() => {
    switch (spend.type) {
      case UserKepcoinSpendType.NUMBER_1:
        return detail?.attemptId
          ? `${t('kepcoin.spendTypes.viewAttempt')} ${detail.attemptId}`
          : t('kepcoin.spendTypes.viewAttempt');
      case UserKepcoinSpendType.NUMBER_2:
        return detail?.attemptId
          ? `${t('kepcoin.spendTypes.viewTestAttempt')} ${detail.attemptId}`
          : t('kepcoin.spendTypes.viewTestAttempt');
      case UserKepcoinSpendType.NUMBER_3:
        return detail?.problemTitle
          ? `${t('kepcoin.spendTypes.viewProblemSolution')} ${detail.problemTitle}`
          : t('kepcoin.spendTypes.viewProblemSolution');
      case UserKepcoinSpendType.NUMBER_4:
        return t('kepcoin.spendTypes.doubleRating');
      case UserKepcoinSpendType.NUMBER_5:
        return t('kepcoin.spendTypes.changeImage');
      case UserKepcoinSpendType.NUMBER_6:
        return t('kepcoin.spendTypes.course');
      case UserKepcoinSpendType.NUMBER_7:
        return t('kepcoin.spendTypes.studyPlan');
      case UserKepcoinSpendType.NUMBER_8:
        return t('kepcoin.spendTypes.codeEditorTesting');
      case UserKepcoinSpendType.NUMBER_9:
        return t('kepcoin.spendTypes.saveRating');
      case UserKepcoinSpendType.NUMBER_10:
        return detail?.test?.title
          ? `${t('kepcoin.spendTypes.passTest')}: ${detail.test.title}`
          : t('kepcoin.spendTypes.passTest');
      case UserKepcoinSpendType.NUMBER_11:
        return t('kepcoin.spendTypes.createContest');
      case UserKepcoinSpendType.NUMBER_12:
        return t('kepcoin.spendTypes.project');
      case UserKepcoinSpendType.NUMBER_13:
        return t('kepcoin.spendTypes.streakFreeze');
      case UserKepcoinSpendType.NUMBER_14:
        return t('kepcoin.spendTypes.virtualContest');
      case UserKepcoinSpendType.NUMBER_15:
        return t('kepcoin.spendTypes.unratedContest');
      case UserKepcoinSpendType.NUMBER_16:
        return t('kepcoin.spendTypes.answerForInput');
      case UserKepcoinSpendType.NUMBER_17:
        return t('kepcoin.spendTypes.checkSamples');
      case UserKepcoinSpendType.NUMBER_18:
        return t('kepcoin.spendTypes.merch');
      default:
        return t('kepcoin.spendTypes.unknown');
    }
  }, [detail, spend.type, t]);

  return (
    <Stack spacing={0.5}>
      <Stack direction="row" justifyContent="space-between" alignItems="center">
        <Stack direction="row" spacing={1} alignItems="center">
          <Box component="img" src={kepcoinImage} alt="Kepcoin" sx={{ width: 20, height: 20 }} />
          <Typography fontWeight={700}>{spend.kepcoin}</Typography>
        </Stack>
        <Typography variant="caption" color="text.secondary">
          {formatDate(spend.datetime)}
        </Typography>
      </Stack>
      <Typography variant="body2" color="text.primary">
        {description}
      </Typography>
      {detail?.coverPhoto && (
        <Box component="img" src={detail.coverPhoto} alt="Cover" sx={{ width: '100%', borderRadius: 1, mt: 1 }} />
      )}
      <Divider />
    </Stack>
  );
};

const HowToEarnCard = () => {
  const { t } = useTranslation();

  return (
    <Card>
      <CardHeader title={t('kepcoin.howToEarn')} />
      <CardContent>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
          {t('kepcoin.earnDescription')}
        </Typography>
        <Stack spacing={1.5}>
          {[1, 2, 3, 4, 5, 6].map((item) => (
            <Stack key={item} direction="row" spacing={1} alignItems="center">
              <Chip
                size="small"
                color="warning"
                label={<Typography fontWeight={700}>{t(`kepcoin.earnList.item${item}.value`)}</Typography>}
              />
              <Typography variant="body2">{t(`kepcoin.earnList.item${item}.text`)}</Typography>
            </Stack>
          ))}
        </Stack>
      </CardContent>
    </Card>
  );
};

const HowToSpendCard = () => {
  const { t } = useTranslation();

  return (
    <Card>
      <CardHeader title={t('kepcoin.howToSpend')} />
      <CardContent>
        <Stack spacing={1.5}>
          {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((item) => (
            <Stack key={item} direction="row" spacing={1} alignItems="center">
              <Chip
                size="small"
                color="warning"
                label={<Typography fontWeight={700}>{t(`kepcoin.spendList.item${item}.value`)}</Typography>}
              />
              <Typography variant="body2">{t(`kepcoin.spendList.item${item}.text`)}</Typography>
            </Stack>
          ))}
        </Stack>
      </CardContent>
    </Card>
  );
};

const StreakFreezeCard = ({
  streak,
  streakFreeze,
  onBuy,
  loading,
}: {
  streak: number | null;
  streakFreeze: number | null;
  onBuy: () => Promise<void>;
  loading: boolean;
}) => {
  const { t } = useTranslation();

  return (
    <Card>
      <CardHeader
        title={t('kepcoin.streakFreeze')}
        action={
          <Button variant="contained" color="warning" onClick={onBuy} disabled={loading}>
            {loading ? t('kepcoin.purchasing') : t('kepcoin.buyFreeze')}
          </Button>
        }
      />
      <CardContent>
        <Stack spacing={2}>
          <Stack direction="row" spacing={1} alignItems="center">
            <Typography variant="body2" color="text.secondary">
              {t('kepcoin.currentStreak')}
            </Typography>
            <Chip label={streak ?? '--'} color="primary" size="small" />
          </Stack>
          <Stack direction="row" spacing={1} alignItems="center">
            <Typography variant="body2" color="text.secondary">
              {t('kepcoin.youHave')}
            </Typography>
            <Chip label={streakFreeze ?? '--'} color="default" size="small" />
          </Stack>
          <Typography variant="body2" color="text.secondary">
            {t('kepcoin.streakFreezeText')}
          </Typography>
        </Stack>
      </CardContent>
    </Card>
  );
};

const KepcoinPage = () => {
  const { t } = useTranslation();
  const { currentUser, refreshCurrentUser } = useAuth();
  const [view, setView] = useState<'earns' | 'spends'>('earns');
  const [page, setPage] = useState(1);
  const pageSize = 10;

  const { data: balanceData, isLoading: loadingBalance, mutate: mutateBalance } = useSWR<KepCoinBalance>(
    ['/api/my-kepcoin', { method: 'get' }],
    axiosFetcher,
    {
      revalidateOnFocus: false,
    },
  );

  const { data: streakData, isLoading: loadingStreak, mutate: mutateStreak } = useSWR<StreakResponse>(
    ['/api/streak', { method: 'get' }],
    axiosFetcher,
    {
      revalidateOnFocus: false,
    },
  );

  const { data: earnsData, isLoading: loadingEarns } = useSWR<ApiKepcoinEarnsList200>(
    view === 'earns'
      ? ['/api/kepcoin-earns/', { method: 'get', params: { page, pageSize } }]
      : null,
    axiosFetcher,
    { keepPreviousData: true },
  );

  const { data: spendsData, isLoading: loadingSpends } = useSWR<ApiKepcoinSpendsList200>(
    view === 'spends'
      ? ['/api/kepcoin-spends/', { method: 'get', params: { page, pageSize } }]
      : null,
    axiosFetcher,
    { keepPreviousData: true },
  );

  const { trigger: purchaseFreeze, isMutating: purchasingFreeze } = useSWRMutation(
    ['/api/purchase-streak-freeze', { method: 'post' }],
    axiosFetcher,
  );

  const balance = useMemo(() => balanceData?.kepcoin ?? currentUser?.kepcoin ?? null, [balanceData?.kepcoin, currentUser?.kepcoin]);

  const listData = view === 'earns' ? earnsData : spendsData;
  const loadingList = view === 'earns' ? loadingEarns : loadingSpends;
  const pagesCount = listData?.pagesCount ?? 0;
  const items = (view === 'earns' ? earnsData?.data : spendsData?.data) ?? [];

  const handleChangeView = (next: 'earns' | 'spends') => {
    setView(next);
    setPage(1);
  };

  const handleBuyFreeze = async () => {
    await purchaseFreeze().catch(() => {});
    await mutateStreak();
    await mutateBalance();
    await refreshCurrentUser();
  };

  return (
    <Box sx={{ p: { xs: 3, md: 5 }, maxWidth: 1200, mx: 'auto' }}>
      <Stack spacing={3}>
        <Stack spacing={1}>
          <Typography variant="h4" fontWeight={700}>
            {t('kepcoin.title')}
          </Typography>
          <Stack direction="row" spacing={1} alignItems="center">
            <Typography variant="h6">{t('kepcoin.youHave')}</Typography>
            {loadingBalance ? (
              <Skeleton variant="text" width={60} />
            ) : (
              <Stack direction="row" spacing={1} alignItems="center">
                <Typography variant="h6" fontWeight={800}>
                  {balance === null ? '--' : balance.toLocaleString()}
                </Typography>
                <Box component="img" src={kepcoinImage} alt="Kepcoin" sx={{ width: 28, height: 28 }} />
              </Stack>
            )}
          </Stack>
        </Stack>

        <Grid container spacing={3}>
          <Grid item xs={12} md={7} lg={8}>
            <Stack spacing={2}>
              <Card>
                <CardHeader
                  title={
                    <Stack direction="row" spacing={1} alignItems="center">
                      {view === 'earns' ? t('kepcoin.earns') : t('kepcoin.spends')}
                    </Stack>
                  }
                  action={
                    <Stack direction="row" spacing={1}>
                      <Button
                        variant={view === 'earns' ? 'contained' : 'outlined'}
                        onClick={() => handleChangeView('earns')}
                        color="warning"
                      >
                        {t('kepcoin.earns')}
                      </Button>
                      <Button
                        variant={view === 'spends' ? 'contained' : 'outlined'}
                        onClick={() => handleChangeView('spends')}
                        color="warning"
                      >
                        {t('kepcoin.spends')}
                      </Button>
                    </Stack>
                  }
                />
                <CardContent>
                  <Stack spacing={1.5}>
                    {loadingList ? (
                      <Stack spacing={1.5}>
                        {[...Array(5)].map((_, index) => (
                          <Skeleton key={index} variant="rounded" height={48} />
                        ))}
                      </Stack>
                    ) : items.length === 0 ? (
                      <Typography variant="body2" color="text.secondary">
                        {t('kepcoin.empty')}
                      </Typography>
                    ) : (
                      items.map((item) =>
                        view === 'earns' ? (
                          <EarnItem key={`${item.datetime}-${item.kepcoin}`} earn={item as UserKepcoinEarn} />
                        ) : (
                          <SpendItem key={`${item.datetime}-${item.kepcoin}`} spend={item as UserKepcoinSpend} />
                        ),
                      )
                    )}

                    {pagesCount > 1 && (
                      <Stack alignItems="center" pt={1}>
                        <Pagination
                          color="warning"
                          page={page}
                          count={pagesCount}
                          onChange={(_, value) => setPage(value)}
                          shape="rounded"
                        />
                      </Stack>
                    )}
                  </Stack>
                </CardContent>
              </Card>

              <StreakFreezeCard
                streak={streakData?.streak ?? null}
                streakFreeze={streakData?.streakFreeze ?? null}
                onBuy={handleBuyFreeze}
                loading={purchasingFreeze || loadingStreak}
              />
            </Stack>
          </Grid>

          <Grid item xs={12} md={5} lg={4}>
            <Stack spacing={2}>
              <HowToEarnCard />
              <HowToSpendCard />
            </Stack>
          </Grid>
        </Grid>
      </Stack>
    </Box>
  );
};

export default KepcoinPage;

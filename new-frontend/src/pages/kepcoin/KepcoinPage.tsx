import { ReactNode, useCallback, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  CardHeader,
  Container,
  Divider,
  Grid,
  Pagination,
  Stack,
  Typography,
} from '@mui/material';
import { toast } from 'sonner';
import {
  useKepcoinBalance,
  useKepcoinEarns,
  useKepcoinSpends,
  useKepcoinStreak,
  usePurchaseStreakFreeze,
} from 'modules/kepcoin/application/queries';
import { KepcoinEarn, KepcoinSpend } from 'modules/kepcoin/domain/entities/kepcoin.entity';
import HistoryTimeline, { HistoryItem } from './components/HistoryTimeline';
import StreakFreezeCard from './components/StreakFreezeCard';
import TipsCard from './components/TipsCard';
import KepcoinValue from './components/KepcoinValue';

const PAGE_SIZE = 10;

type HistoryView = 'earns' | 'spends';

const KepcoinPage = () => {
  const { t } = useTranslation();
  const [view, setView] = useState<HistoryView>('earns');
  const [page, setPage] = useState(1);

  const earnsParams = useMemo(() => (view === 'earns' ? { page, pageSize: PAGE_SIZE } : null), [view, page]);
  const spendsParams = useMemo(() => (view === 'spends' ? { page, pageSize: PAGE_SIZE } : null), [view, page]);

  const { data: balanceData, mutate: mutateBalance } = useKepcoinBalance();
  const { data: streakData, mutate: mutateStreak } = useKepcoinStreak();
  const {
    data: earnsData,
    isLoading: isEarnsLoading,
    error: earnsError,
  } = useKepcoinEarns(earnsParams);
  const {
    data: spendsData,
    isLoading: isSpendsLoading,
    error: spendsError,
  } = useKepcoinSpends(spendsParams);

  const purchaseMutation = usePurchaseStreakFreeze();

  const handleViewChange = (_: unknown, nextView: HistoryView) => {
    if (nextView) {
      setView(nextView);
      setPage(1);
    }
  };

  const handlePurchaseFreeze = async () => {
    if (purchaseMutation.isMutating) return;

    try {
      await purchaseMutation.trigger();
      await Promise.all([mutateStreak(), mutateBalance()]);
      toast.success(t('kepcoinPage.notifications.freezePurchased'));
    } catch (error) {
      toast.error(t('kepcoinPage.notifications.actionFailed'));
      console.error(error);
    }
  };

  const formatEarnDescription = useCallback(
    (earn: KepcoinEarn): string => {
      const detail = earn.detail || {};

      switch (earn.type) {
        case 1:
          return t('kepcoinPage.types.earns.wroteBlog');
        case 2:
          return t('kepcoinPage.types.earns.wroteProblemSolution');
        case 3:
          return t('kepcoinPage.types.earns.loyaltyBonus');
        case 4:
          return t('kepcoinPage.types.earns.bonusFromAdmin');
        case 5:
          return t('kepcoinPage.types.earns.dailyActivity', { date: (detail as any).date || '' });
        case 6:
          return t('kepcoinPage.types.earns.dailyTaskCompletion', { description: (detail as any).description || '' });
        case 7:
          return t('kepcoinPage.types.earns.dailyRatingWinner', { date: (detail as any).date || '' });
        case 8:
          return t('kepcoinPage.types.earns.weeklyRatingWinner', { date: (detail as any).date || '' });
        case 9:
          return t('kepcoinPage.types.earns.monthlyRatingWinner', { date: (detail as any).date || '' });
        case 10:
          return t('kepcoinPage.types.earns.contestParticipant', {
            title: (detail as any)?.contest?.title || '',
          });
        case 11:
          return t('kepcoinPage.types.earns.arenaParticipant', {
            title: (detail as any)?.arena?.title || '',
          });
        case 12:
          return t('kepcoinPage.types.earns.tournamentParticipant');
        case 13:
          return t('kepcoinPage.types.earns.projectTaskComplete');
        default:
          return t('kepcoinPage.types.common.unknown');
      }
    },
    [t],
  );

  const formatSpendDescription = useCallback(
    (spend: KepcoinSpend): { description: string; media?: ReactNode } => {
      const detail = spend.detail || {};

      switch (spend.type) {
        case 1:
          return {
            description: t('kepcoinPage.types.spends.viewAttempt', {
              id: (detail as any).attemptId ?? '',
            }),
          };
        case 2:
          return {
            description: t('kepcoinPage.types.spends.viewTestAttempt', {
              id: (detail as any).attemptId ?? '',
            }),
          };
        case 3:
          return {
            description: t('kepcoinPage.types.spends.viewProblemSolution', {
              id: (detail as any).problemId ?? '',
              title: (detail as any).problemTitle ?? '',
            }),
          };
        case 4:
          return { description: t('kepcoinPage.types.spends.doubleRating') };
        case 5:
          return {
            description: t('kepcoinPage.types.spends.changeImage'),
            media: (detail as any).coverPhoto ? (
              <Box
                component="img"
                src={(detail as any).coverPhoto as string}
                alt={t('kepcoinPage.types.spends.changeImage')}
                sx={{ width: '100%', maxHeight: 160, objectFit: 'cover', borderRadius: 1, mt: 0.5 }}
              />
            ) : undefined,
          };
        case 6:
          return { description: t('kepcoinPage.types.spends.course') };
        case 7:
          return { description: t('kepcoinPage.types.spends.studyPlan') };
        case 8:
          return { description: t('kepcoinPage.types.spends.codeEditorTesting') };
        case 9:
          return { description: t('kepcoinPage.types.spends.saveRating') };
        case 10:
          return {
            description: t('kepcoinPage.types.spends.passTest', { title: (detail as any)?.test?.title ?? '' }),
          };
        case 11:
          return { description: t('kepcoinPage.types.spends.createContest') };
        case 12:
          return { description: t('kepcoinPage.types.spends.project') };
        case 13:
          return { description: t('kepcoinPage.types.spends.streakFreeze') };
        case 14:
          return { description: t('kepcoinPage.types.spends.virtualContest') };
        case 15:
          return { description: t('kepcoinPage.types.spends.unratedContest') };
        case 16:
          return { description: t('kepcoinPage.types.spends.answerForInput') };
        case 17:
          return { description: t('kepcoinPage.types.spends.checkSamples') };
        case 18:
          return { description: t('kepcoinPage.types.spends.merch') };
        default:
          return { description: t('kepcoinPage.types.common.unknown') };
      }
    },
    [t],
  );

  const historyItems: HistoryItem[] = useMemo(() => {
    if (view === 'earns') {
      return (earnsData?.data || []).map((earn, idx) => ({
        id: `earn-${earn.datetime ?? idx}-${earn.amount}`,
        amount: earn.amount,
        date: earn.datetime,
        description: formatEarnDescription(earn),
        note: earn.note,
      }));
    }

    return (spendsData?.data || []).map((spend, idx) => {
      const { description, media } = formatSpendDescription(spend);
      return {
        id: `spend-${spend.datetime ?? idx}-${spend.amount}`,
        amount: spend.amount,
        date: spend.datetime,
        description,
        note: spend.note,
        media,
      } satisfies HistoryItem;
    });
  }, [view, earnsData?.data, spendsData?.data, formatEarnDescription, formatSpendDescription]);

  const totalPages = view === 'earns' ? earnsData?.pagesCount ?? 0 : spendsData?.pagesCount ?? 0;
  const isHistoryLoading = view === 'earns' ? isEarnsLoading : isSpendsLoading;
  const historyError = view === 'earns' ? earnsError : spendsError;

  const historyTitle = view === 'earns' ? t('kepcoinPage.history.earns') : t('kepcoinPage.history.spends');

  return (
    <Container maxWidth="lg" sx={{ py: { xs: 3, md: 5 } }}>
      <Stack spacing={3}>
        <Stack spacing={1} alignItems={{ xs: 'flex-start', md: 'center' }} direction={{ xs: 'column', md: 'row' }}>
          <Typography variant="h4" fontWeight={700} color="text.primary">
            {t('kepcoinPage.balance.title')}
          </Typography>
          <KepcoinValue value={balanceData?.value ?? 0} size={30} textVariant="h5" />
        </Stack>

        <Grid container spacing={3} justifyContent="center">
          <Grid item xs={12} md={6} lg={5}>
            <Stack spacing={3}>
              <StreakFreezeCard
                streak={streakData?.streak}
                streakFreeze={streakData?.streakFreeze}
                description={t('kepcoinPage.streakFreeze.description')}
                onPurchase={handlePurchaseFreeze}
                isPurchasing={purchaseMutation.isMutating}
              />

              <Card>
                <CardHeader
                  title={historyTitle}
                  action={
                    <Button
                      variant="outlined"
                      color="warning"
                      size="small"
                      onClick={() => handleViewChange(null, view === 'earns' ? 'spends' : 'earns')}
                    >
                      {view === 'earns'
                        ? t('kepcoinPage.history.spends')
                        : t('kepcoinPage.history.earns')}
                    </Button>
                  }
                />
                <Divider />
                <CardContent>
                  {historyError ? (
                    <Alert severity="error">{t('kepcoinPage.notifications.historyError')}</Alert>
                  ) : (
                    <HistoryTimeline
                      items={historyItems}
                      isLoading={isHistoryLoading}
                      emptyLabel={t('kepcoinPage.history.empty')}
                    />
                  )}

                  {totalPages > 1 && (
                    <Box mt={3} display="flex" justifyContent="center">
                      <Pagination
                        color="warning"
                        count={totalPages}
                        page={page}
                        onChange={(_, value) => setPage(value)}
                        shape="rounded"
                      />
                    </Box>
                  )}
                </CardContent>
              </Card>
            </Stack>
          </Grid>

          <Grid item xs={12} md={6} lg={5}>
            <Stack spacing={3}>
              <TipsCard
                title={t('kepcoinPage.howToEarn.title')}
                description={t('kepcoinPage.howToEarn.description')}
                items={[
                  { value: 1, label: t('kepcoinPage.howToEarn.items.dailyActivity') },
                  { value: '1-10', label: t('kepcoinPage.howToEarn.items.dailyTasks') },
                  { value: '3, 10, 50', label: t('kepcoinPage.howToEarn.items.ratingWinner') },
                  { value: '5+', label: t('kepcoinPage.howToEarn.items.competitions') },
                  { value: '10-100', label: t('kepcoinPage.howToEarn.items.blog') },
                  { value: '1-50', label: t('kepcoinPage.howToEarn.items.editingHelp') },
                ]}
              />

              <TipsCard
                title={t('kepcoinPage.howToSpend.title')}
                items={[
                  { value: '0-14', label: t('kepcoinPage.howToSpend.items.viewAttempt') },
                  { value: 1, label: t('kepcoinPage.howToSpend.items.viewFailedTest') },
                  { value: '2-50', label: t('kepcoinPage.howToSpend.items.problemSolution') },
                  { value: 5, label: t('kepcoinPage.howToSpend.items.coverPhoto') },
                  { value: 1, label: t('kepcoinPage.howToSpend.items.passTest') },
                  { value: '1-1000', label: t('kepcoinPage.howToSpend.items.course') },
                  { value: 10, label: t('kepcoinPage.howToSpend.items.codeTesting') },
                  { value: 25, label: t('kepcoinPage.howToSpend.items.doubleRating') },
                  { value: 25, label: t('kepcoinPage.howToSpend.items.keepRating') },
                ]}
              />
            </Stack>
          </Grid>
        </Grid>
      </Stack>
    </Container>
  );
};

export default KepcoinPage;

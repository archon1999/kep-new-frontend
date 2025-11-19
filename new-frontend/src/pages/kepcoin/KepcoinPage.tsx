import { useEffect, useMemo, useState } from 'react';
import dayjs from 'dayjs';
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Grid,
  Link,
  Paper,
  Stack,
  Typography,
} from '@mui/material';
import { LoadingButton } from '@mui/lab';
import { useTranslation } from 'react-i18next';
import { useSnackbar } from 'notistack';
import PageHeader from 'shared/components/sections/common/PageHeader';
import { useAuth } from 'app/providers/AuthProvider';
import {
  useKepcoinEarns,
  useKepcoinSpends,
  useKepcoinStreak,
  usePurchaseStreakFreeze,
} from 'modules/kepcoin/application/queries';
import { EarnType, KepcoinEarn, KepcoinSpend, SpendType } from 'modules/kepcoin/domain/entities/kepcoin.entity';
import KepcoinTimelineCard, { KepcoinTimelineItem } from './components/KepcoinTimelineCard';
import HowToCard, { HowToItem } from './components/HowToCard';
import StreakFreezeCard from './components/StreakFreezeCard';
import KepcoinValue from './components/KepcoinValue';

const PAGE_SIZE = 10;
const STREAK_FREEZE_COST = 10;
const LEGACY_BASE_URL =
  import.meta.env.VITE_LEGACY_APP_URL ||
  (import.meta.env.VITE_API_BASE_URL ? import.meta.env.VITE_API_BASE_URL.replace(/\/api\/?$/, '') : 'https://kep.uz');

const LEGACY_PATHS = {
  attempt: '/practice/problems/attempts',
  contest: '/competitions/contests/contest',
  arena: '/competitions/arena/tournament',
  test: '/practice/tests/test',
  problem: '/practice/problems/problem',
  project: '/practice/projects/project',
};

const formatLegacyUrl = (path: string, id?: string | number) => {
  if (!id) return undefined;
  return `${LEGACY_BASE_URL}${path}/${id}`;
};

const formatDate = (value: string) => dayjs(value).format('DD MMM YYYY, HH:mm');

const highlight = (text?: string | number) => (
  <Typography component="span" color="primary.main" fontWeight={600}>
    {text ?? '—'}
  </Typography>
);

const renderLink = (label?: string | number, url?: string) => {
  if (!url) return label ?? '—';

  return (
    <Link href={url} target="_blank" rel="noopener noreferrer" color="primary.main" underline="hover">
      {label ?? url}
    </Link>
  );
};

const mapEarnDescription = (earn: KepcoinEarn, t: (key: string, options?: any) => string) => {
  const detail = earn.detail ?? {};

  switch (earn.earnType) {
    case EarnType.DailyActivity:
      return (
        <>
          {t('kepcoin.earnTypes.dailyActivity')}: {highlight(detail.date)}
        </>
      );
    case EarnType.DailyTaskCompletion:
      return (
        <>
          {t('kepcoin.earnTypes.dailyTaskCompletion')}: {highlight(detail.description)}
        </>
      );
    case EarnType.DailyProblemsRatingWin:
      return (
        <>
          {t('kepcoin.earnTypes.dailyRatingWinner')}: {highlight(detail.date)}
        </>
      );
    case EarnType.WeeklyProblemsRatingWin:
      return (
        <>
          {t('kepcoin.earnTypes.weeklyRatingWinner')}: {highlight(detail.date)}
        </>
      );
    case EarnType.MonthlyProblemsRatingWin:
      return (
        <>
          {t('kepcoin.earnTypes.monthlyRatingWinner')}: {highlight(detail.date)}
        </>
      );
    case EarnType.ContestParticipated: {
      const url = formatLegacyUrl(LEGACY_PATHS.contest, detail.contest?.id);
      return (
        <>
          {t('kepcoin.earnTypes.contestParticipant')}: {renderLink(detail.contest?.title ?? detail.contest?.id, url)}
        </>
      );
    }
    case EarnType.ArenaParticipated: {
      const url = formatLegacyUrl(LEGACY_PATHS.arena, detail.arena?.id);
      return (
        <>
          {t('kepcoin.earnTypes.arenaParticipant')}: {renderLink(detail.arena?.title ?? detail.arena?.id, url)}
        </>
      );
    }
    case EarnType.ProjectTaskComplete:
      return t('kepcoin.earnTypes.projectTaskComplete');
    case EarnType.WroteProblemSolution:
      return t('kepcoin.earnTypes.wroteProblemSolution');
    case EarnType.LoyaltyBonus:
      return t('kepcoin.earnTypes.loyaltyBonus');
    case EarnType.BonusFromAdmin:
      return t('kepcoin.earnTypes.bonusFromAdmin');
    case EarnType.TournamentParticipated:
      return t('kepcoin.earnTypes.tournamentParticipant');
    case EarnType.WroteBlog:
    default:
      return t('kepcoin.earnTypes.wroteBlog');
  }
};

const mapSpendDescription = (spend: KepcoinSpend, t: (key: string, options?: any) => string) => {
  const detail = spend.detail ?? {};

  switch (spend.type) {
    case SpendType.AttemptView:
    case SpendType.AttemptTestView: {
      const url = formatLegacyUrl(LEGACY_PATHS.attempt, detail.attemptId);
      const label = `${detail.attemptId ?? ''}`.trim() || '#';
      const key =
        spend.type === SpendType.AttemptView
          ? 'kepcoin.spendTypes.viewAttempt'
          : 'kepcoin.spendTypes.viewTestAttempt';
      return (
        <>
          {t(key)} {renderLink(`#${label}`, url)}
        </>
      );
    }
    case SpendType.ProblemSolution: {
      const url = formatLegacyUrl(LEGACY_PATHS.problem, detail.problemId);
      const label = detail.problemTitle
        ? `${detail.problemId ?? ''} ${detail.problemTitle}`.trim()
        : detail.problemId;
      return (
        <>
          {t('kepcoin.spendTypes.viewProblemSolution')} {renderLink(label, url)}
        </>
      );
    }
    case SpendType.TestPass: {
      const url = formatLegacyUrl(LEGACY_PATHS.test, detail.test?.id);
      return (
        <>
          {t('kepcoin.spendTypes.passTest')} {renderLink(detail.test?.title, url)}
        </>
      );
    }
    case SpendType.Project: {
      const url = formatLegacyUrl(LEGACY_PATHS.project, detail.project?.id);
      return (
        <>
          {t('kepcoin.spendTypes.project')}: {renderLink(detail.project?.title ?? detail.project?.id, url)}
        </>
      );
    }
    case SpendType.CoverPhotoChange:
      return t('kepcoin.spendTypes.changeImage');
    case SpendType.DoubleRating:
      return t('kepcoin.spendTypes.doubleRating');
    case SpendType.Course:
      return t('kepcoin.spendTypes.course');
    case SpendType.StudyPlan:
      return t('kepcoin.spendTypes.studyPlan');
    case SpendType.CodeEditorTesting:
      return t('kepcoin.spendTypes.codeEditorTesting');
    case SpendType.SaveRating:
      return t('kepcoin.spendTypes.saveRating');
    case SpendType.UserContestCreate:
      return t('kepcoin.spendTypes.createContest');
    case SpendType.StreakFreeze:
      return t('kepcoin.spendTypes.streakFreeze');
    case SpendType.VirtualContest:
      return t('kepcoin.spendTypes.virtualContest');
    case SpendType.UnratedContest:
      return t('kepcoin.spendTypes.unratedContest');
    case SpendType.AnswerForInput:
      return t('kepcoin.spendTypes.answerForInput');
    case SpendType.CheckSamples:
      return t('kepcoin.spendTypes.checkSamples');
    case SpendType.Merch:
      return t('kepcoin.spendTypes.merch');
    default:
      return t('kepcoin.spendTypes.project');
  }
};

const KepcoinPage = () => {
  const { t } = useTranslation();
  const { currentUser, refreshCurrentUser } = useAuth();
  const { enqueueSnackbar } = useSnackbar();
  const [view, setView] = useState<'earns' | 'spends'>('earns');
  const [page, setPage] = useState(1);
  const [purchaseDialogOpen, setPurchaseDialogOpen] = useState(false);

  const {
    data: earnsData,
    isLoading: loadingEarns,
    error: earnsError,
  } = useKepcoinEarns({ page, pageSize: PAGE_SIZE, enabled: view === 'earns' });
  const {
    data: spendsData,
    isLoading: loadingSpends,
    error: spendsError,
  } = useKepcoinSpends({ page, pageSize: PAGE_SIZE, enabled: view === 'spends' });
  const {
    data: streakData,
    isLoading: loadingStreak,
    mutate: mutateStreak,
  } = useKepcoinStreak();
  const { trigger: purchaseFreeze, isMutating: purchasingFreeze } = usePurchaseStreakFreeze();

  useEffect(() => {
    setPage(1);
  }, [view]);

  const balance = currentUser?.kepcoin ?? null;
  const balanceLabel = balance === null ? '--' : balance.toLocaleString();

  const activeData = view === 'earns' ? earnsData : spendsData;
  const timelineItems = useMemo(() => {
    if (!activeData?.data) return [];

    if (view === 'earns') {
      return (activeData.data as KepcoinEarn[]).map((earn) => ({
        id: `earn-${earn.id ?? earn.datetime}-${earn.kepcoin}`,
        amount: earn.kepcoin,
        dateLabel: formatDate(earn.datetime),
        description: mapEarnDescription(earn, t),
      }));
    }

    return (activeData.data as KepcoinSpend[]).map((spend) => {
      const media =
        spend.type === SpendType.CoverPhotoChange && spend.detail?.coverPhoto ? (
          <Box
            component="img"
            src={spend.detail.coverPhoto}
            alt="Cover"
            sx={{ width: '100%', borderRadius: 2, maxHeight: 200, objectFit: 'cover' }}
          />
        ) : undefined;

      return {
        id: `spend-${spend.id ?? spend.datetime}-${spend.kepcoin}`,
        amount: spend.kepcoin,
        dateLabel: formatDate(spend.datetime),
        description: mapSpendDescription(spend, t),
        media,
      };
    });
  }, [activeData?.data, view, t]);

  const timelineEmptyText = view === 'earns' ? t('kepcoin.timeline.empty.earns') : t('kepcoin.timeline.empty.spends');
  const timelineErrorText = view === 'earns' ? t('kepcoin.timeline.error.earns') : t('kepcoin.timeline.error.spends');

  const total = activeData?.total ?? 0;
  const totalPages = total > 0 ? Math.ceil(total / PAGE_SIZE) : 0;
  const howToEarnItems = useMemo(
    () => t('kepcoin.howToEarn.items', { returnObjects: true }) as HowToItem[],
    [t],
  );
  const howToSpendItems = useMemo(
    () => t('kepcoin.howToSpend.items', { returnObjects: true }) as HowToItem[],
    [t],
  );

  const handleToggleView = () => {
    setView((prev) => (prev === 'earns' ? 'spends' : 'earns'));
  };

  const handlePurchaseClick = () => {
    if ((currentUser?.kepcoin ?? 0) < STREAK_FREEZE_COST) {
      enqueueSnackbar(t('kepcoin.streak.notEnough'), { variant: 'error' });
      return;
    }
    setPurchaseDialogOpen(true);
  };

  const handleConfirmPurchase = () => {
    purchaseFreeze()
      .then(() => {
        enqueueSnackbar(t('kepcoin.streak.success'), { variant: 'success' });
        setPurchaseDialogOpen(false);
        mutateStreak();
        refreshCurrentUser();
      })
      .catch(() => enqueueSnackbar(t('kepcoin.streak.error'), { variant: 'error' }));
  };

  const timelineActionLabel = view === 'earns' ? t('kepcoin.tabs.spends') : t('kepcoin.tabs.earns');
  const timelineIcon = view === 'earns' ? 'mdi:corner-right-up' : 'mdi:corner-left-down';
  const isTimelineLoading = view === 'earns' ? loadingEarns : loadingSpends;
  const timelineError = (view === 'earns' ? earnsError : spendsError) ? timelineErrorText : null;

  return (
    <Stack spacing={4}>
      <PageHeader
        title={t('kepcoin.title')}
        breadcrumb={[
          { label: t('home'), url: '/' },
          { label: t('kepcoin.title'), active: true },
        ]}
      />

      <Paper sx={{ px: { xs: 3, md: 5 }, py: 3 }}>
        <Stack spacing={1.5}>
          <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1.5} alignItems={{ sm: 'center' }}>
            <Typography variant="h4" fontWeight={700}>
              {t('kepcoin.youHave')}
            </Typography>
            <KepcoinValue value={balanceLabel} size="lg" />
          </Stack>
          <Typography variant="body2" color="text.secondary">
            {t('kepcoin.balanceHint')}
          </Typography>
        </Stack>
      </Paper>

      <Grid container spacing={3}>
        <Grid item xs={12} md={7} lg={8}>
          <Stack spacing={3}>
            <StreakFreezeCard
              title={t('kepcoin.streak.title')}
              description={t('kepcoin.streak.description')}
              streakLabel={t('kepcoin.streak.streakLabel')}
              streakValue={streakData?.streak}
              youHaveLabel={t('kepcoin.streak.youHave', { count: '' }).trim()}
              streakFreeze={streakData?.streakFreeze}
              buttonLabel={t('kepcoin.streak.purchaseCta')}
              loading={loadingStreak}
              onPurchaseClick={handlePurchaseClick}
            />

            <KepcoinTimelineCard
              title={view === 'earns' ? t('kepcoin.tabs.earns') : t('kepcoin.tabs.spends')}
              icon={timelineIcon}
              action={
                <Button variant="outlined" color="warning" size="small" onClick={handleToggleView}>
                  {timelineActionLabel}
                </Button>
              }
              items={timelineItems as KepcoinTimelineItem[]}
              loading={isTimelineLoading}
              error={timelineError}
              emptyState={
                <Typography variant="body2" color="text.secondary">
                  {timelineEmptyText}
                </Typography>
              }
              page={page}
              totalPages={totalPages}
              onPageChange={setPage}
            />
          </Stack>
        </Grid>

        <Grid item xs={12} md={5} lg={4}>
          <Stack spacing={3}>
            <HowToCard
              title={t('kepcoin.howToEarn.title')}
              icon="mdi:currency-usd"
              description={t('kepcoin.howToEarn.description')}
              items={howToEarnItems}
            />
            <HowToCard
              title={t('kepcoin.howToSpend.title')}
              icon="mdi:wallet-outline"
              description={t('kepcoin.howToSpend.description')}
              items={howToSpendItems}
            />
          </Stack>
        </Grid>
      </Grid>

      <Dialog open={purchaseDialogOpen} onClose={() => setPurchaseDialogOpen(false)}>
        <DialogTitle>{t('kepcoin.streak.purchaseDialogTitle')}</DialogTitle>
        <DialogContent>
          <Typography variant="body2" color="text.secondary" mb={2}>
            {t('kepcoin.streak.purchaseDialogBody')}
          </Typography>
          <KepcoinValue value={STREAK_FREEZE_COST} size="md" />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setPurchaseDialogOpen(false)}>
            {t('kepcoin.streak.purchaseCancel')}
          </Button>
          <LoadingButton
            variant="contained"
            color="primary"
            loading={purchasingFreeze}
            onClick={handleConfirmPurchase}
          >
            {t('kepcoin.streak.purchaseConfirm')}
          </LoadingButton>
        </DialogActions>
      </Dialog>
    </Stack>
  );
};

export default KepcoinPage;

import { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import useSWR from 'swr';
import useSWRMutation from 'swr/mutation';
import {
  Box,
  Button,
  Card,
  CardContent,
  CardHeader,
  Chip,
  Container,
  Divider,
  Grid,
  Stack,
  ToggleButton,
  ToggleButtonGroup,
  Typography,
} from '@mui/material';
import {
  LoadingButton,
  Timeline,
  TimelineConnector,
  TimelineContent,
  TimelineDot,
  TimelineItem,
  TimelineSeparator,
} from '@mui/lab';
import { useAuth } from 'app/providers/AuthProvider';
import { getSnippetsAPI } from 'shared/api/orval/generated/endpoints';
import {
  ApiKepcoinEarnsList200,
  ApiKepcoinSpendsList200,
  UserKepcoinEarn,
  UserKepcoinEarnEarnType,
  UserKepcoinSpend,
  UserKepcoinSpendType,
  type KepCoinBalance,
} from 'shared/api/orval/generated/endpoints/index.schemas';
import kepcoinImage from 'shared/assets/images/icons/kepcoin.png';
import axiosFetcher from 'shared/services/axios/axiosFetcher';
import { useSnackbar } from 'notistack';

const PAGE_SIZE = 10;

type KepcoinView = 'earns' | 'spends';

type StreakResponse = {
  streak?: number;
  streakFreeze?: number;
  streak_freeze?: number;
};

const parseDetail = (detail?: unknown) => {
  if (!detail) return {} as Record<string, unknown>;
  if (typeof detail === 'object') {
    return detail as Record<string, unknown>;
  }

  if (typeof detail === 'string') {
    try {
      return JSON.parse(detail) as Record<string, unknown>;
    } catch {
      return { raw: detail };
    }
  }

  return {} as Record<string, unknown>;
};

const EarnsTimeline = ({
  items,
  loading,
  emptyLabel,
}: {
  items: UserKepcoinEarn[];
  loading: boolean;
  emptyLabel: string;
}) => (
  <>
    {loading ? (
      <Stack spacing={3}>
        {[...Array(3)].map((_, index) => (
          <Stack key={index} direction="row" spacing={2} alignItems="center">
            <Box sx={{ width: 12, height: 12, borderRadius: '50%', bgcolor: 'warning.main' }} />
            <Stack spacing={1} flex={1}>
              <Box sx={{ height: 18, width: '40%', bgcolor: 'action.hover', borderRadius: 1 }} />
              <Box sx={{ height: 16, width: '90%', bgcolor: 'action.hover', borderRadius: 1 }} />
            </Stack>
          </Stack>
        ))}
      </Stack>
    ) : items.length === 0 ? (
      <Typography variant="body2" color="text.secondary">
        {emptyLabel}
      </Typography>
    ) : (
      <Timeline sx={{ '& .MuiTimelineItem-root:before': { display: 'none' } }}>
        {items.map((earn) => (
          <TimelineItem key={`${earn.datetime}-${earn.kepcoin}-${earn.note}`}>
            <TimelineSeparator>
              <TimelineDot color="warning" variant="outlined" />
              <TimelineConnector />
            </TimelineSeparator>
            <TimelineContent sx={{ pb: 2 }}>
              <Stack direction="row" justifyContent="space-between" alignItems="center" spacing={2}>
                <Stack direction="row" spacing={1.25} alignItems="center">
                  <Box component="img" src={kepcoinImage} alt="Kepcoin" sx={{ width: 24, height: 24 }} />
                  <Typography variant="h6" fontWeight={700} color="text.primary">
                    {earn.kepcoin}
                  </Typography>
                </Stack>
                <Typography variant="caption" color="text.secondary">
                  {earn.datetime ?? '--'}
                </Typography>
              </Stack>
              <Typography variant="body2" color="text.primary" sx={{ mt: 0.5 }}>
                {earn.note || '--'}
              </Typography>
            </TimelineContent>
          </TimelineItem>
        ))}
      </Timeline>
    )}
  </>
);

const SpendsTimeline = ({
  items,
  loading,
  emptyLabel,
}: {
  items: UserKepcoinSpend[];
  loading: boolean;
  emptyLabel: string;
}) => (
  <>
    {loading ? (
      <Stack spacing={3}>
        {[...Array(3)].map((_, index) => (
          <Stack key={index} direction="row" spacing={2} alignItems="center">
            <Box sx={{ width: 12, height: 12, borderRadius: '50%', bgcolor: 'warning.main' }} />
            <Stack spacing={1} flex={1}>
              <Box sx={{ height: 18, width: '40%', bgcolor: 'action.hover', borderRadius: 1 }} />
              <Box sx={{ height: 16, width: '90%', bgcolor: 'action.hover', borderRadius: 1 }} />
            </Stack>
          </Stack>
        ))}
      </Stack>
    ) : items.length === 0 ? (
      <Typography variant="body2" color="text.secondary">
        {emptyLabel}
      </Typography>
    ) : (
      <Timeline sx={{ '& .MuiTimelineItem-root:before': { display: 'none' } }}>
        {items.map((spend) => (
          <TimelineItem key={`${spend.datetime}-${spend.kepcoin}-${spend.note}`}>
            <TimelineSeparator>
              <TimelineDot color="warning" variant="outlined" />
              <TimelineConnector />
            </TimelineSeparator>
            <TimelineContent sx={{ pb: 2 }}>
              <Stack direction="row" justifyContent="space-between" alignItems="center" spacing={2}>
                <Stack direction="row" spacing={1.25} alignItems="center">
                  <Box component="img" src={kepcoinImage} alt="Kepcoin" sx={{ width: 24, height: 24 }} />
                  <Typography variant="h6" fontWeight={700} color="text.primary">
                    {spend.kepcoin}
                  </Typography>
                </Stack>
                <Typography variant="caption" color="text.secondary">
                  {spend.datetime ?? '--'}
                </Typography>
              </Stack>
              <Typography variant="body2" color="text.primary" sx={{ mt: 0.5 }}>
                {spend.note || '--'}
              </Typography>
            </TimelineContent>
          </TimelineItem>
        ))}
      </Timeline>
    )}
  </>
);

const HowToList = ({ title, items }: { title: string; items: Array<{ value: string; label: string }> }) => (
  <Card>
    <CardHeader title={title} />
    <Divider />
    <CardContent>
      <Stack spacing={2}>
        {items.map((item) => (
          <Stack key={item.label} direction="row" spacing={1.25} alignItems="center">
            <Stack direction="row" spacing={0.75} alignItems="center">
              <Box component="img" src={kepcoinImage} alt="Kepcoin" sx={{ width: 20, height: 20 }} />
              <Typography variant="subtitle2" fontWeight={700}>
                {item.value}
              </Typography>
            </Stack>
            <Typography variant="body2" color="text.secondary">
              {item.label}
            </Typography>
          </Stack>
        ))}
      </Stack>
    </CardContent>
  </Card>
);

const KepcoinPage = () => {
  const { t } = useTranslation();
  const { enqueueSnackbar } = useSnackbar();
  const { currentUser, refreshCurrentUser } = useAuth();
  const api = useMemo(() => getSnippetsAPI(), []);

  const [view, setView] = useState<KepcoinView>('earns');
  const [page, setPage] = useState(1);

  const { data: fetchedBalance, isLoading: loadingBalance } = useSWR<KepCoinBalance>(
    ['/api/my-kepcoin', { method: 'get' }],
    axiosFetcher,
    { revalidateOnFocus: false },
  );

  const { data: streakData, isLoading: loadingStreak, mutate: mutateStreak } = useSWR<StreakResponse>(
    ['/api/streak', { method: 'get' }],
    axiosFetcher,
    { revalidateOnFocus: false },
  );

  const earnKey = view === 'earns' ? ['kepcoin-earns', page] : null;
  const spendKey = view === 'spends' ? ['kepcoin-spends', page] : null;

  const { data: earnResponse, isLoading: loadingEarns } = useSWR<ApiKepcoinEarnsList200>(
    earnKey,
    ([, currentPage]) => api.apiKepcoinEarnsList({ page: currentPage, pageSize: PAGE_SIZE }),
  );

  const { data: spendResponse, isLoading: loadingSpends } = useSWR<ApiKepcoinSpendsList200>(
    spendKey,
    ([, currentPage]) => api.apiKepcoinSpendsList({ page: currentPage, pageSize: PAGE_SIZE }),
  );

  const { trigger: purchaseFreeze, isMutating: purchasingFreeze } = useSWRMutation(
    ['/api/purchase-streak-freeze', { method: 'post' }],
    axiosFetcher,
  );

  const balance = fetchedBalance?.kepcoin ?? currentUser?.kepcoin ?? 0;
  const streakFreeze = streakData?.streakFreeze ?? streakData?.streak_freeze ?? 0;
  const streak = streakData?.streak ?? 0;

  const earnItems = (earnResponse?.data || []).map((earn) => {
    const detail = parseDetail(earn.detail);
    let note: string;

    switch (earn.earnType) {
      case UserKepcoinEarnEarnType.NUMBER_1:
        note = t('WroteBlog');
        break;
      case UserKepcoinEarnEarnType.NUMBER_2:
        note = t('WroteProblemSolution');
        break;
      case UserKepcoinEarnEarnType.NUMBER_3:
        note = t('LoyaltyBonus');
        break;
      case UserKepcoinEarnEarnType.NUMBER_4:
        note = t('BonusFromAdmin');
        break;
      case UserKepcoinEarnEarnType.NUMBER_5:
        note = `${t('DailyActivity')}: ${detail.date ?? ''}`;
        break;
      case UserKepcoinEarnEarnType.NUMBER_6:
        note = `${t('DailyTaskCompleted')}: ${detail.description ?? ''}`;
        break;
      case UserKepcoinEarnEarnType.NUMBER_7:
        note = `${t('DailyRatingWinner')}: ${detail.date ?? ''}`;
        break;
      case UserKepcoinEarnEarnType.NUMBER_8:
        note = `${t('WeeklyRatingWinner')}: ${detail.date ?? ''}`;
        break;
      case UserKepcoinEarnEarnType.NUMBER_9:
        note = `${t('MonthlyRatingWinner')}: ${detail.date ?? ''}`;
        break;
      case UserKepcoinEarnEarnType.NUMBER_10:
        note = `${t('ContestParticipant')}: ${detail.contest?.title ?? ''}`;
        break;
      case UserKepcoinEarnEarnType.NUMBER_11:
        note = `${t('ArenaParticipant')}: ${detail.arena?.title ?? ''}`;
        break;
      case UserKepcoinEarnEarnType.NUMBER_12:
        note = t('TournamentParticipant');
        break;
      case UserKepcoinEarnEarnType.NUMBER_13:
        note = t('ProjectTaskComplete');
        break;
      default:
        note = t('Successfully');
    }

    return { ...earn, note };
  });

  const spendItems = (spendResponse?.data || []).map((spend) => {
    const detail = parseDetail(spend.detail);
    let note: string;

    switch (spend.type) {
      case UserKepcoinSpendType.NUMBER_1:
        note = `${t('ViewAttempt')} #${detail.attemptId ?? ''}`;
        break;
      case UserKepcoinSpendType.NUMBER_2:
        note = `${t('ViewTestAttempt')} #${detail.attemptId ?? ''}`;
        break;
      case UserKepcoinSpendType.NUMBER_3:
        note = `${t('ViewProblemSolution')} ${detail.problemId ? `#${detail.problemId}` : ''} ${detail.problemTitle ?? ''}`.trim();
        break;
      case UserKepcoinSpendType.NUMBER_4:
        note = t('DoubleRating');
        break;
      case UserKepcoinSpendType.NUMBER_5:
        note = t('ChangeImage');
        break;
      case UserKepcoinSpendType.NUMBER_6:
        note = t('Course');
        break;
      case UserKepcoinSpendType.NUMBER_7:
        note = t('StudyPlan');
        break;
      case UserKepcoinSpendType.NUMBER_8:
        note = t('CodeEditorTesting');
        break;
      case UserKepcoinSpendType.NUMBER_9:
        note = t('SaveRating');
        break;
      case UserKepcoinSpendType.NUMBER_10:
        note = `${t('PassTest')}: ${detail.test?.title ?? ''}`;
        break;
      case UserKepcoinSpendType.NUMBER_11:
        note = t('CreateContest');
        break;
      case UserKepcoinSpendType.NUMBER_12:
        note = t('Project');
        break;
      case UserKepcoinSpendType.NUMBER_13:
        note = t('StreakFreeze');
        break;
      case UserKepcoinSpendType.NUMBER_14:
        note = t('VirtualContest');
        break;
      case UserKepcoinSpendType.NUMBER_15:
        note = t('UnratedContest');
        break;
      case UserKepcoinSpendType.NUMBER_16:
        note = t('AnswerForInput');
        break;
      case UserKepcoinSpendType.NUMBER_17:
        note = t('CheckSamples');
        break;
      case UserKepcoinSpendType.NUMBER_18:
        note = t('Merch');
        break;
      default:
        note = t('Successfully');
    }

    return { ...spend, note };
  });

  const totalPages = view === 'earns' ? earnResponse?.pagesCount ?? 0 : spendResponse?.pagesCount ?? 0;

  const handleViewChange = (_: unknown, nextView: KepcoinView | null) => {
    if (nextView) {
      setView(nextView);
      setPage(1);
    }
  };

  const handlePurchaseFreeze = async () => {
    try {
      await purchaseFreeze();
      enqueueSnackbar(t('Successfully'), { variant: 'success' });
      mutateStreak();
      refreshCurrentUser();
    } catch {
      enqueueSnackbar(t('Error'), { variant: 'error' });
    }
  };

  return (
    <Container maxWidth="lg" sx={{ py: { xs: 3, md: 5 } }}>
      <Stack spacing={3}>
        <Stack spacing={1}>
          <Typography variant="h4" fontWeight={700}>
            {t('YouHave')}
          </Typography>
          <Stack direction="row" spacing={1.5} alignItems="center">
            <Box component="img" src={kepcoinImage} alt="Kepcoin" sx={{ width: 32, height: 32 }} />
            <Typography variant="h3" fontWeight={800}>
              {loadingBalance ? '--' : balance.toLocaleString()}
            </Typography>
          </Stack>
        </Stack>

        <Grid container spacing={3}>
          <Grid item xs={12} md={7} lg={8}>
            <Stack spacing={3}>
              <Card>
                <CardHeader
                  title={t('StreakFreeze')}
                  subheader={t('StreakFreezeText')}
                  action={
                    <Chip
                      color="primary"
                      label={`${t('YouHave')}: ${loadingStreak ? '--' : streakFreeze}`}
                      variant="outlined"
                    />
                  }
                />
                <Divider />
                <CardContent>
                  <Stack spacing={2}>
                    <Stack direction="row" spacing={1.5} alignItems="center">
                      <Chip color="info" label={`${t('DailyTasks')}: ${streak}`} variant="outlined" />
                      <Typography variant="body2" color="text.secondary">
                        {t('StreakFreezeText')}
                      </Typography>
                    </Stack>
                    <LoadingButton
                      variant="contained"
                      color="warning"
                      loading={purchasingFreeze}
                      onClick={handlePurchaseFreeze}
                    >
                      <Stack direction="row" spacing={1} alignItems="center">
                        <Typography variant="button">{t('Purchase')}</Typography>
                        <Stack direction="row" spacing={0.5} alignItems="center">
                          <Box component="img" src={kepcoinImage} alt="Kepcoin" sx={{ width: 18, height: 18 }} />
                          <Typography variant="button" fontWeight={700}>
                            10
                          </Typography>
                        </Stack>
                      </Stack>
                    </LoadingButton>
                  </Stack>
                </CardContent>
              </Card>

              <Card>
                <CardHeader
                  title={view === 'earns' ? t('Earns') : t('Spends')}
                  action={
                    <ToggleButtonGroup
                      size="small"
                      value={view}
                      exclusive
                      onChange={handleViewChange}
                      color="primary"
                    >
                      <ToggleButton value="earns">{t('Earns')}</ToggleButton>
                      <ToggleButton value="spends">{t('Spends')}</ToggleButton>
                    </ToggleButtonGroup>
                  }
                />
                <Divider />
                <CardContent>
                  {view === 'earns' ? (
                    <EarnsTimeline
                      items={earnItems}
                      loading={loadingEarns}
                      emptyLabel={t('NoData')}
                    />
                  ) : (
                    <SpendsTimeline
                      items={spendItems}
                      loading={loadingSpends}
                      emptyLabel={t('NoData')}
                    />
                  )}
                  {totalPages > 1 && (
                    <Stack direction="row" justifyContent="center" sx={{ mt: 2 }}>
                      <Button
                        variant="outlined"
                        color="primary"
                        onClick={() => setPage((prev) => Math.max(1, prev - 1))}
                        disabled={page === 1}
                      >
                        {t('Back')}
                      </Button>
                      <Typography variant="body2" color="text.secondary" sx={{ px: 2, alignSelf: 'center' }}>
                        {page} / {totalPages}
                      </Typography>
                      <Button
                        variant="outlined"
                        color="primary"
                        onClick={() => setPage((prev) => Math.min(totalPages, prev + 1))}
                        disabled={page >= totalPages}
                      >
                        {t('Next')}
                      </Button>
                    </Stack>
                  )}
                </CardContent>
              </Card>
            </Stack>
          </Grid>

          <Grid item xs={12} md={5} lg={4}>
            <Stack spacing={3}>
              <HowToList
                title={t('HowToEarnKepcoin')}
                items={[
                  { value: '1', label: t('EarnItem1') },
                  { value: '1-10', label: t('EarnItem2') },
                  { value: '3, 10, 50', label: t('EarnItem3') },
                  { value: '5+', label: t('EarnItem4') },
                  { value: '10-100', label: t('EarnItem5') },
                  { value: '1-50', label: t('EarnItem6') },
                ]}
              />

              <HowToList
                title={t('HowToSpendKepcoin')}
                items={[
                  { value: '0-14', label: t('SpendItem1') },
                  { value: '1', label: t('SpendItem2') },
                  { value: '2-50', label: t('SpendItem3') },
                  { value: '5', label: t('SpendItem4') },
                  { value: '1', label: t('SpendItem5') },
                  { value: '1-1000', label: t('SpendItem6') },
                  { value: '10', label: t('SpendItem7') },
                  { value: '25', label: t('SpendItem8') },
                  { value: '25', label: t('SpendItem9') },
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

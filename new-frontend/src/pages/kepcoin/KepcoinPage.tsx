import { useMemo, useState } from 'react';
import {
  Box,
  Button,
  Card,
  CardContent,
  CardHeader,
  Chip,
  CircularProgress,
  Divider,
  Grid,
  Pagination,
  Stack,
  Typography,
} from '@mui/material';
import { useTranslation } from 'react-i18next';
import { useAuth } from 'app/providers/AuthProvider';
import {
  type ApiKepcoinEarnsList200,
  type ApiKepcoinSpendsList200,
  type KepCoinBalance,
  UserKepcoinEarn,
  type UserKepcoinEarnEarnType,
  UserKepcoinSpend,
  type UserKepcoinSpendType,
} from 'shared/api/orval/generated/endpoints/index.schemas';
import kepcoinImage from 'shared/assets/images/icons/kepcoin.png';
import axiosFetcher from 'shared/services/axios/axiosFetcher';
import useSWR from 'swr';
import useSWRMutation from 'swr/mutation';

const earnTypeKeyMap: Record<UserKepcoinEarnEarnType, string> = {
  1: 'WroteBlog',
  2: 'WroteProblemSolution',
  3: 'LoyaltyBonus',
  4: 'BonusFromAdmin',
  5: 'DailyActivity',
  6: 'DailyTaskCompleted',
  7: 'DailyRatingWinner',
  8: 'WeeklyRatingWinner',
  9: 'MonthlyRatingWinner',
  10: 'ContestParticipant',
  11: 'ArenaParticipant',
  12: 'TournamentParticipant',
  13: 'ProjectTaskComplete',
};

const spendTypeKeyMap: Record<UserKepcoinSpendType, string> = {
  1: 'ViewAttempt',
  2: 'ViewTestAttempt',
  3: 'ViewProblemSolution',
  4: 'DoubleRating',
  5: 'ChangeImage',
  6: 'Course',
  7: 'StudyPlan',
  8: 'CodeEditorTesting',
  9: 'SaveRating',
  10: 'PassTest',
  11: 'CreateContest',
  12: 'Project',
  13: 'StreakFreeze',
  14: 'VirtualContest',
  15: 'UnratedContest',
  16: 'AnswerForInput',
  17: 'CheckSamples',
  18: 'Merch',
};

const PAGE_SIZE = 10;

interface StreakStats {
  streak?: number;
  streakFreeze?: number;
}

type ParsedDetail = Record<string, unknown> | string | null;

const parseDetail = (detail?: string): ParsedDetail => {
  if (!detail) return null;

  try {
    return JSON.parse(detail);
  } catch {
    return detail;
  }
};

const formatEarnDetail = (earn: UserKepcoinEarn, t: (key: string) => string): string => {
  const baseLabel = earnTypeKeyMap[earn.earnType]
    ? t(earnTypeKeyMap[earn.earnType])
    : t('Earns');
  const detail = parseDetail(earn.detail);

  if (earn.earnType === 5 && detail && typeof detail === 'object' && 'date' in detail) {
    return `${baseLabel}: ${String(detail.date)}`;
  }

  if (earn.earnType === 6 && detail && typeof detail === 'object' && 'description' in detail) {
    return `${baseLabel}: ${String(detail.description)}`;
  }

  if (earn.earnType === 7 && detail && typeof detail === 'object' && 'date' in detail) {
    return `${baseLabel}: ${String(detail.date)}`;
  }

  if (earn.earnType === 8 && detail && typeof detail === 'object' && 'date' in detail) {
    return `${baseLabel}: ${String(detail.date)}`;
  }

  if (earn.earnType === 9 && detail && typeof detail === 'object' && 'date' in detail) {
    return `${baseLabel}: ${String(detail.date)}`;
  }

  if (earn.earnType === 10 && detail && typeof detail === 'object' && 'contest' in detail) {
    const contestTitle =
      typeof detail.contest === 'object' && detail.contest && 'title' in detail.contest
        ? String(detail.contest.title)
        : null;

    if (contestTitle) {
      return `${baseLabel}: ${contestTitle}`;
    }
  }

  if (earn.earnType === 11 && detail && typeof detail === 'object' && 'arena' in detail) {
    const arenaTitle =
      typeof detail.arena === 'object' && detail.arena && 'title' in detail.arena
        ? String(detail.arena.title)
        : null;

    if (arenaTitle) {
      return `${baseLabel}: ${arenaTitle}`;
    }
  }

  if (detail) {
    if (typeof detail === 'string') {
      return `${baseLabel}: ${detail}`;
    }

    if ('note' in detail) {
      return `${baseLabel}: ${String(detail.note)}`;
    }
  }

  if (earn.note) {
    return `${baseLabel}: ${earn.note}`;
  }

  return baseLabel;
};

const formatSpendDetail = (spend: UserKepcoinSpend, t: (key: string) => string): string => {
  const baseLabel = spendTypeKeyMap[spend.type]
    ? t(spendTypeKeyMap[spend.type])
    : t('Spends');
  const detail = parseDetail(spend.detail);

  if (spend.type === 1 && detail && typeof detail === 'object' && 'attemptId' in detail) {
    return `${baseLabel}: ${String(detail.attemptId)}`;
  }

  if (spend.type === 2 && detail && typeof detail === 'object' && 'attemptId' in detail) {
    return `${baseLabel}: ${String(detail.attemptId)}`;
  }

  if (spend.type === 3 && detail && typeof detail === 'object') {
    if ('problemTitle' in detail) {
      return `${baseLabel}: ${String(detail.problemTitle)}`;
    }
    if ('problemId' in detail) {
      return `${baseLabel}: ${String(detail.problemId)}`;
    }
  }

  if (spend.type === 10 && detail && typeof detail === 'object' && 'test' in detail) {
    const testTitle =
      typeof detail.test === 'object' && detail.test && 'title' in detail.test
        ? String(detail.test.title)
        : null;

    if (testTitle) {
      return `${baseLabel}: ${testTitle}`;
    }
  }

  if (detail) {
    if (typeof detail === 'string') {
      return `${baseLabel}: ${detail}`;
    }

    if ('note' in detail) {
      return `${baseLabel}: ${String(detail.note)}`;
    }
  }

  if (spend.note) {
    return `${baseLabel}: ${spend.note}`;
  }

  return baseLabel;
};

interface HistoryListProps {
  items: UserKepcoinEarn[] | UserKepcoinSpend[];
  loading?: boolean;
  renderLabel: (item: UserKepcoinEarn | UserKepcoinSpend) => string;
  t: (key: string) => string;
}

const HistoryList = ({ items, loading, renderLabel, t }: HistoryListProps) => {
  if (loading) {
    return (
      <Stack alignItems="center" py={4}>
        <CircularProgress size={22} />
      </Stack>
    );
  }

  if (!items.length) {
    return (
      <Typography variant="body2" color="text.secondary" textAlign="center" py={3}>
        {t('NoKepcoinHistory')}
      </Typography>
    );
  }

  return (
    <Stack spacing={1.5} divider={<Divider flexItem />}>
      {items.map((item, index) => (
        <Stack key={`${item.datetime}-${index}`} spacing={0.75}>
          <Stack direction="row" justifyContent="space-between" alignItems="center" spacing={1.5}>
            <Stack direction="row" spacing={1} alignItems="center">
              <Box component="img" src={kepcoinImage} alt="Kepcoin" sx={{ width: 22, height: 22 }} />
              <Typography variant="subtitle1" fontWeight={700}>
                {item.kepcoin}
              </Typography>
            </Stack>
            {item.datetime && (
              <Typography variant="caption" color="text.secondary">
                {item.datetime}
              </Typography>
            )}
          </Stack>
          <Typography variant="body2" color="text.primary">
            {renderLabel(item)}
          </Typography>
        </Stack>
      ))}
    </Stack>
  );
};

const HowToCard = ({
  title,
  description,
  items,
}: {
  title: string;
  description?: string;
  items: { value: string | number; description: string }[];
}) => (
  <Card>
    <CardHeader titleTypographyProps={{ fontWeight: 700 }} title={title} />
    <CardContent>
      <Stack spacing={1.5}>
        {description && (
          <Typography variant="body2" color="text.secondary">
            {description}
          </Typography>
        )}

        {items.map((item) => (
          <Stack key={item.description} direction="row" spacing={1.5} alignItems="center">
            <Chip
              icon={<Box component="img" src={kepcoinImage} alt="Kepcoin" sx={{ width: 18, height: 18 }} />}
              label={item.value}
              color="warning"
              variant="outlined"
              sx={{ fontWeight: 700 }}
            />
            <Typography variant="body2" color="text.primary">
              {item.description}
            </Typography>
          </Stack>
        ))}
      </Stack>
    </CardContent>
  </Card>
);

const KepcoinPage = () => {
  const { t } = useTranslation();
  const { currentUser, refreshCurrentUser } = useAuth();

  const [view, setView] = useState<'earns' | 'spends'>('earns');
  const [page, setPage] = useState(1);

  const { data: streakStats, mutate: reloadStreak } = useSWR<StreakStats>(
    ['/api/streak', { method: 'get' }],
    axiosFetcher,
    {
      shouldRetryOnError: false,
      revalidateOnFocus: false,
    },
  );

  const { data: kepcoinBalance } = useSWR<KepCoinBalance>(
    ['/api/my-kepcoin', { method: 'get' }],
    axiosFetcher,
    {
      shouldRetryOnError: false,
      revalidateOnFocus: false,
    },
  );

  const { data: earnsData, isLoading: earnsLoading } = useSWR<ApiKepcoinEarnsList200>(
    view === 'earns'
      ? ['/api/kepcoin-earns/', { method: 'get', params: { page, pageSize: PAGE_SIZE } }]
      : null,
    axiosFetcher,
    {
      keepPreviousData: true,
      revalidateOnFocus: false,
    },
  );

  const { data: spendsData, isLoading: spendsLoading } = useSWR<ApiKepcoinSpendsList200>(
    view === 'spends'
      ? ['/api/kepcoin-spends/', { method: 'get', params: { page, pageSize: PAGE_SIZE } }]
      : null,
    axiosFetcher,
    {
      keepPreviousData: true,
      revalidateOnFocus: false,
    },
  );

  const { trigger: purchaseFreeze, isMutating: buyingFreeze } = useSWRMutation(
    ['/api/purchase-streak-freeze', { method: 'post' }],
    axiosFetcher,
  );

  const balance = useMemo(
    () => kepcoinBalance?.kepcoin ?? currentUser?.kepcoin ?? 0,
    [currentUser?.kepcoin, kepcoinBalance?.kepcoin],
  );

  const handleToggleView = () => {
    setView((prev) => (prev === 'earns' ? 'spends' : 'earns'));
    setPage(1);
  };

  const handlePageChange = (_: unknown, value: number) => {
    setPage(value);
  };

  const handlePurchaseFreeze = async () => {
    await purchaseFreeze();
    await reloadStreak();
    await refreshCurrentUser();
  };

  const isEarnView = view === 'earns';
  const activeItems: (UserKepcoinEarn | UserKepcoinSpend)[] = isEarnView
    ? earnsData?.data ?? []
    : spendsData?.data ?? [];
  const activeLoading = isEarnView ? earnsLoading : spendsLoading;
  const totalPages = isEarnView ? earnsData?.pagesCount ?? 0 : spendsData?.pagesCount ?? 0;

  const earnListRenderer = (item: UserKepcoinEarn | UserKepcoinSpend) =>
    formatEarnDetail(item as UserKepcoinEarn, t);
  const spendListRenderer = (item: UserKepcoinEarn | UserKepcoinSpend) =>
    formatSpendDetail(item as UserKepcoinSpend, t);

  return (
    <Box sx={{ p: { xs: 3, md: 5 } }}>
      <Stack spacing={3}>
        <Stack spacing={1}>
          <Typography variant="h4" fontWeight={800}>
            {t('Kepcoin')}
          </Typography>
          <Stack direction="row" spacing={1} alignItems="center">
            <Typography variant="h6" fontWeight={700}>
              {t('YouHave')}
            </Typography>
            <Chip
              icon={<Box component="img" src={kepcoinImage} alt="Kepcoin" sx={{ width: 22, height: 22 }} />}
              label={balance.toLocaleString()}
              color="warning"
              variant="outlined"
              sx={{ fontWeight: 700, fontSize: 16, py: 0.75 }}
            />
          </Stack>
        </Stack>

        <Grid container spacing={3}>
          <Grid item xs={12} lg={7}>
            <Stack spacing={3}>
              <Card>
                <CardHeader
                  title={
                    <Stack direction="row" spacing={1} alignItems="center">
                      <Typography variant="h6" fontWeight={700}>
                        {t('StreakFreeze')}
                      </Typography>
                      <Chip label={`${t('YouHave')} ${streakStats?.streakFreeze ?? 0}`} color="primary" size="small" />
                    </Stack>
                  }
                />
                <CardContent>
                  <Stack spacing={2}>
                    <Stack direction="row" spacing={1} alignItems="center">
                      <Typography variant="body2" color="text.secondary">
                        {t('StreakFreezeText')}
                      </Typography>
                    </Stack>

                    <Stack direction="row" spacing={2} alignItems="center">
                      <Chip label={`${t('Streak')}: ${streakStats?.streak ?? 0}`} color="info" variant="outlined" />
                      <Button
                        variant="contained"
                        color="warning"
                        onClick={handlePurchaseFreeze}
                        disabled={buyingFreeze || balance < 10}
                      >
                        {buyingFreeze ? <CircularProgress size={18} color="inherit" /> : `${t('StreakFreeze')} - 10`}
                      </Button>
                    </Stack>
                  </Stack>
                </CardContent>
              </Card>

              <Card>
                <CardHeader
                  titleTypographyProps={{ fontWeight: 700 }}
                  title={isEarnView ? t('Earns') : t('Spends')}
                  action={
                    <Button variant="outlined" size="small" color="warning" onClick={handleToggleView}>
                      {isEarnView ? t('Spends') : t('Earns')}
                    </Button>
                  }
                />
                <CardContent>
                  <Stack spacing={2.5}>
                    <HistoryList
                      items={activeItems}
                      loading={activeLoading}
                      t={t}
                      renderLabel={isEarnView ? earnListRenderer : spendListRenderer}
                    />
                    {totalPages > 1 && (
                      <Stack alignItems="center">
                        <Pagination
                          count={totalPages}
                          page={page}
                          onChange={handlePageChange}
                          color="warning"
                          shape="rounded"
                        />
                      </Stack>
                    )}
                  </Stack>
                </CardContent>
              </Card>
            </Stack>
          </Grid>

          <Grid item xs={12} lg={5}>
            <Stack spacing={3}>
              <HowToCard
                title={t('HowToEarnKepcoin')}
                description={t('EarnDescription')}
                items={[
                  { value: '1', description: t('EarnItem1') },
                  { value: '1-10', description: t('EarnItem2') },
                  { value: '3, 10, 50', description: t('EarnItem3') },
                  { value: '5+', description: t('EarnItem4') },
                  { value: '10-100', description: t('EarnItem5') },
                  { value: '1-50', description: t('EarnItem6') },
                ]}
              />

              <HowToCard
                title={t('HowToSpendKepcoin')}
                items={[
                  { value: '0-14', description: t('SpendItem1') },
                  { value: '1', description: t('SpendItem2') },
                  { value: '2-50', description: t('SpendItem3') },
                  { value: '5', description: t('SpendItem4') },
                  { value: '1', description: t('SpendItem5') },
                  { value: '1-1000', description: t('SpendItem6') },
                  { value: '10', description: t('SpendItem7') },
                  { value: '25', description: t('SpendItem8') },
                  { value: '25', description: t('SpendItem9') },
                ]}
              />
            </Stack>
          </Grid>
        </Grid>
      </Stack>
    </Box>
  );
};

export default KepcoinPage;

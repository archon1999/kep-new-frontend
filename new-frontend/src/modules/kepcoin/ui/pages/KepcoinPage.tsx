import { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Box, Divider, Grid, Skeleton, Stack, Typography } from '@mui/material';
import {
  useKepcoinEarnHistory,
  useKepcoinSpendHistory,
  useKepcoinSummary,
} from '../../application/queries';
import StreakWidget from '../widgets/StreakWidget';
import KepcoinActivityWidget from '../widgets/KepcoinActivityWidget';
import HowToEarnWidget from '../widgets/HowToEarnWidget';
import HowToSpendWidget from '../widgets/HowToSpendWidget';
import { HistoryView } from '../types';

const PAGE_SIZE = 10;

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
              <StreakWidget
                streak={summary?.streak}
                streakFreeze={summary?.streakFreeze}
                isLoading={isSummaryLoading}
              />
              <KepcoinActivityWidget
                view={view}
                onViewChange={handleViewChange}
                isLoading={isHistoryLoading}
                error={historyError}
                historyItems={historyItems}
                pagesCount={pagesCount}
                page={page}
                onPageChange={handlePageChange}
                onRetry={retryHistory}
              />
            </Stack>
          </Grid>

          <Grid item xs={12} md={5}>
            <Stack spacing={4} divider={<Divider flexItem sx={{ borderColor: 'divider' }} />}>
              <HowToEarnWidget />
              <HowToSpendWidget />
            </Stack>
          </Grid>
        </Grid>
      </Stack>
    </Box>
  );
};

export default KepcoinPage;

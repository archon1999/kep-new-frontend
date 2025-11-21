import { useState } from 'react';
import { Grid } from '@mui/material';
import {
  useKepcoinEarnHistory,
  useKepcoinSpendHistory,
  useKepcoinSummary,
} from '../../application/queries';
import { HistoryView } from '../types';
import HowToEarnWidget from '../widgets/HowToEarnWidget';
import HowToSpendWidget from '../widgets/HowToSpendWidget';
import KepcoinActivityWidget from '../widgets/KepcoinActivityWidget';
import StreakWidget from '../widgets/StreakWidget';

const PAGE_SIZE = 10;

const KepcoinPage = () => {
  const [view, setView] = useState<HistoryView>('earns');
  const [page, setPage] = useState(1);

  const { data: summary, isLoading: isSummaryLoading, mutate: reloadSummary } = useKepcoinSummary();
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

  const handlePurchaseStreakFreeze = async () => {
    await Promise.all([reloadSummary(), reloadSpend()]);
  };

  return (
    <Grid container>
      <Grid size={{ sm: 12, lg: 6 }}>
        <StreakWidget
          balance={summary?.balance}
          streak={summary?.streak}
          maxStreak={summary?.maxStreak}
          streakFreeze={summary?.streakFreeze}
          isLoading={isSummaryLoading}
          onPurchaseStreakFreeze={handlePurchaseStreakFreeze}
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
      </Grid>

      <Grid size={{ sm: 12, lg: 6 }}>
        <HowToEarnWidget />
        <HowToSpendWidget />
      </Grid>
    </Grid>
  );
};

export default KepcoinPage;

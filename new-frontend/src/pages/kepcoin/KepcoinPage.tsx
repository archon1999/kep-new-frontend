import { useState } from 'react';
import { Alert, Box, Stack } from '@mui/material';
import Grid from '@mui/material/Grid';
import { useTranslation } from 'react-i18next';
import { useSnackbar } from 'notistack';
import KepcoinHero from './components/KepcoinHero';
import StreakFreezeCard from './components/StreakFreezeCard';
import HistoryCard from './components/HistoryCard';
import HowToCard from './components/HowToCard';
import { useAuth } from 'app/providers/AuthProvider';
import {
  useKepcoinBalance,
  useKepcoinEarns,
  useKepcoinSpends,
  useKepcoinStreak,
} from 'modules/kepcoin/application/queries';
import { usePurchaseStreakFreeze } from 'modules/kepcoin/application/mutations';

const PAGE_SIZE = 10;

const KepcoinPage = () => {
  const { t } = useTranslation();
  const { currentUser, refreshCurrentUser } = useAuth();
  const { enqueueSnackbar } = useSnackbar();
  const [view, setView] = useState<'earns' | 'spends'>('earns');
  const [page, setPage] = useState(1);

  const isAuthenticated = Boolean(currentUser);

  const balanceQuery = useKepcoinBalance({ enabled: isAuthenticated });
  const streakQuery = useKepcoinStreak({ enabled: isAuthenticated });
  const earnsQuery = useKepcoinEarns(
    { page, pageSize: PAGE_SIZE },
    { enabled: isAuthenticated && view === 'earns' },
  );
  const spendsQuery = useKepcoinSpends(
    { page, pageSize: PAGE_SIZE },
    { enabled: isAuthenticated && view === 'spends' },
  );
  const { trigger: purchaseFreeze, isMutating: purchasingFreeze } = usePurchaseStreakFreeze();

  const handlePurchaseFreeze = async () => {
    try {
      await purchaseFreeze();
      enqueueSnackbar(t('kepcoin.streakFreeze.success'), { variant: 'success' });
      streakQuery.mutate();
      balanceQuery.mutate();
      if (view === 'earns') {
        earnsQuery.mutate();
      } else {
        spendsQuery.mutate();
      }
      refreshCurrentUser();
    } catch (error) {
      enqueueSnackbar(t('kepcoin.streakFreeze.error'), { variant: 'error' });
    }
  };

  if (!isAuthenticated) {
    return (
      <Box sx={{ p: { xs: 3, md: 5 } }}>
        <Alert severity="info">{t('kepcoin.authRequired')}</Alert>
      </Box>
    );
  }

  const balance = balanceQuery.data?.amount ?? currentUser?.kepcoin ?? null;
  const streak = streakQuery.data?.streak ?? 0;
  const streakFreeze = streakQuery.data?.streakFreeze ?? 0;

  const howToEarnItems = [
    { value: '1', labelKey: 'kepcoin.howToEarn.item1' },
    { value: '1-10', labelKey: 'kepcoin.howToEarn.item2' },
    { value: '3, 10, 50', labelKey: 'kepcoin.howToEarn.item3' },
    { value: '5+', labelKey: 'kepcoin.howToEarn.item4' },
    { value: '10-100', labelKey: 'kepcoin.howToEarn.item5' },
    { value: '1-50', labelKey: 'kepcoin.howToEarn.item6' },
  ];

  const howToSpendItems = [
    { value: '0-14', labelKey: 'kepcoin.howToSpend.item1' },
    { value: '1', labelKey: 'kepcoin.howToSpend.item2' },
    { value: '2-50', labelKey: 'kepcoin.howToSpend.item3' },
    { value: '5', labelKey: 'kepcoin.howToSpend.item4' },
    { value: '1', labelKey: 'kepcoin.howToSpend.item5' },
    { value: '1-1000', labelKey: 'kepcoin.howToSpend.item6' },
    { value: '10', labelKey: 'kepcoin.howToSpend.item7' },
    { value: '25', labelKey: 'kepcoin.howToSpend.item8' },
    { value: '25', labelKey: 'kepcoin.howToSpend.item9' },
  ];

  return (
    <Box sx={{ p: { xs: 3, md: 5 } }}>
      <Stack spacing={4}>
        <KepcoinHero balance={balance} loading={balanceQuery.isLoading} />

        <Grid container spacing={3}>
          <Grid item xs={12} lg={8}>
            <Stack spacing={3}>
              <StreakFreezeCard
                streak={streak}
                streakFreeze={streakFreeze}
                loading={streakQuery.isLoading}
                purchasing={purchasingFreeze}
                onPurchase={handlePurchaseFreeze}
              />

              <HistoryCard
                view={view}
                onToggle={() => {
                  setView((prev) => (prev === 'earns' ? 'spends' : 'earns'));
                  setPage(1);
                }}
                page={page}
                pageSize={PAGE_SIZE}
                onPageChange={setPage}
                earns={earnsQuery.data}
                spends={spendsQuery.data}
                loading={view === 'earns' ? earnsQuery.isLoading : spendsQuery.isLoading}
                error={(view === 'earns' ? earnsQuery.error : spendsQuery.error) as Error | undefined}
              />
            </Stack>
          </Grid>

          <Grid item xs={12} lg={4}>
            <Stack spacing={3}>
              <HowToCard
                titleKey="kepcoin.howToEarn.title"
                descriptionKey="kepcoin.howToEarn.description"
                icon="mdi:trending-up"
                items={howToEarnItems}
              />

              <HowToCard
                titleKey="kepcoin.howToSpend.title"
                icon="mdi:coffee"
                items={howToSpendItems}
              />
            </Stack>
          </Grid>
        </Grid>
      </Stack>
    </Box>
  );
};

export default KepcoinPage;

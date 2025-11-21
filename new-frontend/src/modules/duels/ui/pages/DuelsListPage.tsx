import { useMemo, useState } from 'react';
import {
  Box,
  Card,
  CardContent,
  CircularProgress,
  Grid,
  Pagination,
  Stack,
  Switch,
  Tab,
  Tabs,
  Typography,
} from '@mui/material';
import { useTranslation } from 'react-i18next';
import { useSnackbar } from 'notistack';
import { useDuelReadyStatus, useDuels, useMyDuels, useReadyPlayers } from '../../application/queries.ts';
import { duelsRepository } from '../../data-access/repository/http.duels.repository.ts';
import DuelCard from '../components/DuelCard.tsx';
import ReadyPlayerCard from '../components/ReadyPlayerCard.tsx';
import { responsivePagePaddingSx } from 'shared/lib/styles';

const DuelsListPage = () => {
  const { t } = useTranslation();
  const { enqueueSnackbar } = useSnackbar();
  const [tab, setTab] = useState<'my' | 'ready' | 'all'>('my');
  const [page, setPage] = useState(1);
  const pageSize = 6;

  const { data: readyStatus, mutate: mutateReadyStatus } = useDuelReadyStatus();
  const { data: readyPlayers } = useReadyPlayers({ page, pageSize });
  const { data: myDuels, mutate: mutateMyDuels } = useMyDuels({ page, pageSize });
  const { data: duels } = useDuels({ page, pageSize });

  const handleToggleReady = async (_: unknown, checked: boolean) => {
    await duelsRepository.updateReadyStatus(checked);
    await mutateReadyStatus();
    enqueueSnackbar(
      checked ? t('duels.readyEnabled') : t('duels.readyDisabled'),
      { variant: 'success' },
    );
  };

  const handleConfirm = async (duelId: number) => {
    await duelsRepository.confirmDuel(duelId);
    await mutateMyDuels();
    enqueueSnackbar(t('duels.confirmed'), { variant: 'success' });
  };

  const { items, totalPages, loading } = useMemo(() => {
    const source = tab === 'ready' ? readyPlayers : tab === 'all' ? duels : myDuels;
    return {
      items: source?.data ?? [],
      totalPages: source?.pagesCount ?? 0,
      loading: !source,
    };
  }, [tab, readyPlayers, duels, myDuels]);

  return (
    <Box sx={responsivePagePaddingSx}>
      <Stack spacing={3} direction="column">
        <Stack spacing={1} direction="column">
          <Typography variant="h4" fontWeight={800}>
            {t('duels.title')}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {t('duels.subtitle')}
          </Typography>
        </Stack>

        <Card variant="outlined">
          <CardContent>
            <Stack direction="row" spacing={2} alignItems="center" justifyContent="space-between">
              <Stack spacing={0.5}>
                <Typography variant="subtitle1">{t('duels.readyTitle')}</Typography>
                <Typography variant="body2" color="text.secondary">
                  {t('duels.readyDescription')}
                </Typography>
              </Stack>
              <Switch
                checked={Boolean(readyStatus?.ready)}
                onChange={handleToggleReady}
                color="primary"
              />
            </Stack>
          </CardContent>
        </Card>

        <Tabs value={tab} onChange={(_, value) => setTab(value)} variant="scrollable">
          <Tab value="my" label={t('duels.tabs.my')} />
          <Tab value="ready" label={t('duels.tabs.ready')} />
          <Tab value="all" label={t('duels.tabs.all')} />
        </Tabs>

        {loading && (
          <Stack alignItems="center" py={4}>
            <CircularProgress />
          </Stack>
        )}

        {!loading && tab === 'ready' && (
          <Grid container spacing={2}>
            {items.map((player) => (
              <Grid item xs={12} sm={6} md={4} key={(player as any).username}>
                <ReadyPlayerCard player={player as any} />
              </Grid>
            ))}
            {!items.length && (
              <Grid item xs={12}>
                <Typography variant="body2" color="text.secondary">
                  {t('duels.noReadyPlayers')}
                </Typography>
              </Grid>
            )}
          </Grid>
        )}

        {!loading && tab !== 'ready' && (
          <Grid container spacing={2}>
            {items.map((duel) => (
              <Grid item xs={12} md={6} key={(duel as any).id}>
                <DuelCard duel={duel as any} onConfirm={tab === 'my' ? handleConfirm : undefined} />
              </Grid>
            ))}
            {!items.length && (
              <Grid item xs={12}>
                <Typography variant="body2" color="text.secondary">
                  {t('duels.noDuels')}
                </Typography>
              </Grid>
            )}
          </Grid>
        )}

        <Box display="flex" justifyContent="flex-end">
          <Pagination count={totalPages} page={page} onChange={(_, value) => setPage(value)} color="primary" />
        </Box>
      </Stack>
    </Box>
  );
};

export default DuelsListPage;

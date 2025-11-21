import { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Link as RouterLink } from 'react-router';
import { useSWRConfig } from 'swr';
import { Box, Button, Stack, Tab, Tabs, Typography } from '@mui/material';
import { responsivePagePaddingSx } from 'shared/lib/styles';
import paths from 'app/routes/paths.ts';
import { useConfirmDuel, useUpdateReadyStatus } from '../../application/mutations.ts';
import { useDuelsList, useReadyPlayers, useReadyStatus } from '../../application/queries.ts';
import DuelReadyStatusCard from '../components/DuelReadyStatusCard.tsx';
import DuelsListSection from '../components/DuelsListSection.tsx';
import ReadyPlayersList from '../components/ReadyPlayersList.tsx';

type TabKey = 'my' | 'ready' | 'all';

const DuelsPage = () => {
  const { t } = useTranslation();
  const { mutate } = useSWRConfig();

  const [activeTab, setActiveTab] = useState<TabKey>('my');
  const [myPage, setMyPage] = useState(1);
  const [allPage, setAllPage] = useState(1);
  const [readyPlayersPage, setReadyPlayersPage] = useState(1);
  const [confirmLoadingId, setConfirmLoadingId] = useState<number | null>(null);

  const { data: readyStatus, isLoading: readyStatusLoading } = useReadyStatus();
  const updateReadyStatus = useUpdateReadyStatus();

  const { data: myDuels, isLoading: myDuelsLoading, mutate: mutateMyDuels } = useDuelsList({
    page: myPage,
    pageSize: 5,
    my: true,
  });

  const { data: allDuels, isLoading: allDuelsLoading, mutate: mutateAllDuels } = useDuelsList({
    page: allPage,
    pageSize: 5,
  });

  const { data: readyPlayers, mutate: mutateReadyPlayers } = useReadyPlayers({
    page: readyPlayersPage,
    pageSize: 6,
  });

  const confirmDuel = useConfirmDuel();

  const handleReadyChange = async (ready: boolean) => {
    await updateReadyStatus.trigger(ready);
    await mutate('duels-ready-status');
    await mutateReadyPlayers();
  };

  const handleConfirm = async (duelId: number) => {
    try {
      setConfirmLoadingId(duelId);
      await confirmDuel.trigger(duelId);
      await mutateMyDuels();
      await mutateAllDuels();
    } finally {
      setConfirmLoadingId(null);
    }
  };

  const subtitle = useMemo(() => t('duels.subtitle'), [t]);

  return (
    <Box sx={responsivePagePaddingSx}>
      <Stack direction="column" spacing={3}>
        <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} alignItems={{ xs: 'flex-start', sm: 'center' }} justifyContent="space-between">
          <Stack spacing={1}>
            <Typography variant="h4" fontWeight={800}>
              {t('duels.title')}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {subtitle}
            </Typography>
          </Stack>

          <Button component={RouterLink} to={paths.duelsRating} variant="outlined" startIcon={<span>🏆</span>}>
            {t('duels.rating')}
          </Button>
        </Stack>

        <DuelReadyStatusCard
          status={readyStatus}
          loading={readyStatusLoading || updateReadyStatus.isMutating}
          onChange={handleReadyChange}
        />

        <Tabs value={activeTab} onChange={(_, value) => setActiveTab(value)} variant="scrollable" allowScrollButtonsMobile>
          <Tab label={t('duels.myDuels')} value="my" />
          <Tab label={t('duels.readyPlayers')} value="ready" />
          <Tab label={t('duels.allDuels')} value="all" />
        </Tabs>

        {activeTab === 'my' ? (
          <DuelsListSection
            titleKey="duels.myDuels"
            duels={myDuels}
            loading={myDuelsLoading}
            page={myPage}
            onPageChange={setMyPage}
            onConfirm={handleConfirm}
            confirmLoadingId={confirmLoadingId}
          />
        ) : null}

        {activeTab === 'ready' ? (
          <ReadyPlayersList players={readyPlayers} page={readyPlayersPage} onPageChange={setReadyPlayersPage} />
        ) : null}

        {activeTab === 'all' ? (
          <DuelsListSection
            titleKey="duels.allDuels"
            duels={allDuels}
            loading={allDuelsLoading}
            page={allPage}
            onPageChange={setAllPage}
            onConfirm={handleConfirm}
            confirmLoadingId={confirmLoadingId}
          />
        ) : null}
      </Stack>
    </Box>
  );
};

export default DuelsPage;

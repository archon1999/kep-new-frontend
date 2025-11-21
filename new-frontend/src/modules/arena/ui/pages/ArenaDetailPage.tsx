import { useEffect, useMemo, useState } from 'react';
import { Box, Button, Grid, Skeleton, Stack, Typography } from '@mui/material';
import { useNavigate, useParams } from 'react-router';
import { useTranslation } from 'react-i18next';
import { useSWRConfig } from 'swr';
import { arenaQueries, useArenaChallenges, useArenaDetails, useArenaPlayerStatistics, useArenaPlayers, useArenaStatistics, useArenaTopPlayers } from '../../application/queries.ts';
import { ArenaStatus } from '../../domain/entities/arena.entity.ts';
import ArenaInfoCard from '../components/ArenaInfoCard.tsx';
import ArenaCountdownCard from '../components/ArenaCountdownCard.tsx';
import ArenaPlayersTable from '../components/ArenaPlayersTable.tsx';
import ArenaChallengesList from '../components/ArenaChallengesList.tsx';
import ArenaStatisticsCard from '../components/ArenaStatisticsCard.tsx';
import ArenaPlayerStatisticsCard from '../components/ArenaPlayerStatisticsCard.tsx';
import ArenaWinnersCard from '../components/ArenaWinnersCard.tsx';
import { useAuth } from 'app/providers/AuthProvider.tsx';
import { getResourceById, resources } from 'app/routes/resources.ts';
import IconifyIcon from 'shared/components/base/IconifyIcon.tsx';
import { responsivePagePaddingSx } from 'shared/lib/styles';

const ArenaDetailPage = () => {
  const { id } = useParams();
  const { t } = useTranslation();
  const { mutate } = useSWRConfig();
  const navigate = useNavigate();
  const { currentUser } = useAuth();

  const { data: arena, isLoading: isArenaLoading, mutate: mutateArena } = useArenaDetails(id);
  const [playersPage, setPlayersPage] = useState(1);
  const [selectedUsername, setSelectedUsername] = useState<string | undefined>();
  const { data: players, isLoading: isPlayersLoading } = useArenaPlayers(id, { page: playersPage, pageSize: 10 });
  const { data: playerStatistics } = useArenaPlayerStatistics(id, selectedUsername);
  const { data: challenges, isLoading: isChallengesLoading } = useArenaChallenges(id, { page: 1, pageSize: 6 });
  const { data: topPlayers } = useArenaTopPlayers(id);
  const { data: statistics } = useArenaStatistics(id);

  useEffect(() => {
    if (!selectedUsername && players?.data?.length) {
      setSelectedUsername(players.data[0].username);
    }
  }, [players?.data, selectedUsername]);

  const handleRegister = async () => {
    if (!id) return;
    await arenaQueries.arenaRepository.register(id);
    await mutateArena();
    await mutate(['arena-players', id, { page: playersPage, pageSize: 10 }]);
  };

  const handleNextChallenge = async () => {
    if (!id) return;
    const result = await arenaQueries.arenaRepository.loadNextChallenge(id);
    if (result?.challengeId) {
      navigate(getResourceById(resources.Challenge, result.challengeId));
    }
  };

  const handlePauseToggle = async () => {
    if (!id || !arena) return;
    if (arena.pause) {
      await arenaQueries.arenaRepository.start(id);
    } else {
      await arenaQueries.arenaRepository.pause(id);
    }
    await mutateArena();
  };

  const headerTitle = useMemo(() => arena?.title ?? t('arena.title'), [arena?.title, t]);

  return (
    <Box sx={responsivePagePaddingSx}>
      <Stack direction="column" spacing={3}>
        <Stack direction="row" alignItems="center" spacing={1}>
          <IconifyIcon icon="mdi:sword-cross" color="warning.main" fontSize={28} />
          <Typography variant="h4" fontWeight={800}>
            {headerTitle}
          </Typography>
        </Stack>

        {isArenaLoading || !arena ? (
          <Stack direction="column" spacing={2}>
            <Skeleton variant="rounded" height={200} />
            <Skeleton variant="rounded" height={200} />
            <Skeleton variant="rounded" height={200} />
          </Stack>
        ) : (
          <Grid container spacing={3}>
            <Grid size={{ xs: 12, md: 4 }}>
              <Stack direction="column" spacing={3}>
                <ArenaInfoCard arena={arena} onRegister={handleRegister} onNextChallenge={handleNextChallenge} />
                <ArenaCountdownCard arena={arena} />
                <ArenaStatisticsCard stats={statistics} />
                {arena.status === ArenaStatus.Already ? (
                  <Button variant="outlined" color={arena.pause ? 'warning' : 'success'} onClick={handlePauseToggle}>
                    {arena.pause ? t('arena.actions.start') : t('arena.actions.pause')}
                  </Button>
                ) : null}
              </Stack>
            </Grid>

            <Grid size={{ xs: 12, md: 8 }}>
              <Stack direction="column" spacing={3}>
                {arena.status === ArenaStatus.Finished ? <ArenaWinnersCard topPlayers={topPlayers} /> : null}
                <ArenaPlayersTable
                  data={players}
                  loading={isPlayersLoading}
                  page={playersPage}
                  pageSize={10}
                  onPageChange={setPlayersPage}
                  onSelectPlayer={(player) => setSelectedUsername(player.username)}
                  selectedUsername={selectedUsername}
                  currentUsername={currentUser?.username}
                  status={arena.status}
                />
                <ArenaChallengesList data={challenges} loading={isChallengesLoading} />
              </Stack>
            </Grid>

            <Grid size={12}>
              <ArenaPlayerStatisticsCard statistics={playerStatistics} />
            </Grid>
          </Grid>
        )}
      </Stack>
    </Box>
  );
};

export default ArenaDetailPage;

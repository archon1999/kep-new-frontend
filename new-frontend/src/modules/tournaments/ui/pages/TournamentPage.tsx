import { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useParams } from 'react-router-dom';
import {
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  Skeleton,
  Stack,
  Tab,
  Tabs,
  Typography,
} from '@mui/material';
import dayjs from 'dayjs';
import { tournamentsQueries, useTournament } from '../../application/queries.ts';
import { responsivePagePaddingSx } from 'shared/lib/styles';
import TournamentPlayersTable from '../components/TournamentPlayersTable.tsx';
import TournamentDuelsSection from '../components/TournamentDuelsSection.tsx';
import TournamentScheduleTable from '../components/TournamentScheduleTable.tsx';
import KepIcon from 'shared/components/base/KepIcon.tsx';

const TournamentPage = () => {
  const { t } = useTranslation();
  const { id } = useParams();
  const [tab, setTab] = useState('info');

  const { data: tournament, isLoading, mutate } = useTournament(id);

  const canRegister = useMemo(() => {
    if (!tournament) return false;
    return dayjs(tournament.startTime).diff(dayjs(), 'minute') >= 10;
  }, [tournament]);

  const startsAt = useMemo(
    () => (tournament ? dayjs(tournament.startTime).format('MMM DD, YYYY') : ''),
    [tournament],
  );

  const handleRegister = async () => {
    if (!id) return;
    await tournamentsQueries.tournamentsRepository.register(id);
    await mutate();
  };

  return (
    <Box sx={responsivePagePaddingSx}>
      <Stack direction="column" spacing={3}>
        <Card sx={{ borderRadius: 3 }}>
          <CardContent sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            {isLoading ? (
              <Skeleton variant="text" height={40} />
            ) : (
              <Stack direction="row" spacing={2} alignItems="center" flexWrap="wrap" rowGap={1}>
                <Box
                  sx={{
                    width: 72,
                    height: 72,
                    borderRadius: 2,
                    bgcolor: 'primary.lighter',
                    display: 'inline-flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'primary.main',
                  }}
                >
                  <KepIcon icon="tournament" size="medium" />
                </Box>

                <Stack spacing={1} flex={1} minWidth={0}>
                  <Typography variant="h5" fontWeight={800} noWrap>
                    {tournament?.title}
                  </Typography>
                  <Stack direction="row" spacing={1} alignItems="center" flexWrap="wrap" rowGap={0.5}>
                    <Chip label={startsAt} color="primary" size="small" />
                    <Chip
                      label={t('tournaments.playersCount', { count: tournament?.players.length ?? 0 })}
                      size="small"
                      variant="outlined"
                    />
                  </Stack>
                </Stack>

                {tournament ? (
                  <Stack direction="row" spacing={1} alignItems="center">
                    {tournament.isRegistered ? (
                      <Chip label={t('tournaments.registered')} color="primary" variant="outlined" />
                    ) : null}
                    {!tournament.isRegistered && canRegister ? (
                      <Button variant="contained" onClick={handleRegister}>
                        {t('tournaments.register')}
                      </Button>
                    ) : null}
                  </Stack>
                ) : null}
              </Stack>
            )}

            {tournament?.description ? (
              <Typography variant="body2" color="text.secondary" component="div" sx={{ '& p': { m: 0 } }}
                dangerouslySetInnerHTML={{ __html: tournament.description }}
              />
            ) : null}
          </CardContent>
        </Card>

        <Tabs value={tab} onChange={(_, value) => setTab(value)} variant="scrollable" allowScrollButtonsMobile>
          <Tab value="info" label={t('tournaments.tabs.info')} />
          <Tab value="duels" label={t('tournaments.tabs.duels')} />
          <Tab value="results" label={t('tournaments.tabs.results')} />
          <Tab value="schedule" label={t('tournaments.tabs.schedule')} />
        </Tabs>

        {tab === 'info' ? (
          <TournamentPlayersTable players={tournament?.players ?? []} />
        ) : null}

        {tab === 'duels' ? (
          <TournamentDuelsSection stages={tournament?.stages ?? []} />
        ) : null}

        {tab === 'results' ? (
          <TournamentDuelsSection stages={tournament?.stages ?? []} emptyTextKey="tournaments.noResults" />
        ) : null}

        {tab === 'schedule' ? <TournamentScheduleTable stages={tournament?.stages ?? []} /> : null}
      </Stack>
    </Box>
  );
};

export default TournamentPage;

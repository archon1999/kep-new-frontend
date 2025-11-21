import { useMemo, useState } from 'react';
import { Box, Button, Card, CardContent, Chip, Skeleton, Stack, Tab, Tabs, Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { useParams } from 'react-router-dom';
import dayjs from 'dayjs';
import { responsivePagePaddingSx } from 'shared/lib/styles';
import { tournamentsQueries, useTournament } from '../../application/queries';
import TournamentBracket from '../components/TournamentBracket';

const TournamentPage = () => {
  const { id } = useParams();
  const { t } = useTranslation();
  const { data: tournament, isLoading, mutate } = useTournament(id);

  const [tab, setTab] = useState<'info' | 'results'>('results');

  const startTimeLabel = useMemo(() => {
    if (!tournament?.startTime) return '';
    return dayjs(tournament.startTime).format('MMM D, YYYY HH:mm');
  }, [tournament?.startTime]);

  const handleRegister = async () => {
    if (!id) return;
    await tournamentsQueries.tournamentsRepository.register(id);
    await mutate();
  };

  return (
    <Box sx={responsivePagePaddingSx}>
      <Stack direction="column" spacing={3}>
        <Card background={1} sx={{ borderRadius: 3, outline: 'none' }}>
          <CardContent sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            {isLoading ? (
              <Skeleton variant="text" height={40} />
            ) : (
              <Stack direction="row" spacing={2} alignItems="center" flexWrap="wrap" rowGap={1}>
                <Typography variant="h4" fontWeight={800}>
                  {tournament?.title}
                </Typography>
                {tournament?.type ? <Chip label={tournament.type} size="small" /> : null}
                {tournament?.players?.length ? (
                  <Chip label={t('tournaments.playersCount', { count: tournament.players.length })} size="small" variant="outlined" />
                ) : null}
                {tournament?.isRegistered ? (
                  <Chip color="primary" label={t('tournaments.registered')} size="small" />
                ) : null}
                {!tournament?.isRegistered ? (
                  <Button variant="contained" size="small" onClick={handleRegister}>
                    {t('tournaments.register')}
                  </Button>
                ) : null}
              </Stack>
            )}

            <Stack direction="column" spacing={1}>
              <Typography variant="body2" color="text.secondary">
                {t('tournaments.startsAt', { time: startTimeLabel })}
              </Typography>
              {tournament?.description ? (
                <Typography variant="body2" color="text.secondary" component="div" sx={{ '& p': { m: 0 } }}
                  dangerouslySetInnerHTML={{ __html: tournament.description }}
                />
              ) : (
                <Typography variant="body2" color="text.secondary">
                  {t('tournaments.noDescription')}
                </Typography>
              )}
            </Stack>
          </CardContent>
        </Card>

        <Card variant="outlined" sx={{ borderRadius: 3 }}>
          <CardContent sx={{ p: 0 }}>
            <Tabs
              value={tab}
              onChange={(_, value: 'info' | 'results') => setTab(value)}
              variant="scrollable"
              scrollButtons="auto"
              sx={{ px: 2 }}
            >
              <Tab label={t('tournaments.infoTab')} value="info" />
              <Tab label={t('tournaments.resultsTab')} value="results" />
            </Tabs>

            <Box sx={{ p: 2 }}>
              {tab === 'info' ? (
                <Stack direction="column" spacing={2}>
                  <Typography variant="subtitle1" fontWeight={700}>
                    {t('tournaments.participants')}
                  </Typography>
                  <Stack direction="row" spacing={1} flexWrap="wrap" rowGap={1}>
                    {tournament?.players?.length
                      ? tournament.players.map((player) => (
                        <Chip key={player.id} label={`${player.username}`} variant="outlined" />
                      ))
                      : <Typography variant="body2" color="text.secondary">{t('tournaments.noParticipants')}</Typography>}
                  </Stack>
                </Stack>
              ) : (
                <TournamentBracket tournament={tournament} />
              )}
            </Box>
          </CardContent>
        </Card>
      </Stack>
    </Box>
  );
};

export default TournamentPage;

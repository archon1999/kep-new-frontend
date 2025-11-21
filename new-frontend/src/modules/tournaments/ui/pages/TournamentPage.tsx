import { useEffect, useMemo, useState } from 'react';
import { Box, Button, Card, CardContent, Chip, Skeleton, Stack, Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { useParams } from 'react-router-dom';
import IconifyIcon from 'shared/components/base/IconifyIcon';
import { responsivePagePaddingSx } from 'shared/lib/styles';
import { tournamentsQueries, useTournament } from '../../application/queries';
import TournamentTabs from '../components/TournamentTabs';
import TournamentInfoCard from '../components/TournamentInfoCard';
import TournamentDuelsSection from '../components/TournamentDuelsSection';
import TournamentBracket from '../components/TournamentBracket';
import TournamentScheduleSection from '../components/TournamentScheduleSection';

const TournamentPage = () => {
  const { t } = useTranslation();
  const { id } = useParams();
  const [activeTab, setActiveTab] = useState<string>('results');

  const { data: tournament, isLoading, mutate } = useTournament(id);

  useEffect(() => {
    if (tournament && !activeTab) {
      setActiveTab('info');
    }
  }, [activeTab, tournament]);

  const participantsCount = useMemo(() => tournament?.players?.length ?? tournament?.playersCount ?? 0, [tournament]);

  const handleRegistration = async () => {
    if (!id) return;
    await tournamentsQueries.tournamentsRepository.register(id);
    await mutate();
  };

  return (
    <Box sx={responsivePagePaddingSx}>
      <Stack direction="column" spacing={3}>
        {tournament ? (
          <TournamentTabs value={activeTab} onChange={setActiveTab} />
        ) : (
          <Skeleton variant="rectangular" height={56} />
        )}

        <Card background={1} sx={{ borderRadius: 3, outline: 'none' }}>
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
                    bgcolor: 'background.neutral',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <IconifyIcon icon="mdi:tournament" width={36} height={36} />
                </Box>

                <Stack direction="column" spacing={1} minWidth={0} flex={1}>
                  <Typography variant="h4" fontWeight={800} noWrap>
                    {tournament?.title}
                  </Typography>
                  <Stack direction="row" spacing={1} alignItems="center" flexWrap="wrap" rowGap={0.5}>
                    <Chip label={tournament?.type} size="small" color="primary" />
                    <Chip
                      label={t('tournaments.playersCount', { count: participantsCount })}
                      size="small"
                      variant="outlined"
                    />
                    <Chip label={tournament?.startTime} size="small" variant="outlined" />
                  </Stack>
                </Stack>

                <Button variant={tournament?.isRegistered ? 'outlined' : 'contained'} onClick={handleRegistration}>
                  {tournament?.isRegistered ? t('tournaments.registered') : t('tournaments.register')}
                </Button>
              </Stack>
            )}
          </CardContent>
        </Card>

        {activeTab === 'info' && tournament ? <TournamentInfoCard tournament={tournament} /> : null}
        {activeTab === 'duels' && tournament ? <TournamentDuelsSection tournament={tournament} /> : null}
        {activeTab === 'results' && tournament ? <TournamentBracket tournament={tournament} /> : null}
        {activeTab === 'schedule' && tournament ? <TournamentScheduleSection tournament={tournament} /> : null}

        {!tournament && !isLoading ? (
          <Typography variant="body2" color="text.secondary">
            {t('tournaments.notFound')}
          </Typography>
        ) : null}
      </Stack>
    </Box>
  );
};

export default TournamentPage;

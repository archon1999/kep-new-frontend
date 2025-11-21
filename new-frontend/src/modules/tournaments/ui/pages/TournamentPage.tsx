import { useMemo, useState } from 'react';
import { useParams } from 'react-router';
import dayjs from 'dayjs';
import { useTranslation } from 'react-i18next';
import {
  Box,
  Button,
  Chip,
  Divider,
  Skeleton,
  Stack,
  Tab,
  Tabs,
  Typography,
} from '@mui/material';
import { responsivePagePaddingSx } from 'shared/lib/styles';
import Page404 from 'modules/errors/ui/pages/Page404';
import { useTournament } from '../../application/queries';
import { useTournamentRegister } from '../../application/mutations';
import TournamentPlayersTable from '../components/TournamentPlayersTable';
import TournamentDuelsList from '../components/TournamentDuelsList';
import TournamentBracket from '../components/TournamentBracket';

const TournamentPage = () => {
  const { id } = useParams();
  const { t } = useTranslation();
  const [tab, setTab] = useState(0);
  const { data: tournament, isLoading, mutate } = useTournament(id);
  const { trigger: register, isMutating } = useTournamentRegister(id);

  const startDate = useMemo(() => (tournament ? dayjs(tournament.startTime).format('MMM DD, YYYY HH:mm') : ''), [tournament]);

  const handleRegister = async () => {
    await register();
    mutate();
  };

  if (!isLoading && !tournament) {
    return <Page404 />;
  }

  return (
    <Box sx={responsivePagePaddingSx}>
      <Stack spacing={3}>
        <Stack direction={{ xs: 'column', md: 'row' }} spacing={2} justifyContent="space-between" alignItems="flex-start">
          <Stack spacing={1}>
            <Typography variant="h4" fontWeight={800}>
              {tournament?.title || <Skeleton width={320} />}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {startDate || <Skeleton width={180} />}
            </Typography>
            <Stack direction="row" spacing={1} alignItems="center">
              <Chip label={t('tournaments.playersCount', { count: tournament?.playersCount ?? 0 })} color="primary" />
              <Chip label={tournament?.type ?? ''} color="info" variant="outlined" />
            </Stack>
          </Stack>

          <Stack direction="row" spacing={2} alignItems="center">
            {tournament?.isRegistered ? (
              <Chip color="success" label={t('tournaments.registered')} />
            ) : (
              <Button variant="contained" onClick={handleRegister} disabled={!tournament || isMutating}>
                {t('tournaments.register')}
              </Button>
            )}
          </Stack>
        </Stack>

        <Tabs value={tab} onChange={(_, value) => setTab(value)} aria-label="tournament-tabs">
          <Tab label={t('tournaments.infoTab')} />
          <Tab label={t('tournaments.duelsTab')} />
          <Tab label={t('tournaments.resultsTab')} />
          <Tab label={t('tournaments.scheduleTab')} />
        </Tabs>
        <Divider />

        {tab === 0 ? (
          <Stack spacing={2}>
            <Box
              sx={{
                borderRadius: 3,
                border: (theme) => `1px solid ${theme.palette.divider}`,
                p: 3,
              }}
            >
              {tournament ? (
                <Box dangerouslySetInnerHTML={{ __html: tournament.description }} />
              ) : (
                <Skeleton variant="rounded" height={200} />
              )}
            </Box>
            <Stack spacing={1}>
              <Typography variant="h6" fontWeight={800}>
                {t('tournaments.players')}
              </Typography>
              {tournament ? <TournamentPlayersTable players={tournament.players} /> : <Skeleton variant="rounded" height={200} />}
            </Stack>
          </Stack>
        ) : null}

        {tab === 1 ? (
          tournament ? (
            <TournamentDuelsList stages={tournament.stages} />
          ) : (
            <Skeleton variant="rounded" height={320} />
          )
        ) : null}

        {tab === 2 ? (
          tournament ? (
            <TournamentBracket stages={tournament.stages} />
          ) : (
            <Skeleton variant="rounded" height={320} />
          )
        ) : null}

        {tab === 3 ? (
          <Stack spacing={2}>
            {tournament
              ? tournament.stages.map((stage) => (
                  <Box
                    key={stage.number}
                    sx={{
                      borderRadius: 2,
                      border: (theme) => `1px dashed ${theme.palette.divider}`,
                      p: 2,
                    }}
                  >
                    <Stack direction="row" justifyContent="space-between" alignItems="center">
                      <Typography variant="subtitle1" fontWeight={700}>
                        {stage.title || `${t('tournaments.stage')} ${stage.number}`}
                      </Typography>
                      {stage.startTime ? (
                        <Chip size="small" label={dayjs(stage.startTime).format('MMM DD, YYYY HH:mm')} />
                      ) : null}
                    </Stack>
                  </Box>
                ))
              : Array.from({ length: 3 }).map((_, idx) => <Skeleton key={idx} variant="rounded" height={80} />)}
          </Stack>
        ) : null}
      </Stack>
    </Box>
  );
};

export default TournamentPage;

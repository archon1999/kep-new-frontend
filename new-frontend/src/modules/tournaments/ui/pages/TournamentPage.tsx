import dayjs from 'dayjs';
import { Box, Chip, Grid, Skeleton, Stack, Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { useParams } from 'react-router';
import TournamentBracket from '../components/TournamentBracket';
import { useTournament } from '../../application/queries';
import { responsivePagePaddingSx } from 'shared/lib/styles';
import IconifyIcon from 'shared/components/base/IconifyIcon';

const TournamentPage = () => {
  const { t } = useTranslation();
  const { id } = useParams();
  const { data: tournament, isLoading } = useTournament(id);

  const startTime = tournament?.startTime ? dayjs(tournament.startTime) : null;

  return (
    <Box sx={responsivePagePaddingSx}>
      <Stack direction="column" spacing={3}>
        {isLoading || !tournament ? (
          <Stack direction="column" spacing={2}>
            <Skeleton variant="rounded" height={200} />
            <Skeleton variant="rounded" height={320} />
          </Stack>
        ) : (
          <>
            <Stack direction="column" spacing={2}>
              <Stack direction="row" spacing={1} alignItems="center">
                <IconifyIcon icon="mdi:tournament" color="primary.main" fontSize={32} />
                <Typography variant="h4" fontWeight={800}>
                  {tournament.title}
                </Typography>
              </Stack>

              <Stack direction="row" spacing={1} alignItems="center" flexWrap="wrap" rowGap={1}>
                <Chip color="primary" label={t('tournaments.playersCount', { count: tournament.playersCount })} />
                {startTime ? (
                  <Chip
                    icon={<IconifyIcon icon="mdi:calendar" width={18} />}
                    label={t('tournaments.starts', { date: startTime.format('DD MMM, HH:mm') })}
                  />
                ) : null}
                {tournament.type ? <Chip label={t('tournaments.type', { type: tournament.type })} /> : null}
              </Stack>

              {tournament.description ? (
                <Typography variant="body1" color="text.secondary" sx={{ maxWidth: 900 }} component="div">
                  <div dangerouslySetInnerHTML={{ __html: tournament.description }} />
                </Typography>
              ) : null}
            </Stack>

            <Grid container spacing={3}>
              <Grid size={12}>
                <Stack direction="column" spacing={2}>
                  <Stack direction="row" justifyContent="space-between" alignItems="center">
                    <Stack direction="column" spacing={0.5}>
                      <Typography variant="h5" fontWeight={800}>
                        {t('tournaments.bracketTitle')}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {t('tournaments.bracketSubtitle')}
                      </Typography>
                    </Stack>
                    <Chip label={t('tournaments.singleElimination')} color="secondary" />
                  </Stack>

                  <TournamentBracket tournament={tournament} />
                </Stack>
              </Grid>
            </Grid>
          </>
        )}
      </Stack>
    </Box>
  );
};

export default TournamentPage;

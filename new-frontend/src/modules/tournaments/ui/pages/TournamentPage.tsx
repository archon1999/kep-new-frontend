import { useMemo } from 'react';
import { useParams } from 'react-router';
import { useTranslation } from 'react-i18next';
import { Avatar, AvatarGroup, Box, Chip, Skeleton, Stack, Typography } from '@mui/material';
import dayjs from 'dayjs';
import IconifyIcon from 'shared/components/base/IconifyIcon.tsx';
import { responsivePagePaddingSx } from 'shared/lib/styles';
import TournamentBracket from '../components/TournamentBracket';
import { useTournament } from '../../application/queries';

const TournamentPage = () => {
  const { id } = useParams();
  const { t } = useTranslation();
  const { data: tournament, isLoading } = useTournament(id);

  const startLabel = useMemo(() => (tournament ? dayjs(tournament.startTime).format('DD.MM.YYYY HH:mm') : ''), [tournament]);

  return (
    <Box sx={responsivePagePaddingSx}>
      <Stack direction="column" spacing={3}>
        {isLoading || !tournament ? (
          <Stack direction="column" spacing={2}>
            <Skeleton variant="rounded" height={180} />
            <Skeleton variant="rounded" height={320} />
          </Stack>
        ) : (
          <>
            <Stack direction="column" spacing={2}>
              <Stack direction="row" spacing={2} alignItems="flex-start" justifyContent="space-between" flexWrap="wrap" rowGap={2}>
                <Stack direction="column" spacing={1}>
                  <Stack direction="row" alignItems="center" spacing={1}>
                    <IconifyIcon icon="mdi:tournament" fontSize={32} color="primary.main" />
                    <Typography variant="h4" fontWeight={800} color="text.primary">
                      {tournament.title}
                    </Typography>
                  </Stack>
                  <Typography variant="body1" color="text.secondary">
                    {tournament.description}
                  </Typography>

                  <Stack direction="row" spacing={1} alignItems="center" flexWrap="wrap" rowGap={1}>
                    <Chip
                      color="primary"
                      variant="soft"
                      size="small"
                      icon={<IconifyIcon icon="mdi:calendar-clock" fontSize={16} />}
                      label={t('tournaments.startsAt', { date: startLabel })}
                    />
                    <Chip
                      color="secondary"
                      variant="outlined"
                      size="small"
                      icon={<IconifyIcon icon="mdi:account-group" fontSize={16} />}
                      label={t('tournaments.playersCount', { count: tournament.playersCount })}
                    />
                    <Chip
                      color="default"
                      variant="outlined"
                      size="small"
                      icon={<IconifyIcon icon="mdi:chess-knight" fontSize={16} />}
                      label={tournament.type}
                    />
                  </Stack>
                </Stack>

                {tournament.players?.length ? (
                  <Stack direction="column" spacing={1} alignItems="flex-end">
                    <Typography variant="subtitle2" color="text.secondary">
                      {t('tournaments.playersPreview')}
                    </Typography>
                    <AvatarGroup max={8} total={tournament.players.length}>
                      {tournament.players.slice(0, 8).map((player) => (
                        <Avatar key={player.id} alt={player.username}>
                          {player.username.slice(0, 2).toUpperCase()}
                        </Avatar>
                      ))}
                    </AvatarGroup>
                  </Stack>
                ) : null}
              </Stack>
            </Stack>

            <TournamentBracket tournament={tournament} />
          </>
        )}
      </Stack>
    </Box>
  );
};

export default TournamentPage;

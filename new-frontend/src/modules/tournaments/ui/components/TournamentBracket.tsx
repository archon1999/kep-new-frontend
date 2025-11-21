import { Box, Card, CardContent, Chip, Stack, Typography } from '@mui/material';
import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Tournament,
  TournamentDuel,
  TournamentDuelPlayer,
  TournamentStage,
} from '../../domain/entities/tournament.entity';

const MATCH_HEIGHT = 112;
const BASE_GAP = 24;

interface TournamentBracketProps {
  tournament: Tournament;
}

const getPlayerColor = (duel: TournamentDuel, player: TournamentDuelPlayer | null | undefined) => {
  if (!player) return 'text.disabled';
  if (duel.status !== 1 || player.status == null) return 'text.primary';
  if (player.status > 0) return 'primary.main';
  if (player.status < 0) return 'text.disabled';
  return 'warning.main';
};

const getRoundLayout = (roundIndex: number) => {
  const spacingUnit = MATCH_HEIGHT + BASE_GAP;
  const gapBetweenMatches = spacingUnit * Math.pow(2, roundIndex);
  const paddingTop = roundIndex === 0 ? 0 : gapBetweenMatches / 2 - MATCH_HEIGHT / 2;
  const gap = Math.max(BASE_GAP, gapBetweenMatches - MATCH_HEIGHT);
  return { gap, paddingTop };
};

const getRoundLabel = (roundIndex: number, roundsCount: number, t: (key: string, options?: any) => string) => {
  if (roundIndex === roundsCount - 1) return t('tournaments.final');
  if (roundIndex === roundsCount - 2) return t('tournaments.semiFinal');
  if (roundIndex === roundsCount - 3) return t('tournaments.quarterFinal');
  const denominator = Math.pow(2, roundsCount - roundIndex);
  return t('tournaments.roundOf', { value: denominator });
};

const TournamentMatchCard = ({ duel, label }: { duel: TournamentDuel; label: string | number }) => {
  const { t } = useTranslation();
  const players = [duel.playerFirst, duel.playerSecond];

  return (
    <Box
      sx={{
        minHeight: MATCH_HEIGHT,
        borderRadius: 2,
        border: '1px solid',
        borderColor: 'divider',
        bgcolor: 'background.neutral',
        p: 1.5,
        display: 'flex',
        flexDirection: 'column',
        gap: 1,
        boxShadow: (theme) => theme.shadows[1],
      }}
    >
      <Stack direction="row" spacing={1} alignItems="center" justifyContent="space-between">
        <Stack direction="column" spacing={0.5}>
          <Typography variant="subtitle2" fontWeight={800}>
            {t('tournaments.matchLabel', { number: label ?? duel.id ?? '' })}
          </Typography>
          {duel.presetTitle ? <Chip size="small" label={duel.presetTitle} variant="outlined" /> : null}
        </Stack>
        <Chip
          size="small"
          color={duel.status === 1 ? 'success' : 'default'}
          label={duel.status === 1 ? t('tournaments.finished') : t('tournaments.upcoming')}
          variant={duel.status === 1 ? 'filled' : 'outlined'}
        />
      </Stack>

      <Stack direction="column" spacing={0.75}>
        {players.map((player, index) => (
          <Stack
            key={player?.id ?? index}
            direction="row"
            spacing={1}
            alignItems="center"
            justifyContent="space-between"
            sx={{
              borderRadius: 1,
              bgcolor: 'background.paper',
              px: 1,
              py: 0.75,
            }}
          >
            <Stack direction="row" spacing={1} alignItems="center" minWidth={0}>
              <Box
                sx={{
                  width: 32,
                  height: 32,
                  borderRadius: '50%',
                  bgcolor: 'background.neutral',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontWeight: 800,
                  color: getPlayerColor(duel, player),
                  border: '1px solid',
                  borderColor: 'divider',
                }}
              >
                {player ? player.username.charAt(0).toUpperCase() : '?'}
              </Box>
              <Stack direction="column" spacing={0.25} minWidth={0}>
                <Typography fontWeight={700} color={getPlayerColor(duel, player)} noWrap>
                  {player ? player.username : t('tournaments.waitingPlayer')}
                </Typography>
                <Typography variant="caption" color="text.secondary" noWrap>
                  {player?.ratingTitle ?? '—'}
                </Typography>
              </Stack>
            </Stack>

            <Typography variant="h6" fontWeight={800} color={getPlayerColor(duel, player)}>
              {player?.balls ?? '—'}
            </Typography>
          </Stack>
        ))}
      </Stack>
    </Box>
  );
};

const TournamentBracket = ({ tournament }: TournamentBracketProps) => {
  const { t } = useTranslation();

  const rounds = useMemo(() => {
    const sortedStages = (tournament.stages ?? []).sort((a, b) => a.number - b.number);
    const playerCount = Math.max(2, tournament.players?.length ?? 16);
    const requiredRounds = Math.max(1, Math.ceil(Math.log2(playerCount)));

    const normalized: TournamentStage[] = Array.from({ length: requiredRounds }).map((_, index) => ({
      number: index + 1,
      title: sortedStages[index]?.title,
      startTime: sortedStages[index]?.startTime,
      duels: sortedStages[index]?.duels ?? [],
    }));

    return normalized;
  }, [tournament.players?.length, tournament.stages]);

  return (
    <Card background={1} sx={{ borderRadius: 3, outline: 'none' }}>
      <CardContent>
        <Stack direction="column" spacing={2}>
          <Typography variant="h6" fontWeight={800}>
            {t('tournaments.bracketTitle')}
          </Typography>

          {rounds.every((round) => round.duels.length === 0) ? (
            <Typography variant="body2" color="text.secondary">
              {t('tournaments.noBracket')}
            </Typography>
          ) : (
            <Box sx={{ overflowX: 'auto', pb: 1 }}>
              <Stack direction="row" spacing={3} alignItems="stretch" minWidth="100%">
                {rounds.map((round, roundIndex) => {
                  const { gap, paddingTop } = getRoundLayout(roundIndex);
                  return (
                    <Stack
                      key={roundIndex}
                      direction="column"
                      spacing={gap}
                      sx={{ pt: paddingTop, minWidth: 260, flex: 1 }}
                    >
                      <Typography variant="subtitle2" fontWeight={800} textAlign="center">
                        {getRoundLabel(roundIndex, rounds.length, t)}
                      </Typography>

                      {round.duels.map((stageDuel, duelIndex) => (
                        <TournamentMatchCard
                          key={`${roundIndex}-${duelIndex}`}
                          duel={stageDuel.duel}
                          label={stageDuel.number}
                        />
                      ))}
                    </Stack>
                  );
                })}
              </Stack>
            </Box>
          )}
        </Stack>
      </CardContent>
    </Card>
  );
};

export default TournamentBracket;

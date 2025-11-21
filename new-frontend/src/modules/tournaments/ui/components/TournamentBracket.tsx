import { useMemo } from 'react';
import { Box, Card, CardContent, Divider, Stack, Typography, useTheme } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { TournamentDetailEntity, TournamentStageMatch } from '../../domain/entities/tournament.entity';

interface TournamentBracketProps {
  tournament: TournamentDetailEntity;
}

const MATCH_HEIGHT = 96;
const BASE_GAP = 16;

const getRoundMetrics = (roundIndex: number) => {
  const blockHeight = MATCH_HEIGHT * Math.pow(2, roundIndex) + BASE_GAP * (Math.pow(2, roundIndex) - 1);
  const offset = (blockHeight - MATCH_HEIGHT) / 2;
  const rowGap = blockHeight + BASE_GAP;

  return { blockHeight, offset, rowGap };
};

const getRoundTitle = (roundIndex: number, maxPlayers: number, t: (key: string, opts?: any) => string) => {
  const rounds = Math.log2(maxPlayers);
  const factor = Math.pow(2, Math.max(rounds - roundIndex, 1));

  if (factor === 2) return t('tournaments.round.final');
  if (factor === 4) return t('tournaments.round.semifinal');
  if (factor === 8) return t('tournaments.round.quarter');

  return t('tournaments.round.generic', { value: factor });
};

const PlayerRow = ({
  username,
  ratingTitle,
  balls,
  highlight,
}: {
  username: string;
  ratingTitle: string;
  balls?: number;
  highlight?: boolean;
}) => (
  <Stack
    direction="row"
    alignItems="center"
    justifyContent="space-between"
    spacing={1}
    sx={{
      px: 1.5,
      py: 1,
      borderRadius: 1.5,
      bgcolor: highlight ? 'primary.main' : 'background.neutral',
      color: highlight ? 'primary.contrastText' : 'text.primary',
      transition: 'background-color 0.2s ease, color 0.2s ease',
    }}
  >
    <Stack direction="column" spacing={0.25}>
      <Typography variant="subtitle2" fontWeight={700} noWrap>
        {username}
      </Typography>
      <Typography variant="caption" color={highlight ? 'inherit' : 'text.secondary'}>
        {ratingTitle}
      </Typography>
    </Stack>
    {typeof balls === 'number' ? (
      <Typography variant="subtitle1" fontWeight={800} color={highlight ? 'inherit' : 'text.secondary'}>
        {balls}
      </Typography>
    ) : null}
  </Stack>
);

const BracketMatch = ({
  duel,
  hasNextRound,
  connectorHeight,
}: {
  duel: TournamentStageMatch;
  hasNextRound: boolean;
  connectorHeight: number;
}) => {
  const theme = useTheme();

  const playerOne = duel.duel.playerFirst;
  const playerTwo = duel.duel.playerSecond;

  const isFinished = duel.duel.status === 1;
  const playerOneWin = isFinished && playerOne.status === 1;
  const playerTwoWin = isFinished && playerTwo?.status === 1;

  return (
    <Box
      sx={{
        position: 'relative',
        width: 1,
        minWidth: 240,
        borderRadius: 2,
        boxShadow: theme.shadows[4],
        bgcolor: 'background.paper',
        p: 1.5,
        display: 'flex',
        flexDirection: 'column',
        gap: 1,
        '::after': hasNextRound
          ? {
              content: '""',
              position: 'absolute',
              right: -32,
              top: '50%',
              width: 32,
              height: 2,
              bgcolor: 'divider',
            }
          : undefined,
        '::before': hasNextRound
          ? {
              content: '""',
              position: 'absolute',
              right: -32,
              top: `calc(50% - ${connectorHeight / 2}px)`,
              height: connectorHeight,
              width: 2,
              bgcolor: 'divider',
            }
          : undefined,
      }}
    >
      <Typography variant="caption" color="text.secondary" fontWeight={700}>
        #{duel.number + 1}
      </Typography>
      <Stack direction="column" spacing={1}>
        <PlayerRow
          username={playerOne.username}
          ratingTitle={playerOne.ratingTitle}
          balls={playerOne.balls}
          highlight={playerOneWin}
        />
        {playerTwo ? (
          <PlayerRow
            username={playerTwo.username}
            ratingTitle={playerTwo.ratingTitle}
            balls={playerTwo.balls}
            highlight={playerTwoWin}
          />
        ) : (
          <PlayerRow username="—" ratingTitle="" highlight={false} />
        )}
      </Stack>
    </Box>
  );
};

const TournamentBracket = ({ tournament }: TournamentBracketProps) => {
  const { t } = useTranslation();

  const rounds = useMemo(() => {
    const sortedStages = [...(tournament.stages ?? [])].sort((a, b) => a.number - b.number);
    if (sortedStages.length === 0 && tournament.players.length) {
      const duels: TournamentStageMatch[] = [];
      for (let i = 0; i < tournament.players.length; i += 2) {
        duels.push({
          number: i / 2,
          duel: {
            id: i,
            startTime: null,
            finishTime: null,
            status: 0,
            isConfirmed: false,
            isPlayer: undefined,
            playerFirst: tournament.players[i],
            playerSecond: tournament.players[i + 1],
            preset: undefined,
          },
        });
      }
      return [{ title: t('tournaments.round.generic', { value: tournament.players.length }), number: 0, duels }];
    }
    return sortedStages;
  }, [tournament.players, tournament.stages, t]);

  const derivedPlayers = tournament.players.length || (tournament.stages?.[0]?.duels?.length ?? 0) * 2;
  const maxPlayers = Math.max(derivedPlayers || 16, 16);
  const requiredRounds = Math.log2(maxPlayers);
  const normalizedRounds = Array.from({ length: requiredRounds }, (_, idx) => rounds[idx] ?? { duels: [], number: idx });

  return (
    <Card background={1} sx={{ borderRadius: 3 }}>
      <CardContent>
        <Stack direction="column" spacing={3}>
          <Stack direction="row" justifyContent="space-between" alignItems="center">
            <Stack direction="column" spacing={0.5}>
              <Typography variant="h6" fontWeight={800}>
                {t('tournaments.bracketTitle')}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {t('tournaments.bracketSubtitle')}
              </Typography>
            </Stack>
          </Stack>

          <Divider />

          <Box sx={{ overflowX: 'auto', pb: 2 }}>
            <Stack direction="row" spacing={4} alignItems="flex-start" sx={{ minWidth: 880 }}>
              {normalizedRounds.map((round, roundIndex) => {
                const { offset, rowGap, blockHeight } = getRoundMetrics(roundIndex);
                const hasNextRound = roundIndex < normalizedRounds.length - 1;

                return (
                  <Stack key={roundIndex} direction="column" spacing={1.5} sx={{ minWidth: 240 }}>
                    <Typography variant="subtitle2" fontWeight={800} color="text.secondary">
                      {getRoundTitle(roundIndex, maxPlayers, t)}
                    </Typography>
                    <Box sx={{ mt: offset, display: 'flex', flexDirection: 'column', rowGap: `${rowGap}px` }}>
                      {round.duels?.map((duel) => (
                        <BracketMatch
                          key={`${roundIndex}-${duel.number}`}
                          duel={duel}
                          hasNextRound={hasNextRound}
                          connectorHeight={blockHeight / 2}
                        />
                      )) || null}
                    </Box>
                  </Stack>
                );
              })}
            </Stack>
          </Box>
        </Stack>
      </CardContent>
    </Card>
  );
};

export default TournamentBracket;

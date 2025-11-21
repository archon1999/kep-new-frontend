import { Box, Chip, Stack, Typography } from '@mui/material';
import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { Tournament, TournamentStage } from '../../domain/entities/tournament.entity';
import { buildInitialStagesFromPlayers, getRoundLabel } from '../../data-access/mappers/tournament.mapper';
import TournamentPlayerRow from './TournamentPlayerRow';

interface TournamentBracketProps {
  tournament: Tournament;
}

const TournamentBracket = ({ tournament }: TournamentBracketProps) => {
  const { t } = useTranslation();
  const stages = useMemo<TournamentStage[]>(() => {
    if (tournament.stages && tournament.stages.length > 0) {
      return tournament.stages;
    }
    if (tournament.players && tournament.players.length > 0) {
      return buildInitialStagesFromPlayers(tournament.players);
    }
    return buildInitialStagesFromPlayers(new Array(16).fill(null).map((_, idx) => ({
      id: idx + 1,
      username: '',
      ratingTitle: '',
    })));
  }, [tournament.players, tournament.stages]);

  const playersCount = tournament.players?.length ?? 16;
  const totalRounds = Math.max(4, Math.ceil(Math.log2(playersCount || 16)));

  const filledRounds = stages.map((stage, idx) => ({
    label: getRoundLabel(idx, totalRounds),
    duels: stage.duels,
  }));

  const ensurePlayers = () => ({ id: Math.random(), username: '', ratingTitle: '' });
  let matchCount = filledRounds[0]?.duels?.length || Math.pow(2, totalRounds - 1);

  while (filledRounds.length < totalRounds) {
    matchCount = Math.max(1, Math.ceil(matchCount / 2));
    filledRounds.push({
      label: getRoundLabel(filledRounds.length, totalRounds),
      duels: Array.from({ length: matchCount }).map(() => ({
        playerFirst: ensurePlayers(),
        playerSecond: ensurePlayers(),
      })),
    });
  }

  const roundGap = (roundIndex: number) => 12 * 2 ** roundIndex;
  const roundPadding = (roundIndex: number) => (roundIndex === 0 ? 0 : roundGap(roundIndex) / 2);

  return (
    <Box
      sx={{
        overflowX: 'auto',
        px: { xs: 1, md: 2 },
        py: 2,
        bgcolor: 'background.paper',
        borderRadius: 3,
        border: '1px solid',
        borderColor: 'divider',
      }}
    >
      <Stack direction="row" spacing={3} alignItems="flex-start" sx={{ minWidth: 900 }}>
        {filledRounds.map((round, roundIndex) => (
          <Stack
            key={roundIndex}
            direction="column"
            spacing={roundGap(roundIndex)}
            sx={{ minWidth: 220, pt: roundPadding(roundIndex) }}
          >
            <Stack direction="row" alignItems="center" spacing={1} sx={{ pl: 1 }}>
              <Typography variant="subtitle1" fontWeight={800}>
                {'value' in round.label
                  ? t(round.label.key, { count: round.label.value })
                  : t(round.label.key)}
              </Typography>
              <Chip label={t('tournaments.roundNumber', { round: roundIndex + 1 })} size="small" />
            </Stack>

            {round.duels.map((duel, duelIndex) => (
              <Box key={`${roundIndex}-${duelIndex}`} sx={{ position: 'relative', minHeight: 120 }}>
                <Stack direction="column" spacing={1.25} sx={{ minHeight: 120 }}>
                  <TournamentPlayerRow player={duel.playerFirst} status={duel.playerFirst?.status} duelStatus={duel.status} />
                  <TournamentPlayerRow player={duel.playerSecond} status={duel.playerSecond?.status} duelStatus={duel.status} />
                  {duel.presetTitle ? (
                    <Typography variant="caption" color="text.secondary" sx={{ px: 1 }}>
                      {duel.presetTitle}
                    </Typography>
                  ) : null}
                </Stack>

                {roundIndex < filledRounds.length - 1 ? (
                  <Box
                    sx={{
                      position: 'absolute',
                      top: '50%',
                      right: -24,
                      width: 24,
                      borderTop: '1px solid',
                      borderColor: 'divider',
                      transform: 'translateY(-50%)',
                    }}
                  />
                ) : null}
              </Box>
            ))}
          </Stack>
        ))}
      </Stack>
    </Box>
  );
};

export default TournamentBracket;

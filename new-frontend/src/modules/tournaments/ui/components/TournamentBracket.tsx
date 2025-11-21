import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { Avatar, Box, Chip, Paper, Stack, Typography } from '@mui/material';
import { TournamentDuel, TournamentDuelPlayer, TournamentStage } from '../../domain/entities/tournament.entity';

interface Props {
  stages: TournamentStage[];
}

interface BracketMatch {
  duel: TournamentDuel;
  centerY: number;
}

const MATCH_HEIGHT = 96;
const COLUMN_GAP = 48;
const CARD_WIDTH = 240;
const COLUMN_WIDTH = CARD_WIDTH + COLUMN_GAP;
const FIRST_ROUND_GAP = 32;

const getMatchResult = (duel: TournamentDuel, player: TournamentDuelPlayer | undefined) => {
  if (!player || duel.status !== 1 || typeof player.status !== 'number') {
    return null;
  }

  if (player.status > 0) {
    return { label: 'win', color: 'success' as const };
  }

  if (player.status < 0) {
    return { label: 'loss', color: 'error' as const };
  }

  return { label: 'draw', color: 'default' as const };
};

const TournamentBracket = ({ stages, players }: Props) => {
  const { t } = useTranslation();

  const rounds = useMemo(() =>
    stages
      .slice()
      .sort((a, b) => a.number - b.number)
      .map((stage) => ({
        title: stage.title || `${t('tournaments.stage')} ${stage.number}`,
        duels: stage.duels.slice().sort((a, b) => a.number - b.number),
      })),
  [stages, t]);

  const roundsWithPositions = useMemo(() => {
    if (!rounds.length) return [] as { title: string; matches: BracketMatch[] }[];

    const result: { title: string; matches: BracketMatch[] }[] = [];

    const firstRoundCenters = rounds[0].duels.map((_, idx) => MATCH_HEIGHT / 2 + idx * (MATCH_HEIGHT + FIRST_ROUND_GAP));
    result.push({
      title: rounds[0].title,
      matches: rounds[0].duels.map((duel, idx) => ({ duel, centerY: firstRoundCenters[idx] })),
    });

    for (let roundIdx = 1; roundIdx < rounds.length; roundIdx++) {
      const prevCenters = result[roundIdx - 1].matches.map((match) => match.centerY);
      const centers: number[] = [];

      for (let i = 0; i < rounds[roundIdx].duels.length; i++) {
        centers.push((prevCenters[i * 2] + prevCenters[i * 2 + 1]) / 2);
      }

      result.push({
        title: rounds[roundIdx].title,
        matches: rounds[roundIdx].duels.map((duel, idx) => ({ duel, centerY: centers[idx] })),
      });
    }

    return result;
  }, [rounds]);

  const totalHeight = useMemo(() => {
    if (!roundsWithPositions.length) return MATCH_HEIGHT * 2;
    const lastCenter = roundsWithPositions[0].matches.at(-1)?.centerY ?? MATCH_HEIGHT;
    return lastCenter + MATCH_HEIGHT / 2;
  }, [roundsWithPositions]);

  if (!roundsWithPositions.length) {
    return (
      <Paper variant="outlined" sx={{ p: 3, borderRadius: 2 }}>
        <Typography variant="body2" color="text.secondary">
          {t('tournaments.noDuels')}
        </Typography>
      </Paper>
    );
  }

  const renderConnector = (roundIdx: number, matchIdx: number, startY: number) => {
    const nextRound = roundsWithPositions[roundIdx + 1];
    if (!nextRound) return null;

    const nextMatch = nextRound.matches[Math.floor(matchIdx / 2)];
    const startX = roundIdx * COLUMN_WIDTH + CARD_WIDTH;
    const midX = startX + COLUMN_GAP / 2;
    const endX = (roundIdx + 1) * COLUMN_WIDTH;
    const endY = nextMatch.centerY;

    const verticalTop = Math.min(startY, endY);
    const verticalHeight = Math.abs(endY - startY);

    return (
      <>
        <Box
          sx={{
            position: 'absolute',
            left: startX,
            top: startY - 1,
            width: midX - startX,
            borderTop: (theme) => `1px solid ${theme.palette.divider}`,
          }}
        />
        <Box
          sx={{
            position: 'absolute',
            left: midX,
            top: verticalTop,
            height: verticalHeight,
            borderLeft: (theme) => `1px solid ${theme.palette.divider}`,
          }}
        />
        <Box
          sx={{
            position: 'absolute',
            left: midX,
            top: endY - 1,
            width: endX - midX,
            borderTop: (theme) => `1px solid ${theme.palette.divider}`,
          }}
        />
      </>
    );
  };

  return (
    <Box sx={{ position: 'relative', minHeight: totalHeight, overflowX: 'auto' }}>
      <Box sx={{ position: 'relative', minWidth: COLUMN_WIDTH * roundsWithPositions.length }}>
        {roundsWithPositions.map((round, roundIdx) => (
          <Box key={round.title} sx={{ position: 'absolute', top: 0, left: roundIdx * COLUMN_WIDTH }}>
            <Typography variant="subtitle2" fontWeight={700} sx={{ mb: 1 }}>
              {round.title}
            </Typography>
            {round.matches.map((match, matchIdx) => {
              const playerA = match.duel.playerFirst;
              const playerB = match.duel.playerSecond;
              const resA = getMatchResult(match.duel, playerA);
              const resB = getMatchResult(match.duel, playerB);

              return (
                <Box key={`${roundIdx}-${match.duel.number}-${matchIdx}`} sx={{ position: 'absolute', top: match.centerY - MATCH_HEIGHT / 2 }}>
                  <Paper
                    variant="outlined"
                    sx={{
                      width: CARD_WIDTH,
                      p: 1.5,
                      borderRadius: 2,
                      bgcolor: (theme) => (match.duel.status === 1 ? theme.palette.background.paper : theme.palette.action.hover),
                    }}
                  >
                    {[playerA, playerB].map((player, idx) => {
                      const result = idx === 0 ? resA : resB;
                      const isWinner = result?.label === 'win';
                      return (
                        <Stack
                          key={player?.id ?? idx}
                          direction="row"
                          alignItems="center"
                          spacing={1}
                          justifyContent="space-between"
                          sx={{
                            p: 1,
                            borderRadius: 1,
                            bgcolor: isWinner ? 'success.light' : undefined,
                          }}
                        >
                          <Stack direction="row" spacing={1} alignItems="center" sx={{ minWidth: 0 }}>
                            <Avatar sx={{ width: 28, height: 28, fontSize: 12 }}>
                              {player?.username?.[0]?.toUpperCase() ?? '?'}
                            </Avatar>
                            <Box sx={{ minWidth: 0 }}>
                              <Typography variant="body2" fontWeight={700} noWrap>
                                {player?.username || t('tournaments.tbd')}
                              </Typography>
                              <Typography variant="caption" color="text.secondary" noWrap>
                                {player?.ratingTitle || t('tournaments.tbd')}
                              </Typography>
                            </Box>
                          </Stack>
                          <Stack direction="row" spacing={1} alignItems="center">
                            {typeof player?.balls === 'number' ? <Chip size="small" label={player.balls} variant="outlined" /> : null}
                            {result ? <Chip size="small" label={t(`tournaments.${result.label}`)} color={result.color} /> : null}
                          </Stack>
                        </Stack>
                      );
                    })}
                  </Paper>
                  {renderConnector(roundIdx, matchIdx, match.centerY)}
                </Box>
              );
            })}
          </Box>
        ))}
      </Box>
    </Box>
  );
};

export default TournamentBracket;

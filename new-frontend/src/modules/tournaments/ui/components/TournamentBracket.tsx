import { Theme, alpha } from '@mui/material/styles';
import { Box, Paper, Stack, Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { TournamentDuel, TournamentStage } from '../../domain/entities/tournament.entity';

interface Props {
  stages: TournamentStage[];
}

const MATCH_HEIGHT = 96;
const MATCH_GAP = 20;
const CONNECTOR_WIDTH = 32;

const scoreLabel = (value?: number | null) => (value === null || value === undefined ? '–' : value);

const BracketMatch = ({ duel }: { duel: TournamentDuel }) => {
  const firstScore = duel.playerFirst.balls ?? null;
  const secondScore = duel.playerSecond.balls ?? null;
  const hasScore = firstScore !== null && secondScore !== null;
  const firstWin = hasScore && firstScore > secondScore;
  const secondWin = hasScore && secondScore > firstScore;

  const rowSx = (highlight: boolean) => ({
    px: 1,
    py: 0.75,
    borderRadius: 1,
    backgroundColor: highlight
      ? (theme: Theme) => alpha(theme.palette.success.main, 0.08)
      : 'transparent',
  });

  return (
    <Paper
      variant="outlined"
      sx={{
        p: 1,
        borderRadius: 1.5,
        minWidth: 220,
        height: MATCH_HEIGHT,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        gap: 1,
      }}
    >
      <Stack direction="row" alignItems="center" justifyContent="space-between" sx={rowSx(firstWin)}>
        <Typography variant="body2" fontWeight={700} noWrap>
          {duel.playerFirst.username}
        </Typography>
        <Typography variant="subtitle2" fontWeight={800}>
          {scoreLabel(firstScore)}
        </Typography>
      </Stack>
      <Stack direction="row" alignItems="center" justifyContent="space-between" sx={rowSx(secondWin)}>
        <Typography variant="body2" fontWeight={700} noWrap>
          {duel.playerSecond.username}
        </Typography>
        <Typography variant="subtitle2" fontWeight={800}>
          {scoreLabel(secondScore)}
        </Typography>
      </Stack>
    </Paper>
  );
};

const PairConnector = ({ gap }: { gap: number }) => (
  <Box
    sx={(theme) => ({
      position: 'absolute',
      right: -CONNECTOR_WIDTH,
      top: MATCH_HEIGHT / 2,
      height: gap,
      borderLeft: `1px solid ${theme.palette.divider}`,
      '&::before': {
        content: '""',
        position: 'absolute',
        top: 0,
        left: 0,
        width: CONNECTOR_WIDTH,
        borderTop: `1px solid ${theme.palette.divider}`,
      },
      '&::after': {
        content: '""',
        position: 'absolute',
        top: '50%',
        left: 0,
        width: CONNECTOR_WIDTH,
        borderTop: `1px solid ${theme.palette.divider}`,
      },
      '& > span': {
        position: 'absolute',
        bottom: 0,
        left: 0,
        width: CONNECTOR_WIDTH,
        borderTop: `1px solid ${theme.palette.divider}`,
      },
    })}
  >
    <span />
  </Box>
);

const getColumnOffset = (roundIndex: number) => {
  if (roundIndex === 0) return 0;
  const spacing = MATCH_HEIGHT + MATCH_GAP;
  return ((spacing * (2 ** roundIndex - 1)) / 2);
};

const getColumnGap = (roundIndex: number) => (MATCH_HEIGHT + MATCH_GAP) * 2 ** roundIndex;

const BracketColumn = ({ matches, roundIndex, isLast }: { matches: TournamentDuel[]; roundIndex: number; isLast: boolean }) => {
  const gap = getColumnGap(roundIndex);

  return (
    <Stack spacing={gap} sx={{ position: 'relative', mt: getColumnOffset(roundIndex) }}>
      {matches.map((duel, idx) => (
        <Box key={`${roundIndex}-${idx}`} sx={{ position: 'relative' }}>
          <BracketMatch duel={duel} />
          {!isLast && idx % 2 === 0 ? <PairConnector gap={gap} /> : null}
        </Box>
      ))}
    </Stack>
  );
};

const TournamentBracket = ({ stages }: Props) => {
  const { t } = useTranslation();
  const rounds = [...stages].sort((a, b) => a.number - b.number);

  if (!rounds.length) {
    return (
      <Paper variant="outlined" sx={{ p: 2, borderRadius: 2 }}>
        <Typography variant="body2" color="text.secondary">
          {t('tournaments.bracketEmpty')}
        </Typography>
      </Paper>
    );
  }

  return (
    <Box sx={{ overflowX: 'auto', pb: 1 }}>
      <Stack direction="row" spacing={6} alignItems="flex-start">
        {rounds.map((round, roundIndex) => (
          <Stack key={round.number} spacing={2} alignItems="flex-start">
            <Typography variant="subtitle2" fontWeight={700} color="text.secondary">
              {round.title || `${t('tournaments.stage')} ${round.number}`}
            </Typography>
            <BracketColumn matches={round.duels} roundIndex={roundIndex} isLast={roundIndex === rounds.length - 1} />
          </Stack>
        ))}
      </Stack>
    </Box>
  );
};

export default TournamentBracket;

import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { Box, Card, CardContent, Chip, Stack, Typography, useTheme } from '@mui/material';
import dayjs from 'dayjs';
import IconifyIcon from 'shared/components/base/IconifyIcon.tsx';
import {
  TournamentDetail,
  TournamentDuel,
  TournamentPlayer,
  TournamentPlayerStatus,
  TournamentStage,
} from '../../domain/entities/tournament.entity';

const MATCH_HEIGHT = 112;

interface KnockoutMatch {
  id: string;
  duel: TournamentDuel;
}

interface KnockoutRound {
  id: string;
  title: string;
  matches: KnockoutMatch[];
}

const statusToColor = (status?: TournamentPlayerStatus) => {
  if (status === 1) return 'success.main';
  if (status === -1) return 'error.main';
  if (status === 0) return 'warning.main';
  return 'text.secondary';
};

const statusToLabel = (t: (key: string) => string, status?: TournamentPlayerStatus) => {
  if (status === 1) return t('tournaments.match.win');
  if (status === -1) return t('tournaments.match.loss');
  if (status === 0) return t('tournaments.match.draw');
  return t('tournaments.match.pending');
};

const getDefaultRoundTitle = (t: (key: string) => string, roundIndex: number) => {
  if (roundIndex === 0) return t('tournaments.roundOf16');
  if (roundIndex === 1) return t('tournaments.quarterfinals');
  if (roundIndex === 2) return t('tournaments.semifinals');
  return t('tournaments.final');
};

const buildRounds = (tournament?: TournamentDetail, t?: (key: string) => string): KnockoutRound[] => {
  if (!tournament || !tournament.stages?.length) return [];

  const sortedStages = [...tournament.stages].sort((a: TournamentStage, b: TournamentStage) => a.number - b.number);

  return sortedStages.slice(0, 4).map((stage, index) => ({
    id: `round-${stage.number ?? index}`,
    title: stage.title || (t ? getDefaultRoundTitle(t, index) : ''),
    matches: stage.duels.map((duel) => ({ id: `round-${index}-${duel.number}`, duel: duel.duel })),
  }));
};

interface BracketMatchCardProps {
  matchIndex: number;
  spacingUnits: number;
  isLastRound: boolean;
  duel: TournamentDuel;
}

const BracketMatchCard = ({ duel, matchIndex, spacingUnits, isLastRound }: BracketMatchCardProps) => {
  const { t } = useTranslation();
  const theme = useTheme();
  const gapPx = Number.parseFloat(theme.spacing(spacingUnits));
  const verticalOffset = (MATCH_HEIGHT + gapPx) / 2;
  const isEven = matchIndex % 2 === 0;

  const renderPlayer = (player?: TournamentPlayer | null) => {
    if (!player) {
      return (
        <Stack direction="row" alignItems="center" spacing={1} justifyContent="space-between">
          <Typography variant="body2" color="text.secondary">
            {t('tournaments.match.awaiting')}
          </Typography>
          <Chip size="small" variant="soft" label={t('tournaments.match.pending')} />
        </Stack>
      );
    }

    const statusLabel = statusToLabel(t, player.status);
    const color = statusToColor(player.status);

    return (
      <Stack direction="row" alignItems="center" spacing={1} justifyContent="space-between">
        <Stack direction="row" spacing={1} alignItems="center" overflow="hidden">
          <IconifyIcon icon="mdi:shield-half-full" color={color} fontSize={18} />
          <Typography variant="subtitle2" fontWeight={700} color="text.primary" noWrap>
            {player.username}
          </Typography>
          <Chip size="small" color="default" variant="soft" label={player.ratingTitle} />
        </Stack>
        <Chip size="small" color="default" variant="outlined" label={statusLabel} sx={{ color }} />
      </Stack>
    );
  };

  return (
    <Box sx={{ position: 'relative', minHeight: MATCH_HEIGHT }}>
      <Card background={2} sx={{ borderRadius: 2, p: 2, height: '100%' }}>
        <Stack direction="column" spacing={1.5} justifyContent="center" height="100%">
          <Stack direction="row" spacing={1} alignItems="center">
            <IconifyIcon icon="mdi:sword-cross" fontSize={18} color="warning.main" />
            <Typography variant="caption" color="text.secondary">
              {duel.startTime ? dayjs(duel.startTime).format('DD MMM, HH:mm') : t('tournaments.match.tbd')}
            </Typography>
          </Stack>
          {renderPlayer(duel.playerFirst)}
          {renderPlayer(duel.playerSecond)}
        </Stack>
      </Card>

      {!isLastRound ? (
        <Box
          sx={{
            position: 'absolute',
            top: '50%',
            right: -32,
            width: 32,
            height: 2,
            bgcolor: 'divider',
            '&::after': {
              content: '""',
              position: 'absolute',
              right: 0,
              top: isEven ? 0 : -verticalOffset,
              width: 2,
              height: verticalOffset,
              bgcolor: 'divider',
            },
          }}
        />
      ) : null}
    </Box>
  );
};

interface TournamentBracketProps {
  tournament: TournamentDetail;
}

const TournamentBracket = ({ tournament }: TournamentBracketProps) => {
  const { t } = useTranslation();
  const rounds = useMemo(() => buildRounds(tournament, t), [t, tournament]);

  return (
    <Card background={1} sx={{ borderRadius: 3 }}>
      <CardContent sx={{ p: 3 }}>
        <Stack direction="column" spacing={2}>
          <Stack direction="row" alignItems="center" justifyContent="space-between" spacing={2}>
            <Stack direction="column" spacing={0.5}>
              <Typography variant="h6" fontWeight={800}>
                {t('tournaments.bracketTitle')}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {t('tournaments.bracketSubtitle')}
              </Typography>
            </Stack>
            <Chip color="warning" variant="soft" label={t('tournaments.knockout')} />
          </Stack>

          {rounds.length === 0 ? (
            <Typography variant="body2" color="text.secondary">
              {t('tournaments.noBracket')}
            </Typography>
          ) : (
            <Box sx={{ overflowX: 'auto', pb: 1 }}>
              <Stack direction="row" spacing={4} alignItems="stretch" minWidth={900}>
                {rounds.map((round, roundIndex) => {
                  const spacingUnits = Math.max(2, 2 ** roundIndex);
                  return (
                    <Stack key={round.id} direction="column" spacing={spacingUnits} pt={spacingUnits / 2} flex={1}>
                      <Stack direction="row" spacing={1} alignItems="center">
                        <Typography variant="subtitle2" fontWeight={800}>
                          {round.title || getDefaultRoundTitle(t, roundIndex)}
                        </Typography>
                        <Chip size="small" color="primary" variant="soft" label={t('tournaments.roundLabel', { number: roundIndex + 1 })} />
                      </Stack>
                      {round.matches.map((match, matchIndex) => (
                        <BracketMatchCard
                          key={match.id}
                          duel={match.duel}
                          matchIndex={matchIndex}
                          spacingUnits={spacingUnits}
                          isLastRound={roundIndex === rounds.length - 1}
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

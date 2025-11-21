import { Avatar, Chip, Stack, Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';
import type { ChallengePlayer } from '../../domain/entities/challenge.entity';

interface ChallengePlayerInfoProps {
  player: ChallengePlayer;
  opponentResult?: number;
}

const getResultColor = (result?: number, opponent?: number) => {
  if (result === undefined || opponent === undefined) return 'default';
  if (result > opponent) return 'success';
  if (result < opponent) return 'error';
  return 'warning';
};

const formatDelta = (delta?: number) => {
  if (delta === undefined) return undefined;
  if (delta > 0) return `+${delta}`;
  return delta.toString();
};

const getInitials = (username: string) => {
  if (!username) return '?';
  return username.charAt(0).toUpperCase();
};

const ChallengePlayerInfo = ({ player, opponentResult }: ChallengePlayerInfoProps) => {
  const { t } = useTranslation();
  const resultColor = getResultColor(player.result, opponentResult);
  const formattedDelta = formatDelta(player.delta);

  return (
    <Stack direction="row" justifyContent="space-between" alignItems="center" spacing={2} flexWrap="wrap">
      <Stack direction="row" spacing={2} alignItems="center" sx={{ minWidth: 0 }}>
        <Avatar sx={{ bgcolor: 'primary.main', color: 'primary.contrastText' }}>{getInitials(player.username)}</Avatar>
        <Stack spacing={0.5} minWidth={0}>
          <Typography variant="subtitle1" fontWeight={700} noWrap>
            {player.username}
          </Typography>
          <Typography variant="body2" color="text.secondary" noWrap>
            {t('challenges.rankLabel', { rank: player.rankTitle })}
          </Typography>
          <Typography variant="body2" color="text.secondary" noWrap>
            {t('challenges.ratingLabel', { rating: player.rating ?? '—' })}
          </Typography>
        </Stack>
      </Stack>

      <Stack direction="row" spacing={1} alignItems="center">
        <Chip
          size="small"
          color={resultColor}
          label={
            player.result !== undefined
              ? t('challenges.scoreLabel', { value: player.result })
              : t('challenges.noResult')
          }
        />
        {formattedDelta && (
          <Chip
            size="small"
            variant="outlined"
            color={player.delta && player.delta < 0 ? 'error' : 'success'}
            label={t('challenges.deltaLabel', { value: formattedDelta })}
          />
        )}
      </Stack>
    </Stack>
  );
};

export default ChallengePlayerInfo;

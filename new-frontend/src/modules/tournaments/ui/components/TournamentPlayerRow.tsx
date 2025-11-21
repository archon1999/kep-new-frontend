import { Avatar, Stack, Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { TournamentPlayer } from '../../domain/entities/tournament.entity';

interface TournamentPlayerRowProps {
  player?: TournamentPlayer;
  status?: number | null;
  duelStatus?: number | undefined;
}

const TournamentPlayerRow = ({ player, status, duelStatus }: TournamentPlayerRowProps) => {
  const { t } = useTranslation();

  const isWinner = duelStatus === 1 && status === 1;
  const isLoser = duelStatus === 1 && status === -1;
  const isDraw = duelStatus === 1 && status === 0;

  const label = (() => {
    if (!player?.username) return t('tournaments.waitingOpponent');
    if (isWinner) return t('tournaments.winner');
    if (isDraw) return t('tournaments.draw');
    if (duelStatus === 1) return t('tournaments.eliminated');
    return '';
  })();

  return (
    <Stack
      direction="row"
      spacing={1}
      alignItems="center"
      justifyContent="space-between"
      sx={{
        px: 1,
        py: 0.75,
        borderRadius: 1.5,
        bgcolor: isWinner ? 'success.lighter' : 'background.neutral',
        border: '1px solid',
        borderColor: isWinner ? 'success.light' : 'divider',
        opacity: player?.username || duelStatus === 1 ? 1 : 0.6,
      }}
    >
      <Stack direction="row" spacing={1} alignItems="center" minWidth={0} flex={1}>
        <Avatar sx={{ width: 32, height: 32, bgcolor: 'primary.main', color: 'primary.contrastText', fontSize: 14 }}>
          {player?.username ? player.username.charAt(0).toUpperCase() : '?'}
        </Avatar>
        <Stack spacing={0.2} minWidth={0}>
          <Typography variant="subtitle2" noWrap fontWeight={700} color={isLoser ? 'text.disabled' : 'text.primary'}>
            {player?.username || t('tournaments.waitingOpponent')}
          </Typography>
          <Typography variant="caption" color="text.secondary" noWrap>
            {player?.ratingTitle || t('tournaments.ratingNA')}
          </Typography>
        </Stack>
      </Stack>

      {label ? (
        <Typography variant="caption" fontWeight={700} color={isWinner ? 'success.dark' : isDraw ? 'warning.dark' : 'text.secondary'}>
          {label}
        </Typography>
      ) : null}
    </Stack>
  );
};

export default TournamentPlayerRow;

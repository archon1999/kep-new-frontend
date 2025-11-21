import { Avatar, Stack, Typography } from '@mui/material';
import { ChallengePlayer } from '../../domain';

interface ChallengeUserChipProps {
  player: ChallengePlayer;
  align?: 'left' | 'right';
  highlight?: boolean;
}

const ChallengeUserChip = ({ player, align = 'left', highlight = false }: ChallengeUserChipProps) => (
  <Stack
    direction="row"
    spacing={1.5}
    alignItems="center"
    sx={{
      textAlign: align,
      justifyContent: align === 'left' ? 'flex-start' : 'flex-end',
    }}
  >
    {align === 'left' && (
      <Avatar sx={{ bgcolor: highlight ? 'primary.main' : 'background.neutral' }}>
        {player.username?.charAt(0).toUpperCase()}
      </Avatar>
    )}
    <Stack spacing={0.25} alignItems={align === 'left' ? 'flex-start' : 'flex-end'}>
      <Typography variant="subtitle2" fontWeight={700} noWrap>
        {player.username}
      </Typography>
      <Typography variant="caption" color="text.secondary">
        {player.rankTitle}
      </Typography>
      <Typography variant="caption" color={player.delta > 0 ? 'success.main' : player.delta < 0 ? 'error.main' : 'text.secondary'}>
        {player.rating} → {player.newRating} ({player.delta > 0 ? '+' : ''}{player.delta})
      </Typography>
    </Stack>
    {align === 'right' && (
      <Avatar sx={{ bgcolor: highlight ? 'primary.main' : 'background.neutral' }}>
        {player.username?.charAt(0).toUpperCase()}
      </Avatar>
    )}
  </Stack>
);

export default ChallengeUserChip;

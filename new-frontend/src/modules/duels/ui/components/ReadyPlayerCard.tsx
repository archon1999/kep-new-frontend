import { FC } from 'react';
import { Avatar, Card, CardContent, Stack, Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { DuelReadyPlayer } from '../../domain';

interface ReadyPlayerCardProps {
  player: DuelReadyPlayer;
}

const ReadyPlayerCard: FC<ReadyPlayerCardProps> = ({ player }) => {
  const { t } = useTranslation();

  return (
    <Card variant="outlined">
      <CardContent>
        <Stack direction="row" spacing={2} alignItems="center" justifyContent="space-between">
          <Stack direction="row" spacing={2} alignItems="center">
            <Avatar src={player.avatar}>{player.username[0]}</Avatar>
            <Stack spacing={0.5}>
              <Typography variant="subtitle1">{player.username}</Typography>
              <Typography variant="body2" color="text.secondary">{player.fullName}</Typography>
            </Stack>
          </Stack>
          <Stack spacing={0.5} alignItems="flex-end">
            <Typography variant="body2" color="success.main">
              {t('duels.winsShort', { count: player.wins ?? 0 })}
            </Typography>
            <Typography variant="body2" color="info.main">
              {t('duels.drawsShort', { count: player.draws ?? 0 })}
            </Typography>
            <Typography variant="body2" color="error.main">
              {t('duels.lossesShort', { count: player.losses ?? 0 })}
            </Typography>
          </Stack>
        </Stack>
      </CardContent>
    </Card>
  );
};

export default ReadyPlayerCard;

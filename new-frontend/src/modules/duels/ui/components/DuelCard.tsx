import { FC } from 'react';
import { Avatar, Box, Button, Card, CardContent, Chip, Stack, Typography } from '@mui/material';
import dayjs from 'dayjs';
import { Duel } from '../../domain';
import { useTranslation } from 'react-i18next';

interface DuelCardProps {
  duel: Duel;
  onConfirm?: (duelId: number) => void;
  actionLabel?: string;
}

const formatDateTime = (value?: string | null) => (value ? dayjs(value).format('DD.MM.YYYY HH:mm') : '—');

const DuelCard: FC<DuelCardProps> = ({ duel, onConfirm, actionLabel }) => {
  const { t } = useTranslation();
  const statusColor = duel.status === 1 ? 'success' : duel.status === -1 ? 'error' : 'warning';

  return (
    <Card variant="outlined">
      <CardContent>
        <Stack spacing={2} direction="column">
          <Stack direction="row" spacing={2} alignItems="center" flexWrap="wrap">
            <Chip label={t('duels.statusLabel', { status: duel.status })} color={statusColor as any} size="small" />
            {duel.preset?.title && <Chip label={duel.preset.title} size="small" />}
            {duel.preset?.difficultyDisplay && <Chip label={duel.preset.difficultyDisplay} size="small" />}
          </Stack>

          <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} alignItems="flex-start" justifyContent="space-between">
            <Stack direction="row" spacing={2} alignItems="center">
              <Avatar>{duel.playerFirst.username[0]}</Avatar>
              <Box>
                <Typography variant="subtitle1">{duel.playerFirst.username}</Typography>
                <Typography variant="body2" color="text.secondary">
                  {duel.playerFirst.ratingTitle}
                </Typography>
              </Box>
            </Stack>

            <Typography variant="overline" color="text.secondary">
              {t('duels.vs')}
            </Typography>

            {duel.playerSecond ? (
              <Stack direction="row" spacing={2} alignItems="center">
                <Avatar>{duel.playerSecond.username[0]}</Avatar>
                <Box>
                  <Typography variant="subtitle1">{duel.playerSecond.username}</Typography>
                  <Typography variant="body2" color="text.secondary">
                    {duel.playerSecond.ratingTitle}
                  </Typography>
                </Box>
              </Stack>
            ) : (
              <Typography variant="body2" color="text.secondary">
                {t('duels.waitingForOpponent')}
              </Typography>
            )}
          </Stack>

          <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} justifyContent="space-between">
            <Box>
              <Typography variant="body2" color="text.secondary">
                {t('duels.startTime')}
              </Typography>
              <Typography variant="body1">{formatDateTime(duel.startTime)}</Typography>
            </Box>
            <Box>
              <Typography variant="body2" color="text.secondary">
                {t('duels.finishTime')}
              </Typography>
              <Typography variant="body1">{formatDateTime(duel.finishTime)}</Typography>
            </Box>
            {onConfirm && !duel.isConfirmed && (
              <Box display="flex" alignItems="center">
                <Button variant="contained" onClick={() => onConfirm(duel.id)}>
                  {actionLabel ?? t('duels.confirm')}
                </Button>
              </Box>
            )}
          </Stack>
        </Stack>
      </CardContent>
    </Card>
  );
};

export default DuelCard;

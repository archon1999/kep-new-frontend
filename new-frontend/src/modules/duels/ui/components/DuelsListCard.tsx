import dayjs from 'dayjs';
import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { Link as RouterLink } from 'react-router';
import { Box, Button, Card, CardContent, Chip, Divider, Stack, Typography } from '@mui/material';
import KepIcon from 'shared/components/base/KepIcon';
import paths from 'app/routes/paths.ts';
import { Duel } from '../../domain/entities/duel.entity.ts';

interface DuelsListCardProps {
  duel: Duel;
  onConfirm?: (duelId: number) => void;
  confirmLoading?: boolean;
  confirmDisabled?: boolean;
}

const STATUS_COLOR: Record<number, 'info' | 'success' | 'default'> = {
  [-1]: 'info',
  [0]: 'success',
  [1]: 'default',
};

const DuelsListCard = ({ duel, onConfirm, confirmDisabled, confirmLoading }: DuelsListCardProps) => {
  const { t } = useTranslation();

  const statusLabel = useMemo(() => {
    switch (duel.status) {
      case -1:
        return t('duels.statusUpcoming');
      case 0:
        return t('duels.statusRunning');
      default:
        return t('duels.statusFinished');
    }
  }, [duel.status, t]);

  const viewLink = useMemo(() => paths.duel.replace(':id', duel.id.toString()), [duel.id]);

  return (
    <Card variant="outlined">
      <CardContent>
        <Stack spacing={2}>
          <Stack direction={{ xs: 'column', sm: 'row' }} justifyContent="space-between" spacing={1}>
            <Box>
              <Stack direction="row" spacing={1} alignItems="center" flexWrap="wrap">
                <Typography fontWeight={700}>{duel.playerFirst?.username}</Typography>
                <Typography variant="body2" color="text.secondary">
                  {t('duels.playersVs')}
                </Typography>
                {duel.playerSecond ? (
                  <Typography fontWeight={700}>{duel.playerSecond.username}</Typography>
                ) : (
                  <Chip label="BYE" size="small" />
                )}
              </Stack>
              <Stack direction="row" spacing={1} alignItems="center" flexWrap="wrap" mt={0.5}>
                <Typography variant="body2" color="text.secondary">
                  <KepIcon name="time" fontSize={16} /> {dayjs(duel.startTime).format('DD MMM YYYY, HH:mm')}
                </Typography>
                {duel.finishTime ? (
                  <>
                    <Typography variant="body2" color="text.secondary">
                      •
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      <KepIcon name="flag" fontSize={16} /> {dayjs(duel.finishTime).format('DD MMM YYYY, HH:mm')}
                    </Typography>
                  </>
                ) : null}
              </Stack>
              <Stack direction="row" spacing={1} alignItems="center" flexWrap="wrap" mt={1}>
                <Chip color={STATUS_COLOR[duel.status]} label={statusLabel} size="small" />
                {duel.isConfirmed === false ? (
                  <Chip color="warning" label={t('duels.awaitingConfirmation')} size="small" />
                ) : null}
              </Stack>
            </Box>

            <Stack spacing={1} alignItems={{ xs: 'flex-start', sm: 'flex-end' }}>
              <Stack direction="row" spacing={1} alignItems="center">
                <Typography variant="body2" color="text.secondary">
                  {duel.playerFirst?.username}
                </Typography>
                <Typography variant="h5" color="primary">
                  {duel.playerFirst?.balls ?? 0}
                </Typography>
              </Stack>
              {duel.playerSecond ? (
                <Stack direction="row" spacing={1} alignItems="center">
                  <Typography variant="body2" color="text.secondary">
                    {duel.playerSecond.username}
                  </Typography>
                  <Typography variant="h5" color="primary">
                    {duel.playerSecond.balls ?? 0}
                  </Typography>
                </Stack>
              ) : null}
            </Stack>
          </Stack>

          <Divider />

          <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1} justifyContent="flex-end" alignItems="center">
            {onConfirm && duel.isConfirmed === false ? (
              <Button
                variant="contained"
                color="success"
                size="small"
                disabled={confirmDisabled}
                onClick={() => onConfirm(duel.id)}
              >
                {confirmLoading ? t('common.loading') : t('duels.confirm')}
              </Button>
            ) : null}

            <Button component={RouterLink} to={viewLink} variant="outlined" size="small">
              {t('duels.viewDuel')}
            </Button>
          </Stack>
        </Stack>
      </CardContent>
    </Card>
  );
};

export default DuelsListCard;

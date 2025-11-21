import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { Card, CardContent, Stack, Switch, Typography } from '@mui/material';
import { DuelReadyStatus } from '../../domain/entities/duel.entity.ts';

interface DuelReadyStatusCardProps {
  status?: DuelReadyStatus;
  onChange: (ready: boolean) => void;
  loading?: boolean;
}

const DuelReadyStatusCard = ({ status, onChange, loading }: DuelReadyStatusCardProps) => {
  const { t } = useTranslation();

  const description = useMemo(
    () => (status?.ready ? t('duels.readyDescription') : t('duels.notReadyDescription')),
    [status?.ready, t],
  );

  return (
    <Card variant="outlined">
      <CardContent>
        <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1} alignItems="center" justifyContent="space-between">
          <Stack spacing={0.5}>
            <Typography variant="h6" fontWeight={700}>
              {t('duels.readyStatus')}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {description}
            </Typography>
          </Stack>

          <Stack direction="row" spacing={1} alignItems="center">
            <Typography variant="body2" color="text.secondary">
              {status?.ready ? t('duels.readyLabel') : t('duels.notReadyLabel')}
            </Typography>
            <Switch
              color="warning"
              checked={Boolean(status?.ready)}
              onChange={(event) => onChange(event.target.checked)}
              disabled={loading}
            />
          </Stack>
        </Stack>
      </CardContent>
    </Card>
  );
};

export default DuelReadyStatusCard;

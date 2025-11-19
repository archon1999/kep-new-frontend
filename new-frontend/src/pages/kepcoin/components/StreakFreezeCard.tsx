import { Button, Card, CardContent, CardHeader, Chip, Skeleton, Stack, Typography } from '@mui/material';
import IconifyIcon from 'shared/components/base/IconifyIcon';

interface StreakFreezeCardProps {
  title: string;
  description: string;
  streakLabel: string;
  streakValue?: number;
  youHaveLabel: string;
  streakFreeze?: number;
  buttonLabel: string;
  loading?: boolean;
  onPurchaseClick: () => void;
}

const StreakFreezeCard = ({
  title,
  description,
  streakLabel,
  streakValue,
  youHaveLabel,
  streakFreeze,
  buttonLabel,
  loading,
  onPurchaseClick,
}: StreakFreezeCardProps) => (
  <Card>
    <CardHeader
      title={
        <Stack direction="row" spacing={1} alignItems="center">
          <IconifyIcon icon="mdi:cloud-snow-outline" sx={{ color: 'info.main' }} />
          <Typography variant="h6" fontWeight={700}>
            {title}
          </Typography>
        </Stack>
      }
    />
    <CardContent>
      {loading ? (
        <Stack spacing={2}>
          <Skeleton variant="text" width="60%" height={24} />
          <Skeleton variant="rectangular" height={48} />
          <Skeleton variant="rounded" height={36} width={180} />
        </Stack>
      ) : (
        <Stack spacing={2.5}>
          <Stack direction="row" spacing={1.5} alignItems="center" flexWrap="wrap">
            <Chip
              color="warning"
              icon={<IconifyIcon icon="mdi:fire" fontSize={18} />}
              label={`${streakLabel}: ${streakValue ?? '—'}`}
            />
            <Chip
              color="primary"
              variant="soft"
              label={`${youHaveLabel} ${streakFreeze ?? 0}`}
            />
          </Stack>
          <Typography variant="body2" color="text.secondary">
            {description}
          </Typography>
          <Button variant="contained" color="primary" onClick={onPurchaseClick} sx={{ alignSelf: 'flex-start' }}>
            {buttonLabel}
          </Button>
        </Stack>
      )}
    </CardContent>
  </Card>
);

export default StreakFreezeCard;

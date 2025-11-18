import { Button, Card, CardContent, CardHeader, Chip, Divider, Stack, Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';
import KepIcon from 'shared/components/base/KepIcon';
import KepcoinValue from './KepcoinValue';

interface StreakFreezeCardProps {
  streak?: number;
  streakFreeze?: number;
  description: string;
  onPurchase: () => Promise<void> | void;
  isPurchasing?: boolean;
}

const StreakFreezeCard = ({ streak, streakFreeze, description, onPurchase, isPurchasing }: StreakFreezeCardProps) => {
  const { t } = useTranslation();

  return (
    <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <CardHeader
        title={
          <Stack direction="row" alignItems="center" spacing={1.5}>
            <KepIcon name="streak" fontSize={22} />
            <Typography variant="subtitle1" fontWeight={700} color="text.primary">
              {t('kepcoinPage.streakFreeze.title')}
            </Typography>
            {typeof streak === 'number' && (
              <Chip
                size="small"
                label={t('kepcoinPage.streakFreeze.streakLabel', { value: streak })}
                color="warning"
                variant="outlined"
              />
            )}
          </Stack>
        }
        subheader={
          <Stack direction="row" spacing={1} alignItems="center" flexWrap="wrap">
            <Chip
              size="small"
              label={t('kepcoinPage.streakFreeze.owned', { value: streakFreeze ?? 0 })}
              variant="outlined"
            />
            <Chip size="small" color="warning" label={<KepcoinValue value={10} size={16} textVariant="caption" />} />
          </Stack>
        }
        sx={{ pb: 1 }}
      />
      <Divider />
      <CardContent sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
        <Typography variant="body2" color="text.secondary">
          {description}
        </Typography>

        <Button
          variant="contained"
          color="warning"
          onClick={onPurchase}
          disabled={isPurchasing}
          sx={{ alignSelf: 'flex-start' }}
        >
          {isPurchasing ? t('kepcoinPage.common.loading') : t('kepcoinPage.streakFreeze.cta')}
        </Button>
      </CardContent>
    </Card>
  );
};

export default StreakFreezeCard;

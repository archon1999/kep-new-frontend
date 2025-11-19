import { LoadingButton } from '@mui/lab';
import { Box, Card, CardContent, CardHeader, Chip, Skeleton, Stack, Typography } from '@mui/material';
import IconifyIcon from 'shared/components/base/IconifyIcon';
import { useTranslation } from 'react-i18next';
import kepcoinImage from 'shared/assets/images/icons/kepcoin.png';

interface StreakFreezeCardProps {
  streak: number;
  streakFreeze: number;
  loading?: boolean;
  purchasing?: boolean;
  onPurchase: () => void;
}

const StreakFreezeCard = ({ streak, streakFreeze, loading, purchasing, onPurchase }: StreakFreezeCardProps) => {
  const { t } = useTranslation();

  return (
    <Card elevation={0} sx={{ borderRadius: 3, border: (theme) => `1px solid ${theme.palette.divider}` }}>
      <CardHeader
        title={
          <Stack direction="row" spacing={1} alignItems="center">
            <IconifyIcon icon="mdi:snowflake" sx={{ color: 'info.main', fontSize: 20 }} />
            <Typography variant="subtitle1" fontWeight={700} color="text.primary">
              {t('kepcoin.streakFreeze.title')}
            </Typography>
          </Stack>
        }
        action={
          <LoadingButton
            loading={purchasing}
            onClick={onPurchase}
            variant="contained"
            color="primary"
            size="small"
            sx={{ borderRadius: 999 }}
          >
            <Stack direction="row" spacing={1} alignItems="center">
              <Typography variant="button" fontWeight={700}>
                {t('kepcoin.streakFreeze.purchase')}
              </Typography>
              <Stack direction="row" spacing={0.5} alignItems="center">
                <Typography variant="button" fontWeight={700}>
                  10
                </Typography>
                <Box component="img" src={kepcoinImage} alt="Kepcoin" sx={{ width: 16, height: 16 }} />
              </Stack>
            </Stack>
          </LoadingButton>
        }
      />

      <CardContent>
        {loading ? (
          <Stack spacing={2}>
            <Skeleton variant="text" width={120} />
            <Skeleton variant="rounded" height={60} />
          </Stack>
        ) : (
          <Stack spacing={2}>
            <Stack direction="row" spacing={1} flexWrap="wrap">
              <Chip
                label={`${t('kepcoin.streakFreeze.currentStreak')}: ${streak}`}
                color="warning"
                variant="soft"
                icon={<IconifyIcon icon="mdi:local-fire-department" sx={{ fontSize: 18 }} />}
              />
              <Chip
                label={t('kepcoin.streakFreeze.owned', { count: streakFreeze })}
                color="info"
                variant="soft"
              />
            </Stack>

            <Typography variant="body2" color="text.secondary">
              {t('kepcoin.streakFreeze.description')}
            </Typography>
          </Stack>
        )}
      </CardContent>
    </Card>
  );
};

export default StreakFreezeCard;

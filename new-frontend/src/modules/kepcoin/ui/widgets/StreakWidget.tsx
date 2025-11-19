import { useMemo } from 'react';
import { Chip, Divider, Skeleton, Stack, Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';
import IconifyIcon from 'shared/components/base/IconifyIcon';

interface StreakWidgetProps {
  balance?: number;
  streak?: number;
  streakFreeze?: number;
  isLoading: boolean;
}

const StreakWidget = ({ balance = 0, streak = 0, streakFreeze = 0, isLoading }: StreakWidgetProps) => {
  const { t } = useTranslation();
  const balanceLabel = useMemo(() => {
    const formatter = new Intl.NumberFormat();
    return formatter.format(balance ?? 0);
  }, [balance]);

  return (
    <Stack>
      <Stack direction="column" spacing={2} sx={{ p: { xs: 3, md: 5 } }}>
        {isLoading ? (
          <Skeleton variant="text" width={240} height={48} />
        ) : (
          <Typography variant="h3" fontWeight={700}>
            {t('kepcoinPage.youHave', { value: balanceLabel })}
          </Typography>
        )}
        <Stack direction="row" spacing={1.5} flexWrap="wrap" alignItems="center">
          {isLoading ? (
            <Skeleton variant="rounded" width={160} height={36} />
          ) : (
            <Chip
              icon={<IconifyIcon icon="solar:fire-bold-duotone" fontSize={18} />}
              label={t('kepcoinPage.currentStreak', { value: streak })}
              variant="outlined"
            />
          )}
          {isLoading ? (
            <Skeleton variant="rounded" width={190} height={36} />
          ) : (
            <Chip
              icon={<IconifyIcon icon="solar:snowflake-line-duotone" fontSize={18} />}
              label={t('kepcoinPage.streakFreeze.count', { value: streakFreeze })}
              color="info"
              variant="outlined"
            />
          )}
        </Stack>
        <Typography variant="body2" color="text.secondary">
          {t('kepcoinPage.streakFreeze.description')}
        </Typography>
      </Stack>

      <Divider flexItem></Divider>
    </Stack>
  );
};

export default StreakWidget;

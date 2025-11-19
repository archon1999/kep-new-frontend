import { Chip, Skeleton, Stack, Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';
import IconifyIcon from 'shared/components/base/IconifyIcon';

interface StreakWidgetProps {
  streak?: number;
  streakFreeze?: number;
  isLoading: boolean;
  summaryLabel?: string;
}

const StreakWidget = ({ streak = 0, streakFreeze = 0, isLoading, summaryLabel }: StreakWidgetProps) => {
  const { t } = useTranslation();

  return (
    <Stack spacing={3}>
      {isLoading ? (
        <Skeleton variant="text" width={240} height={48} />
      ) : (
        <Typography variant="h3" fontWeight={700}>
          {summaryLabel}
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
  );
};

export default StreakWidget;

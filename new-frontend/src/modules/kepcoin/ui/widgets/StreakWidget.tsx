import { ReactNode, useMemo } from 'react';
import { Divider, Skeleton, Stack, Tooltip, Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';
import IconifyIcon from 'shared/components/base/IconifyIcon';
import Streak from 'shared/components/rating/Streak';

interface StreakWidgetProps {
  balance?: number;
  streak?: number;
  maxStreak?: number;
  streakFreeze?: number;
  isLoading: boolean;
}

const StreakWidget = ({
  balance = 0,
  streak = 0,
  maxStreak = 0,
  streakFreeze = 0,
  isLoading,
}: StreakWidgetProps) => {
  const { t } = useTranslation();
  const balanceLabel = useMemo(() => {
    const formatter = new Intl.NumberFormat();
    return formatter.format(balance ?? 0);
  }, [balance]);

  const renderStat = (label: string, content: ReactNode, tooltip?: string) => {
    const node = (
      <Stack spacing={0.75} minWidth={160}>
        <Typography variant="caption" color="text.secondary" textTransform="uppercase">
          {label}
        </Typography>
        {content}
      </Stack>
    );

    if (tooltip) {
      return (
        <Tooltip title={tooltip} arrow>
          {node}
        </Tooltip>
      );
    }

    return node;
  };

  return (
    <Stack>
      <Stack direction="column" spacing={3} sx={{ p: { xs: 3, md: 5 } }}>
        {isLoading ? (
          <Skeleton variant="text" width={240} height={48} />
        ) : (
          <Typography variant="h3" fontWeight={700}>
            {t('kepcoinPage.youHave', { value: balanceLabel })}
          </Typography>
        )}
        <Stack direction={{ xs: 'column', sm: 'row' }} spacing={3} flexWrap="wrap">
          {renderStat(
            t('kepcoinPage.streakStats.current'),
            isLoading ? (
              <Skeleton variant="rounded" width={140} height={32} />
            ) : (
              <Streak streak={streak} maxStreak={maxStreak} iconSize={22} spacing={0.75} />
            ),
          )}
          {renderStat(
            t('kepcoinPage.streakStats.max'),
            isLoading ? (
              <Skeleton variant="rounded" width={140} height={32} />
            ) : (
              <Streak streak={maxStreak} maxStreak={maxStreak} iconSize={22} spacing={0.75} />
            ),
          )}
          {renderStat(
            t('kepcoinPage.streakFreeze.label'),
            isLoading ? (
              <Skeleton variant="text" width={200} />
            ) : (
              <Stack direction="row" spacing={0.75} alignItems="center">
                <IconifyIcon icon="solar:snowflake-line-duotone" fontSize={20} color="info.main" />
                <Typography variant="body2" fontWeight={600} color="text.primary">
                  {t('kepcoinPage.streakFreeze.count', { value: streakFreeze })}
                </Typography>
              </Stack>
            ),
            t('kepcoinPage.streakFreeze.description'),
          )}
        </Stack>
      </Stack>

      <Divider flexItem></Divider>
    </Stack>
  );
};

export default StreakWidget;

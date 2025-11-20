import { ReactNode } from 'react';
import { useTranslation } from 'react-i18next';
import { Paper, Skeleton, Stack, Tooltip, Typography } from '@mui/material';
import IconifyIcon from 'shared/components/base/IconifyIcon';
import KepcoinValue from 'shared/components/common/KepcoinValue.tsx';
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
    <Paper>
      <Stack direction="column" spacing={3} sx={{ p: { xs: 3, md: 5 } }}>
        {isLoading ? (
          <Skeleton variant="text" width={240} height={48} />
        ) : (
          <Typography variant="h3" fontWeight={700}>
            <Stack spacing={1}>
              You have <KepcoinValue iconSize={32} textVariant="h3" value={balance}></KepcoinValue>
            </Stack>
          </Typography>
        )}
        <Stack direction={{ xs: 'column', sm: 'row' }} spacing={3} flexWrap="nowrap">
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
                  {streakFreeze}
                </Typography>
              </Stack>
            ),
            t('kepcoinPage.streakFreeze.description'),
          )}
        </Stack>
      </Stack>
    </Paper>
  );
};

export default StreakWidget;

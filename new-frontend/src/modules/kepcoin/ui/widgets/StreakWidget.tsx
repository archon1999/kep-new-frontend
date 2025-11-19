import { useMemo } from 'react';
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

const StreakWidget = ({ balance = 0, streak = 0, maxStreak = 0, streakFreeze = 0, isLoading }: StreakWidgetProps) => {
  const { t } = useTranslation();
  const balanceLabel = useMemo(() => {
    const formatter = new Intl.NumberFormat();
    return formatter.format(balance ?? 0);
  }, [balance]);

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
        <Stack
          direction={{ xs: 'column', sm: 'row' }}
          spacing={3}
          divider={
            <Divider flexItem orientation="vertical" sx={{ display: { xs: 'none', sm: 'block' }, borderColor: 'divider' }} />
          }
        >
          <Stack spacing={0.75} flex={1}>
            <Typography variant="body2" color="text.secondary">
              {t('kepcoinPage.currentStreakLabel')}
            </Typography>
            {isLoading ? (
              <Skeleton variant="text" width={140} height={32} />
            ) : (
              <Streak streak={streak} maxStreak={maxStreak} iconSize={24} spacing={1} />
            )}
          </Stack>

          <Stack spacing={0.75} flex={1}>
            <Typography variant="body2" color="text.secondary">
              {t('kepcoinPage.maxStreakLabel')}
            </Typography>
            {isLoading ? (
              <Skeleton variant="text" width={120} height={32} />
            ) : (
              <Streak streak={maxStreak} maxStreak={maxStreak} iconSize={24} spacing={1} />
            )}
          </Stack>

          <Stack spacing={0.75} flex={1}>
            <Typography variant="body2" color="text.secondary">
              {t('kepcoinPage.streakFreeze.label')}
            </Typography>
            {isLoading ? (
              <Skeleton variant="text" width={160} height={32} />
            ) : (
              <Tooltip title={t('kepcoinPage.streakFreeze.description')} arrow placement="top">
                <Stack direction="row" spacing={0.75} alignItems="center" sx={{ cursor: 'help', width: 'fit-content' }}>
                  <IconifyIcon icon="solar:snowflake-line-duotone" fontSize={24} color="info.main" />
                  <Typography variant="body2" fontWeight={700} color="text.primary">
                    {t('kepcoinPage.streakFreeze.count', { value: streakFreeze })}
                  </Typography>
                </Stack>
              </Tooltip>
            )}
          </Stack>
        </Stack>
      </Stack>

      <Divider flexItem></Divider>
    </Stack>
  );
};

export default StreakWidget;

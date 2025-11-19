import { Box, Divider, LinearProgress, Paper, Skeleton, Stack, Typography, useTheme } from '@mui/material';
import { LineChart } from '@mui/x-charts/LineChart';
import dayjs from 'dayjs';
import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import type { HomeUsersChart } from '../../domain/entities/home.entity';

interface UserActivitySectionProps {
  data?: HomeUsersChart | null;
  isLoading?: boolean;
}

const DEFAULT_DAYS = 12;

const UserActivitySection = ({ data, isLoading }: UserActivitySectionProps) => {
  const { t } = useTranslation();
  const theme = useTheme();
  const numberFormatter = useMemo(() => new Intl.NumberFormat(), []);

  const chartData = useMemo(() => {
    if (!data) {
      return null;
    }

    const length = Math.min(data.newUsersSeries.length, data.activeUsersSeries.length, DEFAULT_DAYS);

    if (!length) {
      return null;
    }

    const dates = Array.from({ length }, (_, index) =>
      dayjs()
        .subtract(length - index - 1, 'day')
        .startOf('day')
        .toDate(),
    );

    return {
      dates,
      newUsers: data.newUsersSeries.slice(-length),
      activeUsers: data.activeUsersSeries.slice(-length),
    };
  }, [data]);

  const chartLength = chartData?.dates.length ?? DEFAULT_DAYS;
  const formattedTotal = data ? numberFormatter.format(data.total) : '—';
  const formattedActive = data ? numberFormatter.format(data.activeTotal) : '—';

  return (
    <Paper background={1} sx={{ height: 1 }}>
      <Stack spacing={3} sx={{ p: { xs: 3, md: 5 }, height: 1 }}>
        <Stack spacing={1} direction="column">
          <Typography variant="overline" color="text.secondary">
            {t('homePage.userActivity.title')}
          </Typography>

          <Stack
            direction={{ xs: 'column', sm: 'row' }}
            spacing={2}
            alignItems={{ sm: 'center' }}
            divider={
              <Divider
                flexItem
                orientation="vertical"
                sx={{ display: { xs: 'none', sm: 'block' }, borderColor: 'divider' }}
              />
            }
          >
            <Stack spacing={0.5}>
              <Typography variant="h4" fontWeight={700}>
                {formattedTotal}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {t('homePage.userActivity.totalLabel')}
              </Typography>
            </Stack>

            <Stack spacing={0.5}>
              <Typography variant="h5" fontWeight={600} color="success.main">
                {formattedActive}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {t('homePage.userActivity.activeLabel')}
              </Typography>
            </Stack>
          </Stack>
        </Stack>

        <Stack spacing={1} flex={1}>
          <Typography variant="body2" color="text.secondary">
            {t('homePage.userActivity.chart.subtitle', { count: chartLength })}
          </Typography>

          {isLoading && <LinearProgress sx={{ borderRadius: 999 }} />}

          {chartData ? (
            <LineChart
              height={260}
              series={[
                {
                  id: 'newUsers',
                  label: t('homePage.userActivity.chart.newUsers'),
                  data: chartData.newUsers,
                  showMark: false,
                  color: theme.palette.primary.main,
                },
                {
                  id: 'activeUsers',
                  label: t('homePage.userActivity.chart.activeUsers'),
                  data: chartData.activeUsers,
                  showMark: false,
                  color: theme.palette.success.main,
                },
              ]}
              xAxis={[
                {
                  scaleType: 'time',
                  data: chartData.dates,
                  valueFormatter: (value) => dayjs(value as Date).format('MMM D'),
                },
              ]}
              margin={{ left: 20, right: 20, top: 40, bottom: 20 }}
              grid={{ vertical: false }}
              slotProps={{
                legend: {
                  hidden: false,
                  direction: 'row',
                },
              }}
            />
          ) : isLoading ? (
            <Skeleton variant="rounded" height={260} />
          ) : (
            <Box py={6} textAlign="center">
              <Typography variant="body2" color="text.secondary">
                {t('homePage.userActivity.chart.empty')}
              </Typography>
            </Box>
          )}
        </Stack>
      </Stack>
    </Paper>
  );
};

export default UserActivitySection;

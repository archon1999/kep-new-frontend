import { Box, Divider, Grid, Paper, Stack, Typography, useTheme } from '@mui/material';
import dayjs from 'dayjs';
import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { CartesianGrid, Legend, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';

const USER_ACTIVITY_STATS = {
  newUsersSeries: [3, 0, 2, 5, 2, 21, 5, 4, 2, 4, 3, 2],
  activeUsersSeries: [42, 57, 15, 88, 61, 34, 77, 52, 19, 66, 48, 25],
  total: 8550,
  activeTotal: 584,
};

const DAYS_IN_SERIES = USER_ACTIVITY_STATS.newUsersSeries.length;

interface ChartPoint {
  timestamp: number;
  newUsers: number;
  activeUsers: number;
}

const UserActivitySection = () => {
  const { t, i18n } = useTranslation();
  const theme = useTheme();

  const chartData = useMemo<ChartPoint[]>(() => {
    return Array.from({ length: DAYS_IN_SERIES }, (_, index) => {
      const cursor = dayjs().subtract(DAYS_IN_SERIES - index - 1, 'day');
      return {
        timestamp: cursor.valueOf(),
        newUsers: USER_ACTIVITY_STATS.newUsersSeries[index] ?? 0,
        activeUsers: USER_ACTIVITY_STATS.activeUsersSeries[index] ?? 0,
      };
    });
  }, []);

  const totals = useMemo(
    () => [
      {
        label: t('homePage.userActivity.metrics.totalUsers'),
        value: USER_ACTIVITY_STATS.total,
      },
      {
        label: t('homePage.userActivity.metrics.activeUsers'),
        value: USER_ACTIVITY_STATS.activeTotal,
      },
    ],
    [t]
  );

  return (
    <Paper sx={{ height: 1 }}>
      <Stack direction="column" spacing={3} sx={{ p: { xs: 3, md: 5 }, height: 1 }}>
        <Stack spacing={0.5}>
          <Typography variant="h5">{t('homePage.userActivity.title')}</Typography>
        </Stack>

        <Grid container spacing={3}>
          {totals.map((item) => (
            <Grid key={item.label} size={{ xs: 12, sm: 6 }}>
              <Stack direction="column" spacing={0.5}>
                <Typography variant="body2" color="text.secondary">
                  {item.label}
                </Typography>
                <Typography variant="h4">{item.value}</Typography>
              </Stack>
            </Grid>
          ))}
        </Grid>

        <Divider />

        <Box sx={{ flexGrow: 1, minHeight: 200 }}>
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke={theme.palette.divider} />
              <XAxis
                dataKey="timestamp"
                type="number"
                stroke={theme.palette.text.secondary}
                domain={['dataMin', 'dataMax']}
                tickFormatter={(value) => dayjs(value).format('MMM DD')}
              />
              <YAxis
                stroke={theme.palette.text.secondary}
                tickFormatter={(value) => value as number}
                width={60}
              />
              <Tooltip
                formatter={(value, name) => [
                  value as number,
                  name === 'newUsers'
                    ? t('homePage.userActivity.chart.newUsers')
                    : t('homePage.userActivity.chart.activeUsers'),
                ]}
                labelFormatter={(value) => dayjs(value).format('MMM DD')}
              />
              <Legend
                formatter={(value) =>
                  value === 'newUsers'
                    ? t('homePage.userActivity.chart.newUsers')
                    : t('homePage.userActivity.chart.activeUsers')
                }
              />
              <Line
                type="monotone"
                dataKey="newUsers"
                stroke={theme.palette.primary.main}
                strokeWidth={2}
                dot={false}
                name="newUsers"
              />
              <Line
                type="monotone"
                dataKey="activeUsers"
                stroke={theme.palette.warning.main}
                strokeWidth={2}
                dot={false}
                name="activeUsers"
              />
            </LineChart>
          </ResponsiveContainer>
        </Box>
      </Stack>
    </Paper>
  );
};

export default UserActivitySection;

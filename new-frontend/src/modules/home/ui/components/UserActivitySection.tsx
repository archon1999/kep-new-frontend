import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import Grid from '@mui/material/Grid';
import Paper from '@mui/material/Paper';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { useTheme } from '@mui/material/styles';
import dayjs from 'dayjs';
import { LineChart } from 'echarts/charts';
import { GridComponent, LegendComponent, TooltipComponent } from 'echarts/components';
import * as echarts from 'echarts/core';
import { CanvasRenderer } from 'echarts/renderers';
import ReactEchart from 'shared/components/base/ReactEchart';
import { getColor } from 'shared/lib/echart-utils';
import { getPastDates } from 'shared/lib/utils';
import Box from "@mui/material/Box";

echarts.use([LineChart, GridComponent, LegendComponent, TooltipComponent, CanvasRenderer]);

const USER_ACTIVITY_DATA = {
  newUsersSeries: [3, 0, 2, 5, 2, 21, 5, 4, 2, 4, 3, 2],
  total: 8550,
  activeUsersSeries: [42, 57, 15, 88, 61, 34, 77, 52, 19, 66, 48, 25],
  activeTotal: 584,
} as const;

const UserActivitySection = () => {
  const theme = useTheme();
  const { t } = useTranslation();

  const labels = useMemo(
    () =>
      getPastDates(USER_ACTIVITY_DATA.newUsersSeries.length).map((date) =>
        dayjs(date).format('MMM DD'),
      ),
    [],
  );

  const formatter = useMemo(
    () =>
      new Intl.NumberFormat(undefined, {
        maximumFractionDigits: 0,
      }),
    [],
  );

  const axisLabelColor = getColor(theme.vars.palette.text.secondary);
  const legendTextColor = getColor(theme.vars.palette.text.secondary);
  const splitLineColor = getColor(theme.vars.palette.chGrey[200]);
  const pointerColor = getColor(theme.vars.palette.chGrey[300]);
  const newUsersColor = getColor(theme.vars.palette.primary.main);
  const activeUsersColor = getColor(theme.vars.palette.success.main);
  const primaryMainChannel = theme.vars.palette.primary.mainChannel;

  const chartOptions = useMemo(() => {
    const tooltipSuffix = t('homePage.userActivity.tooltipSuffix');
    const newUsersLabel = t('homePage.userActivity.series.newUsers');
    const activeUsersLabel = t('homePage.userActivity.series.activeUsers');

    const withPadding = (min: number, max: number) => {
      const range = max - min;
      const padding = range === 0 ? 1 : range * 0.15;
      return [Math.max(0, Math.floor(min - padding)), Math.ceil(max + padding)];
    };

    const [newUsersMin, newUsersMax] = withPadding(
      Math.min(...USER_ACTIVITY_DATA.newUsersSeries),
      Math.max(...USER_ACTIVITY_DATA.newUsersSeries),
    );
    const [activeUsersMin, activeUsersMax] = withPadding(
      Math.min(...USER_ACTIVITY_DATA.activeUsersSeries),
      Math.max(...USER_ACTIVITY_DATA.activeUsersSeries),
    );

    return {
      tooltip: {
        trigger: 'axis',
        axisPointer: {
          type: 'line',
          lineStyle: {
            color: pointerColor,
          },
        },
        valueFormatter: (value: string | number) => `${value} ${tooltipSuffix}`,
      },
      grid: { left: 12, right: 12, top: 50, bottom: 0, containLabel: true },
      xAxis: {
        type: 'category',
        boundaryGap: false,
        data: labels,
        axisLabel: {
          color: axisLabelColor,
          fontFamily: theme.typography.fontFamily,
        },
        axisTick: {
          show: false,
        },
        axisLine: {
          show: false,
        },
      },
      yAxis: [
        {
          type: 'value',
          min: newUsersMin,
          max: newUsersMax,
          axisLabel: {
            color: axisLabelColor,
          },
          splitLine: {
            lineStyle: {
              color: splitLineColor,
            },
          },
          axisLine: { show: false },
          axisTick: { show: false },
          alignTicks: true,
        },
        {
          type: 'value',
          min: activeUsersMin,
          max: activeUsersMax,
          axisLabel: {
            show: false,
          },
          splitLine: { show: false },
          axisLine: { show: false },
          axisTick: { show: false },
          alignTicks: true,
        },
      ],
      series: [
        {
          name: newUsersLabel,
          type: 'line',
          data: USER_ACTIVITY_DATA.newUsersSeries,
          smooth: true,
          showSymbol: false,
          lineStyle: {
            width: 3,
            color: newUsersColor,
          },
          emphasis: {
            focus: 'series',
          },
        },
        {
          name: activeUsersLabel,
          type: 'line',
          data: USER_ACTIVITY_DATA.activeUsersSeries,
          smooth: true,
          showSymbol: false,
          yAxisIndex: 1,
          lineStyle: {
            width: 3,
            color: activeUsersColor,
          },
          emphasis: {
            focus: 'series',
          },
        },
      ],
    };
  }, [
    activeUsersColor,
    axisLabelColor,
    labels,
    legendTextColor,
    pointerColor,
    splitLineColor,
    t,
    theme.typography.fontFamily,
    newUsersColor,
    primaryMainChannel,
  ]);

  return (
    <Stack direction="column">
      <Paper>
        <Typography variant="h5" sx={{ p: 4, fontWeight: 600 }}>
          {t('homePage.userActivity.title')}
        </Typography>
      </Paper>

      <Grid container>
        <Grid size={{ xs: 12, sm: 6 }}>
          <Paper sx={{ p: 4 }}>
            <Stack direction="column" spacing={0.5}>
              <Typography variant="h4" sx={{ fontWeight: 600 }}>
                {formatter.format(USER_ACTIVITY_DATA.total)}
              </Typography>

              <Typography variant="subtitle2">{t('homePage.userActivity.totals.new')}</Typography>
            </Stack>
          </Paper>
        </Grid>
        <Grid size={{ xs: 12, sm: 6 }}>
          <Paper sx={{ p: 4 }}>
            <Stack direction="column" spacing={0.5}>
              <Typography variant="h4" sx={{ fontWeight: 600 }}>
                {formatter.format(USER_ACTIVITY_DATA.activeTotal)}
              </Typography>

              <Typography variant="subtitle2">
                {t('homePage.userActivity.totals.active')}
              </Typography>
            </Stack>
          </Paper>
        </Grid>
      </Grid>

      <Paper sx={{ pb: 4, px: 2 }}>
        <ReactEchart echarts={echarts} option={chartOptions}/>
      </Paper>
    </Stack>
  );
};

export default UserActivitySection;

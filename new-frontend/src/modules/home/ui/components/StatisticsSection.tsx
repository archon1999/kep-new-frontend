import { useMemo } from 'react';
import Chip, { ChipProps } from '@mui/material/Chip';
import Grid from '@mui/material/Grid';
import Paper from '@mui/material/Paper';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { useTranslation } from 'react-i18next';
import IconifyIcon from 'shared/components/base/IconifyIcon';

const STATISTICS_DATA = {
  users: {
    value: 8548,
    percent: 9.6,
  },
  problems: {
    value: 1951,
    growth_percent: -8.4,
  },
  competitions: {
    value: 365,
    percent: -14.1,
  },
  attempts: {
    value: 379607,
    percent: 11.6,
  },
} as const;

type StatisticKey = keyof typeof STATISTICS_DATA;

type StatisticEntry = {
  key: StatisticKey;
  value: number;
  percent: number;
};

const STATISTICS_LIST: StatisticEntry[] = (Object.entries(STATISTICS_DATA) as [
  StatisticKey,
  (typeof STATISTICS_DATA)[StatisticKey],
][]).map(([key, data]) => ({
  key,
  value: data.value,
  percent: data.percent ?? data.growth_percent ?? 0,
}));

const getTrendStyles = (value: number): { color: ChipProps['color']; icon: string } => {
  if (value > 0) {
    return {
      color: 'success',
      icon: 'material-symbols:trending-up-rounded',
    };
  }

  if (value < 0) {
    return {
      color: 'error',
      icon: 'material-symbols:trending-down-rounded',
    };
  }

  return {
    color: 'neutral',
    icon: 'material-symbols:trending-flat-rounded',
  };
};

const StatisticsSection = () => {
  const { t } = useTranslation();

  const valueFormatter = useMemo(
    () =>
      new Intl.NumberFormat(undefined, {
        maximumFractionDigits: 0,
      }),
    [],
  );

  const percentFormatter = useMemo(
    () =>
      new Intl.NumberFormat(undefined, {
        minimumFractionDigits: 1,
        maximumFractionDigits: 1,
        signDisplay: 'always',
      }),
    [],
  );

  return (
    <Stack spacing={3} sx={{ height: 1 }}>
      <Typography variant="h5" sx={{ fontWeight: 600 }}>
        {t('homePage.statistics.title')}
      </Typography>

      <Grid container spacing={3}>
        {STATISTICS_LIST.map(({ key, value, percent }) => {
          const { color, icon } = getTrendStyles(percent);

          return (
            <Grid key={key} size={{ xs: 12, sm: 6 }}>
              <Paper
                background={1}
                component={Stack}
                direction="column"
                sx={{
                  p: { xs: 3, md: 4 },
                  pt: { xs: 2.5, md: 3.5 },
                  height: 1,
                }}
              >
                <Stack direction="column" spacing={0.5}>
                  <Typography variant="subtitle2" sx={{ color: 'text.secondary', fontWeight: 600 }}>
                    {t(`homePage.statistics.cards.${key}`)}
                  </Typography>

                  <Stack
                    direction={{ xs: 'column', sm: 'row', md: 'column', xl: 'row' }}
                    sx={{
                      gap: 1,
                      alignItems: { xs: 'flex-start', sm: 'baseline', md: 'flex-start', xl: 'baseline' },
                    }}
                  >
                    <Typography variant="h4" sx={{ fontWeight: 600 }}>
                      {valueFormatter.format(value)}
                    </Typography>
                    <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                      {t('homePage.statistics.subtitle')}
                    </Typography>
                  </Stack>
                </Stack>

                <Stack
                  direction={{ xs: 'column', sm: 'row', md: 'column', xl: 'row' }}
                  sx={{
                    mt: 'auto',
                    gap: 1,
                    alignItems: { xs: 'flex-start' },
                  }}
                >
                  <Chip
                    label={`${percentFormatter.format(percent)}%`}
                    color={color}
                    icon={<IconifyIcon icon={icon} />}
                    sx={{ flexDirection: 'row-reverse' }}
                  />
                  <Typography variant="subtitle2" sx={{ color: 'text.secondary' }}>
                    {t('homePage.statistics.changeLabel')}
                  </Typography>
                </Stack>
              </Paper>
            </Grid>
          );
        })}
      </Grid>
    </Stack>
  );
};

export default StatisticsSection;

import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { Paper } from '@mui/material';
import Chip, { ChipProps } from '@mui/material/Chip';
import Grid from '@mui/material/Grid';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import IconifyIcon from 'shared/components/base/IconifyIcon';

const STATISTICS_DATA = {
  users: {
    value: 8548,
    percent: 9.6,
  },
  problems: {
    value: 1951,
    percent: -8.4,
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

const STATISTICS_LIST: StatisticEntry[] = (
  Object.entries(STATISTICS_DATA) as [StatisticKey, (typeof STATISTICS_DATA)[StatisticKey]][]
).map(([key, data]) => ({
  key,
  value: data.value,
  percent: data.percent ?? 0,
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
    <Stack>
      {STATISTICS_LIST.map(({ key, value, percent }) => {
        const { color, icon } = getTrendStyles(percent);

        return (
          <Grid size={{ xs: 12, sm: 6, md: 3 }}>
            <Paper sx={{ p: 4 }}>
              <Stack spacing={2} direction="column">
                <Stack direction="column" spacing={0.5}>
                  <Stack
                    direction={{ xs: 'column', sm: 'row', md: 'column', xl: 'row' }}
                    sx={{
                      gap: 1,
                      alignItems: {
                        xs: 'flex-start',
                        sm: 'baseline',
                        md: 'flex-start',
                        xl: 'baseline',
                      },
                    }}
                  >
                    <Typography variant="h4" sx={{ fontWeight: 600 }}>
                      {valueFormatter.format(value)}
                    </Typography>
                    <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                      {t(`homePage.statistics.cards.${key}`)}
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
              </Stack>
            </Paper>
          </Grid>
        );
      })}
    </Stack>
  );
};

export default StatisticsSection;

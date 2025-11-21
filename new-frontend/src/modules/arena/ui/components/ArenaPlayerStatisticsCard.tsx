import { Card, CardContent, Chip, Divider, Stack, Typography } from '@mui/material';
import IconifyIcon from 'shared/components/base/IconifyIcon.tsx';
import { useTranslation } from 'react-i18next';
import { ArenaPlayerStatistics } from '../../domain/entities/arena-player-statistics.entity.ts';

interface ArenaPlayerStatisticsCardProps {
  statistics?: ArenaPlayerStatistics;
}

const StatisticItem = ({ label, value }: { label: string; value: string | number }) => (
  <Stack direction="column" spacing={0.5}>
    <Typography variant="caption" color="text.secondary">
      {label}
    </Typography>
    <Typography fontWeight={800}>{value}</Typography>
  </Stack>
);

const ArenaPlayerStatisticsCard = ({ statistics }: ArenaPlayerStatisticsCardProps) => {
  const { t } = useTranslation();

  if (!statistics) {
    return (
      <Card sx={{ borderRadius: 3 }}>
        <CardContent>
          <Typography variant="body2" color="text.secondary">
            {t('arena.selectPlayer')}
          </Typography>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card sx={{ outline: 'none', borderRadius: 3 }} background={1}>
      <CardContent sx={{ p: 3 }}>
        <Stack direction="column" spacing={2}>
          <Stack direction="row" spacing={1.5} alignItems="center" justifyContent="space-between">
            <Stack direction="column" spacing={0.25}>
              <Typography variant="overline" color="text.secondary">
                {t('arena.playerStatistics')}
              </Typography>
              <Typography variant="h6" fontWeight={800}>
                {statistics.username}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {statistics.rankTitle}
              </Typography>
            </Stack>
            <Chip
              color="warning"
              variant="soft"
              icon={<IconifyIcon icon="mdi:chart-line" fontSize={18} />}
              label={`${statistics.performance}`}
            />
          </Stack>

          <Divider />

          <Stack direction="row" spacing={2} flexWrap="wrap">
            <StatisticItem label={t('arena.statisticsLabels.challenges')} value={statistics.challenges} />
            <StatisticItem label={t('arena.statisticsLabels.wins')} value={statistics.wins} />
            <StatisticItem label={t('arena.statisticsLabels.draws')} value={statistics.draws} />
            <StatisticItem label={t('arena.statisticsLabels.losses')} value={statistics.losses} />
            <StatisticItem label={t('arena.statisticsLabels.winRate')} value={`${statistics.winRate}%`} />
            <StatisticItem label={t('arena.statisticsLabels.drawRate')} value={`${statistics.drawRate}%`} />
            <StatisticItem label={t('arena.statisticsLabels.lossRate')} value={`${statistics.lossRate}%`} />
          </Stack>

          {statistics.opponents?.length ? (
            <Stack direction="column" spacing={1}>
              <Divider />
              <Typography variant="subtitle2" color="text.secondary">
                {t('arena.opponents')}
              </Typography>
              <Stack direction="row" spacing={1} flexWrap="wrap">
                {statistics.opponents.map((opponent) => (
                  <Chip
                    key={`${statistics.username}-${opponent.username}`}
                    label={`${opponent.username}: ${opponent.result}`}
                    variant="outlined"
                    color={opponent.result > 0 ? 'success' : opponent.result === 0 ? 'default' : 'error'}
                  />
                ))}
              </Stack>
            </Stack>
          ) : null}
        </Stack>
      </CardContent>
    </Card>
  );
};

export default ArenaPlayerStatisticsCard;

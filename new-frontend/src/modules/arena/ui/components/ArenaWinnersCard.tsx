import { Card, CardContent, Grid2 as Grid, Stack, Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';
import IconifyIcon from 'shared/components/base/IconifyIcon.tsx';
import { ArenaPlayerStatistics } from '../../domain/entities/arena-player-statistics.entity.ts';

interface ArenaWinnersCardProps {
  topPlayers?: ArenaPlayerStatistics[];
}

const placeIcon = ['mdi:trophy', 'mdi:trophy-outline', 'mdi:trophy-variant-outline'];
const placeColor = ['warning.main', 'info.main', 'success.main'];

const ArenaWinnersCard = ({ topPlayers }: ArenaWinnersCardProps) => {
  const { t } = useTranslation();

  if (!topPlayers || topPlayers.length === 0) return null;

  return (
    <Card sx={{ borderRadius: 3 }}>
      <CardContent sx={{ p: 3 }}>
        <Stack spacing={2}>
          <Typography variant="h6" fontWeight={800}>
            {t('arena.winners')}
          </Typography>
          <Grid container spacing={2}>
            {topPlayers.slice(0, 3).map((player, index) => (
              <Grid key={player.username} size={{ xs: 12, md: 4 }}>
                <Stack spacing={1.5} alignItems="center" textAlign="center">
                  <IconifyIcon icon={placeIcon[index]} fontSize={36} color={placeColor[index]} />
                  <Typography variant="subtitle1" fontWeight={800}>
                    {player.username}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {player.rankTitle}
                  </Typography>
                  <Stack direction="row" spacing={1}>
                    <Typography variant="caption" color="text.secondary">
                      {t('arena.statisticsLabels.wins')}: {player.wins}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      {t('arena.statisticsLabels.draws')}: {player.draws}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      {t('arena.statisticsLabels.losses')}: {player.losses}
                    </Typography>
                  </Stack>
                </Stack>
              </Grid>
            ))}
          </Grid>
        </Stack>
      </CardContent>
    </Card>
  );
};

export default ArenaWinnersCard;

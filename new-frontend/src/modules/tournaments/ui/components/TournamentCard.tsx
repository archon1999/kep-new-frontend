import { Card, CardActionArea, CardContent, Chip, Stack, Typography } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { getResourceById, resources } from 'app/routes/resources';
import IconifyIcon from 'shared/components/base/IconifyIcon';
import { TournamentListItem } from '../../domain/entities/tournament.entity';

interface TournamentCardProps {
  tournament: TournamentListItem;
}

const TournamentCard = ({ tournament }: TournamentCardProps) => {
  const { t } = useTranslation();

  return (
    <Card background={1} sx={{ borderRadius: 3, height: '100%' }}>
      <CardActionArea
        component={RouterLink}
        to={getResourceById(resources.Tournament, tournament.id)}
        sx={{ height: '100%' }}
      >
        <CardContent>
          <Stack direction="column" spacing={1.5} height="100%">
            <Stack direction="row" spacing={1} alignItems="center" justifyContent="space-between">
              <Typography variant="subtitle1" fontWeight={700} noWrap>
                {tournament.title}
              </Typography>
              <IconifyIcon icon="mdi:medal-outline" />
            </Stack>

            <Stack direction="row" spacing={1} alignItems="center" flexWrap="wrap" rowGap={0.5}>
              <Chip size="small" label={t(`tournaments.type.${tournament.type}`)} color="primary" />
              <Chip
                size="small"
                variant="outlined"
                label={t('tournaments.playersCount', { count: tournament.playersCount })}
              />
            </Stack>

            <Stack direction="row" spacing={1} alignItems="center">
              <IconifyIcon icon="mdi:calendar-clock" />
              <Typography variant="body2" color="text.secondary">
                {tournament.startTime}
              </Typography>
            </Stack>
          </Stack>
        </CardContent>
      </CardActionArea>
    </Card>
  );
};

export default TournamentCard;

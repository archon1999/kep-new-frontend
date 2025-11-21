import { useTranslation } from 'react-i18next';
import { Link as RouterLink } from 'react-router';
import { Card, CardActionArea, CardContent, Chip, Stack, Typography } from '@mui/material';
import dayjs from 'dayjs';
import IconifyIcon from 'shared/components/base/IconifyIcon.tsx';
import paths from 'app/routes/paths.ts';
import { TournamentListItem } from '../../domain/entities/tournament.entity';

interface TournamentCardProps {
  tournament: TournamentListItem;
}

const TournamentCard = ({ tournament }: TournamentCardProps) => {
  const { t } = useTranslation();

  const startLabel = dayjs(tournament.startTime).format('DD.MM.YYYY HH:mm');

  return (
    <Card background={1} sx={{ borderRadius: 3 }}>
      <CardActionArea component={RouterLink} to={`${paths.tournaments}/tournament/${tournament.id}`} sx={{ height: '100%' }}>
        <CardContent sx={{ p: 3 }}>
          <Stack direction="row" justifyContent="space-between" alignItems="flex-start" spacing={2}>
            <Stack direction="column" spacing={1}>
              <Stack direction="row" alignItems="center" spacing={1}>
                <IconifyIcon icon="mdi:tournament" color="primary.main" fontSize={28} />
                <Typography variant="h6" fontWeight={800} color="text.primary">
                  {tournament.title}
                </Typography>
              </Stack>

              <Typography variant="body2" color="text.secondary">
                {tournament.description}
              </Typography>

              <Stack direction="row" spacing={1} alignItems="center" flexWrap="wrap" rowGap={1}>
                <Chip
                  color="primary"
                  size="small"
                  variant="soft"
                  label={t('tournaments.playersCount', { count: tournament.playersCount })}
                />
                <Chip
                  color="default"
                  size="small"
                  variant="outlined"
                  icon={<IconifyIcon icon="mdi:calendar-clock" fontSize={16} />}
                  label={t('tournaments.startsAt', { date: startLabel })}
                />
              </Stack>
            </Stack>

            <Stack direction="column" alignItems="flex-end" spacing={1}>
              <Chip
                color="secondary"
                size="small"
                variant="outlined"
                icon={<IconifyIcon icon="mdi:chess-knight" fontSize={16} />}
                label={tournament.type}
              />
            </Stack>
          </Stack>
        </CardContent>
      </CardActionArea>
    </Card>
  );
};

export default TournamentCard;

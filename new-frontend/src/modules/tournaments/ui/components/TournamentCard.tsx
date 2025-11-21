import { Card, CardContent, Chip, Stack, Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { Link as RouterLink } from 'react-router-dom';
import dayjs from 'dayjs';
import paths from 'app/routes/paths';
import { TournamentListItem } from '../../domain/entities/tournament.entity';

interface Props {
  tournament: TournamentListItem;
}

const TournamentCard = ({ tournament }: Props) => {
  const { t } = useTranslation();

  return (
    <Card component={RouterLink} to={paths.tournament.replace(':id', String(tournament.id))} sx={{ textDecoration: 'none' }}>
      <CardContent sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
        <Stack direction="row" spacing={1} alignItems="center" flexWrap="wrap" rowGap={0.5}>
          <Typography variant="h6" fontWeight={800}>
            {tournament.title}
          </Typography>
          <Chip label={tournament.type} size="small" variant="outlined" />
        </Stack>
        <Typography variant="body2" color="text.secondary">
          {t('tournaments.startsAt', { time: dayjs(tournament.startTime).format('MMM D, YYYY HH:mm') })}
        </Typography>
        <Stack direction="row" spacing={1} alignItems="center">
          <Chip label={t('tournaments.playersCount', { count: tournament.playersCount })} size="small" />
        </Stack>
      </CardContent>
    </Card>
  );
};

export default TournamentCard;

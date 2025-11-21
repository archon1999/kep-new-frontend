import dayjs from 'dayjs';
import { Avatar, Card, CardActionArea, CardContent, Chip, Stack, Typography } from '@mui/material';
import { Link as RouterLink } from 'react-router';
import { useTranslation } from 'react-i18next';
import { getResourceById, resources } from 'app/routes/resources';
import IconifyIcon from 'shared/components/base/IconifyIcon';
import { TournamentListItem } from '../../domain/entities/tournament.entity';

interface TournamentCardProps {
  tournament: TournamentListItem;
}

const TournamentCard = ({ tournament }: TournamentCardProps) => {
  const { t } = useTranslation();
  const startTime = tournament.startTime ? dayjs(tournament.startTime) : null;

  return (
    <Card
      background={1}
      sx={{
        borderRadius: 3,
        height: 1,
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      <CardActionArea
        component={RouterLink}
        to={getResourceById(resources.Tournament, tournament.id)}
        sx={{ height: 1, display: 'flex', flexDirection: 'column', alignItems: 'stretch' }}
      >
        <CardContent sx={{ display: 'flex', flexDirection: 'column', gap: 2, flex: 1 }}>
          <Stack direction="row" spacing={2} alignItems="center">
            <Avatar sx={{ bgcolor: 'primary.main', color: 'primary.contrastText', fontWeight: 800 }}>
              {tournament.title.charAt(0)}
            </Avatar>
            <Stack spacing={0.5} flex={1} minWidth={0}>
              <Typography variant="h6" fontWeight={800} noWrap>
                {tournament.title}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {startTime ? t('tournaments.starts', { date: startTime.format('DD MMM, HH:mm') }) : t('tournaments.tbd')}
              </Typography>
            </Stack>
            <Chip
              color="primary"
              size="small"
              label={t('tournaments.playersCount', { count: tournament.playersCount })}
            />
          </Stack>

          <Stack direction="row" spacing={2} flexWrap="wrap">
            <Stack direction="row" spacing={1} alignItems="center">
              <IconifyIcon icon="mdi:tournament" width={18} />
              <Typography variant="body2" color="text.secondary">
                {t('tournaments.type', { type: tournament.type })}
              </Typography>
            </Stack>
          </Stack>
        </CardContent>
      </CardActionArea>
    </Card>
  );
};

export default TournamentCard;

import { useTranslation } from 'react-i18next';
import { Link as RouterLink } from 'react-router';
import { Card, CardActionArea, CardContent, Chip, Stack, Typography } from '@mui/material';
import dayjs from 'dayjs';
import paths from 'app/routes/paths.ts';
import IconifyIcon from 'shared/components/base/IconifyIcon.tsx';
import { TournamentListItem } from '../../domain/entities/tournament.entity';

interface TournamentListCardProps {
  tournament: TournamentListItem;
}

const TournamentListCard = ({ tournament }: TournamentListCardProps) => {
  const { t } = useTranslation();

  return (
    <Card background={1} sx={{ borderRadius: 3 }}>
      <CardActionArea component={RouterLink} to={`${paths.tournaments}/tournament/${tournament.id}`}>
        <CardContent sx={{ p: 3 }}>
          <Stack direction="column" spacing={1.5}>
            <Stack direction="row" alignItems="center" spacing={1}>
              <IconifyIcon icon="mdi:medal-outline" color="warning.main" fontSize={28} />
              <Typography variant="h6" fontWeight={800} color="text.primary">
                {tournament.title}
              </Typography>
            </Stack>

            <Stack direction="row" spacing={1} alignItems="center" flexWrap="wrap">
              <Chip
                size="small"
                color="warning"
                variant="outlined"
                icon={<IconifyIcon icon="mdi:calendar" fontSize={16} />}
                label={dayjs(tournament.startTime).format('DD MMM, HH:mm')}
              />
              <Chip
                size="small"
                color="primary"
                variant="soft"
                icon={<IconifyIcon icon="mdi:account-group" fontSize={16} />}
                label={t('tournaments.playersLabel', { count: tournament.playersCount })}
              />
              <Chip
                size="small"
                color="default"
                variant="soft"
                icon={<IconifyIcon icon="mdi:medal" fontSize={16} />}
                label={t('tournaments.typeLabel', { type: tournament.type })}
              />
            </Stack>
          </Stack>
        </CardContent>
      </CardActionArea>
    </Card>
  );
};

export default TournamentListCard;

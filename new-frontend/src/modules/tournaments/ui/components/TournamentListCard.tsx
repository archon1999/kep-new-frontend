import { Card, CardContent, Chip, Stack, Typography, Button, Box } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import IconifyIcon from 'shared/components/base/IconifyIcon';
import { TournamentSummary } from '../../domain/entities/tournament.entity';
import { getResourceById, resources } from 'app/routes/resources';

interface TournamentListCardProps {
  tournament: TournamentSummary;
}

const TournamentListCard = ({ tournament }: TournamentListCardProps) => {
  const { t } = useTranslation();

  return (
    <Card background={1} sx={{ borderRadius: 3, outline: 'none' }}>
      <CardContent>
        <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} alignItems="center">
          <Box
            sx={{
              width: 72,
              height: 72,
              borderRadius: 2,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              bgcolor: 'background.neutral',
            }}
          >
            <IconifyIcon icon="mdi:tournament" width={36} height={36} />
          </Box>

          <Stack direction="column" spacing={1} flex={1} width="100%">
            <Stack direction="row" spacing={1} alignItems="center" flexWrap="wrap" rowGap={0.5}>
              <Typography variant="h6" fontWeight={800} noWrap>
                {tournament.title}
              </Typography>
              <Chip label={tournament.type} size="small" color="primary" />
              <Chip
                label={t('tournaments.playersCount', { count: tournament.playersCount })}
                size="small"
                variant="outlined"
              />
            </Stack>

            <Stack direction="row" spacing={1} alignItems="center" flexWrap="wrap" rowGap={0.5}>
              <IconifyIcon icon="mdi:calendar-clock" />
              <Typography variant="body2" color="text.secondary">
                {tournament.startTime}
              </Typography>
            </Stack>
          </Stack>

          <Button
            component={RouterLink}
            to={getResourceById(resources.Tournament, tournament.id)}
            variant="contained"
            color="primary"
            sx={{ whiteSpace: 'nowrap' }}
          >
            {t('tournaments.viewDetails')}
          </Button>
        </Stack>
      </CardContent>
    </Card>
  );
};

export default TournamentListCard;

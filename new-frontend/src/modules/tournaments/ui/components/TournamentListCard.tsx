import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { Box, Card, CardActionArea, Chip, Stack, Typography } from '@mui/material';
import dayjs from 'dayjs';
import KepIcon from 'shared/components/base/KepIcon.tsx';
import { getResourceById, resources } from 'app/routes/resources.ts';
import { TournamentListItem } from '../../domain/entities/tournament.entity.ts';
import { Link as RouterLink } from 'react-router-dom';

interface TournamentListCardProps {
  tournament: TournamentListItem;
}

const TournamentListCard = ({ tournament }: TournamentListCardProps) => {
  const { t } = useTranslation();

  const startDate = useMemo(
    () => dayjs(tournament.startTime).format('MMM DD, YYYY'),
    [tournament.startTime],
  );

  const detailLink = getResourceById(resources.Tournament, tournament.id);

  return (
    <CardActionArea component={RouterLink} to={detailLink} sx={{ borderRadius: 3 }}>
      <Card sx={{ borderRadius: 3, p: 3 }}>
        <Stack direction="row" spacing={3} alignItems="center">
          <Box
            sx={{
              width: 72,
              height: 72,
              borderRadius: 2,
              bgcolor: 'primary.lighter',
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'primary.main',
            }}
          >
            <KepIcon icon="tournament" size="medium" />
          </Box>

          <Stack spacing={1} flex={1} minWidth={0}>
            <Typography variant="h6" fontWeight={800} noWrap>
              {tournament.title}
            </Typography>
            <Stack direction="row" spacing={1} alignItems="center" flexWrap="wrap">
              <Chip label={startDate} size="small" color="primary" />
              <Chip label={t('tournaments.playersCount', { count: tournament.playersCount })} size="small" variant="outlined" />
            </Stack>
          </Stack>
        </Stack>
      </Card>
    </CardActionArea>
  );
};

export default TournamentListCard;

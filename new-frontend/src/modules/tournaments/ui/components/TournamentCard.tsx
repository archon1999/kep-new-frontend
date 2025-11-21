import { useMemo } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import dayjs from 'dayjs';
import { Box, Chip, Link, Stack, Typography } from '@mui/material';
import { TournamentListItem } from '../../domain/entities/tournament.entity';
import paths from 'app/routes/paths';

interface Props {
  tournament: TournamentListItem;
}

const TournamentCard = ({ tournament }: Props) => {
  const startDate = useMemo(
    () => dayjs(tournament.startTime).format('MMM DD, YYYY HH:mm'),
    [tournament.startTime],
  );

  return (
    <Box
      sx={{
        borderRadius: 3,
        border: (theme) => `1px solid ${theme.palette.divider}`,
        p: 3,
        background: (theme) => theme.palette.background.paper,
      }}
    >
      <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} justifyContent="space-between" alignItems="flex-start">
        <Stack spacing={1}>
          <Link
            component={RouterLink}
            to={paths.tournament.replace(':id', String(tournament.id))}
            color="text.primary"
            underline="hover"
            variant="h6"
            fontWeight={800}
          >
            {tournament.title}
          </Link>
          <Typography variant="body2" color="text.secondary">
            {startDate}
          </Typography>
        </Stack>

        <Stack direction="row" spacing={1} alignItems="center">
          <Chip label={tournament.type} color="info" variant="outlined" />
          <Chip label={`${tournament.playersCount}`} color="primary" />
        </Stack>
      </Stack>
    </Box>
  );
};

export default TournamentCard;

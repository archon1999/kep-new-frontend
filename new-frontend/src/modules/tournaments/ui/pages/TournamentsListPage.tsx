import { Box, Grid, Skeleton, Stack, Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { responsivePagePaddingSx } from 'shared/lib/styles';
import { useTournamentsList } from '../../application/queries';
import TournamentCard from '../components/TournamentCard';

const TournamentsListPage = () => {
  const { t } = useTranslation();
  const { data, isLoading } = useTournamentsList();

  const tournaments = data?.data ?? [];
  const showEmptyState = !isLoading && tournaments.length === 0;

  return (
    <Box sx={responsivePagePaddingSx}>
      <Stack direction="column" spacing={3}>
        <Stack direction="column" spacing={1}>
          <Typography variant="h4" fontWeight={800}>
            {t('menu.tournaments')}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {t('tournaments.subtitle')}
          </Typography>
        </Stack>

        {showEmptyState ? (
          <Box
            sx={{
              py: 6,
              px: 3,
              borderRadius: 3,
              bgcolor: 'background.paper',
              textAlign: 'center',
            }}
          >
            <Typography variant="subtitle1" fontWeight={700}>
              {t('tournaments.emptyTitle')}
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
              {t('tournaments.emptySubtitle')}
            </Typography>
          </Box>
        ) : (
          <Grid container spacing={3}>
            {isLoading
              ? Array.from({ length: 3 }).map((_, idx) => (
                <Grid size={{ xs: 12, md: 6 }} key={idx}>
                  <Skeleton variant="rounded" height={160} />
                </Grid>
              ))
              : tournaments.map((tournament) => (
                <Grid size={{ xs: 12, md: 6 }} key={tournament.id}>
                  <TournamentCard tournament={tournament} />
                </Grid>
              ))}
          </Grid>
        )}
      </Stack>
    </Box>
  );
};

export default TournamentsListPage;

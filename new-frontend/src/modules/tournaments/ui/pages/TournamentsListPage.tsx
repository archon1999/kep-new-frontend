import { Box, Grid, Skeleton, Stack, Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { responsivePagePaddingSx } from 'shared/lib/styles';
import { useTournamentsList } from '../../application/queries';
import TournamentCard from '../components/TournamentCard';

const TournamentsListPage = () => {
  const { t } = useTranslation();
  const { data, isLoading } = useTournamentsList();

  return (
    <Box sx={responsivePagePaddingSx}>
      <Stack direction="column" spacing={3}>
        <Stack direction="column" spacing={1}>
          <Typography variant="h4" fontWeight={800}>
            {t('tournaments.title')}
          </Typography>
          <Typography variant="body1" color="text.secondary">
            {t('tournaments.subtitle')}
          </Typography>
        </Stack>

        <Grid container spacing={3}>
          {isLoading
            ? Array.from({ length: 6 }).map((_, index) => (
                <Grid item xs={12} sm={6} md={4} key={`skeleton-${index}`}>
                  <Skeleton variant="rounded" height={140} />
                </Grid>
              ))
            : (data?.data ?? []).map((tournament) => (
                <Grid item xs={12} sm={6} md={4} key={tournament.id}>
                  <TournamentCard tournament={tournament} />
                </Grid>
              ))}

          {!isLoading && (data?.data?.length ?? 0) === 0 ? (
            <Grid item xs={12}>
              <Stack direction="column" spacing={1} alignItems="center" textAlign="center">
                <Typography variant="h6" fontWeight={700}>
                  {t('tournaments.emptyTitle')}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {t('tournaments.emptySubtitle')}
                </Typography>
              </Stack>
            </Grid>
          ) : null}
        </Grid>
      </Stack>
    </Box>
  );
};

export default TournamentsListPage;

import { useTranslation } from 'react-i18next';
import { Box, Chip, Grid, Skeleton, Stack, Typography } from '@mui/material';
import TournamentCard from '../components/TournamentCard';
import { useTournamentsList } from '../../application/queries';
import { responsivePagePaddingSx } from 'shared/lib/styles';

const TournamentsListPage = () => {
  const { t } = useTranslation();
  const { data: pageResult, isLoading } = useTournamentsList();

  const tournaments = pageResult?.data ?? [];
  const showEmpty = !isLoading && tournaments.length === 0;

  return (
    <Box sx={responsivePagePaddingSx}>
      <Stack direction="column" spacing={3}>
        <Stack direction="row" spacing={2} alignItems="center" flexWrap="wrap" rowGap={1}>
          <Box>
            <Typography variant="h4" fontWeight={800} sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              {t('menu.tournaments')}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {t('tournaments.subtitle')}
            </Typography>
          </Box>

          {pageResult ? (
            <Chip label={t('tournaments.countLabel', { count: pageResult.total ?? tournaments.length })} />
          ) : null}
        </Stack>

        {showEmpty ? (
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
                <Grid size={12} key={idx}>
                  <Skeleton variant="rounded" height={180} />
                </Grid>
              ))
              : tournaments.map((tournament) => (
                <Grid size={{ xs: 12, md: 6, lg: 4 }} key={tournament.id}>
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

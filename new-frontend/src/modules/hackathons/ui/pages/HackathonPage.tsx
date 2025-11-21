import { Box, Grid2 as Grid, Paper, Stack, Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { useParams } from 'react-router-dom';
import PageLoader from 'shared/components/loading/PageLoader';
import HackathonHeader from '../components/HackathonHeader';
import HackathonTabs from '../components/HackathonTabs';
import { useHackathon } from '../../application/queries';

const HackathonPage = () => {
  const { id } = useParams();
  const { t } = useTranslation();
  const { data: hackathon, isLoading, mutate } = useHackathon(id);

  if (isLoading || !hackathon) {
    return <PageLoader />;
  }

  return (
    <Box sx={{ p: { xs: 3, md: 5 }, display: 'flex', flexDirection: 'column', gap: 3 }}>
      <HackathonTabs hackathon={hackathon} />
      <HackathonHeader hackathon={hackathon} onRefresh={() => mutate()} />

      <Grid container spacing={3}>
        <Grid size={{ xs: 12, md: 8 }}>
          <Paper sx={{ p: 3, borderRadius: 3, height: 1 }}>
            <Stack spacing={2}>
              <Typography variant="h5" fontWeight={800}>
                {t('hackathons.about')}
              </Typography>
              <Typography variant="body1" color="text.secondary">
                {hackathon.description || t('hackathons.noDescription')}
              </Typography>
            </Stack>
          </Paper>
        </Grid>
        <Grid size={{ xs: 12, md: 4 }}>
          <Paper sx={{ p: 3, borderRadius: 3 }}>
            <Stack spacing={1.5}>
              <Typography variant="subtitle1" fontWeight={800}>
                {t('hackathons.quickStats')}
              </Typography>
              <Stack direction="row" justifyContent="space-between">
                <Typography color="text.secondary">{t('hackathons.projects')}</Typography>
                <Typography fontWeight={800}>{hackathon.projectsCount ?? 0}</Typography>
              </Stack>
              <Stack direction="row" justifyContent="space-between">
                <Typography color="text.secondary">{t('hackathons.participants')}</Typography>
                <Typography fontWeight={800}>{hackathon.participantsCount ?? 0}</Typography>
              </Stack>
              <Stack direction="row" justifyContent="space-between">
                <Typography color="text.secondary">{t('hackathons.registrants')}</Typography>
                <Typography fontWeight={800}>{hackathon.registrantsCount ?? 0}</Typography>
              </Stack>
            </Stack>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default HackathonPage;

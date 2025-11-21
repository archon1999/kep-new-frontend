import { Box, Grid2 as Grid, Skeleton, Stack, Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';
import HackathonCard from '../components/HackathonCard';
import { useHackathonsList } from '../../application/queries';

const HackathonsListPage = () => {
  const { t } = useTranslation();
  const { data: hackathons, isLoading } = useHackathonsList();

  return (
    <Box sx={{ p: { xs: 3, md: 5 } }}>
      <Stack direction="column" spacing={3}>
        <Stack spacing={1}>
          <Typography variant="h4" fontWeight={900}>
            {t('hackathons.title')}
          </Typography>
          <Typography variant="body1" color="text.secondary">
            {t('hackathons.subtitle')}
          </Typography>
        </Stack>

        <Grid container spacing={3}>
          {isLoading
            ? Array.from({ length: 3 }).map((_, idx) => (
                <Grid size={{ xs: 12, md: 6, lg: 4 }} key={idx}>
                  <Skeleton variant="rounded" height={260} />
                </Grid>
              ))
            : hackathons?.map((hackathon) => (
                <Grid size={{ xs: 12, md: 6, lg: 4 }} key={hackathon.id}>
                  <HackathonCard hackathon={hackathon} />
                </Grid>
              ))}
        </Grid>
      </Stack>
    </Box>
  );
};

export default HackathonsListPage;

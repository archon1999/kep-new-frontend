import { Box, Grid2 as Grid, Skeleton, Stack, Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';
import HackathonCard from '../components/HackathonCard';
import { useHackathonsList } from '../../application/queries';

const HackathonsListPage = () => {
  const { t } = useTranslation();
  const { data, isLoading } = useHackathonsList();

  const showEmpty = !isLoading && (data?.data.length ?? 0) === 0;

  return (
    <Box sx={{ p: { xs: 3, md: 5 } }}>
      <Stack spacing={2} sx={{ mb: 3 }}>
        <Typography variant="h4" fontWeight={800}>
          {t('hackathons.title')}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {t('hackathons.subtitle')}
        </Typography>
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
            {t('hackathons.emptyTitle')}
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
            {t('hackathons.emptySubtitle')}
          </Typography>
        </Box>
      ) : (
        <Grid container spacing={3}>
          {isLoading
            ? Array.from({ length: 3 }).map((_, idx) => (
                <Grid size={{ xs: 12, md: 6, lg: 4 }} key={idx}>
                  <Skeleton variant="rounded" height={260} />
                </Grid>
              ))
            : data?.data.map((hackathon) => (
                <Grid size={{ xs: 12, md: 6, lg: 4 }} key={hackathon.id}>
                  <HackathonCard hackathon={hackathon} />
                </Grid>
              ))}
        </Grid>
      )}
    </Box>
  );
};

export default HackathonsListPage;

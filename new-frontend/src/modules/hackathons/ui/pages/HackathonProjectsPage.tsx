import { Box, Grid2 as Grid, Skeleton, Stack, Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { useParams } from 'react-router-dom';
import PageLoader from 'shared/components/loading/PageLoader';
import HackathonTabs from '../components/HackathonTabs';
import HackathonProjectCard from '../components/HackathonProjectCard';
import { useHackathon, useHackathonProjects } from '../../application/queries';

const HackathonProjectsPage = () => {
  const { id } = useParams();
  const { t } = useTranslation();
  const { data: hackathon, isLoading: isLoadingHackathon } = useHackathon(id);
  const { data: projects, isLoading } = useHackathonProjects(id);

  if (isLoadingHackathon || !hackathon) {
    return <PageLoader />;
  }

  return (
    <Box sx={{ p: { xs: 3, md: 5 }, display: 'flex', flexDirection: 'column', gap: 3 }}>
      <HackathonTabs hackathon={hackathon} />
      <Stack direction="column" spacing={2}>
        <Typography variant="h5" fontWeight={800}>
          {t('hackathons.projectsTabTitle', { title: hackathon.title })}
        </Typography>
        <Grid container spacing={3}>
          {isLoading
            ? Array.from({ length: 3 }).map((_, idx) => (
                <Grid size={{ xs: 12, md: 6, lg: 4 }} key={idx}>
                  <Skeleton variant="rounded" height={220} />
                </Grid>
              ))
            : projects?.map((project) => (
                <Grid size={{ xs: 12, md: 6, lg: 4 }} key={project.id}>
                  <HackathonProjectCard hackathonId={hackathon.id} hackathonProject={project} />
                </Grid>
              ))}
        </Grid>
      </Stack>
    </Box>
  );
};

export default HackathonProjectsPage;

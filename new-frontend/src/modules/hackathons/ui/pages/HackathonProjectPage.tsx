import { Box, Grid2 as Grid, Stack } from '@mui/material';
import { useParams } from 'react-router-dom';
import PageLoader from 'shared/components/loading/PageLoader';
import ProjectDescription from 'modules/projects/ui/components/ProjectDescription';
import ProjectSidebar from 'modules/projects/ui/components/ProjectSidebar';
import ProjectAttempts from 'modules/projects/ui/components/ProjectAttempts';
import HackathonTabs from '../components/HackathonTabs';
import { useHackathon, useHackathonProject } from '../../application/queries';

const HackathonProjectPage = () => {
  const { id, symbol } = useParams();
  const { data: hackathon, isLoading: isLoadingHackathon } = useHackathon(id);
  const { data: hackathonProject, isLoading, mutate } = useHackathonProject(id, symbol);

  if (isLoadingHackathon || isLoading || !hackathon || !hackathonProject) {
    return <PageLoader />;
  }

  const { project } = hackathonProject;

  return (
    <Box sx={{ p: { xs: 3, md: 5 }, display: 'flex', flexDirection: 'column', gap: 3 }}>
      <HackathonTabs hackathon={hackathon} />
      <Grid container spacing={3}>
        <Grid size={{ xs: 12, md: 8 }}>
          <Stack spacing={2}>
            <ProjectDescription project={project} />
            <ProjectAttempts project={project} hackathonId={Number(id)} />
          </Stack>
        </Grid>
        <Grid size={{ xs: 12, md: 4 }}>
          <Stack spacing={2}>
            <ProjectSidebar
              project={project}
              hackathonId={Number(id)}
              projectSymbol={hackathonProject.symbol}
              onSubmitted={() => mutate()}
            />
          </Stack>
        </Grid>
      </Grid>
    </Box>
  );
};

export default HackathonProjectPage;

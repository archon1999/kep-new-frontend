import { Box, Grid, Skeleton, Stack } from '@mui/material';
import { useParams } from 'react-router-dom';
import ProjectDescription from 'modules/projects/ui/components/ProjectDescription';
import ProjectSidebar from 'modules/projects/ui/components/ProjectSidebar';
import ProjectAttempts from 'modules/projects/ui/components/ProjectAttempts';
import { useHackathon, useHackathonProject } from '../../application/queries';
import HackathonTabs from '../components/HackathonTabs';
import HackathonCountdownCard from '../components/HackathonCountdownCard';
import { HackathonStatus } from '../../domain/entities/hackathon.entity';

const HackathonProjectPage = () => {
  const { id, symbol } = useParams();
  const hackathonId = id ? Number(id) : undefined;

  const { data: hackathon } = useHackathon(id);
  const { data: hackathonProject, isLoading, mutate } = useHackathonProject(id, symbol);

  const project = hackathonProject?.project;

  return (
    <Box sx={{ p: { xs: 3, md: 5 } }}>
      <Stack direction="column" spacing={3}>
        {hackathon ? <HackathonTabs hackathon={hackathon} /> : <Skeleton variant="rectangular" height={56} />}

        <Grid container spacing={3}>
          <Grid size={{ xs: 12, md: 8 }}>
            {isLoading || !project ? (
              <Skeleton variant="rounded" height={420} />
            ) : (
              <Stack direction="column" spacing={3}>
                <ProjectDescription project={project} />
                <ProjectAttempts project={project} hackathonId={hackathonId} />
              </Stack>
            )}
          </Grid>

          <Grid size={{ xs: 12, md: 4 }}>
            <Stack direction="column" spacing={3}>
              <HackathonCountdownCard hackathon={hackathon} />
              {project && hackathon?.isRegistered && hackathon.status === HackathonStatus.ALREADY ? (
                <ProjectSidebar
                  project={project}
                  hackathonId={hackathonId}
                  projectSymbol={hackathonProject?.symbol}
                  onSubmitted={() => mutate()}
                />
              ) : null}
            </Stack>
          </Grid>
        </Grid>
      </Stack>
    </Box>
  );
};

export default HackathonProjectPage;

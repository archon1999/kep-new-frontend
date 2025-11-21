import { Box, Skeleton, Stack, Typography } from '@mui/material';
import Grid from '@mui/material/Unstable_Grid2';
import { useTranslation } from 'react-i18next';
import ProjectCard from '../components/ProjectCard.tsx';
import { useProjectsList } from '../../application/queries';

const ProjectsListPage = () => {
  const { t } = useTranslation();
  const { data: projects, isLoading } = useProjectsList();

  const showEmptyState = !isLoading && (!projects || projects.length === 0);

  return (
    <Box sx={{ p: { xs: 3, md: 5 } }}>
      <Stack spacing={3}>
        <Box>
          <Typography variant="h4" fontWeight={800}>
            {t('projects.title')}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {t('projects.subtitle')}
          </Typography>
        </Box>

        {showEmptyState ? (
          <Box
            sx={{
              py: 6,
              px: 3,
              borderRadius: 3,
              border: (theme) => `1px dashed ${theme.palette.divider}`,
              bgcolor: 'background.paper',
              textAlign: 'center',
            }}
          >
            <Typography variant="subtitle1" fontWeight={700}>
              {t('projects.emptyTitle')}
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
              {t('projects.emptySubtitle')}
            </Typography>
          </Box>
        ) : (
          <Grid container spacing={3}>
            {isLoading
              ? Array.from({ length: 3 }).map((_, idx) => (
                  <Grid size={{ xs: 12, md: 6, lg: 4 }} key={idx}>
                    <Skeleton variant="rounded" height={240} />
                  </Grid>
                ))
              : projects?.map((project) => (
                  <Grid size={{ xs: 12, md: 6, lg: 4 }} key={project.id}>
                    <ProjectCard project={project} />
                  </Grid>
                ))}
          </Grid>
        )}
      </Stack>
    </Box>
  );
};

export default ProjectsListPage;

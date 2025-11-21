import { useMemo, useState } from 'react';
import { Box, CircularProgress, Tab, Tabs, Typography } from '@mui/material';
import Grid from '@mui/material/Unstable_Grid2';
import { useParams } from 'react-router';
import { useTranslation } from 'react-i18next';
import { useProjectDetails } from '../../application/queries';
import ProjectDescription from '../components/ProjectDescription.tsx';
import ProjectAttempts from '../components/ProjectAttempts.tsx';
import ProjectSidebar from '../components/ProjectSidebar.tsx';

const ProjectDetailPage = () => {
  const { slug } = useParams<{ slug: string }>();
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState(0);
  const { data: project, isLoading, mutate } = useProjectDetails(slug);

  const tabs = useMemo(
    () => [
      { label: t('projects.projectTab'), value: 0 },
      { label: t('projects.attempts'), value: 1 },
    ],
    [t],
  );

  const handleSubmitted = () => {
    setActiveTab(1);
    mutate();
  };

  if (isLoading || !project) {
    return (
      <Box sx={{ p: { xs: 3, md: 5 }, display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: 320 }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ p: { xs: 3, md: 5 } }}>
      <Grid container spacing={3}>
        <Grid size={{ xs: 12, lg: 8 }}>
          <Box sx={{ bgcolor: 'background.paper', borderRadius: 3, p: { xs: 2, md: 3 }, border: (theme) => `1px solid ${theme.palette.divider}` }}>
            <Tabs
              value={activeTab}
              onChange={(_, value) => setActiveTab(value)}
              variant="scrollable"
              allowScrollButtonsMobile
              sx={{ borderBottom: (theme) => `1px solid ${theme.palette.divider}` }}
            >
              {tabs.map((tab) => (
                <Tab key={tab.value} label={tab.label} value={tab.value} />
              ))}
            </Tabs>

            <Box sx={{ mt: 3 }}>
              {activeTab === 0 && <ProjectDescription project={project} />}
              {activeTab === 1 && <ProjectAttempts project={project} />}
            </Box>
          </Box>
        </Grid>

        <Grid size={{ xs: 12, lg: 4 }}>
          <Typography variant="h6" fontWeight={800} sx={{ mb: 2 }}>
            {t('projects.sidebarTitle')}
          </Typography>
          <ProjectSidebar project={project} onSubmitted={handleSubmitted} />
        </Grid>
      </Grid>
    </Box>
  );
};

export default ProjectDetailPage;

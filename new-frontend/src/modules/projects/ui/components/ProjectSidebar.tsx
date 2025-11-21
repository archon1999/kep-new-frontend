import { ChangeEvent, useMemo, useState } from 'react';
import { Box, Button, Card, CardActions, CardContent, CardHeader, MenuItem, Stack, TextField, Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { useSnackbar } from 'notistack';
import ProjectInfoCard from './ProjectInfoCard.tsx';
import { Project } from '../../domain/entities/project.entity';
import { projectsQueries } from '../../application/queries';

interface ProjectSidebarProps {
  project: Project;
  onSubmitted?: () => void;
  hackathonId?: number;
  projectSymbol?: string;
}

const MAX_FILE_SIZE = 1024 * 1024; // 1 MB

const ProjectSidebar = ({ project, onSubmitted, hackathonId, projectSymbol }: ProjectSidebarProps) => {
  const { t } = useTranslation();
  const { enqueueSnackbar } = useSnackbar();
  const [selectedTechnology, setSelectedTechnology] = useState(project.availableTechnologies[0]?.technology ?? '');
  const [file, setFile] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const technologyOptions = useMemo(() => project.availableTechnologies.map((tech) => tech.technology), [project.availableTechnologies]);

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const uploadedFile = event.target.files?.[0];

    if (!uploadedFile) return;

    if (uploadedFile.size > MAX_FILE_SIZE) {
      enqueueSnackbar(t('projects.maxFileSize'), { variant: 'error' });
      return;
    }

    setFile(uploadedFile);
  };

  const handleSubmit = async () => {
    if (!file || !selectedTechnology) return;

    try {
      setIsSubmitting(true);
      await projectsQueries.attemptsRepository.submitAttempt({
        slug: project.slug,
        technology: selectedTechnology,
        file,
        hackathonId,
        projectSymbol,
      });
      setFile(null);
      onSubmitted?.();
      enqueueSnackbar(t('projects.submitSuccess'), { variant: 'success' });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Stack spacing={3}>
      <ProjectInfoCard project={project} />

      <Card elevation={0} sx={{ borderRadius: 3, border: (theme) => `1px solid ${theme.palette.divider}` }}>
        <CardHeader title={<Typography variant="subtitle1" fontWeight={800}>{t('projects.submit')}</Typography>} />
        <CardContent>
          <Stack spacing={2}>
            <TextField
              select
              fullWidth
              label={t('projects.technology')}
              value={selectedTechnology}
              onChange={(event) => setSelectedTechnology(event.target.value)}
            >
              {technologyOptions.map((technology) => (
                <MenuItem key={technology} value={technology}>
                  {technology}
                </MenuItem>
              ))}
            </TextField>

            <Box>
              <Typography variant="body2" fontWeight={700} sx={{ mb: 0.5 }}>
                {t('projects.file')}
              </Typography>
              <Button variant="outlined" component="label" fullWidth>
                {file?.name ?? t('projects.maxFileSize')}
                <input type="file" hidden accept=".txt" onChange={handleFileChange} />
              </Button>
            </Box>
          </Stack>
        </CardContent>
        <CardActions sx={{ px: 3, pb: 3, pt: 0 }}>
          <Button fullWidth variant="contained" onClick={handleSubmit} disabled={!file || isSubmitting}>
            {t('projects.submit')}
          </Button>
        </CardActions>
      </Card>
    </Stack>
  );
};

export default ProjectSidebar;

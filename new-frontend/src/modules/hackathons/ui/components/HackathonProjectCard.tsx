import { Box, Card, CardActionArea, CardContent, Chip, Stack, Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { Link as RouterLink } from 'react-router-dom';
import { getResourceByParams, resources } from 'app/routes/resources';
import KepcoinValue from 'shared/components/common/KepcoinValue';
import { HackathonProject } from '../../domain/entities/hackathon-project.entity';

interface HackathonProjectCardProps {
  hackathonId: number | string;
  hackathonProject: HackathonProject;
}

const HackathonProjectCard = ({ hackathonId, hackathonProject }: HackathonProjectCardProps) => {
  const { t } = useTranslation();
  const { project } = hackathonProject;

  return (
    <Card sx={{ borderRadius: 3, height: 1 }}>
      <CardActionArea
        component={RouterLink}
        to={getResourceByParams(resources.HackathonProject, { id: hackathonId, symbol: hackathonProject.symbol })}
        sx={{ height: 1, display: 'flex', flexDirection: 'column', alignItems: 'stretch' }}
      >
        <CardContent sx={{ display: 'flex', flexDirection: 'column', gap: 1.5, width: 1 }}>
          <Stack direction="row" spacing={1} alignItems="center" justifyContent="space-between">
            <Typography variant="h6" fontWeight={800} color="text.primary">
              {project.title}
            </Typography>
            {project.logo ? (
              <Box
                component="img"
                src={project.logo}
                alt={project.title}
                sx={{ width: 44, height: 44, borderRadius: 1.5, objectFit: 'cover', bgcolor: 'background.neutral' }}
              />
            ) : null}
          </Stack>

          {project.descriptionShort ? (
            <Typography
              variant="body2"
              color="text.secondary"
              component="div"
              dangerouslySetInnerHTML={{ __html: project.descriptionShort }}
              sx={{ display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}
            />
          ) : null}

          <Stack direction="row" spacing={1} alignItems="center" justifyContent="space-between" flexWrap="wrap" rowGap={1}>
            <Stack direction="row" spacing={1} alignItems="center">
              <Chip label={`${t('hackathons.symbol')} ${hackathonProject.symbol}`} size="small" />
              {project.levelTitle ? <Chip label={project.levelTitle} size="small" color="success" /> : null}
            </Stack>
            <Stack direction="row" spacing={1} alignItems="center">
              <KepcoinValue value={project.kepcoins ?? project.purchaseKepcoinValue} />
              {project.availableTechnologies.slice(0, 3).map((tech) => (
                <Chip key={tech.technology} label={tech.technology} size="small" variant="outlined" />
              ))}
            </Stack>
          </Stack>
        </CardContent>
      </CardActionArea>
    </Card>
  );
};

export default HackathonProjectCard;

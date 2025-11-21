import { Link as RouterLink, useParams } from 'react-router';
import { Box, Button, Card, Skeleton, Stack, Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';
import KepIcon from 'shared/components/base/KepIcon';
import { resources } from 'app/routes/resources';
import HackathonCountdown from '../components/HackathonCountdown';
import { useHackathonDetails } from '../../application/queries';

const HackathonProjectsPage = () => {
  const { id } = useParams<{ id: string }>();
  const { t } = useTranslation();
  const { data: hackathon, isLoading } = useHackathonDetails(id);

  return (
    <Box sx={{ p: { xs: 3, md: 5 } }}>
      <Stack direction="row" alignItems="center" spacing={2} sx={{ mb: 3 }}>
        <Button
          component={RouterLink}
          to={resources.Hackathon.replace(':id', id ?? '')}
          variant="outlined"
          startIcon={<KepIcon name="arrow-left" />}
          size="small"
        >
          {t('hackathons.backToList')}
        </Button>
        <Typography variant="overline" color="text.secondary">
          {t('hackathons.projectsTitle')}
        </Typography>
      </Stack>

      <Card sx={{ p: 3 }}>
        <Stack spacing={2}>
          {isLoading || !hackathon ? (
            <Skeleton height={24} width={240} />
          ) : (
            <Stack direction="row" spacing={1} alignItems="center">
              <Typography variant="h6" fontWeight={800}>{hackathon.title}</Typography>
              <HackathonCountdown hackathon={hackathon} />
            </Stack>
          )}

          <Typography variant="body1" color="text.secondary">
            {t('hackathons.comingSoon')}
          </Typography>
        </Stack>
      </Card>
    </Box>
  );
};

export default HackathonProjectsPage;

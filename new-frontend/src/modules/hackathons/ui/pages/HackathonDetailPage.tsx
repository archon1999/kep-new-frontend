import { Link as RouterLink, useParams } from 'react-router';
import { Avatar, Box, Button, Card, CardContent, Chip, Grid2 as Grid, Skeleton, Stack, Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';
import KepIcon from 'shared/components/base/KepIcon';
import { getResourceById, resources } from 'app/routes/resources';
import HackathonCountdown from '../components/HackathonCountdown';
import { useHackathonDetails } from '../../application/queries';

const HackathonDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const { t } = useTranslation();
  const { data: hackathon, isLoading } = useHackathonDetails(id);

  const loadingState = isLoading || !hackathon;

  return (
    <Box sx={{ p: { xs: 3, md: 5 } }}>
      <Stack direction="row" alignItems="center" spacing={2} sx={{ mb: 3 }}>
        <Button
          component={RouterLink}
          to={resources.Hackathons}
          variant="outlined"
          startIcon={<KepIcon name="arrow-left" />}
          size="small"
        >
          {t('hackathons.backToList')}
        </Button>

        <Typography variant="overline" color="text.secondary">
          {t('menu.hackathons')}
        </Typography>
      </Stack>

      <Grid container spacing={3}>
        <Grid size={{ xs: 12, md: 8 }}>
          <Card sx={{ p: 3 }}>
            <Stack direction="row" spacing={2} alignItems="center" sx={{ mb: 2 }}>
              {loadingState ? (
                <Skeleton variant="circular" width={64} height={64} />
              ) : (
                <Avatar src={hackathon.logo ?? undefined} sx={{ width: 64, height: 64 }}>
                  {hackathon.title[0]}
                </Avatar>
              )}

              <Box>
                {loadingState ? (
                  <Skeleton width={220} height={32} />
                ) : (
                  <Typography variant="h4" fontWeight={800} gutterBottom>
                    {hackathon.title}
                  </Typography>
                )}

                {loadingState ? (
                  <Skeleton width={180} height={20} />
                ) : (
                  <HackathonCountdown hackathon={hackathon} />
                )}
              </Box>
            </Stack>

            {loadingState ? (
              <Skeleton height={80} />
            ) : (
              <Typography variant="body1" color="text.secondary">
                {hackathon.description}
              </Typography>
            )}

            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} sx={{ mt: 3 }}>
              {[{
                icon: 'projects',
                label: t('hackathons.cards.projects'),
                value: hackathon?.projectsCount,
              }, {
                icon: 'users',
                label: t('hackathons.cards.participants'),
                value: hackathon?.participantsCount,
              }, {
                icon: 'trophy',
                label: t('hackathons.stats.registrants'),
                value: hackathon?.registrantsCount,
              }].map((item) => (
                <Card key={item.label} variant="outlined" sx={{ flex: 1 }}>
                  <CardContent>
                    <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 1 }}>
                      <KepIcon name={item.icon as never} fontSize={22} />
                      <Typography variant="subtitle2" color="text.secondary">
                        {item.label}
                      </Typography>
                    </Stack>
                    {loadingState ? (
                      <Skeleton width={60} height={28} />
                    ) : (
                      <Typography variant="h5" fontWeight={800}>
                        {item.value}
                      </Typography>
                    )}
                  </CardContent>
                </Card>
              ))}
            </Stack>
          </Card>
        </Grid>

        <Grid size={{ xs: 12, md: 4 }}>
          <Card sx={{ p: 3 }}>
            <Typography variant="subtitle2" color="text.secondary" sx={{ mb: 1 }}>
              {t('hackathons.schedule')}
            </Typography>

            {loadingState ? (
              <Stack spacing={1}>
                <Skeleton height={20} />
                <Skeleton height={20} />
              </Stack>
            ) : (
              <Stack spacing={1}>
                <Stack direction="row" spacing={1} alignItems="center">
                  <Chip label={t('hackathons.schedule.start')} color="info" size="small" />
                  <Typography variant="body2">{new Date(hackathon.startTime).toLocaleString()}</Typography>
                </Stack>
                <Stack direction="row" spacing={1} alignItems="center">
                  <Chip label={t('hackathons.schedule.finish')} color="warning" size="small" />
                  <Typography variant="body2">{new Date(hackathon.finishTime).toLocaleString()}</Typography>
                </Stack>
              </Stack>
            )}

            <Stack spacing={1.5} sx={{ mt: 3 }}>
              {loadingState ? (
                <Skeleton height={44} />
              ) : (
                <Button
                  component={RouterLink}
                  to={getResourceById(resources.HackathonProjects, id ?? '')}
                  variant="contained"
                  fullWidth
                  startIcon={<KepIcon name="projects" />}
                >
                  {t('hackathons.cta.viewProjects')}
                </Button>
              )}

              <Button
                component={RouterLink}
                to={getResourceById(resources.HackathonStandings, id ?? '')}
                variant="outlined"
                fullWidth
                startIcon={<KepIcon name="trophy" />}
                disabled={loadingState}
              >
                {t('hackathons.cta.viewStandings')}
              </Button>
            </Stack>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default HackathonDetailPage;

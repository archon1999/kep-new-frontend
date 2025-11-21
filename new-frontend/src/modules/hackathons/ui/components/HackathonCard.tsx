import { Link as RouterLink } from 'react-router';
import { Avatar, Box, Card, CardActionArea, CardContent, CardHeader, Stack, Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';
import KepIcon from 'shared/components/base/KepIcon';
import { getResourceById, resources } from 'app/routes/resources';
import HackathonCountdown from './HackathonCountdown';
import { Hackathon } from '../../domain/entities/hackathon.entity';

interface HackathonCardProps {
  hackathon: Hackathon;
}

const HackathonCard = ({ hackathon }: HackathonCardProps) => {
  const { t } = useTranslation();
  const detailsPath = getResourceById(resources.Hackathon, hackathon.id);

  return (
    <Card sx={{ height: '100%', position: 'relative', overflow: 'hidden' }}>
      <CardActionArea component={RouterLink} to={detailsPath} sx={{ height: '100%' }}>
        {hackathon.logo && (
          <Box
            sx={{
              height: 140,
              backgroundImage: `url(${hackathon.logo})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
            }}
          />
        )}

        <CardHeader
          avatar={<Avatar src={hackathon.logo ?? undefined}>{hackathon.title[0]}</Avatar>}
          title={
            <Typography variant="h6" fontWeight={800} noWrap>
              {hackathon.title}
            </Typography>
          }
          subheader={<HackathonCountdown hackathon={hackathon} />}
          sx={{ pb: 0, pt: hackathon.logo ? 2 : 3, px: 3 }}
        />

        <CardContent sx={{ px: 3, pb: 3 }}>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }} noWrap>
            {hackathon.description}
          </Typography>

          <Stack direction="row" spacing={2}>
            <Stack direction="row" spacing={1} alignItems="center">
              <KepIcon name="projects" fontSize={20} />
              <Typography variant="subtitle2" fontWeight={700}>
                {hackathon.projectsCount}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {t('hackathons.cards.projects')}
              </Typography>
            </Stack>

            <Stack direction="row" spacing={1} alignItems="center">
              <KepIcon name="users" fontSize={20} />
              <Typography variant="subtitle2" fontWeight={700}>
                {hackathon.participantsCount}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {t('hackathons.cards.participants')}
              </Typography>
            </Stack>
          </Stack>
        </CardContent>
      </CardActionArea>
    </Card>
  );
};

export default HackathonCard;

import { Box, Card, CardContent, Chip, Stack, Typography } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
import dayjs from 'dayjs';
import { useTranslation } from 'react-i18next';
import { getResourceByParams, resources } from 'app/routes/resources';
import KepIcon from 'shared/components/base/KepIcon';
import { Hackathon, HackathonStatus } from '../../domain';

interface HackathonCardProps {
  hackathon: Hackathon;
}

const HackathonCard = ({ hackathon }: HackathonCardProps) => {
  const { t } = useTranslation();
  const startDate = hackathon.startTime ? dayjs(hackathon.startTime) : null;
  const finishDate = hackathon.finishTime ? dayjs(hackathon.finishTime) : null;

  const statusColor =
    hackathon.status === HackathonStatus.FINISHED
      ? 'error'
      : hackathon.status === HackathonStatus.IN_PROGRESS
        ? 'success'
        : 'warning';

  return (
    <Card
      component={RouterLink}
      to={getResourceByParams(resources.Hackathon, { id: hackathon.id })}
      sx={{
        display: 'block',
        textDecoration: 'none',
        borderRadius: 3,
        overflow: 'hidden',
        '&:hover': {
          boxShadow: 6,
          transform: 'translateY(-2px)',
        },
        transition: 'all 0.2s ease',
      }}
    >
      {hackathon.logo ? (
        <Box
          component="div"
          sx={{
            height: 160,
            backgroundImage: `url(${hackathon.logo})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        />
      ) : null}
      <CardContent sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
        <Stack direction="row" alignItems="center" spacing={1}>
          <KepIcon name="hackathon" />
          <Typography variant="h6" fontWeight={800} color="text.primary">
            {hackathon.title}
          </Typography>
          <Chip label={t(`hackathons.status.${hackathon.status}`)} color={statusColor as any} size="small" />
        </Stack>

        {hackathon.description ? (
          <Typography variant="body2" color="text.secondary" sx={{ display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
            {hackathon.description}
          </Typography>
        ) : null}

        <Stack direction="row" spacing={3} flexWrap="wrap" rowGap={1}>
          <Stack spacing={0.25}>
            <Typography variant="caption" color="text.secondary">
              {t('hackathons.starts')}
            </Typography>
            <Typography variant="body2" fontWeight={700}>
              {startDate ? startDate.format('YYYY/MM/DD HH:mm') : '—'}
            </Typography>
          </Stack>
          <Stack spacing={0.25}>
            <Typography variant="caption" color="text.secondary">
              {t('hackathons.ends')}
            </Typography>
            <Typography variant="body2" fontWeight={700}>
              {finishDate ? finishDate.format('YYYY/MM/DD HH:mm') : '—'}
            </Typography>
          </Stack>
          <Stack spacing={0.25}>
            <Typography variant="caption" color="text.secondary">
              {t('hackathons.projects')}
            </Typography>
            <Typography variant="body2" fontWeight={800}>
              {hackathon.projectsCount ?? 0}
            </Typography>
          </Stack>
          <Stack spacing={0.25}>
            <Typography variant="caption" color="text.secondary">
              {t('hackathons.registrants')}
            </Typography>
            <Typography variant="body2" fontWeight={800}>
              {hackathon.registrantsCount ?? 0}
            </Typography>
          </Stack>
        </Stack>
      </CardContent>
    </Card>
  );
};

export default HackathonCard;

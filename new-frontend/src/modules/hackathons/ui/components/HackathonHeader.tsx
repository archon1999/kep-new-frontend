import { Box, Button, Chip, Paper, Stack, Typography } from '@mui/material';
import dayjs from 'dayjs';
import { useTranslation } from 'react-i18next';
import { Hackathon, HackathonStatus } from '../../domain';
import { useHackathonRegistration } from '../../application/mutations';

interface HackathonHeaderProps {
  hackathon: Hackathon;
  onRefresh?: () => void;
}

const HackathonHeader = ({ hackathon, onRefresh }: HackathonHeaderProps) => {
  const { t } = useTranslation();
  const { trigger, isMutating } = useHackathonRegistration(hackathon.id.toString());

  const startDate = hackathon.startTime ? dayjs(hackathon.startTime) : null;
  const finishDate = hackathon.finishTime ? dayjs(hackathon.finishTime) : null;
  const statusColor =
    hackathon.status === HackathonStatus.FINISHED
      ? 'error'
      : hackathon.status === HackathonStatus.IN_PROGRESS
        ? 'success'
        : 'warning';

  const handleToggleRegistration = async () => {
    const action = hackathon.isRegistered ? 'unregister' : 'register';
    await trigger({ action });
    onRefresh?.();
  };

  return (
    <Paper
      sx={{
        p: { xs: 3, md: 4 },
        borderRadius: 3,
        display: 'flex',
        flexDirection: { xs: 'column', md: 'row' },
        alignItems: 'center',
        gap: 3,
      }}
    >
      {hackathon.logo ? (
        <Box
          component="img"
          src={hackathon.logo}
          alt={hackathon.title}
          sx={{ width: 140, height: 140, borderRadius: 2, objectFit: 'cover' }}
        />
      ) : null}

      <Stack spacing={2} flex={1}>
        <Stack direction="row" alignItems="center" spacing={1}>
          <Typography variant="h4" fontWeight={900} color="text.primary">
            {hackathon.title}
          </Typography>
          <Chip label={t(`hackathons.status.${hackathon.status}`)} color={statusColor as any} />
        </Stack>

        {hackathon.description ? (
          <Typography variant="body1" color="text.secondary">
            {hackathon.description}
          </Typography>
        ) : null}

        <Stack direction="row" spacing={4} flexWrap="wrap" rowGap={1}>
          <Stack spacing={0.5}>
            <Typography variant="caption" color="text.secondary">
              {t('hackathons.starts')}
            </Typography>
            <Typography variant="subtitle2" fontWeight={800}>
              {startDate ? startDate.format('YYYY/MM/DD HH:mm') : '—'}
            </Typography>
          </Stack>
          <Stack spacing={0.5}>
            <Typography variant="caption" color="text.secondary">
              {t('hackathons.ends')}
            </Typography>
            <Typography variant="subtitle2" fontWeight={800}>
              {finishDate ? finishDate.format('YYYY/MM/DD HH:mm') : '—'}
            </Typography>
          </Stack>
          <Stack spacing={0.5}>
            <Typography variant="caption" color="text.secondary">
              {t('hackathons.projects')}
            </Typography>
            <Typography variant="subtitle2" fontWeight={800}>
              {hackathon.projectsCount ?? 0}
            </Typography>
          </Stack>
          <Stack spacing={0.5}>
            <Typography variant="caption" color="text.secondary">
              {t('hackathons.registrants')}
            </Typography>
            <Typography variant="subtitle2" fontWeight={800}>
              {hackathon.registrantsCount ?? 0}
            </Typography>
          </Stack>
        </Stack>
      </Stack>

      <Stack spacing={1}>
        <Button
          variant={hackathon.isRegistered ? 'outlined' : 'contained'}
          color={hackathon.isRegistered ? 'inherit' : 'primary'}
          onClick={handleToggleRegistration}
          disabled={hackathon.status === HackathonStatus.FINISHED || isMutating}
        >
          {hackathon.isRegistered ? t('hackathons.unregister') : t('hackathons.register')}
        </Button>
        {hackathon.isRegistered ? (
          <Typography variant="caption" color="text.secondary">
            {t('hackathons.registeredMessage')}
          </Typography>
        ) : null}
      </Stack>
    </Paper>
  );
};

export default HackathonHeader;

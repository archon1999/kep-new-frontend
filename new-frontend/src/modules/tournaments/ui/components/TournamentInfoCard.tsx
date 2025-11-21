import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { Card, CardContent, Chip, Divider, Stack, Typography } from '@mui/material';
import dayjs from 'dayjs';
import IconifyIcon from 'shared/components/base/IconifyIcon.tsx';
import { TournamentDetail } from '../../domain/entities/tournament.entity';

interface TournamentInfoCardProps {
  tournament: TournamentDetail;
}

const TournamentInfoCard = ({ tournament }: TournamentInfoCardProps) => {
  const { t } = useTranslation();

  const participantLabel = useMemo(
    () => t('tournaments.playersLabel', { count: tournament.players?.length ?? tournament.playersCount }),
    [t, tournament.players?.length, tournament.playersCount],
  );

  return (
    <Card background={1} sx={{ borderRadius: 3, height: '100%' }}>
      <CardContent sx={{ p: 3 }}>
        <Stack direction="column" spacing={2}>
          <Stack direction="row" alignItems="center" spacing={1}>
            <IconifyIcon icon="mdi:medal-outline" color="warning.main" fontSize={28} />
            <Typography variant="h5" fontWeight={800} color="text.primary">
              {tournament.title}
            </Typography>
          </Stack>

          <Typography variant="body2" color="text.secondary">
            {t('tournaments.startsAt', { time: dayjs(tournament.startTime).format('DD MMM, HH:mm') })}
          </Typography>

          <Stack direction="row" spacing={1} alignItems="center" flexWrap="wrap">
            <Chip size="small" color="primary" variant="soft" label={participantLabel} />
            <Chip
              size="small"
              color="default"
              variant="soft"
              icon={<IconifyIcon icon="mdi:medal" fontSize={16} />}
              label={t('tournaments.typeLabel', { type: tournament.type })}
            />
            {tournament.isRegistered ? (
              <Chip
                size="small"
                color="success"
                variant="soft"
                icon={<IconifyIcon icon="mdi:check" fontSize={16} />}
                label={t('tournaments.registered')}
              />
            ) : null}
          </Stack>

          <Divider />

          <Typography variant="subtitle2" color="text.secondary">
            {t('tournaments.about')}
          </Typography>
          <Typography variant="body2" color="text.primary" sx={{ whiteSpace: 'pre-line' }}>
            {tournament.description || t('tournaments.noDescription')}
          </Typography>
        </Stack>
      </CardContent>
    </Card>
  );
};

export default TournamentInfoCard;

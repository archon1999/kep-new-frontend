import { useMemo } from 'react';
import dayjs from 'dayjs';
import duration from 'dayjs/plugin/duration';
import { Chip, Stack, Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { HackathonStatus } from '../../domain/constants/hackathon-status';
import { Hackathon } from '../../domain/entities/hackathon.entity';

dayjs.extend(duration);

type HackathonCountdownProps = {
  hackathon: Hackathon;
};

const HackathonCountdown = ({ hackathon }: HackathonCountdownProps) => {
  const { t } = useTranslation();

  const { label, color, timeText } = useMemo(() => {
    if (hackathon.status === HackathonStatus.FINISHED) {
      return {
        label: t('hackathons.status.finished'),
        color: 'default' as const,
        timeText: t('hackathons.countdown.finished'),
      };
    }

    const now = dayjs();
    const target = hackathon.status === HackathonStatus.NOT_STARTED
      ? dayjs(hackathon.startTime)
      : dayjs(hackathon.finishTime);

    const diff = dayjs.duration(target.diff(now));
    const timeText = diff.asMilliseconds() > 0
      ? t('hackathons.countdown.in', {
        days: diff.days(),
        hours: diff.hours().toString().padStart(2, '0'),
        minutes: diff.minutes().toString().padStart(2, '0'),
      })
      : t('hackathons.countdown.soon');

    return {
      label: hackathon.status === HackathonStatus.NOT_STARTED
        ? t('hackathons.status.upcoming')
        : t('hackathons.status.active'),
      color: hackathon.status === HackathonStatus.NOT_STARTED ? 'info' : 'success',
      timeText,
    };
  }, [hackathon.finishTime, hackathon.startTime, hackathon.status, t]);

  return (
    <Stack direction="row" spacing={1} alignItems="center">
      <Chip label={label} color={color} size="small" sx={{ fontWeight: 700 }} />
      <Typography variant="body2" color="text.secondary">
        {timeText}
      </Typography>
    </Stack>
  );
};

export default HackathonCountdown;

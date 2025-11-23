import { useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Box, Card, CardContent, Chip, Stack, Typography } from '@mui/material';
import dayjs from 'dayjs';
import duration from 'dayjs/plugin/duration';
import KepIcon from 'shared/components/base/KepIcon';
import { ContestDetail } from '../../domain/entities/contest-detail.entity';
import { ContestStatus } from '../../domain/entities/contest-status';

dayjs.extend(duration);

interface ContestCountdownCardProps {
  contest?: ContestDetail | null;
}

const ContestCountdownCard = ({ contest }: ContestCountdownCardProps) => {
  const { t } = useTranslation();
  const [now, setNow] = useState(dayjs());

  useEffect(() => {
    const timer = setInterval(() => setNow(dayjs()), 1000);

    return () => {
      clearInterval(timer);
    };
  }, []);

  const startDate = contest?.startTime ? dayjs(contest.startTime) : null;
  const finishDate = contest?.finishTime ? dayjs(contest.finishTime) : null;

  const { statusLabel, statusColor, countdownLabel } = useMemo(() => {
    const formatCountdown = (targetDate: dayjs.Dayjs | null) => {
      if (!targetDate) return '';

      const diffMs = Math.max(targetDate.diff(now), 0);
      const diff = dayjs.duration(diffMs);
      const hours = Math.floor(diff.asHours());
      const minutes = diff.minutes();
      const seconds = diff.seconds();

      return [hours, minutes, seconds].map((value) => String(value).padStart(2, '0')).join(':');
    };

    if (!contest) {
      return {
        statusLabel: t('contests.status.starts', { date: '--' }),
        statusColor: 'warning' as const,
        countdownLabel: '',
      };
    }

    if (contest.statusCode === ContestStatus.Finished) {
      return {
        statusLabel: finishDate
          ? t('contests.status.finished', { date: finishDate.format('DD MMM, HH:mm') })
          : t('contests.status.finished', { date: '--' }),
        statusColor: 'default' as const,
        countdownLabel: '',
      };
    }

    if (contest.statusCode === ContestStatus.NotStarted && startDate) {
      return {
        statusLabel: t('contests.status.starts', { date: startDate.format('DD MMM, HH:mm') }),
        statusColor: 'warning' as const,
        countdownLabel: t('contests.countdown', { time: formatCountdown(startDate) }),
      };
    }

    if (contest.statusCode === ContestStatus.Already && finishDate) {
      return {
        statusLabel: t('contests.status.live', { date: finishDate.format('DD MMM, HH:mm') }),
        statusColor: 'success' as const,
        countdownLabel: t('contests.countdown', { time: formatCountdown(finishDate) }),
      };
    }

    return {
      statusLabel: t('contests.status.live', { date: finishDate?.format('DD MMM, HH:mm') ?? '--' }),
      statusColor: 'success' as const,
      countdownLabel: '',
    };
  }, [contest, finishDate, now, startDate, t]);

  return (
    <Card
      variant="outlined"
      sx={{
        position: 'relative',
        borderRadius: 3,
        background: (theme) =>
          `linear-gradient(135deg, ${theme.palette.primary.light}22, ${theme.palette.secondary.light}18)`,
      }}
    >
      <Box
        sx={{
          position: 'absolute',
          inset: 0,
          opacity: 0,
        }}
      />
      <CardContent sx={{ position: 'relative', zIndex: 1 }}>
        <Stack spacing={1.5} alignItems="flex-start">
          <Chip
            icon={<KepIcon name="timer" fontSize={16} />}
            label={statusLabel}
            color={statusColor}
            variant="outlined"
            sx={{ fontWeight: 700 }}
          />

          {countdownLabel ? (
            <Typography variant="h6" fontWeight={800}>
              {countdownLabel}
            </Typography>
          ) : null}
        </Stack>
      </CardContent>
    </Card>
  );
};

export default ContestCountdownCard;

import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { Box, Card, Chip, Stack, Typography } from '@mui/material';
import dayjs from 'dayjs';
import IconifyIcon from 'shared/components/base/IconifyIcon';
import { CalendarEventEntity } from 'modules/calendar/domain/entities/calendar-event.entity';

interface CalendarEventCardProps {
  event: CalendarEventEntity;
}

const eventColor: Record<number, 'primary' | 'info' | 'success' | 'warning'> = {
  1: 'primary',
  2: 'info',
  3: 'success',
  4: 'warning',
};

const CalendarEventCard = ({ event }: CalendarEventCardProps) => {
  const { t } = useTranslation();

  const timeRange = useMemo(() => {
    if (event.startTime) {
      const start = dayjs(event.startTime);
      const finish = event.finishTime ? dayjs(event.finishTime) : null;

      if (finish && finish.isValid()) {
        return `${start.format('DD MMM, HH:mm')} — ${finish.format('DD MMM, HH:mm')}`;
      }

      return start.isValid() ? start.format('DD MMM, HH:mm') : t('calendar.timeTbd');
    }

    return t('calendar.timeTbd');
  }, [event.finishTime, event.startTime, t]);

  const chipColor = eventColor[event.type] ?? 'primary';

  return (
    <Card
      elevation={0}
      sx={{
        p: 2.5,
        height: '100%',
        borderRadius: 2.5,
        border: (theme) => `1px solid ${theme.palette.divider}`,
        bgcolor: 'background.paper',
      }}
    >
      <Stack spacing={2} height="100%">
        <Stack direction="row" spacing={1.5} alignItems="center" justifyContent="space-between">
          <Stack direction="row" spacing={1} alignItems="center">
            <Box
              sx={{
                width: 36,
                height: 36,
                borderRadius: 2,
                bgcolor: (theme) => theme.palette[chipColor].main,
                display: 'grid',
                placeItems: 'center',
                color: 'primary.contrastText',
              }}
            >
              <IconifyIcon icon="material-symbols:calendar-month-rounded" sx={{ fontSize: 20, color: 'common.white' }} />
            </Box>
            <Box>
              <Typography variant="subtitle1" fontWeight={700} color="text.primary">
                {event.title || t('calendar.untitled')}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {t('calendar.uid', { uid: event.uid })}
              </Typography>
            </Box>
          </Stack>
          <Chip
            label={t(`calendar.eventTypes.${event.type}`, {
              defaultValue: t('calendar.typeFallback', { type: event.type }),
            })}
            color={chipColor}
            variant="filled"
            sx={{ textTransform: 'capitalize', fontWeight: 600 }}
          />
        </Stack>

        <Stack spacing={1} sx={{ flexGrow: 1 }}>
          <Typography variant="body2" color="text.secondary">
            {t('calendar.timeLabel')}
          </Typography>
          <Typography variant="subtitle2" fontWeight={700} color="text.primary">
            {timeRange}
          </Typography>
        </Stack>
      </Stack>
    </Card>
  );
};

export default CalendarEventCard;

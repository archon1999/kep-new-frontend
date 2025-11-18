import { useMemo, useRef, useState } from 'react';
import { EventInput } from '@fullcalendar/core/index.js';
import ReactFullCalendar from '@fullcalendar/react';
import { Box, Button, Chip, Divider, LinearProgress, Paper, Stack, Typography } from '@mui/material';
import dayjs from 'dayjs';
import { useTheme } from '@mui/material/styles';
import { useTranslation } from 'react-i18next';
import FullCalendar from 'shared/components/calendar/FullCalendar';
import KepIcon from 'shared/components/base/KepIcon';
import { useCalendarEvents } from 'modules/calendar/application/queries';
import { CalendarEventType } from 'shared/api/orval/generated/endpoints/index.schemas';

const CalendarPage = () => {
  const { t } = useTranslation();
  const { palette } = useTheme();
  const calendarRef = useRef<ReactFullCalendar | null>(null);
  const { data: events, isLoading, error, mutate } = useCalendarEvents();
  const [currentDate, setCurrentDate] = useState(dayjs());

  const typeMeta = useMemo(
    () => ({
      [CalendarEventType.NUMBER_1]: { label: t('calendar.types.type1'), color: palette.primary.main },
      [CalendarEventType.NUMBER_2]: { label: t('calendar.types.type2'), color: palette.success.main },
      [CalendarEventType.NUMBER_3]: { label: t('calendar.types.type3'), color: palette.info.main },
      [CalendarEventType.NUMBER_4]: { label: t('calendar.types.type4'), color: palette.warning.main },
    }),
    [palette.info.main, palette.primary.main, palette.success.main, palette.warning.main, t],
  );

  const calendarEvents = useMemo<EventInput[]>(() => {
    if (!events?.length) {
      return [];
    }

    return events.flatMap((event) => {
      if (!event.startTime) {
        return [];
      }

      const meta = typeMeta[event.type];
      const fallbackColor = palette.secondary?.main ?? palette.primary.main;
      const title = event.title?.trim() || t('calendar.defaultTitle');

      return [
        {
          id: String(event.id ?? event.uid),
          title,
          start: event.startTime,
          end: event.finishTime ?? undefined,
          allDay: !event.finishTime,
          backgroundColor: meta?.color ?? fallbackColor,
          borderColor: meta?.color ?? fallbackColor,
        },
      ];
    });
  }, [events, palette.primary.main, palette.secondary?.main, t, typeMeta]);

  const handleToday = () => {
    const api = calendarRef.current?.getApi();

    api?.today();
    if (api) {
      setCurrentDate(dayjs(api.getDate()));
    }
  };

  const handlePrev = () => {
    const api = calendarRef.current?.getApi();
    api?.prev();
  };

  const handleNext = () => {
    const api = calendarRef.current?.getApi();
    api?.next();
  };

  return (
    <Box sx={{ p: { xs: 3, md: 5 } }}>
      <Stack spacing={3}>
        <Stack
          direction={{ xs: 'column', md: 'row' }}
          alignItems={{ xs: 'flex-start', md: 'center' }}
          justifyContent="space-between"
          spacing={2}
        >
          <Stack spacing={0.5}>
            <Typography variant="h4" fontWeight={700}>
              {t('calendar.title')}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {t('calendar.subtitle')}
            </Typography>
          </Stack>

          <Stack direction="row" alignItems="center" spacing={1.5}>
            <Button
              variant="outlined"
              color="neutral"
              onClick={handleToday}
              startIcon={<KepIcon name="calendar-today" />}
            >
              {t('calendar.today')}
            </Button>

            <Stack direction="row" alignItems="center" spacing={1}>
              <Button shape="square" color="neutral" onClick={handlePrev}>
                <KepIcon name="calendar-previous" />
              </Button>
              <Typography variant="subtitle1" fontWeight={700} sx={{ minWidth: 140, textAlign: 'center' }}>
                {currentDate.format('MMMM YYYY')}
              </Typography>
              <Button shape="square" color="neutral" onClick={handleNext}>
                <KepIcon name="calendar-next" />
              </Button>
            </Stack>
          </Stack>
        </Stack>

        <Paper sx={{ p: { xs: 2, md: 3 }, overflow: 'hidden' }}>
          <Stack spacing={2}>
            <Stack direction="row" flexWrap="wrap" spacing={1} useFlexGap>
              {Object.entries(typeMeta).map(([type, meta]) => (
                <Chip
                  key={type}
                  color="default"
                  label={meta.label}
                  sx={{
                    bgcolor: `${meta.color}22`,
                    color: meta.color,
                    fontWeight: 600,
                    borderRadius: 2,
                  }}
                />
              ))}
            </Stack>

            <Divider />

            <Box sx={{ position: 'relative', minHeight: 520 }}>
              {isLoading && (
                <LinearProgress
                  sx={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    width: '100%',
                    zIndex: 2,
                  }}
                />
              )}

              <FullCalendar
                ref={calendarRef}
                events={calendarEvents}
                initialView="timeGridWeek"
                contentHeight="auto"
                height="auto"
                expandRows
                nowIndicator
                datesSet={(arg) => setCurrentDate(dayjs(arg.start))}
                eventColor={palette.primary.main}
                displayEventEnd
              />

              {!isLoading && !calendarEvents.length && !error && (
                <Stack
                  spacing={1}
                  alignItems="center"
                  justifyContent="center"
                  sx={{
                    position: 'absolute',
                    inset: 0,
                    bgcolor: 'background.paper',
                    opacity: 0.96,
                  }}
                >
                  <KepIcon name="calendar-clock" sx={{ fontSize: 40, color: 'text.disabled' }} />
                  <Typography variant="subtitle1" fontWeight={700}>
                    {t('calendar.emptyTitle')}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" textAlign="center">
                    {t('calendar.emptySubtitle')}
                  </Typography>
                </Stack>
              )}

              {error && (
                <Stack
                  spacing={1.5}
                  alignItems="center"
                  justifyContent="center"
                  sx={{ position: 'absolute', inset: 0, bgcolor: 'background.paper', opacity: 0.98 }}
                >
                  <KepIcon name="alert" sx={{ fontSize: 32, color: 'error.main' }} />
                  <Typography variant="subtitle1" fontWeight={700}>
                    {t('calendar.errorTitle')}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" textAlign="center">
                    {t('calendar.errorSubtitle')}
                  </Typography>
                  <Button variant="contained" color="primary" onClick={() => mutate()}>
                    {t('calendar.retry')}
                  </Button>
                </Stack>
              )}
            </Box>
          </Stack>
        </Paper>
      </Stack>
    </Box>
  );
};

export default CalendarPage;

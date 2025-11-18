import { useMemo, useState } from 'react';
import FullCalendar, { CalendarOptions, EventInput } from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';
import listPlugin from '@fullcalendar/list';
import timeGridPlugin from '@fullcalendar/timegrid';
import ruLocale from '@fullcalendar/core/locales/ru';
import uzLocale from '@fullcalendar/core/locales/uz';
import { Alert, Box, Chip, CircularProgress, Divider, Stack, Typography } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { useTranslation } from 'react-i18next';
import { useCalendarEvents } from 'modules/calendar/application/queries';
import { CalendarEventEntity, CalendarEventType } from 'modules/calendar/domain/entities/calendar-event.entity';

import '@fullcalendar/core/index.css';
import '@fullcalendar/daygrid/index.css';
import '@fullcalendar/timegrid/index.css';
import '@fullcalendar/list/index.css';

type CalendarView = NonNullable<CalendarOptions['initialView']>;

const EVENT_TYPE_META: Array<{
  type: CalendarEventType;
  labelKey: string;
  color: 'primary' | 'warning' | 'secondary' | 'success';
}> = [
  { type: CalendarEventType.CONTEST, labelKey: 'calendar.filters.contests', color: 'primary' },
  { type: CalendarEventType.ARENA, labelKey: 'calendar.filters.arena', color: 'warning' },
  { type: CalendarEventType.TOURNAMENT, labelKey: 'calendar.filters.tournaments', color: 'secondary' },
  { type: CalendarEventType.HOLIDAY, labelKey: 'calendar.filters.holidays', color: 'success' },
];

const getStoredView = (): CalendarView => {
  if (typeof window === 'undefined') {
    return 'listMonth';
  }

  const stored = localStorage.getItem('calendarViewType');

  return (stored as CalendarView) || 'listMonth';
};

const toEventInput = (
  event: CalendarEventEntity,
  color: string,
): EventInput | null => {
  if (!event.startTime) {
    return null;
  }

  return {
    id: String(event.uid),
    title: event.title,
    start: event.startTime,
    end: event.finishTime ?? undefined,
    url: event.url,
    backgroundColor: color,
    borderColor: color,
    textColor: 'inherit',
  };
};

const CalendarPage = () => {
  const theme = useTheme();
  const { t, i18n } = useTranslation();
  const { data: events, isLoading, error } = useCalendarEvents();

  const [activeTypes, setActiveTypes] = useState<Record<CalendarEventType, boolean>>({
    [CalendarEventType.CONTEST]: true,
    [CalendarEventType.ARENA]: true,
    [CalendarEventType.TOURNAMENT]: true,
    [CalendarEventType.HOLIDAY]: true,
  });
  const [currentView, setCurrentView] = useState<CalendarView>(getStoredView);

  const typeColors = useMemo(
    () => ({
      [CalendarEventType.CONTEST]: theme.palette.primary.main,
      [CalendarEventType.ARENA]: theme.palette.warning.main,
      [CalendarEventType.TOURNAMENT]: theme.palette.secondary.main,
      [CalendarEventType.HOLIDAY]: theme.palette.success.main,
    }),
    [theme.palette.primary.main, theme.palette.warning.main, theme.palette.secondary.main, theme.palette.success.main],
  );

  const filteredEvents = useMemo(
    () => (events ?? []).filter((event) => activeTypes[event.type] !== false),
    [activeTypes, events],
  );

  const calendarEvents = useMemo(() => {
    return filteredEvents
      .map((event) => toEventInput(event, typeColors[event.type]))
      .filter(Boolean) as EventInput[];
  }, [filteredEvents, typeColors]);

  const handleToggleType = (type: CalendarEventType) => {
    setActiveTypes((prev) => ({
      ...prev,
      [type]: !prev[type],
    }));
  };

  const handleDatesSet: NonNullable<CalendarOptions['datesSet']> = (dateInfo) => {
    setCurrentView(dateInfo.view.type as CalendarView);

    if (typeof window !== 'undefined') {
      localStorage.setItem('calendarViewType', dateInfo.view.type);
    }
  };

  const showEmptyState = !isLoading && !calendarEvents.length && !error;

  return (
    <Box sx={{ p: { xs: 3, md: 5 } }}>
      <Stack spacing={3}>
        <Stack spacing={1}>
          <Typography variant="h4" fontWeight={700}>
            {t('calendar.title')}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {t('calendar.subtitle')}
          </Typography>
        </Stack>

        <Box
          sx={{
            borderRadius: 3,
            border: (themeStyles) => `1px solid ${themeStyles.palette.divider}`,
            bgcolor: 'background.paper',
            boxShadow: (themeStyles) => themeStyles.shadows[1],
          }}
        >
          <Stack spacing={2} sx={{ p: { xs: 2, md: 3 } }}>
            <Stack
              direction={{ xs: 'column', md: 'row' }}
              spacing={1.5}
              alignItems={{ xs: 'flex-start', md: 'center' }}
              justifyContent="space-between"
            >
              <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
                {EVENT_TYPE_META.map(({ type, labelKey, color }) => {
                  const isActive = activeTypes[type];
                  const chipColor = isActive ? color : undefined;

                  return (
                    <Chip
                      key={type}
                      label={t(labelKey)}
                      variant={isActive ? 'filled' : 'outlined'}
                      color={chipColor}
                      onClick={() => handleToggleType(type)}
                      sx={{ fontWeight: 600, textTransform: 'capitalize' }}
                    />
                  );
                })}
              </Stack>

              <Typography variant="caption" color="text.secondary">
                {t('calendar.viewHint')}
              </Typography>
            </Stack>

            <Divider />

            {error ? (
              <Alert severity="error">{t('calendar.loadError')}</Alert>
            ) : (
              <Box sx={{ position: 'relative', minHeight: 360 }}>
                {isLoading && (
                  <Stack
                    alignItems="center"
                    justifyContent="center"
                    sx={{ position: 'absolute', inset: 0, zIndex: 1, bgcolor: 'background.default', opacity: 0.72 }}
                  >
                    <CircularProgress />
                  </Stack>
                )}

                {showEmptyState ? (
                  <Stack spacing={1} alignItems="center" justifyContent="center" sx={{ py: 8 }}>
                    <Typography variant="subtitle1" fontWeight={700}>
                      {t('calendar.emptyTitle')}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" textAlign="center">
                      {t('calendar.emptySubtitle')}
                    </Typography>
                  </Stack>
                ) : (
                  <FullCalendar
                    plugins={[dayGridPlugin, timeGridPlugin, listPlugin, interactionPlugin]}
                    locales={[uzLocale, ruLocale]}
                    locale={i18n.language}
                    initialView={currentView}
                    headerToolbar={{
                      start: 'prev,next today',
                      center: 'title',
                      end: 'dayGridMonth,timeGridWeek,timeGridDay,listMonth',
                    }}
                    height="auto"
                    contentHeight="auto"
                    firstDay={1}
                    navLinks
                    dayMaxEvents={3}
                    events={calendarEvents}
                    datesSet={handleDatesSet}
                  />
                )}
              </Box>
            )}
          </Stack>
        </Box>
      </Stack>
    </Box>
  );
};

export default CalendarPage;

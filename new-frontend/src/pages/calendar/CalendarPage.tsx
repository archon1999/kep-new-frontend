import { useEffect, useMemo, useRef, useState } from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';
import listPlugin from '@fullcalendar/list';
import timeGridPlugin from '@fullcalendar/timegrid';
import enLocale from '@fullcalendar/core/locales/en-gb';
import ruLocale from '@fullcalendar/core/locales/ru';
import uzLocale from '@fullcalendar/core/locales/uz';
import { Box, Card, CardContent, Chip, CircularProgress, FormControlLabel, Stack, Switch, Typography, useTheme } from '@mui/material';
import { useTranslation } from 'react-i18next';
import useSWR from 'swr';
import { type CalendarEvent } from 'shared/api/orval/generated/endpoints/index.schemas';
import axiosFetcher from 'shared/services/axios/axiosFetcher';

import '@fullcalendar/core/index.css';
import '@fullcalendar/daygrid/index.css';
import '@fullcalendar/timegrid/index.css';
import '@fullcalendar/list/index.css';

type CalendarView = 'dayGridMonth' | 'timeGridWeek' | 'timeGridDay' | 'listMonth';

type EventTypeMeta = {
  id: number;
  translationKey: string;
  color: string;
  urlPrefix?: string;
};

const localeMap: Record<string, string> = {
  enUS: 'en-gb',
  ruRU: 'ru',
  uzUZ: 'uz',
};

const CalendarPage = () => {
  const { t, i18n } = useTranslation();
  const theme = useTheme();
  const calendarRef = useRef<FullCalendar | null>(null);

  const [view, setView] = useState<CalendarView>(() => {
    const saved = typeof window !== 'undefined' ? localStorage.getItem('calendarViewType') : null;
    return (saved as CalendarView | null) || 'listMonth';
  });

  const [enabledTypes, setEnabledTypes] = useState<Record<number, boolean>>({
    1: true,
    2: true,
    3: true,
    4: true,
  });

  const { data: events, isLoading } = useSWR<CalendarEvent[]>(['/api/calendar-events/', { method: 'get' }], axiosFetcher, {
    revalidateOnFocus: false,
  });

  useEffect(() => {
    if (!calendarRef.current) return;

    const api = calendarRef.current.getApi();
    if (api.view.type !== view) {
      api.changeView(view);
    }
  }, [view]);

  const eventTypes: EventTypeMeta[] = useMemo(
    () => [
      { id: 1, translationKey: 'calendar.filters.contests', color: theme.palette.primary.main, urlPrefix: '/competitions/contests/contest/' },
      { id: 2, translationKey: 'calendar.filters.arena', color: theme.palette.warning.main, urlPrefix: '/competitions/arena/tournament/' },
      { id: 3, translationKey: 'calendar.filters.tournaments', color: theme.palette.info.main, urlPrefix: '/competitions/tournaments/tournament/' },
      { id: 4, translationKey: 'calendar.filters.holidays', color: theme.palette.success.main },
    ],
    [theme.palette.info.main, theme.palette.primary.main, theme.palette.success.main, theme.palette.warning.main],
  );

  const mappedEvents = useMemo(() => {
    if (!events) return [];

    return events
      .filter((event) => enabledTypes[event.type])
      .map((event) => {
        const typeMeta = eventTypes.find((item) => item.id === event.type);

        return {
          id: event.id?.toString() ?? `${event.uid}-${event.type}`,
          title: event.title ?? '',
          start: event.startTime ? new Date(event.startTime) : undefined,
          end: event.finishTime ? new Date(event.finishTime) : undefined,
          url: typeMeta?.urlPrefix ? `${typeMeta.urlPrefix}${event.uid}` : undefined,
          backgroundColor: typeMeta?.color,
          borderColor: typeMeta?.color,
          textColor: theme.palette.getContrastText(typeMeta?.color || theme.palette.primary.main),
        };
      });
  }, [enabledTypes, eventTypes, events, theme.palette]);

  const handleToggleType = (typeId: number) => {
    setEnabledTypes((prev) => ({
      ...prev,
      [typeId]: !prev[typeId],
    }));
  };

  const handleViewChange = (newView: CalendarView) => {
    setView(newView);
    if (typeof window !== 'undefined') {
      localStorage.setItem('calendarViewType', newView);
    }
  };

  const handleDatesSet = (info: { view: { type: string } }) => {
    if (info.view.type !== view) {
      handleViewChange(info.view.type as CalendarView);
    }
  };

  const currentLocale = localeMap[i18n.language] ?? 'en-gb';

  return (
    <Box sx={{ p: { xs: 3, md: 5 } }}>
      <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 3, flexWrap: 'wrap', gap: 1 }}>
        <Box>
          <Typography variant="h4" fontWeight={700} gutterBottom>
            {t('calendar.title')}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {t('calendar.subtitle')}
          </Typography>
        </Box>
      </Stack>

      <Stack direction={{ xs: 'column', lg: 'row' }} spacing={3} alignItems="stretch">
        <Card sx={{ width: { xs: '100%', lg: 340 }, flexShrink: 0 }}>
          <CardContent>
            <Typography variant="h6" fontWeight={700} gutterBottom>
              {t('calendar.filters.title')}
            </Typography>
            <Stack spacing={2}>
              {eventTypes.map((type) => (
                <Stack key={type.id} direction="row" alignItems="center" justifyContent="space-between">
                  <FormControlLabel
                    control={<Switch checked={enabledTypes[type.id]} onChange={() => handleToggleType(type.id)} />}
                    label={t(type.translationKey)}
                  />
                  <Chip label={t(type.translationKey)} sx={{ bgcolor: type.color, color: theme.palette.getContrastText(type.color) }} />
                </Stack>
              ))}
            </Stack>
          </CardContent>
        </Card>

        <Card sx={{ flexGrow: 1 }}>
          <CardContent sx={{ p: { xs: 1.5, sm: 3 } }}>
            {isLoading ? (
              <Stack alignItems="center" justifyContent="center" sx={{ minHeight: 320 }}>
                <CircularProgress />
              </Stack>
            ) : (
              <FullCalendar
                ref={calendarRef}
                plugins={[dayGridPlugin, timeGridPlugin, listPlugin, interactionPlugin]}
                initialView={view}
                headerToolbar={{
                  start: 'prev,next today',
                  center: 'title',
                  end: 'dayGridMonth,timeGridWeek,timeGridDay,listMonth',
                }}
                height="auto"
                locales={[uzLocale, ruLocale, enLocale]}
                locale={currentLocale}
                navLinks
                dayMaxEvents={2}
                events={mappedEvents}
                datesSet={handleDatesSet}
              />
            )}
          </CardContent>
        </Card>
      </Stack>
    </Box>
  );
};

export default CalendarPage;

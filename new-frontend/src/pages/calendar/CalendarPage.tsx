import { useMemo, useRef, useState } from 'react';
import ReactFullCalendar from '@fullcalendar/react';
import { Box, Card, CardContent, Chip, CircularProgress, Container, Divider, Stack, Typography } from '@mui/material';
import enLocale from '@fullcalendar/core/locales/en-gb';
import ruLocale from '@fullcalendar/core/locales/ru';
import uzLocale from '@fullcalendar/core/locales/uz';
import FullCalendar from 'shared/components/base/FullCalendar';
import { useSettingsContext } from 'app/providers/SettingsProvider';
import { useTranslation } from 'react-i18next';
import { useTheme } from '@mui/material/styles';
import { useCalendarEvents } from './hooks';

import '@fullcalendar/core/index.css';
import '@fullcalendar/daygrid/index.css';
import '@fullcalendar/timegrid/index.css';
import '@fullcalendar/list/index.css';

const CALENDAR_VIEW_STORAGE_KEY = 'calendarViewType';

const eventTypeMeta = {
  1: { color: 'primary' as const, labelKey: 'calendar.eventTypes.contest' },
  2: { color: 'warning' as const, labelKey: 'calendar.eventTypes.arena' },
  3: { color: 'neutral' as const, labelKey: 'calendar.eventTypes.tournament' },
  4: { color: 'success' as const, labelKey: 'calendar.eventTypes.holiday' },
};

type FullCalendarView = 'dayGridMonth' | 'timeGridWeek' | 'timeGridDay' | 'listMonth';

const CalendarPage = () => {
  const { t } = useTranslation();
  const theme = useTheme();
  const {
    config: { locale },
  } = useSettingsContext();
  const calendarRef = useRef<ReactFullCalendar | null>(null);
  const initialView =
    (typeof window !== 'undefined' &&
      (localStorage.getItem(CALENDAR_VIEW_STORAGE_KEY) as FullCalendarView)) || 'listMonth';
  const [view, setView] = useState<FullCalendarView>(initialView);
  const { events, isLoading } = useCalendarEvents();

  const calendarLocale = useMemo(() => {
    if (locale.startsWith('ru')) return ruLocale;
    if (locale.startsWith('uz')) return uzLocale;

    return enLocale;
  }, [locale]);

  const typedEvents = useMemo(
    () =>
      events.map((event) => {
        const meta = eventTypeMeta[event.extendedProps?.type as keyof typeof eventTypeMeta];
        const paletteColor = meta ? theme.vars.palette[meta.color] : theme.vars.palette.primary;

        return {
          ...event,
          backgroundColor: paletteColor.main,
          borderColor: paletteColor.main,
          textColor: paletteColor.contrastText,
        };
      }),
    [events, theme.vars.palette],
  );

  return (
    <Container maxWidth="xl" sx={{ py: { xs: 4, md: 6 } }}>
      <Stack spacing={3}>
        <Stack direction="row" flexWrap="wrap" alignItems="center" justifyContent="space-between" gap={2}>
          <Box>
            <Typography variant="h4" component="h1">
              {t('calendar.title')}
            </Typography>
            <Typography color="text.secondary" sx={{ mt: 0.5 }}>
              {t('calendar.subtitle')}
            </Typography>
          </Box>
          <Stack direction="row" spacing={1} divider={<Divider flexItem orientation="vertical" />}> 
            {Object.entries(eventTypeMeta).map(([key, meta]) => (
              <Chip
                key={key}
                label={t(meta.labelKey)}
                color={meta.color}
                variant="soft"
              />
            ))}
          </Stack>
        </Stack>

        <Card sx={{ overflow: 'hidden' }}>
          <CardContent sx={{ p: { xs: 2, sm: 3 } }}>
            {isLoading ? (
              <Stack alignItems="center" py={6}>
                <CircularProgress />
              </Stack>
            ) : (
              <Box>
                <FullCalendar
                  calendarRef={calendarRef}
                  events={typedEvents}
                  initialView={view}
                  locales={[enLocale, ruLocale, uzLocale]}
                  locale={calendarLocale}
                  datesSet={(info) => {
                    const viewType = info.view.type as FullCalendarView;
                    setView(viewType);
                    localStorage.setItem(CALENDAR_VIEW_STORAGE_KEY, viewType);
                  }}
                />
              </Box>
            )}
          </CardContent>
        </Card>
      </Stack>
    </Container>
  );
};

export default CalendarPage;

import { useEffect, useMemo, useRef, useState } from 'react';
import FullCalendar from '@fullcalendar/react';
import interactionPlugin from '@fullcalendar/interaction';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import listPlugin from '@fullcalendar/list';
import uzLocale from '@fullcalendar/core/locales/uz';
import ruLocale from '@fullcalendar/core/locales/ru';
import enLocale from '@fullcalendar/core/locales/en-gb';
import {
  Alert,
  Box,
  Card,
  CardContent,
  LinearProgress,
  Stack,
  ToggleButton,
  ToggleButtonGroup,
  Typography,
} from '@mui/material';
import { useTranslation } from 'react-i18next';
import { CalendarViewType, CALENDAR_VIEW_STORAGE_KEY, getStoredCalendarView, useCalendarEvents } from './hooks';
import '@fullcalendar/core/index.css';
import '@fullcalendar/daygrid/index.css';
import '@fullcalendar/timegrid/index.css';
import '@fullcalendar/list/index.css';

const localeMap: Record<string, string> = {
  uzUZ: 'uz',
  ruRU: 'ru',
  enUS: 'en-gb',
};

const CalendarPage = () => {
  const { t, i18n } = useTranslation();
  const { events, isLoading, error } = useCalendarEvents();
  const [view, setView] = useState<CalendarViewType>(() => getStoredCalendarView());
  const calendarRef = useRef<FullCalendar | null>(null);

  const locale = useMemo(() => localeMap[i18n.language] || 'en-gb', [i18n.language]);

  useEffect(() => {
    localStorage.setItem(CALENDAR_VIEW_STORAGE_KEY, view);
    const api = calendarRef.current?.getApi();
    api?.changeView(view);
  }, [view]);

  useEffect(() => {
    const api = calendarRef.current?.getApi();
    if (api) {
      api.setOption('locale', locale);
    }
  }, [locale]);

  const headerToolbar = useMemo(
    () => ({
      start: 'prev,next today',
      center: 'title',
      end: 'dayGridMonth,timeGridWeek,timeGridDay,listMonth',
    }),
    [],
  );

  return (
    <Box sx={{ p: { xs: 3, md: 5 } }}>
      <Stack spacing={1.5} sx={{ mb: 3 }}>
        <Typography variant="h4" fontWeight={700} component="h1">
          {t('calendar.title')}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {t('calendar.subtitle')}
        </Typography>
      </Stack>

      <Card>
        {isLoading && <LinearProgress />}
        <CardContent sx={{ p: { xs: 2, sm: 3 } }}>
          <Stack
            direction={{ xs: 'column', sm: 'row' }}
            justifyContent="space-between"
            alignItems={{ xs: 'flex-start', sm: 'center' }}
            spacing={2}
            sx={{ mb: 2 }}
          >
            <Box>
              <Typography variant="h6" fontWeight={600} component="h2">
                {t('calendar.eventsTitle')}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {t('calendar.viewHelper')}
              </Typography>
            </Box>

            <ToggleButtonGroup
              exclusive
              size="small"
              color="primary"
              value={view}
              onChange={(_, nextView: CalendarViewType | null) => nextView && setView(nextView)}
            >
              <ToggleButton value="dayGridMonth">{t('calendar.monthView')}</ToggleButton>
              <ToggleButton value="timeGridWeek">{t('calendar.weekView')}</ToggleButton>
              <ToggleButton value="timeGridDay">{t('calendar.dayView')}</ToggleButton>
              <ToggleButton value="listMonth">{t('calendar.listView')}</ToggleButton>
            </ToggleButtonGroup>
          </Stack>

          {error ? (
            <Alert severity="error">{t('calendar.loadError')}</Alert>
          ) : (
            <FullCalendar
              ref={calendarRef}
              plugins={[dayGridPlugin, timeGridPlugin, listPlugin, interactionPlugin]}
              headerToolbar={headerToolbar}
              locales={[uzLocale, ruLocale, enLocale]}
              locale={locale}
              initialView={view}
              events={events}
              weekends
              editable={false}
              selectable={false}
              dayMaxEvents={2}
              navLinks
              height="auto"
              datesSet={(dateInfo) => setView(dateInfo.view.type as CalendarViewType)}
            />
          )}
        </CardContent>
      </Card>
    </Box>
  );
};

export default CalendarPage;

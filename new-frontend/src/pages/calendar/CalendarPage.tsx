import { useMemo, useState } from 'react';
import FullCalendar from '@fullcalendar/react';
import type { CalendarOptions, DatesSetArg, EventInput } from '@fullcalendar/core';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';
import listPlugin from '@fullcalendar/list';
import timeGridPlugin from '@fullcalendar/timegrid';
import ruLocale from '@fullcalendar/core/locales/ru';
import uzLocale from '@fullcalendar/core/locales/uz';
import {
  Box,
  Card,
  CardContent,
  Checkbox,
  FormControlLabel,
  LinearProgress,
  Stack,
  Typography,
  useTheme,
} from '@mui/material';
import { useTranslation } from 'react-i18next';
import useSWR from 'swr';
import { useSettingsContext } from 'app/providers/SettingsProvider';
import axiosFetcher from 'shared/services/axios/axiosFetcher';

type CalendarView = 'dayGridMonth' | 'timeGridWeek' | 'timeGridDay' | 'listMonth';

const CALENDAR_VIEW_STORAGE_KEY = 'calendarViewType';
const DEFAULT_VIEW: CalendarView = 'listMonth';

enum CalendarEventType {
  CONTEST = 1,
  ARENA = 2,
  TOURNAMENT = 3,
  HOLIDAY = 4,
}

interface CalendarEvent {
  id?: number;
  uid: number;
  type: CalendarEventType;
  title?: string | null;
  startTime?: string | null;
  finishTime?: string | null;
}

type EventMeta = {
  labelKey: string;
  color: 'primary' | 'warning' | 'secondary' | 'success';
  buildUrl?: (uid: number) => string;
};

const EVENT_META: Record<CalendarEventType, EventMeta> = {
  [CalendarEventType.CONTEST]: {
    labelKey: 'calendarPage.filters.contests',
    color: 'primary',
    buildUrl: (uid) => `/competitions/contests/contest/${uid}`,
  },
  [CalendarEventType.ARENA]: {
    labelKey: 'calendarPage.filters.arenas',
    color: 'warning',
    buildUrl: (uid) => `/competitions/arena/tournament/${uid}`,
  },
  [CalendarEventType.TOURNAMENT]: {
    labelKey: 'calendarPage.filters.tournaments',
    color: 'secondary',
    buildUrl: (uid) => `/competitions/tournaments/tournament/${uid}`,
  },
  [CalendarEventType.HOLIDAY]: {
    labelKey: 'calendarPage.filters.holidays',
    color: 'success',
  },
};

const getInitialView = (): CalendarView => {
  if (typeof window === 'undefined') return DEFAULT_VIEW;
  const storedView = localStorage.getItem(CALENDAR_VIEW_STORAGE_KEY) as CalendarView | null;
  return storedView ?? DEFAULT_VIEW;
};

const CalendarPage = () => {
  const theme = useTheme();
  const { t } = useTranslation();
  const {
    config: { locale },
  } = useSettingsContext();

  const [typeVisibility, setTypeVisibility] = useState<Record<CalendarEventType, boolean>>({
    [CalendarEventType.CONTEST]: true,
    [CalendarEventType.ARENA]: true,
    [CalendarEventType.TOURNAMENT]: true,
    [CalendarEventType.HOLIDAY]: true,
  });
  const [currentView, setCurrentView] = useState<CalendarView>(getInitialView);

  const { data: events = [], isValidating } = useSWR<CalendarEvent[]>(
    ['/api/calendar-events/', { method: 'get' }],
    axiosFetcher,
  );

  const calendarLocale = useMemo(() => {
    switch (locale) {
      case 'ru-RU':
        return 'ru';
      case 'uz-UZ':
        return 'uz';
      default:
        return 'en';
    }
  }, [locale]);

  const toggleTypeVisibility = (type: CalendarEventType) => () => {
    setTypeVisibility((prev) => ({
      ...prev,
      [type]: !prev[type],
    }));
  };

  const calendarEvents = useMemo<EventInput[]>(() => {
    return events
      .filter((event) => Boolean(event.startTime))
      .map((event) => {
        const meta = EVENT_META[event.type];
        const paletteColor = theme.palette[meta.color];
        const color = paletteColor?.main ?? theme.palette.primary.main;

        return {
          id: String(event.id ?? event.uid),
          title: event.title || t('calendarPage.untitled'),
          start: event.startTime ? new Date(event.startTime) : undefined,
          end: event.finishTime ? new Date(event.finishTime) : undefined,
          url: meta.buildUrl?.(event.uid),
          backgroundColor: color,
          borderColor: color,
          textColor: paletteColor ? theme.palette.getContrastText(color) : undefined,
          extendedProps: {
            type: event.type,
          },
        } satisfies EventInput;
      });
  }, [events, theme.palette, t]);

  const filteredEvents = useMemo(() => {
    return calendarEvents.filter((event) => {
      const type = (event.extendedProps as { type?: CalendarEventType })?.type;
      if (!type) return true;
      return typeVisibility[type];
    });
  }, [calendarEvents, typeVisibility]);

  const handleDatesSet = (dateInfo: DatesSetArg) => {
    const viewType = dateInfo.view.type as CalendarView;
    setCurrentView(viewType);
    localStorage.setItem(CALENDAR_VIEW_STORAGE_KEY, viewType);
  };

  const options: CalendarOptions = {
    plugins: [dayGridPlugin, timeGridPlugin, listPlugin, interactionPlugin],
    headerToolbar: {
      start: 'prev,next today',
      center: 'title',
      end: 'dayGridMonth,timeGridWeek,timeGridDay,listMonth',
    },
    initialView: currentView,
    locale: calendarLocale,
    locales: [ruLocale, uzLocale],
    weekends: true,
    editable: false,
    selectable: false,
    dayMaxEvents: 2,
    navLinks: true,
    height: 'auto',
    events: filteredEvents,
    datesSet: handleDatesSet,
    buttonText: {
      today: t('calendarPage.today'),
      month: t('calendarPage.month'),
      week: t('calendarPage.week'),
      day: t('calendarPage.day'),
      list: t('calendarPage.list'),
    },
    eventTimeFormat: { hour: '2-digit', minute: '2-digit', hour12: false },
    noEventsContent: t('calendarPage.noEvents'),
  };

  return (
    <Box sx={{ p: { xs: 3, md: 5 } }}>
      <Stack spacing={3}>
        <Stack spacing={0.5}>
          <Typography variant="h4" fontWeight={700}>
            {t('calendarPage.title')}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {t('calendarPage.subtitle')}
          </Typography>
        </Stack>

        <Card>
          <CardContent>
            <Stack direction="row" spacing={2} flexWrap="wrap" useFlexGap>
              {Object.entries(EVENT_META).map(([typeKey, meta]) => {
                const type = Number(typeKey) as CalendarEventType;
                const paletteColor = theme.palette[meta.color];
                const color = paletteColor?.main ?? theme.palette.primary.main;

                return (
                  <FormControlLabel
                    key={typeKey}
                    control={
                      <Checkbox
                        color={meta.color}
                        checked={typeVisibility[type]}
                        onChange={toggleTypeVisibility(type)}
                        sx={{
                          color,
                          '&.Mui-checked': {
                            color,
                          },
                        }}
                      />
                    }
                    label={
                      <Typography variant="body2" fontWeight={600} color={color}>
                        {t(meta.labelKey)}
                      </Typography>
                    }
                  />
                );
              })}
            </Stack>
          </CardContent>
        </Card>

        <Card sx={{ overflow: 'hidden' }}>
          {isValidating && <LinearProgress />}
          <CardContent sx={{ p: { xs: 1, sm: 2 }, '& .fc': { '--fc-border-color': theme.palette.divider } }}>
            <FullCalendar {...options} />
          </CardContent>
        </Card>
      </Stack>
    </Box>
  );
};

export default CalendarPage;

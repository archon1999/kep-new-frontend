import { useMemo } from 'react';
import { EventInput } from '@fullcalendar/core';
import useSWR from 'swr';
import { apiClient } from 'shared/api';
import {
  CalendarEvent,
  CalendarEventType,
  ApiCalendarEventsListResult,
} from 'shared/api/orval/generated/endpoints';

export const CALENDAR_VIEW_STORAGE_KEY = 'calendarViewType';
export type CalendarViewType = 'dayGridMonth' | 'timeGridWeek' | 'timeGridDay' | 'listMonth';
const CALENDAR_EVENTS_KEY = 'calendar-events';

enum CalendarEventTypeEnum {
  CONTEST = CalendarEventType.NUMBER_1,
  ARENA = CalendarEventType.NUMBER_2,
  TOURNAMENT = CalendarEventType.NUMBER_3,
  HOLIDAY = CalendarEventType.NUMBER_4,
}

const getEventUrl = (event: CalendarEvent) => {
  switch (event.type) {
    case CalendarEventTypeEnum.CONTEST:
      return `/competitions/contests/contest/${event.uid}`;
    case CalendarEventTypeEnum.ARENA:
      return `/competitions/arena/tournament/${event.uid}`;
    case CalendarEventTypeEnum.TOURNAMENT:
      return `/competitions/tournaments/tournament/${event.uid}`;
    case CalendarEventTypeEnum.HOLIDAY:
    default:
      return undefined;
  }
};

const mapCalendarEvent = (event: CalendarEvent): EventInput => ({
  id: event.id?.toString() ?? event.uid.toString(),
  title: event.title ?? '',
  start: event.startTime ? new Date(event.startTime) : undefined,
  end: event.finishTime ? new Date(event.finishTime) : undefined,
  url: getEventUrl(event),
  display: 'auto',
});

export const useCalendarEvents = () => {
  const { data, isLoading, error } = useSWR<ApiCalendarEventsListResult>([CALENDAR_EVENTS_KEY], () =>
    apiClient.apiCalendarEventsList(),
  );

  const events = useMemo(() => data?.map(mapCalendarEvent) ?? [], [data]);

  return { events, isLoading, error };
};

export const getStoredCalendarView = (): CalendarViewType => {
  const storedView = localStorage.getItem(CALENDAR_VIEW_STORAGE_KEY) as CalendarViewType | null;
  return storedView ?? 'listMonth';
};

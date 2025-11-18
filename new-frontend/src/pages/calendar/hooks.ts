import { apiClient } from 'shared/api';
import type { ApiCalendarEventsListResult, CalendarEvent, CalendarEventType } from 'shared/api/orval/generated/endpoints';
import useSWR from 'swr';

const getEventUrl = (event: CalendarEvent) => {
  switch (event.type as CalendarEventType) {
    case 1:
      return `/competitions/contests/contest/${event.uid}`;
    case 2:
      return `/competitions/arena/tournament/${event.uid}`;
    case 3:
      return `/competitions/tournaments/tournament/${event.uid}`;
    default:
      return undefined;
  }
};

export const useCalendarEvents = () => {
  const { data, error, isLoading } = useSWR<ApiCalendarEventsListResult>(
    ['calendar-events'],
    () => apiClient.apiCalendarEventsList(),
  );

  const events = (data || []).map((event) => ({
    id: event.id ?? event.uid,
    title: event.title || '',
    start: event.startTime ? new Date(event.startTime) : undefined,
    end: event.finishTime ? new Date(event.finishTime) : undefined,
    url: getEventUrl(event),
    extendedProps: {
      type: event.type,
    },
  }));

  return { events, isLoading, error } as const;
};

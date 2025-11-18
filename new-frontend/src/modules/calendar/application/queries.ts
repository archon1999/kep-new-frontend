import useSWR from 'swr';
import { HttpCalendarRepository } from '../data-access/repository/http.calendar.repository';
import { CalendarEventEntity } from '../domain/entities/calendar-event.entity';

const repository = new HttpCalendarRepository();

export const useCalendarEvents = () =>
  useSWR<CalendarEventEntity[]>(['calendar-events'], () => repository.getEvents(), {
    suspense: false,
  });

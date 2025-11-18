import dayjs from 'dayjs';
import { CalendarEvent as ApiCalendarEvent } from 'shared/api/orval/generated/endpoints/index.schemas';
import { CalendarEventEntity } from '../../domain/entities/calendar-event.entity';

const normalizeDate = (value?: string | null): string | null => {
  if (!value || typeof value !== 'string') {
    return null;
  }

  const parsed = dayjs(value);

  if (!parsed.isValid()) {
    return null;
  }

  return value;
};

export const mapApiCalendarEventToDomain = (event: ApiCalendarEvent): CalendarEventEntity => ({
  id: typeof event.id === 'number' ? event.id : event.uid,
  uid: event.uid,
  type: event.type,
  title: event.title ?? '',
  startTime: normalizeDate(event.startTime),
  finishTime: normalizeDate(event.finishTime),
});

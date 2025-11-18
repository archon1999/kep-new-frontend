import { CalendarEvent } from 'shared/api/orval/generated/endpoints';
import { CalendarEventEntity } from '../../domain/entities/calendar-event.entity';

export const mapCalendarEventDtoToDomain = (event: CalendarEvent): CalendarEventEntity => ({
  id: event.id,
  uid: event.uid,
  type: event.type,
  title: event.title,
  startTime: event.startTime ?? null,
  finishTime: event.finishTime ?? null,
});

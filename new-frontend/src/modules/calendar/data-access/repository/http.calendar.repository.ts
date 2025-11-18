import { CalendarRepository } from '../../domain/ports/calendar.repository';
import { CalendarEventEntity } from '../../domain/entities/calendar-event.entity';
import { calendarApiClient } from '../api/calendar.client';
import { mapCalendarEventDtoToDomain } from '../mappers/calendar-event.mapper';

export class HttpCalendarRepository implements CalendarRepository {
  async getEvents(): Promise<CalendarEventEntity[]> {
    const events = await calendarApiClient.listEvents();

    return (events ?? []).map(mapCalendarEventDtoToDomain);
  }
}

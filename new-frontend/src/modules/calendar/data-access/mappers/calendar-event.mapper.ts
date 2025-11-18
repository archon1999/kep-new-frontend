import { CalendarEvent as ApiCalendarEvent } from 'shared/api/orval/generated/endpoints/index.schemas';
import { CalendarEventEntity, CalendarEventType } from '../../domain/entities/calendar-event.entity';

const buildEventUrl = (type: CalendarEventType, uid: number) => {
  switch (type) {
    case CalendarEventType.CONTEST:
      return `/competitions/contests/contest/${uid}`;
    case CalendarEventType.ARENA:
      return `/competitions/arena/tournament/${uid}`;
    case CalendarEventType.TOURNAMENT:
      return `/competitions/tournaments/tournament/${uid}`;
    default:
      return undefined;
  }
};

export const mapApiCalendarEventToDomain = (event: ApiCalendarEvent): CalendarEventEntity => {
  const type = Number(event.type) as CalendarEventType;

  return {
    uid: event.uid,
    type,
    title: event.title ?? '',
    startTime: event.startTime ?? null,
    finishTime: event.finishTime ?? null,
    url: buildEventUrl(type, event.uid),
  };
};

import { CalendarEventType } from 'shared/api/orval/generated/endpoints';

export interface CalendarEventEntity {
  id?: number;
  uid: number;
  type: CalendarEventType;
  title?: string;
  startTime?: string | null;
  finishTime?: string | null;
}

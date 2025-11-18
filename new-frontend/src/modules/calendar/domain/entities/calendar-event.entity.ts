import { CalendarEventType } from 'shared/api/orval/generated/endpoints/index.schemas';

export type CalendarEventTypeValue = (typeof CalendarEventType)[keyof typeof CalendarEventType];

export interface CalendarEventEntity {
  id: number;
  uid: number;
  type: CalendarEventTypeValue;
  title: string;
  startTime: string | null;
  finishTime: string | null;
}

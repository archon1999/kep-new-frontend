export enum CalendarEventType {
  CONTEST = 1,
  ARENA = 2,
  TOURNAMENT = 3,
  HOLIDAY = 4,
}

export interface CalendarEventEntity {
  uid: number;
  type: CalendarEventType;
  title: string;
  startTime?: string | null;
  finishTime?: string | null;
  url?: string;
}

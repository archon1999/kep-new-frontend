import FullCalendar from '@fullcalendar/react';

// Wrap FullCalendar to avoid calling destroy when the calendar instance wasn't created yet
// (e.g., if mounting failed before initialization).
class SafeFullCalendar extends FullCalendar {
  componentWillUnmount(): void {
    this.isUnmounting = true;
    this.cancelResize?.();
    this.calendar?.destroy();
  }
}

export default SafeFullCalendar;

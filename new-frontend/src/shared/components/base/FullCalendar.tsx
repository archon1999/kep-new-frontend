import { CalendarOptions } from '@fullcalendar/core';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';
import listPlugin from '@fullcalendar/list';
import ReactFullCalendar from '@fullcalendar/react';
import timeGridPlugin from '@fullcalendar/timegrid';
import { useTheme } from '@mui/material';

interface FullCalendarProps extends CalendarOptions {
  calendarRef?: React.Ref<ReactFullCalendar>;
}

const FullCalendar = ({ calendarRef, ...rest }: FullCalendarProps) => {
  const { direction } = useTheme();

  return (
    <ReactFullCalendar
      ref={calendarRef}
      plugins={[dayGridPlugin, timeGridPlugin, listPlugin, interactionPlugin]}
      initialView="listMonth"
      direction={direction === 'rtl' ? 'rtl' : 'ltr'}
      headerToolbar={{
        start: 'prev,next today',
        center: 'title',
        end: 'dayGridMonth,timeGridWeek,timeGridDay,listMonth',
      }}
      height="auto"
      navLinks
      dayMaxEvents={2}
      {...rest}
    />
  );
};

export default FullCalendar;

import { Ref } from 'react';
import { CalendarOptions } from '@fullcalendar/core/index.js';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';
import ReactFullCalendar from '@fullcalendar/react';
import timeGridPlugin from '@fullcalendar/timegrid';
import { useTheme } from '@mui/material';

interface FullCalendarOptions extends CalendarOptions {
  ref?: Ref<ReactFullCalendar>;
}

const FullCalendar = ({ ref, ...rest }: FullCalendarOptions) => {
  const { direction } = useTheme();

  return (
    <ReactFullCalendar
      ref={ref}
      plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
      initialView="dayGridMonth"
      direction={direction === 'rtl' ? 'rtl' : 'ltr'}
      headerToolbar={false}
      selectable
      eventDisplay="block"
      fixedWeekCount={false}
      dayMaxEventRows={2}
      editable={false}
      eventTimeFormat={{
        hour: '2-digit',
        minute: '2-digit',
        hour12: false,
      }}
      slotDuration="00:30:00"
      slotLabelInterval="01:00:00"
      {...rest}
    />
  );
};

export default FullCalendar;

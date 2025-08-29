import { Calendar } from '@fullcalendar/core'
import dayGridPlugin from '@fullcalendar/daygrid'
import esLocale from '@fullcalendar/core/locales/es'
import "./calendar.css"

export function renderCalendarWidget() {
  const calendarEl = document.getElementById('calendar')

  const calendar = new Calendar(calendarEl, {
    plugins: [dayGridPlugin],
    initialView: 'dayGridMonth',
    locale: esLocale,
    headerToolbar: {
      left: 'prev,next',
      center: 'title',
      right: ''
    },
    height: 'auto',
    contentHeight: 300,
    aspectRatio: 1.5,

    // 📅 Cuando haces click en un día
  
  });

  calendar.render();
}

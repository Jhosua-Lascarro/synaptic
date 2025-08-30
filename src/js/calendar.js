import { Calendar } from "@fullcalendar/core";
import dayGridPlugin from "@fullcalendar/daygrid";
import esLocale from "@fullcalendar/core/locales/es";
import interactionPlugin from "@fullcalendar/interaction"; // 🔥 necesario para dateClick
import "./calendar.css";

export function renderCalendarWidget() {
  const calendarEl = document.getElementById("calendar");

  const calendar = new Calendar(calendarEl, {
    plugins: [dayGridPlugin, interactionPlugin],
    initialView: "dayGridMonth",
    locale: esLocale,
    headerToolbar: {
      left: "prev,next",
      center: "title",
      right: "",
    },
    height: "auto",
    contentHeight: 300,
    aspectRatio: 1.5,

    dateClick: async function (info) {
      const fechaSeleccionada = info.dateStr;
      console.log(fechaSeleccionada);
    },
  });

  calendar.render();
}

import { Calendar } from "@fullcalendar/core";
import dayGridPlugin from "@fullcalendar/daygrid";
import esLocale from "@fullcalendar/core/locales/es";
import interactionPlugin from "@fullcalendar/interaction"; 
import "./calendar.css";
import { getDateAppointmetns } from "@/auth/calendarApi";

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

      const citas = await getDateAppointmetns(fechaSeleccionada);
      console.log(citas);

      loadCitas(citas); 
    },
  });

  calendar.render();
}

async function loadCitas(citas) {
  const content = document.getElementById("content-citas");
  content.innerHTML = ""; 

  

  if (!Array.isArray(citas)) {
    console.warn("Las citas no son un array, convirtiendo...");
    citas = Object.values(citas);
    const cita =citas.flat()
   
  }
   if (cita.length === 0) {
    content.innerHTML = `<p>No hay citas para esta fecha.</p>`;
    return;
  }

 
  citas.forEach((cita) => {
    content.innerHTML += renderCita(cita);
  });
}

function renderCita(cita) {
  const nombre =cita.patiens.users.fullname
  const fechaNacimiento =cita.patiens.users.birthdate
  return `
    <div class="flex-1 p-0.5">
      <div class="bg-white rounded-lg border border-gray-200 p-6">
        <h2 class="text-lg font-semibold text-gray-800 mb-4">
          Appointment
        </h2>

        <div class="space-y-4">
          <div class="bg-gray-50 rounded-lg p-4 flex justify-between items-start">
            <div>
              <h3 class="font-medium text-gray-800"> Consulta:
                ${cita.reason }
              </h3>
              <p class="text-sm text-gray-600 mt-1">Paciente: ${nombre }</p>
              <p class="text-sm text-gray-600">Años: ${calcularEdad(fechaNacimiento)}</p>
            </div>
            <span class="text-sm font-medium text-gray-700">${cita.appointment_date}</span>
          </div>
        </div>
      </div>
    </div>
  `;
}


function calcularEdad(fechaNacimiento) {
  const hoy = new Date();
  const nacimiento = new Date(fechaNacimiento);

  let edad = hoy.getFullYear() - nacimiento.getFullYear();
  const mes = hoy.getMonth() - nacimiento.getMonth();

  // Si aún no ha cumplido años este mes, restamos 1
  if (mes < 0 || (mes === 0 && hoy.getDate() < nacimiento.getDate())) {
    edad--;
  }

  return edad;
  
}



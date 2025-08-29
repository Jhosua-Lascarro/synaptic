import { redirecto } from "../../router";
import { renderCalendarWidget } from "./calendar";

export function setupDashboard() {
  setTimeout(() => {
    setupOutButtonDoctor();
    renderCalendarWidget();
    loadCitas();
    infoUserDoctor();
  }, 0);
}
async function loadCitas() {
  const content = document.getElementById("content-page");
  try {
    const res = await fetch("http://localhost:3000/appointments");
    const data = await res.json();

    data.forEach((cita) => {
      content.innerHTML += render(cita);
      console.log(cita);
    });
  } catch (error) {
    console.error("no se pudo traer los datos", error);
  }
}

function render(cita) {
  return `
        <div class="flex-1 p-6">
        <!-- Header -->

        <!-- Today's Appointments -->
        <div class="bg-white rounded-lg border border-gray-200 p-6">
          <h2 class="text-lg font-semibold text-gray-800 mb-4">
            Today's Appointments
          </h2>

          <div class="space-y-4">
            <!-- Appointment 1 -->
            <div
              class="bg-gray-50 rounded-lg p-4 flex justify-between items-start"
            >
              <div>
                <h3 class="font-medium text-gray-800">
                  Dr. Smith - Consultation
                </h3>
                <p class="text-sm text-gray-600 mt-1">Patient: John Doe</p>
                <p class="text-sm text-gray-600">Room: 101</p>
              </div>
              <span class="text-sm font-medium text-gray-700">09:00 AM</span>
            </div>

            <!-- Appointment 2 -->
          </div>
        </div>
      </div>


  `;
}

export function setupOutButtonDoctor() {
  setTimeout(() => {
    const logout = document.getElementById("exit");
    if (logout) {
      logout.addEventListener("click", (e) => {
        e.preventDefault();
        localStorage.removeItem("current");
        redirecto("/");
      });
    } else {
      console.error("Element with id 'exit' not found");
    }
  }, 0);
}


function infoUserDoctor() {
  const contentLetter = document.getElementById("firsletter");
  const user = JSON.parse(localStorage.getItem("current"));
  const firsLetter = user.fullname[0].toUpperCase();

  const contentInfo = document.getElementById("info-user");
  contentLetter.innerHTML = ` <p class="text-white text-lg  " >${firsLetter}</p>`;

  contentInfo.innerHTML = ` <div class="flex items-center text-gray-600">
            <svg class="w-4 h-4 mr-3" fill="currentColor" viewBox="0 0 20 20">
              <path
                fill-rule="evenodd"
                d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"
                clip-rule="evenodd"
              ></path>
            </svg>
            <span id="name" >${user.fullname}</span>
          </div>
          <div class="flex items-center text-gray-600">
            <svg class="w-4 h-4 mr-3" fill="currentColor" viewBox="0 0 20 20">
              <path
                d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z"
              ></path>
              <path
                d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z"
              ></path>
            </svg>
            <span id="email" >${user.email}</span>
          </div>
          <div class="flex items-center text-gray-600">
            <svg class="w-4 h-4 mr-3" fill="currentColor" viewBox="0 0 20 20">
              <path
                d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z"
              ></path>
            </svg>
            <span id="identification">${user.identification}</span>
          </div> `;
}

import { redirecto } from "../../router";
import { renderCalendarWidget } from "./calendar";

export function setupDashboard() {
  setTimeout(() => {
    setupOutButton();
    renderCalendarWidget();
    loadCitas();
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

function render() {
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

export function setupOutButton() {
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

import { redirecto } from "../router";
import { renderCalendarWidget } from "./calendar";

// Function to setup the doctor's dashboard
export function setupDashboardDoctor() {
  setTimeout(() => {
    infoUserDoctor();
    setupOutButtonDoctor();
    renderCalendarWidget();
  }, 100);
}

// Function to setup the logout button for doctor
export function setupOutButtonDoctor() {
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
}

// Function to display doctor's user info
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
            <svg class="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
               <path d="M20 4H4a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V6a2 2 0 0 0-2-2zm0 14H4V6h16v12z"/>
                  <circle cx="8" cy="12" r="2"/>
                <path d="M12 10h6v2h-6zM12 14h6v2h-6z"/>
            </svg>
            <span id="identification">${user.identification}</span>
          </div> `;
}

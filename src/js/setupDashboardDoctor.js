import { redirecto } from "../../router";
import { renderCalendarWidget } from "./calendar";

export function setupDashboardDoctor() {
  setTimeout(() => {
     infoUserDoctor();
    setupOutButtonDoctor();
    renderCalendarWidget();
    

  
   
  }, 100);
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
